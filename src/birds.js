/**
 * src/birds.js — Bird flock system using Reynolds Boids (1987)
 * Three steering rules: Separation · Alignment · Cohesion
 * Birds are hitscannable, fall with physics when shot, lootable with E.
 */
import * as THREE from 'three';

// ── Boids tuning ──────────────────────────────────────────────────────────────
const SEP_RADIUS   = 1.6;   // repulsión si están muy juntos
const ALI_RADIUS   = 7.0;   // radio de alineación de velocidades
const COH_RADIUS   = 14.0;  // radio de cohesión (se jalan al centro del grupo)
const SEP_WEIGHT   = 2.2;
const ALI_WEIGHT   = 1.0;
const COH_WEIGHT   = 0.7;

const SPEED_CRUISE = 5.5;   // m/s en vuelo normal
const SPEED_FLEE   = 9.5;   // m/s al huir del jugador
const SPEED_MAX    = 11.0;
const FLEE_RADIUS  = 16;    // distancia al jugador para huir
const LAND_RADIUS  = 12;    // no aterriza si jugador más cerca

const FLY_H        = 5.0;   // altura de vuelo normal
const FLY_H_FLEE   = 9.0;   // altura al huir
const FLY_H_NOISE  = 1.2;   // variación aleatoria de altura por bird
const Y_LERP       = 2.2;

const WING_FREQ    = 5.8;
const WING_AMP     = 0.38;

const GRAVITY      = 16;    // para pájaros caídos (m/s²)
const BOUNCE_REST  = 0.22;  // rebote en el suelo
const DEAD_LIFE    = 60;    // segundos hasta desaparecer

// ── Spawn points (x, z, cantidad) ────────────────────────────────────────────
const FLOCK_SPAWNS = [
  // Cerca de aldea
  { x:   8, z:  -55, n: 14 },
  { x: -35, z:  -90, n: 11 },
  { x:  55, z:  -40, n: 16 },
  // Mapa disperso
  { x: 180, z:  -80, n: 12 },
  { x:-200, z:  100, n: 10 },
  { x: 130, z:  220, n: 13 },
  { x:-150, z: -180, n: 11 },
  { x: 300, z:   40, n:  9 },
  { x:-300, z:  -60, n: 10 },
  { x:  60, z:  350, n: 12 },
];

const RESPAWN_DELAY_BIRDS = 90; // segundos hasta respawn de bandada

// ── Bird mesh builder ─────────────────────────────────────────────────────────
const M_BIRD = new THREE.MeshStandardMaterial({ color: 0x1a1208, roughness: 0.9 });
const M_WING = new THREE.MeshStandardMaterial({ color: 0x2a1e10, roughness: 0.9 });

function buildBird() {
  const root = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.18), M_BIRD);
  body.castShadow = false;
  root.add(body);

  const wingPivotL = new THREE.Group();
  wingPivotL.position.set(-0.04, 0, 0);
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), M_WING);
  wingL.position.set(-0.13, 0, 0);
  wingL.castShadow = false;
  wingPivotL.add(wingL);
  root.add(wingPivotL);

  const wingPivotR = new THREE.Group();
  wingPivotR.position.set(0.04, 0, 0);
  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.14), M_WING);
  wingR.position.set(0.13, 0, 0);
  wingR.castShadow = false;
  wingPivotR.add(wingR);
  root.add(wingPivotR);

  root._wingL = wingPivotL;
  root._wingR = wingPivotR;
  return root;
}

// ── Vec2 helpers ──────────────────────────────────────────────────────────────
function _len2(x, z) { return Math.sqrt(x * x + z * z); }
function _norm2(x, z) { const l = _len2(x, z) || 1; return [x / l, z / l]; }

// ═════════════════════════════════════════════════════════════════════════════
export class BirdSystem {
  constructor(scene) {
    this._scene  = scene;
    this._flocks = [];   // array of bird arrays (one per spawn)
    this._dead   = [];   // dead birds with physics

    // Flat list of all live birds for hitscan
    this._allBirds   = [];
    this._syncBirds  = [];   // stable index for server sync (never modified after init)
    this.serverMode  = false; // when true: skip boids AI, positions come from host
    this._hitboxes   = [];   // THREE.Mesh per bird (invisible)
    this._hitboxMap  = new Map();  // hitbox.uuid → bird object

    // Respawn tracking per flock
    this._flockSpawns      = FLOCK_SPAWNS.map(sp => ({ ...sp }));
    this._flockOrigCounts  = [];
    this._flockRespawnTimer = [];

    for (let i = 0; i < FLOCK_SPAWNS.length; i++) {
      const sp = FLOCK_SPAWNS[i];
      this._flocks.push(this._spawnFlock(sp.x, sp.z, sp.n));
      this._flockOrigCounts.push(sp.n);
      this._flockRespawnTimer.push(0);
    }
  }

  // ── Spawn ──────────────────────────────────────────────────────────────────
  _spawnFlock(cx, cz, n) {
    const flock = [];
    for (let i = 0; i < n; i++) {
      const mesh = buildBird();
      const ox   = (Math.random() - 0.5) * 8;
      const oz   = (Math.random() - 0.5) * 8;
      const x    = cx + ox, z = cz + oz;
      mesh.position.set(x, 0, z);
      mesh.rotation.y = Math.random() * Math.PI * 2;
      this._scene.add(mesh);

      // Hitbox invisible (solo para raycasting)
      const hbGeo = new THREE.BoxGeometry(0.55, 0.18, 0.22);
      const hbMat = new THREE.MeshBasicMaterial({ visible: false });
      const hb    = new THREE.Mesh(hbGeo, hbMat);
      hb.name     = 'bird_body';
      mesh.add(hb);  // sigue al mesh automáticamente

      const bird = {
        mesh, hb,
        x, y: 0, z,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        vz: (Math.random() - 0.5) * 2,
        wingT:   Math.random() * Math.PI * 2,
        targetY: 0,
        heightNoise: (Math.random() - 0.5) * FLY_H_NOISE,
        state:   'resting',   // 'resting' | 'flying' | 'fleeing'
        stateTimer: 4 + Math.random() * 8,
        alive: true,
      };

      bird.syncIdx = this._syncBirds.length;
      this._syncBirds.push(bird);
      this._allBirds.push(bird);
      this._hitboxes.push(hb);
      this._hitboxMap.set(hb.uuid, bird);
      flock.push(bird);
    }
    return flock;
  }

  applyServerSync(syncArr) {
    for (const ed of syncArr) {
      const b = this._syncBirds[ed.idx];
      if (!b || !b.alive || !b.mesh) continue;
      b.mesh.position.x = ed.x;
      b.mesh.position.z = ed.z;
      if (ed.y !== undefined) b.mesh.position.y = ed.y;
      b.x = ed.x; b.z = ed.z;
    }
  }

  // ── Hitscan API ───────────────────────────────────────────────────────────
  getHitboxes()        { return this._hitboxes.filter(h => {
    const b = this._hitboxMap.get(h.uuid);
    return b?.alive;
  }); }
  getBirdByHitbox(hb)  { return this._hitboxMap.get(hb.uuid) ?? null; }

  // ── Hit: bala impacta un pájaro ───────────────────────────────────────────
  hitBird(bird) {
    if (!bird?.alive) return;
    bird.alive = false;

    // Sacar de los arrays vivos
    this._hitboxes = this._hitboxes.filter(h => h !== bird.hb);
    this._hitboxMap.delete(bird.hb.uuid);
    for (const flock of this._flocks) {
      const idx = flock.indexOf(bird);
      if (idx >= 0) flock.splice(idx, 1);
    }
    const ai = this._allBirds.indexOf(bird);
    if (ai >= 0) this._allBirds.splice(ai, 1);

    // Desconectar hitbox del mesh
    bird.mesh.remove(bird.hb);

    // Iniciar física de caída
    bird.vy    = 1.5 + Math.random();   // pequeño impulso vertical
    bird.vx   += (Math.random() - 0.5) * 3;
    bird.vz   += (Math.random() - 0.5) * 3;
    bird.deadTimer  = DEAD_LIFE;
    bird.settled    = false;
    bird.lootable   = false;
    bird.angVX  = (Math.random() - 0.5) * 6;
    bird.angVZ  = (Math.random() - 0.5) * 6;
    this._dead.push(bird);
  }

  // ── Loot API ──────────────────────────────────────────────────────────────
  getNearbyDead(px, pz, radius) {
    const r2 = radius * radius;
    return this._dead.find(b => {
      if (!b.lootable || b._beingButchered) return false;
      const dx = b.x - px, dz = b.z - pz;
      return dx * dx + dz * dz < r2;
    }) ?? null;
  }

  lootBird(bird) {
    if (!bird || !bird.lootable) return null;
    const idx = this._dead.indexOf(bird);
    if (idx >= 0) this._dead.splice(idx, 1);
    this._scene.remove(bird.mesh);
    bird.mesh.geometry?.dispose?.();
    return { hunger: 18, hp: 12 };
  }

  // ── Main update ───────────────────────────────────────────────────────────
  update(dt, playerPos) {
    if (!this.serverMode) this._updateFlocks(dt, playerPos);
    else this._animateFlocks(dt); // still animate wings, skip boids movement
    this._updateDead(dt);
    if (!this.serverMode) this._updateRespawn(dt);
  }

  // ── Respawn de bandadas ───────────────────────────────────────────────────
  _updateRespawn(dt) {
    for (let i = 0; i < this._flocks.length; i++) {
      const flock    = this._flocks[i];
      const origN    = this._flockOrigCounts[i];
      const threshold = Math.floor(origN * 0.4);
      if (flock.length < threshold) {
        this._flockRespawnTimer[i] += dt;
        if (this._flockRespawnTimer[i] >= RESPAWN_DELAY_BIRDS) {
          this._flockRespawnTimer[i] = 0;
          const sp = this._flockSpawns[i];
          const needed = origN - flock.length;
          const newBirds = this._spawnFlock(sp.x, sp.z, needed);
          flock.push(...newBirds);
        }
      } else {
        this._flockRespawnTimer[i] = 0;
      }
    }
  }

  // ── Animate wings only (no position update) for server-mode clients ──────
  _animateFlocks(dt) {
    for (const flock of this._flocks) {
      for (const bird of flock) {
        if (!bird.alive) continue;
        bird.wingT += dt * 3.5;
        // sync mesh position to the x/z set by applyServerSync
        if (bird.mesh) bird.mesh.position.set(bird.x, bird.y, bird.z);
        if (bird.mesh) bird.mesh.rotation.y = Math.atan2(bird.vx || 0, bird.vz || 0.001);
      }
    }
  }

  // ── Boids por bandada ─────────────────────────────────────────────────────
  _updateFlocks(dt, playerPos) {
    for (const flock of this._flocks) {
      if (flock.length === 0) continue;

      // ── Centroide del grupo ─────────────────────────────────────────────
      let sumX = 0, sumZ = 0;
      for (const b of flock) { sumX += b.x; sumZ += b.z; }
      const centX = sumX / flock.length;
      const centZ = sumZ / flock.length;

      // ── Estado global de la bandada ─────────────────────────────────────
      let flockFlee = false;
      if (playerPos) {
        const dx = centX - playerPos.x, dz = centZ - playerPos.z;
        if (dx * dx + dz * dz < FLEE_RADIUS * FLEE_RADIUS) flockFlee = true;
      }

      for (const bird of flock) {
        // ── Transición de estado ──────────────────────────────────────────
        bird.stateTimer -= dt;
        if (flockFlee) {
          bird.state = 'fleeing';
          bird.stateTimer = 3 + Math.random() * 4;
        } else if (bird.stateTimer <= 0) {
          if (bird.state === 'fleeing' || bird.state === 'flying') {
            const canLand = !playerPos || (() => {
              const dx = bird.x - playerPos.x, dz = bird.z - playerPos.z;
              return dx * dx + dz * dz > LAND_RADIUS * LAND_RADIUS;
            })();
            bird.state = (canLand && Math.random() < 0.25) ? 'resting' : 'flying';
          } else {
            bird.state = 'flying';
          }
          bird.stateTimer = 5 + Math.random() * 12;
        }

        if (bird.state === 'resting') {
          // Pájaros posados: desaceleran y se detienen
          bird.vx *= Math.max(0, 1 - 5 * dt);
          bird.vz *= Math.max(0, 1 - 5 * dt);
          bird.targetY = 0;
        } else {
          // ── Boids: calcular fuerzas ─────────────────────────────────────
          let sepX = 0, sepZ = 0;
          let aliVX = 0, aliVZ = 0, aliCount = 0;
          let cohX = 0, cohZ = 0, cohCount = 0;

          for (const other of flock) {
            if (other === bird) continue;
            const dx = bird.x - other.x;
            const dz = bird.z - other.z;
            const d2 = dx * dx + dz * dz;

            // Separación
            if (d2 < SEP_RADIUS * SEP_RADIUS && d2 > 0.0001) {
              const d = Math.sqrt(d2);
              sepX += (dx / d) * (SEP_RADIUS - d) / SEP_RADIUS;
              sepZ += (dz / d) * (SEP_RADIUS - d) / SEP_RADIUS;
            }

            // Alineación
            if (d2 < ALI_RADIUS * ALI_RADIUS) {
              aliVX += other.vx; aliVZ += other.vz; aliCount++;
            }

            // Cohesión
            if (d2 < COH_RADIUS * COH_RADIUS) {
              cohX += other.x; cohZ += other.z; cohCount++;
            }
          }

          // Normalizar fuerzas
          const [snx, snz] = _norm2(sepX, sepZ);
          const sepFX = sepX !== 0 ? snx * SEP_WEIGHT : 0;
          const sepFZ = sepZ !== 0 ? snz * SEP_WEIGHT : 0;

          let aliFX = 0, aliFZ = 0;
          if (aliCount > 0) {
            const [ax, az] = _norm2(aliVX / aliCount, aliVZ / aliCount);
            aliFX = ax * ALI_WEIGHT;
            aliFZ = az * ALI_WEIGHT;
          }

          let cohFX = 0, cohFZ = 0;
          if (cohCount > 0) {
            const cx2 = cohX / cohCount - bird.x;
            const cz2 = cohZ / cohCount - bird.z;
            const [ccx, ccz] = _norm2(cx2, cz2);
            cohFX = ccx * COH_WEIGHT;
            cohFZ = ccz * COH_WEIGHT;
          }

          // Huída del jugador
          let fleeFX = 0, fleeFZ = 0;
          if (playerPos && bird.state === 'fleeing') {
            const [fx, fz] = _norm2(bird.x - playerPos.x, bird.z - playerPos.z);
            fleeFX = fx * 3.0;
            fleeFZ = fz * 3.0;
          }

          // Fuerza total → aceleración hacia velocidad objetivo
          const accX = (sepFX + aliFX + cohFX + fleeFX) * 12;
          const accZ = (sepFZ + aliFZ + cohFZ + fleeFZ) * 12;

          const tau = bird.state === 'fleeing' ? 0.12 : 0.28;
          bird.vx += (accX - bird.vx * 0.5) * Math.min(1, tau * dt * 30);
          bird.vz += (accZ - bird.vz * 0.5) * Math.min(1, tau * dt * 30);

          // Limitar velocidad máxima
          const spd = _len2(bird.vx, bird.vz);
          const maxSpd = bird.state === 'fleeing' ? SPEED_FLEE : SPEED_CRUISE;
          if (spd > maxSpd) {
            const s = maxSpd / spd;
            bird.vx *= s; bird.vz *= s;
          }
          // Mínimo de velocidad en vuelo (no se quedan quietos en el aire)
          if (spd < 1.5 && bird.state !== 'resting') {
            const angle = Math.random() * Math.PI * 2;
            bird.vx += Math.cos(angle) * 1.8;
            bird.vz += Math.sin(angle) * 1.8;
          }

          // Altura objetivo
          const baseH = bird.state === 'fleeing' ? FLY_H_FLEE : FLY_H;
          bird.targetY = baseH + bird.heightNoise;
        }

        // ── Integrar posición ─────────────────────────────────────────────
        bird.x += bird.vx * dt;
        bird.z += bird.vz * dt;
        bird.y += (bird.targetY - bird.y) * Math.min(1, Y_LERP * dt);

        bird.mesh.position.set(bird.x, bird.y, bird.z);

        // ── Rotación hacia dirección de vuelo ─────────────────────────────
        const spd2D = _len2(bird.vx, bird.vz);
        if (spd2D > 0.4) {
          const targetRY = Math.atan2(bird.vx, bird.vz);
          let diff = targetRY - bird.mesh.rotation.y;
          while (diff >  Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          bird.mesh.rotation.y += diff * Math.min(1, 7 * dt);
        }

        // ── Aleteo ────────────────────────────────────────────────────────
        if (bird.state !== 'resting') {
          const freqMult = bird.state === 'fleeing' ? 1.5 : 1.0;
          bird.wingT += dt * WING_FREQ * freqMult;
          const wa = Math.sin(bird.wingT) * WING_AMP;
          if (bird.mesh._wingL) bird.mesh._wingL.rotation.x =  wa;
          if (bird.mesh._wingR) bird.mesh._wingR.rotation.x = -wa;
        } else {
          if (bird.mesh._wingL) bird.mesh._wingL.rotation.x = 0.08;
          if (bird.mesh._wingR) bird.mesh._wingR.rotation.x = 0.08;
        }
      }
    }
  }

  // ── Física de pájaros muertos ─────────────────────────────────────────────
  _updateDead(dt) {
    for (let i = this._dead.length - 1; i >= 0; i--) {
      const b = this._dead[i];
      b.deadTimer -= dt;

      if (b.deadTimer <= 0) {
        this._scene.remove(b.mesh);
        this._dead.splice(i, 1);
        continue;
      }

      if (b.settled) continue;

      // Gravedad
      b.vy -= GRAVITY * dt;
      b.x  += b.vx * dt;
      b.y  += b.vy * dt;
      b.z  += b.vz * dt;

      // Rotación tumble
      b.mesh.rotation.x += b.angVX * dt;
      b.mesh.rotation.z += b.angVZ * dt;

      // Suelo
      if (b.y <= 0) {
        b.y = 0;
        b.vy *= -BOUNCE_REST;
        b.vx *= 0.65;
        b.vz *= 0.65;
        b.angVX *= 0.4;
        b.angVZ *= 0.4;
        if (Math.abs(b.vy) < 0.3 && _len2(b.vx, b.vz) < 0.3) {
          b.settled   = true;
          b.lootable  = true;
          b.mesh.rotation.z = Math.PI / 2;  // tumbado de lado
          b.vy = b.vx = b.vz = 0;
        }
      }

      b.mesh.position.set(b.x, b.y, b.z);
    }
  }
}
