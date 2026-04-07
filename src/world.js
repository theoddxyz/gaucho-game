// --- World: lighting, sky, fog, and static buildings ---
import * as THREE from 'three';

export function createWorld(scene) {
  const colliders = [];

  // --- Lighting ---
  // Warm late-afternoon ambient — enough to keep terrain texture readable
  const ambient = new THREE.AmbientLight(0xffe8cc, 0.55);
  scene.add(ambient);

  // Moon — dim cool blue-white, opposite direction from sun
  const moon = new THREE.DirectionalLight(0x8899cc, 0);  // intensity driven by daynight
  moon.position.set(-80, 30, -20);
  moon.castShadow = false;  // no shadow from moon (perf)
  scene.add(moon);

  // Sun low on the western horizon — sunset angle, warm gold
  const sun = new THREE.DirectionalLight(0xffcc77, 1.3);
  sun.position.set(90, 22, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far  = 350;
  sun.shadow.camera.left   = -120;
  sun.shadow.camera.right  =  120;
  sun.shadow.camera.top    =  120;
  sun.shadow.camera.bottom = -120;
  scene.add(sun);
  scene.add(sun.target); // target must be in scene for updates to work

  // --- Sky & fog — dusk: orange horizon fading to dusty blue ---
  scene.background = new THREE.Color(0xc8784a);
  scene.fog = new THREE.Fog(0xb86840, 250, 450);

  // --- Static buildings (pueblo central) ---
  const matGrey = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
  const matRed  = new THREE.MeshStandardMaterial({ color: 0x884444, roughness: 0.7 });

  const buildings = [
    { x:   0, z:   0, sx:  6, sy: 8,   sz:  6, mat: matDark },
    { x:  15, z:  10, sx: 10, sy: 5,   sz:  8, mat: matGrey },
    { x: -20, z: -15, sx:  8, sy: 6,   sz: 10, mat: matRed  },
    { x: -10, z:  20, sx:  4, sy: 3,   sz:  4, mat: matGrey },
    { x:  25, z: -20, sx: 12, sy: 4,   sz:  6, mat: matDark },
    { x: -40, z:  30, sx:  8, sy: 7,   sz:  8, mat: matGrey },
    { x:  40, z: -35, sx:  6, sy: 10,  sz:  6, mat: matRed  },
    { x: -35, z: -40, sx: 10, sy: 4,   sz: 10, mat: matDark },
    { x:  35, z:  35, sx: 14, sy: 3,   sz:  4, mat: matGrey },
    { x: -15, z:   0, sx:  1, sy: 3,   sz: 12, mat: matDark },
    { x:  10, z: -25, sx: 16, sy: 2.5, sz:  1, mat: matGrey },
  ];

  for (const b of buildings) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.sx, b.sy, b.sz), b.mat);
    mesh.position.set(b.x, b.sy / 2, b.z);
    mesh.castShadow   = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    colliders.push({ x: b.x, z: b.z, sx: b.sx, sy: b.sy, sz: b.sz });
  }

  // ─── Establo (1000, 0, 1000) ───────────────────────────────────────────────
  _buildStable(scene);

  return { colliders, sun, moon, ambient };
}

function _buildStable(scene) {
  const SX = 1000, SZ = 1000;

  const matWood  = new THREE.MeshStandardMaterial({ color: 0x5c2e0a, roughness: 0.95 });
  const matRoof  = new THREE.MeshStandardMaterial({ color: 0x2a1005, roughness: 0.97 });
  const matFence = new THREE.MeshStandardMaterial({ color: 0x7a4a20, roughness: 0.95 });
  const matDirt  = new THREE.MeshStandardMaterial({ color: 0x7a5a20, roughness: 1.00 });
  const matSign  = new THREE.MeshStandardMaterial({ color: 0xc8a050, roughness: 0.80 });

  const sb = (mat, w, h, d, lx, ly, lz) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(SX + lx, ly, SZ + lz);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
  };

  // Ground pen
  sb(matDirt,  34,  0.18, 34,  0,    0.09,  0);

  // Main barn walls
  sb(matWood,  14,   6,  10,  0,    3.0,   0);
  // Roof base (wider)
  sb(matRoof,  15,   2,  11,  0,    6.0,   0);
  // Roof cap
  sb(matRoof,  13,   1,   9,  0,    7.5,   0);

  // Barn door frame pillars (north face)
  sb(matWood,   0.4,  6, 0.4, -3,   3.0,  -5.3);
  sb(matWood,   0.4,  6, 0.4,  3,   3.0,  -5.3);

  // Decorative sign above door
  sb(matSign,   4,  0.5, 0.2,  0,   6.3,  -5.2);

  // Flag pole (tall, visible from afar)
  sb(matWood,   0.2, 10, 0.2,  0,   5.0,  -5.4);

  // ── Corral fence ───────────────────────────────────────────────────────────
  // North fence (cows approach from -z): gap 8u in the middle = gate
  sb(matFence, 12,  1.6, 0.2, -11,  0.8, -17);   // west half
  sb(matFence, 12,  1.6, 0.2,  11,  0.8, -17);   // east half
  // Gate posts flanking the 10u opening
  sb(matFence,  0.4, 2.0, 0.4, -5,  1.0, -17);
  sb(matFence,  0.4, 2.0, 0.4,  5,  1.0, -17);

  // South fence (solid)
  sb(matFence, 36,  1.6, 0.2,  0,   0.8,  18);
  // East fence
  sb(matFence,  0.2, 1.6, 36, 18,   0.8,   0);
  // West fence
  sb(matFence,  0.2, 1.6, 36, -18,  0.8,   0);

  // Corner posts
  for (const [px, pz] of [[-18, -17], [18, -17], [18, 18], [-18, 18]]) {
    sb(matFence, 0.4, 2.0, 0.4, px, 1.0, pz);
  }
  // Intermediate posts (every ~9u along east/west fences)
  for (const pz of [-9, 0, 9]) {
    sb(matFence, 0.3, 1.8, 0.3,  18, 0.9, pz);
    sb(matFence, 0.3, 1.8, 0.3, -18, 0.9, pz);
  }
  // Intermediate posts (south fence)
  for (const px of [-9, 0, 9]) {
    sb(matFence, 0.3, 1.8, 0.3, px, 0.9, 18);
  }

  // Warm torch light inside corral (glows at night)
  const torch = new THREE.PointLight(0xff9933, 4, 40);
  torch.position.set(SX, 3.5, SZ);
  scene.add(torch);
}
