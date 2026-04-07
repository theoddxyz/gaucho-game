// --- Horse system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader           = new GLTFLoader();
const MOUNT_RADIUS     = 3.0;
const HORSE_SPEED_MULT = 2.2;
const WALK_FREQ        = 6.0;
const WALK_AMP         = 0.45;

const LEG_PATTERN  = /leg|pata|pierna|hoof|pezuña|extremidad/i;
const SKIP_PATTERN = /torso|body|head|neck|mane|tail|saddle|ear|muzzle|eye|horn|nose|montura|pelo|crin|cola|cuerpo|cabeza|ojo|nariz|boca|diente|lomo|grupas/i;

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

// ─── Insert a pivot Group at the TOP of the leg (hip joint) ──────────────────
// Before: parent → legObj       (rotates around leg center → looks dislocated)
// After:  parent → pivot → legObj  (rotates around pivot = hip joint → correct)
function wrapInPivot(legObj) {
  const parent = legObj.parent;
  if (!parent) return legObj;

  // Bounding box of this leg in world space (matrices must be updated first)
  const worldBox = new THREE.Box3().setFromObject(legObj);
  if (worldBox.isEmpty()) return legObj;

  // Pivot world position = top-center of leg bounding box
  const legWP      = legObj.getWorldPosition(new THREE.Vector3());
  const pivotWorld = new THREE.Vector3(legWP.x, worldBox.max.y, legWP.z);

  // Decompose leg's current world transform
  const wPos = new THREE.Vector3();
  const wQuat = new THREE.Quaternion();
  const wScale = new THREE.Vector3();
  legObj.matrixWorld.decompose(wPos, wQuat, wScale);

  // Create pivot Group, position it in parent-local space
  const pivot = new THREE.Group();
  pivot.position.copy(parent.worldToLocal(pivotWorld.clone()));

  // Reparent: parent → pivot → legObj
  parent.remove(legObj);
  parent.add(pivot);
  pivot.add(legObj);

  // Restore leg's transform relative to the new pivot
  pivot.updateWorldMatrix(true, false);
  const newLocalMat = new THREE.Matrix4()
    .compose(wPos, wQuat, wScale)
    .premultiply(new THREE.Matrix4().copy(pivot.matrixWorld).invert());
  newLocalMat.decompose(legObj.position, legObj.quaternion, legObj.scale);

  return pivot; // rotate this group, not the mesh
}

// ─── Find leg objects and wrap each in a pivot ───────────────────────────────
function findLegs(horseMesh) {
  const all = [];
  horseMesh.traverse(o => { if (o !== horseMesh) all.push(o); });

  console.log('[GAUCHO] All horse nodes:',
    all.map(o => `${o.type}:"${o.name}"`).join(' | '));

  // Prefer objects whose name matches the leg pattern (any type: Group, Mesh, etc.)
  const named = all.filter(o => LEG_PATTERN.test(o.name));
  let sources = named.length >= 2 ? named.slice(0, 4) : null;

  if (!sources) {
    console.warn('[GAUCHO] No named legs — using position fallback (lowest meshes).');
    const meshes = [];
    horseMesh.traverse(o => {
      if (o.isMesh && !SKIP_PATTERN.test(o.name)) meshes.push(o);
    });
    meshes.sort((a, b) => {
      const ya = new THREE.Box3().setFromObject(a).getCenter(new THREE.Vector3()).y;
      const yb = new THREE.Box3().setFromObject(b).getCenter(new THREE.Vector3()).y;
      return ya - yb; // lowest first = actual legs
    });
    sources = meshes.slice(0, 4);
  }

  // Trot gait phases: front-L=0, front-R=π, back-L=π, back-R=0
  const PHASES = [0, Math.PI, Math.PI, 0];

  const legs = sources.map((obj, i) => {
    const pivot = wrapInPivot(obj);
    return { pivot, phase: PHASES[i] ?? (i % 2) * Math.PI };
  });

  console.log(`[GAUCHO] ${legs.length} leg pivot(s) created.`);
  return legs;
}

// ─── HorseManager ────────────────────────────────────────────────────────────
export class HorseManager {
  constructor(scene, network) {
    this.scene   = scene;
    this.network = network;
    this.horses  = new Map();
    this.myHorseId = null;
    this._mountedSpeedMult = HORSE_SPEED_MULT;
    this._mountPrompt = this._createPrompt();
    this._nearestHorseId = null;
    this._init();
  }

  async _init() {
    const template = await loadTemplate();
    for (const spawn of HORSE_SPAWNS) {
      const mesh = template ? template.clone(true) : this._fallbackMesh();
      mesh.position.set(spawn.x, 0, spawn.z);
      mesh.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      this.scene.add(mesh);
      mesh.updateWorldMatrix(true, true); // required before pivot calculations

      const legs = template ? findLegs(mesh) : [];
      this.horses.set(spawn.id, {
        mesh, legs,
        riderId: null,
        x: spawn.x, z: spawn.z,
        walkTime: 0,
        _prevX: spawn.x, _prevZ: spawn.z,
      });
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
      // Only animate when the horse actually moved (not just "has a rider")
      const moved = horse.riderId !== null && (
        Math.abs(horse.x - horse._prevX) > 0.005 ||
        Math.abs(horse.z - horse._prevZ) > 0.005
      );
      horse._prevX = horse.x;
      horse._prevZ = horse.z;

      if (moved) horse.walkTime += dt;
      else       horse.walkTime  = 0;

      this._animateLegs(horse, moved);
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
      // Rotate the pivot group — its origin is at the hip joint, so the leg
      // swings correctly without separating from the body
      leg.pivot.rotation.x = moving
        ? Math.sin(WALK_FREQ * horse.walkTime + leg.phase) * WALK_AMP
        : 0;
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

  onRemoteMount(horseId, riderId)  { const h = this.horses.get(horseId); if (h) h.riderId = riderId; }
  onRemoteDismount(horseId)        { const h = this.horses.get(horseId); if (h) h.riderId = null; }

  onRemoteHorseMoved(horseId, x, z, ry, remotePlayer) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.x = x; horse.z = z;
    horse.mesh.position.set(x, 0, z);
    horse.mesh.rotation.y = ry + Math.PI;
    if (remotePlayer) remotePlayer.setTarget(x, 2.5, z, ry);
  }

  isMounted()       { return this.myHorseId !== null; }
  speedMultiplier() { return this.isMounted() ? this._mountedSpeedMult : 1.0; }
}
