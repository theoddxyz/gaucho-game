// ─── Carrosa (carriage) system ───────────────────────────────────────────────
import * as THREE  from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// ── Visual / game constants ───────────────────────────────────────────────────
const CAR_SCALE      = 7.14;
const MOUNT_R        = 5.0;
const MOUNT_DUR      = 0.45;
const SPEED_MULT     = 1.4;
const SPRINT_MULT    = 1.6;
const WHEEL_RADIUS   = 1.5;   // visual spin radius
const CONDUCTOR_FWD  = 0.5;
const CONDUCTOR_Y    = -0.5;
const PASSENGER_Y    = -0.5;

// ── Cannon-es RaycastVehicle constants ────────────────────────────────────────
const CARRIAGE_MASS    = 600;           // kg
const ENGINE_FORCE     = 3500;          // N per driven wheel (front)
const REAR_FORCE_RATIO = 0.7;           // rear wheels get 70% of front force
const BRAKE_FORCE      = 28;            // N braking
const MAX_STEER        = Math.PI / 6;   // 30°
const SPRINT_F_MULT    = 1.55;

// Wheel geometry (world units — same scale as game)
const WHL_R      = 0.8;    // physics wheel radius
const TRACK_W    = 1.3;    // half track-width (wheel X offset from center)
const AXLE_FWD   = 2.2;    // front axle Z from chassis center
const AXLE_BWD   = -2.2;   // rear axle Z
const CONN_Y     = -0.4;   // wheel connection point Y from chassis center

// Suspension — stiff so it barely bounces on flat terrain
const SUSP_REST  = 0.25;
const SUSP_STIFF = 180;
const SUSP_DAMP  = 18;

// Chassis rests at this Y so wheels just touch y=0
const CHASSIS_REST_Y = WHL_R + SUSP_REST + Math.abs(CONN_Y); // ≈ 1.45

function loadGLB(path) {
  return new Promise(r =>
    loader.load(path, g => r(g), undefined, () => { console.warn('[carrosa] no cargó:', path); r(null); })
  );
}

export class CarrosaSystem {
  constructor(scene, spawnX = 14, spawnZ = -56, horseManager = null) {
    this.scene          = scene;
    this._horseManager  = horseManager;
    this.group          = new THREE.Group();
    this._x             = spawnX;
    this._z             = spawnZ;
    this._ry            = 0;
    this._moveDist      = 0;
    this._wheelAngle    = 0;
    this._wheelData     = [];
    this._axles         = [];
    this._hitchedHorses = [];
    this._conductorNode   = null;
    this._acompananteNode = null;

    // ── Conductor state ───────────────────────────────────────────────────────
    this._conducting  = false;
    this._driverId    = null;
    this._anim        = null;
    this._mountLandPos = null;

    // ── Passenger state ───────────────────────────────────────────────────────
    this._isPassenger         = false;
    this._passengerId         = null;
    this._passengerAnim       = null;
    this._passengerMountLandPos = null;

    // ── Physics velocity (read by main.js to sync controls) ──────────────────
    this._physVelX = 0;
    this._physVelZ = 0;

    // ── Cannon-es ─────────────────────────────────────────────────────────────
    this._cannonWorld  = null;
    this._chassisBody  = null;
    this._vehicle      = null;
    this._fwdLocal     = null;   // pre-alloc Vec3 reused each frame
    this._fwdWorld     = null;
    this._initCannon(spawnX, spawnZ);

    this._nearCarrosa = false;
    this._prompt      = this._mkPrompt();

    this.group.position.set(spawnX, 0, spawnZ);
    scene.add(this.group);
    this._load().catch(e => console.warn('[carrosa] error en carga:', e));
  }

  // ── Cannon init ───────────────────────────────────────────────────────────

  _initCannon(x, z) {
    try {
      // World — real gravity so wheel raycasts hit the ground plane
      this._cannonWorld = new CANNON.World();
      this._cannonWorld.gravity.set(0, -9.82, 0);
      this._cannonWorld.broadphase = new CANNON.SAPBroadphase(this._cannonWorld);
      this._cannonWorld.allowSleep = false;

      // Static flat ground
      const ground = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
      ground.addShape(new CANNON.Plane());
      ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      this._cannonWorld.addBody(ground);

      // Chassis — low center of mass, high angular damping to prevent tipping
      this._chassisBody = new CANNON.Body({ mass: CARRIAGE_MASS });
      this._chassisBody.addShape(new CANNON.Box(new CANNON.Vec3(1.3, 0.4, 2.8)));
      this._chassisBody.position.set(x, CHASSIS_REST_Y, z);
      this._chassisBody.linearDamping  = 0.05;
      this._chassisBody.angularDamping = 0.95;  // resists tipping hard

      // RaycastVehicle — X right, Y up, Z forward
      this._vehicle = new CANNON.RaycastVehicle({
        chassisBody:      this._chassisBody,
        indexRightAxis:   0,
        indexUpAxis:      1,
        indexForwardAxis: 2,
      });

      // Shared wheel options
      const base = {
        radius:               WHL_R,
        directionLocal:       new CANNON.Vec3(0, -1, 0),
        axleLocal:            new CANNON.Vec3(-1, 0, 0),
        suspensionRestLength: SUSP_REST,
        suspensionStiffness:  SUSP_STIFF,
        dampingRelaxation:    SUSP_DAMP,
        dampingCompression:   SUSP_DAMP * 1.3,
        maxSuspensionForce:   500000,
        maxSuspensionTravel:  0.3,
        frictionSlip:         2.5,
        rollInfluence:        0.01,
        customSlidingRotationalSpeed:    -30,
        useCustomSlidingRotationalSpeed: true,
      };

      // 4 wheels: [frontLeft, frontRight, rearLeft, rearRight]
      const wheelPos = [
        [-TRACK_W, AXLE_FWD],
        [ TRACK_W, AXLE_FWD],
        [-TRACK_W, AXLE_BWD],
        [ TRACK_W, AXLE_BWD],
      ];
      for (const [tx, tz] of wheelPos) {
        this._vehicle.addWheel({
          ...base,
          chassisConnectionPointLocal: new CANNON.Vec3(tx, CONN_Y, tz),
        });
      }

      this._vehicle.addToWorld(this._cannonWorld);

      // Pre-alloc vectors for heading extraction (avoid GC each frame)
      this._fwdLocal = new CANNON.Vec3(0, 0, 1);
      this._fwdWorld = new CANNON.Vec3();

    } catch (err) {
      console.error('[carrosa] cannon init failed — fallback to manual physics:', err);
      this._vehicle     = null;
      this._chassisBody = null;
      this._cannonWorld = null;
    }
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
          const b = o.geometry.boundingBox;
          const sx = b.max.x - b.min.x, sy = b.max.y - b.min.y, sz = b.max.z - b.min.z;
          const m = Math.min(sx, sy, sz);
          spinAxis = m === sx ? new THREE.Vector3(1, 0, 0)
                   : m === sy ? new THREE.Vector3(0, 1, 0)
                              : new THREE.Vector3(0, 0, 1);
        }
      });
      this._wheelData.push({ node, restQuat: node.quaternion.clone(), spinAxis });
    }

    if (!this._conductorNode)   console.warn('[carrosa] no encontré CONDUCTOR');
    if (!this._acompananteNode) console.warn('[carrosa] no encontré ACOMPAÑANTE');

    // ── Hitch horses ──────────────────────────────────────────────────────────
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
      this._physVelX   = 0;
      this._physVelZ   = 0;
      this._stopCannon();
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
    this._syncCannonToState();
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

  // ── Cannon helpers ────────────────────────────────────────────────────────

  _syncCannonToState() {
    if (!this._chassisBody) return;
    this._chassisBody.position.set(this._x, CHASSIS_REST_Y, this._z);
    this._chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this._ry);
    this._chassisBody.velocity.set(0, 0, 0);
    this._chassisBody.angularVelocity.set(0, 0, 0);
    // Zero all wheel forces
    if (this._vehicle) {
      for (let i = 0; i < 4; i++) {
        this._vehicle.applyEngineForce(0, i);
        this._vehicle.setBrake(0, i);
      }
    }
  }

  _stopCannon() {
    if (!this._chassisBody) return;
    this._chassisBody.velocity.set(0, 0, 0);
    this._chassisBody.angularVelocity.set(0, 0, 0);
    if (this._vehicle) for (let i = 0; i < 4; i++) {
      this._vehicle.applyEngineForce(0, i);
      this._vehicle.setBrake(BRAKE_FORCE, i);
    }
  }

  // ── Per-frame update ──────────────────────────────────────────────────────

  update(playerPos, dt) {
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

    if (!this._conducting && !this._isPassenger) {
      const dx = this._x - playerPos.x, dz = this._z - playerPos.z;
      this._nearCarrosa = (dx * dx + dz * dz) < MOUNT_R * MOUNT_R;
      this._updatePrompt();
    } else {
      this._nearCarrosa = false;
      this._prompt.style.display = 'none';
    }

    const moving = this._moveDist > 0.001;

    for (const h of this._hitchedHorses) {
      if (moving) h.walkTime += dt; else h.walkTime = 0;
      const wp = h.node.getWorldPosition(new THREE.Vector3());
      this._horseManager.driveHitchedHorse(h.horse, wp.x, wp.z, this._ry + Math.PI, h.walkTime, moving);
    }

    if (this._wheelData.length) {
      this._wheelAngle += Math.min(this._moveDist, 0.3) / WHEEL_RADIUS;
      for (const wd of this._wheelData) {
        const sq = new THREE.Quaternion().setFromAxisAngle(wd.spinAxis, this._wheelAngle);
        wd.node.quaternion.multiplyQuaternions(wd.restQuat, sq);
      }
    }
    this._moveDist = 0;
  }

  // ── Physics drive (RaycastVehicle) ────────────────────────────────────────

  /**
   * Horses pull carriage via RaycastVehicle with real wheel friction/steering.
   * Falls back to manual Newtonian physics if cannon failed to init.
   */
  drive(desiredVelX, desiredVelZ, moveAngle, dt) {
    if (!this._vehicle) return this._driveFallback(desiredVelX, desiredVelZ, moveAngle, dt);

    const isMoving = desiredVelX * desiredVelX + desiredVelZ * desiredVelZ > 0.25;

    // ── Determine steering and engine force ───────────────────────────────
    let engineF = 0;
    let steerV  = 0;

    if (isMoving) {
      // Extract current heading from chassis quaternion
      this._chassisBody.quaternion.vmult(this._fwdLocal, this._fwdWorld);
      const heading = Math.atan2(this._fwdWorld.x, this._fwdWorld.z);

      const desiredAngle = Math.atan2(desiredVelX, desiredVelZ);
      let diff = desiredAngle - heading;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      const wantsForward = Math.abs(diff) < Math.PI * 0.55;
      if (wantsForward) {
        const ds       = Math.sqrt(desiredVelX * desiredVelX + desiredVelZ * desiredVelZ);
        const sprint   = ds > 13 ? SPRINT_F_MULT : 1.0;
        engineF = ENGINE_FORCE * sprint;
        steerV  = Math.max(-MAX_STEER, Math.min(MAX_STEER, diff));
      }
    }

    // Front axle steers, all wheels get engine force (horses pull whole carriage)
    this._vehicle.setSteeringValue(steerV, 0);   // front-left
    this._vehicle.setSteeringValue(steerV, 1);   // front-right
    this._vehicle.applyEngineForce(engineF,                    0);
    this._vehicle.applyEngineForce(engineF,                    1);
    this._vehicle.applyEngineForce(engineF * REAR_FORCE_RATIO, 2);
    this._vehicle.applyEngineForce(engineF * REAR_FORCE_RATIO, 3);

    const brakeF = !isMoving ? BRAKE_FORCE : 0;
    for (let i = 0; i < 4; i++) this._vehicle.setBrake(brakeF, i);

    // Lock pitch/roll — ground vehicle, prevent tipping
    this._chassisBody.angularVelocity.x = 0;
    this._chassisBody.angularVelocity.z = 0;

    this._cannonWorld.step(1 / 60, dt, 3);

    // ── Read back position and heading ─────────────────────────────────────
    const px = this._chassisBody.position.x;
    const pz = this._chassisBody.position.z;
    this._chassisBody.quaternion.vmult(this._fwdLocal, this._fwdWorld);
    const ry = Math.atan2(this._fwdWorld.x, this._fwdWorld.z);

    // NaN guard — reset if physics exploded
    if (!isFinite(px) || !isFinite(pz) || !isFinite(ry)) {
      console.warn('[carrosa] physics diverged — resetting cannon body');
      this._syncCannonToState();
      return { x: this._x, z: this._z, ry: this._ry };
    }

    this._ry = ry;
    const ddx = px - this._x, ddz = pz - this._z;
    this._moveDist = Math.sqrt(ddx * ddx + ddz * ddz);
    this._x = px; this._z = pz;

    // Keep chassis on ground (prevent bouncing off on ramps or physics glitches)
    if (this._chassisBody.position.y < CHASSIS_REST_Y - 0.3) {
      this._chassisBody.position.y = CHASSIS_REST_Y;
      this._chassisBody.velocity.y = 0;
    }

    // Sync _physVelX/_physVelZ so main.js can read carriage speed
    this._physVelX = this._chassisBody.velocity.x;
    this._physVelZ = this._chassisBody.velocity.z;

    // Visual group always at y=0 (flat terrain)
    this.group.position.set(this._x, 0, this._z);
    this.group.rotation.y = this._ry;
    this.group.updateWorldMatrix(false, true);

    return { x: this._x, z: this._z, ry: this._ry };
  }

  // ── Fallback: manual Newtonian physics (if cannon failed to init) ─────────

  _driveFallback(desiredVelX, desiredVelZ, moveAngle, dt) {
    const isMoving = desiredVelX * desiredVelX + desiredVelZ * desiredVelZ > 0.25;
    const fwdX = Math.sin(this._ry), fwdZ = Math.cos(this._ry);
    let forwardSpeed = this._physVelX * fwdX + this._physVelZ * fwdZ;
    this._physVelX = fwdX * forwardSpeed;
    this._physVelZ = fwdZ * forwardSpeed;

    let steerAngle = 0, wantsForward = false;
    if (isMoving) {
      const desiredAngle = Math.atan2(desiredVelX, desiredVelZ);
      let diff = desiredAngle - this._ry;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      wantsForward = Math.abs(diff) < Math.PI * 0.55;
      if (wantsForward) steerAngle = Math.max(-Math.PI / 5, Math.min(Math.PI / 5, diff));
    }
    const turnSpd = Math.max(Math.abs(forwardSpeed), 1.2);
    this._ry += (turnSpd / 4.5) * Math.tan(steerAngle) * dt;

    let fwdAccel = 0;
    if (isMoving && wantsForward) {
      const ds = Math.sqrt(desiredVelX * desiredVelX + desiredVelZ * desiredVelZ);
      fwdAccel += (4200 * (ds > 13 ? 1.55 : 1.0) * Math.max(Math.cos(steerAngle), 0.15)) / 600;
    }
    const absSpd = Math.abs(forwardSpeed);
    if (absSpd > 0.01) fwdAccel -= Math.sign(forwardSpeed) * (18 * absSpd) / 600;

    forwardSpeed  = Math.max(-5, Math.min(22, forwardSpeed + fwdAccel * dt));
    const nfwdX = Math.sin(this._ry), nfwdZ = Math.cos(this._ry);
    this._physVelX = nfwdX * forwardSpeed;
    this._physVelZ = nfwdZ * forwardSpeed;

    const nx = this._x + this._physVelX * dt, nz = this._z + this._physVelZ * dt;
    this._moveDist = Math.sqrt((nx - this._x) ** 2 + (nz - this._z) ** 2);
    this._x = nx; this._z = nz;
    this.group.position.set(this._x, 0, this._z);
    this.group.rotation.y = this._ry;
    this.group.updateWorldMatrix(false, true);
    return { x: this._x, z: this._z, ry: this._ry };
  }

  // ── Remote sync ───────────────────────────────────────────────────────────

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
    // Sync cannon so mounting works correctly if local player boards later
    if (this._chassisBody) {
      this._chassisBody.position.set(x, CHASSIS_REST_Y, z);
      this._chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), ry);
      this._chassisBody.velocity.set(0, 0, 0);
      this._chassisBody.angularVelocity.set(0, 0, 0);
    }
  }
}

function _ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
