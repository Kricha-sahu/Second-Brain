import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function SnailModel({ isRetracted }) {
  const headRef = useRef();
  const bodyRef = useRef();
  const shellRef = useRef();
  const groupRef = useRef();
  const footSegmentsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Scale body down into shell when retracted
    const targetScale = isRetracted ? 0.05 : 1.0;
    bodyRef.current.scale.setScalar(
      THREE.MathUtils.lerp(bodyRef.current.scale.x, targetScale, 0.18),
    );

    // Point head/eyestalks toward cursor (pointer x/y)
    if (headRef.current && !isRetracted) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        state.pointer.x * 0.7,
        0.1,
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -state.pointer.y * 0.5,
        0.1,
      );
    }

    // Wiggle foot segments in crawling wave
    if (!isRetracted) {
      footSegmentsRef.current.forEach((mesh, i) => {
        if (!mesh) return;
        mesh.position.y = 0.025 + Math.sin(time * 6 + i * 0.6) * 0.006;
      });
    }

    // Gentle wiggling of the shell
    if (shellRef.current) {
      shellRef.current.rotation.z = Math.sin(time * 2.8) * 0.03;
    }

    // Disable click-to-spin, keep only subtle mouse parallax
    if (groupRef.current) {
      const targetRotationY = state.pointer.x * 0.35;
      const targetRotationX = -state.pointer.y * 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.08,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.08,
      );
    }
  });

  // Mathematically calculate a gorgeous logarithmic spiral of 15 overlapping bands
  const shellSegments = React.useMemo(() => {
    const segments = [];
    for (let i = 0; i < 15; i++) {
      const angle = i * 0.44;
      const radius = Math.pow(0.85, i) * 0.15;
      const x = Math.cos(angle) * radius - 0.03;
      const y = Math.sin(angle) * radius + 0.04;
      const z = Math.sin(angle * 0.5) * 0.02;
      const scale = Math.pow(0.87, i) * 0.122; // shell is slightly smaller to show more body
      const color = i % 2 === 0 ? "#fdfaf7" : "#d8b4fe"; // Alternating ivory & soft lavender bands
      segments.push({ x, y, z, scale, color });
    }
    return segments;
  }, []);

  const bodyColor = "#ffcaa6"; // Warm, glistening peach pink

  return (
    <group ref={groupRef} position={[0.02, -0.12, 0]}>
      {/* Snail Body / Foot */}
      <group ref={bodyRef}>
        {/* Foot layer: chain of 12 wiggling spheres with slimy physical material */}
        {Array.from({ length: 12 }).map((_, i) => {
          const xPos = (i - 5.5) * 0.035 + 0.02;
          const scaleZ = 1.0 - Math.abs(i - 5.5) * 0.12;
          return (
            <mesh
              key={i}
              position={[xPos, 0.02, 0]}
              scale={[1.15, 0.52, Math.max(0.2, scaleZ) * 0.82]}
              ref={(el) => (footSegmentsRef.current[i] = el)}
              castShadow
            >
              <sphereGeometry args={[0.048, 12, 12]} />
              <meshPhysicalMaterial
                color={bodyColor}
                roughness={0.08}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                transmission={0.4}
                thickness={0.5}
              />
            </mesh>
          );
        })}

        {/* Organic neck (overlapping spheres) */}
        <mesh position={[0.09, 0.07, 0]} scale={[1.25, 1.25, 0.92]} castShadow>
          <sphereGeometry args={[0.052, 12, 12]} />
          <meshPhysicalMaterial
            color={bodyColor}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            transmission={0.4}
            thickness={0.5}
          />
        </mesh>
        <mesh position={[0.12, 0.12, 0]} scale={[1.2, 1.2, 0.88]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshPhysicalMaterial
            color={bodyColor}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            transmission={0.4}
            thickness={0.5}
          />
        </mesh>

        {/* Interactive Head & Eyestalks */}
        <group ref={headRef} position={[0.16, 0.18, 0]}>
          <mesh castShadow scale={[1.22, 1.22, 1.22]}>
            <sphereGeometry args={[0.058, 16, 16]} />
            <meshPhysicalMaterial
              color={bodyColor}
              roughness={0.08}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              transmission={0.4}
              thickness={0.5}
            />
          </mesh>

          {/* Eyestalks */}
          <group position={[-0.018, 0.04, 0.02]} rotation={[0.18, 0, -0.12]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.004, 0.005, 0.09, 8]} />
              <meshPhysicalMaterial
                color={bodyColor}
                roughness={0.1}
                clearcoat={1.0}
                transmission={0.4}
                thickness={0.5}
              />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <sphereGeometry args={[0.013, 8, 8]} />
              <meshStandardMaterial color="#fff" roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.045, 0.011]} scale={[1, 1, 0.3]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#000" roughness={0.1} />
            </mesh>
          </group>

          <group position={[0.018, 0.04, 0.02]} rotation={[0.18, 0, 0.12]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.004, 0.005, 0.09, 8]} />
              <meshPhysicalMaterial
                color={bodyColor}
                roughness={0.1}
                clearcoat={1.0}
                transmission={0.4}
                thickness={0.5}
              />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <sphereGeometry args={[0.013, 8, 8]} />
              <meshStandardMaterial color="#fff" roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.045, 0.011]} scale={[1, 1, 0.3]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#000" roughness={0.1} />
            </mesh>
          </group>

          {/* Lower tentacles near mouth */}
          <mesh position={[-0.015, -0.025, 0.04]} rotation={[0.4, 0.2, 0.2]}>
            <cylinderGeometry args={[0.002, 0.003, 0.03, 6]} />
            <meshPhysicalMaterial
              color={bodyColor}
              roughness={0.1}
              clearcoat={0.5}
              transmission={0.4}
              thickness={0.5}
            />
          </mesh>
          <mesh position={[0.015, -0.025, 0.04]} rotation={[0.4, -0.2, -0.2]}>
            <cylinderGeometry args={[0.002, 0.003, 0.03, 6]} />
            <meshPhysicalMaterial
              color={bodyColor}
              roughness={0.1}
              clearcoat={0.5}
              transmission={0.4}
              thickness={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* Snail Shell (Beautiful, realistic Logarithmic Helical Spiral) */}
      <group ref={shellRef} position={[-0.07, 0.11, 0]}>
        {shellSegments.map((seg, idx) => (
          <mesh
            key={idx}
            position={[seg.x, seg.y, seg.z]}
            scale={[seg.scale, seg.scale, seg.scale]}
            castShadow
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshPhysicalMaterial
              color={seg.color}
              roughness={0.1}
              clearcoat={1.0}
              clearcoatRoughness={0.02}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function SnailWater({ waterCount, onWaterChange }) {
  const maxWater = 8;
  const isOverHydrated = waterCount > maxWater;
  const fillPercentage = Math.min(100, (waterCount / maxWater) * 100);

  // Stems height is 200px. Snail height is ~45px. Safe bottom ranges 0px to 155px.
  // When over-hydrated, the snail drops to the ground and crawls to the right side (left: 54px, bottom: 2px)
  const snailBottom = isOverHydrated ? 2 : Math.round((waterCount / maxWater) * 155);
  const snailLeft = isOverHydrated ? "54px" : "-22px";

  const [isRetracted, setIsRetracted] = useState(false);
  const snailRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!snailRef.current) return;
      const rect = snailRef.current.getBoundingClientRect();
      const snailCenterX = rect.left + rect.width / 2;
      const snailCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - snailCenterX;
      const dy = e.clientY - snailCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Retract shell if mouse is within 75px of the snail
      if (distance < 75) {
        setIsRetracted(true);
      } else {
        setIsRetracted(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getSnailSpeech = () => {
    if (isOverHydrated) {
      return "Glug glug... too much dew! Splashed down to rest under the cozy petals. 💦🌺";
    }
    if (isRetracted) {
      return "Shh... hiding! 🐚";
    }
    if (waterCount === 0) return "Let's climb the vine for some dew!";
    if (waterCount < 3) return "Mmm, crisp dewdrops. Keep going! 🌱";
    if (waterCount < 6) return "Slow and steady, halfway up! 🍃";
    if (waterCount < 8) return "Almost at the canopy blossom! ✨";
    return "Wow, exactly 8 dewdrops! Reached the canopy blossom! 🌸✨";
  };

  return (
    <div className="pebble-panel-1">
      <h3 className="panel-title">
        <span>Hydration Stalk</span>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="var(--dewdrop)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </h3>
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: "0.5rem",
        }}
      >
        Help Shelly climb to the canopy blossom by logging your daily cups.
        Hover near her to see her retract!
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Snail Speech Bubble */}
        <div
          style={{
            background: "rgba(20, 36, 26, 0.85)",
            border: "1px solid rgba(143, 172, 142, 0.3)",
            padding: "0.5rem 1rem",
            borderRadius: "12px",
            fontSize: "0.83rem",
            color: "var(--text-main)",
            marginBottom: "1rem",
            position: "relative",
            minHeight: "34px",
            display: "flex",
            alignItems: "center",
            fontWeight: "500",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >
          {getSnailSpeech()}
          {/* Bubble tail */}
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: "10px",
              height: "10px",
              background: "rgba(20, 36, 26, 0.85)",
              borderRight: "1px solid rgba(143, 172, 142, 0.3)",
              borderBottom: "1px solid rgba(143, 172, 142, 0.3)",
            }}
          ></div>
        </div>

        <div className="water-snail-container">
          {/* Stem & Snail Track */}
          <div
            className="water-stem-path"
            style={{
              position: "relative",
              height: "200px",
              width: "80px",
              background: "rgba(107,143,113,0.15)",
              borderRadius: "16px",
              overflow: "visible",
            }}
          >
            <div
              className={`water-stem-fill ${isOverHydrated ? "overflowing" : ""}`}
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: `${fillPercentage}%`,
                background:
                  "linear-gradient(to top, var(--moss), var(--dewdrop))",
                borderRadius: "16px",
                transition: "height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            ></div>

            {/* Spill Droplets */}
            {isOverHydrated && (
              <>
                <div className="spill-droplet spill-droplet-left-1" />
                <div className="spill-droplet spill-droplet-left-2" />
                <div className="spill-droplet spill-droplet-right-1" />
                <div className="spill-droplet spill-droplet-right-2" />
              </>
            )}

            {/* Petal Nest Dome */}
            {isOverHydrated && (
              <svg className="petal-nest-dome" viewBox="0 0 80 80">
                {/* Petal 1 */}
                <path d="M10,80 C15,35 45,35 80,45 C75,60 55,75 10,80 Z" fill="#f48fb1" opacity="0.9" />
                {/* Petal 2 */}
                <path d="M0,80 C10,25 55,25 70,55 C55,70 35,75 0,80 Z" fill="#f8bbd0" opacity="0.85" />
                {/* Petal 3 */}
                <path d="M5,80 C20,15 65,30 80,65 C60,75 35,78 5,80 Z" fill="#ffccd5" opacity="0.75" />
                {/* Center Glow */}
                <ellipse cx="40" cy="65" rx="20" ry="10" fill="#fff" opacity="0.35" filter="url(#glowBlur)" />
                <defs>
                  <filter id="glowBlur">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>
              </svg>
            )}

            {/* Interactive 3D Snail Canvas */}
            <div
              ref={snailRef}
              className={`snail-avatar-interactive ${isRetracted ? "retracted" : ""}`}
              style={{
                position: "absolute",
                left: snailLeft,
                width: "76px",
                height: "60px",
                bottom: `${snailBottom}px`,
                cursor: "pointer",
                transition: "bottom 0.8s cubic-bezier(0.25, 1, 0.5, 1), left 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
                zIndex: 5,
              }}
            >
              <Canvas
                camera={{ position: [0, 0.05, 0.72], fov: 42 }}
                gl={{ alpha: true }}
              >
                <ambientLight intensity={1.1} />
                <directionalLight
                  position={[1, 3, 2]}
                  intensity={2.0}
                  color="#ffecd0"
                />
                <directionalLight
                  position={[-1, -1, 1]}
                  intensity={0.5}
                  color="#c5e8c7"
                />
                <SnailModel isRetracted={isRetracted} />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
              </Canvas>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
              alignItems: "center",
            }}
          >
            <div className="counter-value" style={{ fontSize: "2.2rem" }}>
              {waterCount}
              <span style={{ fontSize: "1.1rem", color: "var(--text-dim)" }}>
                {" "}
                / {maxWater}
              </span>
            </div>

            <div className="counter-controls">
              <button
                type="button"
                className="btn-icon"
                onClick={() => onWaterChange(-1)}
                disabled={waterCount <= 0}
                style={{ opacity: waterCount <= 0 ? 0.35 : 1 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={() => onWaterChange(1)}
                style={{
                  borderColor: "var(--dewdrop)",
                  color: "var(--dewdrop)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cozy completion message banner */}
        {isOverHydrated && (
          <div className="cozy-hydration-banner">
            <span>🛌</span>
            <span>Cozy Petal Haven: Shelly is resting under the soft petals!</span>
          </div>
        )}
      </div>
    </div>
  );
}
