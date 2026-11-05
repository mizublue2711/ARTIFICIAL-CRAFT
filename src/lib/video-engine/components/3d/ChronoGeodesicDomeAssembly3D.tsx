import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface ChronoGeodesicDomeAssembly3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface DomeTriangle {
  v1: Point3D;
  v2: Point3D;
  v3: Point3D;
  id: number;
}

interface DomeGeometry {
  vertices: Point3D[];
  edges: [number, number][];
  triangles: DomeTriangle[];
}

function normalize(v: Point3D): Point3D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

// Generate Geodesic Dome (upper hemisphere)
function createGeodesicDome(radius: number, rings = 4, slices = 12): DomeGeometry {
  const vertices: Point3D[] = [];
  const edgesSet = new Set<string>();
  const triangles: DomeTriangle[] = [];

  // Top apex vertex (z = radius)
  vertices.push({ x: 0, y: 0, z: radius });

  // Generate concentric latitudinal rings downwards to the equator
  for (let r = 1; r <= rings; r++) {
    const phi = (r / rings) * (Math.PI / 2); // 0 at top to pi/2 at base
    const ringRadius = Math.sin(phi) * radius;
    const ringZ = Math.cos(phi) * radius;

    for (let s = 0; s < slices; s++) {
      const theta = (s / slices) * 2 * Math.PI;
      vertices.push({
        x: Math.cos(theta) * ringRadius,
        y: Math.sin(theta) * ringRadius,
        z: ringZ,
      });
    }
  }

  // Connect apex (vertex 0) to ring 1
  for (let s = 0; s < slices; s++) {
    const current = 1 + s;
    const next = 1 + ((s + 1) % slices);
    const key1 = `0-${current}`;
    const key2 = `${current}-${next}`;
    edgesSet.add(key1);
    edgesSet.add(key2);

    triangles.push({
      v1: vertices[0],
      v2: vertices[current],
      v3: vertices[next],
      id: triangles.length,
    });
  }

  // Connect intermediate rings with triangular quad diagonals
  for (let r = 1; r < rings; r++) {
    const ringStart = 1 + (r - 1) * slices;
    const nextRingStart = 1 + r * slices;

    for (let s = 0; s < slices; s++) {
      const p1 = ringStart + s;
      const p2 = ringStart + ((s + 1) % slices);
      const p3 = nextRingStart + ((s + 1) % slices);
      const p4 = nextRingStart + s;

      edgesSet.add(`${p1}-${p2}`);
      edgesSet.add(`${p2}-${p3}`);
      edgesSet.add(`${p3}-${p4}`);
      edgesSet.add(`${p4}-${p1}`);
      edgesSet.add(`${p1}-${p3}`); // triangulating diagonal

      triangles.push({
        v1: vertices[p1],
        v2: vertices[p2],
        v3: vertices[p3],
        id: triangles.length,
      });
      triangles.push({
        v1: vertices[p1],
        v2: vertices[p3],
        v3: vertices[p4],
        id: triangles.length,
      });
    }
  }

  const edges: [number, number][] = [];
  edgesSet.forEach((str) => {
    const [a, b] = str.split('-').map(Number);
    edges.push([a, b]);
  });

  return { vertices, edges, triangles };
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

export const ChronoGeodesicDomeAssembly3D: React.FC<ChronoGeodesicDomeAssembly3DProps> = ({
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

  // 3 Nested Wireframe Geodesic Domes
  // Outer Dome: R = 210, Middle Dome: R = 150, Inner Dome: R = 90
  const outerDome = useMemo(() => createGeodesicDome(210 * scale, 4, 16), [scale]);
  const middleDome = useMemo(() => createGeodesicDome(150 * scale, 3, 12), [scale]);
  const innerDome = useMemo(() => createGeodesicDome(90 * scale, 3, 10), [scale]);

  // Exploded assembly view: separate the 3 dome shells along the Z-axis based on dispersionAmount
  const zExplodeOuter = clampedDispersion * 700;
  const zExplodeMiddle = 0;
  const zExplodeInner = -clampedDispersion * 700;

  // Outer dome motion: Rotate along Y
  const outerRotX = baseRotX + Math.sin(frame * 0.01) * 0.1;
  const outerRotY = baseRotY + frame * 0.015;
  const outerRotZ = 0;

  // Middle dome motion: Rotate along X + submesh triangle disintegration
  const middleRotX = baseRotX + frame * 0.022;
  const middleRotY = baseRotY + Math.cos(frame * 0.015) * 0.3;
  const middleRotZ = frame * 0.008;

  // Inner dome motion: Elevate along Z with vertical harmonic bounce
  const innerElevation = Math.sin(frame * 0.05) * 20 * scale;
  const innerRotX = baseRotX + frame * 0.03;
  const innerRotY = baseRotY - frame * 0.025;
  const innerRotZ = frame * 0.015;

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
          <filter id="domeCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="domeIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
        </defs>



        {/* SHELL 1: OUTER GEODESIC DOME (Y-rotation) */}
        <g className="outer-dome-shell">
          {(() => {
            const projected = outerDome.vertices.map((v) =>
              projectPoint(
                { x: v.x, y: v.y, z: v.z + zExplodeOuter },
                outerRotX,
                outerRotY,
                outerRotZ,
                centerX,
                centerY,
                1200
              )
            );

            return (
              <>
                {outerDome.edges.map(([i, j], edgeIdx) => {
                  const p1 = projected[i];
                  const p2 = projected[j];
                  return (
                    <line
                      key={edgeIdx}
                      x1={p1.x2d}
                      y1={p1.y2d}
                      x2={p2.x2d}
                      y2={p2.y2d}
                      stroke={primaryColor}
                      strokeWidth="1"
                      strokeOpacity="0.75"
                      filter="url(#domeCyanGlow)"
                    />
                  );
                })}

                {/* Data Node points at vertices */}
                {projected.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x2d}
                    cy={p.y2d}
                    r="1.8"
                    fill={primaryColor}
                    fillOpacity="0.9"
                  />
                ))}
              </>
            );
          })()}
        </g>

        {/* SHELL 2: MIDDLE GEODESIC DOME (X-rotation with triangle disintegration) */}
        <g className="middle-dome-shell">
          {middleDome.triangles.map((tri, tIdx) => {
            // Harmonic submesh disintegration along normal
            const disintegrateFactor = Math.sin(frame * 0.04 + tIdx * 0.3);
            const offsetDist = Math.max(0, disintegrateFactor * 25 * (1 + clampedDispersion * 2));
            const norm = normalize({
              x: (tri.v1.x + tri.v2.x + tri.v3.x) / 3,
              y: (tri.v1.y + tri.v2.y + tri.v3.y) / 3,
              z: (tri.v1.z + tri.v2.z + tri.v3.z) / 3,
            });

            const p1 = projectPoint(
              {
                x: tri.v1.x + norm.x * offsetDist,
                y: tri.v1.y + norm.y * offsetDist,
                z: tri.v1.z + norm.z * offsetDist + zExplodeMiddle,
              },
              middleRotX,
              middleRotY,
              middleRotZ,
              centerX,
              centerY,
              1200
            );
            const p2 = projectPoint(
              {
                x: tri.v2.x + norm.x * offsetDist,
                y: tri.v2.y + norm.y * offsetDist,
                z: tri.v2.z + norm.z * offsetDist + zExplodeMiddle,
              },
              middleRotX,
              middleRotY,
              middleRotZ,
              centerX,
              centerY,
              1200
            );
            const p3 = projectPoint(
              {
                x: tri.v3.x + norm.x * offsetDist,
                y: tri.v3.y + norm.y * offsetDist,
                z: tri.v3.z + norm.z * offsetDist + zExplodeMiddle,
              },
              middleRotX,
              middleRotY,
              middleRotZ,
              centerX,
              centerY,
              1200
            );

            return (
              <polygon
                key={tIdx}
                points={`${p1.x2d},${p1.y2d} ${p2.x2d},${p2.y2d} ${p3.x2d},${p3.y2d}`}
                fill={`${accentColor}10`}
                stroke={accentColor}
                strokeWidth="1"
                strokeDasharray="4 2"
                strokeOpacity="0.8"
                filter="url(#domeIndigoGlow)"
              />
            );
          })}
        </g>

        {/* SHELL 3: INNER GEODESIC DOME (Z-elevation) */}
        <g className="inner-dome-shell">
          {(() => {
            const projected = innerDome.vertices.map((v) =>
              projectPoint(
                { x: v.x, y: v.y, z: v.z + innerElevation + zExplodeInner },
                innerRotX,
                innerRotY,
                innerRotZ,
                centerX,
                centerY,
                1200
              )
            );

            return (
              <>
                {innerDome.edges.map(([i, j], edgeIdx) => {
                  const p1 = projected[i];
                  const p2 = projected[j];
                  return (
                    <line
                      key={edgeIdx}
                      x1={p1.x2d}
                      y1={p1.y2d}
                      x2={p2.x2d}
                      y2={p2.y2d}
                      stroke={primaryColor}
                      strokeWidth="1.2"
                      strokeOpacity="0.9"
                      filter="url(#domeCyanGlow)"
                    />
                  );
                })}
                {projected.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x2d}
                    cy={p.y2d}
                    r="2.5"
                    fill="#FFFFFF"
                    filter="url(#domeCyanGlow)"
                  />
                ))}
              </>
            );
          })()}
        </g>


      </svg>
    </div>
  );
};

export default ChronoGeodesicDomeAssembly3D;
