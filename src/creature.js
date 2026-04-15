/**
 * creature.js — Sistema base unificado para criaturas terrestres.
 *
 * Cada especie es una instancia de CreatureSystem con un config + renderer.
 * El base maneja: dBBMM AI, death ragdoll, hitboxes, loot, respawn.
 * El renderer maneja: visuals (tubo worm, caja voxel, etc.) y sus hitboxes.
 *
 * Uso:
 *   import { CreatureSystem, wormRenderer } from './creature.js';
 *   const viboras = new CreatureSystem(scene, viboraConfig, spawnPoints);
 *   viboras.update(dt, { playerPos, preyPositions });
 */
import * as THREE from 'three';
import { createRagdollBody, removeRagdollBody, syncMeshFromBody, bodyIsAsleep } from './physics.js';

// ─── Utilidades matemáticas compartidas ──────────────────────────────────────
export function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ─── Partes voladoras (portables, usables por cualquier sistema) ──────────────
export function spawnFlyingPart(scene, worldPos, geo, color, parts, hitPoint) {
  const mat  = new THREE.MeshStandardMaterial({ color, roughness: 0.85, transparent: true, opacity: 1, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(worldPos);
  scene.add(mesh);
  const away = hitPoint
    ? new THREE.Vector3().subVectors(worldPos, hitPoint).normalize()
    : new THREE.Vector3((Math.random()-.5)*2, 1, (Math.random()-.5)*2).normalize();
  parts.push({
    mesh,
    vel:    new THREE.Vector3(away.x*5+(Math.random()-.5)*4, Math.abs(away.y)*2+5+Math.random()*4, away.z*5+(Math.random()-.5)*4),
    angVel: new THREE.Vector3((Math.random()-.5)*20, (Math.random()-.5)*20, (Math.random()-.5)*20),
    t: 0, maxT: 5.0,
  });
}

export function tickFlyingParts(scene, parts, dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.t += dt;
    if (p.t >= p.maxT) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      parts.splice(i, 1);
      continue;
    }
    p.vel.y -= 20 * dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    p.mesh.rotation.x += p.angVel.x * dt;
    p.mesh.rotation.y += p.angVel.y * dt;
    p.mesh.rotation.z += p.angVel.z * dt;
    if (p.mesh.position.y < 0.04) { p.mesh.position.y = 0.04; p.vel.y *= -0.3; p.vel.x *= 0.5; p.vel.z *= 0.5; }
    if (p.t > p.maxT - 0.5) p.mesh.material.opacity = Math.max(0, (p.maxT - p.t) / 0.5);
  }
}

// ─── Worm Renderer ────────────────────────────────────────────────────────────
// Retorna un objeto { build, update, removeVisuals } para usar en CreatureSystem config.
//
// opts: { segCount, spacing, baseR, color, eyeColor }
export function wormRenderer({ segCount = 8, spacing = 0.5, baseR = 0.22, color = 0x8b4513, eyeColor = 0x111111 } = {}) {
  const HEAD_R    = baseR * 1.55;
  const RADSEG    = 8;    // radial segments del TubeGeometry
  const _hitMat   = new THREE.MeshBasicMaterial({ visible: false });

  function _segRadius(i) {
    const t = i / (segCount - 1);
    return baseR * (0.45 + Math.sin(t * Math.PI) * 1.1);
  }

  function _rebuildTube(tube, curve, segs, gx, gz) {
    const localPts = segs.map(s => new THREE.Vector3(s.x - gx, s.y, s.z - gz));
    curve.points   = localPts;
    const tubSegs  = segCount * 3;
    const newGeo   = new THREE.TubeGeometry(curve, tubSegs, baseR, RADSEG, false);
    const pos      = newGeo.attributes.position;
    const norm     = newGeo.attributes.normal;
    for (let vi = 0; vi < pos.count; vi++) {
      const ti    = Math.floor(vi / (RADSEG + 1));
      const t     = ti / tubSegs;
      const extra = Math.sin(t * Math.PI) * baseR;
      pos.setXYZ(vi,
        pos.getX(vi) + norm.getX(vi) * extra,
        pos.getY(vi) + norm.getY(vi) * extra,
        pos.getZ(vi) + norm.getZ(vi) * extra
      );
    }
    pos.needsUpdate = true;
    tube.geometry.dispose();
    tube.geometry = newGeo;
  }

  return {
    build(entityIdx, scene, spawnX, spawnZ) {
      const group = new THREE.Group();
      group.position.set(spawnX, 0, spawnZ);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.08 });

      // Tubo
      const initPts = [];
      for (let i = 0; i < segCount; i++) initPts.push(new THREE.Vector3(0, baseR, -i * spacing));
      const curve   = new THREE.CatmullRomCurve3(initPts);
      const initGeo = new THREE.TubeGeometry(curve, segCount * 3, baseR, RADSEG, false);
      const tube    = new THREE.Mesh(initGeo, mat);
      tube.castShadow = true;
      group.add(tube);

      // Cabeza
      const head = new THREE.Mesh(new THREE.SphereGeometry(HEAD_R, 16, 12), mat.clone());
      head.castShadow = true;
      group.add(head);

      // Ojos
      if (baseR >= 0.14) {
        const eyeR     = HEAD_R * 0.28;
        const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const pupilMat = new THREE.MeshStandardMaterial({ color: eyeColor });
        for (const sx of [-1, 1]) {
          const eye   = new THREE.Mesh(new THREE.SphereGeometry(eyeR,   8, 8), eyeWhite);
          const pupil = new THREE.Mesh(new THREE.SphereGeometry(eyeR*.55, 6, 6), pupilMat);
          pupil.position.set(0, 0, eyeR * 0.72);
          eye.add(pupil);
          eye.position.set(sx * HEAD_R * 0.50, HEAD_R * 0.32, HEAD_R * 0.82);
          head.add(eye);
        }
      }

      // Hitboxes por segmento
      const hitboxes = [];
      for (let i = 0; i < segCount; i++) {
        const r  = i === 0 ? HEAD_R * 1.2 : _segRadius(i) * 1.3;
        const hb = new THREE.Mesh(new THREE.SphereGeometry(r, 5, 5), _hitMat);
        hb.userData.creatureEntityIdx = entityIdx;
        group.add(hb);
        hitboxes.push(hb);
      }

      // Segmentos en world space (group está en spawnX/Z, segs son world)
      const segs = [];
      for (let i = 0; i < segCount; i++)
        segs.push(new THREE.Vector3(spawnX, baseR, spawnZ - i * spacing));

      const rendState = { segs, tube, head, curve, walkT: Math.random() * 10, hitboxes };
      scene.add(group);
      return { group, hitboxes, rendState };
    },

    update(group, rendState, entity, dt) {
      const { segs, tube, head, curve, hitboxes } = rendState;
      const gx = group.position.x, gz = group.position.z;
      rendState.walkT += dt * (entity.moving ? Math.min(entity.speed, 8) * 0.6 + 1.0 : 0.8);
      const wt = rendState.walkT;

      if (entity.dead) {
        for (let i = 0; i < segCount; i++) segs[i].y = Math.max(0, segs[i].y - dt * 2.5);
      } else {
        // Cabeza persigue posición world del entity
        const dx = entity.x - segs[0].x, dz = entity.z - segs[0].z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        if (dist > 0.05) {
          const step = Math.min(dist, Math.max(entity.speed, 0.3) * dt * 2.0);
          segs[0].x += (dx / dist) * step;
          segs[0].z += (dz / dist) * step;
        }
        segs[0].y = baseR * 1.4 + Math.sin(wt * 3.8) * baseR * 0.35;

        // Cadena de seguimiento
        for (let i = 1; i < segCount; i++) {
          const prev = segs[i-1], curr = segs[i];
          const ddx  = curr.x - prev.x, ddy = curr.y - prev.y, ddz = curr.z - prev.z;
          const d    = Math.sqrt(ddx*ddx + ddy*ddy + ddz*ddz);
          if (d > spacing) { const f = (d - spacing) / d; curr.x -= ddx*f; curr.y -= ddy*f; curr.z -= ddz*f; }
          const t   = i / (segCount - 1);
          const amp = Math.sin(t * Math.PI) * baseR * 0.55;
          curr.y = baseR * 0.7 + amp * Math.sin(wt * 3.5 - i * 0.55);
        }
      }

      // Head mesh (local a group)
      head.position.set(segs[0].x - gx, segs[0].y, segs[0].z - gz);
      if (segCount > 1) {
        const ddx = segs[0].x - segs[1].x, ddz = segs[0].z - segs[1].z;
        if (ddx*ddx + ddz*ddz > 0.0001) head.rotation.y = Math.atan2(ddx, ddz);
      }

      // Hitboxes (local a group)
      for (let i = 0; i < segCount; i++)
        hitboxes[i].position.set(segs[i].x - gx, segs[i].y, segs[i].z - gz);

      // Tubo
      _rebuildTube(tube, curve, segs, gx, gz);
    },

    removeVisuals(scene, group) {
      scene.remove(group);
    },
  };
}

// ─── CreatureSystem Base ──────────────────────────────────────────────────────
/**
 * config: {
 *   species:   string,
 *   count:     number,
 *   hp:        number,
 *   hx/hy/hz:  number,   ragdoll box half-extents
 *   mass:      number,
 *   fleeRadius:   number,   huir si predador a menos de esta distancia
 *   huntRadius:   number,   cazar si presa a menos de esta distancia
 *   attackRadius: number,   atacar al llegar a esta distancia de la presa
 *   homeRadius:   number,   radio de leash desde spawn
 *   states: {
 *     wander: { sigma, speed, wpRadius:[min,max], timer:[min,max] },
 *     flee:   { sigma, speed, wpRadius:[min,max], timer:[min,max] },
 *     hunt:   { sigma, speed, wpRadius:[min,max], timer:[min,max] },
 *   },
 *   tau: { wander, flee, hunt },    exponential smoothing
 *   loot:     [{ hp, hunger, color, chance }],
 *   renderer: wormRenderer(...),
 *   respawnDelay: number,   segundos antes de respawnear
 * }
 *
 * spawnPoints: [{ x, z }, ...]
 *
 * update(dt, context):
 *   context = { playerPos: {x,z}, preyPositions: [{x,z}] }
 */
export class CreatureSystem {
  constructor(scene, config, spawnPoints) {
    this._scene    = scene;
    this._config   = config;
    this._spawns   = spawnPoints;
    this._entities = [];
    this._loot     = [];
    this._parts    = [];

    for (let i = 0; i < config.count; i++) this._spawnEntity(i);
  }

  // ── Spawn / respawn ────────────────────────────────────────────────────────
  _spawnEntity(i) {
    const cfg   = this._config;
    const spawn = this._spawns[i % this._spawns.length];
    const sx    = spawn.x + (Math.random() - 0.5) * 6;
    const sz    = spawn.z + (Math.random() - 0.5) * 6;

    const { group, hitboxes, rendState } = cfg.renderer.build(i, this._scene, sx, sz);

    const e = {
      idx: i,
      x: sx, z: sz,
      spawnX: sx, spawnZ: sz,
      vx: 0, vz: 0,
      speed: 0,
      moving: false,
      hp: cfg.hp,
      state: 'wander',
      waypoint: { x: sx, z: sz },
      wpTimer:    Math.random() * 3,
      panicTimer: 0,
      dead: false,
      removeTimer: 0,
      group, hitboxes, rendState,
    };

    if (this._entities[i]) {
      // Reuse slot on respawn
      this._entities[i] = e;
    } else {
      this._entities.push(e);
    }
    return e;
  }

  // ── Hitboxes (para hitscan + crosshair en main.js) ─────────────────────────
  getHitboxes() {
    const out = [];
    for (const e of this._entities) {
      if (e.dead) continue;
      for (const hb of e.hitboxes) out.push(hb);
    }
    return out;
  }

  // Retorna el índice del entity dueño del hitbox (-1 si no encontrado / muerto)
  getIndexByHitbox(hb) {
    const idx = hb.userData.creatureEntityIdx;
    return (idx !== undefined && idx >= 0) ? idx : -1;
  }

  // ── Recibir impacto de bala ────────────────────────────────────────────────
  hit(entityIdx, hitPoint, bulletDir) {
    const e = this._entities[entityIdx];
    if (!e || e.dead) return;
    e.hp -= 1;

    // Impulso en la dirección del disparo
    if (bulletDir) {
      const len = Math.sqrt(bulletDir.x*bulletDir.x + bulletDir.z*bulletDir.z) || 1;
      const f   = 18;
      e.vx = (bulletDir.x / len) * f;
      e.vz = (bulletDir.z / len) * f;
      e.x += e.vx * 0.06;
      e.z += e.vz * 0.06;
    }

    if (e.hp <= 0) {
      e.dead = true;
      e.state = 'dead';
      e.removeTimer = this._config.respawnDelay ?? 60;
      for (const hb of e.hitboxes) hb.userData.creatureEntityIdx = -1; // desregistrar del raycast
      this._spawnLoot(e, hitPoint);
    }
  }

  _spawnLoot(e, hitPoint) {
    const lootDefs = this._config.loot;
    if (!lootDefs?.length) return;
    for (const def of lootDefs) {
      if (Math.random() > (def.chance ?? 0.8)) continue;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 6, 6),
        new THREE.MeshStandardMaterial({ color: def.color ?? 0x8b4513, roughness: 0.8 })
      );
      const ox = (Math.random() - 0.5) * 2;
      const oz = (Math.random() - 0.5) * 2;
      mesh.position.set(e.x + ox, 0.3, e.z + oz);
      mesh.castShadow = true;
      this._scene.add(mesh);
      this._loot.push({ mesh, t: 0, baseY: 0.3, bobPhase: Math.random()*Math.PI*2, def, life: 120 });
    }
  }

  // ── Loot pickup (llamar desde main.js en el loop) ──────────────────────────
  updateLoot(dt, playerPos) {
    if (!playerPos) return null;
    const R2 = 2.2 * 2.2;
    for (let i = this._loot.length - 1; i >= 0; i--) {
      const item = this._loot[i];
      item.t    += dt;
      item.life -= dt;
      item.mesh.position.y = item.baseY + Math.sin(item.t * 2.2 + item.bobPhase) * 0.12;
      if (item.life <= 0) { this._scene.remove(item.mesh); this._loot.splice(i, 1); continue; }
      const dx = item.mesh.position.x - playerPos.x, dz = item.mesh.position.z - playerPos.z;
      if (dx*dx + dz*dz < R2) {
        this._scene.remove(item.mesh);
        this._loot.splice(i, 1);
        return item.def;
      }
    }
    return null;
  }

  // ── Update principal (llamar cada frame desde main.js) ────────────────────
  // context: { playerPos: {x,z}, preyPositions: [{x,z}] }
  update(dt, context) {
    const cfg       = this._config;
    const playerPos = context?.playerPos;

    tickFlyingParts(this._scene, this._parts, dt);

    for (const e of this._entities) {
      // Muerto — colapso visual + respawn
      if (e.dead) {
        e.removeTimer -= dt;
        e.group.position.set(e.x, 0, e.z);
        cfg.renderer.update(e.group, e.rendState, e, dt);
        if (e.removeTimer <= 0) {
          cfg.renderer.removeVisuals(this._scene, e.group);
          this._spawnEntity(e.idx);
        }
        continue;
      }

      // ── Determinar estado AI ───────────────────────────────────────────────
      let nextState = e.state;

      // Pánico — cooldown
      if (e.panicTimer > 0) {
        e.panicTimer -= dt;
        if (e.panicTimer <= 0 && nextState === 'flee') nextState = 'wander';
      }

      // Detectar predador (jugador → huir)
      if (playerPos) {
        const dx = e.x - playerPos.x, dz = e.z - playerPos.z;
        const d2 = dx*dx + dz*dz;
        const fr = cfg.fleeRadius ?? 4;
        if (d2 < fr * fr) {
          nextState = 'flee';
          e.panicTimer = 4.0;
          const d  = Math.sqrt(d2) || 1;
          const wr = cfg.states?.flee?.wpRadius ?? [15, 30];
          const r  = wr[0] + Math.random() * (wr[1] - wr[0]);
          e.waypoint.x = e.x + (dx/d) * r;
          e.waypoint.z = e.z + (dz/d) * r;
          const ts = cfg.states?.flee?.timer ?? [3, 6];
          e.wpTimer = ts[0] + Math.random() * (ts[1] - ts[0]);
        }
      }

      // Detectar presa (hunt)
      if (nextState === 'wander') {
        const prey = context?.preyPositions;
        if (prey?.length) {
          const hr = cfg.huntRadius ?? 10;
          let best = null, bestD = Infinity;
          for (const p of prey) {
            const dx = p.x - e.x, dz = p.z - e.z;
            const d  = Math.sqrt(dx*dx + dz*dz);
            if (d < hr && d < bestD) { bestD = d; best = p; }
          }
          if (best) {
            nextState = 'hunt';
            e.waypoint.x = best.x;
            e.waypoint.z = best.z;
            const ts = cfg.states?.hunt?.timer ?? [4, 8];
            e.wpTimer = ts[0] + Math.random() * (ts[1] - ts[0]);
          }
        }
      }

      e.state = nextState;

      // ── dBBMM ─────────────────────────────────────────────────────────────
      const sKey  = nextState === 'flee' ? 'flee' : nextState === 'hunt' ? 'hunt' : 'wander';
      const sp    = cfg.states?.[sKey] ?? cfg.states?.wander ?? { sigma: 1.5, speed: 1.0, wpRadius: [5, 15], timer: [3, 8] };

      // Timer de waypoint
      e.wpTimer -= dt;
      const wpDx   = e.waypoint.x - e.x, wpDz = e.waypoint.z - e.z;
      const wpDist = Math.sqrt(wpDx*wpDx + wpDz*wpDz);

      if (e.wpTimer <= 0 || (wpDist < 1.2 && nextState !== 'hunt')) {
        // Nuevo waypoint — con leash de home si wander
        const wr = sp.wpRadius;
        const r  = wr[0] + Math.random() * (wr[1] - wr[0]);
        let ang  = Math.random() * Math.PI * 2;

        if (nextState === 'wander') {
          const hdx   = e.spawnX - e.x, hdz = e.spawnZ - e.z;
          const hDist = Math.sqrt(hdx*hdx + hdz*hdz);
          const homeR = cfg.homeRadius ?? 25;
          if (hDist > homeR) {
            // Forzar retorno al home
            ang = Math.atan2(hdz, hdx) + (Math.random() - 0.5) * 0.8;
          }
        }

        e.waypoint.x = e.x + Math.cos(ang) * r;
        e.waypoint.z = e.z + Math.sin(ang) * r;
        const ts = sp.timer;
        e.wpTimer = ts[0] + Math.random() * (ts[1] - ts[0]);
      }

      // Drift hacia waypoint
      const wl   = Math.sqrt(wpDx*wpDx + wpDz*wpDz) || 1;
      const drift = sp.speed;
      const driftX = (wpDx / wl) * drift;
      const driftZ = (wpDz / wl) * drift;

      // Ruido browniano
      const sig    = sp.sigma * Math.sqrt(dt);
      const noiseX = gaussian() * sig;
      const noiseZ = gaussian() * sig;

      // Cap de velocidad
      let tvx = driftX + noiseX, tvz = driftZ + noiseZ;
      const spd = Math.sqrt(tvx*tvx + tvz*tvz);
      if (spd > sp.speed * 1.5) { tvx = tvx/spd*sp.speed*1.5; tvz = tvz/spd*sp.speed*1.5; }

      // Suavizado exponencial
      const tau   = cfg.tau?.[sKey] ?? 0.35;
      const alpha = 1 - Math.exp(-dt / tau);
      e.vx += (tvx - e.vx) * alpha;
      e.vz += (tvz - e.vz) * alpha;

      // Mover
      e.x += e.vx * dt;
      e.z += e.vz * dt;
      e.speed  = Math.sqrt(e.vx*e.vx + e.vz*e.vz);
      e.moving = e.speed > 0.15;

      // Group position (para frustum culling)
      e.group.position.set(e.x, 0, e.z);

      cfg.renderer.update(e.group, e.rendState, e, dt);
    }
  }
}
