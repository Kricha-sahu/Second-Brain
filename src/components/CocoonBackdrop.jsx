import React from 'react';

// Fairy Forest Backdrop — Branches, Flowers, Fireflies, Fairies
export default function CocoonBackdrop() {
  const branches = [
    // Top-left corner large branch
    { d: 'M-20,-30 Q80,60 140,180 Q170,250 130,340', w: 18, c: '#2d1b0e', sub: [
      { d: 'M80,60 Q120,30 170,50', w: 7 },
      { d: 'M110,130 Q150,100 200,115', w: 6 },
      { d: 'M125,200 Q165,170 210,185', w: 5 },
    ]},
    // Top-right corner large branch
    { d: 'M820,-30 Q720,70 660,200 Q630,280 670,380', w: 20, c: '#2d1b0e', sub: [
      { d: 'M720,70 Q680,40 640,60', w: 8 },
      { d: 'M690,150 Q650,115 600,130', w: 7 },
      { d: 'M665,230 Q625,200 578,215', w: 5 },
    ]},
    // Upper mid left
    { d: 'M0,120 Q80,100 160,150 Q210,175 240,240', w: 12, c: '#3a2010', sub: [
      { d: 'M80,100 Q90,65 130,70', w: 5 },
      { d: 'M160,150 Q175,120 215,120', w: 4 },
    ]},
    // Upper mid right
    { d: 'M800,100 Q720,85 650,145 Q610,175 580,240', w: 12, c: '#3a2010', sub: [
      { d: 'M720,85 Q710,50 670,58', w: 5 },
      { d: 'M650,145 Q635,112 595,118', w: 4 },
    ]},
    // Lower left diagonal
    { d: 'M-10,500 Q60,450 130,490 Q180,510 210,570', w: 10, c: '#2a1a08', sub: [] },
    // Lower right diagonal
    { d: 'M810,510 Q740,460 675,500 Q630,520 605,575', w: 10, c: '#2a1a08', sub: [] },
  ];

  // Flower clusters [x, y, petals color, center color, size]
  const flowers = [
    { x: 155, y: 155, pc: '#e879f9', cc: '#fef08a', r: 8 },
    { x: 125, y: 195, pc: '#c084fc', cc: '#fde68a', r: 6 },
    { x: 175, y: 230, pc: '#f0abfc', cc: '#fff3b0', r: 7 },
    { x: 198, y: 165, pc: '#a78bfa', cc: '#fbbf24', r: 5 },
    { x: 660, y: 190, pc: '#fb7185', cc: '#fef08a', r: 8 },
    { x: 630, y: 155, pc: '#f9a8d4', cc: '#fde68a', r: 6 },
    { x: 590, y: 210, pc: '#e879f9', cc: '#fff3b0', r: 7 },
    { x: 674, y: 225, pc: '#c084fc', cc: '#fbbf24', r: 5 },
    { x: 230, y: 245, pc: '#fb923c', cc: '#fef3c7', r: 5 },
    { x: 560, y: 245, pc: '#f472b6', cc: '#fef3c7', r: 5 },
    { x: 80, y: 100, pc: '#e879f9', cc: '#fef08a', r: 6 },
    { x: 715, y: 95, pc: '#fb7185', cc: '#fef08a', r: 6 },
    { x: 115, y: 325, pc: '#c084fc', cc: '#fde68a', r: 5 },
    { x: 655, y: 330, pc: '#f9a8d4', cc: '#fde68a', r: 5 },
    { x: 300, y: 15, pc: '#e879f9', cc: '#fef08a', r: 6 },
    { x: 480, y: 10, pc: '#c084fc', cc: '#fde68a', r: 7 },
    { x: 395, y: 580, pc: '#a78bfa', cc: '#fbbf24', r: 6 },
    { x: 150, y: 500, pc: '#fb7185', cc: '#fef3c7', r: 5 },
    { x: 640, y: 510, pc: '#f472b6', cc: '#fef3c7', r: 5 },
  ];

  // Fairy positions [x, y, size, direction(1 or -1), opacity]
  const fairies = [
    { x: 300, y: 190, s: 1.1, d: 1, o: 0.8 },
    { x: 500, y: 170, s: 1.0, d: -1, o: 0.75 },
    { x: 110, y: 80, s: 1.1, d: 1, o: 0.7 },
    { x: 690, y: 72, s: 1.0, d: -1, o: 0.65 },
    { x: 200, y: 150, s: 0.8, d: 1, o: 0.5 },
    { x: 600, y: 140, s: 0.9, d: -1, o: 0.55 },
    { x: 60, y: 250, s: 0.7, d: 1, o: 0.45 },
    { x: 745, y: 280, s: 0.75, d: -1, o: 0.48 },
    { x: 185, y: 420, s: 0.65, d: 1, o: 0.42 },
    { x: 615, y: 400, s: 0.7, d: -1, o: 0.44 },
    { x: 380, y: 50, s: 0.85, d: 1, o: 0.6 },
    { x: 430, y: 580, s: 0.7, d: -1, o: 0.4 },
  ];

  // Glowing firefly dots [x, y, duration (ms), delay]
  const fireflies = [
    { x: 220, y: 160, dur: 2.8, del: 0 },
    { x: 380, y: 220, dur: 3.2, del: 0.5 },
    { x: 420, y: 100, dur: 2.5, del: 1.0 },
    { x: 140, y: 310, dur: 3.5, del: 0.2 },
    { x: 680, y: 280, dur: 2.7, del: 0.8 },
    { x: 320, y: 490, dur: 3.0, del: 0.3 },
    { x: 490, y: 520, dur: 2.9, del: 1.2 },
    { x: 420, y: 280, dur: 3.4, del: 0.7 },
    { x: 70, y: 450, dur: 2.6, del: 1.5 },
    { x: 730, y: 460, dur: 3.1, del: 0.6 },
    { x: 250, y: 55, dur: 2.3, del: 0.9 },
    { x: 600, y: 50, dur: 2.8, del: 1.1 },
  ];

  // Draw petal around cx,cy
  const petalPath = (cx, cy, r, angle) => {
    const rad = (angle * Math.PI) / 180;
    const px = cx + Math.cos(rad) * r * 1.8;
    const py = cy + Math.sin(rad) * r * 1.8;
    return `M${cx},${cy} Q${cx + Math.cos(rad + 0.7) * r},${cy + Math.sin(rad + 0.7) * r} ${px},${py} Q${cx + Math.cos(rad - 0.7) * r},${cy + Math.sin(rad - 0.7) * r} ${cx},${cy}`;
  };

  return (
    <svg
      className="cocoon-backdrop"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Deep magical forest night sky */}
        <linearGradient id="cocoonSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0714" />
          <stop offset="35%" stopColor="#0f0c2e" />
          <stop offset="65%" stopColor="#17162b" />
          <stop offset="100%" stopColor="#0b140f" />
        </linearGradient>

        {/* Soft moonlight radial glow */}
        <radialGradient id="moonGlow" cx="50%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#e8d5ff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#b39ddb" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#12103a" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0d0a1a" stopOpacity="0" />
        </radialGradient>

        {/* Moonlight rays */}
        <linearGradient id="moonRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d5ff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#12103a" stopOpacity="0" />
        </linearGradient>

        {/* Fairy glow */}
        <radialGradient id="fairyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0f4ff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#c4b5fd" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>

        {/* Firefly glow */}
        <radialGradient id="fireflyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
          <stop offset="50%" stopColor="#fde047" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>

        {/* Trunk gradient */}
        <linearGradient id="trunkGradCocoon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a0f06" />
          <stop offset="50%" stopColor="#2d1b0e" />
          <stop offset="100%" stopColor="#1a0f06" />
        </linearGradient>

        {/* Firefly pulse animation */}
        <style>{`
          @keyframes fireflyPulse {
            0%, 100% { opacity: 0.1; r: 2; }
            50% { opacity: 0.9; r: 5; }
          }
          @keyframes fairyFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes fairyWingFlap {
            0%, 100% { transform: scaleX(1) scaleY(1); }
            40% { transform: scaleX(1.15) scaleY(0.85); }
            60% { transform: scaleX(0.85) scaleY(1.1); }
          }
          .cocoon-backdrop { animation: none; }
        `}</style>
      </defs>

      {/* Sky */}
      <rect width="800" height="600" fill="url(#cocoonSky)" />

      {/* Moonlight glow */}
      <rect width="800" height="600" fill="url(#moonGlow)" />

      {/* Moonlight rays */}
      <polygon points="330,180 470,180 540,600 260,600" fill="url(#moonRay)" opacity="0.35" />
      <polygon points="370,180 430,180 460,600 340,600" fill="url(#moonRay)" opacity="0.4" />
      <polygon points="280,180 320,180 180,600 80,600" fill="url(#moonRay)" opacity="0.12" />
      <polygon points="480,180 520,180 720,600 620,600" fill="url(#moonRay)" opacity="0.12" />

      {/* Centered Moon */}
      <circle cx="400" cy="180" r="52" fill="#f5f0ff" opacity="0.85" />
      <circle cx="415" cy="170" r="42" fill="#e8d5ff" opacity="0.9" />
      {/* Moon craters */}
      <circle cx="385" cy="172" r="7" fill="#d8c4f0" opacity="0.5" />
      <circle cx="408" cy="192" r="5" fill="#d8c4f0" opacity="0.4" />
      <circle cx="426" cy="178" r="4.5" fill="#d8c4f0" opacity="0.35" />
      <circle cx="378" cy="188" r="3.5" fill="#d8c4f0" opacity="0.3" />

      {/* Star field */}
      {[
        [40, 30], [120, 15], [200, 45], [310, 20], [450, 40], [530, 12], [680, 30],
        [760, 48], [55, 90], [160, 75], [240, 58], [340, 85], [490, 70], [560, 95],
        [700, 60], [350, 15], [410, 50], [630, 78], [30, 160], [770, 130]
      ].map(([sx, sy], i) => (
        <circle key={`star-${i}`} cx={sx} cy={sy} r={i % 3 === 0 ? 1.5 : 1} fill="#f0f4ff" opacity={0.3 + (i % 4) * 0.12} />
      ))}

      {/* Branches */}
      {branches.map((b, i) => (
        <g key={`branch-${i}`}>
          <path d={b.d} stroke="url(#trunkGradCocoon)" strokeWidth={b.w} fill="none" strokeLinecap="round" />
          {b.sub.map((s, j) => (
            <path key={`sub-${i}-${j}`} d={s.d} stroke="url(#trunkGradCocoon)" strokeWidth={s.w} fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}

      {/* Draping leaf silhouettes on branches */}
      {[
        { x: 170, y: 155, rot: 25, s: 1.1 },
        { x: 185, y: 180, rot: -15, s: 0.9 },
        { x: 120, y: 110, rot: 40, s: 0.85 },
        { x: 640, y: 155, rot: -25, s: 1.1 },
        { x: 620, y: 185, rot: 15, s: 0.9 },
        { x: 710, y: 108, rot: -38, s: 0.85 },
        { x: 220, y: 248, rot: 30, s: 0.75 },
        { x: 575, y: 250, rot: -30, s: 0.75 },
        { x: 80, y: 88, rot: 20, s: 0.75 },
        { x: 722, y: 85, rot: -20, s: 0.75 },
      ].map((l, i) => (
        <ellipse
          key={`leaf-${i}`}
          cx={l.x} cy={l.y}
          rx={14 * l.s} ry={7 * l.s}
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
          fill="#1a4a2e"
          opacity="0.75"
        />
      ))}

      {/* Flowers */}
      {flowers.map((f, i) => (
        <g key={`flower-${i}`}>
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, pi) => (
            <path
              key={`petal-${i}-${pi}`}
              d={petalPath(f.x, f.y, f.r, angle)}
              fill={f.pc}
              opacity="0.82"
            />
          ))}
          {/* Center */}
          <circle cx={f.x} cy={f.y} r={f.r * 0.45} fill={f.cc} opacity="0.95" />
          {/* Stem */}
          <line x1={f.x} y1={f.y + f.r * 1.8} x2={f.x} y2={f.y + f.r * 3.5} stroke="#2d6a4f" strokeWidth="1.5" opacity="0.7" />
        </g>
      ))}

      {/* Tiny vine/ivy tendrils */}
      {[
        { d: 'M150,165 Q162,175 158,188 Q154,200 165,208', c: '#2d6a4f' },
        { d: 'M640,168 Q628,178 632,192 Q636,206 625,213', c: '#2d6a4f' },
        { d: 'M190,235 Q202,242 198,255', c: '#1a4a2e' },
        { d: 'M578,238 Q566,245 570,258', c: '#1a4a2e' },
        { d: 'M110,320 Q122,325 118,335', c: '#2d6a4f' },
        { d: 'M660,328 Q648,333 652,343', c: '#2d6a4f' },
      ].map((v, i) => (
        <path key={`vine-${i}`} d={v.d} stroke={v.c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      ))}

      {/* Fairies */}
      {fairies.map((fy, i) => (
        <g key={`fairy-${i}`} transform={`translate(${fy.x}, ${fy.y})`} opacity={fy.o}>
          {/* Wing glow aura */}
          <ellipse cx="0" cy="-2" rx={10 * fy.s} ry={6 * fy.s} fill="url(#fairyGlow)" opacity="0.4" />
          {/* Left wing */}
          <ellipse
            cx={-8 * fy.s} cy={-3 * fy.s}
            rx={9 * fy.s} ry={5 * fy.s}
            transform={`rotate(-20 ${-8 * fy.s} ${-3 * fy.s}) scaleX(${fy.d})`}
            fill="#c4b5fd"
            opacity="0.75"
          />
          {/* Right wing */}
          <ellipse
            cx={8 * fy.s * fy.d} cy={-3 * fy.s}
            rx={9 * fy.s} ry={5 * fy.s}
            transform={`rotate(20 ${8 * fy.s * fy.d} ${-3 * fy.s})`}
            fill="#e9d5ff"
            opacity="0.7"
          />
          {/* Lower wings (smaller) */}
          <ellipse
            cx={-6 * fy.s} cy={4 * fy.s}
            rx={5 * fy.s} ry={3 * fy.s}
            transform={`rotate(30 ${-6 * fy.s} ${4 * fy.s})`}
            fill="#c4b5fd"
            opacity="0.55"
          />
          <ellipse
            cx={6 * fy.s * fy.d} cy={4 * fy.s}
            rx={5 * fy.s} ry={3 * fy.s}
            transform={`rotate(-30 ${6 * fy.s * fy.d} ${4 * fy.s})`}
            fill="#e9d5ff"
            opacity="0.5"
          />
          {/* Tiny body */}
          <ellipse cx="0" cy="1" rx={2.5 * fy.s} ry={4 * fy.s} fill="#fde68a" opacity="0.9" />
          {/* Head */}
          <circle cx="0" cy={-5 * fy.s} r={2.5 * fy.s} fill="#fef3c7" opacity="0.95" />
          {/* Glow halo dot */}
          <circle cx="0" cy={-5 * fy.s} r={3.5 * fy.s} fill="#c4b5fd" opacity="0.3" />
          {/* Fairy dust trail */}
          <circle cx={-5 * fy.s * fy.d} cy={8 * fy.s} r={1.2 * fy.s} fill="#fef08a" opacity="0.5" />
          <circle cx={-9 * fy.s * fy.d} cy={11 * fy.s} r={0.8 * fy.s} fill="#c4b5fd" opacity="0.4" />
          <circle cx={-2 * fy.s * fy.d} cy={13 * fy.s} r={0.6 * fy.s} fill="#fde68a" opacity="0.35" />
        </g>
      ))}

      {/* Fireflies — pulsing dots */}
      {fireflies.map((ff, i) => (
        <g key={`ff-${i}`}>
          {/* Glow halo */}
          <circle
            cx={ff.x} cy={ff.y}
            r="10"
            fill="url(#fireflyGlow)"
            style={{
              animation: `fireflyPulse ${ff.dur}s ease-in-out ${ff.del}s infinite`,
              opacity: 0
            }}
          />
          {/* Core dot */}
          <circle
            cx={ff.x} cy={ff.y}
            r="2.5"
            fill="#fef08a"
            style={{
              animation: `fireflyPulse ${ff.dur}s ease-in-out ${ff.del}s infinite`,
              opacity: 0
            }}
          />
        </g>
      ))}

      {/* Subtle ground mist */}
      <rect x="0" y="520" width="800" height="80" fill="#0f1b14" opacity="0.5" />
      <path d="M-100,545 Q200,520 400,540 T900,522 L900,600 L-100,600 Z" fill="#0d1a12" opacity="0.65" />

      {/* Bottom foreground silhouette bushes */}
      <ellipse cx="60" cy="590" rx="80" ry="35" fill="#0a1a0e" opacity="0.8" />
      <ellipse cx="200" cy="598" rx="90" ry="30" fill="#0a1a0e" opacity="0.75" />
      <ellipse cx="600" cy="595" rx="90" ry="32" fill="#0a1a0e" opacity="0.75" />
      <ellipse cx="745" cy="590" rx="80" ry="34" fill="#0a1a0e" opacity="0.8" />
      <ellipse cx="400" cy="600" rx="120" ry="28" fill="#081508" opacity="0.7" />
    </svg>
  );
}
