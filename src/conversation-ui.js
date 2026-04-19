// conversation-ui.js — Input mínimo + globos de diálogo via BubbleUI
import * as Network from './network.js';
import { stopSpeech } from './speech.js';
import { stopTheater } from './aldeano-voice.js';

// ── Género por nombre (termina en 'a' → femenino) ─────────────────────────────
function _isFem(name) { return /a$/i.test((name || '').trim()); }

const MOOD_LABEL = {
  OFFERING:  ['sereno, espiritual',      'serena, espiritual'],
  HOARDING:  ['reservado, introvertido', 'reservada, introvertida'],
  SHARING:   ['abierto, generoso',       'abierta, generosa'],
  CONSUMING: ['cansado, indiferente',    'cansada, indiferente'],
  BAR:       ['suelto, desconfiado',     'suelta, desconfiada'],
};

// Duración de animación de decodificación del globo: ~40ms por palabra
function _estimateDurMs(text) {
  const words = (text || '').trim().split(/\s+/).length;
  return Math.max(2000, Math.min(8000, words * 180));
}

export class ConversationUI {
  constructor(soulSystem) {
    this._souls        = soulSystem || null;
    this._panel        = null;
    this._active       = false;
    this._current      = null;
    this._history      = {};
    this._waiting      = false;
    this._theaterDone  = false;
    this._pendingResp  = null;
    this._playerName   = '?';
    this.onClose       = null;
    this._bubbleUI     = null;   // inyectado desde main.js
    this._buildPanel();
  }

  /** Inyectar referencia al BubbleUI desde main.js */
  setBubbleUI(bui) { this._bubbleUI = bui; }

  // ── Llamar desde onJoined ─────────────────────────────────────────────────
  init() {
    Network.onAldeanoChatResponse(({ response, impulso }) => {
      this._waiting = false;
      if (!this._current) return;
      if (this._theaterDone) {
        this._deliverResponse({ response, impulso });
      } else {
        this._pendingResp = { response, impulso };
      }
    });
  }

  setPlayerName(name) { this._playerName = name; }
  setGameDay(_d) {}
  requestQA(_u, _h) {}

  open(aldeanoData) {
    if (this._active) return;
    this._current     = aldeanoData;
    this._active      = true;
    this._waiting     = false;
    this._theaterDone = false;
    this._pendingResp = null;

    // Mostrar panel de input mínimo
    this._panel.style.display = 'flex';
    this._renderNameTag();
    this._renderInput();
  }

  close() {
    if (!this._active) return;
    const name = this._current?.name;
    this._active      = false;
    this._waiting     = false;
    this._theaterDone = false;
    this._pendingResp = null;
    this._panel.style.display = 'none';
    this._current = null;
    stopTheater();
    stopSpeech();
    this._bubbleUI?.hideAll();
    if (this.onClose) this.onClose(name);
  }

  isOpen() { return this._active; }

  // ── UI: panel mínimo ──────────────────────────────────────────────────────
  _buildPanel() {
    const el = document.createElement('div');
    el.id = 'conv-panel';
    el.style.cssText = `
      display: none;
      position: fixed;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      width: 340px;
      background: rgba(8,5,2,0.82);
      border: 1px solid rgba(180,140,60,0.28);
      border-radius: 6px;
      flex-direction: column;
      z-index: 400;
      font-family: 'Share Tech Mono', monospace;
      color: #e8d4a0;
      padding: 6px 10px 8px;
      gap: 4px;
    `;
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
        <span id="conv-nametag" style="font-size:11px;color:#c8a050;letter-spacing:2px;"></span>
        <span id="conv-close" style="font-size:10px;color:#4a3010;cursor:pointer;padding:2px 6px;letter-spacing:1px;">[ESC]</span>
      </div>
      <div id="conv-input-area"></div>
    `;
    document.body.appendChild(el);
    this._panel = el;
    document.getElementById('conv-close').addEventListener('click', () => this.close());
  }

  _renderNameTag() {
    const fem = _isFem(this._current?.name) ? 1 : 0;
    const mood = MOOD_LABEL[this._current?.intention]?.[fem] || '';
    document.getElementById('conv-nametag').textContent =
      `${this._current?.name || ''}${mood ? '  ·  ' + mood : ''}`;
  }

  _renderInput() {
    const container = document.getElementById('conv-input-area');
    container.innerHTML = '';

    if (this._waiting) {
      const el = document.createElement('div');
      el.style.cssText = 'color:#3a2808;font-size:11px;text-align:center;padding:6px 0;letter-spacing:3px;';
      el.textContent = '· · ·';
      container.appendChild(el);
      return;
    }

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;';

    const prompt = document.createElement('span');
    prompt.style.cssText = 'color:#c8a050;font-size:13px;flex-shrink:0;';
    prompt.textContent = '›';

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 140;
    input.placeholder = 'decirle algo...';
    input.style.cssText = `
      background: none;
      border: none;
      border-bottom: 1px solid rgba(180,140,60,0.25);
      color: #e8d4a0;
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
      width: 100%;
      outline: none;
      padding: 2px 0;
      caret-color: #c8a050;
      letter-spacing: 0.5px;
    `;

    const send = () => {
      const msg = input.value.trim();
      if (msg && !this._waiting) this._sendCustom(msg);
    };
    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.code === 'Enter') send();
    });

    row.appendChild(prompt);
    row.appendChild(input);
    container.appendChild(row);
    setTimeout(() => input.focus(), 30);
  }

  // ── Enviar mensaje del jugador ──────────────────────────────────────────��─
  _sendCustom(message) {
    if (this._waiting) return;
    this._waiting     = true;
    this._theaterDone = true;   // sin fases de audio — listo para responder
    this._pendingResp = null;

    const a = this._current;
    (this._history[a.name] = this._history[a.name] || [])
      .push({ from: 'player', text: message });

    this._renderInput(); // muestra "· · ·"

    // Mostrar mensaje del jugador en su globo brevemente
    this._bubbleUI?.showPlayerAlien(message);
    this._bubbleUI?.hidePlayerBubble(1200);

    Network.sendAldeanoChat({
      name:        a.name,
      message,
      playerName:  this._playerName,
      cuadrante:   a.cuadrante,
      trayectoria: a.trayectoria,
      energia:     a.energia,
      recursos:    a.recursos,
      vecinos:     a.vecinos,
      historial:   (this._history[a.name] || []).slice(-6),
    });

    // Timeout de seguridad: 30s
    setTimeout(() => {
      if (!this._waiting) return;
      this._waiting = false;
      stopTheater();
      this._bubbleUI?.hideAll();
      this._renderInput();
    }, 30000);
  }

  // ── Entregar respuesta del aldeano ───────────────────────���────────────────
  _deliverResponse({ response, impulso }) {
    if (!this._current) return;
    const name = this._current.name;

    stopTheater();

    if (impulso && this._souls && (Math.abs(impulso.ix) > 0.1 || Math.abs(impulso.iy) > 0.1)) {
      this._souls.setPlayerGuardian(name, impulso.ix, impulso.iy, this._playerName, 10);
    }

    // Mostrar respuesta como texto directamente, sin audio
    if (this._current?.name === name) {
      const durMs = _estimateDurMs(response);
      this._bubbleUI?.showNpcDecipher(response, durMs);
    }

    // Rehabilitar input inmediatamente
    this._renderInput();
  }
}
