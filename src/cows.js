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

      this._cows.push({
        id:           i,
        mesh,
        hitbox:       hb,
        vx:           0,
        vz:           0,
        wanderAngle:  rng() * Math.PI * 2,
        wanderSpeed:  WALK_SPEED * (0.5 + rng() * 0.6),
        wanderTimer:  rng() * 6,
        walkTime:     rng() * 10,
        panicTimer:   0,    // seconds remaining of post-yell stampede
        removed:      false,
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
   * Yell: cows within `radius` units get a velocity kick away from (px, pz)
   * and enter stampede mode (keep running for ~5 s even after player moves away).
   */
  yell(px, pz, radius = 26) {
    const r2 = radius * radius;
    for (const cow of this._cows) {
      if (cow.removed) continue;
      const cx = cow.mesh.position.x, cz = cow.mesh.position.z;
      const dx = cx - px, dz = cz - pz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= r2) continue;

      const dist = Math.sqrt(d2);
      // Direction away from player — random if cow is right on top of player
      const nx = dist > 0.2 ? dx / dist : (Math.random() - 0.5) * 2;
      const nz = dist > 0.2 ? dz / dist : (Math.random() - 0.5) * 2;

      // Kick velocity + save direction for stampede
      cow.vx          = nx * FLEE_SPEED * 1.6;
      cow.vz          = nz * FLEE_SPEED * 1.6;
      cow.wanderAngle = Math.atan2(nx, nz);
      cow.panicTimer  = 5.0 + Math.random() * 2;  // 5–7 s of stampede
    }
  }

  /** Contagion: cows in panic spread it to neighbors within 14 units. */
  _spreadPanic() {
    for (const cow of this._cows) {
      if (cow.removed || cow.panicTimer <= 0) continue;
      const cx = cow.mesh.position.x, cz = cow.mesh.position.z;
      for (const other of this._cows) {
        if (other.removed || other.panicTimer > 0 || other.id === cow.id) continue;
        const dx = other.mesh.position.x - cx;
        const dz = other.mesh.position.z - cz;
        if (dx * dx + dz * dz < 14 * 14) {
          other.panicTimer  = 2.5 + Math.random() * 2;
          other.wanderAngle = Math.atan2(dx, dz); // run away from panicking cow
          other.vx = Math.sin(other.wanderAngle) * FLEE_SPEED * 0.8;
          other.vz = Math.cos(other.wanderAngle) * FLEE_SPEED * 0.8;
        }
      }
    }
  }

  // playerPositions: array of {x, z}
  // Returns array of cow IDs that entered the stable this frame
  update(dt, playerPositions) {
    const newlyCorralled = [];

    for (const cow of this._cows) {
      if (cow.removed) continue;

      const cx = cow.mesh.position.x;
      const cz = cow.mesh.position.z;

      // ── Corral arrival check ──────────────────────────────────────────────
      const dsx = cx - STABLE_X, dsz = cz - STABLE_Z;
      if (dsx * dsx + dsz * dsz < CORRAL_RADIUS * CORRAL_RADIUS) {
        newlyCorralled.push(cow.id);
        continue;
      }

      // ── Flee if player nearby ─────────────────────────────────────────────
      let fleeing = false;
      let fleeX = 0, fleeZ = 0;
      for (const pp of playerPositions) {
        const pdx = cx - pp.x, pdz = cz - pp.z;
        const d2  = pdx * pdx + pdz * pdz;
        if (d2 < FLEE_RADIUS * FLEE_RADIUS && d2 > 0.001) {
          const inv = 1 / Math.sqrt(d2);
          fleeX += pdx * inv;
          fleeZ += pdz * inv;
          fleeing = true;
        }
      }

      let targetVX, targetVZ;
      if (fleeing) {
        // Active flee — normalize and apply speed
        const fl = Math.sqrt(fleeX * fleeX + fleeZ * fleeZ);
        if (fl > 0.001) { fleeX /= fl; fleeZ /= fl; }
        targetVX = fleeX * FLEE_SPEED;
        targetVZ = fleeZ * FLEE_SPEED;
        // Save flee direction so panic can continue it
        cow.wanderAngle = Math.atan2(fleeX, fleeZ);
        if (cow.panicTimer > 0) cow.panicTimer -= dt;
      } else if (cow.panicTimer > 0) {
        // Stampede: keep running in saved flee direction even without player nearby
        cow.panicTimer -= dt;
        // Sesgar levemente hacia el establo para facilitar el arreo
        const toDstX = STABLE_X - cx, toDstZ = STABLE_Z - cz;
        const toDstLen = Math.sqrt(toDstX * toDstX + toDstZ * toDstZ) || 1;
        const stableAngle = Math.atan2(toDstX / toDstLen, toDstZ / toDstLen);
        // Blend 30 % hacia el establo, 70 % en dirección de huida
        const blendAngle = cow.wanderAngle * 0.70 + stableAngle * 0.30;
        targetVX = Math.sin(blendAngle) * FLEE_SPEED * 0.75;
        targetVZ = Math.cos(blendAngle) * FLEE_SPEED * 0.75;
      } else {
        // Normal wander
        cow.wanderTimer -= dt;
        if (cow.wanderTimer <= 0) {
          cow.wanderAngle += (Math.random() - 0.5) * 2.8;
          cow.wanderSpeed  = Math.random() < 0.05
            ? 0
            : WALK_SPEED * (0.5 + Math.random() * 0.8);
          cow.wanderTimer  = 2.5 + Math.random() * 5.5;
        }
        targetVX = Math.cos(cow.wanderAngle) * cow.wanderSpeed;
        targetVZ = Math.sin(cow.wanderAngle) * cow.wanderSpeed;
      }

      // Smooth velocity
      const lerp = Math.min(1, 5 * dt);
      cow.vx += (targetVX - cow.vx) * lerp;
      cow.vz += (targetVZ - cow.vz) * lerp;

      // Move
      cow.mesh.position.x += cow.vx * dt;
      cow.mesh.position.z += cow.vz * dt;

      // Rotate toward movement
      const speed = Math.sqrt(cow.vx * cow.vx + cow.vz * cow.vz);
      if (speed > 0.12) {
        const targetRY = Math.atan2(cow.vx, cow.vz);
        let diff = targetRY - cow.mesh.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        cow.mesh.rotation.y += diff * Math.min(1, 7 * dt);

        // Body bob
        cow.walkTime += dt * speed * 2.2;
        cow.mesh.position.y = Math.abs(Math.sin(cow.walkTime * 3)) * 0.045;
      } else {
        cow.mesh.position.y *= 0.88;
      }
    }

    // Spread panic to nearby cows (flocking / contagion)
    this._spreadPanic();

    return newlyCorralled;
  }
}
