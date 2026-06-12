import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function FireflyParticle({ phaseOffset, jarGlowOpacity }) {
  const meshRef = useRef();
  
  const stateRef = useRef({
    x: (Math.random() - 0.5) * 0.15,
    y: (Math.random() - 0.5) * 0.20 - 0.01,
    z: (Math.random() - 0.5) * 0.15,
    speedX: (Math.random() - 0.5) * 0.0012,
    speedY: (Math.random() - 0.5) * 0.0012,
    speedZ: (Math.random() - 0.5) * 0.0012,
    phase: phaseOffset * 0.7 + Math.random() * Math.PI,
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const data = stateRef.current;
    
    // Float around gently
    data.x += data.speedX + Math.sin(time * 0.6 + data.phase) * 0.0006;
    data.y += data.speedY + Math.sin(time * 0.8 + data.phase) * 0.0006;
    data.z += data.speedZ + Math.cos(time * 0.7 + data.phase) * 0.0006;

    // Boundary containment (Cylinder of radius 0.11, height -0.14 to 0.06)
    const r = Math.sqrt(data.x * data.x + data.z * data.z);
    if (r > 0.11) {
      data.x *= 0.95;
      data.z *= 0.95;
      data.speedX *= -1;
      data.speedZ *= -1;
    }
    if (data.y > 0.06) { data.y = 0.06; data.speedY *= -1; }
    if (data.y < -0.14) { data.y = -0.14; data.speedY *= -1; }

    if (meshRef.current) {
      meshRef.current.position.set(data.x, data.y, data.z);
      // Individual pulse rate
      const pulse = 0.45 * Math.sin(time * 2.5 + data.phase) + 0.75;
      if (meshRef.current.material) {
        meshRef.current.material.emissiveIntensity = pulse * (jarGlowOpacity * 5.0 + 1.2);
        meshRef.current.material.opacity = (0.25 + jarGlowOpacity * 0.75) * (pulse / 1.2);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.007, 6, 6]} />
      <meshStandardMaterial 
        color="#ffe885" 
        emissive="#fbbf24"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function FireflyModel({ isRunning, jarGlowOpacity, fireflyCoords, isMouseInJar }) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const lightRef = useRef();

  // Opacity of the firefly body decreases to 0 as the jar dims, leaving only the glowing tail
  const bodyOpacity = Math.max(0, Math.min(1, (jarGlowOpacity - 0.2) * 1.6));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Convert 2D percentages (30 to 70 for X, 30 to 82 for Y) to 3D local coordinates
    const targetX = ((fireflyCoords.x - 50) / 20) * 0.08; 
    const targetY = -((fireflyCoords.y - 56) / 26) * 0.08;

    if (isMouseInJar) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    } else {
      // Idle floating
      groupRef.current.position.x = Math.sin(time * 0.5) * 0.04;
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.03;
    }
    
    // Wiggle antennae and bob
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.8, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.5, 0.08);

    // Flap wings rapidly if running
    const flapSpeed = isRunning ? 55 : 8;
    const flapAngle = Math.sin(time * flapSpeed) * (isRunning ? 0.8 : 0.15);
    if (leftWingRef.current) leftWingRef.current.rotation.y = flapAngle + 0.2;
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flapAngle - 0.2;

    // Abdomen glow pulse synced to jar glow opacity
    const pulse = 0.4 * Math.sin(time * (isRunning ? 12 : 3)) + 0.8;
    if (lightRef.current) {
      lightRef.current.intensity = pulse * (jarGlowOpacity * 4 + 1); // Much brighter tail
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
      {/* Head */}
      <mesh position={[0, 0.025, 0.09]} castShadow>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#2d2a25" roughness={0.4} transparent opacity={bodyOpacity} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.024, 0.038, 0.098]} scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#d62828" roughness={0.1} transparent opacity={bodyOpacity} />
      </mesh>
      <mesh position={[0.024, 0.038, 0.098]} scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#d62828" roughness={0.1} transparent opacity={bodyOpacity} />
      </mesh>

      {/* Thorax */}
      <mesh position={[0, 0.02, 0.04]} scale={[1, 0.9, 1.2]} castShadow>
        <sphereGeometry args={[0.052, 12, 12]} />
        <meshStandardMaterial color="#e63946" roughness={0.3} transparent opacity={bodyOpacity} />
      </mesh>
      
      {/* Body/Abdomen Core */}
      <mesh position={[0, 0.01, -0.04]} scale={[1, 0.85, 1.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#3f3d37" roughness={0.5} transparent opacity={bodyOpacity} />
      </mesh>

      {/* Glow tail / Bioluminescent abdomen tip (remains visible even when body opacity is 0) */}
      <group position={[0, 0.005, -0.12]}>
        <mesh castShadow>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshPhysicalMaterial 
            color="#ffd166" 
            emissive="#fbbf24" 
            emissiveIntensity={jarGlowOpacity * 5.0 + 1.5} 
            transmission={0.45}
            roughness={0.15}
            thickness={0.2}
            transparent
            opacity={0.35 + jarGlowOpacity * 0.65}
          />
        </mesh>
        <pointLight ref={lightRef} color="#fbbf24" distance={0.8} position={[0, 0, -0.02]} />
      </group>

      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.02, 0.04, 0.01]} rotation={[0.1, 0.2, 0.15]} scale={[1.2, 0.2, 2.2]} castShadow>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshPhysicalMaterial color="#e2e8f0" transmission={0.8} roughness={0.25} thickness={0.05} transparent opacity={0.8 * bodyOpacity} />
      </mesh>

      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.02, 0.04, 0.01]} rotation={[0.1, -0.2, -0.15]} scale={[1.2, 0.2, 2.2]} castShadow>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshPhysicalMaterial color="#e2e8f0" transmission={0.8} roughness={0.25} thickness={0.05} transparent opacity={0.8 * bodyOpacity} />
      </mesh>
      
      {/* 6 tiny legs */}
      {[
        { pos: [-0.04, -0.02, 0.06], rotZ: 0.4 },
        { pos: [-0.05, -0.02, 0.01], rotZ: 0.4 },
        { pos: [-0.04, -0.02, -0.04], rotZ: 0.4 },
        { pos: [0.04, -0.02, 0.06], rotZ: -0.4 },
        { pos: [0.05, -0.02, 0.01], rotZ: -0.4 },
        { pos: [0.04, -0.02, -0.04], rotZ: -0.4 }
      ].map((leg, idx) => (
        <mesh key={idx} position={leg.pos} rotation={[0.15, 0, leg.rotZ]} castShadow>
          <cylinderGeometry args={[0.002, 0.002, 0.035, 4]} />
          <meshStandardMaterial color="#1a1a1a" transparent opacity={bodyOpacity} />
        </mesh>
      ))}
    </group>
  );
}

function GlassJar3D({ jarGlowOpacity }) {
  return (
    <group position={[0, -0.01, 0]}>
      {/* 1. Wire Arch Handle (from neck collar arches over lid) */}
      <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.11, 0.004, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
      </mesh>
      
      {/* 2. Wire Collar Ring (wraps around neck) */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.11, 0.004, 8, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
      </mesh>
      
      {/* Small loops on collar wire where handle attaches */}
      <mesh position={[-0.11, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.008, 0.002, 6, 12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.11, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.008, 0.002, 6, 12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 3. Metallic Screw Lid (Silver/Tin finish with ridges) */}
      <group position={[0, 0.12, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.098, 0.098, 0.04, 32]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Thread Ridges on Lid */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.099, 0.005, 8, 32]} />
          <meshStandardMaterial color="#dcdcdc" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.099, 0.005, 8, 32]} />
          <meshStandardMaterial color="#dcdcdc" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 4. Jar Neck */}
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 32]} />
        <meshPhysicalMaterial 
          color="#f4ffd8" 
          transmission={0.99} 
          opacity={1} 
          roughness={0.03} 
          ior={1.5} 
          thickness={0.04} 
          transparent 
        />
      </mesh>

      {/* Glass Neck Threads (below wire collar) */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0.05, 0]}>
        <torusGeometry args={[0.092, 0.004, 6, 32]} />
        <meshPhysicalMaterial color="#f4ffd8" transmission={0.99} roughness={0.03} transparent />
      </mesh>
      
      {/* 5. Wide Jar Body (Stouter, rounded Mason Jar shape) */}
      <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.135, 0.135, 0.22, 32]} />
        <meshPhysicalMaterial 
          color="#f4ffd8" 
          transmission={0.99} 
          opacity={1} 
          roughness={0.04} 
          ior={1.5} 
          thickness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transparent 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rounded shoulder transition from neck to body */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.135, 0.02, 32]} />
        <meshPhysicalMaterial color="#f4ffd8" transmission={0.99} roughness={0.04} transparent />
      </mesh>
      
      {/* 6. Jar Bottom (rounded edge transition and base) */}
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <cylinderGeometry args={[0.135, 0.125, 0.02, 32]} />
        <meshPhysicalMaterial color="#f4ffd8" transmission={0.96} opacity={1} roughness={0.06} ior={1.5} thickness={0.12} transparent />
      </mesh>
    </group>
  );
}

const InteractiveFirefly = ({ isRunning, jarGlowOpacity, fireflyCoords, isMouseInJar }) => {
  const particlesArr = Array.from({ length: 8 });

  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0.1, 0.6], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} color="#ffecd0" />
        
        {/* Collective inner jar illumination */}
        <pointLight position={[0, 0, 0]} intensity={jarGlowOpacity * 3.5} color="#ffd166" distance={1.2} />

        {/* The Glass Jar Enclosure */}
        <GlassJar3D jarGlowOpacity={jarGlowOpacity} />

        {/* Ambient Firefly Particles (yellow glowing dots) */}
        {particlesArr.map((_, idx) => (
          <FireflyParticle key={idx} phaseOffset={idx} jarGlowOpacity={jarGlowOpacity} />
        ))}

        {/* The Main Firefly (tiny size) */}
        <FireflyModel 
          isRunning={isRunning} 
          jarGlowOpacity={jarGlowOpacity} 
          fireflyCoords={fireflyCoords}
          isMouseInJar={isMouseInJar} 
        />
        
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default function FireflyTimer({ onFocusComplete }) {
  const [mode, setMode] = useState('work'); // 'work', 'short', 'long'
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [duration, setDuration] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Mouse tracking inside the jar
  const [fireflyCoords, setFireflyCoords] = useState({ x: 50, y: 60 });
  const [isMouseInJar, setIsMouseInJar] = useState(false);

  // Web Audio chime
  const playTimerChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq, startTime, duration, vol) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(vol, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 1.5, 0.4); // C5
      playTone(659.25, now + 0.05, 1.2, 0.3); // E5
      playTone(783.99, now + 0.1, 1.0, 0.2); // G5
    } catch (err) {
      console.warn("Audio Context blocked or not supported.", err);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playTimerChime();
            if (mode === 'work') {
              onFocusComplete();
            }
            alert(mode === 'work' ? "Flick the Firefly has charged the jar! Focus block completed." : "Break over! Ready to glow?");
            const defaultMins = mode === 'work' ? 25 : mode === 'short' ? 5 : 15;
            return defaultMins * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const handleModeChange = (newMode, minutes) => {
    setIsRunning(false);
    setMode(newMode);
    setDuration(minutes * 60);
    setTimeRemaining(minutes * 60);
  };

  const toggle = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeRemaining(duration);
  };

  const handleJarMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp coordinates to keep Flick safely inside the glass body of the jar
    const clampedX = Math.max(30, Math.min(70, x));
    const clampedY = Math.max(30, Math.min(82, y));

    setFireflyCoords({ x: clampedX, y: clampedY });
    setIsMouseInJar(true);
  };

  const handleJarMouseLeave = () => {
    setIsMouseInJar(false);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const jarGlowOpacity = isRunning ? (0.15 + (timeRemaining / duration) * 0.8) : 0.15;

  return (
    <div className="glass panel pebble-panel-2 pomodoro-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 className="panel-title" style={{ marginBottom: 0 }}>Firefly Focus Jar</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'center' }}>
        Maintain focus to keep the jar bright. Hover inside to guide Flick!
      </p>

      {/* Whimsical 3D Jar display */}
      <div 
        className="firefly-jar-container"
        onMouseMove={handleJarMouseMove}
        onMouseLeave={handleJarMouseLeave}
        style={{
          position: 'relative',
          width: '180px',
          height: '200px',
          cursor: 'crosshair', 
          marginTop: '1rem',
          marginBottom: '1rem'
        }}
      >
        {/* Bioluminescent glow */}
        <div 
          className="jar-glow-overlay firefly-glow" 
          style={{ 
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '50%',
            opacity: jarGlowOpacity,
            transition: 'opacity 0.5s ease',
            background: `radial-gradient(circle at ${fireflyCoords.x}% ${fireflyCoords.y}%, rgba(255, 183, 3, ${jarGlowOpacity * 0.9}) 0%, rgba(255, 183, 3, 0) 55%)`
          }}
        ></div>

        {/* 3D Canvas encompassing both the Jar and Firefly */}
        <InteractiveFirefly 
          isRunning={isRunning} 
          jarGlowOpacity={jarGlowOpacity} 
          fireflyCoords={fireflyCoords}
          isMouseInJar={isMouseInJar}
        />
      </div>

      <div style={{ 
        fontFamily: 'var(--font-title)', 
        fontSize: '2.8rem', 
        fontWeight: 800, 
        color: '#ffd166', 
        textShadow: '0 0 15px rgba(251, 191, 36, 0.6), 0 2px 4px rgba(0, 0, 0, 0.5)',
        marginBottom: '0.5rem' 
      }}>
        {formattedTime}
      </div>

      <div className="timer-mode" style={{ color: '#f4a261', fontWeight: '700', letterSpacing: '0.05em', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
        {mode === 'work' ? 'Focus Block' : mode === 'short' ? 'Cozy Break' : 'Deep Rest'}
      </div>

      {/* Preset Swaps */}
      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        <button 
          type="button" 
          className={`filter-btn ${mode === 'work' ? 'active' : ''}`} 
          onClick={() => handleModeChange('work', 25)}
        >
          Focus (25m)
        </button>
        <button 
          type="button" 
          className={`filter-btn ${mode === 'short' ? 'active' : ''}`} 
          onClick={() => handleModeChange('short', 5)}
        >
          Short Break (5m)
        </button>
        <button 
          type="button" 
          className={`filter-btn ${mode === 'long' ? 'active' : ''}`} 
          onClick={() => handleModeChange('long', 15)}
        >
          Long Rest (15m)
        </button>
      </div>

      <div className="timer-buttons">
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={toggle}
        >
          {isRunning ? 'Pause Jar' : 'Light Up Jar'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ color: "var(--deep-forest)" }}
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
