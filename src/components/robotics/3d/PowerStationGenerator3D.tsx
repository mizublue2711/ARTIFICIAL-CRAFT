import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface PowerStationGenerator3DProps extends BasePresetProps {
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

// Generate circular ring in 3D (XY plane at given Z)
function generateRingPoints(radius: number, z: number, steps = 36): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z,
    });
  }
  return points;
}

export const PowerStationGenerator3D: React.FC<PowerStationGenerator3DProps> = ({
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

  // CAD orbital camera rotation
  const rotX = baseRotX + Math.sin(frame * 0.01) * 0.03;
  const rotY = baseRotY + frame * 0.012;
  const rotZ = Math.cos(frame * 0.008) * 0.02;

  // Stator and Rotor Core Dimensions
  const numPoles = 12;
  const rotorSpeed = frame * 0.04;

  // Exploded CAD offsets:
  // Dispersion expands the outer stator ring radially outward and slides the rotor shaft axially out along Z
  const statorRadialExpansion = clampedDispersion * 180 * scale;
  const rotorAxialDisplacement = clampedDispersion * 320 * scale;

  const baseStatorOuterR = 150 * scale;
  const statorOuterR = baseStatorOuterR + statorRadialExpansion;
  const statorInnerR = (baseStatorOuterR - 35 * scale) + statorRadialExpansion * 0.8;
  const rotorOuterR = 85 * scale;
  const rotorShaftR = 24 * scale;
  const generatorDepth = 80 * scale;

  const frontZ = generatorDepth / 2;
  const backZ = -generatorDepth / 2;

  // Rotor axial explosion positions
  const rotorFrontZ = frontZ + rotorAxialDisplacement;
  const rotorBackZ = backZ + rotorAxialDisplacement;
  const shaftFrontZ = rotorFrontZ + 60 * scale;
  const shaftBackZ = rotorBackZ - 60 * scale;

  // Active pulsing pole index (frame % 12)
  const activePoleIdx = Math.floor(frame / 6) % numPoles;

  // Outer Stator Rings
  const statorFrontOuter = useMemo(() => generateRingPoints(statorOuterR, frontZ, 48), [statorOuterR, frontZ]);
  const statorBackOuter = useMemo(() => generateRingPoints(statorOuterR, backZ, 48), [statorOuterR, backZ]);
  const statorFrontInner = useMemo(() => generateRingPoints(statorInnerR, frontZ, 48), [statorInnerR, frontZ]);
  const statorBackInner = useMemo(() => generateRingPoints(statorInnerR, backZ, 48), [statorInnerR, backZ]);

  // Rotor Core Rings
  const rotorFrontRing = useMemo(() => generateRingPoints(rotorOuterR, rotorFrontZ, 36), [rotorOuterR, rotorFrontZ]);
  const rotorBackRing = useMemo(() => generateRingPoints(rotorOuterR, rotorBackZ, 36), [rotorOuterR, rotorBackZ]);
  const shaftFrontRing = useMemo(() => generateRingPoints(rotorShaftR, shaftFrontZ, 24), [rotorShaftR, shaftFrontZ]);
  const shaftBackRing = useMemo(() => generateRingPoints(rotorShaftR, shaftBackZ, 24), [rotorShaftR, shaftBackZ]);

  // 12 Stator Pole Shoes with Copper Windings
  const statorPoles = useMemo(() => {
    const poles = [];
    const step = (Math.PI * 2) / numPoles;
    const poleWidth = 14 * scale;

    for (let i = 0; i < numPoles; i++) {
      const angle = i * step;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const perpX = -sinA;
      const perpY = cosA;

      const rRoot = statorInnerR;
      const rTip = statorInnerR - 22 * scale;

      // 4 corners of the pole shoe on front plane
      const p1: Point3D = { x: cosA * rRoot - perpX * (poleWidth / 2), y: sinA * rRoot - perpY * (poleWidth / 2), z: frontZ };
      const p2: Point3D = { x: cosA * rRoot + perpX * (poleWidth / 2), y: sinA * rRoot + perpY * (poleWidth / 2), z: frontZ };
      const p3: Point3D = { x: cosA * rTip + perpX * (poleWidth * 0.7), y: sinA * rTip + perpY * (poleWidth * 0.7), z: frontZ };
      const p4: Point3D = { x: cosA * rTip - perpX * (poleWidth * 0.7), y: sinA * rTip - perpY * (poleWidth * 0.7), z: frontZ };

      // Back plane corners
      const p1b: Point3D = { ...p1, z: backZ };
      const p2b: Point3D = { ...p2, z: backZ };
      const p3b: Point3D = { ...p3, z: backZ };
      const p4b: Point3D = { ...p4, z: backZ };

      // Copper coil winding rings around the pole shank
      const coilZSteps = 4;
      const coils: Point3D[][] = [];
      for (let c = 1; c <= coilZSteps; c++) {
        const cz = backZ + (generatorDepth * c) / (coilZSteps + 1);
        const coilW = poleWidth * 0.85;
        coils.push([
          { x: cosA * (rRoot - 4 * scale) - perpX * coilW, y: sinA * (rRoot - 4 * scale) - perpY * coilW, z: cz },
          { x: cosA * (rRoot - 4 * scale) + perpX * coilW, y: sinA * (rRoot - 4 * scale) + perpY * coilW, z: cz },
          { x: cosA * (rTip + 4 * scale) + perpX * coilW, y: sinA * (rTip + 4 * scale) + perpY * coilW, z: cz },
          { x: cosA * (rTip + 4 * scale) - perpX * coilW, y: sinA * (rTip + 4 * scale) - perpY * coilW, z: cz },
        ]);
      }

      poles.push({
        idx: i,
        angle,
        tipCenter: { x: cosA * rTip, y: sinA * rTip, z: frontZ },
        cornersFront: [p1, p2, p3, p4],
        cornersBack: [p1b, p2b, p3b, p4b],
        coils,
      });
    }
    return poles;
  }, [numPoles, statorInnerR, scale, frontZ, backZ, generatorDepth]);

  // Rotor Magnetic Poles (6 salient pole pairs spinning with rotorSpeed)
  const rotorPoles = useMemo(() => {
    const poles = [];
    const step = (Math.PI * 2) / 6;
    for (let i = 0; i < 6; i++) {
      const angle = i * step + rotorSpeed;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const perpX = -sinA;
      const perpY = cosA;

      const rRoot = rotorShaftR;
      const rTip = rotorOuterR;
      const widthR = 12 * scale;

      const rFront1: Point3D = { x: cosA * rRoot - perpX * (widthR / 2), y: sinA * rRoot - perpY * (widthR / 2), z: rotorFrontZ };
      const rFront2: Point3D = { x: cosA * rRoot + perpX * (widthR / 2), y: sinA * rRoot + perpY * (widthR / 2), z: rotorFrontZ };
      const rFront3: Point3D = { x: cosA * rTip + perpX * (widthR * 0.8), y: sinA * rTip + perpY * (widthR * 0.8), z: rotorFrontZ };
      const rFront4: Point3D = { x: cosA * rTip - perpX * (widthR * 0.8), y: sinA * rTip - perpY * (widthR * 0.8), z: rotorFrontZ };

      const rBack1: Point3D = { ...rFront1, z: rotorBackZ };
      const rBack2: Point3D = { ...rFront2, z: rotorBackZ };
      const rBack3: Point3D = { ...rFront3, z: rotorBackZ };
      const rBack4: Point3D = { ...rFront4, z: rotorBackZ };

      poles.push({
        idx: i,
        angle,
        tipCenter: { x: cosA * rTip, y: sinA * rTip, z: (rotorFrontZ + rotorBackZ) / 2 },
        cornersFront: [rFront1, rFront2, rFront3, rFront4],
        cornersBack: [rBack1, rBack2, rBack3, rBack4],
      });
    }
    return poles;
  }, [rotorSpeed, rotorShaftR, rotorOuterR, scale, rotorFrontZ, rotorBackZ]);

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
          <filter id="genCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="genIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="magneticFluxGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. OUTER STATOR CASING & FRAME RIBS */}
        <g className="stator-casing">
          {(() => {
            const pFrontOuter = statorFrontOuter.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pBackOuter = statorBackOuter.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pFrontInner = statorFrontInner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pBackInner = statorBackInner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathFrontOuter = pFrontOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBackOuter = pBackOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathFrontInner = pFrontInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBackInner = pBackInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                {/* 1px Stator Ring Contours */}
                <path d={pathFrontOuter} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.85" />
                <path d={pathBackOuter} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 2" />
                <path d={pathFrontInner} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />
                <path d={pathBackInner} fill="none" stroke={accentColor} strokeWidth="0.9" strokeOpacity="0.4" strokeDasharray="3 2" />

                {/* Stator Casing Structural Stringers */}
                {[0, 6, 12, 18, 24, 30, 36, 42].map((idx) => (
                  <line
                    key={`stator-strut-${idx}`}
                    x1={pFrontOuter[idx].x2d}
                    y1={pFrontOuter[idx].y2d}
                    x2={pBackOuter[idx].x2d}
                    y2={pBackOuter[idx].y2d}
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                ))}

                {/* Stator Foot Mount Brackets (Brutalist CAD Foundation) */}
                {[-1, 1].map((side) => {
                  const footPtFront: Point3D = { x: side * (statorOuterR * 0.9), y: statorOuterR * 0.95, z: frontZ };
                  const footPtBack: Point3D = { x: side * (statorOuterR * 0.9), y: statorOuterR * 0.95, z: backZ };
                  const footBaseFront: Point3D = { x: side * (statorOuterR * 1.15), y: statorOuterR * 1.25, z: frontZ };
                  const footBaseBack: Point3D = { x: side * (statorOuterR * 1.15), y: statorOuterR * 1.25, z: backZ };

                  const pF1 = projectPoint(footPtFront, rotX, rotY, rotZ, centerX, centerY, 1200);
                  const pF2 = projectPoint(footPtBack, rotX, rotY, rotZ, centerX, centerY, 1200);
                  const pB1 = projectPoint(footBaseFront, rotX, rotY, rotZ, centerX, centerY, 1200);
                  const pB2 = projectPoint(footBaseBack, rotX, rotY, rotZ, centerX, centerY, 1200);

                  return (
                    <g key={`mount-${side}`}>
                      <line x1={pF1.x2d} y1={pF1.y2d} x2={pB1.x2d} y2={pB1.y2d} stroke={accentColor} strokeWidth="1.2" />
                      <line x1={pF2.x2d} y1={pF2.y2d} x2={pB2.x2d} y2={pB2.y2d} stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" />
                      <line x1={pB1.x2d} y1={pB1.y2d} x2={pB2.x2d} y2={pB2.y2d} stroke={accentColor} strokeWidth="1" />
                    </g>
                  );
                })}
              </>
            );
          })()}
        </g>

        {/* 2. 12 STATOR POLE SHOES & COPPER WINDINGS */}
        <g className="stator-poles">
          {statorPoles.map((pole) => {
            const isPulsing = pole.idx === activePoleIdx || pole.idx === (activePoleIdx + 6) % numPoles;
            const poleStroke = isPulsing ? primaryColor : accentColor;
            const poleOpacity = isPulsing ? 1.0 : 0.65;

            const pf = pole.cornersFront.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pb = pole.cornersBack.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathFront = `M ${pf[0].x2d} ${pf[0].y2d} L ${pf[1].x2d} ${pf[1].y2d} L ${pf[2].x2d} ${pf[2].y2d} L ${pf[3].x2d} ${pf[3].y2d} Z`;

            return (
              <g key={`stator-pole-${pole.idx}`}>
                {/* Pole shoe front face */}
                <path
                  d={pathFront}
                  fill="none"
                  stroke={poleStroke}
                  strokeWidth={isPulsing ? '1.5' : '1'}
                  strokeOpacity={poleOpacity}
                  filter={isPulsing ? 'url(#genCyanGlow)' : undefined}
                />

                {/* Pole longitudinal edge lines */}
                {[0, 1, 2, 3].map((cIdx) => (
                  <line
                    key={`pole-edge-${cIdx}`}
                    x1={pf[cIdx].x2d}
                    y1={pf[cIdx].y2d}
                    x2={pb[cIdx].x2d}
                    y2={pb[cIdx].y2d}
                    stroke={poleStroke}
                    strokeWidth="0.8"
                    strokeOpacity={poleOpacity * 0.7}
                    strokeDasharray={isPulsing ? undefined : '2 2'}
                  />
                ))}

                {/* Copper winding coils around shank */}
                {pole.coils.map((coil, cIdx) => {
                  const projCoil = coil.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
                  const pathCoil = `M ${projCoil[0].x2d} ${projCoil[0].y2d} L ${projCoil[1].x2d} ${projCoil[1].y2d} L ${projCoil[2].x2d} ${projCoil[2].y2d} L ${projCoil[3].x2d} ${projCoil[3].y2d} Z`;
                  return (
                    <path
                      key={`coil-${cIdx}`}
                      d={pathCoil}
                      fill="none"
                      stroke={isPulsing ? primaryColor : '#FFB300'}
                      strokeWidth={isPulsing ? '1.2' : '0.8'}
                      strokeOpacity={isPulsing ? 0.95 : 0.6}
                    />
                  );
                })}

                {/* Pole Tip Node */}
                <circle
                  cx={pf[2].x2d}
                  cy={pf[2].y2d}
                  r={isPulsing ? '2.2' : '1.2'}
                  fill={isPulsing ? primaryColor : accentColor}
                  filter={isPulsing ? 'url(#genCyanGlow)' : undefined}
                />
              </g>
            );
          })}
        </g>

        {/* 3. GLOWING MAGNETIC FLUX VECTOR LINES (Laser Cyan #00E5FF) */}
        <g className="magnetic-flux-lines">
          {statorPoles.map((pole) => {
            const isPulsing = pole.idx === activePoleIdx || pole.idx === (activePoleIdx + 6) % numPoles;
            if (!isPulsing) return null;

            // Find closest rotor pole tip to draw intense magnetic flux arc
            const pStatorTip = projectPoint(pole.tipCenter, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Project flux loop into air gap towards rotor
            const fluxRadius = (statorInnerR + rotorOuterR) / 2;
            const fluxCurveSteps = 8;
            const fluxPts: Point3D[] = [];

            for (let s = -fluxCurveSteps / 2; s <= fluxCurveSteps / 2; s++) {
              const th = pole.angle + (s / fluxCurveSteps) * 0.35;
              const r = fluxRadius + Math.cos((s / (fluxCurveSteps / 2)) * (Math.PI / 2)) * (10 * scale);
              fluxPts.push({
                x: Math.cos(th) * r,
                y: Math.sin(th) * r,
                z: frontZ,
              });
            }

            const projFlux = fluxPts.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathFlux = projFlux.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <g key={`flux-${pole.idx}`}>
                {/* Glowing Magnetic Flux Arc */}
                <path
                  d={pathFlux}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="2"
                  strokeOpacity="0.95"
                  filter="url(#magneticFluxGlow)"
                />
                <path
                  d={pathFlux}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="0.9"
                  strokeOpacity="1"
                />

                {/* Radial Magnetic Field Vectors */}
                <line
                  x1={pStatorTip.x2d}
                  y1={pStatorTip.y2d}
                  x2={projectPoint({ x: Math.cos(pole.angle) * rotorOuterR, y: Math.sin(pole.angle) * rotorOuterR, z: frontZ }, rotX, rotY, rotZ, centerX, centerY, 1200).x2d}
                  y2={projectPoint({ x: Math.cos(pole.angle) * rotorOuterR, y: Math.sin(pole.angle) * rotorOuterR, z: frontZ }, rotX, rotY, rotZ, centerX, centerY, 1200).y2d}
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                  strokeOpacity="0.85"
                />
              </g>
            );
          })}
        </g>

        {/* 4. ROTATING ROTOR CORE & 6 SALIENT POLE PAIRS */}
        <g className="rotor-assembly">
          {/* Rotor Core Cylindrical Body */}
          {(() => {
            const pRotorFront = rotorFrontRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pRotorBack = rotorBackRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathRotorFront = pRotorFront.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathRotorBack = pRotorBack.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathRotorFront} fill="none" stroke={primaryColor} strokeWidth="1.4" strokeOpacity="0.9" filter="url(#genCyanGlow)" />
                <path d={pathRotorBack} fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" />

                {/* Rotor cylinder longitudinal lines */}
                {[0, 6, 12, 18, 24, 30].map((idx) => (
                  <line
                    key={`rotor-rib-${idx}`}
                    x1={pRotorFront[idx].x2d}
                    y1={pRotorFront[idx].y2d}
                    x2={pRotorBack[idx].x2d}
                    y2={pRotorBack[idx].y2d}
                    stroke={primaryColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                ))}
              </>
            );
          })()}

          {/* 6 Salient Rotor Poles */}
          {rotorPoles.map((rp) => {
            const pf = rp.cornersFront.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pb = rp.cornersBack.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathF = `M ${pf[0].x2d} ${pf[0].y2d} L ${pf[1].x2d} ${pf[1].y2d} L ${pf[2].x2d} ${pf[2].y2d} L ${pf[3].x2d} ${pf[3].y2d} Z`;

            return (
              <g key={`rotor-pole-${rp.idx}`}>
                <path d={pathF} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.85" />
                {[0, 1, 2, 3].map((cIdx) => (
                  <line
                    key={`rp-edge-${cIdx}`}
                    x1={pf[cIdx].x2d}
                    y1={pf[cIdx].y2d}
                    x2={pb[cIdx].x2d}
                    y2={pb[cIdx].y2d}
                    stroke={primaryColor}
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* 5. CENTRAL TURBINE DRIVE SHAFT & COUPLING FLANGES */}
        <g className="turbine-shaft">
          {(() => {
            const pShaftFront = shaftFrontRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pShaftBack = shaftBackRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathShaftFront = pShaftFront.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathShaftBack = pShaftBack.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            // Shaft Apex Center Nodes
            const pCenterFront = projectPoint({ x: 0, y: 0, z: shaftFrontZ + 15 * scale }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pCenterBack = projectPoint({ x: 0, y: 0, z: shaftBackZ - 15 * scale }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <>
                <path d={pathShaftFront} fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.9" />
                <path d={pathShaftBack} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" />

                {/* Shaft Generator Longitudinal Edges */}
                {[0, 6, 12, 18].map((idx) => (
                  <line
                    key={`shaft-edge-${idx}`}
                    x1={pShaftFront[idx].x2d}
                    y1={pShaftFront[idx].y2d}
                    x2={pShaftBack[idx].x2d}
                    y2={pShaftBack[idx].y2d}
                    stroke="#FFFFFF"
                    strokeWidth="0.9"
                    strokeOpacity="0.75"
                  />
                ))}

                {/* Center Shaft Alignment Axis */}
                <line
                  x1={pCenterFront.x2d}
                  y1={pCenterFront.y2d}
                  x2={pCenterBack.x2d}
                  y2={pCenterBack.y2d}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  strokeDasharray="5 3"
                  strokeOpacity="0.7"
                />

                {/* Coupling Hub Center Points */}
                <circle cx={pCenterFront.x2d} cy={pCenterFront.y2d} r="2.5" fill="#FFFFFF" filter="url(#genCyanGlow)" />
                <circle cx={pCenterBack.x2d} cy={pCenterBack.y2d} r="2" fill={accentColor} />
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default PowerStationGenerator3D;
