// chunk.js — Streaming terrain con queue de 1 chunk por frame (nunca congela)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WATER_ZONES } from './landmarks.js';

// ─── Constantes ──────────────────────────────────────────────────────────────
export const CHUNK_SIZE   = 200;
const LOAD_RADIUS         = 1;      // 3×3 = 9 chunks visibles
const UNLOAD_DIST         = 2;
const SUB                 = 10;     // subdivisiones del plano (menos = más rápido)
const TREES_PER_CHUNK     = 4;
const ROCKS_PER_CHUNK     = 4;
const BUSHES_PER_CHUNK    = 4;
const PEBBLES_PER_CHUNK   = 6;

// ─── Water zone check ────────────────────────────────────────────────────────
function _inWater(x, z) {
  for (const w of WATER_ZONES) {
    if (w.box) {
      if (x >= w.box.min.x && x <= w.box.max.x &&
          z >= w.box.min.z && z <= w.box.max.z) return true;
    } else {
      const dx = x - w.x, dz = z - w.z;
      if (dx * dx + dz * dz < w.r * w.r) return true;
    }
  }
  return false;
}

// ─── Deterministic RNG ───────────────────────────────────────────────────────
function makeRng(cx, cz) {
  let s = (Math.abs((cx * 73856093) ^ (cz * 19349663) ^ (cx * cz * 1664525)) || 1) >>> 0;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

// ─── FBM terrain color ───────────────────────────────────────────────────────
function _hash(px, py) {
  const s = Math.sin(px * 127.1 + py * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function _noise(px, py) {
  const ix = Math.floor(px), iy = Math.floor(py);
  const fx = px - ix, fy = py - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = _hash(ix,iy), b = _hash(ix+1,iy), c = _hash(ix,iy+1), d = _hash(ix+1,iy+1);
  return a + (b-a)*ux + (c-a)*uy + (d-c-b+a)*ux*uy;
}
function _fbm(px, py) {
  let v = 0, a = 0.55;
  for (let i = 0; i < 4; i++) { v += _noise(px, py) * a; px *= 2.1; py *= 2.1; a *= 0.5; }
  return v;
}
function _terrainColor(wx, wz) {
  const n = _fbm(wx / 90, wz / 90) * 0.7 + _fbm(wx / 18 + 7.3, wz / 18 + 3.9) * 0.3;
  if (n < 0.36) {
    const t = n / 0.36;
    return [0.04 + 0.36*t, 0.02 + 0.23*t, 0.002 + 0.07*t];
  }
  const t = (n - 0.36) / 0.64;
  return [0.40 + 0.18*t, 0.25 + 0.16*t, 0.07 + 0.12*t];
}

// ─── Materiales compartidos ──────────────────────────────────────────────────
const TERRAIN_MAT = new THREE.MeshStandardMaterial({ roughness: 0.92, vertexColors: true });

const ROCK_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x6a6060, roughness: 0.95 }),
  new THREE.MeshStandardMaterial({ color: 0x8c8070, roughness: 0.96 }),
];
const DRY_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x6e5030, roughness: 0.99 }),
  new THREE.MeshStandardMaterial({ color: 0x5a4025, roughness: 0.99 }),
];
const WET_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x5a6228, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x4a5420, roughness: 0.97 }),
];
const PEBBLE_MATS = [
  new THREE.MeshStandardMaterial({ color: 0xcaa050, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xb88c40, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xd8bc70, roughness: 0.93 }),
];

// ─── Carga de templates ──────────────────────────────────────────────────────
const loader = new GLTFLoader();
let treeTemplate   = null;
let _tplReady      = false;
let _tplCallbacks  = [];

function loadTemplates() {
  loader.load('/models/tree.glb',
    g => {
      treeTemplate = g.scene;
      _tplReady    = true;
      _tplCallbacks.forEach(fn => fn());
      _tplCallbacks = [];
    },
    undefined,
    () => {
      _tplReady    = true;   // falla silenciosa — sin árbol GLB
      _tplCallbacks.forEach(fn => fn());
      _tplCallbacks = [];
    }
  );
}
loadTemplates();

// ─── ChunkManager ────────────────────────────────────────────────────────────
export class ChunkManager {
  constructor(scene, colliders) {
    this.scene     = scene;
    this.colliders = colliders;
    this.chunks    = new Map();   // key → { ground, objects, ownColliders }
    this._queue    = [];          // lista de { cx, cz } pendientes
    this._building = false;
    this._requested = new Set();
  }

  // Llamar cada frame con la posición del jugador
  update(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK_SIZE);
    const cz = Math.floor(playerPos.z / CHUNK_SIZE);

    // Solicitar chunks del radio
    for (let dx = -LOAD_RADIUS; dx <= LOAD_RADIUS; dx++) {
      for (let dz = -LOAD_RADIUS; dz <= LOAD_RADIUS; dz++) {
        this._request(cx + dx, cz + dz);
      }
    }

    // Descargar chunks lejanos
    for (const key of this.chunks.keys()) {
      const [kcx, kcz] = key.split(',').map(Number);
      if (Math.abs(kcx - cx) > UNLOAD_DIST || Math.abs(kcz - cz) > UNLOAD_DIST) {
        this._unload(key);
      }
    }

    // Procesar UN chunk de la cola (nunca bloquea más de ~5ms)
    if (this._queue.length > 0 && !this._building) {
      const { cx: qcx, cz: qcz } = this._queue.shift();
      const key = `${qcx},${qcz}`;
      if (!this.chunks.has(key)) {
        this._building = true;
        if (_tplReady) {
          this._build(qcx, qcz);
          this._building = false;
        } else {
          _tplCallbacks.push(() => {
            this._build(qcx, qcz);
            this._building = false;
          });
        }
      } else {
        this._building = false;
      }
    }
  }

  _request(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key) || this._requested.has(key)) return;
    this._requested.add(key);
    // Prioritize chunks closest to center of loaded area
    this._queue.unshift({ cx, cz });
  }

  _build(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) return;

    const rng      = makeRng(cx, cz);
    const ox       = cx * CHUNK_SIZE + CHUNK_SIZE / 2;
    const oz       = cz * CHUNK_SIZE + CHUNK_SIZE / 2;
    const objects  = [];
    const ownColl  = [];

    // ── Terreno con vertex colors ─────────────────────────────────────────────
    const geo  = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, SUB, SUB);
    const pos  = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const [r, g, b] = _terrainColor(pos.getX(i) + ox, -pos.getY(i) + oz);
      cols[i*3] = r; cols[i*3+1] = g; cols[i*3+2] = b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const ground = new THREE.Mesh(geo, TERRAIN_MAT);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(ox, 0, oz);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // ── Árboles (GLB clonado) ─────────────────────────────────────────────────
    if (treeTemplate) {
      for (let i = 0; i < TREES_PER_CHUNK; i++) {
        const tx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const tz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        if (_inWater(tx, tz)) { rng(); rng(); rng(); continue; }
        const tree = treeTemplate.clone(true);
        const s    = 0.35 + rng() * 0.15;
        tree.position.set(tx, 0, tz);
        tree.scale.setScalar(s);
        tree.rotation.y = rng() * Math.PI * 2;
        tree.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.scene.add(tree);
        objects.push(tree);
        ownColl.push({ x: tx, z: tz, sx: 1, sy: 5, sz: 1 });
      }
    }

    // ── Rocas (1 mesh por roca, sin grupos) ───────────────────────────────────
    for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
      const rx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const rz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(rx, rz)) { rng(); rng(); rng(); rng(); continue; }
      const w   = 0.9 + rng() * 0.7;
      const h   = 0.4 + rng() * 0.35;
      const d   = 0.8 + rng() * 0.6;
      const mat = ROCK_MATS[Math.floor(rng() * ROCK_MATS.length)];
      const rs  = 0.5 + rng() * 1.0;
      const rh  = 0.35 + rng() * 0.55;
      const rock = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      rock.position.set(rx, (h * rh * rs) / 2, rz);
      rock.scale.set(rs, rh * rs, rs * (0.8 + rng() * 0.4));
      rock.rotation.y = rng() * Math.PI * 2;
      rock.castShadow = rock.receiveShadow = true;
      this.scene.add(rock);
      objects.push(rock);
      ownColl.push({ x: rx, z: rz, sx: rs * 1.6, sy: 2, sz: rs * 1.6 });
    }

    // ── Arbustos ──────────────────────────────────────────────────────────────
    for (let i = 0; i < BUSHES_PER_CHUNK; i++) {
      const bx  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const bz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(bx, bz)) { rng(); rng(); rng(); continue; }
      const dry = rng() > 0.38;
      const mat = (dry ? DRY_MATS : WET_MATS)[Math.floor(rng() * 2)];
      const bh  = 0.25 + rng() * 0.30;
      const bw  = 0.30 + rng() * 0.35;
      const bs  = 0.55 + rng() * 0.90;
      const bush = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bw), mat);
      bush.position.set(bx, (bh * bs) / 2, bz);
      bush.scale.setScalar(bs);
      bush.rotation.y = rng() * Math.PI * 2;
      bush.castShadow = bush.receiveShadow = true;
      this.scene.add(bush);
      objects.push(bush);
    }

    // ── Piedras pequeñas (pebbles, sin colliders) ─────────────────────────────
    for (let i = 0; i < PEBBLES_PER_CHUNK; i++) {
      const px  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const pz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const ph  = 0.06 + rng() * 0.08;
      const pw  = 0.15 + rng() * 0.35;
      const mat = PEBBLE_MATS[Math.floor(rng() * PEBBLE_MATS.length)];
      const peb = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pw), mat);
      peb.position.set(px, ph / 2, pz);
      peb.scale.set(0.6 + rng() * 1.1, 0.28 + rng() * 0.22, 0.6 + rng() * 0.8);
      peb.rotation.y = rng() * Math.PI * 2;
      peb.receiveShadow = true;
      this.scene.add(peb);
      objects.push(peb);
    }

    ownColl.forEach(c => this.colliders.push(c));
    this.chunks.set(key, { ground, objects, ownColl });
  }

  _unload(key) {
    const chunk = this.chunks.get(key);
    if (!chunk) return;
    this.scene.remove(chunk.ground);
    chunk.ground.geometry.dispose();
    for (const obj of chunk.objects) this.scene.remove(obj);
    for (const c of chunk.ownColl) {
      const idx = this.colliders.indexOf(c);
      if (idx >= 0) this.colliders.splice(idx, 1);
    }
    this._requested.delete(key);
    this.chunks.delete(key);
  }
}
