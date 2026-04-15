import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import localtunnel from 'localtunnel';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: '*' } });

if (IS_PROD) {
  // Serve static build
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_, res) => res.sendFile(path.join(distPath, 'index.html')));
} else {
  // Vite dev middleware
  const vite = await createViteServer({
    server: { middlewareMode: true, allowedHosts: 'all' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

// --- Game state ---
const rooms         = new Map();
const corralledCows = new Map();   // roomId → Set<cowId>
const roomMeta      = new Map();   // roomId → { seed, createdAt }

function getRoomMeta(roomId) {
  if (!roomMeta.has(roomId)) {
    // Seed determinístico derivado del roomId
    let h = 0x811c9dc5;
    for (let i = 0; i < roomId.length; i++) h = Math.imul(h ^ roomId.charCodeAt(i), 0x01000193) >>> 0;
    roomMeta.set(roomId, { seed: h, createdAt: Date.now() });
  }
  return roomMeta.get(roomId);
}

// ─── Bot system ───────────────────────────────────────────────────────────────
const BOTS_ENABLED       = false;            // ← set true to re-enable enemies
const BOT_SPEED          = 3.2;              // units/sec
const BOT_SHOOT_RANGE    = 32;               // units
const BOT_SHOOT_COOLDOWN = 1.8;              // seconds between shots
const BOT_WAVE_INTERVAL  = 3 * 60 * 1000;   // 3 minutes between waves
const FIRST_WAVE_DELAY   = 45 * 1000;        // 45 s para la primera oleada
const BOT_HP             = 50;               // vida de cada bot (2 disparos para matar)
const BOT_DT             = 0.10;             // server tick (10 Hz)
const BOT_COLORS         = ['#8B2200','#6B1800','#A03010','#7A2808','#5A1500'];
let   _botSeq            = 0;

const botWaveStates = new Map();   // roomId → { nextWave: timestamp }

function _spawnBotWave(roomId) {
  const room   = getRoom(roomId);
  const humans = [...room.values()].filter(p => !p.isBot && p.hp > 0);
  if (humans.length === 0) return;

  const n      = 3 + Math.floor(Math.random() * 5);   // 3–7 bots
  const anchor = humans[Math.floor(Math.random() * humans.length)];

  for (let i = 0; i < n; i++) {
    const botId = `bot_${++_botSeq}`;
    const angle = (Math.PI * 2 / n) * i + (Math.random() - 0.5) * 0.6;
    const dist  = 55 + Math.random() * 35;
    const bot = {
      id:    botId,
      name:  'ENEMIGO',
      color: BOT_COLORS[i % BOT_COLORS.length],
      x:     (anchor.x ?? 0) + Math.cos(angle) * dist,
      y:     0,
      z:     (anchor.z ?? 0) + Math.sin(angle) * dist,
      rx: 0, ry: 0,
      hp:     BOT_HP,
      kills:  0,
      deaths: 0,
      isBot:  true,
      _shootTimer: BOT_SHOOT_COOLDOWN * Math.random(),
    };
    room.set(botId, bot);
    io.to(roomId).emit('playerJoined', bot);
  }
  console.log(`[${roomId}] Bot wave: ${n} enemigos`);
}

// Bot AI tick — runs every 100 ms
setInterval(() => {
  if (!BOTS_ENABLED) return;
  for (const [roomId, room] of rooms) {
    const bots   = [...room.values()].filter(p => p.isBot  && p.hp > 0);
    const humans = [...room.values()].filter(p => !p.isBot && p.hp > 0);
    if (bots.length === 0 || humans.length === 0) continue;

    for (const bot of bots) {
      // Find nearest living human
      let target = null, nearestD = Infinity;
      for (const h of humans) {
        const d = Math.hypot(h.x - bot.x, h.z - bot.z);
        if (d < nearestD) { nearestD = d; target = h; }
      }
      if (!target) continue;

      const dx = target.x - bot.x, dz = target.z - bot.z;

      // Move toward target, stop at 5 units
      if (nearestD > 5) {
        const step = BOT_SPEED * BOT_DT / nearestD;
        bot.x += dx * step;
        bot.z += dz * step;
      }
      bot.ry = Math.atan2(dx, dz);

      // Shoot
      bot._shootTimer -= BOT_DT;
      if (bot._shootTimer <= 0 && nearestD <= BOT_SHOOT_RANGE) {
        bot._shootTimer = BOT_SHOOT_COOLDOWN + (Math.random() - 0.5) * 0.5;

        const origin    = { x: bot.x, y: 1.4, z: bot.z };
        const direction = { x: dx / nearestD, y: 0, z: dz / nearestD };

        // Visual: muzzle flash + bullet for all clients
        io.to(roomId).emit('playerShot', { id: bot.id, origin, direction });

        if (target.invincible) continue;
        target.hp -= 25;
        if (target.hp <= 0) {
          target.hp = 0;
          target.deaths += 1;
          bot.kills += 1;
          io.to(roomId).emit('playerKilled', {
            killerId:     bot.id,
            killerName:   bot.name,
            killerKills:  bot.kills,
            victimId:     target.id,
            victimName:   target.name,
            victimDeaths: target.deaths,
          });
          // Respawn human after 2s
          setTimeout(() => {
            if (room.has(target.id)) {
              const sp = randomSpawn();
              target.hp = 200; target.x = sp.x; target.y = sp.y; target.z = sp.z;
              io.to(roomId).emit('playerRespawned', { id: target.id, ...target });
            }
          }, 2000);
        } else {
          io.to(roomId).emit('playerHit', { id: target.id, hp: target.hp, attackerId: bot.id });
        }
      }

      // Broadcast bot position to all clients
      io.to(roomId).volatile.emit('playerMoved', {
        id: bot.id, x: bot.x, y: 0, z: bot.z, rx: 0, ry: bot.ry,
      });
    }
  }
}, BOT_DT * 1000);

// Wave spawner — checks every 30 s if it's time for a new wave
setInterval(() => {
  if (!BOTS_ENABLED) return;
  for (const [roomId, room] of rooms) {
    const humans = [...room.values()].filter(p => !p.isBot);
    if (humans.length === 0) continue;
    if (!botWaveStates.has(roomId)) {
      botWaveStates.set(roomId, { nextWave: Date.now() + FIRST_WAVE_DELAY });
      continue;
    }
    const state = botWaveStates.get(roomId);
    if (Date.now() >= state.nextWave) {
      _spawnBotWave(roomId);
      state.nextWave = Date.now() + BOT_WAVE_INTERVAL;
    }
  }
}, 30_000);

// ─── Server-authoritative creature simulation ─────────────────────────────────
// The server runs the AI loop at 10 Hz and broadcasts positions to all clients.
// Clients only render (no AI). This guarantees everyone sees the same world.

const roomCreatures = new Map(); // roomId → { vibora, armadillo, condor, rng, gaussian }

function _csWorldSpawns(count, worldR, seed) {
  const pts = [], side = Math.ceil(Math.sqrt(count * 1.5));
  const step = worldR * 2 / side;
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / side), col = i % side;
    const h1  = Math.abs(Math.sin((seed + i) * 127.1 + 311.7)) % 1;
    const h2  = Math.abs(Math.sin((seed + i) * 269.5 + 183.3)) % 1;
    pts.push({ x: -worldR + (col + 0.5 + (h1 - 0.5) * 0.6) * step, z: -worldR + (row + 0.5 + (h2 - 0.5) * 0.6) * step });
  }
  return pts;
}

const CS_CFGS = {
  vibora:    { count:28, hp:1, fleeRadius:8,  huntRadius:14, attackRadius:1.2, homeRadius:30,  respawnDelay:45,  soarHeight:undefined, ySpeed:undefined, states:{ wander:{ sigma:2.8, speed:1.6, wpRadius:[5,14],  timer:[3,7]  }, flee:{ sigma:4.5, speed:4.5, wpRadius:[12,22], timer:[3,6]  }, hunt:{ sigma:1.2, speed:3.5, wpRadius:[4,10],  timer:[4,9]  } }, tau:{ wander:0.3, flee:0.12, hunt:0.25 }, spawns: _csWorldSpawns(28,460,17) },
  armadillo: { count:22, hp:2, fleeRadius:5,  huntRadius:0,  attackRadius:0,   homeRadius:40,  respawnDelay:75,  soarHeight:undefined, ySpeed:undefined, states:{ wander:{ sigma:1.2, speed:1.0, wpRadius:[4,16],  timer:[4,10] }, flee:{ sigma:3.2, speed:4.5, wpRadius:[14,28], timer:[4,7]  }, hunt:{ sigma:1.2, speed:1.0, wpRadius:[4,16],  timer:[4,10] } }, tau:{ wander:0.55,flee:0.15, hunt:0.55 }, spawns: _csWorldSpawns(22,480,31) },
  condor:    { count:12, hp:2, fleeRadius:7,  huntRadius:60, attackRadius:3,   homeRadius:120, respawnDelay:120, soarHeight:11,         ySpeed:1.8,        states:{ wander:{ sigma:2.5, speed:5.0, wpRadius:[30,80], timer:[6,14] }, flee:{ sigma:4.0, speed:9.0, wpRadius:[30,60], timer:[4,7]  }, hunt:{ sigma:0.8, speed:6.0, wpRadius:[10,30], timer:[8,16] } }, tau:{ wander:0.8, flee:0.18, hunt:0.5  }, spawns: _csWorldSpawns(12,600,43) },
};

function _csInitSpecies(cfg, rng) {
  const entities = [];
  for (let i = 0; i < cfg.count; i++) {
    const sp = cfg.spawns[i % cfg.spawns.length];
    const sx = sp.x + (rng() - 0.5) * 6, sz = sp.z + (rng() - 0.5) * 6;
    entities.push({ idx:i, x:sx, z:sz, spawnX:sx, spawnZ:sz, vx:0, vz:0, speed:0, moving:false, hp:cfg.hp, state:'wander', waypoint:{x:sx, z:sz}, wpTimer:rng()*3, panicTimer:0, dead:false, removeTimer:0 });
  }
  return entities;
}

function _csGetRoom(roomId) {
  if (roomCreatures.has(roomId)) return roomCreatures.get(roomId);
  const meta = getRoomMeta(roomId);
  let s = (meta.seed | 0) || 12345;
  function rng() {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function gaussian() {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  const rc = {
    rng, gaussian,
    vibora:    { entities: _csInitSpecies(CS_CFGS.vibora,    rng), cfg: CS_CFGS.vibora    },
    armadillo: { entities: _csInitSpecies(CS_CFGS.armadillo, rng), cfg: CS_CFGS.armadillo },
    condor:    { entities: _csInitSpecies(CS_CFGS.condor,    rng), cfg: CS_CFGS.condor    },
  };
  roomCreatures.set(roomId, rc);
  return rc;
}

function _csStep(entities, cfg, dt, rng, gaussian, players) {
  for (const e of entities) {
    if (e.dead) {
      e.removeTimer -= dt;
      if (e.removeTimer <= 0) {
        const sp = cfg.spawns[e.idx % cfg.spawns.length];
        const sx = sp.x + (rng() - 0.5) * 6, sz = sp.z + (rng() - 0.5) * 6;
        e.x = sx; e.z = sz; e.spawnX = sx; e.spawnZ = sz;
        e.vx = 0; e.vz = 0; e.speed = 0; e.moving = false; e.hp = cfg.hp;
        e.state = 'wander'; e.waypoint = { x: sx, z: sz };
        e.wpTimer = rng() * 3; e.panicTimer = 0; e.dead = false; e.removeTimer = 0;
      }
      continue;
    }

    let nextState = e.state;
    if (e.panicTimer > 0) { e.panicTimer -= dt; if (e.panicTimer <= 0 && nextState === 'flee') nextState = 'wander'; }

    for (const p of (players || [])) {
      const dx = e.x - p.x, dz = e.z - p.z, d2 = dx*dx + dz*dz, fr = cfg.fleeRadius ?? 4;
      if (d2 < fr * fr) {
        nextState = 'flee'; e.panicTimer = 4.0;
        const d = Math.sqrt(d2) || 1, wr = cfg.states?.flee?.wpRadius ?? [15,30], r = wr[0] + rng()*(wr[1]-wr[0]);
        e.waypoint.x = e.x + (dx/d)*r; e.waypoint.z = e.z + (dz/d)*r;
        const ts = cfg.states?.flee?.timer ?? [3,6]; e.wpTimer = ts[0] + rng()*(ts[1]-ts[0]);
        break;
      }
    }

    e.state = nextState;
    const sKey = nextState === 'flee' ? 'flee' : nextState === 'hunt' ? 'hunt' : 'wander';
    const sp   = cfg.states?.[sKey] ?? cfg.states?.wander ?? { sigma:1.5, speed:1.0, wpRadius:[5,15], timer:[3,8] };

    e.wpTimer -= dt;
    const wpDx = e.waypoint.x - e.x, wpDz = e.waypoint.z - e.z;
    const wpDist = Math.sqrt(wpDx*wpDx + wpDz*wpDz);

    if (e.wpTimer <= 0 || (wpDist < 1.2 && nextState !== 'hunt')) {
      const wr = sp.wpRadius, r = wr[0] + rng()*(wr[1]-wr[0]);
      let ang = rng() * Math.PI * 2;
      if (nextState === 'wander') {
        const hdx = e.spawnX - e.x, hdz = e.spawnZ - e.z;
        if (Math.sqrt(hdx*hdx + hdz*hdz) > (cfg.homeRadius ?? 25)) ang = Math.atan2(hdz, hdx) + (rng()-0.5)*0.8;
      }
      e.waypoint.x = e.x + Math.cos(ang)*r; e.waypoint.z = e.z + Math.sin(ang)*r;
      const ts = sp.timer; e.wpTimer = ts[0] + rng()*(ts[1]-ts[0]);
    }

    const wl = Math.sqrt(wpDx*wpDx + wpDz*wpDz) || 1;
    const sig = sp.sigma * Math.sqrt(dt);
    let tvx = (wpDx/wl)*sp.speed + gaussian()*sig, tvz = (wpDz/wl)*sp.speed + gaussian()*sig;
    const spd2 = Math.sqrt(tvx*tvx + tvz*tvz); if (spd2 > sp.speed*1.5) { tvx = tvx/spd2*sp.speed*1.5; tvz = tvz/spd2*sp.speed*1.5; }
    const tau = cfg.tau?.[sKey] ?? 0.35, alpha = 1 - Math.exp(-dt/tau);
    e.vx += (tvx - e.vx) * alpha; e.vz += (tvz - e.vz) * alpha;
    e.x += e.vx*dt; e.z += e.vz*dt;
    e.speed = Math.sqrt(e.vx*e.vx + e.vz*e.vz); e.moving = e.speed > 0.15;

    if (cfg.soarHeight !== undefined) {
      if (e.y === undefined) e.y = cfg.soarHeight;
      const wd = Math.sqrt((e.waypoint.x-e.x)**2 + (e.waypoint.z-e.z)**2);
      e.targetY = (nextState === 'hunt' && wd < 18) ? Math.max(0.4, wd*0.04) : cfg.soarHeight;
      e.y += ((e.targetY ?? cfg.soarHeight) - e.y) * Math.min(1, dt*(cfg.ySpeed ?? 2.5));
    }
  }
}

// 10 Hz broadcast loop
setInterval(() => {
  for (const [roomId, room] of rooms) {
    const humans = [...room.values()].filter(p => !p.isBot && p.hp > 0);
    if (humans.length === 0) continue;
    const rc = _csGetRoom(roomId);
    const players = humans.map(p => ({ x: p.x, z: p.z }));
    // Run 6 sub-steps of 1/60s = 100ms of simulation
    const SUB = 1/60;
    for (let i = 0; i < 6; i++) {
      _csStep(rc.vibora.entities,    rc.vibora.cfg,    SUB, rc.rng, rc.gaussian, players);
      _csStep(rc.armadillo.entities, rc.armadillo.cfg, SUB, rc.rng, rc.gaussian, players);
      _csStep(rc.condor.entities,    rc.condor.cfg,    SUB, rc.rng, rc.gaussian, players);
    }
    // Broadcast compact positions
    io.to(roomId).volatile.emit('creatureSync', {
      vibora:    rc.vibora.entities.map(e    => e.dead ? { idx:e.idx, dead:true } : { idx:e.idx, x:e.x, z:e.z, vx:e.vx, vz:e.vz, state:e.state }),
      armadillo: rc.armadillo.entities.map(e => e.dead ? { idx:e.idx, dead:true } : { idx:e.idx, x:e.x, z:e.z, vx:e.vx, vz:e.vz, state:e.state }),
      condor:    rc.condor.entities.map(e    => e.dead ? { idx:e.idx, dead:true } : { idx:e.idx, x:e.x, z:e.z, vx:e.vx, vz:e.vz, state:e.state, y:e.y }),
    });
  }
}, 100);

function getRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Map());
  return rooms.get(roomId);
}

const COLORS = ['#ff4444', '#44aaff', '#44ff44', '#ffaa00', '#ff44ff', '#00ffcc', '#ffff44', '#aa44ff'];

// NPC dialogue per room: voters = players present when first choice arrived
// (new players who join mid-dialogue don't block resolution)
const npcSessions = new Map();

// ─── Gemini Game Master ───────────────────────────────────────────────────────
const _geminiKey = process.env.GEMINI_API_KEY || '';
const _genAI     = _geminiKey ? new GoogleGenerativeAI(_geminiKey) : null;
const _gmModel      = _genAI ? _genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null;
console.log(`[GM] Gemini ${_gmModel ? 'ACTIVO' : 'INACTIVO (sin API key)'}`);

// ── Story Bible — persistent narrative state per room ────────────────────────
const storyBibles = new Map();
const npcEntities = new Map(); // roomId → Map<npcId, npc>
let _npcSeq = 0;

function getStory(roomId) {
  if (!storyBibles.has(roomId)) {
    storyBibles.set(roomId, {
      phase: 'observing',  // observing → narrating
      cycle: 0,
      corralled: 0,
      totalKills: 0,
      hour: 17,
      npcs: [],            // {name, alive, introduced, lastSaid, personality}
      promises: [],        // strings of pending story promises
      playerHistory: [],   // last 30 events (the "what happened" feed)
      worldEvents: [],     // weather, time changes
    });
  }
  return storyBibles.get(roomId);
}

function addEvent(roomId, text) {
  const sb = getStory(roomId);
  sb.playerHistory.push(text);
  if (sb.playerHistory.length > 30) sb.playerHistory.shift();
}

// ── NPC spawning ──────────────────────────────────────────────────────────────
function spawnStoryNPC(roomId, def, humans) {
  if (!npcEntities.has(roomId)) npcEntities.set(roomId, new Map());
  const npcs = npcEntities.get(roomId);
  // Don't duplicate by name
  for (const [, n] of npcs) if (n.name === def.name) return;

  const id = `npc_${++_npcSeq}`;
  const anchor = humans[Math.floor(Math.random() * humans.length)] ?? { x: 0, z: -70 };
  const angle = Math.random() * Math.PI * 2;
  const dist  = 28 + Math.random() * 12;
  const npc = {
    id, name: def.name,
    x: anchor.x + Math.cos(angle) * dist,
    z: anchor.z + Math.sin(angle) * dist,
    dialogue: def.dialogue || '',
    dialogueSent: false,
    color: def.color || '#8B7355',
    walkSpeed: 1.3,
  };
  npcs.set(id, npc);
  getStory(roomId).npcs.push({ name: def.name, alive: true, introduced: `ciclo ${getStory(roomId).cycle}`, lastSaid: def.dialogue, personality: def.personality || '' });
  io.to(roomId).emit('npcSpawned', { id, name: def.name, x: npc.x, z: npc.z, color: npc.color });
  console.log(`[NPC] Spawned "${def.name}" en sala ${roomId}`);
}

// ── NPC movement tick (500ms) ─────────────────────────────────────────────────
setInterval(() => {
  for (const [roomId, npcs] of npcEntities) {
    if (!npcs.size) continue;
    const room   = getRoom(roomId);
    const humans = [...room.values()].filter(p => !p.isBot && p.hp > 0);
    if (!humans.length) continue;
    for (const [npcId, npc] of npcs) {
      // nearest human
      let nearest = humans[0], minDist = Infinity;
      for (const p of humans) {
        const d = Math.hypot(p.x - npc.x, p.z - npc.z);
        if (d < minDist) { minDist = d; nearest = p; }
      }
      if (minDist > 6) {
        const dx = nearest.x - npc.x, dz = nearest.z - npc.z;
        const d  = Math.hypot(dx, dz) || 1;
        npc.x += (dx / d) * npc.walkSpeed * 0.5;
        npc.z += (dz / d) * npc.walkSpeed * 0.5;
        io.to(roomId).volatile.emit('npcMoved', { id: npcId, x: npc.x, z: npc.z });
      } else if (npc.dialogue && !npc.dialogueSent) {
        npc.dialogueSent = true;
        io.to(roomId).emit('npcDialogue', { id: npcId, name: npc.name, text: npc.dialogue });
      }
    }
  }
}, 500);

// ── Execute a GM command on all clients in the room ──────────────────────────
function execGMCommand(roomId, cmd) {
  const room = getRoom(roomId);
  console.log(`[GM CMD] ${JSON.stringify(cmd)}`);
  switch (cmd.type) {

    case 'set_time':          // 0-24h
      io.to(roomId).emit('gmCommand', { type: 'set_time', hour: Number(cmd.hour) });
      break;

    case 'stampede':          // all cows/chickens panic
      io.to(roomId).emit('gmCommand', { type: 'stampede' });
      break;

    case 'storm':             // dark sky + strong wind
      io.to(roomId).emit('gmCommand', { type: 'storm', intensity: cmd.intensity ?? 1 });
      break;

    case 'heal_all':          // restore HP to all human players
      for (const [, p] of room) {
        if (!p.isBot) { p.hp = Math.min(200, p.hp + (cmd.amount ?? 100)); }
      }
      io.to(roomId).emit('gmCommand', { type: 'heal_all', amount: cmd.amount ?? 100 });
      break;

    case 'damage_all':        // hurt all players
      for (const [id, p] of room) {
        if (!p.isBot && p.hp > 0) {
          p.hp = Math.max(1, p.hp - (cmd.amount ?? 30));
          io.to(roomId).emit('playerHit', { id, hp: p.hp, attackerId: 'gm' });
        }
      }
      break;

    case 'spawn_bots':
      _spawnBotWave(roomId);
      break;

    case 'day_speed':         // change how fast time passes (multiplier)
      io.to(roomId).emit('gmCommand', { type: 'day_speed', mult: cmd.mult ?? 1 });
      break;

    case 'fog':               // thick fog
      io.to(roomId).emit('gmCommand', { type: 'fog', density: cmd.density ?? 0.5 });
      break;

    case 'blood_moon':        // red sky
      io.to(roomId).emit('gmCommand', { type: 'blood_moon' });
      break;
  }
}

async function runStoryCycle(roomId) {
  if (!_gmModel) return;
  const sb   = getStory(roomId);
  const room = getRoom(roomId);
  sb.cycle  += 1;

  const humans      = [...room.values()].filter(p => !p.isBot);
  const playerState = humans.map(p => `${p.name} HP:${p.hp} kills:${p.kills} muertes:${p.deaths}`).join(' | ') || 'nadie';
  const history     = sb.playerHistory.slice(-20).join('\n') || 'ninguno';

  console.log(`[STORY] Ciclo ${sb.cycle} sala ${roomId} — jugadores: ${playerState}`);

  // ── Ciclo 1: solo observar, sin narrar ───────────────────────────────────────
  if (sb.cycle <= 1) {
    const obsPrompt = `Sos el Game Master de GAUCHO, un western gaucho argentino. Estás OBSERVANDO la partida antes de empezar la historia.

ESTADO:
- Hora: ${sb.hour}:00hs
- Jugadores: ${playerState}
- Eventos recientes: ${history}

Respondé SOLO con JSON válido, sin texto extra, sin markdown:
{"world_note":"observación del mundo en 1 oración","player_tag":"apodo o descripción breve del grupo"}`;

    try {
      const r   = await _gmModel.generateContent(obsPrompt);
      let raw   = r.response.text().trim().replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
      const obs = JSON.parse(raw);
      if (obs.world_note) sb.worldEvents.push(obs.world_note);
      if (obs.player_tag) sb.playerHistory.push(`[perfil] ${obs.player_tag}`);
      console.log(`[STORY] Observación ciclo ${sb.cycle}:`, obs);
    } catch(e) { console.warn('[STORY] observe error:', e.message); }
    return;
  }

  // ── Ciclo 3+: narración completa ─────────────────────────────────────────────
  if (sb.phase === 'observing') sb.phase = 'narrating';

  const npcList     = sb.npcs.map(n => `- ${n.name}: ${n.personality}. Última frase: "${n.lastSaid}"`).join('\n') || 'ninguno';
  const promiseList = sb.promises.join(' | ') || 'ninguna';
  const worldNotes  = sb.worldEvents.slice(-5).join(' | ') || 'ninguna';

  const mustSpawnNpc = sb.npcs.length === 0 || sb.cycle % 3 === 0;

  const mainPrompt = `Sos el Game Master de GAUCHO, western gaucho argentino en la pampa.
Estilo: MUY BREVE, crudo, western oscuro.

ESTADO (ciclo ${sb.cycle}):
- Jugadores: ${playerState}
- Hora: ${sb.hour}:00hs | Vacas: ${sb.corralled}/33 | Muertes: ${sb.totalKills}
- NPCs activos: ${npcList}
- Últimos eventos: ${sb.playerHistory.slice(-8).join(' | ') || 'ninguno'}

REGLAS ESTRICTAS:
1. "narrative": máximo 12 palabras, estilo western seco. Sin explicaciones largas.
2. ${mustSpawnNpc ? '⚠️ OBLIGATORIO: debés incluir un "spawn_npc" con un personaje que camine hacia los jugadores y les diga algo. No puede ser null.' : '"spawn_npc" solo si tiene sentido narrativo.'}
3. El diálogo del NPC: máximo 10 palabras, algo que diría un gaucho, forastero, o personaje de pampa.
4. Solo comandos si hay evento narrativo claro.

Respondé SOLO con JSON válido, sin texto extra:
{"narrative":"frase corta","commands":[],"spawn_npc":${mustSpawnNpc ? '{"name":"NombreGaucho","personality":"una característica","dialogue":"frase corta al acercarse","color":"#8B6040"}' : 'null'},"new_promises":[],"fulfilled_promises":[]}`;

  try {
    const result = await _gmModel.generateContent(mainPrompt);
    let raw = result.response.text().trim().replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
    console.log(`[STORY raw] ${raw.slice(0, 300)}`);

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { parsed = { narrative: raw, commands: [], spawn_npc: null, new_promises: [], fulfilled_promises: [] }; }

    // Narración
    const text = (parsed.narrative || '').trim();
    if (text) {
      io.to(roomId).emit('gmMessage', { text });
      console.log(`[STORY ${roomId}] ${text}`);
    }

    // Comandos
    for (const cmd of (Array.isArray(parsed.commands) ? parsed.commands : [])) execGMCommand(roomId, cmd);

    // Spawn NPC
    if (parsed.spawn_npc?.name) {
      const living = [...room.values()].filter(p => !p.isBot && p.hp > 0);
      spawnStoryNPC(roomId, parsed.spawn_npc, living);
    }

    // Promesas
    if (Array.isArray(parsed.new_promises)) {
      sb.promises.push(...parsed.new_promises);
      if (sb.promises.length > 10) sb.promises.splice(0, sb.promises.length - 10);
    }
    if (Array.isArray(parsed.fulfilled_promises)) {
      sb.promises = sb.promises.filter(p => !parsed.fulfilled_promises.includes(p));
    }

  } catch(e) { console.warn('[STORY] Gemini error:', e.message); }
}

// ── Ciclo de historia cada 2 minutos ─────────────────────────────────────────
setInterval(() => {
  for (const [roomId, room] of rooms) {
    const humans = [...room.values()].filter(p => !p.isBot);
    if (humans.length === 0) continue;
    runStoryCycle(roomId).catch(e => console.warn('[STORY interval]', e.message));
  }
}, 2 * 60 * 1000);

function _resolveNpc(roomId) {
  const s = npcSessions.get(roomId);
  if (!s) return;
  const allTemplo = [...s.choices.values()].every(c => c === 1);
  io.to(roomId).emit('npcResponse', { type: allTemplo ? 'templo' : 'normal' });
  npcSessions.delete(roomId);
}

function _checkNpcResolution(roomId) {
  const s = npcSessions.get(roomId);
  if (!s || s.choices.size === 0) return;
  const room = getRoom(roomId);
  // All voters who are still connected must have answered
  const pending = [...s.voters].filter(id => room.has(id) && !s.choices.has(id));
  if (pending.length === 0) _resolveNpc(roomId);
}

function randomSpawn() {
  const spread = 12;
  return {
    x: 3.8 + (Math.random() - 0.5) * spread,
    y: 1.0,
    z: -69.0 + (Math.random() - 0.5) * spread,
  };
}

// --- Socket.io ---
io.on('connection', (socket) => {
  let currentRoom = null;
  let playerData = null;

  socket.on('join', ({ roomId, name }) => {
    currentRoom = roomId || 'default';
    socket.join(currentRoom);
    const room = getRoom(currentRoom);
    const colorIndex = room.size % COLORS.length;
    const spawn = randomSpawn();

    playerData = {
      id: socket.id,
      name: name || `Player ${room.size + 1}`,
      color: COLORS[colorIndex],
      x: spawn.x, y: spawn.y, z: spawn.z,
      rx: 0, ry: 0,
      hp: 200,
      kills: 0,
      deaths: 0,
    };

    room.set(socket.id, playerData);

    // If bots disabled, evict any bots that crept in from a previous server run
    if (!BOTS_ENABLED) {
      for (const [bid, p] of [...room]) {
        if (p.isBot) { room.delete(bid); }
      }
      botWaveStates.delete(currentRoom);
    }

    const meta = getRoomMeta(currentRoom);
    socket.emit('joined', {
      self: playerData,
      players: Object.fromEntries(room),
      roomId: currentRoom,
      corralledCows: [...(corralledCows.get(currentRoom) ?? [])],
      creatureSeed: meta.seed,
      roomAge: (Date.now() - meta.createdAt) / 1000,
    });

    socket.to(currentRoom).emit('playerJoined', playerData);
    // Enviar snapshot inmediato de criaturas al cliente que se acaba de unir
    // (reliable, no volatile — garantiza que el primer sync no se pierda)
    const _rcJoin = _csGetRoom(currentRoom);
    socket.emit('creatureSync', {
      vibora:    _rcJoin.vibora.entities.map(e    => e.dead ? { idx:e.idx, dead:true } : { idx:e.idx, x:e.x, z:e.z, vx:e.vx, vz:e.vz, state:e.state }),
      armadillo: _rcJoin.armadillo.entities.map(e => e.dead ? { idx:e.idx, dead:true } : { idx:e.idx, x:e.x, z:e.z, vx:e.vx, vz:e.vz, state:e.state }),
      condor:    _rcJoin.condor.entities.map(e    => e.dead ? { idx:e.idx, dead:true } : { idx:e.idx, x:e.x, z:e.z, vx:e.vx, vz:e.vz, state:e.state, y:e.y }),
    });
    console.log(`[${currentRoom}] ${playerData.name} joined (${room.size} players)`);
    const humanCount = [...room.values()].filter(p => !p.isBot).length;
    if (humanCount >= 1) {
      addEvent(currentRoom, `${playerData.name} se unió. Hay ${humanCount} gaucho${humanCount !== 1 ? 's' : ''} en el campo.`);
    }
  });

  socket.on('move', (data) => {
    if (!currentRoom || !playerData) return;
    playerData.x = data.x;
    playerData.y = data.y;
    playerData.z = data.z;
    playerData.rx = data.rx;
    playerData.ry = data.ry;
    playerData.aiming = !!data.aiming;
    playerData.stunned = !!data.stunned;
    socket.to(currentRoom).volatile.emit('playerMoved', {
      id: socket.id,
      x: data.x, y: data.y, z: data.z,
      rx: data.rx, ry: data.ry,
      aiming: !!data.aiming,
      stunned: !!data.stunned,
    });
  });

  socket.on('shoot', (data) => {
    if (!currentRoom || !playerData) return;
    socket.to(currentRoom).emit('playerShot', {
      id: socket.id,
      origin: data.origin,
      direction: data.direction,
    });

    if (data.hitId) {
      const room = getRoom(currentRoom);
      const target = room.get(data.hitId);
      if (target && target.hp > 0 && !target.invincible) {
        target.hp -= 25;
        if (target.hp <= 0) {
          target.hp = 0;
          target.deaths += 1;
          playerData.kills += 1;

          if (target.isBot) {
            // Bots don't respawn — remove from room after short death pause
            setTimeout(() => {
              if (room.has(data.hitId)) {
                room.delete(data.hitId);
                io.to(currentRoom).emit('playerLeft', data.hitId);
              }
            }, 1200);
          } else {
            // Human player respawn
            setTimeout(() => {
              if (room.has(data.hitId)) {
                const spawn = randomSpawn();
                target.hp = 200;
                target.x = spawn.x;
                target.y = spawn.y;
                target.z = spawn.z;
                io.to(currentRoom).emit('playerRespawned', { id: data.hitId, ...target });
              }
            }, 2000);
          }

          io.to(currentRoom).emit('playerKilled', {
            killerId:     socket.id,
            killerName:   playerData.name,
            killerKills:  playerData.kills,
            victimId:     data.hitId,
            victimName:   target.name,
            victimDeaths: target.deaths,
          });
          getStory(currentRoom).totalKills++;
          addEvent(currentRoom, `${playerData.name} mató a ${target.name}. ${playerData.name} lleva ${playerData.kills} bajas.`);
        } else {
          io.to(currentRoom).emit('playerHit', {
            id: data.hitId,
            hp: target.hp,
            attackerId: socket.id,
          });
        }
      }
    }
  });

  // bulletHit — damage-only event (visual already shown via 'shoot')
  socket.on('bulletHit', ({ hitId, hitZone }) => {
    if (!currentRoom || !playerData) return;
    const room   = getRoom(currentRoom);
    const target = room.get(hitId);
    if (!target || target.hp <= 0 || target.invincible) return;

    target.hp -= 25;
    if (target.hp <= 0) {
      target.hp       = 0;
      target.deaths  += 1;
      playerData.kills += 1;

      if (target.isBot) {
        setTimeout(() => {
          if (room.has(hitId)) {
            room.delete(hitId);
            io.to(currentRoom).emit('playerLeft', hitId);
          }
        }, 1200);
      } else {
        setTimeout(() => {
          if (room.has(hitId)) {
            const sp = randomSpawn();
            target.hp = 200; target.x = sp.x; target.y = sp.y; target.z = sp.z;
            io.to(currentRoom).emit('playerRespawned', { id: hitId, ...target });
          }
        }, 2000);
      }

      io.to(currentRoom).emit('playerKilled', {
        killerId:     socket.id,
        killerName:   playerData.name,
        killerKills:  playerData.kills,
        victimId:     hitId,
        victimName:   target.name,
        victimDeaths: target.deaths,
      });
      getStory(currentRoom).totalKills++;
      addEvent(currentRoom, `${playerData.name} eliminó a ${target.name}. ${playerData.name} lleva ${playerData.kills} bajas.`);
    } else {
      io.to(currentRoom).emit('playerHit', { id: hitId, hp: target.hp, attackerId: socket.id, hitZone: hitZone || 'body' });
    }
  });

  socket.on('mountHorse', ({ horseId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('playerMountedHorse', { playerId: socket.id, horseId });
  });

  socket.on('dismountHorse', ({ horseId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('playerDismountedHorse', { playerId: socket.id, horseId });
  });

  socket.on('carrosaMoved', ({ x, z, ry } = {}) => {
    if (!currentRoom) return;
    // Stamp driverId = socket.id so remote clients know who is driving
    socket.to(currentRoom).volatile.emit('carrosaMoved', { x, z, ry, driverId: socket.id });
  });

  socket.on('carrossaMount', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('carrossaMount', { driverId: socket.id });
  });

  socket.on('carrossaDismount', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('carrossaDismount', { driverId: socket.id });
  });

  socket.on('carrossaPassengerMount', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('carrossaPassengerMount', { passengerId: socket.id });
  });

  socket.on('carrossaPassengerDismount', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('carrossaPassengerDismount', { passengerId: socket.id });
  });

  socket.on('horseMoved', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).volatile.emit('horsePositionUpdate', { ...data, riderId: socket.id });
  });

  socket.on('unsaddleHorse', ({ horseId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('horseUnsaddled', { horseId });
  });

  socket.on('saddleHorse', ({ horseId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('horseSaddled', { horseId });
  });

  socket.on('bottleHit', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('bottleHit', data);
  });

  socket.on('toggleInvincible', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    const player = room?.get(socket.id);
    if (player) player.invincible = !player.invincible;
  });

  socket.on('creatureHit', ({ species, idx } = {}) => {
    if (!currentRoom) return;
    // Apply hit to server-side creature state
    const rc = roomCreatures.get(currentRoom);
    if (rc && rc[species]) {
      const e = rc[species].entities[idx];
      if (e && !e.dead) {
        e.hp -= 1;
        if (e.hp <= 0) {
          e.dead = true; e.state = 'dead';
          e.removeTimer = rc[species].cfg.respawnDelay ?? 60;
        }
      }
    }
    socket.to(currentRoom).emit('creatureHit', { species, idx });
  });

  socket.on('ostrichKill', ({ idx } = {}) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('ostrichKill', { idx: idx ?? 0 });
  });

  socket.on('cowCorralled', ({ id }) => {
    if (!currentRoom || typeof id !== 'number' || id < 0 || id >= 33) return;
    if (!corralledCows.has(currentRoom)) corralledCows.set(currentRoom, new Set());
    const set = corralledCows.get(currentRoom);
    if (set.has(id)) return;                            // already counted
    set.add(id);
    io.to(currentRoom).emit('cowCorralled', { id, total: set.size });
    console.log(`[${currentRoom}] Vaca ${id} corralada (${set.size}/33)`);
    const sb = getStory(currentRoom);
    sb.corralled = set.size;
    const milestones = [1, 5, 10, 20, 33];
    if (milestones.includes(set.size)) {
      const desc = set.size === 33
        ? `¡TODAS las 33 vacas fueron corraladas! El campo quedó limpio.`
        : `${playerData?.name ?? 'Un gaucho'} corraló la vaca número ${set.size}. Van ${set.size} de 33 en el corral.`;
      addEvent(currentRoom, desc);
    }
  });

  // ── NPC Dialogue ─────────────────────────────────────────────────────────────
  socket.on('npcChoice', ({ choice }) => {
    if (!currentRoom || !playerData || typeof choice !== 'number') return;
    const room = getRoom(currentRoom);

    // First choice in this room → lock in the voters (current players)
    if (!npcSessions.has(currentRoom)) {
      npcSessions.set(currentRoom, {
        choices: new Map(),
        voters:  new Set(room.keys()),
      });
    }
    const s = npcSessions.get(currentRoom);
    s.choices.set(socket.id, choice);
    _checkNpcResolution(currentRoom);
  });

  socket.on('yell', ({ x, z }) => {
    if (!currentRoom || typeof x !== 'number' || typeof z !== 'number') return;
    socket.to(currentRoom).emit('yell', { x, z });
  });

  socket.on('bloodSplat', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).volatile.emit('bloodSplat', data);
  });

  socket.on('butcher', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('butcher', { id: socket.id });
  });

  // ── Client-triggered GM events (night, dawn, horse mounted, etc.) ────────────
  socket.on('gameEvent', ({ type, detail, hour }) => {
    if (!currentRoom || !playerData) return;
    if (hour != null) getStory(currentRoom).hour = hour;
    const EVENT_DESCS = {
      night_fell:   `Cayó la noche en la pampa. La oscuridad cubre el campo.`,
      dawn:         `Amaneció. El sol asoma detrás del horizonte.`,
      horse_mounted:`${playerData.name} montó un caballo y cabalga por el campo.`,
      lasso_catch:  `${playerData.name} enlazó un animal con el lazo.`,
      player_died:  `${playerData.name} cayó muerto en el campo.`,
      animal_killed:`${playerData.name} mató un animal (${detail ?? ''}).`,
      animal_wounded:`${playerData.name} hirió un animal (${detail ?? ''}).`,
    };
    const desc = EVENT_DESCS[type] || detail || `Evento: ${type}`;
    addEvent(currentRoom, desc);
  });

  // ── Conversación con aldeanos ────────────────────────────────────────────────
  socket.on('generateAldeanoQA', async ({ units }) => {
    if (!_gmModel || !Array.isArray(units)) return;
    const results = {};
    for (const u of units) {
      const prompt =
`Generá 3 pares pregunta-respuesta para ${u.name}, aldeano de la pampa argentina.
Estado espiritual: ${u.cuadrante}, ${u.trayectoria}.
Energía: ${u.energia}%. Recursos: ${u.recursos}/5. Hora: ${u.hora}:00hs.
Vecinos hoy: ${u.vecinos}.

Respondé SOLO con JSON válido, sin texto extra: [{"q":"...","a":"..."}]
Preguntas: lo que preguntaría un gaucho de paso (máx 7 palabras).
Respuestas: 1 oración, español rioplatense, personalidad filtrada por estado espiritual.
Al menos una pregunta debe ser sobre un vecino específico.`;
      const _t = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 25000));
      try {
        const r   = await Promise.race([_gmModel.generateContent(prompt), _t]);
        let raw   = r.response.text().trim().replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
        results[u.id] = JSON.parse(raw);
      } catch(e) {
        console.warn('[aldeanoQA] error/timeout:', u.name, e.message);
        results[u.id] = [
          { q: '¿Cómo andás?',        a: 'Tirando, nomás.' },
          { q: '¿Qué hay de nuevo?',  a: 'Nada que no hayas visto.' },
          { q: '¿Cómo está el campo?',a: 'Como siempre, duro.' },
        ];
      }
    }
    socket.emit('aldeanoQAReady', results);
  });

  socket.on('aldeanoChat', async ({ name, message, cuadrante, trayectoria, energia, recursos, vecinos, historial }) => {
    if (typeof message !== 'string' || !message.trim()) return;
    if (!_gmModel) { socket.emit('aldeanoChatResponse', { response: 'No tengo nada que decirte.' }); return; }
    const histStr = Array.isArray(historial) && historial.length
      ? '\nConversación previa:\n' + historial.map(h => `${h.from === 'player' ? 'Gaucho' : name}: "${h.text}"`).join('\n') + '\n'
      : '';
    const prompt =
`Sos ${name}, aldeano de la pampa argentina.
Alma: ${cuadrante}, ${trayectoria}. Energía: ${energia}%. Recursos: ${recursos}/5.
Vecinos: ${vecinos}.${histStr}
El gaucho te dice: "${message.trim()}"

Respondé en 1-2 oraciones, español rioplatense. Tu estado espiritual filtra cómo hablás.`;
    const _timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 25000));
    try {
      const r = await Promise.race([_gmModel.generateContent(prompt), _timeout]);
      socket.emit('aldeanoChatResponse', { response: r.response.text().trim() });
    } catch(e) {
      console.warn('[aldeanoChat] FALLO:', e.message, e.status ?? '', e.statusText ?? '');
      socket.emit('aldeanoChatResponse', { response: `[ERR] ${e.message?.slice(0,300) || e.toString().slice(0,300)}` });
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      const room = getRoom(currentRoom);
      room.delete(socket.id);
      socket.to(currentRoom).emit('playerLeft', socket.id);
      console.log(`[${currentRoom}] Player left (${room.size} players)`);
      // A voter disconnected — re-check in case everyone remaining has already answered
      _checkNpcResolution(currentRoom);

      // If no human players remain, evict all bots and reset wave timer
      const humansLeft = [...room.values()].filter(p => !p.isBot).length;
      if (humansLeft === 0) {
        for (const [bid, p] of [...room]) {
          if (p.isBot) {
            room.delete(bid);
            socket.to(currentRoom).emit('playerLeft', bid);
          }
        }
        botWaveStates.delete(currentRoom);
      }

      if (room.size === 0) {
        rooms.delete(currentRoom);
        npcSessions.delete(currentRoom);
        corralledCows.delete(currentRoom);
        roomMeta.delete(currentRoom);
        roomCreatures.delete(currentRoom);
      }
    }
  });
});

http.listen(PORT, async () => {
  console.log(`\n  GAUCHO ${IS_PROD ? 'production' : 'dev'} server at http://localhost:${PORT}`);

  if (!IS_PROD) {
    try {
      const tunnel = await localtunnel({ port: Number(PORT) });
      console.log(`\n  PUBLIC URL (comparte este link!):\n  ${tunnel.url}\n`);
      tunnel.on('close', () => console.log('  Tunnel closed'));
    } catch (err) {
      console.log(`\n  (tunnel no disponible: ${err.message})\n`);
    }
  }
});
