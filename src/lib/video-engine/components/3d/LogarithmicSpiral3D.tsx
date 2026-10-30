import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LogarithmicSpiral3DProps {
  phase: 1 | 2 | 3 | 4;
  phaseProgress: number; // 0.0 to 1.0 within current phase
  accentColor?: string;
  secondaryColor?: string;
  gridColor?: string;
  logoUrl?: string;
  headerText?: string;
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  theta: number;
  radius: number;
  armIndex: number;
}

interface ProjectedPoint {
  x2d: number;
  y2d: number;
  scale: number;
  z: number;
  theta: number;
  radius: number;
  armIndex: number;
  index: number;
}

interface TriangleSubmesh {
  p1: ProjectedPoint;
  p2: ProjectedPoint;
  p3: ProjectedPoint;
  centroidX: number;
  centroidY: number;
}

export const LogarithmicSpiral3D: React.FC<LogarithmicSpiral3DProps> = ({
  phase,
  phaseProgress,
  accentColor = '#00E5FF',
  secondaryColor = '#FFFFFF',
  gridColor = '#222222',
  logoUrl,
  headerText = 'ARTIFICIAL CRAFT',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  // Generate 3D Logarithmic Spiral Vertices
  const numArms = 3;
  const pointsPerArm = 60;
  const a = 12; // Initial scale factor
  const k = 0.14; // Spiral growth rate: r = a * e^(k * theta)

  const spiralPoints3D = useMemo(() => {
    const points: Point3D[] = [];
    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = (arm * (2 * Math.PI)) / numArms;
      for (let i = 0; i < pointsPerArm; i++) {
        const theta = (i / pointsPerArm) * (5.5 * Math.PI) + armOffset;
        const radius = a * Math.exp(k * (theta - armOffset));
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = (i - pointsPerArm / 2) * 12; // Z extrusion depth
        points.push({ x, y, z, theta, radius, armIndex: arm });
      }
    }
    return points;
  }, [numArms, pointsPerArm, a, k]);

  // Compute 3D Rotations and Projections according to phase
  let rotX = 0;
  let rotY = 0;
  let rotZ = 0;
  let overallScale = 2.0;

  if (phase === 1) {
    // Skeletal Ticking Pulse: Shallow 3D angle, spiral expanding from origin
    rotX = interpolate(phaseProgress, [0, 1], [0.1, 0.35]);
    rotY = interpolate(phaseProgress, [0, 1], [0, 0.4]);
    rotZ = frame * 0.005;
    overallScale = interpolate(phaseProgress, [0, 1], [0.2, 1.6]);
  } else if (phase === 2) {
    // Forge Dynamic: Deep 3D tilt, continuous rotation & orbital dynamic sweep
    rotX = 0.35 + Math.sin(frame * 0.015) * 0.25;
    rotY = 0.4 + Math.cos(frame * 0.02) * 0.35;
    rotZ = frame * 0.01;
    overallScale = 1.6 + Math.sin(phaseProgress * Math.PI) * 0.2;
  } else if (phase === 3) {
    // Submesh Purge: Split perspective, audio-reactive scaling, orbital rotation
    rotX = 0.5 + Math.sin(frame * 0.03) * 0.2;
    rotY = frame * 0.015;
    rotZ = frame * 0.02;
    overallScale = 1.8 + Math.sin(frame * 0.2) * 0.05; // Audio reactive pulse
  } else {
    // Phase 4: Magnetic collapse back into Swiss Brutalism logo box, then collapse to dot at end
    const collapseSpring = spring({
      frame,
      fps,
      config: { damping: 14, mass: 0.8 },
    });
    rotX = interpolate(collapseSpring, [0, 1], [0.5, 0]);
    rotY = interpolate(collapseSpring, [0, 1], [0.8, 0]);
    rotZ = interpolate(collapseSpring, [0, 1], [0.5, 0]);

    // Near end of Phase 4 (frames 2640 -> 2700 / phaseProgress 0.88 -> 1.0), shrink down to 0
    if (phaseProgress > 0.85) {
      overallScale = interpolate(phaseProgress, [0.85, 1.0], [1.0, 0.001], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    } else {
      overallScale = interpolate(collapseSpring, [0, 1], [1.0, 0.8]);
    }
  }

  // 3D Projection Engine
  const perspective = 800;
  const projectedPoints: ProjectedPoint[] = spiralPoints3D.map((p, index) => {
    // Scale point according to Phase 1 growth
    let pScale = overallScale;
    if (phase === 1) {
      const pointThreshold = (index / spiralPoints3D.length) * 0.9;
      if (phaseProgress < pointThreshold) {
        pScale = 0;
      }
    }

    const xScaled = p.x * pScale;
    const yScaled = p.y * pScale;
    const zScaled = p.z * pScale;

    // Rotation around X
    const y1 = yScaled * Math.cos(rotX) - zScaled * Math.sin(rotX);
    const z1 = yScaled * Math.sin(rotX) + zScaled * Math.cos(rotX);

    // Rotation around Y
    const x2 = xScaled * Math.cos(rotY) + z1 * Math.sin(rotY);
    const z2 = -xScaled * Math.sin(rotY) + z1 * Math.cos(rotY);

    // Rotation around Z
    const x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
    const y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

    const projScale = perspective / (perspective + z2 + 300);

    // Disintegration displacement for Phase 3
    let xDisp = 0;
    let yDisp = 0;
    if (phase === 3) {
      const seed = index * 17 + Math.floor(frame * 0.5);
      const angle = (seed % 360) * (Math.PI / 180);
      const dist = (seed % 80) * phaseProgress;
      xDisp = Math.cos(angle) * dist;
      yDisp = Math.sin(angle) * dist;
    }

    return {
      x2d: centerX + x3 * projScale + xDisp,
      y2d: centerY + y3 * projScale + yDisp,
      scale: projScale,
      z: z2,
      theta: p.theta,
      radius: p.radius,
      armIndex: p.armIndex,
      index,
    };
  });

  // Build Submesh Triangles between neighboring points on spiral arms
  const submeshTriangles: TriangleSubmesh[] = useMemo(() => {
    const tris: TriangleSubmesh[] = [];
    const ptsPerArm = pointsPerArm;
    for (let arm = 0; arm < numArms; arm++) {
      const nextArm = (arm + 1) % numArms;
      const armStart = arm * ptsPerArm;
      const nextArmStart = nextArm * ptsPerArm;

      for (let i = 0; i < ptsPerArm - 1; i++) {
        const p1 = projectedPoints[armStart + i];
        const p2 = projectedPoints[armStart + i + 1];
        const p3 = projectedPoints[nextArmStart + i];

        if (p1 && p2 && p3) {
          tris.push({
            p1,
            p2,
            p3,
            centroidX: (p1.x2d + p2.x2d + p3.x2d) / 3,
            centroidY: (p1.y2d + p2.y2d + p3.y2d) / 3,
          });
        }
      }
    }
    return tris;
  }, [projectedPoints, numArms, pointsPerArm]);

  // Forge Dynamic Falloff Sweep Position (0.0 -> 1.0 along spiral index)
  const forgeSweep = (frame * 0.02) % 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <radialGradient id="spiralGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="60%" stopColor={accentColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Phase 3 & Phase 2 Submesh Wireframe Triangles */}
        {(phase === 2 || phase === 3) &&
          submeshTriangles.map((tri, i) => {
            const triProgress = i / submeshTriangles.length;
            const distFromSweep = Math.abs(triProgress - forgeSweep);
            const isHighlighted = distFromSweep < 0.12;
            const strokeColor = isHighlighted ? secondaryColor : accentColor;
            const strokeOpacity = phase === 3 ? 0.25 : isHighlighted ? 0.7 : 0.2;

            return (
              <polygon
                key={i}
                points={`${tri.p1.x2d},${tri.p1.y2d} ${tri.p2.x2d},${tri.p2.y2d} ${tri.p3.x2d},${tri.p3.y2d}`}
                fill={isHighlighted && phase === 2 ? `${accentColor}15` : 'none'}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? 1.5 : 0.75}
                strokeOpacity={strokeOpacity}
              />
            );
          })}

        {/* Main 3D Logarithmic Spiral Lines */}
        {Array.from({ length: numArms }).map((_, arm) => {
          const armPts = projectedPoints.filter((p) => p.armIndex === arm && p.scale > 0);
          if (armPts.length < 2) return null;

          const pathD = armPts.reduce((acc, p, idx) => {
            return idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`;
          }, '');

          return (
            <path
              key={arm}
              d={pathD}
              fill="none"
              stroke={accentColor}
              strokeWidth={phase === 1 ? 2.5 : 1.8}
              strokeOpacity={phase === 3 ? 0.4 : 0.9}
              filter="url(#laserGlow)"
            />
          );
        })}

        {/* Vertex Points & Forge Dynamic Sweep Highlights */}
        {projectedPoints.map((p, idx) => {
          if (p.scale <= 0) return null;
          const normIdx = idx / projectedPoints.length;
          const distFromSweep = Math.abs(normIdx - forgeSweep);
          const isGlowing = distFromSweep < 0.08;

          return (
            <circle
              key={idx}
              cx={p.x2d}
              cy={p.y2d}
              r={isGlowing ? 4 : phase === 1 ? 2 : 1.5}
              fill={isGlowing ? secondaryColor : accentColor}
              opacity={isGlowing ? 1.0 : 0.6}
            />
          );
        })}

        {/* Phase 1 Center Point Dot */}
        {phase === 1 && phaseProgress < 0.1 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={6}
            fill={accentColor}
            filter="url(#laserGlow)"
          />
        )}
      </svg>

      {/* Phase 4 Brand Box & Logo Reveal */}
      {phase === 4 && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 48px',
            backgroundColor: 'rgba(5, 5, 5, 0.92)',
            border: `1px solid ${accentColor}`,
            borderRadius: '0px', // Swiss Brutalism
            boxShadow: `0 0 30px ${accentColor}40`,
            transform: `scale(${overallScale})`,
            transition: 'transform 0.05s linear',
          }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Brand Logo"
              style={{
                width: '72px',
                height: '72px',
                marginBottom: '16px',
                objectFit: 'contain',
              }}
            />
          )}
          <div
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '28px',
              fontWeight: '800',
              color: secondaryColor,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            {headerText}
          </div>
        </div>
      )}
    </div>
  );
};
