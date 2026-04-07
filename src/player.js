// --- Player rendering (remote + local players) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let playerTemplate = null;
let botTemplate    = null;

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
    loader.load('/models/player.glb', (gltf) => resolve(gltf.scene), undefined, () => {
      // Fallback: procedural model
      resolve(null);
    });
  });
  return playerTemplate;
}

function buildFallbackModel(color) {
  const group = new THREE.Group();
  const c = new THREE.Color(color);
  const bodyMat = new THREE.MeshStandardMaterial({ color: c });
  const headMat = new THREE.MeshStandardMaterial({ color: c.clone().lerp(new THREE.Color(0xffffff), 0.3) });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.55), bodyMat);
  body.position.y = 0.6;
  body.castShadow = true;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), headMat);
  head.position.y = 1.44;
  head.castShadow = true;
  group.add(body, head);
  group._hitboxes = [body, head];
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
  // Detalles de tela en el pecho
  mk(0.78, 0.12, 0.52, TECH,  0, 0.88, 0.01);  // banda tecnológica
  mk(0.78, 0.12, 0.52, PAINT, 0, 0.72, 0.01);  // banda roja

  // Cabeza
  const head = mk(0.48, 0.46, 0.46, SKIN, 0, 1.43, 0);
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

  // Piernas
  mk(0.28, 0.80, 0.28, CLOTH,  0.20, -0.40, 0);
  mk(0.28, 0.80, 0.28, CLOTH, -0.20, -0.40, 0);
  // Mocasines
  mk(0.30, 0.10, 0.36, BONE,  0.20, -0.85, 0.04);
  mk(0.30, 0.10, 0.36, BONE, -0.20, -0.85, 0.04);

  // Collar de huesos
  mk(0.72, 0.10, 0.10, BONE, 0, 1.10, 0.26);

  grp._hitboxes = [body, head];
  return grp;
}

export class PlayerModel {
  constructor(scene, data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color || '#ff4444';
    this.hp = data.hp;
    this.targetPos = new THREE.Vector3(data.x, data.y ?? 1.0, data.z);
    this.targetRY = data.ry || 0;
    this._hitboxes = [];

    this.group = new THREE.Group();
    this.group.position.set(data.x, 0, data.z);
    scene.add(this.group);

    this._scene = scene;

    this._hat = null; // set only if GLB has a hat node
    this._hatFlying = false;
    this._hatVel = new THREE.Vector3();
    this._hatAngVel = new THREE.Vector3();

    // Name label
    if (data.name) this._addNameLabel(data.name);

    this._gun = null;
    this._firepoint = null;
    this._gunRecoil  = 0;
    this._gunRestPos = null; // local position stored once gun is found

    // Muerte / caída
    this._dying  = false;
    this._dyingT = 0;
    this._isBot  = !!data.isBot;

    // Load GLB model async, apply color tint
    loadTemplate(!!data.isBot).then((template) => {
      let model;
      if (template) {
        model = template.clone(true);
        // Apply player color to body mesh; find gun/hat/firepoint nodes
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.material = obj.material.clone();
            if (obj.name === 'body') obj.material.color.set(this.color);
          }
          const n = obj.name.toLowerCase();
          if (n === 'gun' || n === 'weapon' || n === 'pistol' || n === 'rifle' || n === 'revolver') {
            this._gun = obj;
            this._gunRestPos = obj.position.clone();
            obj.visible = false; // hidden until aiming
          }
          if (n.includes('hat') || n.includes('sombrero') || n.includes('cap')) {
            this._hat = obj; // use GLB hat if present
          }
          if (n.includes('firepoint') || n.includes('fire_point') || n.includes('muzzle')) {
            this._firepoint = obj;
            // Helper object — fully invisible, no shadow
            obj.visible = false;
            if (obj.isMesh) { obj.castShadow = false; obj.receiveShadow = false; }
          }
        });
        // Collect hitboxes
        model.traverse((obj) => {
          if (obj.isMesh && (obj.name === 'body' || obj.name === 'head')) {
            this._hitboxes.push(obj);
          }
        });
      } else {
        model = this._isBot ? buildBotModel() : buildFallbackModel(this.color);
        this._hitboxes = model._hitboxes || [];
      }
      this.group.add(model);
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

  /** Dispara la animación de caída (se queda en el suelo, no desaparece). */
  startDying() {
    if (this._dying) return;
    this._dying  = true;
    this._dyingT = 0;
  }

  update(dt) {
    if (this._dying) {
      this._dyingT += dt;
      // Caer de costado en ~0.6 s
      this.group.rotation.z = Math.min(Math.PI / 2, this._dyingT * 3.5);
      // Hundirse levemente en el suelo
      this.group.position.y = Math.max(-0.25, this.group.position.y - dt * 0.4);
      this.updateHat(dt);
      return;  // no seguir interpolando posición
    }
    this.group.position.lerp(this.targetPos, Math.min(1, 8 * dt));
    // Shortest-path angle lerp — avoids spinning the long way around ±π
    let diff = this.targetRY - this.group.rotation.y;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.group.rotation.y += diff * Math.min(1, 10 * dt);
    this.updateHat(dt);
  }

  setTarget(x, y, z, ry) {
    this.targetPos.set(x, y, z);
    this.targetRY = ry;
  }

  setAiming(isAiming) {
    if (this._gun) this._gun.visible = isAiming;
  }

  triggerGunRecoil() { this._gunRecoil = 1; }

  getFirepointWorldPos() {
    if (this._firepoint) {
      return this._firepoint.getWorldPosition(new THREE.Vector3());
    }
    return null;
  }

  remove(scene) {
    scene.remove(this.group);
    if (this._hat && this._hatFlying) {
      scene.remove(this._hat);
    }
  }

  getHitboxes() {
    return this._hitboxes;
  }
}
