// --- Partículas de arena / polvo en el viento ---
import * as THREE from 'three';

const WIND_DIR   = new THREE.Vector3(1, 0, 0.4).normalize();
const WIND_SPEED = 5.5;
const MAX_P      = 45;
const LIFE_MAX   = 4.0;
const SPAWN_R    = 30;

const _pos = new Float32Array(MAX_P * 3);
const _geo = new THREE.BufferGeometry();
_geo.setAttribute('position', new THREE.BufferAttribute(_pos, 3));

const _mat = new THREE.PointsMaterial({
  color:           0xc8a060,
  size:            0.10,
  transparent:     true,
  opacity:         0.28,
  sizeAttenuation: true,
  depthWrite:      false,
});

export class WindParticles {
  constructor(scene) {
    this._parts  = [];
    this._timer  = 0;
    this._points = new THREE.Points(_geo, _mat);
    this._points.frustumCulled = false;
    scene.add(this._points);
  }

  update(dt, playerPos) {
    if (!playerPos) return;

    // Spawn a few per second
    this._timer += dt;
    while (this._timer > 0.18 && this._parts.length < MAX_P) {
      this._timer -= 0.18;
      const ang = Math.random() * Math.PI * 2;
      const r   = 8 + Math.random() * SPAWN_R;
      const ox  = -WIND_DIR.x * r * 0.6 + Math.cos(ang) * r * 0.4;
      const oz  = -WIND_DIR.z * r * 0.6 + Math.sin(ang) * r * 0.4;
      this._parts.push({
        x:    playerPos.x + ox,
        y:    0.05 + Math.random() * 0.55,
        z:    playerPos.z + oz,
        life: LIFE_MAX * (0.4 + Math.random() * 0.7),
        spd:  WIND_SPEED * (0.5 + Math.random() * 0.8),
      });
    }

    const attr = _geo.attributes.position;
    let   slot = 0;

    for (let i = this._parts.length - 1; i >= 0; i--) {
      const p = this._parts[i];
      p.life -= dt;
      if (p.life <= 0) { this._parts.splice(i, 1); continue; }
      p.x += WIND_DIR.x * p.spd * dt;
      p.z += WIND_DIR.z * p.spd * dt;
      attr.setXYZ(slot++, p.x, p.y, p.z);
    }

    for (let i = slot; i < MAX_P; i++) attr.setXYZ(i, 0, -9999, 0);
    attr.needsUpdate = true;
    _geo.setDrawRange(0, MAX_P);
  }
}
