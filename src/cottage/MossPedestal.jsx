import React from 'react';

function Mushroom({ position, rotation, scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Tall, slender, curved stalk segments */}
      <group>
        <mesh castShadow receiveShadow position={[0, 0.08, 0]} rotation={[0.08, 0, 0.05]}>
          <cylinderGeometry args={[0.009, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.01, 0.22, 0.01]} rotation={[-0.06, 0, -0.05]}>
          <cylinderGeometry args={[0.007, 0.009, 0.14, 8]} />
          <meshStandardMaterial color="#a78bfa" roughness={0.9} />
        </mesh>
      </group>

      {/* Fluted, wavy amethyst cap */}
      <group position={[0.005, 0.28, 0.005]}>
        {/* Main inverted cone cap */}
        <mesh castShadow position={[0, 0.01, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.075, 0.045, 16, 1, true]} />
          <meshPhysicalMaterial 
            color="#6b21a8" 
            emissive="#4c1d95"
            emissiveIntensity={0.5}
            roughness={0.4} 
            clearcoat={0.3}
          />
        </mesh>
        
        {/* Top central cap dome */}
        <mesh position={[0, 0.015, 0]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.5} />
        </mesh>

        {/* Under-cap radiating gills */}
        {Array.from({ length: 8 }).map((_, i) => {
          const rotY = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[0, -0.006, 0]} rotation={[0, rotY, 0.22]}>
              <boxGeometry args={[0.065, 0.002, 0.006]} />
              <meshStandardMaterial color="#4c1d95" roughness={0.9} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function MossPedestal() {
  return (
    <group position={[0, -0.48, 0]}>
      {/* Main mossy mound */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[0.72, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
        <meshStandardMaterial color="#3d5c44" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <sphereGeometry args={[0.68, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2.3]} />
        <meshStandardMaterial color="#4a7c59" roughness={0.88} />
      </mesh>

      {/* Lighter moss tufts */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.45, 0.08 + (i % 2) * 0.04, Math.sin(a) * 0.45]}
            castShadow
          >
            <sphereGeometry args={[0.14 + (i % 3) * 0.03, 12, 12]} />
            <meshStandardMaterial color={i % 2 ? '#6b8f71' : '#8fb996'} roughness={0.85} />
          </mesh>
        );
      })}

      {/* Weathered stones */}
      <mesh position={[-0.42, -0.02, 0.28]} rotation={[0.2, 0.4, 0.1]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color="#8a9b8c" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.48, -0.05, -0.32]} rotation={[0.5, -0.1, 0.3]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#7f8c7d" roughness={0.85} flatShading />
      </mesh>

      {/* Cute 3D mushrooms growing out of the moss */}
      <Mushroom position={[-0.25, 0.05, -0.15]} rotation={[0.15, 0.5, -0.1]} scale={1.1} capColor="#c44536" />
      <Mushroom position={[-0.15, 0.08, -0.28]} rotation={[-0.1, -0.3, 0.15]} scale={0.85} capColor="#e9a545" />
      <Mushroom position={[0.26, 0.04, 0.22]} rotation={[0.2, -0.2, -0.1]} scale={0.95} capColor="#9d4edd" />
    </group>
  );
}
