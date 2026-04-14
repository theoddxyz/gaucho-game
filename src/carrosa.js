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
const WHEEL_RADIUS   = 1.5;
const CONDUCTOR_FWD  = 0.5;
const CONDUCTOR_Y    = -0.5;
const PASSENGER_Y    = -0.5;

// ── Carriage physics ──────────────────────────────────────────────────────────
const PULL_TAU    = 1.1;   // seconds to reach full horse speed (heavy start)
const BRAKE_TAU   = 0.55;  // seconds to stop (momentum on release)
const ROT_SPEED   = 2.4;   // max yaw rate of carriage body (rad/s)
const MAX_SPEED   = 18;    // units/s hard cap

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
    this._wheelAngle   = 0;
    this._walkTime     = 0;
    this._wheelData    = [];
    this._axles        = [];
    this._hitchedHorses = [];
    this._conductorNode    = null;
    this._acompananteNode  = null;

    // ── Conductor (driver) state ──────────────────────────────────────────────
    this._conducting  = false;   // local player is driving
    this._driverId    = null;    // socket.id of driver (local or remote)
    this._anim        = null;    // mount/dismount anim for conductor
    this._mountLandPos = null;

    // ── Carriage physics ──────────────────────────────────────────────────────
    this._physVelX = 0;
    this._physVelZ = 0;

    // ── Passenger state ───────────────────────────────────────────────────────
    this._isPassenger       = false;   // local player is passenger
    this._passengerId       = null;    // socket.id of passenger (local or remote)
    this._passengerAnim     = null;
    this._passengerMountLandPos = null;

    this._nearCarrosa = false;
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
    const wheelCandidates = [];
    car.traverse(o => {
      if (/rueda|wheel/i.test(o.name)) wheelCandidates.push(o);
    });
    if (!wheelCandidates.length) {
      for (const axle of this._axles) {
        axle.children.forEach(c => { if (c.isMesh) wheelCandidates.push(c); });
      }
    }
    if (!wheelCandidates.length) wheelCandidates.push(...this._axles);

    for (const node of wheelCandidates) {
      let spinAxis = new THREE.Vector3(0, 1, 0);
      node.traverse(o => {
        if (o.isMesh && o.geometry) {
          o.geometry.computeBoundingBox();
          const b = o.geometry.boundingBox;
          const sx = b.max.x - b.min.x;
          const sy = b.max.y - b.min.y;
          const sz = b.max.z - b.min.z;
          const minV = Math.min(sx, sy, sz);
          if (minV === sx) spinAxis = new THREE.Vector3(1, 0, 0);
          else if (minV === sy) spinAxis = new THREE.Vector3(0, 1, 0);
          else spinAxis = new THREE.Vector3(0, 0, 1);
          console.log(`[carrosa] wheel ${node.name}: ${sx.toFixed(2)}x${sy.toFixed(2)}x${sz.toFixed(2)} → spinAxis`, spinAxis.toArray());
        }
      });
      this._wheelData.push({ node, restQuat: node.quaternion.clone(), spinAxis });
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
      '| Acompañante:', this._acompananteNode ? 'OK' : 'NO',
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
    document.body.appendChild(el);
    return el;
  }

  _updatePrompt() {
    if (!this._nearCarrosa) { this._prompt.style.display = 'none'; return; }
    const driverFree    = !this._driverId;
    const passengerFree = !this._passengerId && !!this._acompananteNode;
    if (!driverFree && !passengerFree) { this._prompt.style.display = 'none'; return; }
    this._prompt.textContent = driverFree ? '[E] Conducir la carrosa' : '[E] Subir como acompañante';
    this._prompt.style.display = 'block';
  }

  // ── Public API ────────────────────────────────────────────────────────────

  isConducting()     { return this._conducting; }
  isPassenger()      { return this._isPassenger; }
  isOnBoard()        { return this._conducting || this._isPassenger; }
  isMountAnimating() {
    return this._anim?.type === 'mount' || this._passengerAnim?.type === 'mount';
  }
  speedMultiplier(sprinting) { return sprinting ? SPEED_MULT * SPRINT_MULT : SPEED_MULT; }
  getDriverId()    { return this._driverId; }
  getPassengerId() { return this._passengerId; }

  /** Remote clients call this to lock/unlock conductor seat */
  setRemoteDriver(id) { if (!this._conducting) this._driverId = id; }
  /** Remote clients call this to lock/unlock passenger seat */
  setRemotePassenger(id) { if (!this._isPassenger) this._passengerId = id; }

  // ── Seat world positions (no guard — safe for remote clients too) ──────────

  getRiderY() {
    if (!this._conductorNode) return 3.0;
    return this._conductorNode.getWorldPosition(new THREE.Vector3()).y + CONDUCTOR_Y;
  }

  /** World XZ of conductor seat. No _conducting guard — usable on remote clients. */
  getRiderWorldPos() {
    if (!this._conductorNode) return null;
    const wp = this._conductorNode.getWorldPosition(new THREE.Vector3());
    return {
      x: wp.x + Math.sin(this._ry) * CONDUCTOR_FWD,
      z: wp.z + Math.cos(this._ry) * CONDUCTOR_FWD,
    };
  }

  getPassengerY() {
    if (!this._acompananteNode) return 3.0;
    return this._acompananteNode.getWorldPosition(new THREE.Vector3()).y + PASSENGER_Y;
  }

  /** World XZ of passenger seat. No _isPassenger guard — usable on remote clients. */
  getPassengerWorldPos() {
    if (!this._acompananteNode) return null;
    const wp = this._acompananteNode.getWorldPosition(new THREE.Vector3());
    return { x: wp.x, z: wp.z };
  }

  // ── Animation helpers ─────────────────────────────────────────────────────

  consumeMountLand() {
    const p = this._mountLandPos; this._mountLandPos = null; return p;
  }
  consumePassengerLand() {
    const p = this._passengerMountLandPos; this._passengerMountLandPos = null; return p;
  }

  /** Arc XZ for mount/dismount animation — covers both conductor and passenger. */
  getMountModelPos() {
    const a = this._anim?.type === 'mount' ? this._anim
      : (this._passengerAnim?.type === 'mount' ? this._passengerAnim : null);
    if (!a) return null;
    const t = _ease(a.t);
    return { x: a.fromX + (a.toX - a.fromX) * t, z: a.fromZ + (a.toZ - a.fromZ) * t };
  }

  getDismountModelPos(controlsPos) {
    const a = this._anim?.type === 'dismount' ? this._anim
      : (this._passengerAnim?.type === 'dismount' ? this._passengerAnim : null);
    if (!a) return null;
    const t = _ease(a.t);
    return { x: a.fromX + (controlsPos.x - a.fromX) * t, z: a.fromZ + (controlsPos.z - a.fromZ) * t };
  }

  getAnimY() {
    const a = this._anim ?? this._passengerAnim;
    if (!a) return null;
    const seatY = (a === this._anim) ? this.getRiderY() : this.getPassengerY();
    const t = a.t, ease = _ease(t);
    if (a.type === 'mount')    return ease * seatY + Math.sin(t * Math.PI) * 0.3;
    return (1 - ease) * seatY + Math.sin(t * Math.PI) * 0.5;
  }

  // ── Mount / dismount ──────────────────────────────────────────────────────

  tryMount(playerId, fromX, fromZ) {
    // ── Dismount conductor ────────────────────────────────────────────────
    if (this._conducting) {
      this._conducting = false;
      this._driverId   = null;
      this._speed      = 0;
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

    // ── Lock: someone else is already driving ─────────────────────────────
    if (this._driverId && this._driverId !== playerId) return null;
    if (!this._nearCarrosa) return null;

    // ── Mount conductor ───────────────────────────────────────────────────
    this._conducting = true;
    this._driverId   = playerId;
    const wp = this._conductorNode
      ? this._conductorNode.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3(this._x, 0, this._z);
    this._anim = { type: 'mount', t: 0, dur: MOUNT_DUR,
      fromX: fromX, fromZ: fromZ, toX: wp.x, toZ: wp.z };
    return { x: wp.x, z: wp.z };
  }

  tryMountPassenger(playerId, fromX, fromZ) {
    // ── Dismount passenger ────────────────────────────────────────────────
    if (this._isPassenger) {
      this._isPassenger  = false;
      this._passengerId  = null;
      const cx = this._acompananteNode
        ? this._acompananteNode.getWorldPosition(new THREE.Vector3()).x : this._x;
      const cz = this._acompananteNode
        ? this._acompananteNode.getWorldPosition(new THREE.Vector3()).z : this._z;
      const sideAngle = this._ry - Math.PI * 0.5;  // opposite side from conductor
      this._passengerAnim = { type: 'dismount', t: 0, dur: 0.4,
        fromX: cx, fromZ: cz,
        toX: this._x + Math.sin(sideAngle) * 3,
        toZ: this._z + Math.cos(sideAngle) * 3 };
      return null;
    }

    // ── Lock: no passenger seat or seat taken ────────────────────────────
    if (!this._acompananteNode) return null;
    if (this._passengerId && this._passengerId !== playerId) return null;
    if (!this._nearCarrosa) return null;

    // ── Mount passenger ───────────────────────────────────────────────────
    this._isPassenger  = true;
    this._passengerId  = playerId;
    const wp = this._acompananteNode.getWorldPosition(new THREE.Vector3());
    this._passengerAnim = { type: 'mount', t: 0, dur: MOUNT_DUR,
      fromX: fromX, fromZ: fromZ, toX: wp.x, toZ: wp.z };
    return { x: wp.x, z: wp.z };
  }

  // ── Per-frame update ──────────────────────────────────────────────────────

  update(playerPos, dt) {
    // Advance conductor anim
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount')
          this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }

    // Advance passenger anim
    if (this._passengerAnim) {
      this._passengerAnim.t += dt / this._passengerAnim.dur;
      if (this._passengerAnim.t >= 1) {
        this._passengerAnim.t = 1;
        if (this._passengerAnim.type === 'mount')
          this._passengerMountLandPos = { x: this._passengerAnim.toX, z: this._passengerAnim.toZ };
        this._passengerAnim = null;
      }
    }

    // Proximity prompt (only when not on board)
    if (!this._conducting && !this._isPassenger) {
      const dx = this._x - playerPos.x, dz = this._z - playerPos.z;
      this._nearCarrosa = (dx * dx + dz * dz) < MOUNT_R * MOUNT_R;
      this._updatePrompt();
    } else {
      this._nearCarrosa = false;
      this._prompt.style.display = 'none';
    }

    const moving = this._moveDist > 0.001;

    // ── Hitched horses ────────────────────────────────────────────────────
    for (const h of this._hitchedHorses) {
      if (moving) h.walkTime += dt;
      else        h.walkTime  = 0;
      const wp = h.node.getWorldPosition(new THREE.Vector3());
      this._horseManager.driveHitchedHorse(
        h.horse, wp.x, wp.z, this._ry + Math.PI, h.walkTime, moving
      );
    }

    // ── Wheels ────────────────────────────────────────────────────────────
    if (this._wheelData.length) {
      const dist = Math.min(this._moveDist, 0.3);
      this._wheelAngle += dist / WHEEL_RADIUS;
      for (const wd of this._wheelData) {
        const spinQuat = new THREE.Quaternion().setFromAxisAngle(wd.spinAxis, this._wheelAngle);
        wd.node.quaternion.multiplyQuaternions(wd.restQuat, spinQuat);
      }
    }
    this._moveDist = 0;
  }

  /**
   * Physics-based drive — call each frame when local player is conducting.
   * desiredVelX/Z come from controls._velX/_velZ (already scaled by speed multiplier).
   * Returns the new carriage world position {x, z}.
   */
  drive(desiredVelX, desiredVelZ, moveAngle, dt) {
    const moving = desiredVelX * desiredVelX + desiredVelZ * desiredVelZ > 0.5;
    const tau    = moving ? PULL_TAU : BRAKE_TAU;
    const alpha  = 1 - Math.exp(-dt / tau);

    // Spring toward desired velocity (horses pulling)
    this._physVelX += (desiredVelX - this._physVelX) * alpha;
    this._physVelZ += (desiredVelZ - this._physVelZ) * alpha;

    // Hard speed cap
    const spd = Math.sqrt(this._physVelX * this._physVelX + this._physVelZ * this._physVelZ);
    if (spd > MAX_SPEED) {
      const inv = MAX_SPEED / spd;
      this._physVelX *= inv;
      this._physVelZ *= inv;
    }

    // Smooth rotation — carriage yaw lags behind desired direction
    if (moving) {
      let dRY = moveAngle - this._ry;
      while (dRY >  Math.PI) dRY -= Math.PI * 2;
      while (dRY < -Math.PI) dRY += Math.PI * 2;
      this._ry += dRY * Math.min(1, ROT_SPEED * dt);
    }

    // Integrate position
    const nx = this._x + this._physVelX * dt;
    const nz = this._z + this._physVelZ * dt;
    const dx = nx - this._x, dz = nz - this._z;
    this._moveDist = Math.sqrt(dx * dx + dz * dz);
    this._x = nx; this._z = nz;

    this.group.position.set(this._x, 0, this._z);
    this.group.rotation.y = this._ry;
    this.group.updateWorldMatrix(false, true);

    return { x: this._x, z: this._z, ry: this._ry };
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

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
