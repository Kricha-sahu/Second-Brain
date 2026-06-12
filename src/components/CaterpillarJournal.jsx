import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ===================== 3D Caterpillar ===================== */
function CaterpillarModel({ isTyping }) {
  const segmentsRef = useRef([]);
  const headRef = useRef();
  const groupRef = useRef();
  const leafRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = isTyping ? 36 : 6;
    const amp = isTyping ? 0.03 : 0.007;

    segmentsRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      mesh.position.y = -0.06 + Math.sin(time * speed - idx * 0.8) * amp;
      mesh.rotation.z = Math.cos(time * speed - idx * 0.8) * 0.08;
    });

    if (headRef.current) {
      if (isTyping) {
        headRef.current.rotation.z = Math.sin(time * 30.0) * 0.05;
        headRef.current.position.y = -0.03 + Math.sin(time * 30.0) * 0.01;
      } else {
        headRef.current.rotation.z = Math.sin(time * 3.0) * 0.02;
        headRef.current.position.y = -0.03;
      }
    }

    if (leafRef.current && isTyping) {
      leafRef.current.position.y = -0.05 + Math.sin(time * 30.0) * 0.008;
      leafRef.current.rotation.z = 0.15 + Math.cos(time * 30.0) * 0.03;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.3, 0.08);
    }
  });

  const segmentSpecs = [
    { r: 0.05, x: -0.22, c: '#80ed99' },
    { r: 0.056, x: -0.16, c: '#57cc99' },
    { r: 0.062, x: -0.09, c: '#80ed99' },
    { r: 0.066, x: -0.02, c: '#57cc99' },
    { r: 0.068, x: 0.05, c: '#80ed99' },
    { r: 0.065, x: 0.12, c: '#57cc99' }
  ];

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* Leaf base */}
      <mesh rotation={[0.12, 0.05, 0]} position={[0, -0.11, 0]} receiveShadow>
        <boxGeometry args={[0.55, 0.016, 0.28]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.95} />
      </mesh>
      {/* Chewed leaf in mouth */}
      <group ref={leafRef} position={[0.22, -0.05, 0.06]} rotation={[0.1, 0, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.006, 0.1]} />
          <meshStandardMaterial color="#40916c" roughness={0.8} />
        </mesh>
        <mesh position={[0.06, 0.002, 0.02]} scale={[0.8, 2, 0.8]}>
          <boxGeometry args={[0.04, 0.006, 0.04]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.9} />
        </mesh>
      </group>
      {/* Segments */}
      {segmentSpecs.map((spec, idx) => (
        <group key={idx} position={[spec.x, -0.06, 0]} ref={el => segmentsRef.current[idx] = el}>
          <mesh castShadow>
            <sphereGeometry args={[spec.r, 20, 20]} />
            <meshStandardMaterial color={spec.c} roughness={0.5} />
          </mesh>
          <mesh position={[0, spec.r * 0.5, spec.r * 0.7]} scale={[0.3, 0.3, 0.3]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} />
          </mesh>
          <mesh position={[0.01, -spec.r * 0.9, 0.03]} rotation={[0.1, 0, -0.15]} castShadow>
            <cylinderGeometry args={[0.006, 0.004, 0.03, 6]} />
            <meshStandardMaterial color="#38b000" roughness={0.7} />
          </mesh>
          <mesh position={[0.01, -spec.r * 0.9, -0.03]} rotation={[-0.1, 0, -0.15]} castShadow>
            <cylinderGeometry args={[0.006, 0.004, 0.03, 6]} />
            <meshStandardMaterial color="#38b000" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Head */}
      <group ref={headRef} position={[0.19, -0.03, 0.01]}>
        <mesh castShadow>
          <sphereGeometry args={[0.065, 20, 20]} />
          <meshStandardMaterial color="#38b000" roughness={0.5} />
        </mesh>
        <mesh position={[0.024, 0.014, 0.05]}>
          <sphereGeometry args={[0.013, 10, 10]} />
          <meshStandardMaterial color="#0b2512" roughness={0.15} />
        </mesh>
        <mesh position={[0.028, 0.018, 0.06]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[-0.024, 0.014, 0.05]}>
          <sphereGeometry args={[0.013, 10, 10]} />
          <meshStandardMaterial color="#0b2512" roughness={0.15} />
        </mesh>
        <mesh position={[-0.02, 0.018, 0.06]}>
          <sphereGeometry args={[0.004, 6, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.016, 0.056]} rotation={[0.1, 0, 0]}>
          <torusGeometry args={[0.01, 0.002, 4, 10, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <group position={[0, 0.045, 0.01]}>
          <group position={[0.018, 0.01, 0]} rotation={[0, 0, -0.22]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.006, 0.008, 0.05, 8]} />
              <meshStandardMaterial color="#ffea5c" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.3} />
            </mesh>
          </group>
          <group position={[-0.018, 0.01, 0]} rotation={[0, 0, 0.22]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.006, 0.008, 0.05, 8]} />
              <meshStandardMaterial color="#ffea5c" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.3} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

const CaterpillarWidget = ({ isTyping }) => (
  <div style={{ width: '120px', height: '72px', flexShrink: 0 }}>
    <Canvas camera={{ position: [0, 0.12, 0.52], fov: 42 }} gl={{ alpha: true }}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[1, 2, 1]} intensity={2.0} color="#c8ffd4" />
      <CaterpillarModel isTyping={isTyping} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  </div>
);

/* ===================== 3D Cocoon ===================== */
function CocoonModel({ shake }) {
  const groupRef = useRef();
  const { cocoonTexture, cocoonBumpTexture } = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f0e6'; ctx.fillRect(0, 0, 256, 512);
    ctx.strokeStyle = '#d4c5b3'; ctx.lineWidth = 1;
    for (let i = 0; i < 700; i++) {
      ctx.beginPath();
      const x = Math.random() * 256, y = Math.random() * 512;
      ctx.moveTo(x, y); ctx.lineTo(x + (Math.random() - 0.5) * 24, y + (Math.random() - 0.5) * 6); ctx.stroke();
    }
    ctx.fillStyle = '#1c1917';
    [
      { x: 128, y: 70, rx: 35, ry: 20 }, { x: 80, y: 110, rx: 22, ry: 15 },
      { x: 175, y: 125, rx: 28, ry: 18 }, { x: 60, y: 220, rx: 20, ry: 14 },
      { x: 200, y: 240, rx: 22, ry: 16 }, { x: 128, y: 390, rx: 42, ry: 30 },
      { x: 80, y: 440, rx: 24, ry: 18 }, { x: 180, y: 435, rx: 26, ry: 16 }
    ].forEach(s => {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.25) {
        const px = s.x + Math.cos(a) * s.rx * (0.85 + Math.sin(a * 4.2) * 0.15);
        const py = s.y + Math.sin(a) * s.ry * (0.85 + Math.cos(a * 3.7) * 0.15);
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    });
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 128; bCanvas.height = 256;
    const bCtx = bCanvas.getContext('2d');
    bCtx.fillStyle = '#808080'; bCtx.fillRect(0, 0, 128, 256);
    bCtx.strokeStyle = '#fff'; bCtx.lineWidth = 1.5;
    for (let i = 0; i < 400; i++) {
      bCtx.beginPath();
      const x = Math.random() * 128, y = Math.random() * 256;
      bCtx.moveTo(x, y); bCtx.lineTo(x + (Math.random() - 0.5) * 16, y + (Math.random() - 0.5) * 5); bCtx.stroke();
    }
    return { cocoonTexture: new THREE.CanvasTexture(canvas), cocoonBumpTexture: new THREE.CanvasTexture(bCanvas) };
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
      <mesh position={[-0.08, 0.08, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#54382c" roughness={0.9} />
      </mesh>
      <mesh position={[0.02, 0.02, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.1, 6]} />
        <meshStandardMaterial color="#ebe6db" roughness={0.8} />
      </mesh>
      <group position={[0.02, -0.16, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial map={cocoonTexture} bumpMap={cocoonBumpTexture} bumpScale={0.025} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.07, 0]} scale={[1, 1.3, 1]} castShadow>
          <coneGeometry args={[0.11, 0.14, 24, 1, true]} />
          <meshStandardMaterial map={cocoonTexture} bumpMap={cocoonBumpTexture} bumpScale={0.025} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.07, 0]} rotation={[Math.PI, 0, 0]} scale={[1, 1.4, 1]} castShadow>
          <coneGeometry args={[0.11, 0.14, 24, 1, true]} />
          <meshStandardMaterial map={cocoonTexture} bumpMap={cocoonBumpTexture} bumpScale={0.025} roughness={0.9} />
        </mesh>
        <pointLight color="#ffd700" intensity={0.8} distance={0.4} position={[0, 0, 0]} />
      </group>
    </group>
  );
}

const InteractiveCocoon = () => {
  const [shake, setShake] = useState(false);
  const handleTrigger = () => { setShake(true); setTimeout(() => setShake(false), 500); };
  return (
    <div onClick={handleTrigger} onMouseEnter={handleTrigger} style={{ width: '120px', height: '120px', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 0, 0.65], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[1, 2, 1]} intensity={1.8} color="#ffecd0" />
        <CocoonModel shake={shake} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

/* ===================== 3D Butterfly ===================== */
function ButterflyModel() {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  const { forewingTexture, hindwingTexture } = React.useMemo(() => {
    const fCanvas = document.createElement('canvas');
    fCanvas.width = 512; fCanvas.height = 512;
    const fCtx = fCanvas.getContext('2d');
    fCtx.beginPath();
    fCtx.moveTo(40, 470); fCtx.quadraticCurveTo(80, 200, 480, 20);
    fCtx.quadraticCurveTo(460, 250, 420, 380); fCtx.quadraticCurveTo(240, 420, 40, 470); fCtx.closePath();
    const fGrad = fCtx.createLinearGradient(40, 470, 480, 20);
    fGrad.addColorStop(0, '#10b981'); fGrad.addColorStop(0.3, '#34d399');
    fGrad.addColorStop(0.7, '#a7f3d0'); fGrad.addColorStop(1, '#fef08a');
    fCtx.fillStyle = fGrad; fCtx.fill();
    fCtx.strokeStyle = '#0c0a09'; fCtx.lineWidth = 12;
    [{ sx: 40, sy: 470, ex: 480, ey: 20 }, { sx: 40, sy: 470, ex: 440, ey: 120 },
     { sx: 40, sy: 470, ex: 420, ey: 240 }, { sx: 40, sy: 470, ex: 410, ey: 340 }
    ].forEach(v => { fCtx.beginPath(); fCtx.moveTo(v.sx, v.sy); fCtx.lineTo(v.ex, v.ey); fCtx.stroke(); });
    fCtx.lineWidth = 26; fCtx.beginPath();
    fCtx.moveTo(40, 470); fCtx.quadraticCurveTo(80, 200, 480, 20);
    fCtx.quadraticCurveTo(460, 250, 420, 380); fCtx.quadraticCurveTo(240, 420, 40, 470); fCtx.stroke();
    fCtx.fillStyle = '#ffffff';
    for (let i = 1; i <= 6; i++) {
      const ratio = i / 7;
      fCtx.beginPath(); fCtx.arc(480 + (420 - 480) * ratio - 14, 20 + (380 - 20) * ratio, 6, 0, Math.PI * 2); fCtx.fill();
    }

    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512; hCanvas.height = 512;
    const hCtx = hCanvas.getContext('2d');
    hCtx.beginPath(); hCtx.moveTo(40, 40);
    hCtx.quadraticCurveTo(220, 60, 440, 110); hCtx.quadraticCurveTo(450, 240, 360, 340);
    hCtx.lineTo(410, 490); hCtx.lineTo(360, 480); hCtx.lineTo(310, 380);
    hCtx.quadraticCurveTo(180, 290, 40, 40); hCtx.closePath();
    const hGrad = hCtx.createLinearGradient(40, 40, 440, 110);
    hGrad.addColorStop(0, '#059669'); hGrad.addColorStop(0.5, '#6ee7b7'); hGrad.addColorStop(1, '#a7f3d0');
    hCtx.fillStyle = hGrad; hCtx.fill();
    hCtx.strokeStyle = '#0c0a09'; hCtx.lineWidth = 10;
    [{ sx: 40, sy: 40, ex: 440, ey: 110 }, { sx: 40, sy: 40, ex: 360, ey: 340 },
     { sx: 40, sy: 40, ex: 410, ey: 490 }, { sx: 40, sy: 40, ex: 310, ey: 380 }
    ].forEach(v => { hCtx.beginPath(); hCtx.moveTo(v.sx, v.sy); hCtx.lineTo(v.ex, v.ey); fCtx.stroke(); });
    hCtx.lineWidth = 22; hCtx.beginPath();
    hCtx.moveTo(40, 40); hCtx.quadraticCurveTo(220, 60, 440, 110);
    hCtx.quadraticCurveTo(450, 240, 360, 340);
    hCtx.lineTo(410, 490); hCtx.lineTo(360, 480); hCtx.lineTo(310, 380);
    hCtx.quadraticCurveTo(180, 290, 40, 40); hCtx.stroke();
    hCtx.fillStyle = '#f97316'; hCtx.beginPath(); hCtx.arc(330, 310, 15, 0, Math.PI * 2); hCtx.fill();
    hCtx.fillStyle = '#ef4444'; hCtx.beginPath(); hCtx.arc(295, 330, 12, 0, Math.PI * 2); hCtx.fill();
    hCtx.fillStyle = '#ffffff'; hCtx.beginPath();
    hCtx.arc(420, 180, 6, 0, Math.PI * 2); hCtx.arc(390, 455, 5, 0, Math.PI * 2); hCtx.fill();
    return { forewingTexture: new THREE.CanvasTexture(fCanvas), hindwingTexture: new THREE.CanvasTexture(hCanvas) };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const flapAngle = Math.sin(time * 36.0) * 0.95;
    leftWingRef.current.rotation.y = flapAngle;
    leftWingRef.current.rotation.z = Math.cos(time * 36.0) * 0.12;
    rightWingRef.current.rotation.y = -flapAngle;
    rightWingRef.current.rotation.z = -Math.cos(time * 36.0) * 0.12;
    groupRef.current.position.y = Math.sin(time * 3.8) * 0.05;
    groupRef.current.rotation.x = Math.sin(time * 2.2) * 0.06 - (state.pointer.y * 0.35);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.65, 0.08);
  });

  const wingMat = { transmission: 0.4, thickness: 0.02, roughness: 0.25, clearcoat: 0.8, transparent: true, side: THREE.DoubleSide };
  return (
    <group ref={groupRef} position={[0, -0.02, 0]} rotation={[0.25, 0, 0]}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[0, -i * 0.032, 0.01]} castShadow>
          <sphereGeometry args={[0.016 - i * 0.0015, 12, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#10b981' : '#111827'} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0.015]} scale={[1, 1.4, 1.1]} castShadow>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#0f523c" roughness={0.6} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.085, 0.02]} castShadow>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.3} />
      </mesh>
      <group ref={leftWingRef} position={[-0.006, 0.04, 0.015]}>
        <mesh position={[-0.14, 0.09, 0]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.28, 0.28]} />
          <meshPhysicalMaterial map={forewingTexture} {...wingMat} />
        </mesh>
        <mesh position={[-0.09, -0.09, -0.002]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.24, 0.24]} />
          <meshPhysicalMaterial map={hindwingTexture} {...wingMat} />
        </mesh>
      </group>
      <group ref={rightWingRef} position={[0.006, 0.04, 0.015]} scale={[-1, 1, 1]}>
        <mesh position={[-0.14, 0.09, 0]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.28, 0.28]} />
          <meshPhysicalMaterial map={forewingTexture} {...wingMat} />
        </mesh>
        <mesh position={[-0.09, -0.09, -0.002]} rotation={[0, 0, 0.1]} castShadow>
          <planeGeometry args={[0.24, 0.24]} />
          <meshPhysicalMaterial map={hindwingTexture} {...wingMat} />
        </mesh>
      </group>
    </group>
  );
}

const InteractiveButterfly = () => (
  <div style={{ width: '160px', height: '160px', cursor: 'pointer' }}>
    <Canvas camera={{ position: [0, 0.03, 0.95], fov: 42 }} gl={{ alpha: true }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[1, 2, 1]} intensity={1.8} color="#ffecd0" />
      <ButterflyModel />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  </div>
);

/* ===================== Main Component ===================== */
export default function CaterpillarJournal({ journals, onAddJournal, onDeleteJournal, todayMood }) {
  const [body, setBody] = useState('');
  const [prompt, setPrompt] = useState('');
  const [date, setDate] = useState(() => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
  });
  const [isTyping, setIsTyping] = useState(false);

  // Metamorphosis panel hover tracking (barnaby-scurry style)
  const metamorphSectionRef = useRef(null);
  const [hoverCoords, setHoverCoords] = useState({ x: 88, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMetamorphMouseMove = (e) => {
    if (!metamorphSectionRef.current) return;
    const rect = metamorphSectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Padding bounds: keep model within card area
    setHoverCoords({
      x: Math.max(12, Math.min(88, x)),
      y: Math.max(25, Math.min(75, y))
    });
    setIsHovering(true);
  };

  const handleMetamorphMouseLeave = () => {
    setIsHovering(false);
  };

  // Chamber (metamorphosis) status
  const getChamber = () => {
    const count = journals.length;
    if (count >= 3) {
      return {
        hatched: true,
        title: 'Metamorphosis Achieved!',
        text: `${count} reflections archived. Cora has emerged — hover this section to attract her.`
      };
    }
    return {
      hatched: false,
      title: 'Caterpillar Chrysalis',
      text: `Reflections: ${count} / 3. Feed Cora more journals to spin the chrysalis!`
    };
  };

  const chamber = getChamber();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onAddJournal({ date, prompt, body, mood: todayMood || 'neutral' });
    setBody(''); setPrompt('');
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setIsTyping(true);
    const t = setTimeout(() => setIsTyping(false), 200);
    return () => clearTimeout(t);
  };

  const handlePromptChange = (e) => {
    const selected = e.target.value;
    setPrompt(selected);
    setBody(selected ? `Prompt: ${selected}\n\n` : '');
  };

  const getCaterpillarStatus = () => {
    const today = new Date().toISOString().slice(0, 10);
    const didWriteToday = journals.some(j => j.date === today);
    return didWriteToday
      ? { text: 'Mmm, chewing on these juicy reflections! You did great today.' }
      : { text: 'Wrapping myself in a cocoon... Archive an entry to help me grow!' };
  };

  const status = getCaterpillarStatus();

  return (
    <div className="cocoon-page" style={{ position: 'relative', zIndex: 1 }}>
      {/* ── 1. Page Header ── */}
      <div className="view-header" style={{ marginTop: 0, paddingTop: 0, marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', letterSpacing: '0.02em' }}>Cocoon Reflections</h2>
        <p>Cora the Caterpillar weaves your daily thoughts, struggles, and gratitude into a cocoon of self-awareness.</p>
      </div>

      {/* ── 2. Metamorphosis Achieved or Caterpillar Chrysalis section ── */}
      <div
        className="glass cocoon-card"
        ref={metamorphSectionRef}
        onMouseMove={handleMetamorphMouseMove}
        onMouseLeave={handleMetamorphMouseLeave}
        style={{
          position: 'relative',
          padding: '1.25rem 2rem',
          marginBottom: '1.5rem',
          minHeight: '108px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '72%', pointerEvents: 'none' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#c4b5fd' }}>
            {chamber.title}
          </h3>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.88rem', color: '#e9d5ff', lineHeight: '1.45' }}>
            {chamber.text}
          </p>
        </div>

        {/* 3D Model sitting at the right end, scurries within bounds on hover */}
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            left: chamber.hatched && isHovering ? `${hoverCoords.x}%` : '88%',
            top: chamber.hatched && isHovering ? `${hoverCoords.y}%` : '50%',
            transition: chamber.hatched && isHovering
              ? 'left 0.8s cubic-bezier(0.19, 1, 0.22, 1), top 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
              : 'left 0.5s ease-in-out, top 0.5s ease-in-out',
          }}
        >
          {chamber.hatched ? <InteractiveButterfly /> : <InteractiveCocoon />}
        </div>
      </div>

      {/* ── 3. Main Two-Column Layout ── */}
      <div className="journal-layout">
        
        {/* Left Column: Caterpillar speech card & Editor Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Caterpillar Speech Card */}
          <div className="cocoon-header-caterpillar" style={{ position: 'relative', paddingRight: '100px', minHeight: '56px', width: '100%', maxWidth: 'none', boxSizing: 'border-box' }}>
            <div className="cocoon-header-speech">
              <p className="cocoon-speech-text">{status.text}</p>
            </div>
            {/* Crawling 3D Caterpillar at the top right of this section */}
            <div style={{ position: 'absolute', right: '-8px', top: '-28px', pointerEvents: 'none', zIndex: 10 }}>
              <CaterpillarWidget isTyping={isTyping} />
            </div>
          </div>

          {/* Editor Card */}
          <div className="glass journal-editor-card cocoon-card">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Reflection Date</label>
                  <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Cocoon Prompts</label>
                  <select className="input-field" value={prompt} onChange={handlePromptChange}>
                    <option value="">-- Free Write --</option>
                    <option value="What triggered negative feelings today, and why?">Triggers &amp; Reactions Check</option>
                    <option value="Identify two key spending events today. Were they intentional?">Mindful Finance Assessment</option>
                    <option value="How did your physical state affect your focus and mood?">Wellness Integration Check</option>
                    <option value="What are you grateful for in this exact moment?">Gratitude &amp; Presence Anchor</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Reflection Narrative</label>
                <textarea
                  rows="8"
                  className="input-field"
                  value={body}
                  onChange={handleBodyChange}
                  placeholder="Let your thoughts unfurl like a new fern frond..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                Archive in Cocoon
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Reflection Archival */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 className="panel-title" style={{ marginBottom: 0 }}>Reflection Archival</h3>
          <div className="journal-logs-container">
            {journals.length === 0 ? (
              <div className="todo-item cocoon-card" style={{ borderStyle: 'dashed', justifyContent: 'center', padding: '2rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  The leaf is empty. Archive a reflection to start.
                </span>
              </div>
            ) : (
              journals.map(j => (
                <div key={j.id} className="glass journal-card cocoon-card">
                  <div className="journal-card-header">
                    <span className="journal-date" style={{ fontWeight: '700', color: '#c4b5fd' }}>
                      {new Date(j.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="journal-body">{j.body}</p>
                  <div className="journal-card-footer" style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      onClick={() => onDeleteJournal(j.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
