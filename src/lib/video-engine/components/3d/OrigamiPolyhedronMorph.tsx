import React, { useEffect, useState } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface OrigamiPolyhedronMorphProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface FacetTriangle {
  v1: Point3D;
  v2: Point3D;
  v3: Point3D;
  normal: Point3D;
  center: Point3D;
}

// 3D Vector Math Helpers
function normalize(v: Point3D): Point3D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function computeNormal(p1: Point3D, p2: Point3D, p3: Point3D): Point3D {
  const u = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  const v = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
  return normalize({
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  });
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

export const OrigamiPolyhedronMorph: React.FC<OrigamiPolyhedronMorphProps> = ({
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

  // Interlocking Crystalline Polyhedron base geometry (Icosahedron base subdivided into facets)
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseRadius = 130 * scale;
  const norm = baseRadius / Math.sqrt(1 + phi * phi);

  // 12 vertices of regular icosahedron
  const rawVertices: Point3D[] = [];
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: 0, y: y * norm, z: z * phi * norm });
    }
  }
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      rawVertices.push({ x: x * norm, y: y * phi * norm, z: 0 });
    }
  }
  for (let x = -1; x <= 1; x += 2) {
    for (let z = -1; z <= 1; z += 2) {
      rawVertices.push({ x: x * phi * norm, y: 0, z: z * norm });
    }
  }

  // 20 triangular faces of icosahedron
  const faceIndices: [number, number, number][] = [
    [0, 1, 8], [0, 8, 4], [0, 4, 6], [0, 6, 2], [0, 2, 1],
    [1, 9, 8], [8, 5, 4], [4, 7, 6], [6, 3, 2], [2, 10, 1],
    [9, 11, 5], [5, 11, 7], [7, 11, 3], [3, 11, 10], [10, 11, 9],
    [1, 9, 10], [8, 9, 5], [4, 5, 7], [6, 7, 3], [2, 3, 10],
  ];

  // Facet unfolding / folding dynamic using Math.sin(frame * 0.05)
  // Animate facet unfolding/folding along face normal vectors
  const morphProgress = Math.sin(frame * 0.05); // -1.0 to 1.0
  const unfoldDist = (0.5 + 0.5 * morphProgress) * 75 * (1 + dispersionAmount * 2);

  const facets: FacetTriangle[] = faceIndices.map(([i1, i2, i3]) => {
    const v1 = rawVertices[i1];
    const v2 = rawVertices[i2];
    const v3 = rawVertices[i3];

    const center: Point3D = {
      x: (v1.x + v2.x + v3.x) / 3,
      y: (v1.y + v2.y + v3.y) / 3,
      z: (v1.z + v2.z + v3.z) / 3,
    };
    const normal = computeNormal(v1, v2, v3);

    // Displace facet along its face normal vector
    const displacedV1: Point3D = {
      x: v1.x + normal.x * unfoldDist,
      y: v1.y + normal.y * unfoldDist,
      z: v1.z + normal.z * unfoldDist,
    };
    const displacedV2: Point3D = {
      x: v2.x + normal.x * unfoldDist,
      y: v2.y + normal.y * unfoldDist,
      z: v2.z + normal.z * unfoldDist,
    };
    const displacedV3: Point3D = {
      x: v3.x + normal.x * unfoldDist,
      y: v3.y + normal.y * unfoldDist,
      z: v3.z + normal.z * unfoldDist,
    };

    return {
      v1: displacedV1,
      v2: displacedV2,
      v3: displacedV3,
      normal,
      center,
    };
  });

  const rotX = baseRotX + frame * 0.012;
  const rotY = baseRotY + frame * 0.018;
  const rotZ = Math.sin(frame * 0.01) * 0.2;

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
          <filter id="origamiCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.7" />
          </filter>
          <filter id="origamiIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Origami Facet Triangles with normal-vector kinematics */}
        {facets.map((facet, idx) => {
          const p1 = projectPoint(facet.v1, rotX, rotY, rotZ, centerX, centerY, 1200);
          const p2 = projectPoint(facet.v2, rotX, rotY, rotZ, centerX, centerY, 1200);
          const p3 = projectPoint(facet.v3, rotX, rotY, rotZ, centerX, centerY, 1200);

          const cProj = projectPoint(facet.center, rotX, rotY, rotZ, centerX, centerY, 1200);
          const isEven = idx % 2 === 0;
          const strokeColor = isEven ? primaryColor : accentColor;
          const strokeWidth = 1;

          // Harmonic unfolding laser umbilical lines from center to unfolded face
          return (
            <g key={idx} className={`facet-${idx}`}>
              {/* Normal umbilical anchor vector */}
              <line
                x1={cProj.x2d}
                y1={cProj.y2d}
                x2={(p1.x2d + p2.x2d + p3.x2d) / 3}
                y2={(p1.y2d + p2.y2d + p3.y2d) / 3}
                stroke={accentColor}
                strokeWidth="1"
                strokeDasharray="2 3"
                strokeOpacity="0.4"
              />

              {/* Facet polygon */}
              <polygon
                points={`${p1.x2d},${p1.y2d} ${p2.x2d},${p2.y2d} ${p3.x2d},${p3.y2d}`}
                fill={isEven ? `${primaryColor}0D` : `${accentColor}12`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                filter={isEven ? 'url(#origamiCyanGlow)' : 'url(#origamiIndigoGlow)'}
              />

              {/* Sub-facet CAD crosshair at facet centroid */}
              <circle
                cx={(p1.x2d + p2.x2d + p3.x2d) / 3}
                cy={(p1.y2d + p2.y2d + p3.y2d) / 3}
                r="1.5"
                fill={primaryColor}
              />
            </g>
          );
        })}

        {/* Inner Crystalline Geometric Core */}
        <circle
          cx={centerX}
          cy={centerY}
          r={16 * (1 - (0.5 + 0.5 * morphProgress) * 0.4)}
          fill="none"
          stroke={primaryColor}
          strokeWidth="1"
          strokeDasharray="3 3"
          filter="url(#origamiCyanGlow)"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill={primaryColor}
          filter="url(#origamiCyanGlow)"
        />
      </svg>
    </div>
  );
};

export default OrigamiPolyhedronMorph;
