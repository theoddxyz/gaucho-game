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

const MOUNT_RADIUS = 4.0;
const SPEED_MULT   = 2.4;
const SPRINT_MULT  = 1.35;
const RIDER_HEIGHT = 0.82;   // seat height above ground (m)
const MOUNT_DUR    = 0.25;
const DISMOUNT_DUR = 0.35;
const SIDE_DIST    = 2.0;
const LEAN_MAX     = 0.28;   // ~16°
const LEAN_SPEED   = 6;
const WHEEL_SPIN   = 3.0;    // rad per (m traveled)
const STEER_FACTOR = 1.4;    // front wheel steer multiplier from lean

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
    this._nearestId    = null;
    this._mountPrompt  = this._createPrompt();
    this._anim         = null;
    this._mountLandPos = null;
    this._lean         = 0;
    this._prevAngle    = null;
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
        const ruedaR = find(ruedaNodes, 'trasera')  ?? find(ruedaNodes, 'trasero');
        const ruedaF = find(ruedaNodes, 'delantera')?? find(ruedaNodes, 'delanero');

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
        if (longest > 0.01) inner.scale.setScalar(2.0 / longest);

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
        mesh:       outer,
        wheels,
        frontWheel,
        isFallback,
        riderId:    null,
        x: spawn.x, z: spawn.z,
        _targetRY:  0,
        _displayRY: 0,
        _lean:      0,
        _wheelRot:  0,
        _prevX:     spawn.x,
        _prevZ:     spawn.z,
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
  speedMultiplier(spr)  { return SPEED_MULT * (spr ? SPRINT_MULT : 1.0); }

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
      // Smooth heading rotation
      let diff = moto._targetRY - moto._displayRY;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      moto._displayRY += diff * Math.min(1, 8 * dt);
      moto.mesh.rotation.y = moto._displayRY;

      // Lean
      moto.mesh.rotation.z = -moto._lean;

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
      this._nearestId = nearest;
    } else {
      this._mountPrompt.style.display = 'none';
    }
  }

  /** Update moto position to rider position and compute lean from turn rate */
  syncRiderPosition(x, z, moveAngle, sprinting) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;

    if (this._prevAngle !== null) {
      let delta = moveAngle - this._prevAngle;
      while (delta >  Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      const dx = x - moto.x, dz = z - moto.z;
      const spd = Math.sqrt(dx * dx + dz * dz) * 60;
      const target = Math.max(-LEAN_MAX, Math.min(LEAN_MAX,
        delta * Math.max(1, spd * 0.35)));
      moto._lean += (target - moto._lean) * Math.min(1, LEAN_SPEED / 60);
    }
    this._prevAngle = moveAngle;

    moto.x = x; moto.z = z;
    moto.mesh.position.set(x, 0, z);
    moto._targetRY = moveAngle + Math.PI;  // same convention as horse
  }

  // ── Mount / dismount ─────────────────────────────────────────────────────────

  tryMount(playerId, startY, fromX, fromZ) {
    if (this.myMotoId !== null) { this._dismount(playerId); return null; }
    if (this._nearestId === null) return null;
    return this._mount(this._nearestId, playerId, startY, fromX, fromZ);
  }

  _mount(id, playerId, startY, fromX, fromZ) {
    const moto = this.motos.get(id);
    if (!moto || moto.riderId !== null) return null;
    moto.riderId  = playerId;
    this.myMotoId = id;
    this._nearestId  = null;
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
    m._targetRY = ry + Math.PI;
  }
}
