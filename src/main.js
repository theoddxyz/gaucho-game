// --- GAUCHO: Main Game Loop ---
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass }     from 'three/addons/postprocessing/ShaderPass.js';
import { IsoControls } from './controls.js';
import { createWorld }  from './world.js';
import { ChunkManager } from './chunk.js';
import { PlayerModel }  from './player.js';
import { HorseManager } from './horses.js';
import { tryShoot, hitscan, spawnBullet, updateBullets, muzzleFlash, BULLET_SPEED, BULLET_RANGE } from './shooting.js';
import * as Network from './network.js';
import * as UI      from './ui.js';
import { createLandmarks, updateLandmarkEffects, getBottleMeshes, hitBottle, getBottleKey, hitBottleByKey, NPC_POSITION } from './landmarks.js';
import { HoofprintSystem } from './hoofprints.js';
import { updateDayNight, getDayProgress, getTemperature, getGameTime, isNight, setDayProgress, unlockDayProgress, getSunOffset } from './daynight.js';
import { updateSurvival, getHunger, getThirst, restoreHunger } from './survival.js';
import { OstrichSystem } from './ostrich.js';
import { CowSystem } from './cows.js';
import { ChickenSystem } from './chickens.js';
import { CampesinoSystem } from './campesinos.js';
import { SoulSystem } from './souls.js';
import { SoulMap } from './soulmap.js';
import { RadialMenu } from './radial-menu.js';
import { LassoSystem } from './lasso.js';
import { WindParticles } from './wind-particles.js';
import { BirdSystem } from './birds.js';
import { MusicPlayer } from './music.js';
import { speakNpc, speakGm, stopSpeech } from './speech.js';
import * as Audio     from './audio.js';
import { getAudioCtx, getMasterGain } from './audio.js';
import * as Inventory from './inventory.js';
import { createVillage, getVillageGates } from './village.js';

// Vite HMR: forzar recarga completa en vez de hot-swap parcial
// (evita múltiples instancias del renderer corriendo simultáneamente)
if (import.meta.hot) { import.meta.hot.decline(); }

// --- Crosshair follows mouse ---
document.addEventListener('mousemove', (e) => UI.moveCrosshair(e.clientX, e.clientY));

// --- F key: yell to stampede nearby cows ---
let _yellCooldown = 0;
document.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyF' || !myId || isDead) return;
  const now = performance.now() / 1000;
  if (now - _yellCooldown < 2.5) return;   // 2.5 s cooldown between yells
  _yellCooldown = now;
  const pos = controls?.getPosition();
  if (!pos) return;
  cowSystem?.yell(pos.x, pos.z);
  chickenSystem?.yell(pos.x, pos.z);
  Network.sendYell(pos.x, pos.z);
  Audio.chickenPanic();
  Audio.cowMoo(true);
  UI.showYell(false);
});

// --- I key: modo invisible/invencible (debug) ---
let isInvincible = false;
document.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyI' || !myId) return;
  isInvincible = !isInvincible;
  Network.sendToggleInvincible();
  // Visual feedback — tint local model
  const tint = isInvincible ? 0x88bbff : null;
  if (localPlayerModel) {
    localPlayerModel.group.traverse(o => {
      if (o.isMesh && o.material) {
        if (tint !== null) { o.material.transparent = true; o.material.opacity = 0.4; }
        else { o.material.transparent = false; o.material.opacity = 1.0; }
      }
    });
  }
});

// Tecla Q: abrir/cerrar puerta del corral más cercano
document.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyQ' || !myId || isDead) return;
  const pos = controls?.getPosition();
  if (!pos) return;
  let nearest = null, nearestD = 8;
  for (const gate of villageGates) {
    const dx = pos.x - gate.gateX, dz = pos.z - gate.gateZ;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < nearestD) { nearestD = d; nearest = gate; }
  }
  if (nearest) {
    nearest.isOpen       = !nearest.isOpen;
    nearest.animTarget   = nearest.isOpen ? 1 : 0;
    nearest.collider.active = !nearest.isOpen;
  }
});

// Teclas 1/2/3: cambio directo de arma (sin menú radial)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Digit1' && currentWeapon !== 'escopeta') {
    currentWeapon = 'escopeta';
    radialMenu.setHUD('escopeta');
    lassoSystem.release();
  }
  if (e.code === 'Digit2' && currentWeapon !== 'lasso') {
    currentWeapon = 'lasso';
    radialMenu.setHUD('lasso');
  }
  if (e.code === 'Digit3' && currentWeapon !== 'food') {
    currentWeapon = 'food';
    radialMenu.setHUD('food');
    lassoSystem.release();
  }
  // Mouse wheel cuando food está activo: ciclar tipo de comida
  if (e.code === 'Tab' && currentWeapon === 'food') {
    e.preventDefault();
    Inventory.cycleSelected();
    _updateInventoryHUD();
  }
});

// Alt key: menú radial de armas
document.addEventListener('keydown', (e) => {
  if (e.key === 'Alt') {
    e.preventDefault();
    if (!radialMenu._visible) radialMenu.show(currentWeapon);
  }
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'Alt') {
    e.preventDefault();
    const selected = radialMenu.getSelected();
    radialMenu.hide();
    if (selected !== currentWeapon) {
      currentWeapon = selected;
      radialMenu.setHUD(currentWeapon);
      if (currentWeapon !== 'lasso') lassoSystem.release();
    }
  }
});

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
renderer.toneMapping       = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// --- Camera (isometric) ---
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(20, 25, 20);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();


// --- Post-processing: color grading western + chromatic aberration ---
const _westernShader = {
  uniforms: {
    tDiffuse:   { value: null },
    aberration: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float aberration;
    varying vec2 vUv;
    vec3 colorGrade(vec3 c) {
      // Lift shadows warm brown
      c += vec3(0.04, 0.02, -0.02) * smoothstep(0.0, 0.3, 1.0 - dot(c, vec3(0.299,0.587,0.114)));
      // Push highlights yellow
      float lum = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(c, c * vec3(1.06, 1.02, 0.88), smoothstep(0.5, 1.0, lum));
      // Slight desaturation midtones (dusty)
      c = mix(vec3(lum), c, mix(1.0, 0.82, smoothstep(0.25, 0.75, lum) * 0.4));
      // Vignette
      vec2 u = vUv * (1.0 - vUv.yx);
      c *= mix(1.0, pow(u.x * u.y * 18.0, 0.35), 0.45);
      return c;
    }
    void main() {
      float ab = aberration * 0.012;
      float r = texture2D(tDiffuse, vUv + vec2(ab, 0.0)).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - vec2(ab, 0.0)).b;
      vec3 col = colorGrade(vec3(r, g, b));
      if (aberration > 0.01) {
        vec2 u = vUv * (1.0 - vUv.yx);
        float edge = 1.0 - pow(u.x * u.y * 15.0, 0.3);
        col = mix(col, vec3(0.8, 0.0, 0.0), edge * aberration * 0.55);
      }
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
const _composer = new EffectComposer(renderer);
_composer.addPass(new RenderPass(scene, camera));
const _fxPass = new ShaderPass(_westernShader);
_fxPass.renderToScreen = true;
_composer.addPass(_fxPass);
let _aberration = 0;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  _composer.setSize(window.innerWidth, window.innerHeight);
});

// --- World setup ---
// colliders is a shared mutable array — buildings added now, chunks add/remove theirs at runtime
const colliders = [];
const { colliders: worldColliders, sun, moon, ambient } = createWorld(scene);
worldColliders.forEach(c => colliders.push(c));

const chunkManager = new ChunkManager(scene, colliders);
createLandmarks(scene);
createVillage(scene, colliders);
const villageGates = getVillageGates();

// --- Controls ---
const controls = new IsoControls(camera);

// Emergency brake sound — called by double-tap detection in controls.js
controls.onEmergencyBrake = () => {
  Audio.horseNeigh();
  // Extra snort/exhale for drama
  setTimeout(() => Audio.horseSnort(), 180);
};

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

// Smoothed local player facing angle (shortest-path lerp, snaps when aiming)
let _facingAngle = 0;

// Avestruz
const ostrichSystem = new OstrichSystem(scene);

// Gallinas
const chickenSystem = new ChickenSystem(scene);

// Campesinos + sistema de almas
const soulSystem      = new SoulSystem(scene);
const soulMap         = new SoulMap(soulSystem);
const campesinoSystem = new CampesinoSystem(scene);

// Armas
let currentWeapon = 'shotgun';
const radialMenu  = new RadialMenu();
const lassoSystem = new LassoSystem(scene);
const windParticles = new WindParticles(scene);
const birdSystem = new BirdSystem(scene);

// Vacas
let cowSystem = null;

// ─── NPC dialogue state ────────────────────────────────────────────────────────
let _npcActive = false;   // dialogue panel is open
let _npcDone   = false;   // player already completed dialogue this session

// --- Network ---
Network.connect();

let _musicPlayer = null;

function startGame(name) {
  Audio.initAudio();
  Audio.stopLobbyMusic();
  Audio.startWind();
  Audio.startAmbientDrone();
  // Música MIDI — arranca con fade-in; baja el drone ambient para que no tape
  try {
    const ctx  = getAudioCtx();
    const out  = getMasterGain();
    if (ctx && out) {
      _musicPlayer = new MusicPlayer(ctx, out);
      setTimeout(() => {
        Audio.stopAmbientDrone();   // apagar el drone antes de que arranque la música
        _musicPlayer.start();
        _musicPlayer.fadeIn(3.0);
      }, 2000);
    }
  } catch(e) { console.warn('[MUSIC]', e); }
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
  localPlayerModel = new PlayerModel(scene, { ...data.self, name: '', local: true });


  horseManager = new HorseManager(scene, Network);
  horseManager.onHoofTouch = (speed, sprint) => Audio.playHoofTouch(speed, sprint);
  controls.onEPress = () => {
    const pos = controls.getPosition();

    // ── 1. Recolectar animal herido/muerto cercano ────────────────────────────
    const LOOT_R   = 2.8;
    const wCow     = cowSystem?.getNearbyWounded(pos.x, pos.z, LOOT_R);
    const wOstrich = !wCow     && ostrichSystem?.getNearbyWounded(pos.x, pos.z, LOOT_R);
    const wChicken = !wCow     && !wOstrich && chickenSystem?.getNearbyWounded(pos.x, pos.z, LOOT_R);
    const wBird    = !wCow     && !wOstrich && !wChicken && birdSystem?.getNearbyDead(pos.x, pos.z, LOOT_R);
    const wAnimal  = wCow || wOstrich || wChicken || wBird;

    if (wAnimal) {
      // Mostrar churrascos PRIMERO — consumir la comida después del delay
      UI.showEatEffect();
      Audio.eatSound();
      setTimeout(() => {
        let food;
        if (wCow)          food = cowSystem?.lootWounded(wCow);
        else if (wOstrich) food = ostrichSystem?.lootWounded(wOstrich);
        else if (wChicken) food = chickenSystem?.lootWounded(wChicken);
        else if (wBird)    food = birdSystem?.lootBird(wBird);
        if (food) {
          restoreHunger(food.hunger);
          myData.hp = Math.min(200, myData.hp + food.hp);
          UI.updateHP(myData.hp);
          UI.addKillMessage('[ CARNE ]', `+${food.hunger} ham  +${food.hp} vid`);
        }
      }, 1400);
      return;
    }

    // ── 2. Montar/desmontar caballo ───────────────────────────────────────────
    const nearHorse = horseManager?._nearestHorseId !== null;
    const mounted   = horseManager?.isMounted();
    if (nearHorse || mounted) {
      const land = horseManager?.tryMount(myId, 0, pos.x, pos.z);
      if (land) { controls.setPosition(land.x, 0, land.z); Audio.mountSound(); Audio.horseNeigh(); }
    } else if (currentWeapon === 'food' && Inventory.hasAny()) {
      _throwFood(pos);
    }
  };

  Network.onPlayerMountedHorse((d) => horseManager?.onRemoteMount(d.horseId, d.playerId));
  Network.onPlayerDismountedHorse((d) => horseManager?.onRemoteDismount(d.horseId));
  Network.onHorsePositionUpdate((d) => {
    horseManager?.onRemoteHorseMoved(d.horseId, d.x, d.z, d.ry, remotePlayers.get(d.riderId));
  });

  // Remote bottle hits
  Network.onBottleHit(({ key, dir }) => hitBottleByKey(key, dir));

  // Avestruz sincronizada
  Network.onOstrichKill(({ idx } = {}) => { ostrichSystem.kill(idx ?? 0); Audio.ostrichCall(); });

  // Vacas — init with already-corralled state from server
  cowSystem = new CowSystem(scene);
  for (const id of (data.corralledCows ?? [])) cowSystem.corrall(id);
  UI.updateCorralCount(cowSystem.getCorralled());

  Network.onCowCorralled(({ id, total }) => {
    cowSystem?.corrall(id);
    UI.updateCorralCount(cowSystem?.getCorralled() ?? total);
    if (total === 33) Audio.victory(); else Audio.corralBell();
  });

  // Remote yells affect local cow simulation too
  Network.onYell(({ x, z }) => {
    cowSystem?.yell(x, z);
    UI.showYell(true);
  });

  // NPC dialogue resolution
  Network.onNpcResponse(({ type }) => {
    const reply = type === 'templo'
      ? '¿El templo Ror? Queda para el norte.'
      : 'Si no sabes dónde ir… todos los caminos son el correcto.';
    UI.showNPCResponse(reply, () => {
      _npcActive = false;
      _npcDone   = true;
      if (type === 'templo') UI.showNorthCompass();
    });
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
  const remoteDir = new THREE.Vector3(data.direction.x, data.direction.y, data.direction.z);
  spawnBullet(scene, data.origin, remoteDir, 0xff6644);
  // Silbido + impacto en tierra
  if (myId && controls) {
    const p = controls.getPosition();
    if (p) {
      const dx = p.x - data.origin.x, dz = p.z - data.origin.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 18) Audio.bulletWhiz();
    }
  }
  // Impacto en tierra ~200ms después (viaja a BULLET_SPEED)
  setTimeout(() => Audio.bulletImpactDirt(), 180 + Math.random() * 80);
});

Network.onPlayerHit((data) => {
  if (data.id === myId) {
    myData.hp = data.hp;
    UI.updateHP(myData.hp);
    UI.showDamageFlash();
    _aberration = 1.0;
    localPlayerModel?.detachHat();
    Audio.playerHurt();
    if (myData.hp <= 30) Audio.startHeartbeat();
    else Audio.stopHeartbeat();
  } else {
    remotePlayers.get(data.id)?.detachHat();
    remotePlayers.get(data.id)?.setHP(data.hp);
  }
  if (data.attackerId === myId) { UI.showHitmarker(); Audio.hitMarker(); Audio.bulletImpactFlesh(); }
});

Network.onPlayerKilled((data) => {
  UI.addKillMessage(data.killerName, data.victimName);
  // Animación de caída para el jugador/bot que muere
  if (data.victimId !== myId) {
    remotePlayers.get(data.victimId)?.startDying();
  }
  if (data.victimId === myId) {
    isDead = true;
    myData.deaths = data.victimDeaths;
    UI.updateScore(myData.kills, myData.deaths);
    UI.showDeathScreen();
    Audio.playerDeath();
    Audio.bodyFall();
    Audio.stopHeartbeat();
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
    Audio.stopHeartbeat();
    localPlayerModel?.respawnHat();
  } else {
    const pm = remotePlayers.get(data.id);
    if (pm) {
      pm.setTarget(data.x, data.y, data.z, 0);
      pm.respawnHat();
      pm.resetImpact();   // restore head/leg visibility, clear flying parts
    }
  }
});

// ── GM narration display ──────────────────────────────────────────────────────
Network.onGmMessage(({ text }) => {
  console.log('[GM]', text);
  const box = document.getElementById('gm-box');
  const txt = document.getElementById('gm-text');
  if (!box || !txt) { console.warn('[GM] no gm-box found in DOM'); return; }
  txt.textContent = text;
  box.style.cssText += ';display:flex !important;flex-direction:column;opacity:1;transition:opacity 0.6s;';
  clearTimeout(box._hideT);
  box._hideT = setTimeout(() => {
    box.style.opacity = '0';
    setTimeout(() => { box.style.display = 'none'; box.style.opacity = '1'; }, 650);
  }, 9000);
  Audio.gmBell();
  speakGm(text);
});

// ── GM commands from server ───────────────────────────────────────────────────
let _daySpeedMult = 1;  // default 1x

Network.onGmCommand((cmd) => {
  console.log('[GM CMD]', cmd);
  switch (cmd.type) {

    case 'set_time':
      setDayProgress(cmd.hour / 24);
      setTimeout(() => unlockDayProgress(), 8000); // resume after 8s
      break;

    case 'stampede':
      cowSystem?.yellAt(0, 0, 99999);
      chickenSystem?.yell(0, 0);
      Audio.stampedeRumble();
      break;

    case 'storm': {
      const t = cmd.intensity ?? 1;
      // Force dark sky + advance toward dusk-storm look
      setDayProgress(0.78 + Math.random() * 0.04);
      setTimeout(() => unlockDayProgress(), 20000);
      break;
    }

    case 'blood_moon':
      setDayProgress(0.01);           // deep night
      // Tint ambient red via hack: override fog color briefly
      scene.fog.color.setRGB(0.35, 0.02, 0.02);
      setTimeout(() => unlockDayProgress(), 30000);
      break;

    case 'fog':
      scene._fogOverride = true;
      scene.fog.near = 10;
      scene.fog.far  = Math.max(20, 120 * (1 - (cmd.density ?? 0.5)));
      setTimeout(() => { scene._fogOverride = false; }, 20000);
      break;

    case 'day_speed':
      _daySpeedMult = cmd.mult ?? 1;
      setTimeout(() => { _daySpeedMult = 1; }, 30000);
      break;

    case 'heal_all':
      if (myData) {
        myData.hp = Math.min(200, myData.hp + (cmd.amount ?? 100));
        UI.updateHP(myData.hp);
      }
      break;
  }
});

// ── Story NPCs (server-driven visible entities) ───────────────────────────────
const _storyNpcs = new Map(); // id → { group, labelDiv, bubbleDiv, walkT }

function _buildNpcGroup(color) {
  const group = new THREE.Group();
  const c   = new THREE.Color(color || '#8B7355');
  const mat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 });
  const drk = new THREE.MeshStandardMaterial({ color: c.clone().lerp(new THREE.Color(0x000000), 0.3), roughness: 0.9 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.42), mat);
  body.position.set(0, 0.6, 0); body.castShadow = true;

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.40, 0.40), mat.clone());
  head.position.set(0, 1.28, 0); head.castShadow = true;

  // Hat
  const brimGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.04, 8);
  const brim    = new THREE.Mesh(brimGeo, drk.clone());
  brim.position.set(0, 1.50, 0);
  const crownGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.22, 8);
  const crown    = new THREE.Mesh(crownGeo, drk.clone());
  crown.position.set(0, 1.63, 0);

  const legGeo = new THREE.BoxGeometry(0.22, 0.68, 0.22);
  const ll = new THREE.Mesh(legGeo, drk.clone()); ll.position.set(-0.16, -0.18, 0); ll.name = 'leg_l';
  const rl = new THREE.Mesh(legGeo, drk.clone()); rl.position.set( 0.16, -0.18, 0); rl.name = 'leg_r';

  group.add(body, head, brim, crown, ll, rl);
  return group;
}

function _npcLabelDiv(name) {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;z-index:90;pointer-events:none;font-family:"Share Tech Mono",monospace;font-size:10px;color:#d4aa60;letter-spacing:1px;text-shadow:0 0 4px rgba(0,0,0,0.9);transform:translateX(-50%);white-space:nowrap;';
  d.textContent = name;
  document.body.appendChild(d);
  return d;
}

function _npcBubbleDiv() {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;z-index:91;pointer-events:none;font-family:"Share Tech Mono",monospace;font-size:11px;color:#e8c870;background:rgba(6,3,1,0.88);border:1px solid #5a3a14;padding:6px 10px;max-width:220px;line-height:1.5;letter-spacing:0.5px;transform:translate(-50%,-100%);display:none;white-space:pre-wrap;box-shadow:0 0 12px rgba(180,130,40,0.15);';
  document.body.appendChild(d);
  return d;
}

Network.onNpcSpawned(({ id, name, x, z, color }) => {
  if (_storyNpcs.has(id)) return;
  const group    = _buildNpcGroup(color);
  group.position.set(x, 0, z);
  scene.add(group);
  const labelDiv  = _npcLabelDiv(name);
  const bubbleDiv = _npcBubbleDiv();
  _storyNpcs.set(id, { group, labelDiv, bubbleDiv, walkT: 0, name });
  console.log(`[NPC] Spawned "${name}" @(${x.toFixed(1)},${z.toFixed(1)})`);
});

Network.onNpcMoved(({ id, x, z }) => {
  const npc = _storyNpcs.get(id);
  if (!npc) return;
  const prev = npc.group.position.clone();
  npc.group.position.set(x, 0, z);
  // Face movement direction
  const dx = x - prev.x, dz = z - prev.z;
  if (Math.abs(dx) + Math.abs(dz) > 0.01) npc.group.rotation.y = Math.atan2(dx, dz);
});

Network.onNpcDialogue(({ id, name, text }) => {
  const npc = _storyNpcs.get(id);
  // Mostrar en gm-box
  const box = document.getElementById('gm-box');
  const txt = document.getElementById('gm-text');
  if (box && txt) {
    txt.textContent = `${name}: "${text}"`;
    box.style.cssText += ';display:flex !important;flex-direction:column;opacity:1;transition:opacity 0.6s;';
    clearTimeout(box._hideT);
    box._hideT = setTimeout(() => {
      box.style.opacity = '0';
      setTimeout(() => { box.style.display = 'none'; box.style.opacity = '1'; }, 650);
    }, 9000);
  }
  // Burbuja sobre el NPC
  if (npc) {
    npc.bubbleDiv.textContent = `"${text}"`;
    npc.bubbleDiv.style.display = 'block';
    clearTimeout(npc._hideB);
    npc._hideB = setTimeout(() => { npc.bubbleDiv.style.display = 'none'; }, 9000);
  }
  // Voz robótica — habla el texto del NPC
  speakNpc(text);
});

Network.onNpcRemoved(({ id }) => {
  const npc = _storyNpcs.get(id);
  if (!npc) return;
  scene.remove(npc.group);
  npc.labelDiv.remove();
  npc.bubbleDiv.remove();
  _storyNpcs.delete(id);
});

// --- Shooting (left-click — no right-click required) ---
renderer.domElement.addEventListener('mousedown', (e) => {
  if (e.button !== 0 || isDead || !myId) return;

  // === COMIDA: click izquierdo con food seleccionado → comer ===
  if (currentWeapon === 'food') {
    const item = Inventory.removeSelected();
    if (item) {
      restoreHunger(item.hunger);
      myData.hp = Math.min(200, myData.hp + item.hp);
      UI.updateHP(myData.hp);
      UI.showEatEffect();
      Audio.eatSound();
      _updateInventoryHUD();
    }
    return;
  }

  // === LAZO ===
  if (currentWeapon === 'lasso') {
    if (lassoSystem.isCaught() || lassoSystem._state === 'flying') return;
    lassoSystem.startCharge();
    Audio.startLassoSpin();
    return;
  }

  // === ESCOPETA — left-click always shoots, no right-click hold needed ===
  Audio.shotgun();
  try {
  const pos    = controls.getPosition();
  const riderY = horseManager?.isMounted() ? (horseManager.getRiderY() ?? 1.75) : pos.y;
  const gunY   = riderY + 0.55;
  const fp     = localPlayerModel?.getFirepointWorldPos();
  const origin = fp ? { x: fp.x, y: fp.y, z: fp.z } : null;
  const dir    = controls.getFreshAimDirection(gunY);
  const result = tryShoot(pos, dir, remotePlayers, performance.now() / 1000, gunY, origin);
  if (!result) return;
  controls.applyRecoil();
  localPlayerModel?.triggerGunRecoil();
  localPlayerModel?.emitMuzzleSmoke(dir.x, dir.z);
  muzzleFlash(scene, result.origin, dir);

  // ── Camera-ray hitscan — SAME ray used by red crosshair ────────────────────
  // If crosshair is red, hit is guaranteed.
  const ray = controls.getCameraRaycaster();
  const allHitboxes = [];
  const infoMap = new Map();

  for (const [id, pm] of remotePlayers) {
    for (const hb of pm.getHitboxes()) {
      allHitboxes.push(hb);
      infoMap.set(hb.uuid, { id, type: 'player' });
    }
  }
  if (cowSystem) {
    for (const hb of cowSystem.getCowHitboxes()) {
      const cowId = cowSystem.getCowIdByHitbox(hb);
      if (cowId >= 0) { allHitboxes.push(hb); infoMap.set(hb.uuid, { id: cowId, type: 'cow' }); }
    }
  }
  for (const hb of ostrichSystem.getHitboxes()) {
    const oIdx = ostrichSystem.getIndexByHitbox(hb);
    if (oIdx >= 0) { allHitboxes.push(hb); infoMap.set(hb.uuid, { id: oIdx, type: 'ostrich' }); }
  }
  for (const hb of chickenSystem.getHitboxes()) {
    const cIdx = chickenSystem.getIdByHitbox(hb);
    if (cIdx >= 0) { allHitboxes.push(hb); infoMap.set(hb.uuid, { id: cIdx, type: 'chicken' }); }
  }
  for (const hb of birdSystem.getHitboxes()) {
    const bird = birdSystem.getBirdByHitbox(hb);
    if (bird) { allHitboxes.push(hb); infoMap.set(hb.uuid, { id: bird, type: 'bird' }); }
  }

  const scanHit = hitscan(ray, allHitboxes, infoMap);

  // ── Visual bullet — travels toward hit point (or in flat aim dir if miss) ──
  const gunVec = new THREE.Vector3(result.origin.x, result.origin.y, result.origin.z);
  let bulletDir3D, bulletMaxDist;
  if (scanHit) {
    bulletDir3D   = new THREE.Vector3().subVectors(scanHit.point, gunVec).normalize();
    // Use GUN→hitpoint distance (not camera→hitpoint) so bullet stops at the right place
    const gunDist = gunVec.distanceTo(scanHit.point);
    bulletMaxDist = gunDist + 0.2;   // barely past impact — no overshoot
  } else {
    bulletDir3D   = new THREE.Vector3(result.direction.x, -gunY * 0.04, result.direction.z).normalize();
    bulletMaxDist = BULLET_RANGE;
  }
  spawnBullet(scene, result.origin, bulletDir3D, 0xffff00, bulletMaxDist);

  // ── Delayed damage — timed from GUN origin to hit point ────────────────────
  if (scanHit) {
    const gunDist  = gunVec.distanceTo(scanHit.point);
    const travelMs = Math.max(30, (gunDist / BULLET_SPEED) * 1000);

    // Determine hit zone for local impact visuals (purely decorative, no network)
    let hitZone = 'body';
    if (scanHit.target.type === 'player') {
      const hitName = scanHit.hitObject?.name ?? '';
      if (hitName === 'head') {
        hitZone = 'head';
      } else {
        const pm = remotePlayers.get(scanHit.target.id);
        const baseY = pm ? pm.group.position.y : 0;
        hitZone = (scanHit.point.y - baseY < 0.5) ? 'leg' : 'body';
      }
    } else if (scanHit.target.type === 'cow') {
      // Cow at scale 1.4: head ~y>1.5, leg ~y<0.65
      hitZone = scanHit.point.y > 1.5 ? 'head' : (scanHit.point.y < 0.65 ? 'leg' : 'body');
    } else if (scanHit.target.type === 'ostrich') {
      // Ostrich: head ~y>1.8, leg ~y<0.65
      hitZone = scanHit.point.y > 1.8 ? 'head' : (scanHit.point.y < 0.65 ? 'leg' : 'body');
    } else if (scanHit.target.type === 'chicken') {
      // Chicken small: head ~y>0.30, leg ~y<0.12
      hitZone = scanHit.point.y > 0.30 ? 'head' : (scanHit.point.y < 0.12 ? 'leg' : 'body');
    }

    setTimeout(() => {
      // Sonido de impacto en carne para cualquier entidad viva
      if (['player','cow','ostrich','chicken','bird'].includes(scanHit.target.type)) {
        Audio.bulletImpactFlesh();
      }

      if (scanHit.target.type === 'player') {
        Network.sendBulletHit(scanHit.target.id);
        remotePlayers.get(scanHit.target.id)?.applyImpact(hitZone, scanHit.point);
      }
      else if (scanHit.target.type === 'bird') {
        birdSystem.hitBird(scanHit.target.id);
        Network.sendGameEvent('animal_killed', { detail: `Un pájaro cayó abatido del cielo.` });
      }
      else if (scanHit.target.type === 'cow') {
        const cowBefore = cowSystem?._cows[scanHit.target.id];
        const hpBefore = cowBefore?.hp ?? 2;
        cowSystem?.hitCow(scanHit.target.id, scanHit.point, hitZone);
        const cowAfter = cowSystem?._cows[scanHit.target.id];
        if (cowAfter?.wounded && hpBefore > 1)
          Network.sendGameEvent('animal_wounded', { detail: `Una vaca quedó herida y se arrastra por la pampa.` });
        else if (cowAfter?.removed || (cowAfter?.hp ?? 2) <= 0)
          Network.sendGameEvent('animal_killed', { detail: `Una vaca fue abatida. La carne cae al pasto.` });
      }
      else if (scanHit.target.type === 'ostrich') {
        const oIdx = scanHit.target.id;
        const eBefore = ostrichSystem._entities[oIdx];
        const hpBefore = eBefore?.hp ?? 2;
        ostrichSystem.hit(oIdx, scanHit.point, hitZone);
        const eAfter = ostrichSystem._entities[oIdx];
        if (eAfter?.wounded && hpBefore > 1)
          Network.sendGameEvent('animal_wounded', { detail: `Un avestruz herido corre en círculos por el campo.` });
        else if (eAfter?.dead || eAfter?.dying)
          Network.sendGameEvent('animal_killed', { detail: `Un avestruz cayó. Sus plumas vuelan en el viento pampeano.` });
        if (eAfter && (eAfter.wounded || eAfter.dying || eAfter.dead)) Network.sendOstrichKill(oIdx);
      }
      else if (scanHit.target.type === 'chicken') {
        chickenSystem.hit(scanHit.target.id, scanHit.point, hitZone);
        Network.sendGameEvent('animal_killed', { detail: `Una gallina explotó en plumas. El olor a asado flota en el aire.` });
      }
    }, travelMs);
  } else {
    // Miss → impacto en tierra
    const missDist = BULLET_RANGE;
    const missMs   = Math.max(80, (missDist / BULLET_SPEED) * 1000 * 0.6);
    setTimeout(() => Audio.bulletImpactDirt(), missMs);
  }

  // Broadcast shot visual to other clients
  Network.sendShoot(result);

  // Bottle physics — 3D line-distance check (works at any height, very forgiving)
  const bottleMeshes = getBottleMeshes();
  if (bottleMeshes.length > 0) {
    const gunPos = new THREE.Vector3(result.origin.x, result.origin.y, result.origin.z);
    const lineDir = new THREE.Vector3(result.direction.x, 0, result.direction.z).normalize();
    let closest = null, closestT = Infinity;
    const bWP = new THREE.Vector3();
    const _bbox = new THREE.Box3();
    for (const bMesh of bottleMeshes) {
      bMesh.updateWorldMatrix(true, false);
      // Use bounding-box center so pivot offset doesn't matter
      _bbox.setFromObject(bMesh);
      _bbox.getCenter(bWP);
      const proj = new THREE.Vector3(bWP.x - gunPos.x, 0, bWP.z - gunPos.z).dot(lineDir);
      if (proj < 0 || proj > 80) continue;
      const nearX = gunPos.x + lineDir.x * proj;
      const nearZ = gunPos.z + lineDir.z * proj;
      // XZ-only lateral distance — ignores height so pivot y doesn't matter
      const lateralDist = Math.sqrt((bWP.x - nearX) ** 2 + (bWP.z - nearZ) ** 2);
      if (lateralDist < 1.5 && proj < closestT) { closest = bMesh; closestT = proj; }
    }
    if (closest) {
      hitBottle(closest, result.direction);
      const key = getBottleKey(closest);
      if (key) Network.sendBottleHit(key, result.direction);
    }
  }
  } catch (err) {
    console.error('[DISPARO ERROR]', err);
  }
});

// Right-click: while caught → reel in (hold); otherwise release lasso
renderer.domElement.addEventListener('mousedown', (e) => {
  if (e.button === 2 && currentWeapon === 'lasso') {
    if (lassoSystem.isCaught()) {
      lassoSystem.startReel();
    } else {
      lassoSystem.release();
    }
  }
});
renderer.domElement.addEventListener('mouseup', (e) => {
  if (e.button === 2) lassoSystem.stopReel();
});

renderer.domElement.addEventListener('mouseup', (e) => {
  if (e.button !== 0) return;
  if (currentWeapon === 'lasso') {
    if (lassoSystem._state === 'charging') {
      // Release charge → throw lasso toward mouse cursor
      const pos    = controls.getPosition();
      const riderY = horseManager?.isMounted() ? (horseManager.getRiderY() ?? 1.75) : pos.y;
      const gunY   = riderY + 0.55;
      const fp     = localPlayerModel?.getFirepointWorldPos();
      const origin = fp
        ? new THREE.Vector3(fp.x, fp.y, fp.z)
        : new THREE.Vector3(pos.x, gunY, pos.z);
      const dir = controls.getFreshAimDirection(gunY);
      Audio.stopLassoSpin();
      Audio.lassoThrow();
      lassoSystem.releaseCharge(origin, dir);
    }
  }
});

// ── Inventario HUD ────────────────────────────────────────────────────────────
const _invHud = document.createElement('div');
_invHud.style.cssText = [
  'position:fixed', 'bottom:28px', 'right:16px', 'z-index:200',
  'display:none', 'gap:6px', 'flex-direction:row', 'align-items:center',
  'font-family:"Share Tech Mono",monospace',
].join(';');
document.body.appendChild(_invHud);

function _updateInventoryHUD() {
  const counts  = Inventory.getCounts();
  const sel     = Inventory.getSelected();
  const defs    = Inventory.FOOD_DEFS;
  const total   = Inventory.getTotal();
  if (total === 0) { _invHud.style.display = 'none'; return; }
  _invHud.style.display = 'flex';
  _invHud.innerHTML = Object.entries(defs).map(([type, def]) => {
    const n   = counts[type];
    if (n === 0) return '';
    const act = type === sel;
    return `<div style="
      background:${act ? 'rgba(200,160,50,0.80)' : 'rgba(0,0,0,0.55)'};
      border:1px solid ${act ? '#f0c040' : 'rgba(255,255,255,0.15)'};
      border-radius:5px; padding:3px 8px; font-size:13px; color:#fff;
      cursor:default; white-space:nowrap;
    ">${def.icon} <b>${n}</b></div>`;
  }).join('');
}

// ── Comida tirada al suelo ─────────────────────────────────────────────────────
const _thrownFoods = [];

function _throwFood(pos) {
  const item = Inventory.removeSelected();
  if (!item) return;
  _updateInventoryHUD();

  const geo  = new THREE.BoxGeometry(0.28, 0.12, 0.28);
  const col  = item.type === 'chicken' ? 0xd4884a : (item.type === 'ostrich' ? 0xc8a050 : 0x8b2a0a);
  const mat  = new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;

  const rot   = controls.getRotation();
  const fwdX  = Math.sin(rot.y);
  const fwdZ  = Math.cos(rot.y);
  mesh.position.set(pos.x + fwdX * 1.8, 0.08, pos.z + fwdZ * 1.8);
  scene.add(mesh);

  _thrownFoods.push({ mesh, item, throwerId: myId, age: 0 });
  Audio.eatSound();
}

// --- Game loop ---
const clock    = new THREE.Clock();
const SEND_RATE = 1 / 20;
let sendTimer  = 0;

// ── Timers de sonido ambiente ─────────────────────────────────────────────────
let _prevWalkTime = -1;          // fase de animación para pisadas
let _moooTimer    = 8 + Math.random() * 12;   // mugido random
let _coyoteTimer   = 30 + Math.random() * 60;
let _thunderTimer  = 45 + Math.random() * 90;  // trueno lejano ocasional
let _chickenTimer  = 6  + Math.random() * 10;  // cloqueo idle
let _snortTimer    = 12 + Math.random() * 18;  // resoplido caballo montado
let _woodTimer     = 20 + Math.random() * 30;  // crujido de edificio
let _sprintBreath  = 0;
let _wasNight      = false;
let _wasDawn       = false;   // para pajaros al amanecer
let _wasInAir      = false;

function gameLoop() {
  requestAnimationFrame(gameLoop);
  const dt = Math.min(clock.getDelta(), 0.1);

  let pos = null;
  if (!isDead && myId) {
    const _onHorse = horseManager?.isMounted() ?? false;
    controls.update(dt, colliders, horseManager?.speedMultiplier(controls.isSprinting()) ?? (controls.isSprinting() ? 1.9 : 1.0), _onHorse);

    pos = controls.getPosition();
    const rot = controls.getRotation();

    // Chunk streaming
    chunkManager.update(pos);

    // Shadow follows player — sun moves on a day arc (east at dawn, west at dusk)
    const _sunOff = getSunOffset();
    sun.position.set(pos.x + _sunOff.x, _sunOff.y, pos.z + _sunOff.z);
    sun.target.position.set(pos.x, 0, pos.z);
    sun.target.updateMatrixWorld();
    sun.shadow.camera.updateProjectionMatrix();
    sun.target.updateMatrixWorld();

    // Moon follows player (opposite offset to sun) so shadow frustum always covers local area
    moon.position.set(pos.x - 80, 30, pos.z - 20);
    moon.target.position.set(pos.x, 0, pos.z);
    moon.target.updateMatrixWorld();

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

    // Local player model — smooth rotation (snaps when aiming so gun always tracks mouse)
    const rawFacing = controls.isAiming() ? rot.y : controls.getMovementAngle();
    if (controls.isAiming()) {
      _facingAngle = rawFacing;                 // snap to mouse — no lag when shooting
    } else {
      let _fd = rawFacing - _facingAngle;
      while (_fd >  Math.PI) _fd -= Math.PI * 2;
      while (_fd < -Math.PI) _fd += Math.PI * 2;
      _facingAngle += _fd * Math.min(1, 12 * dt); // smooth turn when walking
    }
    const facingAngle = _facingAngle;
    localPlayerModel?.setAiming(controls.isAiming());
    if (localPlayerModel) {
      // Y: mount/dismount anim → lomo world-space (localToWorld) → salto → suelo
      const animY   = horseManager?.getAnimY();
      const mounted = horseManager?.isMounted() ?? false;
      const saddlePos = mounted ? horseManager.getSaddleWorldPos() : null;
      const riderY  = animY != null
        ? animY
        : saddlePos != null
          ? saddlePos.y + pos.y    // lomo real (roll + bob incluidos) + salto sobre caballo
          : pos.y;                 // salto normal en suelo

      // XZ: arc from player pos → horse on mount, horse → landing on dismount
      const mountXZ    = horseManager?.getMountModelPos();
      const dismountXZ = horseManager?.getDismountModelPos(pos);
      const overrideXZ = mountXZ ?? dismountXZ;
      const modelX = overrideXZ ? overrideXZ.x : pos.x;
      const modelZ = overrideXZ ? overrideXZ.z : pos.z;

      localPlayerModel.group.position.set(modelX, riderY, modelZ);
      localPlayerModel.group.rotation.y = facingAngle;
      // Roll lateral: el player se inclina con el caballo
      if (mounted) {
        localPlayerModel.group.rotation.z = horseManager.getHorseRoll();
      } else if (!localPlayerModel._dying) {
        localPlayerModel.group.rotation.z = 0;
      }
    }

    UI.updateCoords(pos.x, pos.z);

    // ── NPC proximity trigger ──────────────────────────────────────────────
    if (!_npcDone && !_npcActive) {
      const ndx = pos.x - NPC_POSITION.x;
      const ndz = pos.z - NPC_POSITION.z;
      if (ndx * ndx + ndz * ndz < 6 * 6) {
        _npcActive = true;
        UI.showNPCDialogue('¿Y ustedes? ¿Qué hace la gente de ciudad en un lugar tan lejano?');
        setTimeout(() => {
          UI.showNPCChoices((choice) => {
            Network.sendNpcChoice(choice);
            UI.showNPCWaiting();
          });
        }, 2200);
      }
    }

    sendTimer += dt;
    if (sendTimer >= SEND_RATE) {
      sendTimer = 0;
      Network.sendMove({ x: pos.x, y: pos.y, z: pos.z, rx: rot.x, ry: facingAngle });
    }
  }

  for (const [, pm] of remotePlayers) pm.update(dt);
  localPlayerModel?.setRiding(horseManager?.isMounted() ?? false);
  if (localPlayerModel && pos) {
    const _vx = controls._velX ?? 0, _vz = controls._velZ ?? 0;
    const spd  = Math.hypot(_vx, _vz);
    const extMoving    = spd > 0.15;
    // Fracción real de velocidad (0-1) para ease-out suave de animación
    const speedFrac    = Math.min(1, spd / 10.0);
    // Backward: dot entre dir movimiento y dir facing (forward = +Z local)
    const ry   = localPlayerModel.group.rotation.y;
    const fwdX = Math.sin(ry), fwdZ = Math.cos(ry);
    const dot  = (_vx * fwdX + _vz * fwdZ);   // positivo = adelante, negativo = atrás
    const extBackward  = extMoving && dot < -0.1;
    const extSprinting = controls.isSprinting() && extMoving;
    localPlayerModel.setMovement(extMoving, extBackward, extSprinting, speedFrac);
  }
  localPlayerModel?.setHunger(getHunger());
  localPlayerModel?.setHP(myData?.hp ?? 200);
  localPlayerModel?.update(dt);
  updateLandmarkEffects(dt, pos, horseManager?.isMounted() ? pos : null);
  const _onFoot = pos && !(horseManager?.isMounted());
  const _footPos = (_onFoot && (controls._velX || controls._velZ)) ? pos : null;
  hoofprints.update(horseManager?.horses ?? new Map(), dt, _footPos);
  updateBullets(scene, dt);

  // ── Comida tirada — detectar pickup por otro jugador (o por el mismo tras delay) ──
  for (let i = _thrownFoods.length - 1; i >= 0; i--) {
    const tf = _thrownFoods[i];
    tf.age += dt;
    if (!pos || tf.age < 1.0) continue;  // 1s de gracia antes de que se pueda recoger
    const dx = pos.x - tf.mesh.position.x;
    const dz = pos.z - tf.mesh.position.z;
    if (dx * dx + dz * dz < 2.5 * 2.5) {
      // El mismo jugador la recoge (en modo solo) — en multijugador: otro jugador
      if (Inventory.add(tf.item.type, tf.item.hunger, tf.item.hp)) _updateInventoryHUD();
      scene.remove(tf.mesh);
      tf.mesh.geometry.dispose(); tf.mesh.material.dispose();
      _thrownFoods.splice(i, 1);
    }
  }

  // ── Lazo ─────────────────────────────────────────────────────────────────
  if (lassoSystem.isActive() && pos) {
    const riderY = horseManager?.isMounted() ? (horseManager.getRiderY() ?? 1.75) : pos.y;
    const gunY   = riderY + 0.55;
    const fp     = localPlayerModel?.getFirepointWorldPos();
    const gunPos = fp
      ? new THREE.Vector3(fp.x, fp.y, fp.z)
      : new THREE.Vector3(pos.x, gunY, pos.z);
    lassoSystem.update(dt, gunPos, cowSystem, ostrichSystem, remotePlayers);
  }

  // ── Gallinas ──────────────────────────────────────────────────────────────
  if (myId && !isDead) {
    const ppList = pos ? [{ x: pos.x, z: pos.z }] : [];
    for (const [, pm] of remotePlayers) ppList.push({ x: pm.group.position.x, z: pm.group.position.z });
    const _openGates = new Set(villageGates.filter(g => g.isOpen).map(g => `${Math.round(g.cx)},${Math.round(g.gateZ)}`));
    const chickenPickup = chickenSystem.update(dt, ppList, _openGates);
    if (chickenPickup && pos && !isDead) {
      if (Inventory.add('chicken', chickenPickup.hunger, chickenPickup.hp)) _updateInventoryHUD();
    }
  }

  // ── Puertas de corrales — animación suave ────────────────────────────────
  for (const gate of villageGates) {
    if (gate.animT !== gate.animTarget) {
      gate.animT += (gate.animTarget - gate.animT) * Math.min(1, 7 * dt);
      if (Math.abs(gate.animT - gate.animTarget) < 0.005) gate.animT = gate.animTarget;
      gate.panel.rotation.y = gate.animT * -Math.PI / 2;
    }
  }

  // ── Almas + campesinos ───────────────────────────────────────────────────
  const _hour = Math.floor(getDayProgress() * 24);
  soulSystem.update(dt, _hour);
  campesinoSystem.update(dt, pos, soulSystem.units);

  // ── Avestruz + churrascos ────────────────────────────────────────────────
  const pickup = ostrichSystem.update(dt, pos);
  if (pickup && myId && !isDead) {
    if (Inventory.add('ostrich', pickup.hunger, pickup.hp)) _updateInventoryHUD();
  }

  // ── Carne de vaca ─────────────────────────────────────────────────────────
  if (cowSystem && myId && !isDead && pos) {
    const meatPickup = cowSystem.updateMeats(dt, pos);
    if (meatPickup) {
      if (Inventory.add('beef', meatPickup.hunger, meatPickup.hp)) _updateInventoryHUD();
    }
  }

  // ── Vacas ─────────────────────────────────────────────────────────────────
  if (cowSystem && myId && !isDead && pos) {
    // Collect all player positions for flee detection
    const playerPositions = [{ x: pos.x, z: pos.z }];
    for (const [, pm] of remotePlayers) {
      playerPositions.push({ x: pm.group.position.x, z: pm.group.position.z });
    }
    const _cowOpenGates = new Set(villageGates.filter(g => g.isOpen).map(g => `${Math.round(g.cx)},${Math.round(g.gateZ)}`));
    const newlyCorralled = cowSystem.update(dt, playerPositions, _cowOpenGates);
    for (const id of newlyCorralled) {
      cowSystem.corrall(id);
      Network.sendCowCorralled(id);
    }
    UI.updateStableWaypoint(pos.x, pos.z);
  }

  // ── Crosshair color: roja si hay blanco bajo la mira (siempre activo) ──────
  if (myId && !isDead && pos) {
    const cr = controls.getCameraRaycaster();
    const chTargets = [];
    for (const [, pm] of remotePlayers) chTargets.push(...pm.getHitboxes());
    if (cowSystem) chTargets.push(...cowSystem.getCowHitboxes());
    chTargets.push(...ostrichSystem.getHitboxes());
    chTargets.push(...chickenSystem.getHitboxes());
    const chHit = chTargets.length > 0 ? cr.intersectObjects(chTargets, false) : [];
    UI.setCrosshairColor(chHit.length > 0 ? '#ff2020' : null);
  }

  // ── Wind particles ─────────────────────────────────────────────────────
  windParticles.update(dt, pos);

  // ── Bird flocks ────────────────────────────────────────────────────────
  birdSystem.update(dt, pos);

  // ── Story NPC walk animation + 2D label projection ───────────────────────
  if (_storyNpcs.size > 0) {
    const W = window.innerWidth, H = window.innerHeight;
    const _v3 = new THREE.Vector3();
    for (const [, npc] of _storyNpcs) {
      npc.walkT = (npc.walkT || 0) + dt * 2.2;
      // Leg swing animation
      const ll = npc.group.getObjectByName('leg_l');
      const rl = npc.group.getObjectByName('leg_r');
      if (ll && rl) {
        ll.rotation.x =  Math.sin(npc.walkT) * 0.45;
        rl.rotation.x = -Math.sin(npc.walkT) * 0.45;
      }
      // Project world position → screen
      _v3.set(npc.group.position.x, npc.group.position.y + 2.1, npc.group.position.z);
      _v3.project(camera);
      if (_v3.z < 1) {
        const sx = ( _v3.x * 0.5 + 0.5) * W;
        const sy = (-_v3.y * 0.5 + 0.5) * H;
        npc.labelDiv.style.left  = `${sx}px`;
        npc.labelDiv.style.top   = `${sy}px`;
        npc.labelDiv.style.display = 'block';
        npc.bubbleDiv.style.left = `${sx}px`;
        npc.bubbleDiv.style.top  = `${sy - 8}px`;
      } else {
        npc.labelDiv.style.display  = 'none';
        npc.bubbleDiv.style.display = 'none';
      }
    }
  }

  // ── Day/Night + Survival HUD update ──────────────────────────────────────
  updateDayNight(dt * _daySpeedMult, scene, sun, ambient, moon);
  if (myId && !isDead) {
    updateSurvival(dt, controls.isSprinting(), horseManager?.isMounted() ?? false);
    UI.updateSurvivalUI(getHunger(), getThirst(), getTemperature());
    UI.updateGameTime(getGameTime(), isNight());
  }

  // ── Audio ambiente ────────────────────────────────────────────────────────
  if (myId && pos) {
    const onHorse  = horseManager?.isMounted() ?? false;
    const isMoving = Math.hypot(controls._velX ?? 0, controls._velZ ?? 0) > 0.4;
    const nightNow  = isNight();

    // Pasos — sincronizados con fase de animación de walk
    if (!onHorse && !isDead && localPlayerModel) {
      const _wAction = localPlayerModel._walkAction;
      const _wSpd    = localPlayerModel._walkSpd ?? 0;
      if (_wAction && _wSpd > 0.12) {
        const dur  = _wAction.getClip?.()?.duration ?? 0.8;
        const half = dur * 0.5;
        const curT = _wAction.time;
        const prevT = _prevWalkTime >= 0 ? _prevWalkTime : curT;
        // Detectar: cruce del punto medio O wrap de loop
        const wrapped  = prevT > curT + 0.01;           // el tiempo volvió atrás → loop
        const midCross = prevT < half && curT >= half;   // cruzó el punto medio
        if (wrapped || midCross) {
          // Pitch levemente más alto a mayor velocidad
          const pitch = 0.80 + _wSpd * 0.28 + (Math.random() - 0.5) * 0.10;
          Audio.footstep('sand', pitch);
        }
        _prevWalkTime = curT;
      } else {
        _prevWalkTime = -1;
      }
    } else {
      _prevWalkTime = -1;
    }

    // Cascos: sincronizados con animación vía horseManager.onHoofTouch

    // Noche: grillos on/off
    if (nightNow && !_wasNight)  { Audio.startCrickets(); Audio.stopBirds();  _wasNight = true;  _wasDawn = false; }
    if (!nightNow && _wasNight)  { Audio.stopCrickets();  _wasNight = false; }

    // Amanecer: pájaros (t ≈ 0.25 dawn)
    const dawn = getDayProgress() > 0.24 && getDayProgress() < 0.38;
    if (dawn && !_wasDawn)  { Audio.startBirds(); _wasDawn = true; }
    if (!dawn && _wasDawn)  { Audio.stopBirds();  _wasDawn = false; }

    // Mugido random de vaca
    _moooTimer -= dt;
    if (_moooTimer <= 0) {
      Audio.cowMoo(false);
      _moooTimer = 7 + Math.random() * 13;
    }

    // Aullido coyote (solo de noche)
    if (nightNow) {
      _coyoteTimer -= dt;
      if (_coyoteTimer <= 0) {
        Audio.coyoteHowl();
        _coyoteTimer = 35 + Math.random() * 55;
      }
    }

    // Trueno lejano (bajo, random, incluso sin tormenta)
    _thunderTimer -= dt;
    if (_thunderTimer <= 0) {
      if (Math.random() < 0.4) Audio.distantThunder();  // no siempre
      _thunderTimer = 40 + Math.random() * 80;
    }

    // Cloqueo gallina idle
    if (chickenSystem) {
      _chickenTimer -= dt;
      if (_chickenTimer <= 0) {
        Audio.chickenCluck();
        _chickenTimer = 5 + Math.random() * 9;
      }
    }

    // Crujido de madera (edificios)
    _woodTimer -= dt;
    if (_woodTimer <= 0) {
      Audio.woodCreak();
      _woodTimer = 18 + Math.random() * 28;
    }

    // Resoplido de caballo (cuando estás montado, idle)
    if (onHorse) {
      _snortTimer -= dt;
      if (_snortTimer <= 0) {
        Audio.horseSnort();
        _snortTimer = 10 + Math.random() * 16;
      }
    }

    // Jump landing
    const inAir = controls.isInAir?.() ?? false;
    if (_wasInAir && !inAir) Audio.jumpLand();
    _wasInAir = inAir;

    // Sprint breath — cada ~3s si corriendo
    if (isMoving && controls.isSprinting()) {
      _sprintBreath -= dt;
      if (_sprintBreath <= 0) {
        Audio.sprintExhale();
        _sprintBreath = 2.8 + Math.random() * 1.2;
      }
    } else {
      _sprintBreath = 0;
    }
  }

  _aberration = Math.max(0, _aberration - dt * 3.5);
  _fxPass.uniforms.aberration.value = _aberration;
  _composer.render();
  soulMap.draw();
}

// --- Lobby ---
UI.onPlay(() => startGame(UI.getNameInput() || 'Gaucho'));

// Música de lobby al primer click en cualquier parte
document.addEventListener('click', () => Audio.startLobbyMusic(), { once: true });

if (Network.getRoomId()) {
  const hintEl = document.querySelector('.lobby-hint');
  if (hintEl) hintEl.textContent = 'Te uniste a una sala. Ingresa tu nombre y presiona JUGAR';
}

// ── Time slider ───────────────────────────────────────────────────────────────
(function initTimeSlider() {
  const panel  = document.getElementById('time-panel');
  const slider = document.getElementById('time-slider');
  const label  = document.getElementById('time-label');
  const arcCvs = document.getElementById('sky-arc');
  if (!panel || !slider || !label || !arcCvs) return;

  const ctx = arcCvs.getContext('2d');
  const W = arcCvs.width, H = arcCvs.height;

  function drawArc(t) {
    ctx.clearRect(0, 0, W, H);
    // Horizon line
    ctx.strokeStyle = '#3a2808';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 12); ctx.lineTo(W, H - 12); ctx.stroke();

    // Arc path (semicircle)
    const cx = W / 2, cy = H - 12, r = W / 2 - 10;
    ctx.strokeStyle = '#2a1a06';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.stroke();

    // Sun position: t=0.25 dawn (left), t=0.5 noon (top), t=0.75 dusk (right)
    // Map t 0.25→0 to 1.0 (day arc). 0 or 1 = night (below horizon)
    const sunAngle = Math.PI - ((t - 0.25) / 0.5) * Math.PI; // 0.25→π, 0.5→π/2, 0.75→0
    const isDaySun = t >= 0.22 && t <= 0.80;
    const sx = cx + r * Math.cos(sunAngle);
    const sy = (cy - r * Math.sin(sunAngle));

    if (isDaySun) {
      ctx.fillStyle = '#f0e040';
      ctx.shadowColor = '#f0e040'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Moon: opposite of sun
    const moonAngle = sunAngle + Math.PI;
    const mx = cx + r * Math.cos(moonAngle);
    const my = cy - r * Math.sin(moonAngle);
    const isNightMoon = !isDaySun || t < 0.25 || t > 0.75;
    if (my < cy) { // above horizon
      ctx.fillStyle = '#c0c8e0';
      ctx.shadowColor = '#c0c8e0'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Time label on arc
    const hh = String(Math.floor(t * 24)).padStart(2, '0');
    const mm = String(Math.floor((t * 1440) % 60)).padStart(2, '0');
    label.textContent = `${hh}:${mm}`;
  }

  // Toggle with backtick key
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Backquote') return;
    const visible = panel.style.display !== 'none';
    panel.style.display = visible ? 'none' : 'flex';
    if (!visible) {
      // Sync slider to current game time
      const cur = getDayProgress();
      slider.value = Math.round(cur * 1440);
      drawArc(cur);
    }
  });

  let _dragging = false;
  slider.addEventListener('mousedown', () => { _dragging = true; });
  slider.addEventListener('mouseup',   () => { _dragging = false; unlockDayProgress(); });
  slider.addEventListener('input', () => {
    const t = slider.valueAsNumber / 1440;
    setDayProgress(t);
    drawArc(t);
  });

  // Live update arc while panel is open
  setInterval(() => {
    if (panel.style.display === 'none') return;
    if (_dragging) return;
    const t = getDayProgress();
    slider.value = Math.round(t * 1440);
    drawArc(t);
  }, 500);
})();

gameLoop();
