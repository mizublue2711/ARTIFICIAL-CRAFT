import React, { useEffect, useState } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface GimbalConcentricRings3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function projectPoint(
  p: Point3D,
  rotX: number,
  rotY: number,
  rotZ: number,
  centerX: number,
  centerY: number,
  perspective = 1200
): { x2d: number; y2d: number; z: number } {
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  const projScale = perspective / (perspective + z2 + 600);
  return {
    x2d: centerX + x3 * projScale,
    y2d: centerY + y3 * projScale,
    z: z2,
  };
}

export const GimbalConcentricRings3D: React.FC<GimbalConcentricRings3DProps> = ({
  frame: propFrame,
  primaryColor = '#00E5FF', // Laser Cyan
  accentColor = '#5322FF',  // Indigo
  scale = 1.0,
  rotateXDeg = 28,          // CAD pitch locked
  rotateYDeg = 0,
  dispersionAmount = 0.05,
  width = 600,
  height = 600,
  style,
  className = '',
}) => {
  const [internalFrame, setInternalFrame] = useState(0);

  useEffect(() => {
    if (propFrame !== undefined) return;
    let animId: number;
    const loop = () => {
      setInternalFrame((f) => f + 1);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [propFrame]);

  const frame = propFrame ?? internalFrame;
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;

  // 4 Concentric Gimbal Rings configuration
  // Each ring has independent Pitch/Roll/Yaw rotations
  const pointsPerRing = 72;
  const ringBaseRadii = [80, 130, 180, 230];

  const ringsConfig = [
    {
      level: 0,
      radius: (ringBaseRadii[0] + dispersionAmount * 200) * scale,
      color: primaryColor,
      // Ring 0 (Innermost): Fast Yaw, subtle Pitch
      rotX: baseRotX + Math.sin(frame * 0.03) * 0.4,
      rotY: baseRotY + frame * 0.035,
      rotZ: frame * 0.015,
      ticks: 12,
      dash: 'none',
      label: 'GIMBAL_L0_CORE',
    },
    {
      level: 1,
      radius: (ringBaseRadii[1] + dispersionAmount * 300) * scale,
      color: accentColor,
      // Ring 1: Fast Pitch, counter Yaw
      rotX: baseRotX + frame * 0.025,
      rotY: baseRotY - frame * 0.018,
      rotZ: Math.cos(frame * 0.02) * 0.5,
      ticks: 16,
      dash: '6 3',
      label: 'GIMBAL_L1_PITCH',
    },
    {
      level: 2,
      radius: (ringBaseRadii[2] + dispersionAmount * 400) * scale,
      color: primaryColor,
      // Ring 2: Roll & harmonic Pitch
      rotX: baseRotX + Math.cos(frame * 0.022) * 0.6,
      rotY: baseRotY + frame * 0.012,
      rotZ: frame * 0.028,
      ticks: 24,
      dash: 'none',
      label: 'GIMBAL_L2_ROLL',
    },
    {
      level: 3,
      radius: (ringBaseRadii[3] + dispersionAmount * 500) * scale,
      color: accentColor,
      // Ring 3 (Outermost Telemetry): Slow steady navigation ring
      rotX: baseRotX + Math.sin(frame * 0.01) * 0.2,
      rotY: baseRotY + frame * 0.008,
      rotZ: -frame * 0.01,
      ticks: 36,
      dash: '8 4',
      label: 'GIMBAL_L3_TELEMETRY',
    },
  ];

  // Center particle core animation
  const corePulse = 1 + Math.sin(frame * 0.08) * 0.25;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width,
        height,
        perspective: '1200px',
        backgroundColor: 'transparent',
        overflow: 'visible',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          overflow: 'visible',
          display: 'block',
        }}
      >
        <defs>
          <filter id="gimbalCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="gimbalIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 4 Gimbal Rings */}
        {ringsConfig.map((ring) => {
          // Generate 3D circle points
          const ringPoints: Point3D[] = [];
          for (let i = 0; i < pointsPerRing; i++) {
            const theta = (i / pointsPerRing) * 2 * Math.PI;
            ringPoints.push({
              x: Math.cos(theta) * ring.radius,
              y: Math.sin(theta) * ring.radius,
              z: 0,
            });
          }

          const projectedRing = ringPoints.map((p) =>
            projectPoint(p, ring.rotX, ring.rotY, ring.rotZ, centerX, centerY, 1200)
          );

          // SVG Path string for ring loop
          const pathD = projectedRing.reduce(
            (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
            ''
          ) + ' Z';

          // CAD Tick marks (+) along the ring circumference
          const tickStep = Math.floor(pointsPerRing / ring.ticks);
          const tickPoints: { center: { x2d: number; y2d: number; z: number }; inner: { x2d: number; y2d: number }; outer: { x2d: number; y2d: number } }[] = [];

          for (let i = 0; i < pointsPerRing; i += tickStep) {
            const theta = (i / pointsPerRing) * 2 * Math.PI;
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);
            const pCenter = projectPoint(
              { x: cosT * ring.radius, y: sinT * ring.radius, z: 0 },
              ring.rotX,
              ring.rotY,
              ring.rotZ,
              centerX,
              centerY,
              1200
            );
            const pInner = projectPoint(
              { x: cosT * (ring.radius - 7), y: sinT * (ring.radius - 7), z: 0 },
              ring.rotX,
              ring.rotY,
              ring.rotZ,
              centerX,
              centerY,
              1200
            );
            const pOuter = projectPoint(
              { x: cosT * (ring.radius + 7), y: sinT * (ring.radius + 7), z: 0 },
              ring.rotX,
              ring.rotY,
              ring.rotZ,
              centerX,
              centerY,
              1200
            );
            tickPoints.push({ center: pCenter, inner: pInner, outer: pOuter });
          }

          const isPrimary = ring.color === primaryColor;

          return (
            <g key={ring.level} className={`gimbal-ring-${ring.level}`}>
              {/* Continuous 1px Wireframe Gimbal Ring */}
              <path
                d={pathD}
                fill="none"
                stroke={ring.color}
                strokeWidth="1"
                strokeDasharray={ring.dash}
                strokeOpacity={0.8}
                filter={isPrimary ? 'url(#gimbalCyanGlow)' : 'url(#gimbalIndigoGlow)'}
              />

              {/* CAD Crosshairs / Tick Marks (+) */}
              {tickPoints.map((tk, tkIdx) => (
                <g key={tkIdx} opacity={0.85}>
                  <line
                    x1={tk.inner.x2d}
                    y1={tk.inner.y2d}
                    x2={tk.outer.x2d}
                    y2={tk.outer.y2d}
                    stroke={ring.color}
                    strokeWidth="1"
                  />
                  {/* Perpendicular tick crossbar */}
                  <circle
                    cx={tk.center.x2d}
                    cy={tk.center.y2d}
                    r="1"
                    fill={ring.color}
                  />
                </g>
              ))}

            </g>
          );
        })}

        {/* Absolute Center Glowing Cyan Particle Core */}
        <g className="particle-core">
          {/* Outer diffuse halo */}
          <circle
            cx={centerX}
            cy={centerY}
            r={18 * corePulse}
            fill={primaryColor}
            fillOpacity="0.15"
            filter="url(#gimbalCyanGlow)"
          />
          {/* Mid core ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={10 * corePulse}
            stroke={primaryColor}
            strokeWidth="1"
            fill="none"
          />
          {/* Solid radiant cyan emitter */}
          <circle
            cx={centerX}
            cy={centerY}
            r={5 * corePulse}
            fill="#FFFFFF"
            filter="url(#gimbalCyanGlow)"
          />
        </g>
      </svg>
    </div>
  );
};

export default GimbalConcentricRings3D;
