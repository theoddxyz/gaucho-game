// --- Avestruz + sistema de churrascos ---
import * as THREE from 'three';

const SPAWN_X = 3.8, SPAWN_Z = -69.0;
const WANDER_RADIUS = 28;
const WALK_SPEED    = 1.6;
const PICKUP_RADIUS = 2.8;
const LEG_FREQ      = 7.0;
const LEG_AMP       = 0.45;

// ─── Materiales ───────────────────────────────────────────────────────────────
const M_FEATHER  = new THREE.MeshStandardMaterial({ color: 0x151008, roughness: 0.98 });
const M_SKIN     = new THREE.MeshStandardMaterial({ color: 0xd08040, roughness: 0.90 });
const M_BEAK     = new THREE.MeshStandardMaterial({ color: 0xe8a020, roughness: 0.85 });
const M_EYE      = new THREE.MeshStandardMaterial({ color: 0xff7700, roughness: 0.5 });
const M_MEAT     = new THREE.MeshStandardMaterial({ color: 0x8b2a0a, roughness: 0.88 });
const M_FAT      = new THREE.MeshStandardMaterial({ color: 0xd4a878, roughness: 0.90 });

// ─── Voxel helper ─────────────────────────────────────────────────────────────
function box(w, h, d, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  return m;
}

// ─── Mesh ─────────────────────────────────────────────────────────────────────
function buildOstrich() {
  const root = new THREE.Group();

  // Cuerpo
  root.add(box(0.58, 0.52, 0.72, M_FEATHER, 0, 1.38, 0));

  // Cola (inclinada hacia atrás)
  root.add(box(0.42, 0.46, 0.16, M_FEATHER, 0, 1.52, -0.44, -0.55));

  // Alas rudimentarias
  root.add(box(0.14, 0.26, 0.38, M_FEATHER, -0.37, 1.48,  0.05, 0, 0,  0.30));
  root.add(box(0.14, 0.26, 0.38, M_FEATHER,  0.37, 1.48,  0.05, 0, 0, -0.30));

  // Cuello
  const neck = box(0.14, 0.62, 0.14, M_SKIN, 0, 1.96, 0.14, 0.28);
  root.add(neck);

  // Cabeza
  root.add(box(0.22, 0.20, 0.24, M_FEATHER, 0, 2.38, 0.28));

  // Pico
  root.add(box(0.08, 0.07, 0.20, M_BEAK, 0, 2.34, 0.44));

  // Ojos
  root.add(box(0.05, 0.05, 0.03, M_EYE, -0.11, 2.41, 0.34));
  root.add(box(0.05, 0.05, 0.03, M_EYE,  0.11, 2.41, 0.34));

  // ── Piernas con pivote en cadera ─────────────────────────────────────────
  const legs = [];
  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx * 0.16, 1.12, 0.04);
    root.add(pivot);

    // Muslo
    const thigh = box(0.11, 0.52, 0.11, M_SKIN, 0, -0.26, 0);
    pivot.add(thigh);

    // Pivote de rodilla
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.52, 0);
    pivot.add(kneePivot);

    // Tibia
    const shin = box(0.09, 0.50, 0.09, M_SKIN, 0, -0.25, 0.04);
    kneePivot.add(shin);

    // Pata (pie)
    const foot = box(0.20, 0.06, 0.18, M_SKIN, 0, -0.53, 0.10);
    kneePivot.add(foot);

    legs.push({ pivot, kneePivot, phase: sx > 0 ? Math.PI : 0 });
  }

  // Hitbox invisible
  const hitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 2.20, 0.80),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitbox.position.set(0, 1.10, 0);
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

// ─── OstrichSystem ────────────────────────────────────────────────────────────
export class OstrichSystem {
  constructor(scene) {
    this._scene = scene;
    this._dead  = false;
    this._dying = false;
    this._dyingT = 0;
    this._walkT  = 0;
    this._wanderTimer = 0;
    this._vx = 0; this._vz = 0;  // wander velocity
    this._churrascos = [];

    this._mesh = buildOstrich();
    this._mesh.position.set(SPAWN_X + 9, 0, SPAWN_Z - 5);
    this._mesh.rotation.y = -0.8;
    scene.add(this._mesh);
  }

  getHitboxes() {
    return this._dead ? [] : [this._mesh._hitbox];
  }

  isHit(uuid) {
    return !this._dead && this._mesh._hitbox?.uuid === uuid;
  }

  kill() {
    if (this._dead || this._dying) return;
    this._dying = true;
    this._dyingT = 0;
    // Detach hitbox so can't shoot again
    this._mesh._hitbox.visible = false;
  }

  update(dt, playerPos) {
    if (this._dead) {
      return this._tickChurrascos(dt, playerPos);
    }

    if (this._dying) {
      this._dyingT += dt;
      // Fall animation: rotate over Z, sink into ground
      this._mesh.rotation.z = Math.min(Math.PI / 2, this._dyingT * 4.0);
      this._mesh.position.y = Math.max(-0.3, -this._dyingT * 0.6);
      if (this._dyingT >= 1.4) {
        this._scene.remove(this._mesh);
        this._dead = true;
        this._spawnChurrascos();
      }
      return null;
    }

    // ── Wander ───────────────────────────────────────────────────────────
    this._wanderTimer -= dt;
    if (this._wanderTimer <= 0) {
      if (Math.random() < 0.28) {
        // Stop and peck
        this._vx = 0; this._vz = 0;
        this._wanderTimer = 1.2 + Math.random() * 1.8;
      } else {
        // New direction biased toward spawn center
        const bx = SPAWN_X - this._mesh.position.x;
        const bz = SPAWN_Z - this._mesh.position.z;
        const angle = Math.atan2(bz, bx) + (Math.random() - 0.5) * Math.PI * 1.4;
        this._vx = Math.cos(angle) * WALK_SPEED;
        this._vz = Math.sin(angle) * WALK_SPEED;
        this._wanderTimer = 2.5 + Math.random() * 3.0;
      }
    }

    const moving = this._vx * this._vx + this._vz * this._vz > 0.01;
    if (moving) {
      const nx = this._mesh.position.x + this._vx * dt;
      const nz = this._mesh.position.z + this._vz * dt;
      const dx = nx - SPAWN_X, dz = nz - SPAWN_Z;
      if (dx * dx + dz * dz < WANDER_RADIUS * WANDER_RADIUS) {
        this._mesh.position.x = nx;
        this._mesh.position.z = nz;
      } else {
        this._vx = -this._vx; this._vz = -this._vz;
      }
      this._mesh.rotation.y = Math.atan2(this._vx, this._vz);
      this._walkT += dt;
    }

    this._animateWalk(moving);

    return this._tickChurrascos(dt, playerPos);
  }

  _animateWalk(moving) {
    if (!moving) {
      // Slowly return to rest
      for (const leg of this._mesh._legs) {
        leg.pivot.rotation.x     *= 0.80;
        leg.kneePivot.rotation.x  = leg.pivot.rotation.x > 0
          ? -leg.pivot.rotation.x * 0.55
          : 0;
      }
      this._mesh.position.y *= 0.80;
      if (this._mesh._neck) this._mesh._neck.rotation.x = 0.28;
      return;
    }

    const t = this._walkT;

    // Body bob
    this._mesh.position.y = Math.abs(Math.sin(LEG_FREQ * t)) * 0.055;

    // Neck nod
    if (this._mesh._neck)
      this._mesh._neck.rotation.x = 0.28 + Math.sin(LEG_FREQ * t) * 0.18;

    // Leg swing + knee flex
    for (const leg of this._mesh._legs) {
      const s = Math.sin(LEG_FREQ * t + leg.phase);
      leg.pivot.rotation.x = s * LEG_AMP;
      // Knee bends when leg swings forward (s > 0)
      leg.kneePivot.rotation.x = -Math.max(0, s) * LEG_AMP * 0.65;
    }
  }

  _spawnChurrascos() {
    const px = this._mesh?.position.x ?? SPAWN_X + 9;
    const pz = this._mesh?.position.z ?? SPAWN_Z - 5;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      const r     = 0.4 + Math.random() * 1.0;
      const c = buildChurrasco();
      c.position.set(px + Math.cos(angle) * r, 0.12, pz + Math.sin(angle) * r);
      c.rotation.y = Math.random() * Math.PI * 2;
      this._scene.add(c);
      this._churrascos.push({ mesh: c, t: 0, bobPhase: Math.random() * Math.PI * 2 });
    }
  }

  _tickChurrascos(dt, playerPos) {
    let pickup = null;
    for (let i = this._churrascos.length - 1; i >= 0; i--) {
      const c = this._churrascos[i];
      c.t += dt;
      // Float + spin
      c.mesh.position.y = 0.12 + Math.sin(c.t * 2.2 + c.bobPhase) * 0.06;
      c.mesh.rotation.y += dt * 1.1;

      // Pickup
      if (playerPos && !pickup) {
        const dx = c.mesh.position.x - playerPos.x;
        const dz = c.mesh.position.z - playerPos.z;
        if (dx * dx + dz * dz < PICKUP_RADIUS * PICKUP_RADIUS) {
          this._scene.remove(c.mesh);
          this._churrascos.splice(i, 1);
          pickup = { hp: 25, hunger: 55 };
          continue;
        }
      }
      // Despawn after 4 minutes
      if (c.t > 240) {
        this._scene.remove(c.mesh);
        this._churrascos.splice(i, 1);
      }
    }
    return pickup;
  }
}
