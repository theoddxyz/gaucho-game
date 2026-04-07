// --- Hand-placed world landmarks (loaded from GLB so user can edit in Blender) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let   _scene  = null;

// ─── Water zones (world-space circles to exclude from tree/rock placement) ───
// Shack scaled 1.3×, so lagoon local offset (16,0,4) → (20.8,0,5.2); r also × 1.3
export const WATER_ZONES = [
  { x:  4.8 + 20.8, z: -52.9 + 5.2, r: 26 },   // near-spawn shack
  { x: -6258 + 20.8, z: 2023.4 + 5.2, r: 26 },  // far shack
];

function _inWater(x, z) {
  for (const w of WATER_ZONES) {
    const dx = x - w.x, dz = z - w.z;
    if (dx * dx + dz * dz < w.r * w.r) return true;
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
  polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4,
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

export function hitBottle(mesh, aimDir) {
  const b = _bottles.find(b => b.mesh === mesh);
  if (!b || b.falling || b.fallen) return;
  b.falling = true;
  b.t = 0;
  // Rotation axis = perpendicular to aim direction (bottle tips in aim direction)
  const fd = new THREE.Vector3(aimDir.x, 0, aimDir.z).normalize();
  b.rotAxis = new THREE.Vector3(-fd.z, 0, fd.x); // 90° rot of fd in XZ
  b.startPos  = b.mesh.position.clone();
  b.startQuat = b.mesh.quaternion.clone();
}

function _tickBottles(dt) {
  for (const b of _bottles) {
    if (!b.falling || b.fallen) continue;
    b.t += dt / 0.35;
    if (b.t >= 1) { b.t = 1; b.fallen = true; }
    const ease = 1 - Math.pow(1 - b.t, 2); // ease-out
    const angle = (Math.PI / 2) * ease;
    const q = new THREE.Quaternion().setFromAxisAngle(b.rotAxis, angle);
    b.mesh.quaternion.copy(b.startQuat).multiply(q);
    // Slide forward slightly
    b.mesh.position.copy(b.startPos).addScaledVector(b.rotAxis.clone().cross(new THREE.Vector3(0,1,0)).negate(), ease * 0.18);
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
    color: 0xff7700, size: 0.38,
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  })));

  const sArr = new Float32Array(NS * 3);
  const sAttr = new THREE.BufferAttribute(sArr, 3);
  const sGeo  = new THREE.BufferGeometry();
  sGeo.setAttribute('position', sAttr);
  _scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
    color: 0x666666, size: 0.75,
    transparent: true, opacity: 0.22, depthWrite: false,
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
      // Fire spawn point — may be a non-mesh empty object
      if (/firecamppoint/i.test(o.name)) {
        const wp = new THREE.Vector3();
        o.getWorldPosition(wp);
        const ef = _createFireEffect(wp.x, wp.y, wp.z);
        if (ef) _fires.push(ef);
      }

      if (!o.isMesh) return;
      o.castShadow    = true;
      o.receiveShadow = true;

      const nm = o.name.toLowerCase();

      // Shootable bottles — register for physics
      if (/botel|bottle/i.test(nm)) {
        _bottles.push({ mesh: o, falling: false, fallen: false, t: 0,
                        startPos: o.position.clone(), startQuat: o.quaternion.clone(),
                        rotAxis: new THREE.Vector3(1, 0, 0) });
      }

      if (/water|lagoon|lago|agua/i.test(nm)) {
        // Replace with animated water material
        o.material = _waterMat;
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

export function createLandmarks(scene) {
  _scene = scene;
  loadAt('/models/camp.glb',   scene, -7823.3, 0, 5424.2);
  loadAt('/models/well.glb',   scene, -7656.9, 0, 5268.8);
  loadAt('/models/skulls.glb', scene, -7173.3, 0, 2997.3);
  loadAt('/models/shack.glb',  scene, -6258.0, 0, 2023.4, 0, 1.3);
  loadAt('/models/shack.glb',  scene,     4.8, 0,  -52.9, 0, 1.3);
}
