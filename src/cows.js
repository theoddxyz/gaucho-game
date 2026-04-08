// --- Cow Herding System ---
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Material de hitbox invisible (transparente pero detectable por raycast)
const M_HIT  = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
// Materiales para los pedazos de carne
const M_MEAT = new THREE.MeshStandardMaterial({ color: 0x8b2a0a, roughness: 0.88 });
const M_BONE = new THREE.MeshStandardMaterial({ color: 0xd4c090, roughness: 0.80 });

export const STABLE_X    = 1000;
export const STABLE_Z    = 1000;
const CORRAL_RADIUS      = 15;

const SPAWN_X   = 3.8;
const SPAWN_Z   = -69;
const N_COWS    = 33;

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

// ─── Build a single cow mesh (3 draw calls: body / spot / horn) ───────────────
function buildCow(rng) {
  const palIdx = Math.floor(rng() * PALETTES.length);
  const mat    = MATS[palIdx];

  const bodyG = [], spotG = [], hornG = [];

  const b = (arr, w, h, d, x, y, z) => {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(x, y, z);
    arr.push(g);
  };

  // ─ Body
  b(bodyG, 1.55, 0.82, 0.68,  0.00, 0.92,  0.00);   // torso
  b(bodyG, 0.28, 0.40, 0.26,  0.80, 1.18,  0.00);   // neck
  b(bodyG, 0.48, 0.40, 0.36,  1.10, 1.44,  0.00);   // head
  b(bodyG, 0.07, 0.14, 0.05,  1.03, 1.66,  0.20);   // ear R
  b(bodyG, 0.07, 0.14, 0.05,  1.03, 1.66, -0.20);   // ear L
  b(bodyG, 0.09, 0.55, 0.08, -0.85, 0.98,  0.00);   // tail
  b(bodyG, 0.16, 0.70, 0.14,  0.48, 0.35,  0.27);   // leg FR
  b(bodyG, 0.16, 0.70, 0.14,  0.48, 0.35, -0.27);   // leg FL
  b(bodyG, 0.16, 0.70, 0.14, -0.48, 0.35,  0.27);   // leg BR
  b(bodyG, 0.16, 0.70, 0.14, -0.48, 0.35, -0.27);   // leg BL

  // ─ Spots / light parts (ligeramente desplazados en Z/Y para evitar z-fighting)
  b(spotG, 0.58, 0.80, 0.71,  0.18, 0.92,  0.001);  // body patch
  b(spotG, 0.20, 0.19, 0.30,  1.32, 1.38,  0.001);  // snout
  b(spotG, 0.30, 0.13, 0.26, -0.10, 0.518, 0.001);  // udder
  b(spotG, 0.17, 0.05, 0.15,  0.48, 0.008, 0.27);   // hoof FR
  b(spotG, 0.17, 0.05, 0.15,  0.48, 0.008,-0.27);   // hoof FL
  b(spotG, 0.17, 0.05, 0.15, -0.48, 0.008, 0.27);   // hoof BR
  b(spotG, 0.17, 0.05, 0.15, -0.48, 0.008,-0.27);   // hoof BL

  // ─ Horns
  b(hornG, 0.05, 0.17, 0.04,  0.98, 1.72,  0.18);
  b(hornG, 0.05, 0.17, 0.04,  0.98, 1.72, -0.18);

  const mk = (geos, mat) => {
    const merged = mergeGeometries(geos);
    geos.forEach(g => g.dispose());
    const m = new THREE.Mesh(merged, mat);
    m.castShadow = true;
    return m;
  };

  const grp = new THREE.Group();
  grp.add(mk(bodyG, mat.B));
  grp.add(mk(spotG, mat.S));
  grp.add(mk(hornG, mat.H));
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

    const rng = _rng(98765);
    for (let i = 0; i < N_COWS; i++) {
      const mesh  = buildCow(rng);
      const angle = rng() * Math.PI * 2;
      const dist  = 8 + rng() * 50;
      const x     = SPAWN_X + Math.cos(angle) * dist;
      const z     = SPAWN_Z + Math.sin(angle) * dist;
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

      this._cows.push({
        id:           i,
        mesh,
        hitbox:       hb,
        vx:           0,
        vz:           0,
        walkTime:     rng() * 10,
        panicTimer:   0,
        removed:      false,

        // ── dBBMM state ──────────────────────────────────────────────────────
        bbState:      initState,
        waypoint:     {
          x: x + Math.cos(initWPang) * initWPd,
          z: z + Math.sin(initWPang) * initWPd,
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

  /** Matar vaca: la saca de la escena y suelta 8 pedazos de carne. */
  killCow(id) {
    const cow = this._cows[id];
    if (!cow || cow.removed) return;
    const wx = cow.mesh.position.x;
    const wz = cow.mesh.position.z;
    // Quitar de la escena
    cow.removed = true;
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
  update(dt, playerPositions) {
    const newlyCorralled = [];

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

      // ── Rotate & body-bob ─────────────────────────────────────────────────
      const spd = Math.sqrt(cow.vx * cow.vx + cow.vz * cow.vz);
      if (spd > 0.10) {
        const targetRY = Math.atan2(cow.vx, cow.vz);
        let diff = targetRY - cow.mesh.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        cow.mesh.rotation.y += diff * Math.min(1, 7 * dt);
        cow.walkTime += dt * spd * 2.2;
        cow.mesh.position.y = Math.abs(Math.sin(cow.walkTime * 3)) * 0.045;
      } else {
        cow.mesh.position.y *= 0.88;
      }
    }  // end per-cow loop

    this._spreadPanic();
    return newlyCorralled;
  }
}
