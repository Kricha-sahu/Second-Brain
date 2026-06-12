import React from 'react';
import FernSnake from '../components/FernSnake';

export default function SylvesterGlade() {
  return (
    <div className="sylvester-glade glass panel snake-card">
      <div className="sylvester-glade-art" aria-hidden="true">
        <svg viewBox="0 0 400 120" preserveAspectRatio="xMaxYMax slice" className="glade-floor-svg">
          <defs>
            <linearGradient id="gladeGrass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b8f71" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3d5c44" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="110" rx="95" ry="28" fill="url(#gladeGrass)" />
          <ellipse cx="75" cy="108" rx="55" ry="12" fill="#5c3d2e" opacity="0.35" />
          {/* Log stump — illustrated, matches snake perch */}
          <ellipse cx="75" cy="102" rx="38" ry="10" fill="#9c6644" />
          <path d="M 48 102 Q 75 88 102 102 L 98 108 Q 75 98 52 108 Z" fill="#6b4226" />
          <ellipse cx="75" cy="100" rx="32" ry="7" fill="#b8895a" opacity="0.5" />
          <circle cx="115" cy="108" r="5" fill="#d4a574" opacity="0.7" />
          <circle cx="42" cy="110" r="4" fill="#e9c89b" opacity="0.6" />
        </svg>
      </div>
      <div className="sylvester-glade-content">
        <FernSnake />
      </div>
    </div>
  );
}
