// Generate GLB model files for GAUCHO game
import { Document, NodeIO } from '@gltf-transform/core';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'models');
await mkdir(OUT, { recursive: true });

const io = new NodeIO();

// Only write if file doesn't exist (preserve user edits)
// Pass --force to regenerate everything
const FORCE = process.argv.includes('--force');
async function writeGLB(filename, doc) {
  const dest = path.join(OUT, filename);
  if (!FORCE && existsSync(dest)) {
    console.log(`⏭  ${filename} (ya existe, usar --force para reemplazar)`);
    return;
  }
  await io.write(dest, doc);
  console.log(`✓  ${filename}`);
}

// --- Helpers ---
function acc(doc, buf, array, type) {
  return doc.createAccessor().setBuffer(buf).setArray(array).setType(type);
}

function solidMat(doc, name, r, g, b) {
  return doc.createMaterial(name)
    .setBaseColorFactor([r, g, b, 1])
    .setRoughnessFactor(0.9)
    .setMetallicFactor(0.0);
}

function addMesh(doc, scene, buf, name, geom, material) {
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', acc(doc, buf, geom.positions, 'VEC3'))
    .setAttribute('NORMAL',   acc(doc, buf, geom.normals,   'VEC3'))
    .setIndices(acc(doc, buf, geom.indices, 'SCALAR'))
    .setMaterial(material);
  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name).setMesh(mesh);
  scene.addChild(node);
  return node;
}

// Build a flat subdivided plane (x-z, y=0)
function buildPlane(width, depth, segsX, segsZ) {
  const positions = [], normals = [], indices = [];
  const hw = width / 2, hd = depth / 2;
  for (let iz = 0; iz <= segsZ; iz++) {
    for (let ix = 0; ix <= segsX; ix++) {
      positions.push(-hw + (ix / segsX) * width, 0, -hd + (iz / segsZ) * depth);
      normals.push(0, 1, 0);
    }
  }
  const w = segsX + 1;
  for (let iz = 0; iz < segsZ; iz++) {
    for (let ix = 0; ix < segsX; ix++) {
      const a = iz * w + ix, b = a + 1, c = a + w, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  return {
    positions: new Float32Array(positions),
    normals:   new Float32Array(normals),
    indices:   new Uint16Array(indices),
  };
}

// Build a cylinder (open or capped)
function buildCylinder(radiusBot, radiusTop, height, sides) {
  const positions = [], normals = [], indices = [];
  const hh = height / 2;

  // Side rings: bottom (y=-hh) and top (y=hh)
  for (let ring = 0; ring < 2; ring++) {
    const r = ring === 0 ? radiusBot : radiusTop;
    const y = ring === 0 ? 0 : height;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const nx = Math.cos(a), nz = Math.sin(a);
      positions.push(nx * r, y, nz * r);
      normals.push(nx, 0, nz);
    }
  }

  // Side faces
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    const b0 = i, b1 = next, t0 = sides + i, t1 = sides + next;
    indices.push(b0, b1, t0, b1, t1, t0);
  }

  // Bottom cap
  const bc = positions.length / 3;
  positions.push(0, 0, 0); normals.push(0, -1, 0);
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    positions.push(Math.cos(a) * radiusBot, 0, Math.sin(a) * radiusBot);
    normals.push(0, -1, 0);
  }
  for (let i = 0; i < sides; i++) {
    indices.push(bc, bc + 1 + (i + 1) % sides, bc + 1 + i);
  }

  // Top cap
  const tc = positions.length / 3;
  positions.push(0, height, 0); normals.push(0, 1, 0);
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    positions.push(Math.cos(a) * radiusTop, height, Math.sin(a) * radiusTop);
    normals.push(0, 1, 0);
  }
  for (let i = 0; i < sides; i++) {
    indices.push(tc, tc + 1 + i, tc + 1 + (i + 1) % sides);
  }

  return {
    positions: new Float32Array(positions),
    normals:   new Float32Array(normals),
    indices:   new Uint16Array(indices),
  };
}

// Build a cone
function buildCone(radius, height, sides) {
  const positions = [], normals = [], indices = [];

  // Base ring
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    const nx = Math.cos(a), nz = Math.sin(a);
    const slope = radius / height;
    const len = Math.sqrt(1 + slope * slope);
    positions.push(nx * radius, 0, nz * radius);
    normals.push(nx / len, slope / len, nz / len);
  }

  // Apex
  const apex = sides;
  positions.push(0, height, 0); normals.push(0, 1, 0);

  // Side faces
  for (let i = 0; i < sides; i++) {
    indices.push(i, (i + 1) % sides, apex);
  }

  // Base cap
  const bc = positions.length / 3;
  positions.push(0, 0, 0); normals.push(0, -1, 0);
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2;
    positions.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    normals.push(0, -1, 0);
  }
  for (let i = 0; i < sides; i++) {
    indices.push(bc, bc + 1 + (i + 1) % sides, bc + 1 + i);
  }

  return {
    positions: new Float32Array(positions),
    normals:   new Float32Array(normals),
    indices:   new Uint16Array(indices),
  };
}

// Offset all Y values of a geometry
function offsetY(geom, dy) {
  for (let i = 1; i < geom.positions.length; i += 3) geom.positions[i] += dy;
  return geom;
}

// Build a box (width x height x depth), centered on X/Z, base at Y=0
function buildBox(w, h, d) {
  const hw = w/2, hh = h/2, hd = d/2;
  const positions = new Float32Array([
    // front
    -hw, 0,  hd,  hw, 0,  hd,  hw, h,  hd, -hw, h,  hd,
    // back
     hw, 0, -hd, -hw, 0, -hd, -hw, h, -hd,  hw, h, -hd,
    // left
    -hw, 0, -hd, -hw, 0,  hd, -hw, h,  hd, -hw, h, -hd,
    // right
     hw, 0,  hd,  hw, 0, -hd,  hw, h, -hd,  hw, h,  hd,
    // top
    -hw, h,  hd,  hw, h,  hd,  hw, h, -hd, -hw, h, -hd,
    // bottom
    -hw, 0, -hd,  hw, 0, -hd,  hw, 0,  hd, -hw, 0,  hd,
  ]);
  const normals = new Float32Array([
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    0,0,-1,0,0,-1,0,0,-1,0,0,-1,
    -1,0,0,-1,0,0,-1,0,0,-1,0,0,
    1,0,0, 1,0,0, 1,0,0, 1,0,0,
    0,1,0, 0,1,0, 0,1,0, 0,1,0,
    0,-1,0,0,-1,0,0,-1,0,0,-1,0,
  ]);
  const indices = new Uint16Array([
    0,1,2, 0,2,3,   4,5,6, 4,6,7,
    8,9,10,8,10,11, 12,13,14,12,14,15,
    16,17,18,16,18,19, 20,21,22,20,22,23,
  ]);
  return { positions, normals, indices };
}

// ============================================================
// TERRAIN.GLB  — flat 200×200 plane, subdivided 20×20
// ============================================================
{
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene('Scene');

  addMesh(doc, scene, buf, 'terrain',
    buildPlane(200, 200, 20, 20),
    solidMat(doc, 'grass', 0.22, 0.45, 0.18)
  );

  await writeGLB('terrain.glb', doc);
}

// ============================================================
// TREE.GLB  — trunk (cylinder) + foliage (cone)
// Both meshes inside one GLB, tree base at Y=0
// ============================================================
{
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene('Scene');

  // Player is ~1.9 units tall. Trees: max ~2.2, average ~1.4
  // Trunk: radius 0.12, height 0.85
  addMesh(doc, scene, buf, 'trunk',
    buildCylinder(0.12, 0.10, 0.85, 8),
    solidMat(doc, 'bark', 0.38, 0.22, 0.08)
  );

  // Foliage layer 1 (bottom, widest): radius 0.75, height 0.85, starts at y=0.45
  addMesh(doc, scene, buf, 'foliage1',
    offsetY(buildCone(0.75, 0.85, 10), 0.45),
    solidMat(doc, 'leaves', 0.15, 0.55, 0.12)
  );

  // Foliage layer 2 (middle): radius 0.58, height 0.75, starts at y=0.85
  addMesh(doc, scene, buf, 'foliage2',
    offsetY(buildCone(0.58, 0.75, 10), 0.85),
    solidMat(doc, 'leaves2', 0.18, 0.60, 0.14)
  );

  // Foliage layer 3 (top): radius 0.38, height 0.60, starts at y=1.30
  addMesh(doc, scene, buf, 'foliage3',
    offsetY(buildCone(0.38, 0.60, 10), 1.30),
    solidMat(doc, 'leaves3', 0.20, 0.65, 0.16)
  );

  await writeGLB('tree.glb', doc);
}

// ============================================================
// PLAYER.GLB  — body + head + gun, base at Y=0
// Color neutral (will be tinted by game code per player)
// ============================================================
{
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene('Scene');

  // Body: 0.8 x 1.2 x 0.55, base at y=0
  addMesh(doc, scene, buf, 'body',
    buildBox(0.8, 1.2, 0.55),
    solidMat(doc, 'body_mat', 0.8, 0.2, 0.2)
  );

  // Head: 0.48 x 0.48 x 0.48, sits on top of body (y=1.2)
  addMesh(doc, scene, buf, 'head',
    offsetY(buildBox(0.48, 0.48, 0.48), 1.2),
    solidMat(doc, 'head_mat', 0.9, 0.75, 0.6)
  );

  // Gun: small box on right side, at mid-body height
  addMesh(doc, scene, buf, 'gun',
    offsetY(buildBox(0.12, 0.12, 0.55), 0.5),
    solidMat(doc, 'gun_mat', 0.2, 0.2, 0.2)
  );

  await writeGLB('player.glb', doc);
}

console.log('\nModelos generados en public/models/');
