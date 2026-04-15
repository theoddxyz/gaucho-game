/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { Blob } from './components/Blob';
import * as THREE from 'three';
import { useRef } from 'react';

function Floor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
    </mesh>
  );
}

function Obstacle({ position, args }: { position: [number, number, number], args: [number, number, number] }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#444" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

function CameraFollow() {
  useFrame((state) => {
    const head = state.scene.getObjectByName('worm-head-visual');
    if (head) {
      const headPos = new THREE.Vector3();
      head.getWorldPosition(headPos);
      
      // In orthographic follow, we just move the camera position to maintain the same relative offset
      const offset = new THREE.Vector3(20, 20, 20);
      const targetPos = headPos.clone().add(offset);
      
      state.camera.position.lerp(targetPos, 0.1);
      state.camera.lookAt(headPos);
      state.camera.updateProjectionMatrix();
    }
  });
  return null;
}

export default function App() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows orthographic camera={{ zoom: 50, position: [20, 20, 20] }}>
        <color attach="background" args={['#050505']} />
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1.5} />
        <spotLight
          position={[0, 20, 0]}
          angle={0.5}
          penumbra={1}
          castShadow
          intensity={2}
          shadow-mapSize={[2048, 2048]}
        />

        <Physics gravity={[0, -20, 0]} iterations={50}>
          <Blob />
          <Floor />
          
          {/* Random Obstacles */}
          <Obstacle position={[5, 1, 5]} args={[2, 2, 2]} />
          <Obstacle position={[-5, 0.5, -5]} args={[3, 1, 3]} />
          <Obstacle position={[0, 1.5, -8]} args={[4, 3, 1]} />
          <Obstacle position={[-8, 2, 0]} args={[1, 4, 4]} />
        </Physics>

        <OrbitControls makeDefault enableRotate={false} minZoom={20} maxZoom={100} />
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.6}
          scale={40}
          blur={2}
          far={10}
        />
        <Environment preset="night" />
        
        <CameraFollow />
      </Canvas>

      <div className="absolute top-8 left-8 text-white pointer-events-none select-none">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            WORM<span className="text-green-500">.</span>IO
          </h1>
        </div>
        <p className="text-xs opacity-40 font-mono mt-2 tracking-[0.2em] uppercase">
          Procedural Physics Simulation v1.0
        </p>
        
        <div className="mt-8 space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            <span className="px-1.5 py-0.5 border border-white/20 rounded">WASD</span>
            <span>Move Worm</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            <span className="px-1.5 py-0.5 border border-white/20 rounded">Orbit</span>
            <span>Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            <span className="px-1.5 py-0.5 border border-white/20 rounded">F</span>
            <span>Talk (Generic)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            <span className="px-1.5 py-0.5 border border-white/20 rounded">G</span>
            <span>Say YES (Nod)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            <span className="px-1.5 py-0.5 border border-white/20 rounded">H</span>
            <span>Say NO (Shake)</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-[10px] uppercase tracking-widest text-white transition-colors pointer-events-auto cursor-pointer"
          >
            Reset Simulation
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8 text-right pointer-events-none">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">
          Engine: Three.js + Cannon-es<br/>
          Animation: Procedural Physics Constraints
        </p>
      </div>
    </div>
  );
}
