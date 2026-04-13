// --- Avestruz + sistema de churrascos (multi-instancia) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── GLB swap — si existe /models/ostrich.glb lo usa en lugar del procedural ──
let _ostrichTpl     = null;
let _ostrichPending = [];
new GLTFLoader().load('/models/ostrich.glb',
  g => { _ostrichTpl = g.scene; _ostrichPending.forEach(_applyOstrichGLB); _ostrichPending = []; },
  undefined,
  () => { _ostrichPending = []; }
);

function _applyOstrichGLB(root) {
  root.children.slice().forEach(c => { if (c !== root._hitbox) root.remove(c); });
  const vis = _ostrichTpl.clone(true);
  vis.scale.setScalar(1.0);
  vis.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
  root.add(vis);
  root._legs      = [];
  root._legPivots = [];
  root._neck      = vis.getObjectByName('neck') || null;
  root._headGroup = vis.getObjectByName('head') || null;
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
    away.x * 5 + (Math.random()-0.5)*4,
    Math.abs(away.y)*2 + 5 + Math.random()*4,
    away.z * 5 + (Math.random()-0.5)*4
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
const DEATH_PHYSICS_LIFE = 90;

function _startDeathPhysics(entity, hitPoint) {
  entity.wounded      = false;
  entity.dying        = false;
  entity.dyingPhysics = true;
  let dx = 0, dz = 0;
  if (hitPoint && entity.mesh) {
    dx = entity.mesh.position.x - hitPoint.x;
    dz = entity.mesh.position.z - hitPoint.z;
    const d = Math.sqrt(dx * dx + dz * dz) || 1;
    dx /= d; dz /= d;
  } else {
    const a = Math.random() * Math.PI * 2;
    dx = Math.cos(a); dz = Math.sin(a);
  }
  const speed = 5.0 + Math.random() * 3.5;
  entity._phy = {
    vx: dx * speed,
    vy: 3.5 + Math.random() * 2.5,
    vz: dz * speed,
    angX: (Math.random() - 0.5) * 12,
    angY: (Math.random() - 0.5) * 5,
    angZ: (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 7),
    t: 0,
    settled: false,
  };
}

function _tickDeathPhysics(mesh, phy, dt) {
  phy.t += dt;
  if (phy.settled) return;
  phy.vy -= 9.8 * dt;
  mesh.position.x += phy.vx * dt;
  mesh.position.y += phy.vy * dt;
  mesh.position.z += phy.vz * dt;
  mesh.rotation.x += phy.angX * dt;
  mesh.rotation.y += phy.angY * dt;
  mesh.rotation.z += phy.angZ * dt;
  if (mesh.position.y <= 0) {
    mesh.position.y = 0;
    const bounce = Math.abs(phy.vy) * 0.28;
    phy.vy = bounce > 0.35 ? bounce : 0;
    phy.vx *= 0.65; phy.vz *= 0.65;
    phy.angX *= 0.45; phy.angY *= 0.45; phy.angZ *= 0.45;
    if (phy.vy === 0) phy.settled = true;
  }
  phy.vx *= Math.max(0, 1 - 1.2 * dt);
  phy.vz *= Math.max(0, 1 - 1.2 * dt);
}

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

  const headGroup = new THREE.Group();

  const neck = box(0.14, 0.62, 0.14, M_SKIN, 0, 1.96, 0.14, 0.28);
  headGroup.add(neck);

  headGroup.add(box(0.22, 0.20, 0.24, M_FEATHER, 0, 2.38, 0.28));
  headGroup.add(box(0.08, 0.07, 0.20, M_BEAK,    0, 2.34, 0.44));
  headGroup.add(box(0.05, 0.05, 0.03, M_EYE, -0.11, 2.41, 0.34));
  headGroup.add(box(0.05, 0.05, 0.03, M_EYE,  0.11, 2.41, 0.34));

  root.add(headGroup);

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

  root._hitbox     = hitbox;
  root._legs       = legs;
  root._neck       = neck;
  root._headGroup  = headGroup;
  root._legPivots  = [legs[0].pivot, legs[1].pivot];

  if (_ostrichTpl)       _applyOstrichGLB(root);
  else if (_ostrichPending) _ostrichPending.push(root);

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
    dead:          false,
    dying:         false,
    dyingT:        0,
    walkT:         Math.random() * 10,
    wanderTimer:   Math.random() * 3,
    vx:            0,
    vz:            0,
    respawnTimer:  0,
    churrascos:    [],
    hp:            2,
    wounded:       false,
    woundedT:      0,
    woundedMaxT:   6 + Math.random() * 3,
    dyingPhysics:  false,
    _phy:          null,
    detachedParts: [],
  };
}

// ─── OstrichSystem ────────────────────────────────────────────────────────────
export class OstrichSystem {
  constructor(scene) {
    this._scene    = scene;
    this._entities = SPAWN_SPOTS.map(s => makeEntity(scene, s.x, s.z));
    this._bloodSpots = [];
  }

  /** Retorna todos los hitboxes de avestruces vivas (con matrixWorld actualizado). */
  getHitboxes() {
    const result = [];
    for (const e of this._entities) {
      if (e.dead || e.dying || !e.mesh) continue;
      // Propagar matrixWorld desde la raíz hasta el hitbox (hijo del grupo)
      e.mesh._hitbox.updateWorldMatrix(true, false);
      result.push(e.mesh._hitbox);
    }
    return result;
  }

  /** Dado un hitbox mesh, devuelve su índice en _entities (-1 si no se encuentra). */
  getIndexByHitbox(hitboxMesh) {
    return this._entities.findIndex(e => e.mesh && e.mesh._hitbox === hitboxMesh);
  }

  _spawnBloodSpot(x, z) {
    if (this._bloodSpots.length > 80) {
      const old = this._bloodSpots.shift();
      this._scene.remove(old);
      old.geometry?.dispose();
    }
    const geo  = new THREE.CircleGeometry(0.20 + Math.random() * 0.25, 6);
    const mat  = new THREE.MeshBasicMaterial({
      color: 0x550000, transparent: true, opacity: 0.70 + Math.random() * 0.25,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x + (Math.random()-0.5)*0.4, 0.012, z + (Math.random()-0.5)*0.4);
    this._scene.add(mesh);
    this._bloodSpots.push(mesh);
  }

  /** Matar avestruz por índice. */
  kill(idx) {
    if (idx < 0 || idx >= this._entities.length) return;
    const e = this._entities[idx];
    if (e.dead || e.dying) return;
    e.dying  = true;
    e.dyingT = 0;
  }

  /** Devuelve el avestruz herido/agonizante más cercano dentro de radius, o null. */
  getNearbyWounded(x, z, radius) {
    const r2 = radius * radius;
    let nearest = null, nearestD2 = r2;
    for (const e of this._entities) {
      if ((!e.wounded && !e.dyingPhysics) || e.dead || !e.mesh) continue;
      const dx = e.mesh.position.x - x, dz = e.mesh.position.z - z;
      const d2 = dx * dx + dz * dz;
      if (d2 < nearestD2) { nearestD2 = d2; nearest = e; }
    }
    return nearest;
  }

  /** Deshuesar avestruz herido: spawna churrascos y lo elimina. Pickup por proximidad. */
  lootWounded(e) {
    if (!e || e.dead) return null;
    if (!e.wounded && !e.dyingPhysics) return null;
    // Spawnar churrascos antes de eliminar el mesh
    this._spawnChurrascos(e);
    e.dyingPhysics = false;
    e.wounded      = false;
    e.dead         = true;
    e.respawnTimer = RESPAWN_DELAY;
    if (e.mesh) {
      this._scene.remove(e.mesh);
      e.mesh.traverse(o => { if (o.isMesh) { o.geometry?.dispose(); } });
      e.mesh = null;
    }
    return null;  // pickup real lo hace _tickChurrascos / update()
  }

  /** Hit ostrich: 2 hits to kill. First hit → limb flies. Second → wounded → die. */
  hit(idx, hitPoint, hitZone) {
    if (idx < 0 || idx >= this._entities.length) return;
    const e = this._entities[idx];
    if (e.dead || e.dying || e.wounded) return;
    e.hp = Math.max(0, e.hp - 1);

    // Spawn flying part
    const mx = e.mesh.position.x, mz = e.mesh.position.z;
    const ry = e.mesh.rotation.y;
    if ((hitZone === 'head') && e.mesh._headGroup && !e._headDetached) {
      e._headDetached = true;
      e.mesh._headGroup.visible = false;
      // Head world pos: neck/head is roughly at (0, 2.3, 0.28) local → apply rotation
      const hx = mx + Math.sin(ry) * 0.28;
      const hz = mz + Math.cos(ry) * 0.28;
      spawnFlyingPart(
        this._scene,
        new THREE.Vector3(hx, 2.3, hz),
        new THREE.BoxGeometry(0.22, 0.20, 0.24),
        0x151008,
        e.detachedParts, hitPoint
      );
    } else if (hitZone === 'leg' && e.mesh._legs?.length > 0) {
      const legEntry = e.mesh._legs.shift();
      if (legEntry?.pivot) {
        legEntry.pivot.visible = false;
        const legWorldPos = new THREE.Vector3();
        legEntry.pivot.getWorldPosition(legWorldPos);
        if (legWorldPos.y < 0.01) legWorldPos.y = 0.6;
        spawnFlyingPart(
          this._scene,
          legWorldPos,
          new THREE.BoxGeometry(0.11, 0.52, 0.11),
          0xd08040,
          e.detachedParts, hitPoint
        );
      }
    }

    // Primer tiro → ragdoll inmediato con impulso direccional
    if (e.mesh._hitbox) e.mesh._hitbox.visible = false;
    _startDeathPhysics(e, hitPoint);
  }

  update(dt, playerPos) {
    let pickup = null;

    // Tick flying parts for all entities
    for (const e of this._entities) {
      if (e.detachedParts && e.detachedParts.length > 0) {
        tickFlyingParts(this._scene, e.detachedParts, dt);
      }
    }

    for (let i = 0; i < this._entities.length; i++) {
      const e = this._entities[i];

      // ── Respawn counter ───────────────────────────────────────────────────
      if (e.dead) {
        const p = this._tickChurrascos(e, dt, playerPos, pickup);
        if (p && !pickup) pickup = p;
        e.respawnTimer -= dt;
        if (e.respawnTimer <= 0) {
          this._respawn(i);
        }
        continue;
      }

      // ── Wounded state ──────────────────────────────────────────────────────────
      if (e.wounded) {
        e.woundedT += dt;
        e.mesh.rotation.z = Math.min(0.18, e.woundedT * 0.08);
        e.mesh.position.y = 0;
        // Slow crawl drag
        const crawlSpeed = Math.max(0, 0.55 - e.woundedT * 0.09);
        const crawlDir   = e.mesh.rotation.y;
        e.mesh.position.x += Math.sin(crawlDir) * crawlSpeed * dt;
        e.mesh.position.z += Math.cos(crawlDir) * crawlSpeed * dt;
        // Blood trail
        e._bloodTimer = (e._bloodTimer ?? 0) + dt;
        if (e._bloodTimer >= 0.35) {
          e._bloodTimer = 0;
          this._spawnBloodSpot(e.mesh.position.x, e.mesh.position.z);
        }
        if (e.woundedT >= e.woundedMaxT) {
          _startDeathPhysics(e);
        }
        continue;
      }

      // ── Physics death (tumble + bounce) ──────────────────────────────────
      if (e.dyingPhysics) {
        _tickDeathPhysics(e.mesh, e._phy, dt);
        if (e._phy.t >= DEATH_PHYSICS_LIFE) {
          e.dyingPhysics = false;
          e.dead = true;
          e.respawnTimer = RESPAWN_DELAY;
          if (e.mesh) { this._scene.remove(e.mesh); e.mesh = null; }
        }
        continue;
      }

      // ── Dying animation (legacy fallback — shouldn't normally trigger) ────
      if (e.dying) {
        e.dyingT = (e.dyingT ?? 0) + dt;
        if (e.dyingT >= 0.1) _startDeathPhysics(e);
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

    e.mesh          = mesh;
    e.dead          = false;
    e.dying         = false;
    e.dyingT        = 0;
    e.walkT         = 0;
    e.wanderTimer   = 1 + Math.random() * 2;
    e.vx            = 0;
    e.vz            = 0;
    e.respawnTimer  = 0;
    e.hp            = 2;
    e.wounded       = false;
    e.woundedT      = 0;
    e.detachedParts = [];
    e._headDetached = false;
  }
}
