import React, { useCallback, memo } from 'react';

/* ───────────────────────────────────────────────────────
   Data arrays – kept inside the module so they are stable
   across renders and never trigger re-creation.
   ─────────────────────────────────────────────────────── */

const LEAF_COLORS = [
  '#4A7C59', // forest green
  '#6B8F3C', // olive green
  '#8DB255', // spring green
  '#C4A35A', // amber gold
  '#D4A843', // golden
  '#5E9B4C', // leaf green
  '#A8BF6A', // lime green
  '#B8860B', // dark goldenrod
];

const LEAVES = Array.from({ length: 8 }, (_, i) => ({
  id: `leaf-${i}`,
  color: LEAF_COLORS[i],
  startX: `${8 + i * 12 + Math.sin(i * 1.7) * 5}%`,
  size: 15 + ((i * 7 + 3) % 16),          // 15-30 px
  delay: (i * 1.9) % 15,                   // 0-15 s
  duration: 12 + ((i * 3.7) % 10),         // 12-22 s
  drift: 30 + ((i * 17) % 60),             // lateral sway px
  rotation: 120 + i * 45,                  // total rotation degrees
  opacity: 0.75 + (i % 3) * 0.08,
}));

const FIREFLIES = Array.from({ length: 5 }, (_, i) => ({
  id: `firefly-${i}`,
  size: 6 + ((i * 2) % 5),                 // 6-10 px
  left: `${50 + ((i * 13 + 7) % 40)}%`,    // right-ish side of viewport
  top: `${15 + ((i * 19 + 5) % 60)}%`,     // vertically spread
  driftX: 40 + ((i * 23) % 60),
  driftY: 30 + ((i * 17) % 50),
  duration: 6 + ((i * 1.8) % 6),           // 6-12 s
  glowDuration: 3 + ((i * 1.3) % 4),       // pulse 3-7 s
  delay: i * 1.4,
}));

const BUGS = [
  {
    id: 'bug-horizontal',
    direction: 'horizontal',
    duration: 35,
    delay: 3,
    bottom: '12px',
    right: 'auto',
    left: '0',
  },
  {
    id: 'bug-vertical',
    direction: 'vertical',
    duration: 40,
    delay: 8,
    right: '14px',
    bottom: '0',
    left: 'auto',
  },
];

/* ───────────────────────────────────────────────────────
   Inline SVG helpers
   ─────────────────────────────────────────────────────── */

const LeafSVG = ({ color, size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main leaf body */}
    <path
      d="M20 2 C10 10, 2 20, 8 32 C12 38, 20 38, 20 38 C20 38, 28 38, 32 32 C38 20, 30 10, 20 2Z"
      fill={color}
      opacity="0.85"
    />
    {/* Central vein */}
    <path
      d="M20 6 L20 36"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
    {/* Side veins */}
    <path
      d="M20 14 L12 20 M20 20 L10 28 M20 14 L28 20 M20 20 L30 28"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="0.6"
      strokeLinecap="round"
    />
  </svg>
);

const LadybugSVG = ({ flip }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={flip ? { transform: 'rotate(-90deg)' } : undefined}
  >
    {/* Body */}
    <ellipse cx="18" cy="20" rx="10" ry="12" fill="#D32F2F" />
    {/* Wing split line */}
    <line x1="18" y1="9" x2="18" y2="32" stroke="#1A1A1A" strokeWidth="1.2" />
    {/* Head */}
    <circle cx="18" cy="9" r="5" fill="#222" />
    {/* Eyes */}
    <circle cx="15.8" cy="7.5" r="1" fill="#FFF" />
    <circle cx="20.2" cy="7.5" r="1" fill="#FFF" />
    {/* Dots */}
    <circle cx="14" cy="17" r="1.8" fill="#1A1A1A" />
    <circle cx="22" cy="17" r="1.8" fill="#1A1A1A" />
    <circle cx="14" cy="24" r="1.5" fill="#1A1A1A" />
    <circle cx="22" cy="24" r="1.5" fill="#1A1A1A" />
    <circle cx="18" cy="21" r="1.3" fill="#1A1A1A" />
    {/* Antennae */}
    <path d="M16 5 Q14 1, 11 0" stroke="#333" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    <path d="M20 5 Q22 1, 25 0" stroke="#333" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    {/* Tiny legs */}
    <path d="M9 16 L6 14 M9 20 L5 20 M9 25 L6 27" stroke="#333" strokeWidth="0.7" strokeLinecap="round" />
    <path d="M27 16 L30 14 M27 20 L31 20 M27 25 L30 27" stroke="#333" strokeWidth="0.7" strokeLinecap="round" />
  </svg>
);

/* ───────────────────────────────────────────────────────
   CSS keyframes – injected once via <style> tag
   ─────────────────────────────────────────────────────── */

const KEYFRAMES = `
/* ── Falling leaves ─────────────────────────────────── */
@keyframes leaf-fall {
  0% {
    transform:
      translateY(-50px)
      translateX(0px)
      rotate(0deg)
      translate(
        calc(var(--mouse-x, 0.5) * 6px - 3px),
        calc(var(--mouse-y, 0.5) * 4px - 2px)
      );
    opacity: 0;
  }
  5% {
    opacity: var(--leaf-opacity, 0.8);
  }
  25% {
    transform:
      translateY(27vh)
      translateX(calc(var(--leaf-drift) * 1px))
      rotate(calc(var(--leaf-rotation) * 0.3deg))
      translate(
        calc(var(--mouse-x, 0.5) * 6px - 3px),
        calc(var(--mouse-y, 0.5) * 4px - 2px)
      );
  }
  50% {
    transform:
      translateY(55vh)
      translateX(calc(var(--leaf-drift) * -0.6px))
      rotate(calc(var(--leaf-rotation) * 0.6deg))
      translate(
        calc(var(--mouse-x, 0.5) * 6px - 3px),
        calc(var(--mouse-y, 0.5) * 4px - 2px)
      );
  }
  75% {
    transform:
      translateY(82vh)
      translateX(calc(var(--leaf-drift) * 0.8px))
      rotate(calc(var(--leaf-rotation) * 0.85deg))
      translate(
        calc(var(--mouse-x, 0.5) * 6px - 3px),
        calc(var(--mouse-y, 0.5) * 4px - 2px)
      );
  }
  95% {
    opacity: var(--leaf-opacity, 0.8);
  }
  100% {
    transform:
      translateY(110vh)
      translateX(calc(var(--leaf-drift) * -0.3px))
      rotate(calc(var(--leaf-rotation) * 1deg))
      translate(
        calc(var(--mouse-x, 0.5) * 6px - 3px),
        calc(var(--mouse-y, 0.5) * 4px - 2px)
      );
    opacity: 0;
  }
}

/* ── Firefly drift ──────────────────────────────────── */
@keyframes firefly-drift {
  0%   { transform: translate(0px, 0px); }
  15%  { transform: translate(
           calc(var(--ff-dx) * 0.6px),
           calc(var(--ff-dy) * -0.4px)
         ); }
  30%  { transform: translate(
           calc(var(--ff-dx) * -0.3px),
           calc(var(--ff-dy) * 0.7px)
         ); }
  50%  { transform: translate(
           calc(var(--ff-dx) * 0.8px),
           calc(var(--ff-dy) * 0.5px)
         ); }
  65%  { transform: translate(
           calc(var(--ff-dx) * -0.5px),
           calc(var(--ff-dy) * -0.8px)
         ); }
  80%  { transform: translate(
           calc(var(--ff-dx) * 0.4px),
           calc(var(--ff-dy) * -0.2px)
         ); }
  100% { transform: translate(0px, 0px); }
}

/* ── Firefly glow pulse ─────────────────────────────── */
@keyframes firefly-glow-pulse {
  0%, 100% {
    opacity: 0.3;
    box-shadow:
      0 0  4px 1px rgba(233,165,69,0.3),
      0 0  8px 3px rgba(233,165,69,0.15);
  }
  50% {
    opacity: 1;
    box-shadow:
      0 0  8px 3px rgba(233,165,69,0.6),
      0 0 20px 8px rgba(233,165,69,0.3),
      0 0 40px 16px rgba(233,165,69,0.1);
  }
}

/* ── Bug crawl: horizontal (left → right along bottom) */
@keyframes bug-crawl-horizontal {
  0%   { transform: translateX(-30px); }
  100% { transform: translateX(calc(100vw + 30px)); }
}

/* ── Bug crawl: vertical (bottom → top along right) ── */
@keyframes bug-crawl-vertical {
  0%   { transform: translateY(calc(100vh + 30px)); }
  100% { transform: translateY(-30px); }
}
`;

/* ───────────────────────────────────────────────────────
   Component
   ─────────────────────────────────────────────────────── */

const ForestEnvironment = memo(function ForestEnvironment() {
  const handleMouseMove = useCallback((e) => {
    const el = e.currentTarget;
    const x = (e.clientX / window.innerWidth).toFixed(3);
    const y = (e.clientY / window.innerHeight).toFixed(3);
    el.style.setProperty('--mouse-x', x);
    el.style.setProperty('--mouse-y', y);
  }, []);

  return (
    <div
      className="forest-environment"
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
        /* allow mouse events to reach us but still pass through to content */
        /* we use pointerEvents: 'none' on children individually when needed */
      }}
    >
      {/* Inject keyframes */}
      <style>{KEYFRAMES}</style>

      {/* ── Falling Leaves ────────────────────────────── */}
      {LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className="forest-leaf"
          style={{
            position: 'absolute',
            left: leaf.startX,
            top: 0,
            width: leaf.size,
            height: leaf.size,
            willChange: 'transform',
            pointerEvents: 'none',
            '--leaf-delay': `${leaf.delay}s`,
            '--leaf-duration': `${leaf.duration}s`,
            '--leaf-drift': leaf.drift,
            '--leaf-rotation': leaf.rotation,
            '--leaf-size': `${leaf.size}px`,
            '--leaf-opacity': leaf.opacity,
            animation: `leaf-fall var(--leaf-duration) var(--leaf-delay) ease-in-out infinite`,
            opacity: 0,
          }}
        >
          <LeafSVG color={leaf.color} size={leaf.size} />
        </div>
      ))}

      {/* ── Fireflies ─────────────────────────────────── */}
      {FIREFLIES.map((ff) => (
        <div
          key={ff.id}
          className="forest-firefly"
          style={{
            position: 'absolute',
            left: ff.left,
            top: ff.top,
            width: ff.size,
            height: ff.size,
            borderRadius: '50%',
            backgroundColor: '#E9A545',
            willChange: 'transform, opacity, box-shadow',
            pointerEvents: 'none',
            '--ff-dx': ff.driftX,
            '--ff-dy': ff.driftY,
            animation: [
              `firefly-drift ${ff.duration}s ${ff.delay}s ease-in-out infinite`,
              `firefly-glow-pulse ${ff.glowDuration}s ${ff.delay * 0.7}s ease-in-out infinite`,
            ].join(', '),
            boxShadow: `
              0 0  4px 1px rgba(233,165,69,0.3),
              0 0  8px 3px rgba(233,165,69,0.15)
            `,
          }}
        />
      ))}

      {/* ── Crawling Ladybugs ─────────────────────────── */}
      {BUGS.map((bug) => (
        <div
          key={bug.id}
          className="forest-bug"
          style={{
            position: 'absolute',
            bottom: bug.direction === 'horizontal' ? bug.bottom : bug.bottom,
            right: bug.direction === 'vertical' ? bug.right : undefined,
            left: bug.direction === 'horizontal' ? bug.left : undefined,
            pointerEvents: 'none',
            animation: `${
              bug.direction === 'horizontal'
                ? 'bug-crawl-horizontal'
                : 'bug-crawl-vertical'
            } ${bug.duration}s ${bug.delay}s linear infinite`,
          }}
        >
          <LadybugSVG flip={bug.direction === 'vertical'} />
        </div>
      ))}
    </div>
  );
});

export default ForestEnvironment;
