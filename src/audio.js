/**
 * src/audio.js  —  GAUCHO Sound Engine v2  (100% Procedural — sin archivos MP3)
 * ═══════════════════════════════════════════════════════════════════════════════
 *  Estética: WESTERN  ·  GAUCHESCO  ·  GEOPOLÍTICO  ·  ESPACIAL
 *
 *  Todo sintetizado vía Web Audio API.
 *  No hay fetch() ni AudioBuffer de archivos.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ── AudioContext + Cadena master ──────────────────────────────────────────────
let _ctx = null;
let _out = null;   // master gain
let _rev = null;   // convolution reverb (pampa abierta)

export function initAudio() {
  if (_ctx) return;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();

    const comp = _ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 14;
    comp.ratio.value = 3.5; comp.attack.value = 0.004; comp.release.value = 0.30;
    comp.connect(_ctx.destination);

    _out = _ctx.createGain();
    _out.gain.value = 0.80;
    _out.connect(comp);

    // Reverb sintético — pampa abierta, cola larga con early reflections
    const sr = _ctx.sampleRate;
    const rLen = Math.floor(sr * 3.8);
    const rBuf = _ctx.createBuffer(2, rLen, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = rBuf.getChannelData(ch);
      // Early reflections (primeros 80ms) + tail difuso
      for (let i = 0; i < rLen; i++) {
        const t = i / sr;
        const env = t < 0.08
          ? Math.pow(t / 0.08, 0.5)
          : Math.pow(1 - (t - 0.08) / (rLen / sr - 0.08), 1.8);
        d[i] = (Math.random() * 2 - 1) * env;
      }
    }
    _rev = _ctx.createConvolver();
    _rev.buffer = rBuf;
    const rg = _ctx.createGain(); rg.gain.value = 0.18;
    _rev.connect(rg); rg.connect(_out);

  } catch (e) { /* sin audio — silencio */ }
}

// ── Internals ─────────────────────────────────────────────────────────────────
function _c() {
  if (!_ctx) initAudio();
  if (_ctx?.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}
function _t() { return _c()?.currentTime ?? 0; }

function _toOut(node, revMix = 0.18) {
  if (!_out) return;
  node.connect(_out);
  if (_rev && revMix > 0) {
    const rg = _c().createGain(); rg.gain.value = revMix;
    node.connect(rg); rg.connect(_rev);
  }
}

function _lp(freq, Q = 0.7) {
  const f = _c().createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = freq; f.Q.value = Q; return f;
}
function _hp(freq, Q = 0.7) {
  const f = _c().createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = freq; f.Q.value = Q; return f;
}
function _bp(freq, Q = 1.0) {
  const f = _c().createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = Q; return f;
}

function _mkNoise(durSec) {
  const c = _c(); if (!c) return null;
  const len = Math.floor(c.sampleRate * durSec);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  return src;
}

function _gain(val = 1) {
  const g = _c().createGain(); g.gain.value = val; return g;
}

function _env(gNode, t0, atk, dec, sus, rel, peak = 1) {
  const g = gNode.gain;
  g.cancelScheduledValues(t0);
  g.setValueAtTime(0.0001, t0);
  g.linearRampToValueAtTime(peak,       t0 + atk);
  g.linearRampToValueAtTime(peak * sus, t0 + atk + dec);
  g.linearRampToValueAtTime(0.0001,     t0 + atk + dec + rel);
}

function _satCurve(k = 120) {
  const n = 512, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    c[i] = (Math.PI + k) * x / (Math.PI + k * Math.abs(x));
  }
  return c;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MOVIMIENTO
// ═══════════════════════════════════════════════════════════════════════════════

// Paso de gaucho en tierra seca de pampa — polvo + gravilla
export function footstep(surface = 'sand', pitchArg = null, volume = 0.06) {
  const c = _c(); if (!c) return;
  const t = _t();
  const p = pitchArg ?? (0.88 + Math.random() * 0.24);

  // Thud grave (suelo)
  const o = c.createOscillator(); o.type = 'sine';
  const f0 = surface === 'grass' ? 52 : 62;
  o.frequency.setValueAtTime(f0 * p, t);
  o.frequency.exponentialRampToValueAtTime(22 * p, t + 0.10);
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(volume * 1.4, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  const lp = _lp(200); o.connect(lp); lp.connect(g); _toOut(g, 0.03);
  o.start(t); o.stop(t + 0.14);

  // Crujido de tierra / pasto
  const ns = _mkNoise(0.10); if (!ns) return;
  const fq = surface === 'grass' ? 800 : 420;
  const bp = _bp(fq, surface === 'grass' ? 1.2 : 0.8);
  const gn = _gain(); gn.gain.setValueAtTime(0.0001, t);
  gn.gain.linearRampToValueAtTime(volume * 0.7, t + 0.006);
  gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.10);
  ns.connect(bp); bp.connect(gn); _toOut(gn, 0.02); ns.start(t);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ARMAS
// ═══════════════════════════════════════════════════════════════════════════════

export function shotgun() {
  const c = _c(); if (!c) return; const t = _t();

  // Sub thump
  const o1 = c.createOscillator(); o1.type = 'sine';
  o1.frequency.setValueAtTime(60, t);
  o1.frequency.exponentialRampToValueAtTime(16, t + 0.24);
  const g1 = _gain(); g1.gain.setValueAtTime(0.0001, t);
  g1.gain.linearRampToValueAtTime(0.90, t + 0.003);
  g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
  const lp1 = _lp(220); o1.connect(lp1); lp1.connect(g1); _toOut(g1, 0.45);
  o1.start(t); o1.stop(t + 0.32);

  // Cuerpo saturado
  const ns2 = _mkNoise(0.52); if (ns2) {
    const lp2 = _lp(2400); const sat = c.createWaveShaper(); sat.curve = _satCurve(160);
    const lp2b = _lp(5200); const g2 = _gain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.linearRampToValueAtTime(0.82, t + 0.005);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
    ns2.connect(lp2); lp2.connect(sat); sat.connect(lp2b); lp2b.connect(g2);
    _toOut(g2, 0.60); ns2.start(t);
  }

  // Crack inicial
  const ns3 = _mkNoise(0.055); if (ns3) {
    const hp3 = _hp(5800); const sat3 = c.createWaveShaper(); sat3.curve = _satCurve(220);
    const g3 = _gain(); g3.gain.setValueAtTime(0.0001, t);
    g3.gain.linearRampToValueAtTime(0.60, t + 0.002);
    g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    ns3.connect(hp3); hp3.connect(sat3); sat3.connect(g3); _toOut(g3, 0.10); ns3.start(t);
  }

  // Resonancia de cañón
  const ns4 = _mkNoise(0.34); if (ns4) {
    const bp4 = _bp(560, 1.8); const g4 = _gain();
    g4.gain.setValueAtTime(0.0001, t);
    g4.gain.linearRampToValueAtTime(0.38, t + 0.008);
    g4.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    ns4.connect(bp4); bp4.connect(g4); _toOut(g4, 0.38); ns4.start(t);
  }

  // Chasquido de espacio abierto (eco espacial único — la pampa responde)
  setTimeout(() => {
    const c2 = _c(); if (!c2) return; const t2 = _t();
    const ns5 = _mkNoise(0.18); if (!ns5) return;
    const lp5 = _lp(900); const g5 = _gain();
    g5.gain.setValueAtTime(0.0001, t2);
    g5.gain.linearRampToValueAtTime(0.12, t2 + 0.01);
    g5.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.22);
    ns5.connect(lp5); lp5.connect(g5); _toOut(g5, 0.85); ns5.start(t2);
  }, 180 + Math.random() * 60);

  // Casquillo
  setTimeout(() => {
    const c2 = _c(); if (!c2) return; const t2 = _t();
    const o = c2.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(2400, t2);
    o.frequency.exponentialRampToValueAtTime(880, t2 + 0.14);
    const g = _gain(); g.gain.setValueAtTime(0.0001, t2);
    g.gain.linearRampToValueAtTime(0.09, t2 + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.20);
    o.connect(g); _toOut(g, 0.04); o.start(t2); o.stop(t2 + 0.22);
  }, 92 + Math.random() * 40);
}

export function bulletWhiz() {
  const c = _c(); if (!c) return; const t = _t();
  // Silbido Doppler de bala rasante sobre pampa
  const f0 = 1800 + Math.random() * 600;
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f0 * 0.22, t + 0.22);
  const ns = _mkNoise(0.22); if (!ns) return;
  const bp = _bp(f0 * 0.6, 3);
  const gnMix = _gain(0.04);
  ns.connect(bp); bp.connect(gnMix);
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.12, t + 0.015);
  g.gain.linearRampToValueAtTime(0.0001, t + 0.23);
  o.connect(g); gnMix.connect(g); _toOut(g, 0.08);
  o.start(t); ns.start(t); o.stop(t + 0.24);
}

export function bulletImpactDirt() {
  const c = _c(); if (!c) return; const t = _t();
  // Polvo de pampa: thud sordo + nube de tierra
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(85, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.12);
  const g1 = _gain(); g1.gain.setValueAtTime(0.0001, t);
  g1.gain.linearRampToValueAtTime(0.30, t + 0.004);
  g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  const lp1 = _lp(160); o.connect(lp1); lp1.connect(g1); _toOut(g1, 0.08); o.start(t); o.stop(t + 0.16);

  const ns = _mkNoise(0.15); if (ns) {
    const bp = _bp(520 + Math.random() * 200, 0.9);
    const g2 = _gain(); g2.gain.setValueAtTime(0.0001, t);
    g2.gain.linearRampToValueAtTime(0.18, t + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    ns.connect(bp); bp.connect(g2); _toOut(g2, 0.06); ns.start(t);
  }
}

export function bulletImpactFlesh() {
  const c = _c(); if (!c) return; const t = _t();
  [[3500,3.0,0.04,1.00],[1800,2.0,0.06,0.80],[350,1.2,0.04,0.38],[5500,4.5,0.04,0.70],[800,5.0,0.05,0.40]]
    .forEach(([freq, Q, rev, pk], i) => {
      const ns = _mkNoise(0.10); if (!ns) return;
      const bp = _bp(freq, Q); const g = _gain();
      const d = [0.001,0.003+i*0.002,0,0.04+i*0.01][0];
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(pk * 0.5, t + 0.002 + i*0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06 + i * 0.015);
      ns.connect(bp); bp.connect(g); _toOut(g, rev); ns.start(t);
    });
}

export function bulletImpactWood() {
  const c = _c(); if (!c) return; const t = _t();
  // Impacto en madera de rancho gaucho — resonancia de placa
  const o = c.createOscillator(); o.type = 'sawtooth';
  const f0 = 180 + Math.random() * 80;
  o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 0.55, t + 0.22);
  const lp = _lp(1200, 2.5); const g = _gain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.28, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  o.connect(lp); lp.connect(g); _toOut(g, 0.14); o.start(t); o.stop(t + 0.30);
  const ns = _mkNoise(0.08); if (ns) {
    const bp = _bp(1600, 2); const gn = _gain();
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(0.20, t + 0.002);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    ns.connect(bp); bp.connect(gn); _toOut(gn, 0.10); ns.start(t);
  }
}

export function hitMarker() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 1760;
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.18, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  o.connect(g); _toOut(g, 0.03); o.start(t); o.stop(t + 0.10);
}

export function shellLoad() {
  const c = _c(); if (!c) return; const t = _t();
  // Insertar cartucho — cerrojo metálico con alma de gaucho
  const ns1 = _mkNoise(0.025); if (ns1) {
    const bp = _bp(4200, 3.5); const g = _gain();
    _env(g, t, 0.001, 0.004, 0, 0.018, 0.38); ns1.connect(bp); bp.connect(g); _toOut(g, 0.12); ns1.start(t);
  }
  // Thud de la vaina
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(240, t + 0.06); o.frequency.exponentialRampToValueAtTime(72, t + 0.13);
  const g2 = _gain(); _env(g2, t + 0.06, 0.004, 0.04, 0, 0.06, 0.30);
  o.connect(g2); _toOut(g2, 0.05); o.start(t + 0.06); o.stop(t + 0.20);
  // Cierre del cerrojo
  const ns3 = _mkNoise(0.018); if (ns3) {
    const bp = _bp(3800, 3); const g = _gain();
    _env(g, t + 0.13, 0.001, 0.003, 0, 0.014, 0.32); ns3.connect(bp); bp.connect(g); _toOut(g, 0.09); ns3.start(t + 0.13);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  JUGADOR
// ═══════════════════════════════════════════════════════════════════════════════

export function playerHurt() {
  const c = _c(); if (!c) return; const t = _t();
  // Grito gaucho — vocal FM con quiebre
  const car = c.createOscillator(); car.type = 'sawtooth';
  car.frequency.setValueAtTime(170 + Math.random() * 30, t);
  car.frequency.exponentialRampToValueAtTime(75, t + 0.28);
  const mod = c.createOscillator(); mod.type = 'sine'; mod.frequency.value = 6.5;
  const modG = _gain(22); mod.connect(modG); modG.connect(car.frequency);
  const lp = _lp(1100, 1.2); const g = _gain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.55, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.16);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
  car.connect(lp); lp.connect(g); _toOut(g, 0.10);
  car.start(t); mod.start(t); car.stop(t + 0.36); mod.stop(t + 0.36);
  const ns = _mkNoise(0.12); if (ns) {
    const bp = _bp(340, 0.5); const gn = _gain();
    _env(gn, t, 0.003, 0.018, 0, 0.09, 0.26); ns.connect(bp); bp.connect(gn); _toOut(gn, 0.04); ns.start(t);
  }
}

export function playerDeath() {
  const c = _c(); if (!c) return; const t = _t();
  // Último aliento del gaucho + drone de pampa que llora
  const o = c.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(195, t); o.frequency.exponentialRampToValueAtTime(42, t + 2.6);
  const mod = c.createOscillator(); mod.type = 'sine'; mod.frequency.value = 4.2;
  const modG = _gain(14); mod.connect(modG); modG.connect(o.frequency);
  const lp = _lp(800); const g = _gain();
  g.gain.setValueAtTime(0.28, t); g.gain.linearRampToValueAtTime(0.0001, t + 2.8);
  o.connect(lp); lp.connect(g); _toOut(g, 0.40);
  o.start(t); mod.start(t); o.stop(t + 2.9); mod.stop(t + 2.9);
  // Drone espacial de fondo (alma partiendo)
  setTimeout(() => {
    const c2 = _c(); if (!c2) return; const t2 = _t();
    [36.7, 55.0, 73.4].forEach((f, i) => {
      const oo = c2.createOscillator(); oo.type = 'sine'; oo.frequency.value = f;
      const gg = _gain(); gg.gain.setValueAtTime(0.0001, t2);
      gg.gain.linearRampToValueAtTime(0.06 - i * 0.015, t2 + 0.8);
      gg.gain.linearRampToValueAtTime(0.0001, t2 + 2.5);
      oo.connect(gg); _toOut(gg, 0.55); oo.start(t2); oo.stop(t2 + 2.7);
    });
  }, 400);
}

export function bodyFall() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(62, t); o.frequency.exponentialRampToValueAtTime(20, t + 0.24);
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.42, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
  const lp = _lp(185); o.connect(lp); lp.connect(g); _toOut(g, 0.16); o.start(t); o.stop(t + 0.32);
  const ns = _mkNoise(0.28); if (ns) {
    const bp = _bp(600, 0.7); const gn = _gain();
    gn.gain.setValueAtTime(0.0001, t + 0.02); gn.gain.linearRampToValueAtTime(0.22, t + 0.03);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    ns.connect(bp); bp.connect(gn); _toOut(gn, 0.07); ns.start(t + 0.02);
  }
}

export function jumpLand() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(26, t + 0.16);
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.30, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  o.connect(g); _toOut(g, 0.09); o.start(t); o.stop(t + 0.20);
  const ns = _mkNoise(0.10); if (ns) {
    const bp = _bp(480, 0.8); const gn = _gain();
    _env(gn, t, 0.002, 0.012, 0, 0.08, 0.18); ns.connect(bp); bp.connect(gn); _toOut(gn, 0.04); ns.start(t);
  }
}

// Sonido de mate siendo servido — pequeño ritual gaucho
export function eatSound() {
  const c = _c(); if (!c) return; const t = _t();
  // Líquido caliente vertido + sorbida de caña (mate)
  const ns = _mkNoise(0.20); if (ns) {
    const lp = _lp(3200); const g = _gain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.02);
    g.gain.linearRampToValueAtTime(0.06, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    ns.connect(lp); lp.connect(g); _toOut(g, 0.04); ns.start(t);
  }
  // Tono suave de recipiente (jarrita metálica del mate)
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 820 + Math.random() * 80;
  const gm = _gain(); gm.gain.setValueAtTime(0.0001, t + 0.08);
  gm.gain.linearRampToValueAtTime(0.04, t + 0.10);
  gm.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  o.connect(gm); _toOut(gm, 0.06); o.start(t + 0.08); o.stop(t + 0.30);
}

export function sprintExhale() {
  const c = _c(); if (!c) return; const t = _t();
  const ns = _mkNoise(0.26); if (!ns) return;
  const bp = _bp(950, 0.55); const g = _gain();
  _env(g, t, 0.025, 0.08, 0.28, 0.12, 0.09); ns.connect(bp); bp.connect(g); _toOut(g, 0.02); ns.start(t);
}

export function mountSound() {
  const c = _c(); if (!c) return; const t = _t();
  // Cuero del recado chirriando al montar
  const ns = _mkNoise(0.22); if (ns) {
    const bp = _bp(580, 1.1); const g = _gain();
    _env(g, t, 0.012, 0.05, 0.28, 0.14, 0.22); ns.connect(bp); bp.connect(g); _toOut(g, 0.06); ns.start(t);
  }
  // Thud del cuerpo asentándose
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(68, t + 0.06); o.frequency.exponentialRampToValueAtTime(28, t + 0.20);
  const g2 = _gain(); _env(g2, t + 0.06, 0.004, 0.05, 0, 0.14, 0.22);
  o.connect(g2); _toOut(g2, 0.08); o.start(t + 0.06); o.stop(t + 0.26);
  // Tilín de espuela
  setTimeout(() => spurJingle(), 180);
}

export function knifeButcher() {
  const c = _c(); if (!c) return; const t = _t();
  // Silbido de facón al cortar
  const ns = _mkNoise(0.20); if (!ns) return;
  const hp = c.createBiquadFilter(); hp.type = 'highpass';
  hp.frequency.setValueAtTime(4200, t); hp.frequency.linearRampToValueAtTime(800, t + 0.18);
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.20, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.20);
  ns.connect(hp); hp.connect(g); _toOut(g, 0.02); ns.start(t);
  // Golpe húmedo
  const t2 = t + 0.14;
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(95, t2); o.frequency.exponentialRampToValueAtTime(34, t2 + 0.14);
  const g2 = _gain(); _env(g2, t2, 0.006, 0.04, 0, 0.14, 0.24);
  o.connect(g2); _toOut(g2, 0.05); o.start(t2); o.stop(t2 + 0.18);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CORAZÓN
// ═══════════════════════════════════════════════════════════════════════════════

let _hbInterval = null;
export function startHeartbeat() {
  if (_hbInterval) return;
  const beat = () => {
    const c = _c(); if (!c) return; const t = _t();
    [[0, 55, 0.26], [0.20, 44, 0.16]].forEach(([off, f, amp]) => {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f, t + off);
      o.frequency.exponentialRampToValueAtTime(f * 0.38, t + off + 0.14);
      const g = _gain(); g.gain.setValueAtTime(0.0001, t + off);
      g.gain.linearRampToValueAtTime(amp, t + off + 0.010);
      g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.16);
      o.connect(g); _toOut(g, 0.04); o.start(t + off); o.stop(t + off + 0.18);
    });
  };
  beat(); _hbInterval = setInterval(beat, 860);
}
export function stopHeartbeat() { clearInterval(_hbInterval); _hbInterval = null; }

// ═══════════════════════════════════════════════════════════════════════════════
//  ANIMALES
// ═══════════════════════════════════════════════════════════════════════════════

export function cowMoo(panicked = false) {
  const c = _c(); if (!c) return; const t = _t();
  // Mugido FM con formantes — vaca de pampa
  const f = panicked ? 280 + Math.random() * 40 : 148 + Math.random() * 28;
  const dur = panicked ? 0.42 : 1.2 + Math.random() * 0.4;

  const mod = c.createOscillator(); mod.type = 'sine'; mod.frequency.value = f * 0.5;
  const modG = _gain(panicked ? 60 : 28); mod.connect(modG);

  const car = c.createOscillator(); car.type = 'sawtooth'; car.frequency.value = f;
  if (!panicked) {
    car.frequency.setValueAtTime(f * 0.86, t);
    car.frequency.linearRampToValueAtTime(f * 1.08, t + dur * 0.40);
    car.frequency.linearRampToValueAtTime(f * 0.88, t + dur);
  } else {
    car.frequency.setValueAtTime(f, t);
    car.frequency.linearRampToValueAtTime(f * 1.18, t + 0.05);
    car.frequency.linearRampToValueAtTime(f * 0.82, t + dur);
  }
  modG.connect(car.frequency);

  // Formante nasal
  const f1 = c.createBiquadFilter(); f1.type = 'peaking'; f1.frequency.value = 520; f1.Q.value = 2; f1.gain.value = 8;
  const lp = _lp(panicked ? 1100 : 750, 1.2);
  const g = _gain();
  _env(g, t, 0.06, 0.12, 0.70, panicked ? 0.20 : 0.60, panicked ? 0.38 : 0.28);
  car.connect(f1); f1.connect(lp); lp.connect(g); _toOut(g, 0.32);
  mod.start(t); car.start(t); mod.stop(t + dur + 0.7); car.stop(t + dur + 0.7);
}

export function painCow() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(128, t); o.frequency.linearRampToValueAtTime(240, t + 0.16);
  o.frequency.linearRampToValueAtTime(88, t + 0.55);
  const lp = _lp(680, 1.2); const g = _gain();
  _env(g, t, 0.02, 0.10, 0.65, 0.50, 0.42); o.connect(lp); lp.connect(g); _toOut(g, 0.14); o.start(t); o.stop(t + 0.70);
}

export function horseNeigh() {
  const c = _c(); if (!c) return; const t = _t();
  // Relincho — pitch-sweep orgánico con vibrato
  const o = c.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(295, t);
  o.frequency.linearRampToValueAtTime(560, t + 0.20);
  o.frequency.linearRampToValueAtTime(490, t + 0.45);
  o.frequency.exponentialRampToValueAtTime(180, t + 0.92);
  const vib = c.createOscillator(); vib.type = 'sine'; vib.frequency.value = 7.2;
  const vibG = _gain(18); vib.connect(vibG); vibG.connect(o.frequency);
  const lp = _lp(1400, 1.0); const g = _gain();
  _env(g, t, 0.022, 0.08, 0.60, 0.40, 0.32);
  o.connect(lp); lp.connect(g); _toOut(g, 0.30);
  vib.start(t + 0.18); vib.stop(t + 1.05); o.start(t); o.stop(t + 1.05);
  // Respiración equina final
  const ns = _mkNoise(0.35); if (ns) {
    const bp = _bp(320, 1.1); const gn = _gain();
    gn.gain.setValueAtTime(0.0001, t + 0.70); gn.gain.linearRampToValueAtTime(0.14, t + 0.80);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + 1.08);
    ns.connect(bp); bp.connect(gn); _toOut(gn, 0.15); ns.start(t + 0.70);
  }
}

export function horseSnort() {
  const c = _c(); if (!c) return; const t = _t();
  const ns = _mkNoise(0.32); if (!ns) return;
  const bp = _bp(340, 1.2); const g = _gain();
  _env(g, t, 0.008, 0.06, 0.38, 0.22, 0.24); ns.connect(bp); bp.connect(g); _toOut(g, 0.14); ns.start(t);
}

export function painOstrich() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'square';
  o.frequency.setValueAtTime(820, t); o.frequency.linearRampToValueAtTime(1240, t + 0.06);
  o.frequency.linearRampToValueAtTime(580, t + 0.22);
  const lp = _lp(2200); const g = _gain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.30, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28); o.connect(lp); lp.connect(g); _toOut(g, 0.08); o.start(t); o.stop(t + 0.30);
}

export function painChicken() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'square';
  o.frequency.setValueAtTime(1450, t); o.frequency.linearRampToValueAtTime(1850, t + 0.022);
  o.frequency.linearRampToValueAtTime(900, t + 0.14);
  const lp = _lp(3200); const g = _gain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.26, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.17); o.connect(lp); lp.connect(g); _toOut(g, 0.06); o.start(t); o.stop(t + 0.19);
}

export function painBird() {
  const c = _c(); if (!c) return; const t = _t();
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(2250, t); o.frequency.linearRampToValueAtTime(1580, t + 0.09);
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.20, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12); o.connect(g); _toOut(g, 0.05); o.start(t); o.stop(t + 0.14);
}

export function ostrichCall() {
  const c = _c(); if (!c) return; const t = _t();
  // Boom grave de ñandú
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(46, t); o.frequency.linearRampToValueAtTime(60, t + 0.20);
  o.frequency.exponentialRampToValueAtTime(32, t + 0.70);
  const lp = _lp(220); const g = _gain();
  _env(g, t, 0.018, 0.09, 0.52, 0.58, 0.32); o.connect(lp); lp.connect(g); _toOut(g, 0.22); o.start(t); o.stop(t + 0.88);
}

export function coyoteHowl() {
  const c = _c(); if (!c) return; const t = _t();
  // Aullido del zorro pampeano en la noche
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(268, t); o.frequency.linearRampToValueAtTime(540, t + 0.52);
  o.frequency.linearRampToValueAtTime(518, t + 0.90); o.frequency.linearRampToValueAtTime(360, t + 2.0);
  const vib = c.createOscillator(); vib.type = 'sine'; vib.frequency.value = 5.8;
  const vibG = _gain(12); vib.connect(vibG); vibG.connect(o.frequency);
  const lp = _lp(1900); const g = _gain();
  _env(g, t, 0.10, 0.06, 0.80, 0.78, 0.20);
  o.connect(lp); lp.connect(g); _toOut(g, 0.60);
  vib.start(t + 0.48); vib.stop(t + 2.8); o.start(t); o.stop(t + 2.8);
}

export function chickenCluck() {
  const c = _c(); if (!c) return; const t = _t();
  [[0, 680, 0.13], [0.12, 830, 0.09]].forEach(([delay, freq, dur]) => {
    const o = c.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(freq, t + delay);
    o.frequency.exponentialRampToValueAtTime(freq * 0.62, t + delay + dur);
    const lp = _lp(1500); const g = _gain();
    g.gain.setValueAtTime(0.0001, t + delay); g.gain.linearRampToValueAtTime(0.09, t + delay + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur + 0.04);
    o.connect(lp); lp.connect(g); _toOut(g, 0.09); o.start(t + delay); o.stop(t + delay + dur + 0.06);
  });
}

export function chickenPanic() {
  const c = _c(); if (!c) return; const t = _t();
  for (let i = 0; i < 5; i++) {
    const d = i * 0.09, f = 720 + Math.random() * 420;
    const o = c.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(f, t + d);
    o.frequency.exponentialRampToValueAtTime(f * 0.48, t + d + 0.09);
    const lp = _lp(1700); const g = _gain();
    g.gain.setValueAtTime(0.0001, t + d); g.gain.linearRampToValueAtTime(0.12, t + d + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.11);
    o.connect(lp); lp.connect(g); _toOut(g, 0.06); o.start(t + d); o.stop(t + d + 0.13);
  }
  const ns = _mkNoise(0.45); if (ns) {
    const hp = _hp(3600, 0.6); const g = _gain();
    _env(g, t, 0.012, 0.06, 0.20, 0.30, 0.12); ns.connect(hp); hp.connect(g); _toOut(g, 0.04); ns.start(t + 0.05);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CABALLO — CASCOS
// ═══════════════════════════════════════════════════════════════════════════════

let _hoofTimer = null, _hoofSpeed = 0, _hoofBeat = 0;

function _playHoof(vol, hard) {
  const c = _c(); if (!c) return; const t = _t();
  const base = hard ? 82 + Math.random() * 22 : 56 + Math.random() * 16;
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(base, t);
  o.frequency.exponentialRampToValueAtTime(20, t + (hard ? 0.075 : 0.12));
  const g = _gain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + (hard ? 0.090 : 0.14));
  o.connect(g); _toOut(g, hard ? 0.09 : 0.06); o.start(t); o.stop(t + (hard ? 0.11 : 0.16));
  const ns = _mkNoise(0.06); if (ns) {
    const bp = _bp(hard ? 920 : 660, 0.4); const gn = _gain();
    _env(gn, t, 0.001, 0.009, 0.02, 0.035, hard ? 0.19 : 0.13); ns.connect(bp); bp.connect(gn); _toOut(gn, 0.04); ns.start(t);
  }
}

function _scheduleHoof() {
  const speed = _hoofSpeed;
  if (speed < 0.8) { _hoofTimer = null; _hoofBeat = 0; return; }
  const galloping = speed > 16, trotting = speed > 7;
  const beatMs = galloping ? 205 : (trotting ? 365 : 605);
  const vol = galloping ? 0.30 : (trotting ? 0.22 : 0.14);
  const jitter = (Math.random() - 0.5) * beatMs * 0.06;
  _hoofBeat = (_hoofBeat + 1) % 4;
  _hoofTimer = setTimeout(() => { _playHoof(vol, galloping); _scheduleHoof(); }, beatMs + jitter);
}

export function updateHoofbeats(speed) {
  _hoofSpeed = speed;
  if (speed < 0.8) { if (_hoofTimer) { clearTimeout(_hoofTimer); _hoofTimer = null; _hoofBeat = 0; } return; }
  if (!_hoofTimer) _scheduleHoof();
}
export function playHoofTouch(speed, sprint) {
  _playHoof(speed > 16 ? 0.30 : (speed > 7 ? 0.22 : 0.14), speed > 16 || sprint);
}
export function startGallop() {}
export function stopGallop()  {}

// ═══════════════════════════════════════════════════════════════════════════════
//  LAZO
// ═══════════════════════════════════════════════════════════════════════════════

export function lassoThrow() {
  const c = _c(); if (!c) return; const t = _t();
  const ns = _mkNoise(0.32); if (!ns) return;
  const bp = _bp(1750, 2.2); const g = _gain();
  _env(g, t, 0.01, 0.04, 0.22, 0.22, 0.16); ns.connect(bp); bp.connect(g); _toOut(g, 0.09); ns.start(t);
}
export function lassoSnap() {
  const c = _c(); if (!c) return; const t = _t();
  const ns = _mkNoise(0.08); if (!ns) return;
  const bp = _bp(3500, 2.8); const g = _gain();
  _env(g, t, 0.001, 0.006, 0, 0.055, 0.28); ns.connect(bp); bp.connect(g); _toOut(g, 0.07); ns.start(t);
}
let _lassoSpinTimer = null;
export function startLassoSpin() {
  if (_lassoSpinTimer) return;
  const spin = () => {
    const c = _c(); if (!c) return; const t = _t();
    const ns = _mkNoise(0.26); if (!ns) return;
    const bp = _bp(830, 1.4); const g = _gain();
    _env(g, t, 0.02, 0.08, 0.38, 0.10, 0.09); ns.connect(bp); bp.connect(g); _toOut(g, 0.05); ns.start(t);
    _lassoSpinTimer = setTimeout(spin, 265);
  }; spin();
}
export function stopLassoSpin() { clearTimeout(_lassoSpinTimer); _lassoSpinTimer = null; }

// ═══════════════════════════════════════════════════════════════════════════════
//  AMBIENTE — LOOPS PROCEDURALES
// ═══════════════════════════════════════════════════════════════════════════════

// ── VIENTO — pampa árida ──────────────────────────────────────────────────────
function _makeWindSystem() {
  let _nodes = null;
  return {
    start() {
      if (_nodes) return;
      const c = _c(); if (!c) return; const t = c.currentTime;
      _nodes = []; const master = _gain(0.0001);
      master.gain.linearRampToValueAtTime(0.22, t + 3.5);
      master.connect(_out);

      [{ fc: 175, bw: 1.2, vol: 0.44, lf: 0.038, ld: 28 },
       { fc: 410, bw: 1.6, vol: 0.26, lf: 0.068, ld: 52 },
       { fc: 880, bw: 2.0, vol: 0.12, lf: 0.11,  ld: 72 }].forEach(l => {
        const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const ns = c.createBufferSource(); ns.buffer = buf; ns.loop = true;
        const bpf = _bp(l.fc, l.bw);
        const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = l.lf;
        const lfoG = _gain(l.vol * 0.45);
        const base = _gain(l.vol * 0.55);
        const lfof = c.createOscillator(); lfof.type = 'sine'; lfof.frequency.value = l.lf * 0.58;
        const lfofG = _gain(l.ld); lfof.connect(lfofG); lfofG.connect(bpf.frequency);
        lfo.connect(lfoG); lfoG.connect(base.gain);
        ns.connect(bpf); bpf.connect(base); base.connect(master);
        ns.start(); lfo.start(); lfof.start();
        _nodes.push({ ns, lfo, lfof });
      });

      const _gust = () => {
        if (!_nodes) return;
        const gc = _c(); if (!gc) return; const gt = gc.currentTime;
        const nb = gc.createBuffer(1, gc.sampleRate, gc.sampleRate);
        const nd = nb.getChannelData(0);
        for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
        const ns2 = gc.createBufferSource(); ns2.buffer = nb;
        const lp = _lp(185); const gg = _gain(0.0001);
        gg.gain.linearRampToValueAtTime(0.16, gt + 1.3);
        gg.gain.linearRampToValueAtTime(0.0001, gt + 4.2);
        ns2.connect(lp); lp.connect(gg); gg.connect(master);
        ns2.start(gt); ns2.stop(gt + 3.0);
        _nodes._gustTimer = setTimeout(_gust, 6000 + Math.random() * 9000);
      };
      _nodes._gustTimer = setTimeout(_gust, 3000 + Math.random() * 5000);
    },
    stop() {
      if (!_nodes) return;
      clearTimeout(_nodes._gustTimer);
      const t2 = _c()?.currentTime ?? 0;
      for (const n of _nodes) {
        try { n.lfo.stop(t2 + 1.5); n.lfof.stop(t2 + 1.5); n.ns.stop(t2 + 1.5); } catch (e) {}
      }
      _nodes = null;
    },
    get active() { return !!_nodes; }
  };
}

// ── GRILLOS — modulación de pulso, múltiples insectos a la noche pampeana ────
function _makeCricketsSystem() {
  let _timer = null, _master = null;
  return {
    start() {
      if (_timer) return;
      const c = _c(); if (!c) return;
      _master = c.createGain(); _master.gain.setValueAtTime(0.0001, c.currentTime);
      _master.gain.linearRampToValueAtTime(0.30, c.currentTime + 4);
      _toOut(_master, 0.0);

      // Cada "grillo" = oscilador con AM rápida (chirp)
      const insects = [4420, 4580, 4350, 4650, 4480].map((f, idx) => {
        const osc = c.createOscillator(); osc.type = 'sine'; osc.frequency.value = f;
        const lfo = c.createOscillator(); lfo.type = 'square';
        lfo.frequency.value = 22 + idx * 1.8 + Math.random() * 3;
        const lfoG = c.createGain(); lfoG.gain.value = 0.5;
        const baseG = c.createGain(); baseG.gain.value = 0.5;
        lfo.connect(lfoG); lfoG.connect(baseG.gain);
        const g = c.createGain(); g.gain.value = 0.015 - idx * 0.002;
        osc.connect(baseG); baseG.connect(g); g.connect(_master);
        osc.start(); lfo.start();
        return { osc, lfo };
      });
      _timer = { insects };
    },
    stop() {
      if (!_timer) return;
      const t2 = _c()?.currentTime ?? 0;
      if (_master) { _master.gain.linearRampToValueAtTime(0.0001, t2 + 2.5); }
      setTimeout(() => {
        _timer?.insects?.forEach(({ osc, lfo }) => { try { osc.stop(); lfo.stop(); } catch (e) {} });
        _timer = null; _master = null;
      }, 2700);
    },
    get active() { return !!_timer; }
  };
}

// ── PÁJAROS — trinos del chimango y perdiz pampeana ──────────────────────────
function _makeBirdsSystem() {
  let _running = false, _timeout = null;
  const _calls = [
    // Chimango: dos notas agudas ascendentes
    (t, c) => {
      [0, 0.18].forEach((d, i) => {
        const o = c.createOscillator(); o.type = 'sine';
        const f = 2200 + i * 380; o.frequency.setValueAtTime(f, t + d);
        o.frequency.linearRampToValueAtTime(f * 1.18, t + d + 0.14);
        const g = _gain(); g.gain.setValueAtTime(0.0001, t + d);
        g.gain.linearRampToValueAtTime(0.06, t + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.18);
        o.connect(g); _toOut(g, 0.20); o.start(t + d); o.stop(t + d + 0.20);
      });
    },
    // Perdiz: trill rápido sobre nota fija
    (t, c) => {
      const f = 1600 + Math.random() * 300;
      for (let i = 0; i < 6; i++) {
        const d = i * 0.055;
        const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f + i * 40;
        const g = _gain(); g.gain.setValueAtTime(0.0001, t + d);
        g.gain.linearRampToValueAtTime(0.07 - i * 0.005, t + d + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.05);
        o.connect(g); _toOut(g, 0.18); o.start(t + d); o.stop(t + d + 0.06);
      }
    },
    // Jilguero: melodía pentatónica corta
    (t, c) => {
      const notes = [880, 1046, 1175, 1046, 880, 784];
      notes.forEach((f, i) => {
        const d = i * 0.10;
        const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        const g = _gain(); g.gain.setValueAtTime(0.0001, t + d);
        g.gain.linearRampToValueAtTime(0.05, t + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.10);
        o.connect(g); _toOut(g, 0.22); o.start(t + d); o.stop(t + d + 0.12);
      });
    }
  ];
  const _play = () => {
    if (!_running) return;
    const c = _c(); if (!c) return;
    const call = _calls[Math.floor(Math.random() * _calls.length)];
    call(_t(), c);
    _timeout = setTimeout(_play, 1800 + Math.random() * 4200);
  };
  return {
    start() { if (_running) return; _running = true; _timeout = setTimeout(_play, 800 + Math.random() * 1200); },
    stop()  { _running = false; clearTimeout(_timeout); },
    get active() { return _running; }
  };
}

// ── LLUVIA — múltiples capas de ruido, convección gauchesca ──────────────────
function _makeRainSystem() {
  let _nodes = null;
  return {
    start() {
      if (_nodes) return;
      const c = _c(); if (!c) return; const t = c.currentTime;
      _nodes = []; const master = _gain(0.0001);
      master.gain.linearRampToValueAtTime(0.62, t + 3.0);
      master.connect(_out);

      // Base: ruido blanco amplio
      const b1 = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d1 = b1.getChannelData(0); for (let i = 0; i < d1.length; i++) d1[i] = Math.random() * 2 - 1;
      const ns1 = c.createBufferSource(); ns1.buffer = b1; ns1.loop = true;
      const lp1 = _lp(6000); ns1.connect(lp1); lp1.connect(master); ns1.start();
      _nodes.push({ stop: () => { try { ns1.stop(); } catch(e) {} } });

      // Pops de gotas (buffer de ruido corto en loop con ganancia aleatoria)
      [2800, 4200, 6500].forEach(fc => {
        const nb = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
        const nd = nb.getChannelData(0);
        for (let i = 0; i < nd.length; i++) {
          nd[i] = (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.2);
        }
        const ns = c.createBufferSource(); ns.buffer = nb; ns.loop = true;
        const bp = _bp(fc, 0.6); const g = _gain(0.06);
        ns.connect(bp); bp.connect(g); g.connect(master); ns.start();
        _nodes.push({ stop: () => { try { ns.stop(); } catch(e) {} } });
      });

      // LFO de intensidad (lluvia variable)
      const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.025;
      const lfoG = _gain(0.12); lfo.connect(lfoG); lfoG.connect(master.gain);
      lfo.start(); _nodes.push({ stop: () => { try { lfo.stop(); } catch(e) {} } });
    },
    stop() {
      if (!_nodes) return;
      const t2 = _c()?.currentTime ?? 0;
      // No hay master ref guardada — simplemente matar nodos
      _nodes.forEach(n => { try { n.stop(); } catch(e) {} });
      _nodes = null;
    },
    get active() { return !!_nodes; }
  };
}

// ── FUEGO — crepitar de fogón pampeano ───────────────────────────────────────
function _makeFireSystem() {
  let _nodes = null;
  return {
    start() {
      if (_nodes) return;
      const c = _c(); if (!c) return; const t = c.currentTime;
      _nodes = []; const master = _gain(0.0001);
      master.gain.linearRampToValueAtTime(0.38, t + 2.0);
      master.connect(_out);
      if (_rev) { const rg = _gain(0.09); master.connect(rg); rg.connect(_rev); }

      // Base crepitante (ruido de baja frecuencia con modulación)
      const b = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        const env = 0.5 + 0.5 * Math.sin(i / c.sampleRate * 0.7);
        d[i] = (Math.random() * 2 - 1) * env;
      }
      const nsF = c.createBufferSource(); nsF.buffer = b; nsF.loop = true;
      const lp2 = _lp(1800); nsF.connect(lp2); lp2.connect(master); nsF.start();
      _nodes.push({ stop: () => { try { nsF.stop(); } catch(e) {} } });

      // Crackles agudos aleatorios
      const crackle = () => {
        if (!_nodes) return;
        const gc = _c(); if (!gc) return; const gt = gc.currentTime;
        const nb = gc.createBuffer(1, Math.floor(gc.sampleRate * 0.04), gc.sampleRate);
        const nd = nb.getChannelData(0);
        for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * (1 - i / nd.length);
        const ns = gc.createBufferSource(); ns.buffer = nb;
        const bp = _bp(4500 + Math.random() * 2000, 0.8); const g = _gain(0.10 + Math.random() * 0.15);
        ns.connect(bp); bp.connect(g); g.connect(master); ns.start(gt);
        const delayMs = 60 + Math.random() * 220;
        _nodes._crackTimer = setTimeout(crackle, delayMs);
      };
      _nodes._crackTimer = setTimeout(crackle, 200);
    },
    stop() {
      if (!_nodes) return;
      clearTimeout(_nodes._crackTimer);
      _nodes.forEach(n => { try { n.stop?.(); } catch(e) {} });
      _nodes = null;
    },
    get active() { return !!_nodes; }
  };
}

const _wind     = _makeWindSystem();
const _crickets = _makeCricketsSystem();
const _birds    = _makeBirdsSystem();
const _rain     = _makeRainSystem();
const _fire     = _makeFireSystem();

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

// ═══════════════════════════════════════════════════════════════════════════════
//  DRONE PAMPA ESPACIAL
// ═══════════════════════════════════════════════════════════════════════════════

let _droneNodes = [];
export function startAmbientDrone() {
  if (_droneNodes.length) return;
  const c = _c(); if (!c) return;
  // Sub-graves del cosmos gaucho — como si el horizonte de la pampa vibrara
  [[36.7, 0.050], [37.4, 0.040], [55.0, 0.030], [73.4, 0.018]].forEach(([freq, vol], i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
    const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.035 + i * 0.018;
    const lfoG = _gain(0.020); lfo.connect(lfoG); lfoG.connect(o.frequency);
    const lp = _lp(130); const g = _gain(vol);
    o.connect(lp); lp.connect(g); g.connect(_out);
    o.start(); lfo.start();
    _droneNodes.push({ stop: () => { try { o.stop(); lfo.stop(); } catch(e){} } });
  });
}
export function stopAmbientDrone() { _droneNodes.forEach(n => n.stop?.()); _droneNodes = []; }

// ═══════════════════════════════════════════════════════════════════════════════
//  TRUENO + ESTAMPIDA + MADERA
// ═══════════════════════════════════════════════════════════════════════════════

export function distantThunder() {
  const c = _c(); if (!c) return; const t = _t();
  const dur = 3.0 + Math.random() * 1.8;
  // Capa de sub-graves (impacto inicial)
  const ns1 = _mkNoise(0.5); if (ns1) {
    const lp = _lp(80); const g = _gain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.32, t + 0.12);
    g.gain.linearRampToValueAtTime(0.0001, t + 0.55);
    ns1.connect(lp); lp.connect(g); _toOut(g, 0.50); ns1.start(t);
  }
  // Cola larga (rumble de pampa)
  const ns2 = _mkNoise(dur); if (ns2) {
    const lp = _lp(120); const g = _gain();
    g.gain.setValueAtTime(0.0001, t + 0.08); g.gain.linearRampToValueAtTime(0.24, t + 0.30);
    g.gain.linearRampToValueAtTime(0.16, t + 1.0); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    ns2.connect(lp); lp.connect(g); _toOut(g, 0.60); ns2.start(t + 0.05);
  }
  // Crack eléctrico inicial
  const ns3 = _mkNoise(0.08); if (ns3) {
    const hp = _hp(8000); const g = _gain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.25, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    ns3.connect(hp); hp.connect(g); _toOut(g, 0.20); ns3.start(t);
  }
}

export function stampedeRumble() {
  const c = _c(); if (!c) return; const t = _t(); const dur = 4.8;
  [58, 88, 128, 195].forEach((freq, i) => {
    const ns = _mkNoise(0.9); if (!ns) return;
    ns.loop = true; ns.loopEnd = 0.9;
    const bp = _bp(freq, 0.5 + i * 0.1); const g = _gain();
    g.gain.setValueAtTime(0.0001, t + i * 0.055);
    g.gain.linearRampToValueAtTime(0.24 - i * 0.04, t + i * 0.055 + 0.65);
    g.gain.linearRampToValueAtTime(0.0001, t + i * 0.055 + dur - i * 0.3);
    ns.connect(bp); bp.connect(g); _toOut(g, 0.28); ns.start(t + i * 0.055); ns.stop(t + i * 0.055 + dur);
  });
  setTimeout(() => cowMoo(true), 220);
  setTimeout(() => cowMoo(true), 720);
  setTimeout(() => cowMoo(true), 1380);
}

export function woodCreak() {
  const c = _c(); if (!c) return; const t = _t();
  // Crujido de rancho gaucho — madera vieja con historia
  const o = c.createOscillator(); o.type = 'sawtooth';
  const f0 = 175 + Math.random() * 90;
  o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * 0.55, t + 0.20);
  o.frequency.linearRampToValueAtTime(f0 * 0.80, t + 0.36);
  const lp = _lp(1000, 2.2); const g = _gain();
  _env(g, t, 0.005, 0.04, 0.30, 0.24, 0.12); o.connect(lp); lp.connect(g); _toOut(g, 0.12); o.start(t); o.stop(t + 0.42);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CAMPANAS + VICTORIA
// ═══════════════════════════════════════════════════════════════════════════════

export function gmBell() {
  const c = _c(); if (!c) return; const t = _t();
  // Campana de la capilla gauchesca — tono con parciales inarmónicos (bell synthesis)
  [[880, 1.0], [1108, 0.62], [1540, 0.38], [2090, 0.22], [660, 0.55]].forEach(([f, amp], i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const delay = i * 0.04;
    const g = _gain(); g.gain.setValueAtTime(0.0001, t + delay);
    g.gain.linearRampToValueAtTime(0.12 * amp, t + delay + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.2 + i * 0.15);
    o.connect(g); _toOut(g, 0.42 + i * 0.04); o.start(t + delay); o.stop(t + delay + 1.5);
  });
}

export function corralBell() {
  const c = _c(); if (!c) return; const t = _t();
  // Cencerro de vaca — tono más rústico con detuning
  [[648, 0], [652, 0.08], [972, 0.04], [1296, 0.02]].forEach(([f, delay]) => {
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const g = _gain(); g.gain.setValueAtTime(0.0001, t + delay);
    g.gain.linearRampToValueAtTime(0.18, t + delay + 0.010);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.6);
    o.connect(g); _toOut(g, 0.44); o.start(t + delay); o.stop(t + delay + 1.8);
  });
}

export function victory() {
  // Acorde gaucho de celebración — guitarra criolla sintetizada
  const c = _c(); if (!c) return; const t = _t();
  // Tres acordes: La mayor → Re mayor → Mi mayor (cadencia criolla)
  [[220,277,330,0],[294,370,440,0.55],[330,415,494,1.10]].forEach(([f1, f2, f3, delay]) => {
    [f1, f2, f3].forEach((freq, j) => {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq;
      const lp = _lp(2200); const sat = c.createWaveShaper(); sat.curve = _satCurve(40);
      const g = _gain();
      g.gain.setValueAtTime(0.0001, t + delay + j * 0.02);
      g.gain.linearRampToValueAtTime(0.14, t + delay + j * 0.02 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.9);
      o.connect(lp); lp.connect(sat); sat.connect(g); _toOut(g, 0.30);
      o.start(t + delay + j * 0.02); o.stop(t + delay + 1.0);
    });
  });
  setTimeout(() => spurJingle(), 1200);
  setTimeout(() => bomboHit(), 600);
  setTimeout(() => bomboHit(), 1150);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  NUEVOS SONIDOS: GAUCHO · GEOPOLÍTICO · ESPACIAL
// ═══════════════════════════════════════════════════════════════════════════════

// ── CHARANGO — cuerdas de la pampa andina ────────────────────────────────────
export function charangoPluck(note = 440) {
  const c = _c(); if (!c) return; const t = _t();
  // Karplus-Strong simplificado: impulso de ruido → filtro de retroalimentación
  // Aquí usamos suma de parciales con decay rápido (más CPU-amigable)
  [1, 2, 3, 4, 5].forEach((harm, i) => {
    const o = c.createOscillator(); o.type = 'triangle';
    o.frequency.value = note * harm + (Math.random() - 0.5) * 2;
    const g = _gain();
    const vol = 0.12 / (harm * 0.8);
    g.gain.setValueAtTime(0.0001, t + i * 0.001);
    g.gain.linearRampToValueAtTime(vol, t + i * 0.001 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.30 - i * 0.03);
    o.connect(g); _toOut(g, 0.25); o.start(t + i * 0.001); o.stop(t + 0.35);
  });
}

// ── BOMBO LEGUERO — el corazón del malambo ───────────────────────────────────
export function bomboHit() {
  const c = _c(); if (!c) return; const t = _t();
  // Parche principal: sub-bajo con ataque percusivo
  const o = c.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(72, t); o.frequency.exponentialRampToValueAtTime(36, t + 0.18);
  const g = _gain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.75, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  const lp = _lp(240); o.connect(lp); lp.connect(g); _toOut(g, 0.12); o.start(t); o.stop(t + 0.24);
  // Mazo (ruido de cuero golpeado)
  const ns = _mkNoise(0.06); if (ns) {
    const bp = _bp(380, 0.6); const gn = _gain();
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(0.40, t + 0.004);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    ns.connect(bp); bp.connect(gn); _toOut(gn, 0.06); ns.start(t);
  }
}

// ── ESPUELAS — tilín metálico del gaucho ─────────────────────────────────────
export function spurJingle() {
  const c = _c(); if (!c) return; const t = _t();
  const count = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const delay = i * (0.04 + Math.random() * 0.05);
    const f = 3200 + Math.random() * 1800;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const g = _gain();
    g.gain.setValueAtTime(0.0001, t + delay); g.gain.linearRampToValueAtTime(0.06, t + delay + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.18);
    o.connect(g); _toOut(g, 0.06); o.start(t + delay); o.stop(t + delay + 0.20);
  }
}

// ── RADIO ESTÁTICA — interferencia geopolítica ───────────────────────────────
export function radioStatic(durSec = 0.6) {
  const c = _c(); if (!c) return; const t = _t();
  const ns = _mkNoise(durSec); if (!ns) return;
  // Filtro de radio AM (500Hz–4kHz)
  const hp = _hp(500); const lp = _lp(4200); const bp = _bp(1400, 0.8);
  const sat = c.createWaveShaper(); sat.curve = _satCurve(80);
  const g = _gain();
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.18, t + 0.02);
  g.gain.linearRampToValueAtTime(0.18, t + durSec - 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + durSec);
  ns.connect(hp); hp.connect(lp); lp.connect(sat); sat.connect(bp); bp.connect(g); _toOut(g, 0.04); ns.start(t);
  // Barrido de frecuencia (como sintonizando)
  const osc = c.createOscillator(); osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, t); osc.frequency.linearRampToValueAtTime(1600, t + durSec);
  const go = _gain(0.0001);
  go.gain.linearRampToValueAtTime(0.04, t + durSec * 0.4); go.gain.linearRampToValueAtTime(0.0001, t + durSec);
  osc.connect(go); _toOut(go, 0.03); osc.start(t); osc.stop(t + durSec);
}

// ── TRANSMISIÓN ESPACIAL — señal del cosmos gaucho ───────────────────────────
export function transmissionBlip() {
  const c = _c(); if (!c) return; const t = _t();
  // Morse cósmico — 3 pulsos cortos
  [0, 0.18, 0.36].forEach((delay, i) => {
    const dur = 0.08 + i * 0.02;
    const f = 1200 + i * 280;
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const g = _gain(); g.gain.setValueAtTime(0.0001, t + delay);
    g.gain.linearRampToValueAtTime(0.12, t + delay + 0.008);
    g.gain.linearRampToValueAtTime(0.12, t + delay + dur - 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
    o.connect(g); _toOut(g, 0.08); o.start(t + delay); o.stop(t + delay + dur + 0.02);
  });
}

// ── CAÑÓN DISTANTE — geopolítica de la pampa ─────────────────────────────────
export function distantCannon() {
  const c = _c(); if (!c) return; const t = _t();
  // Sub-boom lejano
  const ns1 = _mkNoise(0.45); if (ns1) {
    const lp = _lp(90); const g = _gain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.28, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.50);
    ns1.connect(lp); lp.connect(g); _toOut(g, 0.60); ns1.start(t);
  }
  // Cola distante (tierra que resonó)
  const ns2 = _mkNoise(1.8); if (ns2) {
    const lp = _lp(160); const g = _gain();
    g.gain.setValueAtTime(0.0001, t + 0.10); g.gain.linearRampToValueAtTime(0.15, t + 0.35);
    g.gain.linearRampToValueAtTime(0.0001, t + 1.8);
    ns2.connect(lp); lp.connect(g); _toOut(g, 0.70); ns2.start(t + 0.08);
  }
}

// ── DRONE CÓSMICO — el universo sobre la pampa ───────────────────────────────
let _cosmicDroneNodes = [];
export function startCosmicDrone() {
  if (_cosmicDroneNodes.length) return;
  const c = _c(); if (!c) return;
  // Drones de frecuencias cósmicas (Schumann + armónicos extraterrestres)
  [[27.5, 'sine', 0.055], [41.2, 'sine', 0.040], [55.0, 'triangle', 0.030],
   [110.0, 'sine', 0.015], [164.8, 'sine', 0.010]].forEach(([f, type, vol]) => {
    const o = c.createOscillator(); o.type = type; o.frequency.value = f + (Math.random() - 0.5) * 0.5;
    const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.022 + Math.random() * 0.015;
    const lfoG = _gain(0.025); lfo.connect(lfoG); lfoG.connect(o.frequency);
    const lp = _lp(200); const g = _gain(vol);
    o.connect(lp); lp.connect(g); g.connect(_out);
    if (_rev) { const rg = _gain(0.30); g.connect(rg); rg.connect(_rev); }
    o.start(); lfo.start();
    _cosmicDroneNodes.push({ stop: () => { try { o.stop(); lfo.stop(); } catch(e){} } });
  });
  // Interferencia de fondo (señal de satélite perdido)
  const ns = _mkNoise(4.0);
  if (ns) {
    ns.loop = true;
    const hp = _hp(8000); const g = _gain(0.008);
    ns.connect(hp); hp.connect(g); g.connect(_out); ns.start();
    _cosmicDroneNodes.push({ stop: () => { try { ns.stop(); } catch(e){} } });
  }
}
export function stopCosmicDrone() { _cosmicDroneNodes.forEach(n => n.stop?.()); _cosmicDroneNodes = []; }

// ═══════════════════════════════════════════════════════════════════════════════
//  MOTOR DE MOTO
// ═══════════════════════════════════════════════════════════════════════════════

function _distCurve(k) {
  const n = 512, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    c[i] = (Math.PI + k) * x / (Math.PI + k * Math.abs(x));
  }
  return c;
}
function _sfToFreq(sf) {
  if (sf < 0.33) return 32 + (sf / 0.33) * 38;
  if (sf < 0.66) return 52 + ((sf - 0.33) / 0.33) * 58;
  return 85 + ((sf - 0.66) / 0.34) * 95;
}

let _E = {};
export function startMotoEngine() {
  const c = _c(); if (!c || !_out) return;
  if (c.state === 'suspended') c.resume();
  stopMotoEngine();
  const t = c.currentTime; const e = {};
  e.master = c.createGain(); e.master.gain.setValueAtTime(0, t); e.master.gain.linearRampToValueAtTime(0.20, t + 0.7); e.master.connect(_out);
  e.lpf = c.createBiquadFilter(); e.lpf.type = 'lowpass'; e.lpf.frequency.value = 350; e.lpf.Q.value = 0.7; e.lpf.connect(e.master);
  e.bpf = c.createBiquadFilter(); e.bpf.type = 'peaking'; e.bpf.frequency.value = 180; e.bpf.Q.value = 3; e.bpf.gain.value = 10; e.bpf.connect(e.lpf);
  e.hpf = c.createBiquadFilter(); e.hpf.type = 'highpass'; e.hpf.frequency.value = 28; e.hpf.Q.value = 0.5; e.hpf.connect(e.bpf);
  e.dist = c.createWaveShaper(); e.dist.curve = _distCurve(200); e.dist.oversample = '4x'; e.dist.connect(e.hpf);
  e.osc1 = c.createOscillator(); e.osc1.type = 'sawtooth'; e.osc1.frequency.value = 32;
  e.osc2 = c.createOscillator(); e.osc2.type = 'sawtooth'; e.osc2.frequency.value = 64; e.osc2.detune.value = 12;
  e.osc3 = c.createOscillator(); e.osc3.type = 'sine';     e.osc3.frequency.value = 16;
  const g2 = _gain(0.45); const g3 = _gain(0.70);
  e.lfo = c.createOscillator(); e.lfo.type = 'sine'; e.lfo.frequency.value = 64;
  e.lfoGain = _gain(0.30); e.amGain = _gain(0.70);
  e.lfo.connect(e.lfoGain); e.lfoGain.connect(e.amGain.gain);
  e.osc1.connect(e.amGain); e.amGain.connect(e.dist);
  e.osc2.connect(g2); g2.connect(e.dist);
  e.osc3.connect(g3); g3.connect(e.hpf);
  const nb = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
  const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  e.windSrc = c.createBufferSource(); e.windSrc.buffer = nb; e.windSrc.loop = true;
  e.windBpf = c.createBiquadFilter(); e.windBpf.type = 'bandpass'; e.windBpf.frequency.value = 1400; e.windBpf.Q.value = 0.5;
  e.windGain = _gain(0); e.windSrc.connect(e.windBpf); e.windBpf.connect(e.windGain); e.windGain.connect(e.master);
  e.osc1.start(); e.osc2.start(); e.osc3.start(); e.lfo.start(); e.windSrc.start();
  e.prevSF = 0; e.gear = 0;
  _E = e;
}
export function updateMotoEngine(sf) {
  const e = _E; if (!e.osc1 || !_ctx) return;
  const c = _c(); const t = c.currentTime;
  const newGear = sf < 0.33 ? 0 : sf < 0.66 ? 1 : 2;
  if (newGear > e.gear && sf > e.prevSF + 0.005) {
    e.gear = newGear; motoGearClick();
    const dipF = _sfToFreq(sf) * 0.72;
    e.osc1.frequency.setValueAtTime(dipF, t); e.osc2.frequency.setValueAtTime(dipF * 2, t);
    e.osc3.frequency.setValueAtTime(dipF * 0.5, t); e.lfo.frequency.setValueAtTime(dipF * 2, t);
  }
  if (newGear < e.gear) e.gear = newGear;
  if (e.prevSF > 0.5 && sf < e.prevSF - 0.04 && Math.random() < 0.4) motoDecelPop();
  e.prevSF = sf;
  const F = _sfToFreq(sf); const TC = 0.06;
  e.osc1.frequency.setTargetAtTime(F,       t, TC); e.osc2.frequency.setTargetAtTime(F * 2,   t, TC);
  e.osc3.frequency.setTargetAtTime(F * 0.5, t, TC); e.lfo.frequency.setTargetAtTime(F * 2,    t, TC);
  e.lpf.frequency.setTargetAtTime(350 + sf * 950, t, TC); e.bpf.frequency.setTargetAtTime(180 + sf * 280, t, TC);
  e.master.gain.setTargetAtTime(0.42 + sf * 0.13, t, 0.10);
  e.windGain.gain.setTargetAtTime(sf * sf * 0.10, t, 0.12);
  e.lfoGain.gain.setTargetAtTime(0.35 - sf * 0.18, t, 0.10);
}
export function stopMotoEngine() {
  const e = _E; if (!e.osc1) return;
  const c = _c();
  if (c && e.master) e.master.gain.setTargetAtTime(0, c.currentTime, 0.3);
  const nodes = [e.osc1, e.osc2, e.osc3, e.lfo, e.windSrc];
  _E = {};
  setTimeout(() => nodes.forEach(n => { try { n.stop(); } catch(_) {} }), 700);
}
export function motoGearClick() {
  const c = _c(); if (!c || !_out) return;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.07), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.12));
  const src = c.createBufferSource(); src.buffer = buf;
  const lpf = c.createBiquadFilter(); lpf.type = 'bandpass'; lpf.frequency.value = 3500; lpf.Q.value = 1.2;
  const g = _gain(0.22); src.connect(lpf); lpf.connect(g); g.connect(_out); src.start();
}
export function motoDecelPop() {
  const c = _c(); if (!c || !_out) return;
  const pops = 1 + Math.floor(Math.random() * 3);
  for (let p = 0; p < pops; p++) {
    const delay = p * (0.04 + Math.random() * 0.06);
    const dur = 0.035 + Math.random() * 0.025;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource(); src.buffer = buf;
    const bpf = c.createBiquadFilter(); bpf.type = 'bandpass'; bpf.frequency.value = 600 + Math.random() * 400; bpf.Q.value = 0.8;
    const g = _gain(0.28); src.connect(bpf); bpf.connect(g); g.connect(_out); src.start(c.currentTime + delay);
  }
}
export function motoTireScreech() {
  const c = _c(); if (!c || !_out) return;
  const dur = 0.68; const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 0.4);
  const src = c.createBufferSource(); src.buffer = buf;
  const bp1 = c.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 1100; bp1.Q.value = 1.0;
  const bp2 = c.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 2800; bp2.Q.value = 1.5;
  const g1 = _gain(0.32); const g2 = _gain(0.16);
  src.connect(bp1); bp1.connect(g1); g1.connect(_out);
  src.connect(bp2); bp2.connect(g2); g2.connect(_out); src.start();
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MÚSICA LOBBY — GAUCHO ESPACIAL
// ═══════════════════════════════════════════════════════════════════════════════

let _lobbyNodes = [];
export function startLobbyMusic() {
  if (_lobbyNodes.length) return;
  initAudio();
  const c = _c(); if (!c) return;

  // Drone sub-espacial (el cosmos de la pampa)
  [[27.5, 0.062], [41.2, 0.048], [55.0, 0.035]].forEach(([f, vol], i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f + (Math.random() - 0.5) * 0.4;
    const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.028 + i * 0.012;
    const lfoG = _gain(0.020); lfo.connect(lfoG); lfoG.connect(o.frequency);
    const lp = _lp(80); const g = _gain(vol);
    o.connect(lp); lp.connect(g); _toOut(g, 0.40); o.start(); lfo.start();
    _lobbyNodes.push({ stop: () => { try { o.stop(); lfo.stop(); } catch(e){} } });
  });

  // Melodía de charango — escala pentatónica menor criolla
  // Mi menor pentatónica: E3 G3 A3 B3 D4 E4
  const melody = [164.8, 196.0, 220.0, 246.9, 293.7, 329.6, 246.9, 220.0, 196.0, 164.8, 196.0, 293.7];
  let noteIdx = 0;
  const playMelody = () => {
    if (!_lobbyNodes.length) return;
    const note = melody[noteIdx % melody.length]; noteIdx++;
    charangoPluck(note * 2); // octava alta del charango
    const tid = setTimeout(playMelody, 600 + Math.random() * 800);
    _lobbyNodes.push({ stop: () => clearTimeout(tid) });
  };
  const initTid = setTimeout(playMelody, 1500);
  _lobbyNodes.push({ stop: () => clearTimeout(initTid) });

  // Bombo leguero ocasional (marca el pulso)
  const playBombo = () => {
    if (!_lobbyNodes.length) return;
    bomboHit();
    const tid = setTimeout(playBombo, 1800 + Math.random() * 1200);
    _lobbyNodes.push({ stop: () => clearTimeout(tid) });
  };
  const bomboTid = setTimeout(playBombo, 3200);
  _lobbyNodes.push({ stop: () => clearTimeout(bomboTid) });

  // Interferencia espacial muy suave (señal de satélite gauchesco)
  const playBlip = () => {
    if (!_lobbyNodes.length) return;
    transmissionBlip();
    const tid = setTimeout(playBlip, 8000 + Math.random() * 12000);
    _lobbyNodes.push({ stop: () => clearTimeout(tid) });
  };
  const blipTid = setTimeout(playBlip, 6000 + Math.random() * 4000);
  _lobbyNodes.push({ stop: () => clearTimeout(blipTid) });
}
export function stopLobbyMusic() { _lobbyNodes.forEach(n => n.stop?.()); _lobbyNodes = []; }

// ═══════════════════════════════════════════════════════════════════════════════
//  VOLUMEN + ACCESO AL CONTEXTO
// ═══════════════════════════════════════════════════════════════════════════════

export function setMasterVolume(v) { if (_out) _out.gain.value = Math.max(0, Math.min(1, v)); }
export function getAudioCtx()   { _c(); return _ctx; }
export function getMasterGain() { _c(); return _out; }
