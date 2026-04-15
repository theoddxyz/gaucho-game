import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere, useDistanceConstraint } from '@react-three/cannon';
import * as THREE from 'three';

const SEGMENT_COUNT = 12;
const RADIUS = 0.4;
const SPACING = 0.5;

const getSegmentRadius = (index: number) => {
  const t = index / (SEGMENT_COUNT - 1);
  return RADIUS * (1 + Math.sin(t * Math.PI) * 1.2);
};

function useKeyboard() {
  const [keys, setKeys] = useState({ w: false, s: false, a: false, d: false, space: false, f: false, g: false, h: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') setKeys(k => ({ ...k, w: true }));
      if (key === 's' || key === 'arrowdown') setKeys(k => ({ ...k, s: true }));
      if (key === 'a' || key === 'arrowleft') setKeys(k => ({ ...k, a: true }));
      if (key === 'd' || key === 'arrowright') setKeys(k => ({ ...k, d: true }));
      if (key === ' ') setKeys(k => ({ ...k, space: true }));
      if (key === 'f') setKeys(k => ({ ...k, f: true }));
      if (key === 'g') setKeys(k => ({ ...k, g: true }));
      if (key === 'h') setKeys(k => ({ ...k, h: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') setKeys(k => ({ ...k, w: false }));
      if (key === 's' || key === 'arrowdown') setKeys(k => ({ ...k, s: false }));
      if (key === 'a' || key === 'arrowleft') setKeys(k => ({ ...k, a: false }));
      if (key === 'd' || key === 'arrowright') setKeys(k => ({ ...k, d: false }));
      if (key === ' ') setKeys(k => ({ ...k, space: false }));
      if (key === 'f') setKeys(k => ({ ...k, f: false }));
      if (key === 'g') setKeys(k => ({ ...k, g: false }));
      if (key === 'h') setKeys(k => ({ ...k, h: false }));
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

interface SegmentProps {
  index: number;
  radius: number;
  parentRef: React.RefObject<THREE.Group>;
  onApiReady: (index: number, api: any, ref: any, visualRef: any, talkingRef: any) => void;
}

const Segment = React.forwardRef<THREE.Group, SegmentProps>(({ index, radius, parentRef, onApiReady }, ref) => {
  const isHead = index === 0;
  const isTail = index === SEGMENT_COUNT - 1;
  const color = "#2e7d32"; // Medium green
  const visualHeadRef = useRef<THREE.Group>(null);
  const talkingRef = useRef<THREE.Group>(null);
  
  const [sphereRef, api] = useSphere(() => {
    const t = index / (SEGMENT_COUNT - 1);
    // Mass factor: 1.0 at ends, up to 4.0 in the middle
    const massFactor = 1 + Math.sin(t * Math.PI) * 3;
    const segmentMass = isHead ? 40 : 2 * massFactor;

    return {
      mass: segmentMass,
      position: [0, 2, -index * SPACING],
      args: [radius],
      fixedRotation: true,
      linearDamping: isHead ? 0.1 : 0.5,
      angularDamping: 0.5,
      friction: 0.2,
    };
  }, ref as any);

  useEffect(() => {
    onApiReady(index, api, sphereRef, visualHeadRef, talkingRef);
  }, [api, sphereRef, index]);

  useDistanceConstraint(sphereRef, parentRef, {
    distance: SPACING,
  });

  return (
    <group ref={sphereRef as any} name={isHead ? 'worm-head-visual' : undefined}>
      <group ref={visualHeadRef}>
        <group ref={talkingRef}>
          {/* Show sphere only at head and tail */}
          <mesh castShadow receiveShadow visible={isHead || isTail}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshPhysicalMaterial 
              color={color} 
              roughness={0.4} 
              metalness={0.1}
              clearcoat={0.8}
              clearcoatRoughness={0.2}
              emissive="#051005"
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {isHead && (
            <group position={[0, 0, radius * 0.9]}>
              {/* Eyes */}
              <mesh position={[0.18, 0.15, 0.05]} castShadow>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="white" />
                <mesh position={[0, 0, 0.06]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshStandardMaterial color="black" />
                </mesh>
              </mesh>
              <mesh position={[-0.18, 0.15, 0.05]} castShadow>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="white" />
                <mesh position={[0, 0, 0.06]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshStandardMaterial color="black" />
                </mesh>
              </mesh>
              {/* Mouth */}
              <mesh position={[0, -0.1, 0.08]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.25, 0.04, 0.04]} />
                <meshStandardMaterial color="#330000" />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
});

export const Worm: React.FC = () => {
  const keys = useKeyboard();
  const segmentRefs = useRef<React.RefObject<THREE.Group>[]>([]);
  const apis = useRef<any[]>([]);
  const physicsRefs = useRef<any[]>([]);
  const visualRefs = useRef<any[]>([]);
  const talkingRefs = useRef<any[]>([]);
  const tubeMeshRef = useRef<THREE.Mesh>(null);
  const [curve] = useState(() => new THREE.CatmullRomCurve3());

  if (segmentRefs.current.length === 0) {
    segmentRefs.current = Array(SEGMENT_COUNT).fill(0).map(() => React.createRef<THREE.Group>());
    apis.current = Array(SEGMENT_COUNT).fill(null);
    physicsRefs.current = Array(SEGMENT_COUNT).fill(null);
    visualRefs.current = Array(SEGMENT_COUNT).fill(null);
    talkingRefs.current = Array(SEGMENT_COUNT).fill(null);
  }

  const onApiReady = (index: number, api: any, ref: any, visualRef: any, talkingRef: any) => {
    apis.current[index] = api;
    physicsRefs.current[index] = ref;
    visualRefs.current[index] = visualRef;
    talkingRefs.current[index] = talkingRef;
  };

  const velocityY = useRef(0);
  useEffect(() => {
    if (apis.current[0]) {
      const unsubscribe = apis.current[0].velocity.subscribe((v: number[]) => (velocityY.current = v[1]));
      return unsubscribe;
    }
  }, [apis.current[0]]);

  useFrame((state) => {
    const headApi = apis.current[0];
    const headRef = physicsRefs.current[0];
    const headVisual = visualRefs.current[0];
    const headTalking = talkingRefs.current[0];

    if (headApi && headRef.current && headVisual.current && headTalking.current) {
      const moveSpeed = 20; 
      const jumpForce = 25;
      
      // Movement relative to world space
      const moveDir = new THREE.Vector3(0, 0, 0);
      if (keys.w) moveDir.z -= 1; // W is forward (-Z)
      if (keys.s) moveDir.z += 1; // S is backward (+Z)
      if (keys.a) moveDir.x -= 1; // A is left (-X)
      if (keys.d) moveDir.x += 1; // D is right (+X)

      if (moveDir.length() > 0) {
        moveDir.normalize();
        
        // Set velocity directly
        headApi.velocity.set(moveDir.x * moveSpeed, velocityY.current, moveDir.z * moveSpeed);
        
        // Visual rotation - head always faces movement direction
        // Since face is at +Z, rotation 0 means facing +Z (Backward/S)
        // Math.atan2(x, z) gives angle from +Z axis
        const targetRotation = Math.atan2(moveDir.x, moveDir.z);
        
        // Smoothly interpolate the rotation of the VISUAL part
        const currentRotation = headVisual.current.rotation.y;
        let diff = targetRotation - currentRotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        
        headVisual.current.rotation.y = currentRotation + diff * 0.2;
      } else {
        // Stop horizontal movement if no keys pressed
        headApi.velocity.set(0, velocityY.current, 0);
      }

      if (keys.space) {
        const pos = new THREE.Vector3();
        headRef.current.getWorldPosition(pos);
        if (pos.y < 1.5) {
          headApi.applyImpulse([0, jumpForce, 0], [0, 0, 0]);
        }
      }

      const isTalking = keys.f || keys.g || keys.h;

      if (isTalking) {
        const time = state.clock.getElapsedTime();
        const pos = new THREE.Vector3();
        headRef.current.getWorldPosition(pos);
        
        // Elevate head: Stronger, snappier force to reach target height quickly
        const targetHeight = 4.5;
        const heightDiff = targetHeight - pos.y;
        if (heightDiff > 0) {
          headApi.applyForce([0, heightDiff * 500, 0], [0, 0, 0]);
        }

        if (keys.g) {
          // YES (Positive): Vertical nod
          const undulateY = Math.sin(time * 15) * 15;
          headApi.applyForce([0, undulateY, 0], [0, 0, 0]);
          headTalking.current.rotation.x = Math.sin(time * 20) * 0.3;
        } else if (keys.h) {
          // NO (Negative): Side-to-side shake
          const undulateX = Math.sin(time * 12) * 20;
          headApi.applyForce([undulateX, 0, 0], [0, 0, 0]);
          headTalking.current.rotation.y = Math.sin(time * 15) * 0.4;
        } else if (keys.f) {
          // TALK (Intermediate): Circular/Expressive wobble
          const undulateX = Math.sin(time * 6) * 12;
          const undulateZ = Math.cos(time * 4) * 12;
          headApi.applyForce([undulateX, 0, undulateZ], [0, 0, 0]);
          
          headTalking.current.rotation.y = Math.sin(time * 10) * 0.2;
          headTalking.current.rotation.z = Math.cos(time * 8) * 0.15;
          headTalking.current.rotation.x = Math.sin(time * 5) * 0.1;
        }
      } else {
        // Reset talking rotations when not talking, but keep facing rotation (Y)
        if (headTalking.current) {
          headTalking.current.rotation.y = THREE.MathUtils.lerp(headTalking.current.rotation.y, 0, 0.1);
          headTalking.current.rotation.z = THREE.MathUtils.lerp(headTalking.current.rotation.z, 0, 0.1);
          headTalking.current.rotation.x = THREE.MathUtils.lerp(headTalking.current.rotation.x, 0, 0.1);
        }
      }
    }

    // Update Tube Geometry
    const points: THREE.Vector3[] = [];
    let allRefsReady = true;
    
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const ref = physicsRefs.current[i];
      if (ref && ref.current) {
        const pos = new THREE.Vector3();
        ref.current.getWorldPosition(pos);
        points.push(pos);
      } else {
        allRefsReady = false;
        break;
      }
    }

    if (allRefsReady && points.length >= 2 && tubeMeshRef.current) {
      curve.points = points;
      const tubularSegments = 64;
      const radialSegments = 12;
      const newGeo = new THREE.TubeGeometry(curve, tubularSegments, RADIUS, radialSegments, false);
      
      // Apply variable radius to the tube vertices
      const position = newGeo.attributes.position;
      const normal = newGeo.attributes.normal;
      
      for (let i = 0; i < position.count; i++) {
        const tubularIndex = Math.floor(i / (radialSegments + 1));
        const t = tubularIndex / tubularSegments;
        const thicknessFactor = 1 + Math.sin(t * Math.PI) * 1.2;
        
        const nx = normal.getX(i);
        const ny = normal.getY(i);
        const nz = normal.getZ(i);
        
        const px = position.getX(i);
        const py = position.getY(i);
        const pz = position.getZ(i);
        
        position.setXYZ(
          i,
          px + nx * RADIUS * (thicknessFactor - 1),
          py + ny * RADIUS * (thicknessFactor - 1),
          pz + nz * RADIUS * (thicknessFactor - 1)
        );
      }
      
      if (tubeMeshRef.current.geometry) {
        tubeMeshRef.current.geometry.dispose();
      }
      tubeMeshRef.current.geometry = newGeo;
    }
  });

  return (
    <group>
      {/* The smooth tube body */}
      <mesh ref={tubeMeshRef} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#2e7d32" 
          roughness={0.4} 
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#051005"
          emissiveIntensity={0.5}
        />
      </mesh>

      {segmentRefs.current.map((ref, i) => (
        <Segment
          key={i}
          index={i}
          radius={getSegmentRadius(i)}
          ref={ref}
          parentRef={i > 0 ? segmentRefs.current[i - 1] : { current: null } as any}
          onApiReady={onApiReady}
        />
      ))}
    </group>
  );
};
