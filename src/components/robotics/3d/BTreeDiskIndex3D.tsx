import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface BTreeDiskIndex3DProps extends BasePresetProps {
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

// Generate circular platter teeth / index sector notches in 3D local space
function generatePlatterContour(
  radius: number,
  notchDepth: number,
  numNotches: number,
  centerZ: number,
  rotation = 0
): Point3D[] {
  const points: Point3D[] = [];
  const totalSteps = numNotches * 4;
  for (let i = 0; i < totalSteps; i++) {
    const fraction = i / totalSteps;
    const angle = fraction * Math.PI * 2 + rotation;
    const notchPhase = i % 4;
    // CAD square index notch teeth
    const r = (notchPhase === 1 || notchPhase === 2) ? radius - notchDepth : radius;
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      z: centerZ,
    });
  }
  return points;
}

export const BTreeDiskIndex3D: React.FC<BTreeDiskIndex3DProps> = ({
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

  // CAD orbital rotation
  const rotX = baseRotX + Math.sin(frame * 0.01) * 0.04;
  const rotY = baseRotY + frame * 0.012;
  const rotZ = Math.cos(frame * 0.008) * 0.03;

  // 8 Index Platters Stack Specifications
  const numPlatters = 8;
  const platterRadius = 140 * scale;
  const innerHubRadius = 38 * scale;
  const spindleRadius = 16 * scale;
  const basePlatterSpacing = 24 * scale;

  // Dispersion separates 8 platters vertically along Z axis
  const explodedSpacing = basePlatterSpacing + clampedDispersion * 320;
  const totalStackHeight = (numPlatters - 1) * explodedSpacing;
  const bottomZ = -totalStackHeight / 2;

  // Independent rotation gear ratios for 8 B-Tree level platters
  // Even/odd platters turn in harmonic counter ratios
  const gearRatios = [1.0, -0.75, 1.3, -1.1, 0.85, -1.4, 0.6, -0.95];

  // Active B-Tree query search pin kinematics
  // The data query pin scans through levels 0..7 and drops vertically onto target slot
  const pinCycle = 90; // frames per search traversal
  const currentLevelFloat = ((frame % (pinCycle * numPlatters)) / pinCycle);
  const activeLevel = Math.floor(currentLevelFloat) % numPlatters;
  const levelProgress = currentLevelFloat - Math.floor(currentLevelFloat);
  // Vertical drop bounce easing
  const pinDropZ = bottomZ + (activeLevel + Math.sin(levelProgress * Math.PI) * 0.6) * explodedSpacing;
  const targetAngle = frame * 0.04 + activeLevel * (Math.PI / 4);

  // Pre-calculate 8 platter contours
  const platters = useMemo(() => {
    return Array.from({ length: numPlatters }).map((_, idx) => {
      const zPos = bottomZ + idx * explodedSpacing;
      const angle = frame * 0.02 * gearRatios[idx];
      const outerContour = generatePlatterContour(platterRadius, 8 * scale, 24, zPos, angle);

      // Inner track ring
      const trackPoints: Point3D[] = [];
      const trackSteps = 32;
      for (let s = 0; s < trackSteps; s++) {
        const th = (s / trackSteps) * Math.PI * 2;
        trackPoints.push({
          x: Math.cos(th) * (platterRadius * 0.65),
          y: Math.sin(th) * (platterRadius * 0.65),
          z: zPos,
        });
      }

      // 4 Radial spoke brackets per platter
      const spokeTips: Point3D[] = [0, 1, 2, 3].map((sp) => {
        const spAngle = angle + (sp * Math.PI) / 2;
        return {
          x: Math.cos(spAngle) * (platterRadius - 10 * scale),
          y: Math.sin(spAngle) * (platterRadius - 10 * scale),
          z: zPos,
        };
      });

      return {
        idx,
        zPos,
        angle,
        outerContour,
        trackPoints,
        spokeTips,
      };
    });
  }, [numPlatters, bottomZ, explodedSpacing, frame, gearRatios, platterRadius, scale]);

  // Central Spindle Shaft
  const spindleTopZ = bottomZ + totalStackHeight + 35 * scale;
  const spindleBotZ = bottomZ - 35 * scale;

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
          <filter id="btreeCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="btreeIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="pinBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. CENTRAL SPINDLE SHAFT & BEARING HOUSINGS */}
        <g className="btree-spindle">
          {(() => {
            const steps = 20;
            const topRing: Point3D[] = [];
            const botRing: Point3D[] = [];

            for (let i = 0; i < steps; i++) {
              const th = (i / steps) * Math.PI * 2;
              topRing.push({ x: Math.cos(th) * spindleRadius, y: Math.sin(th) * spindleRadius, z: spindleTopZ });
              botRing.push({ x: Math.cos(th) * spindleRadius, y: Math.sin(th) * spindleRadius, z: spindleBotZ });
            }

            const pTop = topRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pBot = botRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathTop = pTop.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathBot = pBot.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathTop} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.8" />
                <path d={pathBot} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.8" />
                {/* 4 Corner vertical shaft generator lines */}
                {[0, 5, 10, 15].map((idx) => (
                  <line
                    key={`shaft-line-${idx}`}
                    x1={pTop[idx].x2d}
                    y1={pTop[idx].y2d}
                    x2={pBot[idx].x2d}
                    y2={pBot[idx].y2d}
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                    strokeDasharray="4 2"
                  />
                ))}
              </>
            );
          })()}
        </g>

        {/* 2. 8 ROTATING CAD INDEX PLATTERS */}
        <g className="btree-platters">
          {platters.map((platter) => {
            const isSelected = platter.idx === activeLevel;
            const platterColor = isSelected ? primaryColor : (platter.idx % 2 === 0 ? primaryColor : accentColor);
            const platterOpacity = isSelected ? 1.0 : (platter.idx % 2 === 0 ? 0.75 : 0.55);

            // Project outer teeth contour
            const projOuter = platter.outerContour.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathOuter = projOuter.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Project track ring
            const projTrack = platter.trackPoints.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathTrack = projTrack.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Center hub ring
            const hubPoints: Point3D[] = [];
            for (let s = 0; s < 16; s++) {
              const th = (s / 16) * Math.PI * 2;
              hubPoints.push({
                x: Math.cos(th) * innerHubRadius,
                y: Math.sin(th) * innerHubRadius,
                z: platter.zPos,
              });
            }
            const projHub = hubPoints.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathHub = projHub.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Project spokes
            const hubCenterProj = projectPoint(
              { x: 0, y: 0, z: platter.zPos },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );

            return (
              <g key={`platter-${platter.idx}`} className="platter-layer">
                {/* 1px Outer Wireframe Teeth Contour */}
                <path
                  d={pathOuter}
                  fill="none"
                  stroke={platterColor}
                  strokeWidth={isSelected ? '1.5' : '1'}
                  strokeOpacity={platterOpacity}
                  filter={isSelected ? 'url(#btreeCyanGlow)' : undefined}
                />

                {/* Inner Track Ring */}
                <path
                  d={pathTrack}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeOpacity="0.45"
                  strokeDasharray="3 3"
                />

                {/* Center Hub Ring */}
                <path
                  d={pathHub}
                  fill="none"
                  stroke={platterColor}
                  strokeWidth="1"
                  strokeOpacity="0.65"
                />

                {/* Radial Spoke Ribs */}
                {platter.spokeTips.map((tip, sIdx) => {
                  const pTip = projectPoint(tip, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <line
                      key={`spoke-${sIdx}`}
                      x1={hubCenterProj.x2d}
                      y1={hubCenterProj.y2d}
                      x2={pTip.x2d}
                      y2={pTip.y2d}
                      stroke={platterColor}
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                  );
                })}

                {/* Index Teeth Pointer Nodes */}
                {projOuter.filter((_, idx) => idx % 4 === 0).map((pt, nIdx) => (
                  <circle
                    key={`node-${nIdx}`}
                    cx={pt.x2d}
                    cy={pt.y2d}
                    r={isSelected ? '1.8' : '1.2'}
                    fill={platterColor}
                    opacity={isSelected ? 0.9 : 0.6}
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* 3. GLOWING CYAN DATA QUERY POINTERS & OPTICAL READ/WRITE HEAD */}
        <g className="data-query-head">
          {(() => {
            // Position query pin head along radial arm at active platter level
            const headDist = platterRadius * 1.15;
            const pinX = Math.cos(targetAngle) * headDist;
            const pinY = Math.sin(targetAngle) * headDist;
            const pinTipX = Math.cos(targetAngle) * (platterRadius * 0.85);
            const pinTipY = Math.sin(targetAngle) * (platterRadius * 0.85);

            const pPinBase = projectPoint({ x: pinX, y: pinY, z: spindleTopZ }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pPinCarriage = projectPoint({ x: pinX, y: pinY, z: pinDropZ }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pPinTip = projectPoint({ x: pinTipX, y: pinTipY, z: pinDropZ }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pPinTarget = projectPoint({ x: pinTipX, y: pinTipY, z: pinDropZ }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <>
                {/* Vertical Actuator Guide Rail */}
                <line
                  x1={pPinBase.x2d}
                  y1={pPinBase.y2d}
                  x2={projectPoint({ x: pinX, y: pinY, z: spindleBotZ }, rotX, rotY, rotZ, centerX, centerY, 1200).x2d}
                  y2={projectPoint({ x: pinX, y: pinY, z: spindleBotZ }, rotX, rotY, rotZ, centerX, centerY, 1200).y2d}
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                  strokeDasharray="4 2"
                />

                {/* Horizontal Read Head Arm reaching into platter */}
                <line
                  x1={pPinCarriage.x2d}
                  y1={pPinCarriage.y2d}
                  x2={pPinTip.x2d}
                  y2={pPinTip.y2d}
                  stroke={primaryColor}
                  strokeWidth="1.6"
                  strokeOpacity="0.95"
                  filter="url(#pinBeamGlow)"
                />

                {/* Actuator Carriage Node on Vertical Rail */}
                <rect
                  x={pPinCarriage.x2d - 4}
                  y={pPinCarriage.y2d - 4}
                  width="8"
                  height="8"
                  fill="#000000"
                  stroke={primaryColor}
                  strokeWidth="1"
                />
                <circle cx={pPinCarriage.x2d} cy={pPinCarriage.y2d} r="2" fill="#FFFFFF" />

                {/* Focused Laser Query Read Node dropping on active slot */}
                <circle
                  cx={pPinTarget.x2d}
                  cy={pPinTarget.y2d}
                  r="4"
                  fill={primaryColor}
                  filter="url(#pinBeamGlow)"
                />
                <circle
                  cx={pPinTarget.x2d}
                  cy={pPinTarget.y2d}
                  r="2"
                  fill="#FFFFFF"
                />

                {/* Vertical Optical Intercept Beam onto Platter Slot */}
                <line
                  x1={pPinTarget.x2d}
                  y1={pPinTarget.y2d - 12}
                  x2={pPinTarget.x2d}
                  y2={pPinTarget.y2d + 12}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeOpacity="0.9"
                />
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default BTreeDiskIndex3D;
