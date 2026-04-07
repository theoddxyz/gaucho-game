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
const rooms = new Map();

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

          io.to(currentRoom).emit('playerKilled', {
            killerId: socket.id,
            killerName: playerData.name,
            killerKills: playerData.kills,
            victimId: data.hitId,
            victimName: target.name,
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
      if (room.size === 0) { rooms.delete(currentRoom); npcSessions.delete(currentRoom); }
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
