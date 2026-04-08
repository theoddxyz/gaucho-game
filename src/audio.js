/**
 * src/audio.js — Motor de audio procedural GAUCHO
 * Estilo: ASMR retro realista soft
 * Web Audio API pura — sin archivos externos, sin costo
 *
 * API pública:
 *   initAudio()            — llamar al primer gesto del usuario
 *   footstep(surface)      — 'dirt' | 'grass' | 'wood'
 *   shotgun()
 *   bulletWhiz()
 *   hitMarker()
 *   playerHurt()
 *   playerDeath()
 *   startHeartbeat() / stopHeartbeat()
 *   cowMoo(panicked)
 *   horseNeigh()
 *   startGallop() / stopGallop()
 *   coyoteHowl()
 *   gmBell()
 *   lassoThrow() / lassoSnap()
 *   startLassoSpin() / stopLassoSpin()
 *   mountSound()
 *   startWind() / stopWind()
 *   startCrickets() / stopCrickets()
 *   victory()
 *   corralBell()
 *   startLobbyMusic() / stopLobbyMusic()
 *   eatSound()
 *   setMasterVolume(0-1)
 */

// ── Context (lazy init, requiere gesto del usuario) ───────────────────────────
let _ctx  = null;
let _out  = null;   // salida master con ganancia
let _rev  = null;   // reverb de pampa abierta

export function initAudio() {
  if (_ctx) return;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Compressor suave — evita clipping, satura cálido
    const comp = _ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value      =  12;
    comp.ratio.value     =   4;
    comp.attack.value    = 0.003;
    comp.release.value   = 0.25;
    comp.connect(_ctx.destination);

    _out = _ctx.createGain();
    _out.gain.value = 0.72;
    _out.connect(comp);

    // Reverb convolucion sintética (pampa abierta — cola larga, difusa)
    const sr  = _ctx.sampleRate;
    const len = Math.floor(sr * 2.8);
    const buf = _ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        // Exponential decay + random
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.6);
      }
    }
    _rev = _ctx.createConvolver();
    _rev.buffer = buf;
    const revGain = _ctx.createGain();
    revGain.gain.value = 0.20;
    _rev.connect(revGain);
    revGain.connect(_out);

    console.log('[AUDIO] inicializado, sampleRate=' + sr);
  } catch(e) {
    console.warn('[AUDIO] no disponible:', e.message);
  }
}

// ── Helpers internos ──────────────────────────────────────────────────────────

function _ctx_() {
  if (!_ctx) initAudio();
  if (_ctx && _ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

function _now() { const c = _ctx_(); return c ? c.currentTime : 0; }

/** Ruido blanco → BandPass. Devuelve { src, gain } sin conectar. */
function _noise(dur, freq, Q) {
  const c   = _ctx_(); if (!c) return null;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src  = c.createBufferSource();
  src.buffer = buf;
  const flt  = c.createBiquadFilter();
  flt.type            = 'bandpass';
  flt.frequency.value = freq;
  flt.Q.value         = Q;
  const g = c.createGain();
  g.gain.value = 0;
  src.connect(flt);
  flt.connect(g);
  return { src, gain: g };
}

/** Envolvente suave (ADSR simple sobre un GainNode). */
function _env(gainNode, a, d, s, r, peak = 1) {
  const t = _now();
  const g = gainNode.gain;
  g.cancelScheduledValues(t);
  g.setValueAtTime(0.0001, t);
  g.linearRampToValueAtTime(peak,       t + a);
  g.linearRampToValueAtTime(peak * s,   t + a + d);
  g.linearRampToValueAtTime(0.0001,     t + a + d + r);
}

/** Conecta un nodo a _out y al reverb con mezcla controlada. */
function _toOut(node, revMix = 0.18) {
  if (!_out) return;
  node.connect(_out);
  if (_rev && revMix > 0) {
    const rg = _ctx_().createGain();
    rg.gain.value = revMix;
    node.connect(rg);
    rg.connect(_rev);
  }
}

/** Lowpass cálido sobre cualquier nodo. Devuelve el filtro. */
function _lp(src, freq, Q = 0.7) {
  const c = _ctx_(); if (!c) return src;
  const f = c.createBiquadFilter();
  f.type            = 'lowpass';
  f.frequency.value = freq;
  f.Q.value         = Q;
  src.connect(f);
  return f;
}

// ── PASOS ─────────────────────────────────────────────────────────────────────

export function footstep(surface = 'dirt') {
  const c = _ctx_(); if (!c) return;
  const t = _now();

  // Sub-thud (impacto del pie)
  const thud = c.createOscillator();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(72 + Math.random() * 14, t);
  thud.frequency.exponentialRampToValueAtTime(28, t + 0.10);
  const tg = c.createGain();
  tg.gain.setValueAtTime(0.0001, t);
  tg.gain.linearRampToValueAtTime(0.22, t + 0.005);
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
  thud.connect(tg);
  _toOut(tg, 0.06);
  thud.start(t); thud.stop(t + 0.14);

  // Textura de superficie
  const freqMap  = { dirt: 700,  grass: 1300, wood: 1800 };
  const qMap     = { dirt: 0.55, grass: 0.90, wood: 1.40 };
  const gainMap  = { dirt: 0.24, grass: 0.18, wood: 0.30 };
  const n = _noise(0.10, freqMap[surface] || 700, qMap[surface] || 0.55);
  if (!n) return;
  _env(n.gain, 0.003, 0.018, 0.08, 0.07, gainMap[surface] || 0.22);
  _toOut(n.gain, 0.04);
  n.src.start(t);
}

// ── ESCOPETA ──────────────────────────────────────────────────────────────────

export function shotgun() {
  const c = _ctx_(); if (!c) return;
  const t = _now();

  // Boom grave (explosión filtrada, cálida)
  const body = c.createOscillator();
  body.type = 'sawtooth';
  body.frequency.setValueAtTime(58, t);
  body.frequency.exponentialRampToValueAtTime(20, t + 0.22);
  const lp1 = c.createBiquadFilter();
  lp1.type = 'lowpass'; lp1.frequency.value = 280; lp1.Q.value = 0.6;
  const bg = c.createGain();
  bg.gain.setValueAtTime(0.0001, t);
  bg.gain.linearRampToValueAtTime(0.55, t + 0.006);
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  body.connect(lp1); lp1.connect(bg);
  _toOut(bg, 0.40);
  body.start(t); body.stop(t + 0.30);

  // Transiente seco (crack suave retro)
  const n1 = _noise(0.05, 2600, 1.0);
  if (n1) {
    _env(n1.gain, 0.001, 0.008, 0.0, 0.04, 0.28);
    _toOut(n1.gain, 0.15);
    n1.src.start(t);
  }

  // Cola grave (reverb natural del campo)
  const n2 = _noise(0.55, 160, 0.35);
  if (n2) {
    _env(n2.gain, 0.012, 0.06, 0.15, 0.42, 0.16);
    _toOut(n2.gain, 0.50);
    n2.src.start(t);
  }
}

// ── BALA PASANDO CERCA ────────────────────────────────────────────────────────

export function bulletWhiz() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const f0 = 1600 + Math.random() * 500;
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(f0 * 0.24, t + 0.20);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.11, t + 0.012);
  g.gain.linearRampToValueAtTime(0.0001, t + 0.21);
  osc.connect(g);
  _toOut(g, 0.08);
  osc.start(t); osc.stop(t + 0.22);
}

// ── HIT MARKER ────────────────────────────────────────────────────────────────

export function hitMarker() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 1760;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.16, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(g);
  _toOut(g, 0.04);
  osc.start(t); osc.stop(t + 0.10);
}

// ── DAÑO RECIBIDO ─────────────────────────────────────────────────────────────

export function playerHurt() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  // Impacto sordo + distorsión cálida
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(130, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.16);
  const wp = c.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 30) * x / (Math.PI + 30 * Math.abs(x));
  }
  wp.curve = curve;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.38, t + 0.007);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.20);
  osc.connect(wp); wp.connect(g);
  _toOut(g, 0.12);
  osc.start(t); osc.stop(t + 0.22);
}

// ── MUERTE ────────────────────────────────────────────────────────────────────

export function playerDeath() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  // Tono que cae y desaparece — como un western film
  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(210, t);
  osc.frequency.exponentialRampToValueAtTime(48, t + 2.2);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 700;
  const g = c.createGain();
  g.gain.setValueAtTime(0.28, t);
  g.gain.linearRampToValueAtTime(0.0001, t + 2.4);
  osc.connect(lp); lp.connect(g);
  _toOut(g, 0.35);
  osc.start(t); osc.stop(t + 2.5);
}

// ── LATIDO CARDÍACO (HP bajo) ─────────────────────────────────────────────────

let _hbInterval = null;

export function startHeartbeat() {
  if (_hbInterval) return;
  const doBeat = () => {
    const c = _ctx_(); if (!c) return;
    const t = _now();
    const thud = (offset, freq, amp) => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, t + offset);
      o.frequency.exponentialRampToValueAtTime(freq * 0.4, t + offset + 0.13);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t + offset);
      g.gain.linearRampToValueAtTime(amp, t + offset + 0.010);
      g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.15);
      o.connect(g); _toOut(g, 0.04);
      o.start(t + offset); o.stop(t + offset + 0.17);
    };
    thud(0,    55, 0.24);   // lub
    thud(0.19, 44, 0.15);   // dub
  };
  doBeat();
  _hbInterval = setInterval(doBeat, 860);
}

export function stopHeartbeat() {
  clearInterval(_hbInterval);
  _hbInterval = null;
}

// ── MUGIDO VACA ───────────────────────────────────────────────────────────────

export function cowMoo(panicked = false) {
  const c = _ctx_(); if (!c) return;
  const t   = _now();
  const f   = panicked ? 290 + Math.random() * 30 : 155 + Math.random() * 25;
  const dur = panicked ? 0.38 : 1.1 + Math.random() * 0.35;

  // FM: modulador → portadora sawtooth → lowpass
  const mod  = c.createOscillator();
  mod.type   = 'sine';
  mod.frequency.value = f * 0.52;
  const modG = c.createGain();
  modG.gain.value = panicked ? 55 : 25;
  mod.connect(modG);

  const car = c.createOscillator();
  car.type  = 'sawtooth';
  car.frequency.value = f;
  if (!panicked) {
    car.frequency.setValueAtTime(f * 0.88, t);
    car.frequency.linearRampToValueAtTime(f * 1.06, t + dur * 0.38);
    car.frequency.linearRampToValueAtTime(f * 0.90, t + dur);
  }
  modG.connect(car.frequency);

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = panicked ? 950 : 720; lp.Q.value = 1.2;
  const g  = c.createGain();
  _env(g, 0.06, 0.10, 0.70, panicked ? 0.18 : 0.55, panicked ? 0.35 : 0.26);

  car.connect(lp); lp.connect(g);
  _toOut(g, 0.28);

  mod.start(t); car.start(t);
  mod.stop(t + dur + 0.7); car.stop(t + dur + 0.7);
}

// ── RELINCHO CABALLO ──────────────────────────────────────────────────────────

export function horseNeigh() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(310, t);
  osc.frequency.linearRampToValueAtTime(570, t + 0.22);
  osc.frequency.linearRampToValueAtTime(430, t + 0.50);
  osc.frequency.exponentialRampToValueAtTime(175, t + 0.88);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 1100;
  const g = c.createGain();
  _env(g, 0.022, 0.08, 0.65, 0.38, 0.30);
  osc.connect(lp); lp.connect(g);
  _toOut(g, 0.30);
  osc.start(t); osc.stop(t + 1.0);
}

// ── GALOPE (loop) ─────────────────────────────────────────────────────────────

let _gallopTimer = null;

export function startGallop() {
  if (_gallopTimer) return;
  const hoof = (offset = 0) => {
    const c = _ctx_(); if (!c) return;
    const t = _now() + offset;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(85 + Math.random() * 15, t);
    o.frequency.exponentialRampToValueAtTime(34, t + 0.092);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.28, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.10);
    o.connect(g); _toOut(g, 0.10);
    o.start(t); o.stop(t + 0.11);
    // tierra
    const n = _noise(0.07, 580, 0.5);
    if (n) { _env(n.gain, 0.002, 0.012, 0.04, 0.05, 0.14); _toOut(n.gain, 0.05); n.src.start(t); }
  };
  // 4 cascos con patrón de galope
  const pattern = [0, 0.13, 0.24, 0.34];
  let step = 0;
  const tick = () => {
    pattern.forEach(offset => hoof(offset));
    step++;
    _gallopTimer = setTimeout(tick, 460);
  };
  tick();
}

export function stopGallop() {
  clearTimeout(_gallopTimer);
  _gallopTimer = null;
}

// ── AULLIDO COYOTE ────────────────────────────────────────────────────────────

export function coyoteHowl() {
  const c = _ctx_(); if (!c) return;
  const t = _now();

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(275, t);
  osc.frequency.linearRampToValueAtTime(530, t + 0.48);
  osc.frequency.linearRampToValueAtTime(510, t + 0.85);
  osc.frequency.linearRampToValueAtTime(370, t + 1.90);

  // Vibrato
  const vib  = c.createOscillator();
  vib.type   = 'sine';
  vib.frequency.value = 5.8;
  const vibG = c.createGain();
  vibG.gain.value = 11;
  vib.connect(vibG); vibG.connect(osc.frequency);

  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 1800;
  const g  = c.createGain();
  _env(g, 0.09, 0.05, 0.82, 0.75, 0.18);

  osc.connect(lp); lp.connect(g);
  _toOut(g, 0.50);   // mucho reverb — suena lejano

  vib.start(t + 0.45); vib.stop(t + 2.7);
  osc.start(t); osc.stop(t + 2.7);
}

// ── CAMPANITA GM ──────────────────────────────────────────────────────────────

export function gmBell() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  [[0, 880], [0.16, 1108], [0.30, 660]].forEach(([delay, freq]) => {
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t + delay);
    g.gain.linearRampToValueAtTime(0.11, t + delay + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.0);
    o.connect(g); _toOut(g, 0.40);
    o.start(t + delay); o.stop(t + delay + 1.1);
  });
}

// ── LAZO ──────────────────────────────────────────────────────────────────────

export function lassoThrow() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const n = _noise(0.30, 1700, 2.2);
  if (!n) return;
  _env(n.gain, 0.01, 0.04, 0.20, 0.20, 0.16);
  _toOut(n.gain, 0.08);
  n.src.start(t);
}

export function lassoSnap() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const n = _noise(0.07, 3400, 2.8);
  if (!n) return;
  _env(n.gain, 0.001, 0.006, 0.0, 0.05, 0.26);
  _toOut(n.gain, 0.06);
  n.src.start(t);
}

let _lassoSpinTimer = null;
export function startLassoSpin() {
  if (_lassoSpinTimer) return;
  const spin = () => {
    const c = _ctx_(); if (!c) return;
    const t = _now();
    const n = _noise(0.25, 820, 1.4);
    if (!n) return;
    _env(n.gain, 0.02, 0.08, 0.38, 0.10, 0.09);
    _toOut(n.gain, 0.05);
    n.src.start(t);
    _lassoSpinTimer = setTimeout(spin, 260);
  };
  spin();
}
export function stopLassoSpin() {
  clearTimeout(_lassoSpinTimer);
  _lassoSpinTimer = null;
}

// ── MONTAR CABALLO ────────────────────────────────────────────────────────────

export function mountSound() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  // Crujido de cuero de silla
  const n = _noise(0.20, 580, 1.1);
  if (n) { _env(n.gain, 0.012, 0.04, 0.28, 0.12, 0.20); _toOut(n.gain, 0.07); n.src.start(t); }
  // Thud de asentarse
  const o = c.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(65, t + 0.05);
  o.frequency.exponentialRampToValueAtTime(28, t + 0.18);
  const g = c.createGain();
  _env(g, 0.004, 0.04, 0.0, 0.12, 0.18);
  o.connect(g); _toOut(g, 0.07);
  o.start(t + 0.05); o.stop(t + 0.24);
}

// ── VIENTO PAMPA (loop) ───────────────────────────────────────────────────────

let _windSrc  = null;
let _windGain = null;
let _windLfo  = null;

export function startWind(intensity = 0.45) {
  if (_windSrc) return;
  const c = _ctx_(); if (!c) return;

  // Ruido largo (4s loop)
  const sr  = c.sampleRate;
  const len = sr * 4;
  const buf = c.createBuffer(1, len, sr);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

  _windSrc        = c.createBufferSource();
  _windSrc.buffer = buf;
  _windSrc.loop   = true;

  const hp = c.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 60;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';  lp.frequency.value = 380 + intensity * 250;

  // LFO de amplitud: ráfagas naturales
  _windLfo = c.createOscillator();
  _windLfo.type = 'sine';
  _windLfo.frequency.value = 0.14;
  const lfoG = c.createGain();
  lfoG.gain.value = 0.055;
  _windLfo.connect(lfoG);

  _windGain = c.createGain();
  _windGain.gain.value = 0.10 * intensity;
  lfoG.connect(_windGain.gain);

  _windSrc.connect(hp); hp.connect(lp); lp.connect(_windGain);
  _windGain.connect(_out);   // sin reverb — viento es el ambiente mismo

  _windSrc.start();
  _windLfo.start();
}

export function stopWind() {
  if (!_windGain) return;
  const t = _now();
  _windGain.gain.linearRampToValueAtTime(0.0001, t + 1.8);
  setTimeout(() => {
    try { _windSrc?.stop(); _windLfo?.stop(); } catch(e) {}
    _windSrc = null; _windGain = null; _windLfo = null;
  }, 2000);
}

// ── GRILLOS NOCHE (loop) ──────────────────────────────────────────────────────

let _crickets = [];

export function startCrickets() {
  if (_crickets.length) return;
  const c = _ctx_(); if (!c) return;

  [3820, 4080, 3550].forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type  = 'square';
    osc.frequency.value = freq;

    // AM — trino a ~18 Hz (chirp de grillo)
    const am  = c.createOscillator();
    am.type   = 'square';
    am.frequency.value = 18 + i * 2.5;
    const amG = c.createGain();
    amG.gain.value = 0.5;
    am.connect(amG);
    const ampG = c.createGain();
    ampG.gain.value = 0.5;
    amG.connect(ampG.gain);

    const bp = c.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 9;
    const g  = c.createGain();
    g.gain.value = 0.024 + i * 0.006;

    osc.connect(bp); bp.connect(ampG); ampG.connect(g);
    g.connect(_out);
    osc.start(); am.start();
    _crickets.push(osc, am);
  });
}

export function stopCrickets() {
  _crickets.forEach(o => { try { o.stop(); } catch(e) {} });
  _crickets = [];
}

// ── FANFARRIA VICTORIA (33 vacas) ─────────────────────────────────────────────

export function victory() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  // Do Mi Sol Mi Sol Do alta (sabor western)
  const seq = [[261, 0], [329, 0.17], [392, 0.32], [329, 0.46],
               [392, 0.58], [523, 0.74], [523, 0.92]];
  seq.forEach(([freq, delay]) => {
    const o = c.createOscillator();
    o.type  = 'triangle';
    o.frequency.value = freq;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t + delay);
    g.gain.linearRampToValueAtTime(0.20,   t + delay + 0.022);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.32);
    o.connect(g); _toOut(g, 0.28);
    o.start(t + delay); o.stop(t + delay + 0.35);
  });
}

// ── CAMPANA CORRAL (milestone) ────────────────────────────────────────────────

export function corralBell() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const o = c.createOscillator();
  o.type  = 'sine';
  o.frequency.value = 648;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
  o.connect(g); _toOut(g, 0.42);
  o.start(t); o.stop(t + 1.6);
}

// ── COMER ─────────────────────────────────────────────────────────────────────

export function eatSound() {
  const c = _ctx_(); if (!c) return;
  const t = _now();
  const n = _noise(0.14, 1700, 1.8);
  if (!n) return;
  _env(n.gain, 0.006, 0.022, 0.28, 0.09, 0.13);
  _toOut(n.gain, 0.04);
  n.src.start(t);
}

// ── MÚSICA LOBBY (drones de pampa) ────────────────────────────────────────────

let _lobbyNodes = [];

export function startLobbyMusic() {
  if (_lobbyNodes.length) return;
  initAudio();
  const c = _ctx_(); if (!c) return;

  // Tres cuerdas graves ligeramente desafinadas (warmth de guitarra criolla)
  [82.4, 110.0, 146.8].forEach((freq, i) => {
    const osc = c.createOscillator();
    osc.type  = 'triangle';
    osc.frequency.value = freq + (Math.random() - 0.5) * 0.9;

    // Tremolo lento (estilo cuerdas)
    const lfo  = c.createOscillator();
    lfo.type   = 'sine';
    lfo.frequency.value = 0.55 + i * 0.18;
    const lfoG = c.createGain();
    lfoG.gain.value = 0.038;
    lfo.connect(lfoG);

    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 650;
    const g  = c.createGain();
    g.gain.value = 0.058 - i * 0.012;
    lfoG.connect(g.gain);

    osc.connect(lp); lp.connect(g);
    _toOut(g, 0.55);
    osc.start(); lfo.start();
    _lobbyNodes.push({ stop: () => { try { osc.stop(); lfo.stop(); } catch(e) {} } });
  });

  // Melodía esparsa — nota cada 3-6 segundos (charango imaginario)
  const scale = [329, 392, 440, 494, 392, 349, 294];
  let idx = 0;
  const playNote = () => {
    if (!_lobbyNodes.length) return;
    const c2 = _ctx_(); if (!c2) return;
    const tt = _now();
    const o  = c2.createOscillator();
    o.type   = 'triangle';
    o.frequency.value = scale[idx % scale.length] * 0.5;
    idx++;
    const lp2 = c2.createBiquadFilter();
    lp2.type = 'lowpass'; lp2.frequency.value = 1100;
    const g2 = c2.createGain();
    g2.gain.setValueAtTime(0.0001, tt);
    g2.gain.linearRampToValueAtTime(0.075, tt + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.0001, tt + 2.5);
    o.connect(lp2); lp2.connect(g2);
    _toOut(g2, 0.55);
    o.start(tt); o.stop(tt + 2.8);
    const tid = setTimeout(playNote, 2800 + Math.random() * 3200);
    _lobbyNodes.push({ stop: () => clearTimeout(tid) });
  };
  const initTid = setTimeout(playNote, 1200);
  _lobbyNodes.push({ stop: () => clearTimeout(initTid) });
}

export function stopLobbyMusic() {
  _lobbyNodes.forEach(n => n.stop?.());
  _lobbyNodes = [];
}

// ── VOLUMEN MASTER ────────────────────────────────────────────────────────────

export function setMasterVolume(v) {
  if (_out) _out.gain.value = Math.max(0, Math.min(1, v));
}
