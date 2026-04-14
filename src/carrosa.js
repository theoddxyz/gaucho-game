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

// ── Carriage physics (Newtonian — no external library) ───────────────────────
// F_net = F_horse - drag*|v| * v_dir   →   a = F_net / mass
// Bicycle model for yaw: ω = (v_fwd / wheelbase) * tan(δ)
const CARRIAGE_MASS    = 600;         // kg  — heavy wagon
const HORSE_FORCE      = 4200;        // N   — combined pull force
const DRAG_COEFF       = 18;          // N·s/m  — rolling resistance (terminal ~14 m/s at trot)
const SPRINT_FORCE_MULT = 1.55;       // extra force when sprinting
const MAX_STEER        = Math.PI / 5; // 36° — max front-axle angle
const DEFAULT_WHEELBASE = 4.5;        // fallback if axles not in model
const MAX_SPEED        = 22;          // hard cap m/s

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
    this._physVelX   = 0;   // world-space velocity m/s
    this._physVelZ   = 0;
    this._wheelbase  = DEFAULT_WHEELBASE;

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

    // ── Measure real wheelbase from axle nodes ───────────────────────────────
    if (this._axles.length >= 2) {
      const p0 = new THREE.Vector3(), p1 = new THREE.Vector3();
      this._axles[0].getWorldPosition(p0);
      this._axles[1].getWorldPosition(p1);
      this._wheelbase = p0.distanceTo(p1);
    }

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

        }
      });
      this._wheelData.push({ node, restQuat: node.quaternion.clone(), spinAxis });
    }

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
      }
    }

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
      this._physVelX   = 0;
      this._physVelZ   = 0;
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
   * Newtonian drive — F_horse - drag = ma, bicycle model for yaw.
   * desiredVelX/Z: raw WASD from controls.getDesiredVelocity().
   * Returns new world position {x, z, ry}.
   */
  drive(desiredVelX, desiredVelZ, moveAngle, dt) {
    const isMoving = desiredVelX * desiredVelX + desiredVelZ * desiredVelZ > 0.25;

    // ── Lateral constraint ────────────────────────────────────────────────────
    // Wheels can't slide sideways — project velocity onto current heading.
    // This is what makes a vehicle feel like a vehicle (not ice).
    const fwdX = Math.sin(this._ry), fwdZ = Math.cos(this._ry);
    let forwardSpeed = this._physVelX * fwdX + this._physVelZ * fwdZ;
    this._physVelX = fwdX * forwardSpeed;
    this._physVelZ = fwdZ * forwardSpeed;

    // ── Steering ──────────────────────────────────────────────────────────────
    let steeringAngle = 0;
    let wantsForward  = false;
    if (isMoving) {
      const desiredAngle = Math.atan2(desiredVelX, desiredVelZ);
      let diff = desiredAngle - this._ry;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      // If desired direction is more than ~100° from heading → player wants to stop/reverse
      wantsForward  = Math.abs(diff) < Math.PI * 0.55;
      if (wantsForward) steeringAngle = Math.max(-MAX_STEER, Math.min(MAX_STEER, diff));
    }

    // Bicycle model: ω = (v / L) * tan(δ)
    // Use a small minimum speed so the carriage can start turning before it's moving fast
    const turnSpeed = Math.max(Math.abs(forwardSpeed), 1.2);
    this._ry += (turnSpeed / this._wheelbase) * Math.tan(steeringAngle) * dt;

    // ── Forces ────────────────────────────────────────────────────────────────
    let forwardAccel = 0;

    if (isMoving && wantsForward) {
      const ds         = Math.sqrt(desiredVelX * desiredVelX + desiredVelZ * desiredVelZ);
      const sprintMult = ds > 13 ? SPRINT_FORCE_MULT : 1.0;
      const pullF      = HORSE_FORCE * sprintMult * Math.max(Math.cos(steeringAngle), 0.15);
      forwardAccel    += pullF / CARRIAGE_MASS;
    }

    // Rolling drag — opposes current motion direction
    const absSpd = Math.abs(forwardSpeed);
    if (absSpd > 0.01) {
      forwardAccel -= Math.sign(forwardSpeed) * (DRAG_COEFF * absSpd) / CARRIAGE_MASS;
    }

    // Integrate forward speed (velocity is always along heading after lateral constraint)
    forwardSpeed += forwardAccel * dt;
    forwardSpeed  = Math.max(-MAX_SPEED * 0.25, Math.min(MAX_SPEED, forwardSpeed));

    // Rebuild world velocity along the (possibly updated) heading
    const newFwdX = Math.sin(this._ry), newFwdZ = Math.cos(this._ry);
    this._physVelX = newFwdX * forwardSpeed;
    this._physVelZ = newFwdZ * forwardSpeed;

    // Integrate position
    const nx  = this._x + this._physVelX * dt;
    const nz  = this._z + this._physVelZ * dt;
    const ddx = nx - this._x, ddz = nz - this._z;
    this._moveDist = Math.sqrt(ddx * ddx + ddz * ddz);
    this._x = nx; this._z = nz;

    this.group.position.set(this._x, 0, this._z);
    this.group.rotation.y = this._ry;
    this.group.updateWorldMatrix(false, true);

    return { x: this._x, z: this._z, ry: this._ry };
  }

  syncPosition(x, z, moveAngle) {
    const dx = x - this._x, dz = z - this._z;
    this._moveDist = Math.sqrt(dx * dx + dz * dz);
    this._x = x; this._z = z; this._ry = moveAngle;
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
