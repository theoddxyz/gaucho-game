// --- HUD & UI Manager (oldschool minimal) ---

const $ = (id) => document.getElementById(id);

// ─── Stat bar helpers ─────────────────────────────────────────────────────────
const FULL  = '█';
const EMPTY = '░';
const BAR_W = 10;

function mkBar(pct) {
  const n = Math.round(Math.max(0, Math.min(100, pct)) / 10);
  return FULL.repeat(n) + EMPTY.repeat(BAR_W - n);
}

// ─── Element refs ─────────────────────────────────────────────────────────────
const els = {
  lobby:         $('lobby'),
  nameInput:     $('name-input'),
  playBtn:       $('play-btn'),
  crosshair:     $('crosshair'),
  crosshairDot:  $('crosshair-dot'),
  hud:           $('hud'),
  barHp:         $('bar-hp'),
  valHp:         $('val-hp'),
  barHam:        $('bar-ham'),
  valHam:        $('val-ham'),
  barSed:        $('bar-sed'),
  valSed:        $('val-sed'),
  statTemp:      $('stat-temp'),
  score:         $('score'),
  gameTime:      $('game-time'),
  scoreKd:       $('score-kd'),
  playersCount:  $('players-count'),
  killfeed:      $('killfeed'),
  roomLink:      $('room-link'),
  hitmarker:     $('hitmarker'),
  damageOverlay: $('damage-overlay'),
  deathScreen:   $('death-screen'),
};

// ─── Lobby ────────────────────────────────────────────────────────────────────
export function hideLobby() {
  els.lobby.style.display = 'none';
}

export function showGame() {
  els.crosshair.style.display    = 'block';
  els.crosshairDot.style.display = 'block';
  document.body.classList.add('game-active');
  els.hud.style.display          = 'block';
  els.score.style.display        = 'block';
  els.killfeed.style.display     = 'block';
  els.roomLink.style.display     = 'block';
}

// ─── Crosshair ────────────────────────────────────────────────────────────────
export function moveCrosshair(x, y) {
  if (els.crosshair) {
    els.crosshair.style.left    = x + 'px';
    els.crosshair.style.top     = y + 'px';
  }
  if (els.crosshairDot) {
    els.crosshairDot.style.left = x + 'px';
    els.crosshairDot.style.top  = y + 'px';
  }
}

// ─── HP ───────────────────────────────────────────────────────────────────────
export function updateHP(hp) {
  const pct = Math.max(0, hp);
  els.barHp.textContent = mkBar(pct);
  els.valHp.textContent = pct;
  // Color shifts red→orange→green as HP rises
  if (pct > 60)      els.barHp.style.color = '#885533';
  else if (pct > 30) els.barHp.style.color = '#7a4422';
  else               els.barHp.style.color = '#cc2211';
}

// ─── Survival stats ───────────────────────────────────────────────────────────
export function updateSurvivalUI(hunger, thirst, tempC) {
  els.barHam.textContent = mkBar(hunger);
  els.valHam.textContent = hunger;
  // hunger bar: amber → dark
  els.barHam.style.color = hunger > 40 ? '#7a5520' : '#bb6611';

  els.barSed.textContent = mkBar(thirst);
  els.valSed.textContent = thirst;
  // thirst bar: blue → bright
  els.barSed.style.color = thirst > 40 ? '#225566' : '#2288aa';

  // Temperature
  let tempLabel, tempColor;
  if (tempC >= 38)      { tempLabel = 'CALOR';  tempColor = '#cc3322'; }
  else if (tempC >= 28) { tempLabel = 'TIBIO';  tempColor = '#8a7030'; }
  else if (tempC >= 15) { tempLabel = 'FRESCO'; tempColor = '#507050'; }
  else if (tempC >=  5) { tempLabel = 'FRIO';   tempColor = '#2266aa'; }
  else                  { tempLabel = 'HELADO'; tempColor = '#4488cc'; }
  els.statTemp.textContent = `TEMP ${tempC > 0 ? '+' : ''}${tempC}°C  ${tempLabel}`;
  els.statTemp.style.color = tempColor;
}

// ─── Score ────────────────────────────────────────────────────────────────────
export function updateScore(kills, deaths) {
  els.scoreKd.textContent = `K:${kills}  M:${deaths}`;
}

export function updateGameTime(timeStr, isNight) {
  els.gameTime.textContent = timeStr;
  els.gameTime.style.color = isNight ? '#4a6090' : '#c8a050';
}

// ─── Players count ────────────────────────────────────────────────────────────
export function updatePlayersCount(count) {
  els.playersCount.textContent = `${count} online`;
}

// ─── Room link ────────────────────────────────────────────────────────────────
export function setRoomLink(roomId) {
  const url = `${location.origin}?room=${roomId}`;
  els.roomLink.textContent = `sala: ${roomId}`;
  els.roomLink.title = 'click para copiar link';
  els.roomLink.onclick = () => {
    navigator.clipboard.writeText(url);
    const prev = els.roomLink.textContent;
    els.roomLink.textContent = 'link copiado';
    setTimeout(() => { els.roomLink.textContent = prev; }, 1800);
  };
}

// ─── Kill feed ────────────────────────────────────────────────────────────────
export function addKillMessage(killerName, victimName) {
  const msg = document.createElement('div');
  msg.className = 'kill-msg';
  msg.innerHTML = `<b>${killerName}</b> &gt; <b>${victimName}</b>`;
  els.killfeed.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}

// ─── Hit marker ───────────────────────────────────────────────────────────────
export function showHitmarker() {
  els.hitmarker.style.display = 'block';
  setTimeout(() => { els.hitmarker.style.display = 'none'; }, 180);
}

// ─── Eat effect (churrasco pickup) ───────────────────────────────────────────
export function showEatEffect() {
  let el = document.getElementById('_eat_msg');
  if (!el) {
    el = document.createElement('div');
    el.id = '_eat_msg';
    el.style.cssText = `
      position:fixed; bottom:120px; left:50%; transform:translateX(-50%);
      z-index:300; font-family:'Share Tech Mono','Courier New',monospace;
      font-size:12px; color:#c8a050; letter-spacing:3px; pointer-events:none;
      opacity:0; transition:opacity .25s;
    `;
    document.body.appendChild(el);
  }
  el.textContent = '+ CHURRASCO  VID+25  HAM+55';
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 2200);
}

// ─── Damage flash ─────────────────────────────────────────────────────────────
export function showDamageFlash() {
  els.damageOverlay.style.opacity = '1';
  setTimeout(() => { els.damageOverlay.style.opacity = '0'; }, 280);
}

// ─── Death screen ─────────────────────────────────────────────────────────────
export function showDeathScreen() { els.deathScreen.style.display = 'flex'; }
export function hideDeathScreen() { els.deathScreen.style.display = 'none'; }

// ─── Lobby input ─────────────────────────────────────────────────────────────
export function getNameInput() { return els.nameInput.value.trim(); }

export function onPlay(callback) {
  els.playBtn.addEventListener('click', callback);
  els.nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') callback();
  });
}

// ─── Coords display ───────────────────────────────────────────────────────────
let _coordsEl = null;
let _lastCoords = { x: 0, z: 0 };

export function initCoords() {
  _coordsEl = document.createElement('div');
  _coordsEl.id = 'coords-display';
  _coordsEl.title = 'click para copiar';
  _coordsEl.style.display = 'none';
  _coordsEl.addEventListener('click', () => {
    const txt = `X:${_lastCoords.x.toFixed(1)} Z:${_lastCoords.z.toFixed(1)}`;
    navigator.clipboard.writeText(txt);
    const prev = _coordsEl.textContent;
    _coordsEl.textContent = 'copiado';
    setTimeout(() => { _coordsEl.textContent = prev; }, 1200);
  });
  document.body.appendChild(_coordsEl);
}

export function updateCoords(x, z) {
  if (!_coordsEl) return;
  _lastCoords = { x, z };
  _coordsEl.textContent = `${x.toFixed(0)},${z.toFixed(0)}`;
}

export function showCoords() {
  if (_coordsEl) _coordsEl.style.display = 'block';
}

// ─── NPC Dialogue ─────────────────────────────────────────────────────────────
let _dlg     = null;
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
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    width:min(560px,86vw);
    background:rgba(7,4,1,0.97);
    border:1px solid #3a2808;
    padding:18px 24px;
    font-family:'Share Tech Mono','Courier New',monospace;
    color:#c8a050; z-index:500;
    pointer-events:auto; user-select:none;
  `;
  _dlg.innerHTML = `
    <div style="font-size:9px;letter-spacing:4px;color:#4a3010;text-transform:uppercase;margin-bottom:10px;">
      ── El Viejo del Fuego ──
    </div>
    <div id="_npc_text" style="font-size:13px;line-height:1.75;color:#c8a050;min-height:22px;">${text}</div>
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
      background:none; border:none; border-top:1px solid #2a1c08;
      color:#7a6030; font-family:inherit; font-size:12px;
      padding:9px 0; cursor:pointer; text-align:left;
      letter-spacing:0.5px; transition:color .12s;
    `;
    btn.onmouseenter = () => { btn.style.color = '#c8a050'; };
    btn.onmouseleave = () => { btn.style.color = chosen ? btn.style.color : '#7a6030'; };
    btn.onclick = () => {
      if (chosen) return;
      chosen = true;
      box.querySelectorAll('button').forEach(b => {
        b.disabled = true; b.style.opacity = '0.35'; b.style.cursor = 'default';
      });
      btn.style.opacity = '1'; btn.style.color = '#c8a050';
      onChoose(i);
    };
    box.appendChild(btn);
  });
}

export function showNPCWaiting() {
  const box = document.getElementById('_npc_choices');
  if (!box) return;
  box.innerHTML = `
    <div style="font-size:10px;color:#3a2808;letter-spacing:2px;padding:8px 0;">
      esperando respuesta...
    </div>`;
}

export function showNPCResponse(text, onDone) {
  const textEl = document.getElementById('_npc_text');
  const boxEl  = document.getElementById('_npc_choices');
  if (boxEl) boxEl.innerHTML = '';
  if (textEl) {
    textEl.style.transition = 'opacity .3s';
    textEl.style.opacity = '0';
    setTimeout(() => { textEl.textContent = text; textEl.style.opacity = '1'; }, 320);
  }
  setTimeout(() => {
    if (!_dlg) return;
    _dlg.style.transition = 'opacity .6s';
    _dlg.style.opacity = '0';
    setTimeout(() => { hideNPCDialogue(); if (onDone) onDone(); }, 650);
  }, 3800);
}

export function hideNPCDialogue() {
  if (_dlg) { _dlg.remove(); _dlg = null; }
}

// ─── Yell / Arreee ───────────────────────────────────────────────────────────
let _yellEl = null;
let _yellT  = null;

export function showYell(isOther = false) {
  if (!_yellEl) {
    _yellEl = document.createElement('div');
    _yellEl.style.cssText = `
      position:fixed; top:40%; left:50%; transform:translate(-50%,-50%);
      z-index:300; font-family:'Share Tech Mono','Courier New',monospace;
      font-size:22px; letter-spacing:6px; color:#e8c050;
      text-shadow:0 0 18px rgba(230,180,40,0.7);
      pointer-events:none; opacity:0; transition:opacity .15s;
      text-transform:uppercase;
    `;
    document.body.appendChild(_yellEl);
  }
  _yellEl.textContent = isOther ? '¡ARREEE!' : '¡¡ ARREEE !!';
  _yellEl.style.opacity = '1';
  clearTimeout(_yellT);
  _yellT = setTimeout(() => { _yellEl.style.opacity = '0'; }, isOther ? 800 : 1100);
}

// ─── Corral counter ───────────────────────────────────────────────────────────
export function updateCorralCount(n, total = 33) {
  const el = document.getElementById('corral-count');
  if (!el) return;
  el.textContent = `VACAS: ${n}/${total}`;
  el.style.color = n === total ? '#44cc44' : '#7a6030';
}

// ─── Stable waypoint ──────────────────────────────────────────────────────────
const _STABLE_X = 1000, _STABLE_Z = 1000;
const _WP_ARROWS = ['↑','↗','→','↘','↓','↙','←','↖'];

export function updateStableWaypoint(px, pz) {
  const el = document.getElementById('stable-waypoint');
  if (!el) return;

  const dx = _STABLE_X - px, dz = _STABLE_Z - pz;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist < 20) { el.style.display = 'none'; return; }
  el.style.display = 'block';

  // World angle: +x=east, +z=south. atan2(dx, dz)=0 when due south (toward +z)
  // We want 0=north so flip: atan2(dx, -dz)
  const angle = Math.atan2(dx, -dz) * 180 / Math.PI;
  const idx   = Math.round(((angle % 360) + 360) % 360 / 45) % 8;
  const arrow = _WP_ARROWS[idx];

  const distStr = dist > 999 ? `${(dist / 1000).toFixed(1)}km` : `${Math.round(dist)}m`;

  const arrowEl = el.querySelector('.wp-arrow');
  const infoEl  = el.querySelector('.wp-info');
  if (arrowEl) arrowEl.textContent = arrow;
  if (infoEl)  infoEl.textContent  = `ESTABLO ${distStr}`;
}

// ─── North Compass ────────────────────────────────────────────────────────────
export function showNorthCompass() {
  if (_compass) return;
  _compass = document.createElement('div');
  _compass.style.cssText = `
    position:fixed; top:14px; left:50%; transform:translateX(-50%);
    z-index:210; pointer-events:none;
    font-family:'Share Tech Mono','Courier New',monospace;
    font-size:10px; color:#4a3010; letter-spacing:3px;
    text-align:center;
  `;
  _compass.innerHTML = `
    <div style="font-size:16px;color:#c8a050;transform:rotate(45deg);display:inline-block;line-height:1;">↑</div>
    <div style="margin-top:2px;">N</div>
  `;
  document.body.appendChild(_compass);
}
