// --- Cow Herding System ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createRagdollBody, removeRagdollBody, syncMeshFromBody, bodyIsAsleep } from './physics.js';

// Vaca con scale 1.4: world half-extents del bounding box
const COW_HX = 1.10, COW_HY = 0.80, COW_HZ = 0.50, COW_MASS = 80;

// ─── GLB swap — si existe /models/cow.glb lo usa en lugar del procedural ──────
let _cowTpl     = null;
let _cowPending = [];
new GLTFLoader().load('/models/cow.glb',
  g => { _cowTpl = g.scene; _cowPending.forEach(_applyCowGLB); _cowPending = []; },
  undefined,
  () => { _cowPending = []; }
);

function _applyCowGLB(grp) {
  grp.children.slice().forEach(c => grp.remove(c));
  const vis = _cowTpl.clone(true);
  vis.scale.setScalar(0.9);
  vis.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
  grp.add(vis);
  // Remap patas si el GLB las tiene nombradas
  const names = ['leg_fr','leg_fl','leg_br','leg_bl'];
  const found = names.map(n => vis.getObjectByName(n)).filter(Boolean);
  grp._legs      = found.length === 4 ? found.map(p => ({ pivot: p, phase: 0 })) : [];
  grp._headGroup = vis.getObjectByName('head') || vis.getObjectByName('head_group') || null;
}

// Material de hitbox invisible (transparente pero detectable por raycast)
const M_HIT  = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
// Materiales para los pedazos de carne
const M_MEAT = new THREE.MeshStandardMaterial({ color: 0x8b2a0a, roughness: 0.88 });
const M_BONE = new THREE.MeshStandardMaterial({ color: 0xd4c090, roughness: 0.80 });

export const STABLE_X    = 1000;
export const STABLE_Z    = 1000;
const CORRAL_RADIUS      = 15;

const N_COWS    = 33;

// Zonas de manada para vacas sueltas — lejos del pueblo (spawn ~3.8, -69)
// 5 herds × 5 vacas = 25 vacas libres, cada manada en su zona de la pampa
const FREE_HERD_ZONES = [
  { x:  80, z:  30 },   // pampa este
  { x: 100, z: -30 },  // pampa sureste
  { x:  20, z:  80 },  // pampa norte
  { x: -30, z:  20 },  // pampa oeste
  { x:  60, z: 120 },  // pampa norte lejana
];

// ─── Corrales del nuevo mapa — 4+4 vacas distribuidas en los dos corrales ─────
export const VILLAGE_CORRAL  = { x: -137, z:  12, hw: 16, hd: 12 };
export const VILLAGE_CORRAL2 = { x: -139, z: -39, hw: 16, hd: 12 };
const N_CORRAL_COWS = 8;  // 4 en cada corral

const WALK_SPEED  = 1.8;
const FLEE_SPEED  = 5.0;
const FLEE_RADIUS = 8;

// ─── Brownian Bridge Movement Model parameters ────────────────────────────────
// Inspired by dBBMM (Kranstauber et al. 2012) adapted for real-time simulation.
// Each state controls: sigma_m (variance), drift speed, waypoint reach, timer.
const BB_STATES = {
  grazing:   { sigma: 2.2,  speed: 0.40, wpRadius: [4,  12], timer: [5,  12] },
  traveling: { sigma: 0.55, speed: 1.70, wpRadius: [20, 50], timer: [10, 20] },
  // Fleeing: high sigma (chaotic stampede) + strong drift away from threat
  fleeing:   { sigma: 3.8,  speed: 5.00, wpRadius: [50, 80], timer: [4,   8] },
};
const WAVE_SPEED    = 16;   // units/sec — yell wave propagation speed
const HERD_COHESION = 0.12;
const TAU = { grazing: 0.9, traveling: 0.45, fleeing: 0.25 };

// ─── Shared materials (5 palettes × 3 mats = 15 total) ───────────────────────
const PICKUP_RADIUS = 2.5;

const PALETTES = [
  { body: 0x5c2e0a, spot: 0xf0ece0, horn: 0xd4c090 },
  { body: 0x181008, spot: 0xe8e0d0, horn: 0xc8b870 },
  { body: 0x7a3d18, spot: 0xfff4e8, horn: 0xd0c080 },
  { body: 0x3d2010, spot: 0xd8c8b0, horn: 0xc4b060 },
  { body: 0x8b4513, spot: 0xfcf8ee, horn: 0xd8c890 },
];
const MATS = PALETTES.map(p => ({
  B: new THREE.MeshStandardMaterial({ color: p.body, roughness: 0.93 }),
  S: new THREE.MeshStandardMaterial({ color: p.spot, roughness: 0.90 }),
  H: new THREE.MeshStandardMaterial({ color: p.horn, roughness: 0.80 }),
}));

// ─── Gaussian random (Box-Muller) ─────────────────────────────────────────────
function _gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ─── Seeded PRNG ──────────────────────────────────────────────────────────────
function _rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ─── Flying-part physics helpers (shared by cows + chickens) ─────────────────
const _tmpV3 = new THREE.Vector3();

function spawnFlyingPart(scene, worldPos, geo, color, detachedParts, hitPoint) {
  const mat  = new THREE.MeshStandardMaterial({ color, roughness: 0.85, transparent: true, opacity: 1, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(worldPos);
  mesh.castShadow = true;
  scene.add(mesh);
  // Launch away from hit point + upward
  const away = hitPoint
    ? new THREE.Vector3().subVectors(worldPos, hitPoint).normalize()
    : new THREE.Vector3((Math.random()-0.5)*2, 1, (Math.random()-0.5)*2).normalize();
  const vel = new THREE.Vector3(
    away.x * 5 + (Math.random()-0.5) * 4,
    Math.abs(away.y) * 2 + 5 + Math.random() * 4,
    away.z * 5 + (Math.random()-0.5) * 4
  );
  const angVel = new THREE.Vector3(
    (Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20
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
    if (p.mesh.position.y < 0.04) {
      p.mesh.position.y = 0.04;
      p.vel.y *= -0.25;
      p.vel.x *= 0.60;
      p.vel.z *= 0.60;
      p.angVel.multiplyScalar(0.4);
    }
    if (p.t > p.maxT - 0.6) {
      p.mesh.material.opacity = Math.max(0, (p.maxT - p.t) / 0.6);
    }
  }
}

// ─── Muerte con físicas ───────────────────────────────────────────────────────
const DEATH_PHYSICS_LIFE = 90; // segundos antes de auto-eliminar

function _startDeathPhysics(entity, hitPoint) {
  entity.wounded      = false;
  entity.dyingPhysics = true;

  const pos = entity.mesh.position;
  // Centro de masa: mitad de la altura del animal sobre el suelo
  const cy = pos.y + COW_HY + 0.05;
  const body = createRagdollBody(pos.x, cy, pos.z, COW_HX, COW_HY, COW_HZ, COW_MASS);

  // Heredar orientación actual del mesh
  body.quaternion.set(
    entity.mesh.quaternion.x, entity.mesh.quaternion.y,
    entity.mesh.quaternion.z, entity.mesh.quaternion.w
  );

  // Dirección del impulso: alejarse del punto de impacto
  let dx = 0, dz = 0;
  if (hitPoint) {
    dx = pos.x - hitPoint.x; dz = pos.z - hitPoint.z;
    const d = Math.sqrt(dx * dx + dz * dz) || 1;
    dx /= d; dz /= d;
  } else {
    const a = Math.random() * Math.PI * 2;
    dx = Math.cos(a); dz = Math.sin(a);
  }
  const spd = 4.0 + Math.random() * 3;
  body.velocity.set(dx * spd, 2.5 + Math.random() * 1.5, dz * spd);
  body.angularVelocity.set(
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 3,
    (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 3)
  );

  entity._physBody = body;
  entity._phyHY   = COW_HY;
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

// ─── Build a single cow mesh (body group + separate head group) ───────────────
function buildCow(rng) {
  const palIdx = Math.floor(rng() * PALETTES.length);
  const mat    = MATS[palIdx];

  const mk = (w, h, d, x, y, z, material) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z);
    m.castShadow = true;
    return m;
  };

  const grp = new THREE.Group();

  // ─ Body parts
  grp.add(mk(1.55, 0.82, 0.68,  0.00, 0.92,  0.00,   mat.B));  // torso
  grp.add(mk(0.28, 0.40, 0.26,  0.80, 1.18,  0.00,   mat.B));  // neck
  grp.add(mk(0.09, 0.55, 0.08, -0.85, 0.98,  0.00,   mat.B));  // tail
  grp.add(mk(0.58, 0.80, 0.71,  0.18, 0.92,  0.001,  mat.S));  // body patch
  grp.add(mk(0.30, 0.13, 0.26, -0.10, 0.518, 0.001,  mat.S));  // udder

  // Head group (separate so it can be hidden on headshot)
  const headGroup = new THREE.Group();
  headGroup.add(mk(0.48, 0.40, 0.36,  1.10, 1.44,  0.00,   mat.B));  // head
  headGroup.add(mk(0.07, 0.14, 0.05,  1.03, 1.66,  0.20,   mat.B));  // ear R
  headGroup.add(mk(0.07, 0.14, 0.05,  1.03, 1.66, -0.20,   mat.B));  // ear L
  headGroup.add(mk(0.20, 0.19, 0.30,  1.32, 1.38,  0.001,  mat.S));  // snout
  headGroup.add(mk(0.05, 0.17, 0.04,  0.98, 1.72,  0.18,   mat.H));  // horn R
  headGroup.add(mk(0.05, 0.17, 0.04,  0.98, 1.72, -0.18,   mat.H));  // horn L

  grp.add(headGroup);

  // ─ Leg pivots (separate from body so they can be animated)
  // Each pivot sits at the top of the leg (where leg meets body).
  // Leg mesh hangs down from pivot; hoof is at the bottom.
  const legDefs = [
    { x:  0.48, z:  0.27, phase: 0 },          // FR
    { x:  0.48, z: -0.27, phase: Math.PI },     // FL
    { x: -0.48, z:  0.27, phase: Math.PI },     // BR
    { x: -0.48, z: -0.27, phase: 0 },           // BL
  ];
  const cowLegs = [];
  for (const def of legDefs) {
    const pivot = new THREE.Group();
    pivot.position.set(def.x, 0.70, def.z);
    // Leg body
    const legMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.70, 0.14),
      mat.B
    );
    legMesh.position.set(0, -0.35, 0);
    legMesh.castShadow = true;
    pivot.add(legMesh);
    // Hoof
    const hoofMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.05, 0.15),
      mat.S
    );
    hoofMesh.position.set(0, -0.725, 0);
    hoofMesh.castShadow = true;
    pivot.add(hoofMesh);
    grp.add(pivot);
    cowLegs.push({ pivot, phase: def.phase });
  }
  grp._legs       = cowLegs;
  grp._headGroup  = headGroup;
  grp._headColor  = mat.B.color.getHex();

  if (_cowTpl)       _applyCowGLB(grp);
  else if (_cowPending) _cowPending.push(grp);

  return grp;
}

// ─── CowSystem ────────────────────────────────────────────────────────────────
function buildMeatPiece() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.10, 0.22), M_MEAT);
  body.castShadow = true;
  g.add(body);
  const bone = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.28), M_BONE);
  bone.position.set(0.12, 0.06, 0);
  bone.castShadow = true;
  g.add(bone);
  return g;
}

export class CowSystem {
  constructor(scene) {
    this._scene     = scene;
    this._cows      = [];
    this._corralled = new Set();
    this._hitboxMap = new Map();   // hitboxMesh → cowId
    this._meats     = [];          // { mesh, t, bobPhase }
    this._bloodSpots = [];

    const rng = _rng(98765);
    for (let i = 0; i < N_COWS; i++) {
      const mesh  = buildCow(rng);
      // First 4 cows → corral A, next 4 → corral B, rest → free range
      let x, z;
      if (i < 4) {
        x = VILLAGE_CORRAL.x  + (rng() * 2 - 1) * (VILLAGE_CORRAL.hw  - 2.5);
        z = VILLAGE_CORRAL.z  + (rng() * 2 - 1) * (VILLAGE_CORRAL.hd  - 2.5);
      } else if (i < N_CORRAL_COWS) {
        x = VILLAGE_CORRAL2.x + (rng() * 2 - 1) * (VILLAGE_CORRAL2.hw - 2.5);
        z = VILLAGE_CORRAL2.z + (rng() * 2 - 1) * (VILLAGE_CORRAL2.hd - 2.5);
      } else {
        // Distribuir en 5 manadas de ~5 vacas, cada una en su zona de la pampa
        const zone = FREE_HERD_ZONES[Math.floor((i - N_CORRAL_COWS) / 5) % FREE_HERD_ZONES.length];
        x = zone.x + (rng() * 2 - 1) * 18;
        z = zone.z + (rng() * 2 - 1) * 18;
      }
      mesh.position.set(x, 0, z);
      mesh.rotation.y = rng() * Math.PI * 2;
      mesh.scale.set(1.4, 1.4, 1.4);

      // Hitbox en espacio local (antes del scale 1.4×)
      // Cubre cuerpo + cabeza de la vaca
      const hb = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 0.85), M_HIT);
      hb.position.set(0.2, 0.88, 0);
      mesh.add(hb);
      this._hitboxMap.set(hb, i);

      scene.add(mesh);

      // Initial BB state: 60% grazing, 40% traveling
      const initState = rng() < 0.6 ? 'grazing' : 'traveling';
      const initP     = BB_STATES[initState];
      const initWPr   = initP.wpRadius;
      const initWPang = rng() * Math.PI * 2;
      const initWPd   = initWPr[0] + rng() * (initWPr[1] - initWPr[0]);

      const inCorral = i < N_CORRAL_COWS;
      this._cows.push({
        id:           i,
        mesh,
        hitbox:       hb,
        vx:           0,
        vz:           0,
        walkTime:     rng() * 10,
        panicTimer:   0,
        removed:      false,

        // ── Corral confinement ────────────────────────────────────────────────
        corrX:   i < 4             ? VILLAGE_CORRAL.x   : i < N_CORRAL_COWS ? VILLAGE_CORRAL2.x  : null,
        corrZ:   i < 4             ? VILLAGE_CORRAL.z   : i < N_CORRAL_COWS ? VILLAGE_CORRAL2.z  : null,
        corrHW:  i < N_CORRAL_COWS ? VILLAGE_CORRAL.hw  : 9999,
        corrHD:  i < N_CORRAL_COWS ? VILLAGE_CORRAL.hd  : 9999,
        escaped: false,

        // ── HP / wound state ─────────────────────────────────────────────────
        hp:            2,
        wounded:       false,
        woundedT:      0,
        woundedMaxT:   5 + rng() * 3,
        dyingPhysics:  false,
        _phy:          null,
        detachedParts: [],

        // ── dBBMM state ──────────────────────────────────────────────────────
        bbState:      inCorral ? 'grazing' : initState,
        waypoint:     {
          x: inCorral
            ? x + (rng() * 2 - 1) * 4
            : x + Math.cos(initWPang) * initWPd,
          z: inCorral
            ? z + (rng() * 2 - 1) * 4
            : z + Math.sin(initWPang) * initWPd,
        },
        waypointTimer: rng() * initP.timer[1],
        herdId:       Math.floor(i / 5),   // groups of ~5
        // legacy (kept for panic/yell compatibility)
        wanderAngle:  rng() * Math.PI * 2,
      });
    }
  }

  /** Retorna todos los hitboxes de vacas vivas con matrixWorld actualizado. */
  getCowHitboxes() {
    const result = [];
    for (const cow of this._cows) {
      if (cow.removed) continue;
      cow.hitbox.updateWorldMatrix(true, false);
      result.push(cow.hitbox);
    }
    return result;
  }

  /** Dado un hitbox mesh, retorna el id de la vaca (-1 si no encontrado). */
  getCowIdByHitbox(hbMesh) {
    const id = this._hitboxMap.get(hbMesh);
    return id !== undefined ? id : -1;
  }

  /** Internal removal + meat drop (used by hitCow wounded path and killCow wrapper). */
  _killCowInternal(cow) {
    if (!cow || cow.removed) return;
    const wx = cow.mesh.position.x;
    const wz = cow.mesh.position.z;
    cow.removed = true;
    removeRagdollBody(cow._physBody); cow._physBody = null;
    this._hitboxMap.delete(cow.hitbox);
    this._scene.remove(cow.mesh);
    cow.mesh.traverse(o => { if (o.isMesh) o.geometry?.dispose(); });
    // Soltar 8 pedazos de carne
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
      const r   = 0.5 + Math.random() * 1.2;
      const m   = buildMeatPiece();
      m.position.set(wx + Math.cos(ang) * r, 0.12, wz + Math.sin(ang) * r);
      m.rotation.y = Math.random() * Math.PI * 2;
      this._scene.add(m);
      this._meats.push({ mesh: m, t: 0, bobPhase: Math.random() * Math.PI * 2 });
    }
  }

  /** Public wrapper: matar vaca por id (usable externamente, p.ej. disparo instantáneo). */
  killCow(id) {
    const cow = this._cows[id];
    if (!cow || cow.removed || cow.dyingPhysics) return;
    this._hitboxMap.delete(cow.hitbox);
    cow.hitbox.visible = false;
    cow.wounded = false;
    _startDeathPhysics(cow);
  }

  /** Devuelve la vaca herida más cercana dentro de radius, o null. */
  getNearbyWounded(x, z, radius) {
    const r2 = radius * radius;
    let nearest = null, nearestD2 = r2;
    for (const cow of this._cows) {
      if ((!cow.wounded && !cow.dyingPhysics) || cow.removed || cow._beingButchered || !cow.mesh) continue;
      const dx = cow.mesh.position.x - x, dz = cow.mesh.position.z - z;
      const d2 = dx * dx + dz * dz;
      if (d2 < nearestD2) { nearestD2 = d2; nearest = cow; }
    }
    return nearest;
  }

  /** Deshuesar vaca herida: spawna carne y la elimina. El pickup es por proximidad. */
  lootWounded(cow) {
    if (!cow || cow.removed) return null;
    if (!cow.dyingPhysics) return null;
    const wx = cow._physBody ? cow._physBody.position.x : (cow.mesh?.position.x ?? 0);
    const wz = cow._physBody ? cow._physBody.position.z : (cow.mesh?.position.z ?? 0);
    cow.removed      = true;
    cow.dyingPhysics = false;
    removeRagdollBody(cow._physBody); cow._physBody = null;
    this._hitboxMap?.delete(cow.hitbox);
    if (cow.mesh) {
      this._scene.remove(cow.mesh);
      cow.mesh.traverse(o => { if (o.isMesh) o.geometry?.dispose(); });
      cow.mesh = null;
    }
    // Soltar pedazos de carne — pickup por proximidad vía updateMeats
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2 + Math.random() * 0.5;
      const r   = 1.2 + Math.random() * 2.2;
      const m   = buildMeatPiece();
      m.position.set(wx + Math.cos(ang) * r, 0.12, wz + Math.sin(ang) * r);
      m.rotation.y = Math.random() * Math.PI * 2;
      this._scene.add(m);
      this._meats.push({ mesh: m, t: 0, bobPhase: Math.random() * Math.PI * 2 });
    }
    return null;  // el pickup real lo hace updateMeats
  }

  /** Disparar vaca: al primer tiro vuela un miembro y cae con físicas inmediatamente. */
  hitCow(id, hitPoint, hitZone) {
    const cow = this._cows[id];
    if (!cow || cow.removed || cow.dyingPhysics) return;

    // Spawn flying part based on hit zone
    const scale = 1.4;
    const mx = cow.mesh.position.x, mz = cow.mesh.position.z;

    if (hitZone === 'head' && cow.mesh._headGroup && !cow._headDetached) {
      cow._headDetached = true;
      cow.mesh._headGroup.visible = false;
      const headWorldPos = new THREE.Vector3(
        mx + Math.cos(cow.mesh.rotation.y) * 1.10 * scale,
        1.44 * scale,
        mz - Math.sin(cow.mesh.rotation.y) * 1.10 * scale
      );
      spawnFlyingPart(
        this._scene, headWorldPos,
        new THREE.BoxGeometry(0.48 * scale, 0.40 * scale, 0.36 * scale),
        cow.mesh._headColor ?? 0x5c2e0a,
        cow.detachedParts, hitPoint
      );
    } else if (hitZone === 'leg' && cow.mesh._legs?.length > 0) {
      const legEntry = cow.mesh._legs.shift();
      if (legEntry?.pivot) {
        legEntry.pivot.visible = false;
        const legWorldPos = new THREE.Vector3();
        legEntry.pivot.getWorldPosition(legWorldPos);
        if (legWorldPos.y < 0.01) legWorldPos.y = 0.35 * scale;
        spawnFlyingPart(
          this._scene, legWorldPos,
          new THREE.BoxGeometry(0.16 * scale, 0.70 * scale, 0.14 * scale),
          cow.mesh._headColor ?? 0x5c2e0a,
          cow.detachedParts, hitPoint
        );
      }
    }

    // Primer tiro → inmediatamente ragdoll con impulso direccional
    this._hitboxMap.delete(cow.hitbox);
    cow.hitbox.visible = false;
    _startDeathPhysics(cow, hitPoint);
  }

  _spawnBloodSpot(x, z) {
    if (this._bloodSpots.length > 150) {
      const old = this._bloodSpots.shift();
      this._scene.remove(old);
      old.geometry?.dispose();
    }
    const geo  = new THREE.CircleGeometry(0.25 + Math.random() * 0.35, 7);
    const mat  = new THREE.MeshBasicMaterial({
      color: 0x550000, transparent: true, opacity: 0.75 + Math.random() * 0.2,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(
      x + (Math.random() - 0.5) * 0.5,
      0.012,
      z + (Math.random() - 0.5) * 0.5
    );
    this._scene.add(mesh);
    this._bloodSpots.push(mesh);
  }

  /** Tick de los pedazos de carne flotantes. Retorna pickup si el jugador recoge uno. */
  updateMeats(dt, playerPos) {
    let pickup = null;
    for (let i = this._meats.length - 1; i >= 0; i--) {
      const c = this._meats[i];
      c.t += dt;
      c.mesh.position.y  = 0.12 + Math.sin(c.t * 2.4 + c.bobPhase) * 0.07;
      c.mesh.rotation.y += dt * 0.9;
      if (playerPos && !pickup) {
        const dx = c.mesh.position.x - playerPos.x;
        const dz = c.mesh.position.z - playerPos.z;
        if (dx * dx + dz * dz < PICKUP_RADIUS * PICKUP_RADIUS) {
          this._scene.remove(c.mesh);
          this._meats.splice(i, 1);
          pickup = { hp: 8, hunger: 18 };
          continue;
        }
      }
      if (c.t > 300) { this._scene.remove(c.mesh); this._meats.splice(i, 1); }
    }
    return pickup;
  }

  // Apply a corralled state (idempotent, safe to call twice)
  corrall(id) {
    if (this._corralled.has(id)) return;
    this._corralled.add(id);
    const cow = this._cows[id];
    if (cow && !cow.removed) {
      cow.removed = true;
      this._scene.remove(cow.mesh);
      cow.mesh.traverse(o => { if (o.isMesh) o.geometry?.dispose(); });
    }
  }

  getCorralled() { return this._corralled.size; }
  getTotal()     { return N_COWS; }

  /**
   * Yell (F key): expanding wave at WAVE_SPEED units/sec.
   * Each cow enters dBBMM 'fleeing' state when the wave reaches it.
   * Waypoint is set away from threat, blended 70% flee / 30% toward stable.
   */
  yell(px, pz, radius = 32) {
    for (const cow of this._cows) {
      if (cow.removed) continue;
      const cx = cow.mesh.position.x, cz = cow.mesh.position.z;
      const dx = cx - px, dz = cz - pz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > radius) continue;

      // Wave delay: cows farther away react later (expanding ring effect)
      const delayMs = (dist / WAVE_SPEED) * 1000;

      const nx = dist > 0.2 ? dx / dist : (Math.random() - 0.5) * 2;
      const nz = dist > 0.2 ? dz / dist : (Math.random() - 0.5) * 2;

      setTimeout(() => {
        if (cow.removed) return;
        const wx = cow.mesh.position.x, wz = cow.mesh.position.z;

        // Blend flee direction (70%) with stable direction (30%)
        const toDstX = STABLE_X - wx, toDstZ = STABLE_Z - wz;
        const toDstLen = Math.sqrt(toDstX * toDstX + toDstZ * toDstZ) || 1;
        const bx = nx * 0.7 + (toDstX / toDstLen) * 0.3;
        const bz = nz * 0.7 + (toDstZ / toDstLen) * 0.3;
        const bl = Math.sqrt(bx * bx + bz * bz) || 1;

        const wpDist = 55 + Math.random() * 25;
        cow.bbState      = 'fleeing';
        cow.waypoint     = { x: wx + (bx / bl) * wpDist, z: wz + (bz / bl) * wpDist };
        cow.panicTimer   = 5.0 + Math.random() * 3;
        cow.waypointTimer = cow.panicTimer + 2;
        cow.wanderAngle  = Math.atan2(bx / bl, bz / bl);   // for contagion compat
      }, delayMs);
    }
  }

  /**
   * Contagion: panicking cows (bbState='fleeing') spread panic to calm neighbors.
   * Neighbor picks a waypoint away from the panicking cow — same dBBMM fleeing state.
   */
  _spreadPanic() {
    for (const cow of this._cows) {
      if (cow.removed || cow.bbState !== 'fleeing' || cow.panicTimer <= 0) continue;
      const cx = cow.mesh.position.x, cz = cow.mesh.position.z;
      for (const other of this._cows) {
        if (other.removed || other.bbState === 'fleeing' || other.id === cow.id) continue;
        const dx = other.mesh.position.x - cx;
        const dz = other.mesh.position.z - cz;
        if (dx * dx + dz * dz >= 12 * 12) continue;

        // Other cow runs away from panicking cow, blended toward stable
        const dist = Math.sqrt(dx * dx + dz * dz) || 1;
        const nx = dx / dist, nz = dz / dist;
        const toDstX = STABLE_X - other.mesh.position.x;
        const toDstZ = STABLE_Z - other.mesh.position.z;
        const toDstLen = Math.sqrt(toDstX * toDstX + toDstZ * toDstZ) || 1;
        const bx = nx * 0.7 + (toDstX / toDstLen) * 0.3;
        const bz = nz * 0.7 + (toDstZ / toDstLen) * 0.3;
        const bl = Math.sqrt(bx * bx + bz * bz) || 1;

        const wpDist = 40 + Math.random() * 20;
        other.bbState      = 'fleeing';
        other.waypoint     = {
          x: other.mesh.position.x + (bx / bl) * wpDist,
          z: other.mesh.position.z + (bz / bl) * wpDist,
        };
        other.panicTimer   = 2.5 + Math.random() * 2;
        other.waypointTimer = other.panicTimer + 1;
        other.wanderAngle  = Math.atan2(bx / bl, bz / bl);
      }
    }
  }

  /**
   * Brownian Bridge Movement Model (dBBMM-inspired) cow update.
   *
   * Each cow has a state (grazing / traveling) that controls:
   *   - sigma_m  : Brownian motion variance — high = tortuous, low = directed
   *   - drift speed toward its current waypoint
   *   - waypoint radius and timer range
   *
   * Group cohesion: cows of the same herdId are pulled toward their centroid.
   * Panic / flee override the BB model exactly as before.
   *
   * playerPositions: array of {x, z}
   * Returns array of cow IDs that entered the stable this frame.
   */
  update(dt, playerPositions, openGates) {
    const newlyCorralled = [];

    // ── Tick detached flying parts for all cows (including wounded/removed) ──
    for (const cow of this._cows) {
      if (cow.detachedParts.length > 0) tickFlyingParts(this._scene, cow.detachedParts, dt);
    }

    // ── 1. Compute per-herd centroids ─────────────────────────────────────────
    const herdSum = new Map();
    for (const cow of this._cows) {
      if (cow.removed) continue;
      let s = herdSum.get(cow.herdId);
      if (!s) { s = { x: 0, z: 0, n: 0 }; herdSum.set(cow.herdId, s); }
      s.x += cow.mesh.position.x;
      s.z += cow.mesh.position.z;
      s.n += 1;
    }
    const herdCentroid = new Map();
    for (const [hid, s] of herdSum) {
      herdCentroid.set(hid, { x: s.x / s.n, z: s.z / s.n });
    }

    // ── 2. Per-cow update ─────────────────────────────────────────────────────
    for (const cow of this._cows) {
      if (cow.removed) continue;

      // ── Physics death (cannon ragdoll) ───────────────────────────────────
      if (cow.dyingPhysics) {
        _tickDeathPhysics(cow, dt);
        if (cow._phy.t >= DEATH_PHYSICS_LIFE) {
          cow.removed = true;
          cow.dyingPhysics = false;
          removeRagdollBody(cow._physBody);
          cow._physBody = null;
          this._scene.remove(cow.mesh);
        }
        continue;
      }

      const cx = cow.mesh.position.x;
      const cz = cow.mesh.position.z;

      // Corral arrival
      const dsx = cx - STABLE_X, dsz = cz - STABLE_Z;
      if (dsx * dsx + dsz * dsz < CORRAL_RADIUS * CORRAL_RADIUS) {
        newlyCorralled.push(cow.id);
        continue;
      }

      // ── Player proximity → instantly enter fleeing state ─────────────────
      let fleeX = 0, fleeZ = 0, playerTooClose = false;
      for (const pp of playerPositions) {
        const pdx = cx - pp.x, pdz = cz - pp.z;
        const d2  = pdx * pdx + pdz * pdz;
        if (d2 < FLEE_RADIUS * FLEE_RADIUS && d2 > 0.001) {
          const inv = 1 / Math.sqrt(d2);
          fleeX += pdx * inv; fleeZ += pdz * inv; playerTooClose = true;
        }
      }

      if (playerTooClose) {
        // Normalize flee direction, blend 70% away / 30% toward stable
        const fl = Math.sqrt(fleeX * fleeX + fleeZ * fleeZ) || 1;
        const nx = fleeX / fl, nz = fleeZ / fl;
        const toDstX = STABLE_X - cx, toDstZ = STABLE_Z - cz;
        const toDstLen = Math.sqrt(toDstX * toDstX + toDstZ * toDstZ) || 1;
        const bx = nx * 0.7 + (toDstX / toDstLen) * 0.3;
        const bz = nz * 0.7 + (toDstZ / toDstLen) * 0.3;
        const bl = Math.sqrt(bx * bx + bz * bz) || 1;

        cow.bbState      = 'fleeing';
        cow.waypoint     = { x: cx + (bx / bl) * 60, z: cz + (bz / bl) * 60 };
        cow.panicTimer   = Math.max(cow.panicTimer, 3.0);
        cow.waypointTimer = cow.panicTimer + 2;
        cow.wanderAngle  = Math.atan2(bx / bl, bz / bl);
      }

      // ── panicTimer countdown — transition back to grazing when calm ────────
      if (cow.panicTimer > 0) {
        cow.panicTimer -= dt;
        if (cow.panicTimer <= 0 && cow.bbState === 'fleeing') {
          cow.bbState = 'grazing';
          const ang = Math.random() * Math.PI * 2;
          cow.waypoint      = { x: cx + Math.cos(ang) * 8, z: cz + Math.sin(ang) * 8 };
          cow.waypointTimer = 5 + Math.random() * 8;
        }
      }

      // ── dBBMM: unified Brownian Bridge step for ALL states ────────────────
      {
        const p = BB_STATES[cow.bbState] ?? BB_STATES.grazing;

        cow.waypointTimer -= dt;
        const dwx  = cow.waypoint.x - cx;
        const dwz  = cow.waypoint.z - cz;
        const wDst = Math.sqrt(dwx * dwx + dwz * dwz) || 1;

        // Arrived at / past waypoint, or timer expired → pick new (non-fleeing only)
        if (cow.bbState !== 'fleeing' && (wDst < p.wpRadius[0] * 0.5 || cow.waypointTimer <= 0)) {
          if (Math.random() < 0.35) {
            cow.bbState = cow.bbState === 'grazing' ? 'traveling' : 'grazing';
          }
          const np  = BB_STATES[cow.bbState];
          const ang = Math.random() * Math.PI * 2;
          const d   = np.wpRadius[0] + Math.random() * (np.wpRadius[1] - np.wpRadius[0]);
          cow.waypoint      = { x: cx + Math.cos(ang) * d, z: cz + Math.sin(ang) * d };
          cow.waypointTimer = np.timer[0] + Math.random() * (np.timer[1] - np.timer[0]);
        }

        // Drift toward waypoint
        const driftX = (dwx / wDst) * p.speed;
        const driftZ = (dwz / wDst) * p.speed;

        // Cohesion toward herd centroid (suppressed during fleeing)
        const hc   = herdCentroid.get(cow.herdId);
        const cohF = cow.bbState === 'fleeing' ? 0.02 : HERD_COHESION;
        const cohX = hc ? (hc.x - cx) * cohF : 0;
        const cohZ = hc ? (hc.z - cz) * cohF : 0;

        // Brownian noise (Gaussian, σ ∝ sigma_m × √dt)
        const sigma  = p.sigma * Math.sqrt(dt);
        const noiseX = _gaussian() * sigma;
        const noiseZ = _gaussian() * sigma;

        let targetVX = driftX + cohX + noiseX;
        let targetVZ = driftZ + cohZ + noiseZ;

        // Speed cap
        const tspd = Math.sqrt(targetVX * targetVX + targetVZ * targetVZ);
        const maxS = p.speed * 1.5;
        if (tspd > maxS) { targetVX *= maxS / tspd; targetVZ *= maxS / tspd; }

        const tau   = TAU[cow.bbState] ?? 0.6;
        const alpha = 1 - Math.exp(-dt / tau);
        cow.vx += (targetVX - cow.vx) * alpha;
        cow.vz += (targetVZ - cow.vz) * alpha;
      }  // end dBBMM block

      // ── Move ──────────────────────────────────────────────────────────────
      cow.mesh.position.x += cow.vx * dt;
      cow.mesh.position.z += cow.vz * dt;

      // ── Corral boundary (repulsión suave + escape por puerta sur) ─────────
      if (cow.corrHW < 9999 && !cow.escaped) {
        const minX = cow.corrX - cow.corrHW, maxX = cow.corrX + cow.corrHW;
        const minZ = cow.corrZ - cow.corrHD, maxZ = cow.corrZ + cow.corrHD;
        // Puerta sur del corral: gateZ = corrZ + corrHD (para vacas corrHD == fenceHD)
        const gateKey   = `${Math.round(cow.corrX)},${Math.round(cow.corrZ + cow.corrHD)}`;
        const southOpen = openGates && openGates.has(gateKey);
        // Pasó al sur con puerta abierta → escape definitivo
        if (southOpen && cow.mesh.position.z > maxZ + 1.0) { cow.escaped = true; }
        if (!cow.escaped) {
          const margin = 2.0, strength = 18;
          const dX0 = cow.mesh.position.x - minX;
          const dX1 = maxX - cow.mesh.position.x;
          const dZ0 = cow.mesh.position.z - minZ;
          const dZ1 = maxZ - cow.mesh.position.z;
          if (dX0 < margin) cow.vx += strength * (1 - dX0 / margin) * dt;
          if (dX1 < margin) cow.vx -= strength * (1 - dX1 / margin) * dt;
          if (dZ0 < margin) cow.vz += strength * (1 - dZ0 / margin) * dt;
          if (!southOpen && dZ1 < margin) cow.vz -= strength * (1 - dZ1 / margin) * dt;
          cow.waypoint.x = Math.max(minX + 1, Math.min(maxX - 1, cow.waypoint.x));
          cow.waypoint.z = Math.max(minZ + 1, Math.min(southOpen ? maxZ + 8 : maxZ - 1, cow.waypoint.z));
        }
      }

      // ── Rotate & horse-like leg animation ────────────────────────────────
      const spd = Math.sqrt(cow.vx * cow.vx + cow.vz * cow.vz);
      if (spd > 0.10) {
        const targetRY = Math.atan2(-cow.vz, cow.vx);
        let diff = targetRY - cow.mesh.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        cow.mesh.rotation.y += diff * Math.min(1, 7 * dt);
        cow.walkTime += dt;
        // Horse-like gait: diagonal pairs (FR+BL) opposite to (FL+BR)
        // freq scales with speed but is NOT double-counted via walkTime accumulation
        const freq = Math.min(5.5, Math.max(2.0, spd * 2.0));
        const amp  = Math.min(0.50, 0.26 + spd * 0.03);
        if (cow.mesh._legs) {
          for (const leg of cow.mesh._legs) {
            leg.pivot.rotation.z = Math.sin(cow.walkTime * freq + leg.phase) * amp;
          }
        }
        // Subtle body bob (less than before — legs carry the motion)
        cow.mesh.position.y = Math.abs(Math.sin(cow.walkTime * freq)) * 0.030;
      } else {
        // Return legs smoothly to rest
        if (cow.mesh._legs) {
          for (const leg of cow.mesh._legs) {
            leg.pivot.rotation.z *= 0.80;
          }
        }
        cow.mesh.position.y *= 0.85;
      }
    }  // end per-cow loop

    this._spreadPanic();
    return newlyCorralled;
  }
}
