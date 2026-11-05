import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface QuantumEscapementClock3DProps extends BasePresetProps {
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

// Generate circular gear teeth points in 3D local coordinates
function generateGearTeeth(
  teeth: number,
  innerR: number,
  outerR: number,
  center: Point3D = { x: 0, y: 0, z: 0 },
  rotation = 0
): Point3D[] {
  const points: Point3D[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const angle = i * step + rotation;
    const a1 = angle;
    const a2 = angle + step * 0.25;
    const a3 = angle + step * 0.5;
    const a4 = angle + step * 0.75;

    points.push({
      x: center.x + Math.cos(a1) * innerR,
      y: center.y + Math.sin(a1) * innerR,
      z: center.z,
    });
    points.push({
      x: center.x + Math.cos(a2) * outerR,
      y: center.y + Math.sin(a2) * outerR,
      z: center.z,
    });
    points.push({
      x: center.x + Math.cos(a3) * outerR,
      y: center.y + Math.sin(a3) * outerR,
      z: center.z,
    });
    points.push({
      x: center.x + Math.cos(a4) * innerR,
      y: center.y + Math.sin(a4) * innerR,
      z: center.z,
    });
  }
  return points;
}

// Generate 15-tooth club-tooth escape wheel points
function generateEscapeWheel(
  teeth = 15,
  innerR: number,
  outerR: number,
  center: Point3D = { x: 0, y: 0, z: 0 },
  rotation = 0
): Point3D[] {
  const points: Point3D[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const angle = i * step + rotation;
    // Club tooth profile: root, impulse face, locking tip, trailing edge
    const aRoot = angle;
    const aImpulse = angle + step * 0.28;
    const aTip = angle + step * 0.32;
    const aBack = angle + step * 0.15;

    points.push({
      x: center.x + Math.cos(aRoot) * innerR,
      y: center.y + Math.sin(aRoot) * innerR,
      z: center.z,
    });
    points.push({
      x: center.x + Math.cos(aBack) * (innerR * 1.08),
      y: center.y + Math.sin(aBack) * (innerR * 1.08),
      z: center.z,
    });
    points.push({
      x: center.x + Math.cos(aTip) * outerR,
      y: center.y + Math.sin(aTip) * outerR,
      z: center.z,
    });
    points.push({
      x: center.x + Math.cos(aImpulse) * (outerR * 0.94),
      y: center.y + Math.sin(aImpulse) * (outerR * 0.94),
      z: center.z,
    });
  }
  return points;
}

// Generate hairspring Archimedean spiral points
function generateHairspring(
  coils = 4.5,
  startR = 8,
  endR = 48,
  center: Point3D = { x: 0, y: 0, z: 0 },
  rotation = 0,
  steps = 80
): Point3D[] {
  const points: Point3D[] = [];
  const totalAngle = coils * Math.PI * 2;
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const angle = fraction * totalAngle + rotation;
    const r = startR + (endR - startR) * fraction;
    points.push({
      x: center.x + Math.cos(angle) * r,
      y: center.y + Math.sin(angle) * r,
      z: center.z,
    });
  }
  return points;
}

export const QuantumEscapementClock3D: React.FC<QuantumEscapementClock3DProps> = ({
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

  // Global subtle ambient turn
  const rotX = baseRotX + Math.sin(frame * 0.015) * 0.05;
  const rotY = baseRotY + Math.cos(frame * 0.01) * 0.1;
  const rotZ = 0;

  // Mechanical centers layout (Watch Caliber Bridge)
  // Balance wheel center at (-60, -50), Pallet fork pivot at (-20, 20), Escape wheel center at (50, 40), Ratchet/Drive gear center at (90, -70)
  const balanceCenter: Point3D = useMemo(() => ({ x: -65 * scale, y: -45 * scale, z: 0 }), [scale]);
  const palletPivot: Point3D = useMemo(() => ({ x: -15 * scale, y: 25 * scale, z: 0 }), [scale]);
  const escapeCenter: Point3D = useMemo(() => ({ x: 55 * scale, y: 35 * scale, z: 0 }), [scale]);
  const driveGearCenter: Point3D = useMemo(() => ({ x: 100 * scale, y: -65 * scale, z: 0 }), [scale]);
  const idlerPinionCenter: Point3D = useMemo(() => ({ x: -10 * scale, y: -90 * scale, z: 0 }), [scale]);

  // Motion physics calculations
  // 1. Balance wheel oscillation at ~4Hz frequency (28,800 vph horology standard)
  const balanceOscillation = Math.sin(frame * 0.25) * 0.75; // radians amplitude
  const hairspringPulse = balanceOscillation * 0.35;

  // 2. Pallet fork flips in counter rhythm
  const palletAngle = Math.sin(frame * 0.25) > 0 ? 0.16 : -0.16;

  // 3. Escape wheel stepping (15 teeth -> step = 2*PI/15)
  // Stepped forward motion: integer steps + quick snap
  const stepInterval = 12.56; // period matching half-oscillation of balance
  const rawStepIndex = Math.floor(frame / stepInterval);
  const stepFraction = (frame % stepInterval) / stepInterval;
  const snapEasing = Math.min(1, Math.pow(stepFraction, 3) * 8);
  const escapeWheelAngle = (rawStepIndex + snapEasing) * ((Math.PI * 2) / 15);

  // 4. Interlocking gear train ratios
  // Escape wheel (15 teeth) driven by Drive Gear (60 teeth) -> 4:1 ratio
  const driveGearAngle = -escapeWheelAngle / 4;
  const idlerAngle = driveGearAngle * 1.5;

  // Dispersion separates bridge plates vertically along Z-axis
  const topPlateZ = clampedDispersion * 800;
  const basePlateZ = -clampedDispersion * 800;
  const gearTrainZ = 0;

  // Geometries for gears
  const escapeTeeth = useMemo(
    () => generateEscapeWheel(15, 36 * scale, 52 * scale, escapeCenter, escapeWheelAngle),
    [scale, escapeWheelAngle, escapeCenter]
  );

  const driveGearTeeth = useMemo(
    () => generateGearTeeth(36, 58 * scale, 68 * scale, driveGearCenter, driveGearAngle),
    [scale, driveGearAngle, driveGearCenter]
  );

  const idlerGearTeeth = useMemo(
    () => generateGearTeeth(20, 28 * scale, 36 * scale, idlerPinionCenter, idlerAngle),
    [scale, idlerAngle, idlerPinionCenter]
  );

  const balanceRimRadius = 55 * scale;
  const hairspringSpiral = useMemo(
    () => generateHairspring(4.5, 6 * scale, 38 * scale, balanceCenter, hairspringPulse),
    [scale, hairspringPulse, balanceCenter]
  );

  // Bridge plate outline points (Swiss Glashütte / Geneva style architectural bridge)
  const topPlatePoints: Point3D[] = useMemo(() => [
    { x: -160 * scale, y: -140 * scale, z: topPlateZ },
    { x: 30 * scale, y: -150 * scale, z: topPlateZ },
    { x: 150 * scale, y: -110 * scale, z: topPlateZ },
    { x: 170 * scale, y: 10 * scale, z: topPlateZ },
    { x: 120 * scale, y: 120 * scale, z: topPlateZ },
    { x: -20 * scale, y: 140 * scale, z: topPlateZ },
    { x: -140 * scale, y: 90 * scale, z: topPlateZ },
    { x: -170 * scale, y: -40 * scale, z: topPlateZ },
  ], [scale, topPlateZ]);

  const basePlatePoints: Point3D[] = useMemo(() => [
    { x: -180 * scale, y: -160 * scale, z: basePlateZ },
    { x: 50 * scale, y: -170 * scale, z: basePlateZ },
    { x: 180 * scale, y: -130 * scale, z: basePlateZ },
    { x: 190 * scale, y: 30 * scale, z: basePlateZ },
    { x: 140 * scale, y: 150 * scale, z: basePlateZ },
    { x: -40 * scale, y: 170 * scale, z: basePlateZ },
    { x: -160 * scale, y: 120 * scale, z: basePlateZ },
    { x: -190 * scale, y: -30 * scale, z: basePlateZ },
  ], [scale, basePlateZ]);

  // Pallet fork arm points
  const palletArmLength = 32 * scale;
  const palletRubyEntry: Point3D = {
    x: palletPivot.x + Math.cos(palletAngle - 0.45) * palletArmLength,
    y: palletPivot.y + Math.sin(palletAngle - 0.45) * palletArmLength,
    z: gearTrainZ,
  };
  const palletRubyExit: Point3D = {
    x: palletPivot.x + Math.cos(palletAngle + 0.45) * palletArmLength,
    y: palletPivot.y + Math.sin(palletAngle + 0.45) * palletArmLength,
    z: gearTrainZ,
  };
  const palletForkHorn: Point3D = {
    x: palletPivot.x + Math.cos(palletAngle + Math.PI) * (palletArmLength * 0.8),
    y: palletPivot.y + Math.sin(palletAngle + Math.PI) * (palletArmLength * 0.8),
    z: gearTrainZ,
  };

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
          <filter id="clockCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="clockIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="rubyGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00E5FF" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* 1. BASE BRIDGE MAINPLATE (1px CAD wireframe boundary) */}
        <g className="base-mainplate">
          {(() => {
            const projectedBase = basePlatePoints.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathD = projectedBase.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            return (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity="0.45"
                  strokeDasharray="6 3"
                />
                {projectedBase.map((p, idx) => (
                  <circle key={`bp-${idx}`} cx={p.x2d} cy={p.y2d} r="1.5" fill={accentColor} opacity={0.6} />
                ))}
              </>
            );
          })()}
        </g>

        {/* 2. GEAR TRAIN LAYER (Z = 0) */}
        <g className="gear-train-layer">
          {/* A. Drive / Ratchet Wheel */}
          {(() => {
            const projectedDrive = driveGearTeeth.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathD = projectedDrive.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';
            const centerProj = projectPoint(driveGearCenter, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g className="drive-gear">
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                  filter="url(#clockIndigoGlow)"
                />
                {/* 5 spokes inside drive gear */}
                {[0, 1, 2, 3, 4].map((s) => {
                  const spokeAngle = driveGearAngle + (s * Math.PI * 2) / 5;
                  const spokeTip: Point3D = {
                    x: driveGearCenter.x + Math.cos(spokeAngle) * (56 * scale),
                    y: driveGearCenter.y + Math.sin(spokeAngle) * (56 * scale),
                    z: 0,
                  };
                  const spokeProj = projectPoint(spokeTip, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <line
                      key={`dsp-${s}`}
                      x1={centerProj.x2d}
                      y1={centerProj.y2d}
                      x2={spokeProj.x2d}
                      y2={spokeProj.y2d}
                      stroke={accentColor}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                  );
                })}
                <circle cx={centerProj.x2d} cy={centerProj.y2d} r="4" fill="none" stroke={accentColor} strokeWidth="1" />
              </g>
            );
          })()}

          {/* B. Idler Pinion Wheel */}
          {(() => {
            const projectedIdler = idlerGearTeeth.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathD = projectedIdler.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';
            const centerProj = projectPoint(idlerPinionCenter, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g className="idler-pinion">
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
                <circle cx={centerProj.x2d} cy={centerProj.y2d} r="3" fill="none" stroke={primaryColor} strokeWidth="1" />
              </g>
            );
          })()}

          {/* C. 15-Tooth Escape Wheel */}
          {(() => {
            const projectedEscape = escapeTeeth.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathD = projectedEscape.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';
            const centerProj = projectPoint(escapeCenter, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g className="escape-wheel">
                <path
                  d={pathD}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.9"
                  filter="url(#clockCyanGlow)"
                />
                {/* 5 curved escape spokes */}
                {[0, 1, 2, 3, 4].map((s) => {
                  const spokeAngle = escapeWheelAngle + (s * Math.PI * 2) / 5;
                  const spokeTip: Point3D = {
                    x: escapeCenter.x + Math.cos(spokeAngle) * (34 * scale),
                    y: escapeCenter.y + Math.sin(spokeAngle) * (34 * scale),
                    z: 0,
                  };
                  const spokeProj = projectPoint(spokeTip, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <line
                      key={`esp-${s}`}
                      x1={centerProj.x2d}
                      y1={centerProj.y2d}
                      x2={spokeProj.x2d}
                      y2={spokeProj.y2d}
                      stroke={primaryColor}
                      strokeWidth="1"
                      strokeOpacity="0.75"
                    />
                  );
                })}
                <circle cx={centerProj.x2d} cy={centerProj.y2d} r="4" fill="#00E5FF" fillOpacity="0.3" stroke={primaryColor} strokeWidth="1" />
              </g>
            );
          })()}

          {/* D. Pallet Fork with Glowing Ruby Jewels */}
          {(() => {
            const pPivot = projectPoint(palletPivot, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pEntry = projectPoint(palletRubyEntry, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pExit = projectPoint(palletRubyExit, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pHorn = projectPoint(palletForkHorn, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g className="pallet-fork">
                {/* Fork body lines */}
                <line x1={pPivot.x2d} y1={pPivot.y2d} x2={pEntry.x2d} y2={pEntry.y2d} stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.9" />
                <line x1={pPivot.x2d} y1={pPivot.y2d} x2={pExit.x2d} y2={pExit.y2d} stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.9" />
                <line x1={pPivot.x2d} y1={pPivot.y2d} x2={pHorn.x2d} y2={pHorn.y2d} stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.9" />

                {/* Pivot jewel bearing */}
                <circle cx={pPivot.x2d} cy={pPivot.y2d} r="3" fill="none" stroke={primaryColor} strokeWidth="1" />
                <circle cx={pPivot.x2d} cy={pPivot.y2d} r="1.5" fill="#FFFFFF" />

                {/* Entry Ruby Jewel Tip */}
                <circle cx={pEntry.x2d} cy={pEntry.y2d} r="3.5" fill={primaryColor} filter="url(#rubyGlow)" />
                <rect
                  x={pEntry.x2d - 2}
                  y={pEntry.y2d - 2}
                  width="4"
                  height="4"
                  fill="#FFFFFF"
                  transform={`rotate(45 ${pEntry.x2d} ${pEntry.y2d})`}
                />

                {/* Exit Ruby Jewel Tip */}
                <circle cx={pExit.x2d} cy={pExit.y2d} r="3.5" fill={primaryColor} filter="url(#rubyGlow)" />
                <rect
                  x={pExit.x2d - 2}
                  y={pExit.y2d - 2}
                  width="4"
                  height="4"
                  fill="#FFFFFF"
                  transform={`rotate(45 ${pExit.x2d} ${pExit.y2d})`}
                />
              </g>
            );
          })()}

          {/* E. Balance Wheel & Hairspring */}
          {(() => {
            const bCenterProj = projectPoint(balanceCenter, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Rim points (72 points)
            const rimPoints: Point3D[] = [];
            const rimSteps = 48;
            for (let i = 0; i < rimSteps; i++) {
              const th = (i / rimSteps) * Math.PI * 2;
              rimPoints.push({
                x: balanceCenter.x + Math.cos(th) * balanceRimRadius,
                y: balanceCenter.y + Math.sin(th) * balanceRimRadius,
                z: 0,
              });
            }
            const projRim = rimPoints.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const rimPathD = projRim.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Hairspring path
            const projHairspring = hairspringSpiral.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const hairspringPathD = projHairspring.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            );

            return (
              <g className="balance-wheel">
                {/* Hairspring */}
                <path
                  d={hairspringPathD}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                  filter="url(#clockCyanGlow)"
                />

                {/* Balance Rim */}
                <path
                  d={rimPathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.85"
                  filter="url(#clockIndigoGlow)"
                />

                {/* 3 Spoke Bridge oscillating with balance */}
                {[0, 1, 2].map((s) => {
                  const spokeTheta = balanceOscillation + (s * Math.PI * 2) / 3;
                  const spokePt: Point3D = {
                    x: balanceCenter.x + Math.cos(spokeTheta) * balanceRimRadius,
                    y: balanceCenter.y + Math.sin(spokeTheta) * balanceRimRadius,
                    z: 0,
                  };
                  const pProj = projectPoint(spokePt, rotX, rotY, rotZ, centerX, centerY, 1200);

                  return (
                    <line
                      key={`bsp-${s}`}
                      x1={bCenterProj.x2d}
                      y1={bCenterProj.y2d}
                      x2={pProj.x2d}
                      y2={pProj.y2d}
                      stroke={accentColor}
                      strokeWidth="1"
                      strokeOpacity="0.9"
                    />
                  );
                })}

                {/* Screws on rim circumference (Glashütte balance screws) */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((sc) => {
                  const scTheta = balanceOscillation + (sc * Math.PI * 2) / 8;
                  const screwPt: Point3D = {
                    x: balanceCenter.x + Math.cos(scTheta) * (balanceRimRadius + 3),
                    y: balanceCenter.y + Math.sin(scTheta) * (balanceRimRadius + 3),
                    z: 0,
                  };
                  const scProj = projectPoint(screwPt, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <circle
                      key={`sc-${sc}`}
                      cx={scProj.x2d}
                      cy={scProj.y2d}
                      r="1.5"
                      fill={primaryColor}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />
                  );
                })}

                {/* Central Balance Pivot Ruby Bearing */}
                <circle cx={bCenterProj.x2d} cy={bCenterProj.y2d} r="5" fill="none" stroke={primaryColor} strokeWidth="1" />
                <circle cx={bCenterProj.x2d} cy={bCenterProj.y2d} r="2.5" fill={primaryColor} filter="url(#rubyGlow)" />
              </g>
            );
          })()}
        </g>

        {/* 3. TOP BRIDGE PLATE (Exploded along Z-axis) */}
        <g className="top-bridge-plate">
          {(() => {
            const projectedTop = topPlatePoints.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathD = projectedTop.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Jewel bearing holes on top plate
            const topEscapeBearing = projectPoint(
              { x: escapeCenter.x, y: escapeCenter.y, z: topPlateZ },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );
            const topDriveBearing = projectPoint(
              { x: driveGearCenter.x, y: driveGearCenter.y, z: topPlateZ },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );
            const topBalanceBearing = projectPoint(
              { x: balanceCenter.x, y: balanceCenter.y, z: topPlateZ },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );

            // Connecting vertical CAD pillar lines when exploded
            const pillars = [
              { from: topPlatePoints[0], to: { ...topPlatePoints[0], z: basePlateZ } },
              { from: topPlatePoints[2], to: { ...topPlatePoints[2], z: basePlateZ } },
              { from: topPlatePoints[4], to: { ...topPlatePoints[4], z: basePlateZ } },
              { from: topPlatePoints[6], to: { ...topPlatePoints[6], z: basePlateZ } },
            ];

            return (
              <>
                {/* Pillar lines connecting plates across Z */}
                {pillars.map((pil, pIdx) => {
                  const pFrom = projectPoint(pil.from, rotX, rotY, rotZ, centerX, centerY, 1200);
                  const pTo = projectPoint(pil.to, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <line
                      key={`pil-${pIdx}`}
                      x1={pFrom.x2d}
                      y1={pFrom.y2d}
                      x2={pTo.x2d}
                      y2={pTo.y2d}
                      stroke={accentColor}
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      strokeDasharray="2 2"
                    />
                  );
                })}

                {/* Top plate perimeter */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  filter="url(#clockCyanGlow)"
                />

                {/* Top jewel bearings with chatons */}
                {[topEscapeBearing, topDriveBearing, topBalanceBearing].map((bProj, bIdx) => (
                  <g key={`tb-${bIdx}`}>
                    <circle cx={bProj.x2d} cy={bProj.y2d} r="5" fill="none" stroke={primaryColor} strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={bProj.x2d} cy={bProj.y2d} r="2" fill={primaryColor} filter="url(#rubyGlow)" />
                  </g>
                ))}

                {/* Top plate mounting screws */}
                {projectedTop.map((p, idx) => (
                  <circle
                    key={`tp-${idx}`}
                    cx={p.x2d}
                    cy={p.y2d}
                    r="1.8"
                    fill="#FFFFFF"
                    stroke={primaryColor}
                    strokeWidth="0.8"
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

export default QuantumEscapementClock3D;
