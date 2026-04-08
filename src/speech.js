// ── Voz robótica usando Web Speech API (nativa del browser, sin API key) ──────
// Uso: import { speakNpc, speakGm } from './speech.js'

let _voiceES   = null;
let _voiceInit = false;

function _initVoice() {
  if (_voiceInit) return;
  _voiceInit = true;
  const tryLoad = () => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;                       // no cargadas aún
    // Preferencia: español latinoamericano → español genérico → cualquiera
    _voiceES =
      voices.find(v => v.lang === 'es-AR') ||
      voices.find(v => v.lang === 'es-MX') ||
      voices.find(v => v.lang.startsWith('es'))  ||
      voices[0];
    console.log(`[SPEECH] Voz: ${_voiceES?.name} (${_voiceES?.lang})`);
  };
  speechSynthesis.onvoiceschanged = tryLoad;
  tryLoad();
}

_initVoice();

/**
 * Habla un texto como NPC.
 * @param {string} text
 * @param {{ pitch?: number, rate?: number, volume?: number }} opts
 */
export function speakNpc(text, opts = {}) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();                            // corta cualquier cosa que esté diciendo
  const utt      = new SpeechSynthesisUtterance(text);
  utt.voice      = _voiceES;
  utt.lang       = _voiceES?.lang || 'es-AR';
  utt.pitch      = opts.pitch  ?? 0.6;                // voz grave y ronca
  utt.rate       = opts.rate   ?? 0.82;               // lento = siniestro
  utt.volume     = opts.volume ?? 1.0;
  speechSynthesis.speak(utt);
}

/**
 * Habla el texto del Game Master (narrador).
 * Voz diferente: más lenta, más grave.
 */
export function speakGm(text) {
  speakNpc(text, { pitch: 0.4, rate: 0.72, volume: 0.85 });
}

/** Cortar cualquier voz que esté hablando */
export function stopSpeech() {
  if (window.speechSynthesis) speechSynthesis.cancel();
}
