/**
 * bake-lightmaps.mjs — Prebake AO + directional sun shadows for GAUCHO terrain.
 *
 * Run: node scripts/bake-lightmaps.mjs
 *
 * Output: public/lightmaps/lm_HH.png  (one per hour: 06 09 12 15 18 21)
 *         public/lightmaps/ao.png      (static ambient occlusion, hour-independent)
 *
 * Requires: three-mesh-bvh, pngjs  (npm install three-mesh-bvh pngjs)
 */

import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast, SAH } from 'three-mesh-bvh';
import { PNG } from 'pngjs';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// ── Paths ──────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');

// Load world_layout.json (without assert for broader Node compat)
const require = createRequire(import.meta.url);
const worldLayout = require(path.join(ROOT, 'src', 'data', 'world_layout.json'));

// ── Lightmap config (mirrors src/lightmap-config.js) ─────────────────────────
const LM_CENTER_X = 0;
const LM_CENTER_Z = -30;
const LM_COVER_W  = 500;
const LM_COVER_H  = 500;
const LM_SIZE     = 1024;

// ── Bake parameters ────────────────────────────────────────────────────────────
const AO_RAYS   = 64;    // hemisphere rays per texel for ambient occlusion
const AO_DIST   = 18;    // max AO ray distance (meters) — stops at 18m
const SUN_RAYS  = 1;     // rays toward sun (1=hard, 3=soft with jitter)

// ── Sun directions per time slot ──────────────────────────────────────────────
// dir points FROM surface TOWARD sun (must be normalised)
const SUN_TIMES = [
  { hour:  6, dir: new THREE.Vector3(-0.82, 0.22,  0.53).normalize() },
  { hour:  9, dir: new THREE.Vector3(-0.50, 0.72,  0.28).normalize() },
  { hour: 12, dir: new THREE.Vector3( 0.05, 0.99,  0.14).normalize() },
  { hour: 15, dir: new THREE.Vector3( 0.50, 0.72, -0.28).normalize() },
  { hour: 18, dir: new THREE.Vector3( 0.82, 0.22, -0.53).normalize() },
  { hour: 21, dir: null },  // night — no direct sun
];

// ── Approximate building bounding boxes ──────────────────────────────────────
// Format: { w(X), h(Y), d(Z) }  all in world units.  Height is full box height.
const BUILDING_DEFS = {
  house:     { w: 10.2, h: 7.2,  d: 14.2  },
  townhall:  { w: 22.2, h: 9.0,  d: 17.2  },
  church:    { w: 11.2, h: 12.0, d: 24.4  },
  farm:      { w: 18.2, h: 3.2,  d: 14.2  }, // shed shadow
  cowcorral: { w: 32.2, h: 2.0,  d: 24.2  }, // fence rows
  corral:    { w: 10.2, h: 1.6,  d: 10.2  },
};

// ── Build merged occluder geometry ────────────────────────────────────────────
function buildOccluders() {
  const geos = [];

  for (const obj of worldLayout.objects) {
    const def = BUILDING_DEFS[obj.type];
    if (!def) continue;

    const geo = new THREE.BoxGeometry(def.w, def.h, def.d);
    // Translate: position at (x, h/2, z) so base sits on y=0
    const mat4 = new THREE.Matrix4().makeTranslation(obj.x, def.h / 2, obj.z);
    if (obj.ry) {
      mat4.premultiply(new THREE.Matrix4().makeRotationY(obj.ry));
    }
    geo.applyMatrix4(mat4);
    geos.push(geo);
  }

  // Also add the establo (stable) at (1000, 0, 1000) — outside village coverage
  // but skip since it's outside our lightmap area anyway

  if (geos.length === 0) throw new Error('No building geometry — check world_layout.json path');
  console.log(`  ${geos.length} buildings loaded`);
  return geos;
}

// ── Merge multiple BufferGeometries into one ───────────────────────────────────
function mergeGeometries(geos) {
  // Count totals
  let totalVerts = 0, totalIdx = 0;
  for (const g of geos) {
    totalVerts += g.attributes.position.count;
    totalIdx   += g.index ? g.index.count : g.attributes.position.count;
  }

  const positions = new Float32Array(totalVerts * 3);
  const indices   = new Uint32Array(totalIdx);
  let vOff = 0, iOff = 0;

  for (const g of geos) {
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      positions[(vOff + i) * 3    ] = pos.getX(i);
      positions[(vOff + i) * 3 + 1] = pos.getY(i);
      positions[(vOff + i) * 3 + 2] = pos.getZ(i);
    }
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) indices[iOff + i] = g.index.array[i] + vOff;
      iOff += g.index.count;
    } else {
      for (let i = 0; i < pos.count; i++) indices[iOff + i] = i + vOff;
      iOff += pos.count;
    }
    vOff += pos.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  return merged;
}

// ── Cosine-weighted hemisphere samples (around Y+ axis) ───────────────────────
function makeCosineHemiSamples(N) {
  const out = [];
  for (let i = 0; i < N; i++) {
    // Halton-like stratified: u1,u2 from quasi-random sequence
    const u1 = (i + 0.5) / N;
    const u2 = ((i * 2654435761) >>> 0) / 4294967296;
    const r = Math.sqrt(u1);
    const theta = 2 * Math.PI * u2;
    out.push(new THREE.Vector3(r * Math.cos(theta), Math.sqrt(1 - u1), r * Math.sin(theta)));
  }
  return out;
}

// ── Write a greyscale PNG ──────────────────────────────────────────────────────
function writeGreyPng(data, filepath) {
  const png = new PNG({ width: LM_SIZE, height: LM_SIZE });
  for (let i = 0; i < LM_SIZE * LM_SIZE; i++) {
    const v = Math.max(0, Math.min(255, Math.round(data[i] * 255)));
    png.data[i * 4    ] = v;
    png.data[i * 4 + 1] = v;
    png.data[i * 4 + 2] = v;
    png.data[i * 4 + 3] = 255;
  }
  fs.writeFileSync(filepath, PNG.sync.write(png));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌞  GAUCHO Lightmap Baker');
  console.log(`    Coverage: ${LM_COVER_W}×${LM_COVER_H} units around (${LM_CENTER_X}, ${LM_CENTER_Z})`);
  console.log(`    Resolution: ${LM_SIZE}×${LM_SIZE} px\n`);

  // ── 1. Build BVH ────────────────────────────────────────────────────────────
  console.log('● Building BVH from scene geometry...');
  const geos   = buildOccluders();
  const merged = mergeGeometries(geos);
  const bvh    = new MeshBVH(merged, { strategy: SAH });
  merged.boundsTree = bvh;

  // Patch THREE raycaster to use BVH
  THREE.Mesh.prototype.raycast = acceleratedRaycast;
  const occMesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial());
  occMesh.geometry.boundsTree = bvh;

  const ray  = new THREE.Raycaster();
  ray.firstHitOnly = true;

  // ── 2. Bake AO (static, hour-independent) ──────────────────────────────────
  console.log(`● Baking AO (${AO_RAYS} rays/texel)...`);
  const hemiSamples = makeCosineHemiSamples(AO_RAYS);
  const aoData      = new Float32Array(LM_SIZE * LM_SIZE);
  const t0 = Date.now();

  for (let py = 0; py < LM_SIZE; py++) {
    for (let px = 0; px < LM_SIZE; px++) {
      const wx = LM_CENTER_X + (px / LM_SIZE - 0.5) * LM_COVER_W;
      const wz = LM_CENTER_Z + (py / LM_SIZE - 0.5) * LM_COVER_H;
      const org = new THREE.Vector3(wx, 0.08, wz);

      let blocked = 0;
      for (const d of hemiSamples) {
        ray.set(org, d);
        ray.far = AO_DIST;
        if (ray.intersectObject(occMesh, false).length > 0) blocked++;
      }
      // AO: 1=no occlusion, 0=fully occluded. Strength 0.80.
      aoData[py * LM_SIZE + px] = 1.0 - (blocked / AO_RAYS) * 0.80;
    }

    if (py % 128 === 0 || py === LM_SIZE - 1) {
      const pct  = Math.round((py + 1) / LM_SIZE * 100);
      const sec  = ((Date.now() - t0) / 1000).toFixed(1);
      const eta  = py > 0 ? ((Date.now() - t0) / py * (LM_SIZE - py) / 1000).toFixed(0) : '?';
      process.stdout.write(`\r  ${pct}%  ${sec}s elapsed  ~${eta}s remaining   `);
    }
  }
  console.log('\r  ✓ AO done' + ' '.repeat(40));

  const outDir = path.join(ROOT, 'public', 'lightmaps');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  writeGreyPng(aoData, path.join(outDir, 'ao.png'));
  console.log(`  → public/lightmaps/ao.png`);

  // ── 3. Bake per-time lightmaps (AO × shadow) ───────────────────────────────
  for (const { hour, dir } of SUN_TIMES) {
    const label = `${String(hour).padStart(2, '0')}h`;
    console.log(`● Baking lm_${label} (sun: ${dir ? dir.toArray().map(v=>v.toFixed(2)).join(', ') : 'none'})...`);

    const lmData = new Float32Array(LM_SIZE * LM_SIZE);
    const t1 = Date.now();

    for (let py = 0; py < LM_SIZE; py++) {
      for (let px = 0; px < LM_SIZE; px++) {
        const idx = py * LM_SIZE + px;
        const ao  = aoData[idx];

        let sun = 1.0;
        if (dir) {
          const wx  = LM_CENTER_X + (px / LM_SIZE - 0.5) * LM_COVER_W;
          const wz  = LM_CENTER_Z + (py / LM_SIZE - 0.5) * LM_COVER_H;
          const org = new THREE.Vector3(wx, 0.08, wz);
          ray.set(org, dir);
          ray.far = 600;
          sun = ray.intersectObject(occMesh, false).length > 0 ? 0.0 : 1.0;
        }

        // Combined: shadow attenuates 70% of brightness, AO attenuates on top.
        // Minimum value 0.08 (never pitch black — sky ambient always present).
        lmData[idx] = Math.max(0.08, (sun * 0.70 + 0.30) * ao);
      }

      if (py % 128 === 0 || py === LM_SIZE - 1) {
        const pct = Math.round((py + 1) / LM_SIZE * 100);
        const eta = py > 0 ? ((Date.now() - t1) / py * (LM_SIZE - py) / 1000).toFixed(0) : '?';
        process.stdout.write(`\r  ${pct}%  ~${eta}s remaining   `);
      }
    }

    writeGreyPng(lmData, path.join(outDir, `lm_${label}.png`));
    console.log(`\r  ✓ lm_${label}.png` + ' '.repeat(40));
  }

  // ── 4. Write manifest ───────────────────────────────────────────────────────
  const manifest = {
    generated: new Date().toISOString(),
    centerX: LM_CENTER_X, centerZ: LM_CENTER_Z,
    coverW: LM_COVER_W,   coverH: LM_COVER_H,
    size: LM_SIZE,
    hours: SUN_TIMES.map(t => t.hour),
  };
  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  const total = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✅  Done in ${total}s — ${SUN_TIMES.length + 1} textures baked`);
  console.log('   Now run: npm run build\n');
}

main().catch(err => { console.error(err); process.exit(1); });
