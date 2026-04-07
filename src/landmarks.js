// --- Hand-placed world landmarks (loaded from GLB so user can edit in Blender) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let   _scene  = null;

// ─── Water zones — for chunk.js tree/rock exclusion (populated from lagoon bbox) ───
export const WATER_ZONES = [];

// ─── NPC position (world-space, near campfire) ────────────────────────────────
export const NPC_POSITION = { x: 11.5, z: -73.5 };

// Actual lagoon meshes — used for precise raycast-based "is over water" check
const _lagoonMeshes = [];
const _waterRay = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0));

function _inWater(x, z) {
  if (_lagoonMeshes.length === 0) return false;
  _waterRay.ray.origin.set(x, 10, z);
  for (const m of _lagoonMeshes) {
    if (_waterRay.intersectObject(m, false).length > 0) return true;
  }
  return false;
}

// ─── Shore material — matches terrain base/dry colors ────────────────────────
const _shoreMat = new THREE.MeshStandardMaterial({
  color: 0xb89460,   // close to terrain DRY #c8aa78
  roughness: 0.95,
  polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4,
});

// ─── Animated water material ──────────────────────────────────────────────────
function _makeWaterTex() {
  const S = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(S, S);
  const d = img.data;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const w1 = Math.sin(x / 18 + y / 24) * 0.5 + 0.5;
      const w2 = Math.sin(x / 9  - y / 14) * 0.25 + 0.5;
      const n  = w1 * 0.65 + w2 * 0.35;
      const i  = (y * S + x) * 4;
      d[i]   = 18  + n * 22 | 0;
      d[i+1] = 68  + n * 32 | 0;
      d[i+2] = 95  + n * 48 | 0;
      d[i+3] = 240;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}
const _waterTex = _makeWaterTex();
const _waterMat = new THREE.MeshStandardMaterial({
  map: _waterTex,
  roughness: 0.04, metalness: 0.18,
  transparent: true, opacity: 0.88,
  depthWrite: false,
  polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8,
});

// ─── Ripple system ────────────────────────────────────────────────────────────
const _ripples         = [];
const _rippleCooldowns = new Map();   // entityKey → timestamp
const RIPPLE_CD        = 0.28;        // seconds between ripples per entity
let   _time            = 0;

function _spawnRipple(x, z) {
  if (!_scene) return;
  const geo = new THREE.RingGeometry(0.1, 0.28, 22);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x99ddee, transparent: true, opacity: 0.55,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.position.set(x, 0.08, z);
  _scene.add(ring);
  _ripples.push({ ring, mat, t: 0, dur: 1.6, maxScale: 14 });
}

function _checkRipple(key, x, z) {
  if (!_inWater(x, z)) return;
  const last = _rippleCooldowns.get(key) || 0;
  if (_time - last < RIPPLE_CD) return;
  _rippleCooldowns.set(key, _time);
  _spawnRipple(x, z);
}

function _updateRipples(dt) {
  for (let i = _ripples.length - 1; i >= 0; i--) {
    const r = _ripples[i];
    r.t += dt;
    const p = r.t / r.dur;
    r.ring.scale.setScalar(1 + p * r.maxScale);
    r.mat.opacity = 0.55 * (1 - p);
    if (p >= 1) {
      _scene.remove(r.ring);
      r.ring.geometry.dispose();
      r.mat.dispose();
      _ripples.splice(i, 1);
    }
  }
}

// ─── Bottle physics ───────────────────────────────────────────────────────────
// Each entry: { mesh, falling, t, startPos, startQuat, rotAxis }
const _bottles = [];

export function getBottleMeshes() {
  return _bottles.filter(b => !b.fallen).map(b => b.mesh);
}

export function getBottleKey(mesh) {
  return _bottles.find(b => b.mesh === mesh)?.key ?? null;
}

export function hitBottleByKey(key, aimDir) {
  const b = _bottles.find(b => b.key === key);
  if (b && !b.falling && !b.fallen) hitBottle(b.mesh, aimDir);
}

export function hitBottle(mesh, aimDir) {
  const b = _bottles.find(b => b.mesh === mesh);
  if (!b || b.falling || b.fallen) return;
  b.falling  = true;
  b.fallen   = false;
  b.t        = 0;
  b.startPos = mesh.position.clone();
  b.startQuat= mesh.quaternion.clone();
  // Velocity: forward in aim dir + upward arc
  const fd = new THREE.Vector3(aimDir.x, 0, aimDir.z).normalize();
  b.vel = { x: fd.x * 4.5, y: 5.5 + Math.random() * 2, z: fd.z * 4.5 };
  b.spin= new THREE.Vector3(
    (Math.random() - 0.5) * 18,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 18
  );
  b.currentPos = mesh.position.clone();
  b.currentQuat= mesh.quaternion.clone();
  // Shatter fragments
  _spawnShatter(mesh);
}

function _spawnShatter(mesh) {
  if (!_scene) return;
  const wp = new THREE.Vector3();
  mesh.getWorldPosition(wp);
  const geo = new THREE.TetrahedronGeometry(0.06, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x88ccaa, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 10; i++) {
    const frag = new THREE.Mesh(geo, mat);
    frag.position.copy(wp);
    frag.scale.setScalar(0.5 + Math.random() * 1.2);
    _scene.add(frag);
    const v = { x: (Math.random()-0.5)*8, y: 3+Math.random()*5, z: (Math.random()-0.5)*8 };
    const spin = new THREE.Vector3((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20);
    _shards.push({ mesh: frag, v, spin, t: 0 });
  }
}
const _shards = [];

function _tickBottles(dt) {
  const G = -12;
  for (const b of _bottles) {
    if (!b.falling || b.fallen) continue;
    b.t += dt;
    // Apply gravity to velocity
    b.vel.y += G * dt;
    b.currentPos.x += b.vel.x * dt;
    b.currentPos.y += b.vel.y * dt;
    b.currentPos.z += b.vel.z * dt;
    b.mesh.position.copy(b.currentPos);
    // Spin
    const dq = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(b.spin.x * dt, b.spin.y * dt, b.spin.z * dt)
    );
    b.currentQuat.multiply(dq);
    b.mesh.quaternion.copy(b.currentQuat);
    // Hit ground (y relative to local parent — approximate with 0)
    if (b.currentPos.y < b.startPos.y - 0.5 && b.t > 0.2) {
      b.fallen = true;
      b.mesh.visible = false; // hide bottle — shards already spawned
    }
  }
  // Animate shards
  for (let i = _shards.length - 1; i >= 0; i--) {
    const s = _shards[i];
    s.t += dt;
    s.v.y += G * dt;
    s.mesh.position.x += s.v.x * dt;
    s.mesh.position.y += s.v.y * dt;
    s.mesh.position.z += s.v.z * dt;
    const dq = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(s.spin.x * dt, s.spin.y * dt, s.spin.z * dt)
    );
    s.mesh.quaternion.multiply(dq);
    // Fade out after 1.5s, remove at 2.5s
    if (s.t > 1.5) s.mesh.material.opacity = Math.max(0, 0.85 * (1 - (s.t - 1.5)));
    if (s.t > 2.5) {
      _scene.remove(s.mesh);
      _shards.splice(i, 1);
    }
  }
}

// ─── Tumbleweed system ────────────────────────────────────────────────────────
const _tumbleweeds = [];
const TUMBLEWEED_MAX  = 6;
const TUMBLEWEED_LIFE = 22;   // seconds before despawn
const WIND_DIR = new THREE.Vector3(1, 0, 0.4).normalize();  // roughly E-SE
const WIND_SPEED = 4.5;        // world units / s
let   _tweedSpawnTimer    = 0;
let   _tweedNextSpawn     = 5.0;   // seconds until first spawn

// Pre-built tumbleweed template (reused via clone)
let _tweedTemplate = null;
function _ensureTweedTemplate() {
  if (_tweedTemplate) return;
  const VS = 0.10;
  const R  = 0.38;
  const SEGS = 8;
  const mat = new THREE.MeshStandardMaterial({ color: 0x9e8840, roughness: 0.98 });
  _tweedTemplate = new THREE.Group();
  const planes = [
    [1, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
  ];
  for (const [ax, ay, az, bx, by, bz] of planes) {
    for (let s = 0; s < SEGS; s++) {
      const a = (s / SEGS) * Math.PI * 2;
      const x = ax * Math.cos(a) * R + bx * Math.sin(a) * R;
      const y = ay * Math.cos(a) * R + by * Math.sin(a) * R;
      const z = az * Math.cos(a) * R + bz * Math.sin(a) * R;
      const m = new THREE.Mesh(new THREE.BoxGeometry(VS, VS, VS), mat);
      m.position.set(x, y + R, z);
      m.castShadow = true;
      _tweedTemplate.add(m);
    }
  }
  const inter = [
    [0, R*0.9, 0], [R*0.6, R*0.6, 0], [-R*0.6, R*0.6, 0],
    [0, R*0.9, R*0.4], [0, R*0.9, -R*0.4],
  ];
  for (const [ix, iy, iz] of inter) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(VS*1.2, VS*1.2, VS*1.2), mat);
    m.position.set(ix, iy, iz);
    m.castShadow = true;
    _tweedTemplate.add(m);
  }
}

function _spawnTumbleweed(playerPos) {
  if (!_scene || _tumbleweeds.length >= TUMBLEWEED_MAX) return;
  _ensureTweedTemplate();
  // Spawn upwind of player (opposite wind direction), randomized spread
  const spread = 60 + Math.random() * 80;
  const perp   = new THREE.Vector3(-WIND_DIR.z, 0, WIND_DIR.x);
  const side   = (Math.random() - 0.5) * 80;
  const spawnX = playerPos.x - WIND_DIR.x * spread + perp.x * side;
  const spawnZ = playerPos.z - WIND_DIR.z * spread + perp.z * side;

  const tw = _tweedTemplate.clone(true);
  tw.position.set(spawnX, 0, spawnZ);
  tw.rotation.set(0, Math.random() * Math.PI * 2, 0);
  _scene.add(tw);

  // Spin axis: perpendicular to wind direction
  const spinAxis = new THREE.Vector3(-WIND_DIR.z, 0, WIND_DIR.x).normalize();
  _tumbleweeds.push({
    mesh: tw,
    t: 0,
    spinAxis,
    // Slight speed variation per tumbleweed
    speed: WIND_SPEED * (0.7 + Math.random() * 0.7),
    bounce: Math.random() * Math.PI * 2,  // phase offset for bounce
  });
}

function _tickTumbleweeds(dt, playerPos) {
  _tweedSpawnTimer += dt;
  // Spawn a new tumbleweed every 4–7 seconds (next spawn time set on each spawn)
  if (_tweedSpawnTimer >= _tweedNextSpawn && playerPos) {
    _tweedSpawnTimer  = 0;
    _tweedNextSpawn   = 4.0 + Math.random() * 3.0;
    _spawnTumbleweed(playerPos);
  }

  const _qDelta = new THREE.Quaternion();
  for (let i = _tumbleweeds.length - 1; i >= 0; i--) {
    const tw = _tumbleweeds[i];
    tw.t += dt;

    // Move along wind direction
    tw.mesh.position.x += WIND_DIR.x * tw.speed * dt;
    tw.mesh.position.z += WIND_DIR.z * tw.speed * dt;

    // Bounce: sinusoidal Y oscillation (rolling over bumps)
    tw.mesh.position.y = Math.max(0, Math.abs(Math.sin(tw.t * 3.2 + tw.bounce)) * 0.18);

    // Roll: rotate around axis perpendicular to wind
    const rollAngle = (tw.speed / 0.38) * dt;  // arc-length / radius
    _qDelta.setFromAxisAngle(tw.spinAxis, rollAngle);
    tw.mesh.quaternion.multiply(_qDelta);

    // Despawn when far from player or life exceeded
    if (tw.t > TUMBLEWEED_LIFE) {
      _scene.remove(tw.mesh);
      _tumbleweeds.splice(i, 1);
    } else if (playerPos) {
      const dx = tw.mesh.position.x - playerPos.x;
      const dz = tw.mesh.position.z - playerPos.z;
      if (dx * dx + dz * dz > 220 * 220) {
        _scene.remove(tw.mesh);
        _tumbleweeds.splice(i, 1);
      }
    }
  }
}

// ─── Fire + smoke particle effect ────────────────────────────────────────────
const _fires = [];

function _createFireEffect(wx, wy, wz) {
  if (!_scene) return null;
  const NF = 30, NS = 12;
  const fd = Array.from({ length: NF }, () => ({
    life:  Math.random(),
    speed: 0.9 + Math.random() * 0.8,
    ox: (Math.random() - 0.5) * 0.45,
    oz: (Math.random() - 0.5) * 0.45,
  }));
  const sd = Array.from({ length: NS }, () => ({
    life:  Math.random(),
    speed: 0.28 + Math.random() * 0.22,
    ox: (Math.random() - 0.5) * 0.55,
    oz: (Math.random() - 0.5) * 0.55,
  }));

  const fArr = new Float32Array(NF * 3);
  const fAttr = new THREE.BufferAttribute(fArr, 3);
  const fGeo  = new THREE.BufferGeometry();
  fGeo.setAttribute('position', fAttr);
  _scene.add(new THREE.Points(fGeo, new THREE.PointsMaterial({
    color: 0xff6600, size: 0.55,
    transparent: true, opacity: 0.9, depthWrite: false,
    blending: THREE.AdditiveBlending,
  })));

  const sArr = new Float32Array(NS * 3);
  const sAttr = new THREE.BufferAttribute(sArr, 3);
  const sGeo  = new THREE.BufferGeometry();
  sGeo.setAttribute('position', sAttr);
  _scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
    color: 0x555555, size: 1.1,
    transparent: true, opacity: 0.28, depthWrite: false,
  })));

  return { fd, sd, fAttr, sAttr, wx, wy, wz };
}

function _tickFire(ef, dt) {
  const { fd, sd, fAttr, sAttr, wx, wy, wz } = ef;
  const fa = fAttr.array, sa = sAttr.array;
  for (let i = 0; i < fd.length; i++) {
    fd[i].life += dt * fd[i].speed;
    if (fd[i].life > 1) {
      fd[i].life -= 1;
      fd[i].ox = (Math.random() - 0.5) * 0.45;
      fd[i].oz = (Math.random() - 0.5) * 0.45;
    }
    fa[i*3]   = wx + fd[i].ox;
    fa[i*3+1] = wy + fd[i].life * 1.4;
    fa[i*3+2] = wz + fd[i].oz;
  }
  fAttr.needsUpdate = true;
  for (let i = 0; i < sd.length; i++) {
    sd[i].life += dt * sd[i].speed;
    if (sd[i].life > 1) {
      sd[i].life -= 1;
      sd[i].ox = (Math.random() - 0.5) * 0.55;
      sd[i].oz = (Math.random() - 0.5) * 0.55;
    }
    sa[i*3]   = wx + sd[i].ox;
    sa[i*3+1] = wy + 1.1 + sd[i].life * 3.2;
    sa[i*3+2] = wz + sd[i].oz;
  }
  sAttr.needsUpdate = true;
}

// ─── Per-frame update (called from main.js game loop) ────────────────────────
/** playerPos: {x,z}, mountedHorsePos: {x,z} | null */
export function updateLandmarkEffects(dt, playerPos, mountedHorsePos) {
  _time += dt;

  // Animate water surface UV (cheap GPU-side scrolling)
  _waterTex.offset.x += 0.04 * dt;
  _waterTex.offset.y += 0.025 * dt;
  _waterTex.needsUpdate = true;

  // Water ripples from player
  if (playerPos) _checkRipple('player', playerPos.x, playerPos.z);
  // Water ripples from mounted horse
  if (mountedHorsePos) _checkRipple('horse', mountedHorsePos.x, mountedHorsePos.z);

  _updateRipples(dt);
  for (const ef of _fires) _tickFire(ef, dt);
  _tickBottles(dt);
  _tickTumbleweeds(dt, playerPos);
}

// ─── GLB loader ──────────────────────────────────────────────────────────────
function loadAt(url, scene, x, y, z, ry = 0, scale = 1) {
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(x, y, z);
    model.rotation.y = ry;
    model.scale.setScalar(scale);
    model.updateMatrixWorld(true, true);

    model.traverse(o => {
      // Fire spawn point — empty or mesh; catches any firecamp / fogón variant
      if (/firecampoint|campfirepoint|firecamppoint|fogon|hoguera|campfire|firepit|fuego|brasero/i.test(o.name)) {
        const wp = new THREE.Vector3();
        o.getWorldPosition(wp);
        const ef = _createFireEffect(wp.x, wp.y, wp.z);
        if (ef) _fires.push(ef);
      }

      const nm = o.name.toLowerCase();

      // Shootable bottles — detect BEFORE isMesh check so multi-primitive Groups are caught
      if (/botel|bottle/i.test(nm) && !_bottles.some(b => b.mesh === o)) {
        const wp = new THREE.Vector3();
        o.getWorldPosition(wp);
        const key = `${wp.x.toFixed(1)}_${wp.z.toFixed(1)}`;
        _bottles.push({ mesh: o, key, falling: false, fallen: false, t: 0,
                        startPos: o.position.clone(), startQuat: o.quaternion.clone(),
                        rotAxis: new THREE.Vector3(1, 0, 0) });
      }

      if (!o.isMesh) return;
      o.castShadow    = true;
      o.receiveShadow = true;

      if (/water|lagoon|lago|agua/i.test(nm)) {
        o.material = _waterMat;
        o.renderOrder = 2;  // render after terrain
        // Lift slightly above ground to eliminate z-fighting
        o.position.y += 0.03;
        o.updateMatrixWorld(true, false);
        // Store actual mesh for precise raycast water detection
        _lagoonMeshes.push(o);
        // Also register bbox zone so chunk.js can exclude trees/rocks from lagoon area
        const bbox = new THREE.Box3().setFromObject(o);
        const center = new THREE.Vector3(); bbox.getCenter(center);
        WATER_ZONES.push({ x: center.x, z: center.z, r: 0, box: bbox.clone() });
      } else if (/shore|sand|arena|orilla|playa/i.test(nm)) {
        // Replace with terrain-matching shore material
        o.material = _shoreMat.clone();
      } else {
        // Generic flat ground-level mesh → polygon offset to prevent z-fighting
        const box = new THREE.Box3().setFromObject(o);
        if ((box.max.y - box.min.y) < 0.3 && box.min.y < 1.0) {
          o.material = o.material.clone();
          o.material.polygonOffset      = true;
          o.material.polygonOffsetFactor = -1;
          o.material.polygonOffsetUnits  = -4;
        }
      }
    });

    scene.add(model);
  }, undefined, (err) => console.warn(`[landmarks] failed to load ${url}`, err));
}

// ─── NPC mesh ─────────────────────────────────────────────────────────────────
function _buildNPC() {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xc07848, roughness: 0.8 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0x4a2c10, roughness: 0.85 });
  const pants = new THREE.MeshStandardMaterial({ color: 0x2c1e0a, roughness: 0.90 });
  const hat   = new THREE.MeshStandardMaterial({ color: 0x181004, roughness: 0.92 });
  const boot  = new THREE.MeshStandardMaterial({ color: 0x120c04, roughness: 0.88 });

  const mk = (geo, mat, px, py, pz, rx = 0, ry = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.rotation.set(rx, ry, 0);
    m.castShadow = true;
    g.add(m);
    return m;
  };

  // Small log to sit on
  mk(new THREE.CylinderGeometry(0.20, 0.22, 0.42, 9),
     new THREE.MeshStandardMaterial({ color: 0x3a2008, roughness: 0.97 }),
     0, 0.21, 0, 0, 0.5);

  // Torso (seated, lower than standing)
  mk(new THREE.BoxGeometry(0.40, 0.50, 0.22), shirt, 0, 0.60, 0);

  // Head
  mk(new THREE.SphereGeometry(0.16, 10, 8), skin, 0, 1.00, 0);

  // Sombrero brim + crown
  mk(new THREE.CylinderGeometry(0.30, 0.30, 0.04, 14), hat, 0, 1.17, 0);
  mk(new THREE.CylinderGeometry(0.14, 0.18, 0.22, 14), hat, 0, 1.29, 0);

  // Arms leaning forward toward fire
  for (const sx of [-1, 1]) {
    mk(new THREE.BoxGeometry(0.09, 0.34, 0.09), shirt, sx * 0.26, 0.66, 0.10, -0.65);
  }

  // Legs (seated — thighs horizontal, shins down)
  for (const sx of [-1, 1]) {
    mk(new THREE.BoxGeometry(0.13, 0.12, 0.32), pants, sx * 0.12, 0.38, 0.18, -0.20);
    mk(new THREE.BoxGeometry(0.11, 0.26, 0.11), pants, sx * 0.12, 0.16, 0.38,  0.30);
    mk(new THREE.BoxGeometry(0.12, 0.10, 0.22), boot,  sx * 0.12, 0.07, 0.50,  0);
  }

  return g;
}

export function createLandmarks(scene) {
  _scene = scene;

  // ── NPC ────────────────────────────────────────────────────────────────────
  const npc = _buildNPC();
  npc.position.set(NPC_POSITION.x, 0, NPC_POSITION.z);
  npc.rotation.y = -0.75; // faces roughly toward player spawn area
  scene.add(npc);

  // Fixed fire at shack campfire position
  const fixedFire = _createFireEffect(9.0, 0.2, -72.9);
  if (fixedFire) _fires.push(fixedFire);

  loadAt('/models/camp.glb',   scene, -7823.3, 0, 5424.2);
  loadAt('/models/well.glb',   scene, -7656.9, 0, 5268.8);
  loadAt('/models/skulls.glb', scene, -7173.3, 0, 2997.3);
  loadAt('/models/shack.glb',  scene, -6258.0, 0, 2023.4, 0, 1.56);
  loadAt('/models/shack.glb',  scene,     4.8, 0,  -52.9, 0, 1.56);
}
