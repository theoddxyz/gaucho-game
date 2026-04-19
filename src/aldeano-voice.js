// aldeano-voice.js — Síntesis procedural de la voz de los aldeanos
//
// La voz está determinada por la posición metafísica real del alma:
//   ix: -1 = INDIVIDUO  ↔  +1 = COMUNIDAD
//   iy: -1 = MATERIA    ↔  +1 = TRASCENDENCIA
//
// Flujo teatral:
//   Fase 1 — "el traductor procesa"  (electrónico + místico, ~1s)
//   Fase 2 — "el traductor transmite" (lengua del aldeano, filtrada/dispositivo, ~1.5s)
//   Fase 3 — "el aldeano piensa"     (ambiente continuo hasta que llega respuesta)
//   Fase 4 — speakAldeanoReal()      (lengua real, sin filtro, cuando responde)

let _actx = null;

function _getCtx() {
  if (!_actx || _actx.state === 'closed') {
    _actx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}

// ── Control de fases (versión = guard de cancelación) ────────────────────────
let _theaterVer  = 0;
const _theaterNodes = [];  // { master: GainNode, oscs: OscillatorNode[] }[]

/** Detiene cualquier sonido teatral en curso con fade corto */
export function stopTheater() {
  _theaterVer++;
  _fadeAndStop(_theaterNodes.splice(0));
}

function _fadeAndStop(nodes, ms = 130) {
  for (const { master, oscs } of nodes) {
    try {
      const ctx = _getCtx();
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + ms / 1000);
      setTimeout(() => { for (const o of oscs) { try { o.stop(); } catch (_) {} } }, ms + 30);
    } catch (_) {}
  }
}

// ── Curva de distorsión suave (WaveShaper) ────────────────────────────────────
function _distortionCurve(amount) {
  const n = 256;
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    c[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return c;
}

// ── Constructor base de voz ───────────────────────────────────────────────────
// Devuelve { master (GainNode, gain=0, no conectado), oscs (array) }
// El caller configura la envolvente de master y llama start()/stop() en los oscs.
function _buildVoice(ctx, ix, iy, energia, filtered) {
  const oscs = [];

  // Normalizar energía
  const ef  = 0.5 + (Math.min(100, Math.max(0, energia)) / 100) * 1.0;

  // ── Parámetros desde posición metafísica ────────────────────────────────────
  // Pitch: MATERIA = grave, TRASCENDENCIA = agudo
  const pitch    = (120 + iy * 65) * ef;                      // 55–185 Hz × ef

  // Ritmo silábico: COMUNIDAD/TRASCENDENCIA = más rápido
  const sylRate  = 3.5 + iy * 1.5 + Math.max(0, ix) * 1.0;   // ~2–6 Hz

  // Formante 1: INDIVIDUO = más cerrado (baja F1), COMUNIDAD = más abierto
  const f1Freq   = 520 + ix * 140;                             // 380–660 Hz

  // Formante 2: combinación de ambos ejes
  const f2Freq   = 1100 + ix * 430 + iy * 160;                // ~510–1690 Hz

  // Jitter: INDIVIDUO = más inestable, COMUNIDAD = más estable
  const jitter   = pitch * (0.016 - Math.abs(ix) * 0.006);

  // Volumen base
  const volBase  = 0.13 + iy * 0.04 + ix * 0.03;

  // ── Fuente glotal (diente de sierra) ────────────────────────────────────────
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = pitch;
  oscs.push(osc);

  const jLfo  = ctx.createOscillator();
  jLfo.frequency.value = 6.5 + Math.abs(ix) * 2;
  const jGain = ctx.createGain();
  jGain.gain.value = jitter;
  jLfo.connect(jGain);
  jGain.connect(osc.frequency);
  oscs.push(jLfo);

  // ── Formantes ────────────────────────────────────────────────────────────────
  const f1 = ctx.createBiquadFilter();
  f1.type = 'bandpass'; f1.frequency.value = f1Freq; f1.Q.value = 3.5;
  const f2 = ctx.createBiquadFilter();
  f2.type = 'bandpass'; f2.frequency.value = f2Freq; f2.Q.value = 5.0;

  // Tercer formante sutil: TRASCENDENCIA = más brillo
  const f3 = ctx.createBiquadFilter();
  f3.type = 'bandpass';
  f3.frequency.value = 2400 + iy * 800;
  f3.Q.value = 7;
  const f3Vol = ctx.createGain();
  f3Vol.gain.value = Math.max(0, iy) * 0.3;

  const fMix = ctx.createGain(); fMix.gain.value = 1.0;
  osc.connect(f1); osc.connect(f2); osc.connect(f3);
  f1.connect(fMix); f2.connect(fMix);
  f3.connect(f3Vol); f3Vol.connect(fMix);

  // ── Modulación de amplitud (ritmo silábico) ───────────────────────────────
  const amGain = ctx.createGain(); amGain.gain.value = 0.65;
  const amLfo  = ctx.createOscillator(); amLfo.type = 'sine'; amLfo.frequency.value = sylRate;
  const amLfoG = ctx.createGain(); amLfoG.gain.value = 0.35;
  amLfo.connect(amLfoG); amLfoG.connect(amGain.gain);
  fMix.connect(amGain);
  oscs.push(amLfo);

  let out = amGain;
  const master = ctx.createGain(); master.gain.value = 0;

  // ── Filtro de dispositivo (solo para fase 2) ─────────────────────────────
  if (filtered) {
    // ── Filtro de radio/dispositivo ──────────────────────────────────────────
    // HPF: elimina bajos (como un viejo parlante)
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass'; hpf.frequency.value = 320; hpf.Q.value = 0.7;

    // BPF estrecho: banda de teléfono/radio (300-3000 Hz → centrar en 850)
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass'; bpf.frequency.value = 850; bpf.Q.value = 1.8;

    // Distorsión más pronunciada (claramente electrónico)
    const ws = ctx.createWaveShaper();
    ws.curve = _distortionCurve(22);
    ws.oversample = '2x';

    // Tremolo a 18Hz (vibración de dispositivo)
    const tremGain = ctx.createGain(); tremGain.gain.value = 0.88;
    const tremLfo  = ctx.createOscillator(); tremLfo.frequency.value = 18;
    const tremLfoG = ctx.createGain(); tremLfoG.gain.value = 0.12;
    tremLfo.connect(tremLfoG); tremLfoG.connect(tremGain.gain);
    oscs.push(tremLfo);

    out.connect(hpf); hpf.connect(bpf); bpf.connect(ws); ws.connect(tremGain);
    tremGain.connect(master);
  } else {
    out.connect(master);
  }

  return { master, oscs, volBase };
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 1 — El traductor procesa (electrónico industrial + toque místico)
// Clicks irregulares de datos + sweep + drone profundo
// ─────────────────────────────────────────────────────────────────────────────
export function startPhase1(onDone) {
  stopTheater();
  const v = _theaterVer;
  const DURATION_MS = 900;
  try {
    const ctx = _getCtx();
    const t0  = ctx.currentTime;
    const dur = DURATION_MS / 1000;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.12, t0);
    master.gain.setValueAtTime(0.12, t0 + dur - 0.08);
    master.gain.linearRampToValueAtTime(0, t0 + dur);
    master.connect(ctx.destination);

    const oscs = [];

    // ── Bursts de ruido cortos (datos procesándose) ────────────────────────
    const burstTimes = [0, 0.07, 0.18, 0.22, 0.38, 0.45, 0.60, 0.72, 0.83];
    for (const bt of burstTimes) {
      const bufSz = Math.floor(ctx.sampleRate * 0.025);
      const buf   = ctx.createBuffer(1, bufSz, ctx.sampleRate);
      const data  = buf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) data[i] = Math.random() * 2 - 1;
      const ns  = ctx.createBufferSource(); ns.buffer = buf;
      const bpf = ctx.createBiquadFilter(); bpf.type = 'bandpass';
      bpf.frequency.value = 1200 + bt * 2000; bpf.Q.value = 3;
      const g = ctx.createGain(); g.gain.value = 0.55 + Math.random() * 0.3;
      ns.connect(bpf); bpf.connect(g); g.connect(master);
      ns.start(t0 + bt);
    }

    // ── Sweep electrónico ascendente (escaneo) ─────────────────────────────
    const sweep = ctx.createOscillator(); sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(180, t0);
    sweep.frequency.linearRampToValueAtTime(3200, t0 + dur * 0.85);
    const sweepG = ctx.createGain(); sweepG.gain.value = 0.06;
    const sweepF = ctx.createBiquadFilter(); sweepF.type = 'bandpass'; sweepF.Q.value = 8;
    sweepF.frequency.setValueAtTime(180, t0);
    sweepF.frequency.linearRampToValueAtTime(3200, t0 + dur * 0.85);
    sweep.connect(sweepF); sweepF.connect(sweepG); sweepG.connect(master);
    sweep.start(t0); sweep.stop(t0 + dur);
    oscs.push(sweep);

    // ── Drone profundo (base mística) ──────────────────────────────────────
    const drone = ctx.createOscillator(); drone.type = 'sine'; drone.frequency.value = 55;
    const droneG = ctx.createGain(); droneG.gain.value = 0.18;
    const droneM = ctx.createOscillator(); droneM.frequency.value = 0.6;
    const droneMG = ctx.createGain(); droneMG.gain.value = 0.06;
    droneM.connect(droneMG); droneMG.connect(droneG.gain);
    drone.connect(droneG); droneG.connect(master);
    drone.start(t0); drone.stop(t0 + dur);
    droneM.start(t0); droneM.stop(t0 + dur);
    oscs.push(drone, droneM);

    _theaterNodes.push({ master, oscs });

  } catch (e) { console.warn('[aldeano-voice] phase1:', e); }

  setTimeout(() => { if (_theaterVer === v && onDone) onDone(); }, DURATION_MS);
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 — El traductor transmite (lengua real filtrada)
// ─────────────────────────────────────────────────────────────────────────────
export function startPhase2(text, ix, iy, onDone) {
  const v = _theaterVer;
  const wordCount  = (text || '').split(/\s+/).filter(Boolean).length;
  const durationMs = Math.min(900 + wordCount * 80, 2400);
  try {
    const ctx  = _getCtx();
    const t0   = ctx.currentTime;
    const dur  = durationMs / 1000;
    const { master, oscs, volBase } = _buildVoice(ctx, ix, iy, 75, true);
    const vol = volBase * 0.65; // más tenue: viene de un dispositivo

    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(vol, t0 + 0.06);
    master.gain.setValueAtTime(vol, t0 + dur - 0.18);
    master.gain.linearRampToValueAtTime(0, t0 + dur);
    master.connect(ctx.destination);

    for (const o of oscs) { o.start(t0); o.stop(t0 + dur); }
    _theaterNodes.push({ master, oscs });

  } catch (e) { console.warn('[aldeano-voice] phase2:', e); }

  setTimeout(() => { if (_theaterVer === v && onDone) onDone(); }, durationMs);
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 3 — El aldeano piensa (loop continuo hasta respuesta)
// Muy suave; ix/iy determinan la cualidad del silencio
// ─────────────────────────────────────────────────────────────────────────────
export function startPhase3(ix, iy) {
  try {
    const ctx = _getCtx();
    const t0  = ctx.currentTime;

    // Muy silencioso — apenas una presencia
    const pitch = 72 + iy * 28;
    const vol   = 0.012 + Math.abs(iy) * 0.006;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(vol, t0 + 0.6);
    master.connect(ctx.destination);

    const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = pitch;

    // Respiración lenta
    const breathLfo = ctx.createOscillator(); breathLfo.frequency.value = 0.12 + iy * 0.04;
    const breathG   = ctx.createGain(); breathG.gain.value = vol * 0.4;
    breathLfo.connect(breathG); breathG.connect(master.gain);

    osc.connect(master); osc.start(); breathLfo.start();

    const oscs = [osc, breathLfo];

    // Tono inarmónico para TRASCENDENCIA (sensación etérea)
    if (iy > 0.2) {
      const ot = ctx.createOscillator(); ot.type = 'sine'; ot.frequency.value = pitch * 2.72;
      const otG = ctx.createGain(); otG.gain.value = iy * 0.008;
      ot.connect(otG); otG.connect(master);
      ot.start(); oscs.push(ot);
    }

    // Ruido muy tenue para INDIVIDUO (tensión, soledad)
    if (ix < -0.2) {
      const bufSz = ctx.sampleRate;
      const nBuf  = ctx.createBuffer(1, bufSz, ctx.sampleRate);
      const nd    = nBuf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) nd[i] = (Math.random() * 2 - 1) * 0.12;
      const noise = ctx.createBufferSource(); noise.buffer = nBuf; noise.loop = true;
      const noiseF = ctx.createBiquadFilter(); noiseF.type = 'bandpass'; noiseF.frequency.value = 400; noiseF.Q.value = 0.8;
      const noiseG = ctx.createGain(); noiseG.gain.value = Math.abs(ix) * 0.008;
      noise.connect(noiseF); noiseF.connect(noiseG); noiseG.connect(master);
      noise.start();
      // Para el ruido necesitamos guardarlo especialmente (no es OscillatorNode)
      // Usamos _fadeAndStop con un wrapper
      _theaterNodes.push({ master: noiseG, oscs: [] });
      setTimeout(() => { try { noise.stop(); } catch(_) {} }, 120000);
    }

    _theaterNodes.push({ master, oscs });

  } catch (e) { console.warn('[aldeano-voice] phase3:', e); }
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 4 — El aldeano responde (lengua real, sin filtro)
// ─────────────────────────────────────────────────────────────────────────────
export function speakAldeanoReal(text, ix, iy, energia) {
  try {
    const ctx  = _getCtx();
    const t0   = ctx.currentTime;
    const { master, oscs, volBase } = _buildVoice(ctx, ix, iy, energia, false);

    const wordCount = (text || '').split(/\s+/).filter(Boolean).length;
    const dur       = Math.min(1.3 + wordCount * 0.10, 3.8);

    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(volBase, t0 + 0.07);
    master.gain.setValueAtTime(volBase, t0 + dur - 0.22);
    master.gain.linearRampToValueAtTime(0, t0 + dur);
    master.connect(ctx.destination);

    for (const o of oscs) { o.start(t0); o.stop(t0 + dur); }

    return dur;
  } catch (e) {
    console.warn('[aldeano-voice] speakAldeanoReal:', e);
    return 0;
  }
}
