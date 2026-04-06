// --- World: terrain + trees + buildings ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

function loadGLB(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
  });
}

// Tree positions [x, z]
const TREE_POSITIONS = [
  [20, 30], [-25, 35], [40, -20], [-40, 15], [30, -40],
  [-35, -30], [15, 45], [-20, -45], [45, 25], [-45, -20],
  [60, 5],  [-60, 10], [5, 60],   [10, -60], [-55, 40],
  [55, -35],[35, 55],  [-30, -55], [70, 30],  [-70, -25],
  [25, -15],[-15, 25], [50, 50],  [-50, -50], [80, -10],
];

export async function createWorld(scene) {
  const colliders = [];

  // --- Lighting ---
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 200;
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;
  scene.add(sun);

  // --- Sky & fog ---
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 80, 160);

  // --- Terrain GLB ---
  try {
    const terrain = await loadGLB('/models/terrain.glb');
    terrain.traverse(obj => {
      if (obj.isMesh) {
        obj.receiveShadow = true;
      }
    });
    scene.add(terrain);
  } catch (e) {
    console.warn('terrain.glb not found, using fallback plane');
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: 0x3a5f3a, roughness: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  // --- Trees GLB ---
  try {
    const treeTemplate = await loadGLB('/models/tree.glb');

    for (const [tx, tz] of TREE_POSITIONS) {
      const tree = treeTemplate.clone(true);
      tree.position.set(tx, 0, tz);
      tree.traverse(obj => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      // Random slight scale & rotation variation
      const scale = 0.8 + Math.random() * 0.5;
      tree.scale.set(scale, scale, scale);
      tree.rotation.y = Math.random() * Math.PI * 2;
      scene.add(tree);

      // Add trunk as collider (radius ~0.5)
      colliders.push({ x: tx, z: tz, sx: 1, sy: 5, sz: 1, mesh: null });
    }
  } catch (e) {
    console.warn('tree.glb not found:', e.message);
  }

  // --- Buildings (kept until replaced by GLBs) ---
  const boxMat     = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.7 });
  const boxDarkMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
  const boxRedMat  = new THREE.MeshStandardMaterial({ color: 0x884444, roughness: 0.7 });

  const buildings = [
    { x: 0,   z: 0,   sx: 6,  sy: 8,  sz: 6,  mat: boxDarkMat },
    { x: 15,  z: 10,  sx: 10, sy: 5,  sz: 8,  mat: boxMat     },
    { x: -20, z: -15, sx: 8,  sy: 6,  sz: 10, mat: boxRedMat  },
    { x: -10, z: 20,  sx: 4,  sy: 3,  sz: 4,  mat: boxMat     },
    { x: 25,  z: -20, sx: 12, sy: 4,  sz: 6,  mat: boxDarkMat },
    { x: -40, z: 30,  sx: 8,  sy: 7,  sz: 8,  mat: boxMat     },
    { x: 40,  z: -35, sx: 6,  sy: 10, sz: 6,  mat: boxRedMat  },
    { x: -35, z: -40, sx: 10, sy: 4,  sz: 10, mat: boxDarkMat },
    { x: 35,  z: 35,  sx: 14, sy: 3,  sz: 4,  mat: boxMat     },
    { x: -15, z: 0,   sx: 1,  sy: 3,  sz: 12, mat: boxDarkMat },
    { x: 10,  z: -25, sx: 16, sy: 2.5,sz: 1,  mat: boxMat     },
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
