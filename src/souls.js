// souls.js — Dual Reality simulation (ported from A/B)
// metaPos = plano abstracto del "alma" (META_W × META_H)
// terraPos = posición física en el mundo 3D (x,y → THREE x,z)

import * as THREE from 'three';

// ─── Meta plane ───────────────────────────────────────────────────────────────
export const META_W = 600;
export const META_H = 800;

// ─── Terra bounds (zona del pueblo) ──────────────────────────────────────────
const TERRA_XMIN = -80, TERRA_XMAX = 120;
const TERRA_YMIN = -110, TERRA_YMAX = 110;

// ─── Destinos 3D (terraPos.y = 3D z) ─────────────────────────────────────────
export const DEST = {
  OFFERING:  { x:   1, y:  37  },  // iglesia
  SHARING:   { x:  33, y: -68  },  // cabildo/townhall
  BAR:       { x: 110, y:  100 },  // shack/pulpería
};

// ─── Casas y chacras (por houseId) ────────────────────────────────────────────
export const HOUSES = [
  { pos: { x: -41, y:  13 }, farm: { x: -59, y:  13 } },  // Ramón
  { pos: { x: -40, y: -33 }, farm: { x: -58, y: -34 } },  // Ofelia
  { pos: { x:  37, y: -28 }, farm: { x:  55, y: -28 } },  // Facundo
  { pos: { x:  40, y:  15 }, farm: { x:  58, y:  14 } },  // Celestino
  { pos: { x: -33, y: -71 }, farm: { x: -51, y: -72 } },  // Zulma
];

// ─── Vector math (igual que A/B) ──────────────────────────────────────────────
export const vec = {
  add:    (a, b)   => ({ x: a.x + b.x, y: a.y + b.y }),
  sub:    (a, b)   => ({ x: a.x - b.x, y: a.y - b.y }),
  mul:    (a, s)   => ({ x: a.x * s,   y: a.y * s   }),
  div:    (a, s)   => ({ x: a.x / s,   y: a.y / s   }),
  mag:    (a)      => Math.sqrt(a.x * a.x + a.y * a.y),
  norm:   (a)      => { const m = vec.mag(a); return m > 0 ? vec.div(a, m) : { x: 0, y: 0 }; },
  setMag: (a, m)   => vec.mul(vec.norm(a), m),
  limit:  (a, max) => { const m = vec.mag(a); return m > max ? vec.setMag(a, max) : { ...a }; },
  dist:   (a, b)   => vec.mag(vec.sub(a, b)),
};

// ─── Boids flocking (igual que A/B) ───────────────────────────────────────────
function calcFlocking(unit, neighbors, cfg) {
  let sep = { x: 0, y: 0 }, ali = { x: 0, y: 0 }, coh = { x: 0, y: 0 };
  let sc = 0, ac = 0, cc = 0;

  for (const o of neighbors) {
    if (!o || o.id === unit.id) continue;
    const d = vec.dist(unit.metaPos, o.metaPos);
    if (d > 0 && d < cfg.sepDist) {
      sep = vec.add(sep, vec.div(vec.norm(vec.sub(unit.metaPos, o.metaPos)), d));
      sc++;
    }
    if (d > 0 && d < cfg.aliDist) { ali = vec.add(ali, o.metaVel); ac++; }
    if (d > 0 && d < cfg.cohDist) { coh = vec.add(coh, o.metaPos); cc++; }
  }

  if (sc > 0) {
    sep = vec.div(sep, sc);
    sep = vec.limit(vec.sub(vec.setMag(sep, unit.maxSpeed), unit.metaVel), unit.maxForce);
  }
  if (ac > 0) {
    ali = vec.div(ali, ac);
    ali = vec.limit(vec.sub(vec.setMag(ali, unit.maxSpeed), unit.metaVel), unit.maxForce);
  }
  if (cc > 0) {
    coh = vec.div(coh, cc);
    coh = vec.limit(vec.sub(vec.setMag(vec.sub(coh, unit.metaPos), unit.maxSpeed), unit.metaVel), unit.maxForce);
  }

  return vec.add(
    vec.add(vec.mul(sep, cfg.sepWeight), vec.mul(ali, cfg.aliWeight)),
    vec.mul(coh, cfg.cohWeight)
  );
}

// ─── Brownian noise Box-Muller (igual que A/B) ────────────────────────────────
function brownian(sigma) {
  const u1 = Math.max(1e-10, Math.random()), u2 = Math.random();
  const r = Math.sqrt(-2 * Math.log(u1));
  return {
    x: r * Math.cos(2 * Math.PI * u2) * sigma,
    y: r * Math.sin(2 * Math.PI * u2) * sigma,
  };
}

// ─── Intención desde metaPos (igual que A/B) ──────────────────────────────────
export function getIntention(mp) {
  const exIndiv = mp.x < META_W * 0.075;
  const exGroup = mp.x > META_W * 0.925;
  const exTrans = mp.y < META_H * 0.15;
  const exMat   = mp.y > META_H * 0.85;
  if ((exIndiv || exGroup) && !exTrans && !exMat) return 'BAR';
  const isTop   = mp.y < META_H / 2;
  const isRight = mp.x > META_W / 2;
  if ( isTop &&  isRight) return 'OFFERING';
  if ( isTop && !isRight) return 'HOARDING';
  if (!isTop &&  isRight) return 'SHARING';
  return 'CONSUMING';
}

// ─── Helper: obtener puerta de destino ────────────────────────────────────────
function getDoor(bKey, houseId) {
  if (bKey === 'HOUSE' || bKey === 'HOARDING' || bKey === 'SLEEPING') return HOUSES[houseId].pos;
  if (bKey === 'CONSUMING') return HOUSES[houseId].farm;
  if (bKey === 'OFFERING')  return DEST.OFFERING;
  if (bKey === 'SHARING')   return DEST.SHARING;
  if (bKey === 'BAR')       return DEST.BAR;
  return HOUSES[houseId].pos;
}

// ─── Recurso 3D: atado de trigo ───────────────────────────────────────────────
const _resMat  = new THREE.MeshStandardMaterial({ color: 0xC89420, emissive: 0x4a3008, roughness: 0.85 });
const _resMat2 = new THREE.MeshStandardMaterial({ color: 0xDDAA28, emissive: 0x503810, roughness: 0.80 });
// Atado de trigo: cilindro central + cuatro "espigas" inclinadas alrededor
function _buildWheatMesh() {
  const grp = new THREE.Group();
  // Paja central (tallo del atado)
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.50, 5), _resMat.clone());
  stalk.castShadow = true;
  grp.add(stalk);
  // Cuatro espigas inclinadas
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.34, 4), _resMat2.clone());
    s.castShadow = true;
    s.position.set(Math.cos(ang) * 0.07, 0.14, Math.sin(ang) * 0.07);
    s.rotation.z = (Math.random() > 0.5 ? 1 : -1) * 0.28;
    s.rotation.x = Math.cos(ang) * 0.20;
    grp.add(s);
  }
  return grp;
}

// ─── Helpers para contexto de chat ───────────────────────────────────────────
function _intentionLabel(intention) {
  const map = {
    OFFERING:  'trascendente y colectivo',
    HOARDING:  'trascendente pero solitario',
    SHARING:   'material y generoso',
    CONSUMING: 'material y egoísta',
    BAR:       'rebelde, sin ataduras',
  };
  return map[intention] || intention;
}

function _calcTrayectoria(u) {
  const h = u.history;
  if (!h || h.length < 3) return 'estable';
  const first = h[0], last = h[h.length - 1];
  const dx = last.x - first.x, dy = last.y - first.y;
  if (Math.sqrt(dx * dx + dy * dy) < 15) return 'estable';
  const toGroup = dx > 0, toTrans = dy < 0;
  if ( toGroup &&  toTrans) return 'abriéndose al grupo y a lo espiritual';
  if (!toGroup &&  toTrans) return 'buscando trascendencia en soledad';
  if ( toGroup && !toTrans) return 'abriéndose a compartir lo material';
  return 'cayendo hacia el consumo propio';
}

// ─── SoulSystem ───────────────────────────────────────────────────────────────
export class SoulSystem {
  constructor(scene) {
    this._scene     = scene;
    this._resMeshes = new Map();   // resourceId → THREE.Mesh
    this._resources = [];
    this._spawnTimer = 0;

    this._stocks = {
      OFFERING:  10,
      SHARING:   10,
      CONSUMING: 10,
      BAR:       10,
      HOUSES:    [10, 10, 10, 10, 10],
    };

    this._time = { hour: 12, day: 1, month: 0, year: 1, totalSeconds: 12 };

    // Guardian (invisible, solo lógica)
    this._guardianPos = { x: META_W * 0.75, y: META_H * 0.25 };
    this._guardianVel = { x: 0, y: 0 };

    // Guardian del jugador — temporal, creado por diálogo
    this._playerGuardian = null;

    const NAMES = ['Ramón', 'Ofelia', 'Facundo', 'Celestino', 'Zulma'];
    this._units = NAMES.map((name, i) => ({
      id:         `unit-${i}`,
      name,
      houseId:    i,
      housePos:   { ...HOUSES[i].pos },
      farmPos:    { ...HOUSES[i].farm },
      // Metaplano: alma
      metaPos:    { x: Math.random() * META_W, y: Math.random() * META_H },
      metaVel:    { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
      metaAcc:    { x: 0, y: 0 },
      // Plano físico: cuerpo
      terraPos:   { x: HOUSES[i].pos.x + (Math.random() - 0.5) * 4,
                    y: HOUSES[i].pos.y + (Math.random() - 0.5) * 4 },
      terraVel:   { x: 0, y: 0 },
      terraAcc:   { x: 0, y: 0 },
      // Estado
      food:            0,    // comida cosechada → se convierte en energía
      inventory:       0,
      maxInventory:    5,
      targetResource:  null,
      deliveryPlan:    null,
      intention:       'CONSUMING',
      energy:          100,
      isSleeping:      false,
      insideBuilding:  null,
      buildingTimer:   0,
      speech:          null,
      speechTimer:     Math.random() * 200,
      maxSpeed:        2.5 + Math.random() * 1.5,
      maxForce:        0.12,
      history:         [],
    }));
  }

  // ─── Accessors ───────────────────────────────────────────────────────────────
  get units()          { return this._units;          }
  get guardianPos()    { return this._guardianPos;    }
  get playerGuardian() { return this._playerGuardian; }
  get resources()      { return this._resources;      }
  get stocks()         { return this._stocks;         }
  get time()           { return this._time;           }

  // ─── Guardian del jugador — pastor temporal creado por diálogo ──────────────
  // ix: INDIVIDUO(-1)↔COMUNIDAD(+1), iy: MATERIA(-1)↔TRASCENDENCIA(+1)
  // duración en segundos (default 10)
  setPlayerGuardian(targetName, ix, iy, playerName, duration = 10) {
    const unit = this._units.find(u => u.name === targetName);
    if (!unit) return;
    // Posición target en el metaplano
    const tx = META_W * 0.5 + ix * META_W * 0.48;
    const ty = META_H * 0.5 - iy * META_H * 0.48;
    // Empieza detrás del aldeano (entre él y la dirección opuesta al target)
    const toTarget = vec.norm({ x: tx - unit.metaPos.x, y: ty - unit.metaPos.y });
    const startPos = {
      x: Math.max(0, Math.min(META_W, unit.metaPos.x - toTarget.x * 80)),
      y: Math.max(0, Math.min(META_H, unit.metaPos.y - toTarget.y * 80)),
    };
    this._playerGuardian = {
      targetName,
      targetPos: { x: tx, y: ty },
      pos:       { ...startPos },
      vel:       { x: 0, y: 0 },
      playerName: playerName || '?',
      expiresAt:  performance.now() + duration * 1000,
      duration:   duration * 1000,
    };
  }

  // ─── Cosechar cultivo 3D → inventario social + porción personal ─────────
  // inventory: lo que lleva para entregar (visible como baya en la cabeza)
  // food: porción pequeña que come en el camino → energía
  addInventory(name, amount = 1) {
    const unit = this._units.find(u => u.name === name);
    if (!unit) return;
    unit.inventory = Math.min(unit.maxInventory, (unit.inventory || 0) + amount);
    unit.food      = Math.min(10, (unit.food || 0) + 0.3); // porción personal
  }

  // Compatibilidad — solo energía personal sin delivery
  addFood(name, amount = 1) {
    const unit = this._units.find(u => u.name === name);
    if (unit) unit.food = Math.min(10, (unit.food || 0) + amount);
  }

  // ─── Update principal ─────────────────────────────────────────────────────
  // dt: segundos reales del frame
  // externalHour: hora del juego (0-23) de daynight.js
  update(dt, externalHour) {
    // Escalar dt para el metaplano — reducido para movimiento lento y deliberado
    const simDt = dt * 8;

    // ─── Tiempo ───────────────────────────────────────────────────────────────
    const ts    = this._time.totalSeconds + dt * 0.5;
    const hour  = externalHour !== undefined ? externalHour
                  : Math.floor(ts % 24);
    const day   = Math.floor(ts / 24) % 30 + 1;
    const month = Math.floor(ts / (24 * 30)) % 12;
    const year  = Math.floor(ts / (24 * 30 * 12)) + 1;
    this._time  = { hour, day, month, year, totalSeconds: ts };

    const isRitualActive = hour >= 19 || hour < 12;
    const isGathering    = hour >= 19 && hour < 22;

    const gMaxSpeed  = isRitualActive ? 8  : 4;
    const gMaxForce  = isRitualActive ? 0.5 : 0.2;
    const gRepPower  = isRitualActive ? 12  : 4;

    // ─── Guardian AI (igual que A/B) ──────────────────────────────────────────
    const targetCenter = { x: META_W * 0.75, y: META_H * 0.25 };
    const outliers = this._units.filter(u =>
      u.metaPos.x < META_W * 0.5 || u.metaPos.y > META_H * 0.5
    );

    let gAcc = { x: 0, y: 0 };
    if (outliers.length > 0) {
      let worst = outliers[0], maxD = 0;
      outliers.forEach(o => {
        const d = vec.dist(o.metaPos, targetCenter);
        if (d > maxD) { maxD = d; worst = o; }
      });
      const toTarget  = vec.norm(vec.sub(targetCenter, worst.metaPos));
      const behindPos = vec.sub(worst.metaPos, vec.mul(toTarget, 60));
      const desired   = vec.setMag(vec.sub(behindPos, this._guardianPos), gMaxSpeed);
      gAcc = vec.limit(vec.sub(desired, this._guardianVel), gMaxForce);
    } else {
      const t = performance.now() * 0.002;
      const patrol = {
        x: targetCenter.x + Math.cos(t) * 50,
        y: targetCenter.y + Math.sin(t) * 50,
      };
      const desired = vec.setMag(vec.sub(patrol, this._guardianPos), gMaxSpeed * 0.5);
      gAcc = vec.limit(vec.sub(desired, this._guardianVel), gMaxForce);
    }

    let gv = vec.limit(vec.add(this._guardianVel, vec.mul(gAcc, simDt)), gMaxSpeed);
    let gp = vec.add(this._guardianPos, vec.mul(gv, simDt));
    if (gp.x < 0)      { gp.x = 0;      gv.x *= -1; }
    if (gp.x > META_W) { gp.x = META_W; gv.x *= -1; }
    if (gp.y < 0)      { gp.y = 0;      gv.y *= -1; }
    if (gp.y > META_H) { gp.y = META_H; gv.y *= -1; }
    this._guardianPos = gp;
    this._guardianVel = gv;

    // ─── Player guardian (pastor temporal del jugador) ────────────────────────
    const pg = this._playerGuardian;
    if (pg) {
      if (performance.now() > pg.expiresAt) {
        this._playerGuardian = null;
      } else {
        const tUnit = this._units.find(u => u.name === pg.targetName);
        if (tUnit) {
          // Se posiciona detrás del aldeano respecto al targetPos (igual que el guardian principal)
          const toTgt  = vec.norm(vec.sub(pg.targetPos, tUnit.metaPos));
          const behind = vec.sub(tUnit.metaPos, vec.mul(toTgt, 70));
          const pgDes  = vec.setMag(vec.sub(behind, pg.pos), gMaxSpeed * 1.2);
          const pgAcc  = vec.limit(vec.sub(pgDes, pg.vel), gMaxForce * 1.5);
          pg.vel = vec.limit(vec.add(pg.vel, vec.mul(pgAcc, simDt)), gMaxSpeed * 1.2);
          pg.pos = {
            x: Math.max(0, Math.min(META_W, pg.pos.x + pg.vel.x * simDt)),
            y: Math.max(0, Math.min(META_H, pg.pos.y + pg.vel.y * simDt)),
          };
        }
      }
    }

    // Recursos internos desactivados — todo lo visible proviene del mundo 3D real

    // ─── Decay de stocks ──────────────────────────────────────────────────────
    if (Math.random() < 0.005 * dt * 60) {
      this._stocks.OFFERING  = Math.max(0, this._stocks.OFFERING  - 1);
      this._stocks.SHARING   = Math.max(0, this._stocks.SHARING   - 1);
      this._stocks.CONSUMING = Math.max(0, this._stocks.CONSUMING - 1);
      this._stocks.BAR       = Math.max(0, this._stocks.BAR       - 1);
      this._stocks.HOUSES    = this._stocks.HOUSES.map(s => Math.max(0, s - 1));
    }

    // ─── Loop de units ───────────────────────────────────────────────────────
    this._units = this._units.map((unit, idx) => {

      // ── METAPLANO ──────────────────────────────────────────────────────────
      const flockForce = calcFlocking(unit, this._units, {
        sepDist: 30, aliDist: 60, cohDist: 60,
        sepWeight: 1.5, aliWeight: 1.0, cohWeight: 1.0,
      });
      const brown = brownian(0.15);

      // Repulsión del guardian principal
      let guardFlee = { x: 0, y: 0 };
      const dg = vec.dist(unit.metaPos, gp);
      if (dg < 100) {
        const desired = vec.setMag(vec.sub(unit.metaPos, gp), unit.maxSpeed * 2);
        guardFlee = vec.limit(vec.sub(desired, unit.metaVel), unit.maxForce * 3);
      }

      // Repulsión del player guardian (solo afecta al aldeano target)
      let pgFlee = { x: 0, y: 0 };
      const cpg = this._playerGuardian;
      if (cpg && cpg.targetName === unit.name) {
        const dpg = vec.dist(unit.metaPos, cpg.pos);
        if (dpg < 130) {
          const desired = vec.setMag(vec.sub(unit.metaPos, cpg.pos), unit.maxSpeed * 2.5);
          pgFlee = vec.limit(vec.sub(desired, unit.metaVel), unit.maxForce * 4);
        }
      }

      let metaAcc = vec.add(
        vec.add(vec.add(flockForce, brown), vec.mul(guardFlee, gRepPower)),
        vec.mul(pgFlee, gRepPower * 1.5)
      );
      const mSF   = 0.3;
      let metaVel = vec.limit(vec.add(unit.metaVel, vec.mul(metaAcc, simDt * mSF)), unit.maxSpeed);
      let metaPos = vec.add(unit.metaPos, vec.mul(metaVel, simDt * mSF));

      if (metaPos.x < 0)      { metaPos.x = 0;      metaVel.x *= -1; }
      if (metaPos.x > META_W) { metaPos.x = META_W; metaVel.x *= -1; }
      if (metaPos.y < 0)      { metaPos.y = 0;      metaVel.y *= -1; }
      if (metaPos.y > META_H) { metaPos.y = META_H; metaVel.y *= -1; }

      // ── INTENCIÓN ──────────────────────────────────────────────────────────
      let intention   = getIntention(metaPos);
      let energy      = unit.energy;
      let isSleeping  = unit.isSleeping;

      // ── HABLA E INFLUENCIA ─────────────────────────────────────────────────
      let speech      = unit.speech;
      let speechTimer = unit.speechTimer - simDt;
      let influenceForce = { x: 0, y: 0 };

      if (!isSleeping) {
        if (speechTimer <= 0) {
          if (speech) {
            speech      = null;
            speechTimer = 150 + Math.random() * 300;
          } else {
            const qX = metaPos.x < META_W / 2 ? 'INDIVIDUO' : 'GRUPO';
            const qY = metaPos.y < META_H / 2 ? 'TRASCENDENTE' : 'MATERIA';
            speech      = `${qX} ${qY}`;
            speechTimer = 60 + Math.random() * 40;
          }
        }
        // Influencia de vecinos hablando
        this._units.forEach(other => {
          if (other.id === unit.id || !other.speech || other.isSleeping) return;
          if (vec.dist(unit.terraPos, other.terraPos) < 20) {
            const dir      = (unit.id.length + other.id.length) % 2 === 0 ? 1 : -1;
            const metaDiff = vec.sub(other.metaPos, unit.metaPos);
            influenceForce = vec.add(influenceForce, vec.setMag(metaDiff, 0.05 * dir));
          }
        });
      } else {
        speech = null;
      }
      metaVel = vec.add(metaVel, vec.mul(influenceForce, simDt));

      // ── ENERGÍA ────────────────────────────────────────────────────────────
      let food = unit.food || 0;
      if (!isSleeping) {
        const wf = 1 + (unit.inventory / unit.maxInventory) * 0.5;
        energy  -= (0.008 * wf) * simDt;
        // Comer: convertir comida en energía (lento y gradual)
        if (food > 0 && energy < 92) {
          const eatRate  = 0.004 * simDt;
          const consumed = Math.min(food, eatRate);
          food   -= consumed;
          energy  = Math.min(100, energy + consumed * 180); // 1 comida ≈ 45 energía
        }
      }
      if (energy < 5  && !isSleeping) isSleeping = true;
      if (energy < 20 && !isSleeping) intention  = 'SLEEPING';
      if (isSleeping)                 intention  = 'SLEEPING';

      // ── PLANO FÍSICO (posición real del gusano — sincronizada desde main.js) ──
      // terraPos ya contiene la posición real del gusano 3D (sincronizada cada frame)
      const terraPos     = { ...unit.terraPos };
      let inventory      = unit.inventory;
      let targetResource = null;
      let deliveryPlan   = unit.deliveryPlan ? [...unit.deliveryPlan] : null;
      let insideBuilding = unit.insideBuilding;
      let buildingTimer  = unit.buildingTimer;

      // Recuperación al dormir (cuando el gusano está cerca de su casa)
      if (isSleeping) {
        const atHome = vec.dist(terraPos, unit.housePos) < 6;
        insideBuilding = atHome ? 'HOUSE' : null;
        const recov = insideBuilding === 'HOUSE'
          ? (this._stocks.HOUSES[unit.houseId] > 0 ? 0.8 : 0.3)
          : 0.1;
        energy += recov * simDt;
        if (energy >= 100) { energy = 100; isSleeping = false; insideBuilding = null; }
      } else {
        buildingTimer = 0;
      }

      // Recoger recursos del plano interno al pasar cerca
      if (!isSleeping && inventory < unit.maxInventory) {
        for (let ri = this._resources.length - 1; ri >= 0; ri--) {
          const r = this._resources[ri];
          if (vec.dist(terraPos, r.pos) < 2) {
            inventory++;
            energy -= 3;
            this._resources.splice(ri, 1);
            this._resMeshes.delete(r.id);
            break;
          }
        }
      }

      // Entregar recursos cuando el gusano está en el destino del plan
      if (!isSleeping && deliveryPlan && deliveryPlan.length > 0) {
        const step = deliveryPlan[0];
        let dest = null;
        if (step.label === 'OFFERING')  dest = DEST.OFFERING;
        if (step.label === 'SHARING')   dest = DEST.SHARING;
        if (step.label === 'BAR')       dest = DEST.BAR;
        if (step.label === 'HOARDING' || step.label === 'CONSUMING') dest = unit.housePos;
        if (dest && vec.dist(terraPos, dest) < 5) {
          const amt = step.amount || 1;
          if (step.label === 'BAR')       this._stocks.BAR                 = (this._stocks.BAR       || 0) + amt;
          if (step.label === 'OFFERING')  this._stocks.OFFERING            = (this._stocks.OFFERING  || 0) + amt;
          if (step.label === 'SHARING')   this._stocks.SHARING             = (this._stocks.SHARING   || 0) + amt;
          if (step.label === 'HOARDING' || step.label === 'CONSUMING')
            this._stocks.HOUSES[unit.houseId] = (this._stocks.HOUSES[unit.houseId] || 0) + amt;
          inventory = Math.max(0, inventory - amt);
          deliveryPlan.shift();
          if (deliveryPlan.length === 0) deliveryPlan = null;
        }
      }

      // Crear plan de distribución cuando tiene inventario y no está entregando
      if (!isSleeping && inventory > 0 && !deliveryPlan) {
        const wO = (META_H - metaPos.y) / META_H;
        const wC = metaPos.y / META_H;
        const wH = (META_W - metaPos.x) / META_W;
        const wS = metaPos.x / META_W;
        const total = wO + wC + wH + wS;
        const types = [
          { w: wO, label: 'OFFERING'  },
          { w: wC, label: 'CONSUMING' },
          { w: wH, label: 'HOARDING'  },
          { w: wS, label: 'SHARING'   },
        ].sort((a, b) => b.w - a.w);
        let remaining = inventory;
        const plan = [];
        types.forEach((t, ti) => {
          const amt = ti === types.length - 1 ? remaining
                    : Math.min(remaining, Math.round(inventory * t.w / total));
          if (amt > 0) { plan.push({ amount: amt, label: t.label }); remaining -= amt; }
        });
        deliveryPlan = plan;
      }

      const history = [...unit.history, { ...metaPos }].slice(-15);

      return {
        ...unit,
        metaPos, metaVel, metaAcc,
        terraPos,
        food,
        inventory, maxInventory: unit.maxInventory,
        targetResource, deliveryPlan, intention,
        energy, isSleeping, insideBuilding, buildingTimer,
        speech, speechTimer, history,
      };
    });

  }

  getContextForChat() {
    return this._units.map(u => ({
      id:          u.id,
      name:        u.name,
      intention:   getIntention(u.metaPos),
      cuadrante:   _intentionLabel(getIntention(u.metaPos)),
      trayectoria: _calcTrayectoria(u),
      energia:     Math.round(u.energy),
      recursos:    u.inventory,
    }));
  }

  dispose() {
    this._resMeshes.forEach((mesh) => {
      if (!mesh) return;
      this._scene.remove(mesh);
      mesh.traverse(c => { if (c.isMesh) { c.geometry?.dispose(); c.material?.dispose(); } });
    });
    this._resMeshes.clear();
    this._resources = [];
  }
}
