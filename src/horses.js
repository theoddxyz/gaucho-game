// --- Horse system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader           = new GLTFLoader();
const MOUNT_RADIUS     = 3.0;
const HORSE_SPEED_MULT = 2.2;
const WALK_FREQ        = 6.0;  // cycles/sec
const WALK_AMP         = 0.45; // radians

// Body parts to skip when searching for legs
const SKIP = /torso|body|head|neck|mane|tail|saddle|ear|muzzle|eye|horn|nose/i;

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

// ─── Find leg meshes in a cloned horse ───────────────────────────────────────
function findLegs(horseMesh) {
  const all = [];
  horseMesh.traverse(o => { if (o.isMesh) all.push(o); });

  console.log('[GAUCHO] Horse mesh names:', all.map(o => `"${o.name}"`).join(', '));

  // Prefer meshes with leg-related names
  const named = all.filter(o => /leg|pata|pierna|hoof|pezuña/i.test(o.name));
  // Fallback: any mesh that doesn't look like a body part
  const candidates = named.length >= 2 ? named : all.filter(o => !SKIP.test(o.name));

  // Take up to 4, assign alternating gait phases, save initial rotation
  const legs = candidates.slice(0, 4).map((mesh, i) => ({
    mesh,
    initX: mesh.rotation.x,         // preserve original rotation
    phase: (i % 2) * Math.PI,       // alternate: 0, π, 0, π …
  }));

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
      else horse.walkTime = 0; // reset so legs return to rest smoothly
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
      const swing = moving
        ? Math.sin(WALK_FREQ * horse.walkTime + leg.phase) * WALK_AMP
        : 0;
      // Add swing on top of the leg's original rotation — doesn't break the model
      leg.mesh.rotation.x = leg.initX + swing;
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

  isMounted()       { return this.myHorseId !== null; }
  speedMultiplier() { return this.isMounted() ? this._mountedSpeedMult : 1.0; }
}
