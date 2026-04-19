// campesinos.js — NPCs gusano, patrullan el pueblo
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HOUSES, DEST } from './souls.js';

// ─── Cola del gusano (GLB con Empty de anclaje) ───────────────────────────────
let _tailScene    = null;                         // scene cloneable del GLB
let _tailOffset   = new THREE.Vector3();          // posición del Empty en model space
const _tailWaiters = [];                          // callbacks de gusanos esperando la carga

new GLTFLoader().load('/models/CHORIPAN COLA ALDEANOS.glb', gltf => {
  const root = gltf.scene;

  // Encontrar el Empty (Object3D sin geometría propia, hijo directo o descendiente)
  let emptyNode = null;
  root.traverse(n => {
    if (emptyNode) return;
    if (n === root) return;
    if (!(n instanceof THREE.Mesh) && !(n instanceof THREE.Group)) {
      emptyNode = n;  // Object3D puro = Empty de Blender
    }
  });
  // Fallback: buscar por nombre
  if (!emptyNode) {
    root.traverse(n => {
      if (emptyNode) return;
      if (n !== root && n.children.length === 0 && !(n instanceof THREE.Mesh)) emptyNode = n;
    });
  }

  if (emptyNode) {
    emptyNode.getWorldPosition(_tailOffset);
    console.log('[COLA] Empty encontrado:', emptyNode.name, 'offset:', _tailOffset);
  } else {
    console.log('[COLA] No se encontró Empty, usando origen');
  }

  // Sombras en todos los meshes
  root.traverse(n => {
    if (n instanceof THREE.Mesh) { n.castShadow = true; n.receiveShadow = true; }
  });

  _tailScene = root;

  // Adjuntar a los gusanos que ya estaban esperando
  for (const fn of _tailWaiters) fn();
  _tailWaiters.length = 0;
}, undefined, e => console.warn('[COLA] Error cargando cola:', e));

// ─── Constantes del gusano ────────────────────────────────────────────────────
const SEG_COUNT  = 10;
const SPACING    = 1.20;
const BASE_R     = 0.72;
const HEAD_R     = BASE_R * 1.55;
const NPC_HP     = 4;

function segRadius(i) {
  const t = i / (SEG_COUNT - 1);
  return BASE_R * (0.45 + Math.sin(t * Math.PI) * 1.1);
}

// ─── Paleta por personaje ─────────────────────────────────────────────────────
const CHARS = [
  { name: 'Ramón',     color: 0x2e7d32, eyeColor: 0x111111, speed: 1.4 },
  { name: 'Ofelia',    color: 0x6a1e6e, eyeColor: 0x220022, speed: 1.3 },
  { name: 'Facundo',   color: 0x1a4a6e, eyeColor: 0x001122, speed: 1.2 },
  { name: 'Celestino', color: 0x7a5010, eyeColor: 0x221100, speed: 1.1 },
  { name: 'Zulma',     color: 0x8a1a1a, eyeColor: 0x220000, speed: 1.35 },
];

// ─── Rutas de patrulla ────────────────────────────────────────────────────────
const PATROLS = [
  { from: { x: -7, z: -106 }, to: { x:  7, z: -106 } },
  { from: { x: 14, z: -118 }, to: { x: 14, z: -132 } },
  { from: { x:-14, z: -118 }, to: { x:-14, z: -132 } },
  { from: { x: -6, z: -138 }, to: { x:  6, z: -138 } },
  { from: { x:  0, z: -143 }, to: { x:  0, z: -150 } },
];

const _hitMat = new THREE.MeshBasicMaterial({ visible: false });

// ─── Adjuntar cola al grupo de anclaje ────────────────────────────────────────
function _attachTail(tailGroup) {
  if (!_tailScene) return;
  const clone = _tailScene.clone(true);
  // Mover el clone para que el Empty quede en el origen del grupo
  clone.position.copy(_tailOffset).negate();
  tailGroup.add(clone);
}

// ─── Constructor gusano ───────────────────────────────────────────────────────
function buildWorm(char, npcIdx) {
  const root  = new THREE.Group();
  const color = char.color;

  const mat = new THREE.MeshStandardMaterial({
    color, roughness: 0.38, metalness: 0.08,
  });

  // Tubo (geometría se regenera cada frame)
  const initPts = [];
  for (let i = 0; i < SEG_COUNT; i++)
    initPts.push(new THREE.Vector3(0, BASE_R, -i * SPACING));
  const curve   = new THREE.CatmullRomCurve3(initPts);
  const initGeo = new THREE.TubeGeometry(curve, SEG_COUNT * 3, BASE_R, 8, false);
  const tube    = new THREE.Mesh(initGeo, mat);
  tube.castShadow = true;
  root.add(tube);

  // Cabeza — esfera visible, más grande que el cuello
  const headGeo = new THREE.SphereGeometry(HEAD_R, 20, 16);
  const head    = new THREE.Mesh(headGeo, mat.clone());
  head.castShadow = true;
  root.add(head);

  // Ojos
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const pupilMat    = new THREE.MeshStandardMaterial({ color: char.eyeColor });
  const eyeR  = HEAD_R * 0.28;
  const pupR  = eyeR  * 0.55;
  for (const sx of [-1, 1]) {
    const eye   = new THREE.Mesh(new THREE.SphereGeometry(eyeR,  10, 10), eyeWhiteMat);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(pupR,   8,  8), pupilMat);
    pupil.position.set(0, 0, eyeR * 0.72);
    eye.add(pupil);
    head.add(eye);
    eye.position.set(sx * HEAD_R * 0.50, HEAD_R * 0.32, HEAD_R * 0.82);
  }

  // Hitboxes por segmento (uno por segmento, cubriendo todo el cuerpo)
  const hitboxMeshes = [];
  for (let i = 0; i < SEG_COUNT; i++) {
    const r   = i === 0 ? HEAD_R * 1.2 : segRadius(i) * 1.3;
    const hb  = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 6), _hitMat);
    hb.userData.campesinoNpcIdx = npcIdx;
    hb.userData.campesinoSegIdx = i;
    root.add(hb);
    hitboxMeshes.push(hb);
  }

  // Segmentos — posiciones mundo (absolute)
  const segs = [];
  for (let i = 0; i < SEG_COUNT; i++)
    segs.push(new THREE.Vector3(0, BASE_R, -i * SPACING));

  // Velocidades por segmento (física de impacto)
  const segVels = [];
  for (let i = 0; i < SEG_COUNT; i++)
    segVels.push(new THREE.Vector3());

  // Fruta sobre la cabeza — visible cuando el alma tiene comida cosechada
  const fruitMat = new THREE.MeshStandardMaterial({
    color: 0xff2200, roughness: 0.45, emissive: 0x330000,
  });
  const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 6), fruitMat);
  fruit.castShadow = true;
  fruit.position.set(0, HEAD_R * 1.55, 0);
  fruit.visible = false;
  head.add(fruit);

  // Cola — grupo de anclaje en el último segmento
  const tailGroup = new THREE.Group();
  root.add(tailGroup);
  if (_tailScene) {
    _attachTail(tailGroup);   // ya cargó, adjuntar ya
  }

  root._segs         = segs;
  root._segVels      = segVels;
  root._tube         = tube;
  root._head         = head;
  root._fruit        = fruit;
  root._tail         = tailGroup;
  root._hitboxMeshes = hitboxMeshes;
  root._curve        = curve;
  root._walkT        = Math.random() * 10;
  root._dead         = false;
  root._deadT        = 0;

  return root;
}

// ─── Reconstruir TubeGeometry con radio variable ──────────────────────────────
function _rebuildTube(root) {
  const segs = root._segs;
  const localPts = segs.map(s =>
    new THREE.Vector3(s.x - root.position.x, s.y, s.z - root.position.z)
  );
  root._curve.points = localPts;
  const tubSegs = SEG_COUNT * 3;
  const newGeo  = new THREE.TubeGeometry(root._curve, tubSegs, BASE_R, 8, false);

  const pos  = newGeo.attributes.position;
  const norm = newGeo.attributes.normal;
  const radSeg = 8;
  for (let vi = 0; vi < pos.count; vi++) {
    const ti    = Math.floor(vi / (radSeg + 1));
    const t     = ti / tubSegs;
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

// ─── Actualizar hitbox positions (local respecto a root) ──────────────────────
function _updateHitboxes(root) {
  const segs = root._segs;
  for (let i = 0; i < SEG_COUNT; i++) {
    const hb = root._hitboxMeshes[i];
    hb.position.set(
      segs[i].x - root.position.x,
      segs[i].y,
      segs[i].z - root.position.z
    );
    hb.visible = false; // siempre invisible visualmente
  }
}

// ─── Actualizar gusano cada frame ─────────────────────────────────────────────
function updateWorm(root, targetX, targetZ, dt, speed, isWalking) {
  const segs    = root._segs;
  const segVels = root._segVels;

  // Modo muerto: colapso al piso
  if (root._dead) {
    root._deadT += dt;
    for (let i = 0; i < SEG_COUNT; i++) {
      segs[i].y = Math.max(0, segs[i].y - dt * 2.5);
    }
    _rebuildTube(root);
    _updateHitboxes(root);
    root._head.position.set(
      segs[0].x - root.position.x,
      segs[0].y,
      segs[0].z - root.position.z
    );
    _updateTail(root);
    return;
  }

  root._walkT += dt * (isWalking ? speed * 3.5 : 1.0);
  const wt = root._walkT;

  // Aplicar velocidades de impacto a cada segmento + decaimiento
  for (let i = 0; i < SEG_COUNT; i++) {
    const v = segVels[i];
    if (v.lengthSq() > 0.0001) {
      segs[i].x += v.x * dt;
      segs[i].z += v.z * dt;
      v.multiplyScalar(Math.pow(0.05, dt)); // fricción fuerte
    }
  }

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
  head.y = BASE_R * 1.4 + Math.sin(wt * 3.8) * BASE_R * 0.35;

  // Cadena de seguimiento
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
    // Ondulación vertical del cuerpo (mínimo: tubo no clip con suelo)
    const t    = i / (SEG_COUNT - 1);
    const tSin = Math.sin(t * Math.PI);
    const amp  = tSin * BASE_R * 0.55;
    const minY = BASE_R * (1.05 + tSin); // asegura fondo del tubo ≥ 0
    curr.y = Math.max(minY, BASE_R * 1.0 + amp * Math.sin(wt * 3.5 - i * 0.55));
  }

  // Actualizar posición de la mesh de cabeza
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

  _rebuildTube(root);
  _updateHitboxes(root);
  _updateTail(root);
}

// ─── Posicionar cola en el último segmento ────────────────────────────────────
function _updateTail(root) {
  const tail = root._tail;
  if (!tail) return;
  const segs = root._segs;
  const last = segs[SEG_COUNT - 1];
  const prev = segs[SEG_COUNT - 2];

  tail.position.set(
    last.x - root.position.x,
    last.y,
    last.z - root.position.z
  );

  // Orientar en la dirección del segmento anterior → último (apunta para atrás)
  const tdx = last.x - prev.x;
  const tdz = last.z - prev.z;
  if (tdx * tdx + tdz * tdz > 0.0001) {
    tail.rotation.y = Math.atan2(tdx, tdz);
  }
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
  sp.scale.set(3.2, 0.64, 1);
  sp.position.set(0, HEAD_R * 1.6, 0);
  sp.visible = false;
  return sp;
}

// ─── Destino 3D según intención del alma ──────────────────────────────────────
function _getDestForUnit(unit, idx) {
  if (unit.isSleeping || unit.intention === 'SLEEPING')
    return { x: HOUSES[idx].pos.x, z: HOUSES[idx].pos.y };
  // Plan de entrega tiene prioridad
  if (unit.deliveryPlan && unit.deliveryPlan.length > 0) {
    const step = unit.deliveryPlan[0];
    if (step.label === 'OFFERING')                               return { x: DEST.OFFERING.x,    z: DEST.OFFERING.y   };
    if (step.label === 'SHARING')                                return { x: DEST.SHARING.x,     z: DEST.SHARING.y    };
    if (step.label === 'BAR')                                    return { x: DEST.BAR.x,         z: DEST.BAR.y        };
    if (step.label === 'HOARDING' || step.label === 'CONSUMING') return { x: HOUSES[idx].pos.x,  z: HOUSES[idx].pos.y };
  }
  if (unit.energy < 65 || unit.intention === 'CONSUMING' || unit.inventory === 0) return { x: HOUSES[idx].farm.x, z: HOUSES[idx].farm.y };
  if (unit.intention === 'OFFERING')                      return { x: DEST.OFFERING.x,    z: DEST.OFFERING.y   };
  if (unit.intention === 'SHARING')                       return { x: DEST.SHARING.x,     z: DEST.SHARING.y    };
  if (unit.intention === 'BAR')                           return { x: DEST.BAR.x,         z: DEST.BAR.y        };
  return { x: HOUSES[idx].pos.x, z: HOUSES[idx].pos.y };
}

// ─── Sistema principal ────────────────────────────────────────────────────────
export class CampesinoSystem {
  constructor(scene) {
    this._npcs  = [];
    this._scene = scene;

    CHARS.forEach((char, i) => {
      const patrol = PATROLS[i];
      const root   = buildWorm(char, i);
      // Empezar en la casa del personaje (no en la zona de patrulla)
      const startX = HOUSES[i].pos.x;
      const startZ = HOUSES[i].pos.y;  // souls.js: .y = 3D z

      root.position.set(startX, 0, startZ);

      for (let s = 0; s < SEG_COUNT; s++) {
        root._segs[s].set(startX, BASE_R, startZ - s * SPACING);
      }

      const label = makeLabel(char.name);
      label._keep = true;
      root._head.add(label);
      scene.add(root);

      this._npcs.push({
        root, label, patrol,
        t:      Math.random(),
        dir:    Math.random() > 0.5 ? 1 : -1,
        speed:  char.speed,
        pauseT: 0,
        name:   char.name,
        isTalking: false,
        hp:     NPC_HP,
        dead:   false,
        removeT: -1,
      });
    });

    // Si el GLB de cola aún no cargó, registrar callback para cuando esté listo
    if (!_tailScene) {
      _tailWaiters.push(() => {
        for (const npc of this._npcs) {
          if (npc.root._tail.children.length === 0) {
            _attachTail(npc.root._tail);
          }
        }
      });
    }
  }

  // ── Todos los hitboxes (uno por segmento de cada NPC vivo) ─────────────────
  getHitboxes() {
    const out = [];
    for (const npc of this._npcs) {
      if (npc.dead) continue;
      for (const hb of npc.root._hitboxMeshes) out.push(hb);
    }
    return out;
  }

  // ── Recibir impacto de bala ────────────────────────────────────────────────
  // npcIdx: índice del NPC, segIdx: qué segmento fue impactado, bulletDir: dirección del disparo
  hit(npcIdx, segIdx, point, bulletDir) {
    const npc = this._npcs[npcIdx];
    if (!npc || npc.dead) return;
    npc.hp -= 1;

    // Impulso en la dirección del disparo, aplicado al segmento impactado y los posteriores
    // (el segmento 0 recibe siempre un impulso menor para que la cabeza también reaccione)
    const force = 28;
    const dx = bulletDir?.x ?? 0;
    const dz = bulletDir?.z ?? 0;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const ivx = (dx / len) * force;
    const ivz = (dz / len) * force;

    const vels = npc.root._segVels;
    // Segmento impactado y cola: fuerza completa
    for (let i = segIdx; i < SEG_COUNT; i++) {
      const falloff = 1 - (i - segIdx) * 0.07; // decae un poco hacia la cola
      vels[i].x += ivx * Math.max(0.3, falloff);
      vels[i].z += ivz * Math.max(0.3, falloff);
    }
    // Cabeza: impulso reducido si el hit fue en la cola
    const headFalloff = 1 - segIdx / SEG_COUNT * 0.6;
    vels[0].x += ivx * headFalloff;
    vels[0].z += ivz * headFalloff;

    if (npc.hp <= 0) {
      npc.dead = true;
      npc.root._dead = true;
      // Ocultar hitboxes inmediatamente
      for (const hb of npc.root._hitboxMeshes) hb.userData.campesinoNpcIdx = -1;
      npc.removeT = performance.now() + 4000;
    }
  }

  // ── Colisión física con el jugador — devuelve repulsión para aplicar al player ─
  pushFromPlayer(px, pz) {
    let repelX = 0, repelZ = 0;
    const playerR = 0.5; // radio aproximado del jugador

    for (const npc of this._npcs) {
      if (npc.dead) continue;
      const segs  = npc.root._segs;
      const vels  = npc.root._segVels;

      for (let i = 0; i < SEG_COUNT; i++) {
        const sr   = i === 0 ? HEAD_R : segRadius(i);
        const minD = sr + playerR;
        const dx   = segs[i].x - px;
        const dz   = segs[i].z - pz;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < minD && dist > 0.01) {
          const overlap = minD - dist;
          const nx = dx / dist;
          const nz = dz / dist;
          // Empujar gusano (este segmento + cabeza)
          const wormForce = overlap * 12;
          vels[i].x += nx * wormForce;
          vels[i].z += nz * wormForce;
          if (i > 0) { vels[0].x += nx * wormForce * 0.4; vels[0].z += nz * wormForce * 0.4; }
          // Empujar jugador en dirección contraria
          repelX -= nx * overlap * 8;
          repelZ -= nz * overlap * 8;
        }
      }
    }
    return { vx: repelX, vz: repelZ };
  }

  update(dt, playerPos, units) {
    const now = performance.now();
    for (let i = 0; i < this._npcs.length; i++) {
      const npc  = this._npcs[i];
      const unit = units ? units[i] : null;
      const { root, label } = npc;

      // Limpiar cadáveres
      if (npc.dead) {
        if (npc.removeT > 0 && now > npc.removeT) {
          this._scene.remove(root);
          npc.removeT = -1;
        }
        updateWorm(root, 0, 0, dt, 0, false);
        continue;
      }

      // ── Posición lógica desde souls ───────────────────────────────────────
      let targetX = root.position.x;
      let targetZ = root.position.z;
      let isWalking = false;
      let speed = npc.speed;

      if (unit && !npc.isTalking) {
        const dest = _getDestForUnit(unit, i);
        const head = root._segs[0];
        const distToDest = Math.sqrt((dest.x - head.x) ** 2 + (dest.z - head.z) ** 2);

        if (distToDest < 4) {
          // En destino: vagar suavemente alrededor
          npc._wanderT = (npc._wanderT || 0) + dt;
          if (!npc._wanderOff || npc._wanderT > 2 + Math.random() * 3) {
            npc._wanderT = 0;
            npc._wanderOff = { x: (Math.random() - 0.5) * 8, z: (Math.random() - 0.5) * 8 };
          }
          targetX = dest.x + (npc._wanderOff?.x || 0);
          targetZ = dest.z + (npc._wanderOff?.z || 0);
          speed   = npc.speed * 0.35;
        } else {
          targetX   = dest.x;
          targetZ   = dest.z;
          speed     = npc.speed * (unit.isSleeping ? 0.5 : 1.0);
        }
        isWalking = true;

        // Sincronizar root al head para que hitboxes sean correctos
        root.position.x = head.x;
        root.position.z = head.z;
        root.position.y = 0;
      }

      // ── Fruta sobre la cabeza (visible cuando food > 0) ───────────────────
      if (root._fruit) {
        // Muestra la baya según el inventario que lleva para entregar
        const inv = unit?.inventory ?? 0;
        if (inv > 0) {
          root._fruit.visible = true;
          const bob = Math.sin(now * 0.003 + i * 1.3) * 0.07;
          root._fruit.position.y = HEAD_R * 1.55 + bob;
          // Tamaño proporcional a cuánto lleva (1 fruto = normal, 5 = grande)
          const s = Math.min(1.6, 0.65 + (inv / unit.maxInventory) * 0.95);
          root._fruit.scale.setScalar(s);
        } else {
          root._fruit.visible = false;
        }
      }

      // ── Evitación del jugador ─────────────────────────────────────────────
      if (playerPos) {
        const head  = root._segs[0];
        const dx    = head.x - playerPos.x;
        const dz    = head.z - playerPos.z;
        const dist  = Math.sqrt(dx * dx + dz * dz);
        const evadeR = BASE_R * 8;
        if (dist < evadeR && dist > 0.1) {
          const repel = (evadeR - dist) / evadeR * 4.0;
          targetX += (dx / dist) * repel;
          targetZ += (dz / dist) * repel;
          isWalking = true;
        }
      }

      // ── Label de nombre ───────────────────────────────────────────────────
      if (playerPos) {
        const dx = root.position.x - playerPos.x;
        const dz = root.position.z - playerPos.z;
        label.visible = (dx * dx + dz * dz) < 144;
      }

      updateWorm(root, targetX, targetZ, dt, speed, isWalking);
    }
  }

  getNearby(px, pz, radius = 5) {
    for (const npc of this._npcs) {
      if (npc.dead) continue;
      const head = npc.root._segs[0];
      const dx = head.x - px;
      const dz = head.z - pz;
      if (dx * dx + dz * dz < radius * radius) return npc.name;
    }
    return null;
  }

  getNearbyWithId(px, pz, radius = 5) {
    for (let i = 0; i < this._npcs.length; i++) {
      const npc = this._npcs[i];
      if (npc.dead) continue;
      // _segs[0] es la cabeza del gusano — posición real en el mundo
      const head = npc.root._segs[0];
      const dx  = head.x - px;
      const dz  = head.z - pz;
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
