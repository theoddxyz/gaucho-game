// --- Sistema de partículas de viento ---
import * as THREE from 'three';

const WIND_DIR    = new THREE.Vector3(1, 0, 0.4).normalize(); // mismo que tumbleweeds
const WIND_SPEED  = 6.0;
const MAX_PART    = 120;
const PART_LIFE   = 3.5;   // segundos
const SPAWN_RADIUS = 35;   // radio alrededor del jugador

const _geo = new THREE.BufferGeometry();
const _pos = new Float32Array(MAX_PART * 3);
const _alpha = new Float32Array(MAX_PART);
_geo.setAttribute('position', new THREE.BufferAttribute(_pos, 3));

// Custom shader material para que las partículas tengan opacidad variable
const _mat = new THREE.ShaderMaterial({
  uniforms: { uAlphas: { value: _alpha } },
  vertexShader: `
    attribute float alpha;
    varying float vAlpha;
    void main() {
      vAlpha = alpha;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = mix(2.0, 5.0, vAlpha) * (200.0 / -mv.z);
      gl_Position  = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;
      gl_FragColor = vec4(0.85, 0.78, 0.55, vAlpha * 0.7);
    }
  `,
  transparent: true,
  depthWrite:  false,
  blending:    THREE.AdditiveBlending,
});
// Attach alpha per-vertex attribute
_geo.setAttribute('alpha', new THREE.BufferAttribute(_alpha, 1));

export class WindParticles {
  constructor(scene) {
    this._scene    = scene;
    this._parts    = [];   // { x, y, z, life, maxLife, drift }
    this._points   = new THREE.Points(_geo, _mat);
    this._points.frustumCulled = false;
    scene.add(this._points);
    this._spawnTimer = 0;
  }

  update(dt, playerPos) {
    if (!playerPos) return;

    // Spawn
    this._spawnTimer += dt;
    const toSpawn = Math.floor(this._spawnTimer * 18);
    this._spawnTimer -= toSpawn / 18;
    for (let s = 0; s < toSpawn && this._parts.length < MAX_PART; s++) {
      const angle = Math.random() * Math.PI * 2;
      const r     = 10 + Math.random() * SPAWN_RADIUS;
      // Spawn slightly upwind so particle drifts INTO view
      const ox = -WIND_DIR.x * r * 0.5 + Math.cos(angle) * r * 0.5;
      const oz = -WIND_DIR.z * r * 0.5 + Math.sin(angle) * r * 0.5;
      const maxLife = PART_LIFE * (0.5 + Math.random() * 0.8);
      this._parts.push({
        x: playerPos.x + ox,
        y: 0.3 + Math.random() * 2.2,
        z: playerPos.z + oz,
        life: maxLife,
        maxLife,
        speedMult: 0.5 + Math.random() * 1.0,
        driftY: (Math.random() - 0.5) * 0.4,
      });
    }

    // Update
    const posAttr   = _geo.attributes.position;
    const alphaAttr = _geo.attributes.alpha;
    let count = 0;

    for (let i = this._parts.length - 1; i >= 0; i--) {
      const p = this._parts[i];
      p.life -= dt;
      if (p.life <= 0) { this._parts.splice(i, 1); continue; }

      p.x += WIND_DIR.x * WIND_SPEED * p.speedMult * dt;
      p.z += WIND_DIR.z * WIND_SPEED * p.speedMult * dt;
      p.y += p.driftY * dt;
      if (p.y < 0.1) p.y = 0.1;

      const t = p.life / p.maxLife;  // 1=fresh 0=dead
      const a = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1.0;

      posAttr.setXYZ(count, p.x, p.y, p.z);
      alphaAttr.setX(count, a);
      count++;
    }

    // Hide unused slots
    for (let i = count; i < MAX_PART; i++) {
      posAttr.setXYZ(i, 0, -999, 0);
      alphaAttr.setX(i, 0);
    }

    posAttr.needsUpdate   = true;
    alphaAttr.needsUpdate = true;
    _geo.setDrawRange(0, MAX_PART);
  }
}
