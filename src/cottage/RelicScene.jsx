import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import CottageLighting from './CottageLighting';
import MossPedestal from './MossPedestal';
import { AcornModel, DewModel, FernModel, CrystalModel } from './relics/RelicModels';

function SporeParticles({ active, count = 20 }) {
  const pointsRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 1.1,
        y: Math.random() * 0.8 - 0.3,
        z: (Math.random() - 0.5) * 1.1,
        speed: 0.08 + Math.random() * 0.12,
        wobbleSpeed: 0.6 + Math.random() * 1.4,
        wobbleScale: 0.04 + Math.random() * 0.08,
      });
    }
    return temp;
  }, [count]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [particles, count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let y = positionAttr.array[idx + 1];
      const p = particles[i];
      
      // Float up
      y += p.speed * delta * (active ? 2.2 : 0.9);
      
      // Wrap
      if (y > 0.65) {
        y = -0.35;
      }
      
      positionAttr.array[idx + 1] = y;
      
      // Horizontal wiggle
      positionAttr.array[idx] = p.x + Math.sin(time * p.wobbleSpeed) * p.wobbleScale;
      positionAttr.array[idx + 2] = p.z + Math.cos(time * p.wobbleSpeed) * p.wobbleScale;
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffe08a"
        size={active ? 0.07 : 0.045}
        sizeAttenuation
        transparent
        opacity={active ? 0.8 : 0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function RelicScene({ type, active, progress }) {
  let ModelComponent = AcornModel;
  
  if (type === 'dew') {
    ModelComponent = DewModel;
  } else if (type === 'fern') {
    ModelComponent = FernModel;
  } else if (type === 'crystal') {
    ModelComponent = CrystalModel;
  }

  return (
    <>
      <CottageLighting />
      <MossPedestal />
      
      <group position={[0, 0.12, 0]}>
        <Float speed={active ? 1.6 : 0.9} rotationIntensity={0.06} floatIntensity={0.16}>
          <ModelComponent active={active} fill={progress} />
        </Float>
      </group>

      <SporeParticles active={active} />
    </>
  );
}
