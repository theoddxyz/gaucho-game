// piper-tts.js — Síntesis de voz offline con Piper TTS
// Voz: es_AR-daniela-high (Argentina, 114 MB, descargada una vez y cacheada en el browser)

import * as tts from '@mintplex-labs/piper-tts-web';

const VOICE_ID = 'es_AR-daniela-high';

// ── Pitch por personaje via playbackRate ──────────────────────────────────────
// playbackRate < 1 = más grave y lento / > 1 = más agudo y rápido
const CHAR_RATES = {
  'Ramón':     0.90,   // grave, pausado
  'Ofelia':    1.15,   // agudo, vivaz
  'Facundo':   0.82,   // muy grave, lento
  'Celestino': 1.00,   // neutro
  'Zulma':     1.20,   // agudo, enérgico
  'GM':        0.72,   // narrador: dramático, muy grave
};

let _state   = 'idle';   // 'idle' | 'loading' | 'ready' | 'failed'
let _audioCtx = null;
let _version  = 0;       // cancela síntesis pendiente al incrementar

// ── Init (inicia descarga, solo una vez) ──────────────────────────────────────
export async function initPiper(onProgress) {
  if (_state !== 'idle') return;
  _state = 'loading';
  try {
    await tts.download(VOICE_ID, (p) => {
      if (onProgress && p.total) onProgress(Math.round(p.loaded / p.total * 100));
    });
    _state = 'ready';
    console.log('[PIPER] daniela lista ✓');
  } catch (e) {
    _state = 'failed';
    console.warn('[PIPER] Error cargando daniela:', e);
  }
}

// ── AudioContext (lazy, resumido en gesto de usuario) ─────────────────────────
function _ctx() {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// ── Hablar ────────────────────────────────────────────────────────────────────
let _currentSource = null;

export function cancelPiper() {
  _version++;
  try { _currentSource?.stop(); } catch (_) {}
  _currentSource = null;
}

/**
 * Sintetiza y reproduce texto con Piper.
 * @param {string}  text
 * @param {string}  charName  — nombre del aldeano o 'GM'
 * @param {number}  volume
 * @returns {Promise<boolean>}  true si se reprodujo, false si fue cancelado
 */
export async function speakPiper(text, charName = 'GM', volume = 1.0) {
  if (_state === 'failed') return false;

  // Si todavía está descargando, esperar
  if (_state === 'loading') {
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (_state !== 'loading') { clearInterval(check); resolve(); }
      }, 300);
    });
  }
  if (_state !== 'ready') return false;

  const myVersion = ++_version;
  cancelPiper();  // cortar lo que esté sonando

  try {
    const wav  = await tts.predict({ text, voiceId: VOICE_ID });
    if (_version !== myVersion) return false;  // fue cancelado mientras sintetizaba

    const ctx  = _ctx();
    const ab   = await wav.arrayBuffer();
    const buf  = await ctx.decodeAudioData(ab);
    if (_version !== myVersion) return false;

    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = CHAR_RATES[charName] ?? 1.0;
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(ctx.destination);
    _currentSource = src;
    src.start();
    return true;
  } catch (e) {
    console.warn('[PIPER] Error sintetizando:', e);
    return false;
  }
}

export const isPiperReady  = () => _state === 'ready';
export const isPiperLoading = () => _state === 'loading';
