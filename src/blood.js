// --- Blood particle system ---
import * as THREE from 'three';

const POOL_SIZE = 180;
const GRAVITY = 10;
const LIFETIME = 1.2;

const _mat = new THREE.MeshBasicMaterial({ color: 0x8b0000 });
const _geo = new THREE.SphereGeometry(0.25, 5, 4);

export class BloodSystem {
  constructor(scene) {
    this._scene = scene;
    this._pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const m = new THREE.Mesh(_geo, _mat.clone());
      m.visible = false;
      scene.add(m);
      this._pool.push({ mesh: m, vx: 0, vy: 0, vz: 0, life: 0, maxLife: LIFETIME });
    }
    this._idx = 0;
  }

  spawn(point, dirX, dirZ, count = 10) {
    const dirLen = Math.sqrt(dirX * dirX + dirZ * dirZ) || 1;
    const dx = dirX / dirLen;
    const dz = dirZ / dirLen;

    for (let i = 0; i < count; i++) {
      const p = this._pool[this._idx];
      this._idx = (this._idx + 1) % POOL_SIZE;

      p.mesh.position.set(point.x, point.y, point.z);
      p.mesh.scale.setScalar(1);
      p.mesh.visible = true;

      // Velocidad en cono hacia dirección de bala + spread aleatorio
      const speed = 3 + Math.random() * 5;
      const spread = (Math.random() - 0.5) * 2.5;
      const perpX = -dz, perpZ = dx;
      p.vx = dx * speed + perpX * spread;
      p.vy = 2 + Math.random() * 4;
      p.vz = dz * speed + perpZ * spread;

      p.life = LIFETIME + Math.random() * 0.3;
      p.maxLife = p.life;

      // Variación de color rojo
      const r = 0.35 + Math.random() * 0.2;
      p.mesh.material.color.setRGB(r, 0, 0);
    }
  }

  update(dt) {
    for (const p of this._pool) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) { p.mesh.visible = false; continue; }

      p.vy -= GRAVITY * dt;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;

      // No bajar del suelo
      if (p.mesh.position.y < 0.02) {
        p.mesh.position.y = 0.02;
        p.vy = 0;
        p.vx *= 0.5;
        p.vz *= 0.5;
      }

      // Escala se reduce con el tiempo
      const frac = p.life / p.maxLife;
      p.mesh.scale.setScalar(0.5 + frac * 0.5);
    }
  }
}
