// --- GAUCHO: Main Game Loop (Isometric) ---
import * as THREE from 'three';
import { IsoControls } from './controls.js';
import { createWorld } from './world.js';
import { PlayerModel, createMuzzleFlash } from './player.js';
import { tryShoot, spawnBullet, updateBullets, muzzleFlash } from './shooting.js';
import * as Network from './network.js';
import * as UI from './ui.js';

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- Camera (isometric) ---
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(20, 25, 20);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- World ---
const colliders = createWorld(scene);

// --- Controls ---
const controls = new IsoControls(camera);

// --- Local player model ---
let localPlayerModel = null;

// --- State ---
const remotePlayers = new Map();
let myId = null;
let myData = { hp: 100, kills: 0, deaths: 0 };
let isDead = false;
let roomId = null;

// --- Network ---
const socket = Network.connect();

function startGame(name) {
  roomId = Network.getRoomId() || Network.generateRoomId();
  UI.hideLobby();

  const url = new URL(window.location);
  url.searchParams.set('room', roomId);
  window.history.replaceState({}, '', url);

  Network.joinRoom(roomId, name);
}

Network.onJoined((data) => {
  myId = data.self.id;
  myData = { hp: data.self.hp, kills: data.self.kills, deaths: data.self.deaths };

  controls.setPosition(data.self.x, data.self.y, data.self.z);

  // Create local player model (visible in isometric)
  localPlayerModel = new PlayerModel(scene, { ...data.self, name: '' });

  UI.showGame();
  UI.updateHP(myData.hp);
  UI.updateScore(myData.kills, myData.deaths);
  UI.setRoomLink(data.roomId);

  for (const [id, pd] of Object.entries(data.players)) {
    if (id !== myId) {
      remotePlayers.set(id, new PlayerModel(scene, pd));
    }
  }
  UI.updatePlayersCount(remotePlayers.size + 1);
});

Network.onPlayerJoined((pd) => {
  if (pd.id === myId) return;
  remotePlayers.set(pd.id, new PlayerModel(scene, pd));
  UI.updatePlayersCount(remotePlayers.size + 1);
});

Network.onPlayerLeft((id) => {
  const pm = remotePlayers.get(id);
  if (pm) { pm.remove(scene); remotePlayers.delete(id); }
  UI.updatePlayersCount(remotePlayers.size + 1);
});

Network.onPlayerMoved((data) => {
  const pm = remotePlayers.get(data.id);
  if (pm) pm.setTarget(data.x, data.y, data.z, data.ry);
});

Network.onPlayerShot((data) => {
  muzzleFlash(scene, data.origin);
  spawnBullet(scene, data.origin, data.direction, 0xff6644);
});

Network.onPlayerHit((data) => {
  if (data.id === myId) {
    myData.hp = data.hp;
    UI.updateHP(myData.hp);
    UI.showDamageFlash();
  }
  if (data.attackerId === myId) {
    UI.showHitmarker();
  }
});

Network.onPlayerKilled((data) => {
  UI.addKillMessage(data.killerName, data.victimName);
  if (data.victimId === myId) {
    isDead = true;
    myData.deaths = data.victimDeaths;
    UI.updateScore(myData.kills, myData.deaths);
    UI.showDeathScreen();
  }
  if (data.killerId === myId) {
    myData.kills = data.killerKills;
    UI.updateScore(myData.kills, myData.deaths);
    UI.showHitmarker();
  }
});

Network.onPlayerRespawned((data) => {
  if (data.id === myId) {
    isDead = false;
    myData.hp = data.hp;
    controls.setPosition(data.x, data.y, data.z);
    UI.updateHP(myData.hp);
    UI.hideDeathScreen();
  } else {
    const pm = remotePlayers.get(data.id);
    if (pm) pm.setTarget(data.x, data.y, data.z, 0);
  }
});

// --- Shooting (click) ---
renderer.domElement.addEventListener('mousedown', (e) => {
  if (e.button !== 0 || isDead || !myId) return;
  const pos = controls.getPosition();
  const dir = controls.getAimDirection();
  const result = tryShoot(pos, dir, remotePlayers, performance.now() / 1000);
  if (!result) return;

  muzzleFlash(scene, result.origin);
  spawnBullet(scene, result.origin, result.direction, 0xffff00);
  Network.sendShoot(result);
});

// --- Send position ---
const SEND_RATE = 1 / 20;
let sendTimer = 0;

// --- Game loop ---
const clock = new THREE.Clock();

function gameLoop() {
  requestAnimationFrame(gameLoop);
  const dt = Math.min(clock.getDelta(), 0.1);

  if (!isDead && myId) {
    controls.update(dt, colliders);

    // Update local player model position & rotation
    if (localPlayerModel) {
      const pos = controls.getPosition();
      const rot = controls.getRotation();
      localPlayerModel.setTarget(pos.x, pos.y, pos.z, rot.y);
      localPlayerModel.update(dt);
    }
  }

  // Update remote players
  for (const [, pm] of remotePlayers) {
    pm.update(dt);
  }

  // Update bullets
  updateBullets(scene, dt);

  // Send position
  sendTimer += dt;
  if (sendTimer >= SEND_RATE && myId && !isDead) {
    sendTimer = 0;
    const pos = controls.getPosition();
    const rot = controls.getRotation();
    Network.sendMove({ x: pos.x, y: pos.y, z: pos.z, rx: rot.x, ry: rot.y });
  }

  renderer.render(scene, camera);
}

// --- Lobby ---
UI.onPlay(() => {
  const name = UI.getNameInput() || 'Gaucho';
  startGame(name);
});

if (Network.getRoomId()) {
  document.getElementById('lobby').querySelector('.hint').textContent =
    'Te uniste a una sala. Ingresa tu nombre y presiona JUGAR';
}

gameLoop();
