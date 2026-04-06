// --- Horse system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const MOUNT_RADIUS = 3.0;
const HORSE_SPEED_MULT = 2.2;

// [x, z] positions of horses in the world
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
  horseTemplate = new Promise((resolve) => {
    loader.load('/models/horse.glb', (gltf) => resolve(gltf.scene), undefined, () => resolve(null));
  });
  return horseTemplate;
}

export class HorseManager {
  constructor(scene, network) {
    this.scene = scene;
    this.network = network;
    this.horses = new Map();      // id -> { mesh, riderId, x, z }
    this.myHorseId = null;        // which horse this player is riding
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
      this.horses.set(spawn.id, { mesh, riderId: null, x: spawn.x, z: spawn.z });
    }
  }

  _fallbackMesh() {
    const g = new THREE.Group();
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
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      z-index: 200; background: rgba(0,0,0,0.6); color: #fff;
      padding: 8px 20px; border-radius: 8px; font-size: 14px;
      display: none; pointer-events: none; border: 1px solid rgba(255,255,255,0.2);
    `;
    el.textContent = '[E] Montar caballo';
    document.body.appendChild(el);
    return el;
  }

  // Called every frame with player position
  update(playerPos, dt) {
    if (this.myHorseId !== null) return; // already mounted

    let nearest = null;
    let nearestDist = MOUNT_RADIUS;

    for (const [id, horse] of this.horses) {
      if (horse.riderId !== null) continue;
      const dx = horse.x - playerPos.x;
      const dz = horse.z - playerPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = id;
      }
    }

    this._mountPrompt.style.display = nearest !== null ? 'block' : 'none';
    this._nearestHorseId = nearest;
  }

  tryMount(playerId) {
    if (this.myHorseId !== null) {
      // Dismount
      this._dismount(playerId);
      return false;
    }
    if (this._nearestHorseId !== null) {
      this._mount(this._nearestHorseId, playerId);
      return true;
    }
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

  // Move horse when player is riding it
  syncRiderPosition(x, z, ry) {
    if (this.myHorseId === null) return;
    const horse = this.horses.get(this.myHorseId);
    if (!horse) return;
    horse.x = x;
    horse.z = z;
    horse.mesh.position.set(x, 0, z);
    horse.mesh.rotation.y = ry + Math.PI; // horse faces movement direction
  }

  // Remote player mounted/dismounted
  onRemoteMount(horseId, riderId) {
    const horse = this.horses.get(horseId);
    if (horse) horse.riderId = riderId;
  }

  onRemoteDismount(horseId) {
    const horse = this.horses.get(horseId);
    if (horse) horse.riderId = null;
  }

  onRemoteHorseMoved(horseId, x, z, ry) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.x = x;
    horse.z = z;
    horse.mesh.position.set(x, 0, z);
    horse.mesh.rotation.y = ry + Math.PI;
  }

  isMounted() { return this.myHorseId !== null; }
  speedMultiplier() { return this.isMounted() ? this._mountedSpeedMult : 1.0; }
}
