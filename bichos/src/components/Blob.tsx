import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function useKeyboard() {
  const [keys, setKeys] = useState({ w: false, s: false, a: false, d: false, space: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') setKeys(k => ({ ...k, w: true }));
      if (key === 's' || key === 'arrowdown') setKeys(k => ({ ...k, s: true }));
      if (key === 'a' || key === 'arrowleft') setKeys(k => ({ ...k, a: true }));
      if (key === 'd' || key === 'arrowright') setKeys(k => ({ ...k, d: true }));
      if (key === ' ') setKeys(k => ({ ...k, space: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') setKeys(k => ({ ...k, w: false }));
      if (key === 's' || key === 'arrowdown') setKeys(k => ({ ...k, s: false }));
      if (key === 'a' || key === 'arrowleft') setKeys(k => ({ ...k, a: false }));
      if (key === 'd' || key === 'arrowright') setKeys(k => ({ ...k, d: false }));
      if (key === ' ') setKeys(k => ({ ...k, space: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

export const Blob: React.FC = () => {
  const keys = useKeyboard();
  const radius = 1.2;
  const visualRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  const eyesRef = useRef<THREE.Group>(null);

  const [ref, api] = useSphere(() => ({
    mass: 15,
    position: [0, 5, 0],
    args: [radius],
    fixedRotation: true,
    linearDamping: 0.5,
    angularDamping: 0.5,
    friction: 0.1,
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, [api]);

  useFrame((state) => {
    if (!ref.current || !visualRef.current) return;

    const moveSpeed = 25;
    const jumpForce = 30;
    const time = state.clock.getElapsedTime();

    // Movement
    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.w) moveDir.z -= 1;
    if (keys.s) moveDir.z += 1;
    if (keys.a) moveDir.x -= 1;
    if (keys.d) moveDir.x += 1;

    if (moveDir.length() > 0) {
      moveDir.normalize();
      api.velocity.set(moveDir.x * moveSpeed, velocity.current[1], moveDir.z * moveSpeed);
      
      // Face movement direction
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      visualRef.current.rotation.y = THREE.MathUtils.lerp(visualRef.current.rotation.y, targetRotation, 0.15);
    } else {
      api.velocity.set(0, velocity.current[1], 0);
    }

    // Jump
    if (keys.space && Math.abs(velocity.current[1]) < 0.1) {
      api.applyImpulse([0, jumpForce, 0], [0, 0, 0]);
    }

    // Squash and stretch based on velocity
    const speed = new THREE.Vector3(velocity.current[0], velocity.current[1], velocity.current[2]).length();
    const stretch = 1 + speed * 0.02;
    const squash = 1 / Math.sqrt(stretch);
    
    visualRef.current.scale.set(squash, stretch, squash);
    
    // Material distortion pulse
    if (materialRef.current) {
      materialRef.current.distort = 0.3 + Math.sin(time * 3) * 0.1;
      materialRef.current.speed = 2 + speed * 0.5;
    }

    // Eyes blinking/wobbling
    if (eyesRef.current) {
      eyesRef.current.position.y = Math.sin(time * 10) * 0.05;
      eyesRef.current.scale.y = 0.8 + Math.cos(time * 2) * 0.2;
    }
  });

  return (
    <group ref={ref as any} name="worm-head-visual">
      <group ref={visualRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[radius, 64, 64]} />
          <MeshDistortMaterial
            ref={materialRef}
            color="#ff0080"
            speed={2}
            distort={0.4}
            roughness={0.2}
            metalness={0.1}
            clearcoat={1}
          />
        </mesh>

        {/* Face */}
        <group ref={eyesRef} position={[0, 0.2, radius * 0.8]}>
          {/* Eyes */}
          <mesh position={[0.3, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="white" />
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
          <mesh position={[-0.3, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="white" />
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
          {/* Cheeks */}
          <mesh position={[0.5, 0, -0.1]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#ff66b2" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-0.5, 0, -0.1]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#ff66b2" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
