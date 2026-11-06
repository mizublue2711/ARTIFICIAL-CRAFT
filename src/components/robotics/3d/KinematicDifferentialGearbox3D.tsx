import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface KinematicDifferentialGearbox3DProps extends BasePresetProps {
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

// Generate 3D spur/bevel gear teeth profile in the XY plane
function generateGearTeeth(
  numTeeth: number,
  innerRadius: number,
  outerRadius: number,
  z: number,
  rotation = 0
): Point3D[] {
  const points: Point3D[] = [];
  const step = (Math.PI * 2) / numTeeth;

  for (let i = 0; i < numTeeth; i++) {
    const a0 = i * step + rotation;
    const a1 = a0 + step * 0.25;
    const a2 = a0 + step * 0.55;
    const a3 = a0 + step * 0.8;

    // Root -> Tooth flank up -> Tooth tip crest -> Tooth flank down -> Root
    points.push({ x: Math.cos(a0) * innerRadius, y: Math.sin(a0) * innerRadius, z });
    points.push({ x: Math.cos(a1) * outerRadius, y: Math.sin(a1) * outerRadius, z });
    points.push({ x: Math.cos(a2) * outerRadius, y: Math.sin(a2) * outerRadius, z });
    points.push({ x: Math.cos(a3) * innerRadius, y: Math.sin(a3) * innerRadius, z });
  }

  return points;
}

// Generate 3D wireframe sphere points for ball bearing races
function generateSphereWireframe(center: Point3D, radius: number): {
  equatorXY: Point3D[];
  meridianXZ: Point3D[];
  meridianYZ: Point3D[];
} {
  const steps = 14;
  const equatorXY: Point3D[] = [];
  const meridianXZ: Point3D[] = [];
  const meridianYZ: Point3D[] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const cosA = Math.cos(angle) * radius;
    const sinA = Math.sin(angle) * radius;

    equatorXY.push({ x: center.x + cosA, y: center.y + sinA, z: center.z });
    meridianXZ.push({ x: center.x + cosA, y: center.y, z: center.z + sinA });
    meridianYZ.push({ x: center.x, y: center.y + cosA, z: center.z + sinA });
  }

  return { equatorXY, meridianXZ, meridianYZ };
}

export const KinematicDifferentialGearbox3D: React.FC<KinematicDifferentialGearbox3DProps> = ({
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
  const rotZ = Math.cos(frame * 0.006) * 0.015;

  // ---------------------------------------------------------------------------
  // Deterministic Mechanical Rotation Math
  // ---------------------------------------------------------------------------
  // Layer 1: Sun Gear spins clockwise at frame * 0.08
  const sunGearRotation = frame * 0.08;
  // Spider cross revolves at frame * 0.02
  const spiderRevolution = frame * 0.02;
  // Bevel planetary gears spin on their individual axes at 2.4x revolution
  const planetarySpin = frame * 0.16;

  // Layer 2: Harmonic flexspline wave generator pulsation
  const flexPulse = Math.sin(frame * 0.05);

  // Layer 3: Micrometric Helical Worm screw rotates rapidly at frame * 0.24
  const wormScrewRotation = frame * 0.24;

  // Layer 4: Ball bearings orbital travel
  const ballBearingOrbit = frame * 0.035;

  // ---------------------------------------------------------------------------
  // Exploded View Math (Dispersion clamped 0.0 to 0.12)
  // ---------------------------------------------------------------------------
  // Layer 5 (Top Cap) slides upward (+Z * 250 * dispersionAmount)
  const zExplodeTopCap = 250 * clampedDispersion * scale;
  // Layer 4 (Upper Bearing Race) slides upward (+Z * 150 * dispersionAmount)
  const zExplodeUpperBearing = 150 * clampedDispersion * scale;
  // Layer 1 & 2 (Planetary Core) remain centered at origin (Z = 0)
  // Layer 3 (Worm Screw Drive) slides laterally (+X * 180 * dispersionAmount)
  const xExplodeWormScrew = 180 * clampedDispersion * scale;
  // Layer 4 & 5 (Lower Assembly) slide downward (-Z * 200 * dispersionAmount)
  const zExplodeLowerAssembly = -200 * clampedDispersion * scale;

  // Dimensions
  const coreZTop = 20 * scale;
  const coreZBottom = -20 * scale;

  // ===========================================================================
  // LAYER 1: CENTRAL SUN GEAR & PLANETARY BEVEL SPIDER CROSS
  // ===========================================================================
  const sunInnerR = 30 * scale;
  const sunOuterR = 45 * scale;
  const sunTeethFront = useMemo(
    () => generateGearTeeth(18, sunInnerR, sunOuterR, coreZTop * 0.5, sunGearRotation),
    [sunInnerR, sunOuterR, coreZTop, sunGearRotation]
  );
  const sunTeethBack = useMemo(
    () => generateGearTeeth(18, sunInnerR, sunOuterR, coreZBottom * 0.5, sunGearRotation),
    [sunInnerR, sunOuterR, coreZBottom, sunGearRotation]
  );
  const sunHubHole = useMemo(
    () => generateRingPoints(14 * scale, 0, 24, sunGearRotation),
    [scale, sunGearRotation]
  );

  // 4 Planetary Bevel Gears mounted on 4-point cross-spider shaft
  const spiderRadius = 76 * scale;
  const planetInnerR = 15 * scale;
  const planetOuterR = 25 * scale;

  const planetaryGears = useMemo(() => {
    return [0, 1, 2, 3].map((idx) => {
      const angle = spiderRevolution + (idx * Math.PI) / 2;
      const px = Math.cos(angle) * spiderRadius;
      const py = Math.sin(angle) * spiderRadius;
      const pz = 0;

      // Bevel gear teeth oriented towards sun gear center
      const toothSpin = idx % 2 === 0 ? planetarySpin : -planetarySpin;
      const teeth = generateGearTeeth(12, planetInnerR, planetOuterR, 0, toothSpin);
      // Offset local teeth points to planet center
      const translatedTeeth = teeth.map((p) => ({
        x: px + p.x,
        y: py + p.y,
        z: p.z,
      }));

      return {
        center: { x: px, y: py, z: pz },
        angle,
        teeth: translatedTeeth,
        hub: generateRingPoints(6 * scale, 0, 16).map((p) => ({ x: px + p.x, y: py + p.y, z: p.z })),
      };
    });
  }, [spiderRevolution, spiderRadius, planetInnerR, planetOuterR, planetarySpin, scale]);

  // ===========================================================================
  // LAYER 2: INTERNAL RING GEAR & HARMONIC FLEXSPLINE RING
  // ===========================================================================
  const ringInnerR = 105 * scale;
  const ringOuterR = 120 * scale;
  const ringTeeth = useMemo(
    () => generateGearTeeth(36, ringInnerR, ringOuterR, 0, -frame * 0.01),
    [ringInnerR, ringOuterR, frame]
  );
  const ringHousingOuter = useMemo(
    () => generateRingPoints(ringOuterR + 10 * scale, 0, 48),
    [ringOuterR, scale]
  );

  // Flexible Harmonic Flexspline Ring (pulsates elliptically)
  const flexsplineRings = useMemo(() => {
    const steps = 48;
    const pts1: Point3D[] = [];
    const pts2: Point3D[] = [];
    const baseR = 95 * scale;
    const waveAmp = (4 + flexPulse * 3.5) * scale;

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      // 2-lobe elliptical wave deformation
      const r = baseR + Math.cos(theta * 2 + frame * 0.05) * waveAmp;
      pts1.push({ x: Math.cos(theta) * r, y: Math.sin(theta) * r, z: 8 * scale });
      pts2.push({ x: Math.cos(theta) * r, y: Math.sin(theta) * r, z: -8 * scale });
    }
    return { pts1, pts2 };
  }, [scale, flexPulse, frame]);

  // ===========================================================================
  // LAYER 3: MICROMETRIC WORM DRIVE & HELICAL SCREW ASSEMBLY
  // ===========================================================================
  const wormXBase = (ringOuterR + 32 * scale) + xExplodeWormScrew;
  const wormLength = 110 * scale;
  const wormRadius = 14 * scale;
  const wormHelices = useMemo(() => {
    const numTurns = 6;
    const steps = 60;
    const helixPts: Point3D[] = [];
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const y = -wormLength / 2 + frac * wormLength;
      const angle = frac * numTurns * Math.PI * 2 + wormScrewRotation;
      helixPts.push({
        x: wormXBase + Math.cos(angle) * wormRadius,
        y,
        z: Math.sin(angle) * wormRadius,
      });
    }
    return helixPts;
  }, [wormLength, wormScrewRotation, wormXBase, wormRadius]);

  // Dual Pillow Block Bearings for Worm Drive
  const pillowBlocks = useMemo(() => {
    const blockH = 34 * scale;
    const blockW = 20 * scale;
    const yOffsets = [-wormLength / 2 - 8 * scale, wormLength / 2 + 8 * scale];

    return yOffsets.map((yPos) => {
      const corners: Point3D[] = [
        { x: wormXBase - blockW / 2, y: yPos, z: -blockH / 2 },
        { x: wormXBase + blockW / 2, y: yPos, z: -blockH / 2 },
        { x: wormXBase + blockW / 2, y: yPos, z: blockH / 2 },
        { x: wormXBase - blockW / 2, y: yPos, z: blockH / 2 },
      ];
      return { yPos, corners };
    });
  }, [wormXBase, wormLength, scale]);

  // ===========================================================================
  // LAYER 4: DUAL-RACE BALL BEARING ASSEMBLIES (TOP & BOTTOM)
  // ===========================================================================
  const bearingRaceR = 122 * scale;
  const ballR = 5 * scale;
  const numBalls = 16;

  const upperBearingZ = 45 * scale + zExplodeUpperBearing;
  const lowerBearingZ = -45 * scale + zExplodeLowerAssembly;

  const upperRaceRings = useMemo(() => ({
    inner: generateRingPoints(bearingRaceR - ballR * 1.5, upperBearingZ, 36),
    outer: generateRingPoints(bearingRaceR + ballR * 1.5, upperBearingZ, 36),
  }), [bearingRaceR, ballR, upperBearingZ]);

  const lowerRaceRings = useMemo(() => ({
    inner: generateRingPoints(bearingRaceR - ballR * 1.5, lowerBearingZ, 36),
    outer: generateRingPoints(bearingRaceR + ballR * 1.5, lowerBearingZ, 36),
  }), [bearingRaceR, ballR, lowerBearingZ]);

  const upperBalls = useMemo(() => {
    const balls = [];
    const step = (Math.PI * 2) / numBalls;
    for (let i = 0; i < numBalls; i++) {
      const angle = i * step + ballBearingOrbit;
      const center: Point3D = {
        x: Math.cos(angle) * bearingRaceR,
        y: Math.sin(angle) * bearingRaceR,
        z: upperBearingZ,
      };
      balls.push({
        center,
        sphere: generateSphereWireframe(center, ballR),
      });
    }
    return balls;
  }, [numBalls, ballBearingOrbit, bearingRaceR, upperBearingZ, ballR]);

  const lowerBalls = useMemo(() => {
    const balls = [];
    const step = (Math.PI * 2) / numBalls;
    for (let i = 0; i < numBalls; i++) {
      const angle = i * step - ballBearingOrbit;
      const center: Point3D = {
        x: Math.cos(angle) * bearingRaceR,
        y: Math.sin(angle) * bearingRaceR,
        z: lowerBearingZ,
      };
      balls.push({
        center,
        sphere: generateSphereWireframe(center, ballR),
      });
    }
    return balls;
  }, [numBalls, ballBearingOrbit, bearingRaceR, lowerBearingZ, ballR]);

  // ===========================================================================
  // LAYER 5: FLANGED HOUSING CAP & RETAINER LOCK RINGS
  // ===========================================================================
  const flangeR = 142 * scale;
  const topCapZ = 75 * scale + zExplodeTopCap;
  const bottomCapZ = -75 * scale + zExplodeLowerAssembly * 1.25;

  const topFlangeRings = useMemo(() => ({
    outer: generateRingPoints(flangeR, topCapZ, 48),
    inner: generateRingPoints(flangeR * 0.75, topCapZ, 36),
    coupler: generateRingPoints(30 * scale, topCapZ + 15 * scale, 24),
  }), [flangeR, topCapZ, scale]);

  const bottomFlangeRings = useMemo(() => ({
    outer: generateRingPoints(flangeR, bottomCapZ, 48),
    inner: generateRingPoints(flangeR * 0.75, bottomCapZ, 36),
    coupler: generateRingPoints(30 * scale, bottomCapZ - 15 * scale, 24),
  }), [flangeR, bottomCapZ, scale]);

  // 8 Bolt Holes on Top & Bottom Flanges
  const numBolts = 8;
  const boltRadius = flangeR * 0.88;
  const topBolts = useMemo(() => {
    const bolts: Point3D[] = [];
    const step = (Math.PI * 2) / numBolts;
    for (let i = 0; i < numBolts; i++) {
      const angle = i * step;
      bolts.push({
        x: Math.cos(angle) * boltRadius,
        y: Math.sin(angle) * boltRadius,
        z: topCapZ,
      });
    }
    return bolts;
  }, [numBolts, boltRadius, topCapZ]);

  const bottomBolts = useMemo(() => {
    const bolts: Point3D[] = [];
    const step = (Math.PI * 2) / numBolts;
    for (let i = 0; i < numBolts; i++) {
      const angle = i * step;
      bolts.push({
        x: Math.cos(angle) * boltRadius,
        y: Math.sin(angle) * boltRadius,
        z: bottomCapZ,
      });
    }
    return bolts;
  }, [numBolts, boltRadius, bottomCapZ]);

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
          <filter id="diffCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="diffIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.8" />
          </filter>
          <filter id="diffCoreLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* EXPLODED AXIS TIE-RODS / ALIGNMENT LASERS (DISPERSION FEEDBACK) */}
        {/* ================================================================= */}
        {clampedDispersion > 0.01 && (
          <g className="exploded-alignment-lasers">
            {/* Central Z-axis through whole mechanism */}
            {(() => {
              const pTop = projectPoint({ x: 0, y: 0, z: topCapZ + 30 * scale }, rotX, rotY, rotZ, centerX, centerY);
              const pBottom = projectPoint({ x: 0, y: 0, z: bottomCapZ - 30 * scale }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pTop.x2d}
                  y1={pTop.y2d}
                  x2={pBottom.x2d}
                  y2={pBottom.y2d}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  strokeDasharray="4 3"
                  strokeOpacity="0.6"
                />
              );
            })()}

            {/* Worm lateral slide axis */}
            {(() => {
              const pOrigin = projectPoint({ x: ringOuterR, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
              const pWormCenter = projectPoint({ x: wormXBase, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pOrigin.x2d}
                  y1={pOrigin.y2d}
                  x2={pWormCenter.x2d}
                  y2={pWormCenter.y2d}
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                  strokeOpacity="0.5"
                />
              );
            })()}
          </g>
        )}

        {/* ================================================================= */}
        {/* LAYER 5: LOWER HOUSING CAP & RETAINER LOCK RING */}
        {/* ================================================================= */}
        <g className="lower-housing-flange">
          {(() => {
            const pOuter = bottomFlangeRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pInner = bottomFlangeRings.inner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pCoupler = bottomFlangeRings.coupler.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathOuter = pOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathInner = pInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathCoupler = pCoupler.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathOuter} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />
                <path d={pathInner} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" />
                <path d={pathCoupler} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.85" />

                {/* 8 Bolt Holes */}
                {bottomBolts.map((b, idx) => {
                  const pb = projectPoint(b, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <circle
                      key={`b-bolt-${idx}`}
                      cx={pb.x2d}
                      cy={pb.y2d}
                      r="2.2"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="1"
                    />
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 4: LOWER BALL BEARING ASSEMBLY */}
        {/* ================================================================= */}
        <g className="lower-ball-bearing-race">
          {(() => {
            const pInner = lowerRaceRings.inner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pOuter = lowerRaceRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathInner = pInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathOuter = pOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathInner} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                <path d={pathOuter} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />

                {/* 16 Lower Wireframe Ball Bearings */}
                {lowerBalls.map((b, bIdx) => {
                  const pEq = b.sphere.equatorXY.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
                  const pathEq = pEq.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
                  const pCenter = projectPoint(b.center, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <g key={`lb-${bIdx}`}>
                      <path d={pathEq} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.75" />
                      <circle cx={pCenter.x2d} cy={pCenter.y2d} r="1" fill={primaryColor} />
                    </g>
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 2: INTERNAL RING GEAR & HARMONIC FLEXSPLINE */}
        {/* ================================================================= */}
        <g className="ring-gear-and-harmonic-flexspline">
          {/* Internal 36-tooth ring gear wireframe */}
          {(() => {
            const pRingTeeth = ringTeeth.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathTeeth = pRingTeeth.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            const pHousing = ringHousingOuter.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathHousing = pHousing.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathTeeth}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                  filter="url(#diffIndigoGlow)"
                />
                <path d={pathHousing} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
              </>
            );
          })()}

          {/* Elliptical Pulsing Harmonic Flexspline Ring */}
          {(() => {
            const pFlex1 = flexsplineRings.pts1.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pFlex2 = flexsplineRings.pts2.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathF1 = pFlex1.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathF2 = pFlex2.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathF1}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  filter="url(#diffCyanGlow)"
                />
                <path d={pathF2} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />

                {/* Connecting flexspline diaphragm ribs */}
                {[0, 8, 16, 24, 32, 40].map((idx) => (
                  <line
                    key={`flex-rib-${idx}`}
                    x1={pFlex1[idx].x2d}
                    y1={pFlex1[idx].y2d}
                    x2={pFlex2[idx].x2d}
                    y2={pFlex2[idx].y2d}
                    stroke={primaryColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.65"
                  />
                ))}
              </>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 1: CENTRAL SUN GEAR & PLANETARY BEVEL SPIDER CROSS */}
        {/* ================================================================= */}
        <g className="planetary-bevel-spider-assembly">
          {/* Spider 4-Point Cross Shaft */}
          {planetaryGears.map((gear, idx) => {
            const pCenter = projectPoint(gear.center, rotX, rotY, rotZ, centerX, centerY);
            const pOrigin = projectPoint({ x: 0, y: 0, z: 0 }, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g key={`spider-arm-${idx}`}>
                {/* 1px Cross Shaft Spoke */}
                <line
                  x1={pOrigin.x2d}
                  y1={pOrigin.y2d}
                  x2={pCenter.x2d}
                  y2={pCenter.y2d}
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.85"
                />

                {/* Bevel Planet Gear Teeth Profile */}
                {(() => {
                  const pTeeth = gear.teeth.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
                  const pathT = pTeeth.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
                  return (
                    <path
                      d={pathT}
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth="1"
                      strokeOpacity="0.9"
                      filter="url(#diffCyanGlow)"
                    />
                  );
                })()}

                {/* Planet Gear Hub Ring */}
                {(() => {
                  const pHub = gear.hub.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
                  const pathH = pHub.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
                  return <path d={pathH} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />;
                })()}

                {/* Center Pivot Jewel */}
                <circle cx={pCenter.x2d} cy={pCenter.y2d} r="1.8" fill={primaryColor} filter="url(#diffCyanGlow)" />
              </g>
            );
          })}

          {/* Central 18-tooth Sun Gear */}
          {(() => {
            const pFront = sunTeethFront.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pBack = sunTeethBack.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathFront = pFront.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBack = pBack.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            const pHub = sunHubHole.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathHub = pHub.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            // Shaft Apex Node
            const pApex = projectPoint({ x: 0, y: 0, z: coreZTop + 10 * scale }, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g className="sun-gear">
                <path
                  d={pathFront}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.95"
                  filter="url(#diffCoreLaserGlow)"
                />
                <path d={pathBack} fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" />
                <path d={pathHub} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.85" />

                {/* Sun gear tooth longitudinal wireframe edges */}
                {[0, 8, 16, 24, 32, 40, 48, 56, 64].map((idx) => {
                  if (idx >= pFront.length) return null;
                  return (
                    <line
                      key={`sun-edge-${idx}`}
                      x1={pFront[idx].x2d}
                      y1={pFront[idx].y2d}
                      x2={pBack[idx].x2d}
                      y2={pBack[idx].y2d}
                      stroke={primaryColor}
                      strokeWidth="0.8"
                      strokeOpacity="0.75"
                    />
                  );
                })}

                <circle cx={pApex.x2d} cy={pApex.y2d} r="2.5" fill="#FFFFFF" filter="url(#diffCyanGlow)" />
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 3: MICROMETRIC WORM DRIVE & HELICAL SCREW ASSEMBLY */}
        {/* ================================================================= */}
        <g className="micrometric-worm-drive">
          {/* Dual Pillow Block CAD Bearings */}
          {pillowBlocks.map((block, idx) => {
            const pCorners = block.corners.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathBlock = pCorners.reduce((acc, p, i) => (i === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            return (
              <path
                key={`pb-${idx}`}
                d={pathBlock}
                fill="none"
                stroke={accentColor}
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#diffIndigoGlow)"
              />
            );
          })}

          {/* Central Shaft of Helical Worm Screw */}
          {(() => {
            const pStart = projectPoint({ x: wormXBase, y: -wormLength / 2 - 12 * scale, z: 0 }, rotX, rotY, rotZ, centerX, centerY);
            const pEnd = projectPoint({ x: wormXBase, y: wormLength / 2 + 12 * scale, z: 0 }, rotX, rotY, rotZ, centerX, centerY);

            return (
              <>
                <line
                  x1={pStart.x2d}
                  y1={pStart.y2d}
                  x2={pEnd.x2d}
                  y2={pEnd.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="0.9"
                />
                <circle cx={pStart.x2d} cy={pStart.y2d} r="2" fill={primaryColor} />
                <circle cx={pEnd.x2d} cy={pEnd.y2d} r="2" fill={primaryColor} />
              </>
            );
          })()}

          {/* Helical Worm Thread Ribbon */}
          {(() => {
            const pHelix = wormHelices.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathHelix = pHelix.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <path
                d={pathHelix}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.4"
                strokeOpacity="0.9"
                filter="url(#diffCyanGlow)"
              />
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 4: UPPER BALL BEARING ASSEMBLY */}
        {/* ================================================================= */}
        <g className="upper-ball-bearing-race">
          {(() => {
            const pInner = upperRaceRings.inner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pOuter = upperRaceRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathInner = pInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathOuter = pOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathInner} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />
                <path d={pathOuter} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />

                {/* 16 Upper Wireframe Ball Bearings */}
                {upperBalls.map((b, bIdx) => {
                  const pEq = b.sphere.equatorXY.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
                  const pathEq = pEq.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

                  const pMerXZ = b.sphere.meridianXZ.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
                  const pathMerXZ = pMerXZ.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

                  const pCenter = projectPoint(b.center, rotX, rotY, rotZ, centerX, centerY);

                  return (
                    <g key={`ub-${bIdx}`}>
                      <path d={pathEq} fill="none" stroke={primaryColor} strokeWidth="0.9" strokeOpacity="0.85" filter="url(#diffCyanGlow)" />
                      <path d={pathMerXZ} fill="none" stroke={primaryColor} strokeWidth="0.6" strokeOpacity="0.5" />
                      <circle cx={pCenter.x2d} cy={pCenter.y2d} r="1.2" fill="#FFFFFF" />
                    </g>
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 5: TOP FLANGED HOUSING CAP & RETAINER LOCK RING */}
        {/* ================================================================= */}
        <g className="top-housing-flange">
          {(() => {
            const pOuter = topFlangeRings.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pInner = topFlangeRings.inner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pCoupler = topFlangeRings.coupler.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathOuter = pOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathInner = pInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathCoupler = pCoupler.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathOuter}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                  filter="url(#diffIndigoGlow)"
                />
                <path d={pathInner} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 2" />
                <path
                  d={pathCoupler}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.9"
                  filter="url(#diffCyanGlow)"
                />

                {/* 8 Flange Mount Bolt Holes */}
                {topBolts.map((b, idx) => {
                  const pb = projectPoint(b, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <g key={`t-bolt-${idx}`}>
                      <circle
                        cx={pb.x2d}
                        cy={pb.y2d}
                        r="2.5"
                        fill="none"
                        stroke={primaryColor}
                        strokeWidth="1.2"
                        filter="url(#diffCyanGlow)"
                      />
                      <circle cx={pb.x2d} cy={pb.y2d} r="0.9" fill="#FFFFFF" />
                    </g>
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

export default KinematicDifferentialGearbox3D;
