// --- Player rendering (remote players) ---
import * as THREE from 'three';

export class PlayerModel {
  constructor(scene, data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hp = data.hp;
    this.targetPos = new THREE.Vector3(data.x, data.y, data.z);
    this.targetRY = data.ry || 0;

    const color = new THREE.Color(data.color);

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.4, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color });
    this.body = new THREE.Mesh(bodyGeo, bodyMat);
    this.body.castShadow = true;

    // Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMat = new THREE.MeshStandardMaterial({ color: color.clone().lerp(new THREE.Color(0xffffff), 0.3) });
    this.head = new THREE.Mesh(headGeo, headMat);
    this.head.position.y = 0.95;
    this.head.castShadow = true;

    // Gun
    const gunGeo = new THREE.BoxGeometry(0.12, 0.12, 0.6);
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    this.gun = new THREE.Mesh(gunGeo, gunMat);
    this.gun.position.set(0.35, 0.2, -0.3);

    // Name label (sprite)
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.roundRect(0, 10, 256, 44, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.name, 128, 42);
    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    this.nameSprite = new THREE.Sprite(spriteMat);
    this.nameSprite.scale.set(2, 0.5, 1);
    this.nameSprite.position.y = 1.6;

    // Group
    this.group = new THREE.Group();
    this.group.add(this.body);
    this.group.add(this.head);
    this.group.add(this.gun);
    this.group.add(this.nameSprite);
    this.group.position.set(data.x, 0.7, data.z);

    scene.add(this.group);
  }

  update(dt) {
    // Smooth interpolation
    this.group.position.lerp(
      new THREE.Vector3(this.targetPos.x, 0.7, this.targetPos.z),
      8 * dt
    );
    // Rotate body to face direction
    const currentY = this.group.rotation.y;
    const diff = this.targetRY - currentY;
    this.group.rotation.y += diff * 8 * dt;
  }

  setTarget(x, y, z, ry) {
    this.targetPos.set(x, y, z);
    this.targetRY = ry;
  }

  remove(scene) {
    scene.remove(this.group);
  }

  // For raycasting hit detection
  getHitboxes() {
    return [this.body, this.head];
  }
}

// Muzzle flash effect
export function createMuzzleFlash(scene, origin, direction) {
  const geo = new THREE.SphereGeometry(0.15, 6, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const flash = new THREE.Mesh(geo, mat);
  flash.position.set(origin.x, origin.y, origin.z);
  scene.add(flash);
  setTimeout(() => scene.remove(flash), 80);

  // Tracer line
  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(origin.x, origin.y, origin.z),
    new THREE.Vector3(
      origin.x + direction.x * 50,
      origin.y + direction.y * 50,
      origin.z + direction.z * 50,
    ),
  ]);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffff44, transparent: true, opacity: 0.5 });
  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);
  setTimeout(() => scene.remove(line), 100);
}
