import React, { useEffect, useState } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface KeplerHarmonicOrbital3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface PolyhedronGeometry {
  vertices: Point3D[];
  edges: [number, number][];
}

const PHI = (1 + Math.sqrt(5)) / 2;

function createDodecahedron(radius: number): PolyhedronGeometry {
  const rNorm = radius / Math.sqrt(3);
  const invPhi = 1 / PHI;
  const rawVertices: Point3D[] = [];

  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        rawVertices.push({ x: x * rNorm, y: y * rNorm, z: z * rNorm });
      }
    }
  }
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: 0, y: y * invPhi * rNorm, z: z * PHI * rNorm });
    }
  }
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      rawVertices.push({ x: x * invPhi * rNorm, y: y * PHI * rNorm, z: 0 });
    }
  }
  for (let x = -1; x <= 1; x += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: x * PHI * rNorm, y: 0, z: z * invPhi * rNorm });
    }
  }

  const targetDistSq = Math.pow(2 * invPhi * rNorm, 2);
  const edges: [number, number][] = [];
  for (let i = 0; i < rawVertices.length; i++) {
    for (let j = i + 1; j < rawVertices.length; j++) {
      const dx = rawVertices[i].x - rawVertices[j].x;
      const dy = rawVertices[i].y - rawVertices[j].y;
      const dz = rawVertices[i].z - rawVertices[j].z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (Math.abs(distSq - targetDistSq) < targetDistSq * 0.15) {
        edges.push([i, j]);
      }
    }
  }
  return { vertices: rawVertices, edges };
}

function createCube(radius: number): PolyhedronGeometry {
  const s = radius / Math.sqrt(3);
  const vertices: Point3D[] = [];
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        vertices.push({ x: x * s, y: y * s, z: z * s });
      }
    }
  }
  const edges: [number, number][] = [
    [0, 4], [1, 5], [2, 6], [3, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 1], [2, 3], [4, 5], [6, 7],
  ];
  return { vertices, edges };
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

export const KeplerHarmonicOrbital3D: React.FC<KeplerHarmonicOrbital3DProps> = ({
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

  // Dispersion expands Z-axis axial spacing between the 3 layers
  const zOffsetOuter = -clampedDispersion * 650;
  const zOffsetMiddle = 0;
  const zOffsetInner = clampedDispersion * 650;

  // 1. Outer 1px CAD Torus ring with tick marks
  // Counter-rotates along Y-axis
  const torusMajorR = 210 * scale;
  const torusMinorR = 30 * scale;
  const torusSegmentsU = 48;
  const torusSegmentsV = 8;
  const torusRotX = baseRotX + Math.sin(frame * 0.015) * 0.2;
  const torusRotY = baseRotY - frame * 0.02; // counter-rotate Y
  const torusRotZ = frame * 0.005;

  const torusPoints: Point3D[] = [];
  const torusTicks: { inner: Point3D; outer: Point3D; center: Point3D }[] = [];

  for (let u = 0; u < torusSegmentsU; u++) {
    const theta = (u / torusSegmentsU) * 2 * Math.PI;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Main ring center point
    const cx = cosT * torusMajorR;
    const cy = sinT * torusMajorR;
    torusPoints.push({ x: cx, y: cy, z: zOffsetOuter });

    // Tick marks along outer perimeter
    if (u % 4 === 0) {
      torusTicks.push({
        inner: { x: cosT * (torusMajorR - 10), y: sinT * (torusMajorR - 10), z: zOffsetOuter },
        outer: { x: cosT * (torusMajorR + 10), y: sinT * (torusMajorR + 10), z: zOffsetOuter },
        center: { x: cx, y: cy, z: zOffsetOuter },
      });
    }
  }

  // Generate a few helical rings across torus tube for CAD depth
  const torusTubeLines: Point3D[][] = [];
  for (let v = 0; v < torusSegmentsV; v++) {
    const phi = (v / torusSegmentsV) * 2 * Math.PI;
    const tubeLine: Point3D[] = [];
    for (let u = 0; u <= torusSegmentsU; u++) {
      const theta = (u / torusSegmentsU) * 2 * Math.PI;
      const x = (torusMajorR + torusMinorR * Math.cos(phi)) * Math.cos(theta);
      const y = (torusMajorR + torusMinorR * Math.cos(phi)) * Math.sin(theta);
      const z = torusMinorR * Math.sin(phi) + zOffsetOuter;
      tubeLine.push({ x, y, z });
    }
    torusTubeLines.push(tubeLine);
  }

  // 2. Middle Dodecahedron cage
  // Counter-rotates along X-axis
  const dodecahedronRadius = 145 * scale;
  const dodecahedron = createDodecahedron(dodecahedronRadius);
  const dodecaRotX = baseRotX + frame * 0.025; // counter-rotate X
  const dodecaRotY = baseRotY + Math.cos(frame * 0.012) * 0.4;
  const dodecaRotZ = frame * 0.01;

  // 3. Inner tilted cube
  // Tilted and pulsing in scale with frame time
  const cubePulse = 1.0 + Math.sin(frame * 0.06) * 0.18;
  const cubeRadius = 70 * scale * cubePulse;
  const cube = createCube(cubeRadius);
  const cubeRotX = baseRotX + 0.6 + frame * 0.04;
  const cubeRotY = baseRotY + 0.4 + frame * 0.03;
  const cubeRotZ = frame * 0.02;

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
          <filter id="keplerCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="keplerIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* LAYER 1: OUTER 1px CAD TORUS RING WITH TICKS */}
        <g className="torus-layer">
          {/* Torus circular tube lines */}
          {torusTubeLines.map((tube, tIdx) => {
            const projected = tube.map((p) =>
              projectPoint(p, torusRotX, torusRotY, torusRotZ, centerX, centerY, 1200)
            );
            const pathD = projected.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            );
            return (
              <path
                key={tIdx}
                d={pathD}
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity={tIdx % 2 === 0 ? 0.6 : 0.3}
                strokeDasharray={tIdx % 2 === 0 ? 'none' : '4 3'}
              />
            );
          })}

          {/* Torus Tick marks (+) */}
          {torusTicks.map((tk, idx) => {
            const pInner = projectPoint(tk.inner, torusRotX, torusRotY, torusRotZ, centerX, centerY, 1200);
            const pOuter = projectPoint(tk.outer, torusRotX, torusRotY, torusRotZ, centerX, centerY, 1200);
            const pCenter = projectPoint(tk.center, torusRotX, torusRotY, torusRotZ, centerX, centerY, 1200);

            return (
              <g key={idx}>
                <line
                  x1={pInner.x2d}
                  y1={pInner.y2d}
                  x2={pOuter.x2d}
                  y2={pOuter.y2d}
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />
                <circle cx={pCenter.x2d} cy={pCenter.y2d} r="1.2" fill={primaryColor} />
              </g>
            );
          })}
        </g>

        {/* LAYER 2: MIDDLE DODECAHEDRON CAGE */}
        <g className="dodecahedron-layer">
          {(() => {
            const projectedVertices = dodecahedron.vertices.map((v) =>
              projectPoint(
                { x: v.x, y: v.y, z: v.z + zOffsetMiddle },
                dodecaRotX,
                dodecaRotY,
                dodecaRotZ,
                centerX,
                centerY,
                1200
              )
            );

            return (
              <>
                {dodecahedron.edges.map(([i, j], edgeIdx) => {
                  const p1 = projectedVertices[i];
                  const p2 = projectedVertices[j];
                  return (
                    <line
                      key={edgeIdx}
                      x1={p1.x2d}
                      y1={p1.y2d}
                      x2={p2.x2d}
                      y2={p2.y2d}
                      stroke={primaryColor}
                      strokeWidth="1"
                      strokeOpacity="0.85"
                      filter="url(#keplerCyanGlow)"
                    />
                  );
                })}
                {projectedVertices.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x2d}
                    cy={p.y2d}
                    r="2"
                    fill={primaryColor}
                    fillOpacity="0.9"
                  />
                ))}
              </>
            );
          })()}
        </g>

        {/* LAYER 3: INNER TILTED PULSING CUBE */}
        <g className="cube-layer">
          {(() => {
            const projectedCubeVertices = cube.vertices.map((v) =>
              projectPoint(
                { x: v.x, y: v.y, z: v.z + zOffsetInner },
                cubeRotX,
                cubeRotY,
                cubeRotZ,
                centerX,
                centerY,
                1200
              )
            );

            return (
              <>
                {cube.edges.map(([i, j], edgeIdx) => {
                  const p1 = projectedCubeVertices[i];
                  const p2 = projectedCubeVertices[j];
                  return (
                    <line
                      key={edgeIdx}
                      x1={p1.x2d}
                      y1={p1.y2d}
                      x2={p2.x2d}
                      y2={p2.y2d}
                      stroke={accentColor}
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      strokeOpacity="0.95"
                      filter="url(#keplerIndigoGlow)"
                    />
                  );
                })}
                {projectedCubeVertices.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x2d}
                    cy={p.y2d}
                    r="2.5"
                    fill={primaryColor}
                    filter="url(#keplerCyanGlow)"
                  />
                ))}
              </>
            );
          })()}
        </g>

        {/* Center Target Point */}
        <circle cx={centerX} cy={centerY} r="2" fill="#FFFFFF" filter="url(#keplerCyanGlow)" />
      </svg>
    </div>
  );
};

export default KeplerHarmonicOrbital3D;
