// campesinos.js — 5 NPCs campesinos formoseños, voxel art, patrulla el pueblo
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── GLB swap — si existe /models/campesino.glb reemplaza el procedural ────────
let _tpl     = null;
let _pending = [];
new GLTFLoader().load('/models/campesino.glb',
  g => { _tpl = g.scene; _pending.forEach(_applyGLB); _pending = []; },
  undefined,
  () => { _pending = []; }
);
function _applyGLB(root) {
  root.children.slice().forEach(c => { if (!c._keep) root.remove(c); });
  const vis = _tpl.clone(true);
  vis.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  root.add(vis);
  root._legs = [];  // sin animación procedural de piernas
}

// ─── Paletas formoseñas ────────────────────────────────────────────────────────
const CHARS = [
  {
    name: 'Ramón',
    skin: 0x8B4513, shirt: 0xC4773A, shirt2: 0xF0C080,
    pants: 0x2C3E6B, hat: 0xD4A830, boot: 0x3A2010,
  },
  {
    name: 'Ofelia',
    skin: 0x7B3810, shirt: 0xD05030, shirt2: 0xF8D090,
    pants: 0x1A2A3A, hat: 0xC89820, boot: 0x2A1808,
  },
  {
    name: 'Facundo',
    skin: 0x9B5523, shirt: 0x405080, shirt2: 0x8090B8,
    pants: 0x1E2E1E, hat: 0xC8A028, boot: 0x302010,
  },
  {
    name: 'Celestino',
    skin: 0x6B3010, shirt: 0x487838, shirt2: 0x90B870,
    pants: 0x282818, hat: 0xBE9820, boot: 0x281808,
  },
  {
    name: 'Zulma',
    skin: 0x8B5523, shirt: 0xB04060, shirt2: 0xE8A0B0,
    pants: 0x18181E, hat: 0xD0B030, boot: 0x302018,
  },
];

// ─── Rutas de patrulla (ida y vuelta) ─────────────────────────────────────────
// Pueblo: iglesia en (0,-100), ayuntamiento en (0,-145), casas en (±26,-118/132)
const PATROLS = [
  { from: { x: -7, z: -106 }, to: { x:  7, z: -106 } },   // Ramón — entrada iglesia
  { from: { x: 14, z: -118 }, to: { x: 14, z: -132 } },   // Ofelia — calle este
  { from: { x:-14, z: -118 }, to: { x:-14, z: -132 } },   // Facundo — calle oeste
  { from: { x: -6, z: -138 }, to: { x:  6, z: -138 } },   // Celestino — plaza sur
  { from: { x:  0, z: -143 }, to: { x:  0, z: -150 } },   // Zulma — ayuntamiento
];

// ─── Constructor del modelo voxel ─────────────────────────────────────────────
function buildCampesino(char) {
  const root = new THREE.Group();

  const mk = (col, w, h, d, x, y, z) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.88 })
    );
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  // ── Piernas (pivotes para animación) ────────────────────────────────────────
  const legs = [];
  for (const side of [-1, 1]) {
    const piv = new THREE.Group();
    piv.position.set(side * 0.12, 0.52, 0);
    // pantorrilla
    const shin = mk(char.pants, 0.20, 0.50, 0.18, 0, -0.25, 0);
    shin.name = 'shin';
    // bota
    const boot = mk(char.boot,  0.22, 0.14, 0.22, 0, -0.52, 0.02);
    piv.add(shin, boot);
    root.add(piv);
    legs.push({ piv, phase: side > 0 ? 0 : Math.PI });
  }

  // ── Torso ─────────────────────────────────────────────────────────────────
  const torso = new THREE.Group();
  torso.position.set(0, 0.78, 0);
  // Cuerpo base (color camisa 1)
  torso.add(mk(char.shirt,  0.50, 0.52, 0.26, 0, 0, 0));
  // Cuadros de camisa (tiras verticales de color 2)
  torso.add(mk(char.shirt2, 0.12, 0.52, 0.28, -0.14, 0, 0));
  torso.add(mk(char.shirt2, 0.12, 0.52, 0.28,  0.14, 0, 0));
  // Botones centrales
  for (let i = -1; i <= 1; i++) {
    torso.add(mk(0x2a1800, 0.05, 0.05, 0.05, 0, i * 0.14, 0.14));
  }
  root.add(torso);

  // ── Brazos ────────────────────────────────────────────────────────────────
  const armPivs = [];
  for (const side of [-1, 1]) {
    const apiv = new THREE.Group();
    apiv.position.set(side * 0.34, 1.18, 0);
    apiv.add(mk(char.shirt, 0.17, 0.40, 0.16, 0, -0.20, 0));
    apiv.add(mk(char.skin,  0.16, 0.14, 0.15, 0, -0.42, 0));  // mano
    root.add(apiv);
    armPivs.push({ piv: apiv, phase: side > 0 ? Math.PI : 0 });
  }

  // ── Cuello + cabeza ───────────────────────────────────────────────────────
  root.add(mk(char.skin, 0.16, 0.14, 0.14, 0, 1.36, 0));   // cuello
  const head = mk(char.skin, 0.38, 0.36, 0.34, 0, 1.60, 0);
  root.add(head);
  // Ojos
  root.add(mk(0x1a0800, 0.07, 0.06, 0.04, -0.10, 1.63,  0.18));
  root.add(mk(0x1a0800, 0.07, 0.06, 0.04,  0.10, 1.63,  0.18));
  // Bigote (solo los hombres — Ramón, Facundo, Celestino)
  if (char.name !== 'Ofelia' && char.name !== 'Zulma') {
    root.add(mk(0x2a1000, 0.22, 0.05, 0.04, 0, 1.52, 0.18));
  }

  // ── Sombrero de paja ──────────────────────────────────────────────────────
  root.add(mk(char.hat, 0.70, 0.06, 0.66, 0, 1.82, 0));   // ala
  root.add(mk(char.hat, 0.36, 0.22, 0.33, 0, 1.94, 0));   // copa
  // Cinta del sombrero
  root.add(mk(0x5a2808, 0.38, 0.06, 0.35, 0, 1.83, 0));

  root._legs    = legs;
  root._armPivs = armPivs;
  root._torso   = torso;
  root._walkT   = 0;

  return root;
}

// ─── Nombre flotante (sprite) ─────────────────────────────────────────────────
function makeLabel(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 48;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.roundRect(4, 4, 248, 40, 8);
  ctx.fill();
  ctx.fillStyle = '#f0e0b0';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name, 128, 30);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sp  = new THREE.Sprite(mat);
  sp.scale.set(1.6, 0.32, 1);
  sp.position.set(0, 2.2, 0);
  sp.visible = false;
  return sp;
}

// ─── Sistema principal ────────────────────────────────────────────────────────
export class CampesinoSystem {
  constructor(scene) {
    this._npcs = [];
    this._scene = scene;

    CHARS.forEach((char, i) => {
      const patrol = PATROLS[i];
      const root   = buildCampesino(char);

      // Posición inicial = mitad del patrol
      root.position.set(
        (patrol.from.x + patrol.to.x) / 2,
        0,
        (patrol.from.z + patrol.to.z) / 2
      );
      root.rotation.y = Math.random() * Math.PI * 2;

      const label = makeLabel(char.name);
      root.add(label);

      scene.add(root);

      // GLB swap
      if (_tpl) _applyGLB(root);
      else _pending.push(root);

      this._npcs.push({
        root, label,
        patrol,
        t: Math.random(),          // posición inicial aleatoria en el patrol
        dir: Math.random() > 0.5 ? 1 : -1,
        speed: 0.55 + Math.random() * 0.25,
        walkT: Math.random() * 10,
        pauseT: 0,                 // segundos de pausa en extremos del patrol
        name: char.name,
      });
    });
  }

  update(dt, playerPos) {
    for (const npc of this._npcs) {
      const { root, patrol, label } = npc;

      // ── Mostrar nombre si el jugador está cerca ─────────────────────────
      if (playerPos) {
        const dx = root.position.x - playerPos.x;
        const dz = root.position.z - playerPos.z;
        label.visible = (dx * dx + dz * dz) < 36;  // 6u radio
      }

      // ── Pausa en extremos ───────────────────────────────────────────────
      if (npc.pauseT > 0) {
        npc.pauseT -= dt;
        // Animación idle: respiración en torso
        if (root._torso) root._torso.scale.y = 1 + Math.sin(npc.walkT * 1.5) * 0.018;
        npc.walkT += dt;
        continue;
      }

      // ── Avanzar por el patrol ───────────────────────────────────────────
      const fx = patrol.to.x - patrol.from.x;
      const fz = patrol.to.z - patrol.from.z;
      const patLen = Math.sqrt(fx * fx + fz * fz);

      npc.t += (npc.speed / Math.max(patLen, 0.01)) * dt * npc.dir;

      if (npc.t >= 1) { npc.t = 1; npc.dir = -1; npc.pauseT = 0.8 + Math.random() * 1.2; }
      if (npc.t <= 0) { npc.t = 0; npc.dir =  1; npc.pauseT = 0.8 + Math.random() * 1.2; }

      root.position.x = patrol.from.x + fx * npc.t;
      root.position.z = patrol.from.z + fz * npc.t;

      // Orientar hacia la dirección de movimiento
      if (patLen > 0.01) {
        const targetRY = Math.atan2(fx * npc.dir, fz * npc.dir);
        let diff = targetRY - root.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        root.rotation.y += diff * Math.min(1, 8 * dt);
      }

      // ── Animación de caminata ───────────────────────────────────────────
      npc.walkT += dt * npc.speed * 3.5;
      const freq = 2.8;
      const amp  = 0.32;

      for (const leg of root._legs) {
        leg.piv.rotation.x = Math.sin(npc.walkT * freq + leg.phase) * amp;
      }
      for (const arm of root._armPivs) {
        arm.piv.rotation.x = Math.sin(npc.walkT * freq + arm.phase) * (amp * 0.6);
      }
      // Bob del cuerpo
      root.position.y = Math.abs(Math.sin(npc.walkT * freq)) * 0.022;
    }
  }

  // Devuelve el nombre del NPC más cercano dentro de radio, o null
  getNearby(px, pz, radius = 5) {
    for (const npc of this._npcs) {
      const dx = npc.root.position.x - px;
      const dz = npc.root.position.z - pz;
      if (dx * dx + dz * dz < radius * radius) return npc.name;
    }
    return null;
  }
}
