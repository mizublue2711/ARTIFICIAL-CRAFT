import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface HyperbolicLatticeCageProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  ring: number;
  angleIndex: number;
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

export const HyperbolicLatticeCage: React.FC<HyperbolicLatticeCageProps> = ({
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

  // Hyperboloid of one sheet: (x^2 + y^2)/a^2 - z^2/c^2 = 1
  // Parameterized with circular rings along Z:
  // r(z) = a * sqrt(1 + (z/c)^2)
  const numRings = 9;
  const nodesPerRing = 16;
  const a = (90 + dispersionAmount * 200) * scale;
  const c = 120 * scale;
  const heightExtent = 220 * scale;

  const latticeNodes: Point3D[] = useMemo(() => {
    const nodes: Point3D[] = [];
    for (let r = 0; r < numRings; r++) {
      // z spans from -heightExtent to +heightExtent
      const zNorm = (r / (numRings - 1)) * 2 - 1; // -1 to 1
      const z = zNorm * heightExtent;
      const radius = a * Math.sqrt(1 + Math.pow(z / c, 2));

      // Alternate twist angle per ring to form a skew hyperbolic lattice
      const twist = zNorm * 0.9;

      for (let n = 0; n < nodesPerRing; n++) {
        const theta = (n / nodesPerRing) * 2 * Math.PI + twist;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        nodes.push({ x, y, z, ring: r, angleIndex: n });
      }
    }
    return nodes;
  }, [numRings, nodesPerRing, a, c, heightExtent]);

  // Outer cage rotation
  const cageRotX = baseRotX + Math.sin(frame * 0.015) * 0.15;
  const cageRotY = baseRotY + frame * 0.018;
  const cageRotZ = frame * 0.008;

  // Inner geometric core rotation (counter-rotating at higher speed)
  const coreRotX = baseRotX + frame * 0.03;
  const coreRotY = baseRotY - frame * 0.045;
  const coreRotZ = frame * 0.02;

  // Inner rotating core vertices (Octahedron / Diamond core)
  const coreRadius = 45 * scale;
  const coreVertices: Point3D[] = [
    { x: coreRadius, y: 0, z: 0, ring: -1, angleIndex: 0 },
    { x: -coreRadius, y: 0, z: 0, ring: -1, angleIndex: 1 },
    { x: 0, y: coreRadius, z: 0, ring: -1, angleIndex: 2 },
    { x: 0, y: -coreRadius, z: 0, ring: -1, angleIndex: 3 },
    { x: 0, y: 0, z: coreRadius * 1.3, ring: -1, angleIndex: 4 },
    { x: 0, y: 0, z: -coreRadius * 1.3, ring: -1, angleIndex: 5 },
  ];
  const coreEdges: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5], [3, 4], [3, 5],
  ];

  // Projected nodes for outer cage
  const projectedCageNodes = latticeNodes.map((node) =>
    projectPoint(node, cageRotX, cageRotY, cageRotZ, centerX, centerY, 1200)
  );

  // Projected nodes for inner core
  const projectedCoreNodes = coreVertices.map((v) =>
    projectPoint(v, coreRotX, coreRotY, coreRotZ, centerX, centerY, 1200)
  );

  // Dynamic 1px laser vector links between proximity node points on the outer cage
  // Calculate ruling lines of the hyperboloid (generators along asymptotic directions)
  const generatorLinks: [number, number][] = [];
  for (let r = 0; r < numRings - 1; r++) {
    for (let n = 0; n < nodesPerRing; n++) {
      const idx = r * nodesPerRing + n;
      // Straight ring circular neighbor
      const nextN = (n + 1) % nodesPerRing;
      const rightIdx = r * nodesPerRing + nextN;
      generatorLinks.push([idx, rightIdx]);

      // Skew generator 1 (forward diagonal)
      const nextRingIdx = (r + 1) * nodesPerRing + ((n + 1) % nodesPerRing);
      generatorLinks.push([idx, nextRingIdx]);

      // Skew generator 2 (backward diagonal)
      const backRingIdx = (r + 1) * nodesPerRing + ((n - 1 + nodesPerRing) % nodesPerRing);
      generatorLinks.push([idx, backRingIdx]);
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width,
        height,
        perspective: '1200px',
        backgroundColor: '#050505',
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
          <filter id="hyperbolicCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="hyperbolicIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Hyperbolic Lattice Cage - 1px laser vector links */}
        <g className="hyperbolic-cage-links">
          {generatorLinks.map(([i1, i2], linkIdx) => {
            const p1 = projectedCageNodes[i1];
            const p2 = projectedCageNodes[i2];
            const isDiagonal = linkIdx % 3 !== 0;
            const strokeColor = isDiagonal ? accentColor : primaryColor;
            const opacity = isDiagonal ? 0.45 : 0.75;

            return (
              <line
                key={linkIdx}
                x1={p1.x2d}
                y1={p1.y2d}
                x2={p2.x2d}
                y2={p2.y2d}
                stroke={strokeColor}
                strokeWidth="1"
                strokeOpacity={opacity}
                filter={isDiagonal ? 'none' : 'url(#hyperbolicCyanGlow)'}
              />
            );
          })}
        </g>

        {/* Outer Cage Node Junctions */}
        <g className="hyperbolic-cage-nodes">
          {projectedCageNodes.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x2d}
              cy={p.y2d}
              r="1.5"
              fill={primaryColor}
              fillOpacity="0.85"
            />
          ))}
        </g>

        {/* Inner Rotating Geometric Core (Enclosed) */}
        <g className="inner-geometric-core">
          {coreEdges.map(([i, j], edgeIdx) => {
            const p1 = projectedCoreNodes[i];
            const p2 = projectedCoreNodes[j];
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
                filter="url(#hyperbolicCyanGlow)"
              />
            );
          })}

          {projectedCoreNodes.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x2d}
              cy={p.y2d}
              r="2.5"
              fill="#FFFFFF"
              filter="url(#hyperbolicCyanGlow)"
            />
          ))}
        </g>

        {/* Dynamic Laser Links from Core to Proximity Outer Nodes */}
        {projectedCoreNodes.map((cp, cIdx) => {
          // Connect to the closest outer cage node to create real-time energy arcs
          const targetNode = projectedCageNodes[(cIdx * 24 + Math.floor(frame * 0.4)) % projectedCageNodes.length];
          return (
            <line
              key={`laser-${cIdx}`}
              x1={cp.x2d}
              y1={cp.y2d}
              x2={targetNode.x2d}
              y2={targetNode.y2d}
              stroke={primaryColor}
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity="0.5"
            />
          );
        })}
      </svg>

      {/* Cybernetic Brutalist HUD Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          color: primaryColor,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        <div>HYPERBOLIC//LATTICE_CAGE_V8</div>
        <div style={{ color: '#71717a' }}>
          GEN_RULINGS: {generatorLinks.length} | NODES: {latticeNodes.length}
        </div>
      </div>
    </div>
  );
};

export default HyperbolicLatticeCage;
