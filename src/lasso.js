// --- Lazo con física Verlet ---
import * as THREE from 'three';

const THROW_SPEED  = 26;       // m/s velocidad de punta
const MIN_THROW_SPEED = 12;
const MAX_THROW_SPEED = 38;
const CHARGE_TIME     = 1.2;   // seconds to reach full charge
const PULL_STEP       = 6;     // units per pull click
const ROPE_NODES   = 16;
const ROPE_LEN     = 20;       // metros máx
const SEG_LEN      = ROPE_LEN / (ROPE_NODES - 1);
const GRAVITY_Y    = -14;      // m/s²
const DAMPING      = 0.97;
const CATCH_RADIUS = 2.2;      // radio de captura
const PULL_FORCE   = 12;       // fuerza de tracción sobre entidad capturada

export class LassoSystem {
  constructor(scene) {
    this._scene  = scene;
    this._state  = 'idle';   // idle | flying | caught
    this._nodes  = [];
    this._caught = null;     // { type, id, obj }
    this._line   = null;
    this._tip    = null;
    this._loop   = null;     // visual loop at tip
    this._charging    = false;
    this._chargeT     = 0;      // 0..1
    this._chargeEl    = null;   // DOM charge indicator
    this._build();
    this._buildChargeUI();
  }

  _build() {
    // Rope line
    const geo  = new THREE.BufferGeometry();
    const pos  = new Float32Array(ROPE_NODES * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat  = new THREE.LineBasicMaterial({ color: 0xc8a23c });
    this._line = new THREE.Line(geo, mat);
    this._line.visible = false;
    this._line.frustumCulled = false;
    this._scene.add(this._line);

    // Tip sphere
    const tGeo  = new THREE.SphereGeometry(0.13, 6, 4);
    const tMat  = new THREE.MeshBasicMaterial({ color: 0xf0c040 });
    this._tip   = new THREE.Mesh(tGeo, tMat);
    this._tip.visible = false;
    this._scene.add(this._tip);

    // Loop ring (visual only — shown when caught)
    const lGeo  = new THREE.TorusGeometry(0.40, 0.04, 6, 16);
    const lMat  = new THREE.MeshBasicMaterial({ color: 0xf0c040 });
    this._loop  = new THREE.Mesh(lGeo, lMat);
    this._loop.visible = false;
    this._scene.add(this._loop);

    // Init nodes
    for (let i = 0; i < ROPE_NODES; i++) {
      this._nodes.push({ pos: new THREE.Vector3(), prev: new THREE.Vector3() });
    }
  }

  _buildChargeUI() {
    const el = document.createElement('div');
    el.style.cssText = [
      'position:fixed', 'bottom:120px', 'left:50%',
      'transform:translateX(-50%)',
      'width:120px', 'height:12px',
      'background:rgba(0,0,0,0.5)',
      'border:1px solid #c8a23c',
      'border-radius:6px', 'overflow:hidden',
      'display:none', 'z-index:100',
    ].join(';');
    const fill = document.createElement('div');
    fill.style.cssText = 'height:100%;width:0%;background:#f0c040;border-radius:6px;transition:width 0.05s;';
    el.appendChild(fill);
    document.body.appendChild(el);
    this._chargeEl   = el;
    this._chargeFill = fill;
  }

  startCharge() {
    if (this._state !== 'idle') return;
    this._charging = true;
    this._chargeT  = 0;
    if (this._chargeEl) this._chargeEl.style.display = 'block';
  }

  releaseCharge(origin, dir) {
    if (!this._charging) return;
    this._charging = false;
    if (this._chargeEl) { this._chargeEl.style.display = 'none'; this._chargeFill.style.width = '0%'; }
    const speed = MIN_THROW_SPEED + (MAX_THROW_SPEED - MIN_THROW_SPEED) * this._chargeT;
    this._throwWithSpeed(origin, dir, speed);
  }

  _throwWithSpeed(origin, dir, speed) {
    if (this._state !== 'idle') this.release();
    this._state = 'flying';
    this._line.visible = true;
    this._tip.visible  = true;
    this._loop.visible = false;

    for (let i = 0; i < ROPE_NODES; i++) {
      this._nodes[i].pos.copy(origin);
      this._nodes[i].prev.copy(origin);
    }
    const flatDir = new THREE.Vector3(dir.x, 0.12, dir.z).normalize();
    const tip = this._nodes[ROPE_NODES - 1];
    tip.prev.sub(flatDir.clone().multiplyScalar(speed * 0.016));
  }

  pull(gunPos) {
    if (this._state !== 'caught' || !this._caught) return;
    const c = this._caught;
    if (c.type === 'cow' && c.obj && !c.obj.removed) {
      const dx = gunPos.x - c.obj.mesh.position.x;
      const dz = gunPos.z - c.obj.mesh.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz) || 1;
      const step = Math.min(PULL_STEP, dist - 1);
      if (step > 0) {
        c.obj.mesh.position.x += (dx / dist) * step;
        c.obj.mesh.position.z += (dz / dist) * step;
        c.obj.panicTimer = 0.8;
      }
    } else if (c.type === 'ostrich') {
      // Ostriches: handled via vx/vz, pull is continuous in update()
    }
    // Release if entity is close enough
    const entity = c.obj?.mesh ?? c.obj?.group;
    if (entity) {
      const dx = gunPos.x - entity.position.x;
      const dz = gunPos.z - entity.position.z;
      if (dx * dx + dz * dz < 4) this.release();
    }
  }

  /** Lanzar el lazo desde origin en la dirección dir (XZ). */
  throw(origin, dir) { this._throwWithSpeed(origin, dir, THROW_SPEED); }

  release() {
    this._state = 'idle';
    this._line.visible = false;
    this._tip.visible  = false;
    this._loop.visible = false;
    this._caught = null;
  }

  isCaught()  { return this._state === 'caught'; }
  isActive()  { return this._state !== 'idle'; }
  getCaught() { return this._caught; }

  /**
   * @param {THREE.Vector3} gunPos
   * @param {number} dt
   * @param {object} cowSystem
   * @param {object} ostrichSystem
   * @param {Map} remotePlayers
   */
  update(dt, gunPos, cowSystem, ostrichSystem, remotePlayers) {
    if (this._state === 'idle') return;

    if (this._charging) {
      this._chargeT = Math.min(1, this._chargeT + dt / CHARGE_TIME);
      if (this._chargeFill) this._chargeFill.style.width = `${this._chargeT * 100}%`;
    }

    // Anchor first node to gun
    this._nodes[0].pos.copy(gunPos);
    this._nodes[0].prev.copy(gunPos);

    // Verlet with substeps
    const SUB = 5;
    const st  = dt / SUB;
    for (let s = 0; s < SUB; s++) {
      // Integrate
      for (let i = 1; i < ROPE_NODES; i++) {
        const n   = this._nodes[i];
        const vel = n.pos.clone().sub(n.prev).multiplyScalar(DAMPING);
        vel.y += GRAVITY_Y * st * st;
        n.prev.copy(n.pos);
        n.pos.add(vel);
      }
      // Constraints (distance + ground)
      for (let iter = 0; iter < 4; iter++) {
        this._nodes[0].pos.copy(gunPos);
        for (let i = 0; i < ROPE_NODES - 1; i++) {
          const a    = this._nodes[i];
          const b    = this._nodes[i + 1];
          const diff = b.pos.clone().sub(a.pos);
          const d    = diff.length() || 0.0001;
          const corr = diff.multiplyScalar((d - SEG_LEN) / d * 0.5);
          if (i > 0) a.pos.add(corr);
          b.pos.sub(corr);
        }
        // Ground clamp
        for (let i = 1; i < ROPE_NODES; i++) {
          if (this._nodes[i].pos.y < 0.05) {
            this._nodes[i].prev.y = this._nodes[i].pos.y;
            this._nodes[i].pos.y  = 0.05;
          }
        }
        this._nodes[0].pos.copy(gunPos);
      }
    }

    // If caught, lock tip to entity
    if (this._state === 'caught' && this._caught) {
      const c = this._caught;
      let entityPos = null;

      if (c.type === 'cow' && cowSystem && !c.obj.removed) {
        entityPos = c.obj.mesh.position;
        // Pull force on cow
        const dx = gunPos.x - entityPos.x;
        const dz = gunPos.z - entityPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz) || 1;
        if (dist > 2) {
          c.obj.vx += (dx / dist) * PULL_FORCE * dt;
          c.obj.vz += (dz / dist) * PULL_FORCE * dt;
          c.obj.panicTimer = Math.max(c.obj.panicTimer, 0.3);
        }
      } else if (c.type === 'ostrich' && ostrichSystem) {
        const e = ostrichSystem._entities[c.id];
        if (e && !e.dead && e.mesh) {
          entityPos = e.mesh.position;
          // Slow ostrich
          e.vx *= 0.5; e.vz *= 0.5;
        } else { this.release(); return; }
      } else if (c.type === 'player' && remotePlayers) {
        const pm = remotePlayers.get(c.id);
        if (pm) { entityPos = pm.group.position; }
        else { this.release(); return; }
      } else { this.release(); return; }

      if (entityPos) {
        const tip = this._nodes[ROPE_NODES - 1];
        tip.pos.set(entityPos.x, Math.max(entityPos.y + 0.8, 0.8), entityPos.z);
        tip.prev.copy(tip.pos);
        this._loop.position.set(entityPos.x, entityPos.y + 1.0, entityPos.z);
        this._loop.rotation.x = Math.PI / 2;
      }
    }

    // Update rope geometry
    const attr = this._line.geometry.attributes.position;
    for (let i = 0; i < ROPE_NODES; i++) {
      attr.setXYZ(i, this._nodes[i].pos.x, this._nodes[i].pos.y, this._nodes[i].pos.z);
    }
    attr.needsUpdate = true;
    this._line.geometry.computeBoundingSphere();

    // Update tip mesh
    const tip = this._nodes[ROPE_NODES - 1];
    this._tip.position.copy(tip.pos);

    // === Catch detection (only while flying) ===
    if (this._state === 'flying') {
      const tipPos = tip.pos;

      // Cows
      if (cowSystem) {
        for (const cow of cowSystem._cows) {
          if (cow.removed) continue;
          const dx = tipPos.x - cow.mesh.position.x;
          const dz = tipPos.z - cow.mesh.position.z;
          if (dx*dx + dz*dz < (CATCH_RADIUS * 1.4) ** 2) {
            this._state  = 'caught';
            this._caught = { type: 'cow', id: cow.id, obj: cow };
            this._loop.visible = true;
            return;
          }
        }
      }

      // Ostriches
      if (ostrichSystem) {
        for (let i = 0; i < ostrichSystem._entities.length; i++) {
          const e = ostrichSystem._entities[i];
          if (e.dead || e.dying || !e.mesh) continue;
          const dx = tipPos.x - e.mesh.position.x;
          const dz = tipPos.z - e.mesh.position.z;
          if (dx*dx + dz*dz < CATCH_RADIUS ** 2) {
            this._state  = 'caught';
            this._caught = { type: 'ostrich', id: i, obj: e };
            this._loop.visible = true;
            return;
          }
        }
      }

      // Remote players / bots
      if (remotePlayers) {
        for (const [id, pm] of remotePlayers) {
          const dx = tipPos.x - pm.group.position.x;
          const dz = tipPos.z - pm.group.position.z;
          if (dx*dx + dz*dz < CATCH_RADIUS ** 2) {
            this._state  = 'caught';
            this._caught = { type: 'player', id, obj: pm };
            this._loop.visible = true;
            return;
          }
        }
      }

      // Auto-release if fully extended
      const ropeDist = tipPos.distanceTo(gunPos);
      if (ropeDist >= ROPE_LEN - 1) this.release();
    }
  }
}
