import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface ChiralDoubleHelixMatrix3DProps extends BasePresetProps {
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

// Tetrahedron sub-cube vertices helper centered at origin
function createTetrahedron(size: number): Point3D[] {
  const s = size / Math.sqrt(3);
  return [
    { x: s, y: s, z: s },
    { x: -s, y: -s, z: s },
    { x: -s, y: s, z: -s },
    { x: s, y: -s, z: -s },
  ];
}

const tetraEdges: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 2], [1, 3], [2, 3],
];

// Helper to interpolate between two hex colors
function interpolateColor(hex1: string, hex2: string, factor: number): string {
  const c1 = hex1.replace('#', '');
  const c2 = hex2.replace('#', '');
  if (c1.length !== 6 || c2.length !== 6) return hex1;

  const r1 = parseInt(c1.substring(0, 2), 16);
  const g1 = parseInt(c1.substring(2, 4), 16);
  const b1 = parseInt(c1.substring(4, 6), 16);

  const r2 = parseInt(c2.substring(0, 2), 16);
  const g2 = parseInt(c2.substring(2, 4), 16);
  const b2 = parseInt(c2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

export const ChiralDoubleHelixMatrix3D: React.FC<ChiralDoubleHelixMatrix3DProps> = ({
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
  const clampedDispersion = Math.max(0.0, Math.min(0.12, dispersionAmount));

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;

  // Dispersion expands lateral distance between the two chiral helix strands
  const lateralExpansion = 1 + clampedDispersion * 3.0;
  const helixRadius = 110 * scale * lateralExpansion;
  const totalHeight = 360 * scale;
  const numRungs = 24;
  const numTurns = 2.5;

  // Counter-rotating helix twist
  const twistPhase = frame * 0.025;
  const rotX = baseRotX + Math.sin(frame * 0.012) * 0.15;
  const rotY = baseRotY + frame * 0.02;
  const rotZ = Math.cos(frame * 0.015) * 0.1;

  // Generate double-helix strands and interconnecting rungs
  const helixData = useMemo(() => {
    const strandA: Point3D[] = [];
    const strandB: Point3D[] = [];
    const rungs: { pA: Point3D; pB: Point3D; center: Point3D; index: number }[] = [];

    const steps = 96;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI * numTurns + twistPhase;
      const z = ((i / steps) * 2 - 1) * (totalHeight / 2);

      const xA = Math.cos(t) * helixRadius;
      const yA = Math.sin(t) * helixRadius;

      // Strand B is chiral opposite (phase shifted by Math.PI)
      const xB = Math.cos(t + Math.PI) * helixRadius;
      const yB = Math.sin(t + Math.PI) * helixRadius;

      strandA.push({ x: xA, y: yA, z });
      strandB.push({ x: xB, y: yB, z });
    }

    // Interconnecting rungs
    for (let r = 0; r < numRungs; r++) {
      const stepIdx = Math.floor((r / (numRungs - 1)) * steps);
      const pA = strandA[stepIdx];
      const pB = strandB[stepIdx];
      const center: Point3D = {
        x: (pA.x + pB.x) / 2,
        y: (pA.y + pB.y) / 2,
        z: (pA.z + pB.z) / 2,
      };
      rungs.push({ pA, pB, center, index: r });
    }

    return { strandA, strandB, rungs };
  }, [totalHeight, helixRadius, numRungs, numTurns, twistPhase]);

  // Base Tetrahedron geometry for sub-cubes on rungs
  const baseTetra = useMemo(() => createTetrahedron(16 * scale), [scale]);

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
          <filter id="helixCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="helixIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
        </defs>



        {/* STRAND A (1px CAD ribbon in Laser Cyan) */}
        {(() => {
          const projectedA = helixData.strandA.map((p) =>
            projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
          );
          const pathA = projectedA.reduce(
            (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
            ''
          );
          return (
            <path
              d={pathA}
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeOpacity="0.9"
              filter="url(#helixCyanGlow)"
            />
          );
        })()}

        {/* STRAND B (1px CAD ribbon in Indigo) */}
        {(() => {
          const projectedB = helixData.strandB.map((p) =>
            projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
          );
          const pathB = projectedB.reduce(
            (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
            ''
          );
          return (
            <path
              d={pathB}
              fill="none"
              stroke={accentColor}
              strokeWidth="1.5"
              strokeOpacity="0.85"
              strokeDasharray="4 2"
              filter="url(#helixIndigoGlow)"
            />
          );
        })()}

        {/* INTERCONNECTING RUNGS WITH ROTATING TETRAHEDRON SUB-CUBES */}
        {helixData.rungs.map((rung) => {
          const pA = projectPoint(rung.pA, rotX, rotY, rotZ, centerX, centerY, 1200);
          const pB = projectPoint(rung.pB, rotX, rotY, rotZ, centerX, centerY, 1200);

          // Transition rung nodes between Laser Cyan and Indigo
          const colorWave = 0.5 + 0.5 * Math.sin(frame * 0.05 + rung.index * 0.4);
          const rungColor = interpolateColor(primaryColor, accentColor, colorWave);

          // Rotate tetrahedron mounted at rung center
          const tetraAngle = frame * 0.05 + rung.index * 0.5;
          const cosT = Math.cos(tetraAngle);
          const sinT = Math.sin(tetraAngle);

          const rotatedTetra = baseTetra.map((tv) => {
            // Rotate around Y locally then offset to rung center
            const rx = tv.x * cosT - tv.z * sinT + rung.center.x;
            const rz = tv.x * sinT + tv.z * cosT + rung.center.z;
            const ry = tv.y + rung.center.y;
            return { x: rx, y: ry, z: rz };
          });

          const projectedTetra = rotatedTetra.map((tv) =>
            projectPoint(tv, rotX, rotY, rotZ, centerX, centerY, 1200)
          );

          return (
            <g key={`rung-${rung.index}`}>
              {/* Rung line */}
              <line
                x1={pA.x2d}
                y1={pA.y2d}
                x2={pB.x2d}
                y2={pB.y2d}
                stroke={rungColor}
                strokeWidth="1"
                strokeOpacity="0.75"
              />

              {/* Tetrahedron sub-cube wireframe */}
              {tetraEdges.map(([ti, tj], eIdx) => {
                const tp1 = projectedTetra[ti];
                const tp2 = projectedTetra[tj];
                return (
                  <line
                    key={eIdx}
                    x1={tp1.x2d}
                    y1={tp1.y2d}
                    x2={tp2.x2d}
                    y2={tp2.y2d}
                    stroke={rungColor}
                    strokeWidth="1"
                    strokeOpacity="0.9"
                    filter="url(#helixCyanGlow)"
                  />
                );
              })}

              {/* Rung end anchor nodes */}
              <circle cx={pA.x2d} cy={pA.y2d} r="1.5" fill={primaryColor} />
              <circle cx={pB.x2d} cy={pB.y2d} r="1.5" fill={accentColor} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChiralDoubleHelixMatrix3D;
