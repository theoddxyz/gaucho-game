// --- Shooting system — camera-ray hitscan + visual bullet ---
import * as THREE from 'three';

export const BULLET_SPEED = 65;   // units/sec (visual travel)
export const BULLET_RANGE = 90;   // max range units
const COOLDOWN     = 0.28;
const CONE_ANGLE   = 20 * Math.PI / 180;
const SNAP_STRENGTH = 0.38;
const BASE_SPREAD   = 0.005;
const SPREAD_REF    = 12;

let lastShot = 0;
const activeBullets = [];

/**
 * Compute shot origin + XZ direction with cone soft-snap.
 * Does NOT do hit detection — that's handled by hitscan().
 * Returns { origin, direction } or null if on cooldown.
 */
export function tryShoot(playerPos, aimDirection, remotePlayers, now, gunY = 1.55, explicitOrigin = null) {
  if (now - lastShot < COOLDOWN) return null;
  lastShot = now;

  const origin = explicitOrigin || {
    x: playerPos.x + aimDirection.x * 0.8,
    y: gunY,
    z: playerPos.z + aimDirection.z * 0.8,
  };

  const aimXZ = new THREE.Vector2(aimDirection.x, aimDirection.z).normalize();

  // Collect player centres for cone snap
  const centres = [];
  for (const [, pm] of remotePlayers) {
    const tx = pm.group.position.x - playerPos.x;
    const tz = pm.group.position.z - playerPos.z;
    const d  = Math.sqrt(tx * tx + tz * tz);
    if (d > 0.5 && d < BULLET_RANGE) centres.push({ x: pm.group.position.x, z: pm.group.position.z, dist: d });
  }

  // Find best target in 20° cone
  let snapTarget = null, bestAngle = CONE_ANGLE;
  for (const c of centres) {
    const toT   = new THREE.Vector2(c.x - playerPos.x, c.z - playerPos.z).normalize();
    const angle = Math.acos(Math.max(-1, Math.min(1, aimXZ.dot(toT))));
    if (angle < bestAngle) { bestAngle = angle; snapTarget = c; }
  }

  // Soft snap
  let finalXZ = aimXZ.clone();
  if (snapTarget) {
    const toT = new THREE.Vector2(snapTarget.x - playerPos.x, snapTarget.z - playerPos.z).normalize();
    finalXZ.lerp(toT, SNAP_STRENGTH).normalize();
  }

  // Spread
  const refDist   = snapTarget ? snapTarget.dist : 20;
  const spread    = BASE_SPREAD * Math.sqrt(refDist / SPREAD_REF);
  const spreadAng = (Math.random() - 0.5) * 2 * spread;
  const cs = Math.cos(spreadAng), sn = Math.sin(spreadAng);
  finalXZ.set(
    finalXZ.x * cs - finalXZ.y * sn,
    finalXZ.x * sn + finalXZ.y * cs
  ).normalize();

  return {
    origin:    { x: origin.x, y: origin.y, z: origin.z },
    direction: { x: finalXZ.x, y: 0, z: finalXZ.y },
  };
}

/**
 * Camera-ray hitscan — uses the EXACT same ray as the red crosshair.
 * If crosshair is red, this WILL return a hit.
 *
 * @param {THREE.Raycaster} ray   — from controls.getCameraRaycaster()
 * @param {THREE.Mesh[]}    hitboxes  — all visible hitbox meshes
 * @param {Map<string,{id,type}>} infoMap  — uuid → { id, type }
 * @returns {{ target:{id,type}, point:THREE.Vector3, dist:number } | null}
 */
export function hitscan(ray, hitboxes, infoMap) {
  if (hitboxes.length === 0) return null;
  const hits = ray.intersectObjects(hitboxes, false);
  if (hits.length === 0) return null;
  const info = infoMap.get(hits[0].object.uuid);
  if (!info) return null;
  return {
    target:    info,
    point:     hits[0].point.clone(),
    dist:      hits[0].distance,
    hitObject: hits[0].object,   // mesh that was hit (name tells us head/body/leg)
  };
}

/**
 * Spawn a visual-only bullet that travels from origin toward targetPoint
 * (or in flatDir if no target) and stops at maxDist.
 *
 * @param {THREE.Scene} scene
 * @param {{x,y,z}} origin
 * @param {THREE.Vector3} dir3D   — normalized 3-D direction
 * @param {number} color
 * @param {number} maxDist        — units before bullet disappears
 */
export function spawnBullet(scene, origin, dir3D, color = 0xffff00, maxDist = BULLET_RANGE) {
  const geo    = new THREE.SphereGeometry(0.12, 4, 4);
  const mat    = new THREE.MeshBasicMaterial({ color });
  const bullet = new THREE.Mesh(geo, mat);
  bullet.position.set(origin.x, origin.y, origin.z);
  // Accept either THREE.Vector3 or plain {x,y,z} (e.g. from network JSON)
  const dir = (dir3D && typeof dir3D.clone === 'function')
    ? dir3D.clone().normalize()
    : new THREE.Vector3(dir3D.x, dir3D.y, dir3D.z).normalize();
  scene.add(bullet);
  activeBullets.push({ mesh: bullet, dir, dist: 0, maxDist });
}

export function updateBullets(scene, dt) {
  for (let i = activeBullets.length - 1; i >= 0; i--) {
    const b    = activeBullets[i];
    const step = BULLET_SPEED * dt;
    b.mesh.position.addScaledVector(b.dir, step);
    b.dist += step;
    if (b.dist >= b.maxDist) {
      scene.remove(b.mesh);
      b.mesh.geometry.dispose();
      b.mesh.material.dispose();
      activeBullets.splice(i, 1);
    }
  }
}

export function muzzleFlash(scene, origin, dir = null) {
  const COLORS = [0xff6600, 0xff4400, 0xffcc00, 0xffaa00, 0xff8800, 0xff2200];
  const N      = 11;
  const LIFE   = 0.11; // segundos

  // Dirección base: si se pasa un dir lo usamos, si no spreadeamos en todas las direcciones
  const fwd = dir
    ? new THREE.Vector3(dir.x, 0, dir.z).normalize()
    : new THREE.Vector3(1, 0, 0);

  const particles = [];
  for (let i = 0; i < N; i++) {
    const size = 0.04 + Math.random() * 0.10;
    const geo  = new THREE.SphereGeometry(size, 4, 3);
    const col  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const mat  = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 999;
    mesh.position.set(origin.x, origin.y, origin.z);
    scene.add(mesh);

    // Velocidad: hacia adelante con spread cónico
    const spread = 0.55;
    const spd    = 6 + Math.random() * 8;
    const vx = (fwd.x + (Math.random() - 0.5) * spread) * spd;
    const vy = (0.3  + Math.random() * 0.9)             * spd * 0.35;
    const vz = (fwd.z + (Math.random() - 0.5) * spread) * spd;
    particles.push({ mesh, mat, vx, vy, vz });
  }

  // Luz puntual breve
  const light = new THREE.PointLight(0xff8800, 5, 4.5);
  light.position.set(origin.x, origin.y, origin.z);
  scene.add(light);

  let elapsed = 0;
  const TICK  = 1 / 60;
  const id    = setInterval(() => {
    elapsed += TICK;
    const frac = Math.min(1, elapsed / LIFE);
    for (const p of particles) {
      p.mesh.position.x += p.vx * TICK;
      p.mesh.position.y += p.vy * TICK;
      p.mesh.position.z += p.vz * TICK;
      p.vy -= 18 * TICK; // gravedad leve
      p.mat.opacity = 0.95 * (1 - frac);
      const s = 1 + frac * 2.5; // expande
      p.mesh.scale.setScalar(s);
    }
    light.intensity = 5 * (1 - frac * 1.8);
    if (elapsed >= LIFE) {
      clearInterval(id);
      for (const p of particles) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mat.dispose();
      }
      scene.remove(light);
    }
  }, TICK * 1000);
}
