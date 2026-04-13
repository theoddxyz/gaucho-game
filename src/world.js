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
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.near   = 1;
  moon.shadow.camera.far    = 350;
  moon.shadow.camera.left   = -120;
  moon.shadow.camera.right  =  120;
  moon.shadow.camera.top    =  120;
  moon.shadow.camera.bottom = -120;
  scene.add(moon);
  scene.add(moon.target);  // target must be in scene so position updates propagate

  // Sun low on the western horizon — sunset angle, warm gold
  const sun = new THREE.DirectionalLight(0xffcc77, 1.3);
  sun.position.set(90, 22, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near   = 1;
  sun.shadow.camera.far    = 400;
  sun.shadow.camera.left   = -80;
  sun.shadow.camera.right  =  80;
  sun.shadow.camera.top    =  80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.bias          = -0.0006;  // evita shadow acne en suelo plano
  scene.add(sun);
  scene.add(sun.target); // target must be in scene for updates to work

  // --- Sky & fog — dusk: orange horizon fading to dusty blue ---
  scene.background = new THREE.Color(0xc8784a);
  scene.fog = new THREE.Fog(0xb86840, 250, 450);

  // (edificios grises de debug removidos)

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
