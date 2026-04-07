// --- Hand-placed world landmarks (loaded from GLB so user can edit in Blender) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader  = new GLTFLoader();
const _fires  = []; // active fire effects, updated each frame

// ─── Fire + smoke particle effect ────────────────────────────────────────────
function _createFireEffect(scene, wx, wy, wz) {
  const NF = 30, NS = 12;

  // Per-particle data (fixed random properties)
  const fd = Array.from({ length: NF }, () => ({
    life:  Math.random(),
    speed: 0.9 + Math.random() * 0.8,
    ox: (Math.random() - 0.5) * 0.45,
    oz: (Math.random() - 0.5) * 0.45,
  }));
  const sd = Array.from({ length: NS }, () => ({
    life:  Math.random(),
    speed: 0.28 + Math.random() * 0.22,
    ox: (Math.random() - 0.5) * 0.55,
    oz: (Math.random() - 0.5) * 0.55,
  }));

  // Fire geometry
  const fArr  = new Float32Array(NF * 3);
  const fAttr = new THREE.BufferAttribute(fArr, 3);
  const fGeo  = new THREE.BufferGeometry();
  fGeo.setAttribute('position', fAttr);
  const fMat = new THREE.PointsMaterial({
    color: 0xff7700, size: 0.38,
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(fGeo, fMat));

  // Smoke geometry
  const sArr  = new Float32Array(NS * 3);
  const sAttr = new THREE.BufferAttribute(sArr, 3);
  const sGeo  = new THREE.BufferGeometry();
  sGeo.setAttribute('position', sAttr);
  const sMat = new THREE.PointsMaterial({
    color: 0x666666, size: 0.75,
    transparent: true, opacity: 0.22, depthWrite: false,
  });
  scene.add(new THREE.Points(sGeo, sMat));

  return { fd, sd, fAttr, sAttr, wx, wy, wz };
}

function _tickFire(ef, dt) {
  const { fd, sd, fAttr, sAttr, wx, wy, wz } = ef;
  const fa = fAttr.array, sa = sAttr.array;

  for (let i = 0; i < fd.length; i++) {
    fd[i].life += dt * fd[i].speed;
    if (fd[i].life > 1) {
      fd[i].life -= 1;
      fd[i].ox = (Math.random() - 0.5) * 0.45;
      fd[i].oz = (Math.random() - 0.5) * 0.45;
    }
    fa[i * 3]     = wx + fd[i].ox;
    fa[i * 3 + 1] = wy + fd[i].life * 1.4;
    fa[i * 3 + 2] = wz + fd[i].oz;
  }
  fAttr.needsUpdate = true;

  for (let i = 0; i < sd.length; i++) {
    sd[i].life += dt * sd[i].speed;
    if (sd[i].life > 1) {
      sd[i].life -= 1;
      sd[i].ox = (Math.random() - 0.5) * 0.55;
      sd[i].oz = (Math.random() - 0.5) * 0.55;
    }
    sa[i * 3]     = wx + sd[i].ox;
    sa[i * 3 + 1] = wy + 1.1 + sd[i].life * 3.2;
    sa[i * 3 + 2] = wz + sd[i].oz;
  }
  sAttr.needsUpdate = true;
}

/** Call every frame from the game loop */
export function updateLandmarkEffects(dt) {
  for (const ef of _fires) _tickFire(ef, dt);
}

// ─── GLB loader ──────────────────────────────────────────────────────────────
function loadAt(url, scene, x, y, z, ry = 0) {
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(x, y, z);
    model.rotation.y = ry;
    model.updateMatrixWorld(true, true);

    model.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow    = true;
      o.receiveShadow = true;

      // Fix z-fighting: ground-level flat meshes (water, shore) get polygon offset
      const box = new THREE.Box3().setFromObject(o);
      const height = box.max.y - box.min.y;
      if (height < 0.3 && box.min.y < 1.0) {
        o.material = o.material.clone();
        o.material.polygonOffset      = true;
        o.material.polygonOffsetFactor = -1;
        o.material.polygonOffsetUnits  = -4;
      }
    });

    // Spawn fire at any node named FIRECAMPPOINT (case-insensitive)
    model.traverse(o => {
      if (/firecamppoint/i.test(o.name)) {
        const wp = new THREE.Vector3();
        o.getWorldPosition(wp);
        _fires.push(_createFireEffect(scene, wp.x, wp.y, wp.z));
      }
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
