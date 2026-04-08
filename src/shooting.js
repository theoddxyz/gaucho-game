// --- Shooting system for isometric view ---
import * as THREE from 'three';

const COOLDOWN = 0.3; // seconds between shots
const BULLET_SPEED = 60;
const BULLET_RANGE = 80;

let lastShot = 0;
const activeBullets = [];

export function tryShoot(playerPos, aimDirection, remotePlayers, now, gunY = 1.55, explicitOrigin = null, cameraRay = null) {
  if (now - lastShot < COOLDOWN) return null;
  lastShot = now;

  // Use firepoint node position if available, otherwise calculate
  const origin = explicitOrigin || {
    x: playerPos.x + aimDirection.x * 0.8,
    y: gunY,
    z: playerPos.z + aimDirection.z * 0.8,
  };

  // Use camera ray if provided (exact crosshair hit detection), else fall back to aim direction
  let ray;
  if (cameraRay) {
    ray = cameraRay;
  } else {
    ray = new THREE.Raycaster(
      new THREE.Vector3(origin.x, origin.y, origin.z),
      aimDirection.clone().normalize(), 0, BULLET_RANGE
    );
  }
  const hitTargets = [];
  const idMap = new Map();
  for (const [id, pm] of remotePlayers) {
    for (const mesh of pm.getHitboxes()) {
      hitTargets.push(mesh);
      idMap.set(mesh.uuid, id);
    }
  }
  const intersects = ray.intersectObjects(hitTargets, false);
  const hitId = intersects.length > 0 ? idMap.get(intersects[0].object.uuid) : null;

  return {
    origin: { x: origin.x, y: origin.y, z: origin.z },
    direction: { x: aimDirection.x, y: 0, z: aimDirection.z },
    hitId,
  };
}

// Visible bullet projectile
export function spawnBullet(scene, origin, direction, color = 0xffff00) {
  const geo = new THREE.SphereGeometry(0.12, 4, 4);
  const mat = new THREE.MeshBasicMaterial({ color });
  const bullet = new THREE.Mesh(geo, mat);
  bullet.position.set(origin.x, origin.y, origin.z);
  scene.add(bullet);

  activeBullets.push({
    mesh: bullet,
    dir: new THREE.Vector3(direction.x, 0, direction.z).normalize(),
    dist: 0,
  });
}

export function updateBullets(scene, dt) {
  for (let i = activeBullets.length - 1; i >= 0; i--) {
    const b = activeBullets[i];
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

// Muzzle flash
export function muzzleFlash(scene, origin) {
  const geo = new THREE.SphereGeometry(0.25, 6, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const flash = new THREE.Mesh(geo, mat);
  flash.position.set(origin.x, origin.y, origin.z);
  scene.add(flash);
  setTimeout(() => scene.remove(flash), 60);
}
