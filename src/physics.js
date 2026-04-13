/**
 * src/physics.js — Cannon-es world (solo para ragdoll de animales muertos)
 * Un único World compartido por todos los sistemas de animales.
 */
import * as CANNON from 'cannon-es';

// ── World ─────────────────────────────────────────────────────────────────────
export const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -22, 0),
});
physicsWorld.broadphase = new CANNON.NaiveBroadphase();
physicsWorld.allowSleep = true;

// ── Materiales de contacto ────────────────────────────────────────────────────
const _groundMat = new CANNON.Material('ground');
const _animalMat = new CANNON.Material('animal');

physicsWorld.addContactMaterial(new CANNON.ContactMaterial(_groundMat, _animalMat, {
  friction:    0.45,
  restitution: 0.20,   // rebote suave
}));

// ── Plano de suelo estático en y = 0 ─────────────────────────────────────────
const groundBody = new CANNON.Body({ mass: 0, material: _groundMat });
groundBody.addShape(new CANNON.Plane());
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

// ── Step fijo (llamar una vez por frame desde main.js) ────────────────────────
const FIXED_STEP = 1 / 60;
export function stepPhysics(dt) {
  // maxSubSteps=3 para que no explote si el frame tarda mucho
  physicsWorld.step(FIXED_STEP, dt, 3);
}

// ── Crear cuerpo rígido tipo "caja" para ragdoll ──────────────────────────────
// cx/cy/cz: centro de masa en world space
// hx/hy/hz: semiejes del box
// mass: kg
export function createRagdollBody(cx, cy, cz, hx, hy, hz, mass) {
  const body = new CANNON.Body({
    mass,
    material: _animalMat,
    linearDamping:  0.04,
    angularDamping: 0.06,
    allowSleep:     true,
    sleepSpeedLimit: 0.5,
    sleepTimeLimit:  1.2,
  });
  body.addShape(new CANNON.Box(new CANNON.Vec3(hx, hy, hz)));
  body.position.set(cx, cy, cz);
  physicsWorld.addBody(body);
  return body;
}

// ── Eliminar cuerpo del mundo ─────────────────────────────────────────────────
export function removeRagdollBody(body) {
  if (body) { try { physicsWorld.removeBody(body); } catch(e) {} }
}

// ── Sincronizar mesh Three.js desde el cuerpo cannon ─────────────────────────
// halfHeight: offset desde el centro del body hasta los "pies" del mesh
export function syncMeshFromBody(mesh, body, halfHeight) {
  const p = body.position;
  const q = body.quaternion;
  mesh.position.set(p.x, p.y - halfHeight, p.z);
  mesh.quaternion.set(q.x, q.y, q.z, q.w);
}

// ── ¿El body ya está dormido / quieto? ───────────────────────────────────────
export function bodyIsAsleep(body) {
  return body.sleepState >= 2;   // CANNON.Body.SLEEPING === 2
}
