import React, { useEffect, useState } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface IsometricTesseractHypercube3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// 4D to 3D perspective projection with rotation in 4D space
function rotateAndProject4D(
  p: Point4D,
  angleXW: number,
  angleYW: number,
  angleZW: number,
  distance4D = 2.4
): Point3D {
  let { x, y, z, w } = p;

  // Rotation in XW plane
  const cosXW = Math.cos(angleXW);
  const sinXW = Math.sin(angleXW);
  const x1 = x * cosXW - w * sinXW;
  const w1 = x * sinXW + w * cosXW;
  x = x1;
  w = w1;

  // Rotation in YW plane
  const cosYW = Math.cos(angleYW);
  const sinYW = Math.sin(angleYW);
  const y1 = y * cosYW - w * sinYW;
  const w2 = y * sinYW + w * cosYW;
  y = y1;
  w = w2;

  // Rotation in ZW plane
  const cosZW = Math.cos(angleZW);
  const sinZW = Math.sin(angleZW);
  const z1 = z * cosZW - w * sinZW;
  const w3 = z * sinZW + w * cosZW;
  z = z1;
  w = w3;

  // 4D-to-3D perspective projection
  const scale4D = 1 / Math.max(0.2, distance4D - w);
  return {
    x: x * scale4D,
    y: y * scale4D,
    z: z * scale4D,
  };
}

// 3D to 2D perspective projection with Euler camera rotation
function projectPoint3D(
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

export const IsometricTesseractHypercube3D: React.FC<IsometricTesseractHypercube3DProps> = ({
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

  // 16 Vertices of a 4D Hypercube (±1, ±1, ±1, ±1)
  const vertices4D: Point4D[] = [];
  for (let x = -1; x <= 1; x += 2) {
    for (let y = -1; y <= 1; y += 2) {
      for (let z = -1; z <= 1; z += 2) {
        for (let w = -1; w <= 1; w += 2) {
          vertices4D.push({ x, y, z, w });
        }
      }
    }
  }

  // Edges of a 4D Hypercube: vertices differing in exactly one coordinate (32 edges)
  const edges4D: [number, number][] = [];
  for (let i = 0; i < vertices4D.length; i++) {
    for (let j = i + 1; j < vertices4D.length; j++) {
      const p1 = vertices4D[i];
      const p2 = vertices4D[j];
      const diff =
        Math.abs(p1.x - p2.x) / 2 +
        Math.abs(p1.y - p2.y) / 2 +
        Math.abs(p1.z - p2.z) / 2 +
        Math.abs(p1.w - p2.w) / 2;
      if (Math.round(diff) === 1) {
        edges4D.push([i, j]);
      }
    }
  }

  // 4D Rotation angles driving the inside-out fold
  const t = frame * 0.03;
  const angleXW = Math.sin(t) * 1.4;
  const angleYW = t * 0.8;
  const angleZW = Math.cos(t * 0.5) * 0.6;

  // Apply dispersion gap expansion to 4D coordinates
  const expansionFactor = 1 + clampedDispersion * 2.5;
  const baseSize = 160 * scale * expansionFactor;

  // Project 4D to 3D
  const points3D = vertices4D.map((v) => {
    const p3d = rotateAndProject4D(v, angleXW, angleYW, angleZW, 2.2);
    return {
      x: p3d.x * baseSize,
      y: p3d.y * baseSize,
      z: p3d.z * baseSize,
    };
  });

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;
  const rotX = baseRotX + frame * 0.005;
  const rotY = baseRotY + frame * 0.008;
  const rotZ = Math.sin(frame * 0.01) * 0.15;

  // Project 3D to 2D
  const projected2D = points3D.map((p) =>
    projectPoint3D(p, rotX, rotY, rotZ, centerX, centerY, 1200)
  );

  // Laser Cyan pulse sweep (frame % 180)
  const sweepProgress = (frame % 180) / 180;
  const sweepY = centerY - 250 + sweepProgress * 500;

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
          <filter id="tesseractCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.8" />
          </filter>
          <filter id="tesseractIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.6" />
          </filter>
          <linearGradient id="laserPulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
            <stop offset="50%" stopColor={primaryColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </linearGradient>
        </defs>



        {/* 4D Laser Pulse Sweep Line */}
        <line
          x1={centerX - 240}
          y1={sweepY}
          x2={centerX + 240}
          y2={sweepY}
          stroke={primaryColor}
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="4 4"
        />

        {/* 32 Edges connecting 16 vertices of Tesseract */}
        {edges4D.map(([i, j], edgeIdx) => {
          const p1 = projected2D[i];
          const p2 = projected2D[j];
          const raw1 = vertices4D[i];
          const raw2 = vertices4D[j];

          // Differentiate inner cube (w === -1), outer cube (w === 1), and corner interconnect vector lines
          const isInterconnecting = raw1.w !== raw2.w;
          const isInnerCube = raw1.w === -1 && raw2.w === -1;
          const isOuterCube = raw1.w === 1 && raw2.w === 1;

          let strokeColor = primaryColor;
          let strokeDash = 'none';
          let strokeOpacity = 0.85;

          if (isInterconnecting) {
            strokeColor = accentColor;
            strokeDash = '3 3';
            strokeOpacity = 0.6 + clampedDispersion * 2;
          } else if (isInnerCube) {
            strokeColor = primaryColor;
            strokeOpacity = 0.75;
          } else if (isOuterCube) {
            strokeColor = accentColor;
            strokeOpacity = 0.9;
          }

          const avgY = (p1.y2d + p2.y2d) / 2;
          const isSwept = Math.abs(avgY - sweepY) < 22;

          return (
            <line
              key={edgeIdx}
              x1={p1.x2d}
              y1={p1.y2d}
              x2={p2.x2d}
              y2={p2.y2d}
              stroke={isSwept ? '#FFFFFF' : strokeColor}
              strokeWidth={isSwept ? '1.5' : '1'}
              strokeDasharray={strokeDash}
              strokeOpacity={isSwept ? 1.0 : strokeOpacity}
              filter={isSwept ? 'url(#tesseractCyanGlow)' : (isInterconnecting ? 'url(#tesseractIndigoGlow)' : 'url(#tesseractCyanGlow)')}
            />
          );
        })}

        {/* 16 Corner Vector Node Vertices */}
        {projected2D.map((p, vIdx) => {
          const raw = vertices4D[vIdx];
          const isInner = raw.w === -1;
          return (
            <g key={vIdx}>
              <circle
                cx={p.x2d}
                cy={p.y2d}
                r={isInner ? 2.5 : 2.0}
                fill={isInner ? primaryColor : accentColor}
                filter="url(#tesseractCyanGlow)"
              />
              <circle
                cx={p.x2d}
                cy={p.y2d}
                r="0.8"
                fill="#FFFFFF"
              />
            </g>
          );
        })}

        {/* Center Optical Reticle */}

        <circle
          cx={centerX}
          cy={centerY}
          r="1.5"
          fill={primaryColor}
          filter="url(#tesseractCyanGlow)"
        />
      </svg>
    </div>
  );
};

export default IsometricTesseractHypercube3D;
