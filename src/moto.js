// --- Moto (Motorcycle) system — Rapier physics ---
// GLB structure (scene index 2):
//   CARROCERIA.003      — body mesh
//   RUEDA TRASCERA.002  — rear wheel mesh  (pivot ≠ axle center)
//   RUEDA DELANTERA.002 — front wheel mesh (pivot ≠ axle center)
//   EJE TRASERO.002     — rear axle EMPTY  at correct wheel center
//   EJE DELANERO .002   — front axle EMPTY at correct wheel center
//   LUGAR CONDUCTOR     — rider seat EMPTY
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ── Visual constants (unchanged) ─────────────────────────────────────────────
const MOUNT_RADIUS     = 4.0;
const RIDER_HEIGHT     = 0.82;
const MOUNT_DUR        = 0.25;
const DISMOUNT_DUR     = 0.35;
const SIDE_DIST        = 2.0;
const LEAN_MAX         = 0.55;
const LEAN_SPEED       = 11;
const LEAN_SPEED_DRIFT = 28;   // snap rápido al inclinar durante drift
const DRIFT_LEAN       = 1.25; // inclinación durante drift (moto + personaje)
const DRIFT_LEAN_RIDER = 1.55; // idem para el personaje (más agresivo visualmente)
const WHEEL_SPIN       = 3.0;
const STEER_FACTOR     = 1.6;
const SEAT_BACK_OFFSET = 0.7;

// ── Rapier physics constants ──────────────────────────────────────────────────
const PHY_MASS         = 180;    // kg
const PHY_THROTTLE     = 68000;  // N
const PHY_BRAKE        = 32000;  // N
const PHY_MAX_SPEED    = 85;     // m/s (cap speedFactor)
const PHY_MAX_REVERSE  = 10;     // m/s
const PHY_DRAG         = 12;     // resistencia aire (v²)
const PHY_ANG_DAMP     = 3.0;    // amortiguación angular Rapier
const PHY_STEER_TORQUE = 420;    // N·m torque dirección (A/D)
const PHY_STEER_SCALE  = 0.08;   // reducción torque a alta velocidad
const PHY_WHEELBASE    = 1.8;    // m distancia entre ejes
// Grip lateral: decrece con velocidad → understeer real a alta vel
const PHY_GRIP_LOW     = 12.0;   // /s a vel=0   (cancela ~19%/frame)
const PHY_GRIP_HIGH    =  3.0;   // /s a vel=max (cancela ~5%/frame)
// Handbrake: trasero libre, delantero con algo de grip para control
const PHY_DRIFT_FRONT  =  2.0;   // /s durante drift (cancela ~3%/frame)
const PHY_DRIFT_REAR   =  0.0;   // /s durante drift (trasero: sin grip)

// Fallback legacy constants (cuando Rapier no está listo aún)
const SPEED_MULT   = 5.0;
const SPRINT_MULT  = 1.25;

export const MOTO_SPAWNS = [
  { id: 0, x:  12, z: -58 },
  { id: 1, x: -50, z:  55 },
];

// ── GLB loader ────────────────────────────────────────────────────────────────
let _tplPromise = null;
function _loadTemplate() {
  if (_tplPromise) return _tplPromise;
  _tplPromise = new Promise(resolve => {
    new GLTFLoader().load('/models/MOTO.glb', gltf => {
      const src = gltf.scenes?.[2] ?? gltf.scene;
      resolve(src);
    }, undefined, () => resolve(null));
  });
  return _tplPromise;
}

// ── Fallback procedural moto ──────────────────────────────────────────────────
function _buildFallback() {
  const root = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.7, roughness: 0.3 });
  const met = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.15 });
  const blk = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.5, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 1.4), red);
  body.position.y = 0.72; body.castShadow = true; root.add(body);
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.55), red);
  tank.position.set(0, 1.02, -0.14); root.add(tank);
  const wheels = [], frontPivot = new THREE.Group(), rearPivot = new THREE.Group();
  [[rearPivot, 0.62], [frontPivot, -0.62]].forEach(([piv, z]) => {
    piv.position.set(0, 0.33, z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.14, 24), blk);
    tire.rotation.z = Math.PI / 2; piv.add(tire);
    root.add(piv); wheels.push(piv);
  });
  root._fbWheels   = wheels;
  root._fbFront    = frontPivot;
  root._isFallback = true;
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
    this._mountPrompt   = this._createPrompt();
    this._anim          = null;
    this._mountLandPos  = null;
    this._lean          = 0;

    // Tire tracks — dos huellas paralelas (rueda izq y der)
    this._trackGeo   = new THREE.PlaneGeometry(0.11, 0.42);
    this._trackMat   = new THREE.MeshBasicMaterial({ color: 0x080603, transparent: true, opacity: 0.80, depthWrite: false });
    this._tracks     = [];
    this._trackTimer = 0;

    // ── Rapier physics state ──────────────────────────────────────────────────
    this._RAPIER      = null;   // módulo Rapier (listo tras init async)
    this._phyWorld    = null;   // RAPIER.World activo
    this._phyBody     = null;   // RigidBody de la moto
    this._phyAccum    = 0;
    this._phySpeed    = 0;      // velocidad forward actual (m/s)
    this._phyLeanVel  = 0;      // velocidad angular Y (para visual lean)
    this._steerAngle  = 0;      // ángulo actual del manillar (rad)

    this._initRapier();
    this._init();
  }

  // ── Cargar módulo Rapier (async WASM) ─────────────────────────────────────
  async _initRapier() {
    try {
      const R = await import('@dimforge/rapier3d-compat');
      await R.init();
      this._RAPIER = R;
      console.log('[Moto] Rapier physics ready ✓');
    } catch (e) {
      console.warn('[Moto] Rapier no disponible, usando física legacy:', e);
    }
  }

  // ── Crear mundo físico al montar ──────────────────────────────────────────
  _createPhysics(x, z, ry) {
    if (!this._RAPIER) { console.warn('[Moto] Rapier aún no listo'); return; }
    const R = this._RAPIER;
    try {
      this._phyWorld   = new R.World({ x: 0, y: -9.81, z: 0 });
      this._phyAccum   = 0;
      this._phySpeed   = 0;
      this._phyLeanVel = 0;

      // Suelo: rigid body fijo con un cubo muy plano y grande
      const groundRb = this._phyWorld.createRigidBody(
        R.RigidBodyDesc.fixed().setTranslation(0, -0.1, 0)
      );
      this._phyWorld.createCollider(
        R.ColliderDesc.cuboid(1000, 0.1, 1000).setFriction(0.8),
        groundRb
      );

      // Cuerpo rígido del chasis
      const bodyDesc = R.RigidBodyDesc.dynamic()
        .setTranslation(x, 0.45, z)
        .setLinearDamping(0)
        .setAngularDamping(PHY_ANG_DAMP);
      this._phyBody = this._phyWorld.createRigidBody(bodyDesc);

      // Bloquear rotaciones X y Z — la moto no se cae
      this._phyBody.setEnabledRotations(false, true, false, true);

      // Orientación inicial
      const halfRy = ry / 2;
      this._phyBody.setRotation(
        { x: 0, y: Math.sin(halfRy), z: 0, w: Math.cos(halfRy) }, true
      );

      // Colisionador del chasis (half-extents: 0.25 ancho, 0.35 alto, 1.0 largo)
      this._phyWorld.createCollider(
        R.ColliderDesc.cuboid(0.25, 0.35, 1.0)
          .setMass(PHY_MASS)
          .setFriction(0.6)
          .setRestitution(0.0),
        this._phyBody
      );
      console.log('[Moto] Physics body created at', x.toFixed(1), z.toFixed(1));
    } catch(e) {
      console.error('[Moto] _createPhysics falló:', e);
      this._phyWorld = null;
      this._phyBody  = null;
    }
  }

  _destroyPhysics() {
    this._phyWorld   = null;
    this._phyBody    = null;
    this._phyAccum   = 0;
    this._phySpeed   = 0;
    this._steerAngle = 0;
  }

  // ── Paso de física Rapier ─────────────────────────────────────────────────
  // Arquitectura:
  //   ANTES del step: throttle, brake, steering torque, drag
  //   DESPUÉS del step: corrección lateral en puntos de contacto (front/rear)
  //     → descompuesta en Δv_cm + Δω  (sin fuerzas explosivas)
  //     → la asimetría front≠rear durante handbrake crea la rotación del derrape
  stepRapier(keys, dt, sprinting, isDrifting) {
    if (!this._phyBody || !this._phyWorld) return null;

    const body  = this._phyBody;
    const world = this._phyWorld;
    const HALF  = PHY_WHEELBASE * 0.5;  // 0.9 m

    // ── Estado ────────────────────────────────────────────────────────────
    const rot    = body.rotation();
    const ry     = 2 * Math.atan2(rot.y, rot.w);
    const fwdX   = Math.sin(ry), fwdZ = Math.cos(ry);
    const vel    = body.linvel();
    const omega  = body.angvel().y;
    const fwdSpd = vel.x * fwdX + vel.z * fwdZ;
    const absSpd = Math.abs(fwdSpd);

    // ── Aceleración / Frenado ──────────────────────────────────────────────
    const throttle = PHY_THROTTLE * (sprinting ? 1.4 : 1.0) * dt;
    const brakeF   = PHY_BRAKE * dt;
    if (keys.w && fwdSpd < PHY_MAX_SPEED)
      body.applyImpulse({ x: fwdX * throttle, y: 0, z: fwdZ * throttle }, true);
    if (keys.s) {
      if (fwdSpd > 0.3)
        body.applyImpulse({ x: -fwdX * brakeF, y: 0, z: -fwdZ * brakeF }, true);
      else if (fwdSpd > -PHY_MAX_REVERSE)
        body.applyImpulse({ x: -fwdX * throttle * 0.25, y: 0, z: -fwdZ * throttle * 0.25 }, true);
    }

    // ── Dirección: torque en Y, decrece con velocidad ─────────────────────
    const steerT = PHY_STEER_TORQUE * dt / (1 + absSpd * PHY_STEER_SCALE);
    if (keys.a) body.applyTorqueImpulse({ x: 0, y:  steerT, z: 0 }, true);
    if (keys.d) body.applyTorqueImpulse({ x: 0, y: -steerT, z: 0 }, true);
    // Retorno angular suave cuando no hay input
    if (!keys.a && !keys.d)
      body.applyTorqueImpulse({ x: 0, y: -omega * 180 * dt, z: 0 }, true);

    // ── Resistencia de aire ────────────────────────────────────────────────
    const dragImp = -Math.sign(fwdSpd) * PHY_DRAG * absSpd * absSpd * dt;
    body.applyImpulse({ x: fwdX * dragImp, y: 0, z: fwdZ * dragImp }, true);

    // ── Paso físico ────────────────────────────────────────────────────────
    world.timestep = Math.min(dt, 1 / 30);
    world.step();

    // ── Corrección lateral post-step: front/rear por separado ─────────────
    // Usamos setLinvel + setAngvel en vez de fuerzas → sin riesgo de explosión.
    // La KEY del derrape: front sigue teniendo grip, rear = 0 durante handbrake
    // → front corrige más → diferencia crea Δω = rotación natural del cuerpo.
    const vp   = body.linvel();
    const rp   = body.rotation();
    const ryP  = 2 * Math.atan2(rp.y, rp.w);
    const fXP  = Math.sin(ryP), fZP = Math.cos(ryP);
    const rXP  = Math.cos(ryP), rZP = -Math.sin(ryP);
    const omP  = body.angvel().y;
    const aSP  = Math.abs(vp.x * fXP + vp.z * fZP);

    // Grip rate /s: disminuye con la velocidad (más grip = más grip a baja vel)
    const speedR  = Math.min(1, aSP / PHY_MAX_SPEED);
    const gripNrm = PHY_GRIP_LOW + (PHY_GRIP_HIGH - PHY_GRIP_LOW) * speedR;

    const fGripF = Math.min(1, (isDrifting ? PHY_DRIFT_FRONT : gripNrm) * dt);
    const rGripF = Math.min(1, (isDrifting ? PHY_DRIFT_REAR  : gripNrm) * dt);

    // Velocidad lateral en cada contacto
    // v_front = v_cm + ω × r_front  →  lat = v · right
    // fLat = (omP * HALF) siempre  (demostrable analíticamente)
    const fLat = (vp.x + omP * fZP * HALF) * rXP + (vp.z - omP * fXP * HALF) * rZP;
    const rLat = (vp.x - omP * fZP * HALF) * rXP + (vp.z + omP * fXP * HALF) * rZP;

    // Corrección de velocidad en cada rueda
    const fDv = -fLat * fGripF;
    const rDv = -rLat * rGripF;

    // Descomponer en Δv_cm y Δω
    const dvCm   = (fDv + rDv) * 0.5;
    const domega = (fDv - rDv) / (2 * HALF);

    body.setLinvel(
      { x: vp.x + rXP * dvCm, y: vp.y, z: vp.z + rZP * dvCm }, true
    );
    body.setAngvel({ x: 0, y: omP + domega, z: 0 }, true);

    // ── Clamp Y ────────────────────────────────────────────────────────────
    const pos = body.translation();
    if (pos.y < 0.38) body.setTranslation({ x: pos.x, y: 0.38, z: pos.z }, true);

    // ── Salida ─────────────────────────────────────────────────────────────
    const fv  = body.linvel();
    const fr  = body.rotation();
    const fRy = 2 * Math.atan2(fr.y, fr.w);
    const fSpd = fv.x * Math.sin(fRy) + fv.z * Math.cos(fRy);
    this._phySpeed   = fSpd;
    this._phyLeanVel = body.angvel().y;

    return {
      x: pos.x, z: pos.z, ry: fRy,
      speedFactor: Math.min(1, Math.abs(fSpd) / PHY_MAX_SPEED),
      speed: fSpd, angVelY: this._phyLeanVel,
    };
  }

  // ── Init GLB + moto objects ───────────────────────────────────────────────
  async _init() {
    const tpl = await _loadTemplate();

    for (const spawn of MOTO_SPAWNS) {
      const outer = new THREE.Group();
      let wheels = [], frontWheel = null, isFallback = false;

      if (tpl) {
        const inner = new THREE.Group();
        inner.rotation.y = Math.PI / 2;
        outer.add(inner);

        const clone = tpl.clone(true);
        clone.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });

        clone.traverse(o => {
          if (!o.isMesh || !o.material) return;
          const meshName = o.name.toLowerCase();
          const isWheel  = meshName.includes('rueda') || meshName.includes('tire') || meshName.includes('wheel');
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => {
            if (!m.color) return;
            const { r, g, b } = m.color;
            if (!isWheel && r + g + b < 0.25 && (m.roughness ?? 1) > 0.2) {
              m.roughness = 0.02; m.metalness = 0.15; m.envMapIntensity = 2.0;
            }
            if (r > 0.35 && r > g * 1.8 && r > b * 1.8) {
              m.metalness = Math.max(m.metalness ?? 0, 0.5);
              m.roughness = Math.min(m.roughness ?? 1, 0.35);
              m.envMapIntensity = Math.max(m.envMapIntensity ?? 1, 1.8);
            }
          });
        });

        inner.add(clone);

        const ejeNodes = [], ruedaNodes = [];
        clone.traverse(o => {
          const n = o.name.toLowerCase();
          if (n.includes('eje'))   ejeNodes.push(o);
          if (n.includes('rueda')) ruedaNodes.push(o);
        });

        const find = (arr, kw) => arr.find(o => o.name.toLowerCase().includes(kw)) ?? null;
        const ejeR  = find(ejeNodes,   'trasero');
        const ejeF  = find(ejeNodes,   'delanero') ?? find(ejeNodes, 'delantera');
        const ruedaR = find(ruedaNodes, 'trasera') ?? find(ruedaNodes, 'trascera') ?? find(ruedaNodes, 'trasero');
        const ruedaF = find(ruedaNodes, 'delantera') ?? find(ruedaNodes, 'delanero');

        [ejeR, ejeF].forEach(e => { if (e) { e.scale.set(1,1,1); e.updateMatrixWorld(true); }});
        outer.updateWorldMatrix(false, true);

        if (ejeR && ruedaR) { ejeR.attach(ruedaR); wheels.push(ejeR); }
        if (ejeF && ruedaF) { ejeF.attach(ruedaF); wheels.push(ejeF); frontWheel = ejeF; }

        if (wheels.length === 0) {
          ejeNodes.forEach((e, i) => {
            e.scale.set(1,1,1); e.updateMatrixWorld(true);
            if (ruedaNodes[i]) { e.attach(ruedaNodes[i]); wheels.push(e); }
          });
          frontWheel = wheels[0] ?? null;
        }

        outer.updateWorldMatrix(false, true);
        const box = new THREE.Box3().setFromObject(inner);
        const sz  = box.getSize(new THREE.Vector3());
        const longest = Math.max(sz.x, sz.y, sz.z);
        if (longest > 0.01) inner.scale.setScalar(6.8 / longest);

      } else {
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
        // Legacy speed factor (fallback)
        _speedFactor: 0,
        _turnRate:    0,
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

  // ── Public API ────────────────────────────────────────────────────────────
  isMounted()        { return this.myMotoId !== null; }
  isMountAnimating() { return this._anim?.type === 'mount'; }
  isRapierActive()   { return !!this._phyBody; }

  getMotoHeading() {
    if (this._phyBody) {
      const rot = this._phyBody.rotation();
      return 2 * Math.atan2(rot.y, rot.w);
    }
    const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    return m?._displayRY ?? 0;
  }

  getMotoLean() {
    const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    if (!m) return 0;
    // Durante drift el personaje amplifica el lean de la moto
    if (m._drifting && Math.abs(m._lean) > 0.01)
      return m._lean * (DRIFT_LEAN_RIDER / DRIFT_LEAN);
    return m._lean;
  }

  getSpeedFactor() {
    if (this._phyBody) return Math.min(1, Math.abs(this._phySpeed) / PHY_MAX_SPEED);
    const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    return m?._speedFactor ?? 0;
  }

  // Cuando Rapier está activo, devolver 0 para que controls no mueva al player
  speedMultiplier(spr) {
    if (this._phyBody) return 0;
    const moto = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    const sf   = Math.max(0.15, moto?._speedFactor ?? 0);
    return SPEED_MULT * sf * (spr ? SPRINT_MULT : 1.0);
  }

  startDrift() {
    const moto = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    if (!moto) return false;
    if (this._phyBody) {
      moto._drifting   = true;
      moto._driftTimer = 1.6;
      // Signo: angVelY>0 = girando izq → lean izq (negativo)
      moto._driftSign  = this._phyLeanVel > 0.05 ? -1
                       : this._phyLeanVel < -0.05 ? 1
                       : moto._lean <= 0 ? -1 : 1;

      // Pequeño kick lateral para iniciar el derrape
      const rot  = this._phyBody.rotation();
      const ry2  = 2 * Math.atan2(rot.y, rot.w);
      const rkX  = Math.cos(ry2), rkZ = -Math.sin(ry2);
      this._phyBody.applyImpulse(
        { x: rkX * 600 * moto._driftSign, y: 0, z: rkZ * 600 * moto._driftSign }, true
      );

      return true;
    }
    if (moto._drifting || moto._speedFactor < 0.2) return false;
    moto._drifting   = true;
    moto._driftTimer = 1.2;
    moto._driftSign  = moto._lean >= 0 ? 1 : -1;
    return true;
  }

  getRiderY() {
    const m = this.myMotoId !== null ? this.motos.get(this.myMotoId) : null;
    return (m?.mesh.position.y ?? 0) + RIDER_HEIGHT;
  }

  consumeMountLand() {
    const p = this._mountLandPos; this._mountLandPos = null; return p;
  }

  // ── Per-frame visual update ───────────────────────────────────────────────
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

    for (const [id, moto] of this.motos) {
      const isMyMoto = id === this.myMotoId;

      if (isMyMoto && this._phyBody) {
        // ── Con Rapier: leer posición del body ──────────────────────────────
        const pos    = this._phyBody.translation();
        const rot    = this._phyBody.rotation();
        const phyRy  = 2 * Math.atan2(rot.y, rot.w);

        moto.x = pos.x; moto.z = pos.z;
        moto._displayRY = phyRy;

        // Decrement drift timer
        if (moto._drifting) {
          moto._driftTimer -= dt;
          if (moto._driftTimer <= 0) moto._drifting = false;
        }

        // Lean visual — basado en angVelY y velocidad forward
        const absSpd    = Math.min(1, Math.abs(this._phySpeed) / PHY_MAX_SPEED);
        const leanTgt   = moto._drifting
          ? moto._driftSign * DRIFT_LEAN
          : Math.max(-LEAN_MAX, Math.min(LEAN_MAX, -this._phyLeanVel * absSpd * 1.8));
        // Durante drift: snap rápido a la inclinación máxima
        const leanSpd = moto._drifting ? LEAN_SPEED_DRIFT : LEAN_SPEED;
        moto._lean += (leanTgt - moto._lean) * Math.min(1, leanSpd * dt);

        moto.mesh.position.set(
          pos.x + Math.sin(phyRy) * SEAT_BACK_OFFSET,
          0,
          pos.z + Math.cos(phyRy) * SEAT_BACK_OFFSET,
        );
        moto.mesh.rotation.y = phyRy;
        moto.mesh.rotation.z = moto._lean;

      } else {
        // ── Legacy: spring-damper sobre _targetRY ───────────────────────────
        let diff = moto._targetRY - moto._displayRY;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        const speedF    = Math.max(0, moto._speedFactor ?? 0);
        const stiffness = 3 + speedF * 5;
        const damping   = 3 + speedF * 8;
        moto._turnRate += (diff * stiffness - moto._turnRate * damping) * dt;
        moto._displayRY += moto._turnRate * dt;
        while (moto._displayRY >  Math.PI) moto._displayRY -= Math.PI * 2;
        while (moto._displayRY < -Math.PI) moto._displayRY += Math.PI * 2;

        if (moto._drifting) {
          moto._driftTimer -= dt;
          if (moto._driftTimer <= 0) moto._drifting = false;
          const driftLeanTgt = moto._driftSign * DRIFT_LEAN;
          moto._lean += (driftLeanTgt - moto._lean) * Math.min(1, 22 * dt);
          moto._turnRate += moto._driftSign * 12 * dt;
        } else {
          const leanTarget = Math.max(-LEAN_MAX, Math.min(LEAN_MAX, -diff * speedF * 2.8));
          moto._lean += (leanTarget - moto._lean) * Math.min(1, LEAN_SPEED * dt);
        }

        moto.mesh.rotation.y = moto._displayRY;
        moto.mesh.rotation.z = moto._lean;
      }

      // ── Ruedas: giro y dirección ─────────────────────────────────────────
      const dx  = moto.x - moto._prevX;
      const dz  = moto.z - moto._prevZ;
      const spd = Math.sqrt(dx * dx + dz * dz) / Math.max(dt, 0.001);
      moto._wheelRot += spd * dt * WHEEL_SPIN;

      for (const w of moto.wheels) {
        if (moto.isFallback) w.rotation.x = moto._wheelRot;
        else                 w.rotation.z = moto._wheelRot;
      }

      if (moto.frontWheel) {
        const steerAngle = -moto._lean * STEER_FACTOR;
        if (moto.isFallback) {
          moto.frontWheel.rotation.y = steerAngle;
        } else {
          const prevSpin = moto.frontWheel.rotation.z;
          moto.frontWheel.rotation.y = steerAngle;
          moto.frontWheel.rotation.z = prevSpin;
        }
      }

      moto._prevX = moto.x;
      moto._prevZ = moto.z;

      // Tire tracks during drift
      if (moto._drifting) {
        this._trackTimer -= dt;
        if (this._trackTimer <= 0) {
          this._trackTimer = 0.022;
          const mvDx = moto.x - moto._prevX;
          const mvDz = moto.z - moto._prevZ;
          const moveAngle = (Math.abs(mvDx) + Math.abs(mvDz) > 0.0001)
            ? Math.atan2(mvDx, mvDz)
            : moto._displayRY;
          this._emitTrack(moto, moveAngle);
        }
      }
    }

    // Fade tracks
    for (let i = this._tracks.length - 1; i >= 0; i--) {
      const t = this._tracks[i];
      t.age += dt;
      if (t.age > t.maxAge) {
        this.scene.remove(t.mesh);
        this._tracks.splice(i, 1);
      } else if (t.age > t.maxAge * 0.65) {
        t.mesh.material.opacity = 0.80 * (1 - (t.age - t.maxAge * 0.65) / (t.maxAge * 0.35));
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

  _emitTrack(moto, moveAngle) {
    const HALF_WB   = 0.62;
    const AXLE_HALF = 0.16; // semidistancia entre las dos huellas
    const ry   = moto._displayRY;
    const fwdX = Math.sin(ry), fwdZ = Math.cos(ry);
    const rtX  = Math.cos(ry), rtZ  = -Math.sin(ry);
    const rearX = moto.mesh.position.x - fwdX * HALF_WB;
    const rearZ = moto.mesh.position.z - fwdZ * HALF_WB;

    // Dos huellas paralelas (rueda izq y der del eje trasero)
    for (const side of [-1, 1]) {
      const tx  = rearX + rtX * AXLE_HALF * side;
      const tz  = rearZ + rtZ * AXLE_HALF * side;
      const mat = this._trackMat.clone();
      const mesh = new THREE.Mesh(this._trackGeo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = -moveAngle;
      mesh.position.set(tx, 0.019, tz);
      mesh.renderOrder = 1;
      this.scene.add(mesh);
      this._tracks.push({ mesh, age: 0, maxAge: 9.0 });
    }
    while (this._tracks.length > 280) this.scene.remove(this._tracks.shift().mesh);
  }

  // ── syncRiderPosition (legacy fallback — solo cuando Rapier no está listo) ─
  syncRiderPosition(x, z, moveAngle, sprinting) {
    if (this.myMotoId === null) return;
    const moto = this.motos.get(this.myMotoId);
    if (!moto) return;
    const dx0 = x - moto.x, dz0 = z - moto.z;
    const isMoving = Math.sqrt(dx0 * dx0 + dz0 * dz0) * 60 > 0.5;
    if (isMoving) {
      const tau   = 0.4 + 5.0 * moto._speedFactor;
      const alpha = 1 - Math.exp(-(1 / 60) / tau);
      moto._speedFactor = Math.min(1, moto._speedFactor + alpha * (1 - moto._speedFactor));
    } else {
      moto._speedFactor *= 0.92;
    }
    moto.x = x; moto.z = z;
    moto._targetRY = moveAngle;
    const ry = moto._displayRY;
    moto.mesh.position.set(
      x + Math.sin(ry) * SEAT_BACK_OFFSET, 0,
      z + Math.cos(ry) * SEAT_BACK_OFFSET,
    );
  }

  // ── Mount / Dismount ──────────────────────────────────────────────────────
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

    // Crear física Rapier con la orientación actual de la moto
    this._createPhysics(moto.x, moto.z, moto._displayRY);

    this._anim = {
      type: 'mount', t: 0,
      dur:  startY > 0.5 ? 0.18 : MOUNT_DUR,
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

    // Destruir cuerpo físico
    this._destroyPhysics();

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

  // ── Animation helpers ─────────────────────────────────────────────────────
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

  // ── Remote events ─────────────────────────────────────────────────────────
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
