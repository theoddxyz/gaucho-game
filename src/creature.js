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

// ─── PRNG determinístico (mulberry32) ─────────────────────────────────────────
// Todos los clientes en la misma sala usan la misma seed → misma simulación.
let _rngState = 12345;
function _rng() {
  _rngState |= 0;
  _rngState = (_rngState + 0x6D2B79F5) | 0;
  let t = Math.imul(_rngState ^ (_rngState >>> 15), 1 | _rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function setCreatureSeed(seed) { _rngState = ((seed | 0) || 12345); }

// ─── Utilidades matemáticas compartidas ──────────────────────────────────────
export function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = _rng();
  while (v === 0) v = _rng();
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

      // Ojos — pupila vertical (ojito de serpiente)
      if (baseR >= 0.05) {
        const eyeR     = HEAD_R * 0.28;
        const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const pupilMat = new THREE.MeshStandardMaterial({ color: eyeColor });
        for (const sx of [-1, 1]) {
          const eye = new THREE.Mesh(new THREE.SphereGeometry(eyeR, 8, 6), eyeWhite);
          eye.scale.set(0.9, 1.25, 0.65); // óvalo vertical
          // pupila: ranura delgada vertical
          const pupil = new THREE.Mesh(new THREE.BoxGeometry(eyeR*0.28, eyeR*1.0, eyeR*0.35), pupilMat);
          pupil.position.set(0, 0, eyeR * 0.6);
          eye.add(pupil);
          eye.position.set(sx * HEAD_R * 0.50, HEAD_R * 0.30, HEAD_R * 0.82);
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

      const rendState = { segs, tube, head, curve, walkT: _rng() * 10, hitboxes };
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
          const tSin = Math.sin(t * Math.PI);
          const amp  = tSin * baseR * 0.55;
          // Mínimo: asegurar que el tubo no clip con el suelo (radio efectivo = baseR*(1+tSin))
          const minY = baseR * (1.05 + tSin);
          curr.y = Math.max(minY, baseR * 1.0 + amp * Math.sin(wt * 3.5 - i * 0.55));
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

// ─── Armadillo Renderer ───────────────────────────────────────────────────────
// Un armadillo con cuerpo elipsoidal, bandas de caparazón, 4 patas y cabeza alargada.
export function armadilloRenderer({ scale = 1.0, bodyColor = 0xa08060, shellColor = 0x6b5230 } = {}) {
  const S  = scale;
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });

  return {
    build(entityIdx, scene, spawnX, spawnZ) {
      const group  = new THREE.Group();
      group.position.set(spawnX, 0, spawnZ);
      const visual = new THREE.Group();
      group.add(visual);

      const bodyMat  = new THREE.MeshStandardMaterial({ color: bodyColor,  roughness: 0.85 });
      const shellMat = new THREE.MeshStandardMaterial({ color: shellColor, roughness: 0.70 });

      // Cuerpo principal (elipsoide)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.28*S, 12, 8), bodyMat);
      body.scale.set(1.55, 0.72, 1.0);
      body.position.y = 0.24*S;
      body.castShadow = true;
      visual.add(body);

      // Domo del caparazón encima del cuerpo
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.30*S, 12, 6, 0, Math.PI*2, 0, Math.PI*0.55), shellMat);
      dome.scale.set(1.45, 0.9, 1.0);
      dome.position.y = 0.30*S;
      dome.castShadow = true;
      visual.add(dome);

      // Bandas del caparazón (3 cajas delgadas)
      for (let i = 0; i < 3; i++) {
        const t    = (i + 1) / 4;
        const xPos = (-0.20 + t * 0.40) * S;
        const hw   = (0.28 - Math.abs(t - 0.5) * 0.06) * S;
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.07*S, 0.13*S, hw * 2), shellMat);
        band.position.set(xPos, 0.38*S, 0);
        visual.add(band);
      }

      // Cabeza (esfera pequeña aplastada)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13*S, 8, 6), bodyMat);
      head.scale.set(1.3, 0.75, 0.85);
      head.position.set(0.38*S, 0.26*S, 0);
      head.castShadow = true;
      visual.add(head);

      // Hocico alargado
      const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.035*S, 0.05*S, 0.18*S, 6), bodyMat);
      snout.rotation.z = -Math.PI / 2;
      snout.position.set(0.52*S, 0.24*S, 0);
      visual.add(snout);

      // Orejas
      for (const sy of [-1, 1]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.038*S, 0.09*S, 5), bodyMat);
        ear.position.set(0.30*S, 0.40*S, sy * 0.09*S);
        visual.add(ear);
      }

      // 4 patas
      const legGeo = new THREE.CylinderGeometry(0.042*S, 0.036*S, 0.20*S, 5);
      const legOffsets = [[0.18,0.18],[0.18,-0.18],[-0.18,0.18],[-0.18,-0.18]];
      const legMeshes = legOffsets.map(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, bodyMat);
        leg.position.set(lx*S, 0.13*S, lz*S);
        leg.castShadow = true;
        visual.add(leg);
        return leg;
      });

      // Cola
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.02*S, 0.01*S, 0.22*S, 5), bodyMat);
      tail.rotation.z = Math.PI / 2.3;
      tail.position.set(-0.34*S, 0.33*S, 0);
      visual.add(tail);

      // Hitbox (esfera única sobre el cuerpo)
      const hitbox = new THREE.Mesh(new THREE.SphereGeometry(0.32*S, 6, 6), hitMat);
      hitbox.userData.creatureEntityIdx = entityIdx;
      hitbox.position.y = 0.26*S;
      group.add(hitbox);

      const rendState = { visual, legMeshes, walkT: _rng() * 10, hitboxes: [hitbox] };
      scene.add(group);
      return { group, hitboxes: [hitbox], rendState };
    },

    update(group, rendState, entity, dt) {
      const { visual, legMeshes } = rendState;
      rendState.walkT += dt * (entity.moving ? Math.min(entity.speed, 5) * 1.8 + 0.5 : 0.4);
      const wt = rendState.walkT;

      if (entity.dead) {
        visual.rotation.z = THREE.MathUtils.lerp(visual.rotation.z, Math.PI * 0.45, dt * 3);
        visual.position.y = THREE.MathUtils.lerp(visual.position.y || 0, -0.05, dt * 2);
        return;
      }

      // Orientar hacia el movimiento (modelo face +X → atan2(-vz, vx))
      if (entity.moving) {
        const targetRY = Math.atan2(-entity.vz, entity.vx);
        let diff = targetRY - visual.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        visual.rotation.y += diff * Math.min(1, dt * 7);
      }

      // Bob y balanceo del cuerpo al caminar
      visual.position.y = entity.moving ? Math.abs(Math.sin(wt * 4.5)) * 0.035 : 0;
      visual.rotation.x = entity.moving ? Math.sin(wt * 4.5) * 0.05 : 0;
      visual.rotation.z = entity.moving ? Math.cos(wt * 3.5) * 0.03 : 0;

      // Patas (pares diagonales)
      if (legMeshes.length >= 4) {
        const swing = entity.moving ? 0.45 : 0;
        legMeshes[0].rotation.x =  Math.sin(wt * 4.5) * swing;
        legMeshes[3].rotation.x =  Math.sin(wt * 4.5) * swing;
        legMeshes[1].rotation.x = -Math.sin(wt * 4.5) * swing;
        legMeshes[2].rotation.x = -Math.sin(wt * 4.5) * swing;
      }
    },

    removeVisuals(scene, group) {
      scene.remove(group);
    },
  };
}

// ─── Condor Renderer ─────────────────────────────────────────────────────────
// Gran ave rapaz. Planea a gran altura, desciende hacia cadáveres.
export function condorRenderer({ scale = 1.0 } = {}) {
  const S       = scale;
  const hitMat  = new THREE.MeshBasicMaterial({ visible: false });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.80 });
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.85, side: THREE.DoubleSide });
  const tipMat  = new THREE.MeshStandardMaterial({ color: 0xd4c8a0, roughness: 0.85, side: THREE.DoubleSide });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xcc3322, roughness: 0.75 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0xc8a800, roughness: 0.6 });

  return {
    build(entityIdx, scene, spawnX, spawnZ) {
      const group  = new THREE.Group();
      group.position.set(spawnX, 0, spawnZ); // Y se setea en update via entity.y
      const visual = new THREE.Group();
      group.add(visual);

      // Cuerpo
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.90*S, 0.22*S, 0.28*S), bodyMat);
      body.position.y = 0;
      body.castShadow = true;
      visual.add(body);

      // Cuello blanco (collar)
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.10*S, 0.12*S, 0.12*S, 8), tipMat);
      collar.position.set(0.38*S, 0.08*S, 0);
      visual.add(collar);

      // Cabeza roja
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13*S, 8, 6), headMat);
      head.scale.set(1.1, 0.85, 0.85);
      head.position.set(0.52*S, 0.12*S, 0);
      head.castShadow = true;
      visual.add(head);

      // Pico
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04*S, 0.16*S, 5), beakMat);
      beak.rotation.z = -Math.PI / 2;
      beak.position.set(0.66*S, 0.08*S, 0);
      visual.add(beak);

      // Alas — dos grupos (izq/der) para animación
      const makeWing = (side) => {
        const wingGroup = new THREE.Group();

        // Ala principal (grande, oscura)
        const mainWing = new THREE.Mesh(new THREE.BoxGeometry(1.10*S, 0.04*S, 0.55*S), wingMat);
        mainWing.position.set(0, 0, side * 0.80*S);
        wingGroup.add(mainWing);

        // Punta del ala (más clara — parche blanco)
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.35*S, 0.035*S, 0.22*S), tipMat);
        tip.position.set(-0.35*S, 0, side * 1.38*S);
        wingGroup.add(tip);

        // Plumas primarias (4 rectángulos colgantes)
        for (let f = 0; f < 4; f++) {
          const feather = new THREE.Mesh(new THREE.BoxGeometry(0.08*S, 0.03*S, 0.18*S), wingMat);
          feather.position.set(-0.25*S + f * (-0.10*S), -0.04*S, side * (1.52 + f * 0.09)*S);
          wingGroup.add(feather);
        }

        visual.add(wingGroup);
        return wingGroup;
      };

      const wingL = makeWing(-1);
      const wingR = makeWing( 1);

      // Cola
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.35*S, 0.04*S, 0.30*S), wingMat);
      tail.position.set(-0.52*S, 0, 0);
      visual.add(tail);

      // Hitbox grande (cubre envergadura completa)
      const hitbox = new THREE.Mesh(new THREE.SphereGeometry(1.0*S, 6, 6), hitMat);
      hitbox.userData.creatureEntityIdx = entityIdx;
      hitbox.position.set(0, 0, 0);
      group.add(hitbox);

      const rendState = { visual, wingL, wingR, walkT: _rng() * 10, hitboxes: [hitbox] };
      scene.add(group);
      return { group, hitboxes: [hitbox], rendState };
    },

    update(group, rendState, entity, dt) {
      const { visual, wingL, wingR } = rendState;
      rendState.walkT += dt;
      const wt = rendState.walkT;

      const altitude = entity.y ?? 0;
      const soarH    = 10; // referencia
      const soaring  = altitude > 2;

      if (entity.dead) {
        // Caída en espiral
        visual.rotation.z += dt * 2.5;
        visual.rotation.x += dt * 1.0;
        return;
      }

      // Orientar hacia el movimiento (modelo face +X → atan2(-vz, vx))
      if (entity.moving) {
        const targetRY = Math.atan2(-entity.vz, entity.vx);
        let diff = targetRY - visual.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        visual.rotation.y += diff * Math.min(1, dt * 4);
      }

      if (soaring) {
        // Planeo — alas extendidas, balanceo lento
        const flapSpeed = 0.6 + (1 - altitude / soarH) * 1.5; // más rápido al descender
        const flapAmp   = 0.18 + (1 - Math.min(1, altitude / soarH)) * 0.25;
        wingL.rotation.x =  Math.sin(wt * flapSpeed) * flapAmp;
        wingR.rotation.x = -Math.sin(wt * flapSpeed) * flapAmp;
        visual.rotation.z = Math.sin(wt * 0.4) * 0.08; // balanceo suave
        visual.rotation.x = -0.08; // inclinación de planeo
      } else {
        // Aterrizando / en tierra — aleteo más fuerte
        wingL.rotation.x =  Math.sin(wt * 3.5) * 0.55;
        wingR.rotation.x = -Math.sin(wt * 3.5) * 0.55;
        visual.rotation.z = Math.sin(wt * 2) * 0.05;
        visual.rotation.x = 0;
      }
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
    this._scene       = scene;
    this._config      = config;
    this._spawns      = spawnPoints;
    this._entities    = [];
    this._loot        = [];
    this._parts       = [];
    this._acc         = 0;        // acumulador para timestep fijo
    this._lastContext = {};

    for (let i = 0; i < config.count; i++) this._spawnEntity(i);
  }

  // ── Spawn / respawn ────────────────────────────────────────────────────────
  _spawnEntity(i) {
    const cfg   = this._config;
    const spawn = this._spawns[i % this._spawns.length];
    const sx    = spawn.x + (_rng() - 0.5) * 6;
    const sz    = spawn.z + (_rng() - 0.5) * 6;

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
      wpTimer:    _rng() * 3,
      panicTimer: 0,
      dead: false,
      removeTimer: 0,
      // Visuals — lazy: solo se crean cuando el jugador está cerca
      group: null, hitboxes: [], rendState: null, active: false,
    };

    if (this._entities[i]) {
      const old = this._entities[i];
      if (old.active && old.group) {
        cfg.renderer.removeVisuals(this._scene, old.group);
        old.group = null; old.hitboxes = []; old.rendState = null; old.active = false;
      }
      this._entities[i] = e;
    } else {
      this._entities.push(e);
    }
    return e;
  }

  _activateEntity(e) {
    if (e.active || e.dead) return;
    const { group, hitboxes, rendState } = this._config.renderer.build(e.idx, this._scene, e.x, e.z);
    e.group = group; e.hitboxes = hitboxes; e.rendState = rendState; e.active = true;
    group.position.set(e.x, e.y ?? 0, e.z);
  }

  _deactivateEntity(e) {
    if (!e.active || !e.group) return;
    this._config.renderer.removeVisuals(this._scene, e.group);
    e.group = null; e.hitboxes = []; e.rendState = null; e.active = false;
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
  // isLocal=true → el jugador local disparó (genera loot, impulso)
  // isLocal=false → evento remoto (solo aplica daño/muerte, sin loot)
  hit(entityIdx, hitPoint, bulletDir, isLocal = true) {
    const e = this._entities[entityIdx];
    if (!e || e.dead) return;
    e.hp -= 1;

    // Impulso en la dirección del disparo (solo local)
    if (isLocal && bulletDir) {
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
      for (const hb of e.hitboxes) hb.userData.creatureEntityIdx = -1;
      if (isLocal) this._spawnLoot(e, hitPoint);
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
      const ox = (_rng() - 0.5) * 2;
      const oz = (_rng() - 0.5) * 2;
      mesh.position.set(e.x + ox, 0.3, e.z + oz);
      mesh.castShadow = true;
      this._scene.add(mesh);
      this._loot.push({ mesh, t: 0, baseY: 0.3, bobPhase: _rng()*Math.PI*2, def, life: 120 });
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

  // ── Paso de simulación determinístico (timestep fijo) ────────────────────
  _step(dt, context) {
    const cfg       = this._config;
    const playerPos = context?.playerPos;

    for (const e of this._entities) {
      if (e.dead) {
        e.removeTimer -= dt;
        if (e.removeTimer <= 0) {
          // _spawnEntity handles deactivation of old visuals
          this._spawnEntity(e.idx);
        }
        continue;
      }

      let nextState = e.state;
      if (e.panicTimer > 0) {
        e.panicTimer -= dt;
        if (e.panicTimer <= 0 && nextState === 'flee') nextState = 'wander';
      }

      const _threats = [];
      // Usar TODOS los jugadores (local + remotos, ya ordenados por ID desde main.js)
      const _players = context?.allPlayerPositions ?? (playerPos ? [playerPos] : []);
      for (const p of _players) _threats.push(p);
      if (context?.predatorPositions) for (const p of context.predatorPositions) _threats.push(p);

      for (const threat of _threats) {
        const dx = e.x - threat.x, dz = e.z - threat.z;
        const d2 = dx*dx + dz*dz;
        const fr = cfg.fleeRadius ?? 4;
        if (d2 < fr * fr) {
          nextState = 'flee';
          e.panicTimer = 4.0;
          const d  = Math.sqrt(d2) || 1;
          const wr = cfg.states?.flee?.wpRadius ?? [15, 30];
          const r  = wr[0] + _rng() * (wr[1] - wr[0]);
          e.waypoint.x = e.x + (dx/d) * r;
          e.waypoint.z = e.z + (dz/d) * r;
          const ts = cfg.states?.flee?.timer ?? [3, 6];
          e.wpTimer = ts[0] + _rng() * (ts[1] - ts[0]);
          break;
        }
      }

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
            e.wpTimer = ts[0] + _rng() * (ts[1] - ts[0]);
          }
        }
      }

      e.state = nextState;

      const sKey = nextState === 'flee' ? 'flee' : nextState === 'hunt' ? 'hunt' : 'wander';
      const sp   = cfg.states?.[sKey] ?? cfg.states?.wander ?? { sigma: 1.5, speed: 1.0, wpRadius: [5, 15], timer: [3, 8] };

      e.wpTimer -= dt;
      const wpDx   = e.waypoint.x - e.x, wpDz = e.waypoint.z - e.z;
      const wpDist = Math.sqrt(wpDx*wpDx + wpDz*wpDz);

      if (e.wpTimer <= 0 || (wpDist < 1.2 && nextState !== 'hunt')) {
        const wr = sp.wpRadius;
        const r  = wr[0] + _rng() * (wr[1] - wr[0]);
        let ang  = _rng() * Math.PI * 2;
        if (nextState === 'wander') {
          const hdx = e.spawnX - e.x, hdz = e.spawnZ - e.z;
          if (Math.sqrt(hdx*hdx + hdz*hdz) > (cfg.homeRadius ?? 25))
            ang = Math.atan2(hdz, hdx) + (_rng() - 0.5) * 0.8;
        }
        e.waypoint.x = e.x + Math.cos(ang) * r;
        e.waypoint.z = e.z + Math.sin(ang) * r;
        const ts = sp.timer;
        e.wpTimer = ts[0] + _rng() * (ts[1] - ts[0]);
      }

      const wl     = Math.sqrt(wpDx*wpDx + wpDz*wpDz) || 1;
      const driftX = (wpDx / wl) * sp.speed;
      const driftZ = (wpDz / wl) * sp.speed;
      const sig    = sp.sigma * Math.sqrt(dt);
      const noiseX = gaussian() * sig;
      const noiseZ = gaussian() * sig;
      let tvx = driftX + noiseX, tvz = driftZ + noiseZ;
      const spd = Math.sqrt(tvx*tvx + tvz*tvz);
      if (spd > sp.speed * 1.5) { tvx = tvx/spd*sp.speed*1.5; tvz = tvz/spd*sp.speed*1.5; }

      const tau   = cfg.tau?.[sKey] ?? 0.35;
      const alpha = 1 - Math.exp(-dt / tau);
      e.vx += (tvx - e.vx) * alpha;
      e.vz += (tvz - e.vz) * alpha;
      e.x  += e.vx * dt;
      e.z  += e.vz * dt;
      e.speed  = Math.sqrt(e.vx*e.vx + e.vz*e.vz);
      e.moving = e.speed > 0.15;

      if (cfg.soarHeight !== undefined) {
        if (e.y === undefined) e.y = cfg.soarHeight;
        const wd = Math.sqrt((e.waypoint.x-e.x)**2 + (e.waypoint.z-e.z)**2);
        e.targetY = (nextState === 'hunt' && wd < 18)
          ? Math.max(0.4, wd * 0.04) : cfg.soarHeight;
        e.y += ((e.targetY ?? cfg.soarHeight) - e.y) * Math.min(1, dt * (cfg.ySpeed ?? 2.5));
      }
    }
  }

  // ── Update principal (llamar cada frame desde main.js) ────────────────────
  // context: { playerPos: {x,z}, preyPositions: [{x,z}] }
  update(realDt, context) {
    this._lastContext = context;

    // Simulación a timestep fijo (determinístico, sincronizado entre clientes)
    const FIXED = 1 / 60;
    this._acc += realDt;
    while (this._acc >= FIXED) {
      this._step(FIXED, context);
      this._acc -= FIXED;
    }

    // Actualización visual a frame rate real — solo entidades dentro del radio activo
    tickFlyingParts(this._scene, this._parts, realDt);
    const _pPos    = context?.playerPos;
    const _ar2     = (this._config.activeRadius ?? 280) ** 2;
    for (const e of this._entities) {
      const _d2 = _pPos ? (e.x - _pPos.x)**2 + (e.z - _pPos.z)**2 : 0;
      if (e.dead) {
        // Mantener animación de muerte si ya está activo
        if (e.active && e.group) {
          e.group.position.set(e.x, e.y ?? 0, e.z);
          this._config.renderer.update(e.group, e.rendState, e, realDt);
        }
        continue;
      }
      if (_d2 <= _ar2) {
        if (!e.active) this._activateEntity(e);
        if (e.group) {
          e.group.position.set(e.x, e.y ?? 0, e.z);
          this._config.renderer.update(e.group, e.rendState, e, realDt);
        }
      } else if (e.active) {
        this._deactivateEntity(e);
      }
    }
  }

  // Avance rápido para jugadores que se unen tarde (consume la misma secuencia RNG)
  fastForward(ticks, context = {}) {
    for (let i = 0; i < ticks; i++) this._step(1 / 60, context);
  }

  // Aplicar posiciones del servidor (modo server-authoritative)
  applyServerSync(syncArr) {
    const cfg = this._config;
    for (const ed of syncArr) {
      const e = this._entities[ed.idx];
      if (!e) continue;
      if (ed.dead) {
        if (!e.dead) {
          e.dead = true; e.state = 'dead';
          e.removeTimer = cfg.respawnDelay ?? 60;
          for (const hb of e.hitboxes) hb.userData.creatureEntityIdx = -1;
        }
      } else {
        if (e.dead) {
          // Server respawned — reset locally
          this._spawnEntity(ed.idx);
          const ne = this._entities[ed.idx];
          ne.x = ed.x; ne.z = ed.z;
        } else {
          e.x = ed.x; e.z = ed.z;
          if (ed.vx !== undefined) e.vx = ed.vx;
          if (ed.vz !== undefined) e.vz = ed.vz;
          if (ed.state) e.state = ed.state;
          if (ed.y !== undefined) e.y = ed.y;
          e.speed  = Math.sqrt(e.vx*e.vx + e.vz*e.vz);
          e.moving = e.speed > 0.15;
        }
      }
    }
  }

  // Render-only update: no AI, only visuals (use after applyServerSync)
  renderOnly(realDt, playerPos) {
    tickFlyingParts(this._scene, this._parts, realDt);
    const _pPos = playerPos;
    const _ar2  = (this._config.activeRadius ?? 280) ** 2;
    for (const e of this._entities) {
      const _d2 = _pPos ? (e.x - _pPos.x)**2 + (e.z - _pPos.z)**2 : 0;
      if (e.dead) {
        if (e.active && e.group) {
          e.group.position.set(e.x, e.y ?? 0, e.z);
          this._config.renderer.update(e.group, e.rendState, e, realDt);
        }
        continue;
      }
      if (_d2 <= _ar2) {
        if (!e.active) this._activateEntity(e);
        if (e.group) {
          e.group.position.set(e.x, e.y ?? 0, e.z);
          this._config.renderer.update(e.group, e.rendState, e, realDt);
        }
      } else if (e.active) {
        this._deactivateEntity(e);
      }
    }
  }
}
