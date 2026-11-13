import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface MailRopewayTcp3DProps extends BasePresetProps {
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

// Generate circular pulley wheel profile with spoke teeth
function generatePulleyWheel(
  center: Point3D,
  outerRadius: number,
  rimRadius: number,
  rotation = 0,
  steps = 24
): { rim: Point3D[]; outer: Point3D[]; spokes: { from: Point3D; to: Point3D }[] } {
  const rim: Point3D[] = [];
  const outer: Point3D[] = [];
  const spokes: { from: Point3D; to: Point3D }[] = [];

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2 + rotation;
    rim.push({
      x: center.x,
      y: center.y + Math.cos(angle) * rimRadius,
      z: center.z + Math.sin(angle) * rimRadius,
    });
    outer.push({
      x: center.x,
      y: center.y + Math.cos(angle) * outerRadius,
      z: center.z + Math.sin(angle) * outerRadius,
    });
  }

  // 4 spokes per pulley
  for (let s = 0; s < 4; s++) {
    const spAngle = (s * Math.PI) / 2 + rotation;
    spokes.push({
      from: { x: center.x, y: center.y, z: center.z },
      to: {
        x: center.x,
        y: center.y + Math.cos(spAngle) * rimRadius,
        z: center.z + Math.sin(spAngle) * rimRadius,
      },
    });
  }

  return { rim, outer, spokes };
}

// Generate lattice truss pylon geometry points
function generateLatticePylon(
  baseX: number,
  topX: number,
  baseWidth: number,
  topWidth: number,
  baseDepth: number,
  topDepth: number,
  baseZ: number,
  topZ: number,
  levels = 4
): { struts: { from: Point3D; to: Point3D }[]; crossBraces: { from: Point3D; to: Point3D }[] } {
  const struts: { from: Point3D; to: Point3D }[] = [];
  const crossBraces: { from: Point3D; to: Point3D }[] = [];

  const rings: Point3D[][] = [];

  for (let lvl = 0; lvl <= levels; lvl++) {
    const t = lvl / levels;
    const x = baseX + (topX - baseX) * t;
    const z = baseZ + (topZ - baseZ) * t;
    const w = (baseWidth + (topWidth - baseWidth) * t) / 2;
    const d = (baseDepth + (topDepth - baseDepth) * t) / 2;

    const ring: Point3D[] = [
      { x: x - d, y: -w, z },
      { x: x + d, y: -w, z },
      { x: x + d, y: w, z },
      { x: x - d, y: w, z },
    ];
    rings.push(ring);
  }

  // Ring perimeters & vertical corner struts & cross braces
  for (let lvl = 0; lvl <= levels; lvl++) {
    const cur = rings[lvl];
    for (let c = 0; c < 4; c++) {
      const nextC = (c + 1) % 4;
      struts.push({ from: cur[c], to: cur[nextC] });
    }

    if (lvl < levels) {
      const nextRing = rings[lvl + 1];
      for (let c = 0; c < 4; c++) {
        // Vertical uprights
        struts.push({ from: cur[c], to: nextRing[c] });
        // X cross braces
        const nextC = (c + 1) % 4;
        crossBraces.push({ from: cur[c], to: nextRing[nextC] });
        crossBraces.push({ from: cur[nextC], to: nextRing[c] });
      }
    }
  }

  return { struts, crossBraces };
}

export const MailRopewayTcp3D: React.FC<MailRopewayTcp3DProps> = ({
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
  const rotX = baseRotX + Math.sin(frame * 0.012) * 0.04;
  const rotY = baseRotY + frame * 0.01;
  const rotZ = Math.cos(frame * 0.009) * 0.03;

  // Dispersion expands the distance between Pylon A (Client) and Pylon B (Server)
  // along the X axis, and separates the dual pulley sheaves
  const baseSpan = 280 * scale;
  const explodedSpan = baseSpan + clampedDispersion * 450;
  const pylonAx = -explodedSpan / 2;
  const pylonBx = explodedSpan / 2;

  const pylonHeight = 160 * scale;
  const pylonBaseZ = -70 * scale;
  const pylonTopZ = pylonBaseZ + pylonHeight;

  // Pulley sheaves wheel radius & offset
  const pulleyRadius = 26 * scale;
  const pulleyOffset = 18 * scale + clampedDispersion * 60;
  const pulleyRotA = frame * 0.08;
  const pulleyRotB = -frame * 0.08;

  // Generate Pylon A and Pylon B 3D lattice frameworks
  const pylonA = useMemo(
    () => generateLatticePylon(pylonAx, pylonAx, 55 * scale, 24 * scale, 55 * scale, 24 * scale, pylonBaseZ, pylonTopZ, 4),
    [pylonAx, scale, pylonBaseZ, pylonTopZ]
  );
  const pylonB = useMemo(
    () => generateLatticePylon(pylonBx, pylonBx, 55 * scale, 24 * scale, 55 * scale, 24 * scale, pylonBaseZ, pylonTopZ, 4),
    [pylonBx, scale, pylonBaseZ, pylonTopZ]
  );

  // Pulley Sheave Centers (Dual upper & lower tension cables)
  const pylonAPulleyTop: Point3D = { x: pylonAx, y: -pulleyOffset, z: pylonTopZ };
  const pylonAPulleyBot: Point3D = { x: pylonAx, y: pulleyOffset, z: pylonTopZ - 30 * scale };
  const pylonBPulleyTop: Point3D = { x: pylonBx, y: -pulleyOffset, z: pylonTopZ };
  const pylonBPulleyBot: Point3D = { x: pylonBx, y: pulleyOffset, z: pylonTopZ - 30 * scale };

  const pulleyA1 = useMemo(() => generatePulleyWheel(pylonAPulleyTop, pulleyRadius, pulleyRadius * 0.75, pulleyRotA), [pylonAPulleyTop, pulleyRadius, pulleyRotA]);
  const pulleyA2 = useMemo(() => generatePulleyWheel(pylonAPulleyBot, pulleyRadius, pulleyRadius * 0.75, pulleyRotA * 1.1), [pylonAPulleyBot, pulleyRadius, pulleyRotA]);
  const pulleyB1 = useMemo(() => generatePulleyWheel(pylonBPulleyTop, pulleyRadius, pulleyRadius * 0.75, pulleyRotB), [pylonBPulleyTop, pulleyRadius, pulleyRotB]);
  const pulleyB2 = useMemo(() => generatePulleyWheel(pylonBPulleyBot, pulleyRadius, pulleyRadius * 0.75, pulleyRotB * 1.1), [pylonBPulleyBot, pulleyRadius, pulleyRotB]);

  // Continuous 1px Tension Cable Lines with Catenary Sag
  const cableSteps = 24;
  const upperCable: Point3D[] = [];
  const lowerCable: Point3D[] = [];
  const catenarySag = 16 * scale;

  for (let i = 0; i <= cableSteps; i++) {
    const t = i / cableSteps;
    const x = pylonAx + (pylonBx - pylonAx) * t;
    const sag = Math.sin(t * Math.PI) * catenarySag;

    // Upper cable vector
    upperCable.push({
      x,
      y: -pulleyOffset,
      z: pylonTopZ - sag,
    });

    // Lower return cable vector
    lowerCable.push({
      x,
      y: pulleyOffset,
      z: pylonTopZ - 30 * scale - sag * 0.8,
    });
  }

  // 3 Carrier Shuttles representing TCP Handshake States:
  // 1. SYN (Client -> Server along upper cable)
  // 2. SYN-ACK (Server -> Client along lower cable)
  // 3. ACK (Client -> Server following SYN)
  const handshakePeriod = 180; // frames per complete handshake cycle
  const cycleFrame = frame % handshakePeriod;

  // Shuttle 1: SYN (travels t: 0.0 -> 0.9 between frames 0..60)
  const synProgress = Math.min(1.0, Math.max(0.0, cycleFrame / 60));
  const synActive = cycleFrame < 70;
  const synX = pylonAx + (pylonBx - pylonAx) * synProgress;
  const synSag = Math.sin(synProgress * Math.PI) * catenarySag;
  const synPos: Point3D = { x: synX, y: -pulleyOffset, z: pylonTopZ - synSag };

  // Shuttle 2: SYN-ACK (travels return t: 1.0 -> 0.0 between frames 60..120)
  const synAckProgress = Math.min(1.0, Math.max(0.0, (cycleFrame - 60) / 60));
  const synAckActive = cycleFrame >= 55 && cycleFrame < 130;
  const synAckX = pylonBx - (pylonBx - pylonAx) * synAckProgress;
  const synAckSag = Math.sin(synAckProgress * Math.PI) * (catenarySag * 0.8);
  const synAckPos: Point3D = { x: synAckX, y: pulleyOffset, z: pylonTopZ - 30 * scale - synAckSag };

  // Shuttle 3: ACK (travels t: 0.0 -> 0.9 between frames 120..180)
  const ackProgress = Math.min(1.0, Math.max(0.0, (cycleFrame - 120) / 60));
  const ackActive = cycleFrame >= 115;
  const ackX = pylonAx + (pylonBx - pylonAx) * ackProgress;
  const ackSag = Math.sin(ackProgress * Math.PI) * catenarySag;
  const ackPos: Point3D = { x: ackX, y: -pulleyOffset, z: pylonTopZ - ackSag };

  const shuttles = [
    { id: 'SYN', pos: synPos, active: synActive, color: primaryColor, label: 'SYN' },
    { id: 'SYN-ACK', pos: synAckPos, active: synAckActive, color: accentColor, label: 'SYN-ACK' },
    { id: 'ACK', pos: ackPos, active: ackActive, color: primaryColor, label: 'ACK' },
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
          <filter id="tcpCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="tcpIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="shuttleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. LATTICE TRUSS PYLONS A & B (CAD 1px wireframe) */}
        <g className="tcp-pylons">
          {/* Pylon A (Client) */}
          {pylonA.struts.map((st, idx) => {
            const pFrom = projectPoint(st.from, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTo = projectPoint(st.to, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <line
                key={`pa-st-${idx}`}
                x1={pFrom.x2d}
                y1={pFrom.y2d}
                x2={pTo.x2d}
                y2={pTo.y2d}
                stroke={accentColor}
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
            );
          })}
          {pylonA.crossBraces.map((cb, idx) => {
            const pFrom = projectPoint(cb.from, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTo = projectPoint(cb.to, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <line
                key={`pa-cb-${idx}`}
                x1={pFrom.x2d}
                y1={pFrom.y2d}
                x2={pTo.x2d}
                y2={pTo.y2d}
                stroke={accentColor}
                strokeWidth="0.8"
                strokeOpacity="0.45"
                strokeDasharray="3 2"
              />
            );
          })}

          {/* Pylon B (Server) */}
          {pylonB.struts.map((st, idx) => {
            const pFrom = projectPoint(st.from, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTo = projectPoint(st.to, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <line
                key={`pb-st-${idx}`}
                x1={pFrom.x2d}
                y1={pFrom.y2d}
                x2={pTo.x2d}
                y2={pTo.y2d}
                stroke={accentColor}
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
            );
          })}
          {pylonB.crossBraces.map((cb, idx) => {
            const pFrom = projectPoint(cb.from, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pTo = projectPoint(cb.to, rotX, rotY, rotZ, centerX, centerY, 1200);
            return (
              <line
                key={`pb-cb-${idx}`}
                x1={pFrom.x2d}
                y1={pFrom.y2d}
                x2={pTo.x2d}
                y2={pTo.y2d}
                stroke={accentColor}
                strokeWidth="0.8"
                strokeOpacity="0.45"
                strokeDasharray="3 2"
              />
            );
          })}
        </g>

        {/* 2. ROTATING PULLEY WHEEL SHEAVES */}
        <g className="tcp-pulleys">
          {[pulleyA1, pulleyA2, pulleyB1, pulleyB2].map((pulley, pIdx) => {
            const projRim = pulley.rim.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const projOuter = pulley.outer.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathRim = projRim.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathOuter = projOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <g key={`pulley-${pIdx}`}>
                <path d={pathOuter} fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.75" />
                <path d={pathRim} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.85" filter="url(#tcpCyanGlow)" />
                {pulley.spokes.map((sp, sIdx) => {
                  const pFrom = projectPoint(sp.from, rotX, rotY, rotZ, centerX, centerY, 1200);
                  const pTo = projectPoint(sp.to, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <line
                      key={`sp-${pIdx}-${sIdx}`}
                      x1={pFrom.x2d}
                      y1={pFrom.y2d}
                      x2={pTo.x2d}
                      y2={pTo.y2d}
                      stroke={primaryColor}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* 3. CONTINUOUS 1PX TENSION CABLES (Catenary Sag Vectors) */}
        <g className="tcp-cables">
          {(() => {
            const projUpper = upperCable.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const projLower = lowerCable.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            const pathUpper = projUpper.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');
            const pathLower = projLower.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <>
                <path d={pathUpper} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.9" filter="url(#tcpCyanGlow)" />
                <path d={pathLower} fill="none" stroke={accentColor} strokeWidth="1" strokeOpacity="0.7" strokeDasharray="5 2" />
                {/* Cable Cable Clamp Cable Markers */}
                {projUpper.filter((_, idx) => idx % 6 === 0).map((pt, cIdx) => (
                  <circle key={`cc-${cIdx}`} cx={pt.x2d} cy={pt.y2d} r="1.5" fill={primaryColor} />
                ))}
              </>
            );
          })()}
        </g>

        {/* 4. 3 CARRIER SHUTTLES (SYN, SYN-ACK, ACK) */}
        <g className="tcp-shuttles">
          {shuttles.map((shuttle) => {
            if (!shuttle.active) return null;
            const pCore = projectPoint(shuttle.pos, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Shuttle 3D wireframe bracket geometry (inverted triangle hanger + data cube box)
            const hangerTop: Point3D = { x: shuttle.pos.x, y: shuttle.pos.y, z: shuttle.pos.z + 4 * scale };
            const boxCenter: Point3D = { x: shuttle.pos.x, y: shuttle.pos.y, z: shuttle.pos.z - 14 * scale };

            const boxSize = 8 * scale;
            const boxCorners: Point3D[] = [
              { x: boxCenter.x - boxSize, y: boxCenter.y - boxSize, z: boxCenter.z + boxSize },
              { x: boxCenter.x + boxSize, y: boxCenter.y - boxSize, z: boxCenter.z + boxSize },
              { x: boxCenter.x + boxSize, y: boxCenter.y + boxSize, z: boxCenter.z + boxSize },
              { x: boxCenter.x - boxSize, y: boxCenter.y + boxSize, z: boxCenter.z + boxSize },
              { x: boxCenter.x - boxSize, y: boxCenter.y - boxSize, z: boxCenter.z - boxSize },
              { x: boxCenter.x + boxSize, y: boxCenter.y - boxSize, z: boxCenter.z - boxSize },
              { x: boxCenter.x + boxSize, y: boxCenter.y + boxSize, z: boxCenter.z - boxSize },
              { x: boxCenter.x - boxSize, y: boxCenter.y + boxSize, z: boxCenter.z - boxSize },
            ];

            const pTopHanger = projectPoint(hangerTop, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pCorners = boxCorners.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            // Box wireframe edges
            const edges = [
              [0, 1], [1, 2], [2, 3], [3, 0],
              [4, 5], [5, 6], [6, 7], [7, 4],
              [0, 4], [1, 5], [2, 6], [3, 7],
            ];

            return (
              <g key={shuttle.id} className="shuttle-unit">
                {/* Hanger Cable Trolley Wheel on Wire */}
                <circle cx={pTopHanger.x2d} cy={pTopHanger.y2d} r="3" fill="#FFFFFF" stroke={shuttle.color} strokeWidth="1" />
                {/* Suspension hanger lines */}
                <line x1={pTopHanger.x2d} y1={pTopHanger.y2d} x2={pCorners[0].x2d} y2={pCorners[0].y2d} stroke={shuttle.color} strokeWidth="1" />
                <line x1={pTopHanger.x2d} y1={pTopHanger.y2d} x2={pCorners[1].x2d} y2={pCorners[1].y2d} stroke={shuttle.color} strokeWidth="1" />

                {/* 1px Wireframe Data Shuttle Box */}
                {edges.map(([fromIdx, toIdx], eIdx) => (
                  <line
                    key={`edge-${eIdx}`}
                    x1={pCorners[fromIdx].x2d}
                    y1={pCorners[fromIdx].y2d}
                    x2={pCorners[toIdx].x2d}
                    y2={pCorners[toIdx].y2d}
                    stroke={shuttle.color}
                    strokeWidth="1.2"
                    filter="url(#shuttleGlow)"
                  />
                ))}

                {/* Glowing Laser Payload Core */}
                <circle cx={pCore.x2d} cy={pCore.y2d + 12} r="3" fill="#FFFFFF" filter="url(#shuttleGlow)" />

                {/* Dynamic Data Packet Pulse Sparks */}
                <line
                  x1={pCore.x2d - 8}
                  y1={pCore.y2d + 12}
                  x2={pCore.x2d + 8}
                  y2={pCore.y2d + 12}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  strokeOpacity="0.8"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default MailRopewayTcp3D;
