// piper-tts.js — Piper TTS via Web Worker (sin bloquear el hilo principal)

// ── Worker ────────────────────────────────────────────────────────────────────
let _worker = null;
let _state  = 'idle'; // 'idle' | 'loading' | 'ready' | 'failed'
let _seq    = 0;
const _pending = new Map(); // id → resolve(ArrayBuffer|null)

// ── Badge de progreso ─────────────────────────────────────────────────────────
let _badge = null;
function _badge_set(text) {
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

function _ensureWorker() {
  if (_worker) return _worker;
  _worker = new Worker(new URL('./piper-worker.js', import.meta.url), { type: 'module' });
  _worker.onmessage = ({ data }) => {
    switch (data.type) {
      case 'progress':
        _badge_set(`daniela: ${data.pct}%`);
        break;
      case 'ready':
        _state = 'ready';
        _badge_set(null);
        console.log('[PIPER] daniela lista ✓ (worker)');
        break;
      case 'failed':
        _state = 'failed';
        _badge_set(null);
        console.error('[PIPER] fallo en worker:', data.msg);
        break;
      case 'wav': {
        const cb = _pending.get(data.id);
        if (cb) { _pending.delete(data.id); cb(data.buffer); }
        break;
      }
      case 'error': {
        const cb = _pending.get(data.id);
        if (cb) { _pending.delete(data.id); cb(null); }
        break;
      }
    }
  };
  _worker.onerror = (e) => {
    console.error('[PIPER] worker error:', e);
    _state = 'failed';
    // resolver todos los pending con null
    for (const [id, cb] of _pending) { cb(null); }
    _pending.clear();
  };
  return _worker;
}

// ── Init público ──────────────────────────────────────────────────────────────
export function initPiper() {
  if (_state !== 'idle') return;
  _state = 'loading';
  _badge_set('daniela: 0%');
  _ensureWorker().postMessage({ type: 'init' });
}

// ── AudioContext (solo en el hilo principal) ───────────────────────────────────
let _audioCtx = null;
function _ctx() {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// ── Control de cancelación ────────────────────────────────────────────────────
let _current   = 0;  // se incrementa en cada speakPiper() y en cancelPiper()
let _currentSrc = null;

export function cancelPiper() {
  _current++;
  try { _currentSrc?.stop(); } catch (_) {}
  _currentSrc = null;
  // abandonar todos los pending
  for (const [id, cb] of _pending) { cb(null); }
  _pending.clear();
}

// ── Síntesis + reproducción ───────────────────────────────────────────────────
export async function speakPiper(text, charName = 'GM', volume = 1.0, onStart = null) {
  // Esperar descarga si está en progreso
  if (_state === 'loading') {
    await new Promise(r => {
      const iv = setInterval(() => { if (_state !== 'loading') { clearInterval(iv); r(); } }, 400);
    });
  }
  if (_state !== 'ready') return false;

  // Cancelar síntesis anterior
  _current++;
  const myId = _current;
  try { _currentSrc?.stop(); } catch (_) {}
  _currentSrc = null;
  // Abandonar requests pendientes anteriores
  for (const [id, cb] of _pending) { cb(null); }
  _pending.clear();

  try {
    const reqId = ++_seq;
    console.log('[PIPER] enviando al worker:', text.slice(0, 50));
    const buf = await new Promise(resolve => {
      _pending.set(reqId, resolve);
      _ensureWorker().postMessage({ type: 'speak', text, id: reqId });
    });

    if (myId !== _current || !buf) return false;

    const ctx   = _ctx();
    const audio = await ctx.decodeAudioData(buf);
    if (myId !== _current) return false;

    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = audio;
    src.playbackRate.value = 1.0;
    gain.gain.value = Math.max(0, Math.min(1, volume));
    src.connect(gain);
    gain.connect(ctx.destination);
    _currentSrc = src;
    src.onended = () => { if (_currentSrc === src) _currentSrc = null; };
    src.start();
    if (onStart) onStart();  // texto aparece exactamente aquí
    console.log('[PIPER] reproduciendo ✓', charName);
    return true;

  } catch (e) {
    console.error('[PIPER] error:', e);
    return false;
  }
}

export const isPiperReady   = () => _state === 'ready';
export const isPiperLoading = () => _state === 'loading';
