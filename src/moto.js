// --- Moto (Motorcycle) system ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MOUNT_RADIUS   = 4.0;
const SPEED_MULT     = 2.4;    // much faster than horse (1.4x)
const SPRINT_MULT    = 1.35;   // total: 2.4 × 1.35 ≈ 3.2x with sprint
const RIDER_HEIGHT   = 1.05;   // Y of rider hip when seated on moto
const MOUNT_DUR      = 0.25;
const DISMOUNT_DUR   = 0.35;
const SIDE_DIST      = 2.0;    // dismount landing offset
const LEAN_MAX       = 0.32;   // max roll in radians (≈18°)
const LEAN_SPEED     = 7;      // convergence rate
const WHEEL_SPIN     = 3.5;    // wheel rotation speed multiplier

// Node name patterns for GLB traversal
const WHEEL_RE  = /wheel|rueda|tire|tyre|rodillo|roda/i;
const FRONT_RE  = /front|delantera|fwd|f_wheel|rueda.*front/i;
const SEAT_RE   = /seat|asiento|rider|driver|conductor|silla/i;
const BODY_RE   = /body|chasis|frame|tanque|tank|fuselaje|chassis/i;

export const MOTO_SPAWNS = [
  { id: 0, x:  12, z: -58 },  // cerca del rancho spawn
  { id: 1, x: -50, z:  55 },  // pampa oeste
];

let _template = null;

function _loadTemplate() {
  if (_template) return _template;
  _template = new Promise(resolve => {
    new GLTFLoader().load('/models/MOTO.glb', g => {
      resolve(g.scene);
    }, undefined, () => {
      console.warn('[Moto] MOTO.glb no cargó — usando fallback procedural');
      resolve(null);
    });
  });
  return _template;
}

// ── Fallback procedural moto ─────────────────────────────────────────────────
function _buildFallback() {
  const g = new THREE.Group();

  // Chasis
  const bodyGeo = new THREE.BoxGeometry(0.42, 0.48, 1.35);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.75, roughness: 0.25 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.72;
  body.castShadow = true;
  g.add(body);

  // Depósito / carenado
  const tankGeo = new THREE.BoxGeometry(0.36, 0.22, 0.55);
  const tank = new THREE.Mesh(tankGeo, bodyMat);
  tank.position.set(0, 1.0, -0.15);
  g.add(tank);

  // Manillar
  const handleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.15 });
  const handle = new THREE.Mesh(handleGeo, metalMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0, 1.12, -0.56);
  g.add(handle);

  // Ruedas
  const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.15, 22);
  const wMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.6, roughness: 0.6 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.95, roughness: 0.1 });

  const wheels = [];
  [[0, 0.32,  0.58], [0, 0.32, -0.58]].forEach(([x, y, z], idx) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(x, y, z);
    const tire = new THREE.Mesh(wGeo, wMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wGroup.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16), rimMat);
    rim.rotation.z = Math.PI / 2;
    wGroup.add(rim);
    g.add(wGroup);
    wheels.push(wGroup);
  });

  // Silenciador
  const exhaGeo = new THREE.CylinderGeometry(0.04, 0.055, 0.55, 10);
  const exha = new THREE.Mesh(exhaGeo, metalMat);
  exha.rotation.z = Math.PI / 2;
  exha.position.set(0.25, 0.48, 0.22);
  g.add(exha);

  g._fallbackWheels = wheels;
  g._fallbackFront  = wheels[1]; // index 1 = front (-z)
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
export class MotoManager {
  constructor(scene, network) {
    this.scene    = scene;
    this.network  = network;
    this.motos    = new Map();        // id → moto data object
    this.myMotoId = null;
    this._nearestMotoId = null;
    this._mountPrompt   = this._createPrompt();
    this._anim          = null;       // mount/dismount animation state
    this._mountLandPos  = null;       // consumed by main.js after mount finishes
    this._lean          = 0;          // current smoothed lean angle
    this._prevAngle     = null;       // previous moveAngle for turn-rate calc
    this._init();
  }

  async _init() {
    const tpl = await _loadTemplate();

    for (const spawn of MOTO_SPAWNS) {
      let mesh, wheels = [], frontWheel = null;

      if (tpl) {
        mesh = tpl.clone(true);
        mesh.traverse(o => {
          if (o.isMesh) {
            o.castShadow = o.receiveShadow = true;
            if (WHEEL_RE.test(o.name)) {
              wheels.push(o);
              if (FRONT_RE.test(o.name)) frontWheel = o;
            }
          }
        });
        // Heuristic fallback: grab objects named "Rueda*" or "Empty*Wheel" or similar
        if (wheels.length === 0) {
          mesh.traverse(o => {
            const n = o.name.toLowerCase();
            if ((n.includes('rueda') || n.includes('wheel') || n.includes('tire')) && o.isMesh) {
              wheels.push(o);
            }
          });
        }
        // Last resort: find any 2 meshes that look like wheels by their bounding box
        if (wheels.length === 0) {
          const candidates = [];
          mesh.traverse(o => {
            if (!o.isMesh) return;
            const box = new THREE.Box3().setFromObject(o);
            const size = box.getSize(new THREE.Vector3());
            // Wheels are roughly square in cross-section and thinner than tall
            if (Math.abs(size.x - size.y) < size.y * 0.5 && size.z < size.x * 0.6) {
              candidates.push(o);
            }
          });
          wheels = candidates.slice(0, 2);
          frontWheel = wheels[0] || null;
        }
        if (!frontWheel && wheels.length > 0) frontWheel = wheels[0];
      } else {
        mesh = _buildFallback();
        wheels = mesh._fallbackWheels || [];
        frontWheel = mesh._fallbackFront || null;
      }

      // Scale up the model if needed (MOTO.glb might be in cm not m)
      mesh.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(mesh);
      const sz  = box.getSize(new THREE.Vector3());
      // If the bounding box height is way off (e.g. 200 = cm scale), normalize to ~1.2m tall
      if (sz.y > 10) {
        const scl = 1.2 / sz.y;
        mesh.scale.setScalar(scl);
      } else if (sz.y < 0.1) {
        mesh.scale.setScalar(1 / sz.y);
      }

      mesh.position.set(spawn.x, 0, spawn.z);
      this.scene.add(mesh);

      this.motos.set(spawn.id, {
        mesh,
        wheels,
        frontWheel,
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

  // ── Public helpers ───────────────────────────────────────────────────────────

  isMounted()        { return this.myMotoId !== null; }
  isMountAnimating() { return this._anim?.type === 'mount'; }

  speedMultiplier(sprinting) {
    return SPEED_MULT * (sprinting ? SPRINT_MULT : 1.0);
  }

  getRiderY() {
    const moto = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    return moto ? moto.mesh.position.y + RIDER_HEIGHT : RIDER_HEIGHT;
  }

  /** main.js consumes this once to snap controls position after mount arc */
  consumeMountLand() {
    const p = this._mountLandPos;
    this._mountLandPos = null;
    return p;
  }

  // ── Per-frame update ─────────────────────────────────────────────────────────

  update(playerPos, dt) {
    // ── Tick mount / dismount animation ──────────────────────────────────────
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount') {
          this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        }
        this._anim = null;
      }
    }

    // ── Animate each moto ────────────────────────────────────────────────────
    for (const [, moto] of this.motos) {
      // Smooth rotation
      let diff = moto._targetRY - moto._displayRY;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      moto._displayRY += diff * Math.min(1, 8 * dt);
      moto.mesh.rotation.y = moto._displayRY;

      // Lean (body roll)
      moto.mesh.rotation.z = -moto._lean;

      // Wheel rotation (proportional to travel speed)
      const dx  = moto.x - moto._prevX;
      const dz  = moto.z - moto._prevZ;
      const spd = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 0.001);
      moto._wheelRot += spd * dt * WHEEL_SPIN;
      for (const w of moto.wheels) {
        w.rotation.x = moto._wheelRot;
      }

      // Front wheel steering: turn toward lean direction
      if (moto.frontWheel) {
        moto.frontWheel.rotation.y = -moto._lean * 1.2;
      }

      moto._prevX = moto.x;
      moto._prevZ = moto.z;
    }

    // ── Find nearest available moto ──────────────────────────────────────────
    if (this.myMotoId === null) {
      let nearest = null, nearestDist = MOUNT_RADIUS;
      for (const [id, moto] of this.motos) {
        if (moto.riderId !== null) continue;
        const dx = moto.x - playerPos.x;
        const dz = moto.z - playerPos.z;
        const d  = Math.sqrt(dx * dx + dz * dz);
        if (d < nearestDist) { nearestDist = d; nearest = id; }
      }
      this._mountPrompt.style.display = nearest !== null ? 'block' : 'none';
      this._nearestMotoId = nearest;
    } else {
      this._mountPrompt.style.display = 'none';
    }
  }

  /** Called every frame while mounted: snap moto mesh to rider position */
  syncRiderPosition(x, z, moveAngle, sprinting) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;

    // Compute lean from turn rate (change in facing angle)
    if (this._prevAngle !== null) {
      let angleDelta = moveAngle - this._prevAngle;
      while (angleDelta >  Math.PI) angleDelta -= Math.PI * 2;
      while (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
      // Multiply by speed (faster turn = more lean)
      const dx = x - moto.x, dz = z - moto.z;
      const spd = Math.sqrt(dx * dx + dz * dz) / (1 / 60);
      const targetLean = Math.max(-LEAN_MAX, Math.min(LEAN_MAX, angleDelta * Math.max(1, spd * 0.4)));
      moto._lean += (targetLean - moto._lean) * Math.min(1, LEAN_SPEED / 60);
    }
    this._prevAngle = moveAngle;

    moto.x = x;
    moto.z = z;
    moto.mesh.position.set(x, 0, z);
    moto._targetRY = moveAngle + Math.PI;
  }

  // ── Mount / dismount ──────────────────────────────────────────────────────

  tryMount(playerId, startY, fromX, fromZ) {
    if (this.myMotoId !== null) {
      // Already mounted → dismount
      this._dismount(playerId);
      return null;
    }
    if (this._nearestMotoId === null) return null;
    return this._mount(this._nearestMotoId, playerId, startY, fromX, fromZ);
  }

  _mount(motoId, playerId, startY, fromX, fromZ) {
    const moto = this.motos.get(motoId);
    if (!moto || moto.riderId !== null) return null;

    moto.riderId = playerId;
    this.myMotoId = motoId;
    this._nearestMotoId = null;
    this._lean = 0;
    moto._lean = 0;
    this._prevAngle = null;

    this._anim = {
      type: 'mount', t: 0,
      dur:    startY > 0.5 ? 0.18 : MOUNT_DUR,
      startY, fromX, fromZ,
      toX: moto.x, toZ: moto.z,
    };
    this.network.sendMotoMount(motoId);
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
    moto.riderId = null;
    this.myMotoId = null;
    this._lean = 0;
    this._prevAngle = null;
  }

  // ── Animation position helpers (called by main.js for player model arc) ─────

  getAnimY() {
    if (!this._anim) return 0;
    const ts = this._anim.t * this._anim.t * (3 - 2 * this._anim.t); // smoothstep
    if (this._anim.type === 'mount') {
      const fromY = this._anim.startY, toY = RIDER_HEIGHT;
      return fromY + (toY - fromY) * ts + Math.sin(this._anim.t * Math.PI) * 0.5;
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

  // ── Remote player events ──────────────────────────────────────────────────

  onRemoteMount(motoId, riderId) {
    const moto = this.motos.get(motoId);
    if (moto) moto.riderId = riderId;
  }

  onRemoteDismount(motoId) {
    const moto = this.motos.get(motoId);
    if (moto) { moto.riderId = null; moto._lean = 0; }
  }

  onRemoteMoved(motoId, x, z, ry) {
    const moto = this.motos.get(motoId);
    if (!moto) return;
    moto.x = x; moto.z = z;
    moto.mesh.position.set(x, 0, z);
    moto._targetRY = ry;
  }
}
