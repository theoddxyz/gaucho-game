// --- Horse hoofprint + player footprint trail system ---
import * as THREE from 'three';

const PRINT_DIST  = 1.8;  // world units between horse prints
const FOOT_DIST   = 0.85; // world units between player footprints (shorter steps)
const PRINT_LIFE  = 9.0;  // seconds before a print fades out
const MAX_PRINTS  = 180;  // pool cap (increased to fit both)

const _printMat = new THREE.MeshBasicMaterial({
  color: 0x2a1a05,
  transparent: true,
  opacity: 0,          // set per-print on spawn
  depthWrite: false,
  side: THREE.DoubleSide,
});

// Shared geometry: square voxel hoof print — sized to an actual horse hoof
const _printGeo = (() => {
  const g = new THREE.PlaneGeometry(0.52, 0.42);
  g.rotateX(-Math.PI / 2);
  return g;
})();

export class HoofprintSystem {
  constructor(scene) {
    this.scene   = scene;
    this._prints = [];         // { mesh, t, life }
    this._last   = new Map();  // horseId → { x, z, side, dist }
    this._playerLast = null;   // { x, z, dist, side } for player on foot
  }

  /**
   * @param {Map} horses      — horseManager.horses
   * @param {number} dt
   * @param {{x:number,z:number}|null} playerPos — player pos when on foot & moving, else null
   */
  update(horses, dt, playerPos = null) {
    // ── Horse hoofprints ─────────────────────────────────────────────────────
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
        this._spawnPrint(horse.x, horse.z, dx, dz, prev.side, 1.0, 0.32);
        prev.side = 1 - prev.side;
      }
    }

    // Clear tracking for dismounted/gone horses
    for (const [id] of this._last) {
      if (!horses.has(id) || horses.get(id).riderId === null) {
        this._last.delete(id);
      }
    }

    // ── Player footprints (on foot only) ─────────────────────────────────────
    if (playerPos) {
      if (!this._playerLast) {
        this._playerLast = { x: playerPos.x, z: playerPos.z, dist: 0, side: 0 };
      } else {
        const dx = playerPos.x - this._playerLast.x;
        const dz = playerPos.z - this._playerLast.z;
        const moved = Math.sqrt(dx * dx + dz * dz);
        this._playerLast.dist += moved;
        if (this._playerLast.dist >= FOOT_DIST && moved > 0.001) {
          this._playerLast.dist -= FOOT_DIST;
          this._spawnPrint(playerPos.x, playerPos.z, dx, dz, this._playerLast.side, 0.58, 0.20);
          this._playerLast.side = 1 - this._playerLast.side;
        }
        this._playerLast.x = playerPos.x;
        this._playerLast.z = playerPos.z;
      }
    } else {
      this._playerLast = null;
    }

    // ── Fade & remove old prints ─────────────────────────────────────────────
    for (let i = this._prints.length - 1; i >= 0; i--) {
      const p = this._prints[i];
      p.t += dt;
      const fadeIn  = Math.min(1, p.t / 0.3);
      const fadeOut = Math.max(0, 1 - Math.max(0, p.t - (PRINT_LIFE - 2)) / 2);
      p.mesh.material.opacity = p.maxOpacity * fadeIn * fadeOut;
      if (p.t >= PRINT_LIFE) {
        this.scene.remove(p.mesh);
        p.mesh.material.dispose();
        this._prints.splice(i, 1);
      }
    }
  }

  _spawnPrint(hx, hz, dx, dz, side, scale = 1.0, maxOpacity = 0.32) {
    if (this._prints.length >= MAX_PRINTS) {
      const old = this._prints.shift();
      this.scene.remove(old.mesh);
      old.mesh.material.dispose();
    }

    // Offset left/right of movement direction
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const nx = -dz / len, nz = dx / len;   // perpendicular
    const s  = side === 0 ? 0.38 : -0.38;
    const ox = nx * s * scale, oz = nz * s * scale;

    const angle = Math.atan2(dx, dz);

    const mat  = _printMat.clone();
    mat.opacity = 0;
    const mesh = new THREE.Mesh(_printGeo, mat);
    mesh.scale.set(scale, scale, scale);
    mesh.position.set(hx + ox, 0.02, hz + oz);
    mesh.rotation.y = angle;
    this.scene.add(mesh);
    this._prints.push({ mesh, t: 0, life: PRINT_LIFE, maxOpacity });
  }
}
