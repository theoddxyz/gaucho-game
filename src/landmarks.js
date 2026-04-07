// --- Hand-placed world landmarks ---
import * as THREE from 'three';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function mat(color, roughness = 0.85, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
function place(scene, mesh, x, y, z, rx = 0, ry = 0, rz = 0) {
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow   = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}
function box(w, h, d, m)         { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); }
function cyl(rt, rb, h, seg, m)  { return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); }
function sph(r, m)               { return new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), m); }
function cone(r, h, seg, m)      { return new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), m); }

// ─── 1. Tienda de campaña + fogón apagado ────────────────────────────────────
function buildCamp(scene, cx, cz) {
  const mCanvas  = mat(0xc2a84a, 0.95); // khaki canvas
  const mGround  = mat(0xa09040, 0.95); // ground cloth
  const mPole    = mat(0x7a5830, 0.9);  // wooden poles
  const mStone   = mat(0x888880, 0.95); // fire stones
  const mChar    = mat(0x1a1a14, 0.95); // charcoal/ash
  const mLog     = mat(0x2a2218, 0.95); // burnt logs

  // Tent body — square pyramid (4-sided cone)
  place(scene, cone(3.2, 3.0, 4, mCanvas), cx, 1.5, cz, 0, Math.PI / 4);

  // Ground cloth under tent
  place(scene, box(5.5, 0.06, 5.5, mGround), cx, 0.03, cz, 0, Math.PI / 4);

  // Two entrance poles sticking up slightly
  place(scene, cyl(0.07, 0.07, 2.0, 6, mPole), cx + 2.0, 1.0, cz,  0,  0,  0.08);
  place(scene, cyl(0.07, 0.07, 2.0, 6, mPole), cx + 2.0, 1.0, cz + 0.5, 0, 0, -0.06);

  // Tent pegs + ropes (4 corners)
  const corners = [[-2.8, -2.8], [2.8, -2.8], [-2.8, 2.8], [2.8, 2.8]];
  for (const [dx, dz] of corners) {
    place(scene, box(0.08, 0.3, 0.08, mPole), cx + dx, 0.15, cz + dz);
  }

  // ─ Campfire (4 m to the side) ─
  const fx = cx + 4.5, fz = cz + 1.5;

  // Stone ring (8 stones)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const s = cyl(0.22, 0.28, 0.22, 5, mStone);
    place(scene, s, fx + Math.cos(a) * 0.65, 0.11, fz + Math.sin(a) * 0.65);
  }
  // Ash centre
  place(scene, cyl(0.52, 0.56, 0.07, 10, mat(0x8a8478)), fx, 0.035, fz);
  // Charcoal dust
  place(scene, cyl(0.38, 0.42, 0.04, 10, mChar), fx, 0.042, fz);
  // Two burnt logs crossing
  place(scene, box(1.1, 0.11, 0.18, mLog), fx, 0.09, fz, 0,  0.4, 0);
  place(scene, box(0.9, 0.11, 0.18, mLog), fx, 0.09, fz, 0, -0.55, 0);
}

// ─── 2. Aljibe / Pozo con agua ───────────────────────────────────────────────
function buildWell(scene, cx, cz) {
  const mStone  = mat(0x9a9084, 0.95);
  const mDark   = mat(0x555048, 0.95);
  const mWood   = mat(0x8B5828, 0.9);
  const mRope   = mat(0xd4b870, 0.9);
  const mWater  = mat(0x1e5060, 0.08, 0.2);
  const mBucket = mat(0x6a3a18, 0.9);

  // Well body — stacked stone cylinder
  place(scene, cyl(1.55, 1.65, 1.5, 14, mStone), cx, 0.75, cz);
  // Rim
  place(scene, cyl(1.7,  1.6,  0.18, 14, mDark),  cx, 1.59, cz);
  // Water inside (circle plane)
  const waterPlane = new THREE.Mesh(new THREE.CircleGeometry(1.2, 14), mWater);
  waterPlane.rotation.x = -Math.PI / 2;
  waterPlane.position.set(cx, 0.82, cz);
  waterPlane.receiveShadow = true;
  scene.add(waterPlane);

  // Support posts (slight lean inward)
  place(scene, cyl(0.11, 0.12, 2.8, 6, mWood), cx - 1.45, 2.1, cz, 0, 0,  0.12);
  place(scene, cyl(0.11, 0.12, 2.8, 6, mWood), cx + 1.45, 2.1, cz, 0, 0, -0.12);
  // Crossbeam (horizontal axle)
  place(scene, cyl(0.1,  0.1,  3.2, 6, mWood), cx, 3.3, cz, 0, 0, Math.PI / 2);
  // Winding handle
  place(scene, cyl(0.06, 0.06, 0.7, 6, mWood), cx + 1.7, 3.3, cz, Math.PI / 2, 0, 0);

  // Rope
  place(scene, cyl(0.04, 0.04, 1.35, 5, mRope), cx, 2.3, cz);
  // Bucket
  place(scene, cyl(0.22, 0.28, 0.35, 10, mBucket), cx, 1.55, cz);
  place(scene, cyl(0.24, 0.24, 0.04, 10, mat(0x4a2410)), cx, 1.74, cz); // bucket rim
}

// ─── 3. Cráneos de animales muertos ──────────────────────────────────────────
function buildSkulls(scene, cx, cz) {
  const mBone = mat(0xece8d0, 0.7);
  const mHorn = mat(0xd4c898, 0.7);

  // Each entry: [offsetX, offsetZ, rotY, scale, hasHorns]
  const skulls = [
    [ 0,    0,    0.3,  1.0,  true ],
    [-2.5,  1.8,  1.9,  0.8,  true ],
    [ 3.0, -1.2, -0.5,  1.1,  true ],
    [-0.8, -2.5,  2.8,  0.7,  false],
    [ 1.8,  3.0,  0.9,  0.9,  true ],
    [ 4.0,  1.5, -1.2,  0.6,  false],
  ];

  for (const [dx, dz, ry, sc, horns] of skulls) {
    const x = cx + dx, z = cz + dz;
    const forward = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));

    // Cranium
    const cranium = sph(0.45 * sc, mBone);
    cranium.scale.set(1.1, 0.85, 1.3);
    place(scene, cranium, x, 0.32 * sc, z, 0, ry);

    // Snout / muzzle (elongated forward)
    const snout = sph(0.28 * sc, mBone);
    snout.scale.set(0.75, 0.65, 1.6);
    place(scene, snout,
      x + forward.x * 0.42 * sc,
      0.22 * sc,
      z + forward.z * 0.42 * sc,
      0, ry);

    // Lower jaw fragment
    const jaw = box(0.38 * sc, 0.08 * sc, 0.55 * sc, mBone);
    place(scene, jaw,
      x + forward.x * 0.35 * sc,
      0.06 * sc,
      z + forward.z * 0.35 * sc,
      0.15, ry);

    // Horns (cattle skulls)
    if (horns) {
      const right = new THREE.Vector3(Math.cos(ry), 0, -Math.sin(ry));
      const h1 = cone(0.07 * sc, 0.75 * sc, 5, mHorn);
      place(scene, h1,
        x - right.x * 0.42 * sc, 0.48 * sc, z - right.z * 0.42 * sc,
        0, ry, -0.85);
      const h2 = cone(0.07 * sc, 0.75 * sc, 5, mHorn);
      place(scene, h2,
        x + right.x * 0.42 * sc, 0.48 * sc, z + right.z * 0.42 * sc,
        0, ry,  0.85);
    }
  }

  // Scattered rib/bone fragments
  const boneMat = mat(0xdedad0, 0.75);
  const frags = [[ 1,-1,0.5],[-2,2,1.2],[3,0.5,-0.3],[-1,3,0.8],[2,-2,1.5]];
  for (const [dx, dz, ry2] of frags) {
    place(scene, box(0.08, 0.06, 0.55, boneMat), cx+dx, 0.03, cz+dz, 0.1, ry2, 0.05);
  }
}

// ─── 4. Construcción precaria + laguna ───────────────────────────────────────
function buildConstruction(scene, cx, cz) {
  const mWood    = mat(0x7a5828, 0.95);
  const mOldWood = mat(0x5a3c18, 0.95);
  const mThatch  = mat(0xb89838, 0.95);
  const mStone   = mat(0x8a8070, 0.95);
  const mWater   = mat(0x1a4a60, 0.06, 0.15);
  const mSand    = mat(0xc8b88a, 0.95);

  // ─ Laguna ─
  const lagoon = new THREE.Mesh(new THREE.CircleGeometry(18, 28), mWater);
  lagoon.rotation.x = -Math.PI / 2;
  lagoon.position.set(cx + 16, 0.01, cz + 4);
  lagoon.receiveShadow = true;
  scene.add(lagoon);

  // Sandy shore ring
  const shore = new THREE.Mesh(new THREE.RingGeometry(17.5, 21, 28), mSand);
  shore.rotation.x = -Math.PI / 2;
  shore.position.set(cx + 16, 0.005, cz + 4);
  shore.receiveShadow = true;
  scene.add(shore);

  // Shore rocks
  const rockMat = mat(0x7a7868, 0.95);
  const rng = (seed) => { let s = seed; return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; }; };
  const rand = rng(42);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = 17 + rand() * 2;
    const rock = sph(0.3 + rand() * 0.5, rockMat);
    rock.scale.y = 0.35 + rand() * 0.25;
    rock.position.set(cx + 16 + Math.cos(a) * r, 0.1, cz + 4 + Math.sin(a) * r);
    rock.receiveShadow = true;
    rock.castShadow    = true;
    scene.add(rock);
  }

  // ─ Construcción precaria ─
  // Corner posts (slightly leaning)
  const leans = [0.06, -0.08, 0.04, -0.05];
  const postX = [cx, cx+4, cx, cx+4];
  const postZ = [cz, cz, cz+5, cz+5];
  for (let i = 0; i < 4; i++) {
    place(scene, cyl(0.14, 0.18, 3.2, 6, mWood), postX[i], 1.6, postZ[i], leans[i], 0, i%2?leans[i]:-leans[i]);
  }

  // Wall planks — front wall
  for (let row = 0; row < 3; row++) {
    const y = 0.5 + row * 0.85;
    const slant = (row % 2 === 0) ? 0.06 : -0.04;
    place(scene, box(4.4, 0.14, 0.38, mOldWood), cx+2, y, cz, 0, 0, slant);
  }
  // Wall planks — back wall (partial, some missing)
  place(scene, box(4.4, 0.14, 0.38, mOldWood), cx+2, 0.5,  cz+5, 0, 0,  0.05);
  place(scene, box(2.5, 0.14, 0.38, mOldWood), cx+1, 1.35, cz+5, 0, 0, -0.08);

  // Side wall
  place(scene, box(5.4, 0.14, 0.38, mOldWood), cx, 0.5,  cz+2.5, 0, Math.PI/2,  0.05);
  place(scene, box(3.5, 0.14, 0.38, mOldWood), cx, 1.35, cz+2.0, 0, Math.PI/2, -0.1);

  // Roof — partial, sagging on one side
  place(scene, box(4.8, 0.14, 3.2, mThatch), cx+2, 2.9, cz+2,  -0.18, 0,  0.08);
  place(scene, box(2.2, 0.14, 2.5, mThatch), cx+3, 2.7, cz+3.5, -0.22, 0, -0.12); // gap piece

  // Doorway beam
  place(scene, box(2.2, 0.18, 0.22, mWood), cx+2, 2.2, cz, 0, 0, 0);

  // Scattered debris
  place(scene, box(1.5, 0.1, 0.35, mOldWood), cx-1.5, 0.05, cz+1, 0, 0.4, 0.05);
  place(scene, box(0.9, 0.1, 0.35, mOldWood), cx-1.2, 0.05, cz+3, 0, -0.6, 0.03);

  // Stone foundation blocks
  for (let i = 0; i < 4; i++) {
    const bx = [cx, cx+4, cx, cx+4][i];
    const bz = [cz, cz, cz+5, cz+5][i];
    place(scene, box(0.9, 0.35, 0.9, mStone), bx, 0.17, bz);
  }
}

// ─── Export ──────────────────────────────────────────────────────────────────
export function createLandmarks(scene) {
  buildCamp(scene,         -7823.3, 5424.2);
  buildWell(scene,         -7656.9, 5268.8);
  buildSkulls(scene,       -7173.3, 2997.3);
  buildConstruction(scene, -6258.0, 2023.4);
}
