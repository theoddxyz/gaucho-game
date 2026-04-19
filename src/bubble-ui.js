// bubble-ui.js — Globos de diálogo flotantes anclados a personajes (world→screen)
import * as THREE from 'three';

// ── Charset alien (rúnico + tifinagh + bamum mezclado para look extraterrestre) ─
const _AC = 'ᚠᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛌᛍᛎᛏᛐᛑᛒᛓ' +
            'ⵙⵘⵗⵑⵐⵏⵎⵍⵌⵋⵊⵉⵈⵇⵆⵅⵄⵃⵂⵁ' +
            'ꖔꗃꖬꔆꕿꖄꗓꔷꕎꗋꖨꔸ';

function _rndAlien() {
  return _AC[Math.floor(Math.random() * _AC.length)];
}

function _toAlien(text) {
  return text.split('').map(c => {
    if (c === ' ') return ' ';
    if (/[.,!?;:\-"']/.test(c)) return c;
    return _rndAlien();
  }).join('');
}

function _esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Crear un globo DOM ────────────────────────────────────────────────────────
function _makeBubbleEl(tailDir = 'down') {
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    position: fixed;
    z-index: 350;
    pointer-events: none;
    transform: translate(-50%, -100%);
    display: none;
    filter: drop-shadow(2px 3px 0px rgba(0,0,0,0.55));
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: #fff;
    color: #111;
    border: 2.5px solid #111;
    border-radius: 14px;
    padding: 6px 10px;
    max-width: 260px;
    min-width: 80px;
    max-height: 80px;
    overflow: hidden;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    line-height: 1.35;
    word-break: break-word;
    white-space: normal;
    text-align: center;
  `;

  // Cola del globo (triángulo apuntando hacia el personaje)
  const tail = document.createElement('div');
  tail.style.cssText = `
    width: 0; height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 11px solid #111;
    margin: 0 auto;
    position: relative;
  `;
  // Relleno blanco de la cola (encima del borde)
  const tailIn = document.createElement('div');
  tailIn.style.cssText = `
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #fff;
    position: absolute;
    top: -11px;
    left: -6px;
  `;
  tail.appendChild(tailIn);

  wrap.appendChild(box);
  wrap.appendChild(tail);
  document.body.appendChild(wrap);
  return { wrap, box, tail };
}

// ─────────────────────────────────────────────────────────────────────────────
export class BubbleUI {
  constructor() {
    this._player = _makeBubbleEl('down');
    this._npc    = _makeBubbleEl('down');
    this._decipherTimer  = null;
    this._hidePlayerTimer = null;
    this._hideNpcTimer    = null;
    this._v3 = new THREE.Vector3();

    // posiciones world actuales (se actualizan cada frame desde main.js)
    this._playerWorldPos = null;
    this._npcWorldPos    = null;
  }

  // ── Llamar cada frame desde el loop de main.js ────────────────────────────
  update(playerPos, npcPos, camera) {
    const W = window.innerWidth, H = window.innerHeight;
    this._playerWorldPos = playerPos || null;
    this._npcWorldPos    = npcPos    || null;

    if (playerPos && this._player.wrap.style.display !== 'none') {
      this._v3.set(playerPos.x, (playerPos.y ?? 0) + 2.6, playerPos.z);
      this._v3.project(camera);
      if (this._v3.z < 1) {
        const sx = ( this._v3.x * 0.5 + 0.5) * W;
        const sy = (-this._v3.y * 0.5 + 0.5) * H;
        this._player.wrap.style.left = `${sx}px`;
        this._player.wrap.style.top  = `${sy - 6}px`;
      }
    }

    if (npcPos && this._npc.wrap.style.display !== 'none') {
      this._v3.set(npcPos.x, (npcPos.y ?? 0) + 3.2, npcPos.z);
      this._v3.project(camera);
      if (this._v3.z < 1) {
        const sx = ( this._v3.x * 0.5 + 0.5) * W;
        const sy = (-this._v3.y * 0.5 + 0.5) * H;
        this._npc.wrap.style.left = `${sx}px`;
        this._npc.wrap.style.top  = `${sy - 6}px`;
      }
    }
  }

  // ── Globo del jugador: PIPIP (procesando) ────────────────────────────────
  showBeep() {
    clearTimeout(this._hidePlayerTimer);
    this._player.box.innerHTML =
      `<span style="letter-spacing:3px;font-weight:bold;color:#333">` +
      `◈ P I P I P ◈<br>◈ P I P I P ◈<br>◈ P I P ◈</span>`;
    this._player.wrap.style.display = 'block';
  }

  // ── Globo del jugador: texto alien (traductor transmitiendo) ─────────────
  showPlayerAlien(originalText) {
    clearTimeout(this._hidePlayerTimer);
    const alien = _toAlien(originalText);
    this._player.box.innerHTML =
      `<span style="color:#444;font-style:italic;letter-spacing:1px">${_esc(alien)}</span>`;
    this._player.wrap.style.display = 'block';
  }

  hidePlayerBubble(delayMs = 0) {
    clearTimeout(this._hidePlayerTimer);
    if (delayMs > 0) {
      this._hidePlayerTimer = setTimeout(() => {
        this._player.wrap.style.display = 'none';
      }, delayMs);
    } else {
      this._player.wrap.style.display = 'none';
    }
  }

  // ── Globo del NPC: muestra alien y va descifrando a español ──────────────
  // durationMs = duración estimada del audio Piper (para repartir el timing)
  showNpcDecipher(spanishText, durationMs = 4000) {
    clearInterval(this._decipherTimer);
    clearTimeout(this._hideNpcTimer);

    const words    = spanishText.trim().split(/\s+/);
    const alienArr = words.map(w => _toAlien(w));
    let   revealed = 0;

    const render = () => {
      const parts = words.map((w, i) => {
        if (i < revealed) {
          return `<span style="color:#111">${_esc(w)}</span>`;
        } else {
          return `<span style="color:#888;font-style:italic">${_esc(alienArr[i])}</span>`;
        }
      });
      this._npc.box.innerHTML = parts.join(' ');
    };

    render();
    this._npc.wrap.style.display = 'block';

    // Revelar palabras gradualmente durante la duración del audio
    const stepMs = Math.max(180, Math.min(600, durationMs / (words.length + 1)));
    this._decipherTimer = setInterval(() => {
      revealed++;
      render();
      if (revealed >= words.length) {
        clearInterval(this._decipherTimer);
        // Auto-ocultar 6s después de terminar
        this._hideNpcTimer = setTimeout(() => {
          this._npc.wrap.style.display = 'none';
        }, 6000);
      }
    }, stepMs);
  }

  // ── Mostrar NPC bubble solo con alien (antes de que empiece a hablar) ─────
  showNpcAlien(spanishText) {
    clearInterval(this._decipherTimer);
    clearTimeout(this._hideNpcTimer);
    const alien = _toAlien(spanishText);
    this._npc.box.innerHTML =
      `<span style="color:#888;font-style:italic">${_esc(alien)}</span>`;
    this._npc.wrap.style.display = 'block';
  }

  hideNpcBubble(delayMs = 0) {
    clearInterval(this._decipherTimer);
    clearTimeout(this._hideNpcTimer);
    if (delayMs > 0) {
      this._hideNpcTimer = setTimeout(() => {
        this._npc.wrap.style.display = 'none';
      }, delayMs);
    } else {
      this._npc.wrap.style.display = 'none';
    }
  }

  // ── Ocultar todo ─────────────────────────────────────────────────────────
  hideAll() {
    this.hidePlayerBubble();
    this.hideNpcBubble();
  }
}
