import React from 'react';

export default function FocusBackdrop() {
  const backTrees = [
    { x: 40, w: 10, h: 260, o: 0.15 },
    { x: 130, w: 14, h: 330, o: 0.18 },
    { x: 200, w: 12, h: 280, o: 0.12 },
    { x: 290, w: 16, h: 360, o: 0.22 },
    { x: 370, w: 14, h: 310, o: 0.15 },
    { x: 490, w: 18, h: 370, o: 0.25 },
    { x: 580, w: 10, h: 270, o: 0.14 },
    { x: 670, w: 16, h: 350, o: 0.20 },
    { x: 750, w: 14, h: 320, o: 0.16 }
  ];

  const midTrees = [
    { x: 80, w: 24, h: 430, o: 0.35 },
    { x: 260, w: 30, h: 460, o: 0.38 },
    { x: 530, w: 26, h: 440, o: 0.36 },
    { x: 650, w: 28, h: 470, o: 0.40 }
  ];

  return (
    <svg className="focus-backdrop" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* Sunset Sky Gradient */}
        <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a3a" />     {/* Deep evening blue */}
          <stop offset="30%" stopColor="#8b3a2b" />    {/* Deep terracotta */}
          <stop offset="60%" stopColor="#c35123" />    {/* Burnt orange */}
          <stop offset="85%" stopColor="#e2703a" />    {/* Warm orange */}
          <stop offset="100%" stopColor="#f4a261" />   {/* Soft sunset amber */}
        </linearGradient>

        {/* Sun Glow */}
        <radialGradient id="sunGlow" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#e09f3e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9e2a2b" stopOpacity="0" />
        </radialGradient>

        {/* Forest Ground/Hills Gradients (Silhouetted against the sun) */}
        <linearGradient id="groundGradFocus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0b12" />
          <stop offset="100%" stopColor="#0a0407" />
        </linearGradient>

        {/* Sunbeam Gradient */}
        <linearGradient id="sunsetBeam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4a261" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#e76f51" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5c1a32" stopOpacity="0.0" />
        </linearGradient>

        {/* Trunk Textures (Very dark for silhouette) */}
        <linearGradient id="trunkGradFocus" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#080305" />
          <stop offset="50%" stopColor="#1a0a10" />
          <stop offset="100%" stopColor="#080305" />
        </linearGradient>
      </defs>

      {/* Base Sky */}
      <rect width="800" height="600" fill="url(#sunsetSky)" />

      {/* The Setting Sun */}
      <circle cx="400" cy="450" r="180" fill="url(#sunGlow)" />
      <circle cx="400" cy="450" r="45" fill="#fff3b0" opacity="0.9" />

      {/* Distant Hills */}
      <path d="M-100,340 Q150,280 400,330 T900,300 L900,600 L-100,600 Z" fill="#2b0e1a" opacity="0.7" />
      <path d="M-100,380 Q250,340 500,390 T900,360 L900,600 L-100,600 Z" fill="#1a0710" opacity="0.85" />

      {/* Background Trees (Distant Layer) */}
      {backTrees.map((t, i) => (
        <g key={`back-${i}`} opacity={t.o + 0.1}>
          <rect x={t.x - t.w / 2} y={320 - t.h} width={t.w} height={t.h + 300} fill="#14050a" />
          <circle cx={t.x} cy={330 - t.h} r={t.w * 3} fill="#110408" />
          <circle cx={t.x - t.w} cy={340 - t.h} r={t.w * 2.2} fill="#0d0306" />
          <circle cx={t.x + t.w} cy={335 - t.h} r={t.w * 2.5} fill="#0a0205" />
        </g>
      ))}

      {/* Midground Hills */}
      <path d="M-100,430 Q100,390 350,440 T900,410 L900,600 L-100,600 Z" fill="url(#groundGradFocus)" />

      {/* Midground Trees */}
      {midTrees.map((t, i) => (
        <g key={`mid-${i}`} opacity={t.o + 0.4}>
          <rect x={t.x - t.w / 2} y={440 - t.h} width={t.w} height={t.h + 200} fill="url(#trunkGradFocus)" />
          <ellipse cx={t.x} cy={450 - t.h} rx={t.w * 2.5} ry={t.w * 3} fill="#0f0508" />
          <ellipse cx={t.x - t.w * 1.2} cy={465 - t.h} rx={t.w * 1.8} ry={t.w * 2.2} fill="#0a0305" />
          <ellipse cx={t.x + t.w * 1.2} cy={460 - t.h} rx={t.w * 2} ry={t.w * 2.4} fill="#14070a" />
        </g>
      ))}

      {/* Sunbeams (Golden Hour Rays) */}
      <polygon points="50,-50 180,-50 480,650 300,650" fill="url(#sunsetBeam)" />
      <polygon points="250,-50 350,-50 700,650 550,650" fill="url(#sunsetBeam)" opacity="0.75" />
      <polygon points="-20,-50 60,-50 280,650 150,650" fill="url(#sunsetBeam)" opacity="0.6" />

      {/* Foreground Silhouettes (Nearly black) */}
      <path d="M-100,520 Q200,490 340,530 T900,505 L900,650 L-100,650 Z" fill="#080204" />
      <path d="M-100,550 Q150,535 300,565 T900,530 L900,650 L-100,650 Z" fill="#050102" />

      {/* Majestic Foreground Tree Trunks (Left and Right sides) */}
      <g>
        <path d="M-30,-50 L60,-50 Q40,300 80,650 L-100,650 L-100,-50 Z" fill="url(#trunkGradFocus)" />
        <path d="M830,-50 L730,-50 Q750,280 700,650 L900,650 L900,-50 Z" fill="url(#trunkGradFocus)" />
        <path d="M35,-50 Q15,300 55,650" stroke="#000000" strokeWidth="4" fill="none" opacity="0.8" />
        <path d="M745,-50 Q765,280 715,650" stroke="#000000" strokeWidth="4" fill="none" opacity="0.8" />
      </g>

      {/* Drooping Jungle Canopy Vines & Leaves (Silhouettes) */}
      <g opacity="0.95">
        <path d="M0,0 Q120,80 70,180 T15,320" fill="none" stroke="#0a0305" strokeWidth="4" />
        <path d="M70,180 Q100,220 120,290" fill="none" stroke="#080204" strokeWidth="2.5" />
        <path d="M800,0 Q700,90 730,220 T780,390" fill="none" stroke="#0a0305" strokeWidth="4.5" />
        
        {/* Top Left Leaf Silhouette */}
        <path d="M-20,-20 Q80,20 140,80 C110,95 80,105 10,70 Q-10,40 -20,-20 Z" fill="#050102" stroke="#000" strokeWidth="1" />
        <path d="M-20,-20 Q50,20 75,30" fill="none" stroke="#000" strokeWidth="2" />
        
        {/* Top Right Leaf Silhouette */}
        <path d="M820,-20 Q720,20 660,80 C690,95 720,105 790,70 Q810,40 820,-20 Z" fill="#080204" stroke="#000" strokeWidth="1" />
        <path d="M820,-20 Q750,20 725,30" fill="none" stroke="#000" strokeWidth="2" />
      </g>
    </svg>
  );
}
