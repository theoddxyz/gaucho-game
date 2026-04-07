// --- Socket.io client ---
import { io } from 'socket.io-client';

let socket = null;

export function connect() {
  socket = io();
  return socket;
}

export function joinRoom(roomId, name) {
  socket.emit('join', { roomId, name });
}

export function sendMove(data) {
  socket.volatile.emit('move', data);
}

export function sendShoot(data) {
  socket.emit('shoot', data);
}

export function onJoined(cb) { socket.on('joined', cb); }
export function onPlayerJoined(cb) { socket.on('playerJoined', cb); }
export function onPlayerLeft(cb) { socket.on('playerLeft', cb); }
export function onPlayerMoved(cb) { socket.on('playerMoved', cb); }
export function onPlayerShot(cb) { socket.on('playerShot', cb); }
export function onPlayerHit(cb) { socket.on('playerHit', cb); }
export function onPlayerKilled(cb) { socket.on('playerKilled', cb); }
export function onPlayerRespawned(cb) { socket.on('playerRespawned', cb); }

export function sendMount(horseId)   { socket.emit('mountHorse', { horseId }); }
export function sendDismount(horseId){ socket.emit('dismountHorse', { horseId }); }
export function sendHorseMoved(data) { socket.volatile.emit('horseMoved', data); }

export function onPlayerMountedHorse(cb)   { socket.on('playerMountedHorse', cb); }
export function onPlayerDismountedHorse(cb){ socket.on('playerDismountedHorse', cb); }
export function onHorsePositionUpdate(cb)  { socket.on('horsePositionUpdate', cb); }

export function sendNpcChoice(choice) { socket.emit('npcChoice', { choice }); }
export function onNpcResponse(cb)     { socket.on('npcResponse', cb); }

export function sendBottleHit(key, dir) { socket.emit('bottleHit', { key, dir }); }
export function onBottleHit(cb)         { socket.on('bottleHit', cb); }

export function getRoomId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || null;
}

export function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}
