// ─── Carrosa (carriage) system ───────────────────────────────────────────────
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader      = new GLTFLoader();
const CAR_SCALE   = 7.14;
const MOUNT_R     = 5.0;
const MOUNT_DUR   = 0.45;
const WALK_FREQ   = 6.0;
const WALK_AMP    = 0.45;
const SPEED_MULT  = 1.4;
const SPRINT_MULT = 1.6;
const WHEEL_RADIUS   = 1.5;   // world-unit radius — adjust if spin looks too fast/slow
const CONDUCTOR_FWD  = 0.5;   // nudge conductor seat forward
const CONDUCTOR_Y    = -0.35; // nudge conductor seat down

// Spin axis: parent's local +Z = car's lateral axis = world lateral (see comments in update)
const _SPIN_AXIS = new THREE.Vector3(0, 0, 1);

function loadGLB(path) {
  return new Promise(r =>
    loader.load(path, g => r(g), undefined, () => { console.warn('[carrosa] no cargó:', path); r(null); })
  );
}

export class CarrosaSystem {
  constructor(scene, spawnX = 14, spawnZ = -56, horseManager = null) {
    this.scene         = scene;
    this._horseManager = horseManager;
    this.group         = new THREE.Group();
    this._x            = spawnX;
    this._z            = spawnZ;
    this._ry           = 0;
    this._speed        = 0;
    this._moveDist     = 0;
    this._wheelAngle   = 0;   // accumulated rotation angle (rad) from total distance
    this._walkTime     = 0;
    this._wheelData    = [];  // [{ node, restQuat }]
    this._axles        = [];  // eje nodes (fallback)
    this._hitchedHorses = []; // [{ horse, node, walkTime }]
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
    const carGLTF = await loadGLB('/models/CARROSA.glb');
    if (!carGLTF) return;

    const car = carGLTF.scene;
    car.scale.setScalar(CAR_SCALE);
    car.rotation.y = -Math.PI / 2;

    const horseNodes = [];
    car.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
      const n = o.name;
      if (/eje/i.test(n))          this._axles.push(o);
      if (/conductor/i.test(n))    this._conductorNode   = o;
      if (/acompa/i.test(n))       this._acompananteNode = o;
      if (/caballo/i.test(n))      horseNodes.push(o);
    });

    this.group.add(car);
    this.group.updateWorldMatrix(false, true);

    // ── Collect wheel nodes ──────────────────────────────────────────────────
    // Prefer explicit RUEDA/wheel nodes; fall back to mesh-children of axles; last resort: axles themselves
    const wheelCandidates = [];
    car.traverse(o => {
      if (/rueda|wheel/i.test(o.name)) wheelCandidates.push(o);
    });
    if (!wheelCandidates.length) {
      for (const axle of this._axles) {
        axle.children.forEach(c => { if (c.isMesh) wheelCandidates.push(c); });
      }
    }
    if (!wheelCandidates.length) {
      wheelCandidates.push(...this._axles);
    }

    // Store rest quaternion so we can set ABSOLUTE rotation each frame
    for (const node of wheelCandidates) {
      this._wheelData.push({ node, restQuat: node.quaternion.clone() });
    }

    console.log('[carrosa] ruedas:', wheelCandidates.map(w => w.name));
    console.log('[carrosa] ejes:', this._axles.map(a =>
      `${a.name}[${a.children.map(c => c.name).join(',')}]`));
    if (!this._conductorNode)   console.warn('[carrosa] no encontré CONDUCTOR');
    if (!this._acompananteNode) console.warn('[carrosa] no encontré ACOMPAÑANTE');

    // ── Hitch real horses ─────────────────────────────────────────────────────
    if (this._horseManager && horseNodes.length) {
      let retries = 0;
      while (this._horseManager.horses.size === 0 && retries < 50) {
        await new Promise(r => setTimeout(r, 100));
        retries++;
      }

      let horseIdx = 0;
      for (const node of horseNodes) {
        let horse = null;
        while (!horse && horseIdx < 10) {
          horse = this._horseManager.hitchHorse(horseIdx++);
        }
        if (!horse) { console.warn('[carrosa] sin caballo disponible'); continue; }

        const wp = node.getWorldPosition(new THREE.Vector3());
        horse.mesh.position.set(wp.x, 0, wp.z);
        horse.mesh.rotation.y = this._ry + Math.PI;
        horse.x = wp.x; horse.z = wp.z;
        horse._prevX = wp.x; horse._prevZ = wp.z;

        this._hitchedHorses.push({ horse, node, walkTime: 0 });
        console.log('[carrosa] caballo enganchado', horseIdx - 1, '| patas:', horse.legs.length);
      }
    }

    console.log('[carrosa] lista. Conductor:', this._conductorNode ? 'OK' : 'NO',
      '| Ruedas:', this._wheelData.length,
      '| Caballos:', this._hitchedHorses.length);
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
    return this._conductorNode.getWorldPosition(new THREE.Vector3()).y + CONDUCTOR_Y;
  }

  getRiderWorldPos() {
    if (!this._conductorNode || !this._conducting) return null;
    const wp = this._conductorNode.getWorldPosition(new THREE.Vector3());
    return {
      x: wp.x + Math.sin(this._ry) * CONDUCTOR_FWD,
      z: wp.z + Math.cos(this._ry) * CONDUCTOR_FWD,
    };
  }

  consumeMountLand() { const p = this._mountLandPos; this._mountLandPos = null; return p; }

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

    const moving = this._moveDist > 0.001;

    // ── Hitched horses ────────────────────────────────────────────────────
    for (const h of this._hitchedHorses) {
      // Position at LUGAR CABALLO world pos, face carriage direction
      const wp = h.node.getWorldPosition(new THREE.Vector3());
      h.horse.mesh.position.set(wp.x, 0, wp.z);
      h.horse.mesh.rotation.y = this._ry + Math.PI;
      h.horse.x = wp.x; h.horse.z = wp.z;

      // Animate legs — identical to HorseManager._animateLegs (simplified: no strafe)
      if (moving) h.walkTime += dt;
      else        h.walkTime  = 0;
      _animateLegs(h.horse.legs, h.walkTime, moving);
    }

    // ── Wheels — absolute quaternion: spinQuat(localZ, totalAngle) * restQuat ──
    // The parent's local +Z = car's lateral axis = world lateral at any ry.
    // Using absolute rotation avoids incremental drift and first-frame spikes.
    if (this._wheelData.length) {
      // Cap moveDist to avoid teleport spike on first syncPosition
      const dist = Math.min(this._moveDist, 0.3);
      this._wheelAngle += dist / WHEEL_RADIUS;

      const spinQuat = new THREE.Quaternion().setFromAxisAngle(_SPIN_AXIS, this._wheelAngle);
      for (const wd of this._wheelData) {
        wd.node.quaternion.multiplyQuaternions(spinQuat, wd.restQuat);
      }
    }
    this._moveDist = 0;
  }

  syncPosition(x, z, moveAngle, speed) {
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

// ── Horse leg animation — identical to HorseManager._animateLegs (straight walk) ──
function _animateLegs(legs, walkTime, moving) {
  if (!moving) {
    for (const leg of legs) {
      leg.pivot.rotation.x *= 0.85;
      leg.pivot.rotation.z *= 0.85;
      if (leg.legObj) leg.legObj.rotation.x *= 0.85;
    }
    return;
  }
  const t = walkTime;
  for (const leg of legs) {
    const s = Math.sin(WALK_FREQ * t + leg.phase);
    const swing = s > 0 ? s * WALK_AMP : s * WALK_AMP * 0.65;
    leg.pivot.rotation.x = swing;
    leg.pivot.rotation.z = 0;
    if (leg.legObj) {
      const kneeFlex = Math.max(0, Math.sin(WALK_FREQ * t + leg.phase + 0.55)) * WALK_AMP * 0.55;
      leg.legObj.rotation.x = -kneeFlex;
    }
  }
}

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
