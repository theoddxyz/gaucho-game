// --- Horse system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader             = new GLTFLoader();
const MOUNT_RADIUS       = 3.0;
const HORSE_SPEED_MULT   = 1.4;
const HORSE_SPRINT_EXTRA = 1.25; // total = 1.4 × 1.25 = 1.75x base
const SADDLE_HEIGHT      = 2.1;  // altura del lomo sobre el origen del mesh
const WALK_FREQ          = 6.0;
const WALK_FREQ_SPRINT   = 11.0;  // faster legs when sprinting
const WALK_AMP           = 0.45;
const SIDE_DIST          = 2.2;
const MOUNT_DUR          = 0.35;
const DISMOUNT_DUR       = 0.40;

const LEG_PATTERN    = /leg|pata|pierna|hoof|pezuña|extremidad/i;
const SKIP_PATTERN   = /torso|body|head|neck|mane|tail|saddle|ear|muzzle|eye|horn|nose|montura|pelo|crin|cola|cuerpo|cabeza|ojo|nariz|boca|diente|lomo|grupas/i;
const SADDLE_PATTERN = /saddle|montura|manta|silla|alforja|arreo|cincha|estribo|rienda|brida|cube015/i;
// Also detect by material name (Blender may export node as "cube015" but keep material name)
const SADDLE_MAT_PATTERN = /material0*[056]+|manta|saddle|montura/i;

// Per wild horse: tiny hue shift + lightness multiplier — stays in warm/earth tones.
// Horse base hue is ~0.04-0.10 (orange-brown); shifts of ±0.07 max to avoid unnatural colors.
const WILD_VARIANTS = [
  { hShift: -0.02, lMult: 0.70 },  // dark bay
  { hShift:  0.05, lMult: 1.25 },  // palomino / dun
  { hShift: -0.03, lMult: 0.55 },  // dark chestnut
  { hShift:  0.07, lMult: 1.40 },  // cream / isabella
  { hShift:  0.02, lMult: 0.88 },  // sorrel
];

// Spawn point (must match server.js randomSpawn)
const SPAWN_X = 3.8, SPAWN_Z = -69.0, WILD_DIST = 40;

export const HORSE_SPAWNS = [
  { id: 0, x: -30, z:  10 },
  { id: 1, x:  35, z:  25 },
  { id: 2, x: 105, z:  95 },  // closest to spawn shack
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

// ─── Find & wrap leg objects, assign anatomically correct walk phases ─────────
// Natural 4-beat lateral walk sequence:
//   BL=0, FL=π/2, BR=π, FR=3π/2  (each leg offset by ¼ cycle from the next)
function findLegs(horseMesh) {
  const all = [];
  horseMesh.traverse(o => { if (o !== horseMesh) all.push(o); });

  const named = all.filter(o => LEG_PATTERN.test(o.name));
  let sources = named.length >= 2 ? named.slice(0, 4) : null;

  if (!sources) {
    const meshes = [];
    horseMesh.traverse(o => { if (o.isMesh && !SKIP_PATTERN.test(o.name)) meshes.push(o); });
    meshes.sort((a, b) => {
      const ya = new THREE.Box3().setFromObject(a).getCenter(new THREE.Vector3()).y;
      const yb = new THREE.Box3().setFromObject(b).getCenter(new THREE.Vector3()).y;
      return ya - yb;
    });
    sources = meshes.slice(0, 4);
  }

  if (sources.length < 2) return [];

  // Tag each leg with its local-space XZ position to sort into FL/BL/FR/BR
  const _wp  = new THREE.Vector3();
  const tagged = sources.map(obj => {
    obj.getWorldPosition(_wp);
    const lp = _wp.clone();
    horseMesh.worldToLocal(lp);
    return { obj, x: lp.x, z: lp.z };
  });

  // Split left (neg X) / right (pos X), sort each side front-to-back by Z
  // Horse faces +Z in local space (rotation.y + PI applied at runtime), so higher Z = front
  tagged.sort((a, b) => a.x - b.x);
  const half  = Math.floor(tagged.length / 2);
  const left  = tagged.slice(0, half).sort((a, b) => b.z - a.z); // desc Z → front first
  const right = tagged.slice(half).sort((a, b)  => b.z - a.z);

  // Assign: FL=π/2, BL=0, FR=3π/2, BR=π
  const ordered = [
    { obj: left[0]?.obj,  phase: Math.PI * 0.5 },  // Front-Left
    { obj: left[1]?.obj,  phase: 0              },  // Back-Left
    { obj: right[0]?.obj, phase: Math.PI * 1.5  },  // Front-Right
    { obj: right[1]?.obj, phase: Math.PI        },  // Back-Right
  ].filter(l => l.obj);

  // Fallback: evenly-spaced phases (still a 4-beat walk, just anatomically arbitrary)
  const final = ordered.length === sources.length
    ? ordered
    : sources.map((obj, i) => ({ obj, phase: (Math.PI * 2 * i) / sources.length }));

  return final.map(({ obj, phase }) => ({
    pivot: wrapInPivot(obj),
    legObj: obj,   // ref kept for knee-bend secondary rotation
    phase,
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
    /** Called when a hoof hits the ground on the local player's horse.
     *  Signature: (speed: number, sprint: boolean) => void */
    this.onHoofTouch = null;
    this._init();
  }

  async _init() {
    const template = await loadTemplate();
    let wildIdx = 0;
    for (const spawn of HORSE_SPAWNS) {
      const mesh = template ? template.clone(true) : this._fallbackMesh();
      mesh.position.set(spawn.x, 0, spawn.z);

      const dx = spawn.x - SPAWN_X, dz = spawn.z - SPAWN_Z;
      const isWild = Math.sqrt(dx * dx + dz * dz) > WILD_DIST;
      const variant = isWild ? WILD_VARIANTS[wildIdx++ % WILD_VARIANTS.length] : null;
      const saddleNodes = [];
      const _hsl = { h: 0, s: 0, l: 0 };

      mesh.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        // Match by node name OR by material name (cube015 has Material005/006)
        const matName = (Array.isArray(o.material)
          ? o.material.map(m => m.name).join(' ')
          : o.material?.name ?? '');
        if (SADDLE_PATTERN.test(o.name) || SADDLE_MAT_PATTERN.test(matName)) {
          saddleNodes.push(o);
          if (isWild) o.visible = false;
        }
        if (isWild && variant) {
          o.material = o.material.clone();
          o.material.color.getHSL(_hsl);
          if (_hsl.l >= 0.08) {  // skip near-black parts (hooves, eyes)
            const newH = (_hsl.h + variant.hShift + 1) % 1;
            const newL = Math.min(0.95, _hsl.l * variant.lMult);
            o.material.color.setHSL(newH, _hsl.s, newL);
          }
        }
      });

      this.scene.add(mesh);
      mesh.updateWorldMatrix(true, true);

      // Find head, neck and crin (mane) nodes
      let headNode = null, neckNode = null, crinNode = null;
      mesh.traverse(o => {
        const n = o.name.toLowerCase();
        if (!headNode && /head|cabeza/.test(n))               headNode = o;
        if (!neckNode && /neck|cuello/.test(n))               neckNode = o;
        if (!crinNode && /crin|mane|cube\.012/i.test(o.name)) crinNode = o;
      });

      // Re-parent crin to headNode — it will then nod & rotate with the head
      if (crinNode && headNode && crinNode.parent) {
        crinNode.updateWorldMatrix(true, false);
        const cWP = new THREE.Vector3();
        const cWQ = new THREE.Quaternion();
        const cWS = new THREE.Vector3();
        crinNode.matrixWorld.decompose(cWP, cWQ, cWS);
        crinNode.removeFromParent();
        headNode.add(crinNode);
        headNode.updateWorldMatrix(true, false);
        const headInv = new THREE.Matrix4().copy(headNode.matrixWorld).invert();
        const crinMat = new THREE.Matrix4().compose(cWP, cWQ, cWS);
        crinMat.premultiply(headInv);
        crinMat.decompose(crinNode.position, crinNode.quaternion, crinNode.scale);
      }

      const legs = template ? findLegs(mesh) : [];
      this.horses.set(spawn.id, {
        mesh, legs, riderId: null, saddleNodes, isWild,
        saddled: true,  // todos los caballos arrancan con montura (isWild es solo color)
        x: spawn.x, z: spawn.z,
        walkTime: 0, _prevX: spawn.x, _prevZ: spawn.z, _vx: 0, _vz: 0,
        _sprinting: false,
        _targetRY: mesh.rotation.y,
        _displayRY: mesh.rotation.y,
        _baseY: 0,
        _bobY:  0,
        headNode, neckNode,
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

    for (const [id, horse] of this.horses) {
      const dx = horse.x - horse._prevX;
      const dz = horse.z - horse._prevZ;
      const speed = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 0.001);
      // Store world-space velocity for strafe animation
      horse._vx = dx / Math.max(dt, 0.001);
      horse._vz = dz / Math.max(dt, 0.001);
      // Stop legs as soon as speed drops below threshold — don't keep animating during deceleration
      const moved = horse.riderId !== null && speed > 0.8;
      horse._prevX = horse.x;
      horse._prevZ = horse.z;
      if (moved) horse.walkTime += dt;
      else       horse.walkTime  = 0;
      this._animateLegs(horse, moved, id === this.myHorseId, speed);

      // Smooth horse rotation — shortest path to avoid snapping through 360°
      let ryDiff = horse._targetRY - horse._displayRY;
      while (ryDiff >  Math.PI) ryDiff -= Math.PI * 2;
      while (ryDiff < -Math.PI) ryDiff += Math.PI * 2;
      horse._displayRY += ryDiff * Math.min(1, 5 * dt);
      horse.mesh.rotation.y = horse._displayRY;

      // Apply bob offset on top of base Y
      horse.mesh.position.y = horse._baseY + horse._bobY;
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

    if (nearest !== null) {
      const nh = this.horses.get(nearest);
      if (nh?.saddled) {
        this._mountPrompt.textContent = '[E] Montar  [Q] Quitar montura';
      } else {
        this._mountPrompt.textContent = '[E] Montar';
      }
    }
  }

  _animateLegs(horse, moving, isLocal = false, speed = 0) {
    const sprint = horse._sprinting;
    const freq   = sprint ? WALK_FREQ_SPRINT : WALK_FREQ;
    const amp    = WALK_AMP * (sprint ? 1.35 : 1.0);
    const t      = horse.walkTime;

    if (!moving) {
      // Smoothly return everything to rest
      for (const leg of horse.legs) {
        leg.pivot.rotation.x *= 0.85;
        leg.pivot.rotation.z *= 0.85;
        if (leg.legObj) leg.legObj.rotation.x *= 0.85;
      }
      horse._bobY        *= 0.85;
      horse.mesh.rotation.z *= 0.85;
      if (horse.headNode) horse.headNode.rotation.x *= 0.85;
      if (horse.neckNode) horse.neckNode.rotation.x *= 0.85;
      return;
    }

    // ── Strafe detection ─────────────────────────────────────────────────
    // Project velocity onto horse's forward/right axes.
    // Horse nose direction: since _targetRY = moveAngle + PI, forward = (-sin(ry), -cos(ry))
    const ry = horse._displayRY;
    const fwdX = -Math.sin(ry), fwdZ = -Math.cos(ry);
    const rightX = fwdZ,        rightZ = -fwdX;   // 90° CW of forward in XZ
    const spd = Math.sqrt((horse._vx || 0) ** 2 + (horse._vz || 0) ** 2);
    let forwardRatio = 1, strafeRatio = 0;
    if (spd > 0.5) {
      const nvx = horse._vx / spd, nvz = horse._vz / spd;
      forwardRatio = Math.max(-1, Math.min(1, nvx * fwdX + nvz * fwdZ));
      strafeRatio  = Math.max(-1, Math.min(1, nvx * rightX + nvz * rightZ));
    }

    // ── Leg swing (hip pivot) ────────────────────────────────────────────
    // Asymmetric waveform: faster lift forward, slower push back
    //   forward stroke: sin > 0 region
    //   power stroke:   sin < 0 region (hoof on ground, driving forward)
    for (const leg of horse.legs) {
      const s = Math.sin(freq * t + leg.phase);

      // ── Hoof touchdown detection: sin crosses from + to - ────────────
      // Positive sin = leg lifting; negative sin = leg on ground (power stroke).
      // The exact moment of contact is the zero-crossing going downward.
      const prevS = leg._prevS ?? s;
      if (isLocal && prevS > 0.05 && s <= 0 && this.onHoofTouch) {
        this.onHoofTouch(speed, sprint);
      }
      leg._prevS = s;

      const swing = s > 0 ? s * amp : s * amp * 0.65;
      // Forward swing scaled by forward component, lateral swing by strafe component
      leg.pivot.rotation.x = swing * Math.max(0.08, Math.abs(forwardRatio));
      // Lateral strafe: legs do a sideways shuffle (cosine = 90° phase offset from swing)
      const strafeSwing = Math.cos(freq * t + leg.phase) * amp * 0.55;
      leg.pivot.rotation.z = strafeSwing * strafeRatio;

      // ── Knee flex ─────────────────────────────────────────────────────
      if (leg.legObj) {
        const kneeFlex = Math.max(0, Math.sin(freq * t + leg.phase + 0.55)) * amp * 0.55;
        leg.legObj.rotation.x = -kneeFlex * Math.max(0.08, Math.abs(forwardRatio));
      }
    }

    // ── Body bob (vertical) ──────────────────────────────────────────────
    // Rises twice per stride cycle (one lift per diagonal pair hitting ground)
    const bobAmp = sprint ? 0.07 : 0.045;
    horse._bobY = Math.abs(Math.sin(freq * t)) * bobAmp;

    // ── Body roll (lateral sway) ─────────────────────────────────────────
    horse.mesh.rotation.z = Math.sin(freq * t * 0.5) * (sprint ? 0.04 : 0.025);

    // ── Head / neck nod ──────────────────────────────────────────────────
    const nodAmp = sprint ? 0.10 : 0.06;
    // Head nods opposite to body bob: rises as body falls, dips as body rises
    if (horse.headNode)
      horse.headNode.rotation.x = Math.sin(freq * t + Math.PI * 0.5) * nodAmp;
    if (horse.neckNode)
      horse.neckNode.rotation.x = Math.sin(freq * t + Math.PI * 0.5) * nodAmp * 0.6;
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
    // Mostrar montura solo si el caballo la tiene — no forzar si fue quitada
    horse.saddleNodes?.forEach(n => n.visible = horse.saddled === true);
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

    horse._baseY = 0;
    horse.riderId  = null;
    this.network?.sendDismount(this.myHorseId);
    this.myHorseId = null;
    return { x: landX, z: landZ };
  }

  // ── Animation helpers ───────────────────────────────────────────────────────

  getAnimY() {
    if (!this._anim) return null;
    const t = this._anim.t;
    if (this._anim.type === 'mount') {
      // Smoothstep from startY → SADDLE_HEIGHT, tiny bounce at end
      const ease = t * t * (3 - 2 * t);
      return this._anim.startY + (SADDLE_HEIGHT - this._anim.startY) * ease + Math.sin(t * Math.PI) * 0.25;
    } else {
      // Dismount: arc from SADDLE_HEIGHT → 0
      return (1 - t) * SADDLE_HEIGHT + Math.sin(t * Math.PI) * 0.5;
    }
  }

  /** Posición world del lomo del caballo montado — incluye bob, roll y toda la transformación del mesh. */
  getSaddleWorldPos() {
    if (this.myHorseId === null) return null;
    const horse = this.horses.get(this.myHorseId);
    if (!horse) return null;
    horse.mesh.updateWorldMatrix(true, false);
    return horse.mesh.localToWorld(new THREE.Vector3(0, SADDLE_HEIGHT, 0));
  }

  /** Y del lomo (fallback simple si localToWorld no está disponible). */
  getRiderY() {
    if (this.myHorseId === null) return SADDLE_HEIGHT;
    const horse = this.horses.get(this.myHorseId);
    if (!horse) return SADDLE_HEIGHT;
    return horse._baseY + horse._bobY + SADDLE_HEIGHT;
  }

  /** Roll lateral del caballo montado — para que el player se incline con él. */
  getHorseRoll() {
    if (this.myHorseId === null) return 0;
    const horse = this.horses.get(this.myHorseId);
    return horse?.mesh?.rotation?.z ?? 0;
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
    horse._baseY = jumpY;  // bob applied on top in update() loop
    horse.mesh.position.x = x;
    horse.mesh.position.z = z;
    horse._targetRY = moveAngle + Math.PI;
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
    if (h) h.riderId = riderId;
  }
  onRemoteDismount(horseId) {
    const h = this.horses.get(horseId);
    if (h) { h.riderId = null; h._baseY = 0; }
  }

  onRemoteHorseMoved(horseId, x, z, ry, remotePlayer) {
    const horse = this.horses.get(horseId);
    if (!horse) return;
    horse.x = x; horse.z = z;
    horse._baseY = 0;
    horse.mesh.position.x = x;
    horse.mesh.position.z = z;
    horse._targetRY = ry + Math.PI;
    // Snap remote player model directly to horse — avoids interpolation lag
    if (remotePlayer) remotePlayer.snapTo(x, SADDLE_HEIGHT, z, ry);
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

  // ── Caballo personal ─────────────────────────────────────────────────────────

  /** Asigna determinísticamente un caballo al jugador según su ID. */
  initMyHorse(playerId) {
    let h = 0;
    for (let i = 0; i < playerId.length; i++) h = (Math.imul(h, 31) + playerId.charCodeAt(i)) | 0;
    const idx = Math.abs(h) % HORSE_SPAWNS.length;
    this._myOwnedId = HORSE_SPAWNS[idx].id;
  }

  /** Quita la montura del caballo más cercano (si tiene). Devuelve true si lo hizo. */
  unsaddleHorse(horseId) {
    const horse = this.horses.get(horseId);
    if (!horse || !horse.saddled) return false;
    horse.saddled = false;
    horse.saddleNodes?.forEach(n => n.visible = false);
    this.network?.sendUnsaddle(horseId);
    return true;
  }

  /** Pone la montura en un caballo que no tiene. Devuelve true si lo hizo. */
  saddleHorse(horseId) {
    const horse = this.horses.get(horseId);
    if (!horse || horse.saddled) return false;
    horse.saddled = true;
    horse.saddleNodes?.forEach(n => n.visible = true);
    this.network?.sendSaddle(horseId);
    return true;
  }

  /** Recibido de otro cliente: quitar montura de ese caballo. */
  onRemoteUnsaddle(horseId) {
    const horse = this.horses.get(horseId);
    if (horse) { horse.saddled = false; horse.saddleNodes?.forEach(n => n.visible = false); }
  }

  /** Recibido de otro cliente: poner montura en ese caballo. */
  onRemoteSaddle(horseId) {
    const horse = this.horses.get(horseId);
    if (horse) { horse.saddled = true; horse.saddleNodes?.forEach(n => n.visible = true); }
  }
}
