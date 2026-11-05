import React, { useEffect, useState } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface NestedPlatonicSolids3DProps extends BasePresetProps {
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

// Generate the 5 Platonic Solids
const PHI = (1 + Math.sqrt(5)) / 2; // ~1.6180339887

// 1. Tetrahedron (4 vertices, 6 edges)
function createTetrahedron(radius: number): PolyhedronGeometry {
  const s = radius / Math.sqrt(3);
  const vertices: Point3D[] = [
    { x: s, y: s, z: s },
    { x: -s, y: -s, z: s },
    { x: -s, y: s, z: -s },
    { x: s, y: -s, z: -s },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [1, 3], [2, 3],
  ];
  return { vertices, edges };
}

// 2. Cube / Hexahedron (8 vertices, 12 edges)
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
    // 4 edges along X
    [0, 4], [1, 5], [2, 6], [3, 7],
    // 4 edges along Y
    [0, 2], [1, 3], [4, 6], [5, 7],
    // 4 edges along Z
    [0, 1], [2, 3], [4, 5], [6, 7],
  ];
  return { vertices, edges };
}

// 3. Octahedron (6 vertices, 12 edges)
function createOctahedron(radius: number): PolyhedronGeometry {
  const vertices: Point3D[] = [
    { x: radius, y: 0, z: 0 },
    { x: -radius, y: 0, z: 0 },
    { x: 0, y: radius, z: 0 },
    { x: 0, y: -radius, z: 0 },
    { x: 0, y: 0, z: radius },
    { x: 0, y: 0, z: -radius },
  ];
  const edges: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5], [3, 4], [3, 5],
  ];
  return { vertices, edges };
}

// 4. Dodecahedron (20 vertices, 30 edges)
function createDodecahedron(radius: number): PolyhedronGeometry {
  const rNorm = radius / Math.sqrt(3);
  const invPhi = 1 / PHI;
  const rawVertices: Point3D[] = [];

  // (±1, ±1, ±1) -> 8 vertices
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        rawVertices.push({ x: x * rNorm, y: y * rNorm, z: z * rNorm });
      }
    }
  }
  // (0, ±1/phi, ±phi) -> 4 vertices
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: 0, y: y * invPhi * rNorm, z: z * PHI * rNorm });
    }
  }
  // (±1/phi, ±phi, 0) -> 4 vertices
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      rawVertices.push({ x: x * invPhi * rNorm, y: y * PHI * rNorm, z: 0 });
    }
  }
  // (±phi, 0, ±1/phi) -> 4 vertices
  for (let x = -1; x <= 1; x += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: x * PHI * rNorm, y: 0, z: z * invPhi * rNorm });
    }
  }

  // Find edges: distance between connected vertices in regular dodecahedron is 2/phi * (rNorm)
  const targetDistSq = Math.pow((2 * invPhi) * rNorm, 2);
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

// 5. Icosahedron (12 vertices, 30 edges)
function createIcosahedron(radius: number): PolyhedronGeometry {
  const norm = radius / Math.sqrt(1 + PHI * PHI);
  const rawVertices: Point3D[] = [];

  // (0, ±1, ±phi)
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: 0, y: y * norm, z: z * PHI * norm });
    }
  }
  // (±1, ±phi, 0)
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      rawVertices.push({ x: x * norm, y: y * PHI * norm, z: 0 });
    }
  }
  // (±phi, 0, ±1)
  for (let x = -1; x <= 1; x += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: x * PHI * norm, y: 0, z: z * norm });
    }
  }

  // Edge length in regular icosahedron is 2 * norm
  const targetDistSq = Math.pow(2 * norm, 2);
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

// Project 3D Point with Euler rotation into 2D camera viewport
function projectPoint(
  p: Point3D,
  rotX: number,
  rotY: number,
  rotZ: number,
  centerX: number,
  centerY: number,
  perspective = 1200
): { x2d: number; y2d: number; z: number } {
  // Rotate around X
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  // Rotate around Y
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  // Rotate around Z
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

export const NestedPlatonicSolids3D: React.FC<NestedPlatonicSolids3DProps> = ({
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

  // Base radial shell radii with dispersion gap mapping
  // Layer 0: Center Tetrahedron (innermost)
  // Layer 1: Cube
  // Layer 2: Octahedron
  // Layer 3: Dodecahedron
  // Layer 4: Icosahedron (outermost)
  const baseRadii = [60, 95, 135, 180, 230];
  const shells = baseRadii.map((baseR, idx) => {
    // Expand / contract radial gap based on dispersionAmount
    const dispersionOffset = (idx - 2) * clampedDispersion * 700;
    return Math.max(25, (baseR + dispersionOffset) * scale);
  });

  const [rTetra, rCube, rOcta, rDodec, rIcosa] = shells;

  const geometries: { name: string; geo: PolyhedronGeometry; color: string; rotDir: number }[] = [
    {
      name: 'Tetrahedron',
      geo: createTetrahedron(rTetra),
      color: primaryColor,
      rotDir: 1.0,
    },
    {
      name: 'Cube',
      geo: createCube(rCube),
      color: accentColor,
      rotDir: -0.85,
    },
    {
      name: 'Octahedron',
      geo: createOctahedron(rOcta),
      color: primaryColor,
      rotDir: 0.7,
    },
    {
      name: 'Dodecahedron',
      geo: createDodecahedron(rDodec),
      color: accentColor,
      rotDir: -0.55,
    },
    {
      name: 'Icosahedron',
      geo: createIcosahedron(rIcosa),
      color: primaryColor,
      rotDir: 0.4,
    },
  ];

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;

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
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.7" />
          </filter>
          <filter id="indigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
        </defs>



        {/* 5 Nested Platonic Solids */}
        {geometries.map((shell, shellIdx) => {
          // Continuous frame-based Euler math with counter-rotation
          const t = frame * 0.01 * shell.rotDir;
          const rx = baseRotX + t * 0.8;
          const ry = baseRotY + t * 1.1;
          const rz = t * 0.5;

          const projectedVertices = shell.geo.vertices.map((v) =>
            projectPoint(v, rx, ry, rz, centerX, centerY, 1200)
          );

          const isPrimary = shell.color === primaryColor;

          return (
            <g key={shell.name} className={`shell-${shellIdx}`}>
              {/* Wireframe edges (1px sharp CAD lines) */}
              {shell.geo.edges.map(([i, j], edgeIdx) => {
                const p1 = projectedVertices[i];
                const p2 = projectedVertices[j];
                const avgZ = (p1.z + p2.z) / 2;
                const edgeOpacity = Math.max(0.2, Math.min(0.95, 0.6 + avgZ / 500));

                return (
                  <line
                    key={edgeIdx}
                    x1={p1.x2d}
                    y1={p1.y2d}
                    x2={p2.x2d}
                    y2={p2.y2d}
                    stroke={shell.color}
                    strokeWidth="1"
                    strokeOpacity={edgeOpacity}
                    strokeDasharray={shellIdx % 2 === 1 ? '4 2' : 'none'}
                    filter={isPrimary ? 'url(#cyanGlow)' : 'url(#indigoGlow)'}
                  />
                );
              })}

              {/* Node vertices (1px-2px crosshair CAD dots) */}
              {projectedVertices.map((p, vIdx) => (
                <circle
                  key={vIdx}
                  cx={p.x2d}
                  cy={p.y2d}
                  r={shellIdx === 0 ? 2.5 : 1.5}
                  fill={shell.color}
                  fillOpacity="0.85"
                />
              ))}
            </g>
          );
        })}

        {/* Center glowing focal point */}
        <circle
          cx={centerX}
          cy={centerY}
          r="3"
          fill={primaryColor}
          filter="url(#cyanGlow)"
        />
      </svg>
    </div>
  );
};

export default NestedPlatonicSolids3D;
