import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface TurbofanJetEngine3DProps extends BasePresetProps {
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

// Generate circular ring points in 3D (XY plane at given Z)
function generateRingPoints(radius: number, z: number, steps = 32, startAngle = 0, sweepAngle = Math.PI * 2): Point3D[] {
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

// Generate fan rotor blade airfoils
function generateRotorBlades(
  numBlades: number,
  hubRadius: number,
  tipRadius: number,
  z: number,
  rotation: number,
  bladeTwist = 0.28
): { root: Point3D; tip: Point3D; tipTrailing: Point3D; rootTrailing: Point3D }[] {
  const blades: { root: Point3D; tip: Point3D; tipTrailing: Point3D; rootTrailing: Point3D }[] = [];
  const step = (Math.PI * 2) / numBlades;

  for (let i = 0; i < numBlades; i++) {
    const baseAngle = i * step + rotation;
    const tipAngle = baseAngle + bladeTwist;
    const chordOffset = step * 0.18;

    blades.push({
      root: {
        x: Math.cos(baseAngle) * hubRadius,
        y: Math.sin(baseAngle) * hubRadius,
        z,
      },
      tip: {
        x: Math.cos(tipAngle) * tipRadius,
        y: Math.sin(tipAngle) * tipRadius,
        z: z + 8,
      },
      tipTrailing: {
        x: Math.cos(tipAngle + chordOffset) * tipRadius,
        y: Math.sin(tipAngle + chordOffset) * tipRadius,
        z: z - 6,
      },
      rootTrailing: {
        x: Math.cos(baseAngle + chordOffset) * hubRadius,
        y: Math.sin(baseAngle + chordOffset) * hubRadius,
        z: z - 10,
      },
    });
  }

  return blades;
}

export const TurbofanJetEngine3D: React.FC<TurbofanJetEngine3DProps> = ({
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
  const clampedDispersion = Math.max(0.0, Math.min(0.3, dispersionAmount));

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;

  // Gentle CAD camera orbit
  const rotX = baseRotX + Math.sin(frame * 0.01) * 0.03;
  const rotY = baseRotY + frame * 0.012;
  const rotZ = Math.cos(frame * 0.008) * 0.02;

  // Dual-Spool Speeds:
  // 1. Low-Pressure Outer Fan Rotor: medium velocity (frame * 0.08)
  // 2. High-Pressure Compressor Core: 2.5x faster (frame * 0.20)
  const fanRotation = frame * 0.08;
  const coreRotation = frame * 0.20;

  // Exploded CAD Axial Separation along Z-axis
  const nacelleExplodeZ = clampedDispersion * 450;
  const fanExplodeZ = clampedDispersion * 300;
  const compressorExplodeZ = clampedDispersion * 160;
  const combustorExplodeZ = 0;
  const exhaustExplodeZ = -clampedDispersion * 240;

  // Engine Dimensional Specifications
  const nacelleRadius = 155 * scale;
  const fanTipRadius = 142 * scale;
  const fanHubRadius = 45 * scale;
  const coreRadius = 72 * scale;
  const combustorRadius = 55 * scale;
  const exhaustRadius = 48 * scale;

  // Base Z stations
  const zNacelleInlet = 110 * scale + nacelleExplodeZ;
  const zFanRotor = 70 * scale + fanExplodeZ;
  const zCompressorStg1 = 25 * scale + compressorExplodeZ;
  const zCompressorStg2 = -15 * scale + compressorExplodeZ * 0.5;
  const zCombustor = -55 * scale + combustorExplodeZ;
  const zExhaustNozzle = -115 * scale + exhaustExplodeZ;
  const zNacelleAft = -105 * scale - nacelleExplodeZ * 0.7;

  // 1. Cutaway Nacelle Casing (3/4 circle cutaway 270 degrees exposing internal stages)
  // Cutaway reveals 90-degree quadrant (-45deg to +45deg)
  const cutawayStartAngle = Math.PI * 0.25;
  const cutawaySweepAngle = Math.PI * 1.5;

  const nacelleRings = useMemo(() => {
    const stations = [
      { z: zNacelleInlet, r: nacelleRadius * 0.94 },
      { z: zNacelleInlet - 25 * scale, r: nacelleRadius },
      { z: zFanRotor - 20 * scale, r: nacelleRadius * 0.98 },
      { z: zCompressorStg1 - 10 * scale, r: nacelleRadius * 0.95 },
      { z: zCombustor + 10 * scale, r: nacelleRadius * 0.88 },
      { z: zNacelleAft, r: nacelleRadius * 0.82 },
    ];

    return stations.map((st) => ({
      z: st.z,
      radius: st.r,
      points: generateRingPoints(st.r, st.z, 28, cutawayStartAngle, cutawaySweepAngle),
    }));
  }, [zNacelleInlet, nacelleRadius, scale, zFanRotor, zCompressorStg1, zCombustor, zNacelleAft, cutawayStartAngle, cutawaySweepAngle]);

  // 2. Outer Low-Pressure Fan Rotor Blades (18 wide-chord titanium blades)
  const numFanBlades = 18;
  const fanBlades = useMemo(
    () => generateRotorBlades(numFanBlades, fanHubRadius, fanTipRadius, zFanRotor, fanRotation, 0.35),
    [numFanBlades, fanHubRadius, fanTipRadius, zFanRotor, fanRotation]
  );

  // 3. Inner High-Pressure Compressor Stages (2.5x speed)
  // Stage 1 (14 blades) & Stage 2 (16 blades)
  const compBladesStg1 = useMemo(
    () => generateRotorBlades(14, 28 * scale, coreRadius, zCompressorStg1, -coreRotation, 0.45),
    [scale, coreRadius, zCompressorStg1, coreRotation]
  );
  const compBladesStg2 = useMemo(
    () => generateRotorBlades(16, 26 * scale, coreRadius * 0.88, zCompressorStg2, coreRotation * 1.05, -0.45),
    [scale, coreRadius, zCompressorStg2, coreRotation]
  );

  // 4. Stator Vane Ring (stationary 12 structural vanes between fan and compressor)
  const zStator = (zFanRotor + zCompressorStg1) / 2;
  const statorVanes = useMemo(
    () => generateRotorBlades(12, fanHubRadius * 0.9, nacelleRadius * 0.92, zStator, 0, 0),
    [fanHubRadius, nacelleRadius, zStator]
  );

  // 5. Central Plasma Core Pulse & Combustion Flame Nodes
  const plasmaPulse = 0.5 + 0.5 * Math.sin(frame * 0.15);
  const flameLength = 40 * scale + Math.sin(frame * 0.22) * 8 * scale;
  const flameRadius = combustorRadius * (0.65 + plasmaPulse * 0.25);

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
          <filter id="jetCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="jetIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="plasmaCoreGlowJet" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. CUTAWAY NACELLE CASING (1px CAD Structural Wireframe) */}
        <g className="nacelle-casing">
          {nacelleRings.map((ring, rIdx) => {
            const projPts = ring.points.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathD = projPts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <g key={`nacelle-ring-${rIdx}`}>
                {/* Nacelle rib arch */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                  filter="url(#jetIndigoGlow)"
                />
                {/* Structural rivet nodes */}
                {projPts.filter((_, idx) => idx % 7 === 0).map((pt, nIdx) => (
                  <circle key={`nr-${rIdx}-${nIdx}`} cx={pt.x2d} cy={pt.y2d} r="1.4" fill={accentColor} />
                ))}
              </g>
            );
          })}

          {/* Longitudinal nacelle stringers */}
          {nacelleRings.length > 1 &&
            [0, 7, 14, 21, 28].map((ptIdx) => {
              const stringerPts = nacelleRings.map((r) => r.points[Math.min(ptIdx, r.points.length - 1)]);
              const projStringer = stringerPts.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
              const stringerPath = projStringer.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');
              return (
                <path
                  key={`stringer-${ptIdx}`}
                  d={stringerPath}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                  strokeDasharray="4 2"
                />
              );
            })}
        </g>

        {/* 2. STATOR GUIDE VANES (Stationary structural links) */}
        <g className="stator-vanes">
          {statorVanes.map((v, idx) => {
            const pRoot = projectPoint(v.root, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTip = projectPoint(v.tip, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <line
                key={`sv-${idx}`}
                x1={pRoot.x2d}
                y1={pRoot.y2d}
                x2={pTip.x2d}
                y2={pTip.y2d}
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.5"
                strokeDasharray="2 2"
              />
            );
          })}
        </g>

        {/* 3. HIGH-PRESSURE INNER COMPRESSOR SPOOL (Spins 2.5x faster) */}
        <g className="hp-compressor-spool">
          {/* Stage 1 Blades */}
          {compBladesStg1.map((b, idx) => {
            const pRoot = projectPoint(b.root, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTip = projectPoint(b.tip, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTipTrail = projectPoint(b.tipTrailing, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <path
                key={`hp1-${idx}`}
                d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrail.x2d} ${pTipTrail.y2d} Z`}
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.85"
              />
            );
          })}

          {/* Stage 2 Blades */}
          {compBladesStg2.map((b, idx) => {
            const pRoot = projectPoint(b.root, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTip = projectPoint(b.tip, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTipTrail = projectPoint(b.tipTrailing, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <path
                key={`hp2-${idx}`}
                d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrail.x2d} ${pTipTrail.y2d} Z`}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1"
                strokeOpacity="0.8"
              />
            );
          })}
        </g>

        {/* 4. COMBUSTION CHAMBER & PULSING PLASMA CORE */}
        <g className="combustion-core">
          {(() => {
            const combustorRings = [
              generateRingPoints(combustorRadius, zCombustor, 20),
              generateRingPoints(combustorRadius * 0.85, zCombustor - 25 * scale, 20),
            ];

            const pCoreCenter = projectPoint({ x: 0, y: 0, z: zCombustor }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pFlameTip = projectPoint({ x: 0, y: 0, z: zCombustor - flameLength }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <>
                {/* Combustor liner rings */}
                {combustorRings.map((cRing, cIdx) => {
                  const proj = cRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
                  const path = proj.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
                  return <path key={`cr-${cIdx}`} d={path} fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />;
                })}

                {/* Plasma Jet Flame Jet Cone */}
                <line
                  x1={pCoreCenter.x2d}
                  y1={pCoreCenter.y2d}
                  x2={pFlameTip.x2d}
                  y2={pFlameTip.y2d}
                  stroke={primaryColor}
                  strokeWidth={4 + plasmaPulse * 3}
                  strokeOpacity="0.95"
                  filter="url(#plasmaCoreGlowJet)"
                />
                <line
                  x1={pCoreCenter.x2d}
                  y1={pCoreCenter.y2d}
                  x2={pFlameTip.x2d}
                  y2={pFlameTip.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="1"
                />

                {/* Radial flame nozzle flare rings */}
                {[0, 1, 2].map((fIdx) => {
                  const flareR = flameRadius * (0.3 + fIdx * 0.35);
                  const flareZ = zCombustor - (fIdx * 15 * scale);
                  const flarePts = generateRingPoints(flareR, flareZ, 16);
                  const projFlare = flarePts.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
                  const flarePath = projFlare.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
                  return (
                    <path
                      key={`flare-${fIdx}`}
                      d={flarePath}
                      fill="none"
                      stroke={primaryColor}
                      strokeWidth="1.2"
                      strokeOpacity={0.8 - fIdx * 0.2}
                      filter="url(#jetCyanGlow)"
                    />
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* 5. EXHAUST CONE & NOZZLE */}
        <g className="exhaust-nozzle">
          {(() => {
            const exhaustRing = generateRingPoints(exhaustRadius, zExhaustNozzle, 24);
            const projExhaust = exhaustRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathExhaust = projExhaust.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            // Central tail cone point
            const pTailCone = projectPoint({ x: 0, y: 0, z: zExhaustNozzle - 40 * scale }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <>
                <path d={pathExhaust} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />
                {projExhaust.filter((_, idx) => idx % 6 === 0).map((pt, idx) => (
                  <line
                    key={`tail-strut-${idx}`}
                    x1={pt.x2d}
                    y1={pt.y2d}
                    x2={pTailCone.x2d}
                    y2={pTailCone.y2d}
                    stroke={accentColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                  />
                ))}
                <circle cx={pTailCone.x2d} cy={pTailCone.y2d} r="2" fill="#FFFFFF" />
              </>
            );
          })()}
        </g>

        {/* 6. OUTER LOW-PRESSURE FAN ROTOR & SPINNER NOSE CONE */}
        <g className="lp-fan-rotor">
          {/* Fan Blades */}
          {fanBlades.map((blade, idx) => {
            const pRoot = projectPoint(blade.root, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTip = projectPoint(blade.tip, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTipTrailing = projectPoint(blade.tipTrailing, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pRootTrailing = projectPoint(blade.rootTrailing, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g key={`fb-${idx}`} className="fan-blade">
                {/* 1px Airfoil Blade Perimeter */}
                <path
                  d={`M ${pRoot.x2d} ${pRoot.y2d} L ${pTip.x2d} ${pTip.y2d} L ${pTipTrailing.x2d} ${pTipTrailing.y2d} L ${pRootTrailing.x2d} ${pRootTrailing.y2d} Z`}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.9"
                  filter="url(#jetCyanGlow)"
                />
                {/* Titanium Blade Leading Edge Spine */}
                <line
                  x1={pRoot.x2d}
                  y1={pRoot.y2d}
                  x2={pTip.x2d}
                  y2={pTip.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.8"
                />
              </g>
            );
          })}

          {/* Central Nose Cone Spinner (Spins with Fan) */}
          {(() => {
            const spinnerBase = generateRingPoints(fanHubRadius, zFanRotor, 24, fanRotation);
            const projSpinnerBase = spinnerBase.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathBase = projSpinnerBase.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            // Spinner Apex
            const spinnerApex: Point3D = { x: 0, y: 0, z: zFanRotor + 55 * scale };
            const pApex = projectPoint(spinnerApex, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <>
                <path d={pathBase} fill="none" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.9" filter="url(#jetCyanGlow)" />
                {/* Spinner Spiral Stripe */}
                {projSpinnerBase.filter((_, idx) => idx % 6 === 0).map((pt, idx) => (
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
                <circle cx={pApex.x2d} cy={pApex.y2d} r="2.5" fill="#FFFFFF" filter="url(#jetCyanGlow)" />
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default TurbofanJetEngine3D;
