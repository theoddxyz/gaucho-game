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

export function showGame() {
  els.crosshair.style.display = 'block';
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
