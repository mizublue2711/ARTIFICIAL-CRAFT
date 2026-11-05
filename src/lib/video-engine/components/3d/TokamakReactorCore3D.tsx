import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface TokamakReactorCore3DProps extends BasePresetProps {
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

// Generate D-shaped magnetic coil profile in local (r, z) 2D plane
// D-shape has flat inner vertical limb at rInner and curved outer dome peaking at rOuter
function generateDCoilPoints(
  rInner: number,
  rOuter: number,
  zHeight: number,
  steps = 28
): { r: number; z: number }[] {
  const points: { r: number; z: number }[] = [];
  const halfZ = zHeight / 2;

  // 1. Flat inner vertical limb (from top to bottom)
  const innerSteps = 6;
  for (let i = 0; i <= innerSteps; i++) {
    const fraction = i / innerSteps;
    points.push({ r: rInner, z: halfZ - fraction * zHeight });
  }

  // 2. Curved outer D-arch (from -halfZ back to +halfZ)
  const outerSteps = steps - innerSteps;
  for (let i = 1; i < outerSteps; i++) {
    const phi = -Math.PI / 2 + (i / outerSteps) * Math.PI; // -pi/2 to +pi/2
    // D-shape elongation formula
    const z = Math.sin(phi) * halfZ;
    // Asymmetric bulge outward
    const rDist = (rOuter - rInner);
    const r = rInner + Math.cos(phi) * rDist;
    points.push({ r, z });
  }

  return points;
}

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

export const TokamakReactorCore3D: React.FC<TokamakReactorCore3DProps> = ({
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
  const clampedDispersion = Math.max(0.0, Math.min(0.2, dispersionAmount));

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;

  // Gentle CAD orbit rotation
  const rotX = baseRotX + Math.sin(frame * 0.012) * 0.06;
  const rotY = baseRotY + frame * 0.014;
  const rotZ = Math.cos(frame * 0.01) * 0.04;

  // Dispersion expands the 16 D-shaped magnetic coils radially outward
  const radialExplode = clampedDispersion * 500;

  // Dimensions of Tokamak Core
  const majorRadius = 140 * scale; // R0
  const minorRadius = 45 * scale;  // r0
  const rInnerCoil = (majorRadius - minorRadius - 16 * scale) + radialExplode * 0.3;
  const rOuterCoil = (majorRadius + minorRadius + 32 * scale) + radialExplode;
  const coilHeight = 160 * scale;

  // 1. 16 Vertical D-Shaped Magnetic Coil Ribs
  const numCoils = 16;
  const dProfile = useMemo(
    () => generateDCoilPoints(rInnerCoil, rOuterCoil, coilHeight, 32),
    [rInnerCoil, rOuterCoil, coilHeight]
  );

  // Dynamic coil pulse between Laser Cyan (#00E5FF) and Indigo (#5322FF)
  const coilPulse = 0.5 + 0.5 * Math.sin(frame * 0.08);
  const activeCoilColor = interpolateColor(primaryColor, accentColor, coilPulse);

  // 2. Central Solenoid Cylinder (inner vertical magnetic core along Z)
  const solenoidRadius = 32 * scale;
  const solenoidHeight = 190 * scale;

  // 3. Inner Plasma Ring (Continuous spin with particle turbulence)
  const plasmaPoints = useMemo(() => {
    const numPoints = 64;
    const points: { pos: Point3D; wave: number; phase: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const phi = (i / numPoints) * Math.PI * 2;
      // High-frequency turbulent wave harmonics
      const wave = Math.sin(frame * 0.05 + phi * 4) * 8 * scale;
      const verticalWave = Math.cos(frame * 0.07 + phi * 3) * 10 * scale;
      const r = majorRadius + wave;
      points.push({
        pos: {
          x: Math.cos(phi) * r,
          y: Math.sin(phi) * r,
          z: verticalWave,
        },
        wave,
        phase: phi,
      });
    }
    return points;
  }, [majorRadius, scale, frame]);

  // 4. Poloidal Field Coil Rings (upper and lower concentric rings)
  const poloidalRadii = [
    majorRadius * 0.75,
    majorRadius * 1.15,
    majorRadius * 1.45,
  ];

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
          <filter id="tokamakCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="tokamakIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="plasmaCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00E5FF" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. CENTRAL SOLENOID CYLINDER */}
        <g className="central-solenoid">
          {(() => {
            const steps = 24;
            const topRing: Point3D[] = [];
            const botRing: Point3D[] = [];
            const halfH = solenoidHeight / 2;

            for (let i = 0; i < steps; i++) {
              const th = (i / steps) * Math.PI * 2;
              topRing.push({ x: Math.cos(th) * solenoidRadius, y: Math.sin(th) * solenoidRadius, z: halfH });
              botRing.push({ x: Math.cos(th) * solenoidRadius, y: Math.sin(th) * solenoidRadius, z: -halfH });
            }

            const pTop = topRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pBot = botRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathTop = pTop.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBot = pBot.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathTop} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.65" />
                <path d={pathBot} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.65" />
                {/* Vertical flutes along solenoid column */}
                {[0, 6, 12, 18].map((idx) => (
                  <line
                    key={`sol-flute-${idx}`}
                    x1={pTop[idx].x2d}
                    y1={pTop[idx].y2d}
                    x2={pBot[idx].x2d}
                    y2={pBot[idx].y2d}
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    strokeDasharray="4 2"
                  />
                ))}
              </>
            );
          })()}
        </g>

        {/* 2. POLOIDAL FIELD COIL RINGS (CONCENTRIC HORIZONTAL RINGS) */}
        <g className="poloidal-field-rings">
          {poloidalRadii.map((pR, ringIdx) => {
            const steps = 36;
            const zTop = (coilHeight / 2) * 0.85;
            const zBot = -(coilHeight / 2) * 0.85;

            const ringTop: Point3D[] = [];
            const ringBot: Point3D[] = [];

            for (let i = 0; i < steps; i++) {
              const th = (i / steps) * Math.PI * 2;
              ringTop.push({ x: Math.cos(th) * pR, y: Math.sin(th) * pR, z: zTop });
              ringBot.push({ x: Math.cos(th) * pR, y: Math.sin(th) * pR, z: zBot });
            }

            const projTop = ringTop.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const projBot = ringBot.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathTop = projTop.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBot = projBot.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <g key={`poloidal-${ringIdx}`}>
                <path d={pathTop} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
                <path d={pathBot} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
              </g>
            );
          })}
        </g>

        {/* 3. 16 D-SHAPED TOROIDAL FIELD COIL RIBS */}
        <g className="toroidal-coils">
          {Array.from({ length: numCoils }).map((_, cIdx) => {
            const coilTheta = (cIdx / numCoils) * Math.PI * 2;
            const cosT = Math.cos(coilTheta);
            const sinT = Math.sin(coilTheta);

            // Rotate 2D D-profile (r, z) around the Z-axis by coilTheta
            const coil3DPoints: Point3D[] = dProfile.map((pt) => ({
              x: cosT * pt.r,
              y: sinT * pt.r,
              z: pt.z,
            }));

            const projectedCoil = coil3DPoints.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );

            const pathD = projectedCoil.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Alternating pulse between adjacent coils
            const isAlternate = cIdx % 2 === 1;
            const coilColor = isAlternate ? activeCoilColor : primaryColor;

            return (
              <g key={`dcoil-${cIdx}`} className="d-coil-rib">
                {/* 1px CAD Wireframe D-coil rib */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={coilColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  filter={isAlternate ? 'url(#tokamakIndigoGlow)' : 'url(#tokamakCyanGlow)'}
                />

                {/* Outer cryogenic conduit node on peak of D-arch */}
                {(() => {
                  const peakPt = projectedCoil[Math.floor(projectedCoil.length / 2)];
                  return (
                    <circle
                      cx={peakPt.x2d}
                      cy={peakPt.y2d}
                      r="1.8"
                      fill="#FFFFFF"
                      stroke={coilColor}
                      strokeWidth="0.8"
                    />
                  );
                })()}
              </g>
            );
          })}
        </g>

        {/* 4. INNER PLASMA TORUS RING (SPINNING CONTINUOUSLY WITH WAVE TURBULENCE) */}
        <g className="plasma-core">
          {(() => {
            const projectedPlasma = plasmaPoints.map((pt) =>
              projectPoint(pt.pos, rotX, rotY, rotZ, centerX, centerY, 1200)
            );

            const pathPlasma = projectedPlasma.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            return (
              <>
                {/* Outer luminous plasma halo */}
                <path
                  d={pathPlasma}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="4"
                  strokeOpacity="0.4"
                  filter="url(#plasmaCoreGlow)"
                />
                {/* Core radiant beam */}
                <path
                  d={pathPlasma}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeOpacity="0.95"
                  filter="url(#plasmaCoreGlow)"
                />

                {/* Turbulent Plasma Node Sparks */}
                {projectedPlasma.filter((_, idx) => idx % 4 === 0).map((pt, sIdx) => {
                  const sparkPulse = 1 + Math.sin(frame * 0.15 + sIdx) * 0.5;
                  return (
                    <circle
                      key={`spark-${sIdx}`}
                      cx={pt.x2d}
                      cy={pt.y2d}
                      r={2.5 * sparkPulse}
                      fill="#FFFFFF"
                      filter="url(#tokamakCyanGlow)"
                    />
                  );
                })}
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default TokamakReactorCore3D;
