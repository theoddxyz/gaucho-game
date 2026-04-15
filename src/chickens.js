// --- Chicken System: grupos de gallinas con dBBMM + reacción a yell ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createRagdollBody, removeRagdollBody, syncMeshFromBody, bodyIsAsleep } from './physics.js';

// Gallina: hitbox real BoxGeometry(0.52, 0.45, 0.34) centrado en y=0.28
const CHK_HX = 0.26, CHK_HY = 0.225, CHK_HZ = 0.17, CHK_MASS = 2;

// ─── GLB swap — si existe /models/chicken.glb lo usa en lugar del procedural ──
let _chickenTpl  = null;
let _chickenPending = [];
new GLTFLoader().load('/models/chicken.glb',
  g => {
    _chickenTpl = g.scene;
    _chickenPending.forEach(_applyChickenGLB);
    _chickenPending = [];
  },
  undefined,
  () => { _chickenPending = []; }   // falla → mantener procedural
);

function _applyChickenGLB(grp) {
  // Quitar partes visuales procedurales (conservar hitbox)
  grp.children.slice().forEach(c => { if (c !== grp._hitbox) grp.remove(c); });
  const vis = _chickenTpl.clone(true);
  vis.scale.setScalar(0.55);
  vis.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
  grp.add(vis);
  // Remap piernas si el GLB tiene nodos con esos nombres
  const lr = vis.getObjectByName('leg_right') || vis.getObjectByName('leg_r');
  const ll = vis.getObjectByName('leg_left')  || vis.getObjectByName('leg_l');
  grp._legMeshes = (lr && ll) ? [lr, ll] : [];
}

// ─── Gaussian random (Box-Muller) ─────────────────────────────────────────────
function _gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function _rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ─── Flying-part physics ──────────────────────────────────────────────────────
function spawnFlyingPart(scene, worldPos, geo, color, detachedParts, hitPoint) {
  const mat  = new THREE.MeshStandardMaterial({ color, roughness: 0.85, transparent: true, opacity: 1, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(worldPos);
  mesh.castShadow = true;
  scene.add(mesh);
  const away = hitPoint
    ? new THREE.Vector3().subVectors(worldPos, hitPoint).normalize()
    : new THREE.Vector3((Math.random()-0.5)*2, 1, (Math.random()-0.5)*2).normalize();
  const vel = new THREE.Vector3(
    away.x * 6 + (Math.random()-0.5) * 5,
    4 + Math.random() * 4,
    away.z * 6 + (Math.random()-0.5) * 5
  );
  const angVel = new THREE.Vector3(
    (Math.random()-0.5)*22, (Math.random()-0.5)*22, (Math.random()-0.5)*22
  );
  detachedParts.push({ mesh, vel, angVel, t: 0, maxT: 7.0 });
}

function tickFlyingParts(scene, detachedParts, dt) {
  for (let i = detachedParts.length - 1; i >= 0; i--) {
    const p = detachedParts[i];
    p.t += dt;
    if (p.t >= p.maxT) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      detachedParts.splice(i, 1);
      continue;
    }
    p.vel.y -= 20 * dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    p.mesh.rotation.x += p.angVel.x * dt;
    p.mesh.rotation.y += p.angVel.y * dt;
    p.mesh.rotation.z += p.angVel.z * dt;
    if (p.mesh.position.y < 0.03) {
      p.mesh.position.y = 0.03;
      p.vel.y *= -0.22;
      p.vel.x *= 0.58;
      p.vel.z *= 0.58;
      p.angVel.multiplyScalar(0.38);
    }
    if (p.t > p.maxT - 0.5) {
      p.mesh.material.opacity = Math.max(0, (p.maxT - p.t) / 0.5);
    }
  }
}

// ─── Muerte con físicas ───────────────────────────────────────────────────────
const DEATH_PHYSICS_LIFE = 90;

function _startDeathPhysics(entity, hitPoint) {
  entity.wounded      = false;
  entity.dyingPhysics = true;

  const pos  = entity.mesh.position;
  const scl  = entity.mesh.scale?.x ?? 1;
  const hy   = CHK_HY * scl;
  const body = createRagdollBody(
    pos.x, pos.y + hy + 0.02, pos.z,
    CHK_HX * scl, hy, CHK_HZ * scl, CHK_MASS
  );

  body.quaternion.set(
    entity.mesh.quaternion.x, entity.mesh.quaternion.y,
    entity.mesh.quaternion.z, entity.mesh.quaternion.w
  );

  let dx = 0, dz = 0;
  if (hitPoint) {
    dx = pos.x - hitPoint.x; dz = pos.z - hitPoint.z;
    const d = Math.sqrt(dx * dx + dz * dz) || 1;
    dx /= d; dz /= d;
  } else {
    const a = Math.random() * Math.PI * 2;
    dx = Math.cos(a); dz = Math.sin(a);
  }
  const spd = 3.5 + Math.random() * 2.5;
  body.velocity.set(dx * spd, 2.5 + Math.random() * 2, dz * spd);
  body.angularVelocity.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 4,
    (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 4)
  );

  entity._physBody = body;
  entity._phyHY   = hy;
  entity._phy      = { t: 0, settled: false };
}

function _tickDeathPhysics(entity, dt) {
  const phy = entity._phy;
  if (!phy) return;
  phy.t += dt;
  const body = entity._physBody;
  if (!body) return;
  if (bodyIsAsleep(body)) { phy.settled = true; return; }
  syncMeshFromBody(entity.mesh, body, entity._phyHY);
}

// ─── Paletas de color ─────────────────────────────────────────────────────────
const PALETTES = [
  { body: 0xE8D8B0, beak: 0xD4940A, comb: 0xCC1A00 },  // blanca / marrón claro
  { body: 0x7A3A18, beak: 0xC08010, comb: 0x881200 },  // marrón oscuro
  { body: 0x181008, beak: 0xC07808, comb: 0xAA1200 },  // negra
  { body: 0xC85020, beak: 0xD09018, comb: 0xCC1A00 },  // colorada
  { body: 0xD0B890, beak: 0xC88A10, comb: 0x991400 },  // gris perla
];

const M_HIT = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

// ─── Spots de spawn: 5 grupos — posiciones del nuevo mapa ────────────────────
// hw/hd = medio ancho/profundidad del corral (buildCorral usa cw=10, cd=10 → 4.5 de margen)
const SPAWN_GROUPS = [
  { x: -63, z:  -48, n: 5, hw: 4, hd: 4 },
  { x: -54, z:  -86, n: 5, hw: 4, hd: 4 },
  { x: -55, z:   -2, n: 5, hw: 4, hd: 4 },
  { x:  55, z:   28, n: 5, hw: 4, hd: 4 },
  { x:  71, z:  -26, n: 6, hw: 4, hd: 4 },
];

// ─── dBBMM parámetros para gallinas ──────────────────────────────────────────
const BB_STATES = {
  grazing:   { sigma: 1.8,  speed: 0.22, wpRadius: [2,  7],  timer: [3,  9] },
  traveling: { sigma: 0.5,  speed: 0.70, wpRadius: [6, 18],  timer: [5, 12] },
  fleeing:   { sigma: 5.5,  speed: 5.50, wpRadius: [12, 30], timer: [3,  6] },
};
const TAU        = { grazing: 0.55, traveling: 0.28, fleeing: 0.12 };
const WAVE_SPEED = 22;   // gallines reaccionan más rápido al arre
const FLEE_RADIUS = 4.5;
const PICKUP_RADIUS = 2.2;

// ─── Build chicken mesh ───────────────────────────────────────────────────────
function buildChicken(rng) {
  const palIdx = Math.floor(rng() * PALETTES.length);
  const { body: bodyCol, beak: beakCol, comb: combCol } = PALETTES[palIdx];

  const grp = new THREE.Group();

  const mk = (w, h, d, col, x, y, z) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.88 })
    );
    m.position.set(x, y, z);
    m.castShadow = true;
    grp.add(m);
    return m;
  };

  // Cuerpo (modelo orientado a +X — cabeza en X positivo)
  mk(0.36, 0.24, 0.28, bodyCol,  0.00, 0.24, 0.00);   // torso
  mk(0.20, 0.18, 0.20, bodyCol,  0.22, 0.40, 0.00);   // cabeza
  mk(0.08, 0.05, 0.06, beakCol,  0.34, 0.36, 0.00);   // pico
  mk(0.06, 0.10, 0.05, combCol,  0.20, 0.52, 0.00);   // cresta
  mk(0.14, 0.16, 0.04, bodyCol, -0.20, 0.34, 0.02);   // cola (curvada arriba)
  mk(0.04, 0.16, 0.22, bodyCol,  0.02, 0.24, 0.22);   // ala derecha
  mk(0.04, 0.16, 0.22, bodyCol,  0.02, 0.24,-0.22);   // ala izquierda

  // Patas (con referencia para volar)
  const legR = mk(0.05, 0.14, 0.05, beakCol,  0.06, 0.06,  0.08);
  const legL = mk(0.05, 0.14, 0.05, beakCol,  0.06, 0.06, -0.08);
  legR.name = 'leg_right';
  legL.name = 'leg_left';

  // Hitbox
  const hb = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.45, 0.34), M_HIT.clone());
  hb.position.set(0.10, 0.28, 0);
  grp.add(hb);
  grp._hitbox    = hb;
  grp._legMeshes = [legR, legL];
  grp._headColor = bodyCol;

  // Aplicar GLB si ya cargó, sino encolar para swap cuando cargue
  if (_chickenTpl)       _applyChickenGLB(grp);
  else if (_chickenPending) _chickenPending.push(grp);

  return grp;
}

// ─── Build feather/meat pickup ────────────────────────────────────────────────
function buildFeather() {
  const g = new THREE.Group();
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.04, 0.10),
    new THREE.MeshStandardMaterial({ color: 0xE8D8B0, roughness: 0.9 })
  );
  m.castShadow = true;
  g.add(m);
  return g;
}

// ─── ChickenSystem ────────────────────────────────────────────────────────────
export class ChickenSystem {
  constructor(scene) {
    this._scene     = scene;
    this._chickens  = [];
    this._hitboxMap = new Map();
    this._feathers  = [];   // pickup items after death
    this.serverMode = false; // when true: skip local AI, positions come from host

    const rng = _rng(77531);
    let id = 0;

    for (const group of SPAWN_GROUPS) {
      const ghw = group.hw ?? 999;
      const ghd = group.hd ?? 999;
      for (let i = 0; i < group.n; i++) {
        const mesh = buildChicken(rng);
        // Spawn dentro del corral
        const jx = Math.max(group.x - ghw + 0.5, Math.min(group.x + ghw - 0.5,
                      group.x + (rng() - 0.5) * ghw * 1.6));
        const jz = Math.max(group.z - ghd + 0.5, Math.min(group.z + ghd - 0.5,
                      group.z + (rng() - 0.5) * ghd * 1.6));
        mesh.position.set(jx, 0, jz);
        mesh.rotation.y = rng() * Math.PI * 2;
        scene.add(mesh);
        this._hitboxMap.set(mesh._hitbox, id);

        const initState = 'grazing';   // dentro del corral solo pacen
        const initP     = BB_STATES[initState];
        const initAng   = rng() * Math.PI * 2;
        const initDist  = Math.min(2.5, initP.wpRadius[0] + rng() * 1.5);

        this._chickens.push({
          id,
          mesh,
          hitbox:        mesh._hitbox,
          vx: 0, vz: 0,
          walkTime:      rng() * 10,
          bbState:       initState,
          waypoint:      { x: jx + Math.cos(initAng) * initDist, z: jz + Math.sin(initAng) * initDist },
          waypointTimer: rng() * initP.timer[1],
          panicTimer:    0,
          herdId:        Math.floor(id / 5),
          removed:       false,
          hp:            2,
          wounded:       false,
          woundedT:      0,
          woundedMaxT:   2.5 + rng() * 1.5,
          dyingPhysics:  false,
          _phy:          null,
          detachedParts: [],
          spawnX:        jx,
          spawnZ:        jz,
          // Límites del corral
          corrX: group.x,  corrZ: group.z,
          corrHW: ghw,      corrHD: ghd,
          escaped: false,
        });
        id++;
      }
    }
  }

  applyServerSync(syncArr) {
    for (const ed of syncArr) {
      const c = this._chickens[ed.idx];
      if (!c || c.removed || !c.mesh) continue;
      if (ed.dead) {
        if (!c.removed && !c.wounded && !c.dyingPhysics) {
          c.removed = true;
          if (c.mesh) { this._scene.remove(c.mesh); c.mesh = null; }
        }
      } else {
        c.mesh.position.x = ed.x;
        c.mesh.position.z = ed.z;
        if (ed.vx !== undefined) { c.vx = ed.vx; c.vz = ed.vz; }
      }
    }
  }

  // ── Hitboxes activos para hitscan + crosshair ────────────────────────────
  getHitboxes() {
    const result = [];
    for (const c of this._chickens) {
      if (c.removed || c.wounded) continue;
      c.hitbox.updateWorldMatrix(true, false);
      result.push(c.hitbox);
    }
    return result;
  }

  getIdByHitbox(hb) {
    const id = this._hitboxMap.get(hb);
    return id !== undefined ? id : -1;
  }

  /** Devuelve el pollo herido más cercano dentro de radius, o null. */
  getNearbyWounded(x, z, radius) {
    const r2 = radius * radius;
    let nearest = null, nearestD2 = r2;
    for (const c of this._chickens) {
      if ((!c.wounded && !c.dyingPhysics) || c.removed || c._beingButchered || !c.mesh) continue;
      const dx = c.mesh.position.x - x, dz = c.mesh.position.z - z;
      const d2 = dx * dx + dz * dz;
      if (d2 < nearestD2) { nearestD2 = d2; nearest = c; }
    }
    return nearest;
  }

  /** Deshuesar pollo: lo elimina y devuelve { hunger, hp }. */
  lootWounded(c) {
    if (!c || !c.dyingPhysics || c.removed) return null;
    c.removed = true;
    c.dyingPhysics = false;
    removeRagdollBody(c._physBody); c._physBody = null;
    this._hitboxMap?.delete(c.hitbox);
    if (c.mesh) {
      this._scene.remove(c.mesh);
      c.mesh.traverse(o => { if (o.isMesh) { o.geometry?.dispose(); } });
    }
    return { hunger: 15, hp: 8 };
  }

  // ── Hit (damage) ────────────────────────────────────────────────────────
  hit(id, hitPoint, hitZone) {
    const c = this._chickens[id];
    if (!c || c.removed || c.wounded || c.dyingPhysics) return;
    c.hp = Math.max(0, c.hp - 1);

    // Parte volando según zona
    const mx   = c.mesh.position.x;
    const mz   = c.mesh.position.z;
    const ry   = c.mesh.rotation.y;
    const scale = c.mesh.scale.x ?? 1;

    if (hitZone === 'head') {
      // Cabeza vuela
      const hx = mx + Math.cos(ry) * 0.22 * scale;
      const hz = mz - Math.sin(ry) * 0.22 * scale;
      spawnFlyingPart(
        this._scene,
        new THREE.Vector3(hx, 0.40 * scale, hz),
        new THREE.BoxGeometry(0.20, 0.18, 0.20),
        c.mesh._headColor ?? 0xE8D8B0,
        c.detachedParts, hitPoint
      );
    } else if (hitZone === 'leg' && c.mesh._legMeshes?.length > 0) {
      const legMesh = c.mesh._legMeshes.shift();
      if (legMesh) {
        legMesh.visible = false;
        const legWorldPos = new THREE.Vector3();
        legMesh.getWorldPosition(legWorldPos);
        if (legWorldPos.y < 0.01) legWorldPos.y = 0.10 * scale;
        spawnFlyingPart(
          this._scene,
          legWorldPos,
          new THREE.BoxGeometry(0.05, 0.14, 0.05),
          0xD4940A,
          c.detachedParts, hitPoint
        );
      }
    }

    // Primer tiro → ragdoll inmediato con impulso direccional
    this._hitboxMap.delete(c.hitbox);
    c.hitbox.visible = false;
    _startDeathPhysics(c, hitPoint);
  }

  // ── Yell: onda expansiva (igual que vacas) ───────────────────────────────
  yell(px, pz, radius = 40) {
    for (const c of this._chickens) {
      if (c.removed || c.wounded) continue;
      const dx   = c.mesh.position.x - px;
      const dz   = c.mesh.position.z - pz;
      const dist = Math.sqrt(dx*dx + dz*dz);
      if (dist > radius) continue;
      const delayMs = (dist / WAVE_SPEED) * 1000;
      const nx = dist > 0.2 ? dx/dist : (Math.random()-0.5)*2;
      const nz = dist > 0.2 ? dz/dist : (Math.random()-0.5)*2;
      setTimeout(() => {
        if (c.removed || c.wounded) return;
        c.bbState     = 'fleeing';
        c.panicTimer  = 4.0 + Math.random() * 3;
        c.waypointTimer = c.panicTimer + 2;
        const wpDist = 25 + Math.random() * 15;
        c.waypoint = {
          x: c.mesh.position.x + nx * wpDist,
          z: c.mesh.position.z + nz * wpDist,
        };
      }, delayMs);
    }
  }

  // ── Update ───────────────────────────────────────────────────────────────
  update(dt, playerPositions, openGates) {
    let pickup = null;

    // Tick parts volando (todas las gallinas incluyendo heridas)
    for (const c of this._chickens) {
      if (c.detachedParts.length > 0) tickFlyingParts(this._scene, c.detachedParts, dt);
    }

    // Tick plumas/items en el suelo
    for (let i = this._feathers.length - 1; i >= 0; i--) {
      const f = this._feathers[i];
      f.t += dt;
      f.mesh.position.y = 0.08 + Math.sin(f.t * 2.0 + f.bobPhase) * 0.05;
      f.mesh.rotation.y += dt * 1.2;

      if (playerPositions && playerPositions.length > 0 && !pickup) {
        const pp = playerPositions[0];
        if (pp) {
          const dx = f.mesh.position.x - pp.x;
          const dz = f.mesh.position.z - pp.z;
          if (dx*dx + dz*dz < PICKUP_RADIUS*PICKUP_RADIUS) {
            this._scene.remove(f.mesh);
            this._feathers.splice(i, 1);
            pickup = { hp: 5, hunger: 12 };
            continue;
          }
        }
      }
      if (f.t > 180) { this._scene.remove(f.mesh); this._feathers.splice(i, 1); }
    }

    for (const c of this._chickens) {
      if (c.removed) continue;

      // ── Physics death (cannon ragdoll) ───────────────────────────────────
      if (c.dyingPhysics) {
        _tickDeathPhysics(c, dt);
        if (c._phy.t >= DEATH_PHYSICS_LIFE) {
          c.removed = true;
          c.dyingPhysics = false;
          removeRagdollBody(c._physBody); c._physBody = null;
          this._scene.remove(c.mesh);
        }
        continue;
      }

      const cx = c.mesh.position.x;
      const cz = c.mesh.position.z;

      // ── Proximity player → flee ─────────────────────────────────────────
      for (const pp of (playerPositions || [])) {
        if (!pp) continue;
        const pdx = cx - pp.x, pdz = cz - pp.z;
        if (pdx*pdx + pdz*pdz < FLEE_RADIUS*FLEE_RADIUS) {
          const d = Math.sqrt(pdx*pdx+pdz*pdz) || 1;
          c.bbState     = 'fleeing';
          c.panicTimer  = Math.max(c.panicTimer, 3.5);
          c.waypointTimer = c.panicTimer + 2;
          c.waypoint    = { x: cx + (pdx/d)*25, z: cz + (pdz/d)*25 };
          break;
        }
      }

      // ── Panic cooldown ─────────────────────────────────────────────────
      if (c.panicTimer > 0) {
        c.panicTimer -= dt;
        if (c.panicTimer <= 0 && c.bbState === 'fleeing') {
          c.bbState = 'grazing';
          const ang = Math.random() * Math.PI * 2;
          c.waypoint      = { x: cx + Math.cos(ang)*5, z: cz + Math.sin(ang)*5 };
          c.waypointTimer = 3 + Math.random() * 6;
        }
      }

      // ── dBBMM (skipped when server controls positions) ────────────────
      if (!this.serverMode) {
        const p     = BB_STATES[c.bbState] ?? BB_STATES.grazing;
        c.waypointTimer -= dt;
        const dwx   = c.waypoint.x - cx;
        const dwz   = c.waypoint.z - cz;
        const wDst  = Math.sqrt(dwx*dwx + dwz*dwz) || 1;

        if (c.bbState !== 'fleeing' && (wDst < p.wpRadius[0]*0.5 || c.waypointTimer <= 0)) {
          if (Math.random() < 0.35) {
            c.bbState = c.bbState === 'grazing' ? 'traveling' : 'grazing';
          }
          const np  = BB_STATES[c.bbState];
          const ang = Math.random() * Math.PI * 2;
          const d   = np.wpRadius[0] + Math.random() * (np.wpRadius[1] - np.wpRadius[0]);
          c.waypoint      = { x: cx + Math.cos(ang)*d, z: cz + Math.sin(ang)*d };
          c.waypointTimer = np.timer[0] + Math.random() * (np.timer[1] - np.timer[0]);
        }

        const driftX  = (dwx/wDst) * p.speed;
        const driftZ  = (dwz/wDst) * p.speed;
        const sigma   = p.sigma * Math.sqrt(dt);
        const noiseX  = _gaussian() * sigma;
        const noiseZ  = _gaussian() * sigma;
        let tvx = driftX + noiseX;
        let tvz = driftZ + noiseZ;
        const tspd = Math.sqrt(tvx*tvx + tvz*tvz);
        const maxS = p.speed * 1.7;
        if (tspd > maxS) { tvx *= maxS/tspd; tvz *= maxS/tspd; }

        const tau   = TAU[c.bbState] ?? 0.5;
        const alpha = 1 - Math.exp(-dt / tau);
        c.vx += (tvx - c.vx) * alpha;
        c.vz += (tvz - c.vz) * alpha;
      }

      // ── Mover ─────────────────────────────────────────────────────────
      if (!this.serverMode) {
        c.mesh.position.x += c.vx * dt;
        c.mesh.position.z += c.vz * dt;
      }

      // ── Confinar al corral (repulsión suave + escape por puerta) ──────────
      if (c.corrHW < 900 && !c.escaped) {
        const minX = c.corrX - c.corrHW, maxX = c.corrX + c.corrHW;
        const minZ = c.corrZ - c.corrHD, maxZ = c.corrZ + c.corrHD;
        // Puerta sur: corrHD de movimiento = fenceHD - 1 → gateZ = corrZ + corrHD + 1
        const gateKey  = `${Math.round(c.corrX)},${Math.round(c.corrZ + c.corrHD + 1)}`;
        const southOpen = openGates && openGates.has(gateKey);
        // Si pasó al sur con puerta abierta → escape definitivo
        if (southOpen && c.mesh.position.z > maxZ + 0.5) { c.escaped = true; }
        if (!c.escaped) {
          const margin = 1.2, strength = 22;
          const dX0 = c.mesh.position.x - minX;
          const dX1 = maxX - c.mesh.position.x;
          const dZ0 = c.mesh.position.z - minZ;
          const dZ1 = maxZ - c.mesh.position.z;
          if (dX0 < margin) c.vx += strength * (1 - dX0 / margin) * dt;
          if (dX1 < margin) c.vx -= strength * (1 - dX1 / margin) * dt;
          if (dZ0 < margin) c.vz += strength * (1 - dZ0 / margin) * dt;
          if (!southOpen && dZ1 < margin) c.vz -= strength * (1 - dZ1 / margin) * dt;
          c.waypoint.x = Math.max(minX + 0.5, Math.min(maxX - 0.5, c.waypoint.x));
          c.waypoint.z = Math.max(minZ + 0.5, Math.min(southOpen ? maxZ + 5 : maxZ - 0.5, c.waypoint.z));
        }
      }

      // ── Rotar + picar (bob) ────────────────────────────────────────────
      const spd = Math.sqrt(c.vx*c.vx + c.vz*c.vz);
      if (spd > 0.04) {
        // Gallina orientada en +X → usar atan2(-vz, vx)
        const targetRY = Math.atan2(-c.vz, c.vx);
        let diff = targetRY - c.mesh.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        c.mesh.rotation.y += diff * Math.min(1, 12 * dt);
        c.walkTime += dt * spd * 4.5;
        // Paso rápido de gallina (cabeceando)
        c.mesh.position.y = Math.abs(Math.sin(c.walkTime * 7)) * 0.025;
        c.mesh.rotation.x = Math.sin(c.walkTime * 7) * 0.12;  // picoteo
      } else {
        c.mesh.position.y *= 0.82;
        c.mesh.rotation.x *= 0.85;
      }
    }

    return pickup;
  }
}
