// --- GAUCHO: Main Game Loop ---
import * as THREE from 'three';
import { IsoControls } from './controls.js';
import { createWorld }  from './world.js';
import { ChunkManager } from './chunk.js';
import { PlayerModel }  from './player.js';
import { HorseManager } from './horses.js';
import { tryShoot, spawnBullet, updateBullets, muzzleFlash } from './shooting.js';
import * as Network from './network.js';
import * as UI      from './ui.js';
import { createLandmarks, updateLandmarkEffects, getBottleMeshes, hitBottle } from './landmarks.js';
import { HoofprintSystem } from './hoofprints.js';

// --- Crosshair follows mouse ---
document.addEventListener('mousemove', (e) => UI.moveCrosshair(e.clientX, e.clientY));

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- Camera (isometric) ---
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(20, 25, 20);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- World setup ---
// colliders is a shared mutable array — buildings added now, chunks add/remove theirs at runtime
const colliders = [];
const { colliders: worldColliders, sun } = createWorld(scene);
worldColliders.forEach(c => colliders.push(c));

const chunkManager = new ChunkManager(scene, colliders);
createLandmarks(scene);

// --- Controls ---
const controls = new IsoControls(camera);

// --- Coords display ---
UI.initCoords();

// --- State ---
let localPlayerModel = null;
let horseManager     = null;
const remotePlayers  = new Map();
let myId   = null;
let myData = { hp: 100, kills: 0, deaths: 0 };
let isDead = false;
const hoofprints = new HoofprintSystem(scene);

// --- Network ---
Network.connect();

function startGame(name) {
  const roomId = Network.getRoomId() || Network.generateRoomId();
  UI.hideLobby();
  UI.showCoords();
  const url = new URL(window.location);
  url.searchParams.set('room', roomId);
  window.history.replaceState({}, '', url);
  Network.joinRoom(roomId, name);
}

Network.onJoined((data) => {
  myId   = data.self.id;
  myData = { hp: data.self.hp, kills: data.self.kills, deaths: data.self.deaths };

  controls.setPosition(data.self.x, data.self.y, data.self.z);
  localPlayerModel = new PlayerModel(scene, { ...data.self, name: '' });

  horseManager = new HorseManager(scene, Network);
  controls.onEPress = () => {
    const pos  = controls.getPosition();
    const land = horseManager?.tryMount(myId, 0, pos.x, pos.z);
    if (land) controls.setPosition(land.x, 0, land.z);
  };

  Network.onPlayerMountedHorse((d) => horseManager?.onRemoteMount(d.horseId, d.playerId));
  Network.onPlayerDismountedHorse((d) => horseManager?.onRemoteDismount(d.horseId));
  Network.onHorsePositionUpdate((d) => {
    horseManager?.onRemoteHorseMoved(d.horseId, d.x, d.z, d.ry, remotePlayers.get(d.riderId));
  });

  UI.showGame();
  UI.updateHP(myData.hp);
  UI.updateScore(myData.kills, myData.deaths);
  UI.setRoomLink(data.roomId);

  for (const [id, pd] of Object.entries(data.players)) {
    if (id !== myId) remotePlayers.set(id, new PlayerModel(scene, pd));
  }
  UI.updatePlayersCount(remotePlayers.size + 1);
});

Network.onPlayerJoined((pd) => {
  if (pd.id === myId) return;
  remotePlayers.set(pd.id, new PlayerModel(scene, pd));
  UI.updatePlayersCount(remotePlayers.size + 1);
});

Network.onPlayerLeft((id) => {
  remotePlayers.get(id)?.remove(scene);
  remotePlayers.delete(id);
  UI.updatePlayersCount(remotePlayers.size + 1);
});

Network.onPlayerMoved((data) => {
  // Skip position update for mounted players — horse position is authoritative
  if (horseManager?.isPlayerMounted(data.id)) return;
  remotePlayers.get(data.id)?.setTarget(data.x, data.y, data.z, data.ry);
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
    localPlayerModel?.detachHat();
  } else {
    remotePlayers.get(data.id)?.detachHat();
  }
  if (data.attackerId === myId) UI.showHitmarker();
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
    localPlayerModel?.respawnHat();
  } else {
    const pm = remotePlayers.get(data.id);
    if (pm) { pm.setTarget(data.x, data.y, data.z, 0); pm.respawnHat(); }
  }
});

// --- Shooting (left-click, only while right-click aim is held) ---
renderer.domElement.addEventListener('mousedown', (e) => {
  if (e.button !== 0 || isDead || !myId || !controls.isAiming()) return;
  const pos = controls.getPosition();
  const dir = controls.getAimDirection();
  const riderY = horseManager?.isMounted() ? 2.5 : pos.y;
  const gunY   = riderY + 0.55;
  const fp     = localPlayerModel?.getFirepointWorldPos();
  const origin = fp ? { x: fp.x, y: fp.y, z: fp.z } : null;
  const result = tryShoot(pos, dir, remotePlayers, performance.now() / 1000, gunY, origin);
  if (!result) return;
  controls.applyRecoil();
  muzzleFlash(scene, result.origin);
  spawnBullet(scene, result.origin, result.direction, 0xffff00);
  Network.sendShoot(result);

  // Bottle physics — cone check (ignores y so bottles at any shelf height are hittable)
  const bottleMeshes = getBottleMeshes();
  if (bottleMeshes.length > 0) {
    const gunPos  = new THREE.Vector3(result.origin.x, result.origin.y, result.origin.z);
    const aimFlat = new THREE.Vector3(result.direction.x, 0, result.direction.z).normalize();
    let closest = null, closestDist = Infinity;
    const bWP = new THREE.Vector3();
    for (const bMesh of bottleMeshes) {
      bMesh.getWorldPosition(bWP);
      const toB = new THREE.Vector3(bWP.x - gunPos.x, 0, bWP.z - gunPos.z);
      const dist = toB.length();
      if (dist > 80 || dist < 0.1) continue;
      const dot = aimFlat.dot(toB.clone().normalize());
      if (dot > 0.96 && dist < closestDist) { closest = bMesh; closestDist = dist; }
    }
    if (closest) hitBottle(closest, result.direction);
  }
});

// --- Game loop ---
const clock    = new THREE.Clock();
const SEND_RATE = 1 / 20;
let sendTimer  = 0;

function gameLoop() {
  requestAnimationFrame(gameLoop);
  const dt = Math.min(clock.getDelta(), 0.1);

  let pos = null;
  if (!isDead && myId) {
    controls.update(dt, colliders, horseManager?.speedMultiplier(controls.isSprinting()) ?? (controls.isSprinting() ? 1.9 : 1.0));

    pos = controls.getPosition();
    const rot = controls.getRotation();

    // Chunk streaming
    chunkManager.update(pos);

    // Shadow follows player — directional light moves with camera so frustum covers local area
    sun.position.set(pos.x + 90, 22, pos.z + 25);
    sun.target.position.set(pos.x, 0, pos.z);
    sun.target.updateMatrixWorld();

    // Horse sync
    if (horseManager) {
      horseManager.update(pos, dt);

      // When mount animation finishes, snap controls to horse so camera follows
      const mountLand = horseManager.consumeMountLand();
      if (mountLand) controls.setPosition(mountLand.x, 0, mountLand.z);

      if (horseManager.isMounted() && !horseManager.isMountAnimating()) {
        // Only drive horse position after mount arc completes
        const moveAngle  = controls.getMovementAngle();
        const sprinting  = controls.isSprinting();
        horseManager.syncRiderPosition(pos.x, pos.z, moveAngle, pos.y, sprinting);
        Network.sendHorseMoved({ horseId: horseManager.myHorseId, x: pos.x, z: pos.z, ry: moveAngle });
      }
      // Auto-mount: jump onto a nearby horse while in the air
      if (!horseManager.isMounted() && controls.isInAir()) {
        const jumpY   = pos.y;  // save height before landOnHorse resets it
        const mounted = horseManager.tryAutoMount(pos, myId, jumpY);
        if (mounted) controls.landOnHorse();
      }
    }

    // Local player model
    const facingAngle = controls.isAiming() ? rot.y : controls.getMovementAngle();
    localPlayerModel?.setAiming(controls.isAiming());
    if (localPlayerModel) {
      // Y: mount/dismount anim → horse jump (2.5 + jump offset) → ground jump → ground
      const animY  = horseManager?.getAnimY();
      const riderY = animY != null
        ? animY
        : horseManager?.isMounted()
          ? 2.5 + pos.y          // horse jump: rider rises above saddle
          : pos.y;               // normal ground jump (pos.y goes up on Space)

      // XZ: arc from player pos → horse on mount, horse → landing on dismount
      const mountXZ    = horseManager?.getMountModelPos();
      const dismountXZ = horseManager?.getDismountModelPos(pos);
      const overrideXZ = mountXZ ?? dismountXZ;
      const modelX = overrideXZ ? overrideXZ.x : pos.x;
      const modelZ = overrideXZ ? overrideXZ.z : pos.z;

      localPlayerModel.group.position.set(modelX, riderY, modelZ);
      localPlayerModel.group.rotation.y = facingAngle;
    }

    UI.updateCoords(pos.x, pos.z);

    sendTimer += dt;
    if (sendTimer >= SEND_RATE) {
      sendTimer = 0;
      Network.sendMove({ x: pos.x, y: pos.y, z: pos.z, rx: rot.x, ry: facingAngle });
    }
  }

  for (const [, pm] of remotePlayers) pm.update(dt);
  localPlayerModel?.updateHat(dt);
  updateLandmarkEffects(dt, pos, horseManager?.isMounted() ? pos : null);
  if (horseManager) hoofprints.update(horseManager.horses, dt);
  updateBullets(scene, dt);
  renderer.render(scene, camera);
}

// --- Lobby ---
UI.onPlay(() => startGame(UI.getNameInput() || 'Gaucho'));

if (Network.getRoomId()) {
  document.getElementById('lobby').querySelector('.hint').textContent =
    'Te uniste a una sala. Ingresa tu nombre y presiona JUGAR';
}

gameLoop();
