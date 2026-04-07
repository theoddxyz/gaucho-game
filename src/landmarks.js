// --- Hand-placed world landmarks (loaded from GLB so user can edit in Blender) ---
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

function loadAt(url, scene, x, y, z, ry = 0) {
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(x, y, z);
    model.rotation.y = ry;
    model.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    scene.add(model);
  }, undefined, (err) => console.warn(`[landmarks] failed to load ${url}`, err));
}

export function createLandmarks(scene) {
  loadAt('/models/camp.glb',   scene, -7823.3, 0, 5424.2);
  loadAt('/models/well.glb',   scene, -7656.9, 0, 5268.8);
  loadAt('/models/skulls.glb', scene, -7173.3, 0, 2997.3);
  loadAt('/models/shack.glb',  scene, -6258.0, 0, 2023.4);
  loadAt('/models/shack.glb',  scene,     4.8, 0,  -52.9);
}
