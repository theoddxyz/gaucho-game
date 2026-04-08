// --- Isometric Controls: WASD movement + Mouse aiming ---
import * as THREE from 'three';

const SPEED       = 10;
const SPRINT_MULT = 1.9;   // extra speed when Shift held
const JUMP_VEL    = 9;     // m/s upward on jump
const GRAVITY     = 24;    // m/s² downward
const BOUND       = 9900;

export class IsoControls {
  constructor(camera) {
    this.camera   = camera;
    this.position = new THREE.Vector3(0, 0, 0);
    this.aimAngle = 0;
    this.mouseWorld = new THREE.Vector3();
    this.keys = { w: false, a: false, s: false, d: false };
    this.onEPress = null;
    this._lastMoveAngle = 0;
    this._isAiming   = false;
    this._camZoom    = 1.0;
    this._vy         = 0;       // vertical velocity (m/s)
    this._onGround   = true;
    this._jumpTrigger = false;  // set true on Space keydown, consumed in update
    this._sprinting  = false;
    this._velX       = 0;       // current horizontal velocity for smooth accel
    this._velZ       = 0;
    this._recoil     = 0;       // 0=idle, 1=full kick, decays to 0

    this._aimRMB  = false;
    this._aimCtrl = false;

    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) { this._aimRMB  = true;  this._isAiming = true; }
    });
    document.addEventListener('mouseup', (e) => {
      if (e.button === 2) { this._aimRMB  = false; this._isAiming = this._aimCtrl; }
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('wheel', (e) => {
      e.preventDefault();
      this._camZoom = Math.max(0.3, Math.min(2.5, this._camZoom + e.deltaY * 0.001));
    }, { passive: false });

    this.raycaster   = new THREE.Raycaster();
    // Plano de apuntado en y=0 — la dirección incluye componente Y descendente
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.mouseNDC    = new THREE.Vector2();

    document.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k in this.keys) this.keys[k] = true;
      if (k === ' ') { e.preventDefault(); this._jumpTrigger = true; }
      if (k === 'shift') this._sprinting = true;
      if (k === 'e' && this.onEPress) this.onEPress();
      if (e.key === 'Control') { e.preventDefault(); this._aimCtrl = true; this._isAiming = true; }
    });
    document.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k in this.keys) this.keys[k] = false;
      if (k === 'shift') this._sprinting = false;
      if (e.key === 'Control') { this._aimCtrl = false; this._isAiming = this._aimRMB; }
    });
    document.addEventListener('mousemove', (e) => {
      this.mouseNDC.x = (e.clientX / window.innerWidth)  * 2 - 1;
      this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  /** Trigger gun recoil — call once per shot. */
  applyRecoil() { this._recoil = 1; }

  update(dt, colliders, speedMult = 1.0) {
    const sprint = this._sprinting ? SPRINT_MULT : 1.0;

    // --- Horizontal movement with smooth acceleration ---
    const dir = new THREE.Vector3();
    if (this.keys.w) dir.z -= 1;
    if (this.keys.s) dir.z += 1;
    if (this.keys.a) dir.x -= 1;
    if (this.keys.d) dir.x += 1;

    if (dir.length() > 0) {
      dir.normalize();
      const raw  = Math.atan2(dir.x, dir.z);
      const step = Math.PI / 4;
      this._lastMoveAngle = Math.round(raw / step) * step;
    }

    const targetX = dir.x * SPEED * speedMult * sprint;
    const targetZ = dir.z * SPEED * speedMult * sprint;
    // Moderate acceleration — reduced to avoid overly snappy horse feel
    const accel = dir.length() > 0 ? 5 : 8;
    this._velX += (targetX - this._velX) * Math.min(1, accel * dt);
    this._velZ += (targetZ - this._velZ) * Math.min(1, accel * dt);

    this.position.x += this._velX * dt;
    this.position.z += this._velZ * dt;

    this.position.x = Math.max(-BOUND, Math.min(BOUND, this.position.x));
    this.position.z = Math.max(-BOUND, Math.min(BOUND, this.position.z));

    // --- Box collisions (X/Z only) ---
    if (colliders) {
      for (const box of colliders) {
        const halfX = box.sx / 2, halfZ = box.sz / 2;
        const dx = this.position.x - box.x;
        const dz = this.position.z - box.z;
        const overlapX = halfX + 0.5 - Math.abs(dx);
        const overlapZ = halfZ + 0.5 - Math.abs(dz);
        if (overlapX > 0 && overlapZ > 0) {
          if (overlapX < overlapZ) this.position.x += Math.sign(dx) * overlapX;
          else                     this.position.z += Math.sign(dz) * overlapZ;
        }
      }
    }

    // --- Jump & gravity ---
    if (this._jumpTrigger && this._onGround) {
      this._vy       = JUMP_VEL;
      this._onGround = false;
    }
    this._jumpTrigger = false;

    if (!this._onGround) {
      this._vy -= GRAVITY * dt;
      this.position.y += this._vy * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this._vy       = 0;
        this._onGround = true;
      }
    }

    // --- Recoil decay ---
    this._recoil = Math.max(0, this._recoil - dt / 0.14);

    // --- Camera: fixed height (doesn't bob with jump), follows X/Z ---
    // Recoil lifts camera and pulls back slightly behind the aim direction
    const recoilLift = this._recoil * 1.8;
    const recoilPull = this._recoil * 0.9;
    const aimDx = Math.sin(this.aimAngle), aimDz = Math.cos(this.aimAngle);
    const camOff = new THREE.Vector3(20, 25, 20).multiplyScalar(this._camZoom);
    this.camera.position.set(
      this.position.x + camOff.x - aimDx * recoilPull,
      camOff.y + recoilLift,
      this.position.z + camOff.z - aimDz * recoilPull
    );
    this.camera.lookAt(this.position.x, 0, this.position.z);
    // IMPORTANT: flush camera matrixWorld so the raycast below uses the current frame's camera
    this.camera.updateMatrixWorld();

    // --- Aim: mouse → ground plane ---
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
      this.mouseWorld.copy(hit);
      this.aimAngle = Math.atan2(hit.x - this.position.x, hit.z - this.position.z);
    }
  }

  /** Call when auto-mounting mid-air: stops vertical velocity, resets Y. */
  landOnHorse() {
    this.position.y = 0;
    this._vy        = 0;
    this._onGround  = true;
  }

  getPosition()      { return { x: this.position.x, y: this.position.y, z: this.position.z }; }
  getRotation()      { return { x: 0, y: this.aimAngle }; }
  getMovementAngle() { return this._lastMoveAngle; }
  isAiming()         { return this._isAiming; }
  isInAir()          { return !this._onGround; }
  isSprinting()      { return this._sprinting; }

  getAimDirection() {
    return new THREE.Vector3(Math.sin(this.aimAngle), 0, Math.cos(this.aimAngle)).normalize();
  }

  /**
   * Recomputes aim direction fresh from current mouse NDC — use at shot time for precision.
   * @param {THREE.Vector3|null} gunOrigin  Posición real del arma en world-space.
   *   Si se provee, el vector incluye componente Y descendente para poder impactar
   *   blancos que estén por debajo del arma (p.ej. disparando desde el caballo).
   */
  /**
   * Dirección de disparo desde la posición del jugador hacia el punto apuntado (y=0).
   * @param {number} gunY  Altura del arma en world-space (0.55 en suelo, ~3 en caballo).
   *   Si es > 0, la dirección incluye un componente Y descendente para poder
   *   impactar blancos más bajos que la altura del arma.
   */
  getFreshAimDirection(gunY = 0) {
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
      const dx = hit.x - this.position.x;
      const dz = hit.z - this.position.z;
      if (dx * dx + dz * dz > 0.01) {
        // dy negativo: el arma está a gunY metros sobre el suelo (y=0)
        return new THREE.Vector3(dx, -gunY, dz).normalize();
      }
    }
    return this.getAimDirection();
  }

  /** Returns the camera raycaster aimed at the current mouse position (for hit detection). */
  getCameraRaycaster() {
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    return this.raycaster;
  }

  setPosition(x, y, z) {
    this.position.set(x, 0, z);
    this._vy      = 0;
    this._onGround = true;
  }
}
