// piper-tts.js — Piper TTS con voz es_AR-daniela-high
// El paquete @mintplex-labs/piper-tts-web no incluye es_AR en su lista,
// pero sí soporta voces personalizadas si las pre-cargamos en OPFS
// con la misma estructura que usa internamente.

import * as tts from '@mintplex-labs/piper-tts-web';
import { TtsSession } from '@mintplex-labs/piper-tts-web';

const VOICE_ID  = 'es_AR-daniela-high';
const RHASSPY   = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';
const ONNX_PATH = 'es/es_AR/daniela/high/es_AR-daniela-high.onnx';

// Parchear PATH_MAP para que el paquete sepa la ruta de daniela
tts.PATH_MAP[VOICE_ID] = ONNX_PATH;

// El paquete apunta a cdnjs 1.18.0 que no tiene ort-wasm-simd-threaded.jsep.mjs
// → servir los archivos WASM localmente desde /ort/ (mismo origen, sin CORS)
TtsSession.WASM_LOCATIONS.onnxWasm = '/ort/';

// Voz unificada — "el traductor interplanetario", misma velocidad para todos

let _state = 'idle';  // 'idle' | 'loading' | 'ready' | 'failed'

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

// ── OPFS helpers (replica exacta de la estructura interna del paquete) ─────────
async function _opfsWrite(filename, blob) {
  const root = await navigator.storage.getDirectory();
  const dir  = await root.getDirectoryHandle('piper', { create: true });
  const file = await dir.getFileHandle(filename, { create: true });
  const wr   = await file.createWritable();
  await wr.write(blob);
  await wr.close();
}

async function _opfsExists(filename) {
  try {
    const root = await navigator.storage.getDirectory();
    const dir  = await root.getDirectoryHandle('piper', { create: false });
    await dir.getFileHandle(filename, { create: false });
    return true;
  } catch (_) { return false; }
}

// ── Descarga daniela desde rhasspy → guarda en OPFS ───────────────────────────
async function _downloadDaniela(onProgress) {
  const onnxFile = ONNX_PATH.split('/').at(-1);          // es_AR-daniela-high.onnx
  const jsonFile = onnxFile + '.json';

  // Verificar si ya está cacheada
  const [hasOnnx, hasJson] = await Promise.all([
    _opfsExists(onnxFile),
    _opfsExists(jsonFile),
  ]);

  if (hasOnnx && hasJson) {
    console.log('[PIPER] daniela ya cacheada ✓');
    return;
  }

  // Descargar .onnx (114 MB) con progreso
  console.log('[PIPER] descargando daniela desde rhasspy...');
  const onnxUrl = `${RHASSPY}/${ONNX_PATH}`;
  const jsonUrl = `${RHASSPY}/${ONNX_PATH}.json`;

  // Descargar JSON (pequeño, sin progreso)
  if (!hasJson) {
    const jRes  = await fetch(jsonUrl);
    if (!jRes.ok) throw new Error(`JSON ${jRes.status}`);
    await _opfsWrite(jsonFile, await jRes.blob());
    console.log('[PIPER] config descargada');
  }

  // Descargar ONNX con progreso
  if (!hasOnnx) {
    const res = await fetch(onnxUrl);
    if (!res.ok) throw new Error(`ONNX ${res.status}`);

    const total  = parseInt(res.headers.get('content-length') || '0');
    const reader = res.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (total > 0 && onProgress) {
        onProgress(Math.round(loaded / total * 100));
        _badge_set(`daniela: ${Math.round(loaded / total * 100)}%`);
      }
    }

    const blob = new Blob(chunks, { type: 'application/octet-stream' });
    await _opfsWrite(onnxFile, blob);
    console.log('[PIPER] ONNX descargado y guardado ✓');
  }
}

// ── Init público ──────────────────────────────────────────────────────────────
export async function initPiper(onProgress) {
  if (_state !== 'idle') return;
  _state = 'loading';
  _badge_set('daniela: 0%');
  try {
    await _downloadDaniela(onProgress);
    _state = 'ready';
    _badge_set(null);
    console.log('[PIPER] daniela lista ✓');
  } catch (e) {
    _state = 'failed';
    _badge_set(null);
    console.error('[PIPER] fallo descargando daniela:', e);
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
let _src  = null;
let _busy = false;

function _stop() {
  try { _src?.stop(); } catch (_) {}
  _src  = null;
  _busy = false;
}

export function cancelPiper() { _stop(); }

export async function speakPiper(text, charName = 'GM', volume = 1.0, onStart = null) {
  // Esperar descarga si está en progreso
  if (_state === 'loading') {
    await new Promise(r => {
      const iv = setInterval(() => {
        if (_state !== 'loading') { clearInterval(iv); r(); }
      }, 400);
    });
  }
  if (_state !== 'ready') return false;

  _stop();
  _busy = true;

  try {
    console.log('[PIPER] sintetizando:', text.slice(0, 50));
    const wav = await tts.predict({ text, voiceId: VOICE_ID });
    if (!_busy) return false;

    const ctx  = _ctx();
    const buf  = await ctx.decodeAudioData(await wav.arrayBuffer());
    if (!_busy) return false;

    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = 1.0;
    gain.gain.value = Math.max(0, Math.min(1, volume));
    src.connect(gain);
    gain.connect(ctx.destination);
    _src = src;
    src.onended = () => { if (_src === src) { _src = null; _busy = false; } };
    src.start();
    if (onStart) onStart();   // texto aparece exactamente cuando arranca el audio
    console.log('[PIPER] reproduciendo ✓', charName);
    return true;
  } catch (e) {
    _busy = false;
    console.error('[PIPER] error:', e);
    return false;
  }
}

export const isPiperReady   = () => _state === 'ready';
export const isPiperLoading = () => _state === 'loading';
