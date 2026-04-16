// --- Moto (Motorcycle) system ---
// GLB structure (scene index 2):
//   CARROCERIA.003      — body mesh
//   RUEDA TRASCERA.002  — rear wheel mesh  (pivot ≠ axle center)
//   RUEDA DELANTERA.002 — front wheel mesh (pivot ≠ axle center)
//   EJE TRASERO.002     — rear axle EMPTY  at correct wheel center
//   EJE DELANERO .002   — front axle EMPTY at correct wheel center
//   LUGAR CONDUCTOR     — rider seat EMPTY
// Strategy: reset EJE scale → attach RUEDA to EJE → spin EJE on local Z.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MOUNT_RADIUS    = 4.0;
const SPEED_MULT      = 5.0;    // fast — racing feel
const SPRINT_MULT     = 1.25;
const RIDER_HEIGHT    = 0.82;   // seat height above ground (m)
const MOUNT_DUR       = 0.25;
const DISMOUNT_DUR    = 0.35;
const SIDE_DIST       = 2.0;
const LEAN_MAX        = 0.52;   // ~30° — racing bank
const LEAN_SPEED      = 14;     // fast lean response
const DRIFT_LEAN      = 0.82;   // ~47° during drift
const DRIFT_DURATION  = 0.65;   // seconds
const WHEEL_SPIN      = 3.0;    // rad per (m traveled)
const STEER_FACTOR    = 1.6;    // front wheel steer multiplier from lean
const SEAT_BACK_OFFSET = 0.7;   // meters the moto center sits ahead of rider

export const MOTO_SPAWNS = [
  { id: 0, x:  12, z: -58 },
  { id: 1, x: -50, z:  55 },
];

// ── Load only scene 2 from the GLB (has all moto parts) ──────────────────────
let _tplPromise = null;
function _loadTemplate() {
  if (_tplPromise) return _tplPromise;
  _tplPromise = new Promise(resolve => {
    new GLTFLoader().load('/models/MOTO.glb', gltf => {
      // Scene 2 = complete motorcycle: body + wheels + axle empties + seat
      const src = gltf.scenes?.[2] ?? gltf.scene;
      resolve(src);
    }, undefined, err => {
      console.warn('[Moto] MOTO.glb no cargó:', err);
      resolve(null);
    });
  });
  return _tplPromise;
}

// ── Fallback: simple procedural moto facing −Z ────────────────────────────────
function _buildFallback() {
  const root = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.7, roughness: 0.3 });
  const met = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.15 });
  const blk = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.5, roughness: 0.7 });

  // Body (long axis = Z = forward)
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 1.4), red);
  body.position.y = 0.72; body.castShadow = true; root.add(body);
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.55), red);
  tank.position.set(0, 1.02, -0.14); root.add(tank);

  // Wheels — pivot at axle center, cylinder axis along X (so rotation.x = spin)
  const wheels = [], frontPivot = new THREE.Group(), rearPivot = new THREE.Group();
  [[rearPivot, 0.62], [frontPivot, -0.62]].forEach(([piv, z]) => {
    piv.position.set(0, 0.33, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.14, 24), blk);
    tire.rotation.z = Math.PI / 2; piv.add(tire);
    root.add(piv); wheels.push(piv);
  });

  root._fbWheels    = wheels;
  root._fbFront     = frontPivot;
  root._isFallback  = true;
  return root;
}

// ─────────────────────────────────────────────────────────────────────────────
export class MotoManager {
  constructor(scene, network) {
    this.scene    = scene;
    this.network  = network;
    this.motos    = new Map();
    this.myMotoId = null;
    this._nearestMotoId = null;
    this._mountPrompt  = this._createPrompt();
    this._anim         = null;
    this._mountLandPos = null;
    this._lean         = 0;
    this._prevAngle    = null;
    // Tire tracks
    this._trackGeo = new THREE.PlaneGeometry(0.11, 0.32);
    this._trackMat = new THREE.MeshBasicMaterial({ color: 0x0a0804, transparent: true, opacity: 0.60, depthWrite: false });
    this._tracks   = [];   // { mesh, age, maxAge }
    this._trackTimer = 0;
    this._init();
  }

  async _init() {
    const tpl = await _loadTemplate();

    for (const spawn of MOTO_SPAWNS) {
      const outer = new THREE.Group();  // heading + position
      let wheels = [], frontWheel = null, isFallback = false;

      if (tpl) {
        // ── Inner orientation-correction group ──────────────────────────────
        // GLB faces −X; rotate so the nose points −Z (Three.js forward convention).
        // Then _targetRY = moveAngle + PI works identically to the horse.
        const inner = new THREE.Group();
        inner.rotation.y = Math.PI / 2;
        outer.add(inner);

        const clone = tpl.clone(true);
        clone.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });

        // ── Material enhancements ─────────────────────────────────────────────
        clone.traverse(o => {
          if (!o.isMesh || !o.material) return;
          const meshName = o.name.toLowerCase();
          const isWheel  = meshName.includes('rueda') || meshName.includes('tire') || meshName.includes('wheel');
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => {
            if (!m.color) return;
            const { r, g, b } = m.color;
            // Dark material = glass / visor → high gloss (skip wheel rubber)
            if (!isWheel && r + g + b < 0.25 && (m.roughness ?? 1) > 0.2) {
              m.roughness       = 0.02;
              m.metalness       = 0.15;
              m.envMapIntensity = 2.0;
            }
            // Red / warm material → metallic paint look
            if (r > 0.35 && r > g * 1.8 && r > b * 1.8) {
              m.metalness       = Math.max(m.metalness ?? 0, 0.5);
              m.roughness       = Math.min(m.roughness ?? 1, 0.35);
              m.envMapIntensity = Math.max(m.envMapIntensity ?? 1, 1.8);
            }
          });
        });

        inner.add(clone);

        // ── Find nodes by name ───────────────────────────────────────────────
        const ejeNodes  = [], ruedaNodes = [];
        let   seatNode  = null;
        clone.traverse(o => {
          const n = o.name.toLowerCase();
          if (n.includes('eje'))    ejeNodes.push(o);
          if (n.includes('rueda'))  ruedaNodes.push(o);
          if (n.includes('conductor') || n.includes('seat')) seatNode = o;
        });

        // ── Pair EJE ↔ RUEDA by trasero/delanero keywords ──────────────────
        // EJE TRASERO  ↔ RUEDA TRASCERA  (rear)
        // EJE DELANERO ↔ RUEDA DELANTERA (front)
        const find = (arr, kw) => arr.find(o => o.name.toLowerCase().includes(kw)) ?? null;
        const ejeR  = find(ejeNodes,   'trasero');
        const ejeF  = find(ejeNodes,   'delanero') ?? find(ejeNodes, 'delantera');
        // GLB typo: "TRASCERA" (with C) instead of "TRASERA" — search both spellings
        const ruedaR = find(ruedaNodes, 'trasera') ?? find(ruedaNodes, 'trascera') ?? find(ruedaNodes, 'trasero');
        const ruedaF = find(ruedaNodes, 'delantera') ?? find(ruedaNodes, 'delanero');

        // ── Reset EJE scale (Blender visual-only scale breaks attach math) ──
        // Then attach each RUEDA to its EJE so it spins around the axle center.
        [ejeR, ejeF].forEach(e => { if (e) { e.scale.set(1,1,1); e.updateMatrixWorld(true); }});

        // Update full subtree matrices before calling attach()
        outer.updateWorldMatrix(false, true);

        if (ejeR && ruedaR) { ejeR.attach(ruedaR); wheels.push(ejeR); }
        if (ejeF && ruedaF) { ejeF.attach(ruedaF); wheels.push(ejeF); frontWheel = ejeF; }

        // Fallback if names didn't match
        if (wheels.length === 0) {
          console.warn('[Moto] Nombres no coincidieron, buscando por índice');
          ejeNodes.forEach((e, i) => {
            e.scale.set(1,1,1); e.updateMatrixWorld(true);
            if (ruedaNodes[i]) { e.attach(ruedaNodes[i]); wheels.push(e); }
          });
          frontWheel = wheels[0] ?? null;
        }

        // ── Auto-scale so the motorcycle is ~2m long ─────────────────────────
        outer.updateWorldMatrix(false, true);
        const box = new THREE.Box3().setFromObject(inner);
        const sz  = box.getSize(new THREE.Vector3());
        const longest = Math.max(sz.x, sz.y, sz.z);
        if (longest > 0.01) inner.scale.setScalar(6.8 / longest);

        // ── Seat height (for rider Y offset) ─────────────────────────────────
        // We use a fixed constant (RIDER_HEIGHT) but log it for calibration
        if (seatNode) {
          const sp = new THREE.Vector3();
          seatNode.getWorldPosition(sp);
          // seatNode.y in inner-local space (after inner rotation only) = sp.y
          // (inner is a rotation-only group at outer origin)
        }

      } else {
        // ── Procedural fallback ───────────────────────────────────────────────
        isFallback = true;
        const fb = _buildFallback();
        outer.add(fb);
        wheels     = fb._fbWheels;
        frontWheel = fb._fbFront;
      }

      outer.position.set(spawn.x, 0, spawn.z);
      this.scene.add(outer);

      this.motos.set(spawn.id, {
        mesh:        outer,
        wheels,
        frontWheel,
        isFallback,
        riderId:     null,
        x: spawn.x, z: spawn.z,
        _targetRY:   0,
        _displayRY:  0,
        _lean:       0,
        _wheelRot:   0,
        _prevX:      spawn.x,
        _prevZ:      spawn.z,
        _speedFactor: 0,   // 0..1, drives acceleration ramp
        _turnRate:    0,   // rad/s angular momentum
        _drifting:    false,
        _driftTimer:  0,
        _driftSign:   1,
      });
    }
  }

  _createPrompt() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%);
      z-index:200; background:rgba(0,0,0,0.72); color:#fff;
      padding:8px 22px; border-radius:8px; font-size:14px; letter-spacing:0.04em;
      display:none; pointer-events:none; border:1px solid rgba(220,60,40,0.6);`;
    el.textContent = '[E] Subir a la moto';
    document.body.appendChild(el);
    return el;
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  isMounted()           { return this.myMotoId !== null; }
  isMountAnimating()    { return this._anim?.type === 'mount'; }
  getMotoHeading()      { const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null; return m?._displayRY ?? 0; }
  getMotoLean()         { const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null; return m?._lean ?? 0; }
  getSpeedFactor()      { const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null; return m?._speedFactor ?? 0; }

  startDrift() {
    const moto = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    if (!moto || moto._drifting || moto._speedFactor < 0.2) return false;
    moto._drifting   = true;
    moto._driftTimer = DRIFT_DURATION;
    moto._driftSign  = moto._lean >= 0 ? 1 : -1;
    return true;
  }
  speedMultiplier(spr) {
    const moto = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    const sf   = Math.max(0.15, moto?._speedFactor ?? 0);  // min 15% so it starts
    return SPEED_MULT * sf * (spr ? SPRINT_MULT : 1.0);
  }

  getRiderY() {
    const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    return (m?.mesh.position.y ?? 0) + RIDER_HEIGHT;
  }

  consumeMountLand() {
    const p = this._mountLandPos; this._mountLandPos = null; return p;
  }

  // ── Per-frame update ─────────────────────────────────────────────────────────

  update(playerPos, dt) {
    // Tick mount/dismount animation
    if (this._anim) {
      this._anim.t += dt / this._anim.dur;
      if (this._anim.t >= 1) {
        this._anim.t = 1;
        if (this._anim.type === 'mount')
          this._mountLandPos = { x: this._anim.toX, z: this._anim.toZ };
        this._anim = null;
      }
    }

    for (const [, moto] of this.motos) {
      // ── Heading via spring-damper toward _targetRY ────────────────────────
      let diff = moto._targetRY - moto._displayRY;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;

      const speedF    = Math.max(0, moto._speedFactor ?? 0);
      const stiffness = 6  + speedF * 10;
      const damping   = 4  + speedF * 6;
      moto._turnRate += (diff * stiffness - moto._turnRate * damping) * dt;
      moto._displayRY += moto._turnRate * dt;
      while (moto._displayRY >  Math.PI) moto._displayRY -= Math.PI * 2;
      while (moto._displayRY < -Math.PI) moto._displayRY += Math.PI * 2;

      // ── Lean = banking INTO the turn (heading error × speed) ─────────────
      if (moto._drifting) {
        moto._driftTimer -= dt;
        if (moto._driftTimer <= 0) moto._drifting = false;
        // Snap to full drift lean + spin heading fast
        const driftLeanTarget = moto._driftSign * DRIFT_LEAN;
        moto._lean += (driftLeanTarget - moto._lean) * Math.min(1, 22 * dt);
        moto._turnRate += moto._driftSign * 12 * dt;  // rear slides out
      } else {
        const leanTarget = Math.max(-LEAN_MAX, Math.min(LEAN_MAX, -diff * speedF * 2.8));
        moto._lean += (leanTarget - moto._lean) * Math.min(1, LEAN_SPEED * dt);
      }

      moto.mesh.rotation.y = moto._displayRY;
      moto.mesh.rotation.z = moto._lean;

      // Wheel spin — distance traveled this frame
      const dx  = moto.x - moto._prevX;
      const dz  = moto.z - moto._prevZ;
      const spd = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 0.001);
      moto._wheelRot += spd * dt * WHEEL_SPIN;

      for (const w of moto.wheels) {
        if (moto.isFallback) {
          w.rotation.x = moto._wheelRot;  // fallback: axle along X
        } else {
          w.rotation.z = moto._wheelRot;  // GLB: axle along Z (EJE scale.z largest)
        }
      }

      // Front wheel steering from lean
      if (moto.frontWheel) {
        if (moto.isFallback) {
          moto.frontWheel.rotation.y = -moto._lean * STEER_FACTOR;
        } else {
          // Steer around the pivot's Y axis (vertical in inner-local space)
          const prev = moto.frontWheel.rotation.z; // preserve spin
          moto.frontWheel.rotation.y = -moto._lean * STEER_FACTOR;
          moto.frontWheel.rotation.z = prev;
        }
      }

      moto._prevX = moto.x;
      moto._prevZ = moto.z;

      // Tire tracks when drifting
      if (moto._drifting) {
        this._trackTimer -= dt;
        if (this._trackTimer <= 0) {
          this._trackTimer = 0.055;
          this._emitTrack(moto);
        }
      }
    }

    // Fade + remove old tracks
    for (let i = this._tracks.length - 1; i >= 0; i--) {
      const t = this._tracks[i];
      t.age += dt;
      if (t.age > t.maxAge) {
        this.scene.remove(t.mesh);
        this._tracks.splice(i, 1);
      } else if (t.age > t.maxAge * 0.55) {
        t.mesh.material.opacity = 0.60 * (1 - (t.age - t.maxAge * 0.55) / (t.maxAge * 0.45));
      }
    }

    // Nearest free moto prompt
    if (this.myMotoId === null) {
      let nearest = null, bestD = MOUNT_RADIUS;
      for (const [id, moto] of this.motos) {
        if (moto.riderId !== null) continue;
        const dx = moto.x - playerPos.x, dz = moto.z - playerPos.z;
        const d  = Math.sqrt(dx * dx + dz * dz);
        if (d < bestD) { bestD = d; nearest = id; }
      }
      this._mountPrompt.style.display = nearest !== null ? 'block' : 'none';
      this._nearestMotoId = nearest;
    } else {
      this._mountPrompt.style.display = 'none';
    }
  }

  _emitTrack(moto) {
    const ry   = moto._displayRY;
    const perpX = Math.cos(ry), perpZ = -Math.sin(ry);
    for (const side of [-0.19, 0.19]) {
      const mat  = this._trackMat.clone();
      const mesh = new THREE.Mesh(this._trackGeo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = -ry;
      mesh.position.set(moto.x + perpX * side, 0.018, moto.z + perpZ * side);
      mesh.renderOrder = 1;
      this.scene.add(mesh);
      this._tracks.push({ mesh, age: 0, maxAge: 5.0 });
    }
    // Cap total segments
    while (this._tracks.length > 140) {
      this.scene.remove(this._tracks.shift().mesh);
    }
  }

  /** Update moto position to rider position and compute lean from turn rate */
  syncRiderPosition(x, z, moveAngle, sprinting) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;

    // ── Speed factor ramp-up (variable tau: fast start, slow to reach max) ──
    const dx0 = x - moto.x, dz0 = z - moto.z;
    const isMoving = Math.sqrt(dx0 * dx0 + dz0 * dz0) * 60 > 0.5;
    if (isMoving) {
      const tau   = 0.15 + 3.5 * moto._speedFactor;   // τ: 0.15s → 3.65s
      const alpha = 1 - Math.exp(-(1 / 60) / tau);
      moto._speedFactor = Math.min(1, moto._speedFactor + alpha * (1 - moto._speedFactor));
    } else {
      moto._speedFactor *= 0.85;   // quick decay when stopped
    }

    moto.x = x; moto.z = z;
    moto._targetRY = moveAngle;   // spring-damper in update() drives toward this
    // Offset moto mesh forward of rider so rider appears to sit toward the rear
    const ry = moto._displayRY;
    moto.mesh.position.set(
      x + Math.sin(ry) * SEAT_BACK_OFFSET,
      0,
      z + Math.cos(ry) * SEAT_BACK_OFFSET
    );
  }

  // ── Mount / dismount ─────────────────────────────────────────────────────────

  tryMount(playerId, startY, fromX, fromZ) {
    if (this.myMotoId !== null) { this._dismount(playerId); return null; }
    if (this._nearestMotoId === null) return null;
    return this._mount(this._nearestMotoId, playerId, startY, fromX, fromZ);
  }

  _mount(id, playerId, startY, fromX, fromZ) {
    const moto = this.motos.get(id);
    if (!moto || moto.riderId !== null) return null;
    moto.riderId  = playerId;
    this.myMotoId = id;
    this._nearestMotoId = null;
    this._lean = moto._lean = 0;
    this._prevAngle  = null;
    this._anim = {
      type: 'mount', t: 0,
      dur:   startY > 0.5 ? 0.18 : MOUNT_DUR,
      startY, fromX, fromZ,
      toX: moto.x, toZ: moto.z,
    };
    this.network.sendMotoMount(id);
    return { x: moto.x, z: moto.z };
  }

  _dismount(playerId) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;
    const ry    = moto._displayRY;
    const sideX = moto.x + Math.sin(ry + Math.PI / 2) * SIDE_DIST;
    const sideZ = moto.z + Math.cos(ry + Math.PI / 2) * SIDE_DIST;
    this._anim = {
      type: 'dismount', t: 0, dur: DISMOUNT_DUR,
      fromX: moto.x, fromZ: moto.z,
      toX: sideX, toZ: sideZ,
    };
    this.network.sendMotoDismount(this.myMotoId);
    moto.riderId  = null;
    this.myMotoId = null;
    this._lean    = 0;
    this._prevAngle = null;
  }

  // ── Animation helpers for main.js player-model arc ───────────────────────────

  getAnimY() {
    if (!this._anim) return null;
    const ts = this._anim.t * this._anim.t * (3 - 2 * this._anim.t);
    if (this._anim.type === 'mount')
      return this._anim.startY + (RIDER_HEIGHT - this._anim.startY) * ts
             + Math.sin(this._anim.t * Math.PI) * 0.35;
    return RIDER_HEIGHT * (1 - ts);
  }

  getMountModelPos() {
    if (!this._anim) return null;
    const ts = this._anim.t * this._anim.t * (3 - 2 * this._anim.t);
    return {
      x: this._anim.fromX + (this._anim.toX - this._anim.fromX) * ts,
      z: this._anim.fromZ + (this._anim.toZ - this._anim.fromZ) * ts,
    };
  }

  getDismountModelPos() {
    if (!this._anim || this._anim.type !== 'dismount') return null;
    return {
      x: this._anim.fromX + (this._anim.toX - this._anim.fromX) * this._anim.t,
      z: this._anim.fromZ + (this._anim.toZ - this._anim.fromZ) * this._anim.t,
    };
  }

  // ── Remote events ────────────────────────────────────────────────────────────

  onRemoteMount(motoId, riderId) {
    const m = this.motos.get(motoId); if (m) m.riderId = riderId;
  }
  onRemoteDismount(motoId) {
    const m = this.motos.get(motoId); if (m) { m.riderId = null; m._lean = 0; }
  }
  onRemoteMoved(motoId, x, z, ry) {
    const m = this.motos.get(motoId);
    if (!m) return;
    m.x = x; m.z = z;
    m.mesh.position.set(x, 0, z);
    m._targetRY = ry;
  }
}
