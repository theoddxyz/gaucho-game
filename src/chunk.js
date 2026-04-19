// chunk.js — Streaming terrain con queue de 1 chunk por frame (nunca congela)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WATER_ZONES } from './landmarks.js';

// ─── Constantes ──────────────────────────────────────────────────────────────
export const CHUNK_SIZE   = 200;
const LOAD_RADIUS         = 1;      // 3×3 = 9 chunks visibles
const UNLOAD_DIST         = 2;
const SUB                 = 60;     // subdivisiones del plano — más detalle de color y desplazamiento
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

// ─── Textura de arena mejorada ────────────────────────────────────────────────
function _buildSandTexture() {
  const SZ = 512;
  const cv = document.createElement('canvas'); cv.width = cv.height = SZ;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(SZ, SZ);
  const d   = img.data;

  for (let y = 0; y < SZ; y++) {
    for (let x = 0; x < SZ; x++) {
      const i = (y * SZ + x) * 4;

      // Grano fino: 4 octavas con distorsión diagonal (simula viento)
      const wx = x + _noise(x / 8, y / 8) * 18;  // warping horizontal
      const wy = y + _noise(x / 8 + 40, y / 8 + 40) * 12;
      const n1 = _noise(wx / 18 + 3.1,  wy / 18 + 9.7);
      const n2 = _noise(wx / 7  + 71.3, wy / 6  + 33.1) * 0.38;
      const n3 = _noise(wx / 3  + 130,  wy / 2.5 + 55 ) * 0.14;
      const n4 = _noise(wx / 1.2 + 200, wy / 1.4 + 90 ) * 0.06;
      const v  = (n1 + n2 + n3 + n4) / 1.58;

      // Grietas de tierra seca (ridges altos + umbral brusco)
      const crack1 = _noise(wx / 28 + 7, wy / 22 + 3.5);
      const crack2 = _noise(wx / 15 + 55, wy / 18 + 80);
      // Una "grieta" es un valor muy cercano a 0.5 → franja oscura
      const crackA = Math.max(0, 1 - Math.abs(crack1 - 0.50) / 0.045) * 0.55;
      const crackB = Math.max(0, 1 - Math.abs(crack2 - 0.50) / 0.060) * 0.35;
      const crackMask = Math.min(1, crackA + crackB);

      // Color base: arena cálida
      let r = 190 + v * 58;
      let g = 160 + v * 42;
      let b = 100 + v * 28;

      // Zonas más rojizas (tierra seca) vs más amarillentas (arena)
      const zone = _noise(x / 200 + 5, y / 160 + 9);
      if (zone < 0.42) {
        r += 22; g -= 8; b -= 14;   // tierra roja ocre
      } else if (zone > 0.68) {
        r -= 5; g += 8; b += 6;    // arena más clara/verde seco
      }

      // Grietas oscurecen
      r = Math.max(0, r - crackMask * 55);
      g = Math.max(0, g - crackMask * 40);
      b = Math.max(0, b - crackMask * 22);

      d[i]   = Math.min(255, Math.round(r));
      d[i+1] = Math.min(255, Math.round(g));
      d[i+2] = Math.min(255, Math.round(b));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);   // algo más grande para ver las grietas
  return tex;
}

// ─── Normal map procedural (simula dunas y rugosidad para interactuar con la luz)
function _buildNormalMap() {
  const SZ = 512;
  const cv = document.createElement('canvas'); cv.width = cv.height = SZ;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(SZ, SZ);
  const d   = img.data;

  // Función de altura multi-escala: ondas de duna grandes + rugosidad media + micro
  function hgt(u, v) {
    const warp = _noise(u / 60 + 11, v / 50 + 7) * 0.5;  // warping suave
    const d1 = _noise(u / 95 + 3.7   + warp, v / 70 + 1.1  + warp) * 0.52;  // dunas ~50u
    const d2 = _noise(u / 32 + 11.3,          v / 28 + 7.9         ) * 0.26;  // ondas medias
    const d3 = _noise(u / 12 + 55.1,          v / 10 + 33.4        ) * 0.14;  // rugosidad
    const d4 = _noise(u / 4  + 190,           v / 3  + 120         ) * 0.08;  // micro-grano
    // Bandas de viento diagonales (rastros de arena)
    const wind = Math.sin((u * 0.8 - v * 0.3) / 22 + _noise(u / 40, v / 40) * 3) * 0.04;
    return d1 + d2 + d3 + d4 + wind;
  }

  const STRENGTH = 9.0;  // fuerza del efecto normal (mayor = relieves más pronunciados)
  const eps = 1.0;

  for (let y = 0; y < SZ; y++) {
    for (let x = 0; x < SZ; x++) {
      // Gradiente central
      const dx = (hgt(x + eps, y) - hgt(x - eps, y)) * STRENGTH;
      const dz = (hgt(x, y + eps) - hgt(x, y - eps)) * STRENGTH;
      // Normal desde gradiente, normalizada
      const len = Math.sqrt(dx * dx + dz * dz + 1.0);
      const nx = -dx / len;
      const ny = -dz / len;
      const nz =  1.0 / len;

      const i = (y * SZ + x) * 4;
      d[i]   = Math.round((nx * 0.5 + 0.5) * 255);
      d[i+1] = Math.round((ny * 0.5 + 0.5) * 255);
      d[i+2] = Math.round((nz * 0.5 + 0.5) * 255);
      d[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);  // las UV ya vienen en espacio-mundo desde _build()
  return tex;
}

// ─── Función de desplazamiento de vértices del terreno ───────────────────────
// Exportada para que controls.js pueda hacer que el jugador siga el suelo.
function _terrainHeight(wx, wz) {
  // Solo frecuencias bajas: garantiza continuidad perfecta en bordes de chunk
  const h1 = _fbm(wx / 120 + 5.5, wz / 100 + 2.3) * 0.55;
  const h2 = _noise(wx / 55  + 18,  wz / 45 + 9)   * 0.28;
  const h3 = _noise(wx / 22  + 88,  wz / 18 + 44)  * 0.12;
  const h4 = _noise(wx / 8   + 33,  wz / 7  + 77)  * 0.05;
  return (h1 + h2 + h3 + h4) * 1.0;  // 0–1 unidades: dunas claramente visibles
}

/** Exportada para IsoControls — calcula el suelo bajo un punto del mundo */
export function getTerrainHeight(wx, wz) {
  return _terrainHeight(wx, wz);
}

// ─── Altura de detalle para normales procedurales ────────────────────────────
// Combina el desplazamiento real + micro-ruido fino → normales ricas sin textura
function _heightForNormal(wx, wz) {
  const base = _terrainHeight(wx, wz);
  // Micro-detalle multi-escala: ondas de viento + rugosidad de grano
  const d1 = _noise(wx / 20 + 3.1,  wz / 17 + 9.7) * 0.18;
  const d2 = _noise(wx / 8  + 55.2, wz / 7  + 22.1) * 0.10;
  const d3 = _noise(wx / 3  + 100,  wz / 2.5 + 80 ) * 0.05;
  const wind = Math.sin((wx * 0.9 - wz * 0.35) / 14 +
               _noise(wx / 35, wz / 30) * 2.5) * 0.06;
  return base + d1 + d2 + d3 + wind;
}

// ─── Materiales compartidos ──────────────────────────────────────────────────
// Sin textura de normal map: las normales se calculan por vértice desde el ruido
// procedural → 100% sin tiling, continuas entre cualquier par de chunks.
const TERRAIN_MAT = new THREE.MeshStandardMaterial({
  roughness:    0.88,
  metalness:    0.0,
  vertexColors: true,
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

    // ── Terreno: vertex colors + desplazamiento + normales procedurales ─────────
    const geo  = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, SUB, SUB);
    const pos  = geo.attributes.position;
    const nrm  = geo.attributes.normal;
    const cols = new Float32Array(pos.count * 3);
    const EPS  = 0.4;  // epsilon en unidades de mundo para el gradiente

    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i) + ox;
      const wz = -pos.getY(i) + oz;  // PlaneGeometry Y local → -Z mundo tras rotación

      // Color del vértice
      const [r, g, b] = _terrainColor(wx, wz);
      cols[i*3] = r; cols[i*3+1] = g; cols[i*3+2] = b;

      // Desplazamiento (eje Z local = eje Y mundo tras rotación)
      pos.setZ(i, _terrainHeight(wx, wz));

      // ── Normal procedural desde gradiente de _heightForNormal ────────────────
      // En espacio local (antes de rotation.x = -PI/2):
      //   tangente X → (1, 0, dh/dwx)
      //   tangente Y → (0, 1, -dh/dwz)   (local Y = -mundo Z)
      //   normal     = cruz = (-dh/dwx,  dh/dwz, 1)  normalizada
      const dhx = (_heightForNormal(wx + EPS, wz) - _heightForNormal(wx - EPS, wz)) / (2 * EPS);
      const dhz = (_heightForNormal(wx, wz + EPS) - _heightForNormal(wx, wz - EPS)) / (2 * EPS);
      const len = Math.sqrt(dhx * dhx + dhz * dhz + 1.0);
      nrm.setXYZ(i, -dhx / len, dhz / len, 1.0 / len);
    }
    pos.needsUpdate = true;
    nrm.needsUpdate = true;
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
      tree.position.set(tx, _terrainHeight(tx, tz), tz);
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
      rock.position.set(rx, _terrainHeight(rx, rz), rz);
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
      bush.position.set(bx, _terrainHeight(bx, bz) + bs * 0.35, bz);
      bush.rotation.y = rng() * Math.PI * 2;
      this.scene.add(bush);
      objects.push(bush);

      // Fruto silvestre: ~25% de los arbustos tienen bayas (determinístico por RNG del chunk)
      if (rng() < FRUIT_CHANCE) {
        bush.hasFruit = true;
        const berry = new THREE.Mesh(_BERRY_GEO, _BERRY_MAT);
        berry.position.set(bx, _terrainHeight(bx, bz) + bs * 0.55 + 0.30, bz);
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
      peb.position.set(px, _terrainHeight(px, pz) + ph / 2, pz);
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
