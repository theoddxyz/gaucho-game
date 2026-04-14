// ─── Carrosa (carriage) system ───────────────────────────────────────────────
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { findLegs } from './horses.js';

const loader      = new GLTFLoader();
const CAR_SCALE   = 7.14;   // 6.8 * 1.05
const MOUNT_R     = 5.0;
const MOUNT_DUR   = 0.45;
const WALK_FREQ   = 6.0;
const WALK_AMP    = 0.45;
const SPEED_MULT  = 1.4;
const SPRINT_MULT = 1.6;
const WHEEL_SPIN  = 4.0;    // rad per world-unit traveled

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
    this._moveDist = 0;      // world-units moved this frame (for wheel spin)
    this._walkTime = 0;
    this._axles      = [];
    this._horseLegs  = [];
    this._conductorNode    = null;
    this._acompananteNode  = null;
    this._conducting  = false;
    this._nearCarrosa = false;
    this._anim        = null;
    this._mountLandPos = null;
    this._prompt      = this._mkPrompt();

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
    car.scale.setScalar(CAR_SCALE);
    car.rotation.y = -Math.PI / 2;   // model +X (horse side = front) → world +Z

    car.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
      const n = o.name;
      if (/eje/i.test(n))       this._axles.push(o);
      if (/conductor/i.test(n)) this._conductorNode   = o;
      if (/acompa/i.test(n))    this._acompananteNode = o;
    });

    this.group.add(car);
    this.group.updateWorldMatrix(false, true);

    // ── Debug: log node structure ────────────────────────────────────────────
    console.log('[carrosa] ejes encontrados:', this._axles.length,
      this._axles.map(a => `${a.name}(hijos:${a.children.map(c=>c.name).join(',')})`));
    if (!this._conductorNode)   console.warn('[carrosa] ¡no encontré CONDUCTOR!');
    if (!this._acompananteNode) console.warn('[carrosa] ¡no encontré ACOMPAÑANTE!');

    // ── Attach horse models ──────────────────────────────────────────────────
    if (horseGLTF) {
      const horseNodes = [];
      car.traverse(o => { if (/caballo/i.test(o.name)) horseNodes.push(o); });
      console.log('[carrosa] nodos caballo:', horseNodes.map(n => n.name));

      for (const node of horseNodes) {
        // Clone at native GLB scale — same as HorseManager does
        const horseMesh = horseGLTF.scene.clone(true);
        horseMesh.traverse(o => {
          if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });

        // Place at LUGAR CABALLO world position, feet on ground (y=0)
        const wp = node.getWorldPosition(new THREE.Vector3());
        horseMesh.position.set(wp.x - this._x, 0, wp.z - this._z);
        horseMesh.rotation.y = Math.PI;   // face forward (+Z)

        this.group.add(horseMesh);
        horseMesh.updateWorldMatrix(true, true);

        const legs = findLegs(horseMesh);
        console.log('[carrosa] patas en caballo:', legs.length);
        for (const leg of legs) this._horseLegs.push(leg);
      }
    }

    console.log('[carrosa] lista. Conductor:', this._conductorNode ? 'OK' : 'NO',
      '| Acompañante:', this._acompananteNode ? 'OK' : 'NO',
      '| Ejes:', this._axles.length,
      '| Patas:', this._horseLegs.length);
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

  getRiderY() {
    if (!this._conductorNode) return 3.0;
    return this._conductorNode.getWorldPosition(new THREE.Vector3()).y;
  }

  getRiderWorldPos() {
    if (!this._conductorNode || !this._conducting) return null;
    const wp = this._conductorNode.getWorldPosition(new THREE.Vector3());
    return { x: wp.x, z: wp.z };
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
    const seatY = this.getRiderY();
    const t = this._anim.t, ease = _ease(t);
    if (this._anim.type === 'mount') return ease * seatY + Math.sin(t * Math.PI) * 0.3;
    return (1 - ease) * seatY + Math.sin(t * Math.PI) * 0.5;
  }

  // ── Mount / dismount ──────────────────────────────────────────────────────

  tryMount(_playerId, fromX, fromZ) {
    if (this._conducting) {
      this._conducting = false;
      this._speed = 0;
      const cx = this._conductorNode
        ? this._conductorNode.getWorldPosition(new THREE.Vector3()).x : this._x;
      const cz = this._conductorNode
        ? this._conductorNode.getWorldPosition(new THREE.Vector3()).z : this._z;
      const sideAngle = this._ry + Math.PI * 0.5;
      this._anim = { type: 'dismount', t: 0, dur: 0.4,
        fromX: cx, fromZ: cz,
        toX: this._x + Math.sin(sideAngle) * 3,
        toZ: this._z + Math.cos(sideAngle) * 3 };
      return null;
    }
    if (!this._nearCarrosa) return null;

    this._conducting = true;
    const wp = this._conductorNode
      ? this._conductorNode.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3(this._x, 0, this._z);
    this._anim = { type: 'mount', t: 0, dur: MOUNT_DUR,
      fromX: fromX, fromZ: fromZ, toX: wp.x, toZ: wp.z };
    return { x: wp.x, z: wp.z };
  }

  // ── Per-frame update ──────────────────────────────────────────────────────

  update(playerPos, dt) {
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount')
          this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }

    if (!this._conducting) {
      const dx = this._x - playerPos.x, dz = this._z - playerPos.z;
      this._nearCarrosa = (dx * dx + dz * dz) < MOUNT_R * MOUNT_R;
      this._prompt.style.display = this._nearCarrosa ? 'block' : 'none';
    } else {
      this._nearCarrosa = false;
      this._prompt.style.display = 'none';
    }

    const moving = this._speed > 0.1;
    if (moving) this._walkTime += dt;
    else        this._walkTime  = 0;

    // ── Horse legs ────────────────────────────────────────────────────────
    if (!moving) {
      for (const leg of this._horseLegs) {
        leg.pivot.rotation.x *= 0.85;
        if (leg.legObj) leg.legObj.rotation.x *= 0.85;
      }
    } else {
      for (const leg of this._horseLegs) {
        const s = Math.sin(WALK_FREQ * this._walkTime + leg.phase);
        leg.pivot.rotation.x = (s > 0 ? s : s * 0.65) * WALK_AMP;
        if (leg.legObj) {
          leg.legObj.rotation.x = Math.max(0,
            Math.sin(WALK_FREQ * this._walkTime + leg.phase + 0.55)) * WALK_AMP * 0.55;
        }
      }
    }

    // ── Wheels: spin axle nodes on local Z by actual distance moved ───────
    if (this._moveDist > 0.0005 && this._axles.length) {
      const spin = this._moveDist * WHEEL_SPIN;
      for (const axle of this._axles) axle.rotation.z -= spin;
    }
    this._moveDist = 0;
  }

  syncPosition(x, z, moveAngle, speed) {
    // Compute actual distance moved (used for wheel spin — doesn't depend on velocity)
    const dx = x - this._x, dz = z - this._z;
    this._moveDist = Math.sqrt(dx * dx + dz * dz);

    this._x = x; this._z = z; this._ry = moveAngle; this._speed = speed;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = moveAngle;
    this.group.updateWorldMatrix(false, true);
  }

  onRemoteMove(x, z, ry) {
    if (this._conducting) return;
    const dx = x - this._x, dz = z - this._z;
    this._moveDist = Math.sqrt(dx * dx + dz * dz);
    this._x = x; this._z = z; this._ry = ry;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = ry;
    this.group.updateWorldMatrix(false, true);
  }
}

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
