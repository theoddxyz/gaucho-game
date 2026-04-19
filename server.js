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

// Public URL (set once tunnel is established or from env)
let _publicUrl = process.env.RENDER_EXTERNAL_URL || null;
app.get('/api/public-url', (_req, res) => {
  res.json({ url: _publicUrl });
});

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
const sleepSessions = new Map();   // roomId → { sleepers: Map<socketId,hours>, firstHours, warpTimer }
const cropStates    = new Map();   // roomId → Map<cropId, {id,x,z,plantedAt,grownAt}>
const GROW_TIME_MS  = 2 * 60 * 1000;   // 2 minutos para que crezca un cultivo
const CROP_EXPIRE_MS = 24 * 60 * 60 * 1000; // cultivos sin cosechar expiran en 24h
const MAX_CROPS_PER_ROOM = 20;
const harvestedBushes = new Map(); // roomId → Map<"x,z", regrowAt timestamp>

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

// ─── Host-client creature relay ──────────────────────────────────────────────
// The first player in a room is the "host" and runs all creature AI locally.
// The server relays host positions to all other clients (zero simulation).

const roomHosts = new Map(); // roomId → socketId of the creature host

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

// ─── Ollama Local AI (Gemma 3 4B — pequeño, rápido) ──────────────────────────
const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:4b';

/**
 * Genera texto vía Ollama (sin depender de un flag de startup).
 * Tira error si Ollama no está disponible o el modelo no existe.
 */
async function ollamaGenerate(prompt, timeoutMs = 40000) {
  const body = JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false });
  const r = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body, signal: AbortSignal.timeout(timeoutMs),
  });
  if (!r.ok) throw new Error(`Ollama HTTP ${r.status}`);
  const d = await r.json();
  return (d.response || '').trim();
}

// Probe inicial — sólo para el log, no bloquea nada
fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) })
  .then(r => r.json())
  .then(d => {
    const found = (d.models || []).find(m => m.name.startsWith(OLLAMA_MODEL.split(':')[0]));
    console.log(`[AI] Ollama ${found ? `ACTIVO → ${found.name}` : `SIN modelo ${OLLAMA_MODEL}`} en ${OLLAMA_URL}`);
  })
  .catch(() => console.log(`[AI] Ollama no disponible en ${OLLAMA_URL} (modo offline)`));

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

    // Host tracking: first human in room becomes host
    if (!roomHosts.has(currentRoom)) {
      roomHosts.set(currentRoom, socket.id);
    }

    const meta = getRoomMeta(currentRoom);
    socket.emit('joined', {
      self: playerData,
      players: Object.fromEntries(room),
      roomId: currentRoom,
      corralledCows: [...(corralledCows.get(currentRoom) ?? [])],
      creatureSeed: meta.seed,
      roomAge: (Date.now() - meta.createdAt) / 1000,
      isHost: roomHosts.get(currentRoom) === socket.id,
      publicUrl: _publicUrl,   // null si el tunnel todavía no arrancó
    });

    // Enviar estado actual de cultivos al nuevo jugador
    const existingCrops = cropStates.get(currentRoom);
    if (existingCrops?.size > 0) {
      socket.emit('cropState', { crops: [...existingCrops.values()] });
    }
    // Enviar arbustos ya cosechados (para que no vean frutos que otros ya cosecharon)
    const existingBushes = harvestedBushes.get(currentRoom);
    if (existingBushes?.size > 0) {
      const now = Date.now();
      const active = [...existingBushes.entries()]
        .filter(([, regrowAt]) => now < regrowAt)
        .map(([key, regrowAt]) => ({ key, regrowAt }));
      if (active.length > 0) socket.emit('bushState', { bushes: active });
    }

    socket.to(currentRoom).emit('playerJoined', playerData);
    // If this player is NOT the host, ask the host to send a creature snapshot
    if (roomHosts.get(currentRoom) !== socket.id) {
      const hostId = roomHosts.get(currentRoom);
      if (hostId) io.to(hostId).emit('requestCreatureSync');
    }
    console.log(`[${currentRoom}] ${playerData.name} joined (${room.size} players, host=${roomHosts.get(currentRoom) === socket.id ? 'YES' : 'no'})`);
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

  socket.on('mountMoto', ({ motoId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('playerMountedMoto', { playerId: socket.id, motoId });
  });
  socket.on('dismountMoto', ({ motoId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('playerDismountedMoto', { playerId: socket.id, motoId });
  });
  socket.on('motoMoved', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).volatile.emit('motoPositionUpdate', { ...data, riderId: socket.id });
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
    socket.to(currentRoom).emit('creatureHit', { species, idx });
  });

  socket.on('ostrichKill', ({ idx } = {}) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('ostrichKill', { idx: idx ?? 0 });
  });

  // Host sends creature positions → relay to all other clients
  socket.on('hostCreatureSync', (data) => {
    if (!currentRoom) return;
    if (roomHosts.get(currentRoom) !== socket.id) return;
    // _reliable flag = first snapshot for a new viewer → send reliably (no volatile)
    if (data && data._reliable) {
      const { _reliable, ...payload } = data;
      socket.to(currentRoom).emit('creatureSync', payload);
    } else {
      socket.to(currentRoom).volatile.emit('creatureSync', data);
    }
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

  // ── Dormir ────────────────────────────────────────────────────────────────────
  socket.on('sleep', ({ hours } = {}) => {
    if (!currentRoom || !playerData) return;
    const h = Math.max(1, Math.min(12, Number(hours) || 4));

    if (!sleepSessions.has(currentRoom)) {
      sleepSessions.set(currentRoom, { sleepers: new Map(), firstHours: h });
    }
    const sess = sleepSessions.get(currentRoom);
    if (sess.sleepers.size === 0) sess.firstHours = h;  // primer dormido decide las horas
    sess.sleepers.set(socket.id, h);

    const room   = getRoom(currentRoom);
    const humans = [...room.values()].filter(p => !p.isBot && p.hp > 0);
    const allSleeping = humans.length > 0 && humans.every(p => sess.sleepers.has(p.id));

    if (allSleeping && !sess.warpTimer) {
      io.to(currentRoom).emit('timeWarp', { hours: sess.firstHours });
      addEvent(currentRoom, `Todos durmieron ${sess.firstHours}h. El tiempo avanzó en la pampa.`);
      // Avanzar cultivos por las horas dormidas
      const advMs = sess.firstHours * 3600 * 1000;
      const crops = cropStates.get(currentRoom);
      if (crops) for (const crop of crops.values()) crop.grownAt -= advMs;
      sess.warpTimer = setTimeout(() => {
        sess.sleepers.clear();
        sess.warpTimer = null;
        io.to(currentRoom).emit('wakeUp');
      }, 4000);
    }
  });

  // ── Arbustos silvestres ───────────────────────────────────────────────────────
  socket.on('harvestBush', ({ x, z } = {}) => {
    if (!currentRoom || !playerData) return;
    if (!harvestedBushes.has(currentRoom)) harvestedBushes.set(currentRoom, new Map());
    const bushMap = harvestedBushes.get(currentRoom);
    const key     = `${Math.round(x * 10)},${Math.round(z * 10)}`;
    const now     = Date.now();
    if (bushMap.has(key) && now < bushMap.get(key)) return;  // ya cosechado
    bushMap.set(key, now + 60 * 1000);  // regrow en 1 min
    io.to(currentRoom).emit('bushHarvested', { x, z, harvesterId: socket.id });
  });

  // ── Cultivos ──────────────────────────────────────────────────────────────────
  socket.on('plantSeed', ({ x, z } = {}) => {
    if (!currentRoom || !playerData) return;
    if (!cropStates.has(currentRoom)) cropStates.set(currentRoom, new Map());
    const crops = cropStates.get(currentRoom);
    // Límite de cultivos por sala
    if (crops.size >= MAX_CROPS_PER_ROOM) {
      socket.emit('cropLimitReached');
      return;
    }
    // Limpiar cultivos expirados antes de agregar
    const now = Date.now();
    for (const [id, crop] of crops) {
      if (now > crop.grownAt + CROP_EXPIRE_MS) crops.delete(id);
    }
    const id   = `crop_${now}_${Math.random().toString(36).substr(2, 5)}`;
    const crop = { id, x: Number(x), z: Number(z), plantedAt: now, grownAt: now + GROW_TIME_MS };
    crops.set(id, crop);
    io.to(currentRoom).emit('cropSpawned', crop);
  });

  socket.on('harvestCrop', ({ id, isNPC } = {}) => {
    if (!currentRoom || !playerData) return;
    const crops = cropStates.get(currentRoom);
    if (!crops?.has(id)) return;
    const crop = crops.get(id);
    if (Date.now() < crop.grownAt) return;  // no maduro aún
    // Reset crop to regrow instead of deleting
    const now2 = Date.now();
    crop.plantedAt = now2;
    crop.grownAt   = now2 + GROW_TIME_MS;
    // isNPC=true → no dar loot al jugador host
    io.to(currentRoom).emit('cropHarvested', { id, harvesterId: isNPC ? 'npc' : socket.id });
    io.to(currentRoom).emit('cropReset', { id, plantedAt: crop.plantedAt, grownAt: crop.grownAt });
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
    if (!Array.isArray(units)) return;
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
      try {
        let raw;
        if (_gmModel) {
          const _t = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 25000));
          const r  = await Promise.race([_gmModel.generateContent(prompt), _t]);
          raw = r.response.text().trim().replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
        } else {
          raw = (await ollamaGenerate(
            prompt + '\nRespondé SOLO con JSON válido, sin texto extra ni markdown.', 40000))
            .replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
        }
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

  socket.on('aldeanoChat', async ({ name, message, playerName, cuadrante, trayectoria, energia, recursos, vecinos, historial }) => {
    if (typeof message !== 'string' || !message.trim()) return;
    const pName = (typeof playerName === 'string' && playerName.trim()) ? playerName.trim() : 'el viajero';
    const histStr = Array.isArray(historial) && historial.length
      ? '\nConversación previa:\n' + historial.map(h => `${h.from === 'player' ? pName : name}: "${h.text}"`).join('\n') + '\n'
      : '';
    // Pedimos respuesta + impulso metafísico como JSON
    const prompt =
`Eres ${name}, un gusano-aldeano${/a$/i.test(name) ? '/a' : ''} de la pampa argentina viviendo en un planeta lejano.
La persona que te habla se llama ${pName}. No confundas los nombres.
Alma: ${cuadrante}, ${trayectoria}. Energía: ${energia}%. Recursos: ${recursos}/5.
Vecinos: ${vecinos}.${histStr}
${pName} te dice: "${message.trim()}"

Respondé como ${name} le hablaría a ${pName}: con emoción real, opinión propia, contexto de tu vida. Contá algo tuyo, preguntá algo, quejate o alegrate. Entre 100 y 200 palabras. No repitas el nombre de ${pName} más de una vez.

Respondé con JSON válido, sin markdown, sin texto extra:
{"r":"...","ix":0.0,"iy":0.0}

ix = efecto sobre eje INDIVIDUO(-1.0) ↔ COMUNIDAD(+1.0)
iy = efecto sobre eje MATERIA(-1.0) ↔ TRASCENDENCIA(+1.0)
Valores entre -1.0 y 1.0.`;
    try {
      let raw;
      if (_gmModel) {
        const _timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 25000));
        const r = await Promise.race([_gmModel.generateContent(prompt), _timeout]);
        raw = r.response.text().trim();
      } else {
        raw = await ollamaGenerate(prompt, 40000);
      }
      // Limpiar y parsear JSON
      raw = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
      // Extraer primer objeto JSON del string (Gemma a veces agrega texto antes/después)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('no JSON en respuesta');
      const parsed = JSON.parse(jsonMatch[0]);
      const response = String(parsed.r || '...').slice(0, 1200);
      const ix = Math.max(-1, Math.min(1, Number(parsed.ix) || 0));
      const iy = Math.max(-1, Math.min(1, Number(parsed.iy) || 0));
      socket.emit('aldeanoChatResponse', { response, impulso: { ix, iy } });
    } catch(e) {
      console.warn('[aldeanoChat] FALLO:', e.message);
      socket.emit('aldeanoChatResponse', { response: `(${name} no responde)`, impulso: null });
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

      // Remove from sleep session if sleeping
      const sess = sleepSessions.get(currentRoom);
      if (sess) sess.sleepers.delete(socket.id);

      // Host migration: if the host left, promote next human
      if (roomHosts.get(currentRoom) === socket.id) {
        roomHosts.delete(currentRoom);
        const nextHost = [...room.values()].find(p => !p.isBot);
        if (nextHost) {
          roomHosts.set(currentRoom, nextHost.id);
          io.to(nextHost.id).emit('becomeHost');
          console.log(`[${currentRoom}] Host migrated to ${nextHost.name}`);
        }
      }

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
        roomHosts.delete(currentRoom);
        cropStates.delete(currentRoom);
        harvestedBushes.delete(currentRoom);
      }
    }
  });
});

// ── REST: /api/ai — Gemma4 local chat ────────────────────────────────────────
app.use(express.json({ limit: '4kb' }));

app.post('/api/ai', async (req, res) => {
  const { prompt, system, model } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt required' });
  }
  const useModel = model || OLLAMA_MODEL;
  const fullPrompt = system ? `${system.trim()}\n\n${prompt.trim()}` : prompt.trim();
  try {
    // Intentar Ollama primero, luego Gemini como fallback
    try {
      const response = await ollamaGenerate(fullPrompt, 40000);
      return res.json({ response, model: useModel, source: 'ollama' });
    } catch (ollamaErr) {
      if (_gmModel) {
        const r = await Promise.race([
          _gmModel.generateContent(fullPrompt),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 35000)),
        ]);
        return res.json({ response: r.response.text().trim(), model: 'gemini-2.0-flash', source: 'gemini' });
      }
      throw ollamaErr;
    }
  } catch (e) {
    console.warn('[/api/ai] error:', e.message);
    return res.status(500).json({ error: e.message });
  }
});

app.get('/api/ai/status', async (_req, res) => {
  let ollamaOk = false;
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    const d = await r.json();
    ollamaOk = (d.models || []).some(m => m.name.startsWith(OLLAMA_MODEL.split(':')[0]));
  } catch {}
  res.json({ ollama: ollamaOk, model: OLLAMA_MODEL, gemini: !!_gmModel,
    source: ollamaOk ? 'ollama' : _gmModel ? 'gemini' : 'none' });
});

http.listen(PORT, async () => {
  console.log(`\n  GAUCHO ${IS_PROD ? 'production' : 'dev'} server at http://localhost:${PORT}`);

  // ── IP pública + UPnP ────────────────────────────────────────────────────
  if (!IS_PROD) {
    // 1) Obtener IP pública via HTTP plano (no depende de fetch ni https)
    const { default: http } = await import('http');
    const _getIp = () => new Promise((res, rej) => {
      const req = http.get('http://api.ipify.org', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(d.trim()));
      });
      req.on('error', rej);
      req.setTimeout(5000, () => { req.destroy(); rej(new Error('timeout')); });
    });

    const _announce = (url) => {
      _publicUrl = url;
      io.emit('publicUrl', url);
      console.log(`\n  ╔══════════════════════════════════════════════╗`);
      console.log(`  ║  LINK PARA EL OTRO JUGADOR:                  ║`);
      console.log(`  ║  ${url.padEnd(44)}║`);
      console.log(`  ╚══════════════════════════════════════════════╝\n`);
    };

    // 2) Intentar UPnP para abrir puerto automáticamente
    let ip = null;
    try { ip = await _getIp(); } catch(e) { console.log('  [IP] error:', e.message); }

    if (ip) {
      try {
        const { default: natUpnp } = await import('nat-upnp');
        const upnp = natUpnp.createClient();
        await new Promise((res, rej) =>
          upnp.portMapping({ public: Number(PORT), private: Number(PORT), ttl: 0 },
            err => err ? rej(err) : res()));
        upnp.close();
        console.log(`  [UPnP] puerto ${PORT} abierto en el router`);
      } catch(e) {
        console.log(`  [UPnP] no disponible — abrí el puerto ${PORT} manualmente en tu router`);
      }
      _announce(`http://${ip}:${PORT}`);
    }
  }
});
