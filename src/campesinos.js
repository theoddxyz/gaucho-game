// campesinos.js — 5 NPCs campesinos formoseños, voxel art, patrullan el pueblo
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── GLB swap ────────────────────────────────────────────────────────────────
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
  root._legs = [];
}

// ─── Paletas y rasgos por personaje ──────────────────────────────────────────
const CHARS = [
  {
    name: 'Ramón',
    skin: 0x8B4513, shirt: 0xC4773A, shirt2: 0xF0C080,
    pants: 0x2C3E6B, hat: 0xD4A830, boot: 0x3A2010,
    scale: 1.04, wM: 1.22,  // robusto y ancho
    bigote: true, poncho: true, tool: 'shovel',
    speed: 0.54,
  },
  {
    name: 'Ofelia',
    skin: 0x7B3810, shirt: 0xD05030, shirt2: 0xF8D090,
    pants: 0x602038, hat: 0xC89820, boot: 0x2A1808,
    scale: 0.90, wM: 0.90,  // delgada y baja
    bigote: false, skirt: true, trenza: true, tool: 'none',
    speed: 0.51,
  },
  {
    name: 'Facundo',
    skin: 0x9B5523, shirt: 0x405080, shirt2: 0x8090B8,
    pants: 0x1E2E1E, hat: 0xC8A028, boot: 0x302010,
    scale: 1.13, wM: 1.12,  // el más alto
    bigote: true, beard: true, tool: 'pitchfork',
    speed: 0.47,
  },
  {
    name: 'Celestino',
    skin: 0x6B3010, shirt: 0x487838, shirt2: 0x90B870,
    pants: 0x282818, hat: 0xBE9820, boot: 0x281808,
    scale: 0.86, wM: 0.97,  // el más bajo / mayor
    bigote: true, grayHair: true, tool: 'cane',
    speed: 0.43,
  },
  {
    name: 'Zulma',
    skin: 0x8B5523, shirt: 0xB04060, shirt2: 0xE8A0B0,
    pants: 0x18181E, hat: 0xD0B030, boot: 0x302018,
    scale: 0.95, wM: 0.94,
    bigote: false, skirt: true, ponytail: true, apron: true, tool: 'none',
    speed: 0.53,
  },
];

// ─── Rutas de patrulla (ida y vuelta) ─────────────────────────────────────────
const PATROLS = [
  { from: { x: -7, z: -106 }, to: { x:  7, z: -106 } },   // Ramón   — entrada iglesia
  { from: { x: 14, z: -118 }, to: { x: 14, z: -132 } },   // Ofelia  — calle este
  { from: { x:-14, z: -118 }, to: { x:-14, z: -132 } },   // Facundo — calle oeste
  { from: { x: -6, z: -138 }, to: { x:  6, z: -138 } },   // Celestino — plaza sur
  { from: { x:  0, z: -143 }, to: { x:  0, z: -150 } },   // Zulma  — ayuntamiento
];

// ─── Constructor voxel ────────────────────────────────────────────────────────
function buildCampesino(char) {
  const root = new THREE.Group();
  const wM = char.wM ?? 1.0;

  const mk = (col, w, h, d, x, y, z) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.88 })
    );
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  // ── Piernas (en root — la animación de cadera no las arrastra) ───────────────
  const legs = [];
  for (const side of [-1, 1]) {
    const piv = new THREE.Group();
    piv.position.set(side * 0.13 * wM, 0.52, 0);
    piv.add(mk(char.pants, 0.21 * wM, 0.50, 0.19, 0, -0.25, 0));  // pantorrilla
    piv.add(mk(char.boot,  0.23 * wM, 0.14, 0.23, 0, -0.52, 0.02)); // bota
    root.add(piv);
    legs.push({ piv, phase: side > 0 ? 0 : Math.PI });
  }

  // Pollera/falda (si aplica) — en root a nivel de cintura
  if (char.skirt) {
    root.add(mk(char.pants, 0.56 * wM, 0.54, 0.32, 0, 0.27, 0));
    root.add(mk(char.shirt2, 0.58 * wM, 0.08, 0.34, 0, 0.06, 0));  // franja
  }

  // ── Hip group — torso + brazos + cabeza, gira levemente en Y ────────────────
  const hipGroup = new THREE.Group();
  root.add(hipGroup);

  // ── Torso ─────────────────────────────────────────────────────────────────
  const torso = new THREE.Group();
  torso.position.set(0, 0.78, 0);
  hipGroup.add(torso);

  torso.add(mk(char.shirt, 0.52 * wM, 0.52, 0.27, 0, 0, 0));

  if (char.poncho) {
    // Poncho: franjas horizontales superpuestas
    torso.add(mk(char.shirt2, 0.64 * wM, 0.44, 0.10, 0,  0.02,  0.09));
    torso.add(mk(char.shirt2, 0.64 * wM, 0.44, 0.10, 0,  0.02, -0.09));
    torso.add(mk(0xc07020,    0.66 * wM, 0.07, 0.12, 0,  0.22,  0.00)); // franja superior
  } else if (char.apron) {
    // Cuadros de camisa + delantal frontal
    torso.add(mk(char.shirt2, 0.13, 0.52, 0.28, -0.15 * wM, 0, 0));
    torso.add(mk(char.shirt2, 0.13, 0.52, 0.28,  0.15 * wM, 0, 0));
    torso.add(mk(0xf0e0b0, 0.30, 0.48, 0.05, 0, 0, 0.15));  // delantal
    torso.add(mk(0xd0c090, 0.34, 0.06, 0.06, 0, 0.23, 0.16)); // bolsillo
  } else {
    // Cuadros de camisa estándar
    torso.add(mk(char.shirt2, 0.13, 0.52, 0.28, -0.15 * wM, 0, 0));
    torso.add(mk(char.shirt2, 0.13, 0.52, 0.28,  0.15 * wM, 0, 0));
    // Botones
    for (let i = -1; i <= 1; i++) {
      torso.add(mk(0x2a1800, 0.05, 0.05, 0.05, 0, i * 0.14, 0.14));
    }
  }

  // ── Brazos ────────────────────────────────────────────────────────────────
  const armPivs = [];
  for (const side of [-1, 1]) {
    const apiv = new THREE.Group();
    apiv.position.set(side * (0.34 * wM + 0.02), 1.18, 0);
    apiv.add(mk(char.shirt, 0.17, 0.40, 0.17, 0, -0.20, 0));  // antebrazo
    apiv.add(mk(char.skin,  0.17, 0.14, 0.16, 0, -0.42, 0));  // mano
    hipGroup.add(apiv);
    armPivs.push({ piv: apiv, phase: side > 0 ? Math.PI : 0 });
  }

  // ── Head pivot — gira solo en Y para seguir al jugador ───────────────────
  // Posicionado en la base del cuello (y=1.36 en root-space)
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.36, 0);
  hipGroup.add(headPivot);

  // Cuello
  headPivot.add(mk(char.skin, 0.17, 0.14, 0.15, 0, 0.00, 0));
  // Cabeza
  headPivot.add(mk(char.skin, 0.40 * wM, 0.38, 0.36, 0, 0.24, 0));
  // Ojos
  headPivot.add(mk(0x1a0800, 0.08, 0.07, 0.04, -0.11, 0.27, 0.19));
  headPivot.add(mk(0x1a0800, 0.08, 0.07, 0.04,  0.11, 0.27, 0.19));

  // Bigote
  if (char.bigote) {
    headPivot.add(mk(0x2a1000, 0.26, 0.06, 0.04, 0, 0.16, 0.19));
  }
  // Barba (Facundo)
  if (char.beard) {
    headPivot.add(mk(0x1a0c06, 0.32, 0.16, 0.06, 0, 0.08, 0.18));
    headPivot.add(mk(0x1a0c06, 0.14, 0.22, 0.06, -0.13, 0.16, 0.17));
    headPivot.add(mk(0x1a0c06, 0.14, 0.22, 0.06,  0.13, 0.16, 0.17));
  }
  // Cabello gris (Celestino)
  if (char.grayHair) {
    headPivot.add(mk(0xc0b8a0, 0.44, 0.10, 0.38, 0, 0.46, 0));    // corona
    headPivot.add(mk(0xc0b8a0, 0.10, 0.22, 0.38, -0.22, 0.36, 0)); // sien izq
    headPivot.add(mk(0xc0b8a0, 0.10, 0.22, 0.38,  0.22, 0.36, 0)); // sien der
  }
  // Trenza (Ofelia) — baja por la espalda
  if (char.trenza) {
    headPivot.add(mk(0x3a1800, 0.12, 0.20, 0.12,  0.02,  0.24, -0.20));
    headPivot.add(mk(0x3a1800, 0.10, 0.30, 0.10,  0.02,  0.02, -0.19));
    headPivot.add(mk(0x3a1800, 0.08, 0.16, 0.08,  0.02, -0.14, -0.17));  // punta
    headPivot.add(mk(char.shirt, 0.07, 0.07, 0.07, 0.02, -0.23, -0.16)); // gomita
  }
  // Cola de caballo (Zulma)
  if (char.ponytail) {
    headPivot.add(mk(0x2a1000, 0.12, 0.12, 0.12, 0.02,  0.43, -0.19)); // base
    headPivot.add(mk(0x2a1000, 0.09, 0.28, 0.09, 0.03,  0.22, -0.23)); // caída
    headPivot.add(mk(char.shirt2, 0.07, 0.07, 0.07, 0.03, 0.10, -0.21)); // gomita
  }

  // Sombrero de paja
  headPivot.add(mk(char.hat, 0.72, 0.07, 0.68, 0, 0.46, 0));   // ala
  headPivot.add(mk(char.hat, 0.38, 0.24, 0.35, 0, 0.58, 0));   // copa
  headPivot.add(mk(0x5a2808, 0.40, 0.07, 0.37, 0, 0.47, 0));   // cinta

  // ── Herramientas ──────────────────────────────────────────────────────────
  if (char.tool === 'shovel') {
    // Pala en brazo derecho (armPivs[1], side=+1)
    const g = new THREE.Group();
    g.position.set(0, -0.18, 0);
    g.add(mk(0x7a4820, 0.07, 0.68, 0.07, 0, -0.34, 0));     // mango
    g.add(mk(0x9098a8, 0.23, 0.04, 0.04, 0, -0.70, -0.03)); // cuello
    g.add(mk(0x9098a8, 0.22, 0.22, 0.04, 0, -0.78, -0.02)); // hoja
    armPivs[1].piv.add(g);
    root._toolGroup = g;
  }
  if (char.tool === 'pitchfork') {
    // Horca en brazo izquierdo (armPivs[0], side=-1)
    const g = new THREE.Group();
    g.position.set(0, -0.18, 0);
    g.add(mk(0x7a4820, 0.07, 0.78, 0.07,  0.00, -0.39, 0));  // mango
    g.add(mk(0x9098a8, 0.28, 0.04, 0.04,  0.00, -0.72, 0));  // travesaño
    g.add(mk(0x9098a8, 0.04, 0.22, 0.04, -0.10, -0.80, 0));  // púa izq
    g.add(mk(0x9098a8, 0.04, 0.22, 0.04,  0.00, -0.80, 0));  // púa centro
    g.add(mk(0x9098a8, 0.04, 0.22, 0.04,  0.10, -0.80, 0));  // púa der
    armPivs[0].piv.add(g);
    root._toolGroup = g;
  }
  if (char.tool === 'cane') {
    // Bastón en root — no se anima con el brazo, siempre apoyado
    const g = new THREE.Group();
    g.position.set(0.45 * wM, 0.88, 0.08);
    g.rotation.z = 0.18;
    g.add(mk(0x7a4820, 0.07, 0.86, 0.07, 0, -0.43, 0));  // caña
    g.add(mk(0x7a4820, 0.18, 0.07, 0.07, 0.07, 0.06, 0)); // mango en L
    root.add(g);
    root._caneGroup = g;
  }

  root.scale.setScalar((char.scale ?? 1.0) * 1.25);

  root._legs      = legs;
  root._armPivs   = armPivs;
  root._torso     = torso;
  root._hipGroup  = hipGroup;
  root._headPivot = headPivot;

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

// ─── Idle: mira a los costados aleatoriamente ─────────────────────────────────
function _idleLook(npc, root, dt) {
  npc.idleLookTimer -= dt;
  if (npc.idleLookTimer <= 0) {
    npc.idleLookTarget = (Math.random() - 0.5) * 1.1;
    npc.idleLookTimer  = 2.5 + Math.random() * 4.0;
  }
  if (root._headPivot) {
    root._headPivot.rotation.y +=
      (npc.idleLookTarget - root._headPivot.rotation.y) * Math.min(1, 1.8 * dt);
  }
}

// ─── Sistema principal ────────────────────────────────────────────────────────
export class CampesinoSystem {
  constructor(scene) {
    this._npcs  = [];
    this._scene = scene;

    CHARS.forEach((char, i) => {
      const patrol = PATROLS[i];
      const root   = buildCampesino(char);

      root.position.set(
        (patrol.from.x + patrol.to.x) / 2,
        0,
        (patrol.from.z + patrol.to.z) / 2
      );
      root.rotation.y = Math.random() * Math.PI * 2;

      const label = makeLabel(char.name);
      label._keep  = true;  // no lo elimina el GLB swap
      root.add(label);

      scene.add(root);

      if (_tpl) _applyGLB(root);
      else _pending.push(root);

      this._npcs.push({
        root, label, patrol,
        t:     Math.random(),
        dir:   Math.random() > 0.5 ? 1 : -1,
        speed: char.speed ?? 0.52,
        walkT: Math.random() * 10,
        pauseT: 0,
        name: char.name,
        idleLookTimer:  Math.random() * 3,
        idleLookTarget: 0,
      });
    });
  }

  // units: array de UnitState de SoulSystem (opcional — si no se pasa, modo legacy patrol)
  update(dt, playerPos, units) {
    for (let i = 0; i < this._npcs.length; i++) {
      const npc  = this._npcs[i];
      const unit = units ? units[i] : null;
      const { root, label } = npc;

      // ── Posición desde souls.js ───────────────────────────────────────────
      if (unit) {
        root.position.x = unit.terraPos.x;
        root.position.z = unit.terraPos.y;   // terraPos.y → 3D z
        root.position.y = 0;
      }

      // ── Mostrar nombre si el jugador está cerca ───────────────────────────
      if (playerPos) {
        const dx = root.position.x - playerPos.x;
        const dz = root.position.z - playerPos.z;
        label.visible = (dx * dx + dz * dz) < 36;
      }

      // ── Head tracking o idle look ─────────────────────────────────────────
      if (root._headPivot) {
        const nearPlayer = playerPos && (() => {
          const dx = playerPos.x - root.position.x;
          const dz = playerPos.z - root.position.z;
          return dx * dx + dz * dz < 64;
        })();

        if (nearPlayer) {
          const dx = playerPos.x - root.position.x;
          const dz = playerPos.z - root.position.z;
          let local = Math.atan2(dx, dz) - root.rotation.y;
          while (local >  Math.PI) local -= Math.PI * 2;
          while (local < -Math.PI) local += Math.PI * 2;
          const target = Math.max(-0.85, Math.min(0.85, local));
          root._headPivot.rotation.y +=
            (target - root._headPivot.rotation.y) * Math.min(1, 4 * dt);
        } else {
          _idleLook(npc, root, dt);
        }
      }

      // ── Estado de sueño ───────────────────────────────────────────────────
      if (unit && unit.isSleeping) {
        // Pose agachada: doblar cadera
        if (root._hipGroup) {
          root._hipGroup.rotation.x +=
            (-0.6 - root._hipGroup.rotation.x) * Math.min(1, 4 * dt);
        }
        if (root._torso) root._torso.scale.y = 1 + Math.sin(npc.walkT * 0.8) * 0.015;
        npc.walkT += dt;
        continue;
      }

      // Resetear cadera si venía durmiendo
      if (root._hipGroup && root._hipGroup.rotation.x < -0.05) {
        root._hipGroup.rotation.x += (0 - root._hipGroup.rotation.x) * Math.min(1, 6 * dt);
      }

      // ── Velocidad del alma ────────────────────────────────────────────────
      const speed = unit
        ? Math.sqrt(unit.terraVel.x ** 2 + unit.terraVel.y ** 2)
        : npc.speed;

      const isWalking = speed > 0.05;

      // ── Orientar hacia dirección de movimiento ────────────────────────────
      if (unit && isWalking) {
        const targetRY = Math.atan2(unit.terraVel.x, unit.terraVel.y);
        let diff = targetRY - root.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        root.rotation.y += diff * Math.min(1, 8 * dt);
      }

      // ── Idle (parado) ─────────────────────────────────────────────────────
      if (!isWalking) {
        if (root._torso) root._torso.scale.y = 1 + Math.sin(npc.walkT * 1.5) * 0.018;
        if (root._hipGroup) root._hipGroup.rotation.y *= Math.max(0, 1 - 3 * dt);
        npc.walkT += dt;
        continue;
      }

      // ── Animación de caminata ─────────────────────────────────────────────
      npc.walkT += dt * speed * 3.5;
      const freq = 2.8;
      const amp  = 0.32;

      for (const leg of root._legs) {
        leg.piv.rotation.x = Math.sin(npc.walkT * freq + leg.phase) * amp;
      }
      for (const arm of root._armPivs) {
        arm.piv.rotation.x = Math.sin(npc.walkT * freq + arm.phase) * (amp * 0.52);
      }
      if (root._hipGroup) {
        root._hipGroup.rotation.y = Math.sin(npc.walkT * freq * 0.5) * 0.08;
      }
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
