// --- Horse system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader             = new GLTFLoader();
const MOUNT_RADIUS       = 3.0;
const HORSE_SPEED_MULT   = 2.2;
const HORSE_SPRINT_EXTRA = 1.25; // total = 2.2 × 1.25 = 2.75x base
const WALK_FREQ          = 6.0;
const WALK_FREQ_SPRINT   = 11.0;  // faster legs when sprinting
const WALK_AMP           = 0.45;
const SIDE_DIST          = 2.2;
const MOUNT_DUR          = 0.35;
const DISMOUNT_DUR       = 0.40;

const LEG_PATTERN    = /leg|pata|pierna|hoof|pezuña|extremidad/i;
const SKIP_PATTERN   = /torso|body|head|neck|mane|tail|saddle|ear|muzzle|eye|horn|nose|montura|pelo|crin|cola|cuerpo|cabeza|ojo|nariz|boca|diente|lomo|grupas/i;
const SADDLE_PATTERN = /saddle|blanket|montura|manta|silla|alforja|arreo|cincha|estribo|rienda|brida/i;

// Distinct coat colors: brown, black, palomino, dark chestnut, sorrel, gray
const HORSE_COLORS = [0x8B4513, 0x1a0a05, 0xd4b870, 0x3d1c08, 0xc07030, 0x707070];

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

// ─── Pivot group at top of leg (hip joint) ───────────────────────────────────
function wrapInPivot(legObj) {
  const parent = legObj.parent;
  if (!parent) return legObj;

  const worldBox = new THREE.Box3().setFromObject(legObj);
  if (worldBox.isEmpty()) return legObj;

  const legWP      = legObj.getWorldPosition(new THREE.Vector3());
  const pivotWorld = new THREE.Vector3(legWP.x, worldBox.max.y, legWP.z);

  const wPos = new THREE.Vector3(), wQuat = new THREE.Quaternion(), wScale = new THREE.Vector3();
  legObj.matrixWorld.decompose(wPos, wQuat, wScale);

  const pivot = new THREE.Group();
  pivot.position.copy(parent.worldToLocal(pivotWorld.clone()));

  parent.remove(legObj);
  parent.add(pivot);
  pivot.add(legObj);

  pivot.updateWorldMatrix(true, false);
  const newLocalMat = new THREE.Matrix4()
    .compose(wPos, wQuat, wScale)
    .premultiply(new THREE.Matrix4().copy(pivot.matrixWorld).invert());
  newLocalMat.decompose(legObj.position, legObj.quaternion, legObj.scale);

  return pivot;
}

// ─── Find & wrap leg objects ─────────────────────────────────────────────────
function findLegs(horseMesh) {
  const all = [];
  horseMesh.traverse(o => { if (o !== horseMesh) all.push(o); });
  console.log('[GAUCHO] All horse nodes:', all.map(o => `${o.type}:"${o.name}"`).join(' | '));

  const named = all.filter(o => LEG_PATTERN.test(o.name));
  let sources = named.length >= 2 ? named.slice(0, 4) : null;

  if (!sources) {
    console.warn('[GAUCHO] No named legs — position fallback.');
    const meshes = [];
    horseMesh.traverse(o => { if (o.isMesh && !SKIP_PATTERN.test(o.name)) meshes.push(o); });
    meshes.sort((a, b) => {
      const ya = new THREE.Box3().setFromObject(a).getCenter(new THREE.Vector3()).y;
      const yb = new THREE.Box3().setFromObject(b).getCenter(new THREE.Vector3()).y;
      return ya - yb;
    });
    sources = meshes.slice(0, 4);
  }

  const PHASES = [0, Math.PI, Math.PI, 0];
  return sources.map((obj, i) => ({
    pivot: wrapInPivot(obj),
    phase: PHASES[i] ?? (i % 2) * Math.PI,
  }));
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
    this._anim = null;
    this._mountLandPos = null;
    this._init();
  }

  async _init() {
    const template = await loadTemplate();
    for (const spawn of HORSE_SPAWNS) {
      const mesh = template ? template.clone(true) : this._fallbackMesh();
      mesh.position.set(spawn.x, 0, spawn.z);

      const color = HORSE_COLORS[spawn.id % HORSE_COLORS.length];
      const saddleNodes = [];

      mesh.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        if (SADDLE_PATTERN.test(o.name)) {
          saddleNodes.push(o);
          o.visible = false;  // hidden while no rider
        } else {
          o.material = o.material.clone();
          o.material.color.set(color);
        }
      });

      this.scene.add(mesh);
      mesh.updateWorldMatrix(true, true);

      const legs = template ? findLegs(mesh) : [];
      this.horses.set(spawn.id, {
        mesh, legs, riderId: null, saddleNodes,
        x: spawn.x, z: spawn.z,
        walkTime: 0, _prevX: spawn.x, _prevZ: spawn.z,
        _sprinting: false,
      });
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
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      z-index:200; background:rgba(0,0,0,0.6); color:#fff;
      padding:8px 20px; border-radius:8px; font-size:14px;
      display:none; pointer-events:none; border:1px solid rgba(255,255,255,0.2);
    `;
    el.textContent = '[E] Montar caballo';
    document.body.appendChild(el);
    return el;
  }

  isMountAnimating() { return this._anim?.type === 'mount'; }

  /** Returns { x, z } once when mount animation just finished so controls can snap there. */
  consumeMountLand() {
    const p = this._mountLandPos;
    this._mountLandPos = null;
    return p;
  }

  update(playerPos, dt) {
    // Tick mount/dismount animation
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount') {
          // Signal main.js to snap controls to horse position
          this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        }
        this._anim = null;
      }
    }

    for (const [, horse] of this.horses) {
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
    // Use faster frequency when sprinting
    const freq = horse._sprinting ? WALK_FREQ_SPRINT : WALK_FREQ;
    for (const leg of horse.legs) {
      leg.pivot.rotation.x = moving
        ? Math.sin(freq * horse.walkTime + leg.phase) * WALK_AMP
        : 0;
    }
  }

  // ── Mount / Dismount ────────────────────────────────────────────────────────

  /** startY: vertical height at mount time (0 = ground, >0 = mid-jump)
   *  fromX/fromZ: player's current XZ so the arc starts from there */
  tryMount(playerId, startY = 0, fromX = 0, fromZ = 0) {
    if (this.myHorseId !== null) return this._dismount(playerId);
    if (this._nearestHorseId !== null) {
      this._mount(this._nearestHorseId, playerId, startY, fromX, fromZ);
      return null;
    }
    return null;
  }

  /** startY = vertical position when mounting; fromX/fromZ = player start position */
  _mount(horseId, playerId, startY = 0, fromX = 0, fromZ = 0) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.riderId  = playerId;
    this.myHorseId = horseId;
    horse.saddleNodes?.forEach(n => n.visible = true);
    this._mountPrompt.style.display = 'none';
    this.network?.sendMount(horseId);

    this._anim = {
      type: 'mount', t: 0,
      dur: startY > 0.5 ? 0.18 : MOUNT_DUR,
      startY,
      fromX, fromZ,
      toX: horse.x, toZ: horse.z,
    };
  }

  _dismount(playerId) {
    const horse = this.horses.get(this.myHorseId);
    if (!horse) { this.myHorseId = null; return null; }

    const horseAngle = horse.mesh.rotation.y - Math.PI;
    const sideAngle  = horseAngle + Math.PI / 2;
    const landX = horse.x + Math.sin(sideAngle) * SIDE_DIST;
    const landZ = horse.z + Math.cos(sideAngle) * SIDE_DIST;

    this._anim = {
      type: 'dismount', t: 0, dur: DISMOUNT_DUR,
      fromX: horse.x, fromZ: horse.z,
      toX: landX,     toZ: landZ,
    };

    // Make sure horse lands back at Y=0 when rider leaves
    horse.mesh.position.y = 0;
    horse.riderId  = null;
    horse.saddleNodes?.forEach(n => n.visible = false);
    this.network?.sendDismount(this.myHorseId);
    this.myHorseId = null;
    return { x: landX, z: landZ };
  }

  // ── Animation helpers ───────────────────────────────────────────────────────

  getAnimY() {
    if (!this._anim) return null;
    const t = this._anim.t;
    if (this._anim.type === 'mount') {
      // Smoothstep from startY → 2.5, tiny bounce at end
      const ease = t * t * (3 - 2 * t);
      return this._anim.startY + (2.5 - this._anim.startY) * ease + Math.sin(t * Math.PI) * 0.25;
    } else {
      // Dismount: arc from 2.5 → 0
      return (1 - t) * 2.5 + Math.sin(t * Math.PI) * 0.5;
    }
  }

  /** During mount: smoothstep XZ from player position → horse position */
  getMountModelPos() {
    if (!this._anim || this._anim.type !== 'mount') return null;
    const ease = this._anim.t * this._anim.t * (3 - 2 * this._anim.t);
    return {
      x: this._anim.fromX + (this._anim.toX - this._anim.fromX) * ease,
      z: this._anim.fromZ + (this._anim.toZ - this._anim.fromZ) * ease,
    };
  }

  /** XZ lerp during dismount: player model arcs from horse to landing spot */
  getDismountModelPos(controlsPos) {
    if (!this._anim || this._anim.type !== 'dismount') return null;
    const t = this._anim.t;
    return {
      x: this._anim.fromX + (controlsPos.x - this._anim.fromX) * t,
      z: this._anim.fromZ + (controlsPos.z - this._anim.fromZ) * t,
    };
  }

  // ── Rider position sync ─────────────────────────────────────────────────────

  /** Called every frame while mounted. jumpY = controls.position.y (0 on ground, >0 mid-jump). */
  syncRiderPosition(x, z, moveAngle, jumpY = 0, sprinting = false) {
    if (this.myHorseId === null) return;
    const horse = this.horses.get(this.myHorseId);
    if (!horse) return;
    horse.x = x; horse.z = z;
    horse._sprinting = sprinting;
    // Horse body rises with rider when jumping
    horse.mesh.position.set(x, jumpY, z);
    horse.mesh.rotation.y = moveAngle + Math.PI;
  }

  // ── Auto-mount by jumping ───────────────────────────────────────────────────

  tryAutoMount(pos, playerId, jumpY = 0) {
    if (this.myHorseId !== null) return false;
    for (const [id, horse] of this.horses) {
      if (horse.riderId !== null) continue;
      const dx = horse.x - pos.x;
      const dz = horse.z - pos.z;
      if (Math.sqrt(dx * dx + dz * dz) < MOUNT_RADIUS) {
        this._mount(id, playerId, jumpY, pos.x, pos.z);
        return true;
      }
    }
    return false;
  }

  // ── Remote sync ─────────────────────────────────────────────────────────────

  onRemoteMount(horseId, riderId)  {
    const h = this.horses.get(horseId);
    if (h) { h.riderId = riderId; h.saddleNodes?.forEach(n => n.visible = true); }
  }
  onRemoteDismount(horseId) {
    const h = this.horses.get(horseId);
    if (h) { h.riderId = null; h.mesh.position.y = 0; h.saddleNodes?.forEach(n => n.visible = false); }
  }

  onRemoteHorseMoved(horseId, x, z, ry, remotePlayer) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.x = x; horse.z = z;
    horse.mesh.position.set(x, 0, z);
    horse.mesh.rotation.y = ry + Math.PI;
    // Keep remote player model locked to horse position — no offset
    if (remotePlayer) remotePlayer.setTarget(x, 2.5, z, ry);
  }

  /** True if this player ID is currently riding any horse (for network filtering). */
  isPlayerMounted(playerId) {
    for (const horse of this.horses.values()) {
      if (horse.riderId === playerId) return true;
    }
    return false;
  }

  isMounted() { return this.myHorseId !== null; }

  speedMultiplier(sprinting = false) {
    if (!this.isMounted()) return 1.0;
    return this._mountedSpeedMult * (sprinting ? HORSE_SPRINT_EXTRA : 1.0);
  }
}
