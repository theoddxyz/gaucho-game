// campesinos.js — NPCs gusano, patrullan el pueblo
import * as THREE from 'three';

// ─── Constantes del gusano ────────────────────────────────────────────────────
const SEG_COUNT  = 10;
const SPACING    = 0.30;   // distancia entre segmentos
const BASE_R     = 0.18;   // radio base del tubo

function segRadius(i) {
  const t = i / (SEG_COUNT - 1);
  return BASE_R * (0.45 + Math.sin(t * Math.PI) * 1.1);
}

// ─── Paleta por personaje ─────────────────────────────────────────────────────
const CHARS = [
  { name: 'Ramón',     color: 0x2e7d32, eyeColor: 0x111111, speed: 0.54 },
  { name: 'Ofelia',    color: 0x6a1e6e, eyeColor: 0x220022, speed: 0.51 },
  { name: 'Facundo',   color: 0x1a4a6e, eyeColor: 0x001122, speed: 0.47 },
  { name: 'Celestino', color: 0x7a5010, eyeColor: 0x221100, speed: 0.43 },
  { name: 'Zulma',     color: 0x8a1a1a, eyeColor: 0x220000, speed: 0.53 },
];

// ─── Rutas de patrulla ────────────────────────────────────────────────────────
const PATROLS = [
  { from: { x: -7, z: -106 }, to: { x:  7, z: -106 } },
  { from: { x: 14, z: -118 }, to: { x: 14, z: -132 } },
  { from: { x:-14, z: -118 }, to: { x:-14, z: -132 } },
  { from: { x: -6, z: -138 }, to: { x:  6, z: -138 } },
  { from: { x:  0, z: -143 }, to: { x:  0, z: -150 } },
];

// ─── Constructor gusano ───────────────────────────────────────────────────────
function buildWorm(char) {
  const root  = new THREE.Group();
  const color = char.color;

  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.38, metalness: 0.08,
  });

  // Tubo (geometría se regenera cada frame)
  const initPts = [];
  for (let i = 0; i < SEG_COUNT; i++)
    initPts.push(new THREE.Vector3(0, 0.3, -i * SPACING));
  const curve   = new THREE.CatmullRomCurve3(initPts);
  const initGeo = new THREE.TubeGeometry(curve, SEG_COUNT * 3, BASE_R, 8, false);
  const tube    = new THREE.Mesh(initGeo, mat);
  tube.castShadow = true;
  root.add(tube);

  // Cabeza — esfera visible
  const headR   = segRadius(0) * 1.35;
  const headGeo = new THREE.SphereGeometry(headR, 20, 16);
  const head    = new THREE.Mesh(headGeo, mat.clone());
  head.castShadow = true;
  root.add(head);

  // Ojos
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const pupilMat    = new THREE.MeshStandardMaterial({ color: char.eyeColor });
  const eyeR  = headR * 0.28;
  const pupR  = eyeR  * 0.55;
  for (const sx of [-1, 1]) {
    const eye   = new THREE.Mesh(new THREE.SphereGeometry(eyeR,  10, 10), eyeWhiteMat);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(pupR,   8,  8), pupilMat);
    pupil.position.set(0, 0, eyeR * 0.72);
    eye.add(pupil);
    head.add(eye);
    eye.position.set(sx * headR * 0.50, headR * 0.32, headR * 0.82);
  }

  // Segmentos �� posiciones mundo (absolute)
  const segs = [];
  for (let i = 0; i < SEG_COUNT; i++)
    segs.push(new THREE.Vector3(0, 0.3, -i * SPACING));

  root._segs    = segs;
  root._tube    = tube;
  root._head    = head;
  root._curve   = curve;
  root._walkT   = Math.random() * 10;
  root._headPivot = head;   // compatibilidad con getNearby (head tracking opcional)

  return root;
}

// ─── Actualizar gusano cada frame ─────────────────────────────────────────────
function updateWorm(root, targetX, targetZ, dt, speed, isWalking) {
  const segs  = root._segs;
  root._walkT += dt * (isWalking ? speed * 3.5 : 1.0);
  const wt    = root._walkT;

  // Cabeza sigue al objetivo (world space)
  const head = segs[0];
  if (isWalking) {
    const dx   = targetX - head.x;
    const dz   = targetZ - head.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 0.05) {
      const step = Math.min(dist, speed * dt);
      head.x += (dx / dist) * step;
      head.z += (dz / dist) * step;
    }
  }
  // Oscilación vertical de la cabeza
  head.y = 0.32 + Math.sin(wt * 3.8) * 0.12;

  // Cadena de seguimiento — cada segmento sigue al anterior
  for (let i = 1; i < SEG_COUNT; i++) {
    const prev = segs[i - 1];
    const curr = segs[i];
    const dx   = curr.x - prev.x;
    const dy   = curr.y - prev.y;
    const dz   = curr.z - prev.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist > SPACING) {
      const f  = (dist - SPACING) / dist;
      curr.x  -= dx * f;
      curr.y  -= dy * f;
      curr.z  -= dz * f;
    }
    // Ondulación vertical del cuerpo
    const t   = i / (SEG_COUNT - 1);
    const amp = Math.sin(t * Math.PI) * 0.10;
    curr.y = 0.18 + amp * Math.sin(wt * 3.5 - i * 0.55);
  }

  // Actualizar posición de la mesh de cabeza (local, root en origen)
  root._head.position.set(
    segs[0].x - root.position.x,
    segs[0].y,
    segs[0].z - root.position.z
  );

  // Orientar cabeza hacia movimiento
  if (segs.length > 1) {
    const dx = segs[0].x - segs[1].x;
    const dz = segs[0].z - segs[1].z;
    if (dx * dx + dz * dz > 0.0001)
      root._head.rotation.y = Math.atan2(dx, dz);
  }

  // Regenerar TubeGeometry con radio variable
  const localPts = segs.map(s =>
    new THREE.Vector3(s.x - root.position.x, s.y, s.z - root.position.z)
  );
  root._curve.points = localPts;
  const tubSegs   = SEG_COUNT * 3;
  const newGeo    = new THREE.TubeGeometry(root._curve, tubSegs, BASE_R, 8, false);

  // Deformar vértices para radio variable (más grueso en el medio)
  const pos  = newGeo.attributes.position;
  const norm = newGeo.attributes.normal;
  const radSeg = 8;
  for (let vi = 0; vi < pos.count; vi++) {
    const ti  = Math.floor(vi / (radSeg + 1));
    const t   = ti / tubSegs;
    const extra = Math.sin(t * Math.PI) * BASE_R * 1.0;
    pos.setXYZ(vi,
      pos.getX(vi) + norm.getX(vi) * extra,
      pos.getY(vi) + norm.getY(vi) * extra,
      pos.getZ(vi) + norm.getZ(vi) * extra
    );
  }
  pos.needsUpdate = true;

  root._tube.geometry.dispose();
  root._tube.geometry = newGeo;
}

// ─── Nombre flotante ──────────────────────────────────────────────────────────
function makeLabel(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 48;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.roundRect(4, 4, 248, 40, 8); ctx.fill();
  ctx.fillStyle = '#f0e0b0';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name, 128, 30);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sp  = new THREE.Sprite(mat);
  sp.scale.set(1.6, 0.32, 1);
  sp.position.set(0, 1.6, 0);
  sp.visible = false;
  return sp;
}

// ─── Sistema principal ────────────────────────────────────────────────────────
export class CampesinoSystem {
  constructor(scene) {
    this._npcs  = [];
    this._scene = scene;

    CHARS.forEach((char, i) => {
      const patrol = PATROLS[i];
      const root   = buildWorm(char);
      const startX = (patrol.from.x + patrol.to.x) / 2;
      const startZ = (patrol.from.z + patrol.to.z) / 2;

      root.position.set(startX, 0, startZ);

      // Inicializar segmentos en posición de spawn
      for (let s = 0; s < SEG_COUNT; s++) {
        root._segs[s].set(startX, 0.3, startZ - s * SPACING);
      }

      const label = makeLabel(char.name);
      label._keep = true;
      root.add(label);
      scene.add(root);

      this._npcs.push({
        root, label, patrol,
        t:      Math.random(),
        dir:    Math.random() > 0.5 ? 1 : -1,
        speed:  char.speed,
        pauseT: 0,
        name:   char.name,
        isTalking: false,
      });
    });
  }

  update(dt, playerPos, units) {
    for (let i = 0; i < this._npcs.length; i++) {
      const npc  = this._npcs[i];
      const unit = units ? units[i] : null;
      const { root, label } = npc;

      // ── Posición lógica desde souls ───────────────────────────────────────
      let targetX = root.position.x;
      let targetZ = root.position.z;
      let isWalking = false;
      let speed = npc.speed;

      if (unit && !npc.isTalking) {
        targetX  = unit.terraPos.x;
        targetZ  = unit.terraPos.y;
        root.position.x = targetX;
        root.position.z = targetZ;
        root.position.y = 0;
        speed = Math.sqrt(unit.terraVel.x ** 2 + unit.terraVel.y ** 2);
        isWalking = speed > 0.05;
      }

      // ── Label de nombre ───────────────────────────────────────────────────
      if (playerPos) {
        const dx = root.position.x - playerPos.x;
        const dz = root.position.z - playerPos.z;
        label.visible = (dx * dx + dz * dz) < 36;
      }

      // ── Actualizar gusano ─────────────────────────────────────────────────
      updateWorm(root, targetX, targetZ, dt, speed, isWalking);
    }
  }

  getNearby(px, pz, radius = 5) {
    for (const npc of this._npcs) {
      const dx = npc.root.position.x - px;
      const dz = npc.root.position.z - pz;
      if (dx * dx + dz * dz < radius * radius) return npc.name;
    }
    return null;
  }

  getNearbyWithId(px, pz, radius = 5) {
    for (let i = 0; i < this._npcs.length; i++) {
      const npc = this._npcs[i];
      const dx  = npc.root.position.x - px;
      const dz  = npc.root.position.z - pz;
      if (dx * dx + dz * dz < radius * radius) return { name: npc.name, idx: i };
    }
    return null;
  }

  startTalk(name) {
    const npc = this._npcs.find(n => n.name === name);
    if (npc) npc.isTalking = true;
  }

  endTalk(name) {
    const npc = this._npcs.find(n => n.name === name);
    if (npc) npc.isTalking = false;
  }
}
