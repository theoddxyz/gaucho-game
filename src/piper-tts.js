// piper-tts.js — Síntesis de voz offline con Piper TTS
// Voz: es_MX-ald-medium (español mexicano, 63MB, más cercano al rioplatense disponible)
// es_AR-daniela NO existe en este paquete

import * as tts from '@mintplex-labs/piper-tts-web';

const VOICE_ID = 'es_MX-ald-medium';

// ── Pitch por personaje via playbackRate ──────────────────────────────────────
const CHAR_RATES = {
  'Ramón':     0.90,
  'Ofelia':    1.15,
  'Facundo':   0.82,
  'Celestino': 1.00,
  'Zulma':     1.20,
  'GM':        0.72,
};

let _state = 'idle';  // 'idle' | 'loading' | 'ready' | 'failed'

// ── Badge de progreso en pantalla ─────────────────────────────────────────────
let _badge = null;
function _badge_show(text) {
  if (!_badge) {
    _badge = document.createElement('div');
    _badge.style.cssText = [
      'position:fixed', 'bottom:46px', 'left:50%', 'transform:translateX(-50%)',
      'z-index:500', 'font-size:9px', 'color:#c8a050', 'letter-spacing:2px',
      'pointer-events:none', 'font-family:monospace',
      'background:rgba(0,0,0,0.7)', 'padding:2px 10px', 'border:1px solid #4a3010',
    ].join(';');
    document.body.appendChild(_badge);
  }
  _badge.style.display = text ? 'block' : 'none';
  if (text) _badge.textContent = text;
}

// ── Init: descarga el modelo ──────────────────────────────────────────────────
export async function initPiper() {
  if (_state !== 'idle') return;
  _state = 'loading';
  _badge_show('voz: 0%');
  try {
    await tts.download(VOICE_ID, (p) => {
      const pct = p.total ? Math.round(p.loaded / p.total * 100) : '?';
      _badge_show(`voz: ${pct}%`);
      console.log(`[PIPER] ${pct}%`);
    });
    _state = 'ready';
    _badge_show(null);
    console.log('[PIPER] listo ✓', VOICE_ID);
  } catch (e) {
    _state = 'failed';
    _badge_show(null);
    console.error('[PIPER] fallo:', e);
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

// ── Reproducción ──────────────────────────────────────────────────────────────
let _src = null;
let _busy = false;

function _stop() {
  try { _src?.stop(); } catch (_) {}
  _src  = null;
  _busy = false;
}

export function cancelPiper() { _stop(); }

export async function speakPiper(text, charName = 'GM', volume = 1.0) {
  // Esperar si todavía está descargando
  if (_state === 'loading') {
    await new Promise(r => {
      const iv = setInterval(() => { if (_state !== 'loading') { clearInterval(iv); r(); } }, 400);
    });
  }
  if (_state !== 'ready') return false;

  _stop();
  _busy = true;

  try {
    console.log('[PIPER] sintetizando:', text.slice(0, 40));
    const wav = await tts.predict({ text, voiceId: VOICE_ID });
    if (!_busy) return false;

    const ctx = _ctx();
    const buf = await ctx.decodeAudioData(await wav.arrayBuffer());
    if (!_busy) return false;

    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = CHAR_RATES[charName] ?? 1.0;
    gain.gain.value = Math.max(0, Math.min(1, volume));
    src.connect(gain);
    gain.connect(ctx.destination);
    _src = src;
    src.onended = () => { if (_src === src) { _src = null; _busy = false; } };
    src.start();
    console.log('[PIPER] reproduciendo ✓', charName, 'rate:', src.playbackRate.value);
    return true;
  } catch (e) {
    _busy = false;
    console.error('[PIPER] error sintetizando:', e);
    return false;
  }
}

export const isPiperReady   = () => _state === 'ready';
export const isPiperLoading = () => _state === 'loading';
