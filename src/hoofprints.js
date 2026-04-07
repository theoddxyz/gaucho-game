// --- Horse hoofprint trail system ---
import * as THREE from 'three';

const PRINT_DIST  = 1.8;  // world units between prints
const PRINT_LIFE  = 9.0;  // seconds before a print fades out
const MAX_PRINTS  = 120;  // pool cap

const _printMat = new THREE.MeshBasicMaterial({
  color: 0x2a1a05,
  transparent: true,
  opacity: 0,          // set per-print on spawn
  depthWrite: false,
  side: THREE.DoubleSide,
});

// Shared geometry: oval hoof shape
const _printGeo = (() => {
  const g = new THREE.CircleGeometry(0.18, 8);
  g.rotateX(-Math.PI / 2);
  return g;
})();

export class HoofprintSystem {
  constructor(scene) {
    this.scene  = scene;
    this._prints = [];         // { mesh, t, life }
    this._last   = new Map();  // horseId → { x, z, side }
  }

  update(horses, dt) {
    // Spawn new prints for moving ridden horses
    for (const [id, horse] of horses) {
      if (horse.riderId === null) continue;

      const prev = this._last.get(id);
      if (!prev) {
        this._last.set(id, { x: horse.x, z: horse.z, side: 0, dist: 0 });
        continue;
      }

      const dx = horse.x - prev.x, dz = horse.z - prev.z;
      prev.dist += Math.sqrt(dx * dx + dz * dz);
      prev.x = horse.x; prev.z = horse.z;

      if (prev.dist >= PRINT_DIST) {
        prev.dist = 0;
        this._spawnPrint(horse.x, horse.z, dx, dz, prev.side);
        prev.side = 1 - prev.side;
      }
    }

    // Clear tracking for dismounted horses
    for (const [id] of this._last) {
      if (!horses.has(id) || horses.get(id).riderId === null) {
        this._last.delete(id);
      }
    }

    // Fade & remove old prints
    for (let i = this._prints.length - 1; i >= 0; i--) {
      const p = this._prints[i];
      p.t += dt;
      // Fade in first 0.3s, then hold, then fade out last 2s
      const fadeIn  = Math.min(1, p.t / 0.3);
      const fadeOut = Math.max(0, 1 - Math.max(0, p.t - (PRINT_LIFE - 2)) / 2);
      p.mesh.material.opacity = 0.32 * fadeIn * fadeOut;
      if (p.t >= PRINT_LIFE) {
        this.scene.remove(p.mesh);
        p.mesh.material.dispose();
        this._prints.splice(i, 1);
      }
    }
  }

  _spawnPrint(hx, hz, dx, dz, side) {
    if (this._prints.length >= MAX_PRINTS) {
      const old = this._prints.shift();
      this.scene.remove(old.mesh);
      old.mesh.material.dispose();
    }

    // Offset left/right of movement direction
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const nx = -dz / len, nz = dx / len;   // perpendicular
    const s  = side === 0 ? 0.38 : -0.38;
    const ox = nx * s, oz = nz * s;

    // Rotation to align oval with movement direction
    const angle = Math.atan2(dx, dz);

    const mat  = _printMat.clone();
    mat.opacity = 0;
    const mesh = new THREE.Mesh(_printGeo, mat);
    mesh.scale.set(1, 1, 1.6);              // elongate in movement direction
    mesh.position.set(hx + ox, 0.02, hz + oz);
    mesh.rotation.y = angle;
    this.scene.add(mesh);
    this._prints.push({ mesh, t: 0, life: PRINT_LIFE });
  }
}
