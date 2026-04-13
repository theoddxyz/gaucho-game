// conversation-ui.js — Sistema de conversación con aldeanos
// Los listeners de socket se registran en init() (después de connect),
// no en el constructor, para evitar crash con socket=null.
import * as Network from './network.js';

const NAMES_BY_ID = ['Ramón', 'Ofelia', 'Facundo', 'Celestino', 'Zulma'];

const MOOD_LABEL = {
  OFFERING:  'sereno, espiritual',
  HOARDING:  'reservado, introvertido',
  SHARING:   'abierto, generoso',
  CONSUMING: 'cansado, indiferente',
  BAR:       'suelto, desconfiado',
};

export class ConversationUI {
  constructor() {
    this._panel          = null;
    this._active         = false;
    this._current        = null;
    this._qaCache        = {};   // name → [{q,a}]
    this._history        = {};   // name → [{from,text}]  (sesión)
    this._customUsed     = {};   // name → gameDay
    this._currentGameDay = 1;
    this._waiting        = false;
    this.onClose         = null;
    this._buildPanel();
    // ⚠️ NO registrar socket listeners aquí — llamar init() después de connect()
  }

  // Llamar desde onJoined (socket ya conectado)
  init() {
    Network.onAldeanoQAReady((data) => {
      for (const [id, qa] of Object.entries(data)) {
        const idx  = parseInt(id.split('-')[1]);
        const name = NAMES_BY_ID[idx];
        if (name && Array.isArray(qa)) this._qaCache[name] = qa;
      }
      if (this._active) this._renderQuestions();
    });

    Network.onAldeanoChatResponse(({ response }) => {
      this._waiting = false;
      if (!this._current) return;
      const name = this._current.name;
      (this._history[name] = this._history[name] || []).push({ from: 'npc', text: response });
      this._renderHistory();
      this._renderQuestions();
    });
  }

  setGameDay(day) {
    if (day !== this._currentGameDay) {
      this._currentGameDay = day;
      this._customUsed = {};
    }
  }

  requestQA(contextUnits, hora) {
    const payload = contextUnits.map(u => ({
      id:          u.id,
      name:        u.name,
      cuadrante:   u.cuadrante,
      trayectoria: u.trayectoria,
      energia:     u.energia,
      recursos:    u.recursos,
      hora:        hora ?? 12,
      vecinos:     contextUnits
                     .filter(v => v.id !== u.id)
                     .map(v => `${v.name} (${v.cuadrante}, ${v.trayectoria})`)
                     .join(', '),
    }));
    Network.sendGenerateAldeanoQA(payload);
  }

  open(aldeanoData) {
    if (this._active) return;
    this._current = aldeanoData;
    this._active  = true;
    this._waiting = false;
    this._panel.style.display = 'flex';
    this._renderHeader();
    this._renderHistory();
    this._renderQuestions();
  }

  close() {
    if (!this._active) return;
    const name = this._current?.name;
    this._active  = false;
    this._waiting = false;
    this._panel.style.display = 'none';
    this._current = null;
    if (this.onClose) this.onClose(name);
  }

  isOpen() { return this._active; }

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
      <div id="conv-questions" style="padding:8px 16px 14px;display:flex;flex-direction:column;gap:6px;"></div>
    `;
    document.body.appendChild(el);
    this._panel = el;
    document.getElementById('conv-close').addEventListener('click', () => this.close());
  }

  _renderHeader() {
    document.getElementById('conv-name').textContent = this._current.name;
    document.getElementById('conv-mood').textContent = MOOD_LABEL[this._current.intention] || '';
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
        ? `<div style="color:#a08040;margin:2px 0;">Vos: <em>"${_esc(h.text)}"</em></div>`
        : `<div style="color:#e8d4a0;margin:2px 0;">${_esc(this._current.name)}: "${_esc(h.text)}"</div>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  _renderQuestions() {
    const container = document.getElementById('conv-questions');
    container.innerHTML = '';
    const qa = this._qaCache[this._current.name];

    if (!qa) {
      container.innerHTML = `<div style="color:#4a3018;font-size:12px;text-align:center;padding:6px 0;">preparando...</div>`;
      return;
    }

    for (const pair of qa) {
      const btn = _mkBtn(pair.q, false);
      btn.addEventListener('click', () => {
        if (this._waiting) return;
        const name = this._current.name;
        (this._history[name] = this._history[name] || []).push({ from: 'player', text: pair.q });
        this._history[name].push({ from: 'npc', text: pair.a });
        this._renderHistory();
        this._renderQuestions();
      });
      container.appendChild(btn);
    }

    const usedToday = this._customUsed[this._current.name] === this._currentGameDay;
    const customBtn = _mkBtn(usedToday ? '(ya le dijiste algo hoy)' : 'Decirle algo...', usedToday);
    if (!usedToday) customBtn.addEventListener('click', () => this._openCustomInput());
    container.appendChild(customBtn);
  }

  _openCustomInput() {
    const container = document.getElementById('conv-questions');
    container.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text'; input.maxLength = 140; input.placeholder = 'Escribí algo...';
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

  _sendCustom(message) {
    if (this._waiting) return;
    this._waiting = true;
    const a = this._current;
    this._customUsed[a.name] = this._currentGameDay;
    (this._history[a.name] = this._history[a.name] || []).push({ from: 'player', text: message });
    this._renderHistory();
    document.getElementById('conv-questions').innerHTML =
      `<div style="color:#4a3018;font-size:12px;text-align:center;padding:8px 0;">...</div>`;
    Network.sendAldeanoChat({
      name: a.name, message,
      cuadrante: a.cuadrante, trayectoria: a.trayectoria,
      energia: a.energia, recursos: a.recursos, vecinos: a.vecinos,
      historial: (this._history[a.name] || []).slice(-6),
    });

    // Timeout de seguridad: si en 12s no llega respuesta, desbloquear
    setTimeout(() => {
      if (!this._waiting) return;
      this._waiting = false;
      if (this._current) {
        (this._history[this._current.name] = this._history[this._current.name] || [])
          .push({ from: 'npc', text: '...' });
        this._renderHistory();
        this._renderQuestions();
      }
    }, 12000);
  }
}

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
