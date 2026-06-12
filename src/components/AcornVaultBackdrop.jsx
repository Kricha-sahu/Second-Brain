import React from 'react';

export default function AcornVaultBackdrop() {
  const trees = [40, 130, 220, 310, 400, 490, 580, 670, 750];
  const acorns = [
    [48, 548], [112, 562], [178, 552], [248, 566], [318, 554],
    [392, 560], [468, 550], [538, 564], [612, 556], [682, 568], [752, 558],
  ];

  return (
    <svg className="acorn-vault-backdrop" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="vaultSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dce8d8" />
          <stop offset="45%" stopColor="#b8d4b0" />
          <stop offset="75%" stopColor="#6b9468" />
          <stop offset="100%" stopColor="#3d5c44" />
        </linearGradient>
        <linearGradient id="vaultFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a6b44" />
          <stop offset="100%" stopColor="#2d4a32" />
        </linearGradient>
        <linearGradient id="acornNut" x1="0.3" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#c4956a" />
          <stop offset="100%" stopColor="#8b5e3c" />
        </linearGradient>
        <linearGradient id="acornCap" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#6b4423" />
          <stop offset="100%" stopColor="#4a2f18" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="url(#vaultSky)" />

      {trees.map((x, i) => {
        const y = 120 + (i % 4) * 90;
        const h = 140 + (i % 3) * 40;
        return (
          <g key={i} opacity={0.18 + (i % 3) * 0.05}>
            <rect x={x - 5} y={y} width={10} height={h} rx={3} fill="#4a3528" />
            <ellipse cx={x} cy={y - 10} rx={28 + (i % 2) * 10} ry={36} fill="#3d5c44" />
            <ellipse cx={x} cy={y - 22} rx={18} ry={24} fill="#4a7c59" opacity="0.8" />
          </g>
        );
      })}

      <ellipse cx="400" cy="540" rx="500" ry="90" fill="url(#vaultFloor)" opacity="0.85" />
      <ellipse cx="400" cy="530" rx="440" ry="55" fill="#3d5c38" opacity="0.35" />

      {acorns.map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y}) rotate(${(i * 17) % 40 - 20}) scale(${0.7 + (i % 3) * 0.12})`} opacity={0.8}>
          <ellipse cx="0" cy="4" rx="5" ry="7" fill="url(#acornNut)" />
          <path d="M-6 0 Q0 -8 6 0 L5 2 Q0 -2 -5 2 Z" fill="url(#acornCap)" />
        </g>
      ))}

      <ellipse cx="300" cy="200" rx="140" ry="50" fill="rgba(255, 236, 208, 0.1)" />
      <ellipse cx="550" cy="280" rx="100" ry="40" fill="rgba(255, 236, 208, 0.07)" />
    </svg>
  );
}
