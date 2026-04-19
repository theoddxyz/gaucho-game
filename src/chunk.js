// chunk.js — Streaming terrain con queue de 1 chunk por frame (nunca congela)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WATER_ZONES } from './landmarks.js';

// ─── Constantes ──────────────────────────────────────────────────────────────
export const CHUNK_SIZE   = 200;
const LOAD_RADIUS         = 1;      // 3×3 = 9 chunks visibles
const UNLOAD_DIST         = 2;
const SUB                 = 20;     // subdivisiones del plano — más detalle de color
const TREES_PER_CHUNK     = 4;
const ROCKS_PER_CHUNK     = 4;
const BUSHES_PER_CHUNK    = 8;
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
  // Desierto pampeano: tierra ocre/roja + pasto seco amarillo + arena
  const n  = _fbm(wx / 90, wz / 90) * 0.6 + _fbm(wx / 22 + 7.3, wz / 22 + 3.9) * 0.25
           + _fbm(wx / 6  + 31.1, wz / 6  + 17.4) * 0.15;
  const n2 = _fbm(wx / 5  + 55,   wz / 5  + 88) * 0.5 + 0.5; // high-freq grain
  // Banda baja: tierra roja/ocre (0x6B3510 → 0x9C5E1A)
  // Banda alta: pasto seco / arena dorada (0xC8A040 → 0xE8C870)
  let r, g, b;
  if (n < 0.28) {
    const t = n / 0.28;
    r = 0.30 + 0.22*t; g = 0.14 + 0.18*t; b = 0.03 + 0.05*t; // tierra oscura roja
  } else if (n < 0.55) {
    const t = (n - 0.28) / 0.27;
    r = 0.52 + 0.18*t; g = 0.32 + 0.14*t; b = 0.08 + 0.04*t; // ocre medio
  } else {
    const t = (n - 0.55) / 0.45;
    r = 0.70 + 0.12*t; g = 0.52 + 0.12*t; b = 0.12 + 0.10*t; // pasto seco / arena dorada
  }
  // Ruido fino de grano — evita color plano
  const grain = (n2 - 0.5) * 0.08;
  return [
    Math.max(0, Math.min(1, r + grain)),
    Math.max(0, Math.min(1, g + grain * 0.8)),
    Math.max(0, Math.min(1, b + grain * 0.5)),
  ];
}

// ─── Textura procedural de arena (canvas noise) ──────────────────────────────
function _buildSandTexture() {
  const SZ = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SZ;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(SZ, SZ);
  const d   = img.data;
  for (let i = 0; i < SZ * SZ; i++) {
    const x = i % SZ, y = Math.floor(i / SZ);
    // 3 octavas de ruido para granulado de arena fino
    const n1 = _noise(x / 14 + 3.1,  y / 14 + 9.7);
    const n2 = _noise(x / 5  + 71.3, y / 5  + 33.1) * 0.4;
    const n3 = _noise(x / 2  + 130,  y / 2.5 + 55 ) * 0.15;
    const v  = (n1 + n2 + n3) / 1.55;  // ~0..1
    // Tono cálido arena: ligeramente más R que G que B
    const base = Math.floor(185 + v * 55);
    d[i*4]   = Math.min(255, base + 18);
    d[i*4+1] = Math.min(255, base +  4);
    d[i*4+2] = Math.max(  0, base - 22);
    d[i*4+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);  // grano fino repetido
  return tex;
}
const _sandTex = _buildSandTexture();

// ─── Materiales compartidos ──────────────────────────────────────────────────
const TERRAIN_MAT = new THREE.MeshStandardMaterial({
  roughness: 0.87, metalness: 0.0,  // menos matte → responde más a la dirección de luz
  vertexColors: true,
  map: _sandTex,
});

const ROCK_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x7a7a7a, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0x6a6060, roughness: 0.95 }),
  new THREE.MeshStandardMaterial({ color: 0x8c8070, roughness: 0.96 }),
];
const DRY_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x2e7d1a, roughness: 0.85 }),
  new THREE.MeshStandardMaterial({ color: 0x3a9422, roughness: 0.85 }),
];
const WET_MATS = [
  new THREE.MeshStandardMaterial({ color: 0x1a6b2a, roughness: 0.80 }),
  new THREE.MeshStandardMaterial({ color: 0x228830, roughness: 0.80 }),
];
const PEBBLE_MATS = [
  new THREE.MeshStandardMaterial({ color: 0xcaa050, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xb88c40, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xd8bc70, roughness: 0.93 }),
];

// ─── Frutos silvestres ────────────────────────────────────────────────────────
const FRUIT_CHANCE  = 0.55;   // 55% de los arbustos tienen fruto
const _BERRY_GEO    = new THREE.SphereGeometry(0.30, 8, 6);
const _BERRY_MAT    = new THREE.MeshBasicMaterial({ color: 0xff2200 });

// ─── Carga de templates ──────────────────────────────────────────────────────
const loader = new GLTFLoader();
let treeTemplate = null;
let rockTemplate = null;
let bushTemplate = null;
let _tplReady    = false;
let _tplPending  = 3;          // esperar 3 cargas (tree + rock + bush)
let _tplCallbacks = [];

function _tplDone() { if (--_tplPending === 0) { _tplReady = true; _tplCallbacks.forEach(fn => fn()); _tplCallbacks = []; } }

function loadTemplates() {
  loader.load('/models/tree.glb',
    g => { treeTemplate = g.scene; _tplDone(); },
    undefined, () => _tplDone()
  );
  loader.load('/models/rock.glb',
    g => { rockTemplate = g.scene; _tplDone(); },
    undefined, () => _tplDone()
  );
  loader.load('/models/bush.glb',
    g => { bushTemplate = g.scene; _tplDone(); },
    undefined, () => _tplDone()   // falla silenciosa — sin bush GLB
  );
}
loadTemplates();

// ─── ChunkManager ────────────────────────────────────────────────────────────
export class ChunkManager {
  constructor(scene, colliders) {
    this.scene      = scene;
    this.colliders  = colliders;
    this.chunks     = new Map();
    this._queue     = [];
    this._building  = false;
    this._requested = new Set();
    this._trees       = [];   // { mesh, x, z, tipping, angle, vel, axis }
    this._fruitBushes = [];   // bush meshes with hasFruit flag
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
          try { this._build(qcx, qcz); } catch(e) { console.error('[Chunk] build error', e); }
          finally { this._building = false; }
        } else {
          _tplCallbacks.push(() => {
            try { this._build(qcx, qcz); } catch(e) { console.error('[Chunk] build error', e); }
            finally { this._building = false; }
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

    // ── Árboles / cactus (GLB con fallback procedural) ───────────────────────
    for (let i = 0; i < TREES_PER_CHUNK; i++) {
      const tx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const tz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(tx, tz)) { rng(); rng(); rng(); continue; }
      const s  = 0.35 + rng() * 0.15;
      const ry = rng() * Math.PI * 2;
      let tree;
      if (treeTemplate) {
        tree = treeTemplate.clone(true);
        tree.scale.setScalar(s);
        tree.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      } else {
        // Fallback: cactus procedural (tronco + dos brazos)
        tree = new THREE.Group();
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a7a30, roughness: 0.9 });
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.2, 6), trunkMat);
        trunk.castShadow = true; trunk._ownGeo = true;
        trunk.position.y = 1.1;
        tree.add(trunk);
        const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 1.0, 6), trunkMat);
        arm1._ownGeo = true; arm1.castShadow = true;
        arm1.rotation.z = Math.PI / 3;
        arm1.position.set(0.45, 1.4, 0);
        tree.add(arm1);
        const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.8, 6), trunkMat);
        arm2._ownGeo = true; arm2.castShadow = true;
        arm2.rotation.z = -Math.PI / 2.5;
        arm2.position.set(-0.4, 1.2, 0);
        tree.add(arm2);
        tree.scale.setScalar(s * 2.2);
      }
      tree.position.set(tx, 0, tz);
      tree.rotation.y = ry;
      this.scene.add(tree);
      objects.push(tree);
      ownColl.push({ x: tx, z: tz, sx: 1, sy: 5, sz: 1 });
      this._trees.push({ mesh: tree, x: tx, z: tz, tipping: false, angle: 0, vel: 0, axis: new THREE.Vector3(1, 0, 0) });
    }

    // ── Rocas ─────────────────────────────────────────────────────────────────
    for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
      const rx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const rz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(rx, rz)) { rng(); rng(); rng(); rng(); continue; }
      const rs  = 0.5 + rng() * 1.0;
      const rh  = 0.35 + rng() * 0.55;
      let rock;
      if (rockTemplate) {
        rock = rockTemplate.clone(true);
        rock.scale.set(rs * 0.6, rh * rs * 0.6, rs * (0.8 + rng() * 0.4) * 0.6);
        rock.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
      } else {
        const w   = 0.9 + rng() * 0.7;
        const h   = 0.4 + rng() * 0.35;
        const d   = 0.8 + rng() * 0.6;
        const mat = ROCK_MATS[Math.floor(rng() * ROCK_MATS.length)];
        rock = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        rock.scale.set(rs, rh * rs, rs * (0.8 + rng() * 0.4));
        rock.castShadow = rock.receiveShadow = true;
        rock._ownGeo = true;
      }
      rock.position.set(rx, 0, rz);
      rock.rotation.y = rng() * Math.PI * 2;
      this.scene.add(rock);
      objects.push(rock);
      ownColl.push({ x: rx, z: rz, sx: rs * 1.6, sy: 2, sz: rs * 1.6 });
    }

    // ── Arbustos ──────────────────────────────────────────────────────────────
    for (let i = 0; i < BUSHES_PER_CHUNK; i++) {
      const bx  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const bz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      if (_inWater(bx, bz)) { rng(); rng(); rng(); rng(); continue; }
      const bs  = 1.0 + rng() * 0.80;
      let bush;
      if (bushTemplate) {
        bush = bushTemplate.clone(true);
        bush.scale.setScalar(bs * 0.5);
        bush.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
      } else {
        const dry = rng() > 0.38;
        const mat = (dry ? DRY_MATS : WET_MATS)[Math.floor(rng() * 2)];
        const bh  = 0.70 + rng() * 0.50;
        const bw  = 0.65 + rng() * 0.45;
        bush = new THREE.Mesh(new THREE.SphereGeometry(bw * 0.5, 7, 5), mat);
        bush.scale.setScalar(bs);
        bush.castShadow = bush.receiveShadow = true;
        bush._ownGeo = true;
      }
      bush.position.set(bx, bs * 0.35, bz);
      bush.rotation.y = rng() * Math.PI * 2;
      this.scene.add(bush);
      objects.push(bush);

      // Fruto silvestre: ~25% de los arbustos tienen bayas (determinístico por RNG del chunk)
      if (rng() < FRUIT_CHANCE) {
        bush.hasFruit = true;
        const berry = new THREE.Mesh(_BERRY_GEO, _BERRY_MAT);
        berry.position.set(bx, bush.position.y + bs * 0.55 + 0.30, bz);
        this.scene.add(berry);
        objects.push(berry);
        bush._berry = berry;
        this._fruitBushes.push(bush);
      }
    }

    // ── Piedras pequeñas (pebbles, sin colliders) ─────────────────────────────
    for (let i = 0; i < PEBBLES_PER_CHUNK; i++) {
      const px  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const pz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const ph  = 0.06 + rng() * 0.08;
      const pw  = 0.15 + rng() * 0.35;
      const mat = PEBBLE_MATS[Math.floor(rng() * PEBBLE_MATS.length)];
      const peb = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pw), mat);
      peb._ownGeo = true;
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
    for (const obj of chunk.objects) {
      this.scene.remove(obj);
      if (obj._ownGeo) obj.geometry?.dispose();
      const ti = this._trees.findIndex(t => t.mesh === obj);
      if (ti >= 0) this._trees.splice(ti, 1);
      // Remove from fruit bushes list
      if (obj.hasFruit !== undefined) {
        const fi = this._fruitBushes.indexOf(obj);
        if (fi >= 0) this._fruitBushes.splice(fi, 1);
      }
    }
    for (const c of chunk.ownColl) {
      const idx = this.colliders.indexOf(c);
      if (idx >= 0) this.colliders.splice(idx, 1);
    }
    this._requested.delete(key);
    this.chunks.delete(key);
  }

  // Return nearest fruit bush within radius (only those with hasFruit=true)
  getNearbyFruitBush(x, z, radius = 2.5) {
    let best = null, bestD = radius * radius;
    for (const bush of this._fruitBushes) {
      if (!bush.hasFruit) continue;
      const dx = bush.position.x - x, dz = bush.position.z - z;
      const d = dx * dx + dz * dz;
      if (d < bestD) { bestD = d; best = bush; }
    }
    return best;
  }

  // Harvest a fruit bush: remove fruit visual, set regrow timer
  harvestBush(bush) {
    bush.hasFruit = false;
    if (bush._berry) bush._berry.visible = false;
    // Regrow after 1 minute
    setTimeout(() => {
      if (!bush._berry) return;
      bush.hasFruit = true;
      bush._berry.visible = true;
    }, 60 * 1000);
    return { fruit: 1 + (Math.random() < 0.5 ? 1 : 0), seed: 1 };
  }

  // Hit a tree/cactus near (x, z) — triggers tip-over physics
  hitTree(x, z, radius = 2.0) {
    let best = null, bestD = radius * radius;
    for (const t of this._trees) {
      if (t.tipping) continue;
      const dx = t.x - x, dz = t.z - z;
      const d = dx * dx + dz * dz;
      if (d < bestD) { bestD = d; best = t; }
    }
    if (!best) return;
    best.tipping = true;
    best.vel = 0.8;
    // Fall direction: away from impact point
    const ax = best.x - x, az = best.z - z;
    const len = Math.sqrt(ax * ax + az * az);
    best.axis.set(len > 0.01 ? ax / len : 1, 0, len > 0.01 ? az / len : 0);
  }

  // Returns all tree child meshes (for hitscan), tagged with _treeRef = tree entry
  getTreeHitboxes() {
    const out = [];
    for (const t of this._trees) {
      if (t.tipping) continue;
      t.mesh.traverse(o => {
        if (o.isMesh) {
          o._treeRef = t;
          out.push(o);
        }
      });
    }
    return out;
  }

  // Call every frame to animate tipping trees
  updateTrees(dt) {
    for (const t of this._trees) {
      if (!t.tipping || t.angle >= Math.PI / 2) continue;
      t.vel += 3.5 * dt;
      t.angle = Math.min(Math.PI / 2, t.angle + t.vel * dt);
      // Rotate around base: axis perpendicular to fall direction
      const perpX = -t.axis.z, perpZ = t.axis.x;
      const q = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(perpX, 0, perpZ), t.angle
      );
      t.mesh.quaternion.copy(q);
    }
  }
}
