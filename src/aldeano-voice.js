// aldeano-voice.js — Síntesis procedural de la "lengua real" de los aldeanos
// Un solo idioma compartido; el humor y energía afectan el tono y ritmo.
// Daniela TTS es "el traductor" — arranca un instante después.

let _actx = null;

function _getCtx() {
  if (!_actx || _actx.state === 'closed') {
    _actx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}

// ── Sonido de "pensando" ──────────────────────────────────────────────────────
let _thinkMaster   = null;
let _thinkOscs     = [];
let _thinkCtx      = null;

export function startThinkingSound() {
  stopThinkingSound();
  try {
    const ctx = _getCtx();
    _thinkCtx = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);
    master.connect(ctx.destination);
    _thinkMaster = master;
    _thinkOscs   = [];

    // Drone bajo
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 46;
    drone.connect(master);
    drone.start();
    _thinkOscs.push(drone);

    // Vibrato lento en el drone
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 0.22;
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 3.5;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(drone.frequency);
    vibrato.start();
    _thinkOscs.push(vibrato);

    // Shimmer agudo muy bajo
    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = 1340;
    const shimGain = ctx.createGain();
    shimGain.gain.value = 0.006;
    shimmer.connect(shimGain);
    shimGain.connect(master);
    shimmer.start();
    _thinkOscs.push(shimmer);

    // Pulso de amplitud muy lento (latido)
    const pulse = ctx.createOscillator();
    pulse.frequency.value = 1.4;
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.018;
    pulse.connect(pulseGain);
    pulseGain.connect(master.gain);
    pulse.start();
    _thinkOscs.push(pulse);

  } catch (e) {
    console.warn('[aldeano-voice] startThinkingSound error:', e);
  }
}

export function stopThinkingSound() {
  if (!_thinkMaster) return;
  try {
    const now = (_thinkCtx || _getCtx()).currentTime;
    _thinkMaster.gain.cancelScheduledValues(now);
    _thinkMaster.gain.setValueAtTime(_thinkMaster.gain.value, now);
    _thinkMaster.gain.linearRampToValueAtTime(0, now + 0.18);
    const oscs = _thinkOscs;
    setTimeout(() => { for (const o of oscs) { try { o.stop(); } catch (_) {} } }, 220);
  } catch (_) {}
  _thinkMaster = null;
  _thinkOscs   = [];
}

// ── Parámetros de humor / intención ──────────────────────────────────────────
// Todos comparten la misma lengua; solo cambia la energía, velocidad y brillo.
const PARAMS = {
  OFFERING:  { pitch: 152, sylRate: 3.0, brightness: 0.60, vol: 0.15 },
  HOARDING:  { pitch: 122, sylRate: 2.3, brightness: 0.32, vol: 0.10 },
  SHARING:   { pitch: 172, sylRate: 5.4, brightness: 0.82, vol: 0.20 },
  CONSUMING: { pitch: 106, sylRate: 1.8, brightness: 0.22, vol: 0.08 },
  BAR:       { pitch: 162, sylRate: 6.8, brightness: 0.90, vol: 0.19 },
};
const DEFAULT_P = { pitch: 148, sylRate: 4.0, brightness: 0.55, vol: 0.14 };

/**
 * Reproduce la "lengua real" del aldeano mediante síntesis de voz procedural.
 * @param {string} text       — texto de la respuesta (para estimar duración)
 * @param {string} intention  — OFFERING | HOARDING | SHARING | CONSUMING | BAR
 * @param {number} energia    — 0–100
 * @returns {number}          — duración estimada en segundos
 */
export function speakAldeanoReal(text, intention, energia = 100) {
  try {
    const ctx = _getCtx();
    const p   = PARAMS[intention] || DEFAULT_P;

    // Factor de energía: 0.55 – 1.45
    const ef  = 0.55 + (Math.min(100, Math.max(0, energia)) / 100) * 0.9;

    const wordCount = (text || '').split(/\s+/).filter(Boolean).length;
    const duration  = Math.min(1.4 + wordCount * 0.10, 3.6);

    const pitch   = p.pitch   * ef;
    const sylRate = p.sylRate * Math.sqrt(ef);

    // ── Envolvente maestra ─────────────────────────────────────────────────
    const master = ctx.createGain();
    const t0 = ctx.currentTime;
    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(p.vol, t0 + 0.07);
    master.gain.setValueAtTime(p.vol, t0 + duration - 0.22);
    master.gain.linearRampToValueAtTime(0, t0 + duration);
    master.connect(ctx.destination);

    // ── Fuente glotal (diente de sierra = voz rica en armónicos) ──────────
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = pitch;

    // Jitter de tono (voz humana nunca es perfectamente constante)
    const jLfo = ctx.createOscillator();
    jLfo.frequency.value = 6.8;
    const jGain = ctx.createGain();
    jGain.gain.value = pitch * 0.016;
    jLfo.connect(jGain);
    jGain.connect(osc.frequency);

    // ── Formantes (resonancias vocales) ────────────────────────────────────
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.value = 520 + p.brightness * 380;
    f1.Q.value = 3.2;

    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.value = 1050 + p.brightness * 750;
    f2.Q.value = 4.8;

    const fMix = ctx.createGain();
    fMix.gain.value = 1.0;
    osc.connect(f1); osc.connect(f2);
    f1.connect(fMix); f2.connect(fMix);

    // ── Modulación de amplitud (ritmo silábico) ────────────────────────────
    // amGain.gain oscila entre (base - depth) y (base + depth)
    const amGain  = ctx.createGain();
    amGain.gain.value = 0.68;

    const amLfo  = ctx.createOscillator();
    amLfo.type  = 'sine';
    amLfo.frequency.value = sylRate;
    const amLfoG = ctx.createGain();
    amLfoG.gain.value = 0.32;
    amLfo.connect(amLfoG);
    amLfoG.connect(amGain.gain);

    fMix.connect(amGain);
    amGain.connect(master);

    // ── Arrancar ───────────────────────────────────────────────────────────
    osc.start(t0); jLfo.start(t0); amLfo.start(t0);
    const tEnd = t0 + duration;
    osc.stop(tEnd); jLfo.stop(tEnd); amLfo.stop(tEnd);

    return duration;

  } catch (e) {
    console.warn('[aldeano-voice] speakAldeanoReal error:', e);
    return 0;
  }
}
