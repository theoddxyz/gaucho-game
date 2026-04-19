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

export function sendMotoMount(motoId)    { socket.emit('mountMoto', { motoId }); }
export function sendMotoDismount(motoId) { socket.emit('dismountMoto', { motoId }); }
export function sendMotoMoved(data)      { socket.volatile.emit('motoMoved', data); }

export function onPlayerMountedMoto(cb)    { socket.on('playerMountedMoto', cb); }
export function onPlayerDismountedMoto(cb) { socket.on('playerDismountedMoto', cb); }
export function onMotoPositionUpdate(cb)   { socket.on('motoPositionUpdate', cb); }

export function sendUnsaddle(horseId)    { socket.emit('unsaddleHorse', { horseId }); }
export function onHorseUnsaddled(cb)     { socket.on('horseUnsaddled', cb); }
export function sendSaddle(horseId)      { socket.emit('saddleHorse', { horseId }); }
export function onHorseSaddled(cb)       { socket.on('horseSaddled', cb); }

export function sendNpcChoice(choice) { socket.emit('npcChoice', { choice }); }
export function onNpcResponse(cb)     { socket.on('npcResponse', cb); }

export function sendBottleHit(key, dir) { socket.emit('bottleHit', { key, dir }); }
export function onBottleHit(cb)         { socket.on('bottleHit', cb); }

export function sendCreatureHit(species, idx) { socket.emit('creatureHit', { species, idx }); }
export function onCreatureHit(cb)             { socket.on('creatureHit', cb); }
export function onCreatureSync(cb)            { socket.on('creatureSync', cb); }
export function sendHostCreatureSync(data, reliable = false) {
  if (reliable) socket.emit('hostCreatureSync', { ...data, _reliable: true });
  else socket.volatile.emit('hostCreatureSync', data);
}
export function onBecomeHost(cb)              { socket.on('becomeHost', cb); }
export function onRequestCreatureSync(cb)     { socket.on('requestCreatureSync', cb); }

export function sendOstrichKill(idx) { socket.emit('ostrichKill', { idx }); }
export function onOstrichKill(cb)    { socket.on('ostrichKill', cb); }

export function sendCowCorralled(id) { socket.emit('cowCorralled', { id }); }
export function onCowCorralled(cb)   { socket.on('cowCorralled', cb); }

export function sendBulletHit(hitId, hitZone) { socket.emit('bulletHit', { hitId, hitZone: hitZone || 'body' }); }
export function sendBloodSplat(x, y, z, dx, dz) { socket.volatile.emit('bloodSplat', { x, y, z, dx, dz }); }
export function onBloodSplat(cb) { socket.on('bloodSplat', cb); }
export function sendButcher() { socket.emit('butcher'); }
export function onButcher(cb) { socket.on('butcher', cb); }
export function sendYell(x, z)          { socket.emit('yell', { x, z }); }
export function sendToggleInvincible()  { socket.emit('toggleInvincible'); }
export function onYell(cb)      { socket.on('yell', cb); }
export function onGmMessage(cb)  { socket.on('gmMessage', cb); }
export function onGmCommand(cb)  { socket.on('gmCommand', cb); }

export function onNpcSpawned(cb)  { socket.on('npcSpawned', cb); }
export function onNpcMoved(cb)    { socket.on('npcMoved', cb); }
export function onNpcDialogue(cb) { socket.on('npcDialogue', cb); }
export function onNpcRemoved(cb)  { socket.on('npcRemoved', cb); }
export function sendGameEvent(type, data = {}, hour) { socket.emit('gameEvent', { type, hour, ...data }); }

// ── Conversación con aldeanos ─────────────────────────────────────────────────
export function sendGenerateAldeanoQA(units)  { socket.emit('generateAldeanoQA', { units }); }
export function onAldeanoQAReady(cb)          { socket.on('aldeanoQAReady', cb); }
export function sendAldeanoChat(payload)      { socket.emit('aldeanoChat', payload); }
export function onAldeanoChatResponse(cb)     { socket.on('aldeanoChatResponse', cb); }

export function sendCarrosaMoved(x, z, ry) { socket.volatile.emit('carrosaMoved', { x, z, ry }); }
export function onCarrosaMoved(cb)         { socket.on('carrosaMoved', cb); }

export function onPublicUrl(cb) { socket.on('publicUrl', cb); }

// Reliable mount/dismount events so remote clients update immediately
export function sendCarrossaMount()              { socket.emit('carrossaMount'); }
export function sendCarrossaDismount()           { socket.emit('carrossaDismount'); }
export function onCarrossaMount(cb)              { socket.on('carrossaMount', cb); }
export function onCarrossaDismount(cb)           { socket.on('carrossaDismount', cb); }

export function sendCarrossaPassengerMount()     { socket.emit('carrossaPassengerMount'); }
export function sendCarrossaPassengerDismount()  { socket.emit('carrossaPassengerDismount'); }
export function onCarrossaPassengerMount(cb)     { socket.on('carrossaPassengerMount', cb); }
export function onCarrossaPassengerDismount(cb)  { socket.on('carrossaPassengerDismount', cb); }

export function sendSleep(hours)   { socket.emit('sleep', { hours }); }
export function onTimeWarp(cb)     { socket.on('timeWarp', cb); }
export function onWakeUp(cb)       { socket.on('wakeUp', cb); }

// ── Plantas ──────────────────────────────────────────────────────────────────
export function sendPlantSeed(x, z)    { socket.emit('plantSeed', { x, z }); }
export function sendHarvestCrop(id)    { socket.emit('harvestCrop', { id }); }
export function sendAldeanoHarvestCrop(id) { socket.emit('harvestCrop', { id, isNPC: true }); }
export function onCropSpawned(cb)      { socket.on('cropSpawned', cb); }
export function onCropHarvested(cb)    { socket.on('cropHarvested', cb); }
export function onCropReset(cb)        { socket.on('cropReset', cb); }
export function onCropState(cb)        { socket.on('cropState', cb); }
export function sendHarvestBush(x, z)  { socket.emit('harvestBush', { x, z }); }
export function onBushHarvested(cb)    { socket.on('bushHarvested', cb); }
export function onBushState(cb)        { socket.on('bushState', cb); }
export function onCropLimitReached(cb) { socket.on('cropLimitReached', cb); }

export function getRoomId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || 'gaucho';  // sala por defecto: todos al mismo mundo
}

export function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}
