import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface VDM80ActuatorJoint3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// 3D Perspective Projection Engine (Deterministic Swiss CAD Isometric/Perspective)
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

// Generate circular ring in 3D (XY plane at given Z)
function generateRingPoints(radius: number, z: number, steps = 36, startAngle = 0): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (i / steps) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z,
    });
  }
  return points;
}

// Generate cycloidal disc profile with epicycloid/hypocycloid lobes
function generateCycloidalLobePoints(
  numLobes: number,
  baseRadius: number,
  eccentricity: number,
  eccentricAngle: number,
  discRotation: number,
  z: number,
  steps = 48
): Point3D[] {
  const points: Point3D[] = [];
  // Center of disc is shifted by eccentricity vector
  const cx = Math.cos(eccentricAngle) * eccentricity;
  const cy = Math.sin(eccentricAngle) * eccentricity;

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    // Cycloidal lobe amplitude modulation
    const lobeMod = Math.cos(theta * numLobes + discRotation) * (baseRadius * 0.12);
    const r = baseRadius + lobeMod;
    points.push({
      x: cx + Math.cos(theta + discRotation) * r,
      y: cy + Math.sin(theta + discRotation) * r,
      z,
    });
  }
  return points;
}

export const VDM80ActuatorJoint3D: React.FC<VDM80ActuatorJoint3DProps> = ({
  frame: propFrame,
  primaryColor = '#00E5FF', // Laser Cyan
  accentColor = '#5322FF',  // Indigo
  scale = 1.0,
  rotateXDeg = 28,          // CAD pitch locked at 28 deg
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

  // Gentle CAD camera orbit for continuous 3D depth perception
  const rotX = baseRotX + Math.sin(frame * 0.008) * 0.02;
  const rotY = baseRotY + frame * 0.01;
  const rotZ = Math.cos(frame * 0.006) * 0.012;

  // ---------------------------------------------------------------------------
  // Deterministic Engineering Rotations & Math
  // - Gear Ratio: 23.04:1
  // - Inner Rotor: spins rapidly at high RPM (frame * 0.16)
  // - Output Flange: rotates at reduced speed (frame * (0.12 / 23.04))
  // ---------------------------------------------------------------------------
  const rotorSpin = frame * 0.16;
  const reductionRatio = 23.04;
  const outputRotation = frame * (0.12 / reductionRatio);
  const cycloidalEccentricSpin = frame * 0.12;

  // ---------------------------------------------------------------------------
  // Dynamic Exploded View Math along Z-axis (dispersionAmount clamped 0.0 to 0.12)
  // - Layer 1 (Outer Casing & Top Flange) slides forward: +Z * 220 * dispersionAmount
  // - Layer 3 (Cycloidal Reduction Gear Discs) separates forward: +Z * 120 * dispersionAmount
  // - Layer 4 (Hollow Shaft Core) remains centered at origin: Z = 0
  // - Layer 2 (BLDC Stator & Rotor) slides backward: -Z * 150 * dispersionAmount
  // - Layer 5 (Driver PCB & Protocol Ports) slides rearward: -Z * 250 * dispersionAmount
  // ---------------------------------------------------------------------------
  const zExplodeLayer1 = 220 * clampedDispersion * scale;
  const zExplodeLayer3 = 120 * clampedDispersion * scale;
  const zExplodeLayer4 = 0;
  const zExplodeLayer2 = -150 * clampedDispersion * scale;
  const zExplodeLayer5 = -250 * clampedDispersion * scale;

  // ---------------------------------------------------------------------------
  // CAD Geometric Dimensions (Scale ratio 1:1 in CAD 3D space)
  // Outer Diameter: Φ81mm -> radius 81/2 = 40.5 * scale factor (~3.5 => ~142px)
  // Length: 79.5mm -> total length ~140px (-70 to +70)
  // Hollow Shaft Bore: ⌀7.0mm -> radius ~12.2px
  // ---------------------------------------------------------------------------
  const outerRadius = 142 * scale; // Φ81 mm scaled
  const halfLength = 70 * scale;   // 79.5 mm / 2 scaled
  const hollowRadius = 12.5 * scale; // ⌀7.0 mm bore scaled

  // ===========================================================================
  // LAYER 1: OUTER ANODIZED ALUMINUM HOUSING SHELL (Φ81mm × 79.5mm)
  // ===========================================================================
  const zCasingTop = halfLength + zExplodeLayer1;
  const zCasingBottom = -halfLength + zExplodeLayer1;
  const numFlangeBolts = 8;
  const boltRadius = outerRadius * 0.88;

  const casingTopRings = useMemo(() => ({
    outer: generateRingPoints(outerRadius, zCasingTop, 48),
    innerLip: generateRingPoints(outerRadius * 0.78, zCasingTop, 36),
    flangeHoles: generateRingPoints(boltRadius, zCasingTop, numFlangeBolts),
  }), [outerRadius, zCasingTop, boltRadius, numFlangeBolts]);

  const casingBottomRings = useMemo(() => ({
    outer: generateRingPoints(outerRadius, zCasingBottom, 48),
    innerLip: generateRingPoints(outerRadius * 0.78, zCasingBottom, 36),
    flangeHoles: generateRingPoints(boltRadius, zCasingBottom, numFlangeBolts),
  }), [outerRadius, zCasingBottom, boltRadius, numFlangeBolts]);

  const casingMidRibs = useMemo(() => [
    generateRingPoints(outerRadius, zCasingBottom + (zCasingTop - zCasingBottom) * 0.25, 36),
    generateRingPoints(outerRadius, zCasingBottom + (zCasingTop - zCasingBottom) * 0.5, 36),
    generateRingPoints(outerRadius, zCasingBottom + (zCasingTop - zCasingBottom) * 0.75, 36),
  ], [outerRadius, zCasingBottom, zCasingTop]);

  // 8 Perimeter longitudinal cylinder shell wireframe lines
  const casingLongitudinalAngles = useMemo(() => {
    const angles: number[] = [];
    for (let i = 0; i < 8; i++) {
      angles.push((i * Math.PI * 2) / 8);
    }
    return angles;
  }, []);

  // Outer casing laser engraving nodes
  const laserLabelPos: Point3D = {
    x: outerRadius * 0.98,
    y: 0,
    z: zCasingBottom + (zCasingTop - zCasingBottom) * 0.5,
  };

  // ===========================================================================
  // LAYER 2: HIGH-TORQUE BLDC INNER-RUNNER MOTOR STATOR & ROTOR
  // 12 copper winding stator slots, permanent magnet rotor sleeve spinning at rotorSpin
  // ===========================================================================
  const statorRadius = outerRadius * 0.72;
  const rotorRadius = statorRadius * 0.58;
  const zStatorMid = 0 + zExplodeLayer2;
  const statorHalfH = 32 * scale;

  // 12 Stator Poles & Copper Windings
  const statorPoles = useMemo(() => {
    const numPoles = 12;
    const poles = [];
    for (let i = 0; i < numPoles; i++) {
      const angle = (i * Math.PI * 2) / numPoles;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const innerPt: Point3D = {
        x: cosA * (rotorRadius + 5 * scale),
        y: sinA * (rotorRadius + 5 * scale),
        z: zStatorMid,
      };
      const outerPt: Point3D = {
        x: cosA * statorRadius,
        y: sinA * statorRadius,
        z: zStatorMid,
      };
      // Copper coil bounding box points
      const coilW = 8 * scale;
      const normalX = -sinA * coilW;
      const normalY = cosA * coilW;
      const coilBox: Point3D[] = [
        { x: innerPt.x + normalX, y: innerPt.y + normalY, z: zStatorMid + statorHalfH * 0.6 },
        { x: outerPt.x + normalX, y: outerPt.y + normalY, z: zStatorMid + statorHalfH * 0.6 },
        { x: outerPt.x - normalX, y: outerPt.y - normalY, z: zStatorMid - statorHalfH * 0.6 },
        { x: innerPt.x - normalX, y: innerPt.y - normalY, z: zStatorMid - statorHalfH * 0.6 },
      ];
      poles.push({ innerPt, outerPt, coilBox });
    }
    return poles;
  }, [statorRadius, rotorRadius, scale, zStatorMid, statorHalfH]);

  // Spinning Inner Rotor Permanent Magnet Sleeve
  const rotorRings = useMemo(() => ({
    top: generateRingPoints(rotorRadius, zStatorMid + statorHalfH, 24, rotorSpin),
    bottom: generateRingPoints(rotorRadius, zStatorMid - statorHalfH, 24, rotorSpin),
    innerCore: generateRingPoints(rotorRadius * 0.7, zStatorMid, 24, rotorSpin),
  }), [rotorRadius, zStatorMid, statorHalfH, rotorSpin]);

  // 4 Permanent Magnet Polarity Bars on Rotor
  const rotorPoles = useMemo(() => {
    const poles: Point3D[][] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + rotorSpin;
      const x = Math.cos(angle) * (rotorRadius * 0.95);
      const y = Math.sin(angle) * (rotorRadius * 0.95);
      poles.push([
        { x, y, z: zStatorMid + statorHalfH * 0.8 },
        { x, y, z: zStatorMid - statorHalfH * 0.8 },
      ]);
    }
    return poles;
  }, [rotorRadius, rotorSpin, zStatorMid, statorHalfH]);

  // ===========================================================================
  // LAYER 3: CYCLOIDAL / HARMONIC PRECISION REDUCTION GEARBOX ASSEMBLY
  // Dual cycloidal wobble discs meshing with 24 outer pins, ratio 23.04:1
  // Output rotates at outputRotation
  // ===========================================================================
  const cycloidRadius = outerRadius * 0.68;
  const cycloidEccentricity = 6 * scale;
  const zCycloidMid = 25 * scale + zExplodeLayer3;
  const cycloidGap = 9 * scale;

  // Dual cycloidal discs 180 degrees out of phase for dynamic balancing
  const disc1Lobes = useMemo(
    () => generateCycloidalLobePoints(23, cycloidRadius, cycloidEccentricity, cycloidalEccentricSpin, outputRotation, zCycloidMid + cycloidGap * 0.5, 48),
    [cycloidRadius, cycloidEccentricity, cycloidalEccentricSpin, outputRotation, zCycloidMid, cycloidGap]
  );
  const disc2Lobes = useMemo(
    () => generateCycloidalLobePoints(23, cycloidRadius, cycloidEccentricity, cycloidalEccentricSpin + Math.PI, outputRotation, zCycloidMid - cycloidGap * 0.5, 48),
    [cycloidRadius, cycloidEccentricity, cycloidalEccentricSpin, outputRotation, zCycloidMid, cycloidGap]
  );

  // Outer Pin Ring (24 precision pins)
  const pinHousingPins = useMemo(() => {
    const pins: Point3D[] = [];
    const count = 24;
    const pinRingRadius = cycloidRadius + cycloidEccentricity + 8 * scale;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      pins.push({
        x: Math.cos(angle) * pinRingRadius,
        y: Math.sin(angle) * pinRingRadius,
        z: zCycloidMid,
      });
    }
    return pins;
  }, [cycloidRadius, cycloidEccentricity, scale, zCycloidMid]);

  // Cycloidal Output Drive Rollers (6 torque transfer output pins)
  const outputRollerPins = useMemo(() => {
    const rollers: Point3D[] = [];
    const count = 6;
    const rollerRadius = cycloidRadius * 0.48;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + outputRotation;
      rollers.push({
        x: Math.cos(angle) * rollerRadius,
        y: Math.sin(angle) * rollerRadius,
        z: zCycloidMid,
      });
    }
    return rollers;
  }, [cycloidRadius, outputRotation, zCycloidMid]);

  // Output Flange Hub Ring at top of cycloid
  const outputFlangeRings = useMemo(() => ({
    top: generateRingPoints(outerRadius * 0.55, zCycloidMid + 20 * scale, 36, outputRotation),
    mountingHoles: generateRingPoints(outerRadius * 0.42, zCycloidMid + 20 * scale, 6, outputRotation),
  }), [outerRadius, zCycloidMid, scale, outputRotation]);

  // ===========================================================================
  // LAYER 4: CENTRAL PASS-THROUGH HOLLOW SHAFT (⌀7mm BORE)
  // ⌀7.0mm hollow core steel tube centered at origin + 3 glowing laser cyan lines
  // ===========================================================================
  const zHollowTop = halfLength * 1.35 + zExplodeLayer4;
  const zHollowBottom = -halfLength * 1.35 + zExplodeLayer4;

  const hollowShaftRings = useMemo(() => ({
    top: generateRingPoints(hollowRadius, zHollowTop, 24),
    midTop: generateRingPoints(hollowRadius, halfLength * 0.5, 24),
    midBottom: generateRingPoints(hollowRadius, -halfLength * 0.5, 24),
    bottom: generateRingPoints(hollowRadius, zHollowBottom, 24),
    outerWallTop: generateRingPoints(hollowRadius * 1.35, zHollowTop, 24),
    outerWallBottom: generateRingPoints(hollowRadius * 1.35, zHollowBottom, 24),
  }), [hollowRadius, zHollowTop, halfLength, zHollowBottom]);

  // 3 Glowing Laser Cyan Vector Routing Lines shooting through hollow bore
  const cableRoutingRays = useMemo(() => {
    return [0, 1, 2].map((idx) => {
      const angle = (idx * Math.PI * 2) / 3 + frame * 0.02;
      const r = hollowRadius * 0.45;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      return {
        start: { x, y, z: zHollowTop + 25 * scale },
        end: { x, y, z: zHollowBottom - 25 * scale },
      };
    });
  }, [hollowRadius, frame, zHollowTop, scale, zHollowBottom]);

  // ===========================================================================
  // LAYER 5: INTEGRATED MICRO-DRIVER PCB & CALLOUT TELEMETRY NODES
  // Circular PCB ring at rear end with 3 micro IC chips (CAN FD, RS485, EtherCAT)
  // + 3 dynamic 3D telemetry callout badges
  // ===========================================================================
  const zPcbMid = -halfLength - 20 * scale + zExplodeLayer5;
  const pcbRadius = outerRadius * 0.76;

  const pcbRings = useMemo(() => ({
    outer: generateRingPoints(pcbRadius, zPcbMid, 36),
    inner: generateRingPoints(hollowRadius * 1.45, zPcbMid, 24),
    circuitTrace: generateRingPoints(pcbRadius * 0.82, zPcbMid, 36),
  }), [pcbRadius, zPcbMid, hollowRadius]);

  // 3 Micro IC Chips (CAN FD, RS485, EtherCAT transceivers) on PCB surface
  const microIcChips = useMemo(() => {
    const chips = [
      { name: 'CAN FD', angle: Math.PI * 0.15 },
      { name: 'RS485', angle: Math.PI * 0.85 },
      { name: 'EtherCAT', angle: Math.PI * 1.55 },
    ];
    const icRadius = pcbRadius * 0.62;
    const icW = 14 * scale;
    const icH = 10 * scale;

    return chips.map((c) => {
      const cx = Math.cos(c.angle) * icRadius;
      const cy = Math.sin(c.angle) * icRadius;
      const corners: Point3D[] = [
        { x: cx - icW / 2, y: cy - icH / 2, z: zPcbMid + 2 },
        { x: cx + icW / 2, y: cy - icH / 2, z: zPcbMid + 2 },
        { x: cx + icW / 2, y: cy + icH / 2, z: zPcbMid + 2 },
        { x: cx - icW / 2, y: cy + icH / 2, z: zPcbMid + 2 },
      ];
      return { ...c, center: { x: cx, y: cy, z: zPcbMid + 2 }, corners };
    });
  }, [pcbRadius, scale, zPcbMid]);

  // 3 3D Telemetry Callout Badge Target Anchors
  // Node A: Output Flange (Layer 3/1)
  const anchorNodeA: Point3D = {
    x: outerRadius * 0.55 * Math.cos(outputRotation + 0.5),
    y: outerRadius * 0.55 * Math.sin(outputRotation + 0.5),
    z: zCycloidMid + 20 * scale,
  };
  // Node B: PCB Driver Controller (Layer 5)
  const anchorNodeB: Point3D = {
    x: pcbRadius * 0.65,
    y: -pcbRadius * 0.65,
    z: zPcbMid,
  };
  // Node C: Hollow Bore Center (Layer 4)
  const anchorNodeC: Point3D = {
    x: 0,
    y: 0,
    z: 0,
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
          <filter id="vdmCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="vdmIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.8" />
          </filter>
          <filter id="vdmLaserBoreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5.5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* EXPLODED AXIS ALIGNMENT LASER GUIDES (DISPERSION FEEDBACK) */}
        {/* ================================================================= */}
        {clampedDispersion > 0.01 && (
          <g className="exploded-axis-lasers">
            {/* Actuator Centerline through all 5 layers */}
            {(() => {
              const pTop = projectPoint({ x: 0, y: 0, z: zCasingTop + 45 * scale }, rotX, rotY, rotZ, centerX, centerY);
              const pBottom = projectPoint({ x: 0, y: 0, z: zPcbMid - 45 * scale }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pTop.x2d}
                  y1={pTop.y2d}
                  x2={pBottom.x2d}
                  y2={pBottom.y2d}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  strokeDasharray="4 3"
                  strokeOpacity="0.55"
                />
              );
            })()}

            {/* Dispersion Layer Separation Brackets */}
            {(() => {
              const pL1 = projectPoint({ x: outerRadius, y: 0, z: zCasingTop }, rotX, rotY, rotZ, centerX, centerY);
              const pL3 = projectPoint({ x: cycloidRadius, y: 0, z: zCycloidMid }, rotX, rotY, rotZ, centerX, centerY);
              const pL2 = projectPoint({ x: statorRadius, y: 0, z: zStatorMid }, rotX, rotY, rotZ, centerX, centerY);
              const pL5 = projectPoint({ x: pcbRadius, y: 0, z: zPcbMid }, rotX, rotY, rotZ, centerX, centerY);

              return (
                <g stroke={accentColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.5">
                  <line x1={pL1.x2d} y1={pL1.y2d} x2={pL3.x2d} y2={pL3.y2d} />
                  <line x1={pL3.x2d} y1={pL3.y2d} x2={pL2.x2d} y2={pL2.y2d} />
                  <line x1={pL2.x2d} y1={pL2.y2d} x2={pL5.x2d} y2={pL5.y2d} />
                </g>
              );
            })()}
          </g>
        )}

        {/* ================================================================= */}
        {/* LAYER 5: INTEGRATED MICRO-DRIVER PCB RING & PROTOCOL TRANSCEIVERS */}
        {/* ================================================================= */}
        <g className="micro-driver-pcb-assembly">
          {(() => {
            const pOuter = pcbRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pInner = pcbRings.inner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pTrace = pcbRings.circuitTrace.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathOuter = pOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathInner = pInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathTrace = pTrace.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathOuter}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.3"
                  strokeOpacity="0.85"
                  filter="url(#vdmIndigoGlow)"
                />
                <path d={pathInner} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
                <path d={pathTrace} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 3" />
              </>
            );
          })()}

          {/* 3 Micro IC Chips (CAN FD, RS485, EtherCAT transceivers) */}
          {microIcChips.map((chip, idx) => {
            const pCorners = chip.corners.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathChip = pCorners.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pCenter = projectPoint(chip.center, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g key={`ic-chip-${idx}`}>
                <path
                  d={pathChip}
                  fill="#05050C"
                  fillOpacity="0.85"
                  stroke={primaryColor}
                  strokeWidth="1.1"
                  strokeOpacity="0.9"
                  filter="url(#vdmCyanGlow)"
                />
                <circle cx={pCenter.x2d} cy={pCenter.y2d} r="1.5" fill="#FFFFFF" />
                <text
                  x={pCenter.x2d}
                  y={pCenter.y2d - 4}
                  fill={primaryColor}
                  fontSize="6.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                  opacity="0.9"
                >
                  {chip.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* ================================================================= */}
        {/* LAYER 2: HIGH-TORQUE BLDC INNER-RUNNER MOTOR STATOR & ROTOR */}
        {/* ================================================================= */}
        <g className="bldc-motor-assembly">
          {/* 12 Stator Copper Windings */}
          {statorPoles.map((pole, idx) => {
            const pIn = projectPoint(pole.innerPt, rotX, rotY, rotZ, centerX, centerY);
            const pOut = projectPoint(pole.outerPt, rotX, rotY, rotZ, centerX, centerY);
            const pCoil = pole.coilBox.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathCoil = pCoil.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <g key={`stator-pole-${idx}`}>
                {/* Copper winding slot outline */}
                <path
                  d={pathCoil}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
                {/* Stator tooth radial spoke */}
                <line
                  x1={pIn.x2d}
                  y1={pIn.y2d}
                  x2={pOut.x2d}
                  y2={pOut.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
              </g>
            );
          })}

          {/* Spinning Inner Rotor Permanent Magnet Sleeve */}
          {(() => {
            const pTop = rotorRings.top.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pBottom = rotorRings.bottom.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pCore = rotorRings.innerCore.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathTop = pTop.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBottom = pBottom.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathCore = pCore.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathTop}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.9"
                  filter="url(#vdmCyanGlow)"
                />
                <path d={pathBottom} fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
                <path d={pathCore} fill="none" stroke={accentColor} strokeWidth="0.9" strokeOpacity="0.5" />

                {/* Permanent Magnet Polarity Bars */}
                {rotorPoles.map((bar, bIdx) => {
                  const pStart = projectPoint(bar[0], rotX, rotY, rotZ, centerX, centerY);
                  const pEnd = projectPoint(bar[1], rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <line
                      key={`r-bar-${bIdx}`}
                      x1={pStart.x2d}
                      y1={pStart.y2d}
                      x2={pEnd.x2d}
                      y2={pEnd.y2d}
                      stroke={primaryColor}
                      strokeWidth="1.2"
                      strokeOpacity="0.9"
                    />
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 4: CENTRAL PASS-THROUGH HOLLOW SHAFT (⌀7mm BORE) */}
        {/* ================================================================= */}
        <g className="central-hollow-shaft-assembly">
          {(() => {
            const pTop = hollowShaftRings.top.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pMidTop = hollowShaftRings.midTop.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pMidBottom = hollowShaftRings.midBottom.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pBottom = hollowShaftRings.bottom.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathTop = pTop.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathMidTop = pMidTop.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathMidBottom = pMidBottom.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBottom = pBottom.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathTop}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.95"
                  filter="url(#vdmLaserBoreGlow)"
                />
                <path d={pathMidTop} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2" />
                <path d={pathMidBottom} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2" />
                <path d={pathBottom} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.8" />

                {/* Longitudinal tube guide lines */}
                {[0, 6, 12, 18].map((idx) => (
                  <line
                    key={`tube-long-${idx}`}
                    x1={pTop[idx].x2d}
                    y1={pTop[idx].y2d}
                    x2={pBottom[idx].x2d}
                    y2={pBottom[idx].y2d}
                    stroke={primaryColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                ))}
              </>
            );
          })()}

          {/* 3 Glowing Laser Cyan Vector Routing Lines shooting through hollow bore */}
          {cableRoutingRays.map((ray, idx) => {
            const pStart = projectPoint(ray.start, rotX, rotY, rotZ, centerX, centerY);
            const pEnd = projectPoint(ray.end, rotX, rotY, rotZ, centerX, centerY);
            return (
              <g key={`cable-ray-${idx}`}>
                <line
                  x1={pStart.x2d}
                  y1={pStart.y2d}
                  x2={pEnd.x2d}
                  y2={pEnd.y2d}
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.95"
                  filter="url(#vdmLaserBoreGlow)"
                />
                <circle cx={pStart.x2d} cy={pStart.y2d} r="1.5" fill="#FFFFFF" />
                <circle cx={pEnd.x2d} cy={pEnd.y2d} r="1.5" fill="#FFFFFF" />
              </g>
            );
          })}
        </g>

        {/* ================================================================= */}
        {/* LAYER 3: CYCLOIDAL / HARMONIC PRECISION REDUCTION GEARBOX */}
        {/* ================================================================= */}
        <g className="cycloidal-reduction-assembly">
          {/* Dual Cycloidal Wobble Discs with 1px wireframe lobes */}
          {(() => {
            const pDisc1 = disc1Lobes.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pDisc2 = disc2Lobes.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathD1 = pDisc1.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathD2 = pDisc2.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathD1}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.9"
                  filter="url(#vdmCyanGlow)"
                />
                <path
                  d={pathD2}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.1"
                  strokeOpacity="0.75"
                  filter="url(#vdmIndigoGlow)"
                />
              </>
            );
          })()}

          {/* 24 Outer Pin Housing Pins */}
          {pinHousingPins.map((pin, idx) => {
            const pp = projectPoint(pin, rotX, rotY, rotZ, centerX, centerY);
            return (
              <circle
                key={`pin-${idx}`}
                cx={pp.x2d}
                cy={pp.y2d}
                r="1.6"
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.8"
              />
            );
          })}

          {/* 6 Cycloidal Torque Transfer Output Roller Pins */}
          {outputRollerPins.map((pin, idx) => {
            const pp = projectPoint(pin, rotX, rotY, rotZ, centerX, centerY);
            return (
              <g key={`roller-${idx}`}>
                <circle cx={pp.x2d} cy={pp.y2d} r="3" fill="none" stroke={primaryColor} strokeWidth="1.1" />
                <circle cx={pp.x2d} cy={pp.y2d} r="1" fill="#FFFFFF" />
              </g>
            );
          })}

          {/* Output Flange Assembly (rotates at smooth reduced speed: 235 RPM max equiv) */}
          {(() => {
            const pFlangeTop = outputFlangeRings.top.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathFlange = pFlangeTop.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathFlange}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.3"
                  strokeOpacity="0.9"
                  filter="url(#vdmCyanGlow)"
                />
                {outputFlangeRings.mountingHoles.map((b, idx) => {
                  const pb = projectPoint(b, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <circle
                      key={`out-bolt-${idx}`}
                      cx={pb.x2d}
                      cy={pb.y2d}
                      r="2"
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth="1"
                    />
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 1: OUTER ANODIZED ALUMINUM HOUSING SHELL (Φ81mm × 79.5mm) */}
        {/* ================================================================= */}
        <g className="outer-casing-assembly">
          {/* Top & Bottom Flange Rings */}
          {(() => {
            const pTopOuter = casingTopRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pTopInner = casingTopRings.innerLip.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pBottomOuter = casingBottomRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pBottomInner = casingBottomRings.innerLip.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathTopOuter = pTopOuter.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathTopInner = pTopInner.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBottomOuter = pBottomOuter.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBottomInner = pBottomInner.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathTopOuter}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                  filter="url(#vdmIndigoGlow)"
                />
                <path d={pathTopInner} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
                <path d={pathBottomOuter} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />
                <path d={pathBottomInner} fill="none" stroke={accentColor} strokeWidth="0.9" strokeOpacity="0.5" strokeDasharray="3 2" />

                {/* 8 Flange Mounting Bolt Holes on Top Ring */}
                {casingTopRings.flangeHoles.map((b, idx) => {
                  const pb = projectPoint(b, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <g key={`t-bolt-${idx}`}>
                      <circle cx={pb.x2d} cy={pb.y2d} r="2.2" fill="none" stroke={primaryColor} strokeWidth="1" />
                      <circle cx={pb.x2d} cy={pb.y2d} r="0.8" fill="#FFFFFF" />
                    </g>
                  );
                })}

                {/* 8 Flange Mounting Bolt Holes on Bottom Ring */}
                {casingBottomRings.flangeHoles.map((b, idx) => {
                  const pb = projectPoint(b, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <circle
                      key={`b-bolt-${idx}`}
                      cx={pb.x2d}
                      cy={pb.y2d}
                      r="2"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="1"
                    />
                  );
                })}
              </>
            );
          })()}

          {/* Intermediate Casing Shell Ribs */}
          {casingMidRibs.map((rib, idx) => {
            const pRib = rib.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathRib = pRib.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            return (
              <path
                key={`casing-rib-${idx}`}
                d={pathRib}
                fill="none"
                stroke={accentColor}
                strokeWidth="0.9"
                strokeOpacity="0.5"
                strokeDasharray="4 2"
              />
            );
          })}

          {/* 8 Longitudinal Cylinder Shell Wireframe Lines */}
          {casingLongitudinalAngles.map((angle, idx) => {
            const pTop = projectPoint(
              { x: Math.cos(angle) * outerRadius, y: Math.sin(angle) * outerRadius, z: zCasingTop },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            const pBottom = projectPoint(
              { x: Math.cos(angle) * outerRadius, y: Math.sin(angle) * outerRadius, z: zCasingBottom },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            return (
              <line
                key={`shell-long-${idx}`}
                x1={pTop.x2d}
                y1={pTop.y2d}
                x2={pBottom.x2d}
                y2={pBottom.y2d}
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.65"
              />
            );
          })}

          {/* CAD Technical Laser Engraving on Outer Casing */}
          {(() => {
            const pLabel = projectPoint(laserLabelPos, rotX, rotY, rotZ, centerX, centerY);
            return (
              <g transform={`translate(${pLabel.x2d}, ${pLabel.y2d})`}>
                <text
                  x="0"
                  y="0"
                  fill={primaryColor}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="0.8"
                  opacity="0.85"
                >
                  VDM-80 // 48VDC // RATIO 23.04:1 // 0.98kg
                </text>
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* ATTACHED 3D NODE CALLOUT BADGES (STRICTLY ON ASSEMBLY COMPONENTS) */}
        {/* ================================================================= */}
        <g className="telemetry-node-badges">
          {/* Node A (Output Flange) */}
          {(() => {
            const pAnchor = projectPoint(anchorNodeA, rotX, rotY, rotZ, centerX, centerY);
            const badgeX = pAnchor.x2d + 45;
            const badgeY = pAnchor.y2d - 30;

            return (
              <g className="callout-node-a">
                <line
                  x1={pAnchor.x2d}
                  y1={pAnchor.y2d}
                  x2={badgeX}
                  y2={badgeY + 12}
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  filter="url(#vdmCyanGlow)"
                />
                <circle cx={pAnchor.x2d} cy={pAnchor.y2d} r="2.5" fill="#FFFFFF" filter="url(#vdmCyanGlow)" />
                <g transform={`translate(${badgeX}, ${badgeY})`}>
                  <rect
                    x="0"
                    y="0"
                    width="190"
                    height="24"
                    fill="#05050C"
                    fillOpacity="0.9"
                    stroke={primaryColor}
                    strokeWidth="1"
                  />
                  <line x1="0" y1="0" x2="4" y2="4" stroke={primaryColor} strokeWidth="1" />
                  <text
                    x="8"
                    y="15"
                    fill={primaryColor}
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.4"
                  >
                    TORQUE: 128.6 N·m [PEAK] // BACKLASH ≤10&apos;
                  </text>
                </g>
              </g>
            );
          })()}

          {/* Node B (PCB Controller) */}
          {(() => {
            const pAnchor = projectPoint(anchorNodeB, rotX, rotY, rotZ, centerX, centerY);
            const badgeX = pAnchor.x2d - 195;
            const badgeY = pAnchor.y2d + 20;

            return (
              <g className="callout-node-b">
                <line
                  x1={pAnchor.x2d}
                  y1={pAnchor.y2d}
                  x2={badgeX + 180}
                  y2={badgeY + 12}
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  filter="url(#vdmIndigoGlow)"
                />
                <circle cx={pAnchor.x2d} cy={pAnchor.y2d} r="2.5" fill={primaryColor} filter="url(#vdmCyanGlow)" />
                <g transform={`translate(${badgeX}, ${badgeY})`}>
                  <rect
                    x="0"
                    y="0"
                    width="180"
                    height="24"
                    fill="#05050C"
                    fillOpacity="0.9"
                    stroke={accentColor}
                    strokeWidth="1"
                  />
                  <line x1="180" y1="0" x2="176" y2="4" stroke={accentColor} strokeWidth="1" />
                  <text
                    x="8"
                    y="15"
                    fill="#FFFFFF"
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.4"
                  >
                    48VDC // CAN FD · RS485 · EtherCAT
                  </text>
                </g>
              </g>
            );
          })()}

          {/* Node C (Hollow Bore) */}
          {(() => {
            const pAnchor = projectPoint(anchorNodeC, rotX, rotY, rotZ, centerX, centerY);
            const badgeX = pAnchor.x2d + 50;
            const badgeY = pAnchor.y2d + 35;

            return (
              <g className="callout-node-c">
                <line
                  x1={pAnchor.x2d}
                  y1={pAnchor.y2d}
                  x2={badgeX}
                  y2={badgeY + 12}
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  filter="url(#vdmCyanGlow)"
                />
                <circle cx={pAnchor.x2d} cy={pAnchor.y2d} r="2.2" fill={primaryColor} />
                <g transform={`translate(${badgeX}, ${badgeY})`}>
                  <rect
                    x="0"
                    y="0"
                    width="190"
                    height="24"
                    fill="#05050C"
                    fillOpacity="0.9"
                    stroke={primaryColor}
                    strokeWidth="1"
                  />
                  <line x1="0" y1="24" x2="4" y2="20" stroke={primaryColor} strokeWidth="1" />
                  <text
                    x="8"
                    y="15"
                    fill={primaryColor}
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.4"
                  >
                    HOLLOW SHAFT ⌀7.0mm // &gt;10,000h LIFE
                  </text>
                </g>
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default VDM80ActuatorJoint3D;
