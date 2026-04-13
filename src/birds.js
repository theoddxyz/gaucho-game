// --- Bird Flock System (dBBMM-inspired, same base as cows) ---
import * as THREE from 'three';

// ─── dBBMM parameters for birds ──────────────────────────────────────────────
// Alta sigma = movimiento caótico en bandada; viajan rápido, huyen rápido
const BB_STATES = {
  resting:   { sigma: 0.3,  speed: 0,    wpRadius: [0,  0 ], timer: [8, 20] },
  flying:    { sigma: 2.8,  speed: 5.5,  wpRadius: [20, 55], timer: [8, 18] },
  scattering:{ sigma: 4.5,  speed: 9.0,  wpRadius: [40, 80], timer: [6, 10] },
};
const FLOCK_COHESION  = 0.22;  // pull hacia centroide del grupo
const TAU             = { resting: 0.0, flying: 0.35, scattering: 0.18 };
const FLEE_RADIUS     = 14;    // distancia al player para scattering
const LAND_RADIUS     = 10;    // distancia al player para poder aterrizar

const FLY_HEIGHT      = 4.8;   // altura normal de vuelo (m)
const FLY_HEIGHT_SCAT = 8.5;   // altura al scatter
const Y_LERP          = 2.5;   // velocidad de cambio de altura

const WING_FREQ       = 5.5;   // frecuencia de aleteo
const WING_AMP        = 0.35;  // amplitud de aleteo (rad)

// ─── Gaussian random (Box-Muller) ─────────────────────────────────────────────
function _gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ─── Build a single bird mesh ─────────────────────────────────────────────────
const M_BIRD = new THREE.MeshStandardMaterial({ color: 0x1a1208, roughness: 0.9 });
const M_WING = new THREE.MeshStandardMaterial({ color: 0x2a1e10, roughness: 0.9 });

function buildBird() {
  const root = new THREE.Group();

  // Cuerpo pequeño
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.18), M_BIRD);
  body.castShadow = false;
  root.add(body);

  // Ala izquierda: pivot en el cuerpo, gira en X
  const wingPivotL = new THREE.Group();
  wingPivotL.position.set(-0.04, 0, 0);
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), M_WING);
  wingL.position.set(-0.13, 0, 0);
  wingL.castShadow = false;
  wingPivotL.add(wingL);
  root.add(wingPivotL);

  // Ala derecha
  const wingPivotR = new THREE.Group();
  wingPivotR.position.set(0.04, 0, 0);
  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), M_WING);
  wingR.position.set(0.13, 0, 0);
  wingR.castShadow = false;
  wingPivotR.add(wingR);
  root.add(wingPivotR);

  root._wingL = wingPivotL;
  root._wingR = wingPivotR;
  return root;
}

// ─── Spawn positions de bandadas (repartidas por el mapa) ─────────────────────
const FLOCK_SPAWNS = [
  { x:   8, z: -55,  n: 14 },
  { x: -35, z: -90,  n: 11 },
  { x:  55, z: -40,  n: 16 },
  { x: -15, z:-120,  n: 10 },
  { x:  70, z: -75,  n: 13 },
  { x:   0, z: -30,  n: 12 },
  { x: -60, z: -50,  n: 9  },
];

// ─── BirdSystem ───────────────────────────────────────────────────────────────
export class BirdSystem {
  constructor(scene) {
    this._scene  = scene;
    this._flocks = [];

    for (const sp of FLOCK_SPAWNS) {
      this._flocks.push(this._createFlock(sp.x, sp.z, sp.n));
    }
  }

  _createFlock(cx, cz, n) {
    const birds = [];
    for (let i = 0; i < n; i++) {
      const mesh = buildBird();
      const ox   = (Math.random() - 0.5) * 6;
      const oz   = (Math.random() - 0.5) * 6;
      mesh.position.set(cx + ox, 0, cz + oz);
      mesh.rotation.y = Math.random() * Math.PI * 2;
      this._scene.add(mesh);

      birds.push({
        mesh,
        vx: 0, vz: 0,
        targetY: 0,   // altura objetivo
        wingT: Math.random() * Math.PI * 2,
        bbState: 'resting',
        waypoint: { x: cx + ox, z: cz + oz },
        waypointTimer: 4 + Math.random() * 8,
        stateTimer:    8 + Math.random() * 12,
      });
    }
    return { cx, cz, birds };
  }

  update(dt, playerPos) {
    for (const flock of this._flocks) {
      const { birds } = flock;

      // ── Centroide del grupo ───────────────────────────────────────────────
      let sumX = 0, sumZ = 0;
      for (const b of birds) { sumX += b.mesh.position.x; sumZ += b.mesh.position.z; }
      const centX = sumX / birds.length;
      const centZ = sumZ / birds.length;

      for (const bird of birds) {
        const bx = bird.mesh.position.x, bz = bird.mesh.position.z;
        const by = bird.mesh.position.y;

        // ── Player proximity → scatter ────────────────────────────────────
        if (playerPos) {
          const pdx = bx - playerPos.x, pdz = bz - playerPos.z;
          const pd2 = pdx * pdx + pdz * pdz;
          if (pd2 < FLEE_RADIUS * FLEE_RADIUS && bird.bbState !== 'scattering') {
            bird.bbState = 'scattering';
            bird.stateTimer = BB_STATES.scattering.timer[0] + Math.random() *
              (BB_STATES.scattering.timer[1] - BB_STATES.scattering.timer[0]);
          }
        }

        // ── State timer ───────────────────────────────────────────────────
        bird.stateTimer -= dt;
        if (bird.stateTimer <= 0) {
          if (bird.bbState === 'scattering') {
            bird.bbState = 'flying';
          } else if (bird.bbState === 'flying') {
            // Puede aterrizar si no hay player cerca
            const canLand = !playerPos || (() => {
              const dx = bx - playerPos.x, dz = bz - playerPos.z;
              return dx * dx + dz * dz > LAND_RADIUS * LAND_RADIUS;
            })();
            bird.bbState = canLand && Math.random() < 0.25 ? 'resting' : 'flying';
          } else {
            // resting → take off
            bird.bbState = 'flying';
          }
          const st = BB_STATES[bird.bbState];
          bird.stateTimer = st.timer[0] + Math.random() * (st.timer[1] - st.timer[0]);
        }

        // ── Waypoint timer (dBBMM step) ──────────────────────────────────
        bird.waypointTimer -= dt;
        if (bird.waypointTimer <= 0) {
          const st       = BB_STATES[bird.bbState];
          const [r0, r1] = st.wpRadius;
          if (r1 > 0) {
            const wpR   = r0 + Math.random() * (r1 - r0);
            const angle = Math.random() * Math.PI * 2;
            // Brownian bridge: mezcla de dirección aleatoria + drift hacia waypoint
            const driftX = bx < centX ? 1 : -1;
            const driftZ = bz < centZ ? 1 : -1;
            bird.waypoint = {
              x: bx + Math.cos(angle) * wpR * st.sigma + driftX * wpR * FLOCK_COHESION,
              z: bz + Math.sin(angle) * wpR * st.sigma + driftZ * wpR * FLOCK_COHESION,
            };
          }
          bird.waypointTimer = 0.6 + Math.random() * 1.5;
        }

        // ── Movimiento ────────────────────────────────────────────────────
        const st    = BB_STATES[bird.bbState];
        const tdx   = bird.waypoint.x - bx;
        const tdz   = bird.waypoint.z - bz;
        const tdist = Math.sqrt(tdx * tdx + tdz * tdz) || 1;
        const tau   = TAU[bird.bbState] || 0.35;

        const targetVX = (tdx / tdist) * st.speed + _gauss() * st.sigma * 0.2;
        const targetVZ = (tdz / tdist) * st.speed + _gauss() * st.sigma * 0.2;
        bird.vx += (targetVX - bird.vx) * Math.min(1, (1 / tau) * dt);
        bird.vz += (targetVZ - bird.vz) * Math.min(1, (1 / tau) * dt);

        bird.mesh.position.x += bird.vx * dt;
        bird.mesh.position.z += bird.vz * dt;

        // Rotación hacia dirección de movimiento
        if (Math.abs(bird.vx) + Math.abs(bird.vz) > 0.3) {
          const targetRY = Math.atan2(bird.vx, bird.vz);
          let diff = targetRY - bird.mesh.rotation.y;
          while (diff >  Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          bird.mesh.rotation.y += diff * Math.min(1, 6 * dt);
        }

        // ── Altura objetivo según estado ──────────────────────────────────
        bird.targetY = bird.bbState === 'resting'
          ? 0
          : bird.bbState === 'scattering'
            ? FLY_HEIGHT_SCAT + _gauss() * 0.8
            : FLY_HEIGHT + _gauss() * 0.4;

        bird.mesh.position.y += (bird.targetY - by) * Math.min(1, Y_LERP * dt);

        // ── Aleteo ────────────────────────────────────────────────────────
        if (bird.bbState !== 'resting') {
          bird.wingT += dt * WING_FREQ;
          const wingAngle = Math.sin(bird.wingT) * WING_AMP;
          if (bird.mesh._wingL) bird.mesh._wingL.rotation.x =  wingAngle;
          if (bird.mesh._wingR) bird.mesh._wingR.rotation.x = -wingAngle;
        } else {
          // En tierra: alas bajas
          if (bird.mesh._wingL) bird.mesh._wingL.rotation.x = 0.1;
          if (bird.mesh._wingR) bird.mesh._wingR.rotation.x = 0.1;
        }
      }
    }
  }
}
