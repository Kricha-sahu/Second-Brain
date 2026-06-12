import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import AmbientBeetle from './AmbientBeetle';
import AcornVaultBackdrop from './AcornVaultBackdrop';

const AcornIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}>
    <ellipse cx="12" cy="15" rx="5" ry="6" />
    <path d="M7 12c0-2 2-4 5-4s5 2 5 4" />
    <rect x="8" y="9" width="8" height="4" rx="2" />
    <line x1="12" y1="5" x2="12" y2="9" />
    <path d="M12 5c1-2 3-3 4-2" />
  </svg>
);

function BeetleModel({ isScurrying }) {
  const groupRef = useRef();
  const antennaeRef = useRef();
  const shellRef = useRef();
  const thighRefs = useRef([]);
  const shinRefs = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = isScurrying ? 45 : 4;
    
    // Scurry animations
    thighRefs.current.forEach((thigh, i) => {
      if (!thigh) return;
      const multiplier = i % 2 === 0 ? 1 : -1;
      const legPhase = i * 2.09;
      const lift = Math.max(0, Math.sin(time * speed + legPhase));
      const swing = Math.cos(time * speed + legPhase);

      thigh.rotation.z = multiplier * (0.35 + lift * (isScurrying ? 0.35 : 0.08));
      thigh.rotation.y = swing * (isScurrying ? 0.38 : 0.08);

      if (shinRefs.current[i]) {
        shinRefs.current[i].rotation.z = multiplier * (-0.6 - lift * (isScurrying ? 0.45 : 0.08));
      }
    });

    // Antennae twitching
    if (antennaeRef.current) {
      antennaeRef.current.rotation.z = Math.sin(time * 8.0) * 0.1;
      antennaeRef.current.rotation.x = Math.cos(time * 5.0) * 0.08;
    }

    // Shell wiggling when scurrying
    if (shellRef.current && isScurrying) {
      shellRef.current.position.y = 0.02 + Math.sin(time * 48) * 0.005;
      shellRef.current.rotation.z = Math.sin(time * 48) * 0.04;
    }

    // Mouse parallax tilt
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.5, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.3, 0.08);
    }
  });

  // Create spots for Hercules beetle shell mapping
  const { spotsTexture } = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#cda052'; // Hercules golden brown
    ctx.fillRect(0, 0, 128, 128);

    // Draw irregular dark spots
    ctx.fillStyle = '#221105';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const r = 5 + Math.random() * 8;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return { spotsTexture: new THREE.CanvasTexture(canvas) };
  }, []);

  const legs = [
    { pos: [-0.08, 0.01, 0.06], side: 1, angle: 1 },    // FL
    { pos: [-0.09, 0.01, -0.01], side: 1, angle: 0 },   // ML
    { pos: [-0.08, 0.01, -0.07], side: 1, angle: -1 },  // BL
    { pos: [0.08, 0.01, 0.06], side: -1, angle: 1 },    // FR
    { pos: [0.09, 0.01, -0.01], side: -1, angle: 0 },   // MR
    { pos: [0.08, 0.01, -0.07], side: -1, angle: -1 }   // BR
  ];

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* Head */}
      <mesh position={[0, 0.015, 0.12]} castShadow>
        <sphereGeometry args={[0.058, 16, 16]} />
        <meshStandardMaterial color="#1f120c" roughness={0.2} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.038, 0.02, 0.15]} scale={[1, 1, 0.8]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000" roughness={0.05} />
      </mesh>
      <mesh position={[0.038, 0.02, 0.15]} scale={[1, 1, 0.8]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#000" roughness={0.05} />
      </mesh>

      {/* Thorax */}
      <mesh position={[0, 0.01, 0.04]} scale={[1.15, 0.9, 1.05]} castShadow>
        <sphereGeometry args={[0.078, 16, 16]} />
        <meshStandardMaterial color="#2b1a0d" roughness={0.25} />
      </mesh>

      {/* Hercules Horns */}
      {/* Thorax upper horn */}
      <group position={[0, 0.06, 0.05]} rotation={[-0.1, 0, 0]}>
        <mesh position={[0, 0.05, 0.06]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.014, 0.16, 8]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.11, 0.12]} rotation={[1.0, 0, 0]} castShadow>
          <coneGeometry args={[0.01, 0.04, 8]} />
          <meshStandardMaterial color="#0f0805" roughness={0.5} />
        </mesh>
      </group>
      {/* Head lower horn */}
      <group position={[0, -0.01, 0.14]} rotation={[0.15, 0, 0]}>
        <mesh position={[0, 0.03, 0.06]} rotation={[-0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.012, 0.12, 8]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.6} />
        </mesh>
      </group>

      {/* Elytra (Wing Shell Covers) */}
      <group ref={shellRef} position={[0, 0.01, -0.06]}>
        <mesh position={[-0.042, 0.01, -0.05]} rotation={[0.05, 0.04, 0.02]} scale={[1, 0.8, 1.3]} castShadow>
          <sphereGeometry args={[0.09, 16, 16, 0, Math.PI]} />
          <meshPhysicalMaterial 
            map={spotsTexture}
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
        <mesh position={[0.042, 0.01, -0.05]} rotation={[0.05, -0.04, -0.02]} scale={[1, 0.8, 1.3]} castShadow>
          <sphereGeometry args={[0.09, 16, 16, 0, Math.PI]} />
          <meshPhysicalMaterial 
            map={spotsTexture}
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
      </group>

      {/* Antennae */}
      <group ref={antennaeRef} position={[0, 0.03, 0.14]}>
        <mesh position={[-0.022, 0.025, 0.025]} rotation={[0.2, 0.35, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.022, 0.025, 0.025]} rotation={[0.2, -0.35, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* 6 wiggling legs using the jointed femur/tibia setup */}
      {legs.map((leg, i) => (
        <group key={i} position={leg.pos}>
          {/* Coxa/Femur */}
          <group 
            ref={el => thighRefs.current[i] = el}
            rotation={[0, 0, leg.side * 0.3]}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.009, 0.007, 0.07, 6]} />
              <meshStandardMaterial color="#1a0f0a" roughness={0.7} />
            </mesh>
            
            {/* Tibia/Shin */}
            <group 
              ref={el => shinRefs.current[i] = el} 
              position={[0, -0.035, 0]} 
              rotation={[0, 0, leg.side * -0.5]}
            >
              <mesh castShadow>
                <cylinderGeometry args={[0.006, 0.004, 0.08, 6]} />
                <meshStandardMaterial color="#1f120c" roughness={0.8} />
              </mesh>
              
              {/* Tarsus */}
              <group position={[0, -0.04, 0]} rotation={[0, 0, leg.side * 0.2]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.003, 0.001, 0.035, 4]} />
                  <meshStandardMaterial color="#0f0805" roughness={0.9} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Beetles perched around a jar rim (nectar attracts the most visitors) */
const JarBeetle = ({ type, style }) => (
  <div className="jar-beetle" style={{ position: 'absolute', zIndex: 20, ...style }}>
    <AmbientBeetle type={type} style={{ width: '100%', height: '100%' }} />
  </div>
);

const InteractiveBeetle = ({ isScurrying, onHover }) => {
  return (
    <div 
      onMouseEnter={onHover}
      style={{
        width: '56px',
        height: '56px',
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      <Canvas camera={{ position: [0, 0.38, 0.38], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[1, 2, 1]} intensity={1.8} color="#ffecd0" />
        <BeetleModel isScurrying={isScurrying} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};


export default function BeetleFinance({ transactions, budget, onAddTransaction, onDeleteTransaction, onUpdateBudget }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('essential');
  const [date, setDate] = useState(() => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
  });
  const [budgetVal, setBudgetVal] = useState(budget);

  const [beetlePos, setBeetlePos] = useState({
    top: '55%',
    left: '48%',
    right: 'auto',
    bottom: 'auto',
    transform: 'rotate(-15deg)',
  });
  const [isScurrying, setIsScurrying] = useState(false);

  const handleBeetleHover = () => {
    if (isScurrying) return;
    setIsScurrying(true);

    const edge = Math.floor(Math.random() * 4);
    const percent = Math.floor(15 + Math.random() * 70) + '%';
    
    let newPos = {};
    if (edge === 0) {
      newPos = { top: '-15px', left: percent, right: 'auto', bottom: 'auto', transform: 'rotate(90deg)' };
    } else if (edge === 1) {
      newPos = { top: percent, left: 'auto', right: '-15px', bottom: 'auto', transform: 'rotate(180deg)' };
    } else if (edge === 2) {
      newPos = { top: 'auto', left: percent, right: 'auto', bottom: '-15px', transform: 'rotate(270deg)' };
    } else {
      newPos = { top: percent, left: '-15px', right: 'auto', bottom: 'auto', transform: 'rotate(0deg)' };
    }

    setBeetlePos(newPos);
    setTimeout(() => {
      setIsScurrying(false);
    }, 600);
  };

  const typeLabels = {
    essential: { label: 'Seeds & Roots', color: 'var(--sage)' },
    joyful: { label: 'Sweet Nectar', color: 'var(--dewdrop)' },
    impulsive: { label: 'Shiny Pebbles', color: 'var(--ladybug)' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;
    onAddTransaction({
      desc,
      amount: parseFloat(amount),
      type,
      date
    });
    setDesc('');
    setAmount('');
  };

  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonthPrefix));

  let essential = 0, joyful = 0, impulsive = 0;
  monthlyTransactions.forEach(t => {
    if (t.type === 'essential') essential += t.amount;
    else if (t.type === 'joyful') joyful += t.amount;
    else if (t.type === 'impulsive') impulsive += t.amount;
  });

  const thisMonthTotal = essential + joyful + impulsive;
  const budgetFillPercent = Math.min(100, (thisMonthTotal / budget) * 100);

  const budgetBarColor =
    budgetFillPercent >= 90 ? 'var(--ladybug)' :
    budgetFillPercent >= 75 ? 'var(--amber)' :
    'var(--sage)';

  return (
    <div className="view-section active coin-vault-view">
      <AcornVaultBackdrop />

      <div className="view-header">
        <h2><AcornIcon /> Acorn Coin Vault</h2>
        <p>Barnaby the Beetle guards the nectar jars below. Hover near the sweet stuff to watch him scurry — catch him if you can!</p>
      </div>

      <div className="coin-vault-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Row: Budget Limit & Add Entry */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }} className="finance-top-grid">
          
          {/* 1. Vault Budget Limit Card */}
          <div className="pebble-panel-1">
            <h3 className="panel-title">Vault Budget Limit</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Set your total monthly acorn collection limit. Jars partition this budget automatically (50% / 30% / 20%).
            </p>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Monthly Threshold (₹)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input 
                  type="number" 
                  className="input-field" 
                  value={budgetVal} 
                  onChange={(e) => setBudgetVal(parseFloat(e.target.value) || 0)} 
                  min="1" 
                />
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => onUpdateBudget(budgetVal)}
                >
                  Update
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Usage status:</span>
                <span style={{ fontWeight: '700' }}>₹{thisMonthTotal.toFixed(0)} / ₹{budget.toLocaleString()}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${budgetFillPercent}%`, 
                    height: '100%', 
                    background: budgetBarColor, 
                    transition: 'width 0.3s ease, background 0.3s ease' 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* 2. Add Coin Entry Card */}
          <div className="pebble-panel-2">
            <h3 className="panel-title">Add Coin Entry</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Acorn Description</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  placeholder="e.g. Organic Greens, Leaf Polish" 
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    step="0.01" 
                    min="0.01" 
                    placeholder="250.00"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Acorn Allocation Type</label>
                  <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="essential">Seeds &amp; Roots (Needs)</option>
                    <option value="joyful">Sweet Nectar (Wants)</option>
                    <option value="impulsive">Shiny Pebbles (Impulsive)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Date Collected</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Log to Vault</button>
            </form>
          </div>

        </div>

        {/* Middle Row: Remaining Budget Jars */}
        <div className="pebble-panel-wide jars-beetle-stage">
          <div
            className="barnaby-scurry"
            style={{
              top: beetlePos.top,
              left: beetlePos.left,
              right: beetlePos.right,
              bottom: beetlePos.bottom,
              transform: beetlePos.transform,
            }}
          >
            <InteractiveBeetle isScurrying={isScurrying} onHover={handleBeetleHover} />
          </div>

          <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AcornIcon /> Remaining Budget Jars</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Each jar holds your remaining nectar. Barnaby and his friends linger where it&apos;s sweetest — hover a beetle to watch them scurry.
          </p>

          <div className="jars-container">
            
            {/* Needs Jar */}
            {(() => {
              const cap = budget * 0.5;
              const rem = cap - essential;
              const fill = cap > 0 ? Math.max(0, Math.min(100, (rem / cap) * 100)) : 0;
              const isOver = rem < 0;
              
              // Seed particles
              const particles = [];
              if (fill > 0) {
                for (let i = 0; i < 6; i++) {
                  particles.push(
                    <div 
                      key={i} 
                      className="seed-particle" 
                      style={{
                        left: `${15 + i * 15}%`,
                        bottom: `${10 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.7}s`,
                        opacity: 0.2 + Math.random() * 0.3
                      }}
                    />
                  );
                }
              }

              return (
                <div className="money-jar-wrap">
                  <JarBeetle type="cicada" style={{ left: '-12px', top: '72px', width: '36px', height: '36px' }} />
                  <JarBeetle type="stag" style={{ right: '0px', top: '20px', width: '32px', height: '32px', transform: 'rotate(25deg)' }} />
                  <div className="money-jar">
                    <div className="jar-cork"></div>
                    <div className="jar-neck"></div>
                    <div className="jar-body">
                      <div className="jar-glare"></div>
                      <div className="jar-liquid" style={{ height: `${fill}%`, background: 'linear-gradient(180deg, rgba(82, 171, 102, 0.82) 0%, rgba(33, 91, 51, 0.92) 100%)' }}>
                        <div className="jar-wave-1"></div>
                        <div className="jar-wave-2"></div>
                        <div className="jar-particles">{particles}</div>
                      </div>
                      <div className="jar-content">
                        <span className="jar-sub">Needs (50%)</span>
                        <span className="jar-title">Seeds &amp; Roots</span>
                        <span className="jar-amount">₹{rem.toFixed(0)}</span>
                        <span className="jar-limit">of ₹{cap.toFixed(0)} left</span>
                        <span className={`jar-status ${isOver ? 'overdrawn' : ''}`}>
                          {isOver ? `Overdrawn: ₹${Math.abs(rem).toFixed(0)}` : `${fill.toFixed(0)}% Full`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Wants Jar — sweet nectar draws the most beetles */}
            {(() => {
              const cap = budget * 0.3;
              const rem = cap - joyful;
              const fill = cap > 0 ? Math.max(0, Math.min(100, (rem / cap) * 100)) : 0;
              const isOver = rem < 0;
              
              // Bubbles particles
              const particles = [];
              if (fill > 0) {
                for (let i = 0; i < 7; i++) {
                  particles.push(
                    <div 
                      key={i} 
                      className="particle" 
                      style={{
                        width: `${4 + Math.random() * 6}px`,
                        height: `${4 + Math.random() * 6}px`,
                        left: `${15 + i * 13}%`,
                        bottom: `${10 + Math.random() * 50}%`,
                        animationDelay: `${i * 0.5}s`,
                        opacity: 0.3 + Math.random() * 0.4
                      }}
                    />
                  );
                }
              }

              return (
                <div className="money-jar-wrap money-jar-wrap--nectar">
                  <JarBeetle type="ladybug" style={{ left: '-18px', bottom: '48px', width: '40px', height: '40px' }} />
                  <JarBeetle type="hercules" style={{ right: '-16px', top: '58px', width: '44px', height: '44px' }} />
                  <JarBeetle type="jewel" style={{ left: '50%', bottom: '12px', width: '34px', height: '34px', transform: 'translateX(-50%)' }} />
                  <JarBeetle type="ladybug" style={{ right: '8px', bottom: '72px', width: '32px', height: '32px' }} />
                  <JarBeetle type="jewel" style={{ left: '20px', top: '-15px', width: '38px', height: '38px', transform: 'rotate(-45deg)' }} />
                  <JarBeetle type="cicada" style={{ right: '10px', top: '-25px', width: '42px', height: '42px', transform: 'rotate(60deg)' }} />
                  <JarBeetle type="ladybug" style={{ left: '40%', top: '-20px', width: '30px', height: '30px' }} />
                  <div className="money-jar">
                    <div className="jar-cork"></div>
                    <div className="jar-neck"></div>
                    <div className="jar-body">
                      <div className="jar-glare"></div>
                      <div className="jar-liquid" style={{ height: `${fill}%`, background: 'linear-gradient(180deg, rgba(245, 175, 73, 0.88) 0%, rgba(191, 115, 27, 0.98) 100%)' }}>
                        <div className="jar-wave-1"></div>
                        <div className="jar-wave-2"></div>
                        <div className="jar-particles">{particles}</div>
                      </div>
                      <div className="jar-content">
                        <span className="jar-sub">Wants (30%)</span>
                        <span className="jar-title">Sweet Nectar</span>
                        <span className="jar-amount">₹{rem.toFixed(0)}</span>
                        <span className="jar-limit">of ₹{cap.toFixed(0)} left</span>
                        <span className={`jar-status ${isOver ? 'overdrawn' : ''}`}>
                          {isOver ? `Overdrawn: ₹${Math.abs(rem).toFixed(0)}` : `${fill.toFixed(0)}% Full`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Impulsive Jar */}
            {(() => {
              const cap = budget * 0.2;
              const rem = cap - impulsive;
              const fill = cap > 0 ? Math.max(0, Math.min(100, (rem / cap) * 100)) : 0;
              const isOver = rem < 0;
              
              // Pebble particles
              const particles = [];
              if (fill > 0) {
                for (let i = 0; i < 6; i++) {
                  particles.push(
                    <div 
                      key={i} 
                      className="pebble-particle" 
                      style={{
                        width: `${6 + Math.random() * 8}px`,
                        height: `${5 + Math.random() * 6}px`,
                        left: `${15 + i * 15}%`,
                        bottom: `${10 + Math.random() * 30}%`,
                        animationDelay: `${i * 0.9}s`,
                        opacity: 0.25 + Math.random() * 0.35
                      }}
                    />
                  );
                }
              }

              return (
                <div className="money-jar-wrap">
                  <JarBeetle type="stag" style={{ right: '-14px', top: '78px', width: '38px', height: '38px' }} />
                  <JarBeetle type="ladybug" style={{ left: '-10px', bottom: '56px', width: '34px', height: '34px' }} />
                  <JarBeetle type="hercules" style={{ left: '15px', top: '-10px', width: '36px', height: '36px', transform: 'rotate(-15deg)' }} />
                  <div className="money-jar">
                    <div className="jar-cork"></div>
                    <div className="jar-neck"></div>
                    <div className="jar-body">
                      <div className="jar-glare"></div>
                      <div className="jar-liquid" style={{ height: `${fill}%`, background: 'linear-gradient(180deg, rgba(230, 94, 94, 0.85) 0%, rgba(153, 38, 38, 0.95) 100%)' }}>
                        <div className="jar-wave-1"></div>
                        <div className="jar-wave-2"></div>
                        <div className="jar-particles">{particles}</div>
                      </div>
                      <div className="jar-content">
                        <span className="jar-sub">Impulsive (20%)</span>
                        <span className="jar-title">Shiny Pebbles</span>
                        <span className="jar-amount">₹{rem.toFixed(0)}</span>
                        <span className="jar-limit">of ₹{cap.toFixed(0)} left</span>
                        <span className={`jar-status ${isOver ? 'overdrawn' : ''}`}>
                          {isOver ? `Overdrawn: ₹${Math.abs(rem).toFixed(0)}` : `${fill.toFixed(0)}% Full`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Bottom Row: Vault Records */}
        <div className="pebble-panel-records">
          <h3 className="panel-title">Vault Records</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Sort</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '1.5rem' }}>
                      No transactions registered yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.desc}</strong></td>
                      <td>{t.date.slice(5)}</td>
                      <td>
                        <span className={`tag tag-${t.type}`}>
                          {typeLabels[t.type]?.label || t.type}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-title)', fontWeight: 600 }}>₹{t.amount.toFixed(2)}</td>
                      <td>
                        <button 
                          type="button"
                          className="todo-delete" 
                          onClick={() => onDeleteTransaction(t.id)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
