import React from 'react';

export default function WellnessBackdrop() {
  // Generate random coordinates or specs for background elements to keep file clean
  const backTrees = [
    { x: 50, w: 12, h: 280, o: 0.15 },
    { x: 120, w: 16, h: 320, o: 0.18 },
    { x: 210, w: 14, h: 290, o: 0.12 },
    { x: 280, w: 18, h: 350, o: 0.22 },
    { x: 380, w: 15, h: 300, o: 0.15 },
    { x: 480, w: 20, h: 360, o: 0.25 },
    { x: 590, w: 12, h: 280, o: 0.14 },
    { x: 680, w: 18, h: 340, o: 0.20 },
    { x: 740, w: 15, h: 310, o: 0.16 }
  ];

  const midTrees = [
    { x: 90, w: 26, h: 420, o: 0.35 },
    { x: 250, w: 32, h: 450, o: 0.38 },
    { x: 520, w: 28, h: 430, o: 0.36 },
    { x: 640, w: 30, h: 460, o: 0.40 }
  ];

  return (
    <svg className="wellness-backdrop" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* Sky / Deep Jungle Gradient */}
        <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#040c06" />
          <stop offset="40%" stopColor="#071b0f" />
          <stop offset="75%" stopColor="#0b2b1a" />
          <stop offset="100%" stopColor="#05170d" />
        </linearGradient>

        {/* Forest Ground/Hills Gradients */}
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c2e1b" />
          <stop offset="100%" stopColor="#051c0f" />
        </linearGradient>

        {/* Winding Stream Gradient */}
        <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#003554" />
          <stop offset="40%" stopColor="#006494" />
          <stop offset="75%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#90e0ef" />
        </linearGradient>

        {/* Sunbeam Gradient */}
        <linearGradient id="lightBeam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe4b5" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#b4ffd4" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00b4d8" stopOpacity="0.0" />
        </linearGradient>

        {/* Trunk Textures */}
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#06120b" />
          <stop offset="50%" stopColor="#0f2619" />
          <stop offset="100%" stopColor="#051009" />
        </linearGradient>

        {/* Bioluminescent Firefly Glow */}
        <radialGradient id="fireflyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e2ffad" stopOpacity="1" />
          <stop offset="40%" stopColor="#bfff4f" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bfff4f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base Sky */}
      <rect width="800" height="600" fill="url(#forestSky)" />

      {/* Distant Hills */}
      <path d="M-100,320 Q150,260 400,310 T900,280 L900,600 L-100,600 Z" fill="#041209" opacity="0.8" />
      <path d="M-100,360 Q250,320 500,370 T900,340 L900,600 L-100,600 Z" fill="#061a0e" opacity="0.9" />

      {/* Background Trees (Distant Layer) */}
      {backTrees.map((t, i) => (
        <g key={`back-${i}`} opacity={t.o}>
          {/* Trunk */}
          <rect x={t.x - t.w / 2} y={300 - t.h} width={t.w} height={t.h + 300} fill="#0d2818" />
          {/* Soft foliage blobs */}
          <circle cx={t.x} cy={310 - t.h} r={t.w * 3} fill="#0c2d1c" />
          <circle cx={t.x - t.w} cy={320 - t.h} r={t.w * 2.2} fill="#0a2a1a" />
          <circle cx={t.x + t.w} cy={315 - t.h} r={t.w * 2.5} fill="#082516" />
        </g>
      ))}

      {/* Midground Hills */}
      <path d="M-100,410 Q100,370 350,420 T900,390 L900,600 L-100,600 Z" fill="url(#groundGrad)" />

      {/* Midground Trees */}
      {midTrees.map((t, i) => (
        <g key={`mid-${i}`} opacity={t.o}>
          <rect x={t.x - t.w / 2} y={420 - t.h} width={t.w} height={t.h + 200} fill="url(#trunkGrad)" />
          {/* Foliage detail */}
          <ellipse cx={t.x} cy={430 - t.h} rx={t.w * 2.5} ry={t.w * 3} fill="#0b321c" />
          <ellipse cx={t.x - t.w * 1.2} cy={445 - t.h} rx={t.w * 1.8} ry={t.w * 2.2} fill="#092d19" />
          <ellipse cx={t.x + t.w * 1.2} cy={440 - t.h} rx={t.w * 2} ry={t.w * 2.4} fill="#0d3820" />
        </g>
      ))}

      {/* Sunbeams / Light Rays (Diagonal, filtering through canopy) */}
      <polygon points="50,-50 180,-50 480,650 300,650" fill="url(#lightBeam)" />
      <polygon points="250,-50 350,-50 700,650 550,650" fill="url(#lightBeam)" opacity="0.75" />
      <polygon points="-20,-50 60,-50 280,650 150,650" fill="url(#lightBeam)" opacity="0.6" />

      {/* The Winding Stream running through the forest */}
      <g>
        {/* Stream Outer banks (Moss / Wet Ground) */}
        <path d="M380,410 Q420,440 370,480 T450,600 L320,600 Q260,510 320,470 T360,410 Z" fill="#041209" opacity="0.8" />
        
        {/* Stream Water Path */}
        <path d="M370,410 Q410,440 365,480 T440,600 L340,600 Q280,510 330,470 T355,410 Z" fill="url(#streamGrad)" />
        
        {/* Stream Glistening Flow Highlights */}
        <path d="M363,420 Q398,445 352,485 T415,585" stroke="#90e0ef" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="12,18" />
        <path d="M358,435 Q385,460 348,495 T395,595" stroke="#e0f7fa" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="8,22" />
        <path d="M366,415 Q395,435 362,470 T428,575" stroke="#00b4d8" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="15,25" />
      </g>

      {/* Foreground Mossy Ground Layer */}
      <path d="M-100,500 Q200,470 340,510 T900,485 L900,650 L-100,650 Z" fill="#05170d" />
      <path d="M-100,530 Q150,515 300,545 T900,510 L900,650 L-100,650 Z" fill="#031109" />

      {/* Majestic Foreground Tree Trunks (Left and Right sides) */}
      <g>
        {/* Left Giant Tree */}
        <path d="M-30,-50 L60,-50 Q40,300 80,650 L-100,650 L-100,-50 Z" fill="url(#trunkGrad)" />
        {/* Right Giant Tree */}
        <path d="M830,-50 L730,-50 Q750,280 700,650 L900,650 L900,-50 Z" fill="url(#trunkGrad)" />
        
        {/* Bark details / shadows */}
        <path d="M35,-50 Q15,300 55,650" stroke="#020804" strokeWidth="4" fill="none" opacity="0.7" />
        <path d="M745,-50 Q765,280 715,650" stroke="#020804" strokeWidth="4" fill="none" opacity="0.7" />
      </g>

      {/* Drooping Jungle Canopy Vines & Leaves */}
      <g opacity="0.85">
        {/* Vine 1 */}
        <path d="M0,0 Q120,80 70,180 T15,320" fill="none" stroke="#061f10" strokeWidth="3" />
        <path d="M70,180 Q100,220 120,290" fill="none" stroke="#04140a" strokeWidth="2" />
        {/* Vine 2 */}
        <path d="M800,0 Q700,90 730,220 T780,390" fill="none" stroke="#061f10" strokeWidth="3.5" />
        
        {/* Monstera Leaves / Giant foliage path overlays */}
        {/* Top Left Leaf */}
        <path d="M-20,-20 Q80,20 140,80 C110,95 80,105 10,70 Q-10,40 -20,-20 Z" fill="#082b17" stroke="#03140a" strokeWidth="1" />
        <path d="M-20,-20 Q50,20 75,30" fill="none" stroke="#0e4425" strokeWidth="2" />
        
        {/* Top Right Leaf */}
        <path d="M820,-20 Q720,20 660,80 C690,95 720,105 790,70 Q810,40 820,-20 Z" fill="#052011" stroke="#021008" strokeWidth="1" />
        <path d="M820,-20 Q750,20 725,30" fill="none" stroke="#0e4425" strokeWidth="2" />
      </g>

      {/* Floating Forest Fireflies (Bioluminescent soft circles) */}
      <g>
        <circle cx="120" cy="220" r="10" fill="url(#fireflyGlow)" />
        <circle cx="280" cy="180" r="14" fill="url(#fireflyGlow)" opacity="0.9" />
        <circle cx="340" cy="320" r="8" fill="url(#fireflyGlow)" opacity="0.8" />
        <circle cx="490" cy="260" r="16" fill="url(#fireflyGlow)" opacity="0.95" />
        <circle cx="620" cy="150" r="12" fill="url(#fireflyGlow)" opacity="0.75" />
        <circle cx="680" cy="300" r="10" fill="url(#fireflyGlow)" opacity="0.85" />
        <circle cx="220" cy="460" r="9" fill="url(#fireflyGlow)" opacity="0.7" />
        <circle cx="580" cy="480" r="11" fill="url(#fireflyGlow)" opacity="0.85" />
      </g>
    </svg>
  );
}
