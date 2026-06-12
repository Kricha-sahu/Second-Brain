import React from 'react';

const baseClass = 'relic-illustration-svg';

export function AcornIllustration({ active }) {
  return (
    <svg className={`${baseClass} relic-acorn ${active ? 'is-active' : ''}`} viewBox="0 0 120 140" width="88" height="102" aria-hidden="true">
      <defs>
        <radialGradient id="acornBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c4956a" />
          <stop offset="55%" stopColor="#9c6644" />
          <stop offset="100%" stopColor="#6b4226" />
        </radialGradient>
        <radialGradient id="acornCap" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#8b5e3c" />
          <stop offset="100%" stopColor="#4a3728" />
        </radialGradient>
        <filter id="acornShadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2c3e2d" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#acornShadow)">
        <ellipse cx="60" cy="92" rx="28" ry="36" fill="url(#acornBody)" />
        <path
          d="M 34 72 Q 60 48 86 72 Q 88 58 60 42 Q 32 58 34 72 Z"
          fill="url(#acornCap)"
        />
        <path d="M 52 42 Q 60 28 68 42" stroke="#5c3d2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="48" cy="80" rx="6" ry="10" fill="rgba(255,255,255,0.12)" />
        <path d="M 42 58 Q 60 52 78 58" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

export function DewIllustration({ active, fill = 0.5 }) {
  const level = 88 - fill * 28;
  return (
    <svg className={`${baseClass} relic-dew ${active ? 'is-active' : ''}`} viewBox="0 0 120 140" width="88" height="102" aria-hidden="true">
      <defs>
        <radialGradient id="dewGlass" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#b8ecec" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7ec8c8" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="dewWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ed9d9" />
          <stop offset="100%" stopColor="#5ab0b0" />
        </linearGradient>
        <filter id="dewGlow">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#7ec8c8" floodOpacity={active ? 0.55 : 0.25} />
        </filter>
      </defs>
      <g filter="url(#dewGlow)">
        <path
          d="M 60 18 C 42 48 32 72 34 92 C 36 108 48 118 60 118 C 72 118 84 108 86 92 C 88 72 78 48 60 18 Z"
          fill="url(#dewGlass)"
          stroke="rgba(126,200,200,0.6)"
          strokeWidth="1.5"
        />
        <clipPath id="dewClip">
          <path d="M 60 18 C 42 48 32 72 34 92 C 36 108 48 118 60 118 C 72 118 84 108 86 92 C 88 72 78 48 60 18 Z" />
        </clipPath>
        <g clipPath="url(#dewClip)">
          <ellipse cx="60" cy={level} rx="22" ry="14" fill="url(#dewWater)" opacity="0.85" />
          <ellipse cx="52" cy={level - 8} rx="4" ry="2" fill="rgba(255,255,255,0.45)" />
        </g>
        <ellipse cx="48" cy="42" rx="8" ry="12" fill="rgba(255,255,255,0.35)" transform="rotate(-25 48 42)" />
      </g>
    </svg>
  );
}

export function FernIllustration({ active }) {
  return (
    <svg className={`${baseClass} relic-fern ${active ? 'is-active' : ''}`} viewBox="0 0 120 140" width="88" height="102" aria-hidden="true">
      <defs>
        <linearGradient id="fernLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#95d5b2" />
          <stop offset="100%" stopColor="#40916c" />
        </linearGradient>
        <filter id="fernShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2d5a3e" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#fernShadow)">
        <path d="M 60 118 L 60 72" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />
        <path d="M 60 95 Q 28 88 18 58 Q 38 72 60 82" fill="url(#fernLeaf)" />
        <path d="M 60 88 Q 92 80 102 50 Q 82 66 60 76" fill="url(#fernLeaf)" />
        <path d="M 60 78 Q 42 62 36 38 Q 52 58 60 68" fill="#74c69d" />
        <path d="M 60 72 Q 78 56 84 34 Q 68 52 60 62" fill="#74c69d" />
        <path d="M 60 62 Q 60 42 60 28 Q 54 44 60 55" fill="#52b788" />
        <circle cx="60" cy="28" r="4" fill="#e9a545" opacity="0.8" />
      </g>
    </svg>
  );
}

export function CrystalIllustration({ active, glow = 0.5 }) {
  const op = 0.65 + glow * 0.35;
  return (
    <svg className={`${baseClass} relic-crystal ${active ? 'is-active' : ''}`} viewBox="0 0 120 140" width="88" height="102" aria-hidden="true">
      <defs>
        <linearGradient id="crystalFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="50%" stopColor="#c9b8e8" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>
        <filter id="crystalGlow">
          <feDropShadow dx="0" dy="0" stdDeviation={active ? 6 : 3} floodColor="#9d4edd" floodOpacity={op * 0.5} />
        </filter>
      </defs>
      <g filter="url(#crystalGlow)" opacity={op}>
        <path d="M 60 24 L 88 52 L 72 118 L 48 118 L 32 52 Z" fill="url(#crystalFace)" stroke="#7b3eb8" strokeWidth="1.2" />
        <path d="M 60 24 L 60 118" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <path d="M 60 24 L 32 52 L 48 118" fill="rgba(255,255,255,0.12)" />
        <path d="M 60 42 L 76 58 L 68 96 L 52 96 L 44 58 Z" fill="rgba(255,255,255,0.2)" />
      </g>
    </svg>
  );
}

const MAP = {
  acorn: AcornIllustration,
  dew: DewIllustration,
  fern: FernIllustration,
  crystal: CrystalIllustration,
};

export default function RelicIllustration({ type, active, progress }) {
  const Comp = MAP[type] || AcornIllustration;
  return <Comp active={active} fill={progress} glow={progress} />;
}
