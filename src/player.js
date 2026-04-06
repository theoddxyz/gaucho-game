// --- Player rendering (remote + local players) ---
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let playerTemplate = null;

function loadTemplate() {
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

    // Name label
    if (data.name) this._addNameLabel(data.name);

    // Load GLB model async, apply color tint
    loadTemplate().then((template) => {
      let model;
      if (template) {
        model = template.clone(true);
        // Apply player color to body mesh
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.material = obj.material.clone();
            if (obj.name === 'body') {
              obj.material.color.set(this.color);
            }
          }
        });
        // Collect hitboxes (body + head)
        model.traverse((obj) => {
          if (obj.isMesh && (obj.name === 'body' || obj.name === 'head')) {
            this._hitboxes.push(obj);
          }
        });
      } else {
        model = buildFallbackModel(this.color);
        this._hitboxes = model._hitboxes || [];
      }
      this.group.add(model);
    });

    this._scene = scene;
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

  update(dt) {
    this.group.position.lerp(this.targetPos, 8 * dt);
    const diff = this.targetRY - this.group.rotation.y;
    this.group.rotation.y += diff * 8 * dt;
  }

  setTarget(x, y, z, ry) {
    this.targetPos.set(x, y, z);
    this.targetRY = ry;
  }

  remove(scene) {
    scene.remove(this.group);
  }

  getHitboxes() {
    return this._hitboxes;
  }
}
