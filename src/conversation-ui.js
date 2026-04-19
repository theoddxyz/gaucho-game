// conversation-ui.js — Sistema de conversación con aldeanos
import * as Network from './network.js';
import { speakNpc, stopSpeech } from './speech.js';
import { startPhase1, startPhase2, startPhase3, stopTheater, speakAldeanoReal } from './aldeano-voice.js';

// ── Género por nombre (termina en 'a' → femenino) ─────────────────────────────
function _isFem(name) { return /a$/i.test((name || '').trim()); }

const MOOD_LABEL = {
  OFFERING:  ['sereno, espiritual',      'serena, espiritual'],
  HOARDING:  ['reservado, introvertido', 'reservada, introvertida'],
  SHARING:   ['abierto, generoso',       'abierta, generosa'],
  CONSUMING: ['cansado, indiferente',    'cansada, indiferente'],
  BAR:       ['suelto, desconfiado',     'suelta, desconfiada'],
};

export class ConversationUI {
  constructor(soulSystem) {
    this._souls        = soulSystem || null;
    this._panel        = null;
    this._active       = false;
    this._current      = null;
    this._history      = {};    // name → [{from,text}]
    this._waiting      = false;
    this._translating  = false;
    this._theaterDone  = false; // true cuando Phase 1+2 terminaron
    this._pendingResp  = null;  // respuesta del server guardada si el teatro aún no terminó
    this._playerName   = '?';
    this.onClose       = null;
    this._buildPanel();
  }

  // ── Llamar desde onJoined ─────────────────────────────────────────────────────
  init() {
    Network.onAldeanoChatResponse(({ response, impulso }) => {
      this._waiting = false;
      if (!this._current) return;

      if (this._theaterDone) {
        // Teatro ya terminó — entregar respuesta ahora
        this._deliverResponse({ response, impulso });
      } else {
        // Teatro todavía corriendo — guardar y entregar cuando termine
        this._pendingResp = { response, impulso };
      }
    });
  }

  setPlayerName(name) { this._playerName = name; }
  setGameDay(_day) {}
  requestQA(_units, _hora) {}

  open(aldeanoData) {
    if (this._active) return;
    this._current     = aldeanoData;
    this._active      = true;
    this._waiting     = false;
    this._translating = false;
    this._theaterDone = false;
    this._pendingResp = null;
    this._panel.style.display = 'flex';
    this._renderHeader();
    this._renderHistory();
    this._renderInput();
  }

  close() {
    if (!this._active) return;
    const name = this._current?.name;
    this._active      = false;
    this._waiting     = false;
    this._translating = false;
    this._theaterDone = false;
    this._pendingResp = null;
    this._panel.style.display = 'none';
    this._current = null;
    stopTheater();
    stopSpeech();
    if (this.onClose) this.onClose(name);
  }

  isOpen() { return this._active; }

  // ── UI ────────────────────────────────────────────────────────────────────────
  _buildPanel() {
    const el = document.createElement('div');
    el.id = 'conv-panel';
    el.style.cssText = `
      display: none;
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      background: rgba(16,10,4,0.95);
      border: 1px solid rgba(180,140,60,0.45);
      border-radius: 8px;
      flex-direction: column;
      z-index: 400;
      font-family: 'Georgia', serif;
      color: #e8d4a0;
      box-shadow: 0 6px 28px rgba(0,0,0,0.7);
      overflow: hidden;
    `;
    el.innerHTML = `
      <div style="padding:10px 16px 8px; border-bottom:1px solid rgba(180,140,60,0.2);
                  display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span id="conv-name" style="font-size:15px;font-weight:bold;color:#f0c060;"></span>
          <span id="conv-mood" style="font-size:11px;color:#907040;margin-left:8px;font-style:italic;"></span>
        </div>
        <span id="conv-close" style="font-size:11px;color:#604020;cursor:pointer;padding:4px 8px;">[ESC / F]</span>
      </div>
      <div id="conv-history" style="padding:8px 16px 4px;min-height:36px;max-height:150px;
                                     overflow-y:auto;font-size:13px;line-height:1.55;"></div>
      <div id="conv-input-area" style="padding:8px 16px 14px;display:flex;flex-direction:column;gap:6px;"></div>
    `;
    document.body.appendChild(el);
    this._panel = el;
    document.getElementById('conv-close').addEventListener('click', () => this.close());
  }

  _renderHeader() {
    document.getElementById('conv-name').textContent = this._current.name;
    const fem = _isFem(this._current.name) ? 1 : 0;
    document.getElementById('conv-mood').textContent =
      MOOD_LABEL[this._current.intention]?.[fem] || '';
  }

  _renderHistory() {
    const hist = (this._history[this._current.name] || []).slice(-6);
    const el   = document.getElementById('conv-history');
    if (!hist.length) {
      el.innerHTML = `<span style="color:#4a3018;font-style:italic;font-size:12px;">— se da vuelta a mirarte —</span>`;
      return;
    }
    el.innerHTML = hist.map(h =>
      h.from === 'player'
        ? `<div style="color:#a08040;margin:2px 0;">${_esc(this._playerName)}: <em>"${_esc(h.text)}"</em></div>`
        : `<div style="color:#e8d4a0;margin:2px 0;">${_esc(this._current.name)}: "${_esc(h.text)}"</div>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  _renderInput() {
    const container = document.getElementById('conv-input-area');
    container.innerHTML = '';

    if (this._waiting) {
      const el = document.createElement('div');
      el.style.cssText = 'color:#4a3018;font-size:12px;text-align:center;padding:10px 0;letter-spacing:3px;';
      el.textContent = 'pensando...';
      container.appendChild(el);
      return;
    }

    if (this._translating) {
      const el = document.createElement('div');
      el.style.cssText = 'color:#3a4a18;font-size:11px;text-align:center;padding:10px 0;letter-spacing:3px;font-style:italic;';
      el.textContent = 'traduciendo...';
      container.appendChild(el);
      return;
    }

    const input = document.createElement('input');
    input.type = 'text'; input.maxLength = 140; input.placeholder = 'Decirle algo...';
    input.style.cssText = `
      background:rgba(30,18,8,0.9); border:1px solid rgba(180,140,60,0.4);
      color:#e8d4a0; padding:7px 10px; border-radius:4px;
      font-family:'Georgia',serif; font-size:13px; width:100%; box-sizing:border-box; outline:none;
    `;
    const sendBtn = _mkBtn('Mandar', false, 'background:rgba(90,55,18,0.8);margin-top:4px;');

    const send = () => {
      const msg = input.value.trim();
      if (msg && !this._waiting) this._sendCustom(msg);
    };
    input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.code === 'Enter') send(); });
    sendBtn.addEventListener('click', send);

    container.appendChild(input);
    container.appendChild(sendBtn);
    setTimeout(() => input.focus(), 30);
  }

  // ── Enviar mensaje del jugador ────────────────────────────────────────────────
  _sendCustom(message) {
    if (this._waiting) return;
    this._waiting     = true;
    this._theaterDone = false;
    this._pendingResp = null;

    const a  = this._current;
    const ix = a.ix ?? 0;
    const iy = a.iy ?? 0;

    // Guardar mensaje del usuario en historial — NO renderizar todavía
    // (aparecerá cuando llegue la respuesta del aldeano)
    (this._history[a.name] = this._history[a.name] || []).push({ from: 'player', text: message });

    this._renderInput(); // muestra "pensando..."

    // Enviar al servidor inmediatamente
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

    // Teatro: Fase 1 → Fase 2 siempre corren (independiente de cuándo llegue la respuesta)
    // Fase 3 solo arranca si todavía esperamos al terminar Fase 2
    startPhase1(() => {
      startPhase2(message, ix, iy, () => {
        this._theaterDone = true;
        if (this._pendingResp) {
          // La respuesta ya llegó mientras corría el teatro — entregarla ahora
          const data = this._pendingResp;
          this._pendingResp = null;
          this._deliverResponse(data);
        } else if (this._waiting) {
          // Todavía esperando — arrancar loop de pensamiento
          startPhase3(ix, iy);
        }
      });
    });

    // Timeout de seguridad: 35s
    setTimeout(() => {
      if (!this._waiting) return;
      this._waiting     = false;
      this._theaterDone = true;
      stopTheater();
      if (this._current) {
        (this._history[this._current.name] = this._history[this._current.name] || [])
          .push({ from: 'npc', text: '...' });
        this._renderHistory();
        this._renderInput();
      }
    }, 35000);
  }

  // ── Entregar respuesta del aldeano ────────────────────────────────────────────
  // Se llama cuando el teatro terminó Y la respuesta ya llegó del servidor
  _deliverResponse({ response, impulso }) {
    if (!this._current) return;
    const name    = this._current.name;
    const ix      = this._current.ix    ?? 0;
    const iy      = this._current.iy    ?? 0;
    const energia = this._current.energia ?? 100;

    // Cortar Fase 3 si estaba corriendo
    stopTheater();

    // Impulso metafísico
    if (impulso && this._souls && (Math.abs(impulso.ix) > 0.1 || Math.abs(impulso.iy) > 0.1)) {
      this._souls.setPlayerGuardian(name, impulso.ix, impulso.iy, this._playerName, 10);
    }

    // Ahora sí renderizar el mensaje del usuario (lleva el "tiempo de procesamiento")
    this._translating = true;
    this._renderHistory(); // muestra el mensaje del jugador por primera vez
    this._renderInput();   // muestra "traduciendo..."

    // La respuesta del NPC aparece exactamente cuando Daniela arranca (onStart)
    let _shown = false;
    const showText = () => {
      if (_shown) return;
      _shown = true;
      this._translating = false;
      if (this._current?.name === name) {
        (this._history[name] = this._history[name] || []).push({ from: 'npc', text: response });
        this._renderHistory();
        this._renderInput();
      }
      // Voz real del aldeano arranca casi simultánea con Daniela
      speakAldeanoReal(response, ix, iy, energia);
    };

    // Fallback: si Piper tarda más de 20s, mostrar texto igual
    setTimeout(showText, 20000);

    // Texto + voz real aparecen cuando Daniela arranca
    speakNpc(response, { charName: name, onStart: showText });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function _esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _mkBtn(text, disabled, extraStyle = '') {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.disabled    = disabled;
  btn.style.cssText = `
    background:${disabled ? 'transparent' : 'rgba(70,44,16,0.55)'};
    border:1px solid rgba(180,140,60,${disabled ? '0.1' : '0.3'});
    color:${disabled ? '#3a2810' : '#e8d4a0'};
    padding:6px 12px; border-radius:4px;
    font-family:'Georgia',serif; font-size:12px;
    cursor:${disabled ? 'default' : 'pointer'};
    text-align:left; width:100%; ${extraStyle}
  `;
  if (!disabled) {
    btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(100,65,25,0.75)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(70,44,16,0.55)'; });
  }
  return btn;
}
