import React from 'react';
import { Environment, ContactShadows } from '@react-three/drei';

export default function CottageLighting({ shadows = true }) {
  return (
    <>
      <Environment preset="dawn" environmentIntensity={0.85} />
      <ambientLight intensity={0.35} color="#fff8ee" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.1}
        color="#ffecd0"
        castShadow={shadows}
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-3, 4, 2]} intensity={0.45} color="#c5e8c7" />
      <hemisphereLight args={['#fff9f0', '#3d5c44', 0.5]} />
      {shadows && (
        <ContactShadows
          position={[0, -0.52, 0]}
          opacity={0.45}
          scale={3.2}
          blur={2.2}
          far={1.2}
          color="#1a2e22"
        />
      )}
    </>
  );
}
