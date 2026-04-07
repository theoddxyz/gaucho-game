// --- HUD & UI Manager ---

const $ = (id) => document.getElementById(id);

const els = {
  lobby: $('lobby'),
  nameInput: $('name-input'),
  playBtn: $('play-btn'),
  crosshair: $('crosshair'),
  hud: $('hud'),
  hpBar: $('hp-bar'),
  hpText: $('hp-text'),
  score: $('score'),
  killfeed: $('killfeed'),
  roomLink: $('room-link'),
  hitmarker: $('hitmarker'),
  damageOverlay: $('damage-overlay'),
  deathScreen: $('death-screen'),
  playersCount: $('players-count'),
};

export function showLobby() {
  els.lobby.style.display = 'flex';
  hideGame();
}

export function hideLobby() {
  els.lobby.style.display = 'none';
}

export function moveCrosshair(x, y) {
  if (!els.crosshair) return;
  els.crosshair.style.left = x + 'px';
  els.crosshair.style.top  = y + 'px';
}

export function showGame() {
  els.crosshair.style.display = 'block';
  document.body.classList.add('game-active');
  els.hud.style.display = 'block';
  els.score.style.display = 'block';
  els.killfeed.style.display = 'block';
  els.roomLink.style.display = 'block';
  els.playersCount.style.display = 'block';
}

function hideGame() {
  els.crosshair.style.display = 'none';
  els.hud.style.display = 'none';
  els.score.style.display = 'none';
  els.killfeed.style.display = 'none';
  els.roomLink.style.display = 'none';
  els.playersCount.style.display = 'none';
}

export function updateHP(hp) {
  const pct = Math.max(0, hp);
  els.hpBar.style.width = pct + '%';
  els.hpText.textContent = pct + ' HP';
  if (pct > 60) els.hpBar.style.background = '#44ff44';
  else if (pct > 30) els.hpBar.style.background = '#ffaa00';
  else els.hpBar.style.background = '#ff4444';
}

export function updateScore(kills, deaths) {
  els.score.innerHTML = `Kills: <b>${kills}</b><br>Deaths: <b>${deaths}</b>`;
}

export function setRoomLink(roomId) {
  const url = `${location.origin}?room=${roomId}`;
  els.roomLink.textContent = `Room: ${roomId} (click para copiar link)`;
  els.roomLink.onclick = () => {
    navigator.clipboard.writeText(url);
    els.roomLink.textContent = 'Link copiado!';
    setTimeout(() => {
      els.roomLink.textContent = `Room: ${roomId} (click para copiar link)`;
    }, 2000);
  };
}

export function addKillMessage(killerName, victimName) {
  const msg = document.createElement('div');
  msg.className = 'kill-msg';
  msg.innerHTML = `<b>${killerName}</b> mato a <b>${victimName}</b>`;
  els.killfeed.appendChild(msg);
  setTimeout(() => msg.remove(), 4500);
}

export function showHitmarker() {
  els.hitmarker.style.display = 'block';
  setTimeout(() => { els.hitmarker.style.display = 'none'; }, 200);
}

export function showDamageFlash() {
  els.damageOverlay.style.opacity = '1';
  setTimeout(() => { els.damageOverlay.style.opacity = '0'; }, 300);
}

export function showDeathScreen() {
  els.deathScreen.style.display = 'flex';
}

export function hideDeathScreen() {
  els.deathScreen.style.display = 'none';
}

export function updatePlayersCount(count) {
  els.playersCount.textContent = `${count} jugador${count !== 1 ? 'es' : ''} online`;
}

export function getNameInput() {
  return els.nameInput.value.trim();
}

export function onPlay(callback) {
  els.playBtn.addEventListener('click', callback);
  els.nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') callback();
  });
}

// --- Coords display ---
let coordsEl = null;
let lastCoords = { x: 0, z: 0 };

export function initCoords() {
  coordsEl = document.createElement('div');
  coordsEl.style.cssText = `
    position: fixed; bottom: 60px; left: 20px; z-index: 100;
    display: none; background: rgba(0,0,0,0.55);
    padding: 5px 12px; border-radius: 6px; font-size: 12px;
    font-family: monospace; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.15);
    color: #aef; transition: background 0.15s;
  `;
  coordsEl.title = 'Click para copiar coordenadas';
  coordsEl.addEventListener('mouseenter', () => {
    coordsEl.style.background = 'rgba(80,120,255,0.4)';
  });
  coordsEl.addEventListener('mouseleave', () => {
    coordsEl.style.background = 'rgba(0,0,0,0.55)';
  });
  coordsEl.addEventListener('click', () => {
    const txt = `X: ${lastCoords.x.toFixed(1)}, Z: ${lastCoords.z.toFixed(1)}`;
    navigator.clipboard.writeText(txt);
    const prev = coordsEl.textContent;
    coordsEl.textContent = '¡Copiado!';
    setTimeout(() => { coordsEl.textContent = prev; }, 1200);
  });
  document.body.appendChild(coordsEl);
}

export function updateCoords(x, z) {
  if (!coordsEl) return;
  lastCoords = { x, z };
  coordsEl.textContent = `X: ${x.toFixed(1)}  Z: ${z.toFixed(1)}  📋`;
}

export function showCoords() {
  if (coordsEl) coordsEl.style.display = 'block';
}

// ─── NPC Dialogue ──────────────────────────────────────────────────────────────
let _dlg    = null;
let _compass = null;

const _CHOICES = [
  'Escapamos de gente a la que le gusta mandar.',
  'Estamos buscando un templo.',
  'Estábamos un poco perdidos.',
];

export function showNPCDialogue(text) {
  if (_dlg) _dlg.remove();
  _dlg = document.createElement('div');
  _dlg.style.cssText = `
    position:fixed; bottom:110px; left:50%; transform:translateX(-50%);
    width:min(580px,88vw);
    background:rgba(7,4,1,0.95);
    border:1px solid rgba(195,150,60,0.65);
    border-radius:3px; padding:20px 26px;
    font-family:Georgia,'Times New Roman',serif;
    color:#ecdfa8; z-index:500;
    box-shadow:0 6px 40px rgba(0,0,0,0.8),inset 0 0 60px rgba(255,110,10,0.04);
    pointer-events:auto; user-select:none;
  `;
  _dlg.innerHTML = `
    <div style="font-size:10px;letter-spacing:3px;color:#c89428;text-transform:uppercase;margin-bottom:10px;">
      El Viejo del Fuego
    </div>
    <div id="_npc_text" style="font-size:15px;line-height:1.7;color:#ecdfa8;min-height:26px;">${text}</div>
    <div id="_npc_choices" style="margin-top:14px;"></div>
  `;
  document.body.appendChild(_dlg);
}

export function showNPCChoices(onChoose) {
  const box = document.getElementById('_npc_choices');
  if (!box) return;
  box.innerHTML = '';
  let chosen = false;
  _CHOICES.forEach((txt, i) => {
    const btn = document.createElement('button');
    btn.textContent = `${i + 1}. ${txt}`;
    btn.style.cssText = `
      display:block; width:100%;
      background:rgba(55,33,8,0.75); border:1px solid rgba(195,150,60,0.30);
      border-radius:2px; color:#e2cc80; font-family:Georgia,serif; font-size:14px;
      padding:9px 14px; margin-bottom:6px; cursor:pointer; text-align:left;
      transition:background .15s,border-color .15s;
    `;
    btn.onmouseenter = () => { btn.style.background='rgba(95,60,15,0.88)'; btn.style.borderColor='rgba(220,175,75,0.6)'; };
    btn.onmouseleave = () => { btn.style.background='rgba(55,33,8,0.75)'; btn.style.borderColor='rgba(195,150,60,0.30)'; };
    btn.onclick = () => {
      if (chosen) return;
      chosen = true;
      box.querySelectorAll('button').forEach(b => { b.disabled = true; b.style.opacity='0.45'; b.style.cursor='default'; });
      btn.style.opacity = '1';
      btn.style.borderColor = 'rgba(220,175,75,0.7)';
      onChoose(i);
    };
    box.appendChild(btn);
  });
}

export function showNPCWaiting() {
  const box = document.getElementById('_npc_choices');
  if (!box) return;
  box.innerHTML = `
    <div style="font-size:12px;color:rgba(195,165,90,0.6);font-style:italic;text-align:center;padding:6px 0;">
      Esperando que los demás respondan…
    </div>`;
}

export function showNPCResponse(text, onDone) {
  const textEl = document.getElementById('_npc_text');
  const boxEl  = document.getElementById('_npc_choices');
  if (boxEl) boxEl.innerHTML = '';
  if (textEl) {
    textEl.style.transition = 'opacity .35s';
    textEl.style.opacity = '0';
    setTimeout(() => { textEl.textContent = text; textEl.style.opacity = '1'; }, 380);
  }
  setTimeout(() => {
    if (!_dlg) return;
    _dlg.style.transition = 'opacity .7s';
    _dlg.style.opacity = '0';
    setTimeout(() => { hideNPCDialogue(); if (onDone) onDone(); }, 720);
  }, 3800);
}

export function hideNPCDialogue() {
  if (_dlg) { _dlg.remove(); _dlg = null; }
}

// ─── North Compass ─────────────────────────────────────────────────────────────
export function showNorthCompass() {
  if (_compass) return;
  _compass = document.createElement('div');
  _compass.style.cssText = `
    position:fixed; top:20px; right:20px; z-index:210;
    width:52px; height:52px; border-radius:50%;
    background:rgba(7,4,1,0.82); border:1px solid rgba(195,150,60,0.55);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    font-family:Georgia,serif; pointer-events:none;
    box-shadow:0 2px 12px rgba(0,0,0,0.6);
  `;
  // Camera at (player+20, +25, +20) faces SW. North (-Z world) = upper-right on screen ≈ 45° from top
  _compass.innerHTML = `
    <div style="font-size:20px;color:#d4a030;line-height:1;transform:rotate(45deg);margin-bottom:-2px;">↑</div>
    <div style="font-size:9px;letter-spacing:2px;color:#a07828;">N</div>
  `;
  document.body.appendChild(_compass);
}
