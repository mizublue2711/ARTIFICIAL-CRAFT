import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface LiquidSteelFoundry3DProps extends BasePresetProps {
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

// Rotate point locally around a pivot axis (e.g. horizontal ladle tilt axis across X)
function rotateAroundAxisX(p: Point3D, angle: number, pivotY: number, pivotZ: number): Point3D {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const dy = p.y - pivotY;
  const dz = p.z - pivotZ;
  return {
    x: p.x,
    y: pivotY + dy * cosA - dz * sinA,
    z: pivotZ + dy * sinA + dz * cosA,
  };
}

export const LiquidSteelFoundry3D: React.FC<LiquidSteelFoundry3DProps> = ({
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

  // CAD camera orbit
  const rotX = baseRotX + Math.sin(frame * 0.01) * 0.03;
  const rotY = baseRotY + frame * 0.012;
  const rotZ = Math.cos(frame * 0.008) * 0.02;

  // 1. Ladle Kinematics: Tilting along horizontal axis X
  // Tilts smoothly between 0° and 16°: Math.sin(frame * 0.04) * 15°
  const tiltDeg = Math.max(0, Math.sin(frame * 0.04) * 16);
  const tiltRad = (tiltDeg * Math.PI) / 180;

  // 2. Exploded CAD Separations:
  // - Graphite electrode assembly lifts upward along -Y axis
  // - Ingot mold matrix expands outward on X/Z ground plane
  const electrodeLiftY = -clampedDispersion * 260 * scale;
  const moldSpread = clampedDispersion * 160 * scale;

  // Ladle Geometric Dimensions
  const ladleRadiusTop = 75 * scale;
  const ladleRadiusBot = 55 * scale;
  const ladleHeight = 110 * scale;
  const pivotY = -20 * scale;
  const pivotZ = 0;
  const ladleTopLocalY = pivotY - ladleHeight * 0.45;
  const ladleBotLocalY = pivotY + ladleHeight * 0.55;

  // Support Gantry & Trunnion Geometry
  const trunnionX = 95 * scale;
  const gantryBaseY = 120 * scale;
  const gantryTopY = pivotY - 40 * scale;

  // Generate Ladle wireframe rings (Top rim, belly ring, bottom rim, spout notch)
  const ringSteps = 32;
  const ladleRingsLocal = useMemo(() => {
    const makeRing = (r: number, y: number) => {
      const pts: Point3D[] = [];
      for (let i = 0; i < ringSteps; i++) {
        const th = (i / ringSteps) * Math.PI * 2;
        // Spout protrusion facing -Z
        const isSpout = Math.abs(th - Math.PI * 1.5) < 0.45;
        const radius = isSpout && y <= ladleTopLocalY + 20 * scale ? r * 1.25 : r;
        pts.push({
          x: Math.cos(th) * radius,
          y,
          z: Math.sin(th) * radius,
        });
      }
      return pts;
    };

    return [
      makeRing(ladleRadiusTop, ladleTopLocalY),
      makeRing(ladleRadiusTop * 0.95, ladleTopLocalY + ladleHeight * 0.3),
      makeRing(ladleRadiusBot * 1.1, ladleTopLocalY + ladleHeight * 0.65),
      makeRing(ladleRadiusBot, ladleBotLocalY),
    ];
  }, [ladleRadiusTop, ladleRadiusBot, ladleHeight, ladleTopLocalY, ladleBotLocalY, scale]);

  // Apply Ladle Tilt
  const tiltedLadleRings = useMemo(() => {
    return ladleRingsLocal.map((ring) => ring.map((p) => rotateAroundAxisX(p, tiltRad, pivotY, pivotZ)));
  }, [ladleRingsLocal, tiltRad, pivotY, pivotZ]);

  // Spout Tip Coordinates (Molten stream origin)
  const tiltedSpoutTip = useMemo(() => {
    const spoutTipLocal: Point3D = {
      x: 0,
      y: ladleTopLocalY,
      z: -ladleRadiusTop * 1.3,
    };
    return rotateAroundAxisX(spoutTipLocal, tiltRad, pivotY, pivotZ);
  }, [ladleTopLocalY, ladleRadiusTop, tiltRad, pivotY, pivotZ]);

  // 3. Graphite Electrode Mast Assembly
  const numElectrodes = 3;
  const electrodeLength = 130 * scale;
  const electrodeBaseY = ladleTopLocalY - 35 * scale + electrodeLiftY;

  const electrodes = useMemo(() => {
    const elList = [];
    const offsets = [-28 * scale, 0, 28 * scale];
    for (let i = 0; i < numElectrodes; i++) {
      const x = offsets[i];
      const z = -5 * scale;
      elList.push({
        idx: i,
        topPt: { x, y: electrodeBaseY - electrodeLength, z },
        botPt: { x, y: electrodeBaseY + 20 * scale, z },
      });
    }
    return elList;
  }, [numElectrodes, electrodeBaseY, electrodeLength, scale]);

  // 4. Ingot Mold Matrix (3x2 Matrix on ground rail)
  const moldMatrix = useMemo(() => {
    const molds = [];
    const rows = 2;
    const cols = 3;
    const moldW = 34 * scale;
    const moldD = 34 * scale;
    const moldH = 30 * scale;
    const spacingX = 48 * scale + moldSpread;
    const spacingZ = 48 * scale + moldSpread;
    const groundY = gantryBaseY + 10 * scale;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = (c - (cols - 1) / 2) * spacingX;
        const cz = (r - (rows - 1) / 2) * spacingZ - 40 * scale;

        // 8 corners of mold box
        const corners: Point3D[] = [
          { x: cx - moldW / 2, y: groundY - moldH, z: cz - moldD / 2 },
          { x: cx + moldW / 2, y: groundY - moldH, z: cz - moldD / 2 },
          { x: cx + moldW / 2, y: groundY - moldH, z: cz + moldD / 2 },
          { x: cx - moldW / 2, y: groundY - moldH, z: cz + moldD / 2 },
          { x: cx - (moldW * 0.8) / 2, y: groundY, z: cz - (moldD * 0.8) / 2 },
          { x: cx + (moldW * 0.8) / 2, y: groundY, z: cz - (moldD * 0.8) / 2 },
          { x: cx + (moldW * 0.8) / 2, y: groundY, z: cz + (moldD * 0.8) / 2 },
          { x: cx - (moldW * 0.8) / 2, y: groundY, z: cz + (moldD * 0.8) / 2 },
        ];
        molds.push({ id: `mold-${r}-${c}`, cx, cz, corners, groundY });
      }
    }
    return molds;
  }, [scale, moldSpread, gantryBaseY]);

  // 5. Molten Metal Stream & Spark Trajectory Kinematics
  const isPouring = tiltDeg > 3;
  const streamTargetMold = moldMatrix[1]; // Centered front mold
  const streamTargetY = streamTargetMold ? streamTargetMold.groundY - 30 * scale : gantryBaseY;

  const moltenStream = useMemo(() => {
    if (!isPouring) return [];
    const steps = 14;
    const pts: Point3D[] = [];
    const startX = tiltedSpoutTip.x;
    const startY = tiltedSpoutTip.y;
    const startZ = tiltedSpoutTip.z;

    const targetX = streamTargetMold ? streamTargetMold.cx : 0;
    const targetY = streamTargetY;
    const targetZ = streamTargetMold ? streamTargetMold.cz : -40 * scale;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Parabolic gravity trajectory
      const currX = startX + (targetX - startX) * t;
      const currY = startY + (targetY - startY) * Math.pow(t, 1.4);
      const currZ = startZ + (targetZ - startZ) * t;
      // High-frequency turbulent stream wave
      const turbulence = Math.sin(frame * 0.4 + i * 0.8) * 2.5 * scale;
      pts.push({ x: currX + turbulence, y: currY, z: currZ });
    }
    return pts;
  }, [isPouring, tiltedSpoutTip, streamTargetMold, streamTargetY, frame, scale]);

  // Dynamic Spark Particles
  const sparkParticles = useMemo(() => {
    if (!isPouring) return [];
    const particles = [];
    const count = 12;
    for (let p = 0; p < count; p++) {
      const pPhase = (frame * 0.15 + p * (1 / count)) % 1;
      const angle = (p * (Math.PI * 2)) / count + frame * 0.08;
      const dist = pPhase * 40 * scale;
      const sparkX = (streamTargetMold?.cx ?? 0) + Math.cos(angle) * dist;
      const sparkZ = (streamTargetMold?.cz ?? -40 * scale) + Math.sin(angle) * dist;
      const sparkY = streamTargetY - Math.sin(pPhase * Math.PI) * 28 * scale;
      particles.push({ x: sparkX, y: sparkY, z: sparkZ, opacity: 1 - pPhase });
    }
    return particles;
  }, [isPouring, frame, scale, streamTargetMold, streamTargetY]);

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
          <filter id="foundryCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="foundryIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="moltenStreamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. SUPPORT GANTRY MASTS & TRUNNION BEARINGS */}
        <g className="foundry-gantry">
          {[-1, 1].map((side) => {
            const x = side * trunnionX;
            // 4-post lattice A-frame support per side
            const pBaseFront = projectPoint({ x, y: gantryBaseY, z: -40 * scale }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pBaseBack = projectPoint({ x, y: gantryBaseY, z: 40 * scale }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTopBearing = projectPoint({ x, y: pivotY, z: 0 }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pGantryTop = projectPoint({ x, y: gantryTopY, z: 0 }, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Trunnion axle shaft extending into ladle
            const pAxleInner = projectPoint({ x: side * (ladleRadiusTop * 0.95), y: pivotY, z: 0 }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g key={`gantry-${side}`}>
                {/* A-frame uprights */}
                <line x1={pBaseFront.x2d} y1={pBaseFront.y2d} x2={pTopBearing.x2d} y2={pTopBearing.y2d} stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.85" />
                <line x1={pBaseBack.x2d} y1={pBaseBack.y2d} x2={pTopBearing.x2d} y2={pTopBearing.y2d} stroke={accentColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" />
                <line x1={pTopBearing.x2d} y1={pTopBearing.y2d} x2={pGantryTop.x2d} y2={pGantryTop.y2d} stroke={accentColor} strokeWidth="1.4" strokeOpacity="0.9" />
                {/* Horizontal cross brace */}
                <line x1={pBaseFront.x2d} y1={pBaseFront.y2d} x2={pBaseBack.x2d} y2={pBaseBack.y2d} stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" />
                {/* Trunnion axle pin */}
                <line x1={pTopBearing.x2d} y1={pTopBearing.y2d} x2={pAxleInner.x2d} y2={pAxleInner.y2d} stroke={primaryColor} strokeWidth="1.8" filter="url(#foundryCyanGlow)" />
                {/* Trunnion bearing ring */}
                <circle cx={pTopBearing.x2d} cy={pTopBearing.y2d} r="4" fill="none" stroke={primaryColor} strokeWidth="1.2" />
                <circle cx={pTopBearing.x2d} cy={pTopBearing.y2d} r="1.5" fill="#FFFFFF" />
              </g>
            );
          })}
        </g>

        {/* 2. TILTING CRUCIBLE LADLE (Wireframe Shell & Stiffening Ribs) */}
        <g className="ladle-crucible">
          {tiltedLadleRings.map((ring, rIdx) => {
            const projPts = ring.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathD = projPts.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const isTopRim = rIdx === 0;

            return (
              <g key={`ladle-ring-${rIdx}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={isTopRim ? primaryColor : accentColor}
                  strokeWidth={isTopRim ? '1.5' : '1'}
                  strokeOpacity={isTopRim ? 0.95 : 0.65}
                  filter={isTopRim ? 'url(#foundryCyanGlow)' : undefined}
                />
              </g>
            );
          })}

          {/* Longitudinal Ladle Ribs */}
          {[0, 8, 16, 24].map((ptIdx) => {
            const ribPts = tiltedLadleRings.map((r) => r[ptIdx]);
            const projRib = ribPts.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const ribPath = projRib.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');
            return (
              <path
                key={`ladle-rib-${ptIdx}`}
                d={ribPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.75"
              />
            );
          })}

          {/* Ladle Tilt Indicator Arc */}
          {(() => {
            const pPivot = projectPoint({ x: -trunnionX * 0.95, y: pivotY, z: 0 }, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <circle
                cx={pPivot.x2d}
                cy={pPivot.y2d}
                r={16 * scale}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeOpacity="0.7"
              />
            );
          })()}
        </g>

        {/* 3. GRAPHITE ELECTRODE CLAMP MAST ASSEMBLY */}
        <g className="graphite-electrodes">
          {electrodes.map((el) => {
            const pTop = projectPoint(el.topPt, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pBot = projectPoint(el.botPt, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Electric arc glow at tip when ladle is upright
            const arcPulse = !isPouring ? 0.6 + 0.4 * Math.sin(frame * 0.3 + el.idx * 2) : 0;

            return (
              <g key={`electrode-${el.idx}`}>
                {/* 1px Electrode Cylinder Spine */}
                <line
                  x1={pTop.x2d}
                  y1={pTop.y2d}
                  x2={pBot.x2d}
                  y2={pBot.y2d}
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeOpacity="0.9"
                />
                <line
                  x1={pTop.x2d}
                  y1={pTop.y2d}
                  x2={pBot.x2d}
                  y2={pBot.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />

                {/* Heavy Busbar Clamp Ring */}
                <rect
                  x={pTop.x2d - 6}
                  y={pTop.y2d + 15}
                  width="12"
                  height="6"
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1"
                />

                {/* Electric Arc Spark Discharge at Electrode Tip */}
                {arcPulse > 0.4 && (
                  <>
                    <circle
                      cx={pBot.x2d}
                      cy={pBot.y2d}
                      r={4 * scale * arcPulse}
                      fill={primaryColor}
                      filter="url(#foundryCyanGlow)"
                    />
                    <line
                      x1={pBot.x2d - 8}
                      y1={pBot.y2d}
                      x2={pBot.x2d + 8}
                      y2={pBot.y2d}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  </>
                )}
              </g>
            );
          })}

          {/* Electrode Overhead Gantry Carriage Arm */}
          {(() => {
            const pEl0 = projectPoint(electrodes[0].topPt, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pEl2 = projectPoint(electrodes[2].topPt, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <line
                x1={pEl0.x2d - 10}
                y1={pEl0.y2d}
                x2={pEl2.x2d + 10}
                y2={pEl2.y2d}
                stroke={primaryColor}
                strokeWidth="2"
                strokeOpacity="0.85"
              />
            );
          })()}
        </g>

        {/* 4. INGOT MOLD MATRIX (3x2 CAD Mold Boxes) */}
        <g className="ingot-molds">
          {moldMatrix.map((mold) => {
            const projCorners = mold.corners.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            // Box wireframe edges
            const edges = [
              [0, 1], [1, 2], [2, 3], [3, 0], // Top rim
              [4, 5], [5, 6], [6, 7], [7, 4], // Bottom base
              [0, 4], [1, 5], [2, 6], [3, 7], // Corner uprights
            ];

            const isTarget = mold.id === 'mold-0-1' && isPouring;

            return (
              <g key={mold.id} className="mold-box">
                {edges.map(([i1, i2], eIdx) => (
                  <line
                    key={`me-${mold.id}-${eIdx}`}
                    x1={projCorners[i1].x2d}
                    y1={projCorners[i1].y2d}
                    x2={projCorners[i2].x2d}
                    y2={projCorners[i2].y2d}
                    stroke={isTarget ? primaryColor : accentColor}
                    strokeWidth={isTarget ? '1.4' : '1'}
                    strokeOpacity={isTarget ? 0.95 : 0.6}
                    filter={isTarget ? 'url(#foundryCyanGlow)' : undefined}
                  />
                ))}

                {/* Molten Liquid Fill Level in Target Ingot Mold */}
                {isTarget && (
                  <circle
                    cx={(projCorners[0].x2d + projCorners[2].x2d) / 2}
                    cy={(projCorners[0].y2d + projCorners[2].y2d) / 2}
                    r={8 * scale}
                    fill={primaryColor}
                    filter="url(#moltenStreamGlow)"
                    opacity="0.8"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 5. ANIMATED MOLTEN STEEL STREAM & SPARK PARTICLES */}
        <g className="molten-stream">
          {moltenStream.length > 1 && (() => {
            const projStream = moltenStream.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathStream = projStream.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <>
                {/* Thick Molten Glow Vector */}
                <path
                  d={pathStream}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="3.5"
                  strokeOpacity="0.95"
                  filter="url(#moltenStreamGlow)"
                />
                {/* Intense White Core Vector */}
                <path
                  d={pathStream}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="1"
                />
              </>
            );
          })()}

          {/* Spark Particles */}
          {sparkParticles.map((sp, sIdx) => {
            const pProj = projectPoint({ x: sp.x, y: sp.y, z: sp.z }, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <g key={`spark-${sIdx}`}>
                <circle
                  cx={pProj.x2d}
                  cy={pProj.y2d}
                  r={1.8 * scale}
                  fill="#FFFFFF"
                  opacity={sp.opacity}
                  filter="url(#foundryCyanGlow)"
                />
                <line
                  x1={pProj.x2d - 2}
                  y1={pProj.y2d - 2}
                  x2={pProj.x2d + 2}
                  y2={pProj.y2d + 2}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  opacity={sp.opacity}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default LiquidSteelFoundry3D;
