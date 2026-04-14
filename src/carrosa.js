// ─── Carrosa (carriage) system ───────────────────────────────────────────────
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { findLegs } from './horses.js';

const loader      = new GLTFLoader();
const SCALE       = 8.0;
const MOUNT_R     = 5.0;
const MOUNT_DUR   = 0.45;
const WALK_FREQ   = 6.0;
const WALK_AMP    = 0.45;
const SPEED_MULT  = 1.4;
const SPRINT_MULT = 1.6;

// Group-local offsets after SCALE=8 + car.rotation.y = -π/2
// Transform: x_group = -z_model*S,  z_group = x_model*S,  y_group = y_model*S
// LUGAR CONDUCTOR   model(-0.38, 0.41, -0.12) → group( 0.96, 3.28, -3.04)
// LUGAR ACOMPAÑANTE model(-0.38, 0.41,  0.12) → group(-0.96, 3.28, -3.04)
// LUGAR CABALLO IZQ model( 0.30, 0.33, -0.12) → group( 0.96, 0,     2.40) + fwd offset
// LUGAR CABALLO DER model( 0.30, 0.33,  0.12) → group(-0.96, 0,     2.40) + fwd offset
const OFF_CONDUCTOR   = new THREE.Vector3( 0.96, 3.28, -3.04);
const OFF_ACOMPANANTE = new THREE.Vector3(-0.96, 3.28, -3.04);
const OFF_HORSE_IZQ   = new THREE.Vector3( 0.96, 0.0,   4.5);   // +~2 forward from yoke
const OFF_HORSE_DER   = new THREE.Vector3(-0.96, 0.0,   4.5);

function loadGLB(path) {
  return new Promise(r =>
    loader.load(path, g => r(g), undefined, () => { console.warn('[carrosa] no cargó:', path); r(null); })
  );
}

export class CarrosaSystem {
  constructor(scene, spawnX = 14, spawnZ = -56) {
    this.scene     = scene;
    this.group     = new THREE.Group();
    this._x        = spawnX;
    this._z        = spawnZ;
    this._ry       = 0;
    this._speed    = 0;
    this._walkTime = 0;
    this._wheels   = [];       // mesh objects (RUEDA nodes)
    this._horseLegs = [];      // [{pivot, legObj, phase}] — same format as HorseManager
    this._conducting = false;
    this._nearCarrosa = false;
    this._anim         = null;
    this._mountLandPos = null;
    this._prompt       = this._mkPrompt();

    this.group.position.set(spawnX, 0, spawnZ);
    scene.add(this.group);
    this._load().catch(e => console.warn('[carrosa] error en carga:', e));
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  async _load() {
    const [carGLTF, horseGLTF] = await Promise.all([
      loadGLB('/models/CARROSA.glb'),
      loadGLB('/models/horse.glb'),
    ]);
    if (!carGLTF) return;

    const car = carGLTF.scene;
    car.scale.setScalar(SCALE);
    // -π/2: model +X (horse side / front) → world +Z (Three.js forward)
    car.rotation.y = -Math.PI / 2;

    car.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
      if (/RUEDA/i.test(o.name)) this._wheels.push(o);
    });

    this.group.add(car);
    car.updateWorldMatrix(true, true);

    // Override seat offsets from actual node world positions
    car.traverse(o => {
      const n = o.name;
      if (/LUGAR CONDUCTOR$/i.test(n)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_CONDUCTOR.set(wp.x - this._x, wp.y, wp.z - this._z);
      } else if (/LUGAR ACOMPA/i.test(n)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_ACOMPANANTE.set(wp.x - this._x, wp.y, wp.z - this._z);
      }
      // Horse positions: use node x/z but add forward offset so horses are visually in front
      else if (/LUGAR CABALLO IZQ/i.test(n)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_HORSE_IZQ.set(wp.x - this._x, 0, wp.z - this._z + 2.0);
      } else if (/LUGAR CABALLO DER/i.test(n)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_HORSE_DER.set(wp.x - this._x, 0, wp.z - this._z + 2.0);
      }
    });

    // Attach horse models
    if (horseGLTF) {
      for (const off of [OFF_HORSE_IZQ, OFF_HORSE_DER]) {
        const horseMesh = horseGLTF.scene.clone(true);
        horseMesh.traverse(o => {
          if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });

        // Scale to same height as world horses (≈ 2.8 units)
        horseMesh.updateWorldMatrix(true, true);
        const bbox = new THREE.Box3().setFromObject(horseMesh);
        const h = bbox.max.y - bbox.min.y;
        if (h > 0.01) horseMesh.scale.setScalar(2.8 / h);

        // Ground the horse
        horseMesh.updateWorldMatrix(true, true);
        const bb2 = new THREE.Box3().setFromObject(horseMesh);
        horseMesh.position.set(off.x, -bb2.min.y, off.z);

        // Horses face forward (+Z = same direction as carriage front)
        // The horse GLB faces -Z natively, so π rotation makes it face +Z
        horseMesh.rotation.y = Math.PI;

        this.group.add(horseMesh);

        // Use the same leg-finding logic as HorseManager for identical animation
        horseMesh.updateWorldMatrix(true, true);
        const legs = findLegs(horseMesh);
        for (const leg of legs) this._horseLegs.push(leg);
      }
    }

    console.log('[carrosa] lista. Conductor seat:', OFF_CONDUCTOR.toArray().map(v => v.toFixed(2)));
  }

  // ── Prompt ────────────────────────────────────────────────────────────────

  _mkPrompt() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      z-index:200; background:rgba(0,0,0,0.6); color:#fff;
      padding:8px 20px; border-radius:8px; font-size:14px;
      display:none; pointer-events:none; border:1px solid rgba(255,255,255,0.2);
    `;
    el.textContent = '[E] Subir a la carrosa';
    document.body.appendChild(el);
    return el;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  isConducting()     { return this._conducting; }
  isOnBoard()        { return this._conducting; }
  isMountAnimating() { return this._anim?.type === 'mount'; }
  speedMultiplier(sprinting) { return sprinting ? SPEED_MULT * SPRINT_MULT : SPEED_MULT; }

  /** Y of conductor seat (for player model height) */
  getRiderY() { return OFF_CONDUCTOR.y; }

  /** World XZ of conductor seat — use this to position player model while riding */
  getRiderWorldPos() {
    if (!this._conducting) return null;
    return {
      x: this._seatWorldX(OFF_CONDUCTOR),
      z: this._seatWorldZ(OFF_CONDUCTOR),
    };
  }

  consumeMountLand() {
    const p = this._mountLandPos;
    this._mountLandPos = null;
    return p;
  }

  getMountModelPos() {
    if (!this._anim || this._anim.type !== 'mount') return null;
    const t = _ease(this._anim.t);
    return {
      x: this._anim.fromX + (this._anim.toX - this._anim.fromX) * t,
      z: this._anim.fromZ + (this._anim.toZ - this._anim.fromZ) * t,
    };
  }

  getDismountModelPos(controlsPos) {
    if (!this._anim || this._anim.type !== 'dismount') return null;
    const t = _ease(this._anim.t);
    return {
      x: this._anim.fromX + (controlsPos.x - this._anim.fromX) * t,
      z: this._anim.fromZ + (controlsPos.z - this._anim.fromZ) * t,
    };
  }

  getAnimY() {
    if (!this._anim) return null;
    const t = this._anim.t, ease = _ease(t);
    if (this._anim.type === 'mount') return ease * OFF_CONDUCTOR.y + Math.sin(t * Math.PI) * 0.3;
    return (1 - ease) * OFF_CONDUCTOR.y + Math.sin(t * Math.PI) * 0.5;
  }

  // ── Mount / dismount ──────────────────────────────────────────────────────

  tryMount(_playerId, fromX, fromZ) {
    if (this._conducting) {
      this._conducting = false;
      this._speed = 0;
      const sideAngle = this._ry + Math.PI * 0.5;
      const landX = this._x + Math.sin(sideAngle) * 3;
      const landZ = this._z + Math.cos(sideAngle) * 3;
      const cx = this._seatWorldX(OFF_CONDUCTOR);
      const cz = this._seatWorldZ(OFF_CONDUCTOR);
      this._anim = { type: 'dismount', t: 0, dur: 0.4,
        fromX: cx, fromZ: cz, toX: landX, toZ: landZ };
      return null;
    }
    if (!this._nearCarrosa) return null;
    this._conducting = true;
    const cx = this._seatWorldX(OFF_CONDUCTOR);
    const cz = this._seatWorldZ(OFF_CONDUCTOR);
    this._anim = { type: 'mount', t: 0, dur: MOUNT_DUR,
      fromX: fromX, fromZ: fromZ, toX: cx, toZ: cz };
    return { x: cx, z: cz };
  }

  // ── Per-frame update ──────────────────────────────────────────────────────

  update(playerPos, dt) {
    // Mount animation tick
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount') this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }

    // Proximity prompt
    if (!this._conducting) {
      const dx = this._x - playerPos.x, dz = this._z - playerPos.z;
      this._nearCarrosa = (dx * dx + dz * dz) < MOUNT_R * MOUNT_R;
      this._prompt.style.display = this._nearCarrosa ? 'block' : 'none';
    } else {
      this._nearCarrosa = false;
      this._prompt.style.display = 'none';
    }

    const moving = this._speed > 0.5;
    if (moving) this._walkTime += dt;
    else        this._walkTime  = 0;

    // ── Horse legs — identical to HorseManager._animateLegs ──────────────
    if (!moving) {
      for (const leg of this._horseLegs) {
        leg.pivot.rotation.x *= 0.85;
        leg.pivot.rotation.z *= 0.85;
        if (leg.legObj) leg.legObj.rotation.x *= 0.85;
      }
    } else {
      const t = this._walkTime;
      for (const leg of this._horseLegs) {
        const s = Math.sin(WALK_FREQ * t + leg.phase);
        const swing = s > 0 ? s * WALK_AMP : s * WALK_AMP * 0.65;
        leg.pivot.rotation.x = swing;
        if (leg.legObj) {
          const kneeFlex = Math.max(0, Math.sin(WALK_FREQ * t + leg.phase + 0.55)) * WALK_AMP * 0.55;
          leg.legObj.rotation.x = kneeFlex;
        }
      }
    }

    // ── Wheels — rotate around the carriage's world-space axle (X axis) ──
    if (moving && this._wheels.length) {
      const spin = this._speed * dt * 0.25;
      // Axle direction = group's local X axis in world space
      const axle = new THREE.Vector3(1, 0, 0).applyQuaternion(this.group.quaternion);
      for (const w of this._wheels) w.rotateOnWorldAxis(axle, -spin);
    }
  }

  syncPosition(x, z, moveAngle, speed) {
    this._x = x; this._z = z; this._ry = moveAngle; this._speed = speed;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = moveAngle;
  }

  onRemoteMove(x, z, ry) {
    if (this._conducting) return;
    this._x = x; this._z = z; this._ry = ry;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = ry;
  }

  _seatWorldX(off) { return this._x + off.x * Math.cos(this._ry) - off.z * Math.sin(this._ry); }
  _seatWorldZ(off) { return this._z + off.x * Math.sin(this._ry) + off.z * Math.cos(this._ry); }
}

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
