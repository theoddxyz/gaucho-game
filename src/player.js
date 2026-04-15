// --- Player rendering (remote + local players) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
let playerTemplate    = null;
let botTemplate       = null;
let horseRideTemplate = null;
let shootWalkTemplate = null;
let tranquiTemplate   = null;
let hurtTemplate      = null;

function loadTemplate(isBot = false) {
  if (isBot) {
    if (botTemplate) return botTemplate;
    botTemplate = new Promise(resolve =>
      loader.load('/models/bot.glb', g => resolve(g.scene), undefined, () => resolve(null))
    );
    return botTemplate;
  }
  if (playerTemplate) return playerTemplate;
  playerTemplate = new Promise((resolve) => {
    loader.load('/models/WALKINGPEROBIEN.glb', (gltf) => resolve(gltf), undefined, () => resolve(null));
  });
  return playerTemplate;
}

function loadHorseRideTemplate() {
  if (horseRideTemplate) return horseRideTemplate;
  horseRideTemplate = new Promise((resolve) => {
    loader.load('/models/ANDARACABALLO2.glb', (gltf) => resolve(gltf),
      undefined, () => {
        loader.load('/models/ANDANDOACABALLOPEROGLB.glb', (g) => resolve(g), undefined, () => resolve(null));
      });
  });
  return horseRideTemplate;
}

function loadShootWalkTemplate() {
  if (shootWalkTemplate) return shootWalkTemplate;
  shootWalkTemplate = new Promise((resolve) => {
    loader.load('/models/CAMINANDOALOSTIROSPEROGLB.glb', (gltf) => resolve(gltf), undefined, () => resolve(null));
  });
  return shootWalkTemplate;
}

function loadTranquiTemplate() {
  if (tranquiTemplate) return tranquiTemplate;
  tranquiTemplate = new Promise((resolve) => {
    loader.load('/models/TRANQUIGLB.glb', (gltf) => resolve(gltf), undefined, () => resolve(null));
  });
  return tranquiTemplate;
}

function loadHurtTemplate() {
  if (hurtTemplate) return hurtTemplate;
  hurtTemplate = new Promise((resolve) => {
    loader.load('/models/HERIDOGLB.glb', (gltf) => resolve(gltf), undefined, () => resolve(null));
  });
  return hurtTemplate;
}

function buildFallbackModel(color) {
  const group = new THREE.Group();
  const c = new THREE.Color(color);
  const bodyMat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 });
  const skinMat = new THREE.MeshStandardMaterial({ color: c.clone().lerp(new THREE.Color(0xffffff), 0.3), roughness: 0.85 });
  const darkMat = new THREE.MeshStandardMaterial({ color: c.clone().lerp(new THREE.Color(0x000000), 0.25), roughness: 0.9 });

  // Torso
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.10, 0.50), bodyMat);
  body.position.set(0, 0.62, 0);
  body.name = 'body';
  body.castShadow = true;

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.46), skinMat);
  head.position.set(0, 1.44, 0);
  head.name = 'head';
  head.castShadow = true;

  // Arms (left / right)
  const armGeo = new THREE.BoxGeometry(0.22, 0.85, 0.22);
  const leftArm = new THREE.Mesh(armGeo, bodyMat.clone());
  leftArm.position.set(-0.50, 0.58, 0);
  leftArm.castShadow = true;
  const rightArm = new THREE.Mesh(armGeo, bodyMat.clone());
  rightArm.position.set(0.50, 0.58, 0);
  rightArm.castShadow = true;

  // Legs (left / right)
  const legGeo = new THREE.BoxGeometry(0.26, 0.78, 0.26);
  const leftLeg = new THREE.Mesh(legGeo, darkMat.clone());
  leftLeg.position.set(-0.19, -0.22, 0);
  leftLeg.name = 'leg_left';
  leftLeg.castShadow = true;
  const rightLeg = new THREE.Mesh(legGeo, darkMat.clone());
  rightLeg.position.set(0.19, -0.22, 0);
  rightLeg.name = 'leg_right';
  rightLeg.castShadow = true;

  group.add(body, head, leftArm, rightArm, leftLeg, rightLeg);
  group._hitboxes  = [body, head];
  group._headMesh  = head;
  group._legMeshes = [leftLeg, rightLeg];
  return group;
}

/**
 * Modelo procedural "indio hacker" para bots enemigos.
 * Estética nativa + pintura de guerra en tonos tecnológicos.
 */
function buildBotModel() {
  const grp = new THREE.Group();

  const mk = (w, h, d, col, x, y, z) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 })
    );
    m.position.set(x, y, z);
    m.castShadow = true;
    grp.add(m);
    return m;
  };

  // Piel oscura / tonos tierra
  const SKIN  = 0x6B3A1F;
  const CLOTH = 0x2A1A08;   // tela oscura / cuero
  const PAINT = 0xCC2200;   // pintura de guerra roja
  const TECH  = 0x004488;   // acento hacker azul
  const BONE  = 0xD4C090;   // huesos / collares

  // Torso
  const body = mk(0.80, 1.10, 0.50, CLOTH, 0, 0.55, 0);
  body.name = 'body';
  // Detalles de tela en el pecho
  mk(0.78, 0.12, 0.52, TECH,  0, 0.88, 0.01);  // banda tecnológica
  mk(0.78, 0.12, 0.52, PAINT, 0, 0.72, 0.01);  // banda roja

  // Cabeza
  const head = mk(0.48, 0.46, 0.46, SKIN, 0, 1.43, 0);
  head.name = 'head';
  // Pintura de guerra — rayas rojas en la cara
  mk(0.50, 0.08, 0.10, PAINT, 0, 1.50,  0.24);
  mk(0.50, 0.08, 0.10, PAINT, 0, 1.36,  0.24);
  // Punto tecnológico (ojo cyberpunk)
  mk(0.10, 0.10, 0.05, TECH, -0.14, 1.46, 0.25);
  mk(0.10, 0.10, 0.05, TECH,  0.14, 1.46, 0.25);

  // Plumas del tocado — triángulos voxel
  for (let i = -2; i <= 2; i++) {
    const h2 = 0.20 + Math.abs(i) * 0.04;
    const col = i % 2 === 0 ? PAINT : BONE;
    mk(0.10, h2, 0.06, col, i * 0.10, 1.70 + h2 * 0.5, 0);
  }

  // Brazos
  mk(0.22, 0.90, 0.22, SKIN,  0.51, 0.60, 0);
  mk(0.22, 0.90, 0.22, SKIN, -0.51, 0.60, 0);
  // Pulseras bone en cada muñeca
  mk(0.24, 0.07, 0.24, BONE,  0.51, 0.15, 0);
  mk(0.24, 0.07, 0.24, BONE, -0.51, 0.15, 0);

  // Piernas (guardamos referencias para poder volarlas)
  const leftLeg  = mk(0.28, 0.80, 0.28, CLOTH,  0.20, -0.40, 0);
  const rightLeg = mk(0.28, 0.80, 0.28, CLOTH, -0.20, -0.40, 0);
  leftLeg.name  = 'leg_left';
  rightLeg.name = 'leg_right';
  // Mocasines
  mk(0.30, 0.10, 0.36, BONE,  0.20, -0.85, 0.04);
  mk(0.30, 0.10, 0.36, BONE, -0.20, -0.85, 0.04);

  // Collar de huesos
  mk(0.72, 0.10, 0.10, BONE, 0, 1.10, 0.26);

  grp._hitboxes  = [body, head];
  grp._headMesh  = head;
  grp._legMeshes = [leftLeg, rightLeg];
  return grp;
}

export class PlayerModel {
  constructor(scene, data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color || '#ff4444';
    this.hp = data.hp;
    this._isLocal = !!data.local;
    this.targetPos = new THREE.Vector3(data.x, data.y ?? 1.0, data.z);
    this.targetRY = data.ry || 0;
    this._hitboxes = [];

    this.group = new THREE.Group();
    this.group.position.set(data.x, 0, data.z);
    scene.add(this.group);

    // Proxy hitboxes — always-visible invisible meshes parented to this.group
    // (immune to _mainModel.visible=false, so PvP raycasting always works)
    // Player model is 2.8 units tall: legs 0-0.9, torso 0.9-2.0, head 2.0-2.6
    const _hbMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    this._proxyLegs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.5), _hbMat);
    this._proxyLegs.name = 'legs';
    this._proxyLegs.position.set(0, 0.45, 0);
    this._proxyBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.6), _hbMat);
    this._proxyBody.position.set(0, 1.45, 0);
    this._proxyHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.45), _hbMat);
    this._proxyHead.name = 'head';
    this._proxyHead.position.set(0, 2.25, 0);
    this.group.add(this._proxyLegs);
    this.group.add(this._proxyBody);
    this.group.add(this._proxyHead);
    this._proxyHitboxes = [this._proxyLegs, this._proxyBody, this._proxyHead];

    this._scene = scene;

    this._hat = null; // set only if GLB has a hat node
    this._hatFlying = false;
    this._hatVel = new THREE.Vector3();
    this._hatAngVel = new THREE.Vector3();

    // Impact physics
    this._headMesh      = null;
    this._legMeshes     = [];
    this._detachedParts = [];   // flying body parts
    this._staggerVel    = 0;    // spring-damper bodyshot stagger
    this._staggerPos    = 0;

    // Name label
    if (data.name) this._addNameLabel(data.name);

    this._gun = null;
    this._firepoint = null;
    this._gunRecoil  = 0;
    this._gunRestPos = null; // local position stored once gun is found
    this._hpBar  = null;
    this._maxHp  = 200;

    // Muerte / caída
    this._dying  = false;
    this._dyingT = 0;
    this._isBot  = !!data.isBot;

    // ── Walk animation state ──────────────────────────────────────────────────
    this._walkT         = 0;
    this._legPivots     = [];
    this._armPivots     = [];
    this._legMeshDirect = [];
    this._armMeshDirect = [];
    this._prevPos       = new THREE.Vector3();
    this._moveSpeed     = 0;
    // AnimationMixer (para WALKINGPEROBIEN.glb con esqueleto Mixamo)
    this._mixer           = null;
    this._walkAction      = null;
    this._horseAction     = null;
    this._shootWalkAction = null;
    this._horseRideModel  = null;
    this._horseRideMixer  = null;
    this._horseRideAction = null;
    this._horseSmokePoint = null;  // SMOKE_POINT del modelo de caballo
    this._shootMuzzle     = null;  // Empty "muzzle" del modelo de disparo
    this._smokePoint      = null;  // Empty "smoke_point" del modelo principal
    this._shootSmokePoint = null;  // Empty "smoke_point" del modelo de disparo
    // Animaciones idle/herido (a pie)
    this._tranquiModel    = null;
    this._tranquiMixer    = null;
    this._tranquiAction   = null;
    this._hurtModel       = null;
    this._hurtMixer       = null;
    this._hurtAction      = null;
    this._hunger          = 100;   // 0-100, actualizado desde main.js
    this._hp              = 200;   // 0-200, actualizado desde main.js
    this._hurtTimer       = 0;     // seconds remaining of forced hurt animation
    this._extSpeedFrac    = 0;     // fracción de velocidad real (0-1)
    this._walkSpd         = 0;
    this._rootBone        = null;
    this._isRiding        = false;
    this._wasRiding       = false;  // para detectar transición mount/dismount
    this._isAimingAnim    = false;
    // Movimiento controlado externamente (solo jugador local)
    this._extMoving       = false;  // hay teclas presionadas
    this._extBackward     = false;  // se mueve hacia atrás
    this._extSprinting    = false;  // shift sprint
    // Recoil de cuerpo al disparar
    this._bodyRecoilPos   = 0;
    this._bodyRecoilVel   = 0;
    // Smoke (cigarrillo) — posición desde Head bone
    this._headBone       = null;
    this._smokeParticles = [];
    this._smokeEmitAcc   = 0;

    // Helper: apply GLB template with material fix + node detection
    const _applyGLBTemplate = (gltfOrScene) => {
      const isFullGLTF = gltfOrScene.scene !== undefined;
      const clips      = isFullGLTF ? (gltfOrScene.animations || []) : [];
      const source     = isFullGLTF ? gltfOrScene.scene : gltfOrScene;

      // Escalar source UNA SOLA VEZ (flag _scaled evita re-escalar en llamadas posteriores)
      const TARGET_H = 2.8;
      if (!source._scaled) {
        source.updateWorldMatrix(true, true);
        const bbox = new THREE.Box3().setFromObject(source);
        const h = bbox.max.y - bbox.min.y;
        if (h > 0.01) {
          source.scale.setScalar(TARGET_H / h);
          source.updateWorldMatrix(true, true);
          const bb2 = new THREE.Box3().setFromObject(source);
          if (bb2.max.y - bb2.min.y > 0.1) source.position.y -= bb2.min.y;
        }
        source._scaled = true;
      }

      const model = SkeletonUtils.clone(source);
      model.visible = true;
      // First pass: make everything visible, replace materials, detect special nodes
      const gunNodes = [];
      model.traverse((obj) => {
        obj.visible = true;
        if (obj.isMesh) {
          obj.castShadow = true;
          const origColor = (obj.material?.color)
            ? obj.material.color.clone()
            : new THREE.Color(0x9a7a50);
          obj.material = new THREE.MeshStandardMaterial({
            color: origColor, roughness: 0.85, metalness: 0.0,
            transparent: false, opacity: 1.0, depthWrite: true, depthTest: true,
          });
          // Colorear torso con el color del jugador (nuevo modelo usa "torso" en vez de "body")
          if (obj.name === 'body' || obj.name === 'torso') obj.material.color.set(this.color);
        }
        const n = obj.name.toLowerCase().trim();
        if (n === 'gun' || n === 'weapon' || n === 'pistol' || n === 'rifle' || n === 'revolver') {
          this._gun = obj; this._gunRestPos = obj.position.clone();
          gunNodes.push(obj);
        }
        if (n.includes('hat') || n.includes('sombrero') || n.includes('cap')) { this._hat = obj; }
        if (n.includes('firepoint') || n.includes('fire_point') || n.includes('muzzle')) {
          this._firepoint = obj; obj.visible = false;
          if (obj.isMesh) { obj.castShadow = false; obj.receiveShadow = false; }
        }
        if (n === 'smoke_point') { this._smokePoint = obj; }
      });
      // Hide gun and all its children AFTER the visibility pass
      for (const gn of gunNodes) {
        gn.visible = false;
        gn.traverse(c => { c.visible = false; });
      }
      // ── Walk animation: collect limb mesh refs (direct rotation) ────────────
      // El origen del mesh 'leg left/right' está en la parte SUPERIOR de la pierna
      // (geo.max.y ≈ 0), así que rotation.x directo funciona como pivote de cadera.
      this._legPivots     = [];  // mantenido por compatibilidad
      this._armPivots     = [];
      this._legMeshDirect = [];
      this._armMeshDirect = [];
      const limbDirect = {
        'leg left':  { arr: this._legMeshDirect, phase: 0       },
        'leg right': { arr: this._legMeshDirect, phase: Math.PI },
        'arm right': { arr: this._armMeshDirect, phase: 0       },
        'arm left':  { arr: this._armMeshDirect, phase: Math.PI },
      };
      model.traverse((obj) => {
        if (!obj.isMesh) return;
        const key = obj.name.toLowerCase().trim();
        if (limbDirect[key]) {
          limbDirect[key].arr.push({ mesh: obj, phase: limbDirect[key].phase });
        }
      });
      // ── Collect hitboxes ────────────────────────────────────────────────────
      this._hitboxes = []; this._headMesh = null; this._legMeshes = [];
      model.traverse((obj) => {
        const isSkinned = obj.isSkinnedMesh;
        if (!obj.isMesh && !isSkinned) return;
        const n = obj.name.toLowerCase().trim();
        if (isSkinned) { obj.frustumCulled = false; }  // evita culling incorrecto
        if (n === 'body' || n === 'torso' || isSkinned) this._hitboxes.push(obj);
        if (n === 'head' || n.startsWith('head') || n === 'eyes') {
          this._hitboxes.push(obj); this._headMesh = obj;
        }
        if (n.includes('leg') || n.includes('pierna') || n.includes('thigh') || n.includes('shin')) {
          this._legMeshes.push(obj);
        }
      });
      // ── Head bone para posición del humo ────────────────────────────────────
      this._headBone = null;
      model.traverse((obj) => {
        if (obj.isBone && obj.name.toLowerCase().includes('head') &&
            !obj.name.toLowerCase().includes('top') && !this._headBone) {
          this._headBone = obj;
        }
      });

      // ── AnimationMixer ────────────────────────────────────────────────────────
      if (clips.length > 0) {
        this._mixer      = new THREE.AnimationMixer(model);
        this._walkAction = this._mixer.clipAction(clips[0]);
        this._walkAction.setLoop(THREE.LoopRepeat, Infinity);
        this._walkAction.play();
        this._walkAction.paused = true;

        // Cargar animación de caballo y agregarla al mismo mixer
        loadHorseRideTemplate().then((gltf) => {
          if (!gltf || !gltf.animations?.length) return;
          this._horseAction = this._mixer.clipAction(gltf.animations[0]);
          this._horseAction.setLoop(THREE.LoopRepeat, Infinity);
          this._horseAction.setEffectiveWeight(0);
          this._horseAction.play();
          this._horseAction.paused = true;
        });
        // Shoot-walk: solo se carga para el jugador LOCAL (ver bloque más abajo)
        // Los remotos no necesitan este modelo
      }
      return model;
    };

    // Local player: add placeholder IMMEDIATELY (synchronous), then swap to GLB when loaded
    if (data.local) {
      const placeholder = buildFallbackModel(this.color);
      this._hitboxes  = placeholder._hitboxes  || [];
      this._headMesh  = placeholder._headMesh  || null;
      this._legMeshes = placeholder._legMeshes || [];
      this.group.add(placeholder);

      loadTemplate(false).then((template) => {
        if (!template) return; // keep placeholder
        this.group.remove(placeholder);
        const model = _applyGLBTemplate(template);
        this._mainModel = model;
        this.group.add(model);

        // ── Modelo de disparo: construir SIN tocar this._mixer / this._walkAction ──
        loadShootWalkTemplate().then((gltf) => {
          if (!gltf || !gltf.animations?.length) return;
          const shootScene = gltf.scene;  // usamos la escena directamente (SkinnedMesh)

          // Hacer visible todo, arreglar materiales y detectar nodos especiales
          shootScene.traverse((obj) => {
            obj.visible = true;
            if (obj.isMesh || obj.isSkinnedMesh) {
              obj.castShadow    = true;
              obj.frustumCulled = false;
              const origColor = obj.material?.color ? obj.material.color.clone() : new THREE.Color(0x9a7a50);
              obj.material = new THREE.MeshStandardMaterial({ color: origColor, roughness: 0.85 });
            }
            const n = obj.name.toLowerCase().trim();
            if (n === 'muzzle') {
              this._shootMuzzle = obj;
              obj.visible = false; // invisible helper node
            }
            if (n === 'smoke_point') {
              // Smoke point del modelo de disparo — se usa cuando _isAimingAnim
              this._shootSmokePoint = obj;
            }
          });

          // Escalar a TARGET_H = 2.8 y alinear base a y=0
          shootScene.updateWorldMatrix(true, true);
          const bbox = new THREE.Box3().setFromObject(shootScene);
          const h = bbox.max.y - bbox.min.y;
          if (h > 0.01) {
            shootScene.scale.setScalar(2.8 / h);
            shootScene.updateWorldMatrix(true, true);
            const b2 = new THREE.Box3().setFromObject(shootScene);
            shootScene.position.y -= b2.min.y;
          }

          shootScene.visible = false;
          this.group.add(shootScene);
          this._shootWalkModel = shootScene;

          // Mixer PROPIO — no toca this._mixer ni this._walkAction
          this._shootWalkMixer  = new THREE.AnimationMixer(shootScene);
          this._shootWalkAction = this._shootWalkMixer.clipAction(gltf.animations[0]);
          this._shootWalkAction.setLoop(THREE.LoopRepeat, Infinity);
          this._shootWalkAction.play();
          this._shootWalkAction.paused = true;
        });

        // ── Modelo de caballo: mismo approach que shoot-walk ──────────────────
        loadHorseRideTemplate().then((gltf) => {
          if (!gltf || !gltf.animations?.length) return;
          const horseScene = gltf.scene;
          horseScene.traverse((obj) => {
            obj.visible = true;
            if (obj.isMesh || obj.isSkinnedMesh) {
              obj.castShadow = true; obj.frustumCulled = false;
              const origColor = obj.material?.color ? obj.material.color.clone() : new THREE.Color(0x9a7a50);
              obj.material = new THREE.MeshStandardMaterial({ color: origColor, roughness: 0.85 });
            }
            const hn = obj.name.toUpperCase().trim();
            if (hn === 'SMOKE_POINT' || hn === 'SMOKEPOINTT' || hn.includes('SMOKE')) {
              this._horseSmokePoint = obj;
            }
          });
          horseScene.updateWorldMatrix(true, true);
          const hbbox = new THREE.Box3().setFromObject(horseScene);
          const hh = hbbox.max.y - hbbox.min.y;
          if (hh > 0.01) {
            horseScene.scale.setScalar(2.8 / hh);
            horseScene.updateWorldMatrix(true, true);
            const hb2 = new THREE.Box3().setFromObject(horseScene);
            horseScene.position.y -= hb2.min.y;
          }
          horseScene.visible = false;
          this.group.add(horseScene);
          this._horseRideModel  = horseScene;
          this._horseRideMixer  = new THREE.AnimationMixer(horseScene);
          this._horseRideAction = this._horseRideMixer.clipAction(gltf.animations[0]);
          this._horseRideAction.setLoop(THREE.LoopRepeat, Infinity);
          this._horseRideAction.play();
        });

        // ── Modelo tranquilo (idle a pie, sano) ──────────────────────────────
        loadTranquiTemplate().then((gltf) => {
          if (!gltf || !gltf.animations?.length) return;
          const sc = gltf.scene;
          sc.traverse((obj) => {
            obj.visible = true;
            if (obj.isMesh || obj.isSkinnedMesh) {
              obj.castShadow = true; obj.frustumCulled = false;
              const origColor = obj.material?.color ? obj.material.color.clone() : new THREE.Color(0x9a7a50);
              obj.material = new THREE.MeshStandardMaterial({ color: origColor, roughness: 0.85 });
            }
          });
          sc.updateWorldMatrix(true, true);
          const bb = new THREE.Box3().setFromObject(sc);
          const hh = bb.max.y - bb.min.y;
          if (hh > 0.01) {
            sc.scale.setScalar(2.8 / hh);
            sc.updateWorldMatrix(true, true);
            const bb2 = new THREE.Box3().setFromObject(sc);
            sc.position.y -= bb2.min.y;
          }
          sc.visible = false;
          this.group.add(sc);
          this._tranquiModel  = sc;
          this._tranquiMixer  = new THREE.AnimationMixer(sc);
          this._tranquiAction = this._tranquiMixer.clipAction(gltf.animations[0]);
          this._tranquiAction.setLoop(THREE.LoopRepeat, Infinity);
          this._tranquiAction.play();
        });

        // ── Modelo herido (idle a pie, hambre ≤ 50) ──────────────────────────
        loadHurtTemplate().then((gltf) => {
          if (!gltf || !gltf.animations?.length) return;
          const sc = gltf.scene;
          sc.traverse((obj) => {
            obj.visible = true;
            if (obj.isMesh || obj.isSkinnedMesh) {
              obj.castShadow = true; obj.frustumCulled = false;
              const origColor = obj.material?.color ? obj.material.color.clone() : new THREE.Color(0x9a7a50);
              obj.material = new THREE.MeshStandardMaterial({ color: origColor, roughness: 0.85 });
            }
          });
          sc.updateWorldMatrix(true, true);
          const bb = new THREE.Box3().setFromObject(sc);
          const hh = bb.max.y - bb.min.y;
          if (hh > 0.01) {
            sc.scale.setScalar(2.8 / hh);
            sc.updateWorldMatrix(true, true);
            const bb2 = new THREE.Box3().setFromObject(sc);
            sc.position.y -= bb2.min.y;
          }
          sc.visible = false;
          this.group.add(sc);
          this._hurtModel  = sc;
          this._hurtMixer  = new THREE.AnimationMixer(sc);
          this._hurtAction = this._hurtMixer.clipAction(gltf.animations[0]);
          this._hurtAction.setLoop(THREE.LoopRepeat, Infinity);
          this._hurtAction.play();
        });
      });
      return;
    }

    // Remote players: load GLB async
    loadTemplate(!!data.isBot).then((template) => {
      let model;
      if (template) {
        model = _applyGLBTemplate(template);
      } else {
        model = this._isBot ? buildBotModel() : buildFallbackModel(this.color);
        this._hitboxes  = model._hitboxes  || [];
        this._headMesh  = model._headMesh  || null;
        this._legMeshes = model._legMeshes || [];
      }
      this._mainModel = model;
      this.group.add(model);
      // HP bar for bots
      if (this._isBot) this._buildHPBar();

      // Modelos extra para remotos (clonados, con mixer propio)
      if (!this._isBot) {
        // Helper: clonar, fix materials, agregar al group con mixer
        const _loadRemoteModel = (loadFn, assignModel, assignMixer, assignAction) => {
          loadFn().then((gltf) => {
            if (!gltf || !gltf.animations?.length) return;
            const clone = SkeletonUtils.clone(gltf.scene);
            clone.traverse((obj) => {
              obj.visible = true;
              if (obj.isMesh || obj.isSkinnedMesh) {
                obj.castShadow = true; obj.frustumCulled = false;
                const origColor = obj.material?.color ? obj.material.color.clone() : new THREE.Color(0x9a7a50);
                obj.material = new THREE.MeshStandardMaterial({ color: origColor, roughness: 0.85 });
              }
            });
            clone.visible = false;
            this.group.add(clone);
            this[assignModel] = clone;
            const mixer = new THREE.AnimationMixer(clone);
            this[assignMixer] = mixer;
            const action = mixer.clipAction(gltf.animations[0]);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
            if (assignAction) { this[assignAction] = action; action.paused = true; }
          });
        };

        _loadRemoteModel(loadShootWalkTemplate, '_shootWalkModel', '_shootWalkMixer', '_shootWalkAction');
        _loadRemoteModel(loadTranquiTemplate, '_tranquiModel', '_tranquiMixer', null);
        _loadRemoteModel(loadHurtTemplate, '_hurtModel', '_hurtMixer', '_hurtAction');
      }
    });
  }

  /**
   * Build a procedural cowboy hat from Two CylinderGeometry meshes.
   * Brim: CylinderGeometry(0.44, 0.46, 0.06, 12)
   * Crown: CylinderGeometry(0.20, 0.25, 0.38, 12) at y=0.22
   */
  _buildHat() {
    const hatGroup = new THREE.Group();
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x2d1a0a });

    const brimGeo = new THREE.CylinderGeometry(0.44, 0.46, 0.06, 12);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.castShadow = true;
    hatGroup.add(brim);

    const crownGeo = new THREE.CylinderGeometry(0.20, 0.25, 0.38, 12);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    crown.position.y = 0.22;
    crown.castShadow = true;
    hatGroup.add(crown);

    return hatGroup;
  }

  /**
   * Detach the hat from the player and launch it with physics.
   * If hat is already flying or gone, returns early.
   */
  detachHat() {
    if (this._hatFlying || !this._hat) return;

    // Save world position before reparenting
    const worldPos = this._hat.getWorldPosition(new THREE.Vector3());

    // Reparent to scene
    this.group.remove(this._hat);
    this._scene.add(this._hat);

    // Set world position
    this._hat.position.copy(worldPos);

    // Random launch velocity
    this._hatVel.set(
      (Math.random() - 0.5) * 10,
      5 + Math.random() * 5,
      (Math.random() - 0.5) * 10
    );

    // Random angular velocity
    this._hatAngVel.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    );

    this._hatFlying = true;
  }

  /**
   * Update hat physics each frame.
   */
  updateHat(dt) {
    // Gun recoil kick — push along local Z then spring back
    if (this._gun && this._gunRestPos) {
      this._gunRecoil = Math.max(0, this._gunRecoil - dt / 0.10);
      const kick = this._gunRecoil * 0.22;
      this._gun.position.set(
        this._gunRestPos.x,
        this._gunRestPos.y,
        this._gunRestPos.z + kick
      );
    }
    if (!this._hatFlying || !this._hat) return;

    // Gravity
    this._hatVel.y -= 18 * dt;

    // Move
    this._hat.position.addScaledVector(this._hatVel, dt);

    // Rotate
    this._hat.rotation.x += this._hatAngVel.x * dt;
    this._hat.rotation.y += this._hatAngVel.y * dt;
    this._hat.rotation.z += this._hatAngVel.z * dt;

    // Bounce on ground
    if (this._hat.position.y < 0.08) {
      this._hat.position.y = 0.08;
      this._hatVel.y *= -0.3;
      this._hatVel.x *= 0.6;
      this._hatVel.z *= 0.6;
      this._hatAngVel.multiplyScalar(0.4);

      // Come to rest if bounce is very small
      if (Math.abs(this._hatVel.y) < 0.3) {
        this._hatFlying = false;
        this._hatVel.set(0, 0, 0);
        this._hatAngVel.set(0, 0, 0);
      }
    }
  }

  /**
   * Respawn: remove flying hat from scene, create a fresh one on the player.
   */
  respawnHat() {
    if (this._hat && this._hatFlying) {
      this._scene.remove(this._hat);
    }
    this._hat = null;
    this._hatFlying = false;
    this._hatVel.set(0, 0, 0);
    this._hatAngVel.set(0, 0, 0);
  }

  _addNameLabel(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.roundRect(0, 10, 256, 44, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 128, 42);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
    sprite.scale.set(2, 0.5, 1);
    sprite.position.y = 2.2;
    this.group.add(sprite);
  }

  _buildHPBar() {
    const canvas = document.createElement('canvas');
    canvas.width  = 128;
    canvas.height = 18;
    this._hpBarCanvas = canvas;
    const tex     = new THREE.CanvasTexture(canvas);
    const sprite  = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sprite.scale.set(1.4, 0.20, 1);
    sprite.position.y = 2.6;
    this.group.add(sprite);
    this._hpBar    = sprite;
    this._hpBarTex = tex;
    this._drawHPBar(this.hp ?? 200);
  }

  _drawHPBar(hp) {
    if (!this._hpBarCanvas) return;
    const canvas = this._hpBarCanvas;
    const ctx    = canvas.getContext('2d');
    const ratio  = Math.max(0, Math.min(1, hp / this._maxHp));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.roundRect(0, 0, canvas.width, canvas.height, 4);
    ctx.fill();
    // HP fill
    const fillW = Math.round((canvas.width - 4) * ratio);
    const hue   = ratio * 120;  // red→green
    ctx.fillStyle = `hsl(${hue},90%,45%)`;
    ctx.roundRect(2, 2, fillW, canvas.height - 4, 3);
    ctx.fill();
    if (this._hpBarTex) this._hpBarTex.needsUpdate = true;
  }

  setHP(hp) {
    this.hp = hp;
    if (this._isBot) this._drawHPBar(hp);
  }

  /** Dispara la animación de caída (se queda en el suelo, no desaparece). */
  startDying() {
    if (this._dying) return;
    this._dying  = true;
    this._dyingT = 0;
  }

  update(dt) {
    // ── Flying body-part physics ─────────────────────────────────────────────
    for (let i = this._detachedParts.length - 1; i >= 0; i--) {
      const p = this._detachedParts[i];
      p.t += dt;
      if (p.t >= p.maxT) {
        this._scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this._detachedParts.splice(i, 1);
        continue;
      }
      // Gravity
      p.vel.y -= 20 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += p.angVel.x * dt;
      p.mesh.rotation.y += p.angVel.y * dt;
      p.mesh.rotation.z += p.angVel.z * dt;
      // Ground bounce
      if (p.mesh.position.y < 0.04) {
        p.mesh.position.y = 0.04;
        p.vel.y  *= -0.28;
        p.vel.x  *= 0.60;
        p.vel.z  *= 0.60;
        p.angVel.multiplyScalar(0.45);
      }
      // Fade out last 0.6 s
      if (p.t > p.maxT - 0.6) {
        p.mesh.material.opacity = Math.max(0, (p.maxT - p.t) / 0.6);
      }
    }

    // ── Spring-damper bodyshot stagger ───────────────────────────────────────
    if (Math.abs(this._staggerVel) > 0.001 || Math.abs(this._staggerPos) > 0.001) {
      const K = 32, D = 7;
      this._staggerVel -= this._staggerPos * K * dt;
      this._staggerVel *= (1 - D * dt);
      this._staggerPos += this._staggerVel * dt;
      if (!this._dying) this.group.rotation.z = this._staggerPos * 0.07;
      if (Math.abs(this._staggerPos) < 0.004 && Math.abs(this._staggerVel) < 0.004) {
        this._staggerVel = 0;
        this._staggerPos = 0;
        if (!this._dying) this.group.rotation.z = 0;
      }
    }

    if (this._dying) {
      this._dyingT += dt;
      // Caer de costado en ~0.6 s
      this.group.rotation.z = Math.min(Math.PI / 2, this._dyingT * 3.5);
      // Hundirse levemente en el suelo
      this.group.position.y = Math.max(-0.25, this.group.position.y - dt * 0.4);
      this.updateHat(dt);
      return;  // no seguir interpolando posición
    }
    // Jugador local: posición la setea main.js directo — no lerpeamos
    if (!this._isLocal) {
      this.group.position.lerp(this.targetPos, Math.min(1, 8 * dt));
      let diff = this.targetRY - this.group.rotation.y;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.group.rotation.y += diff * Math.min(1, 10 * dt);
    }
    this.updateHat(dt);

    // ── Walk animation ────────────────────────────────────────────────────────
    const moved = this.group.position.distanceTo(this._prevPos);
    this._moveSpeed = moved / Math.max(dt, 0.001);
    this._prevPos.copy(this.group.position);
    // Jugador local: usar estado de teclas (confiable). Remoto: usar distancia.
    const isMoving   = this._isLocal ? this._extMoving   : (this._moveSpeed > 0.08);
    const isBackward = this._isLocal ? this._extBackward : false;
    const isSprinting = this._isLocal ? this._extSprinting : false;
    // dt para el mixer: negativo si va para atrás, multiplicado si sprint
    const animSpeedMult = isSprinting ? 1.65 : 1.0;
    const animDt = isBackward ? -dt * animSpeedMult : dt * animSpeedMult;

    // ── walkSpd: local → velocidad real (ease-out natural); remoto → lerp ────
    if (this._isLocal) {
      // Seguir la velocidad física real: cuando el jugador suelta la tecla,
      // extSpeedFrac baja gradualmente junto con la física → animación desacelera sola
      const rawTarget = this._extMoving ? this._extSpeedFrac : 0;
      this._walkSpd += (rawTarget - this._walkSpd) * Math.min(1, 22 * dt);
    } else {
      const target = isMoving ? 1.0 : 0;
      this._walkSpd += (target - this._walkSpd) * Math.min(1, 14 * dt);
    }
    if (this._walkSpd < 0.03) this._walkSpd = 0;

    // ── Model swap ────────────────────────────────────────────────────────────
    if (this._hurtTimer > 0) this._hurtTimer -= dt;
    // Stun override: durante hurtTimer, SIEMPRE usar modelo HERIDO (prioridad máxima)
    const forceHurt      = this._hurtTimer > 0 && !!this._hurtModel;
    const useShootModel  = !forceHurt && this._isAimingAnim && !this._isRiding && !!this._shootWalkModel;
    const useHorseModel  = !forceHurt && this._isRiding && !!this._horseRideModel;
    const isIdleOnFoot   = this._walkSpd < 0.03 && !useShootModel && !useHorseModel;
    const isHurt         = forceHurt || this._hunger <= 50 || this._hp <= 100;
    const useHurtModel   = forceHurt || (isIdleOnFoot && isHurt && !!this._hurtModel);
    const useTranquiModel= isIdleOnFoot && !useHurtModel && !!this._tranquiModel;
    if (this._mainModel)      this._mainModel.visible      = !useShootModel && !useHorseModel && !useHurtModel && !useTranquiModel;
    if (this._shootWalkModel) this._shootWalkModel.visible =  useShootModel;
    if (this._horseRideModel) this._horseRideModel.visible =  useHorseModel;
    if (this._tranquiModel)   this._tranquiModel.visible   =  useTranquiModel;
    if (this._hurtModel)      this._hurtModel.visible      =  useHurtModel;

    // Compensar offset vertical de la animación HERIDO (root bone elevado en el GLB)
    if (this._hurtModel) {
      if (useHurtModel && !this._hurtYFixed) {
        this._hurtModel.updateWorldMatrix(true, true);
        const hbb = new THREE.Box3().setFromObject(this._hurtModel);
        const footY = hbb.min.y - this.group.position.y;
        if (footY > 0.15) this._hurtModel.position.y -= footY;
        this._hurtYFixed = true;
      }
      if (!useHurtModel) this._hurtYFixed = false;
    }

    // ── Mixer principal (walk) ────────────────────────────────────────────────
    if (this._mixer && !useHorseModel) {
      if (!useShootModel) {
        if (this._walkAction) { this._walkAction.paused = false; this._walkAction.setEffectiveWeight(1); }
        this._mixer.update(this._walkSpd > 0 ? animDt * this._walkSpd : 0);
      }
    }

    // ── Mixer caballo (modelo propio, sin retargeting) ────────────────────────
    if (this._horseRideMixer && useHorseModel) {
      this._horseRideMixer.update(dt);
    }

    // ── Mixers idle a pie ─────────────────────────────────────────────────────
    if (this._tranquiMixer && useTranquiModel) this._tranquiMixer.update(dt);
    if (this._hurtMixer    && useHurtModel)    this._hurtMixer.update(dt);

    // Mixer independiente del modelo de disparo (solo cuando está activo)
    if (this._shootWalkMixer && useShootModel) {
      if (this._walkSpd > 0) {
        if (this._shootWalkAction) this._shootWalkAction.paused = false;
        this._shootWalkMixer.update(animDt * this._walkSpd);
      } else {
        if (this._shootWalkAction) this._shootWalkAction.paused = true;
      }
    } else {
      // Fallback: rotación directa de meshes (player.glb sin esqueleto)
      const freq = 2.6, legAmp = 0.42, armAmp = 0.22;
      if (isMoving) this._walkT += dt * Math.min(this._moveSpeed, 8) * 1.6;
      for (const { mesh, phase } of this._legMeshDirect) {
        const t = isMoving ? Math.sin(this._walkT * freq + phase) * legAmp : 0;
        mesh.rotation.x += (t - mesh.rotation.x) * Math.min(1, 12 * dt);
      }
      for (const { mesh, phase } of this._armMeshDirect) {
        const t = isMoving ? Math.sin(this._walkT * freq + phase) * armAmp : 0;
        mesh.rotation.x += (t - mesh.rotation.x) * Math.min(1, 12 * dt);
      }
    }

    // ── Body recoil (empuje hacia atrás al disparar) ─────────────────────────
    if (this._bodyRecoilVel !== 0 || this._bodyRecoilPos !== 0) {
      const K = 40, D = 8;
      this._bodyRecoilVel -= this._bodyRecoilPos * K * dt;
      this._bodyRecoilVel *= (1 - D * dt);
      this._bodyRecoilPos += this._bodyRecoilVel * dt;
      if (Math.abs(this._bodyRecoilPos) < 0.002 && Math.abs(this._bodyRecoilVel) < 0.002) {
        this._bodyRecoilPos = 0; this._bodyRecoilVel = 0;
      }
      // Desplazar el grupo del modelo hacia atrás en local Z
      const recoilOffset = this._bodyRecoilPos * 0.38;
      const ry = this.group.rotation.y;
      this.group.position.x += Math.sin(ry) * recoilOffset;
      this.group.position.z += Math.cos(ry) * recoilOffset;
    }

    // ── Smoke particles (cigarrillo) ─────────────────────────────────────────
    this._updateSmoke(dt);
  }

  _updateSmoke(dt) {
    if (!this._smokePoint && !this._shootSmokePoint && !this._headBone) return;

    // Emitir 1-2 partículas por frame
    this._smokeEmitAcc = (this._smokeEmitAcc || 0) + dt;
    const emitRate = 0.08; // una partícula cada ~80ms
    while (this._smokeEmitAcc >= emitRate) {
      this._smokeEmitAcc -= emitRate;
      this._emitSmokeParticle();
    }

    // Actualizar partículas existentes
    const _tmp = new THREE.Vector3();
    for (let i = this._smokeParticles.length - 1; i >= 0; i--) {
      const p = this._smokeParticles[i];
      p.life += dt;
      const t = p.life / p.maxLife;   // 0 → 1

      // Movimiento
      p.vel.y  -= 0.3 * dt;           // leve gravedad inversa (sube)
      p.vel.y  = Math.max(p.vel.y, 0.4);
      p.mesh.position.addScaledVector(p.vel, dt);

      // Escala crece
      const s = p.startScale * (1 + t * 3);
      p.mesh.scale.setScalar(s);

      // Fade out
      p.mesh.material.opacity = (1 - t) * 0.55;

      // Eliminar cuando termina
      if (p.life >= p.maxLife) {
        this._scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this._smokeParticles.splice(i, 1);
      }
    }
  }

  _emitSmokeParticle() {
    // Posición world: preferimos el Empty "smoke_point" del GLB;
    // si no está, usamos el Head bone + offset manual.
    let pos;
    // Elegir el smoke_point del modelo activo en este frame
    const activeSmokePoint = this._isRiding && this._horseSmokePoint
      ? this._horseSmokePoint
      : (this._isAimingAnim && this._shootSmokePoint)
        ? this._shootSmokePoint
        : this._smokePoint;
    if (activeSmokePoint) {
      activeSmokePoint.updateWorldMatrix(true, false);
      pos = activeSmokePoint.getWorldPosition(new THREE.Vector3());
    } else if (this._headBone) {
      pos = this._headBone.getWorldPosition(new THREE.Vector3());
      const fwd = new THREE.Vector3(
        Math.sin(this.group.rotation.y),
        0.12,
        Math.cos(this.group.rotation.y)
      ).normalize().multiplyScalar(0.18);
      pos.add(fwd);
    } else {
      return;
    }

    const geo = new THREE.SphereGeometry(0.04, 4, 4);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      depthTest: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 10; // se evalúa DESPUÉS del opaco del player → depth test correcto
    mesh.position.copy(pos);
    this._scene.add(mesh);

    const angle = Math.random() * Math.PI * 2;
    const spread = 0.06;
    this._smokeParticles.push({
      mesh,
      vel: new THREE.Vector3(
        Math.cos(angle) * spread,
        0.6 + Math.random() * 0.4,
        Math.sin(angle) * spread
      ),
      life:       0,
      maxLife:    0.8 + Math.random() * 0.6,
      startScale: 0.5 + Math.random() * 0.5,
    });
  }

  setTarget(x, y, z, ry) {
    this.targetPos.set(x, y, z);
    this.targetRY = ry;
  }

  /** Snaps position immediately — use for mounted riders so they don't lag behind horse. */
  snapTo(x, y, z, ry) {
    this.group.position.set(x, y, z);
    this.targetPos.set(x, y, z);
    this.group.rotation.y = ry;
    this.targetRY = ry;
  }

  setRiding(isRiding) {
    this._isRiding = isRiding;
  }

  /** Llamar desde main.js cada frame con el estado real de teclas (solo jugador local). */
  setMovement(isMoving, isBackward, isSprinting, speedFrac = 1.0) {
    this._extMoving    = isMoving;
    this._extBackward  = isBackward;
    this._extSprinting = isSprinting;
    this._extSpeedFrac = speedFrac;
  }

  setHunger(val) { this._hunger = val; }
  setHP(val)     { this._hp     = val; }

  setAiming(isAiming) {
    if (this._gun) {
      this._gun.visible = isAiming;
      this._gun.traverse(c => { c.visible = isAiming; });
    }
    if (this._shootGun) this._shootGun.visible = isAiming;
    this._isAimingAnim = isAiming;
  }

  triggerGunRecoil() {
    this._gunRecoil = 1;
    this._bodyRecoilVel = -9.0;
  }

  emitMuzzleSmoke(dirX, dirZ) {
    const origin = this.getFirepointWorldPos();
    if (!origin) return;
    for (let i = 0; i < 10; i++) {
      const geo = new THREE.SphereGeometry(0.06 + Math.random() * 0.06, 4, 4);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.82 + Math.random()*0.1, 0.80 + Math.random()*0.1, 0.75),
        transparent: true, opacity: 0.55 + Math.random() * 0.2,
        depthWrite: false, depthTest: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 10;
      mesh.position.copy(origin);
      this._scene.add(mesh);
      const spd = 1.8 + Math.random() * 1.2;
      this._smokeParticles.push({
        mesh,
        vel: new THREE.Vector3(
          dirX * spd + (Math.random()-0.5)*0.18,
          0.4 + Math.random() * 0.6,
          dirZ * spd + (Math.random()-0.5)*0.18
        ),
        life: 0, maxLife: 0.6 + Math.random()*0.5,
        startScale: 1.0 + Math.random()*0.5,
      });
    }
  }

  getFirepointWorldPos() {
    // Cuando el modelo de disparo está activo, usar el Empty "muzzle" de ese modelo
    if (this._isAimingAnim && this._shootMuzzle) {
      this._shootMuzzle.updateWorldMatrix(true, false);
      return this._shootMuzzle.getWorldPosition(new THREE.Vector3());
    }
    // Fallback: firepoint del modelo principal
    if (this._firepoint) {
      return this._firepoint.getWorldPosition(new THREE.Vector3());
    }
    return null;
  }

  /**
   * Apply visual impact reaction — purely local, no network sync.
   * @param {'head'|'leg'|'body'} hitZone
   * @param {THREE.Vector3} hitPoint  — world position of impact
   */
  // Trigger HERIDO animation + stagger for hit-stun duration
  startHurt(duration = 1.5) {
    this._hurtTimer  = duration;
    this._staggerVel = 4.0 * (Math.random() < 0.5 ? 1 : -1);
  }

  applyImpact(hitZone, hitPoint) {
    if (hitZone === 'head') {
      // Determine world position of head
      let headWorldPos;
      if (this._headMesh) {
        this._headMesh.updateWorldMatrix(true, false);
        headWorldPos = this._headMesh.getWorldPosition(new THREE.Vector3());
        const geo = this._headMesh.geometry.clone();
        const col = this._headMesh.material?.color?.getHex?.() ?? 0x8b6040;
        this._headMesh.visible = false;
        this._spawnFlyingPart(headWorldPos, geo, col, hitPoint, 3.5);
      } else {
        headWorldPos = this.group.position.clone().add(new THREE.Vector3(0, 1.5, 0));
        this._spawnFlyingPart(
          headWorldPos,
          new THREE.BoxGeometry(0.46, 0.46, 0.46),
          0x8b6040, hitPoint, 3.5
        );
      }

    } else if (hitZone === 'leg') {
      let legMesh = null;
      if (this._legMeshes.length > 0) {
        // Pick a still-visible leg
        const visible = this._legMeshes.filter(l => l.visible);
        legMesh = visible.length > 0
          ? visible[Math.floor(Math.random() * visible.length)]
          : this._legMeshes[Math.floor(Math.random() * this._legMeshes.length)];
      }

      let legWorldPos;
      if (legMesh) {
        legMesh.updateWorldMatrix(true, false);
        legWorldPos = legMesh.getWorldPosition(new THREE.Vector3());
        const geo = legMesh.geometry.clone();
        const col = legMesh.material?.color?.getHex?.() ?? 0x2a1a08;
        legMesh.visible = false;
        this._spawnFlyingPart(legWorldPos, geo, col, hitPoint, 3.5);
      } else {
        // Fallback: spawn chunk at lower body
        legWorldPos = this.group.position.clone().add(
          new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.35, 0)
        );
        this._spawnFlyingPart(
          legWorldPos,
          new THREE.BoxGeometry(0.26, 0.70, 0.26),
          0x2a1a08, hitPoint, 3.5
        );
      }

    } else {
      // bodyshot — spring-damper rotation stagger
      this._staggerPos = 0;
      this._staggerVel = 5.0 * (Math.random() < 0.5 ? 1 : -1);
    }
  }

  /**
   * Spawn a body part that flies through the air with physics.
   */
  _spawnFlyingPart(worldPos, geo, color, hitPoint, maxT = 3.0) {
    const mat  = new THREE.MeshStandardMaterial({ color, roughness: 0.85, transparent: true, opacity: 1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(worldPos);
    mesh.castShadow = true;
    this._scene.add(mesh);

    // Launch: mostly away from hit point + upward jolt
    const away = new THREE.Vector3().subVectors(worldPos, hitPoint).normalize();
    const vel  = new THREE.Vector3(
      away.x * 6 + (Math.random() - 0.5) * 5,
      Math.abs(away.y) * 2 + 5 + Math.random() * 4,
      away.z * 6 + (Math.random() - 0.5) * 5
    );
    const angVel = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );

    this._detachedParts.push({ mesh, vel, angVel, t: 0, maxT });
  }

  /**
   * Reset all impact state — call on respawn.
   */
  resetImpact() {
    if (this._headMesh) this._headMesh.visible = true;
    for (const leg of this._legMeshes) leg.visible = true;
    for (const p of this._detachedParts) {
      this._scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    }
    this._detachedParts = [];
    this._staggerVel    = 0;
    this._staggerPos    = 0;
  }

  remove(scene) {
    scene.remove(this.group);
    if (this._hat && this._hatFlying) {
      scene.remove(this._hat);
    }
    // Clean up any flying parts
    for (const p of this._detachedParts) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    }
    this._detachedParts = [];
  }

  getHitboxes() {
    return this._proxyHitboxes ?? this._hitboxes;
  }
}
