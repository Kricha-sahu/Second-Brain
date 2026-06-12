import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Jointed leg component
function JointedLeg({ idx, isWalking, sideMultiplier, angleMultiplier }) {
  const thighRef = useRef();
  const shinRef = useRef();
  const footRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!isWalking) {
      // Gentle breathing wiggle
      const angle = Math.sin(time * 2 + idx) * 0.05;
      if (thighRef.current) thighRef.current.rotation.z = sideMultiplier * (0.3 + angle);
      if (shinRef.current) shinRef.current.rotation.z = sideMultiplier * (-0.5 + angle);
      return;
    }

    const walkSpeed = 22;
    const phaseOffset = idx * 2.09; // divide 2*PI by 3 for leg pairs
    const lift = Math.max(0, Math.sin(time * walkSpeed + phaseOffset));
    const swing = Math.cos(time * walkSpeed + phaseOffset);

    // Tripod walking gait animation
    if (thighRef.current) {
      // Lift thigh
      thighRef.current.rotation.z = sideMultiplier * (0.35 + lift * 0.25);
      // Swing thigh forward/backward
      thighRef.current.rotation.y = swing * 0.28 * angleMultiplier;
    }
    if (shinRef.current) {
      // Shin flexes as leg lifts
      shinRef.current.rotation.z = sideMultiplier * (-0.6 - lift * 0.35);
    }
  });

  return (
    <group>
      {/* Coxa/Thigh segment */}
      <group ref={thighRef} rotation={[0, 0, sideMultiplier * 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.008, 0.007, 0.07, 6]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.7} />
        </mesh>
        
        {/* Tibia/Shin joint */}
        <group ref={shinRef} position={[0, -0.035, 0]} rotation={[0, 0, sideMultiplier * -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.006, 0.004, 0.08, 6]} />
            <meshStandardMaterial color="#1f120c" roughness={0.8} />
          </mesh>
          
          {/* Tarsus/Foot joint */}
          <group ref={footRef} position={[0, -0.04, 0]} rotation={[0, 0, sideMultiplier * 0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.003, 0.001, 0.03, 4]} />
              <meshStandardMaterial color="#0f0805" roughness={0.9} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// 3D Cicada Wings
function CicadaWings({ isFlapping }) {
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (isFlapping) {
      const flap = Math.sin(time * 60) * 0.15;
      leftWingRef.current.rotation.y = flap + 0.1;
      leftWingRef.current.rotation.z = Math.cos(time * 60) * 0.08 - 0.25;
      rightWingRef.current.rotation.y = -flap - 0.1;
      rightWingRef.current.rotation.z = -Math.cos(time * 60) * 0.08 + 0.25;
    } else {
      // Wings folded flat over back
      leftWingRef.current.rotation.set(0.1, -0.15, -0.1);
      rightWingRef.current.rotation.set(0.1, 0.15, 0.1);
    }
  });

  // Wing vein pattern helper
  const wingVeins = [
    { scale: [0.95, 0.95, 1], pos: [0, 0, 0.001] },
    { scale: [0.85, 0.85, 1], pos: [0.005, -0.01, 0.002] },
    { scale: [0.7, 0.7, 1], pos: [0.01, -0.02, 0.003] }
  ];

  return (
    <group position={[0, 0.03, -0.02]}>
      {/* Left Wing */}
      <group ref={leftWingRef} position={[-0.03, 0, -0.02]}>
        <mesh position={[-0.06, -0.12, 0]} rotation={[0.4, 0.1, 0.1]} castShadow>
          <boxGeometry args={[0.08, 0.25, 0.004]} />
          <meshPhysicalMaterial 
            transmission={0.9} 
            roughness={0.1} 
            thickness={0.1} 
            ior={1.45} 
            color="#e0f2fe" 
            transparent 
          />
        </mesh>
        {/* Veins */}
        {wingVeins.map((vein, i) => (
          <mesh key={i} position={[-0.06 + vein.pos[0], -0.12 + vein.pos[1], vein.pos[2]]} rotation={[0.4, 0.1, 0.1]} scale={vein.scale}>
            <boxGeometry args={[0.076, 0.246, 0.001]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} wireframe />
          </mesh>
        ))}
      </group>

      {/* Right Wing */}
      <group ref={rightWingRef} position={[0.03, 0, -0.02]}>
        <mesh position={[0.06, -0.12, 0]} rotation={[0.4, -0.1, -0.1]} castShadow>
          <boxGeometry args={[0.08, 0.25, 0.004]} />
          <meshPhysicalMaterial 
            transmission={0.9} 
            roughness={0.1} 
            thickness={0.1} 
            ior={1.45} 
            color="#e0f2fe" 
            transparent 
          />
        </mesh>
        {/* Veins */}
        {wingVeins.map((vein, i) => (
          <mesh key={i} position={[0.06 - vein.pos[0], -0.12 + vein.pos[1], vein.pos[2]]} rotation={[0.4, -0.1, -0.1]} scale={vein.scale}>
            <boxGeometry args={[0.076, 0.246, 0.001]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} wireframe />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Master Insect Model
function BugSceneModel({ type, isWalking }) {
  const groupRef = useRef();
  const antennaeRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Antennae twitching
    if (antennaeRef.current) {
      antennaeRef.current.rotation.z = Math.sin(time * 8.0) * 0.1;
      antennaeRef.current.rotation.x = Math.cos(time * 5.0) * 0.08;
    }

    // Parallax mouse tilt
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.45, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.35, 0.08);
    }
  });

  return (
    <group ref={groupRef} rotation={[0.1, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 0.015, 0.12]} castShadow>
        <sphereGeometry args={[0.058, 16, 16]} />
        <meshStandardMaterial 
          color={type === 'jewel' ? '#0f4c3a' : type === 'ladybug' ? '#111' : '#1f120c'} 
          roughness={0.2}
          metalness={type === 'jewel' ? 0.8 : 0}
        />
      </mesh>

      {/* Eyes */}
      <group position={[0, 0.015, 0.12]}>
        <mesh position={[-0.038, 0.015, 0.03]} scale={[1, 1, 0.8]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={type === 'cicada' ? '#b91c1c' : '#000'} roughness={0.05} />
        </mesh>
        <mesh position={[0.038, 0.015, 0.03]} scale={[1, 1, 0.8]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={type === 'cicada' ? '#b91c1c' : '#000'} roughness={0.05} />
        </mesh>
      </group>

      {/* Antennae */}
      <group ref={antennaeRef} position={[0, 0.03, 0.14]}>
        <mesh position={[-0.02, 0.02, 0.03]} rotation={[0.2, 0.3, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.02, 0.02, 0.03]} rotation={[0.2, -0.3, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Thorax / Middle Body */}
      <mesh position={[0, 0.01, 0.04]} scale={[1.1, 0.9, 1.0]} castShadow>
        <sphereGeometry args={[0.078, 16, 16]} />
        <meshStandardMaterial 
          color={type === 'jewel' ? '#0f523c' : type === 'ladybug' ? '#111' : type === 'cicada' ? '#27272a' : '#2b1a0d'} 
          roughness={0.25}
          metalness={type === 'jewel' ? 0.95 : 0}
        />
      </mesh>

      {/* Special Species Additions (Horns / Mandibles / Shells) */}
      {type === 'hercules' && (
        <group>
          {/* Thorax Horn (Long upper horn) */}
          <group position={[0, 0.06, 0.05]} rotation={[-0.1, 0, 0]}>
            <mesh position={[0, 0.05, 0.06]} rotation={[0.4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.014, 0.16, 8]} />
              <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
            </mesh>
            {/* Horn tip curves down */}
            <mesh position={[0, 0.11, 0.12]} rotation={[1.0, 0, 0]} castShadow>
              <coneGeometry args={[0.01, 0.04, 8]} />
              <meshStandardMaterial color="#0f0805" roughness={0.5} />
            </mesh>
          </group>
          {/* Head Horn (Lower horn curving up) */}
          <group position={[0, -0.01, 0.14]} rotation={[0.15, 0, 0]}>
            <mesh position={[0, 0.03, 0.06]} rotation={[-0.3, 0, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.012, 0.12, 8]} />
              <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
            </mesh>
          </group>
        </group>
      )}

      {type === 'stag' && (
        <group position={[0, 0.01, 0.16]}>
          {/* Left Mandible */}
          <group rotation={[0, 0.4, 0.2]}>
            <mesh position={[-0.03, 0, 0.04]} rotation={[0, -0.6, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.012, 0.08, 8]} />
              <meshStandardMaterial color="#3d1d11" roughness={0.4} />
            </mesh>
            <mesh position={[-0.015, 0, 0.08]} rotation={[0, -1.3, 0]} castShadow>
              <coneGeometry args={[0.008, 0.04, 8]} />
              <meshStandardMaterial color="#3d1d11" roughness={0.4} />
            </mesh>
          </group>
          {/* Right Mandible */}
          <group rotation={[0, -0.4, -0.2]}>
            <mesh position={[0.03, 0, 0.04]} rotation={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.012, 0.08, 8]} />
              <meshStandardMaterial color="#3d1d11" roughness={0.4} />
            </mesh>
            <mesh position={[0.015, 0, 0.08]} rotation={[0, 1.3, 0]} castShadow>
              <coneGeometry args={[0.008, 0.04, 8]} />
              <meshStandardMaterial color="#3d1d11" roughness={0.4} />
            </mesh>
          </group>
        </group>
      )}

      {/* Abdomen / Elytra (Shell Covers) */}
      {type !== 'cicada' ? (
        <group position={[0, 0.01, -0.06]}>
          {/* Left Wing Shell */}
          <mesh position={[-0.042, 0.01, -0.05]} rotation={[0.05, 0.04, 0.02]} scale={[1, 0.8, 1.3]} castShadow>
            <sphereGeometry args={[0.09, 16, 16, 0, Math.PI]} />
            <meshPhysicalMaterial 
              color={
                type === 'hercules' ? '#cda052' : // Golden brown
                type === 'ladybug' ? '#dc2626' : // Red
                type === 'jewel' ? '#10b981' : // Shiny emerald
                '#3f2214' // Stag
              }
              roughness={0.1}
              metalness={type === 'jewel' ? 0.95 : type === 'ladybug' ? 0.05 : 0.25}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
          {/* Right Wing Shell */}
          <mesh position={[0.042, 0.01, -0.05]} rotation={[0.05, -0.04, -0.02]} scale={[1, 0.8, 1.3]} castShadow>
            <sphereGeometry args={[0.09, 16, 16, 0, Math.PI]} />
            <meshPhysicalMaterial 
              color={
                type === 'hercules' ? '#cda052' :
                type === 'ladybug' ? '#dc2626' :
                type === 'jewel' ? '#10b981' :
                '#3f2214'
              }
              roughness={0.1}
              metalness={type === 'jewel' ? 0.95 : type === 'ladybug' ? 0.05 : 0.25}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* Spots for Ladybug */}
          {type === 'ladybug' && (
            <group position={[0, 0.09, 0]}>
              <mesh position={[-0.06, 0.005, -0.03]} scale={[0.015, 0.002, 0.015]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#000" roughness={0.9} />
              </mesh>
              <mesh position={[0.06, 0.005, -0.03]} scale={[0.015, 0.002, 0.015]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#000" roughness={0.9} />
              </mesh>
              <mesh position={[-0.04, 0.015, -0.08]} scale={[0.018, 0.002, 0.018]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#000" roughness={0.9} />
              </mesh>
              <mesh position={[0.04, 0.015, -0.08]} scale={[0.018, 0.002, 0.018]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#000" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.02, -0.05]} scale={[0.015, 0.002, 0.015]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#000" roughness={0.9} />
              </mesh>
            </group>
          )}

          {/* Spots for Hercules Beetle */}
          {type === 'hercules' && (
            <group position={[0, 0.09, 0]}>
              <mesh position={[-0.05, 0.005, -0.04]} scale={[0.01, 0.002, 0.012]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#221105" roughness={0.9} />
              </mesh>
              <mesh position={[0.05, 0.005, -0.06]} scale={[0.012, 0.002, 0.008]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#221105" roughness={0.9} />
              </mesh>
              <mesh position={[-0.03, 0.015, -0.09]} scale={[0.008, 0.002, 0.01]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#221105" roughness={0.9} />
              </mesh>
              <mesh position={[0.04, 0.015, -0.03]} scale={[0.01, 0.002, 0.014]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial color="#221105" roughness={0.9} />
              </mesh>
            </group>
          )}
        </group>
      ) : (
        /* Cicada Body & Wings */
        <group>
          <mesh position={[0, 0.005, -0.08]} scale={[1.1, 0.85, 1.4]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#3f3f46" roughness={0.4} />
          </mesh>
          <CicadaWings isFlapping={isWalking} />
        </group>
      )}

      {/* 6 Jointed Legs */}
      {[
        { pos: [-0.08, 0.01, 0.06], rotZ: 1, angle: 1, side: 1 },    // Front Left
        { pos: [-0.09, 0.01, -0.01], rotZ: 1, angle: 0, side: 2 },   // Middle Left
        { pos: [-0.08, 0.01, -0.07], rotZ: 1, angle: -1, side: 3 },  // Back Left
        { pos: [0.08, 0.01, 0.06], rotZ: -1, angle: 1, side: 4 },    // Front Right
        { pos: [0.09, 0.01, -0.01], rotZ: -1, angle: 0, side: 5 },   // Middle Right
        { pos: [0.08, 0.01, -0.07], rotZ: -1, angle: -1, side: 6 }   // Back Right
      ].map((leg, i) => (
        <group key={i} position={leg.pos}>
          <JointedLeg 
            idx={leg.side} 
            isWalking={isWalking} 
            sideMultiplier={leg.rotZ} 
            angleMultiplier={leg.angle} 
          />
        </group>
      ))}
    </group>
  );
}

export default function AmbientBeetle({ type = 'ladybug', style }) {
  const [isWalking, setIsWalking] = React.useState(false);
  const [rotationCount, setRotationCount] = React.useState(0);

  const containerRef = useRef();

  const handleInteraction = () => {
    if (isWalking) return;
    setIsWalking(true);
    setRotationCount(prev => prev + 1);
    
    // Walk forward / crawl for 1.2s on hover/click
    setTimeout(() => {
      setIsWalking(false);
    }, 1200);
  };

  const speciesName = useMemo(() => {
    switch(type) {
      case 'hercules': return "Hercules Beetle";
      case 'stag': return "Stag Beetle";
      case 'jewel': return "Jewel Beetle";
      case 'cicada': return "Rainforest Cicada";
      default: return "Red Ladybug";
    }
  }, [type]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleInteraction}
      onClick={handleInteraction}
      title={`${speciesName} - hover to watch it crawl!`}
      style={{
        width: '56px',
        height: '56px',
        cursor: 'pointer',
        zIndex: 50,
        ...style
      }}
    >
      <Canvas camera={{ position: [0, 0.32, 0.34], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[1, 3, 2]} intensity={1.8} color="#ffecd0" />
        <group rotation={[0, rotationCount * Math.PI * 0.5, 0]}>
          <BugSceneModel type={type} isWalking={isWalking} />
        </group>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
