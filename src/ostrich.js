// --- Avestruz + sistema de churrascos (multi-instancia) ---
import * as THREE from 'three';

const WANDER_RADIUS  = 28;
const WALK_SPEED     = 1.6;
const PICKUP_RADIUS  = 2.8;
const LEG_FREQ       = 7.0;
const LEG_AMP        = 0.45;
const RESPAWN_DELAY  = 120;   // segundos hasta que reaparece

// 7 posiciones de spawn repartidas por el mapa
const SPAWN_SPOTS = [
  { x:  13, z: -74 },
  { x: -28, z: -82 },
  { x:  48, z: -52 },
  { x: -18, z:-108 },
  { x:  62, z: -88 },
  { x:   8, z:-138 },
  { x: -52, z: -62 },
];

// ─── Materiales compartidos ───────────────────────────────────────────────────
const M_FEATHER = new THREE.MeshStandardMaterial({ color: 0x151008, roughness: 0.98 });
const M_SKIN    = new THREE.MeshStandardMaterial({ color: 0xd08040, roughness: 0.90 });
const M_BEAK    = new THREE.MeshStandardMaterial({ color: 0xe8a020, roughness: 0.85 });
const M_EYE     = new THREE.MeshStandardMaterial({ color: 0xff7700, roughness: 0.5  });
const M_MEAT    = new THREE.MeshStandardMaterial({ color: 0x8b2a0a, roughness: 0.88 });
const M_FAT     = new THREE.MeshStandardMaterial({ color: 0xd4a878, roughness: 0.90 });
// Hitbox material: transparente pero visible = true para que el raycast funcione
const M_HIT = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

// ─── Voxel helper ─────────────────────────────────────────────────────────────
function box(w, h, d, mat, x, y, z, rx = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.x = rx;
  m.castShadow = true;
  return m;
}

// ─── Mesh de avestruz ─────────────────────────────────────────────────────────
function buildOstrich() {
  const root = new THREE.Group();

  root.add(box(0.58, 0.52, 0.72, M_FEATHER, 0, 1.38,  0));
  root.add(box(0.42, 0.46, 0.16, M_FEATHER, 0, 1.52, -0.44, -0.55));
  root.add(box(0.14, 0.26, 0.38, M_FEATHER, -0.37, 1.48,  0.05));
  root.add(box(0.14, 0.26, 0.38, M_FEATHER,  0.37, 1.48,  0.05));

  const neck = box(0.14, 0.62, 0.14, M_SKIN, 0, 1.96, 0.14, 0.28);
  root.add(neck);

  root.add(box(0.22, 0.20, 0.24, M_FEATHER, 0, 2.38, 0.28));
  root.add(box(0.08, 0.07, 0.20, M_BEAK,    0, 2.34, 0.44));
  root.add(box(0.05, 0.05, 0.03, M_EYE, -0.11, 2.41, 0.34));
  root.add(box(0.05, 0.05, 0.03, M_EYE,  0.11, 2.41, 0.34));

  const legs = [];
  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx * 0.16, 1.12, 0.04);
    root.add(pivot);

    pivot.add(box(0.11, 0.52, 0.11, M_SKIN, 0, -0.26, 0));

    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.52, 0);
    pivot.add(kneePivot);

    kneePivot.add(box(0.09, 0.50, 0.09, M_SKIN, 0, -0.25,  0.04));
    kneePivot.add(box(0.20, 0.06, 0.18, M_SKIN, 0, -0.53,  0.10));

    legs.push({ pivot, kneePivot, phase: sx > 0 ? Math.PI : 0 });
  }

  // Hitbox más grande y con material transparente (visible:true para raycast)
  const hitbox = new THREE.Mesh(new THREE.BoxGeometry(0.80, 2.40, 0.90), M_HIT);
  hitbox.position.set(0, 1.20, 0);
  root.add(hitbox);

  root._hitbox = hitbox;
  root._legs   = legs;
  root._neck   = neck;
  return root;
}

function buildChurrasco() {
  const g = new THREE.Group();
  g.add(box(0.38, 0.09, 0.24, M_MEAT, 0, 0, 0));
  g.add(box(0.34, 0.06, 0.07, M_FAT,  0, 0.05, -0.07));
  return g;
}

// ─── Entidad individual ───────────────────────────────────────────────────────
function makeEntity(scene, spawnX, spawnZ) {
  const mesh = buildOstrich();
  mesh.position.set(spawnX + (Math.random() - 0.5) * 4, 0, spawnZ + (Math.random() - 0.5) * 4);
  mesh.rotation.y = Math.random() * Math.PI * 2;
  scene.add(mesh);

  return {
    mesh,
    spawnX,
    spawnZ,
    dead:         false,
    dying:        false,
    dyingT:       0,
    walkT:        Math.random() * 10,
    wanderTimer:  Math.random() * 3,
    vx:           0,
    vz:           0,
    respawnTimer: 0,
    churrascos:   [],
  };
}

// ─── OstrichSystem ────────────────────────────────────────────────────────────
export class OstrichSystem {
  constructor(scene) {
    this._scene    = scene;
    this._entities = SPAWN_SPOTS.map(s => makeEntity(scene, s.x, s.z));
  }

  /** Retorna todos los hitboxes de avestruces vivas (con matrixWorld actualizado). */
  getHitboxes() {
    const result = [];
    for (const e of this._entities) {
      if (e.dead || e.dying) continue;
      e.mesh.updateWorldMatrix(true, true);
      result.push(e.mesh._hitbox);
    }
    return result;
  }

  /** Dado un hitbox mesh, devuelve su índice en _entities (-1 si no se encuentra). */
  getIndexByHitbox(hitboxMesh) {
    return this._entities.findIndex(e => e.mesh._hitbox === hitboxMesh);
  }

  /** Matar avestruz por índice. */
  kill(idx) {
    if (idx < 0 || idx >= this._entities.length) return;
    const e = this._entities[idx];
    if (e.dead || e.dying) return;
    e.dying  = true;
    e.dyingT = 0;
  }

  update(dt, playerPos) {
    let pickup = null;

    for (let i = 0; i < this._entities.length; i++) {
      const e = this._entities[i];

      // ── Respawn counter ───────────────────────────────────────────────────
      if (e.dead) {
        e.churrascos = this._tickChurrascos(e, dt, playerPos, pickup);
        if (!pickup) {
          // check if any churrasco was picked up this frame
          // (already handled inside _tickChurrascos via return value)
        }
        e.respawnTimer -= dt;
        if (e.respawnTimer <= 0) {
          this._respawn(i);
        }
        continue;
      }

      // ── Dying animation ───────────────────────────────────────────────────
      if (e.dying) {
        e.dyingT += dt;
        e.mesh.rotation.z = Math.min(Math.PI / 2, e.dyingT * 4.0);
        e.mesh.position.y = Math.max(-0.3, -e.dyingT * 0.6);
        if (e.dyingT >= 1.4) {
          this._scene.remove(e.mesh);
          e.mesh = null;
          e.dead  = true;
          e.dying = false;
          e.respawnTimer = RESPAWN_DELAY;
          this._spawnChurrascos(e);
        }
        continue;
      }

      // ── Wander ────────────────────────────────────────────────────────────
      e.wanderTimer -= dt;
      if (e.wanderTimer <= 0) {
        if (Math.random() < 0.22) {
          e.vx = 0; e.vz = 0;
          e.wanderTimer = 1.0 + Math.random() * 1.5;
        } else {
          const bx   = e.spawnX - e.mesh.position.x;
          const bz   = e.spawnZ - e.mesh.position.z;
          const angle = Math.atan2(bz, bx) + (Math.random() - 0.5) * Math.PI * 1.4;
          e.vx = Math.cos(angle) * WALK_SPEED;
          e.vz = Math.sin(angle) * WALK_SPEED;
          e.wanderTimer = 2.5 + Math.random() * 3.0;
        }
      }

      const moving = e.vx * e.vx + e.vz * e.vz > 0.01;
      if (moving) {
        const nx = e.mesh.position.x + e.vx * dt;
        const nz = e.mesh.position.z + e.vz * dt;
        const dx = nx - e.spawnX, dz = nz - e.spawnZ;
        if (dx * dx + dz * dz < WANDER_RADIUS * WANDER_RADIUS) {
          e.mesh.position.x = nx;
          e.mesh.position.z = nz;
        } else {
          e.vx = -e.vx; e.vz = -e.vz;
        }
        e.mesh.rotation.y = Math.atan2(e.vx, e.vz);
        e.walkT += dt;
      }

      this._animateWalk(e, moving);

      // ── Churrascos ────────────────────────────────────────────────────────
      const p = this._tickChurrascos(e, dt, playerPos, pickup);
      if (p && !pickup) pickup = p;
    }

    return pickup;
  }

  _animateWalk(e, moving) {
    const mesh = e.mesh;
    if (!moving) {
      for (const leg of mesh._legs) {
        leg.pivot.rotation.x    *= 0.80;
        leg.kneePivot.rotation.x = leg.pivot.rotation.x > 0
          ? -leg.pivot.rotation.x * 0.55 : 0;
      }
      mesh.position.y *= 0.80;
      if (mesh._neck) mesh._neck.rotation.x = 0.28;
      return;
    }
    const t = e.walkT;
    mesh.position.y = Math.abs(Math.sin(LEG_FREQ * t)) * 0.055;
    if (mesh._neck) mesh._neck.rotation.x = 0.28 + Math.sin(LEG_FREQ * t) * 0.18;
    for (const leg of mesh._legs) {
      const s = Math.sin(LEG_FREQ * t + leg.phase);
      leg.pivot.rotation.x     = s * LEG_AMP;
      leg.kneePivot.rotation.x = -Math.max(0, s) * LEG_AMP * 0.65;
    }
  }

  _spawnChurrascos(e) {
    const px = e.lastX ?? e.spawnX;
    const pz = e.lastZ ?? e.spawnZ;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      const r     = 0.4 + Math.random() * 1.0;
      const c     = buildChurrasco();
      c.position.set(px + Math.cos(angle) * r, 0.12, pz + Math.sin(angle) * r);
      c.rotation.y = Math.random() * Math.PI * 2;
      this._scene.add(c);
      e.churrascos.push({ mesh: c, t: 0, bobPhase: Math.random() * Math.PI * 2 });
    }
  }

  _tickChurrascos(e, dt, playerPos, existingPickup) {
    let pickup = null;
    for (let i = e.churrascos.length - 1; i >= 0; i--) {
      const c = e.churrascos[i];
      c.t += dt;
      c.mesh.position.y  = 0.12 + Math.sin(c.t * 2.2 + c.bobPhase) * 0.06;
      c.mesh.rotation.y += dt * 1.1;

      if (playerPos && !pickup && !existingPickup) {
        const dx = c.mesh.position.x - playerPos.x;
        const dz = c.mesh.position.z - playerPos.z;
        if (dx * dx + dz * dz < PICKUP_RADIUS * PICKUP_RADIUS) {
          this._scene.remove(c.mesh);
          e.churrascos.splice(i, 1);
          pickup = { hp: 25, hunger: 55 };
          continue;
        }
      }
      if (c.t > 240) {
        this._scene.remove(c.mesh);
        e.churrascos.splice(i, 1);
      }
    }
    return pickup;
  }

  _respawn(idx) {
    const e = this._entities[idx];
    const jitter = (Math.random() - 0.5) * 8;
    const mesh   = buildOstrich();
    mesh.position.set(e.spawnX + jitter, 0, e.spawnZ + jitter);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    this._scene.add(mesh);

    e.mesh         = mesh;
    e.dead         = false;
    e.dying        = false;
    e.dyingT       = 0;
    e.walkT        = 0;
    e.wanderTimer  = 1 + Math.random() * 2;
    e.vx           = 0;
    e.vz           = 0;
    e.respawnTimer = 0;
  }
}
