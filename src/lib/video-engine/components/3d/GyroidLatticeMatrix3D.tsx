import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface GyroidLatticeMatrix3DProps extends BasePresetProps {
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
  cameraZ: number,
  perspective = 1200
): { x2d: number; y2d: number; z: number; scale: number } {
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

  const effectiveZ = z2 + cameraZ;
  const projScale = perspective / Math.max(50, perspective + effectiveZ);

  return {
    x2d: centerX + x3 * projScale,
    y2d: centerY + y3 * projScale,
    z: effectiveZ,
    scale: projScale,
  };
}

export const GyroidLatticeMatrix3D: React.FC<GyroidLatticeMatrix3DProps> = ({
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

  // Harmonic tilt as specified: rotateX = 28 + Math.sin(frame * 0.02) * 6
  const harmonicTiltDeg = rotateXDeg + Math.sin(frame * 0.02) * 6;
  const rotX = (harmonicTiltDeg * Math.PI) / 180;
  const rotY = ((rotateYDeg + frame * 0.4) * Math.PI) / 180;
  const rotZ = Math.sin(frame * 0.015) * 0.1;

  // Continuous Z-axis camera push-in loop
  // Moves through repetitive unit cells seamlessly
  const cellPeriodZ = 160 * scale;
  const cameraZ = 300 - ((frame * 1.5) % cellPeriodZ);

  // Generate 1px line-art Gyroid implicit surface / lattice creating interlocking 3D tunnels
  // Gyroid implicit formula: sin(x)*cos(y) + sin(y)*cos(z) + sin(z)*cos(x) = 0
  // Approximated into discrete 3D skeletal tunnel contour curves across unit cells
  const gridSize = 3; // 3x3x3 unit cells
  const stepsPerCurve = 32;

  const gyroidCurves: Point3D[][] = useMemo(() => {
    const curves: Point3D[][] = [];
    const step = 80 * scale;
    const offset = ((gridSize - 1) * step) / 2;

    // Generate interlocking helical orthogonal tunnels along X, Y, and Z directions
    // Tunnel lines along Z axis with gyroid helical modulation
    for (let ix = 0; ix < gridSize; ix++) {
      for (let iy = 0; iy < gridSize; iy++) {
        const baseX = ix * step - offset;
        const baseY = iy * step - offset;
        const phase = (ix + iy) * Math.PI * 0.5;

        // Curve 1: Primary helical contour
        const ptsZ: Point3D[] = [];
        for (let s = 0; s <= stepsPerCurve; s++) {
          const t = (s / stepsPerCurve) * (gridSize * step) - offset;
          const k = (2 * Math.PI) / (gridSize * step);
          const x = baseX + Math.sin(k * t + phase) * 24 * (1 + dispersionAmount * 2) * scale;
          const y = baseY + Math.cos(k * t + phase) * 24 * (1 + dispersionAmount * 2) * scale;
          ptsZ.push({ x, y, z: t });
        }
        curves.push(ptsZ);

        // Curve 2: Orthogonal cross-tunnel along X
        const ptsX: Point3D[] = [];
        for (let s = 0; s <= stepsPerCurve; s++) {
          const t = (s / stepsPerCurve) * (gridSize * step) - offset;
          const k = (2 * Math.PI) / (gridSize * step);
          const y = baseY + Math.sin(k * t + phase) * 20 * scale;
          const z = t;
          ptsX.push({ x: t, y, z });
        }
        curves.push(ptsX);
      }
    }

    return curves;
  }, [gridSize, stepsPerCurve, scale, dispersionAmount]);

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
          <filter id="gyroidCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.7" />
          </filter>
          <filter id="gyroidIndigoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 1px Gyroid Line-Art Curves */}
        {gyroidCurves.map((curve, cIdx) => {
          const isPrimary = cIdx % 2 === 0;
          const projectedPts = curve.map((p) =>
            projectPoint(p, rotX, rotY, rotZ, centerX, centerY, cameraZ, 1200)
          );

          // Build SVG path data
          const pathD = projectedPts.reduce((acc, p, idx) => {
            return idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`;
          }, '');

          const avgScale = projectedPts.reduce((acc, p) => acc + p.scale, 0) / projectedPts.length;
          const strokeOpacity = Math.max(0.15, Math.min(0.85, avgScale * 0.7));

          return (
            <path
              key={cIdx}
              d={pathD}
              fill="none"
              stroke={isPrimary ? primaryColor : accentColor}
              strokeWidth="1"
              strokeDasharray={isPrimary ? 'none' : '4 3'}
              strokeOpacity={strokeOpacity}
              filter={isPrimary ? 'url(#gyroidCyanGlow)' : 'url(#gyroidIndigoGlow)'}
            />
          );
        })}

        {/* Center Optical Focal Reticle */}

        <circle
          cx={centerX}
          cy={centerY}
          r="2"
          fill={primaryColor}
          filter="url(#gyroidCyanGlow)"
        />
      </svg>
    </div>
  );
};

export default GyroidLatticeMatrix3D;
