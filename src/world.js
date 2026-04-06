// --- World: terrain + buildings/cover ---
import * as THREE from 'three';

export function createWorld(scene) {
  const colliders = []; // { x, z, sx, sy, sz } for collision

  // --- Ground ---
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a5f3a, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- Grid lines on ground ---
  const gridHelper = new THREE.GridHelper(200, 40, 0x2a4f2a, 0x2a4f2a);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // --- Sky ---
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 60, 150);

  // --- Lighting ---
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 150;
  sun.shadow.camera.left = -60;
  sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60;
  sun.shadow.camera.bottom = -60;
  scene.add(sun);

  // --- Buildings/boxes ---
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 });
  const boxDarkMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
  const boxRedMat = new THREE.MeshStandardMaterial({ color: 0x884444, roughness: 0.7 });

  const buildings = [
    // Central structures
    { x: 0, z: 0, sx: 6, sy: 8, sz: 6, mat: boxDarkMat },
    { x: 15, z: 10, sx: 10, sy: 5, sz: 8, mat: boxMat },
    { x: -20, z: -15, sx: 8, sy: 6, sz: 10, mat: boxRedMat },
    { x: -10, z: 20, sx: 4, sy: 3, sz: 4, mat: boxMat },
    { x: 25, z: -20, sx: 12, sy: 4, sz: 6, mat: boxDarkMat },

    // Outer structures
    { x: -40, z: 30, sx: 8, sy: 7, sz: 8, mat: boxMat },
    { x: 40, z: -35, sx: 6, sy: 10, sz: 6, mat: boxRedMat },
    { x: -35, z: -40, sx: 10, sy: 4, sz: 10, mat: boxDarkMat },
    { x: 35, z: 35, sx: 14, sy: 3, sz: 4, mat: boxMat },
    { x: 50, z: 10, sx: 4, sy: 6, sz: 12, mat: boxMat },
    { x: -50, z: 5, sx: 6, sy: 5, sz: 6, mat: boxRedMat },

    // Small cover
    { x: 8, z: -8, sx: 2, sy: 1.5, sz: 2, mat: boxMat },
    { x: -5, z: 8, sx: 3, sy: 1.2, sz: 1.5, mat: boxDarkMat },
    { x: 20, z: 25, sx: 2, sy: 2, sz: 2, mat: boxMat },
    { x: -25, z: 10, sx: 1.5, sy: 1.8, sz: 3, mat: boxMat },
    { x: 30, z: -5, sx: 3, sy: 1.5, sz: 3, mat: boxDarkMat },

    // Walls
    { x: -15, z: 0, sx: 1, sy: 3, sz: 12, mat: boxDarkMat },
    { x: 10, z: -25, sx: 16, sy: 2.5, sz: 1, mat: boxMat },
  ];

  for (const b of buildings) {
    const geo = new THREE.BoxGeometry(b.sx, b.sy, b.sz);
    const mesh = new THREE.Mesh(geo, b.mat);
    mesh.position.set(b.x, b.sy / 2, b.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    colliders.push({ x: b.x, z: b.z, sx: b.sx, sy: b.sy, sz: b.sz, mesh });
  }

  return colliders;
}
