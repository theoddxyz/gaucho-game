// --- Horse system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader      = new GLTFLoader();
const MOUNT_RADIUS      = 3.0;
const HORSE_SPEED_MULT  = 2.2;
const WALK_FREQ         = 7.0;   // cycles/sec
const WALK_AMP          = 0.60;  // radians swing
const HIP_Y             = 1.3;   // world Y of the hip joint

// Expected leg names (index → LEG_DEFS[i])
const LEG_DEFS = [
  { hipZ: -0.9, phase: 0        }, // front-left  (leg0)
  { hipZ: -0.9, phase: Math.PI  }, // front-right (leg1)
  { hipZ:  0.9, phase: Math.PI  }, // back-left   (leg2)
  { hipZ:  0.9, phase: 0        }, // back-right  (leg3)
];

export const HORSE_SPAWNS = [
  { id: 0, x: -30, z:  10 },
  { id: 1, x:  35, z:  25 },
  { id: 2, x: -10, z: -55 },
  { id: 3, x:  55, z: -15 },
  { id: 4, x:   5, z:  50 },
  { id: 5, x: -60, z: -35 },
];

let horseTemplate = null;
function loadTemplate() {
  if (horseTemplate) return horseTemplate;
  horseTemplate = new Promise(resolve =>
    loader.load('/models/horse.glb', g => resolve(g.scene), undefined, () => resolve(null))
  );
  return horseTemplate;
}

// ─── Pivot-rotation matrix: T(hip) · Rx(θ) · T(-hip) ────────────────────────
// X coordinates pass through unchanged (Rx doesn't affect X).
// HIP_Y and hipZ are the pivot point; hipX is irrelevant for X-axis rotation.
//
//  | 1  0     0      0                       |
//  | 0  cosθ -sinθ   HIP_Y(1-cosθ)+hipZ·sinθ |
//  | 0  sinθ  cosθ   hipZ(1-cosθ)-HIP_Y·sinθ |
//  | 0  0     0      1                       |
function applyLegMatrix(mesh, angle, hipZ) {
  const c = Math.cos(angle), s = Math.sin(angle);
  const hy = HIP_Y, hz = hipZ;
  mesh.matrixAutoUpdate = false;
  mesh.matrix.set(
    1, 0,  0,  0,
    0, c, -s,  hy * (1 - c) + hz * s,
    0, s,  c,  hz * (1 - c) - hy * s,
    0, 0,  0,  1
  );
  mesh.matrixWorldNeedsUpdate = true; // tell Three.js to propagate to world matrix
}

// ─── Find leg meshes in a cloned horse ───────────────────────────────────────
// Tries exact name match first, then case-insensitive partial, then position.
function findLegs(horseMesh) {
  const allMeshes = [];
  horseMesh.traverse(o => { if (o.isMesh) allMeshes.push(o); });

  // Always log so you can check the actual node names in devtools
  console.log('[GAUCHO] Horse mesh names:', allMeshes.map(o => `"${o.name}"`).join(', '));

  const legs = [];

  for (let i = 0; i < 4; i++) {
    const def = LEG_DEFS[i];

    // 1) Exact match variants
    let found = allMeshes.find(o => {
      const n = o.name.toLowerCase();
      return n === `leg${i}` || n === `leg_${i}` ||
             n === `pata${i}` || n === `pata_${i}` ||
             n === `pierna${i}`;
    });

    // 2) Contains "leg" + digit i
    if (!found) {
      found = allMeshes.find(o => {
        const n = o.name.toLowerCase();
        return (n.includes('leg') || n.includes('pata')) && n.includes(String(i));
      });
    }

    if (found) {
      legs.push({ mesh: found, hipZ: def.hipZ, phase: def.phase });
    }
  }

  // 3) Position-based fallback: meshes whose centroid is below HIP_Y
  //    (skips torso/body/head/saddle/mane/tail)
  if (legs.length < 2) {
    console.warn('[GAUCHO] Leg names not matched — falling back to position detection.');
    const skip = /torso|body|head|neck|mane|tail|saddle|ear|muzzle/i;
    const candidates = allMeshes
      .filter(o => !legs.find(l => l.mesh === o) && !skip.test(o.name))
      .filter(o => {
        const box = new THREE.Box3().setFromObject(o);
        return box.getCenter(new THREE.Vector3()).y < HIP_Y;
      })
      .slice(0, 4);

    candidates.forEach((o, i) => {
      const def = LEG_DEFS[i] ?? LEG_DEFS[0];
      legs.push({ mesh: o, hipZ: def.hipZ, phase: def.phase });
    });
  }

  console.log(`[GAUCHO] Animating ${legs.length} leg(s):`, legs.map(l => `"${l.mesh.name}"`).join(', '));
  return legs;
}

// ─── HorseManager ────────────────────────────────────────────────────────────
export class HorseManager {
  constructor(scene, network) {
    this.scene   = scene;
    this.network = network;
    this.horses  = new Map(); // id → { mesh, legs, riderId, x, z, walkTime }
    this.myHorseId = null;
    this._mountedSpeedMult = HORSE_SPEED_MULT;
    this._mountPrompt = this._createPrompt();
    this._init();
  }

  async _init() {
    const template = await loadTemplate();
    for (const spawn of HORSE_SPAWNS) {
      const mesh = template ? template.clone(true) : this._fallbackMesh();
      mesh.position.set(spawn.x, 0, spawn.z);
      mesh.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      this.scene.add(mesh);

      const legs = template ? findLegs(mesh) : [];
      this.horses.set(spawn.id, { mesh, legs, riderId: null, x: spawn.x, z: spawn.z, walkTime: 0 });
    }
  }

  _fallbackMesh() {
    const g    = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.9, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    body.position.y = 1.75;
    g.add(body);
    return g;
  }

  _createPrompt() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      z-index:200; background:rgba(0,0,0,0.6); color:#fff;
      padding:8px 20px; border-radius:8px; font-size:14px;
      display:none; pointer-events:none; border:1px solid rgba(255,255,255,0.2);
    `;
    el.textContent = '[E] Montar caballo';
    document.body.appendChild(el);
    return el;
  }

  update(playerPos, dt) {
    for (const [, horse] of this.horses) {
      const moving = horse.riderId !== null;
      if (moving) horse.walkTime += dt;
      this._animateLegs(horse, moving);
    }

    if (this.myHorseId !== null) return;

    let nearest = null, nearestDist = MOUNT_RADIUS;
    for (const [id, horse] of this.horses) {
      if (horse.riderId !== null) continue;
      const dx = horse.x - playerPos.x;
      const dz = horse.z - playerPos.z;
      const d  = Math.sqrt(dx * dx + dz * dz);
      if (d < nearestDist) { nearestDist = d; nearest = id; }
    }
    this._mountPrompt.style.display = nearest !== null ? 'block' : 'none';
    this._nearestHorseId = nearest;
  }

  _animateLegs(horse, moving) {
    for (const leg of horse.legs) {
      const angle = moving
        ? Math.sin(WALK_FREQ * horse.walkTime + leg.phase) * WALK_AMP
        : 0;
      applyLegMatrix(leg.mesh, angle, leg.hipZ);
    }
  }

  tryMount(playerId) {
    if (this.myHorseId !== null) { this._dismount(playerId); return false; }
    if (this._nearestHorseId !== null) { this._mount(this._nearestHorseId, playerId); return true; }
    return false;
  }

  _mount(horseId, playerId) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.riderId = playerId;
    this.myHorseId = horseId;
    this._mountPrompt.style.display = 'none';
    this.network?.sendMount(horseId);
  }

  _dismount(playerId) {
    const horse = this.horses.get(this.myHorseId);
    if (horse) horse.riderId = null;
    this.network?.sendDismount(this.myHorseId);
    this.myHorseId = null;
  }

  syncRiderPosition(x, z, moveAngle) {
    if (this.myHorseId === null) return;
    const horse = this.horses.get(this.myHorseId);
    if (!horse) return;
    horse.x = x; horse.z = z;
    horse.mesh.position.set(x, 0, z);
    horse.mesh.rotation.y = moveAngle + Math.PI;
  }

  onRemoteMount(horseId, riderId) {
    const h = this.horses.get(horseId);
    if (h) h.riderId = riderId;
  }

  onRemoteDismount(horseId) {
    const h = this.horses.get(horseId);
    if (h) h.riderId = null;
  }

  onRemoteHorseMoved(horseId, x, z, ry, remotePlayer) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.x = x; horse.z = z;
    horse.mesh.position.set(x, 0, z);
    horse.mesh.rotation.y = ry + Math.PI;
    if (remotePlayer) remotePlayer.setTarget(x, 2.5, z, ry);
  }

  isMounted()      { return this.myHorseId !== null; }
  speedMultiplier(){ return this.isMounted() ? this._mountedSpeedMult : 1.0; }
}
