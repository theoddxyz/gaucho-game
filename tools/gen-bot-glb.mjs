/**
 * Generates public/models/bot.glb — a simple placeholder humanoid for enemy bots.
 * Open in Blender to customize. Named nodes: body, head, arm_l, arm_r, leg_l, leg_r, gun.
 * Run from project root: node tools/gen-bot-glb.mjs
 */
import { Document, NodeIO } from '@gltf-transform/core';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH  = path.join(__dirname, '..', 'public', 'models', 'bot.glb');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const doc = new Document();

const buf   = doc.createBuffer();
const scene = doc.createScene('Scene');

function hex2rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

/** Create a box mesh node centered at (cx, cy, cz) with dimensions (w, h, d). */
function boxNode(name, cx, cy, cz, w, h, d, hexColor = '#555555') {
  const hw = w / 2, hh = h / 2, hd = d / 2;

  // 24 unique vertices (4 per face × 6 faces) for correct flat normals
  // prettier-ignore
  const pos = new Float32Array([
    // +X
    cx+hw, cy-hh, cz-hd,  cx+hw, cy+hh, cz-hd,  cx+hw, cy+hh, cz+hd,  cx+hw, cy-hh, cz+hd,
    // -X
    cx-hw, cy-hh, cz+hd,  cx-hw, cy+hh, cz+hd,  cx-hw, cy+hh, cz-hd,  cx-hw, cy-hh, cz-hd,
    // +Y
    cx-hw, cy+hh, cz-hd,  cx-hw, cy+hh, cz+hd,  cx+hw, cy+hh, cz+hd,  cx+hw, cy+hh, cz-hd,
    // -Y
    cx-hw, cy-hh, cz+hd,  cx-hw, cy-hh, cz-hd,  cx+hw, cy-hh, cz-hd,  cx+hw, cy-hh, cz+hd,
    // +Z
    cx-hw, cy-hh, cz+hd,  cx+hw, cy-hh, cz+hd,  cx+hw, cy+hh, cz+hd,  cx-hw, cy+hh, cz+hd,
    // -Z
    cx+hw, cy-hh, cz-hd,  cx-hw, cy-hh, cz-hd,  cx-hw, cy+hh, cz-hd,  cx+hw, cy+hh, cz-hd,
  ]);

  // prettier-ignore
  const idx = new Uint16Array([
     0, 1, 2,  0, 2, 3,
     4, 5, 6,  4, 6, 7,
     8, 9,10,  8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23,
  ]);

  // Flat normals per face (4 repeated per face)
  // prettier-ignore
  const nrm = new Float32Array([
     1,0,0,  1,0,0,  1,0,0,  1,0,0,
    -1,0,0, -1,0,0, -1,0,0, -1,0,0,
     0,1,0,  0,1,0,  0,1,0,  0,1,0,
     0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
     0,0,1,  0,0,1,  0,0,1,  0,0,1,
     0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
  ]);

  const aPos = doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf);
  const aNrm = doc.createAccessor().setType('VEC3').setArray(nrm).setBuffer(buf);
  const aIdx = doc.createAccessor().setType('SCALAR').setArray(idx).setBuffer(buf);

  const [r, g, b] = hex2rgb(hexColor);
  const mat = doc.createMaterial(name + '_mat')
    .setBaseColorFactor([r, g, b, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.9);

  const prim = doc.createPrimitive()
    .setIndices(aIdx)
    .setAttribute('POSITION', aPos)
    .setAttribute('NORMAL', aNrm)
    .setMaterial(mat);

  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name).setMesh(mesh);
  scene.addChild(node);
  return node;
}

/** Empty node (no mesh) — used for firepoint, etc. */
function emptyNode(name, tx, ty, tz) {
  const node = doc.createNode(name).setTranslation([tx, ty, tz]);
  scene.addChild(node);
  return node;
}

// ─── Bot humanoid ─────────────────────────────────────────────────────────────
//
//   y=0  ground (feet bottom)
//   Proportions: ~1.85 tall, blocky/robotic look
//
//   Torso:  0.70 × 1.05 × 0.45  center y = 0.92
//   Head:   0.42 × 0.42 × 0.42  center y = 1.62
//   Visor:  0.38 × 0.10 × 0.06  center y = 1.65  (front)
//   Arm L:  0.22 × 0.88 × 0.22  center y = 0.80  x = -0.48
//   Arm R:  mirror
//   Leg L:  0.24 × 0.82 × 0.24  center y = 0.41  x = -0.16
//   Leg R:  mirror
//   Gun:    0.08 × 0.08 × 0.55  center y = 0.90  x = -0.42  z = 0.28 (L hand)

const DARK   = '#222222';
const METAL  = '#3a3a3a';
const VISOR  = '#cc3300';
const GUN_C  = '#1a1a1a';
const BOOT   = '#111111';

boxNode('body',  0.00, 0.92, 0.00, 0.70, 1.05, 0.45, DARK);
boxNode('head',  0.00, 1.62, 0.00, 0.42, 0.42, 0.42, METAL);
boxNode('visor', 0.00, 1.65, 0.22, 0.34, 0.09, 0.06, VISOR);  // glowing red visor
boxNode('arm_l',-0.48, 0.80, 0.00, 0.22, 0.88, 0.22, METAL);
boxNode('arm_r', 0.48, 0.80, 0.00, 0.22, 0.88, 0.22, METAL);
boxNode('leg_l',-0.16, 0.41, 0.00, 0.24, 0.82, 0.24, DARK);
boxNode('leg_r', 0.16, 0.41, 0.00, 0.24, 0.82, 0.24, DARK);
boxNode('boot_l',-0.16, 0.06, 0.04, 0.26, 0.12, 0.32, BOOT);
boxNode('boot_r', 0.16, 0.06, 0.04, 0.26, 0.12, 0.32, BOOT);
boxNode('gun',  -0.50, 0.88, 0.26, 0.08, 0.09, 0.50, GUN_C);
emptyNode('firepoint', -0.50, 0.88, 0.52);  // muzzle origin for flash

// ─── Write GLB ────────────────────────────────────────────────────────────────
mkdirSync(path.dirname(OUT_PATH), { recursive: true });
const io  = new NodeIO();
const glb = await io.writeBinary(doc);
writeFileSync(OUT_PATH, Buffer.from(glb));
console.log(`✓  bot.glb generado en ${OUT_PATH}`);
console.log(`   Nodos: body, head, visor, arm_l, arm_r, leg_l, leg_r, boot_l, boot_r, gun, firepoint`);
console.log(`   Abrí con Blender y personalizá. NUNCA sobreescribas el archivo si ya lo modificaste.`);
