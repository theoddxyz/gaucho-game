// village.js — Pueblo procedural cerca del spawn (x≈3.8, z≈-69)
// Contiene: iglesia, ayuntamiento, 5 casas con granja cada una
// Cada edificio busca su GLB en /public/models/ — si existe lo usa, si no usa procedural
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
const MAT_PATH    = new THREE.MeshStandardMaterial({ color: 0x8a7050, roughness: 1.00 });

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
function buildFarm(scene, cx, cz, fw = 18, fd = 14) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  const hw = fw / 2, hd = fd / 2;

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

  // Cerco perimetral (con hueco al sur = portón)
  fence(g, -hw, -hd, -2.2,  -hd);
  fence(g,  2.2, -hd,  hw,  -hd);
  fence(g, -hw,  hd,   hw,   hd);
  fence(g, -hw, -hd,  -hw,   hd);
  fence(g,  hw, -hd,   hw,   hd);

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

// ─── Corral de gallinas ───────────────────────────────────────────────────────
function buildCorral(scene, cx, cz, cw = 10, cd = 10) {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  scene.add(g);

  const hw = cw / 2, hd = cd / 2;

  // Suelo tierra apisonada
  sb(MAT_DIRT, cw, 0.08, cd, 0, 0, 0, g);

  // Abrevadero (comedero)
  sb(MAT_WOOD,  2.2, 0.5, 0.7,  hw - 1.5, 0, 0, g);
  sb(MAT_STONE, 1.8, 0.3, 0.4,  hw - 1.5, 0.5, 0, g);

  // Cerco perimetral completamente cerrado (sin hueco — las gallinas no escapan)
  fence(g, -hw, -hd,  hw, -hd);   // norte completo
  fence(g, -hw,  hd,  hw,  hd);   // sur
  fence(g, -hw, -hd, -hw,  hd);   // oeste
  fence(g,  hw, -hd,  hw,  hd);   // este

  // Pequeño gallinero (caseta) en esquina sur
  const hen = new THREE.Group();
  hen.position.set(-hw + 2.0, 0, hd - 2.0);
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
  const segs = [
    // Sendero del spawn (z=-69) hacia el sur hasta la entrada del pueblo (z=-100)
    { x: 2,  z: -85,  w: 3.5, d: 32 },
    // Calle principal N-S a través del pueblo
    { x: 0,  z: -125, w: 4,   d: 50 },
    // Calle transversal norte (frente casas 1-2)
    { x: 0,  z: -118, w: 52,  d: 3.5 },
    // Calle transversal sur (frente casas 3-4)
    { x: 0,  z: -132, w: 52,  d: 3.5 },
    // Plaza central (entre iglesia y ayuntamiento)
    { x: 0,  z: -122, w: 26,  d: 18 },
  ];
  for (const s of segs) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(s.w, 0.07, s.d), MAT_PATH);
    m.position.set(s.x, 0.01, s.z);
    m.receiveShadow = true;
    scene.add(m);
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────
// Village center ≈ (0, -125)  →  z=-101 a z=-162, x=-52 a +52
// Libre del shack (4.8, -52.9) y el lago  →  mínimo 48u de clearance
// Libre de los edificios de world.js (todos en z > -45)  →  56u de clearance
export function createVillage(scene, colliders) {
  buildPath(scene);

  // ── Iglesia ──────────────────────────────────────────────────────────────────
  _trySwap(scene, buildChurch(scene, colliders, 0, -100), '/models/church.glb');

  // ── Ayuntamiento ─────────────────────────────────────────────────────────────
  _trySwap(scene, buildTownHall(scene, colliders, 0, -145), '/models/townhall.glb');

  // ── Casas + granjas + corrales ────────────────────────────────────────────────
  _trySwap(scene, buildHouse(scene, colliders,  26, -118, 0), '/models/house.glb');
  _trySwap(scene, buildFarm (scene,  44, -118),               '/models/farm.glb');
  _trySwap(scene, buildCorral(scene,  44, -133),              '/models/corral.glb');

  _trySwap(scene, buildHouse(scene, colliders, -26, -118, 0), '/models/house.glb');
  _trySwap(scene, buildFarm (scene, -44, -118),               '/models/farm.glb');
  _trySwap(scene, buildCorral(scene, -44, -133),              '/models/corral.glb');

  _trySwap(scene, buildHouse(scene, colliders,  26, -132, 0), '/models/house.glb');
  _trySwap(scene, buildFarm (scene,  44, -132),               '/models/farm.glb');
  _trySwap(scene, buildCorral(scene,  44, -147),              '/models/corral.glb');

  _trySwap(scene, buildHouse(scene, colliders, -26, -132, 0), '/models/house.glb');
  _trySwap(scene, buildFarm (scene, -44, -132),               '/models/farm.glb');
  _trySwap(scene, buildCorral(scene, -44, -147),              '/models/corral.glb');

  _trySwap(scene, buildHouse(scene, colliders, 0, -158, 0), '/models/house.glb');
  _trySwap(scene, buildFarm (scene, 0, -174),               '/models/farm.glb');
  _trySwap(scene, buildCorral(scene, 0, -189),              '/models/corral.glb');
}
