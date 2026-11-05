import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../types/presets';

export interface PneumaticDataPipeline3DProps extends BasePresetProps {
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

// Generate circular ring in 3D around an axis
function generateCircleRing(
  center: Point3D,
  radius: number,
  normalAxis: 'x' | 'y' | 'z',
  steps = 24
): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const c = Math.cos(angle) * radius;
    const s = Math.sin(angle) * radius;
    if (normalAxis === 'x') {
      points.push({ x: center.x, y: center.y + c, z: center.z + s });
    } else if (normalAxis === 'y') {
      points.push({ x: center.x + c, y: center.y, z: center.z + s });
    } else {
      points.push({ x: center.x + c, y: center.y + s, z: center.z });
    }
  }
  return points;
}

// Pipe segment definition
interface PipeSegment {
  id: string;
  from: Point3D;
  to: Point3D;
  radius: number;
  axis: 'x' | 'y' | 'z';
  flangePositions: number[]; // fraction along length [0..1]
}

export const PneumaticDataPipeline3D: React.FC<PneumaticDataPipeline3DProps> = ({
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
  const rotX = baseRotX + Math.sin(frame * 0.015) * 0.08;
  const rotY = baseRotY + frame * 0.012;
  const rotZ = Math.cos(frame * 0.01) * 0.05;

  // Dispersion expands the valve manifolds and branch conduits outward along X and Y axes
  const explodeX = clampedDispersion * 650;
  const explodeY = clampedDispersion * 650;

  // Core CAD pipe segments layout in 3D
  // 1. Central distribution spine along X-axis
  // 2. High-pressure branch manifolds along Y-axis
  // 3. Vertical riser tubes along Z-axis
  const pipeRadius = 16 * scale;

  const pipes: PipeSegment[] = useMemo(() => [
    // Main horizontal distribution line (X axis)
    {
      id: 'main-spine-left',
      from: { x: -220 * scale - explodeX, y: 0, z: 0 },
      to: { x: -50 * scale - explodeX * 0.3, y: 0, z: 0 },
      radius: pipeRadius,
      axis: 'x',
      flangePositions: [0.15, 0.55, 0.9],
    },
    {
      id: 'main-spine-center',
      from: { x: -50 * scale - explodeX * 0.3, y: 0, z: 0 },
      to: { x: 50 * scale + explodeX * 0.3, y: 0, z: 0 },
      radius: pipeRadius,
      axis: 'x',
      flangePositions: [0.2, 0.8],
    },
    {
      id: 'main-spine-right',
      from: { x: 50 * scale + explodeX * 0.3, y: 0, z: 0 },
      to: { x: 220 * scale + explodeX, y: 0, z: 0 },
      radius: pipeRadius,
      axis: 'x',
      flangePositions: [0.1, 0.45, 0.85],
    },

    // Branch 1: North branch from Left Manifold (Y-axis)
    {
      id: 'branch-left-north',
      from: { x: -50 * scale - explodeX * 0.3, y: 0, z: 0 },
      to: { x: -50 * scale - explodeX * 0.3, y: -160 * scale - explodeY, z: 0 },
      radius: pipeRadius * 0.85,
      axis: 'y',
      flangePositions: [0.25, 0.75],
    },
    // Branch 2: South branch from Left Manifold (Y-axis)
    {
      id: 'branch-left-south',
      from: { x: -50 * scale - explodeX * 0.3, y: 0, z: 0 },
      to: { x: -50 * scale - explodeX * 0.3, y: 160 * scale + explodeY, z: 0 },
      radius: pipeRadius * 0.85,
      axis: 'y',
      flangePositions: [0.3, 0.8],
    },

    // Branch 3: Vertical Riser from Right Manifold (Z-axis)
    {
      id: 'riser-right-up',
      from: { x: 50 * scale + explodeX * 0.3, y: 0, z: 0 },
      to: { x: 50 * scale + explodeX * 0.3, y: 0, z: 140 * scale },
      radius: pipeRadius * 0.85,
      axis: 'z',
      flangePositions: [0.3, 0.7],
    },
    // Branch 4: Vertical Down Riser from Right Manifold (Z-axis)
    {
      id: 'riser-right-down',
      from: { x: 50 * scale + explodeX * 0.3, y: 0, z: 0 },
      to: { x: 50 * scale + explodeX * 0.3, y: 0, z: -140 * scale },
      radius: pipeRadius * 0.85,
      axis: 'z',
      flangePositions: [0.3, 0.7],
    },

    // Cross bypass conduit connecting North branch to Riser Top
    {
      id: 'bypass-north-east',
      from: { x: -50 * scale - explodeX * 0.3, y: -160 * scale - explodeY, z: 0 },
      to: { x: 50 * scale + explodeX * 0.3, y: -160 * scale - explodeY, z: 70 * scale },
      radius: pipeRadius * 0.65,
      axis: 'x',
      flangePositions: [0.5],
    },
  ], [scale, pipeRadius, explodeX, explodeY]);

  // 3-Way Valve Manifold Junction centers
  const valveJunctions: { id: string; center: Point3D; valveAngle: number }[] = useMemo(() => [
    {
      id: 'valve-left',
      center: { x: -50 * scale - explodeX * 0.3, y: 0, z: 0 },
      valveAngle: frame * 0.05,
    },
    {
      id: 'valve-right',
      center: { x: 50 * scale + explodeX * 0.3, y: 0, z: 0 },
      valveAngle: -frame * 0.04,
    },
    {
      id: 'valve-north',
      center: { x: -50 * scale - explodeX * 0.3, y: -160 * scale - explodeY, z: 0 },
      valveAngle: frame * 0.03,
    },
  ], [scale, explodeX, explodeY, frame]);

  // Pressure gauges mounted at manifolds
  const gauges = useMemo(() => [
    {
      center: { x: -130 * scale - explodeX * 0.6, y: 0, z: 24 * scale },
      needleAngle: Math.sin(frame * 0.1) * 0.6 - 0.2, // oscillating pressure
      labelRadius: 18 * scale,
    },
    {
      center: { x: 130 * scale + explodeX * 0.6, y: 0, z: 24 * scale },
      needleAngle: Math.cos(frame * 0.08) * 0.5 + 0.3,
      labelRadius: 18 * scale,
    },
    {
      center: { x: -50 * scale - explodeX * 0.3, y: 80 * scale + explodeY * 0.5, z: 24 * scale },
      needleAngle: Math.sin(frame * 0.15) * 0.7,
      labelRadius: 15 * scale,
    },
  ], [scale, explodeX, explodeY, frame]);

  // Glowing data capsules shooting along the pipes
  // 4 trajectories with continuous looping speed
  const capsules = useMemo(() => {
    const count = 6;
    const items = [];
    for (let i = 0; i < count; i++) {
      const progress = ((frame * 0.02 + i / count) % 1.0);
      let pos: Point3D;
      let tangentAxis: 'x' | 'y' | 'z' = 'x';

      if (i % 3 === 0) {
        // Main spine trajectory
        const startX = -220 * scale - explodeX;
        const endX = 220 * scale + explodeX;
        pos = {
          x: startX + (endX - startX) * progress,
          y: 0,
          z: 0,
        };
        tangentAxis = 'x';
      } else if (i % 3 === 1) {
        // North-to-South branch loop
        const startY = -160 * scale - explodeY;
        const endY = 160 * scale + explodeY;
        pos = {
          x: -50 * scale - explodeX * 0.3,
          y: startY + (endY - startY) * progress,
          z: 0,
        };
        tangentAxis = 'y';
      } else {
        // Vertical riser trajectory
        const startZ = -140 * scale;
        const endZ = 140 * scale;
        pos = {
          x: 50 * scale + explodeX * 0.3,
          y: 0,
          z: startZ + (endZ - startZ) * progress,
        };
        tangentAxis = 'z';
      }

      items.push({ id: `cap-${i}`, pos, progress, tangentAxis });
    }
    return items;
  }, [frame, scale, explodeX, explodeY]);

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
          <filter id="pneumaticCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="pneumaticIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="capsuleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00E5FF" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. PIPE CONDUITS & RING FLANGES */}
        <g className="pipe-network">
          {pipes.map((pipe) => {
            const pFrom = projectPoint(pipe.from, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTo = projectPoint(pipe.to, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Compute pipe walls (parallel CAD bounding lines)
            const r = pipe.radius;
            let offsetA: Point3D, offsetB: Point3D;
            if (pipe.axis === 'x') {
              offsetA = { x: 0, y: r, z: 0 };
              offsetB = { x: 0, y: -r, z: 0 };
            } else if (pipe.axis === 'y') {
              offsetA = { x: r, y: 0, z: 0 };
              offsetB = { x: -r, y: 0, z: 0 };
            } else {
              offsetA = { x: r, y: 0, z: 0 };
              offsetB = { x: -r, y: 0, z: 0 };
            }

            const pFromTop = projectPoint(
              { x: pipe.from.x + offsetA.x, y: pipe.from.y + offsetA.y, z: pipe.from.z + offsetA.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );
            const pToTop = projectPoint(
              { x: pipe.to.x + offsetA.x, y: pipe.to.y + offsetA.y, z: pipe.to.z + offsetA.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );
            const pFromBot = projectPoint(
              { x: pipe.from.x + offsetB.x, y: pipe.from.y + offsetB.y, z: pipe.from.z + offsetB.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );
            const pToBot = projectPoint(
              { x: pipe.to.x + offsetB.x, y: pipe.to.y + offsetB.y, z: pipe.to.z + offsetB.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );

            // Ring Flanges along this pipe segment
            const flangeRings = pipe.flangePositions.map((pos) => {
              const fCenter: Point3D = {
                x: pipe.from.x + (pipe.to.x - pipe.from.x) * pos,
                y: pipe.from.y + (pipe.to.y - pipe.from.y) * pos,
                z: pipe.from.z + (pipe.to.z - pipe.from.z) * pos,
              };
              return generateCircleRing(fCenter, r * 1.45, pipe.axis, 16);
            });

            return (
              <g key={pipe.id} className="pipe-segment">
                {/* Center CAD guideline */}
                <line
                  x1={pFrom.x2d}
                  y1={pFrom.y2d}
                  x2={pTo.x2d}
                  y2={pTo.y2d}
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  strokeDasharray="4 4"
                />

                {/* Glass wall bounds (1px sharp CAD lines) */}
                <line
                  x1={pFromTop.x2d}
                  y1={pFromTop.y2d}
                  x2={pToTop.x2d}
                  y2={pToTop.y2d}
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  filter="url(#pneumaticCyanGlow)"
                />
                <line
                  x1={pFromBot.x2d}
                  y1={pFromBot.y2d}
                  x2={pToBot.x2d}
                  y2={pToBot.y2d}
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  filter="url(#pneumaticCyanGlow)"
                />

                {/* Ring Flanges */}
                {flangeRings.map((ringPoints, fIdx) => {
                  const projRing = ringPoints.map((p) =>
                    projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
                  );
                  const pathD = projRing.reduce(
                    (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
                    ''
                  ) + ' Z';

                  return (
                    <g key={`flange-${fIdx}`}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="1.2"
                        strokeOpacity="0.8"
                        filter="url(#pneumaticIndigoGlow)"
                      />
                      {/* Bolt circle dots on flange */}
                      {projRing.filter((_, idx) => idx % 4 === 0).map((bp, bIdx) => (
                        <circle
                          key={`bolt-${bIdx}`}
                          cx={bp.x2d}
                          cy={bp.y2d}
                          r="1.2"
                          fill="#FFFFFF"
                        />
                      ))}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* 2. 3-WAY VALVE MANIFOLD JUNCTIONS */}
        <g className="valve-junctions">
          {valveJunctions.map((vj) => {
            const pCenter = projectPoint(vj.center, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Generate circular valve body
            const bodyRing = generateCircleRing(vj.center, 22 * scale, 'z', 20);
            const projBody = bodyRing.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathBody = projBody.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Valve Handwheel with 4 spokes
            const wheelRadius = 14 * scale;
            const handwheelSpokes = [0, 1, 2, 3].map((s) => {
              const ang = vj.valveAngle + (s * Math.PI) / 2;
              const spPt: Point3D = {
                x: vj.center.x + Math.cos(ang) * wheelRadius,
                y: vj.center.y + Math.sin(ang) * wheelRadius,
                z: vj.center.z + 18 * scale,
              };
              return projectPoint(spPt, rotX, rotY, rotZ, centerX, centerY, 1200);
            });
            const pWheelHub = projectPoint(
              { x: vj.center.x, y: vj.center.y, z: vj.center.z + 18 * scale },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );

            return (
              <g key={vj.id} className="manifold-valve">
                {/* Cylindrical junction body */}
                <path
                  d={pathBody}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.9"
                  filter="url(#pneumaticIndigoGlow)"
                />

                {/* Handwheel riser post */}
                <line
                  x1={pCenter.x2d}
                  y1={pCenter.y2d}
                  x2={pWheelHub.x2d}
                  y2={pWheelHub.y2d}
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.7"
                />

                {/* 4 Handwheel spokes */}
                {handwheelSpokes.map((spProj, sIdx) => (
                  <line
                    key={`vsp-${sIdx}`}
                    x1={pWheelHub.x2d}
                    y1={pWheelHub.y2d}
                    x2={spProj.x2d}
                    y2={spProj.y2d}
                    stroke={primaryColor}
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                ))}

                {/* Handwheel rim */}
                <circle cx={pWheelHub.x2d} cy={pWheelHub.y2d} r={wheelRadius * 0.7} fill="none" stroke={primaryColor} strokeWidth="1" />
                <circle cx={pWheelHub.x2d} cy={pWheelHub.y2d} r="2.5" fill="#FFFFFF" />
              </g>
            );
          })}
        </g>

        {/* 3. PRESSURE GAUGES */}
        <g className="pressure-gauges">
          {gauges.map((g, gIdx) => {
            const pCenter = projectPoint(g.center, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Dial perimeter ring
            const dialRing = generateCircleRing(g.center, g.labelRadius, 'z', 24);
            const projDial = dialRing.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200)
            );
            const pathDial = projDial.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';

            // Gauge needle tip
            const needleLen = g.labelRadius * 0.75;
            const needleTip: Point3D = {
              x: g.center.x + Math.sin(g.needleAngle) * needleLen,
              y: g.center.y - Math.cos(g.needleAngle) * needleLen,
              z: g.center.z + 1,
            };
            const pNeedleTip = projectPoint(needleTip, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g key={`gauge-${gIdx}`} className="pressure-gauge">
                {/* Circular Dial Bezel */}
                <path
                  d={pathDial}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  filter="url(#pneumaticCyanGlow)"
                />

                {/* Oscillating needle */}
                <line
                  x1={pCenter.x2d}
                  y1={pCenter.y2d}
                  x2={pNeedleTip.x2d}
                  y2={pNeedleTip.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  filter="url(#capsuleGlow)"
                />

                {/* Central needle pivot */}
                <circle cx={pCenter.x2d} cy={pCenter.y2d} r="2" fill={primaryColor} />
              </g>
            );
          })}
        </g>

        {/* 4. GLOWING DATA CAPSULES (CYLINDERS STREAMING THROUGH CONDUITS) */}
        <g className="data-capsules">
          {capsules.map((cap) => {
            const pCenter = projectPoint(cap.pos, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Capsule length along direction of travel
            const halfLen = 14 * scale;
            let offsetFwd: Point3D;
            if (cap.tangentAxis === 'x') {
              offsetFwd = { x: halfLen, y: 0, z: 0 };
            } else if (cap.tangentAxis === 'y') {
              offsetFwd = { x: 0, y: halfLen, z: 0 };
            } else {
              offsetFwd = { x: 0, y: 0, z: halfLen };
            }

            const pHead = projectPoint(
              { x: cap.pos.x + offsetFwd.x, y: cap.pos.y + offsetFwd.y, z: cap.pos.z + offsetFwd.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );
            const pTail = projectPoint(
              { x: cap.pos.x - offsetFwd.x, y: cap.pos.y - offsetFwd.y, z: cap.pos.z - offsetFwd.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY,
              1200
            );

            return (
              <g key={cap.id} className="data-capsule">
                {/* Trailing laser trail */}
                <line
                  x1={pTail.x2d}
                  y1={pTail.y2d}
                  x2={pHead.x2d}
                  y2={pHead.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#capsuleGlow)"
                />
                {/* Capsule head particle */}
                <circle cx={pHead.x2d} cy={pHead.y2d} r="3" fill="#FFFFFF" filter="url(#capsuleGlow)" />
                <circle cx={pCenter.x2d} cy={pCenter.y2d} r="2" fill={primaryColor} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default PneumaticDataPipeline3D;
