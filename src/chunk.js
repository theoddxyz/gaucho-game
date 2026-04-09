// --- Infinite world via streaming chunks ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { WATER_ZONES } from './landmarks.js';

function _inWater(x, z) {
  for (const w of WATER_ZONES) {
    if (w.box) {
      if (x >= w.box.min.x && x <= w.box.max.x && z >= w.box.min.z && z <= w.box.max.z) return true;
    } else {
      const dx = x - w.x, dz = z - w.z;
      if (dx * dx + dz * dz < w.r * w.r) return true;
    }
  }
  return false;
}

export const CHUNK_SIZE    = 200;
const LOAD_RADIUS          = 2;
const UNLOAD_DIST          = 3;
const TREES_PER_CHUNK      = 6;
const ROCKS_PER_CHUNK      = 5;
const PEBBLES_PER_CHUNK    = 12;
const BUSHES_PER_CHUNK     = 5;

const loader = new GLTFLoader();
let treeTemplate = null;

// ─── Voxel rock builder ───────────────────────────────────────────────────────
const ROCK_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x6a6a6a, roughness: 0.95 }),
  new THREE.MeshStandardMaterial({ color: 0x8c8c8c, roughness: 0.96 }),
  new THREE.MeshStandardMaterial({ color: 0x909080, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x787060, roughness: 0.98 }),
];

function buildVoxelRock(rng) {
  const VS  = 0.30;   // voxel size
  const GX = 4, GY = 3, GZ = 4;
  const mat = ROCK_MATS[Math.floor(rng() * ROCK_MATS.length)];
  const geos = [];
  for (let x = 0; x < GX; x++) {
    for (let y = 0; y < GY; y++) {
      for (let z = 0; z < GZ; z++) {
        const nx = (x - (GX - 1) / 2) / (GX / 2);
        const ny = (y - 0.3) / (GY * 0.65);
        const nz = (z - (GZ - 1) / 2) / (GZ / 2);
        if (nx*nx + ny*ny*1.6 + nz*nz > 1.05) continue;
        if (rng() > 0.82) continue;  // random holes for blocky feel
        const g = new THREE.BoxGeometry(VS, VS, VS);
        g.translate(x * VS, y * VS, z * VS);
        geos.push(g);
      }
    }
  }
  if (geos.length === 0) {
    const g = new THREE.BoxGeometry(VS, VS, VS); g.translate(0, 0, 0); geos.push(g);
  }
  const merged = mergeGeometries(geos);
  geos.forEach(g => g.dispose());
  // Center on XZ, rest on ground
  merged.translate(-(GX / 2) * VS, 0, -(GZ / 2) * VS);
  const mesh = new THREE.Mesh(merged, mat);
  mesh.castShadow   = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ─── Procedural terrain color — JS FBM, sampled per vertex ───────────────────
// Same math as the old GLSL version; vertex colors are seamless across chunks.
// Colors (linear): wet (0.040,0.020,0.002) · base (0.400,0.248,0.073) · dry (0.575,0.405,0.186)
function _th(px, py) {
  const s = Math.sin(px * 127.1 + py * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function _tn(px, py) {
  const ix = Math.floor(px), iy = Math.floor(py);
  const fx = px - ix, fy = py - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = _th(ix, iy), b = _th(ix+1, iy), c = _th(ix, iy+1), d = _th(ix+1, iy+1);
  return a + (b-a)*ux + (c-a)*uy + (d-c-b+a)*ux*uy;
}
function _tfbm(px, py) {
  let v = 0, a = 0.55;
  for (let i = 0; i < 5; i++) { v += _tn(px, py) * a; px *= 2.07; py *= 2.07; a *= 0.5; }
  return v;
}
function _tcolor(wx, wz) {
  const n = _tfbm(wx/90, wz/90)*0.72 + _tfbm(wx/18+7.3, wz/18+3.9)*0.28;
  if (n < 0.36) {
    const t = n / 0.36;
    return [0.040+(0.400-0.040)*t, 0.020+(0.248-0.020)*t, 0.002+(0.073-0.002)*t];
  }
  const t = (n-0.36)/0.64;
  return [0.400+(0.575-0.400)*t, 0.248+(0.405-0.248)*t, 0.073+(0.186-0.073)*t];
}

const TERRAIN_MAT = new THREE.MeshStandardMaterial({ roughness: 0.92, vertexColors: true });

// ─── Voxel bush builder ───────────────────────────────────────────────────────
// dry=true  → sparse, grey-brown sticks (dead shrub)
// dry=false → denser, olive-brown cluster (wilting but alive)
const DRY_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x6e5030, roughness: 0.99 }),
  new THREE.MeshStandardMaterial({ color: 0x5a4025, roughness: 0.99 }),
  new THREE.MeshStandardMaterial({ color: 0x7a6040, roughness: 0.98 }),
];
const WET_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x5a6228, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x4a5420, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x687038, roughness: 0.96 }),
];

function buildBush(rng, dry) {
  const mats  = dry ? DRY_MATS : WET_MATS;
  const mat   = mats[Math.floor(rng() * mats.length)];
  const geos  = [];
  const VS    = 0.12;
  // How many branch clusters: dry=2–4, semi-dry=4–7
  const numBranches = dry
    ? 2 + Math.floor(rng() * 3)
    : 4 + Math.floor(rng() * 4);

  for (let b = 0; b < numBranches; b++) {
    // Random branch direction, mostly up with some lean
    const angle = rng() * Math.PI * 2;
    const lean  = (dry ? 0.55 : 0.30) + rng() * 0.35;  // dry leans more
    const len   = (dry ? 3 : 5) + Math.floor(rng() * (dry ? 4 : 4));
    let cx = 0, cy = 0, cz = 0;
    const dx = Math.cos(angle) * lean;
    const dz = Math.sin(angle) * lean;
    const dy = 1.0;
    // Walk voxel segments along this branch
    for (let s = 0; s < len; s++) {
      const t = s / len;
      const g = new THREE.BoxGeometry(VS, VS, VS);
      g.translate(cx, cy, cz);
      geos.push(g);
      cx += dx * VS * 0.9;
      cy += dy * VS * 0.9;
      cz += dz * VS * 0.9;
      // Semi-dry: add small leaf-clump voxels near tip
      if (!dry && t > 0.55 && rng() > 0.45) {
        const lg = new THREE.BoxGeometry(VS * 1.6, VS * 1.6, VS * 1.6);
        lg.translate(cx + (rng()-0.5)*VS, cy, cz + (rng()-0.5)*VS);
        geos.push(lg);
      }
    }
  }
  if (geos.length === 0) {
    const g = new THREE.BoxGeometry(VS, VS, VS); geos.push(g);
  }
  const merged = mergeGeometries(geos);
  geos.forEach(g => g.dispose());
  const mesh = new THREE.Mesh(merged, mat);
  mesh.castShadow    = true;
  mesh.receiveShadow = true;
  return mesh;
}

// ─── Shared pebble geometry + material palette ────────────────────────────────
// Slightly varied earth tones close to #cca465
const PEBBLE_GEOS = [
  new THREE.BoxGeometry(0.20, 0.08, 0.20),
  new THREE.BoxGeometry(0.30, 0.10, 0.30),
  new THREE.BoxGeometry(0.40, 0.12, 0.40),
  new THREE.BoxGeometry(0.52, 0.14, 0.52),
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
  _tplPromise = load('/models/tree.glb', s => { treeTemplate = s; });
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
      const pending = [...this._pending];
      this._pending.clear();
      // Stagger builds so we don't freeze the main thread (each build is heavy)
      pending.forEach((key, i) => {
        const [cx, cz] = key.split(',').map(Number);
        setTimeout(() => this._build(cx, cz), i * 80);
      });
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
    if (treeTemplate !== null) setTimeout(() => this._build(cx, cz), this._pending.size * 80);
  }

  _build(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) { this._pending.delete(key); return; }

    const rng = makeRng(cx, cz);
    const ox  = cx * CHUNK_SIZE + CHUNK_SIZE / 2;
    const oz  = cz * CHUNK_SIZE + CHUNK_SIZE / 2;
    const objects = [];
    const ownColliders = [];

    // ── Ground (vertex colors from JS FBM — seamless across chunk boundaries) ──
    const SUB = 48;
    const geoG = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, SUB, SUB);
    const pos  = geoG.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      // PlaneGeometry verts are in XY plane; after rotation.x=-π/2 world coords are (x+ox, 0, -y+oz)
      const [r, g, b] = _tcolor(pos.getX(i) + ox, -pos.getY(i) + oz);
      cols[i*3] = r; cols[i*3+1] = g; cols[i*3+2] = b;
    }
    geoG.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const ground = new THREE.Mesh(geoG, TERRAIN_MAT);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(ox, 0, oz);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // ── Trees ─────────────────────────────────────────────────────────────────
    if (treeTemplate) {
      for (let i = 0; i < TREES_PER_CHUNK; i++) {
        const tx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const tz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        if (_inWater(tx, tz)) { rng(); rng(); rng(); continue; } // skip water areas (consume rng for consistency)
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

    // ── Rocks (voxel style) ───────────────────────────────────────────────────
    for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
      const rx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const rz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(rx, rz)) { rng(); rng(); rng(); rng(); continue; }
      const r  = buildVoxelRock(rng);
      const rs = 0.5 + rng() * 1.0;
      const rh = 0.35 + rng() * 0.55;
      r.position.set(rx, 0, rz);
      r.scale.set(rs, rs * rh, rs * (0.8 + rng() * 0.4));
      r.rotation.y = rng() * Math.PI * 2;
      this.scene.add(r);
      objects.push(r);
      ownColliders.push({ x: rx, z: rz, sx: rs * 1.6, sy: 2, sz: rs * 1.6 });
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

    // ── Bushes (dry + semi-dry desert shrubs) ─────────────────────────────────
    for (let i = 0; i < BUSHES_PER_CHUNK; i++) {
      const bx  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const bz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(bx, bz)) { rng(); rng(); rng(); continue; }
      const dry  = rng() > 0.38;           // ~62% dry, 38% semi-dry
      const bush = buildBush(rng, dry);
      const bs   = 0.55 + rng() * 0.90;   // size variety
      bush.position.set(bx, 0, bz);
      bush.scale.setScalar(bs);
      bush.rotation.y = rng() * Math.PI * 2;
      this.scene.add(bush);
      objects.push(bush);
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
