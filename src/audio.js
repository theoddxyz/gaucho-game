/**
 * src/audio.js  —  GAUCHO Sound Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Carga archivos reales de /public/sounds/ (MP3/OGG).
 * Si el archivo no existe todavía, cae a síntesis procedural como fallback.
 * Todos los sonidos son lazy-loaded y cacheados.
 *
 * ESTRUCTURA public/sounds/
 *   weapons/  shotgun.mp3  bullet_whiz.mp3  impact_dirt.mp3
 *             impact_flesh.mp3  impact_wood.mp3  shell.mp3
 *   player/   step_dirt_1..4.mp3  step_grass_1..2.mp3
 *             hurt_1..2.mp3  death.mp3  land.mp3  eat.mp3  exhale.mp3
 *   animals/  cow_1..3.mp3  cow_panic.mp3  horse_neigh.mp3  horse_snort.mp3
 *             horse_gallop.mp3  chicken_1..2.mp3  chicken_panic.mp3
 *             ostrich.mp3  coyote.mp3
 *   ambient/  wind.mp3  crickets.mp3  birds.mp3
 *             thunder_1..3.mp3  rain.mp3  fire.mp3
 *
 * DONDE DESCARGAR (gratis, CC0, sin atribución):
 *   https://pixabay.com/sound-effects/
 *   https://freesound.org  (filtrar por CC0)
 *   https://mixkit.co/free-sound-effects/
 */

// ── AudioContext ──────────────────────────────────────────────────────────────
let _ctx  = null;
let _out  = null;   // master gain → compresor → destino
let _rev  = null;   // reverb de campo abierto

export function initAudio() {
  if (_ctx) return;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();

    const comp = _ctx.createDynamicsCompressor();
    comp.threshold.value = -20; comp.knee.value = 14;
    comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.28;
    comp.connect(_ctx.destination);

    _out = _ctx.createGain();
    _out.gain.value = 0.78;
    _out.connect(comp);

    // Reverb sintético largo (pampa abierta)
    const sr = _ctx.sampleRate, len = Math.floor(sr * 3.2);
    const buf = _ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
    }
    _rev = _ctx.createConvolver();
    _rev.buffer = buf;
    const rg = _ctx.createGain(); rg.gain.value = 0.22;
    _rev.connect(rg); rg.connect(_out);

    // Preload en background
    _preloadAll();
    console.log('[AUDIO] OK, sampleRate=' + sr);
  } catch(e) { console.warn('[AUDIO]', e.message); }
}

function _ctx_() {
  if (!_ctx) initAudio();
  if (_ctx?.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}
function _now() { return _ctx_()?.currentTime ?? 0; }

// ── Buffer cache y carga lazy ─────────────────────────────────────────────────
const _cache = new Map();   // path → AudioBuffer | null (null = carga fallida)

async function _load(path) {
  if (_cache.has(path)) return _cache.get(path);
  const c = _ctx_(); if (!c) return null;
  try {
    const res = await fetch(`/sounds/${path}`);
    if (!res.ok) throw new Error(res.status);
    const ab  = await res.arrayBuffer();
    const buf = await c.decodeAudioData(ab);
    _cache.set(path, buf);
    return buf;
  } catch {
    _cache.set(path, null);   // marcar como no disponible — no reintentar
    return null;
  }
}

// Preload silencioso de todos los archivos al arrancar
const MANIFEST = [
  // weapons (Kenney + CC0 SFX)
  'weapons/shotgun.mp3','weapons/bullet_whiz.mp3',
  'weapons/impact_dirt.mp3','weapons/impact_flesh.mp3','weapons/impact_flesh_2.mp3',
  'weapons/impact_glass.mp3','weapons/impact_glass_2.mp3','weapons/impact_metal.mp3',
  'weapons/shell.mp3','weapons/shell_2.mp3','weapons/shell_3.mp3',
  // player
  'player/step_sand_1.mp3','player/step_sand_2.mp3','player/step_sand_3.mp3','player/step_sand_4.mp3',
  'player/step_grass_1.mp3','player/step_grass_2.mp3','player/step_grass_3.mp3',
  'player/hurt_1.mp3','player/hurt_2.mp3','player/hurt_3.mp3',
  'player/death.mp3','player/land.mp3','player/eat.mp3','player/body_fall.mp3',
  'player/mount_leather.mp3','player/cloth.mp3',
  // animals (colocar manualmente desde Pixabay)
  'animals/cow_1.mp3','animals/cow_2.mp3','animals/cow_3.mp3','animals/cow_panic.mp3',
  'animals/horse_neigh.mp3','animals/horse_snort.mp3','animals/horse_gallop.mp3',
  'animals/chicken_1.mp3','animals/chicken_2.mp3','animals/chicken_panic.mp3',
  'animals/ostrich.mp3','animals/coyote.mp3',
  // ambient (Kenney + CC0 + colocar loops desde Pixabay)
  'ambient/wind.mp3','ambient/crickets.mp3','ambient/birds.mp3',
  'ambient/thunder_1.mp3','ambient/thunder_2.mp3','ambient/thunder_3.mp3',
  'ambient/rain.mp3','ambient/fire.mp3',
  'ambient/bell_gm.mp3','ambient/corral_bell.mp3',
  'ambient/wood_creak_1.mp3','ambient/wood_creak_2.mp3',
  'ambient/creak_1.mp3','ambient/creak_2.mp3','ambient/creak_3.mp3',
];
function _preloadAll() {
  // Carga secuencial con delay para no spikear el hilo de audio al inicio
  let i = 0;
  const next = () => {
    if (i >= MANIFEST.length) return;
    _load(MANIFEST[i++]).catch(() => {}).finally(() => setTimeout(next, 40));
  };
  setTimeout(next, 500); // empieza 500ms después de initAudio
}

// ── Reproducir buffer cacheado ────────────────────────────────────────────────
/**
 * @param {AudioBuffer} buf
 * @param {{ volume, reverb, loop, pitch, when }} opts
 * @returns {AudioBufferSourceNode|null}
 */
function _play(buf, opts = {}) {
  const c = _ctx_(); if (!c || !buf) return null;
  const src = c.createBufferSource();
  src.buffer      = buf;
  src.loop        = opts.loop  ?? false;
  src.playbackRate.value = opts.pitch ?? 1.0;

  const g = c.createGain();
  g.gain.value = opts.volume ?? 1.0;
  src.connect(g);

  if (_out) g.connect(_out);
  if (_rev && (opts.reverb ?? 0.18) > 0) {
    const rg = c.createGain(); rg.gain.value = opts.reverb ?? 0.18;
    g.connect(rg); rg.connect(_rev);
  }
  src.start(opts.when ?? _now());
  return src;
}

// ── Reproducir por nombre — con fallback procedural ──────────────────────────
async function _playFile(path, opts = {}, fallback = null) {
  const buf = _cache.get(path) ?? await _load(path);
  if (buf) { _play(buf, opts); return true; }
  fallback?.();
  return false;
}

// Variante: pick random de un array de paths
async function _playRandom(paths, opts = {}, fallback = null) {
  const path = paths[Math.floor(Math.random() * paths.length)];
  return _playFile(path, opts, fallback);
}

// ── Helpers síntesis (fallback) ───────────────────────────────────────────────
function _noise(dur, freq, Q) {
  const c = _ctx_(); if (!c) return null;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const flt = c.createBiquadFilter(); flt.type = 'bandpass';
  flt.frequency.value = freq; flt.Q.value = Q;
  const g = c.createGain(); g.gain.value = 0;
  src.connect(flt); flt.connect(g);
  return { src, gain: g };
}
function _env(gn, a, d, s, r, peak = 1) {
  const t = _now(), g = gn.gain;
  g.cancelScheduledValues(t);
  g.setValueAtTime(0.0001, t);
  g.linearRampToValueAtTime(peak,     t + a);
  g.linearRampToValueAtTime(peak * s, t + a + d);
  g.linearRampToValueAtTime(0.0001,   t + a + d + r);
}
function _toOut(node, rev = 0.18) {
  if (!_out) return;
  node.connect(_out);
  if (_rev && rev > 0) {
    const rg = _ctx_().createGain(); rg.gain.value = rev;
    node.connect(rg); rg.connect(_rev);
  }
}
function _lp(freq) {
  const f = _ctx_().createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = freq; return f;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  API PÚBLICA
// ═══════════════════════════════════════════════════════════════════════════════

// ── PASOS ─────────────────────────────────────────────────────────────────────
const _stepSand  = ['player/step_sand_1.mp3','player/step_sand_2.mp3',
                    'player/step_sand_3.mp3','player/step_sand_4.mp3'];
const _stepGrass = ['player/step_grass_1.mp3','player/step_grass_2.mp3','player/step_grass_3.mp3'];

export function footstep(surface = 'sand') {
  const pitch = 0.88 + Math.random() * 0.24;
  const paths  = surface === 'grass' ? _stepGrass : _stepSand;
  _playRandom(paths, { volume: 0.50, reverb: 0.06, pitch }, () => {
    // fallback procedural — arena suave
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.12, 1800, 0.5);
    if (n) { _env(n.gain, 0.003, 0.018, 0.06, 0.08, 0.18); _toOut(n.gain, 0.04); n.src.start(t); }
    const n2 = _noise(0.08, 600, 0.7);
    if (n2) { _env(n2.gain, 0.001, 0.010, 0.0, 0.07, 0.12); _toOut(n2.gain, 0.02); n2.src.start(t); }
  });
}

// ── ESCOPETA ──────────────────────────────────────────────────────────────────
export function shotgun() {
  _playFile('weapons/shotgun.mp3', { volume: 0.90, reverb: 0.55, pitch: 0.95 + Math.random()*0.1 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(58, t); o.frequency.exponentialRampToValueAtTime(20, t+0.22);
    const lp = _lp(280); const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.55,t+0.006);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.28);
    o.connect(lp); lp.connect(g); _toOut(g, 0.45); o.start(t); o.stop(t+0.30);
    const n = _noise(0.55, 160, 0.35);
    if (n) { _env(n.gain, 0.012, 0.06, 0.15, 0.42, 0.16); _toOut(n.gain, 0.50); n.src.start(t); }
  });
  // Casquillo cayendo — 80ms después
  setTimeout(() =>
    _playFile('weapons/shell.mp3', { volume: 0.22, reverb: 0.06 }, () => {
      const c = _ctx_(); if (!c) return; const t = _now();
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 1800;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.12,t+0.003);
      g.gain.exponentialRampToValueAtTime(0.0001,t+0.18);
      o.connect(g); _toOut(g, 0.05); o.start(t); o.stop(t+0.20);
    }), 80 + Math.random()*40);
}

// ── BALA CERCA ────────────────────────────────────────────────────────────────
export function bulletWhiz() {
  _playFile('weapons/bullet_whiz.mp3', { volume: 0.55, reverb: 0.08 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const f0 = 1600 + Math.random()*500;
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0*0.24, t+0.20);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.11,t+0.012);
    g.gain.linearRampToValueAtTime(0.0001,t+0.21);
    o.connect(g); _toOut(g, 0.06); o.start(t); o.stop(t+0.22);
  });
}

// ── IMPACTOS ──────────────────────────────────────────────────────────────────
export function bulletImpactDirt() {
  _playFile('weapons/impact_dirt.mp3', { volume: 0.50, reverb: 0.10, pitch: 0.85+Math.random()*0.3 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.12, 450, 0.8);
    if (n) { _env(n.gain,0.001,0.015,0.1,0.09,0.18); _toOut(n.gain,0.06); n.src.start(t); }
  });
}
export function bulletImpactFlesh() {
  _playFile('weapons/impact_flesh.mp3', { volume: 0.55, reverb: 0.06 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.09, 320, 1.0);
    if (n) { _env(n.gain,0.001,0.012,0.0,0.07,0.26); _toOut(n.gain,0.07); n.src.start(t); }
  });
}
export function bulletImpactWood() {
  _playFile('weapons/impact_wood.mp3', { volume: 0.55, reverb: 0.12 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.08, 1200, 1.5);
    if (n) { _env(n.gain,0.001,0.008,0.0,0.06,0.22); _toOut(n.gain,0.10); n.src.start(t); }
  });
}

// ── DAÑO / MUERTE ─────────────────────────────────────────────────────────────
export function hitMarker() {
  const c = _ctx_(); if (!c) return; const t = _now();
  const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 1760;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.16,t+0.003);
  g.gain.exponentialRampToValueAtTime(0.0001,t+0.09);
  o.connect(g); _toOut(g, 0.03); o.start(t); o.stop(t+0.10);
}

export function playerHurt() {
  _playRandom(['player/hurt_1.mp3','player/hurt_2.mp3','player/hurt_3.mp3'],
    { volume: 0.70, reverb: 0.05, pitch: 0.9 + Math.random()*0.2 }, () => {
      const c = _ctx_(); if (!c) return; const t = _now();
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(45,t+0.16);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.38,t+0.007);
      g.gain.exponentialRampToValueAtTime(0.0001,t+0.20);
      const lp = _lp(700); o.connect(lp); lp.connect(g); _toOut(g,0.10); o.start(t); o.stop(t+0.22);
    });
}

export function playerDeath() {
  _playFile('player/death.mp3', { volume: 0.80, reverb: 0.30 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(210,t); o.frequency.exponentialRampToValueAtTime(48,t+2.2);
    const g = c.createGain(); g.gain.setValueAtTime(0.28,t); g.gain.linearRampToValueAtTime(0.0001,t+2.4);
    const lp = _lp(700); o.connect(lp); lp.connect(g); _toOut(g,0.35); o.start(t); o.stop(t+2.5);
  });
}

export function bodyFall() {
  _playFile('player/body_fall.mp3', { volume: 0.75, reverb: 0.12 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(58,t); o.frequency.exponentialRampToValueAtTime(22,t+0.22);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.38,t+0.004);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.28);
    const lp = _lp(180); o.connect(lp); lp.connect(g); _toOut(g,0.14); o.start(t); o.stop(t+0.30);
    const n = _noise(0.25, 580, 0.7);
    if (n) { _env(n.gain,0.005,0.03,0.15,0.18,0.20); _toOut(n.gain,0.06); n.src.start(t+0.02); }
  });
}

export function jumpLand() {
  _playFile('player/land.mp3', { volume: 0.55, reverb: 0.06, pitch: 0.9+Math.random()*0.2 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(75,t); o.frequency.exponentialRampToValueAtTime(28,t+0.14);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.26,t+0.003);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.14);
    o.connect(g); _toOut(g,0.08); o.start(t); o.stop(t+0.16);
  });
}

export function eatSound() {
  _playFile('player/eat.mp3', { volume: 0.55, reverb: 0.03 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.14, 1700, 1.8);
    if (n) { _env(n.gain,0.006,0.022,0.28,0.09,0.13); _toOut(n.gain,0.03); n.src.start(t); }
  });
}

export function sprintExhale() {
  _playFile('player/exhale.mp3', { volume: 0.28, reverb: 0.02 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.22, 900, 0.5);
    if (n) { _env(n.gain,0.02,0.06,0.3,0.12,0.09); _toOut(n.gain,0.02); n.src.start(t); }
  });
}

// ── LATIDO CARDÍACO ───────────────────────────────────────────────────────────
let _hbInterval = null;
export function startHeartbeat() {
  if (_hbInterval) return;
  const beat = () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const thud = (off, f, amp) => {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f, t+off); o.frequency.exponentialRampToValueAtTime(f*0.4, t+off+0.13);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t+off); g.gain.linearRampToValueAtTime(amp,t+off+0.010);
      g.gain.exponentialRampToValueAtTime(0.0001,t+off+0.15);
      o.connect(g); _toOut(g,0.04); o.start(t+off); o.stop(t+off+0.17);
    };
    thud(0, 55, 0.24); thud(0.19, 44, 0.15);
  };
  beat();
  _hbInterval = setInterval(beat, 860);
}
export function stopHeartbeat() { clearInterval(_hbInterval); _hbInterval = null; }

// ── VACAS ─────────────────────────────────────────────────────────────────────
export function cowMoo(panicked = false) {
  if (panicked) {
    _playFile('animals/cow_panic.mp3', { volume: 0.70, reverb: 0.30, pitch: 0.9+Math.random()*0.2 }, _cowMooSynth.bind(null, true));
  } else {
    _playRandom(['animals/cow_1.mp3','animals/cow_2.mp3','animals/cow_3.mp3'],
      { volume: 0.55, reverb: 0.35, pitch: 0.88+Math.random()*0.24 }, _cowMooSynth.bind(null, false));
  }
}
function _cowMooSynth(panicked) {
  const c = _ctx_(); if (!c) return; const t = _now();
  const f = panicked ? 290 : 155 + Math.random()*25;
  const dur = panicked ? 0.38 : 1.1 + Math.random()*0.35;
  const mod = c.createOscillator(); mod.type = 'sine'; mod.frequency.value = f*0.52;
  const modG = c.createGain(); modG.gain.value = panicked ? 55 : 25;
  mod.connect(modG);
  const car = c.createOscillator(); car.type = 'sawtooth'; car.frequency.value = f;
  if (!panicked) {
    car.frequency.setValueAtTime(f*0.88,t);
    car.frequency.linearRampToValueAtTime(f*1.06,t+dur*0.38);
    car.frequency.linearRampToValueAtTime(f*0.90,t+dur);
  }
  modG.connect(car.frequency);
  const lp = _lp(panicked ? 950 : 720); lp.Q = { value: 1.2 };
  const g = c.createGain(); _env(g, 0.06, 0.10, 0.70, panicked ? 0.18 : 0.55, panicked ? 0.35 : 0.26);
  car.connect(lp); lp.connect(g); _toOut(g, 0.30);
  mod.start(t); car.start(t); mod.stop(t+dur+0.7); car.stop(t+dur+0.7);
}

// ── CABALLO ───────────────────────────────────────────────────────────────────
export function horseNeigh() {
  _playFile('animals/horse_neigh.mp3', { volume: 0.65, reverb: 0.30, pitch: 0.92+Math.random()*0.16 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(310,t); o.frequency.linearRampToValueAtTime(570,t+0.22);
    o.frequency.linearRampToValueAtTime(430,t+0.50); o.frequency.exponentialRampToValueAtTime(175,t+0.88);
    const lp = _lp(1100); const g = c.createGain(); _env(g,0.022,0.08,0.65,0.38,0.30);
    o.connect(lp); lp.connect(g); _toOut(g,0.30); o.start(t); o.stop(t+1.0);
  });
}
export function horseSnort() {
  _playFile('animals/horse_snort.mp3', { volume: 0.45, reverb: 0.12, pitch: 0.9+Math.random()*0.2 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.28, 320, 1.2);
    if (n) { _env(n.gain,0.008,0.05,0.4,0.20,0.22); _toOut(n.gain,0.12); n.src.start(t); }
  });
}

// Galope: usa archivo loop si existe, sino síntesis
let _gallopSrc = null, _gallopTimer = null;
export function startGallop() {
  if (_gallopSrc || _gallopTimer) return;
  _load('animals/horse_gallop.mp3').then(buf => {
    if (buf) {
      _gallopSrc = _play(buf, { volume: 0.62, reverb: 0.14, loop: true });
    } else {
      _startGallopSynth();
    }
  });
}
export function stopGallop() {
  if (_gallopSrc) { try { _gallopSrc.stop(); } catch(e) {} _gallopSrc = null; }
  if (_gallopTimer) { clearTimeout(_gallopTimer); _gallopTimer = null; }
}
function _startGallopSynth() {
  const hoof = () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(85+Math.random()*15,t); o.frequency.exponentialRampToValueAtTime(34,t+0.092);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.28,t+0.006);
    g.gain.exponentialRampToValueAtTime(0.0001,t+0.10);
    o.connect(g); _toOut(g,0.10); o.start(t); o.stop(t+0.11);
    const n = _noise(0.07, 580, 0.5);
    if (n) { _env(n.gain,0.002,0.012,0.04,0.05,0.14); _toOut(n.gain,0.05); n.src.start(t); }
  };
  [0, 0.13, 0.24, 0.34].forEach(off => setTimeout(hoof, off * 1000));
  _gallopTimer = setTimeout(() => { _gallopTimer = null; if (_gallopSrc === null) _startGallopSynth(); }, 460);
}

export function mountSound() {
  _playFile('player/mount_leather.mp3', { volume: 0.55, reverb: 0.08 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.20, 580, 1.1);
    if (n) { _env(n.gain,0.012,0.04,0.28,0.12,0.20); _toOut(n.gain,0.05); n.src.start(t); }
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(65,t+0.05); o.frequency.exponentialRampToValueAtTime(28,t+0.18);
    const g = c.createGain(); _env(g,0.004,0.04,0.0,0.12,0.18);
    o.connect(g); _toOut(g,0.07); o.start(t+0.05); o.stop(t+0.24);
  });
}

// ── GALLINAS ──────────────────────────────────────────────────────────────────
export function chickenCluck() {
  _playRandom(['animals/chicken_1.mp3','animals/chicken_2.mp3'],
    { volume: 0.45, reverb: 0.10, pitch: 0.85+Math.random()*0.3 }, () => {
      const c = _ctx_(); if (!c) return; const t = _now();
      [[0,680,0.13],[0.11,820,0.09]].forEach(([delay,freq,dur]) => {
        const o = c.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime(freq,t+delay); o.frequency.exponentialRampToValueAtTime(freq*0.65,t+delay+dur);
        const lp = _lp(1400); const g = c.createGain();
        g.gain.setValueAtTime(0.0001,t+delay); g.gain.linearRampToValueAtTime(0.09,t+delay+0.012);
        g.gain.exponentialRampToValueAtTime(0.0001,t+delay+dur+0.04);
        o.connect(lp); lp.connect(g); _toOut(g,0.08); o.start(t+delay); o.stop(t+delay+dur+0.06);
      });
    });
}
export function chickenPanic() {
  _playFile('animals/chicken_panic.mp3', { volume: 0.60, reverb: 0.12, pitch: 0.9+Math.random()*0.2 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    for (let i=0; i<5; i++) {
      const d=i*0.09, f=700+Math.random()*400;
      const o = c.createOscillator(); o.type='square'; o.frequency.setValueAtTime(f,t+d);
      o.frequency.exponentialRampToValueAtTime(f*0.5,t+d+0.08);
      const lp = _lp(1600); const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t+d); g.gain.linearRampToValueAtTime(0.11,t+d+0.008);
      g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.10);
      o.connect(lp); lp.connect(g); _toOut(g,0.06); o.start(t+d); o.stop(t+d+0.12);
    }
    const n = _noise(0.4,3800,0.6);
    if (n) { _env(n.gain,0.01,0.05,0.2,0.28,0.12); _toOut(n.gain,0.04); n.src.start(t+0.05); }
  });
}

// ── AVESTRUZ ──────────────────────────────────────────────────────────────────
export function ostrichCall() {
  _playFile('animals/ostrich.mp3', { volume: 0.55, reverb: 0.22, pitch: 0.85+Math.random()*0.3 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(48,t); o.frequency.linearRampToValueAtTime(62,t+0.18);
    o.frequency.exponentialRampToValueAtTime(35,t+0.65);
    const g = c.createGain(); _env(g,0.015,0.08,0.5,0.55,0.30);
    const lp = _lp(200); o.connect(lp); lp.connect(g); _toOut(g,0.20); o.start(t); o.stop(t+0.80);
  });
}

// ── COYOTE ────────────────────────────────────────────────────────────────────
export function coyoteHowl() {
  _playFile('animals/coyote.mp3', { volume: 0.45, reverb: 0.60, pitch: 0.88+Math.random()*0.24 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type='sine';
    o.frequency.setValueAtTime(275,t); o.frequency.linearRampToValueAtTime(530,t+0.48);
    o.frequency.linearRampToValueAtTime(510,t+0.85); o.frequency.linearRampToValueAtTime(370,t+1.90);
    const vib=c.createOscillator(); vib.type='sine'; vib.frequency.value=5.8;
    const vibG=c.createGain(); vibG.gain.value=11; vib.connect(vibG); vibG.connect(o.frequency);
    const lp=_lp(1800); const g=c.createGain(); _env(g,0.09,0.05,0.82,0.75,0.18);
    o.connect(lp); lp.connect(g); _toOut(g,0.55);
    vib.start(t+0.45); vib.stop(t+2.7); o.start(t); o.stop(t+2.7);
  });
}

// ── LAZO ──────────────────────────────────────────────────────────────────────
export function lassoThrow() {
  const c = _ctx_(); if (!c) return; const t = _now();
  const n = _noise(0.30, 1700, 2.2);
  if (n) { _env(n.gain,0.01,0.04,0.20,0.20,0.16); _toOut(n.gain,0.08); n.src.start(t); }
}
export function lassoSnap() {
  const c = _ctx_(); if (!c) return; const t = _now();
  const n = _noise(0.07, 3400, 2.8);
  if (n) { _env(n.gain,0.001,0.006,0.0,0.05,0.26); _toOut(n.gain,0.06); n.src.start(t); }
}
let _lassoSpinTimer = null;
export function startLassoSpin() {
  if (_lassoSpinTimer) return;
  const spin = () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const n = _noise(0.25, 820, 1.4);
    if (n) { _env(n.gain,0.02,0.08,0.38,0.10,0.09); _toOut(n.gain,0.05); n.src.start(t); }
    _lassoSpinTimer = setTimeout(spin, 260);
  }; spin();
}
export function stopLassoSpin() { clearTimeout(_lassoSpinTimer); _lassoSpinTimer = null; }

// ── AMBIENTE — LOOPS ──────────────────────────────────────────────────────────
// Helper genérico para loops de ambiente
function _makeAmbientLoop(path, volume, revMix, fallbackFn) {
  let src = null, gainNode = null;
  return {
    start() {
      if (src) return;
      const c = _ctx_(); if (!c) return;
      gainNode = c.createGain(); gainNode.gain.value = 0.0001;
      gainNode.gain.linearRampToValueAtTime(volume, c.currentTime + 2.0);
      _toOut(gainNode, revMix);

      _load(path).then(buf => {
        if (!buf) { fallbackFn?.(); return; }
        src = c.createBufferSource();
        src.buffer = buf; src.loop = true;
        src.connect(gainNode);
        src.start();
      });
    },
    stop() {
      if (!gainNode) return;
      const c = _ctx_();
      gainNode.gain.linearRampToValueAtTime(0.0001, (c?.currentTime ?? 0) + 1.5);
      setTimeout(() => { try { src?.stop(); } catch(e) {} src = null; gainNode = null; }, 1700);
    },
    get active() { return !!src; }
  };
}

const _wind     = _makeAmbientLoop('ambient/wind.mp3',     0.55, 0.0,  _windFallback);
const _crickets = _makeAmbientLoop('ambient/crickets.mp3', 0.48, 0.0,  _cricketsFallback);
const _birds    = _makeAmbientLoop('ambient/birds.mp3',    0.38, 0.15, null);
const _rain     = _makeAmbientLoop('ambient/rain.mp3',     0.62, 0.0,  null);
const _fire     = _makeAmbientLoop('ambient/fire.mp3',     0.42, 0.08, null);

export const startWind     = () => _wind.start();
export const stopWind      = () => _wind.stop();
export const startCrickets = () => _crickets.start();
export const stopCrickets  = () => _crickets.stop();
export const startBirds    = () => _birds.start();
export const stopBirds     = () => _birds.stop();
export const startRain     = () => _rain.start();
export const stopRain      = () => _rain.stop();
export const startFire     = () => _fire.start();
export const stopFire      = () => _fire.stop();

// Fallbacks procedurales para viento y grillos
function _windFallback() {
  // Se llama si wind.mp3 no existe — mantiene el loop sintético
}
function _cricketsFallback() {}

// ── DRONE PAMPA (sub-graves, siempre) ─────────────────────────────────────────
let _droneNodes = [];
export function startAmbientDrone() {
  if (_droneNodes.length) return;
  const c = _ctx_(); if (!c) return;
  [36.7, 37.4, 55.0].forEach((freq, i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
    const lfo = c.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.04+i*0.02;
    const lfoG = c.createGain(); lfoG.gain.value=0.018; lfo.connect(lfoG); lfoG.connect(o.frequency);
    const g = c.createGain(); g.gain.value=0.050-i*0.010;
    const lp = _lp(120); o.connect(lp); lp.connect(g); g.connect(_out);
    o.start(); lfo.start();
    _droneNodes.push({ stop: () => { try { o.stop(); lfo.stop(); } catch(e){} } });
  });
}
export function stopAmbientDrone() { _droneNodes.forEach(n=>n.stop?.()); _droneNodes=[]; }

// ── TRUENO ────────────────────────────────────────────────────────────────────
export function distantThunder() {
  _playRandom(['ambient/thunder_1.mp3','ambient/thunder_2.mp3','ambient/thunder_3.mp3'],
    { volume: 0.58, reverb: 0.65, pitch: 0.7+Math.random()*0.3 }, () => {
      const c = _ctx_(); if (!c) return; const t = _now(); const dur = 2.8+Math.random()*1.5;
      const n = _noise(dur, 55+Math.random()*30, 0.4); if (!n) return;
      const g = n.gain.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(0.0001,t);
      g.linearRampToValueAtTime(0.28,t+0.18); g.linearRampToValueAtTime(0.22,t+0.6);
      g.linearRampToValueAtTime(0.0001,t+dur); _toOut(n.gain,0.55); n.src.start(t);
    });
}

// ── ESTAMPIDA ────────────────────────────────────────────────────────────────
export function stampedeRumble() {
  const c = _ctx_(); if (!c) return; const t = _now(); const dur = 4.5;
  // Usa buffers cortos con loop para evitar bloquear el hilo principal
  [60,90,130,200].forEach((freq, i) => {
    const n = _noise(0.8, freq, 0.5+i*0.1); if (!n) return; // 0.8s max, loop
    n.src.loop = true; n.src.loopEnd = 0.8;
    const g = n.gain.gain;
    g.cancelScheduledValues(t+i*0.05); g.setValueAtTime(0.0001,t+i*0.05);
    g.linearRampToValueAtTime(0.22-i*0.04,t+i*0.05+0.6);
    g.linearRampToValueAtTime(0.0001,t+i*0.05+dur-i*0.3);
    _toOut(n.gain,0.25); n.src.start(t+i*0.05); n.src.stop(t+i*0.05+dur-i*0.3+0.1);
  });
  setTimeout(()=>cowMoo(true),200);
  setTimeout(()=>cowMoo(true),700);
  setTimeout(()=>cowMoo(true),1300);
}

// ── CRUJIDO MADERA ────────────────────────────────────────────────────────────
export function woodCreak() {
  _playRandom(['ambient/wood_creak_1.mp3','ambient/wood_creak_2.mp3',
               'ambient/creak_1.mp3','ambient/creak_2.mp3','ambient/creak_3.mp3'],
    { volume: 0.35, reverb: 0.12, pitch: 0.85+Math.random()*0.3 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type='sawtooth';
    const f0 = 180+Math.random()*80;
    o.frequency.setValueAtTime(f0,t); o.frequency.linearRampToValueAtTime(f0*0.6,t+0.18);
    o.frequency.linearRampToValueAtTime(f0*0.8,t+0.32);
    const lp = _lp(900); lp.Q.value = 2;
    const g = c.createGain(); _env(g,0.005,0.04,0.3,0.22,0.10);
    o.connect(lp); lp.connect(g); _toOut(g,0.10); o.start(t); o.stop(t+0.38);
  });
}

// ── GM BELL ───────────────────────────────────────────────────────────────────
export function gmBell() {
  _playFile('ambient/bell_gm.mp3', { volume: 0.55, reverb: 0.45 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    [[0,880],[0.16,1108],[0.30,660]].forEach(([delay,freq]) => {
      const o = c.createOscillator(); o.type='sine'; o.frequency.value=freq;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t+delay); g.gain.linearRampToValueAtTime(0.11,t+delay+0.006);
      g.gain.exponentialRampToValueAtTime(0.0001,t+delay+1.0);
      o.connect(g); _toOut(g,0.40); o.start(t+delay); o.stop(t+delay+1.1);
    });
  });
}

// ── CORRAL ────────────────────────────────────────────────────────────────────
export function corralBell() {
  _playFile('ambient/corral_bell.mp3', { volume: 0.65, reverb: 0.50 }, () => {
    const c = _ctx_(); if (!c) return; const t = _now();
    const o = c.createOscillator(); o.type='sine'; o.frequency.value=648;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.22,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+1.5);
    o.connect(g); _toOut(g,0.42); o.start(t); o.stop(t+1.6);
  });
}
export function victory() {
  // Tres acordes de guitarra — C maj → G maj → C maj
  const c = _ctx_(); if (!c) return; const t = _now();
  [[261,329,392,0],[392,494,587,0.55],[523,659,784,1.1]].forEach(([f1,f2,f3,delay])=>{
    [f1,f2,f3].forEach(freq => {
      const o = c.createOscillator(); o.type='triangle'; o.frequency.value=freq;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t+delay); g.gain.linearRampToValueAtTime(0.12,t+delay+0.025);
      g.gain.exponentialRampToValueAtTime(0.0001,t+delay+0.9);
      o.connect(g); _toOut(g,0.28); o.start(t+delay); o.stop(t+delay+1.0);
    });
  });
}

// ── MÚSICA LOBBY ─────────────────────────────────────────────────────────────
let _lobbyNodes = [];
export function startLobbyMusic() {
  if (_lobbyNodes.length) return;
  initAudio();
  const c = _ctx_(); if (!c) return;
  [82.4,110.0,146.8].forEach((freq,i) => {
    const o = c.createOscillator(); o.type='triangle'; o.frequency.value=freq+(Math.random()-0.5)*0.9;
    const lfo=c.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.55+i*0.18;
    const lfoG=c.createGain(); lfoG.gain.value=0.038; lfo.connect(lfoG);
    const lp=_lp(650); const g=c.createGain(); g.gain.value=0.058-i*0.012; lfoG.connect(g.gain);
    o.connect(lp); lp.connect(g); _toOut(g,0.55); o.start(); lfo.start();
    _lobbyNodes.push({stop:()=>{try{o.stop();lfo.stop();}catch(e){}}});
  });
  const scale=[329,392,440,494,392,349,294]; let idx=0;
  const playNote=()=>{
    if (!_lobbyNodes.length) return;
    const c2=_ctx_(); if (!c2) return; const tt=_now();
    const o=c2.createOscillator(); o.type='triangle'; o.frequency.value=scale[idx%scale.length]*0.5; idx++;
    const lp2=_lp(1100); const g2=c2.createGain();
    g2.gain.setValueAtTime(0.0001,tt); g2.gain.linearRampToValueAtTime(0.075,tt+0.05);
    g2.gain.exponentialRampToValueAtTime(0.0001,tt+2.5);
    o.connect(lp2); lp2.connect(g2); _toOut(g2,0.55); o.start(tt); o.stop(tt+2.8);
    const tid=setTimeout(playNote,2800+Math.random()*3200);
    _lobbyNodes.push({stop:()=>clearTimeout(tid)});
  };
  const itid=setTimeout(playNote,1200); _lobbyNodes.push({stop:()=>clearTimeout(itid)});
}
export function stopLobbyMusic() { _lobbyNodes.forEach(n=>n.stop?.()); _lobbyNodes=[]; }

// ── VOLUMEN MASTER ────────────────────────────────────────────────────────────
export function setMasterVolume(v) {
  if (_out) _out.gain.value = Math.max(0, Math.min(1, v));
}
