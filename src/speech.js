// speech.js — Voz de NPCs
// Usa Piper TTS (es_AR-daniela) cuando está lista, Web Speech API como fallback

import { speakPiper, cancelPiper, isPiperReady, isPiperLoading, initPiper } from './piper-tts.js';

// ── Arrancar descarga de daniela en cuanto el módulo se importa ───────────────
initPiper((pct) => {
  console.log(`[PIPER] daniela: ${pct}%`);
});

// ── Web Speech API fallback ───────────────────────────────────────────────────
let _voiceES   = null;
let _voiceInit = false;

function _initVoice() {
  if (_voiceInit) return;
  _voiceInit = true;
  const tryLoad = () => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    _voiceES =
      voices.find(v => v.lang === 'es-AR') ||
      voices.find(v => v.lang === 'es-MX') ||
      voices.find(v => v.lang.startsWith('es')) ||
      voices[0];
  };
  speechSynthesis.onvoiceschanged = tryLoad;
  tryLoad();
}

_initVoice();

function _speakFallback(text, opts = {}) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utt   = new SpeechSynthesisUtterance(text);
  utt.voice   = _voiceES;
  utt.lang    = _voiceES?.lang || 'es-AR';
  utt.pitch   = opts.pitch  ?? 0.6;
  utt.rate    = opts.rate   ?? 0.82;
  utt.volume  = opts.volume ?? 1.0;
  speechSynthesis.speak(utt);
}

// ── API pública ───────────────────────────────────────────────────────────────

/**
 * Habla texto como NPC.
 * @param {string} text
 * @param {{ charName?: string, pitch?: number, rate?: number, volume?: number }} opts
 */
export function speakNpc(text, opts = {}) {
  const charName = opts.charName || 'GM';
  if (isPiperReady() || isPiperLoading()) {
    cancelPiper();
    speakPiper(text, charName, opts.volume ?? 1.0);
  } else {
    _speakFallback(text, opts);
  }
}

/**
 * Habla el texto del Game Master / narrador.
 */
export function speakGm(text) {
  if (isPiperReady() || isPiperLoading()) {
    cancelPiper();
    speakPiper(text, 'GM', 0.85);
  } else {
    _speakFallback(text, { pitch: 0.4, rate: 0.72, volume: 0.85 });
  }
}

/** Cortar cualquier voz */
export function stopSpeech() {
  cancelPiper();
  if (window.speechSynthesis) speechSynthesis.cancel();
}
