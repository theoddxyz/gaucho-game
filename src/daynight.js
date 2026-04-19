// --- Day / Night cycle ---
// 1 full day = 10 real minutes (600s). t=0 → midnight, 0.25 → dawn, 0.5 → noon, 0.75 → dusk.
import * as THREE from 'three';

const DAY_DURATION = 600; // seconds

// Start at noon
let _t = 0.5;

// ─── Keyframe tables ─────────────────────────────────────────────────────────
// Each entry: [t, r, g, b]  (r/g/b in 0-255)

const SKY_KEYS = [
  [0.00,  18,  22,  55],  // midnight — deep blue (noche americana)
  [0.18,  25,  20,  60],  // pre-dawn blue-purple
  [0.25, 195,  95,  45],  // dawn orange
  [0.30, 130, 165, 215],  // morning haze
  [0.50, 130, 195, 235],  // noon sky blue
  [0.68, 138, 170, 210],  // late afternoon
  [0.75, 198, 118,  65],  // dusk orange
  [0.80,  70,  35,  55],  // twilight purple
  [0.87,  18,  18,  48],  // night — deep blue
  [1.00,  18,  22,  55],  // midnight
];

const AMB_INT_KEYS = [
  [0.00, 0.30],  // midnight — levantado para noche americana
  [0.22, 0.32],
  [0.25, 0.48],
  [0.32, 0.70],
  [0.50, 0.90],  // mediodía: más luminoso
  [0.68, 0.76],
  [0.75, 0.42],
  [0.82, 0.32],
  [1.00, 0.30],
];

const SUN_INT_KEYS = [
  [0.00, 0.00],
  [0.22, 0.00],
  [0.27, 0.80],
  [0.33, 1.40],
  [0.50, 2.20],  // mediodía: sol fuerte
  [0.68, 1.60],
  [0.75, 0.85],
  [0.82, 0.00],
  [1.00, 0.00],
];

const SUN_COLOR_KEYS = [
  [0.00, 200, 160,  90],
  [0.25, 255, 135,  50],  // orange dawn
  [0.35, 255, 215, 140],  // warm morning
  [0.50, 255, 250, 220],  // near-white noon
  [0.68, 255, 218, 130],  // afternoon golden
  [0.75, 255, 122,  42],  // orange dusk
  [0.82,  90,  60, 160],  // twilight violet
  [1.00, 200, 160,  90],
];

// ─── Interpolation helpers ────────────────────────────────────────────────────
function _lerp1(keys, t) {
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t >= t0 && t <= t1) return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
}

function _lerp3(keys, t) {
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, r0, g0, b0] = keys[i], [t1, r1, g1, b1] = keys[i + 1];
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return [r0 + (r1 - r0) * f, g0 + (g1 - g0) * f, b0 + (b1 - b0) * f];
    }
  }
  const last = keys[keys.length - 1]; return [last[1], last[2], last[3]];
}

// Fog near/far keyframes — denser at dawn/dusk, clear at noon, clear at night (noche americana)
const FOG_NEAR_KEYS = [
  [0.00, 120],  // midnight: pampa visible bajo la luna
  [0.22,  60],  // pre-dawn: niebla pesada
  [0.27,  55],  // dawn lifting
  [0.33,  90],  // morning
  [0.50, 200],  // noon: clear pampa
  [0.68, 160],  // late afternoon haze
  [0.73,  70],  // dusk fog rolling in
  [0.80,  60],  // twilight
  [0.87, 120],  // night
  [1.00, 120],
];
const FOG_FAR_KEYS = [
  [0.00, 480],  // midnight: horizonte visible (noche americana)
  [0.22, 240],  // pre-dawn heavy
  [0.27, 260],
  [0.33, 360],
  [0.50, 480],  // noon clear
  [0.68, 400],
  [0.73, 260],  // dusk
  [0.80, 240],
  [0.87, 480],  // night
  [1.00, 480],
];

// ─── Main update ──────────────────────────────────────────────────────────────
export function updateDayNight(dt, scene, sun, ambient, moon = null) {
  if (!_locked) _t = (_t + dt / DAY_DURATION) % 1;

  // Sky + fog color
  const [sr, sg, sb] = _lerp3(SKY_KEYS, _t);
  scene.background.setRGB(sr / 255, sg / 255, sb / 255);
  scene.fog.color.setRGB(sr / 255 * 0.82, sg / 255 * 0.82, sb / 255 * 0.78);

  // Fog density: dynamic near/far (skip if externally overridden — e.g. dust storm)
  if (!scene._fogOverride) {
    scene.fog.near = _lerp1(FOG_NEAR_KEYS, _t);
    scene.fog.far  = _lerp1(FOG_FAR_KEYS,  _t);
  }

  // Ambient
  ambient.intensity = _lerp1(AMB_INT_KEYS, _t);
  // Ambient color: warm during day, cool blue-grey at night
  const nightFrac = _t < 0.25
    ? Math.max(0, 1 - _t / 0.22)
    : _t > 0.78 ? Math.min(1, (_t - 0.78) / 0.10) : 0;
  // Noche americana: azul-frío pronunciado de noche, cálido de día
  ambient.color.setRGB(
    0.32 + (1 - nightFrac) * 0.68,  // R: 0.32 noche → 1.0 día
    0.38 + (1 - nightFrac) * 0.57,  // G: 0.38 noche → 0.95 día
    0.80 + (1 - nightFrac) * 0.05,  // B: 0.80 noche → 0.85 día (siempre algo azul)
  );

  // Sun intensity + color
  sun.intensity = _lerp1(SUN_INT_KEYS, _t);
  const [cr, cg, cb] = _lerp3(SUN_COLOR_KEYS, _t);
  sun.color.setRGB(cr / 255, cg / 255, cb / 255);

  // Moon
  if (moon) moon.intensity = _lerp1(MOON_INT_KEYS, _t);
}

/**
 * Return sun offset from a world position, following a day-arc.
 * At dawn (t=0.25): sun rises east (+X). At noon (t=0.5): sun is high.
 * At dusk (t=0.75): sun sets west (-X).
 */
export function getSunOffset() {
  // Map day fraction 0.25–0.75 → angle 0–PI (east to west arc)
  const angle = (_t - 0.25) * Math.PI / 0.5; // 0=east, PI/2=south-high, PI=west
  const radius = 140;
  const height = Math.max(5, Math.sin(angle) * 90);
  const ex = Math.cos(angle) * radius;   // east–west
  const ez = -30;                         // fixed south offset
  return { x: ex, y: height, z: ez };
}

// Moon intensity keyframes: noche americana — luna fuerte que ilumina y hace sombras
const MOON_INT_KEYS = [
  [0.00, 2.0],   // midnight — luna llena, iluminación fuerte
  [0.18, 1.5],   // pre-dawn — sigue alumbrando
  [0.24, 0.00],  // desaparece al amanecer
  [0.26, 0.00],
  [0.74, 0.00],
  [0.78, 0.00],
  [0.82, 1.2],   // vuelve al anochecer
  [0.90, 1.8],
  [1.00, 2.0],
];

/** 0=midnight, 0.25=dawn, 0.5=noon, 0.75=dusk */
export function getDayProgress() { return _t; }

/** Override the current time (0–1). Pauses natural progression while held. */
let _locked = false;
export function setDayProgress(t) { _t = Math.max(0, Math.min(1, t)); _locked = true; }
export function unlockDayProgress() { _locked = false; }

/** Soft sync: nudge time toward target value without locking progression.
 *  Called every 100ms by the viewer to stay in sync with the host. */
export function nudgeDayProgress(t) {
  const target = Math.max(0, Math.min(1, t));
  // Handle wrap-around (e.g. host at 0.99, viewer at 0.01)
  let diff = target - _t;
  if (diff > 0.5) diff -= 1;
  if (diff < -0.5) diff += 1;
  // Smoothly converge: move 30% toward target each call (10Hz = fully synced in ~1s)
  _t = (_t + diff * 0.3 + 1) % 1;
}

/** Temperature in °C — cold at night (~5°), hot at noon (~40°) */
export function getTemperature() {
  const angle = (_t - 0.5) * Math.PI * 2;
  return Math.round(22 + Math.cos(angle) * 17);
}

/** HH:MM game clock (24h) */
export function getGameTime() {
  const totalMin = Math.floor(_t * 1440);
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** True during night hours */
export function isNight() { return _t < 0.22 || _t > 0.80; }
