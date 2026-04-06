// --- Isometric Controls: WASD movement + Mouse aiming ---
import * as THREE from 'three';

const SPEED = 10;

export class IsoControls {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3(0, 0, 0); // player ground position
    this.aimAngle = 0; // radians, where the player faces
    this.mouseWorld = new THREE.Vector3();
    this.keys = { w: false, a: false, s: false, d: false };
    this.onEPress = null; // callback for E key
    this._lastMoveAngle = 0; // movement facing angle
    this._isAiming = false;  // right-click held = aim mode

    document.addEventListener('mousedown', (e) => { if (e.button === 2) this._isAiming = true; });
    document.addEventListener('mouseup',   (e) => { if (e.button === 2) this._isAiming = false; });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    this.raycaster = new THREE.Raycaster();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.mouseNDC = new THREE.Vector2();

    document.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k in this.keys) this.keys[k] = true;
      if (k === 'e' && this.onEPress) this.onEPress();
    });
    document.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k in this.keys) this.keys[k] = false;
    });
    document.addEventListener('mousemove', (e) => {
      this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  update(dt, colliders, speedMult = 1.0) {
    // --- Movement (WASD in world-axis-aligned directions for isometric) ---
    const dir = new THREE.Vector3();
    // In isometric, "up" on screen = forward (-Z), "right" = +X
    if (this.keys.w) dir.z -= 1;
    if (this.keys.s) dir.z += 1;
    if (this.keys.a) dir.x -= 1;
    if (this.keys.d) dir.x += 1;

    if (dir.length() > 0) {
      dir.normalize();
      // atan2(dx, dz): player model has +Z front, so this gives correct facing angle
      this._lastMoveAngle = Math.atan2(dir.x, dir.z);
    }
    this.position.x += dir.x * SPEED * speedMult * dt;
    this.position.z += dir.z * SPEED * speedMult * dt;

    // World boundary
    const BOUND = 95;
    this.position.x = Math.max(-BOUND, Math.min(BOUND, this.position.x));
    this.position.z = Math.max(-BOUND, Math.min(BOUND, this.position.z));

    // Collide with boxes
    if (colliders) {
      for (const box of colliders) {
        const halfX = box.sx / 2;
        const halfZ = box.sz / 2;
        const dx = this.position.x - box.x;
        const dz = this.position.z - box.z;
        const overlapX = halfX + 0.5 - Math.abs(dx);
        const overlapZ = halfZ + 0.5 - Math.abs(dz);
        if (overlapX > 0 && overlapZ > 0) {
          if (overlapX < overlapZ) {
            this.position.x += Math.sign(dx) * overlapX;
          } else {
            this.position.z += Math.sign(dz) * overlapZ;
          }
        }
      }
    }

    // --- Aim: mouse -> world position on ground plane ---
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const hit = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.groundPlane, hit);
    if (hit) {
      this.mouseWorld.copy(hit);
      this.aimAngle = Math.atan2(
        hit.x - this.position.x,
        hit.z - this.position.z
      );
    }

    // --- Camera follows player ---
    const camOffset = new THREE.Vector3(20, 25, 20); // isometric offset
    this.camera.position.copy(this.position).add(camOffset);
    this.camera.lookAt(this.position.x, 0, this.position.z);
  }

  getPosition() {
    return { x: this.position.x, y: 1.0, z: this.position.z };
  }

  getRotation() {
    return { x: 0, y: this.aimAngle };
  }

  getMovementAngle() { return this._lastMoveAngle; }
  isAiming()         { return this._isAiming; }

  getAimDirection() {
    return new THREE.Vector3(
      Math.sin(this.aimAngle),
      0,
      Math.cos(this.aimAngle)
    ).normalize();
  }

  setPosition(x, y, z) {
    this.position.set(x, 0, z);
  }
}
