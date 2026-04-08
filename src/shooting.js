// --- Shooting system — 2D cone soft-aim ---
import * as THREE from 'three';

const COOLDOWN    = 0.3;
const BULLET_SPEED = 60;
const BULLET_RANGE = 80;
const CONE_ANGLE   = 20 * Math.PI / 180;  // 20° snap cone
const SNAP_STRENGTH = 0.38;               // 0=no snap, 1=full lock
const BASE_SPREAD   = 0.006;              // radians at reference distance
const SPREAD_REF    = 12;                 // metres — spread reference distance

let lastShot = 0;
const activeBullets = [];

export function tryShoot(playerPos, aimDirection, remotePlayers, now, gunY = 1.55, explicitOrigin = null) {
  if (now - lastShot < COOLDOWN) return null;
  lastShot = now;

  const origin = explicitOrigin || {
    x: playerPos.x + aimDirection.x * 0.8,
    y: gunY,
    z: playerPos.z + aimDirection.z * 0.8,
  };

  // ── 1. Flat XZ aim vector ───────────────────────────────────────────────────
  const aimXZ = new THREE.Vector2(aimDirection.x, aimDirection.z).normalize();

  // ── 2. Collect hitboxes + entity centres ────────────────────────────────────
  const hitTargets = [];
  const idMap      = new Map();
  const centres    = [];   // { x, z, dist } one per player model

  for (const [id, pm] of remotePlayers) {
    for (const mesh of pm.getHitboxes()) {
      hitTargets.push(mesh);
      idMap.set(mesh.uuid, id);
    }
    const tx = pm.group.position.x - playerPos.x;
    const tz = pm.group.position.z - playerPos.z;
    const d  = Math.sqrt(tx * tx + tz * tz);
    if (d > 0.5 && d < BULLET_RANGE) centres.push({ x: pm.group.position.x, z: pm.group.position.z, dist: d });
  }

  // ── 3. Find best target in 20° cone ─────────────────────────────────────────
  let snapTarget = null, bestAngle = CONE_ANGLE;
  for (const c of centres) {
    const toT   = new THREE.Vector2(c.x - playerPos.x, c.z - playerPos.z).normalize();
    const angle = Math.acos(Math.max(-1, Math.min(1, aimXZ.dot(toT))));
    if (angle < bestAngle) { bestAngle = angle; snapTarget = c; }
  }

  // ── 4. Soft snap ────────────────────────────────────────────────────────────
  let finalXZ = aimXZ.clone();
  if (snapTarget) {
    const toT = new THREE.Vector2(
      snapTarget.x - playerPos.x,
      snapTarget.z - playerPos.z
    ).normalize();
    finalXZ.lerp(toT, SNAP_STRENGTH).normalize();
  }

  // ── 5. Distance-based spread ─────────────────────────────────────────────────
  const refDist    = snapTarget ? snapTarget.dist : 20;
  const spread     = BASE_SPREAD * Math.sqrt(refDist / SPREAD_REF);
  const spreadAng  = (Math.random() - 0.5) * 2 * spread;
  const cs = Math.cos(spreadAng), sn = Math.sin(spreadAng);
  finalXZ.set(
    finalXZ.x * cs - finalXZ.y * sn,
    finalXZ.x * sn + finalXZ.y * cs
  ).normalize();

  // ── 6. Raycast flat (y = gunY) ───────────────────────────────────────────────
  const ray = new THREE.Raycaster(
    new THREE.Vector3(origin.x, origin.y, origin.z),
    new THREE.Vector3(finalXZ.x, 0, finalXZ.y).normalize(),
    0, BULLET_RANGE
  );

  const intersects = ray.intersectObjects(hitTargets, false);
  const hitId = intersects.length > 0 ? idMap.get(intersects[0].object.uuid) : null;

  return {
    origin:    { x: origin.x, y: origin.y, z: origin.z },
    direction: { x: finalXZ.x, y: 0, z: finalXZ.y },
    hitId,
  };
}

// ─── Visual bullet ────────────────────────────────────────────────────────────
export function spawnBullet(scene, origin, direction, color = 0xffff00) {
  const geo    = new THREE.SphereGeometry(0.12, 4, 4);
  const mat    = new THREE.MeshBasicMaterial({ color });
  const bullet = new THREE.Mesh(geo, mat);
  bullet.position.set(origin.x, origin.y, origin.z);
  scene.add(bullet);
  activeBullets.push({
    mesh: bullet,
    dir:  new THREE.Vector3(direction.x, 0, direction.z).normalize(),
    dist: 0,
  });
}

export function updateBullets(scene, dt) {
  for (let i = activeBullets.length - 1; i >= 0; i--) {
    const b    = activeBullets[i];
    const step = BULLET_SPEED * dt;
    b.mesh.position.x += b.dir.x * step;
    b.mesh.position.z += b.dir.z * step;
    b.dist += step;
    if (b.dist > BULLET_RANGE) {
      scene.remove(b.mesh);
      activeBullets.splice(i, 1);
    }
  }
}

export function muzzleFlash(scene, origin) {
  const geo   = new THREE.SphereGeometry(0.25, 6, 6);
  const mat   = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const flash = new THREE.Mesh(geo, mat);
  flash.position.set(origin.x, origin.y, origin.z);
  scene.add(flash);
  setTimeout(() => scene.remove(flash), 60);
}
