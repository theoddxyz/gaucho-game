// --- Infinite world via streaming chunks ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const CHUNK_SIZE    = 200;
const LOAD_RADIUS          = 2;
const UNLOAD_DIST          = 3;
const TREES_PER_CHUNK      = 10;
const ROCKS_PER_CHUNK      = 14;  // more rocks
const PEBBLES_PER_CHUNK    = 40;  // new: small flat pebbles

const loader = new GLTFLoader();
let treeTemplate = null;
let rockTemplate = null;

// ─── Procedural terrain texture ───────────────────────────────────────────────
// Blends three colors using FBM noise:
//   wet  #4a310a  → darker, damp patches
//   base #cca465  → main sandy colour
//   dry  #ebd0a0  → lighter, bleached patches
function _makeTerrainTexture() {
  const SIZE = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(SIZE, SIZE);
  const d   = img.data;

  // Color stops (raw 0-255)
  const WET  = [0x4a, 0x31, 0x0a];
  const BASE = [0xcc, 0xa4, 0x65];
  const DRY  = [0xeb, 0xd0, 0xa0];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  // Hash-based value noise
  function hash(ix, iy) {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function vnoise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const ux = smoothstep(x - ix), uy = smoothstep(y - iy);
    return lerp(
      lerp(hash(ix, iy),   hash(ix + 1, iy),   ux),
      lerp(hash(ix, iy+1), hash(ix + 1, iy+1), ux),
      uy
    );
  }
  // Fractional Brownian Motion (5 octaves)
  function fbm(x, y) {
    let v = 0, a = 0.55, f = 1;
    for (let o = 0; o < 5; o++) {
      v += vnoise(x * f, y * f) * a;
      a *= 0.5; f *= 2.07;
    }
    return v;
  }

  for (let py = 0; py < SIZE; py++) {
    for (let px = 0; px < SIZE; px++) {
      // Two noise layers: large patches + fine grit
      const n1 = fbm(px / 90, py / 90);             // large scale
      const n2 = fbm(px / 18 + 7.3, py / 18 + 3.9); // fine grain
      const n  = n1 * 0.72 + n2 * 0.28;

      let r, g, b;
      if (n < 0.36) {
        const t = n / 0.36;
        r = lerp(WET[0],  BASE[0], t);
        g = lerp(WET[1],  BASE[1], t);
        b = lerp(WET[2],  BASE[2], t);
      } else {
        const t = (n - 0.36) / 0.64;
        r = lerp(BASE[0], DRY[0], t);
        g = lerp(BASE[1], DRY[1], t);
        b = lerp(BASE[2], DRY[2], t);
      }

      const i = (py * SIZE + px) * 4;
      d[i]   = r | 0;
      d[i+1] = g | 0;
      d[i+2] = b | 0;
      d[i+3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  // 8 tiles per chunk (200 / 8 = 25 world-unit tiles).
  // Integer repeat → seams align perfectly across chunk borders.
  tex.repeat.set(8, 8);
  return tex;
}

const TERRAIN_MAT = new THREE.MeshStandardMaterial({
  map: _makeTerrainTexture(),
  roughness: 0.92,
});

// ─── Shared pebble geometry + material palette ────────────────────────────────
// Slightly varied earth tones close to #cca465
const PEBBLE_GEOS = [
  new THREE.SphereGeometry(0.15, 6, 4),
  new THREE.SphereGeometry(0.24, 6, 4),
  new THREE.SphereGeometry(0.34, 7, 4),
  new THREE.SphereGeometry(0.44, 7, 5),
];
const PEBBLE_MATS = [
  new THREE.MeshStandardMaterial({ color: 0xcaa050, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xb88c40, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xd8bc70, roughness: 0.93 }),
  new THREE.MeshStandardMaterial({ color: 0xa07840, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xc09858, roughness: 0.95 }),
  new THREE.MeshStandardMaterial({ color: 0xe2c888, roughness: 0.90 }),
];

// ─── Template loading ─────────────────────────────────────────────────────────
let _tplPromise = null;
function loadTemplates() {
  if (_tplPromise) return _tplPromise;
  const load = (url, setter) => new Promise(r => loader.load(url, g => { setter(g.scene); r(); }, null, r));
  _tplPromise = Promise.all([
    load('/models/tree.glb', s => { treeTemplate = s; }),
    load('/models/rock.glb', s => { rockTemplate = s; }),
  ]);
  return _tplPromise;
}

// Deterministic seeded RNG — same coords → same layout always
function makeRng(cx, cz) {
  let s = (Math.abs((cx * 73856093) ^ (cz * 19349663) ^ (cx * cz * 1664525)) || 1) >>> 0;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

// ─── ChunkManager ─────────────────────────────────────────────────────────────
export class ChunkManager {
  constructor(scene, colliders) {
    this.scene     = scene;
    this.colliders = colliders;
    this.chunks    = new Map();
    this._pending  = new Set();

    loadTemplates().then(() => {
      for (const key of this._pending) {
        const [cx, cz] = key.split(',').map(Number);
        this._build(cx, cz);
      }
      this._pending.clear();
    });
  }

  update(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK_SIZE);
    const cz = Math.floor(playerPos.z / CHUNK_SIZE);

    for (let dx = -LOAD_RADIUS; dx <= LOAD_RADIUS; dx++)
      for (let dz = -LOAD_RADIUS; dz <= LOAD_RADIUS; dz++)
        this._request(cx + dx, cz + dz);

    for (const key of this.chunks.keys()) {
      const [kcx, kcz] = key.split(',').map(Number);
      if (Math.abs(kcx - cx) > UNLOAD_DIST || Math.abs(kcz - cz) > UNLOAD_DIST)
        this._unload(key);
    }
  }

  _request(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key) || this._pending.has(key)) return;
    this._pending.add(key);
    if (treeTemplate !== null) setTimeout(() => this._build(cx, cz), 0);
  }

  _build(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) { this._pending.delete(key); return; }

    const rng = makeRng(cx, cz);
    const ox  = cx * CHUNK_SIZE + CHUNK_SIZE / 2;
    const oz  = cz * CHUNK_SIZE + CHUNK_SIZE / 2;
    const objects = [];
    const ownColliders = [];

    // ── Ground ───────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 4, 4),
      TERRAIN_MAT
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(ox, 0, oz);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // ── Trees ─────────────────────────────────────────────────────────────────
    if (treeTemplate) {
      for (let i = 0; i < TREES_PER_CHUNK; i++) {
        const tx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const tz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const t  = treeTemplate.clone(true);
        const s  = 0.35 + rng() * 0.15;
        t.position.set(tx, 0, tz);
        t.scale.setScalar(s);
        t.rotation.y = rng() * Math.PI * 2;
        t.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.scene.add(t);
        objects.push(t);
        ownColliders.push({ x: tx, z: tz, sx: 1, sy: 5, sz: 1 });
      }
    }

    // ── Rocks (medium–large) ──────────────────────────────────────────────────
    if (rockTemplate) {
      for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
        const rx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const rz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const r  = rockTemplate.clone(true);
        const rs = 0.5 + rng() * 1.0;
        const rh = 0.35 + rng() * 0.55;
        r.position.set(rx, 0, rz);
        r.scale.set(rs, rs * rh, rs * (0.8 + rng() * 0.4));
        r.rotation.y = rng() * Math.PI * 2;
        r.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.scene.add(r);
        objects.push(r);
        ownColliders.push({ x: rx, z: rz, sx: rs * 1.6, sy: 2, sz: rs * 1.6 });
      }
    }

    // ── Pebbles (small flat stones, no colliders) ─────────────────────────────
    for (let i = 0; i < PEBBLES_PER_CHUNK; i++) {
      const px  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const pz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const geo = PEBBLE_GEOS[Math.floor(rng() * PEBBLE_GEOS.length)];
      const pm  = PEBBLE_MATS[Math.floor(rng() * PEBBLE_MATS.length)];
      const p   = new THREE.Mesh(geo, pm);
      const sxz = 0.6 + rng() * 1.1;         // horizontal scale variety
      const sy  = 0.28 + rng() * 0.22;        // very flat
      // half-embed in ground so pebble sits naturally
      p.position.set(px, geo.parameters.radius * sy * 0.45, pz);
      p.scale.set(sxz, sy, sxz * (0.7 + rng() * 0.6));
      p.rotation.y = rng() * Math.PI * 2;
      p.receiveShadow = true;
      p.castShadow    = true;
      this.scene.add(p);
      objects.push(p);
    }

    ownColliders.forEach(c => this.colliders.push(c));
    this.chunks.set(key, { ground, objects, ownColliders });
    this._pending.delete(key);
  }

  _unload(key) {
    const chunk = this.chunks.get(key);
    if (!chunk) return;
    this.scene.remove(chunk.ground);
    chunk.ground.geometry.dispose();
    for (const obj of chunk.objects) this.scene.remove(obj);
    for (const c of chunk.ownColliders) {
      const idx = this.colliders.indexOf(c);
      if (idx >= 0) this.colliders.splice(idx, 1);
    }
    this.chunks.delete(key);
  }
}
