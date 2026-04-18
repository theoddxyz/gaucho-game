// piper-worker.js — Piper TTS en Web Worker
// La síntesis ONNX/WASM corre aquí para no bloquear el hilo principal.
import * as tts from '@mintplex-labs/piper-tts-web';
import { TtsSession } from '@mintplex-labs/piper-tts-web';

const VOICE_ID  = 'es_AR-daniela-high';
const RHASSPY   = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';
const ONNX_PATH = 'es/es_AR/daniela/high/es_AR-daniela-high.onnx';

tts.PATH_MAP[VOICE_ID] = ONNX_PATH;
TtsSession.WASM_LOCATIONS.onnxWasm = '/ort/';

// ── OPFS helpers ──────────────────────────────────────────────────────────────
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

// ── Descarga daniela ──────────────────────────────────────────────────────────
async function _download() {
  const onnxFile = ONNX_PATH.split('/').at(-1);
  const jsonFile = onnxFile + '.json';
  const [hasOnnx, hasJson] = await Promise.all([_opfsExists(onnxFile), _opfsExists(jsonFile)]);

  if (hasOnnx && hasJson) {
    self.postMessage({ type: 'progress', pct: 100 });
    return;
  }

  if (!hasJson) {
    const r = await fetch(`${RHASSPY}/${ONNX_PATH}.json`);
    if (!r.ok) throw new Error(`JSON ${r.status}`);
    await _opfsWrite(jsonFile, await r.blob());
  }

  if (!hasOnnx) {
    const res = await fetch(`${RHASSPY}/${ONNX_PATH}`);
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
      if (total > 0) self.postMessage({ type: 'progress', pct: Math.round(loaded / total * 100) });
    }
    await _opfsWrite(onnxFile, new Blob(chunks, { type: 'application/octet-stream' }));
  }
}

// ── Mensajes del hilo principal ───────────────────────────────────────────────
self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    try {
      await _download();
      self.postMessage({ type: 'ready' });
    } catch (e) {
      self.postMessage({ type: 'failed', msg: e.message });
    }
  }

  if (data.type === 'speak') {
    try {
      const wav = await tts.predict({ text: data.text, voiceId: VOICE_ID });
      const buf = await wav.arrayBuffer();
      // Transferir el buffer para evitar copia (zero-copy)
      self.postMessage({ type: 'wav', id: data.id, buffer: buf }, [buf]);
    } catch (e) {
      self.postMessage({ type: 'error', id: data.id, msg: e.message });
    }
  }
};
