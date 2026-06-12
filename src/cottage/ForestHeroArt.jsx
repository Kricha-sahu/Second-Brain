import React from 'react';

export default function ForestHeroArt() {
  return (
    <svg className="forest-hero-art" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f4e8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d4e8d0" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="heroHill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a8f65" />
          <stop offset="100%" stopColor="#3d5c44" />
        </linearGradient>
      </defs>
      <rect width="800" height="200" fill="url(#heroSky)" />
      <ellipse cx="400" cy="175" rx="420" ry="55" fill="url(#heroHill)" opacity="0.55" />
      {/* Mushroom cluster */}
      {[
        { x: 120, s: 1, c: '#d4a574' },
        { x: 200, s: 0.75, c: '#c9a66b' },
        { x: 580, s: 0.9, c: '#e9c89b' },
        { x: 660, s: 1.1, c: '#b8895a' },
        { x: 720, s: 0.65, c: '#d4a574' },
      ].map((m, i) => (
        <g key={i} transform={`translate(${m.x}, ${155 - m.s * 10}) scale(${m.s})`}>
          <rect x="-4" y="8" width="8" height="18" rx="3" fill="#f5ecd7" />
          <ellipse cx="0" cy="6" rx="22" ry="14" fill={m.c} />
          <ellipse cx="-8" cy="4" rx="6" ry="4" fill="rgba(255,255,255,0.35)" />
        </g>
      ))}
      {/* Soft trees */}
      {[80, 320, 480, 700].map((x, i) => (
        <g key={`t${i}`} transform={`translate(${x}, 90)`} opacity={0.35 + i * 0.05}>
          <rect x="-5" y="40" width="10" height="50" fill="#5c3d2e" />
          <ellipse cx="0" cy="30" rx="28" ry="38" fill="#4a7c59" />
          <ellipse cx="0" cy="18" rx="20" ry="26" fill="#6b8f71" />
        </g>
      ))}
      {/* Firefly dots */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle
          key={`ff${i}`}
          cx={60 + i * 52}
          cy={40 + (i % 4) * 18}
          r={1.8 + (i % 2)}
          fill="#ffe08a"
          opacity={0.5 + (i % 3) * 0.15}
          className="hero-firefly-dot"
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </svg>
  );
}
