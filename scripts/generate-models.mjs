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

// --- Extra geometry helpers ---
function translate(g, dx, dy, dz) {
  for (let i = 0; i < g.positions.length; i += 3) {
    g.positions[i] += dx; g.positions[i+1] += dy; g.positions[i+2] += dz;
  }
  return g;
}
function rotateY(g, a) {
  const c = Math.cos(a), s = Math.sin(a);
  for (let i = 0; i < g.positions.length; i += 3) {
    const x = g.positions[i], z = g.positions[i+2];
    g.positions[i] = x*c + z*s; g.positions[i+2] = -x*s + z*c;
  }
  for (let i = 0; i < g.normals.length; i += 3) {
    const x = g.normals[i], z = g.normals[i+2];
    g.normals[i] = x*c + z*s; g.normals[i+2] = -x*s + z*c;
  }
  return g;
}
function rotateZ(g, a) {
  const c = Math.cos(a), s = Math.sin(a);
  for (let i = 0; i < g.positions.length; i += 3) {
    const x = g.positions[i], y = g.positions[i+1];
    g.positions[i] = x*c - y*s; g.positions[i+1] = x*s + y*c;
  }
  for (let i = 0; i < g.normals.length; i += 3) {
    const x = g.normals[i], y = g.normals[i+1];
    g.normals[i] = x*c - y*s; g.normals[i+1] = x*s + y*c;
  }
  return g;
}
function scaleG(g, sx, sy, sz) {
  for (let i = 0; i < g.positions.length; i += 3) {
    g.positions[i] *= sx; g.positions[i+1] *= sy; g.positions[i+2] *= sz;
  }
  for (let i = 0; i < g.normals.length; i += 3) {
    const nx = g.normals[i]/sx, ny = g.normals[i+1]/sy, nz = g.normals[i+2]/sz;
    const l = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
    g.normals[i] = nx/l; g.normals[i+1] = ny/l; g.normals[i+2] = nz/l;
  }
  return g;
}
function buildSphere(radius, wSeg = 8, hSeg = 6) {
  const pos = [], nor = [], idx = [];
  for (let iy = 0; iy <= hSeg; iy++) {
    const phi = (iy / hSeg) * Math.PI;
    for (let ix = 0; ix <= wSeg; ix++) {
      const th = (ix / wSeg) * Math.PI * 2;
      const x = Math.sin(phi)*Math.cos(th), y = Math.cos(phi), z = Math.sin(phi)*Math.sin(th);
      pos.push(x*radius, y*radius, z*radius); nor.push(x, y, z);
    }
  }
  for (let iy = 0; iy < hSeg; iy++) for (let ix = 0; ix < wSeg; ix++) {
    const a = iy*(wSeg+1)+ix, b = a+wSeg+1;
    if (iy !== 0)       idx.push(a, a+1, b);
    if (iy !== hSeg-1)  idx.push(a+1, b+1, b);
  }
  return { positions: new Float32Array(pos), normals: new Float32Array(nor), indices: new Uint16Array(idx) };
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
    buildPlane(400, 400, 40, 40),
    solidMat(doc, 'sand', 0.800, 0.643, 0.396)  // #cca465
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

  // Player = 1.68 units tall (body 1.2 + head 0.48)
  // Tree max height = 1.68 units exactly
  // Trunk: radius 0.11, height 0.70
  addMesh(doc, scene, buf, 'trunk',
    buildCylinder(0.11, 0.09, 0.70, 8),
    solidMat(doc, 'bark', 0.38, 0.22, 0.08)
  );

  // Foliage layer 1 (bottom): radius 0.65, height 0.70, starts at y=0.38
  addMesh(doc, scene, buf, 'foliage1',
    offsetY(buildCone(0.65, 0.70, 10), 0.38),
    solidMat(doc, 'leaves', 0.15, 0.55, 0.12)
  );

  // Foliage layer 2 (middle): radius 0.50, height 0.62, starts at y=0.70
  addMesh(doc, scene, buf, 'foliage2',
    offsetY(buildCone(0.50, 0.62, 10), 0.70),
    solidMat(doc, 'leaves2', 0.18, 0.60, 0.14)
  );

  // Foliage layer 3 (top): radius 0.32, height 0.52, starts at y=1.16
  addMesh(doc, scene, buf, 'foliage3',
    offsetY(buildCone(0.32, 0.52, 10), 1.16),
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

// ============================================================
// HORSE.GLB  — blocky horse, base at Y=0
// Torso sits at y=1.3, legs go from y=0 to y=1.3
// Total height ~2.8 (taller than player for readability)
// ============================================================
{
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene('Scene');

  const brown  = solidMat(doc, 'coat',  0.55, 0.30, 0.10);
  const dark   = solidMat(doc, 'dark',  0.25, 0.13, 0.05);
  const mane   = solidMat(doc, 'mane',  0.18, 0.09, 0.03);

  // --- Torso: 1.3 wide × 0.9 tall × 2.6 long, base at y=1.3
  addMesh(doc, scene, buf, 'torso',
    offsetY(buildBox(1.3, 0.9, 2.6), 1.3), brown);

  // --- Neck: 0.4 wide × 0.9 tall × 0.4 deep, front-top of torso (z=-1.0, y=1.8)
  {
    const g = offsetY(buildBox(0.4, 0.9, 0.4), 1.8);
    // shift forward (z = -1.1)
    for (let i = 2; i < g.positions.length; i += 3) g.positions[i] -= 1.1;
    addMesh(doc, scene, buf, 'neck', g, brown);
  }

  // --- Head: 0.45 wide × 0.55 tall × 0.85 long, at top of neck (y=2.55, z=-1.3)
  {
    const g = offsetY(buildBox(0.45, 0.55, 0.85), 2.55);
    for (let i = 2; i < g.positions.length; i += 3) g.positions[i] -= 1.3;
    addMesh(doc, scene, buf, 'head', g, brown);
  }

  // --- Muzzle: 0.3 wide × 0.3 tall × 0.3 deep at nose tip
  {
    const g = offsetY(buildBox(0.3, 0.3, 0.3), 2.45);
    for (let i = 2; i < g.positions.length; i += 3) g.positions[i] -= 1.75;
    addMesh(doc, scene, buf, 'muzzle', g, dark);
  }

  // --- Mane: thin tall strip on top of neck+head
  {
    const g = offsetY(buildBox(0.15, 0.55, 1.1), 2.65);
    for (let i = 2; i < g.positions.length; i += 3) g.positions[i] -= 1.1;
    addMesh(doc, scene, buf, 'mane_mesh', g, mane);
  }

  // --- Tail: tapered box at back
  {
    const g = offsetY(buildBox(0.18, 0.7, 0.18), 1.5);
    for (let i = 2; i < g.positions.length; i += 3) g.positions[i] += 1.35;
    addMesh(doc, scene, buf, 'tail', g, mane);
  }

  // --- 4 Legs: cylinders, radius 0.18, height 1.3
  const legPositions = [
    [ 0.42, -0.9],  // front-left  [x-offset, z-offset]
    [-0.42, -0.9],  // front-right
    [ 0.42,  0.9],  // back-left
    [-0.42,  0.9],  // back-right
  ];
  legPositions.forEach(([lx, lz], i) => {
    const g = buildCylinder(0.18, 0.16, 1.3, 7);
    for (let j = 0; j < g.positions.length; j += 3) {
      g.positions[j]   += lx;
      g.positions[j+2] += lz;
    }
    addMesh(doc, scene, buf, `leg${i}`, g, dark);
  });

  // --- Ears: two small boxes on top of head
  [-0.15, 0.15].forEach((ex, i) => {
    const g = offsetY(buildBox(0.12, 0.25, 0.10), 3.05);
    for (let j = 0; j < g.positions.length; j += 3) {
      g.positions[j]   += ex;
      g.positions[j+2] -= 1.3;
    }
    addMesh(doc, scene, buf, `ear${i}`, g, brown);
  });

  // --- Saddle: flat box on top of torso center
  addMesh(doc, scene, buf, 'saddle',
    offsetY(buildBox(0.9, 0.18, 1.0), 2.22), dark);

  await writeGLB('horse.glb', doc);
}

// ============================================================
// ROCK.GLB  — lumpy boulder from multiple boxes, base at Y=0
// ============================================================
{
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene('Scene');

  // #cca465-adjacent stone colors
  const stone  = solidMat(doc, 'stone',  0.600, 0.510, 0.380);
  const dark   = solidMat(doc, 'dark',   0.450, 0.380, 0.280);
  const light  = solidMat(doc, 'light',  0.700, 0.620, 0.480);

  // Main boulder body
  addMesh(doc, scene, buf, 'body',
    offsetY(buildBox(1.4, 0.9, 1.2), 0.0), stone);

  // Top bump
  addMesh(doc, scene, buf, 'top',
    offsetY(buildBox(0.85, 0.55, 0.80), 0.7), light);

  // Side protrusion left
  {
    const g = offsetY(buildBox(0.5, 0.6, 0.7), 0.1);
    for (let i = 0; i < g.positions.length; i += 3) g.positions[i] -= 0.75;
    addMesh(doc, scene, buf, 'sideL', g, dark);
  }

  // Side protrusion right
  {
    const g = offsetY(buildBox(0.45, 0.5, 0.65), 0.2);
    for (let i = 0; i < g.positions.length; i += 3) g.positions[i] += 0.70;
    addMesh(doc, scene, buf, 'sideR', g, stone);
  }

  await writeGLB('rock.glb', doc);
}

// ============================================================
// CAMP.GLB  — tienda de campaña + fogón apagado
// ============================================================
{
  const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('Scene');
  const mCanvas = solidMat(doc, 'canvas',  0.784, 0.659, 0.294); // khaki #c8a84b
  const mCloth  = solidMat(doc, 'cloth',   0.691, 0.596, 0.251); // darker khaki
  const mWood   = solidMat(doc, 'wood',    0.478, 0.345, 0.188);
  const mStone  = solidMat(doc, 'stone',   0.533, 0.533, 0.502);
  const mAsh    = solidMat(doc, 'ash',     0.267, 0.267, 0.251);
  const mChar   = solidMat(doc, 'charcoal',0.133, 0.133, 0.094);

  // Tent: 4-sided pyramid (cone with 4 sides), rotated 45° so faces point N/S/E/W
  addMesh(doc, scene, buf, 'tent', rotateY(buildCone(3.2, 3.0, 4), Math.PI/4), mCanvas);
  // Ground cloth
  addMesh(doc, scene, buf, 'ground_cloth', buildBox(5.5, 0.06, 5.0), mCloth);
  // Entrance poles
  addMesh(doc, scene, buf, 'pole_L', translate(buildCylinder(0.07, 0.07, 2.2, 6), -0.6, 0, 2.2), mWood);
  addMesh(doc, scene, buf, 'pole_R', translate(buildCylinder(0.07, 0.07, 2.2, 6),  0.6, 0, 2.2), mWood);
  // Corner pegs
  for (const [px, pz, n] of [[-2.4,2.4,'peg_FL'],[2.4,2.4,'peg_FR'],[-2.4,-2.4,'peg_BL'],[2.4,-2.4,'peg_BR']])
    addMesh(doc, scene, buf, n, translate(buildCylinder(0.07, 0.07, 0.3, 5), px, 0, pz), mWood);

  // Campfire at local (4.8, 0, 1.5)
  const [fx, fz] = [4.8, 1.5];
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    addMesh(doc, scene, buf, `stone${i}`,
      translate(buildCylinder(0.22, 0.28, 0.22, 5), fx + Math.cos(a)*0.65, 0, fz + Math.sin(a)*0.65), mStone);
  }
  addMesh(doc, scene, buf, 'ash',  translate(buildCylinder(0.54, 0.58, 0.07, 10), fx, 0, fz), mAsh);
  addMesh(doc, scene, buf, 'log_A', translate(rotateY(buildBox(1.1, 0.11, 0.18), 0.4),  fx, 0.09, fz), mChar);
  addMesh(doc, scene, buf, 'log_B', translate(rotateY(buildBox(0.9, 0.11, 0.18), -0.55), fx, 0.09, fz), mChar);

  await writeGLB('camp.glb', doc);
}

// ============================================================
// WELL.GLB  — aljibe / pozo con agua
// ============================================================
{
  const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('Scene');
  const mStone  = solidMat(doc, 'stone',   0.604, 0.565, 0.518);
  const mDark   = solidMat(doc, 'dark',    0.333, 0.314, 0.282);
  const mWood   = solidMat(doc, 'wood',    0.545, 0.345, 0.157);
  const mWater  = solidMat(doc, 'water',   0.118, 0.314, 0.376);
  const mRope   = solidMat(doc, 'rope',    0.831, 0.722, 0.439);
  const mBucket = solidMat(doc, 'bucket',  0.416, 0.227, 0.094);

  addMesh(doc, scene, buf, 'well_body', buildCylinder(1.55, 1.65, 1.5, 14), mStone);
  addMesh(doc, scene, buf, 'well_rim',  translate(buildCylinder(1.7, 1.6, 0.18, 14), 0, 1.5, 0), mDark);
  addMesh(doc, scene, buf, 'water',     translate(buildCylinder(1.18, 1.18, 0.05, 14), 0, 0.82, 0), mWater);
  addMesh(doc, scene, buf, 'post_L',    translate(buildCylinder(0.11, 0.12, 2.8, 6), -1.45, 0, 0), mWood);
  addMesh(doc, scene, buf, 'post_R',    translate(buildCylinder(0.11, 0.12, 2.8, 6),  1.45, 0, 0), mWood);
  // Crossbeam: cylinder rotated horizontal
  addMesh(doc, scene, buf, 'crossbeam', translate(rotateZ(buildCylinder(0.1, 0.1, 3.2, 6), Math.PI/2), 1.6, 3.3, 0), mWood);
  addMesh(doc, scene, buf, 'handle',    translate(rotateZ(buildCylinder(0.06, 0.06, 0.7, 6), Math.PI/2), 2.45, 3.3, 0), mWood);
  addMesh(doc, scene, buf, 'rope',      translate(buildCylinder(0.04, 0.04, 1.3, 5), 0, 2.3, 0), mRope);
  addMesh(doc, scene, buf, 'bucket',    translate(buildCylinder(0.22, 0.28, 0.35, 10), 0, 1.55, 0), mBucket);

  await writeGLB('well.glb', doc);
}

// ============================================================
// SKULLS.GLB  — cráneos de animales muertos
// ============================================================
{
  const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('Scene');
  const mBone = solidMat(doc, 'bone', 0.929, 0.910, 0.816);
  const mHorn = solidMat(doc, 'horn', 0.831, 0.784, 0.596);
  const mDirt = solidMat(doc, 'dirt', 0.200, 0.180, 0.100);

  const SKULLS = [
    [0,    0,    0.3 ],
    [-2.5, 1.8,  1.9 ],
    [ 3.0,-1.2, -0.5 ],
    [-0.8,-2.5,  2.8 ],
    [ 1.8, 3.0,  0.9 ],
    [ 4.0, 1.5, -1.2 ],
  ];

  for (let i = 0; i < SKULLS.length; i++) {
    const [sx, sz, ry] = SKULLS[i];
    const fw = [Math.sin(ry), Math.cos(ry)]; // forward XZ
    const ri = [Math.cos(ry),-Math.sin(ry)]; // right XZ

    // Cranium (elongated sphere)
    const cr = buildSphere(0.45, 6, 4);
    scaleG(cr, 1.1, 0.85, 1.3); rotateY(cr, ry);
    addMesh(doc, scene, buf, `skull${i}_cranium`, translate(cr, sx, 0.32, sz), mBone);

    // Snout
    const sn = buildSphere(0.26, 5, 4);
    scaleG(sn, 0.8, 0.65, 1.5); rotateY(sn, ry);
    addMesh(doc, scene, buf, `skull${i}_snout`, translate(sn, sx + fw[0]*0.38, 0.22, sz + fw[1]*0.38), mBone);

    // Lower jaw
    addMesh(doc, scene, buf, `skull${i}_jaw`,
      translate(rotateY(buildBox(0.35, 0.08, 0.5), ry), sx + fw[0]*0.32, 0.06, sz + fw[1]*0.32), mBone);

    // Eye socket shadows
    addMesh(doc, scene, buf, `skull${i}_eye`,
      translate(rotateY(buildBox(0.22, 0.14, 0.08), ry), sx, 0.38, sz), mDirt);

    // Horn L
    const hL = buildCone(0.065, 0.65, 5);
    rotateZ(hL, -0.82); rotateY(hL, ry);
    addMesh(doc, scene, buf, `skull${i}_hornL`, translate(hL, sx - ri[0]*0.4, 0.42, sz - ri[1]*0.4), mHorn);

    // Horn R
    const hR = buildCone(0.065, 0.65, 5);
    rotateZ(hR,  0.82); rotateY(hR, ry);
    addMesh(doc, scene, buf, `skull${i}_hornR`, translate(hR, sx + ri[0]*0.4, 0.42, sz + ri[1]*0.4), mHorn);
  }

  // Bone fragments scattered around
  const mFrag = solidMat(doc, 'bone_frag', 0.878, 0.867, 0.773);
  for (const [fx, fz, fr] of [[1,-1,0.5],[-2,2,1.2],[3,0.5,-0.3],[-1,3,0.8],[2,-2,1.5]])
    addMesh(doc, scene, buf, `frag_${fx}`, translate(rotateY(buildBox(0.08, 0.06, 0.52), fr), fx, 0.03, fz), mFrag);

  await writeGLB('skulls.glb', doc);
}

// ============================================================
// SHACK.GLB  — construcción precaria frente a una laguna
// ============================================================
{
  const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('Scene');
  const mWood   = solidMat(doc, 'wood',   0.478, 0.345, 0.157);
  const mOld    = solidMat(doc, 'old',    0.353, 0.235, 0.094);
  const mThatch = solidMat(doc, 'thatch', 0.722, 0.596, 0.220);
  const mStone  = solidMat(doc, 'stone',  0.545, 0.502, 0.439);
  const mWater  = solidMat(doc, 'water',  0.102, 0.290, 0.376);
  const mSand   = solidMat(doc, 'sand',   0.784, 0.722, 0.545);

  // Laguna: large flat disc (center at local 16, 0, 4)
  addMesh(doc, scene, buf, 'lagoon', translate(buildCylinder(18, 18, 0.06, 24), 16, 0, 4), mWater);
  // Shore ring around lagoon
  addMesh(doc, scene, buf, 'shore',  translate(buildCylinder(21, 21, 0.04, 24), 16,-0.01, 4), mSand);

  // Corner posts (4)
  for (const [px, pz, n] of [[0,0,'post_FL'],[4,0,'post_FR'],[0,5,'post_BL'],[4,5,'post_BR']])
    addMesh(doc, scene, buf, n, translate(buildCylinder(0.14, 0.18, 3.2, 6), px, 0, pz), mWood);

  // Front wall planks
  for (let r = 0; r < 3; r++)
    addMesh(doc, scene, buf, `wall_front_${r}`, translate(buildBox(4.4, 0.13, 0.38), 2, 0.4 + r*0.85, 0), mOld);

  // Back wall (partial)
  addMesh(doc, scene, buf, 'wall_back_0', translate(buildBox(4.4, 0.13, 0.38), 2, 0.4, 5), mOld);
  addMesh(doc, scene, buf, 'wall_back_1', translate(buildBox(2.5, 0.13, 0.38), 1, 1.25, 5), mOld);

  // Side wall
  addMesh(doc, scene, buf, 'wall_side_0', translate(rotateY(buildBox(5.2, 0.13, 0.38), Math.PI/2), 0, 0.4, 2.5), mOld);
  addMesh(doc, scene, buf, 'wall_side_1', translate(rotateY(buildBox(3.5, 0.13, 0.38), Math.PI/2), 0, 1.25, 2.0), mOld);

  // Doorway lintel
  addMesh(doc, scene, buf, 'lintel', translate(buildBox(2.2, 0.18, 0.22), 2, 2.2, 0), mWood);

  // Roof (sagging)
  addMesh(doc, scene, buf, 'roof_main',  translate(buildBox(4.8, 0.14, 3.2), 2, 2.9, 2), mThatch);
  addMesh(doc, scene, buf, 'roof_patch', translate(buildBox(2.2, 0.14, 2.5), 3, 2.7, 3.5), mThatch);

  // Foundation blocks
  for (const [px, pz, n] of [[0,0,'found_FL'],[4,0,'found_FR'],[0,5,'found_BL'],[4,5,'found_BR']])
    addMesh(doc, scene, buf, n, translate(buildBox(0.9, 0.35, 0.9), px, 0, pz), mStone);

  // Debris
  addMesh(doc, scene, buf, 'debris_0', translate(rotateY(buildBox(1.5, 0.1, 0.35),  0.4), -1.5, 0.05, 1), mOld);
  addMesh(doc, scene, buf, 'debris_1', translate(rotateY(buildBox(0.9, 0.1, 0.35), -0.6), -1.2, 0.05, 3), mOld);

  await writeGLB('shack.glb', doc);
}

console.log('\nModelos generados en public/models/');
