// --- Infinite world via streaming chunks ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WATER_ZONES } from './landmarks.js';

function _inWater(x, z) {
  for (const w of WATER_ZONES) {
    const dx = x - w.x, dz = z - w.z;
    if (dx * dx + dz * dz < w.r * w.r) return true;
  }
  return false;
}

export const CHUNK_SIZE    = 200;
const LOAD_RADIUS          = 2;
const UNLOAD_DIST          = 3;
const TREES_PER_CHUNK      = 10;
const ROCKS_PER_CHUNK      = 14;  // more rocks
const PEBBLES_PER_CHUNK    = 40;  // new: small flat pebbles

const loader = new GLTFLoader();
let treeTemplate = null;
let rockTemplate = null;

// ─── World-space procedural terrain (GLSL shader, zero tiling) ───────────────
// FBM runs in the GPU using world XZ, so the pattern is continuous and unique
// across every chunk — the same coordinate always gives the same color.
// Colors (linear, sRGB→linear via pow(c/255, 2.2)):
//   wet  #38240606 → (0.040, 0.020, 0.002)
//   base #a8844a   → (0.400, 0.248, 0.073)
//   dry  #c8aa78   → (0.575, 0.405, 0.186)
const TERRAIN_MAT = new THREE.MeshStandardMaterial({ roughness: 0.92 });
TERRAIN_MAT.onBeforeCompile = (shader) => {
  // Pass world position to fragment shader
  shader.vertexShader = 'varying vec3 vWPos;\n' + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(position,1.0)).xyz;'
  );
  // Prepend helpers to fragment shader
  shader.fragmentShader = `
varying vec3 vWPos;
float _h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float _vn(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(_h(i),_h(i+vec2(1,0)),u.x),mix(_h(i+vec2(0,1)),_h(i+vec2(1,1)),u.x),u.y);
}
float _fbm(vec2 p){float v=0.,a=.55;for(int i=0;i<5;i++){v+=_vn(p)*a;p*=2.07;a*=.5;}return v;}
` + shader.fragmentShader;
  // Replace map_fragment include with world-space FBM color
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <map_fragment>',
    `{
      vec2 wp = vWPos.xz;
      float n = _fbm(wp/90.)*0.72 + _fbm(wp/18.+vec2(7.3,3.9))*0.28;
      vec3 wet  = vec3(0.040,0.020,0.002);
      vec3 base = vec3(0.400,0.248,0.073);
      vec3 dry  = vec3(0.575,0.405,0.186);
      diffuseColor.rgb = n<0.36 ? mix(wet,base,n/0.36) : mix(base,dry,(n-0.36)/0.64);
    }`
  );
};
TERRAIN_MAT.customProgramCacheKey = () => 'terrain_world_fbm';

// ─── Shared pebble geometry + material palette ────────────────────────────────
// Slightly varied earth tones close to #cca465
const PEBBLE_GEOS = [
  new THREE.SphereGeometry(0.15, 6, 4),
  new THREE.SphereGeometry(0.24, 6, 4),
  new THREE.SphereGeometry(0.34, 7, 4),
  new THREE.SphereGeometry(0.44, 7, 5),
];
const PEBBLE_MATS = [
  new THREE.MeshStandardMaterial({ color: 0xcaa050, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xb88c40, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xd8bc70, roughness: 0.93 }),
  new THREE.MeshStandardMaterial({ color: 0xa07840, roughness: 0.97 }),
  new THREE.MeshStandardMaterial({ color: 0xc09858, roughness: 0.95 }),
  new THREE.MeshStandardMaterial({ color: 0xe2c888, roughness: 0.90 }),
];

// ─── Template loading ─────────────────────────────────────────────────────────
let _tplPromise = null;
function loadTemplates() {
  if (_tplPromise) return _tplPromise;
  const load = (url, setter) => new Promise(r => loader.load(url, g => { setter(g.scene); r(); }, null, r));
  _tplPromise = Promise.all([
    load('/models/tree.glb', s => { treeTemplate = s; }),
    load('/models/rock.glb', s => { rockTemplate = s; }),
  ]);
  return _tplPromise;
}

// Deterministic seeded RNG — same coords → same layout always
function makeRng(cx, cz) {
  let s = (Math.abs((cx * 73856093) ^ (cz * 19349663) ^ (cx * cz * 1664525)) || 1) >>> 0;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

// ─── ChunkManager ─────────────────────────────────────────────────────────────
export class ChunkManager {
  constructor(scene, colliders) {
    this.scene     = scene;
    this.colliders = colliders;
    this.chunks    = new Map();
    this._pending  = new Set();

    loadTemplates().then(() => {
      for (const key of this._pending) {
        const [cx, cz] = key.split(',').map(Number);
        this._build(cx, cz);
      }
      this._pending.clear();
    });
  }

  update(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK_SIZE);
    const cz = Math.floor(playerPos.z / CHUNK_SIZE);

    for (let dx = -LOAD_RADIUS; dx <= LOAD_RADIUS; dx++)
      for (let dz = -LOAD_RADIUS; dz <= LOAD_RADIUS; dz++)
        this._request(cx + dx, cz + dz);

    for (const key of this.chunks.keys()) {
      const [kcx, kcz] = key.split(',').map(Number);
      if (Math.abs(kcx - cx) > UNLOAD_DIST || Math.abs(kcz - cz) > UNLOAD_DIST)
        this._unload(key);
    }
  }

  _request(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key) || this._pending.has(key)) return;
    this._pending.add(key);
    if (treeTemplate !== null) setTimeout(() => this._build(cx, cz), 0);
  }

  _build(cx, cz) {
    const key = `${cx},${cz}`;
    if (this.chunks.has(key)) { this._pending.delete(key); return; }

    const rng = makeRng(cx, cz);
    const ox  = cx * CHUNK_SIZE + CHUNK_SIZE / 2;
    const oz  = cz * CHUNK_SIZE + CHUNK_SIZE / 2;
    const objects = [];
    const ownColliders = [];

    // ── Ground ───────────────────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 4, 4),
      TERRAIN_MAT
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(ox, 0, oz);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // ── Trees ─────────────────────────────────────────────────────────────────
    if (treeTemplate) {
      for (let i = 0; i < TREES_PER_CHUNK; i++) {
        const tx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const tz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        if (_inWater(tx, tz)) { rng(); rng(); rng(); continue; } // skip water areas (consume rng for consistency)
        const t  = treeTemplate.clone(true);
        const s  = 0.35 + rng() * 0.15;
        t.position.set(tx, 0, tz);
        t.scale.setScalar(s);
        t.rotation.y = rng() * Math.PI * 2;
        t.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.scene.add(t);
        objects.push(t);
        ownColliders.push({ x: tx, z: tz, sx: 1, sy: 5, sz: 1 });
      }
    }

    // ── Rocks (medium–large) ──────────────────────────────────────────────────
    if (rockTemplate) {
      for (let i = 0; i < ROCKS_PER_CHUNK; i++) {
        const rx = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
        const rz = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
        if (_inWater(rx, rz)) { rng(); rng(); rng(); rng(); continue; }
        const r  = rockTemplate.clone(true);
        const rs = 0.5 + rng() * 1.0;
        const rh = 0.35 + rng() * 0.55;
        r.position.set(rx, 0, rz);
        r.scale.set(rs, rs * rh, rs * (0.8 + rng() * 0.4));
        r.rotation.y = rng() * Math.PI * 2;
        r.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        this.scene.add(r);
        objects.push(r);
        ownColliders.push({ x: rx, z: rz, sx: rs * 1.6, sy: 2, sz: rs * 1.6 });
      }
    }

    // ── Pebbles (small flat stones, no colliders) ─────────────────────────────
    for (let i = 0; i < PEBBLES_PER_CHUNK; i++) {
      const px  = cx * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const pz  = cz * CHUNK_SIZE + rng() * CHUNK_SIZE;
      const geo = PEBBLE_GEOS[Math.floor(rng() * PEBBLE_GEOS.length)];
      const pm  = PEBBLE_MATS[Math.floor(rng() * PEBBLE_MATS.length)];
      const p   = new THREE.Mesh(geo, pm);
      const sxz = 0.6 + rng() * 1.1;         // horizontal scale variety
      const sy  = 0.28 + rng() * 0.22;        // very flat
      // half-embed in ground so pebble sits naturally
      p.position.set(px, geo.parameters.radius * sy * 0.45, pz);
      p.scale.set(sxz, sy, sxz * (0.7 + rng() * 0.6));
      p.rotation.y = rng() * Math.PI * 2;
      p.receiveShadow = true;
      p.castShadow    = true;
      this.scene.add(p);
      objects.push(p);
    }

    ownColliders.forEach(c => this.colliders.push(c));
    this.chunks.set(key, { ground, objects, ownColliders });
    this._pending.delete(key);
  }

  _unload(key) {
    const chunk = this.chunks.get(key);
    if (!chunk) return;
    this.scene.remove(chunk.ground);
    chunk.ground.geometry.dispose();
    for (const obj of chunk.objects) this.scene.remove(obj);
    for (const c of chunk.ownColliders) {
      const idx = this.colliders.indexOf(c);
      if (idx >= 0) this.colliders.splice(idx, 1);
    }
    this.chunks.delete(key);
  }
}
