// village.js — Pueblo procedural cerca del spawn (x≈3.8, z≈-69)
// El layout se lee de src/data/world_layout.json (editable con editor.html)
// Cada edificio busca su GLB en /public/models/ — si existe lo usa, si no usa procedural
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import worldLayout from './data/world_layout.json';

const _vLoader = new GLTFLoader();

// Intenta cargar un GLB; si carga, reemplaza el grupo procedural en la escena.
// scale: factor de escala del GLB (ajustar según el tamaño del modelo exportado)
function _trySwap(scene, group, glbPath, scale = 1) {
  _vLoader.load(glbPath, g => {
    scene.remove(group);
    const m = g.scene;
    m.position.copy(group.position);
    m.rotation.copy(group.rotation);
    m.scale.setScalar(scale);
    m.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    scene.add(m);
  }, undefined, () => {});  // falla silenciosa → grupo procedural ya en escena
}

// ─── Materiales ───────────────────────────────────────────────────────────────
const MAT_STONE   = new THREE.MeshStandardMaterial({ color: 0xa09080, roughness: 0.92 });
const MAT_STONE_D = new THREE.MeshStandardMaterial({ color: 0x706050, roughness: 0.95 });
const MAT_PLASTER = new THREE.MeshStandardMaterial({ color: 0xd4c49a, roughness: 0.88 });
const MAT_WHITE   = new THREE.MeshStandardMaterial({ color: 0xede8d8, roughness: 0.80 });
const MAT_WOOD    = new THREE.MeshStandardMaterial({ color: 0x6b3a1f, roughness: 0.95 });
const MAT_ROOF    = new THREE.MeshStandardMaterial({ color: 0x8b2020, roughness: 0.90 });
const MAT_ROOF_DK = new THREE.MeshStandardMaterial({ color: 0x3a1a08, roughness: 0.97 });
const MAT_FENCE   = new THREE.MeshStandardMaterial({ color: 0x8a6a40, roughness: 0.97 });
const MAT_DIRT    = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 1.00 });
const MAT_CROP_G  = new THREE.MeshStandardMaterial({ color: 0x2d5a18, roughness: 0.90 });
const MAT_CROP_Y  = new THREE.MeshStandardMaterial({ color: 0x7a8a20, roughness: 0.90 });
const MAT_GLASS   = new THREE.MeshStandardMaterial({ color: 0x304050, roughness: 0.5, metalness: 0.2 });
const MAT_DOOR    = new THREE.MeshStandardMaterial({ color: 0x2a1508, roughness: 0.97 });
const MAT_GOLD    = new THREE.MeshStandardMaterial({ color: 0xd4a840, roughness: 0.5, metalness: 0.5 });
const MAT_FLAG    = new THREE.MeshStandardMaterial({ color: 0xcc2200, roughness: 0.8 });
const MAT_BELL    = new THREE.MeshStandardMaterial({ color: 0xb08840, roughness: 0.6, metalness: 0.4 });
// ─── Texturas procedurales ────────────────────────────────────────────────────
function _noise2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return (s - Math.floor(s));
}
function _fbm2(x, y, oct = 3) {
  let v = 0, a = 0.5;
  for (let i = 0; i < oct; i++) { v += _noise2(x, y) * a; x *= 2.1; y *= 2.1; a *= 0.5; }
  return v;
}

function _buildRoadTexture() {
  const W = 256, H = 512;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const id = ctx.createImageData(W, H); const d = id.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const nx = x / W;               // 0=left, 1=right (across road)
      const ny = y / H;               // 0=near, 1=far  (along road, tiles)
      // Base dirt con ruido FBM
      const n  = _fbm2(nx * 6 + 3.1, ny * 12 + 7.4, 4);
      const n2 = _fbm2(nx * 18 + 11, ny * 24 + 2.2, 2) * 0.4;
      let r = 0.52 + n * 0.14 + n2 * 0.06;
      let g = 0.38 + n * 0.10 + n2 * 0.04;
      let b = 0.16 + n * 0.06 + n2 * 0.02;
      // Rodadas (ruts) — dos líneas oscuras compactadas al 28% y 72%
      const rutL = Math.max(0, 1 - Math.abs(nx - 0.28) / 0.045);
      const rutR = Math.max(0, 1 - Math.abs(nx - 0.72) / 0.045);
      const rut  = Math.max(rutL, rutR);
      r -= rut * 0.18; g -= rut * 0.13; b -= rut * 0.05;
      // Lomo central (bombeo de camino): más claro y seco
      const crown = Math.max(0, 1 - Math.abs(nx - 0.5) / 0.18);
      r += crown * 0.06; g += crown * 0.04;
      // Bordes (cuneta): más oscuros y húmedos
      const edge = Math.max(0, 1 - Math.min(nx, 1 - nx) / 0.10);
      r -= edge * 0.12; g -= edge * 0.09; b -= edge * 0.02;
      // Piedras sueltas: pequeñas manchas más oscuras/claras aleatorias
      if (_noise2(nx * 60 + y * 0.3, ny * 90 + x * 0.1) > 0.82) {
        r += 0.09; g += 0.07; b += 0.04;
      }
      if (_noise2(nx * 80 + 5, ny * 110 + 3) > 0.88) {
        r -= 0.10; g -= 0.07;
      }
      d[i]   = Math.max(0, Math.min(255, r * 255));
      d[i+1] = Math.max(0, Math.min(255, g * 255));
      d[i+2] = Math.max(0, Math.min(255, b * 255));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(id, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.ClampToEdgeWrapping;   // no tila a lo ancho
  tex.wrapT = THREE.RepeatWrapping;        // tila a lo largo
  return tex;
}

function _buildRiverTexture() {
  const W = 256, H = 256;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const id = ctx.createImageData(W, H); const d = id.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i  = (y * W + x) * 4;
      const nx = x / W, ny = y / H;
      // Base agua: azul oscuro con variación de profundidad
      const depth = _fbm2(nx * 3 + 1.1, ny * 3 + 4.7, 3);
      let r = 0.04 + depth * 0.06;
      let g = 0.25 + depth * 0.10;
      let b = 0.55 + depth * 0.14;
      // Corriente: líneas diagonales claras que simulan flujo
      const flow  = Math.sin((ny + nx * 0.3) * Math.PI * 6) * 0.5 + 0.5;
      const flow2 = Math.sin((ny * 1.4 - nx * 0.2) * Math.PI * 9 + 1.2) * 0.5 + 0.5;
      const fc = Math.pow(flow * flow2, 2.5) * 0.20;
      r += fc * 0.8; g += fc * 0.9; b += fc;
      // Espuma/ondas en bordes
      const borde = Math.max(0, 1 - Math.min(nx, 1 - nx) / 0.12);
      const foam  = _noise2(nx * 40 + ny * 12, ny * 30 + nx * 8) * borde;
      r += foam * 0.22; g += foam * 0.24; b += foam * 0.26;
      // Caustics puntales
      if (_fbm2(nx * 14 + ny * 7, ny * 18 - nx * 5, 2) > 0.72) {
        r += 0.06; g += 0.10; b += 0.14;
      }
      d[i]   = Math.max(0, Math.min(255, r * 255));
      d[i+1] = Math.max(0, Math.min(255, g * 255));
      d[i+2] = Math.max(0, Math.min(255, b * 255));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(id, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const _roadTex  = _buildRoadTexture();
const _riverTex = _buildRiverTexture();

const MAT_PATH = new THREE.MeshStandardMaterial({
  map: _roadTex, roughness: 0.96, metalness: 0.0,
});
const MAT_PATH_EDGE = new THREE.MeshStandardMaterial({ color: 0x5a3e20, roughness: 1.0 });
const MAT_RIVER = new THREE.MeshStandardMaterial({
  map: _riverTex, color: 0x2266aa,
  roughness: 0.06, metalness: 0.0,
  transparent: true, opacity: 0.82,
});
const MAT_RIVER_BED = new THREE.MeshStandardMaterial({ color: 0x1a3a1a, roughness: 1.0 });

// Actualiza el scroll del río — llamar desde el game loop
export function updateVillageAnimations(dt) {
  _riverTex.offset.y -= dt * 0.10;  // fluye "hacia adelante"
  _riverTex.offset.x += dt * 0.008; // leve deriva lateral
}

// ─── Box helper (posición con base en y=0) ───────────────────────────────────
function sb(mat, w, h, d, x, y, z, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}

// ─── Techo a dos aguas (prisma triangular) ────────────────────────────────────
function makeRoof(w, h, d, mat) {
  const hw = w / 2, hd = d / 2;
  // 8 triángulos: 2 hastiales + 2 faldones (2 tri cada uno) + fondo
  const v = new Float32Array([
    // Hastial frente
    -hw, 0,  hd,   hw, 0,  hd,   0, h,  hd,
    // Hastial trasero
    -hw, 0, -hd,   0, h, -hd,   hw, 0, -hd,
    // Faldón izquierdo
    -hw, 0, -hd,  -hw, 0,  hd,   0, h,  hd,
    -hw, 0, -hd,   0, h,  hd,   0, h, -hd,
    // Faldón derecho
     hw, 0,  hd,   hw, 0, -hd,   0, h, -hd,
     hw, 0,  hd,   0, h, -hd,   0, h,  hd,
    // Base
    -hw, 0, -hd,   hw, 0, -hd,   hw, 0,  hd,
    -hw, 0, -hd,   hw, 0,  hd,  -hw, 0,  hd,
  ]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(v, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}

// ─── Puertas de corrales ──────────────────────────────────────────────────────
const _gates = [];
export function getVillageGates() { return _gates; }

// Añade colliders para un segmento de cerca (world-space, ignora si el jugador saltó)
function _fenceCol(colliders, cx, cz, x0, z0, x1, z1, fh = 1.4) {
  colliders.push({
    x:  cx + (x0 + x1) / 2,
    z:  cz + (z0 + z1) / 2,
    sx: Math.max(0.22, Math.abs(x1 - x0)),
    sz: Math.max(0.22, Math.abs(z1 - z0)),
    maxY: fh * 0.88,
  });
}

// Construye la puerta animada en la pared sur del corral y registra su estado
function _addGate(g, colliders, cx, cz, hw, hd, gateW = 2.2, fh = 1.4) {
  const ghw = gateW / 2;
  // Pared sur partido: mitad izq + mitad der
  fence(g, -hw, hd, -ghw, hd, fh);
  fence(g,  ghw, hd,  hw, hd, fh);
  _fenceCol(colliders, cx, cz, -hw, hd, -ghw, hd, fh);
  _fenceCol(colliders, cx, cz,  ghw, hd,  hw, hd, fh);

  // Panel de puerta — pivot en poste izquierdo del hueco
  const gp = new THREE.Group();
  gp.position.set(-ghw, 0, hd);
  const mkR = (y) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(gateW, 0.12, 0.14), MAT_FENCE);
    r.position.set(ghw, y, 0);
    r.castShadow = r.receiveShadow = true;
    gp.add(r);
  };
  mkR(fh * 0.68); mkR(fh * 0.38);
  const gPost = new THREE.Mesh(new THREE.BoxGeometry(0.16, fh, 0.16), MAT_FENCE);
  gPost.position.set(gateW, fh / 2, 0);
  gPost.castShadow = gPost.receiveShadow = true;
  gp.add(gPost);
  g.add(gp);

  // Collider de la puerta (world-space, se desactiva al abrir)
  const gc = { x: cx, z: cz + hd, sx: gateW + 0.16, sz: 0.22, maxY: fh + 0.1, active: true };
  colliders.push(gc);

  _gates.push({
    cx, cz,
    gateX: cx, gateZ: cz + hd,  // punto de proximidad en el mundo
    panel: gp,
    collider: gc,
    isOpen: false,
    animT: 0,      // 0=cerrado 1=abierto
    animTarget: 0,
  });
}

// ─── Hilera de cerco ─────────────────────────────────────────────────────────
function fence(parent, x0, z0, x1, z1, h = 1.4) {
  const dx = x1 - x0, dz = z1 - z0;
  const len = Math.sqrt(dx * dx + dz * dz);
  const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
  const ang = Math.atan2(dx, dz);
  const mkRail = (y) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, len), MAT_FENCE);
    r.position.set(mx, y, mz);
    r.rotation.y = ang;
    r.castShadow = r.receiveShadow = true;
    parent.add(r);
  };
  mkRail(h * 0.68); mkRail(h * 0.38);
  const n = Math.max(2, Math.ceil(len / 2.8));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.16), MAT_FENCE);
    post.position.set(x0 + dx * t, h / 2, z0 + dz * t);
    post.castShadow = post.receiveShadow = true;
    parent.add(post);
  }
}

// ─── Granja ──────────────────────────────────────────────────────────────────
function buildFarm(scene, colliders, cx, cz, fw = 18, fd = 14) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  const hw = fw / 2, hd = fd / 2;
  const fh = 1.4;

  // Suelo tierra
  sb(MAT_DIRT, fw, 0.10, fd, 0, 0, 0, g);

  // Surcos de cultivo
  const rows = 5;
  for (let i = 0; i < rows; i++) {
    const rz = -hd + 1.4 + i * ((fd - 2.8) / (rows - 1));
    const mat = i % 2 === 0 ? MAT_CROP_G : MAT_CROP_Y;
    const crop = new THREE.Mesh(new THREE.BoxGeometry(fw - 3, 0.40 + Math.random() * 0.15, 1.0), mat);
    crop.position.set(0, 0.25, rz);
    crop.castShadow = true;
    g.add(crop);
  }

  // Cerco perimetral (hueco al norte = portón 4.4u)
  fence(g, -hw, -hd, -2.2,  -hd, fh);
  fence(g,  2.2, -hd,  hw,  -hd, fh);
  fence(g, -hw,  hd,   hw,   hd, fh);
  fence(g, -hw, -hd,  -hw,   hd, fh);
  fence(g,  hw, -hd,   hw,   hd, fh);

  // Colliders de cerca (con maxY para poder saltar)
  _fenceCol(colliders, cx, cz, -hw, -hd, -2.2, -hd, fh);  // norte izq
  _fenceCol(colliders, cx, cz,  2.2, -hd,  hw, -hd, fh);  // norte der
  _fenceCol(colliders, cx, cz, -hw,  hd,   hw,  hd, fh);  // sur
  _fenceCol(colliders, cx, cz, -hw, -hd,  -hw,  hd, fh);  // oeste
  _fenceCol(colliders, cx, cz,  hw, -hd,   hw,  hd, fh);  // este

  // Portón (activo = bloqueado, se puede extender a gate animado después)
  colliders.push({ x: cx, z: cz - hd, sx: 4.4, sz: 0.22, maxY: fh + 0.1, active: true });

  // Poste de portón
  const gpost = (ox) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.9, 0.2), MAT_FENCE);
    p.position.set(ox, 0.95, -hd);
    g.add(p);
  };
  gpost(-2.2); gpost(2.2);

  // Cobertizo dentro de la granja
  const shed = new THREE.Group();
  shed.position.set(hw - 3.5, 0, -hd + 3.5);
  const sw = 4.5, sh = 3.0, sd = 4.5;
  sb(MAT_WOOD, sw, sh, sd, 0, 0, 0, shed);
  const sRoof = makeRoof(sw + 0.4, 1.2, sd + 0.4, MAT_ROOF_DK);
  sRoof.position.set(0, sh, 0);
  shed.add(sRoof);
  sb(MAT_DOOR, 1.0, 1.8, 0.15, 0, 0, sd / 2 + 0.05, shed);
  g.add(shed);
  return g;
}

// ─── Corral grande de vacas ───────────────────────────────────────────────────
function buildCowCorral(scene, colliders, cx, cz, cw = 32, cd = 24) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  const hw = cw / 2, hd = cd / 2;
  const fenceH = 1.8;

  // Suelo tierra apisonada
  sb(MAT_DIRT, cw, 0.10, cd, 0, 0, 0, g);

  // Abrevadero grande
  sb(MAT_WOOD,  4.0, 0.7, 1.2,  hw - 3,   0,  0,  g);
  sb(MAT_STONE, 3.6, 0.4, 0.8,  hw - 3, 0.7,  0,  g);

  // Pequeño refugio / sombra para las vacas (techo abierto)
  const shelter = new THREE.Group();
  shelter.position.set(-hw + 5, 0, -hd + 4);
  sb(MAT_WOOD, 0.2, 3.0, 0.2, -3, 0, -2.5, shelter);
  sb(MAT_WOOD, 0.2, 3.0, 0.2,  3, 0, -2.5, shelter);
  sb(MAT_WOOD, 0.2, 3.0, 0.2, -3, 0,  2.5, shelter);
  sb(MAT_WOOD, 0.2, 3.0, 0.2,  3, 0,  2.5, shelter);
  const shRoof = makeRoof(7.0, 1.0, 6.0, MAT_ROOF_DK);
  shRoof.position.set(0, 3.0, 0);
  shelter.add(shRoof);
  g.add(shelter);

  // Cerco robusto — norte, este, oeste (sin puerta)
  fence(g, -hw, -hd,  hw, -hd, fenceH);  // norte
  fence(g, -hw, -hd, -hw,  hd, fenceH);  // oeste
  fence(g,  hw, -hd,  hw,  hd, fenceH);  // este
  _fenceCol(colliders, cx, cz, -hw, -hd,  hw, -hd, fenceH);
  _fenceCol(colliders, cx, cz, -hw, -hd, -hw,  hd, fenceH);
  _fenceCol(colliders, cx, cz,  hw, -hd,  hw,  hd, fenceH);

  // Sur — puerta animada (3u de ancho para vacas)
  _addGate(g, colliders, cx, cz, hw, hd, 3.0, fenceH);

  return g;
}

// ─── Corral de gallinas ───────────────────────────────────────────────────────
function buildCorral(scene, colliders, cx, cz, cw = 10, cd = 10) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  const hw = cw / 2, hd = cd / 2;
  const fenceH = 1.4;

  // Suelo tierra apisonada
  sb(MAT_DIRT, cw, 0.08, cd, 0, 0, 0, g);

  // Abrevadero (comedero)
  sb(MAT_WOOD,  2.2, 0.5, 0.7,  hw - 1.5, 0, 0, g);
  sb(MAT_STONE, 1.8, 0.3, 0.4,  hw - 1.5, 0.5, 0, g);

  // Norte, este, oeste — sin puerta
  fence(g, -hw, -hd,  hw, -hd, fenceH);
  fence(g, -hw, -hd, -hw,  hd, fenceH);
  fence(g,  hw, -hd,  hw,  hd, fenceH);
  _fenceCol(colliders, cx, cz, -hw, -hd,  hw, -hd, fenceH);
  _fenceCol(colliders, cx, cz, -hw, -hd, -hw,  hd, fenceH);
  _fenceCol(colliders, cx, cz,  hw, -hd,  hw,  hd, fenceH);

  // Sur — puerta animada (2.2u)
  _addGate(g, colliders, cx, cz, hw, hd, 2.2, fenceH);

  // Pequeño gallinero (caseta) en esquina norte
  const hen = new THREE.Group();
  hen.position.set(-hw + 2.0, 0, -hd + 2.0);
  sb(MAT_WOOD, 2.8, 2.2, 2.8, 0, 0, 0, hen);
  const hRoof = makeRoof(3.2, 0.9, 3.2, MAT_ROOF_DK);
  hRoof.position.set(0, 2.2, 0);
  hen.add(hRoof);
  sb(MAT_DOOR, 0.7, 1.0, 0.12, 0, 0, 1.45, hen);
  g.add(hen);
  return g;
}

// ─── Casa ────────────────────────────────────────────────────────────────────
function buildHouse(scene, colliders, cx, cz, rot = 0) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rot;
  scene.add(g);

  const hw = 5.0, bh = 5.0, hd = 7.0;

  // Cuerpo
  sb(MAT_PLASTER, hw * 2, bh, hd * 2, 0, 0, 0, g);

  // Moldura de base
  sb(MAT_STONE, hw * 2 + 0.2, 0.5, hd * 2 + 0.2, 0, 0, 0, g);

  // Techo
  const roof = makeRoof(hw * 2 + 0.7, 2.0, hd * 2 + 0.7, MAT_ROOF);
  roof.position.set(0, bh, 0);
  g.add(roof);

  // Puerta frontal
  sb(MAT_DOOR, 1.4, 2.4, 0.18, 0, 0, hd + 0.05, g);
  sb(MAT_GOLD, 0.15, 0.15, 0.10, 0.55, 1.2, hd + 0.15, g); // pomo

  // Ventanas frente
  sb(MAT_GLASS, 1.2, 1.0, 0.18, -2.2, 2.8, hd + 0.05, g);
  sb(MAT_GLASS, 1.2, 1.0, 0.18,  2.2, 2.8, hd + 0.05, g);

  // Ventanas laterales
  sb(MAT_GLASS, 0.18, 1.0, 1.2,  hw + 0.05, 2.8,  2.0, g);
  sb(MAT_GLASS, 0.18, 1.0, 1.2, -hw - 0.05, 2.8,  2.0, g);

  // Chimenea
  sb(MAT_STONE_D, 0.8, 2.2, 0.8, hw * 0.5, bh + 1.5, -hd * 0.3, g);
  sb(MAT_STONE, 1.0, 0.3, 1.0, hw * 0.5, bh + 2.7, -hd * 0.3, g);

  colliders.push({ x: cx, z: cz, sx: hw * 2, sy: bh + 2, sz: hd * 2 });
  return g;
}

// ─── Iglesia ─────────────────────────────────────────────────────────────────
function buildChurch(scene, colliders, cx, cz) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  // Nave principal
  const nw = 11, nh = 9, nd = 24;
  sb(MAT_STONE, nw, nh, nd, 0, 0, 4, g);

  // Techo nave
  const nRoof = makeRoof(nw + 0.8, 4.0, nd + 0.8, MAT_ROOF);
  nRoof.position.set(0, nh, 4);
  g.add(nRoof);

  // Torre campanario (frente)
  const tw = 6.5, th = 20, td = 6.5;
  sb(MAT_STONE_D, tw, th, td, 0, 0, -10, g);

  // Arco de belfry (abertura)
  sb(MAT_STONE_D, tw + 1.0, 1.2, td + 1.0, 0, th, -10, g);

  // Techo torre (pirámide)
  const tRoof = makeRoof(tw + 1.2, 5.0, td + 1.2, MAT_ROOF);
  tRoof.position.set(0, th + 1.2, -10);
  g.add(tRoof);

  // Cruz sobre torre
  sb(MAT_WHITE, 0.35, 4.0, 0.35, 0, th + 6.5, -10, g);  // palo vertical
  sb(MAT_WHITE, 2.8, 0.35, 0.35, 0, th + 8.2, -10, g);  // palo horizontal

  // Campana
  sb(MAT_BELL, 1.4, 1.1, 1.4, 0, th - 2.0, -10, g);

  // Ventanas nave (cada lado)
  for (let i = -1; i <= 1; i++) {
    sb(MAT_GLASS, 0.18, 2.8, 1.5, -(nw / 2 + 0.05), 4.5, 4 + i * 7, g);
    sb(MAT_GLASS, 0.18, 2.8, 1.5,  (nw / 2 + 0.05), 4.5, 4 + i * 7, g);
  }
  // Rosetón frontal
  sb(MAT_GLASS, 3.5, 3.5, 0.18, 0, nh - 1, -10 + td / 2 + 0.05, g);

  // Puerta principal
  sb(MAT_DOOR, 2.8, 5.0, 0.20, 0, 0, -10 + td / 2 + 0.06, g);

  // Escalones entrada
  sb(MAT_STONE, 7.5, 0.4, 2.0, 0, 0.0, -10 + td / 2 + 1.0, g);
  sb(MAT_STONE, 6.5, 0.4, 1.5, 0, 0.4, -10 + td / 2 + 1.8, g);
  sb(MAT_STONE, 5.5, 0.4, 1.0, 0, 0.8, -10 + td / 2 + 2.5, g);

  // Capilla lateral (pequeña)
  sb(MAT_STONE, 4.5, 5.5, 5.5, -(nw / 2 + 2.5), 0, 5, g);
  const cRoof = makeRoof(5.0, 2.5, 6.0, MAT_ROOF);
  cRoof.position.set(-(nw / 2 + 2.5), 5.5, 5);
  g.add(cRoof);

  // Collarín decorativo en unión torre–nave
  sb(MAT_STONE, nw + 1.0, 1.0, 2.5, 0, nh, -10 + td / 2 + 1.0, g);

  colliders.push({ x: cx, z: cz + 4, sx: nw, sy: nh + 4, sz: nd });
  colliders.push({ x: cx, z: cz - 10, sx: tw, sy: th, sz: td });
  return g;
}

// ─── Ayuntamiento ─────────────────────────────────────────────────────────────
function buildTownHall(scene, colliders, cx, cz) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  const bw = 22, bh = 10, bd = 17;

  // Cuerpo principal
  sb(MAT_WHITE, bw, bh, bd, 0, 0, 0, g);

  // Moldura base
  sb(MAT_STONE, bw + 0.4, 0.6, bd + 0.4, 0, 0, 0, g);

  // Techo plano con parapeto
  sb(MAT_STONE_D, bw + 1.0, 0.8, bd + 1.0, 0, bh, 0, g);
  sb(MAT_STONE_D, bw + 1.0, 1.4, 0.45, 0, bh + 0.8, bd / 2, g);
  sb(MAT_STONE_D, bw + 1.0, 1.4, 0.45, 0, bh + 0.8, -bd / 2, g);
  sb(MAT_STONE_D, 0.45, 1.4, bd + 1.0,  bw / 2, bh + 0.8, 0, g);
  sb(MAT_STONE_D, 0.45, 1.4, bd + 1.0, -bw / 2, bh + 0.8, 0, g);

  // Torreta central con cúpula
  const tw = 5.5, th = 6.0, td = 5.5;
  sb(MAT_STONE_D, tw, th, td, 0, bh + 0.8, 0, g);
  const cupola = makeRoof(tw + 0.8, 3.5, td + 0.8, MAT_ROOF);
  cupola.position.set(0, bh + 0.8 + th, 0);
  g.add(cupola);

  // Asta de bandera
  sb(MAT_WOOD, 0.22, 9.0, 0.22, 2.5, bh + 0.8 + th + 4.5, 0, g);
  sb(MAT_FLAG, 3.0, 1.8, 0.10, 4.0, bh + 0.8 + th + 8.5, 0, g);

  // Columnas frontales (6 columnas)
  for (let i = -2; i <= 2; i++) {
    sb(MAT_WHITE, 0.65, bh - 0.5, 0.65, i * 3.8, 0, bd / 2 + 0.4, g);
  }

  // Arquitrabe sobre columnas
  sb(MAT_STONE, bw - 1, 0.9, 2.8, 0, bh - 0.5, bd / 2 + 1.5, g);
  sb(MAT_STONE, bw - 1, 0.5, 2.8, 0, bh - 1.4, bd / 2 + 1.5, g);

  // Escalones de acceso
  sb(MAT_STONE, bw + 1, 0.55, 3.5, 0, 0.00, bd / 2 + 1.7, g);
  sb(MAT_STONE, bw - 1, 0.55, 2.8, 0, 0.55, bd / 2 + 1.2, g);
  sb(MAT_STONE, bw - 3, 0.55, 2.2, 0, 1.10, bd / 2 + 0.8, g);

  // Puerta doble
  sb(MAT_DOOR, 1.6, 5.2, 0.22, -1.0, 0, bd / 2 + 0.08, g);
  sb(MAT_DOOR, 1.6, 5.2, 0.22,  1.0, 0, bd / 2 + 0.08, g);
  // Bisagras / pomo
  sb(MAT_GOLD, 0.18, 0.18, 0.14, -0.15, 2.6, bd / 2 + 0.20, g);
  sb(MAT_GOLD, 0.18, 0.18, 0.14,  0.15, 2.6, bd / 2 + 0.20, g);

  // Ventanas frente (4 ventanas grandes)
  for (const xw of [-7.5, -3.0, 3.0, 7.5]) {
    sb(MAT_GLASS, 2.2, 3.0, 0.20, xw, 5.0, bd / 2 + 0.06, g);
    // Alféizar
    sb(MAT_STONE, 2.6, 0.25, 0.40, xw, 3.4, bd / 2 + 0.25, g);
  }

  // Ventanas laterales
  for (const zw of [-5, 0, 5]) {
    sb(MAT_GLASS, 0.20, 2.6, 2.2,  bw / 2 + 0.06, 5.0, zw, g);
    sb(MAT_GLASS, 0.20, 2.6, 2.2, -bw / 2 - 0.06, 5.0, zw, g);
  }

  // Reloj en torreta
  sb(MAT_STONE_D, 3.0, 3.0, 0.22, 0, bh + 0.8 + 3.0, td / 2 + 0.12, g);
  sb(MAT_GOLD,    2.4, 2.4, 0.16, 0, bh + 0.8 + 3.0, td / 2 + 0.24, g);
  // Agujas del reloj
  sb(MAT_STONE_D, 0.10, 0.85, 0.10, 0.4, bh + 0.8 + 3.2, td / 2 + 0.35, g);
  sb(MAT_STONE_D, 0.10, 0.65, 0.10, 0.0, bh + 0.8 + 2.9, td / 2 + 0.35, g);

  colliders.push({ x: cx, z: cz, sx: bw, sy: bh + 8, sz: bd });
  return g;
}

// ─── Camino de tierra ─────────────────────────────────────────────────────────
function buildPath(scene) {
  // Usa el mismo buildRoadFromPoints para consistencia visual
  const roads = [
    [{ x: 2, z: -69 }, { x: 2, z: -101 }],
    [{ x: 0, z: -101 }, { x: 0, z: -150 }],
    [{ x: -26, z: -118 }, { x: 26, z: -118 }],
    [{ x: -26, z: -132 }, { x: 26, z: -132 }],
  ];
  for (const pts of roads) buildRoadFromPoints(scene, pts, 3.8);
}

// ─── Helper: cuaternión para objeto plano orientado en XZ ────────────────────
// Evita el problema de Euler compuesto (rotation.x + rotation.y/z).
// Aplica: primero aplanar (Rx -90°), luego rotar en XZ (Ry ang).
const _qFlat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
const _qTmp  = new THREE.Quaternion();
const _vUp   = new THREE.Vector3(0, 1, 0);
function _flatQuat(ang) {
  _qTmp.setFromAxisAngle(_vUp, ang);
  return _qTmp.clone().multiply(_qFlat);
}

// Perpendicular a la derecha de un segmento (ang = atan2(dx, dz))
// Forward = (sin ang, 0, cos ang) → Right = (cos ang, 0, -sin ang)
function _perpRight(ang, dist, side) {
  return { x: Math.cos(ang) * dist * side, z: -Math.sin(ang) * dist * side };
}

// ─── Camino (polyline de puntos) ────────────────────────────────────────────
function buildRoadFromPoints(scene, points, width = 3.5) {
  if (!points || points.length < 2) return;
  const edgeW = 0.55;

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.1) continue;
    const ang = Math.atan2(dx, dz);
    const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;

    // ── Superficie del camino: PlaneGeometry con UVs escaladas ──────────────
    const geo = new THREE.PlaneGeometry(width, len + 0.08, 1, 1);
    // Escalar V para que la textura tile proporcional al largo real
    const uv = geo.attributes.uv;
    const vScale = (len / width) * 0.75;
    for (let j = 0; j < uv.count; j++) uv.setY(j, uv.getY(j) * vScale);
    uv.needsUpdate = true;

    const road = new THREE.Mesh(geo, MAT_PATH);
    road.quaternion.copy(_flatQuat(ang));
    road.position.set(mx, 0.022, mz);
    road.receiveShadow = true;
    scene.add(road);

    // ── Cunetas laterales ────────────────────────────────────────────────────
    for (const side of [-1, 1]) {
      const off = _perpRight(ang, width / 2 + edgeW / 2, side);
      const egeo = new THREE.PlaneGeometry(edgeW, len + 0.08);
      const edge = new THREE.Mesh(egeo, MAT_PATH_EDGE);
      edge.quaternion.copy(_flatQuat(ang));
      edge.position.set(mx + off.x, 0.010, mz + off.z);
      scene.add(edge);
    }
  }
}

const MAT_BANK = new THREE.MeshStandardMaterial({ color: 0x2a3a14, roughness: 1.0 });

// ─── Río (curva Catmull-Rom suavizada) ───────────────────────────────────────
function buildRiverFromPoints(scene, points, width = 6) {
  if (!points || points.length < 2) return;
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(p.x, 0, p.z))
  );
  // Sólo construir la parte cercana al pueblo
  const TOTAL_LEN  = curve.getLength();
  const BUILD_LEN  = Math.min(TOTAL_LEN, 500);
  const N          = Math.round(BUILD_LEN / 5);   // segmentos cada ~5 unidades
  const tMax       = BUILD_LEN / TOTAL_LEN;
  const cpts       = curve.getPoints(N);
  const nBuild     = Math.round(N * tMax);

  for (let i = 0; i < nBuild - 1; i++) {
    const a = cpts[i], b = cpts[i + 1];
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.sqrt(dx * dx + dz * dz) + 0.01;
    if (len < 0.5) continue;
    const ang = Math.atan2(dx, dz);
    const mx  = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
    const t   = i / nBuild;
    // Ancho levemente variable (meandros)
    const wVar = width * (0.88 + Math.sin(t * Math.PI * 4.3) * 0.15);

    // ── Cauce (tierra húmeda oscura, más ancho que el agua) ─────────────────
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(wVar + 2.8, 0.20, len + 0.1), MAT_RIVER_BED
    );
    bed.position.set(mx, -0.12, mz);
    bed.rotation.y = ang;
    scene.add(bed);

    // ── Orillas a cada lado (BoxGeometry: rotation.y = ang funciona directo) ─
    for (const side of [-1, 1]) {
      const bankW = 1.4 + Math.sin(t * 6.3 + side * 1.7) * 0.4;
      const off   = _perpRight(ang, wVar / 2 + bankW / 2, side);
      const bank  = new THREE.Mesh(
        new THREE.BoxGeometry(bankW, 0.10, len + 0.1), MAT_BANK
      );
      bank.position.set(mx + off.x, -0.03, mz + off.z);
      bank.rotation.y = ang;
      scene.add(bank);
    }

    // ── Superficie de agua: PlaneGeometry con quaternion correcto ────────────
    const wgeo = new THREE.PlaneGeometry(wVar, len + 0.1, 1, 1);
    // Escalar UVs para que la animación de flujo se vea correcta
    const uv = wgeo.attributes.uv;
    const vs = len / wVar * 0.5;
    for (let j = 0; j < uv.count; j++) uv.setY(j, uv.getY(j) * vs);
    uv.needsUpdate = true;

    const water = new THREE.Mesh(wgeo, MAT_RIVER);
    water.quaternion.copy(_flatQuat(ang));
    water.position.set(mx, 0.018, mz);
    scene.add(water);
  }
}

// ─── Plaza (superficie plana) ────────────────────────────────────────────────
function buildPlazaFloor(scene, cx, cz, w = 26, d = 18) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, d), MAT_PATH);
  m.position.set(cx, 0.01, cz);
  m.receiveShadow = true;
  scene.add(m);
}

// ─── Pozo ────────────────────────────────────────────────────────────────────
function buildWell(scene, cx, cz) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  sb(MAT_STONE, 1.8, 0.7, 1.8, 0, 0, 0, g);
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.05, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x1a5599, roughness: 0.2 })
  );
  water.position.set(0, 0.38, 0);
  g.add(water);
  for (const sx of [-0.7, 0.7]) {
    sb(MAT_WOOD, 0.12, 1.4, 0.12, sx, 0.7, 0, g);
  }
  sb(MAT_WOOD, 1.7, 0.12, 0.12, 0, 1.75, 0, g);
  scene.add(g);
  return g;
}

// ─── Árbol simple ────────────────────────────────────────────────────────────
function buildEditorTree(scene, cx, cz) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  sb(MAT_WOOD, 0.35, 2.2, 0.35, 0, 0, 0, g);
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.6, 3.2, 7),
    new THREE.MeshStandardMaterial({ color: 0x2a7a2a, roughness: 0.9 })
  );
  leaves.position.y = 3.8;
  leaves.castShadow = true;
  g.add(leaves);
  scene.add(g);
  return g;
}

// ─── API pública ──────────────────────────────────────────────────────────────
// El layout se lee de src/data/world_layout.json — editalo con editor.html
export function createVillage(scene, colliders) {
  _gates.length = 0;

  // ── Caminos y ríos ───────────────────────────────────────────────────────────
  for (const path of worldLayout.paths ?? []) {
    if (path.type === 'road')  buildRoadFromPoints(scene, path.points, path.width ?? 3.5);
    if (path.type === 'river') buildRiverFromPoints(scene, path.points, path.width ?? 6);
  }

  // ── Edificios y objetos ──────────────────────────────────────────────────────
  for (const obj of worldLayout.objects ?? []) {
    const ryRad = obj.ry ? obj.ry * Math.PI / 180 : 0;
    switch (obj.type) {
      case 'church':
        _trySwap(scene, buildChurch(scene, colliders, obj.x, obj.z), '/models/church.glb');
        break;
      case 'townhall':
        _trySwap(scene, buildTownHall(scene, colliders, obj.x, obj.z), '/models/nuevocityhall.glb');
        break;
      case 'house':
        _trySwap(scene, buildHouse(scene, colliders, obj.x, obj.z, ryRad), '/models/nuevacasa.glb');
        break;
      case 'farm':
        _trySwap(scene, buildFarm(scene, colliders, obj.x, obj.z), '/models/farm.glb');
        break;
      case 'corral':
        _trySwap(scene, buildCorral(scene, colliders, obj.x, obj.z), '/models/corral.glb');
        break;
      case 'cowcorral':
        _trySwap(scene, buildCowCorral(scene, colliders, obj.x, obj.z), '/models/cow_corral.glb');
        break;
      case 'plaza':
        buildPlazaFloor(scene, obj.x, obj.z, obj.w ?? 26, obj.d ?? 18);
        break;
      case 'well':
        buildWell(scene, obj.x, obj.z);
        break;
      case 'tree':
        buildEditorTree(scene, obj.x, obj.z);
        break;
    }
  }
}
