/**
 * src/metaphysics.js — Motor de Simulación Metafísica
 * ─────────────────────────────────────────────────────────────────────────────
 * Aplica el modelo dBBMM (Brownian Bridge Movement Model — Kranstauber 2012)
 * sobre un plano de dos ejes metafísicos:
 *
 *   X: -1 = Singular          →  +1 = Colectivo
 *   Y: -1 = Materia           →  +1 = Trascendencia
 *
 * La "distancia efectiva" entre dos entidades es el promedio de:
 *   - Distancia física normalizada (espacio del juego, escala ~WORLD_NORM)
 *   - Distancia metafísica (plano X-Y, escala ±1)
 *
 * Grupos: entidades del mismo cuadrante se cohesionan (como herdId en vacas).
 * Doppelganger: waypoint siempre opuesto al jugador local.
 * Jugador local: no tiene archetype — solo fuerzas de acciones + Boids.
 */

// ── Constantes del modelo ─────────────────────────────────────────────────────
const WORLD_NORM   = 160;   // radio del mundo físico para normalizar a ~0-2
const BOID_RADIUS  = 0.60;  // radio de vecindad en espacio blended
const COHESION     = 0.10;  // peso cohesión hacia centroide del grupo
const TAU = {
  baseline:  0.9,   // respuesta lenta — exploración tranquila
  driven:    0.35,  // respuesta rápida — bajo acción intensa
  reactive:  0.20,  // respuesta muy rápida — evento fuerte cercano
};
const MAX_SPEED    = 1.4;   // velocidad máxima en el plano metafísico (unidades/s)
const FORCE_SCALE  = 0.40;  // escala de fuerzas de acciones del jugador
const PASSIVE_INTERVAL = 0.5; // cada cuántos segundos la quietud empuja levemente

// ── Estados dBBMM ─────────────────────────────────────────────────────────────
// sigma: varianza browniana. speed: velocidad de deriva. tau: key en TAU.
const BB_STATES = {
  baseline: { sigma: 0.055, speed: 0.18, tau: 'baseline' },
  driven:   { sigma: 0.020, speed: 0.55, tau: 'driven'   },
  reactive: { sigma: 0.090, speed: 0.40, tau: 'reactive' },
};

// ── Tabla de acciones ─────────────────────────────────────────────────────────
// fx: Singular(-) ↔ Colectivo(+)  |  fy: Materia(-) ↔ Trascendencia(+)
export const ACTIONS = {
  eat_alone:    { fx: -0.30, fy: -0.40, dur: 1.0, state: 'driven'   },
  eat_share:    { fx:  0.42, fy: -0.22, dur: 1.2, state: 'driven'   },
  share_food:   { fx:  0.50, fy:  0.18, dur: 1.5, state: 'driven'   },
  shoot_player: { fx: -0.55, fy: -0.60, dur: 0.8, state: 'driven'   },
  shoot_animal: { fx: -0.22, fy: -0.32, dur: 0.7, state: 'driven'   },
  lasso:        { fx: -0.12, fy: -0.18, dur: 0.9, state: 'driven'   },
  corral_cow:   { fx:  0.32, fy: -0.16, dur: 1.0, state: 'driven'   },
  yell:         { fx:  0.22, fy: -0.12, dur: 0.6, state: 'driven'   },
  stampede:     { fx:  0.28, fy: -0.22, dur: 1.0, state: 'reactive' },
  mount_horse:  { fx: -0.08, fy:  0.04, dur: 0.5, state: 'baseline' },
  die:          { fx:  0.00, fy:  0.28, dur: 2.0, state: 'reactive' },
  npc_talk:     { fx:  0.14, fy:  0.22, dur: 1.5, state: 'driven'   },
  fast:         { fx: -0.08, fy:  0.44, dur: 1.0, state: 'driven'   },
  idle:         { fx:  0.00, fy:  0.018,dur: 0.5, state: 'baseline' },
};

// ── Arquetipos NPC ────────────────────────────────────────────────────────────
// tx/ty: waypoint metafísico (destino arquetípico).
// conv: convicción (velocidad de deriva hacia su waypoint).
// sigma_mult: multiplicador de ruido (personalidad más o menos errática).
// group: cuadrante para cohesión (TT=TransCol, TS=TransSing, MC=MatCol, MS=MatSing)
const NPC_ARCHETYPES = [
  { id:'predicador', name:'El Predicador', tx: 0.18, ty: 0.80, conv:0.12, sigma_mult:0.8, group:'TT', sx: 20,  sz: 10  },
  { id:'ermitano',   name:'El Ermitaño',   tx:-0.82, ty: 0.72, conv:0.09, sigma_mult:0.5, group:'TS', sx:-80,  sz:-40  },
  { id:'mercader',   name:'El Mercader',   tx: 0.62, ty:-0.38, conv:0.11, sigma_mult:1.0, group:'MC', sx: 40,  sz: 30  },
  { id:'cazador',    name:'El Cazador',    tx:-0.58, ty:-0.52, conv:0.13, sigma_mult:1.2, group:'MS', sx:-30,  sz: 50  },
  { id:'curandera',  name:'La Curandera',  tx: 0.44, ty: 0.60, conv:0.09, sigma_mult:0.6, group:'TT', sx: 10,  sz:-30  },
  { id:'bandido',    name:'El Bandido',    tx:-0.76, ty:-0.70, conv:0.16, sigma_mult:1.8, group:'MS', sx:-60,  sz: 20  },
  { id:'peregrino',  name:'El Peregrino',  tx:-0.28, ty: 0.65, conv:0.08, sigma_mult:0.7, group:'TS', sx: 60,  sz:-50  },
  { id:'pistolero',  name:'El Pistolero',  tx:-0.50, ty:-0.26, conv:0.12, sigma_mult:1.4, group:'MS', sx:-20,  sz:-60  },
  { id:'visionario', name:'El Visionario', tx: 0.04, ty: 0.94, conv:0.07, sigma_mult:0.4, group:'TT', sx:  0,  sz: 60  },
];

// ── Gaussian (Box-Muller) ─────────────────────────────────────────────────────
function _gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ── Estado global ─────────────────────────────────────────────────────────────
const _entities = new Map(); // id → entity
let _localId    = null;
let _canvas     = null;
let _ctx2d      = null;
let _passiveT   = 0;          // acumulador de tiempo sin moverse

/**
 * Entity:
 * { id, name, metaPos:{x,y}, metaVel:{x,y}, physX, physZ,
 *   isLocal, isNPC, isDoppel,
 *   bbState: 'baseline'|'driven'|'reactive',
 *   stateTimer: s restantes en estado actual,
 *   waypoint: {x,y},    ← destino en plano metafísico
 *   waypointTimer: s,
 *   archetype: {...}|null,
 *   group: string,
 *   color: string,
 *   _wanderT, _wanderDX, _wanderDZ  ← física virtual del NPC
 * }
 */
function _makeEntity(id, name, mx, my, px, pz, opts = {}) {
  return {
    id, name,
    metaPos: { x: mx, y: my },
    metaVel: { x: 0,  y: 0  },
    physX: px, physZ: pz,
    isLocal:  opts.isLocal  ?? false,
    isNPC:    opts.isNPC    ?? false,
    isDoppel: opts.isDoppel ?? false,
    bbState:  'baseline',
    stateTimer: 0,
    waypoint:      { x: mx, y: my },
    waypointTimer: Math.random() * 5,
    archetype: opts.archetype ?? null,
    group:  opts.group  ?? 'center',
    color:  opts.color  ?? '#aaaaaa',
    _wanderT: Math.random() * 3,
    _wanderDX: 0,
    _wanderDZ: 0,
  };
}

function _quadrantColor(x, y) {
  if (x >= 0 && y >= 0) return '#d4aa60';  // Trascendente + Colectivo — dorado
  if (x <  0 && y >= 0) return '#88aadd';  // Trascendente + Singular   — azul-plata
  if (x >= 0 && y <  0) return '#cc6633';  // Material + Colectivo      — naranja
  return '#884422';                          // Material + Singular       — marrón oscuro
}

// ── Inicialización ────────────────────────────────────────────────────────────
export function init(localPlayerId) {
  _localId = localPlayerId;

  // Jugador local — empieza en el centro
  _entities.set(localPlayerId, _makeEntity(
    localPlayerId, 'Tú', 0, 0, 0, 0,
    { isLocal: true, group: 'center', color: '#ffffff' }
  ));

  // Doppelganger — empieza opuesto (levemente desplazado para que no colapse)
  _entities.set('doppel', _makeEntity(
    'doppel', 'Sombra', 0.05, 0.05, 50, 30,
    { isNPC: true, isDoppel: true, group: 'doppel', color: '#ff4444' }
  ));

  // NPCs arquetípicos — empiezan cerca de su destino con scatter
  for (const arch of NPC_ARCHETYPES) {
    const scatter = 0.25;
    const mx = Math.max(-1, Math.min(1, arch.tx * 0.4 + (_gaussian() * scatter)));
    const my = Math.max(-1, Math.min(1, arch.ty * 0.4 + (_gaussian() * scatter)));
    const e  = _makeEntity(
      arch.id, arch.name, mx, my,
      arch.sx + (_gaussian() * 15),
      arch.sz + (_gaussian() * 15),
      { isNPC: true, archetype: arch, group: arch.group,
        color: _quadrantColor(arch.tx, arch.ty) }
    );
    e.waypoint = { x: arch.tx, y: arch.ty };
    e.waypointTimer = 6 + Math.random() * 10;
    _entities.set(arch.id, e);
  }

  _initCanvas();
  console.log('[META] Iniciado. Entidades:', _entities.size);
}

// ── Canvas minimapa ───────────────────────────────────────────────────────────
function _initCanvas() {
  _canvas = document.createElement('canvas');
  _canvas.width  = 182;
  _canvas.height = 182;
  _canvas.style.cssText = [
    'position:fixed', 'bottom:12px', 'left:12px', 'z-index:300',
    'border:1px solid rgba(255,255,255,0.14)', 'border-radius:5px',
    'background:rgba(4,2,1,0.84)', 'pointer-events:none',
  ].join(';');
  document.body.appendChild(_canvas);
  _ctx2d = _canvas.getContext('2d');
}

// ── Distancia blended (físico + metafísico, mismo peso) ──────────────────────
function _blendedDist(a, b) {
  const pdx = (a.physX - b.physX) / WORLD_NORM;
  const pdz = (a.physZ - b.physZ) / WORLD_NORM;
  const mdx = a.metaPos.x - b.metaPos.x;
  const mdy = a.metaPos.y - b.metaPos.y;
  return (Math.sqrt(pdx * pdx + pdz * pdz) + Math.sqrt(mdx * mdx + mdy * mdy)) * 0.5;
}

// ── Wander físico de NPCs (posición virtual en el mapa) ──────────────────────
function _wanderPhys(e, dt) {
  e._wanderT += dt;
  if (e._wanderT > 2 + Math.random() * 3) {
    e._wanderDX = _gaussian() * 18;
    e._wanderDZ = _gaussian() * 18;
    e._wanderT  = 0;
  }
  e.physX = Math.max(-150, Math.min(150, e.physX + e._wanderDX * dt * 0.06));
  e.physZ = Math.max(-150, Math.min(150, e.physZ + e._wanderDZ * dt * 0.06));
}

// ── Update principal ──────────────────────────────────────────────────────────
export function update(dt, playerPhysX = 0, playerPhysZ = 0, isPlayerMoving = true) {
  if (!_localId) return;

  const allArr = [..._entities.values()];
  const local  = _entities.get(_localId);

  // Actualizar posición física del jugador
  if (local) { local.physX = playerPhysX; local.physZ = playerPhysZ; }

  // Fuerza pasiva: quietud → leve Trascendencia
  if (!isPlayerMoving && local) {
    _passiveT += dt;
    if (_passiveT >= PASSIVE_INTERVAL) {
      _passiveT = 0;
      const a = ACTIONS.idle;
      local.metaVel.x += a.fx * FORCE_SCALE * dt;
      local.metaVel.y += a.fy * FORCE_SCALE * dt;
    }
  } else {
    _passiveT = 0;
  }

  // Calcular centroides por grupo (cohesión)
  const groupSum = new Map();
  for (const e of allArr) {
    let g = groupSum.get(e.group);
    if (!g) { g = { x: 0, y: 0, n: 0 }; groupSum.set(e.group, g); }
    g.x += e.metaPos.x; g.y += e.metaPos.y; g.n++;
  }
  const groupCentroid = new Map();
  for (const [gid, g] of groupSum) groupCentroid.set(gid, { x: g.x / g.n, y: g.y / g.n });

  for (const e of allArr) {
    // ── Posición física virtual (solo NPCs) ──────────────────────────────────
    if (e.isNPC && !e.isDoppel) _wanderPhys(e, dt);

    // ── Doppelganger: waypoint = opuesto exacto del jugador ──────────────────
    if (e.isDoppel && local) {
      e.waypoint = { x: -local.metaPos.x, y: -local.metaPos.y };
      e.physX = local.physX + Math.sin(Date.now() * 0.0002) * 35;
      e.physZ = local.physZ + Math.cos(Date.now() * 0.0002) * 35;
    }

    // ── dBBMM: deriva hacia waypoint ─────────────────────────────────────────
    const p = BB_STATES[e.bbState] ?? BB_STATES.baseline;
    const arch = e.archetype;

    e.waypointTimer -= dt;
    const dwx = e.waypoint.x - e.metaPos.x;
    const dwy = e.waypoint.y - e.metaPos.y;
    const wDst = Math.sqrt(dwx * dwx + dwy * dwy) || 0.001;

    // ── Reasignar waypoint cuando llega o vence el timer (solo NPCs arquetípicos)
    if (arch && !e.isDoppel && (wDst < 0.06 || e.waypointTimer <= 0)) {
      // Pequeño salto aleatorio alrededor del destino arquetípico
      const r = 0.08 + Math.random() * 0.18;
      const a = Math.random() * Math.PI * 2;
      e.waypoint = {
        x: Math.max(-1, Math.min(1, arch.tx + Math.cos(a) * r)),
        y: Math.max(-1, Math.min(1, arch.ty + Math.sin(a) * r)),
      };
      e.waypointTimer = 5 + Math.random() * 12;

      // 20% de probabilidad de entrar en estado 'driven' brevemente (tienen agenda)
      if (Math.random() < 0.20) { e.bbState = 'driven'; e.stateTimer = 2 + Math.random() * 3; }
      else                       { e.bbState = 'baseline'; }
    }

    // Countdown de estado
    if (e.stateTimer > 0) {
      e.stateTimer -= dt;
      if (e.stateTimer <= 0) e.bbState = 'baseline';
    }

    // Drift hacia waypoint
    const conv    = arch ? arch.conv : (e.isDoppel ? 0.18 : 0.0);
    const driftX  = (dwx / wDst) * p.speed * conv;
    const driftY  = (dwy / wDst) * p.speed * conv;

    // Cohesión hacia centroide del grupo
    const gc   = groupCentroid.get(e.group);
    const cohX = gc ? (gc.x - e.metaPos.x) * COHESION * (e.bbState === 'reactive' ? 0.02 : 1.0) : 0;
    const cohY = gc ? (gc.y - e.metaPos.y) * COHESION * (e.bbState === 'reactive' ? 0.02 : 1.0) : 0;

    // Ruido browniano (σ ∝ sigma × √dt × sigma_mult del arquetipo)
    const sigMult = arch ? arch.sigma_mult : (e.isDoppel ? 0.6 : 0.0);
    const sigma   = p.sigma * Math.sqrt(dt) * sigMult;
    const noiseX  = _gaussian() * sigma;
    const noiseY  = _gaussian() * sigma;

    // Separación: repulsión de vecinos demasiado cercanos en espacio blended
    let sepX = 0, sepY = 0;
    for (const other of allArr) {
      if (other.id === e.id) continue;
      const bd = _blendedDist(e, other);
      if (bd >= BOID_RADIUS * 0.45) continue;
      const sep = Math.max(0.02, bd);
      sepX -= (other.metaPos.x - e.metaPos.x) / (sep * sep) * 0.012;
      sepY -= (other.metaPos.y - e.metaPos.y) / (sep * sep) * 0.012;
    }

    let targetVX = driftX + cohX + noiseX + sepX;
    let targetVY = driftY + cohY + noiseY + sepY;

    // Cap velocidad objetivo
    const tspd = Math.sqrt(targetVX * targetVX + targetVY * targetVY);
    if (tspd > p.speed * 1.8) { const f = p.speed * 1.8 / tspd; targetVX *= f; targetVY *= f; }

    // Aproximación exponencial (TAU)
    const tau   = TAU[p.tau];
    const alpha = 1 - Math.exp(-dt / tau);
    e.metaVel.x += (targetVX - e.metaVel.x) * alpha;
    e.metaVel.y += (targetVY - e.metaVel.y) * alpha;

    // Cap velocidad final
    const spd = Math.sqrt(e.metaVel.x ** 2 + e.metaVel.y ** 2);
    if (spd > MAX_SPEED) { e.metaVel.x *= MAX_SPEED / spd; e.metaVel.y *= MAX_SPEED / spd; }

    // Integrar
    e.metaPos.x += e.metaVel.x * dt;
    e.metaPos.y += e.metaVel.y * dt;

    // Bordes duros
    if (e.metaPos.x >  1) { e.metaPos.x =  1; if (e.metaVel.x > 0) e.metaVel.x *= -0.1; }
    if (e.metaPos.x < -1) { e.metaPos.x = -1; if (e.metaVel.x < 0) e.metaVel.x *= -0.1; }
    if (e.metaPos.y >  1) { e.metaPos.y =  1; if (e.metaVel.y > 0) e.metaVel.y *= -0.1; }
    if (e.metaPos.y < -1) { e.metaPos.y = -1; if (e.metaVel.y < 0) e.metaVel.y *= -0.1; }
  }
}

// ── API pública: acción del jugador ───────────────────────────────────────────
export function applyAction(actionName) {
  if (!_localId) return;
  const a = ACTIONS[actionName];
  if (!a) return;
  const local = _entities.get(_localId);
  if (!local) return;

  // Aplicar impulso a la velocidad metafísica del jugador
  local.metaVel.x += a.fx * FORCE_SCALE;
  local.metaVel.y += a.fy * FORCE_SCALE;

  // Cambiar estado según la acción
  local.bbState   = a.state;
  local.stateTimer = a.dur;

  // Propagar estado "reactive" a vecinos cercanos (contagio, como el pánico en vacas)
  if (a.state === 'reactive') {
    for (const e of _entities.values()) {
      if (e.id === _localId) continue;
      if (_blendedDist(local, e) < BOID_RADIUS * 0.8) {
        e.bbState    = 'reactive';
        e.stateTimer = Math.max(e.stateTimer, a.dur * 0.5);
      }
    }
  }
}

// Actualizar posición de un jugador remoto en el espacio metafísico
// (para cuando se implementen estados compartidos vía red)
export function updateRemotePhysPos(playerId, physX, physZ) {
  const e = _entities.get(playerId);
  if (e) { e.physX = physX; e.physZ = physZ; }
}

// ── Dibujado del minimapa ─────────────────────────────────────────────────────
export function drawMap() {
  if (!_ctx2d) return;
  const C = _ctx2d;
  const W = _canvas.width, H = _canvas.height;
  const PAD  = 14;
  const SIZE = W - PAD * 2;
  const cx   = PAD + SIZE / 2;
  const cy   = PAD + SIZE / 2;
  const sc   = SIZE / 2;  // pixels per unit

  const toSX = mx =>  cx + mx * sc;
  const toSY = my =>  cy - my * sc;

  C.clearRect(0, 0, W, H);

  // ── Fondos de cuadrante ───────────────────────────────────────────────────
  const Q = [
    { x: PAD,    y: PAD,        w: sc, h: sc, c: 'rgba(136,170,221,0.07)' }, // TL: Trans+Sing
    { x: cx,     y: PAD,        w: sc, h: sc, c: 'rgba(212,170,96,0.07)'  }, // TR: Trans+Col
    { x: PAD,    y: cy,         w: sc, h: sc, c: 'rgba(136,68,34,0.07)'   }, // BL: Mat+Sing
    { x: cx,     y: cy,         w: sc, h: sc, c: 'rgba(204,102,51,0.07)'  }, // BR: Mat+Col
  ];
  for (const q of Q) { C.fillStyle = q.c; C.fillRect(q.x, q.y, q.w, q.h); }

  // ── Ejes ──────────────────────────────────────────────────────────────────
  C.strokeStyle = 'rgba(255,255,255,0.11)';
  C.lineWidth   = 0.8;
  C.beginPath();
  C.moveTo(cx, PAD); C.lineTo(cx, PAD + SIZE);
  C.moveTo(PAD, cy); C.lineTo(PAD + SIZE, cy);
  C.stroke();

  // Borde del área
  C.strokeStyle = 'rgba(255,255,255,0.08)';
  C.strokeRect(PAD, PAD, SIZE, SIZE);

  // ── Labels ────────────────────────────────────────────────────────────────
  C.font      = '6.5px monospace';
  C.fillStyle = 'rgba(255,255,255,0.28)';
  C.textAlign = 'center';
  C.fillText('TRASCENDENCIA', cx, PAD - 2);
  C.fillText('MATERIA', cx, PAD + SIZE + 9);
  C.textAlign = 'left';
  C.fillText('SING', PAD, cy - 2);
  C.textAlign = 'right';
  C.fillText('COL', PAD + SIZE, cy - 2);

  // ── Entidades ─────────────────────────────────────────────────────────────
  for (const e of _entities.values()) {
    const sx = toSX(e.metaPos.x);
    const sy = toSY(e.metaPos.y);

    // Vector velocidad (solo local y doppel)
    if (e.isLocal || e.isDoppel) {
      const spd = Math.sqrt(e.metaVel.x ** 2 + e.metaVel.y ** 2);
      if (spd > 0.015) {
        const tx = toSX(e.metaPos.x + e.metaVel.x * 1.2);
        const ty = toSY(e.metaPos.y + e.metaVel.y * 1.2);
        C.strokeStyle = e.color + '88';
        C.lineWidth   = 1.5;
        C.beginPath(); C.moveTo(sx, sy); C.lineTo(tx, ty); C.stroke();
      }
    }

    const r = e.isLocal ? 5.5 : (e.isDoppel ? 4.5 : 3);

    // Glow para jugador local
    if (e.isLocal) {
      const g = C.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
      g.addColorStop(0, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0.00)');
      C.fillStyle = g;
      C.beginPath(); C.arc(sx, sy, r * 3, 0, Math.PI * 2); C.fill();
    }

    // Punto
    C.beginPath();
    C.arc(sx, sy, r, 0, Math.PI * 2);
    C.fillStyle = e.isLocal ? '#ffffff' : (e.isDoppel ? '#ff4444' : e.color + 'cc');
    C.fill();

    // Label nombre para NPCs importantes
    if (e.isNPC && !e.isDoppel) {
      C.font      = '5px monospace';
      C.fillStyle = e.color + 'aa';
      C.textAlign = 'center';
      C.fillText(e.archetype?.name?.split(' ')[1] ?? e.name, sx, sy - r - 1);
    }
  }

  // Estado del jugador local
  const loc = _localId ? _entities.get(_localId) : null;
  if (loc) {
    C.font      = '6px monospace';
    C.fillStyle = 'rgba(255,255,255,0.40)';
    C.textAlign = 'left';
    const qLabel = _quadrantLabel(loc.metaPos.x, loc.metaPos.y);
    C.fillText(qLabel, PAD + 1, H - 2);
  }
}

function _quadrantLabel(x, y) {
  const cx = x >  0.15 ? 'Col' : (x < -0.15 ? 'Sing' : '·');
  const cy = y >  0.15 ? 'Tras' : (y < -0.15 ? 'Mat' : '·');
  return `${cy} ${cx}`;
}

export function getLocalPos() {
  return _entities.get(_localId)?.metaPos ?? { x: 0, y: 0 };
}
export function getEntity(id) { return _entities.get(id); }
