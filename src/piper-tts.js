// piper-tts.js — Síntesis de voz offline con Piper TTS
// Voz: es_AR-daniela-high (Argentina, ~114 MB, cacheada en el browser)

import * as tts from '@mintplex-labs/piper-tts-web';

const VOICE_ID = 'es_AR-daniela-high';

// ── Pitch por personaje via playbackRate ──────────────────────────────────────
const CHAR_RATES = {
  'Ramón':     0.90,
  'Ofelia':    1.15,
  'Facundo':   0.82,
  'Celestino': 1.00,
  'Zulma':     1.20,
  'GM':        0.72,
};

let _ready   = false;
let _loading = false;
let _failed  = false;

// ── Indicador de descarga en pantalla ─────────────────────────────────────────
let _badge = null;
function _showBadge(text) {
  if (!_badge) {
    _badge = document.createElement('div');
    _badge.style.cssText = [
      'position:fixed', 'bottom:46px', 'left:50%', 'transform:translateX(-50%)',
      'z-index:500', 'font-size:9px', 'color:#c8a050', 'letter-spacing:2px',
      'pointer-events:none', 'font-family:monospace',
      'background:rgba(0,0,0,0.6)', 'padding:2px 8px',
    ].join(';');
    document.body.appendChild(_badge);
  }
  _badge.style.display = text ? 'block' : 'none';
  if (text) _badge.textContent = text;
}

// ── Init ──────────────────────────────────────────────────────────────────────
export async function initPiper() {
  if (_ready || _loading || _failed) return;
  _loading = true;
  _showBadge('daniela: 0%');
  try {
    await tts.download(VOICE_ID, (p) => {
      const pct = p.total ? Math.round(p.loaded / p.total * 100) : '?';
      _showBadge(`daniela: ${pct}%`);
    });
    _ready   = true;
    _loading = false;
    _showBadge(null);
    console.log('[PIPER] daniela lista ✓');
  } catch (e) {
    _failed  = true;
    _loading = false;
    _showBadge(null);
    console.warn('[PIPER] Error cargando daniela:', e);
  }
}

// ── AudioContext ──────────────────────────────────────────────────────────────
let _audioCtx = null;
function _ctx() {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// ── Estado de reproducción ────────────────────────────────────────────────────
let _currentSource = null;
let _busy = false;

function _stopCurrent() {
  try { _currentSource?.stop(); } catch (_) {}
  _currentSource = null;
}

export function cancelPiper() {
  _stopCurrent();
  _busy = false;
}

/**
 * Sintetiza y reproduce texto.
 * @param {string} text
 * @param {string} charName
 * @param {number} volume
 */
export async function speakPiper(text, charName = 'GM', volume = 1.0) {
  if (_failed) return false;
  if (_loading) {
    // Esperar a que termine la descarga (máx 5 min)
    let waited = 0;
    await new Promise(resolve => {
      const iv = setInterval(() => {
        waited += 300;
        if (!_loading || waited > 300000) { clearInterval(iv); resolve(); }
      }, 300);
    });
  }
  if (!_ready) return false;

  _stopCurrent();  // cortar lo que suena, sin tocar versiones
  _busy = true;

  try {
    const wav = await tts.predict({ text, voiceId: VOICE_ID });
    if (!_busy) return false;  // fue cancelado mientras sintetizaba

    const ctx = _ctx();
    const ab  = await wav.arrayBuffer();
    const buf = await ctx.decodeAudioData(ab);
    if (!_busy) return false;

    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = CHAR_RATES[charName] ?? 1.0;
    gain.gain.value = Math.max(0, Math.min(1, volume));
    src.connect(gain);
    gain.connect(ctx.destination);
    _currentSource = src;
    src.onended = () => { if (_currentSource === src) { _currentSource = null; _busy = false; } };
    src.start();
    return true;
  } catch (e) {
    _busy = false;
    console.warn('[PIPER] Error sintetizando:', e);
    return false;
  }
}

export const isPiperReady   = () => _ready;
export const isPiperLoading = () => _loading;
