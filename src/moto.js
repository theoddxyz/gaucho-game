// --- Moto (Motorcycle) system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MOUNT_RADIUS   = 4.0;
const SPEED_MULT     = 2.4;
const SPRINT_MULT    = 1.35;
const RIDER_HEIGHT   = 0.82;   // seat height above ground (m)
const MOUNT_DUR      = 0.25;
const DISMOUNT_DUR   = 0.35;
const SIDE_DIST      = 2.0;
const LEAN_MAX       = 0.32;   // ≈18°
const LEAN_SPEED     = 7;
const WHEEL_SPIN     = 3.2;    // rad per (m/s)

export const MOTO_SPAWNS = [
  { id: 0, x:  12, z: -58 },
  { id: 1, x: -50, z:  55 },
];

// ── GLB loader — collect ALL scenes into one group ────────────────────────────
let _tplPromise = null;

function _loadTemplate() {
  if (_tplPromise) return _tplPromise;
  _tplPromise = new Promise(resolve => {
    new GLTFLoader().load('/models/MOTO.glb', gltf => {
      const combined = new THREE.Group();
      // Load every scene (the GLB has body/wheels split across 3 scenes)
      (gltf.scenes || [gltf.scene]).forEach(s => {
        combined.add(s);
      });
      resolve(combined);
    }, undefined, err => {
      console.warn('[Moto] MOTO.glb no cargó, fallback procedural', err);
      resolve(null);
    });
  });
  return _tplPromise;
}

// ── Fallback procedural motorcycle (faces −Z so inner correction isn't needed) ─
function _buildFallback() {
  const root = new THREE.Group();

  const redMat  = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.75, roughness: 0.25 });
  const metMat  = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9,  roughness: 0.15 });
  const blkMat  = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.6,  roughness: 0.6  });
  const rimMat  = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.95, roughness: 0.1  });

  // Body (length along Z = forward)
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 1.35), redMat);
  body.position.y = 0.72; body.castShadow = true; root.add(body);

  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.55), redMat);
  tank.position.set(0, 1.0, -0.15); root.add(tank);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), metMat);
  handle.rotation.z = Math.PI / 2; handle.position.set(0, 1.12, -0.56); root.add(handle);

  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 0.55, 10), metMat);
  exhaust.rotation.x = Math.PI / 2; exhaust.position.set(0.25, 0.48, 0.22); root.add(exhaust);

  // Wheels — pivot group at axle center, tire rotates on X axis (axle along X)
  const wheels = [];
  const frontGroup = new THREE.Group();
  const rearGroup  = new THREE.Group();
  [[rearGroup, 0.58], [frontGroup, -0.58]].forEach(([wg, z]) => {
    wg.position.set(0, 0.32, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.15, 22), blkMat);
    tire.rotation.z = Math.PI / 2; tire.castShadow = true; wg.add(tire);
    const rim  = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16), rimMat);
    rim.rotation.z = Math.PI / 2; wg.add(rim);
    root.add(wg); wheels.push(wg);
  });

  root._fbWheels = wheels;
  root._fbFront  = frontGroup;
  return root;
}

// ── Reparent a mesh so its pivot is at the geometric centre ───────────────────
// Returns a new Group whose origin = bbox centre; the mesh is its child.
function _centeredPivot(node) {
  node.updateWorldMatrix(true, false);
  node.geometry.computeBoundingBox();

  // Bounding box centre in LOCAL geometry space
  const localCtr = new THREE.Vector3();
  node.geometry.boundingBox.getCenter(localCtr);

  // World-space centre
  const worldCtr = localCtr.clone().applyMatrix4(node.matrixWorld);

  // Pivot in the node's parent local space
  const pivot = new THREE.Group();
  if (node.parent) {
    const inv = node.parent.matrixWorld.clone().invert();
    pivot.position.copy(worldCtr.clone().applyMatrix4(inv));
  } else {
    pivot.position.copy(worldCtr);
  }

  const parent = node.parent;
  parent.remove(node);
  parent.add(pivot);

  // attach() moves node into pivot while preserving world transform
  pivot.attach(node);
  return pivot;
}

// ─────────────────────────────────────────────────────────────────────────────
export class MotoManager {
  constructor(scene, network) {
    this.scene    = scene;
    this.network  = network;
    this.motos    = new Map();
    this.myMotoId = null;
    this._nearestId    = null;
    this._mountPrompt  = this._createPrompt();
    this._anim         = null;
    this._mountLandPos = null;
    this._lean         = 0;
    this._prevAngle    = null;
    this._init();
  }

  async _init() {
    const tpl = await _loadTemplate();

    for (const spawn of MOTO_SPAWNS) {
      // ── Outer group: position + heading rotation controlled by game ──────────
      const outer = new THREE.Group();

      let wheels = [], frontWheel = null;
      let isFallback = false;

      if (tpl) {
        // ── Inner group: corrects model orientation (+X-facing → −Z-facing) ───
        const inner = new THREE.Group();
        inner.rotation.y = Math.PI / 2;   // GLB front is at −X; rotate so front = −Z
        outer.add(inner);

        const clone = tpl.clone(true);
        clone.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
        inner.add(clone);

        // Force matrix update so we can compute world-space positions
        outer.updateWorldMatrix(false, true);

        // ── Find wheel nodes (ANY object whose name contains 'rueda') ─────────
        const rawWheels = [];
        clone.traverse(o => {
          const n = o.name.toLowerCase();
          if (n.includes('rueda')) rawWheels.push(o);
        });

        // ── Create centered pivots for each wheel mesh ────────────────────────
        for (const w of rawWheels) {
          if (!w.geometry) continue;   // skip empties
          const pivot = _centeredPivot(w);
          wheels.push(pivot);
          if (w.name.toLowerCase().includes('delantera') ||
              w.name.toLowerCase().includes('front')) {
            frontWheel = pivot;
          }
        }
        if (!frontWheel && wheels.length > 0) frontWheel = wheels[0];

        // ── Auto-scale: normalise to ~2m long motorcycle ──────────────────────
        outer.updateWorldMatrix(false, true);
        const box = new THREE.Box3().setFromObject(inner);
        const sz  = box.getSize(new THREE.Vector3());
        const longest = Math.max(sz.x, sz.y, sz.z);
        if (longest > 6 || longest < 0.5) {
          const scl = 2.0 / longest;
          inner.scale.setScalar(scl);
        }

      } else {
        // Procedural fallback
        isFallback = true;
        const fb = _buildFallback();
        outer.add(fb);
        wheels    = fb._fbWheels;
        frontWheel = fb._fbFront;
      }

      outer.position.set(spawn.x, 0, spawn.z);
      this.scene.add(outer);

      this.motos.set(spawn.id, {
        mesh: outer,
        wheels,
        frontWheel,
        isFallback,
        riderId:    null,
        x:          spawn.x,
        z:          spawn.z,
        _targetRY:  0,
        _displayRY: 0,
        _lean:      0,
        _wheelRot:  0,
        _prevX:     spawn.x,
        _prevZ:     spawn.z,
      });
    }
  }

  _createPrompt() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      z-index:200; background:rgba(0,0,0,0.72); color:#fff;
      padding:8px 22px; border-radius:8px; font-size:14px; letter-spacing:0.04em;
      display:none; pointer-events:none; border:1px solid rgba(220,60,40,0.6);
    `;
    el.textContent = '[E] Subir a la moto';
    document.body.appendChild(el);
    return el;
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  isMounted()        { return this.myMotoId !== null; }
  isMountAnimating() { return this._anim?.type === 'mount'; }
  speedMultiplier(sprinting) { return SPEED_MULT * (sprinting ? SPRINT_MULT : 1.0); }

  getRiderY() {
    const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    return m ? m.mesh.position.y + RIDER_HEIGHT : RIDER_HEIGHT;
  }

  consumeMountLand() {
    const p = this._mountLandPos; this._mountLandPos = null; return p;
  }

  // ── Per-frame update ─────────────────────────────────────────────────────────

  update(playerPos, dt) {
    // Tick animation
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount')
          this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }

    for (const [, moto] of this.motos) {
      // Smooth heading rotation
      let diff = moto._targetRY - moto._displayRY;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      moto._displayRY += diff * Math.min(1, 8 * dt);
      moto.mesh.rotation.y = moto._displayRY;

      // Lean (body tilt)
      moto.mesh.rotation.z = -moto._lean;

      // Wheel spin proportional to distance travelled
      const dx  = moto.x - moto._prevX;
      const dz  = moto.z - moto._prevZ;
      const spd = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 0.001);
      moto._wheelRot += spd * dt * WHEEL_SPIN;

      for (const w of moto.wheels) {
        if (moto.isFallback) {
          // Fallback: wheel group's X axis = axle direction (cylinder lies along X)
          w.rotation.x = moto._wheelRot;
        } else {
          // GLB: axle is along the wheel pivot's local Z axis (moto faces −X in GLB space)
          w.rotation.z = moto._wheelRot;
        }
      }

      // Front wheel steering
      if (moto.frontWheel) {
        if (moto.isFallback) {
          moto.frontWheel.rotation.y = -moto._lean * 1.2;
        } else {
          moto.frontWheel.rotation.y = -moto._lean * 1.2;
        }
      }

      moto._prevX = moto.x;
      moto._prevZ = moto.z;
    }

    // Nearest free moto prompt
    if (this.myMotoId === null) {
      let nearest = null, bestD = MOUNT_RADIUS;
      for (const [id, moto] of this.motos) {
        if (moto.riderId !== null) continue;
        const dx = moto.x - playerPos.x, dz = moto.z - playerPos.z;
        const d  = Math.sqrt(dx * dx + dz * dz);
        if (d < bestD) { bestD = d; nearest = id; }
      }
      this._mountPrompt.style.display = nearest !== null ? 'block' : 'none';
      this._nearestId = nearest;
    } else {
      this._mountPrompt.style.display = 'none';
    }
  }

  /** Drive moto to player position; compute lean from turn rate */
  syncRiderPosition(x, z, moveAngle, sprinting) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;

    if (this._prevAngle !== null) {
      let delta = moveAngle - this._prevAngle;
      while (delta >  Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      const dx = x - moto.x, dz = z - moto.z;
      const spd = Math.sqrt(dx * dx + dz * dz) * 60; // approx m/s at 60fps
      const targetLean = Math.max(-LEAN_MAX, Math.min(LEAN_MAX,
        delta * Math.max(1, spd * 0.4)));
      moto._lean += (targetLean - moto._lean) * Math.min(1, LEAN_SPEED / 60);
    }
    this._prevAngle = moveAngle;

    moto.x = x; moto.z = z;
    moto.mesh.position.set(x, 0, z);
    // Same convention as horse: _targetRY = moveAngle + PI
    moto._targetRY = moveAngle + Math.PI;
  }

  // ── Mount / dismount ─────────────────────────────────────────────────────────

  tryMount(playerId, startY, fromX, fromZ) {
    if (this.myMotoId !== null) { this._dismount(playerId); return null; }
    if (this._nearestId === null) return null;
    return this._mount(this._nearestId, playerId, startY, fromX, fromZ);
  }

  _mount(id, playerId, startY, fromX, fromZ) {
    const moto = this.motos.get(id);
    if (!moto || moto.riderId !== null) return null;
    moto.riderId  = playerId;
    this.myMotoId = id;
    this._nearestId  = null;
    this._lean = moto._lean = 0;
    this._prevAngle = null;
    this._anim = {
      type: 'mount', t: 0,
      dur:   startY > 0.5 ? 0.18 : MOUNT_DUR,
      startY, fromX, fromZ,
      toX: moto.x, toZ: moto.z,
    };
    this.network.sendMotoMount(id);
    return { x: moto.x, z: moto.z };
  }

  _dismount(playerId) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;
    const ry   = moto._displayRY;
    const sideX = moto.x + Math.sin(ry + Math.PI / 2) * SIDE_DIST;
    const sideZ = moto.z + Math.cos(ry + Math.PI / 2) * SIDE_DIST;
    this._anim = {
      type: 'dismount', t: 0, dur: DISMOUNT_DUR,
      fromX: moto.x, fromZ: moto.z,
      toX: sideX, toZ: sideZ,
    };
    this.network.sendMotoDismount(this.myMotoId);
    moto.riderId  = null;
    this.myMotoId = null;
    this._lean    = 0;
    this._prevAngle = null;
  }

  // ── Animation helpers for main.js player model arc ───────────────────────────

  getAnimY() {
    if (!this._anim) return null;
    const ts = this._anim.t * this._anim.t * (3 - 2 * this._anim.t);
    if (this._anim.type === 'mount') {
      return this._anim.startY + (RIDER_HEIGHT - this._anim.startY) * ts
             + Math.sin(this._anim.t * Math.PI) * 0.4;
    }
    return RIDER_HEIGHT * (1 - ts);
  }

  getMountModelPos() {
    if (!this._anim) return null;
    const ts = this._anim.t * this._anim.t * (3 - 2 * this._anim.t);
    return {
      x: this._anim.fromX + (this._anim.toX - this._anim.fromX) * ts,
      z: this._anim.fromZ + (this._anim.toZ - this._anim.fromZ) * ts,
    };
  }

  getDismountModelPos() {
    if (!this._anim || this._anim.type !== 'dismount') return null;
    return {
      x: this._anim.fromX + (this._anim.toX - this._anim.fromX) * this._anim.t,
      z: this._anim.fromZ + (this._anim.toZ - this._anim.fromZ) * this._anim.t,
    };
  }

  // ── Remote events ────────────────────────────────────────────────────────────

  onRemoteMount(motoId, riderId) {
    const m = this.motos.get(motoId);
    if (m) m.riderId = riderId;
  }

  onRemoteDismount(motoId) {
    const m = this.motos.get(motoId);
    if (m) { m.riderId = null; m._lean = 0; }
  }

  onRemoteMoved(motoId, x, z, ry) {
    const m = this.motos.get(motoId);
    if (!m) return;
    m.x = x; m.z = z;
    m.mesh.position.set(x, 0, z);
    m._targetRY = ry + Math.PI;
  }
}
