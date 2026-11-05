import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface MobiusLatticeMatrix3DProps extends BasePresetProps {
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

export const MobiusLatticeMatrix3D: React.FC<MobiusLatticeMatrix3DProps> = ({
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

  // Mobius Strip Parameters:
  // Parametric equations:
  // x = [R + s * cos(u / 2)] * cos(u)
  // y = [R + s * cos(u / 2)] * sin(u)
  // z = s * sin(u / 2)
  // where u in [0, 2pi], s in [-w, w]
  const numStepsU = 64; // Segments along strip loop
  const numTracksV = 5;  // Parallel wires across strip width

  // Dispersion increases radial bending distance R and mesh wire width separation
  const R = (150 + clampedDispersion * 300) * scale;
  const stripWidth = (42 + clampedDispersion * 120) * scale;

  // 3D vector path roll/rotation:
  // Strip moves along continuous rolling parameter + Euler camera pitch
  const pathRoll = frame * 0.02;
  const rotX = baseRotX + Math.sin(frame * 0.015) * 0.2;
  const rotY = baseRotY + frame * 0.025;
  const rotZ = Math.cos(frame * 0.01) * 0.15;

  // Sweeping laser pulse traversing the lattice loops
  const pulsePos = (frame * 1.5) % numStepsU;

  // Generate grid lattice vertices: 2D array [trackIdx][stepIdx]
  const latticeGrid: Point3D[][] = useMemo(() => {
    const grid: Point3D[][] = [];
    for (let track = 0; track < numTracksV; track++) {
      const s = ((track / (numTracksV - 1)) * 2 - 1) * stripWidth;
      const trackPoints: Point3D[] = [];

      for (let i = 0; i <= numStepsU; i++) {
        // Offset u by pathRoll to make strip continuously traverse
        const u = (i / numStepsU) * 2 * Math.PI + pathRoll;
        const halfU = u / 2;

        const x = (R + s * Math.cos(halfU)) * Math.cos(u);
        const y = (R + s * Math.cos(halfU)) * Math.sin(u);
        const z = s * Math.sin(halfU);

        trackPoints.push({ x, y, z });
      }
      grid.push(trackPoints);
    }
    return grid;
  }, [numTracksV, numStepsU, R, stripWidth, pathRoll]);

  // Inner Glowing Octahedron Core
  const octRadius = (35 + Math.sin(frame * 0.05) * 6) * scale;
  const octVertices: Point3D[] = [
    { x: octRadius, y: 0, z: 0 },
    { x: -octRadius, y: 0, z: 0 },
    { x: 0, y: octRadius, z: 0 },
    { x: 0, y: -octRadius, z: 0 },
    { x: 0, y: 0, z: octRadius * 1.2 },
    { x: 0, y: 0, z: -octRadius * 1.2 },
  ];
  const octEdges: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5], [3, 4], [3, 5],
  ];

  const coreRotX = baseRotX + frame * 0.04;
  const coreRotY = baseRotY - frame * 0.035;
  const coreRotZ = frame * 0.02;

  const projectedOctVertices = octVertices.map((v) =>
    projectPoint(v, coreRotX, coreRotY, coreRotZ, centerX, centerY, 1200)
  );

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
          <filter id="mobiusCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="mobiusIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
        </defs>



        {/* INNER GLOWING OCTAHEDRON CORE */}
        <g className="mobius-octahedron-core">
          {octEdges.map(([i, j], edgeIdx) => {
            const p1 = projectedOctVertices[i];
            const p2 = projectedOctVertices[j];
            return (
              <line
                key={edgeIdx}
                x1={p1.x2d}
                y1={p1.y2d}
                x2={p2.x2d}
                y2={p2.y2d}
                stroke={primaryColor}
                strokeWidth="1.5"
                strokeOpacity="0.95"
                filter="url(#mobiusCyanGlow)"
              />
            );
          })}
          {projectedOctVertices.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x2d}
              cy={p.y2d}
              r="2"
              fill="#FFFFFF"
              filter="url(#mobiusCyanGlow)"
            />
          ))}
        </g>

        {/* MOBIUS STRIP 1px ISOMETRIC WIREFRAME GRID LATTICE */}
        {/* Longitudinal track lines */}
        {latticeGrid.map((track, trackIdx) => {
          const projectedTrack = track.map((p) =>
            projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
          );
          const isCenterTrack = trackIdx === Math.floor(numTracksV / 2);
          const pathD = projectedTrack.reduce(
            (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
            ''
          );

          return (
            <path
              key={`track-${trackIdx}`}
              d={pathD}
              fill="none"
              stroke={isCenterTrack ? primaryColor : accentColor}
              strokeWidth="1"
              strokeOpacity={isCenterTrack ? 0.9 : 0.6}
              strokeDasharray={isCenterTrack ? 'none' : '4 3'}
              filter={isCenterTrack ? 'url(#mobiusCyanGlow)' : 'url(#mobiusIndigoGlow)'}
            />
          );
        })}

        {/* Transverse cross rungs connecting track wires */}
        {Array.from({ length: numStepsU }).map((_, stepIdx) => {
          if (stepIdx % 2 !== 0) return null; // render every 2 steps for clean 1px wireframe
          const pStart = projectPoint(latticeGrid[0][stepIdx], rotX, rotY, rotZ, centerX, centerY, 1200);
          const pEnd = projectPoint(
            latticeGrid[numTracksV - 1][stepIdx],
            rotX,
            rotY,
            rotZ,
            centerX,
            centerY,
            1200
          );

          // Check if sweeping laser pulse is near this segment
          const distToPulse = Math.abs(stepIdx - pulsePos);
          const isPulseHit = distToPulse < 3 || distToPulse > numStepsU - 3;

          return (
            <g key={`rung-${stepIdx}`}>
              <line
                x1={pStart.x2d}
                y1={pStart.y2d}
                x2={pEnd.x2d}
                y2={pEnd.y2d}
                stroke={isPulseHit ? '#FFFFFF' : primaryColor}
                strokeWidth={isPulseHit ? '2' : '1'}
                strokeOpacity={isPulseHit ? 1.0 : 0.5}
                filter={isPulseHit ? 'url(#mobiusCyanGlow)' : 'none'}
              />
              {/* Vertex node crosshair dots */}
              <circle
                cx={(pStart.x2d + pEnd.x2d) / 2}
                cy={(pStart.y2d + pEnd.y2d) / 2}
                r={isPulseHit ? '2.5' : '1.2'}
                fill={isPulseHit ? primaryColor : accentColor}
                filter={isPulseHit ? 'url(#mobiusCyanGlow)' : 'none'}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MobiusLatticeMatrix3D;
