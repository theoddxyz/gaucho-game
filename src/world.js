// --- World: lighting, sky, fog, and static buildings ---
import * as THREE from 'three';

export function createWorld(scene) {
  const colliders = [];

  // --- Lighting ---
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far  = 300;
  sun.shadow.camera.left   = -120;
  sun.shadow.camera.right  =  120;
  sun.shadow.camera.top    =  120;
  sun.shadow.camera.bottom = -120;
  scene.add(sun);

  // --- Sky & fog (extended for large world) ---
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 250, 450);

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

  return colliders;
}
