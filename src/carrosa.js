// ─── Carrosa (carriage) system ───────────────────────────────────────────────
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader      = new GLTFLoader();
const SCALE       = 5.0;
const MOUNT_R     = 5.0;
const MOUNT_DUR   = 0.45;
const SADDLE_H    = 2.05;   // conductor seat Y in group-local space (after scale + rot)
const WALK_FREQ   = 4.5;
const WALK_AMP    = 0.38;
const SPEED_MULT  = 1.4;
const SPRINT_MULT = 1.6;

// Precomputed group-local offsets after SCALE=5 + car.rotation.y=π/2:
//   group.x = -model.z * S,  group.z = model.x * S,  group.y = model.y * S
const OFF_CONDUCTOR   = new THREE.Vector3( 0.6, 2.05, -1.9);  // LUGAR CONDUCTOR
const OFF_ACOMPANANTE = new THREE.Vector3(-0.6, 2.05, -1.9);  // LUGAR ACOMPAÑANTE
const OFF_HORSE_IZQ   = new THREE.Vector3( 0.6, 0.0,   1.5);  // LUGAR CABALLO IZQUIERDA
const OFF_HORSE_DER   = new THREE.Vector3(-0.6, 0.0,   1.5);  // LUGAR CABALLO DERECHA

function loadGLB(path) {
  return new Promise(r =>
    loader.load(path, g => r(g), undefined, () => { console.warn('[carrosa] no cargó:', path); r(null); })
  );
}

const LEG_PAT  = /leg|pata|pierna|hoof|pezuña/i;
const SKIP_PAT = /torso|body|head|neck|mane|tail|saddle|ear|eye|nose|crin|cola/i;

function findLegs(mesh) {
  const found = [];
  mesh.traverse(o => {
    if (o.isMesh && LEG_PAT.test(o.name) && !SKIP_PAT.test(o.name)) found.push(o);
  });
  if (found.length >= 2) return found.slice(0, 4).map((obj, i) => ({ obj, phase: (i / found.length) * Math.PI * 2 }));
  // fallback: lowest meshes
  const all = [];
  mesh.traverse(o => { if (o.isMesh && !SKIP_PAT.test(o.name)) all.push(o); });
  all.sort((a, b) => {
    const ya = new THREE.Box3().setFromObject(a).getCenter(new THREE.Vector3()).y;
    const yb = new THREE.Box3().setFromObject(b).getCenter(new THREE.Vector3()).y;
    return ya - yb;
  });
  return all.slice(0, 4).map((obj, i) => ({ obj, phase: (i / 4) * Math.PI * 2 }));
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
    this._wheels   = [];      // mesh objects for wheel spin
    this._horseLegs = [];     // [{obj, phase}] for leg animation
    this._conducting = false;
    this._nearCarrosa = false;
    this._anim        = null; // {type, t, dur, fromX, fromZ, toX, toZ}
    this._mountLandPos = null;
    this._prompt      = this._mkPrompt();

    this.group.position.set(spawnX, 0, spawnZ);
    scene.add(this.group);
    // Load async — errors are caught, never block game init
    this._load().catch(e => console.warn('[carrosa] error en _load:', e));
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
    // Rotate so horse-side (model +X) faces Three.js +Z (forward)
    car.rotation.y = Math.PI / 2;

    // Find wheels — the GLB already has ruedas, ejes, etc. we just spin them
    car.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
      if (/RUEDA/i.test(o.name)) this._wheels.push(o);
    });

    this.group.add(car);
    car.updateWorldMatrix(true, true);

    // Override offsets from actual node positions if available
    car.traverse(o => {
      if (/LUGAR CONDUCTOR$/i.test(o.name)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_CONDUCTOR.set(wp.x - this._x, wp.y, wp.z - this._z);
      } else if (/LUGAR ACOMPA/i.test(o.name)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_ACOMPANANTE.set(wp.x - this._x, wp.y, wp.z - this._z);
      } else if (/LUGAR CABALLO IZQ/i.test(o.name)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_HORSE_IZQ.set(wp.x - this._x, 0, wp.z - this._z);
      } else if (/LUGAR CABALLO DER/i.test(o.name)) {
        const wp = o.getWorldPosition(new THREE.Vector3());
        OFF_HORSE_DER.set(wp.x - this._x, 0, wp.z - this._z);
      }
    });

    // Attach horse models at LUGAR CABALLO positions
    if (horseGLTF) {
      for (const off of [OFF_HORSE_IZQ, OFF_HORSE_DER]) {
        const horseMesh = horseGLTF.scene.clone(true);
        horseMesh.traverse(o => {
          if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });

        // Scale horse ~2.2 units tall
        horseMesh.updateWorldMatrix(true, true);
        const bbox = new THREE.Box3().setFromObject(horseMesh);
        const h = bbox.max.y - bbox.min.y;
        if (h > 0.01) horseMesh.scale.setScalar(2.2 / h);

        // Position: x/z from attachment node, y grounded
        horseMesh.position.set(off.x, 0, off.z);
        horseMesh.updateWorldMatrix(true, true);
        const bb2 = new THREE.Box3().setFromObject(horseMesh);
        if (bb2.min.y < 0) horseMesh.position.y -= bb2.min.y;

        // Horses face forward (same direction as carrosa)
        horseMesh.rotation.y = 0;

        this.group.add(horseMesh);
        this._horseLegs.push(...findLegs(horseMesh));
      }
    }

    console.log('[carrosa] lista. Conductor offset:', OFF_CONDUCTOR.toArray().map(v => v.toFixed(2)));
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

  // ── Public API (mirrors HorseManager interface for easy integration) ──────

  isConducting()     { return this._conducting; }
  isOnBoard()        { return this._conducting; }
  isMountAnimating() { return this._anim?.type === 'mount'; }
  getRiderY()        { return OFF_CONDUCTOR.y; }
  speedMultiplier(sprinting) { return sprinting ? SPEED_MULT * SPRINT_MULT : SPEED_MULT; }

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
    const t = this._anim.t;
    const ease = _ease(t);
    if (this._anim.type === 'mount')    return ease * SADDLE_H + Math.sin(t * Math.PI) * 0.3;
    return (1 - ease) * SADDLE_H + Math.sin(t * Math.PI) * 0.5;
  }

  // ── Mount / dismount ──────────────────────────────────────────────────────

  tryMount(_playerId, fromX, fromZ) {
    if (this._conducting) {
      // Dismount — jump off to the side
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
    // Mount as conductor
    this._conducting = true;
    const cx = this._seatWorldX(OFF_CONDUCTOR);
    const cz = this._seatWorldZ(OFF_CONDUCTOR);
    this._anim = { type: 'mount', t: 0, dur: MOUNT_DUR,
      fromX: fromX, fromZ: fromZ, toX: cx, toZ: cz };
    return { x: cx, z: cz };
  }

  // ── Per-frame update ──────────────────────────────────────────────────────

  update(playerPos, dt) {
    // Tick mount animation
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount') this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }

    // Proximity prompt (only when not conducting)
    if (!this._conducting) {
      const dx = this._x - playerPos.x;
      const dz = this._z - playerPos.z;
      this._nearCarrosa = (dx * dx + dz * dz) < MOUNT_R * MOUNT_R;
      this._prompt.style.display = this._nearCarrosa ? 'block' : 'none';
    } else {
      this._nearCarrosa = false;
      this._prompt.style.display = 'none';
    }

    // Horse leg animation
    const moving = this._speed > 0.5;
    if (moving) this._walkTime += dt;
    else        this._walkTime  = 0;

    for (const { obj, phase } of this._horseLegs) {
      const target = moving ? Math.sin(this._walkTime * WALK_FREQ + phase) * WALK_AMP : 0;
      obj.rotation.x += (target - obj.rotation.x) * Math.min(1, 12 * dt);
    }

    // Wheel spin (wheels already have the right axes from the GLB)
    if (moving && this._wheels.length) {
      const spin = this._speed * dt * 0.22;
      for (const w of this._wheels) w.rotation.x -= spin;
    }
  }

  /** Move the carrosa group to follow the conductor's controls position. */
  syncPosition(x, z, moveAngle, speed) {
    this._x     = x;
    this._z     = z;
    this._ry    = moveAngle;
    this._speed = speed;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = moveAngle;
  }

  // ── Multiplayer ───────────────────────────────────────────────────────────

  onRemoteMove(x, z, ry) {
    if (this._conducting) return;
    this._x = x; this._z = z; this._ry = ry;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = ry;
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  _seatWorldX(off) { return this._x + off.x * Math.cos(this._ry) - off.z * Math.sin(this._ry); }
  _seatWorldZ(off) { return this._z + off.x * Math.sin(this._ry) + off.z * Math.cos(this._ry); }
}

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
