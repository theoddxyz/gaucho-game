// --- World: lighting, sky, fog, and static buildings ---
import * as THREE from 'three';

export function createWorld(scene) {
  const colliders = [];

  // --- Lighting ---
  // Warm late-afternoon ambient — enough to keep terrain texture readable
  const ambient = new THREE.AmbientLight(0xffe8cc, 0.28);  // bajado para mejor separación luz/sombra
  scene.add(ambient);

  // Moon — noche americana: iluminación fuerte azul-plateada, hace sombras nítidas
  const moon = new THREE.DirectionalLight(0xc8d8ff, 0);  // intensity driven by daynight
  moon.position.set(-80, 30, -20);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.near   = 1;
  moon.shadow.camera.far    = 400;
  moon.shadow.camera.left   = -140;
  moon.shadow.camera.right  =  140;
  moon.shadow.camera.top    =  140;
  moon.shadow.camera.bottom = -140;
  moon.shadow.bias          = -0.0003;
  scene.add(moon);
  scene.add(moon.target);  // target must be in scene so position updates propagate

  // Sun low on the western horizon — sunset angle, warm gold
  const sun = new THREE.DirectionalLight(0xffbb55, 1.55);  // más dorado, compensa ambient bajado
  sun.position.set(90, 22, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.near   = 1;
  sun.shadow.camera.far    = 400;
  sun.shadow.camera.left   = -80;
  sun.shadow.camera.right  =  80;
  sun.shadow.camera.top    =  80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.bias          = -0.0003;
  sun.shadow.radius        = 2;  // penumbra suave con PCFSoftShadowMap
  scene.add(sun);
  scene.add(sun.target); // target must be in scene for updates to work

  // --- Sky & fog — dusk: orange horizon fading to dusty blue ---
  scene.background = new THREE.Color(0xc8784a);
  scene.fog = new THREE.Fog(0xb86840, 250, 450);

  // (edificios grises de debug removidos)

  // ─── Establo (1000, 0, 1000) ───────────────────────────────────────────────
  const wallMeshes = _buildStable(scene, colliders);

  return { colliders, sun, moon, ambient, wallMeshes };
}

function _buildStable(scene, colliders) {
  const SX = 1000, SZ = 1000;

  const matWood  = new THREE.MeshStandardMaterial({ color: 0x5c2e0a, roughness: 0.95 });
  const matRoof  = new THREE.MeshStandardMaterial({ color: 0x2a1005, roughness: 0.97 });
  const matFence = new THREE.MeshStandardMaterial({ color: 0x7a4a20, roughness: 0.95 });
  const matDirt  = new THREE.MeshStandardMaterial({ color: 0x7a5a20, roughness: 1.00 });
  const matSign  = new THREE.MeshStandardMaterial({ color: 0xc8a050, roughness: 0.80 });

  const _wallMeshes = [];
  const sb = (mat, w, h, d, lx, ly, lz, isWall = false) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(SX + lx, ly, SZ + lz);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
    if (isWall) _wallMeshes.push(m);
  };

  // Ground pen
  sb(matDirt,  34,  0.18, 34,  0,    0.09,  0);

  // Main barn walls
  sb(matWood,  14,   6,  10,  0,    3.0,   0, true);
  // Roof base (wider)
  sb(matRoof,  15,   2,  11,  0,    6.0,   0, true);
  // Roof cap
  sb(matRoof,  13,   1,   9,  0,    7.5,   0, true);

  // Barn door frame pillars (north face)
  sb(matWood,   0.4,  6, 0.4, -3,   3.0,  -5.3, true);
  sb(matWood,   0.4,  6, 0.4,  3,   3.0,  -5.3, true);

  // Decorative sign above door
  sb(matSign,   4,  0.5, 0.2,  0,   6.3,  -5.2, true);

  // Flag pole (tall, visible from afar)
  sb(matWood,   0.2, 10, 0.2,  0,   5.0,  -5.4, true);

  // ── Corral fence ───────────────────────────────────────────────────────────
  // North fence (cows approach from -z): gap 8u in the middle = gate
  sb(matFence, 12,  1.6, 0.2, -11,  0.8, -17, true);
  sb(matFence, 12,  1.6, 0.2,  11,  0.8, -17, true);
  // Gate posts flanking the 10u opening
  sb(matFence,  0.4, 2.0, 0.4, -5,  1.0, -17, true);
  sb(matFence,  0.4, 2.0, 0.4,  5,  1.0, -17, true);

  // South fence (solid)
  sb(matFence, 36,  1.6, 0.2,  0,   0.8,  18, true);
  // East fence
  sb(matFence,  0.2, 1.6, 36, 18,   0.8,   0, true);
  // West fence
  sb(matFence,  0.2, 1.6, 36, -18,  0.8,   0, true);

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

  // ── Colliders for walls (block players, animals, bullets) ─────────────────
  if (colliders) {
    // Main barn body
    colliders.push({ x: SX,      z: SZ,       sx: 14,  sy: 6,   sz: 10  });
    // Corral fence — north (two halves with gate gap)
    colliders.push({ x: SX - 11, z: SZ - 17,  sx: 12,  sy: 1.6, sz: 0.3 });
    colliders.push({ x: SX + 11, z: SZ - 17,  sx: 12,  sy: 1.6, sz: 0.3 });
    // South fence
    colliders.push({ x: SX,      z: SZ + 18,  sx: 36,  sy: 1.6, sz: 0.3 });
    // East fence
    colliders.push({ x: SX + 18, z: SZ,       sx: 0.3, sy: 1.6, sz: 36  });
    // West fence
    colliders.push({ x: SX - 18, z: SZ,       sx: 0.3, sy: 1.6, sz: 36  });
  }
  return _wallMeshes;
}
