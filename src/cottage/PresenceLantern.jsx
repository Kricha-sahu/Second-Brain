import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import CottageCanvas from './CottageCanvas';
import CottageLighting from './CottageLighting';
import MossPedestal from './MossPedestal';

function Flame({ intensity }) {
  const flameRef = useRef();

  useFrame((state) => {
    if (!flameRef.current) return;
    const time = state.clock.getElapsedTime();
    // Flame size and shape wiggle
    const scaleY = (0.8 + intensity * 0.4) + Math.sin(time * 12.0) * 0.07 * (0.2 + intensity * 0.8);
    const scaleXZ = (0.8 + intensity * 0.4) + Math.cos(time * 14.0) * 0.05 * (0.2 + intensity * 0.8);
    flameRef.current.scale.set(scaleXZ, scaleY, scaleXZ);
    
    // Horizontal wiggling
    flameRef.current.position.x = Math.sin(time * 18.0) * 0.008;
    flameRef.current.position.z = Math.cos(time * 15.0) * 0.008;
  });

  return (
    <mesh ref={flameRef} position={[0, 0.16, 0]} scale={[1, 1.25, 1]}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#f97316" 
        emissiveIntensity={3.5} 
        roughness={0.1}
      />
    </mesh>
  );
}

function FlickeringLight({ intensity }) {
  const lightRef = useRef();

  useFrame((state) => {
    if (!lightRef.current) return;
    const time = state.clock.getElapsedTime();
    // Flicker intensity using combination of sin/cos waves
    const flicker = Math.sin(time * 16.0) * 0.14 + Math.cos(time * 24.0) * 0.06;
    lightRef.current.intensity = Math.max(0, intensity * 1.8 + flicker * (0.2 + intensity * 0.8));
  });

  return (
    <pointLight 
      ref={lightRef} 
      position={[0, 0.18, 0]} 
      intensity={intensity * 1.8} 
      color="#f97316" 
      distance={3.0} 
      decay={1.5}
      castShadow
    />
  );
}

function LanternModel({ intensity }) {
  return (
    <group position={[0, -0.15, 0]}>
      {/* Base copper ring */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.4} metalness={0.7} />
      </mesh>
      
      {/* Cap copper ring */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.15, 0.035, 16]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.4} metalness={0.7} />
      </mesh>
      
      {/* Top Dome */}
      <mesh position={[0, 0.39, 0]} castShadow>
        <sphereGeometry args={[0.11, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.5} metalness={0.65} />
      </mesh>

      {/* Ring Handle */}
      <mesh position={[0, 0.46, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.04, 0.008, 8, 16]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.5} metalness={0.75} />
      </mesh>

      {/* 4 vertical struts */}
      {[
        [0.10, 0.10],
        [-0.10, 0.10],
        [0.10, -0.10],
        [-0.10, -0.10]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.19, z]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.3, 8]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.45} metalness={0.7} />
        </mesh>
      ))}

      {/* Glass Cylindrical Shield */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 0.28, 16]} />
        <meshPhysicalMaterial 
          transmission={0.96} 
          roughness={0.06} 
          thickness={0.4} 
          ior={1.42} 
          color="#fffcf0" 
          transparent
        />
      </mesh>

      {/* Burning candle flame and light */}
      <Flame intensity={intensity} />
      <FlickeringLight intensity={intensity} />
    </group>
  );
}

export default function PresenceLantern({ value = 5 }) {
  const intensity = value / 10;

  return (
    <div className="presence-lantern-wrap" aria-hidden="true">
      <CottageCanvas camera={{ position: [0, 0.28, 1.85], fov: 38 }}>
        <CottageLighting shadows />
        <MossPedestal />
        <Float speed={1.0} floatIntensity={0.1}>
          <LanternModel intensity={intensity} />
        </Float>
      </CottageCanvas>
    </div>
  );
}
