// --- Infinite world via streaming chunks ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const CHUNK_SIZE   = 200;  // world units per chunk side
const LOAD_RADIUS  = 2;           // chunks loaded each direction → 5×5 grid visible
const UNLOAD_DIST  = 3;           // chunks beyond this distance get unloaded
const TREES_PER_CHUNK = 10;
const ROCKS_PER_CHUNK = 6;

const loader = new GLTFLoader();
let treeTemplate = null;
let rockTemplate = null;

// Shared material — never disposed
const TERRAIN_MAT = new THREE.MeshStandardMaterial({ color: 0xcca465, roughness: 0.9 });

// Load GLB templates once, shared across all chunks
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

// Deterministic seeded RNG (xorshift) — same chunk coords = same layout always
function makeRng(cx, cz) {
  let s = (Math.abs((cx * 73856093) ^ (cz * 19349663) ^ (cx * cz * 1664525)) || 1) >>> 0;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export class ChunkManager {
  constructor(scene, colliders) {
    this.scene     = scene;
    this.colliders = colliders; // shared mutable array — chunks push/splice their entries
    this.chunks    = new Map(); // "cx,cz" → { ground, objects, ownColliders }
    this._pending  = new Set(); // keys requested but not yet built

    loadTemplates().then(() => {
      // Build any chunks requested before templates finished loading
      for (const key of this._pending) {
        const [cx, cz] = key.split(',').map(Number);
        this._build(cx, cz);
      }
      this._pending.clear();
    });
  }

  // Call every frame with player world position
  update(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK_SIZE);
    const cz = Math.floor(playerPos.z / CHUNK_SIZE);

    for (let dx = -LOAD_RADIUS; dx <= LOAD_RADIUS; dx++) {
      for (let dz = -LOAD_RADIUS; dz <= LOAD_RADIUS; dz++) {
        this._request(cx + dx, cz + dz);
      }
    }

    for (const key of this.chunks.keys()) {
      const [kcx, kcz] = key.split(',').map(Number);
      if (Math.abs(kcx - cx) > UNLOAD_DIST || Math.abs(kcz - cz) > UNLOAD_DIST) {
        this._unload(key);
      }
    }
  }

  _request(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key) || this._pending.has(key)) return;
    this._pending.add(key);
    if (treeTemplate !== null) {           // templates ready → build async
      setTimeout(() => this._build(cx, cz), 0);
    }
    // else: queued in _pending, built after loadTemplates() resolves
  }

  _build(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) { this._pending.delete(key); return; }

    const rng = makeRng(cx, cz);
    const ox  = cx * CHUNK_SIZE + CHUNK_SIZE / 2; // center X of chunk
    const oz  = cz * CHUNK_SIZE + CHUNK_SIZE / 2; // center Z of chunk
    const objects = [];
    const ownColliders = [];

    // Ground plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 4, 4),
      TERRAIN_MAT
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(ox, 0, oz);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Trees
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

    // Rocks
    if (rockTemplate) {
      for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
        const rx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const rz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const r  = rockTemplate.clone(true);
        const rs = 0.6 + rng() * 0.8;
        r.position.set(rx, 0, rz);
        r.scale.set(rs, 0.5 + rng() * 0.5, rs);
        r.rotation.y = rng() * Math.PI * 2;
        r.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.scene.add(r);
        objects.push(r);
        ownColliders.push({ x: rx, z: rz, sx: rs * 1.5, sy: 2, sz: rs * 1.5 });
      }
    }

    ownColliders.forEach(c => this.colliders.push(c));
    this.chunks.set(key, { ground, objects, ownColliders });
    this._pending.delete(key);
  }

  _unload(key) {
    const chunk = this.chunks.get(key);
    if (!chunk) return;

    // Ground: remove + dispose its unique geometry (not shared)
    this.scene.remove(chunk.ground);
    chunk.ground.geometry.dispose();

    // Trees/rocks: just remove — geometry/material shared with template, don't dispose
    for (const obj of chunk.objects) this.scene.remove(obj);

    // Remove this chunk's colliders from shared array
    for (const c of chunk.ownColliders) {
      const idx = this.colliders.indexOf(c);
      if (idx >= 0) this.colliders.splice(idx, 1);
    }

    this.chunks.delete(key);
  }
}
