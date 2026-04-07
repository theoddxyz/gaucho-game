import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import localtunnel from 'localtunnel';

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

// ─── Bot system ───────────────────────────────────────────────────────────────
const BOT_SPEED          = 3.2;              // units/sec
const BOT_SHOOT_RANGE    = 32;               // units
const BOT_SHOOT_COOLDOWN = 1.5;              // seconds between shots
const BOT_WAVE_INTERVAL  = 3 * 60 * 1000;   // 3 minutes
const BOT_DT             = 0.10;             // server tick (10 Hz)
const BOT_COLORS         = ['#cc2211','#cc3300','#aa1100','#dd2200','#bb1100'];
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
      hp:     100,
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
              target.hp = 100; target.x = sp.x; target.y = sp.y; target.z = sp.z;
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
  for (const [roomId, room] of rooms) {
    const humans = [...room.values()].filter(p => !p.isBot);
    if (humans.length === 0) continue;
    if (!botWaveStates.has(roomId)) {
      botWaveStates.set(roomId, { nextWave: Date.now() + BOT_WAVE_INTERVAL });
      continue;
    }
    const state = botWaveStates.get(roomId);
    if (Date.now() >= state.nextWave) {
      _spawnBotWave(roomId);
      state.nextWave = Date.now() + BOT_WAVE_INTERVAL;
    }
  }
}, 30_000);

function getRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Map());
  return rooms.get(roomId);
}

const COLORS = ['#ff4444', '#44aaff', '#44ff44', '#ffaa00', '#ff44ff', '#00ffcc', '#ffff44', '#aa44ff'];

// NPC dialogue per room: voters = players present when first choice arrived
// (new players who join mid-dialogue don't block resolution)
const npcSessions = new Map();

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
      hp: 100,
      kills: 0,
      deaths: 0,
    };

    room.set(socket.id, playerData);

    socket.emit('joined', {
      self: playerData,
      players: Object.fromEntries(room),
      roomId: currentRoom,
      corralledCows: [...(corralledCows.get(currentRoom) ?? [])],
    });

    socket.to(currentRoom).emit('playerJoined', playerData);
    console.log(`[${currentRoom}] ${playerData.name} joined (${room.size} players)`);
  });

  socket.on('move', (data) => {
    if (!currentRoom || !playerData) return;
    playerData.x = data.x;
    playerData.y = data.y;
    playerData.z = data.z;
    playerData.rx = data.rx;
    playerData.ry = data.ry;
    socket.to(currentRoom).volatile.emit('playerMoved', {
      id: socket.id,
      x: data.x, y: data.y, z: data.z,
      rx: data.rx, ry: data.ry,
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
      if (target && target.hp > 0) {
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
                target.hp = 100;
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

  socket.on('mountHorse', ({ horseId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('playerMountedHorse', { playerId: socket.id, horseId });
  });

  socket.on('dismountHorse', ({ horseId }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('playerDismountedHorse', { playerId: socket.id, horseId });
  });

  socket.on('horseMoved', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).volatile.emit('horsePositionUpdate', { ...data, riderId: socket.id });
  });

  socket.on('bottleHit', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('bottleHit', data);
  });

  socket.on('ostrichKill', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('ostrichKill');
  });

  socket.on('cowCorralled', ({ id }) => {
    if (!currentRoom || typeof id !== 'number' || id < 0 || id >= 33) return;
    if (!corralledCows.has(currentRoom)) corralledCows.set(currentRoom, new Set());
    const set = corralledCows.get(currentRoom);
    if (set.has(id)) return;                            // already counted
    set.add(id);
    io.to(currentRoom).emit('cowCorralled', { id, total: set.size });
    console.log(`[${currentRoom}] Vaca ${id} corralada (${set.size}/33)`);
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
