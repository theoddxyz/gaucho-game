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

  return { colliders, sun, moon, ambient };
}
