// aldeano-voice.js — Voz procedural estilo videojuego (Animalese/bursts)
//
// Cada "sílaba" = un burst breve (60ms) con ataque rápido y decay exponencial.
// Esto es lo que hace que suene a habla de videojuego, no a un tono continuo.
//
// La voz está determinada por la posición metafísica real del alma:
//   ix: -1 = INDIVIDUO  ↔  +1 = COMUNIDAD
//   iy: -1 = MATERIA    ↔  +1 = TRASCENDENCIA

let _actx = null;
function _getCtx() {
  if (!_actx || _actx.state === 'closed') {
    _actx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}

// ── Control de fases ──────────────────────────────────────────────────────────
let _theaterVer  = 0;
const _theaterNodes = [];

export function stopTheater() {
  _theaterVer++;
  _fade(_theaterNodes.splice(0));
}

function _fade(nodes, ms = 120) {
  for (const { master, oscs } of nodes) {
    try {
      const ctx = _getCtx(), now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + ms / 1000);
      setTimeout(() => { for (const o of oscs) { try { o.stop(); } catch (_) {} } }, ms + 30);
    } catch (_) {}
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function _sylCount(text) {
  const words = (text || '').toLowerCase().split(/\s+/).filter(Boolean);
  let n = 0;
  for (const w of words) {
    const v = w.match(/[aeiouáéíóú]/g);
    n += Math.max(1, v ? v.length : 1);
  }
  return Math.max(2, n);
}

// Forma de onda según posición metafísica del alma
function _wave(ix, iy) {
  if (iy >  0.3)              return 'sine';      // TRASCENDENCIA: suave, etéreo
  if (iy < -0.2 && ix < -0.1) return 'sawtooth';  // MATERIA+INDIVIDUO: crudo, terroso
  if (ix >  0.3)              return 'square';    // COMUNIDAD: cálido, resonante
  return 'triangle';                              // resto: hueco, neutro
}

function _distCurve(k) {
  const n = 256, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    c[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
  }
  return c;
}

// ─────────────────────────────────────────────────────────────────────────────
// NÚCLEO: genera los bursts de habla estilo videojuego
// Devuelve { master (GainNode, gain=0, sin conectar), oscs, totalDur, volBase }
// ─────────────────────────────────────────────────────────────────────────────
function _makeBursts(ctx, text, ix, iy, energia) {
  const ef        = 0.55 + (Math.min(100, Math.max(0, energia)) / 100) * 0.9;
  const syllables = _sylCount(text);
  const basePitch = (115 + iy * 68) * ef;   // MATERIA≈50Hz, TRASCENDENCIA≈180Hz × ef
  const wave      = _wave(ix, iy);
  const volBase   = 0.32 + iy * 0.08 + ix * 0.05;

  // 60ms burst + 82ms silencio = 142ms/sílaba ≈ 7 bursts/seg (habla natural de juego)
  const BURST  = 0.060;
  const PERIOD = 0.142;
  const totalDur = syllables * PERIOD;

  const master = ctx.createGain();
  master.gain.value = 0;

  const oscs = [];
  const t0   = ctx.currentTime;

  for (let i = 0; i < syllables; i++) {
    const t = t0 + i * PERIOD;

    // Entonación quasi-melódica (no random — determinista, suena a "idioma")
    const pMult = 1.0 + Math.sin(i * 2.1) * 0.09 + Math.sin(i * 1.37) * 0.04;
    const freq  = basePitch * pMult;

    const osc = ctx.createOscillator();
    osc.type  = wave;
    osc.frequency.value = freq;

    // Envelope percusivo: ataque 4ms, decay exponencial hasta silencio
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1.0, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.001, t + BURST);

    // Filtro formántico (timbre vocal del personaje)
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.value = 480 + ix * 170;   // INDIVIDUO=310Hz, COMUNIDAD=650Hz
    f1.Q.value = 1.2;  // Q bajo = banda ancha = más armónicos pasan

    osc.connect(f1); f1.connect(env); env.connect(master);
    osc.start(t); osc.stop(t + BURST + 0.008);
    oscs.push(osc);
  }

  return { master, oscs, totalDur, volBase };
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 1 — El traductor procesa el texto del usuario
// Industrial/electrónico: ruido de datos + sweep + drone profundo (1.5s)
// ─────────────────────────────────────────────────────────────────────────────
export function startPhase1(onDone) {
  stopTheater();
  const v = _theaterVer;
  const DUR_MS = 2800;   // ← 1500→2800ms: se siente como procesamiento real
  const dur    = DUR_MS / 1000;
  try {
    const ctx = _getCtx();
    const t0  = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.13, t0);
    master.gain.setValueAtTime(0.13, t0 + dur - 0.10);
    master.gain.linearRampToValueAtTime(0, t0 + dur);
    master.connect(ctx.destination);

    const oscs = [];

    // ── Bursts de ruido (paquetes de datos) ───────────────────────────────
    const burstTs = [0, 0.06, 0.15, 0.19, 0.32, 0.41, 0.54, 0.68, 0.80, 0.96, 1.10, 1.28, 1.40];
    for (const bt of burstTs) {
      const bufSz = Math.floor(ctx.sampleRate * 0.022);
      const buf   = ctx.createBuffer(1, bufSz, ctx.sampleRate);
      const d     = buf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) d[i] = Math.random() * 2 - 1;
      const ns  = ctx.createBufferSource(); ns.buffer = buf;
      const bpf = ctx.createBiquadFilter(); bpf.type = 'bandpass';
      bpf.frequency.value = 900 + bt * 1400; bpf.Q.value = 3.5;
      const g   = ctx.createGain(); g.gain.value = 0.45 + Math.random() * 0.35;
      ns.connect(bpf); bpf.connect(g); g.connect(master);
      ns.start(t0 + bt);
    }

    // ── Sweep electrónico ascendente (escaneo) ────────────────────────────
    const sweep = ctx.createOscillator(); sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(120, t0);
    sweep.frequency.linearRampToValueAtTime(4000, t0 + dur * 0.88);
    const swF = ctx.createBiquadFilter(); swF.type = 'bandpass'; swF.Q.value = 10;
    swF.frequency.setValueAtTime(120, t0);
    swF.frequency.linearRampToValueAtTime(4000, t0 + dur * 0.88);
    const swG = ctx.createGain(); swG.gain.value = 0.055;
    sweep.connect(swF); swF.connect(swG); swG.connect(master);
    sweep.start(t0); sweep.stop(t0 + dur);
    oscs.push(sweep);

    // ── Drone profundo (presencia mística) ───────────────────────────────
    const drone = ctx.createOscillator(); drone.type = 'sine'; drone.frequency.value = 52;
    const dG  = ctx.createGain(); dG.gain.value = 0.20;
    const dLfo = ctx.createOscillator(); dLfo.frequency.value = 0.5;
    const dLG  = ctx.createGain(); dLG.gain.value = 0.05;
    dLfo.connect(dLG); dLG.connect(dG.gain);
    drone.connect(dG); dG.connect(master);
    drone.start(t0); drone.stop(t0 + dur);
    dLfo.start(t0);  dLfo.stop(t0 + dur);
    oscs.push(drone, dLfo);

    _theaterNodes.push({ master, oscs });

  } catch (e) { console.warn('[aldeano-voice] phase1:', e); }

  setTimeout(() => { if (_theaterVer === v && onDone) onDone(); }, DUR_MS);
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 — El traductor transmite (voz del aldeano filtrada por el dispositivo)
// Mismos bursts que la voz real, pero a través de cadena radio/dispositivo
// ─────────────────────────────────────────────────────────────────────────────
export function startPhase2(text, ix, iy, onDone) {
  const v = _theaterVer;
  let durMs = 4000;
  try {
    const ctx = _getCtx();
    const t0  = ctx.currentTime;
    const { master, oscs, totalDur, volBase } = _makeBursts(ctx, text, ix, iy, 80);
    // Mínimo 4s — el traductor tarda en "traducir", no importa cuán corto sea el mensaje
    durMs = Math.max(4000, totalDur * 1000 + 400);
    const dur = durMs / 1000;

    // Envolvente del master (volumen del dispositivo: ligeramente más bajo)
    const vol = volBase * 0.60;
    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(vol, t0 + 0.04);
    master.gain.setValueAtTime(vol, t0 + dur - 0.12);
    master.gain.linearRampToValueAtTime(0, t0 + dur);

    // ── Cadena de filtro radio/dispositivo ────────────────────────────────
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass'; hpf.frequency.value = 340; hpf.Q.value = 0.8;

    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass'; bpf.frequency.value = 880; bpf.Q.value = 2.0;

    const ws = ctx.createWaveShaper();
    ws.curve = _distCurve(24); ws.oversample = '2x';

    const tremGain = ctx.createGain(); tremGain.gain.value = 0.87;
    const tremLfo  = ctx.createOscillator(); tremLfo.frequency.value = 19;
    const tremLfoG = ctx.createGain(); tremLfoG.gain.value = 0.13;
    tremLfo.connect(tremLfoG); tremLfoG.connect(tremGain.gain);
    tremLfo.start(t0); tremLfo.stop(t0 + dur);
    oscs.push(tremLfo);

    master.connect(hpf);
    hpf.connect(bpf);
    bpf.connect(ws);
    ws.connect(tremGain);
    tremGain.connect(ctx.destination);

    _theaterNodes.push({ master, oscs });

  } catch (e) { console.warn('[aldeano-voice] phase2:', e); }

  setTimeout(() => { if (_theaterVer === v && onDone) onDone(); }, durMs);
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 3 — El aldeano piensa (casi silencio, loop hasta respuesta)
// ─────────────────────────────────────────────────────────────────────────────
export function startPhase3(ix, iy) {
  // El aldeano "piensa" — audible, no silencio. Murmullos irregulares + respiración.
  try {
    const ctx = _getCtx();
    const t0  = ctx.currentTime;
    const pitch = 72 + iy * 30;
    const vol   = 0.055 + Math.abs(iy) * 0.018;  // ← mucho más audible (era 0.010)

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(vol, t0 + 0.6);
    master.connect(ctx.destination);

    // Drone de "pensamiento" — ondulante, presente
    const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = pitch;
    const breathLfo = ctx.createOscillator(); breathLfo.frequency.value = 0.14 + iy * 0.04;
    const breathG   = ctx.createGain(); breathG.gain.value = vol * 0.4;
    breathLfo.connect(breathG); breathG.connect(master.gain);
    osc.connect(master); osc.start(); breathLfo.start();

    const oscs = [osc, breathLfo];

    // Segunda voz inarmónica — más carácter
    const ot = ctx.createOscillator(); ot.type = 'triangle';
    ot.frequency.value = pitch * (iy > 0 ? 2.74 : 1.52);
    const otG = ctx.createGain(); otG.gain.value = vol * 0.25;
    ot.connect(otG); otG.connect(master); ot.start(); oscs.push(ot);

    // Bursts irregulares de "murmullo" cada ~1.5-3s
    const _schedBurst = (delay) => {
      const bTimer = setTimeout(() => {
        if (!_theaterNodes.find(n => n.master === master)) return; // ya parado
        const bt  = ctx.currentTime;
        const bufSz = Math.floor(ctx.sampleRate * 0.045);
        const buf   = ctx.createBuffer(1, bufSz, ctx.sampleRate);
        const d     = buf.getChannelData(0);
        for (let i = 0; i < bufSz; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
        const ns  = ctx.createBufferSource(); ns.buffer = buf;
        const bpf = ctx.createBiquadFilter(); bpf.type = 'bandpass';
        bpf.frequency.value = pitch * 3; bpf.Q.value = 4;
        const bg  = ctx.createGain(); bg.gain.value = vol * 0.6;
        ns.connect(bpf); bpf.connect(bg); bg.connect(master);
        ns.start(bt);
        _schedBurst(1400 + Math.random() * 1800);
      }, delay);
    };
    _schedBurst(600 + Math.random() * 800);

    _theaterNodes.push({ master, oscs });

  } catch (e) { console.warn('[aldeano-voice] phase3:', e); }
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 4 — El aldeano responde (bursts sin filtro, voz real)
// Llamar desde onStart de Daniela para que sean casi simultáneos
// ─────────────────────────────────────────────────────────────────────────────
export function speakAldeanoReal(text, ix, iy, energia) {
  try {
    const ctx = _getCtx();
    const t0  = ctx.currentTime;
    const { master, oscs, totalDur, volBase } = _makeBursts(ctx, text, ix, iy, energia);

    master.gain.setValueAtTime(0, t0);
    master.gain.linearRampToValueAtTime(volBase, t0 + 0.04);
    master.gain.setValueAtTime(volBase, t0 + totalDur - 0.12);
    master.gain.linearRampToValueAtTime(0, t0 + totalDur);
    master.connect(ctx.destination);

    return totalDur;
  } catch (e) {
    console.warn('[aldeano-voice] speakAldeanoReal:', e);
    return 0;
  }
}
