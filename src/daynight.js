// --- Day / Night cycle ---
// 1 full day = 10 real minutes (600s). t=0 → midnight, 0.25 → dawn, 0.5 → noon, 0.75 → dusk.
import * as THREE from 'three';

const DAY_DURATION = 600; // seconds

// Start at late afternoon (dusk) to match original mood
let _t = 0.72;

// ─── Keyframe tables ─────────────────────────────────────────────────────────
// Each entry: [t, r, g, b]  (r/g/b in 0-255)

const SKY_KEYS = [
  [0.00,   8,   8,  22],  // midnight
  [0.18,  18,  12,  38],  // pre-dawn purple
  [0.25, 195,  95,  45],  // dawn orange
  [0.30, 130, 165, 215],  // morning haze
  [0.50, 130, 195, 235],  // noon sky blue
  [0.68, 138, 170, 210],  // late afternoon
  [0.75, 198, 118,  65],  // dusk orange
  [0.80,  70,  35,  55],  // twilight purple
  [0.87,  12,   8,  24],  // night
  [1.00,   8,   8,  22],  // midnight
];

const AMB_INT_KEYS = [
  [0.00, 0.04],
  [0.22, 0.08],
  [0.25, 0.38],
  [0.32, 0.52],
  [0.50, 0.62],
  [0.68, 0.54],
  [0.75, 0.36],
  [0.82, 0.10],
  [1.00, 0.04],
];

const SUN_INT_KEYS = [
  [0.00, 0.00],
  [0.22, 0.00],
  [0.27, 0.60],
  [0.33, 1.10],
  [0.50, 1.50],
  [0.68, 1.20],
  [0.75, 0.75],
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

// ─── Main update ──────────────────────────────────────────────────────────────
export function updateDayNight(dt, scene, sun, ambient) {
  _t = (_t + dt / DAY_DURATION) % 1;

  // Sky + fog
  const [sr, sg, sb] = _lerp3(SKY_KEYS, _t);
  scene.background.setRGB(sr / 255, sg / 255, sb / 255);
  scene.fog.color.setRGB(sr / 255 * 0.82, sg / 255 * 0.82, sb / 255 * 0.78);

  // Ambient
  ambient.intensity = _lerp1(AMB_INT_KEYS, _t);
  // Ambient color: warm during day, cool blue-grey at night
  const nightFrac = _t < 0.25
    ? Math.max(0, 1 - _t / 0.22)
    : _t > 0.78 ? Math.min(1, (_t - 0.78) / 0.10) : 0;
  ambient.color.setRGB(
    0.55 + (1 - nightFrac) * 0.45,
    0.50 + (1 - nightFrac) * 0.45,
    0.55 + nightFrac * 0.30,
  );

  // Sun
  sun.intensity = _lerp1(SUN_INT_KEYS, _t);
  const [cr, cg, cb] = _lerp3(SUN_COLOR_KEYS, _t);
  sun.color.setRGB(cr / 255, cg / 255, cb / 255);
}

/** 0=midnight, 0.25=dawn, 0.5=noon, 0.75=dusk */
export function getDayProgress() { return _t; }

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
