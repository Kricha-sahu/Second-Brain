import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ── Inline SVG Icons ── */
const AwarenessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

const ChamberIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}>
    <path d="M12 3C7 3 3 7 3 12c0 3 1.5 5.5 4 7" />
    <path d="M12 3c5 0 9 4 9 9 0 3-1.5 5.5-4 7" />
    <path d="M8 20c1.2.6 2.6 1 4 1s2.8-.4 4-1" />
    <path d="M12 3v4" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    <path d="M9 14c1 1.5 5 1.5 6 0" />
  </svg>
);

const CorrelationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" />
  </svg>
);

const AcornIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}>
    <ellipse cx="12" cy="15" rx="6" ry="7" />
    <path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M12 4V2" />
    <path d="M10 4c-1-1-1-2 0-2" />
    <path d="M14 4c1-1 1-2 0-2" />
  </svg>
);

const TrendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

function CocoonModel({ shake }) {
  const groupRef = useRef();

  // Create procedural textures for the cocoon matching the white/cream fibrous pod with black patches
  const { cocoonTexture, cocoonBumpTexture } = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fill cream/white base
    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(0, 0, 256, 512);

    // Fibrous/silk lines
    ctx.strokeStyle = '#d4c5b3';
    ctx.lineWidth = 1;
    for (let i = 0; i < 700; i++) {
      ctx.beginPath();
      const x = Math.random() * 256;
      const y = Math.random() * 512;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 24, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }

    // Irregular black spots/patches matching the image
    ctx.fillStyle = '#1c1917';
    const spots = [
      { x: 128, y: 70, rx: 35, ry: 20 },
      { x: 80, y: 110, rx: 22, ry: 15 },
      { x: 175, y: 125, rx: 28, ry: 18 },
      { x: 60, y: 220, rx: 20, ry: 14 },
      { x: 200, y: 240, rx: 22, ry: 16 },
      { x: 128, y: 390, rx: 42, ry: 30 },
      { x: 80, y: 440, rx: 24, ry: 18 },
      { x: 180, y: 435, rx: 26, ry: 16 }
    ];
    spots.forEach(s => {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.25) {
        const radX = s.rx * (0.85 + Math.sin(a * 4.2) * 0.15);
        const radY = s.ry * (0.85 + Math.cos(a * 3.7) * 0.15);
        const px = s.x + Math.cos(a) * radX;
        const py = s.y + Math.sin(a) * radY;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    });

    const bCanvas = document.createElement('canvas');
    bCanvas.width = 128;
    bCanvas.height = 256;
    const bCtx = bCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 128, 256);
    bCtx.strokeStyle = '#fff';
    bCtx.lineWidth = 1.5;
    for (let i = 0; i < 400; i++) {
      bCtx.beginPath();
      const x = Math.random() * 128;
      const y = Math.random() * 256;
      bCtx.moveTo(x, y);
      bCtx.lineTo(x + (Math.random() - 0.5) * 16, y + (Math.random() - 0.5) * 5);
      bCtx.stroke();
    }

    return {
      cocoonTexture: new THREE.CanvasTexture(canvas),
      cocoonBumpTexture: new THREE.CanvasTexture(bCanvas)
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (shake) {
      groupRef.current.rotation.z = Math.sin(time * 55.0) * 0.25;
      groupRef.current.rotation.x = Math.cos(time * 45.0) * 0.1;
    } else {
      groupRef.current.rotation.z = Math.sin(time * 2.2) * 0.05 + (state.pointer.x * 0.25);
      groupRef.current.rotation.x = -state.pointer.y * 0.22;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Curved branch twig */}
      <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#54382c" roughness={0.9} />
      </mesh>
      
      {/* Fine hanging silk line */}
      <mesh position={[0.02, 0.02, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.1, 6]} />
        <meshStandardMaterial color="#ebe6db" roughness={0.8} />
      </mesh>

      {/* Chrysalis Pod matching the white fibrous pod with spots */}
      <group position={[0.02, -0.16, 0]}>
        {/* Core detailed pod */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial 
            map={cocoonTexture}
            bumpMap={cocoonBumpTexture}
            bumpScale={0.025}
            roughness={0.9} 
          />
        </mesh>
        {/* Upper cone segment */}
        <mesh position={[0, 0.07, 0]} scale={[1, 1.3, 1]} castShadow>
          <coneGeometry args={[0.11, 0.14, 24, 1, true]} />
          <meshStandardMaterial 
            map={cocoonTexture}
            bumpMap={cocoonBumpTexture}
            bumpScale={0.025}
            roughness={0.9}
          />
        </mesh>
        {/* Lower cone tip */}
        <mesh position={[0, -0.07, 0]} rotation={[Math.PI, 0, 0]} scale={[1, 1.4, 1]} castShadow>
          <coneGeometry args={[0.11, 0.14, 24, 1, true]} />
          <meshStandardMaterial 
            map={cocoonTexture}
            bumpMap={cocoonBumpTexture}
            bumpScale={0.025}
            roughness={0.9}
          />
        </mesh>

        {/* Golden inner cell glow (pulsating under the pod edges) */}
        <pointLight color="#ffd700" intensity={0.8} distance={0.4} position={[0, 0, 0]} />
      </group>
    </group>
  );
}

const InteractiveCocoon = () => {
  const [shake, setShake] = useState(false);

  const handleTrigger = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div
      onClick={handleTrigger}
      onMouseEnter={handleTrigger}
      style={{
        width: '80px',
        height: '80px',
        cursor: 'pointer',
      }}
    >
      <Canvas camera={{ position: [0, 0, 0.52], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[1, 2, 1]} intensity={1.8} color="#ffecd0" />
        <CocoonModel shake={shake} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

function ButterflyModel() {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  // Create Swallowtail textures
  const { forewingTexture, hindwingTexture } = React.useMemo(() => {
    // Forewing
    const fCanvas = document.createElement('canvas');
    fCanvas.width = 512;
    fCanvas.height = 512;
    const fCtx = fCanvas.getContext('2d');
    
    // Draw wing silhouette
    fCtx.beginPath();
    fCtx.moveTo(40, 470);
    fCtx.quadraticCurveTo(80, 200, 480, 20); // Top margin
    fCtx.quadraticCurveTo(460, 250, 420, 380); // Outer edge
    fCtx.quadraticCurveTo(240, 420, 40, 470); // Lower edge
    fCtx.closePath();
    
    // Base green grad
    const fGrad = fCtx.createLinearGradient(40, 470, 480, 20);
    fGrad.addColorStop(0, '#10b981'); // Emerald
    fGrad.addColorStop(0.3, '#34d399');
    fGrad.addColorStop(0.7, '#a7f3d0'); // Pale mint
    fGrad.addColorStop(1, '#fef08a'); // Yellow green tip
    fCtx.fillStyle = fGrad;
    fCtx.fill();

    // Black stripes
    fCtx.strokeStyle = '#0c0a09';
    fCtx.lineWidth = 12;
    const fVeins = [
      { sx: 40, sy: 470, ex: 480, ey: 20 },
      { sx: 40, sy: 470, ex: 440, ey: 120 },
      { sx: 40, sy: 470, ex: 420, ey: 240 },
      { sx: 40, sy: 470, ex: 410, ey: 340 }
    ];
    fVeins.forEach(v => {
      fCtx.beginPath();
      fCtx.moveTo(v.sx, v.sy);
      fCtx.lineTo(v.ex, v.ey);
      fCtx.stroke();
    });

    // Outer thick black border
    fCtx.lineWidth = 26;
    fCtx.beginPath();
    fCtx.moveTo(40, 470);
    fCtx.quadraticCurveTo(80, 200, 480, 20);
    fCtx.quadraticCurveTo(460, 250, 420, 380);
    fCtx.quadraticCurveTo(240, 420, 40, 470);
    fCtx.stroke();

    // White edge dots
    fCtx.fillStyle = '#ffffff';
    for (let i = 1; i <= 6; i++) {
      const ratio = i / 7;
      const px = 480 + (420 - 480) * ratio - 14;
      const py = 20 + (380 - 20) * ratio;
      fCtx.beginPath();
      fCtx.arc(px, py, 6, 0, Math.PI * 2);
      fCtx.fill();
    }

    // Hindwing
    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512;
    hCanvas.height = 512;
    const hCtx = hCanvas.getContext('2d');
    
    hCtx.beginPath();
    hCtx.moveTo(40, 40);
    hCtx.quadraticCurveTo(220, 60, 440, 110); // top border
    hCtx.quadraticCurveTo(450, 240, 360, 340); // outer side
    // Swallowtail tail tail extension!
    hCtx.lineTo(410, 490);
    hCtx.lineTo(360, 480);
    hCtx.lineTo(310, 380);
    hCtx.quadraticCurveTo(180, 290, 40, 40);
    hCtx.closePath();

    // Base emerald green
    const hGrad = hCtx.createLinearGradient(40, 40, 440, 110);
    hGrad.addColorStop(0, '#059669');
    hGrad.addColorStop(0.5, '#6ee7b7');
    hGrad.addColorStop(1, '#a7f3d0');
    hCtx.fillStyle = hGrad;
    hCtx.fill();

    // Black stripes
    hCtx.strokeStyle = '#0c0a09';
    hCtx.lineWidth = 10;
    const hVeins = [
      { sx: 40, sy: 40, ex: 440, ey: 110 },
      { sx: 40, sy: 40, ex: 360, ey: 340 },
      { sx: 40, sy: 40, ex: 410, ey: 490 },
      { sx: 40, sy: 40, ex: 310, ey: 380 }
    ];
    hVeins.forEach(v => {
      hCtx.beginPath();
      hCtx.moveTo(v.sx, v.sy);
      hCtx.lineTo(v.ex, v.ey);
      hCtx.stroke();
    });

    // Borders
    hCtx.lineWidth = 22;
    hCtx.beginPath();
    hCtx.moveTo(40, 40);
    hCtx.quadraticCurveTo(220, 60, 440, 110);
    hCtx.quadraticCurveTo(450, 240, 360, 340);
    hCtx.lineTo(410, 490);
    hCtx.lineTo(360, 480);
    hCtx.lineTo(310, 380);
    hCtx.quadraticCurveTo(180, 290, 40, 40);
    hCtx.stroke();

    // Orange & Red patches near tail
    hCtx.fillStyle = '#f97316'; // orange
    hCtx.beginPath();
    hCtx.arc(330, 310, 15, 0, Math.PI * 2);
    hCtx.fill();
    hCtx.fillStyle = '#ef4444'; // red
    hCtx.beginPath();
    hCtx.arc(295, 330, 12, 0, Math.PI * 2);
    hCtx.fill();

    // White margins
    hCtx.fillStyle = '#ffffff';
    hCtx.beginPath();
    hCtx.arc(420, 180, 6, 0, Math.PI * 2);
    hCtx.arc(390, 455, 5, 0, Math.PI * 2); // white spot on tail tip
    hCtx.fill();

    return {
      forewingTexture: new THREE.CanvasTexture(fCanvas),
      hindwingTexture: new THREE.CanvasTexture(hCanvas)
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Multi-axis natural flapping
    const flapAngle = Math.sin(time * 36.0) * 0.95;
    leftWingRef.current.rotation.y = flapAngle;
    leftWingRef.current.rotation.z = Math.cos(time * 36.0) * 0.12;
    rightWingRef.current.rotation.y = -flapAngle;
    rightWingRef.current.rotation.z = -Math.cos(time * 36.0) * 0.12;

    // Bobbing flight animation + tilt
    groupRef.current.position.y = Math.sin(time * 3.8) * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 2.2) * 0.06 - (state.pointer.y * 0.35);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.65, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, -0.02, 0]} rotation={[0.25, 0, 0]}>
      {/* Detailed Segmented Body */}
      {/* Abdomen (Striped) */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[0, -i * 0.032, 0.01]} castShadow>
          <sphereGeometry args={[0.016 - i * 0.0015, 12, 12]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#10b981' : '#111827'} 
            roughness={0.4} 
            metalness={0.5}
          />
        </mesh>
      ))}
      
      {/* Thorax (Fuzzy green metallic) */}
      <mesh position={[0, 0.04, 0.015]} scale={[1, 1.4, 1.1]} castShadow>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#0f523c" roughness={0.6} metalness={0.8} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.085, 0.02]} castShadow>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.3} />
      </mesh>

      {/* Proboscis (Coiled tongue) */}
      <mesh position={[0, 0.082, 0.036]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.008, 0.002, 6, 12]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>

      {/* Compound eyes */}
      <mesh position={[-0.012, 0.09, 0.028]} scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#052e16" roughness={0.1} metalness={0.6} />
      </mesh>
      <mesh position={[0.012, 0.09, 0.028]} scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#052e16" roughness={0.1} metalness={0.6} />
      </mesh>

      {/* Curved Antennae with knobs */}
      <group position={[0, 0.10, 0.026]}>
        <mesh position={[-0.012, 0.028, 0.01]} rotation={[0.2, 0.05, 0.18]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.08, 6]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[-0.024, 0.068, 0.02]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>

        <mesh position={[0.012, 0.028, 0.01]} rotation={[0.2, -0.05, -0.18]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.08, 6]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.024, 0.068, 0.02]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
      </group>

      {/* Folded legs */}
      {[
        { pos: [-0.012, 0.04, 0.005], rotZ: 0.5 },
        { pos: [-0.015, 0.02, 0.005], rotZ: 0.5 },
        { pos: [-0.012, 0.0, 0.005], rotZ: 0.5 },
        { pos: [0.012, 0.04, 0.005], rotZ: -0.5 },
        { pos: [0.015, 0.02, 0.005], rotZ: -0.5 },
        { pos: [0.012, 0.0, 0.005], rotZ: -0.5 }
      ].map((leg, idx) => (
        <mesh key={idx} position={leg.pos} rotation={[0.1, 0, leg.rotZ]} castShadow>
          <cylinderGeometry args={[0.0012, 0.0012, 0.03, 4]} />
          <meshStandardMaterial color="#0c0a09" />
        </mesh>
      ))}

      {/* Left Swallowtail Wing */}
      <group ref={leftWingRef} position={[-0.006, 0.04, 0.015]}>
        {/* Forewing */}
        <mesh position={[-0.14, 0.09, 0]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.28, 0.28]} />
          <meshPhysicalMaterial 
            map={forewingTexture} 
            transmission={0.4} 
            thickness={0.02}
            roughness={0.25} 
            clearcoat={0.8}
            transparent
            side={THREE.DoubleSide} 
          />
        </mesh>
        {/* Hindwing */}
        <mesh position={[-0.09, -0.09, -0.002]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.24, 0.24]} />
          <meshPhysicalMaterial 
            map={hindwingTexture} 
            transmission={0.4} 
            thickness={0.02}
            roughness={0.25} 
            clearcoat={0.8}
            transparent
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>

      {/* Right Swallowtail Wing (mirrored) */}
      <group ref={rightWingRef} position={[0.006, 0.04, 0.015]} scale={[-1, 1, 1]}>
        {/* Forewing */}
        <mesh position={[-0.14, 0.09, 0]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.28, 0.28]} />
          <meshPhysicalMaterial 
            map={forewingTexture} 
            transmission={0.4} 
            thickness={0.02}
            roughness={0.25} 
            clearcoat={0.8}
            transparent
            side={THREE.DoubleSide} 
          />
        </mesh>
        {/* Hindwing */}
        <mesh position={[-0.09, -0.09, -0.002]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.24, 0.24]} />
          <meshPhysicalMaterial 
            map={hindwingTexture} 
            transmission={0.4} 
            thickness={0.02}
            roughness={0.25} 
            clearcoat={0.8}
            transparent
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>
    </group>
  );
}

const InteractiveButterfly = () => {
  return (
    <div style={{ width: '80px', height: '80px', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 0.05, 0.54], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 2, 1]} intensity={1.8} color="#ffecd0" />
        <ButterflyModel />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default function BugAnalytics({ transactions, awareness, mood, journals }) {

  // 1. Gather correlations
  const generateCorrelations = () => {
    const insights = [];

    // Analyze Impulsive purchases vs Mood
    let impulsiveCount = 0;
    let impulsiveOnLowMood = 0;
    transactions.forEach(t => {
      if (t.type === 'impulsive') {
        impulsiveCount++;
        const transactionMood = mood[t.date];
        if (transactionMood === 'stressed' || transactionMood === 'down' || transactionMood === 'tired') {
          impulsiveOnLowMood++;
        }
      }
    });

    if (impulsiveCount > 0) {
      const percentage = Math.round((impulsiveOnLowMood / impulsiveCount) * 100);
      if (percentage >= 50) {
        insights.push({
          type: 'negative',
          title: 'Emotional Spend Trigger',
          text: `A high ratio (${percentage}%) of your impulsive expenses occurred on days when you felt Stressed, Down, or Tired. Pausing during low-energy states could improve financial margins.`
        });
      } else {
        insights.push({
          type: 'positive',
          title: 'Conscious Spending Buffer',
          text: `Your impulsive spending isn't highly correlated with lower mood cycles. Great job maintaining financial guardrails during emotional stresses!`
        });
      }
    }

    // Default guidance if logs are thin
    if (insights.length === 0) {
      insights.push({
        type: 'neutral',
        title: 'Gathering Brain Patterns',
        text: 'The Awareness Engine is tracking input patterns. Once you enter data over multiple days (e.g. log transactions, moods, sleep, and presence ratings), active correlations will emerge here.'
      });
    }

    return insights;
  };

  // 2. Render Spend & Mood SVG Timeline
  const renderMultiChart = () => {
    const last7Days = [];
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - tzoffset - (i * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
      
      const daySpend = transactions
        .filter(t => t.date === date)
        .reduce((acc, t) => acc + t.amount, 0);

      last7Days.push({
        dateStr: date,
        formattedDate: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        shortDate: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spend: daySpend,
        awareness: awareness[date] || 5, // fallback rating
        mainMood: mood[date] || ''
      });
    }

    const width = 600;
    const height = 250;
    const padding = { top: 20, right: 40, bottom: 40, left: 50 };

    let maxSpend = Math.max(...last7Days.map(d => d.spend), 50);
    maxSpend = Math.ceil(maxSpend / 100) * 100;

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const ticks = 4;
    const gridlines = [];
    for (let i = 0; i <= ticks; i++) {
      const y = padding.top + chartHeight - (i / ticks) * chartHeight;
      const value = (i / ticks) * maxSpend;
      gridlines.push({ y, label: `₹${value.toFixed(0)}` });
    }

    const barWidth = 20;
    const colStep = chartWidth / 7;
    const linePathPoints = [];

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Grid lines & Y-axis labels */}
        {gridlines.map((line, idx) => (
          <g key={idx}>
            <line x1={padding.left} y1={line.y} x2={width - padding.right} y2={line.y} stroke="var(--border-color)" strokeDasharray="4 4" />
            <text x={padding.left - 10} y={line.y + 4} fontSize="10" fill="var(--text-muted)" textAnchor="end">{line.label}</text>
          </g>
        ))}

        {/* X-axis text & Bars */}
        {last7Days.map((day, index) => {
          const cx = padding.left + (index * colStep) + (colStep / 2);
          const spendRatio = day.spend / maxSpend;
          const barHeight = spendRatio * chartHeight;
          const rx = cx - barWidth / 2;
          const ry = padding.top + chartHeight - barHeight;

          // Bar color based on mood, default sage
          let barColor = 'var(--sage)';
          if (day.mainMood === 'stressed') barColor = 'var(--ladybug)';
          else if (day.mainMood === 'excited') barColor = 'var(--amber)';
          else if (day.mainMood === 'tired') barColor = 'var(--dewdrop)';

          // Track awareness score coordinates
          const awarenessRatio = (day.awareness || 5) / 10;
          const ly = padding.top + chartHeight - (awarenessRatio * chartHeight);
          linePathPoints.push({ x: cx, y: ly, score: day.awareness, date: day.formattedDate });

          return (
            <g key={index}>
              <rect 
                x={rx} 
                y={ry} 
                width={barWidth} 
                height={barHeight} 
                fill={barColor} 
                opacity="0.8" 
                rx="4"
                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
              >
                <title>{day.formattedDate}: Spent ₹{day.spend.toFixed(2)} | Mood: {day.mainMood || 'None'}</title>
              </rect>
              <text x={cx} y={height - padding.bottom + 18} fontSize="10" fill="var(--text-muted)" textAnchor="middle">{day.shortDate}</text>
              {/* Spend value above bar */}
              {day.spend > 0 && (
                <text x={cx} y={ry - 6} fontSize="9" fill="var(--deep-forest)" textAnchor="middle" fontWeight="600">
                  ₹{day.spend.toFixed(0)}
                </text>
              )}
            </g>
          );
        })}

        {/* Awareness trend line — berry color */}
        {linePathPoints.length > 1 && (
          <path 
            d={`M ${linePathPoints[0].x} ${linePathPoints[0].y} ` + linePathPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')} 
            fill="none" 
            stroke="var(--berry)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        )}

        {/* Dots on line */}
        {linePathPoints.map((point, idx) => (
          <circle 
            key={idx}
            cx={point.x} 
            cy={point.y} 
            r="4" 
            fill="var(--bg-main)" 
            stroke="var(--berry)" 
            strokeWidth="2.5" 
            style={{ cursor: 'pointer' }}
          >
            <title>{point.date}: Awareness Score {point.score}/10</title>
          </circle>
        ))}

        {/* Legend */}
        <g transform={`translate(${padding.left}, ${height - 10})`}>
          <rect x="0" y="0" width="12" height="12" fill="var(--sage)" rx="2" />
          <text x="18" y="10" fontSize="10" fill="var(--text-muted)">Spent Amt</text>

          <line x1="120" y1="6" x2="140" y2="6" stroke="var(--berry)" strokeWidth="3" />
          <circle cx={130} cy={6} r="3" fill="var(--bg-main)" stroke="var(--berry)" strokeWidth="2" />
          <text x="148" y="10" fontSize="10" fill="var(--text-muted)">Presence Rating (1-10)</text>
        </g>
      </svg>
    );
  };

  const correlations = generateCorrelations();

  return (
    <div className="view-section active">
      <div className="view-header">
        <h2><AwarenessIcon /> Awareness Engine</h2>
        <p>Your Second Brain cross-references logs, plotting wellness trends and tracking emotional coordinates.</p>
      </div>

      <div className="analytics-grid">
        


        {/* Correlation boxes */}
        <div className="glass panel">
          <h3 className="panel-title"><CorrelationIcon /> Habit Correlation Index</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Botanical signals mapping physical, financial, and mindful presence parameters.
          </p>
          <div className="insight-list">
            {correlations.map((item, i) => {
              const typeStyle = item.type === 'positive' 
                ? { borderColor: 'var(--sage)', background: 'rgba(107,143,113,0.04)' } 
                : item.type === 'negative' 
                ? { borderColor: 'var(--ladybug)', background: 'rgba(196,69,54,0.04)' } 
                : {};
              return (
                <div key={i} className="correlation-box" style={typeStyle}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut slice */}
        <div className="glass panel">
          <h3 className="panel-title"><AcornIcon /> Acorn Allocation Category</h3>
          <div className="chart-card">
            {transactions.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>No transaction logs available.</div>
            ) : (
              (() => {
                let essential = 0, joyful = 0, impulsive = 0;
                transactions.forEach(t => {
                  if (t.type === 'essential') essential += t.amount;
                  else if (t.type === 'joyful') joyful += t.amount;
                  else if (t.type === 'impulsive') impulsive += t.amount;
                });
                const total = essential + joyful + impulsive;
                const donutSize = 160;
                const donutCenter = donutSize / 2;
                const dStrokeWidth = 18;
                const dRadius = donutCenter - dStrokeWidth;
                const dCirc = 2 * Math.PI * dRadius;
                const dChartData = [
                  { value: essential, color: 'var(--sage)' },
                  { value: joyful, color: 'var(--dewdrop)' },
                  { value: impulsive, color: 'var(--ladybug)' }
                ];
                let dAccumAngle = 0;

                return (
                  <>
                    <div style={{ width: '160px', height: '160px' }}>
                      <svg width="100%" height="100%" viewBox={`0 0 ${donutSize} ${donutSize}`}>
                        {dChartData.map((slice, idx) => {
                          if (slice.value === 0) return null;
                          const percentage = slice.value / total;
                          const strokeLength = dCirc * percentage;
                          const strokeOffset = dCirc - strokeLength + dAccumAngle;
                          dAccumAngle -= strokeLength;
                          return (
                            <circle 
                              key={idx}
                              cx={donutCenter}
                              cy={donutCenter}
                              r={dRadius}
                              fill="none"
                              stroke={slice.color}
                              strokeWidth={dStrokeWidth}
                              strokeDasharray={dCirc}
                              strokeDashoffset={strokeOffset}
                              transform={`rotate(-90 ${donutCenter} ${donutCenter})`}
                            />
                          );
                        })}
                        <text x={donutCenter} y={donutCenter + 5} textAnchor="middle" fontSize="12" fill="var(--deep-forest)" fontWeight="bold">
                          ₹{total.toFixed(0)}
                        </text>
                      </svg>
                    </div>
                    <div className="chart-legend" style={{ fontSize: '0.8rem', gap: '0.5rem' }}>
                      <div className="legend-item"><div className="legend-color" style={{ background: 'var(--sage)' }}></div><span>Roots</span></div>
                      <div className="legend-item"><div className="legend-color" style={{ background: 'var(--dewdrop)' }}></div><span>Nectar</span></div>
                      <div className="legend-item"><div className="legend-color" style={{ background: 'var(--ladybug)' }}></div><span>Pebbles</span></div>
                    </div>
                  </>
                );
              })()
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass panel" style={{ gridColumn: '1 / -1' }}>
          <h3 className="panel-title"><TrendIcon /> Spending &amp; Presence Trend (Last 7 Days)</h3>
          <div style={{ width: '100%', padding: '1rem 0' }}>
            {renderMultiChart()}
          </div>
        </div>

      </div>
    </div>
  );
}
