import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SAGE_QUOTES = [
  "Sssilence is where true awarenessss grows...",
  "Watch the cyclic patterns of the forest floor...",
  "Focusss like a patient viper, rest like a coiled leaf...",
  "Are you breathing deeply, natural explorer?",
  "Let your thoughts slither away like morning mist...",
  "Acorns are precious, but peace is pricelessss...",
  "Even the tallest redwood starts as a sssimple seed..."
];

function SnakeModel({ isTongueOut, clickScale }) {
  const headRef = useRef();
  const groupRef = useRef();
  const tongueRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smooth tongue extension
    if (tongueRef.current) {
      const targetScaleZ = isTongueOut ? 1.0 : 0.001;
      tongueRef.current.scale.z = THREE.MathUtils.lerp(tongueRef.current.scale.z, targetScaleZ, 0.2);
      tongueRef.current.position.z = 0.08 + tongueRef.current.scale.z * 0.04;
    }

    // Head looks at cursor
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, state.pointer.x * 0.8, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -state.pointer.y * 0.5 - 0.2, 0.1); // default tilt down
    }

    // Body sways gently in a sine wave
    if (groupRef.current) {
      const baseScale = clickScale;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, baseScale, 0.15));
      
      // Slither breathing + mouse parallax tilt
      groupRef.current.position.y = -0.1 + Math.sin(time * 2.0) * 0.015;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.45, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.25, 0.08);
    }
  });

  // Coiled snake body segments (spheres in a realistic helix spiral)
  const segments = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 30; i++) {
      const angle = i * 0.32;
      const radius = 0.16 - (i * 0.0016);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.02 + i * 0.0075;
      const r = 0.046 - (i * 0.00075);
      // Scaly coloring pattern
      const color = i % 3 === 0 ? "#1b4332" : i % 3 === 1 ? "#2d6a4f" : "#40916c";
      list.push({ pos: [x, y, z], r, color });
    }
    return list;
  }, []);

  const headPos = segments[29].pos;

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Weathered Tree Log Stump */}
      <mesh rotation={[Math.PI / 2, 0, 0.4]} position={[0, -0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.25, 0.12, 16]} />
        <meshStandardMaterial color="#6b4226" roughness={0.9} />
      </mesh>
      {/* Tree log top ring */}
      <mesh rotation={[Math.PI / 2, 0, 0.4]} position={[0, 0.021, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.002, 16]} />
        <meshStandardMaterial color="#b8895a" roughness={0.9} />
      </mesh>
 
      {/* Snake Body segments */}
      {segments.map((seg, idx) => (
        <mesh key={idx} position={seg.pos} castShadow>
          <sphereGeometry args={[seg.r, 16, 16]} />
          <meshStandardMaterial color={seg.color} roughness={0.4} metalness={0.15} />
        </mesh>
      ))}

      {/* Interactive Snake Head sitting exactly at the end of the helix */}
      <group ref={headRef} position={[headPos[0], headPos[1] + 0.04, headPos[2]]}>
        {/* Head Sphere (tapered python shape) */}
        <mesh scale={[1.2, 0.72, 1.4]} castShadow>
          <sphereGeometry args={[0.068, 16, 16]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.4} />
        </mesh>
 
        {/* Left Eye (Golden slitted reptile eye) */}
        <mesh position={[-0.038, 0.016, 0.025]} scale={[1, 1, 0.7]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.15} />
        </mesh>
        <mesh position={[-0.04, 0.016, 0.032]} scale={[0.2, 0.8, 0.2]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#000" roughness={0.1} />
        </mesh>
 
        {/* Right Eye (Golden slitted reptile eye) */}
        <mesh position={[0.038, 0.016, 0.025]} scale={[1, 1, 0.7]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.15} />
        </mesh>
        <mesh position={[0.04, 0.016, 0.032]} scale={[0.2, 0.8, 0.2]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#000" roughness={0.1} />
        </mesh>
 
        {/* Nose nostrils */}
        <mesh position={[-0.012, -0.01, 0.07]} scale={[0.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshStandardMaterial color="#1b4332" roughness={0.9} />
        </mesh>
        <mesh position={[0.012, -0.01, 0.07]} scale={[0.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshStandardMaterial color="#1b4332" roughness={0.9} />
        </mesh>
 
        {/* Forked red tongue */}
        <group ref={tongueRef} position={[0, -0.012, 0.07]} scale={[1, 1, 0.001]}>
          {/* Base tongue stem */}
          <mesh castShadow>
            <boxGeometry args={[0.012, 0.003, 0.06]} />
            <meshStandardMaterial color="#ef4444" roughness={0.8} />
          </mesh>
          {/* Fork left */}
          <mesh position={[-0.01, 0, 0.04]} rotation={[0, 0.45, 0]}>
            <boxGeometry args={[0.005, 0.003, 0.038]} />
            <meshStandardMaterial color="#ef4444" roughness={0.8} />
          </mesh>
          {/* Fork right */}
          <mesh position={[0.01, 0, 0.04]} rotation={[0, -0.45, 0]}>
            <boxGeometry args={[0.005, 0.003, 0.038]} />
            <meshStandardMaterial color="#ef4444" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function FernSnake() {
  const [isTongueOut, setIsTongueOut] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [clickScale, setClickScale] = useState(1.0);
  const snakeCardRef = useRef(null);

  useEffect(() => {
    // Autonomously flick tongue every 4.5 seconds
    const interval = setInterval(() => {
      setIsTongueOut(true);
      setTimeout(() => setIsTongueOut(false), 300);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSnakeClick = () => {
    setIsTongueOut(true);
    setClickScale(1.18);
    setTimeout(() => {
      setIsTongueOut(false);
      setClickScale(1.0);
    }, 250);
    setQuoteIndex((prev) => (prev + 1) % SAGE_QUOTES.length);
  };

  return (
    <div className="snake-card-inner" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', overflow: 'visible', width: '100%' }}>
      {/* 3D Snake Canvas Container */}
      <div 
        ref={snakeCardRef}
        onClick={handleSnakeClick}
        style={{ 
          width: '120px', 
          height: '120px', 
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <Canvas camera={{ position: [0, 0.22, 0.65], fov: 42 }} gl={{ alpha: true }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 3, 2]} intensity={1.8} color="#fffcf2" castShadow />
          <directionalLight position={[-2, 1, -1]} intensity={0.4} color="#a8dadc" />
          <SnakeModel isTongueOut={isTongueOut} clickScale={clickScale} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div style={{ zIndex: 5 }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontFamily: 'var(--font-title)', 
          fontWeight: 700, 
          color: 'var(--moss-deep)', 
          marginBottom: '0.2rem' 
        }}>
          Sylvester the Fern Snake
        </h4>
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-main)', 
          fontStyle: 'italic', 
          lineHeight: '1.4',
          minHeight: '36px' 
        }}>
          "{SAGE_QUOTES[quoteIndex]}"
        </p>
      </div>
    </div>
  );
}
