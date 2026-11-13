import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface RollsRoyceTrent9703DProps extends BasePresetProps {
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
  perspective = 1300
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

  const projScale = perspective / (perspective + z2 + 650);
  return {
    x2d: centerX + x3 * projScale,
    y2d: centerY + y3 * projScale,
    z: z2,
  };
}

// Generate circular ring in 3D (YZ plane centered on X axis)
function generateRingPointsYZ(radius: number, x: number, steps = 36, startAngle = 0, sweepAngle = Math.PI * 2): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const angle = startAngle + fraction * sweepAngle;
    points.push({
      x,
      y: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
    });
  }
  return points;
}

// Generate circular ring in 3D (XY plane at given Z)
function generateRingPointsXY(radius: number, z: number, steps = 36, startAngle = 0, sweepAngle = Math.PI * 2): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const angle = startAngle + fraction * sweepAngle;
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z,
    });
  }
  return points;
}

// Generate fan rotor blade airfoils in 3D rotating along X-axis
function generateFanBladesYZ(
  numBlades: number,
  hubRadius: number,
  tipRadius: number,
  x: number,
  rotation: number,
  bladeTwist = 0.32
): { root: Point3D; tip: Point3D; tipTrailing: Point3D; rootTrailing: Point3D }[] {
  const blades: { root: Point3D; tip: Point3D; tipTrailing: Point3D; rootTrailing: Point3D }[] = [];
  const step = (Math.PI * 2) / numBlades;

  for (let i = 0; i < numBlades; i++) {
    const baseAngle = i * step + rotation;
    const tipAngle = baseAngle + bladeTwist;
    const chordOffset = step * 0.22;

    blades.push({
      root: {
        x,
        y: Math.cos(baseAngle) * hubRadius,
        z: Math.sin(baseAngle) * hubRadius,
      },
      tip: {
        x: x + 10,
        y: Math.cos(tipAngle) * tipRadius,
        z: Math.sin(tipAngle) * tipRadius,
      },
      tipTrailing: {
        x: x - 8,
        y: Math.cos(tipAngle + chordOffset) * tipRadius,
        z: Math.sin(tipAngle + chordOffset) * tipRadius,
      },
      rootTrailing: {
        x: x - 12,
        y: Math.cos(baseAngle + chordOffset) * hubRadius,
        z: Math.sin(baseAngle + chordOffset) * hubRadius,
      },
    });
  }

  return blades;
}

export const RollsRoyceTrent9703D: React.FC<RollsRoyceTrent9703DProps> = ({
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
  const rotX = baseRotX + Math.sin(frame * 0.008) * 0.025;
  const rotY = baseRotY + frame * 0.01;
  const rotZ = Math.cos(frame * 0.006) * 0.015;

  // ---------------------------------------------------------------------------
  // Deterministic Spool Motion & Thrust Calculation
  // ---------------------------------------------------------------------------
  // N1: Low-pressure outer fan rotor spins smoothly at frame * 0.05
  const n1FanRotation = frame * 0.05;

  // N2: Intermediate-pressure compressor spool spins counter-clockwise at frame * 0.15
  const n2CompRotation = -frame * 0.15;

  // N3: High-pressure compressor core spins clockwise at frame * 0.35
  const n3CoreRotation = frame * 0.35;

  // Dynamic Thrust Sensor Math: 14 kN (idle) ramping up to 334 kN max based on RPM cycle
  const rpmCycle = 0.5 + 0.5 * Math.sin(frame * 0.04);
  const currentThrustKn = Math.round(14 + rpmCycle * (334 - 14));

  // ---------------------------------------------------------------------------
  // Dynamic Exploded View Math (dispersionAmount clamped 0.0 to 0.12)
  // - Overhead Thrust Rig elevates upward along +Z axis (+Z * 200 * dispersionAmount)
  // - Cutaway Nacelle Shell slides laterally (+Y * 180 * dispersionAmount)
  // - Outer Fan Rotor slides forward (+X * 220 * dispersionAmount)
  // - Inner N2 & N3 Compressor Spools slide backward (-X * 160 * dispersionAmount)
  // - Combustor Core & Nozzle separate rearward (-X * 260 * dispersionAmount)
  // ---------------------------------------------------------------------------
  const zExplodeRig = 200 * clampedDispersion * scale;
  const yExplodeNacelle = 180 * clampedDispersion * scale;
  const xExplodeFan = 220 * clampedDispersion * scale;
  const xExplodeCompressor = -160 * clampedDispersion * scale;
  const xExplodeCombustor = -260 * clampedDispersion * scale;

  // Base Geometry Dimensions (Rolls-Royce Trent 970 116-inch fan proportion)
  const fanTipRadius = 148 * scale;
  const fanHubRadius = 46 * scale;
  const nacelleRadius = 160 * scale;
  const coreRadius = 78 * scale;
  const combustorRadius = 58 * scale;
  const exhaustRadius = 50 * scale;

  // Base X Stations along engine longitudinal centerline (Inlet at +X, Exhaust at -X)
  const xInletNacelle = 110 * scale;
  const xFanRotor = 75 * scale + xExplodeFan;
  const xStatorVanes = 42 * scale;
  const xCompN2 = 10 * scale + xExplodeCompressor;
  const xCompN3 = -35 * scale + xExplodeCompressor;
  const xCombustor = -85 * scale + xExplodeCombustor;
  const xExhaustNozzle = -150 * scale + xExplodeCombustor;

  // ===========================================================================
  // LAYER 1: GROUND-RUN THRUST TEST RIG & OVERHEAD GANTRY
  // ===========================================================================
  const rigZTop = (195 * scale) + zExplodeRig;
  const rigHalfW = 120 * scale;
  const rigHalfL = 170 * scale;

  // 4 Corner Gantry Strut Nodes
  const gantryCorners: Point3D[] = useMemo(() => [
    { x: rigHalfL, y: -rigHalfW, z: rigZTop },
    { x: rigHalfL, y: rigHalfW, z: rigZTop },
    { x: -rigHalfL, y: rigHalfW, z: rigZTop },
    { x: -rigHalfL, y: -rigHalfW, z: rigZTop },
  ], [rigHalfL, rigHalfW, rigZTop]);

  // Central Load Cell Transducer Pin connecting Gantry to Engine Pylon Mount
  const pylonMountEngine: Point3D = { x: 0, y: 0, z: nacelleRadius + 15 * scale };
  const loadCellGantry: Point3D = { x: 0, y: 0, z: rigZTop - 25 * scale };

  // 4 Corner Damper Struts from Gantry down to Ground Test Pylons
  const damperStrutAnchors: Point3D[] = useMemo(() => [
    { x: rigHalfL * 0.9, y: -rigHalfW * 0.85, z: nacelleRadius * 0.6 },
    { x: rigHalfL * 0.9, y: rigHalfW * 0.85, z: nacelleRadius * 0.6 },
    { x: -rigHalfL * 0.9, y: rigHalfW * 0.85, z: nacelleRadius * 0.6 },
    { x: -rigHalfL * 0.9, y: -rigHalfW * 0.85, z: nacelleRadius * 0.6 },
  ], [rigHalfL, rigHalfW, nacelleRadius]);

  // ===========================================================================
  // LAYER 2: OUTER CUTAWAY NACELLE & BYPASS DUCT SHELL
  // 90-degree upper-quarter cutaway slice (revealing internal spools)
  // Cutaway sweep: 270 degrees (from 45 deg to 315 deg)
  // Slides laterally along +Y when exploded
  // ===========================================================================
  const cutawayStartAngle = Math.PI * 0.25;
  const cutawaySweepAngle = Math.PI * 1.5;

  const nacelleStations = useMemo(() => {
    const rawStations = [
      { x: xInletNacelle, r: nacelleRadius * 0.96 },
      { x: xInletNacelle - 30 * scale, r: nacelleRadius },
      { x: xStatorVanes, r: nacelleRadius * 0.98 },
      { x: xCompN2, r: nacelleRadius * 0.95 },
      { x: xCompN3, r: nacelleRadius * 0.91 },
      { x: -110 * scale, r: nacelleRadius * 0.84 },
    ];

    return rawStations.map((st) => {
      const ringPts = generateRingPointsYZ(st.r, st.x, 30, cutawayStartAngle, cutawaySweepAngle);
      // Offset by yExplodeNacelle
      return {
        ...st,
        points: ringPts.map((p) => ({ ...p, y: p.y + yExplodeNacelle })),
      };
    });
  }, [xInletNacelle, nacelleRadius, scale, xStatorVanes, xCompN2, xCompN3, cutawayStartAngle, cutawaySweepAngle, yExplodeNacelle]);

  // Bypass Stator Guide Vanes (Stationary structural links in bypass duct)
  const bypassStatorVanes = useMemo(() => {
    const vanes: { root: Point3D; tip: Point3D }[] = [];
    const count = 16;
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * step;
      // Skip vanes in cutaway quadrant if nacelle is intact or render full structural array
      vanes.push({
        root: {
          x: xStatorVanes,
          y: Math.cos(angle) * fanHubRadius * 1.1,
          z: Math.sin(angle) * fanHubRadius * 1.1,
        },
        tip: {
          x: xStatorVanes,
          y: Math.cos(angle) * nacelleRadius * 0.94,
          z: Math.sin(angle) * nacelleRadius * 0.94,
        },
      });
    }
    return vanes;
  }, [xStatorVanes, fanHubRadius, nacelleRadius]);

  // ===========================================================================
  // LAYER 3: LOW-PRESSURE FAN SPOOL (N1 SPOOL)
  // 116-inch outer titanium fan rotor with 24 curved 3D blades & spinner cone
  // ===========================================================================
  const numFanBlades = 24;
  const fanBlades = useMemo(
    () => generateFanBladesYZ(numFanBlades, fanHubRadius, fanTipRadius, xFanRotor, n1FanRotation, 0.38),
    [numFanBlades, fanHubRadius, fanTipRadius, xFanRotor, n1FanRotation]
  );

  const fanSpinnerApex: Point3D = {
    x: xFanRotor + 54 * scale,
    y: 0,
    z: 0,
  };

  const fanSpinnerBaseRing = useMemo(
    () => generateRingPointsYZ(fanHubRadius, xFanRotor, 24, n1FanRotation),
    [fanHubRadius, xFanRotor, n1FanRotation]
  );

  // ===========================================================================
  // LAYER 4: INTERMEDIATE & HIGH-PRESSURE COMPRESSOR SPOOLS (N2 & N3 SPOOLS)
  // N2: counter-clockwise at frame * 0.15
  // N3: clockwise at frame * 0.35
  // ===========================================================================
  // N2 Intermediate Compressor Stages (Stages 1 & 2)
  const compN2BladesStg1 = useMemo(
    () => generateFanBladesYZ(16, 26 * scale, coreRadius * 0.95, xCompN2, n2CompRotation, -0.42),
    [scale, coreRadius, xCompN2, n2CompRotation]
  );
  const compN2BladesStg2 = useMemo(
    () => generateFanBladesYZ(18, 25 * scale, coreRadius * 0.88, xCompN2 - 18 * scale, n2CompRotation * 1.05, -0.4),
    [scale, coreRadius, xCompN2, n2CompRotation]
  );

  // N3 High-Pressure Core Stages (Stages 1 & 2)
  const compN3BladesStg1 = useMemo(
    () => generateFanBladesYZ(20, 24 * scale, coreRadius * 0.78, xCompN3, n3CoreRotation, 0.45),
    [scale, coreRadius, xCompN3, n3CoreRotation]
  );
  const compN3BladesStg2 = useMemo(
    () => generateFanBladesYZ(22, 22 * scale, coreRadius * 0.7, xCompN3 - 16 * scale, n3CoreRotation * 1.1, 0.42),
    [scale, coreRadius, xCompN3, n3CoreRotation]
  );

  // Intermediate shaft casing ring
  const shaftRingN2 = useMemo(
    () => generateRingPointsYZ(coreRadius * 0.98, xCompN2, 28),
    [coreRadius, xCompN2]
  );
  const shaftRingN3 = useMemo(
    () => generateRingPointsYZ(coreRadius * 0.8, xCompN3, 28),
    [coreRadius, xCompN3]
  );

  // ===========================================================================
  // LAYER 5: COMBUSTOR CORE & EXHAUST NOZZLE CONE
  // Annular combustion chamber with pulsing laser cyan plasma core
  // ===========================================================================
  const plasmaPulse = 0.5 + 0.5 * Math.sin(frame * 0.18);
  const flameLength = 48 * scale + Math.sin(frame * 0.25) * 10 * scale;
  const flameRadius = combustorRadius * (0.6 + plasmaPulse * 0.28);

  const combustorRings = useMemo(() => [
    generateRingPointsYZ(combustorRadius, xCombustor, 24),
    generateRingPointsYZ(combustorRadius * 0.86, xCombustor - 28 * scale, 24),
  ], [combustorRadius, xCombustor, scale]);

  const exhaustNozzleRing = useMemo(
    () => generateRingPointsYZ(exhaustRadius, xExhaustNozzle, 28),
    [exhaustRadius, xExhaustNozzle]
  );

  const exhaustTailConeApex: Point3D = {
    x: xExhaustNozzle - 46 * scale,
    y: 0,
    z: 0,
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width,
        height,
        perspective: '1300px',
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
          <filter id="rrCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="rrIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.8" />
          </filter>
          <filter id="rrPlasmaLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6.5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* EXPLODED AXIS ALIGNMENT LASER GUIDES (DISPERSION FEEDBACK) */}
        {/* ================================================================= */}
        {clampedDispersion > 0.01 && (
          <g className="exploded-axis-lasers">
            {/* Engine Centerline through all spools */}
            {(() => {
              const pFront = projectPoint({ x: xInletNacelle + 80 * scale, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
              const pRear = projectPoint({ x: xExhaustNozzle - 60 * scale, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pFront.x2d}
                  y1={pFront.y2d}
                  x2={pRear.x2d}
                  y2={pRear.y2d}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  strokeDasharray="5 3"
                  strokeOpacity="0.5"
                />
              );
            })()}

            {/* Nacelle Lateral Slide Axis */}
            {(() => {
              const pNacelleOrigin = projectPoint({ x: 0, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
              const pNacelleOffset = projectPoint({ x: 0, y: yExplodeNacelle, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pNacelleOrigin.x2d}
                  y1={pNacelleOrigin.y2d}
                  x2={pNacelleOffset.x2d}
                  y2={pNacelleOffset.y2d}
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  strokeOpacity="0.45"
                />
              );
            })()}

            {/* Gantry Rig Elevation Axis */}
            {(() => {
              const pRigOrigin = projectPoint(pylonMountEngine, rotX, rotY, rotZ, centerX, centerY);
              const pRigTop = projectPoint(loadCellGantry, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pRigOrigin.x2d}
                  y1={pRigOrigin.y2d}
                  x2={pRigTop.x2d}
                  y2={pRigTop.y2d}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  strokeDasharray="4 2"
                  strokeOpacity="0.6"
                />
              );
            })()}
          </g>
        )}

        {/* ================================================================= */}
        {/* LAYER 1: GROUND-RUN THRUST TEST RIG & OVERHEAD GANTRY */}
        {/* ================================================================= */}
        <g className="thrust-test-rig-gantry">
          {/* Rectangular Overhead Gantry Truss Perimeter */}
          {(() => {
            const pCorners = gantryCorners.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathGantry = pCorners.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            // Diagonal truss crossbracing
            const p0 = pCorners[0];
            const p1 = pCorners[1];
            const p2 = pCorners[2];
            const p3 = pCorners[3];

            return (
              <>
                <path
                  d={pathGantry}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.8"
                  filter="url(#rrIndigoGlow)"
                />
                <line x1={p0.x2d} y1={p0.y2d} x2={p2.x2d} y2={p2.y2d} stroke={accentColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.5" />
                <line x1={p1.x2d} y1={p1.y2d} x2={p3.x2d} y2={p3.y2d} stroke={accentColor} strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.5" />
              </>
            );
          })()}

          {/* 4 Corner Damper Struts */}
          {gantryCorners.map((corner, idx) => {
            const anchor = damperStrutAnchors[idx];
            const pCorner = projectPoint(corner, rotX, rotY, rotZ, centerX, centerY);
            const pAnchor = projectPoint(anchor, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g key={`strut-${idx}`}>
                <line
                  x1={pCorner.x2d}
                  y1={pCorner.y2d}
                  x2={pAnchor.x2d}
                  y2={pAnchor.y2d}
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
                <circle cx={pCorner.x2d} cy={pCorner.y2d} r="2.2" fill={primaryColor} />
                <circle cx={pAnchor.x2d} cy={pAnchor.y2d} r="1.8" fill={accentColor} />
              </g>
            );
          })}

          {/* Central Thrust Load Cell Transducer Pin */}
          {(() => {
            const pEngineMount = projectPoint(pylonMountEngine, rotX, rotY, rotZ, centerX, centerY);
            const pGantryLoadCell = projectPoint(loadCellGantry, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g className="load-cell-assembly">
                {/* Transducer Pylon Column */}
                <line
                  x1={pEngineMount.x2d}
                  y1={pEngineMount.y2d}
                  x2={pGantryLoadCell.x2d}
                  y2={pGantryLoadCell.y2d}
                  stroke={primaryColor}
                  strokeWidth="2"
                  strokeOpacity="0.9"
                  filter="url(#rrCyanGlow)"
                />
                <circle cx={pGantryLoadCell.x2d} cy={pGantryLoadCell.y2d} r="3" fill="#FFFFFF" filter="url(#rrCyanGlow)" />
                <circle cx={pEngineMount.x2d} cy={pEngineMount.y2d} r="2.4" fill={primaryColor} />

                {/* Integrated CAD Telemetry Readout attached to Transducer Node */}
                <g transform={`translate(${pGantryLoadCell.x2d + 12}, ${pGantryLoadCell.y2d - 10})`}>
                  <rect
                    x="0"
                    y="0"
                    width="112"
                    height="28"
                    fill="#05050A"
                    fillOpacity="0.88"
                    stroke={primaryColor}
                    strokeWidth="1"
                  />
                  <line x1="0" y1="0" x2="4" y2="4" stroke={primaryColor} strokeWidth="1" />
                  <text
                    x="8"
                    y="11"
                    fill={primaryColor}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.5"
                  >
                    THRUST: {currentThrustKn} kN
                  </text>
                  <text
                    x="8"
                    y="22"
                    fill="#FFFFFF"
                    fontSize="7"
                    fontFamily="monospace"
                    opacity="0.85"
                  >
                    TRENT 970 // RUN
                  </text>
                </g>
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 2: OUTER CUTAWAY NACELLE & BYPASS DUCT SHELL */}
        {/* 90-degree upper-quarter cutaway slice exposing interior */}
        {/* ================================================================= */}
        <g className="cutaway-nacelle-casing">
          {/* Nacelle Structural Circumferential Ribs */}
          {nacelleStations.map((station, sIdx) => {
            const projPts = station.points.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD = projPts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <g key={`nacelle-rib-${sIdx}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  filter="url(#rrIndigoGlow)"
                />
                {/* Structural rivet nodes */}
                {projPts.filter((_, idx) => idx % 6 === 0).map((pt, nIdx) => (
                  <circle key={`nr-${sIdx}-${nIdx}`} cx={pt.x2d} cy={pt.y2d} r="1.3" fill={accentColor} />
                ))}
              </g>
            );
          })}

          {/* Longitudinal Nacelle Stringers along casing */}
          {nacelleStations.length > 1 &&
            [0, 6, 12, 18, 24, 30].map((ptIdx) => {
              const stringerPts = nacelleStations.map((st) => st.points[Math.min(ptIdx, st.points.length - 1)]);
              const projStringer = stringerPts.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
              const stringerPath = projStringer.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');
              return (
                <path
                  key={`nacelle-str-${ptIdx}`}
                  d={stringerPath}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                  strokeDasharray="4 2"
                />
              );
            })}

          {/* Bypass Duct Stator Guide Vanes */}
          <g className="bypass-stators">
            {bypassStatorVanes.map((v, idx) => {
              const pRoot = projectPoint(v.root, rotX, rotY, rotZ, centerX, centerY);
              const pTip = projectPoint(v.tip, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  key={`bsv-${idx}`}
                  x1={pRoot.x2d}
                  y1={pRoot.y2d}
                  x2={pTip.x2d}
                  y2={pTip.y2d}
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.55"
                  strokeDasharray="2 2"
                />
              );
            })}
          </g>
        </g>

        {/* ================================================================= */}
        {/* LAYER 5: COMBUSTOR CORE & EXHAUST NOZZLE CONE */}
        {/* ================================================================= */}
        <g className="combustion-and-exhaust-core">
          {/* Annular Combustor Liner Rings */}
          {combustorRings.map((cRing, cIdx) => {
            const proj = cRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const path = proj.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            return (
              <path
                key={`combustor-ring-${cIdx}`}
                d={path}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.65"
                strokeDasharray="3 2"
              />
            );
          })}

          {/* Central Glowing Laser Cyan Plasma Flame Core */}
          {(() => {
            const pCombustorCenter = projectPoint({ x: xCombustor, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
            const pFlameTip = projectPoint({ x: xCombustor - flameLength, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);

            return (
              <>
                <line
                  x1={pCombustorCenter.x2d}
                  y1={pCombustorCenter.y2d}
                  x2={pFlameTip.x2d}
                  y2={pFlameTip.y2d}
                  stroke={primaryColor}
                  strokeWidth={4.5 + plasmaPulse * 3}
                  strokeOpacity="0.95"
                  filter="url(#rrPlasmaLaserGlow)"
                />
                <line
                  x1={pCombustorCenter.x2d}
                  y1={pCombustorCenter.y2d}
                  x2={pFlameTip.x2d}
                  y2={pFlameTip.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeOpacity="1"
                />

                {/* Concentric Flame Ionization Rings */}
                {[0, 1, 2].map((fIdx) => {
                  const flareR = flameRadius * (0.35 + fIdx * 0.35);
                  const flareX = xCombustor - (fIdx * 16 * scale);
                  const flarePts = generateRingPointsYZ(flareR, flareX, 18);
                  const projFlare = flarePts.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
                  const flarePath = projFlare.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
                  return (
                    <path
                      key={`flare-ring-${fIdx}`}
                      d={flarePath}
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth="1.2"
                      strokeOpacity={0.85 - fIdx * 0.22}
                      filter="url(#rrCyanGlow)"
                    />
                  );
                })}
              </>
            );
          })()}

          {/* Exhaust Nozzle Ring & Tail Cone */}
          {(() => {
            const projExhaust = exhaustNozzleRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathExhaust = projExhaust.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pTailApex = projectPoint(exhaustTailConeApex, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g className="exhaust-assembly">
                <path d={pathExhaust} fill="none" stroke={accentColor} strokeWidth="1.3" strokeOpacity="0.8" />
                {projExhaust.filter((_, idx) => idx % 6 === 0).map((pt, idx) => (
                  <line
                    key={`tail-strut-${idx}`}
                    x1={pt.x2d}
                    y1={pt.y2d}
                    x2={pTailApex.x2d}
                    y2={pTailApex.y2d}
                    stroke={accentColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.55"
                  />
                ))}
                <circle cx={pTailApex.x2d} cy={pTailApex.y2d} r="2.2" fill="#FFFFFF" />
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 4: INTERMEDIATE & HIGH-PRESSURE COMPRESSOR SPOOLS (N2 & N3) */}
        {/* ================================================================= */}
        <g className="intermediate-high-pressure-spools">
          {/* N2 Spool Casing Ring */}
          {(() => {
            const pRing = shaftRingN2.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathRing = pRing.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            return <path d={pathRing} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />;
          })()}

          {/* N2 Intermediate Compressor Blades (Stage 1 & 2) */}
          {compN2BladesStg1.map((b, idx) => {
            const pRoot = projectPoint(b.root, rotX, rotY, rotZ, centerX, centerY);
            const pTip = projectPoint(b.tip, rotX, rotY, rotZ, centerX, centerY);
            const pTipTrail = projectPoint(b.tipTrailing, rotX, rotY, rotZ, centerX, centerY);

            return (
              <path
                key={`n2-stg1-${idx}`}
                d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrail.x2d} ${pTipTrail.y2d} Z`}
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.85"
              />
            );
          })}
          {compN2BladesStg2.map((b, idx) => {
            const pRoot = projectPoint(b.root, rotX, rotY, rotZ, centerX, centerY);
            const pTip = projectPoint(b.tip, rotX, rotY, rotZ, centerX, centerY);
            const pTipTrail = projectPoint(b.tipTrailing, rotX, rotY, rotZ, centerX, centerY);

            return (
              <path
                key={`n2-stg2-${idx}`}
                d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrail.x2d} ${pTipTrail.y2d} Z`}
                fill="none"
                stroke={accentColor}
                strokeWidth="0.9"
                strokeOpacity="0.75"
              />
            );
          })}

          {/* N3 Spool Casing Ring */}
          {(() => {
            const pRing = shaftRingN3.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathRing = pRing.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            return <path d={pathRing} fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="2 2" />;
          })()}

          {/* N3 High-Pressure Core Blades (Stage 1 & 2) */}
          {compN3BladesStg1.map((b, idx) => {
            const pRoot = projectPoint(b.root, rotX, rotY, rotZ, centerX, centerY);
            const pTip = projectPoint(b.tip, rotX, rotY, rotZ, centerX, centerY);
            const pTipTrail = projectPoint(b.tipTrailing, rotX, rotY, rotZ, centerX, centerY);

            return (
              <path
                key={`n3-stg1-${idx}`}
                d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrail.x2d} ${pTipTrail.y2d} Z`}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.1"
                strokeOpacity="0.9"
                filter="url(#rrCyanGlow)"
              />
            );
          })}
          {compN3BladesStg2.map((b, idx) => {
            const pRoot = projectPoint(b.root, rotX, rotY, rotZ, centerX, centerY);
            const pTip = projectPoint(b.tip, rotX, rotY, rotZ, centerX, centerY);
            const pTipTrail = projectPoint(b.tipTrailing, rotX, rotY, rotZ, centerX, centerY);

            return (
              <path
                key={`n3-stg2-${idx}`}
                d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrail.x2d} ${pTipTrail.y2d} Z`}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1"
                strokeOpacity="0.8"
              />
            );
          })}
        </g>

        {/* ================================================================= */}
        {/* LAYER 3: LOW-PRESSURE FAN SPOOL (N1 SPOOL) */}
        {/* 116-inch Outer Titanium Fan Rotor (24 curved 3D blades & spinner) */}
        {/* ================================================================= */}
        <g className="n1-fan-rotor">
          {/* 24 Curved Wide-Chord Titanium Fan Blades */}
          {fanBlades.map((blade, idx) => {
            const pRoot = projectPoint(blade.root, rotX, rotY, rotZ, centerX, centerY);
            const pTip = projectPoint(blade.tip, rotX, rotY, rotZ, centerX, centerY);
            const pTipTrailing = projectPoint(blade.tipTrailing, rotX, rotY, rotZ, centerX, centerY);
            const pRootTrailing = projectPoint(blade.rootTrailing, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g key={`trent-fb-${idx}`} className="fan-blade-mesh">
                {/* 1px Titanium Airfoil Contour */}
                <path
                  d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrailing.x2d} ${pTipTrailing.y2d} L ${pRootTrailing.x2d} ${pRootTrailing.y2d} Z`}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.92"
                  filter="url(#rrCyanGlow)"
                />
                {/* Curved Leading Edge Reinforcement Rib */}
                <line
                  x1={pRoot.x2d}
                  y1={pRoot.y2d}
                  x2={pTip.x2d}
                  y2={pTip.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.85"
                />
              </g>
            );
          })}

          {/* Central Nose Cone Spinner (Spins with N1 Fan) */}
          {(() => {
            const projSpinnerBase = fanSpinnerBaseRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathBase = projSpinnerBase.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pApex = projectPoint(fanSpinnerApex, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g className="spinner-cone">
                <path
                  d={pathBase}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.95"
                  filter="url(#rrCyanGlow)"
                />
                {/* Spiral Spinner Stripe Lines */}
                {projSpinnerBase.filter((_, idx) => idx % 4 === 0).map((pt, idx) => (
                  <line
                    key={`spinner-rib-${idx}`}
                    x1={pt.x2d}
                    y1={pt.y2d}
                    x2={pApex.x2d}
                    y2={pApex.y2d}
                    stroke={primaryColor}
                    strokeWidth="1"
                    strokeOpacity="0.75"
                  />
                ))}
                <circle cx={pApex.x2d} cy={pApex.y2d} r="2.8" fill="#FFFFFF" filter="url(#rrCyanGlow)" />
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default RollsRoyceTrent9703D;
