import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AcornModel({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Auto-spin base + mouse cursor tilt parallax
    const speed = active ? 2.2 : 0.8;
    const targetRotY = time * 0.3 * speed + (state.pointer.x * 0.6);
    const targetRotX = -state.pointer.y * 0.45;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    
    // Smooth vertical bobbing
    groupRef.current.position.y = Math.sin(time * 1.6) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Cap - Dark polished wood/metal cap */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.26, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#4e3115" 
          roughness={0.25} 
          metalness={0.7}
        />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
        <meshStandardMaterial color="#352210" roughness={0.9} />
      </mesh>
      {/* Body - Warm glossy acorn nut body */}
      <mesh position={[0, -0.08, 0]} scale={[1, 1.38, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial 
          color="#c89666" 
          roughness={0.15} 
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Sprout leaf */}
      <mesh position={[0.05, 0.28, 0]} rotation={[0.4, 0, 0.5]} castShadow>
        <boxGeometry args={[0.09, 0.008, 0.045]} />
        <meshStandardMaterial color="#52b788" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function DewModel({ active, fill = 0.5 }) {
  const groupRef = useRef();
  const fluidRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    const speed = active ? 2.0 : 0.7;
    const targetRotY = time * 0.25 * speed + (state.pointer.x * 0.65);
    const targetRotX = -state.pointer.y * 0.45;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.position.y = Math.sin(time * 1.4) * 0.04;
    
    if (fluidRef.current) {
      fluidRef.current.position.y = -0.16 + fill * 0.2;
      const scale = 0.15 + fill * 0.85;
      fluidRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      {/* High-Reflectivity Glass Teardrop */}
      {/* Bottom sphere */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial 
          transmission={0.97} 
          roughness={0.02} 
          thickness={1.5} 
          ior={1.45} 
          color="#cffafe" 
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          transparent
        />
      </mesh>
      {/* Upper Cone */}
      <mesh position={[0, 0.12, 0]} scale={[1, 1.2, 1]} castShadow>
        <coneGeometry args={[0.24, 0.45, 32]} />
        <meshPhysicalMaterial 
          transmission={0.97} 
          roughness={0.02} 
          thickness={1.5} 
          ior={1.45} 
          color="#cffafe" 
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          transparent
        />
      </mesh>

      {/* Internal Water Level Fluid */}
      <mesh ref={fluidRef} position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          emissive="#0284c7" 
          emissiveIntensity={active ? 1.4 : 0.6} 
          roughness={0.05} 
        />
      </mesh>
    </group>
  );
}

export function FernModel({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Wind force sways and pointer tilts
    const speed = active ? 2.4 : 1.0;
    const targetRotZ = Math.sin(time * 1.5) * 0.08 * speed + (state.pointer.x * 0.3);
    const targetRotX = Math.cos(time * 1.2) * 0.04 * speed - (state.pointer.y * 0.3);
    const targetRotY = time * 0.15 + (state.pointer.x * 0.3);
    
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
  });

  const leafCount = 8;
  const leafPairs = Array.from({ length: leafCount });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Organic curved stem branch */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const yPos = idx * 0.09;
        const bend = idx * 0.035;
        return (
          <mesh key={idx} position={[bend, yPos + 0.045, 0]} rotation={[0, 0, bend * 0.3]} castShadow>
            <cylinderGeometry args={[0.016 - idx * 0.002, 0.018 - idx * 0.002, 0.1, 8]} />
            <meshStandardMaterial color="#4a3b32" roughness={0.8} />
          </mesh>
        );
      })}

      {/* Swaying detailed leaf pairs */}
      {leafPairs.map((_, i) => {
        const yPos = 0.08 + i * 0.07;
        const scale = 1.0 - (i / leafCount) * 0.58;
        const angle = 0.35 + (i * 0.05);
        const stemBend = i * 0.035;

        return (
          <group key={i} position={[stemBend, yPos, 0]} scale={[scale, scale, scale]}>
            {/* Left Leaf (Curved using chain) */}
            <group position={[-0.03, 0, 0]} rotation={[0.15, 0, angle]}>
              {/* Segment 1 */}
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.004, 0.04]} />
                <meshStandardMaterial color="#2d6a4f" roughness={0.4} />
              </mesh>
              {/* Segment 2 */}
              <group position={[-0.07, 0, 0]} rotation={[0, 0, 0.22]}>
                <mesh castShadow>
                  <boxGeometry args={[0.07, 0.004, 0.03]} />
                  <meshStandardMaterial color="#40916c" roughness={0.4} />
                </mesh>
                {/* Leaf tip */}
                <group position={[-0.06, 0, 0]} rotation={[0, 0, 0.18]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.05, 0.004, 0.018]} />
                    <meshStandardMaterial color="#74c69d" roughness={0.5} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* Right Leaf (Curved using chain) */}
            <group position={[0.03, 0, 0]} rotation={[0.15, 0, -angle]}>
              {/* Segment 1 */}
              <mesh castShadow>
                <boxGeometry args={[0.08, 0.004, 0.04]} />
                <meshStandardMaterial color="#2d6a4f" roughness={0.4} />
              </mesh>
              {/* Segment 2 */}
              <group position={[0.07, 0, 0]} rotation={[0, 0, -0.22]}>
                <mesh castShadow>
                  <boxGeometry args={[0.07, 0.004, 0.03]} />
                  <meshStandardMaterial color="#40916c" roughness={0.4} />
                </mesh>
                {/* Leaf tip */}
                <group position={[0.06, 0, 0]} rotation={[0, 0, -0.18]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.05, 0.004, 0.018]} />
                    <meshStandardMaterial color="#74c69d" roughness={0.5} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        );
      })}

      {/* Curled sprout tip */}
      <mesh position={[0.2, 0.54, 0]} rotation={[0, 0, 0.6]} castShadow>
        <sphereGeometry args={[0.024, 8, 8]} />
        <meshStandardMaterial color="#74c69d" roughness={0.4} />
      </mesh>
    </group>
  );
}

function CrystalPillar({ height = 0.35, radius = 0.05, color = "#d8b4fe", emissive = "#a855f7", active }) {
  const pillarRef = useRef();

  useFrame((state) => {
    if (!pillarRef.current) return;
    const time = state.clock.getElapsedTime();
    const pulse = active ? 0.4 * Math.sin(time * 3.5) + 0.9 : 0.25 * Math.sin(time * 1.6) + 0.6;
    pillarRef.current.material.emissiveIntensity = pulse;
  });

  return (
    <group>
      {/* Faceted Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 6, 1]} />
        <meshPhysicalMaterial 
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          transmission={0.45}
          roughness={0.05}
          metalness={0.15}
          thickness={0.6}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          transparent
        />
      </mesh>
      {/* Faceted Tip */}
      <mesh position={[0, height / 2 + 0.05, 0]} castShadow>
        <coneGeometry args={[radius, 0.1, 6]} />
        <meshPhysicalMaterial 
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          transmission={0.45}
          roughness={0.05}
          metalness={0.15}
          thickness={0.6}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          transparent
        />
      </mesh>
    </group>
  );
}

export function CrystalModel({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    const speed = active ? 1.8 : 0.7;
    const targetRotY = time * 0.2 * speed + (state.pointer.x * 0.6);
    const targetRotX = -state.pointer.y * 0.45;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Crystal */}
      <group position={[0, 0.05, 0]}>
        <CrystalPillar height={0.4} radius={0.06} color="#e9d5ff" emissive="#c084fc" active={active} />
      </group>
      {/* Left Crystal */}
      <group position={[-0.1, -0.02, 0.06]} rotation={[0.2, 0.1, 0.35]}>
        <CrystalPillar height={0.3} radius={0.045} color="#e9d5ff" emissive="#c084fc" active={active} />
      </group>
      {/* Right Crystal */}
      <group position={[0.08, -0.04, -0.05]} rotation={[-0.15, -0.2, -0.3]}>
        <CrystalPillar height={0.28} radius={0.042} color="#e9d5ff" emissive="#c084fc" active={active} />
      </group>
    </group>
  );
}
