// ─── Carrosa (carriage) system ───────────────────────────────────────────────
import * as THREE  from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// ── Visual constants ──────────────────────────────────────────────────────────
const CAR_SCALE      = 7.14;
const MOUNT_R        = 5.0;
const MOUNT_DUR      = 0.45;
const SPEED_MULT     = 1.4;
const SPRINT_MULT    = 1.6;
const WHEEL_RADIUS   = 1.5;
const CONDUCTOR_FWD  = 0.5;
const CONDUCTOR_Y    = -0.5;
const PASSENGER_Y    = -0.5;

// ── Physics constants ─────────────────────────────────────────────────────────
const CARRIAGE_MASS      = 600;          // kg
const LINEAR_DAMPING     = 0.50;         // rolling friction — terminal ~14 m/s at trot
const HORSE_FORCE        = 3000;         // N — combined pull at trot
const MAX_STEER          = Math.PI / 5;  // 36° — max front-axle angle
const DEFAULT_WHEELBASE  = 4.5;          // units — fallback if axles not in model

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
    this._wheelData    = [];
    this._axles        = [];
    this._hitchedHorses = [];
    this._conductorNode    = null;
    this._acompananteNode  = null;

    // ── Conductor (driver) state ──────────────────────────────────────────────
    this._conducting   = false;
    this._driverId     = null;
    this._anim         = null;
    this._mountLandPos = null;

    // ── Passenger state ───────────────────────────────────────────────────────
    this._isPassenger           = false;
    this._passengerId           = null;
    this._passengerAnim         = null;
    this._passengerMountLandPos = null;

    // ── Physics ───────────────────────────────────────────────────────────────
    this._wheelbase = DEFAULT_WHEELBASE;
    this._initCannon();

    this._nearCarrosa = false;
    this._prompt      = this._mkPrompt();

    this.group.position.set(spawnX, 0, spawnZ);
    scene.add(this.group);
    this._load().catch(e => console.warn('[carrosa] error en carga:', e));
  }

  // ── Cannon-es init ────────────────────────────────────────────────────────

  _initCannon() {
    this._cannonWorld = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });

    this._body = new CANNON.Body({
      mass:            CARRIAGE_MASS,
      linearDamping:   LINEAR_DAMPING,
      angularDamping:  1.0,   // rotation controlled entirely by bicycle model
      position:        new CANNON.Vec3(this._x, 0, this._z),
    });
    // Rough collision box for the carriage body
    this._body.addShape(new CANNON.Box(new CANNON.Vec3(1.5, 0.5, 3.0)));
    this._cannonWorld.addBody(this._body);
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
      if (/eje/i.test(n))       this._axles.push(o);
      if (/conductor/i.test(n)) this._conductorNode   = o;
      if (/acompa/i.test(n))    this._acompananteNode = o;
      if (/caballo/i.test(n))   horseNodes.push(o);
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
    car.traverse(o => { if (/rueda|wheel/i.test(o.name)) wheelCandidates.push(o); });
    if (!wheelCandidates.length)
      for (const axle of this._axles)
        axle.children.forEach(c => { if (c.isMesh) wheelCandidates.push(c); });
    if (!wheelCandidates.length) wheelCandidates.push(...this._axles);

    for (const node of wheelCandidates) {
      let spinAxis = new THREE.Vector3(0, 1, 0);
      node.traverse(o => {
        if (o.isMesh && o.geometry) {
          o.geometry.computeBoundingBox();
          const b  = o.geometry.boundingBox;
          const sx = b.max.x - b.min.x, sy = b.max.y - b.min.y, sz = b.max.z - b.min.z;
          const m  = Math.min(sx, sy, sz);
          spinAxis = m === sx ? new THREE.Vector3(1,0,0)
                  : m === sy ? new THREE.Vector3(0,1,0)
                             : new THREE.Vector3(0,0,1);
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
        while (!horse && horseIdx < 10) horse = this._horseManager.hitchHorse(horseIdx++);
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
  isMountAnimating() { return this._anim?.type === 'mount' || this._passengerAnim?.type === 'mount'; }
  speedMultiplier(sprinting) { return sprinting ? SPEED_MULT * SPRINT_MULT : SPEED_MULT; }
  getDriverId()      { return this._driverId; }
  getPassengerId()   { return this._passengerId; }

  setRemoteDriver(id)    { if (!this._conducting)  this._driverId    = id; }
  setRemotePassenger(id) { if (!this._isPassenger) this._passengerId = id; }

  // ── Seat positions ────────────────────────────────────────────────────────

  getRiderY() {
    if (!this._conductorNode) return 3.0;
    return this._conductorNode.getWorldPosition(new THREE.Vector3()).y + CONDUCTOR_Y;
  }

  getRiderWorldPos() {
    if (!this._conductorNode) return null;
    const wp = this._conductorNode.getWorldPosition(new THREE.Vector3());
    return { x: wp.x + Math.sin(this._ry) * CONDUCTOR_FWD, z: wp.z + Math.cos(this._ry) * CONDUCTOR_FWD };
  }

  getPassengerY() {
    if (!this._acompananteNode) return 3.0;
    return this._acompananteNode.getWorldPosition(new THREE.Vector3()).y + PASSENGER_Y;
  }

  getPassengerWorldPos() {
    if (!this._acompananteNode) return null;
    const wp = this._acompananteNode.getWorldPosition(new THREE.Vector3());
    return { x: wp.x, z: wp.z };
  }

  // ── Animation helpers ─────────────────────────────────────────────────────

  consumeMountLand()     { const p = this._mountLandPos;          this._mountLandPos          = null; return p; }
  consumePassengerLand() { const p = this._passengerMountLandPos; this._passengerMountLandPos = null; return p; }

  getMountModelPos() {
    const a = this._anim?.type === 'mount' ? this._anim : (this._passengerAnim?.type === 'mount' ? this._passengerAnim : null);
    if (!a) return null;
    const t = _ease(a.t);
    return { x: a.fromX + (a.toX - a.fromX) * t, z: a.fromZ + (a.toZ - a.fromZ) * t };
  }

  getDismountModelPos(controlsPos) {
    const a = this._anim?.type === 'dismount' ? this._anim : (this._passengerAnim?.type === 'dismount' ? this._passengerAnim : null);
    if (!a) return null;
    const t = _ease(a.t);
    return { x: a.fromX + (controlsPos.x - a.fromX) * t, z: a.fromZ + (controlsPos.z - a.fromZ) * t };
  }

  getAnimY() {
    const a = this._anim ?? this._passengerAnim;
    if (!a) return null;
    const seatY = (a === this._anim) ? this.getRiderY() : this.getPassengerY();
    const t = a.t, ease = _ease(t);
    return a.type === 'mount'
      ? ease * seatY + Math.sin(t * Math.PI) * 0.3
      : (1 - ease) * seatY + Math.sin(t * Math.PI) * 0.5;
  }

  // ── Mount / dismount ──────────────────────────────────────────────────────

  tryMount(playerId, fromX, fromZ) {
    if (this._conducting) {
      this._conducting = false;
      this._driverId   = null;
      // Stop carriage when driver dismounts
      this._body.velocity.set(0, 0, 0);
      this._body.force.set(0, 0, 0);
      const cx = this._conductorNode?.getWorldPosition(new THREE.Vector3()).x ?? this._x;
      const cz = this._conductorNode?.getWorldPosition(new THREE.Vector3()).z ?? this._z;
      const sideAngle = this._ry + Math.PI * 0.5;
      this._anim = { type: 'dismount', t: 0, dur: 0.4,
        fromX: cx, fromZ: cz,
        toX: this._x + Math.sin(sideAngle) * 3,
        toZ: this._z + Math.cos(sideAngle) * 3 };
      return null;
    }
    if (this._driverId && this._driverId !== playerId) return null;
    if (!this._nearCarrosa) return null;
    this._conducting = true;
    this._driverId   = playerId;
    // Sync cannon body to current carriage position on mount
    this._body.position.set(this._x, 0, this._z);
    this._body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this._ry);
    this._body.velocity.set(0, 0, 0);
    const wp = this._conductorNode
      ? this._conductorNode.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3(this._x, 0, this._z);
    this._anim = { type: 'mount', t: 0, dur: MOUNT_DUR, fromX: fromX, fromZ: fromZ, toX: wp.x, toZ: wp.z };
    return { x: wp.x, z: wp.z };
  }

  tryMountPassenger(playerId, fromX, fromZ) {
    if (this._isPassenger) {
      this._isPassenger = false;
      this._passengerId = null;
      const cx = this._acompananteNode?.getWorldPosition(new THREE.Vector3()).x ?? this._x;
      const cz = this._acompananteNode?.getWorldPosition(new THREE.Vector3()).z ?? this._z;
      const sideAngle = this._ry - Math.PI * 0.5;
      this._passengerAnim = { type: 'dismount', t: 0, dur: 0.4,
        fromX: cx, fromZ: cz,
        toX: this._x + Math.sin(sideAngle) * 3,
        toZ: this._z + Math.cos(sideAngle) * 3 };
      return null;
    }
    if (!this._acompananteNode) return null;
    if (this._passengerId && this._passengerId !== playerId) return null;
    if (!this._nearCarrosa) return null;
    this._isPassenger = true;
    this._passengerId = playerId;
    const wp = this._acompananteNode.getWorldPosition(new THREE.Vector3());
    this._passengerAnim = { type: 'mount', t: 0, dur: MOUNT_DUR, fromX: fromX, fromZ: fromZ, toX: wp.x, toZ: wp.z };
    return { x: wp.x, z: wp.z };
  }

  // ── Per-frame update ──────────────────────────────────────────────────────

  update(playerPos, dt) {
    // Animations
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount') this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }
    if (this._passengerAnim) {
      this._passengerAnim.t += dt / this._passengerAnim.dur;
      if (this._passengerAnim.t >= 1) {
        this._passengerAnim.t = 1;
        if (this._passengerAnim.type === 'mount') this._passengerMountLandPos = { x: this._passengerAnim.toX, z: this._passengerAnim.toZ };
        this._passengerAnim = null;
      }
    }

    // Proximity prompt
    if (!this._conducting && !this._isPassenger) {
      const dx = this._x - playerPos.x, dz = this._z - playerPos.z;
      this._nearCarrosa = (dx * dx + dz * dz) < MOUNT_R * MOUNT_R;
      this._updatePrompt();
    } else {
      this._nearCarrosa = false;
      this._prompt.style.display = 'none';
    }

    const moving = this._moveDist > 0.001;

    // Hitched horses
    for (const h of this._hitchedHorses) {
      if (moving) h.walkTime += dt; else h.walkTime = 0;
      const wp = h.node.getWorldPosition(new THREE.Vector3());
      this._horseManager.driveHitchedHorse(h.horse, wp.x, wp.z, this._ry + Math.PI, h.walkTime, moving);
    }

    // Wheels
    if (this._wheelData.length) {
      this._wheelAngle += Math.min(this._moveDist, 0.3) / WHEEL_RADIUS;
      for (const wd of this._wheelData) {
        const sq = new THREE.Quaternion().setFromAxisAngle(wd.spinAxis, this._wheelAngle);
        wd.node.quaternion.multiplyQuaternions(wd.restQuat, sq);
      }
    }
    this._moveDist = 0;
  }

  // ── Physics drive (conductor only) ───────────────────────────────────────

  /**
   * Bicycle model + cannon-es.
   * desiredVelX/Z: raw WASD velocity from controls.getDesiredVelocity().
   * Returns new carriage world position {x, z, ry}.
   */
  drive(desiredVelX, desiredVelZ, moveAngle, dt) {
    const body      = this._body;
    const isMoving  = desiredVelX * desiredVelX + desiredVelZ * desiredVelZ > 0.25;

    // ── Bicycle model: steering angle → heading change ────────────────────
    // steeringAngle = how much the front axle (shaft) is turned relative to body
    let steeringAngle = 0;
    if (isMoving) {
      const desiredAngle = Math.atan2(desiredVelX, desiredVelZ);
      let diff = desiredAngle - this._ry;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      steeringAngle = Math.max(-MAX_STEER, Math.min(MAX_STEER, diff));
    }

    // Forward speed: component of cannon velocity along current heading
    const fwdX = Math.sin(this._ry), fwdZ = Math.cos(this._ry);
    const vel  = body.velocity;
    const forwardSpeed = vel.x * fwdX + vel.z * fwdZ;

    // omega = (v / L) * tan(δ)  — classic bicycle model
    this._ry += (forwardSpeed / this._wheelbase) * Math.tan(steeringAngle) * dt;

    // ── Cannon: apply horse pull force along current heading ──────────────
    if (isMoving) {
      // Detect sprint: getDesiredVelocity scales by SPRINT_MULT when sprinting
      const ds         = Math.sqrt(desiredVelX * desiredVelX + desiredVelZ * desiredVelZ);
      const sprintMult = ds > SPEED_MULT * 11 ? SPRINT_MULT : 1.0;
      // Only pull forward — horses don't push backward
      const dot = Math.cos(steeringAngle);  // ≈1 when going straight, less on sharp turn
      const F   = HORSE_FORCE * sprintMult * Math.max(dot, 0.1);
      body.force.set(fwdX * F, 0, fwdZ * F);
    } else {
      body.force.set(0, 0, 0);
    }

    // Lock Y and rotation — this is a ground vehicle
    body.position.y  = 0;
    body.velocity.y  = 0;
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this._ry);
    body.angularVelocity.set(0, 0, 0);

    // Step physics
    this._cannonWorld.step(1 / 60, dt, 3);

    // Read back position from cannon
    const nx = body.position.x;
    const nz = body.position.z;
    const dx = nx - this._x, dz = nz - this._z;
    this._moveDist = Math.sqrt(dx * dx + dz * dz);
    this._x = nx; this._z = nz;

    this.group.position.set(this._x, 0, this._z);
    this.group.rotation.y = this._ry;
    this.group.updateWorldMatrix(false, true);

    return { x: this._x, z: this._z, ry: this._ry };
  }

  // ── Remote position sync ──────────────────────────────────────────────────

  onRemoteMove(x, z, ry) {
    if (this._conducting) return;
    const dx = x - this._x, dz = z - this._z;
    this._moveDist = Math.sqrt(dx * dx + dz * dz);
    this._x = x; this._z = z; this._ry = ry;
    this.group.position.set(x, 0, z);
    this.group.rotation.y = ry;
    this.group.updateWorldMatrix(false, true);
    // Keep cannon body in sync so mounting works correctly if local player boards later
    this._body.position.set(x, 0, z);
    this._body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), ry);
    this._body.velocity.set(0, 0, 0);
  }
}

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
