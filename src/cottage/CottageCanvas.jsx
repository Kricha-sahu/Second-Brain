import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function CottageCanvas({
  className = '',
  camera = { position: [0, 0.55, 2.6], fov: 40 },
  children,
  dpr = [1, 2],
}) {
  return (
    <div className={`cottage-canvas ${className}`}>
      <Canvas
        camera={camera}
        dpr={dpr}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.25;
        }}
      >
        <Suspense fallback={null}>
          {children}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
