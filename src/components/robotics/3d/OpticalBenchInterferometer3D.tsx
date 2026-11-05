import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface OpticalBenchInterferometer3DProps extends BasePresetProps {
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

// Helper to make 8 corners of an axis-aligned 3D box
function makeBox(cx: number, cy: number, cz: number, w: number, h: number, d: number): Point3D[] {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;
  return [
    { x: cx - hw, y: cy - hh, z: cz - hd },
    { x: cx + hw, y: cy - hh, z: cz - hd },
    { x: cx + hw, y: cy + hh, z: cz - hd },
    { x: cx - hw, y: cy + hh, z: cz - hd },
    { x: cx - hw, y: cy - hh, z: cz + hd },
    { x: cx + hw, y: cy - hh, z: cz + hd },
    { x: cx + hw, y: cy + hh, z: cz + hd },
    { x: cx - hw, y: cy + hh, z: cz + hd },
  ];
}

const BOX_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0], // front face
  [4, 5], [5, 6], [6, 7], [7, 4], // back face
  [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
];

export const OpticalBenchInterferometer3D: React.FC<OpticalBenchInterferometer3DProps> = ({
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

  // Sub-micron oscillation of Mirror 1 (moving mirror): Math.sin(frame * 0.1)
  const mirror1Oscillation = Math.sin(frame * 0.1) * 4 * scale;

  // Dispersion slides mirror mounts outward along optical bench rails
  const railSlideDisplacement = clampedDispersion * 240 * scale;

  // Optical Axis Center Height
  const opticalY = -15 * scale;
  const railBaseY = 45 * scale;

  // Key Component Positions:
  // Central Beam Splitter Cube Prism at (0, opticalY, 0)
  const splitterCenter: Point3D = { x: 0, y: opticalY, z: 0 };
  const splitterSize = 36 * scale;

  // 1. Laser Diode Emitter on -X axis
  const laserEmitterX = -170 * scale - railSlideDisplacement * 0.5;
  const laserEmitterPos: Point3D = { x: laserEmitterX, y: opticalY, z: 0 };

  // 2. Fixed Mirror 2 on +Z axis
  const mirror2Z = 130 * scale + railSlideDisplacement;
  const mirror2Pos: Point3D = { x: 0, y: opticalY, z: mirror2Z };

  // 3. Moving Oscillating Mirror 1 on +X axis
  const mirror1X = 130 * scale + railSlideDisplacement + mirror1Oscillation;
  const mirror1Pos: Point3D = { x: mirror1X, y: opticalY, z: 0 };

  // 4. Photodetector Screen on -Z axis
  const detectorZ = -130 * scale - railSlideDisplacement * 0.8;
  const detectorPos: Point3D = { x: 0, y: opticalY, z: detectorZ };

  // Optical Bench Cross Rail Profile (Heavy extruded CAD aluminum profile with T-slots)
  const railLengthX = 420 * scale + railSlideDisplacement * 2;
  const railLengthZ = 360 * scale + railSlideDisplacement * 2;
  const railWidth = 32 * scale;
  const railHeight = 16 * scale;

  const railBoxX = useMemo(
    () => makeBox(0, railBaseY, 0, railLengthX, railHeight, railWidth),
    [railBaseY, railLengthX, railHeight, railWidth]
  );
  const railBoxZ = useMemo(
    () => makeBox(0, railBaseY, 0, railWidth, railHeight, railLengthZ),
    [railBaseY, railWidth, railHeight, railLengthZ]
  );

  // Optical Mount Carriages
  const mountLaser = useMemo(() => makeBox(laserEmitterX + 15 * scale, railBaseY - 14 * scale, 0, 38 * scale, 28 * scale, 34 * scale), [laserEmitterX, railBaseY, scale]);
  const mountSplitter = useMemo(() => makeBox(0, railBaseY - 12 * scale, 0, 42 * scale, 24 * scale, 42 * scale), [railBaseY, scale]);
  const mountMirror1 = useMemo(() => makeBox(mirror1X, railBaseY - 14 * scale, 0, 30 * scale, 28 * scale, 34 * scale), [mirror1X, railBaseY, scale]);
  const mountMirror2 = useMemo(() => makeBox(0, railBaseY - 14 * scale, mirror2Z, 34 * scale, 28 * scale, 30 * scale), [mirror2Z, railBaseY, scale]);
  const mountDetector = useMemo(() => makeBox(0, railBaseY - 14 * scale, detectorZ, 38 * scale, 28 * scale, 24 * scale), [detectorZ, railBaseY, scale]);

  // Beam Splitter Cube & Diagonal Semi-Reflective Coating Plane
  const splitterBox = useMemo(
    () => makeBox(0, opticalY, 0, splitterSize, splitterSize, splitterSize),
    [opticalY, splitterSize]
  );

  // Diagonal 45-degree beam splitter mirror facet (from corner to corner)
  const splitterDiagonal: Point3D[] = useMemo(() => {
    const hs = splitterSize / 2;
    return [
      { x: -hs, y: opticalY - hs, z: -hs },
      { x: hs, y: opticalY - hs, z: hs },
      { x: hs, y: opticalY + hs, z: hs },
      { x: -hs, y: opticalY + hs, z: -hs },
    ];
  }, [splitterSize, opticalY]);

  // Mirror 1 Face (Circular reflector with micrometer thumbscrews)
  const mirror1Radius = 18 * scale;
  const mirror1Face = useMemo(() => {
    const pts: Point3D[] = [];
    const steps = 24;
    for (let i = 0; i < steps; i++) {
      const th = (i / steps) * Math.PI * 2;
      pts.push({
        x: mirror1X,
        y: opticalY + Math.cos(th) * mirror1Radius,
        z: Math.sin(th) * mirror1Radius,
      });
    }
    return pts;
  }, [mirror1X, opticalY, mirror1Radius]);

  // Mirror 2 Face (Facing -Z)
  const mirror2Radius = 18 * scale;
  const mirror2Face = useMemo(() => {
    const pts: Point3D[] = [];
    const steps = 24;
    for (let i = 0; i < steps; i++) {
      const th = (i / steps) * Math.PI * 2;
      pts.push({
        x: Math.cos(th) * mirror2Radius,
        y: opticalY + Math.sin(th) * mirror2Radius,
        z: mirror2Z,
      });
    }
    return pts;
  }, [mirror2Z, opticalY, mirror2Radius]);

  // Photodetector Fringe Screen (Front face towards +Z)
  const screenW = 44 * scale;
  const screenH = 44 * scale;
  const detectorScreenFace = useMemo(() => {
    const hw = screenW / 2;
    const hh = screenH / 2;
    return [
      { x: -hw, y: opticalY - hh, z: detectorZ },
      { x: hw, y: opticalY - hh, z: detectorZ },
      { x: hw, y: opticalY + hh, z: detectorZ },
      { x: -hw, y: opticalY + hh, z: detectorZ },
    ];
  }, [screenW, screenH, opticalY, detectorZ]);

  // Dynamic Interference Fringe Wave Grid (modulated by sub-micron oscillation: Math.sin(frame * 0.1))
  const numFringes = 9;
  const fringeGrid = useMemo(() => {
    const lines = [];
    const fringePhase = frame * 0.1;
    const hw = screenW / 2;
    const hh = screenH / 2;

    for (let f = 0; f < numFringes; f++) {
      const norm = (f / (numFringes - 1)) * 2 - 1; // -1 to 1
      const yOffset = norm * (hh * 0.85);
      // Wave distortion modulated by oscillation
      const waveAmplitude = Math.sin(fringePhase + f * 0.8) * (2.8 * scale);

      lines.push({
        p1: { x: -hw * 0.85, y: opticalY + yOffset + waveAmplitude, z: detectorZ },
        p2: { x: hw * 0.85, y: opticalY + yOffset - waveAmplitude, z: detectorZ },
        intensity: 0.5 + 0.5 * Math.cos(fringePhase + f * 1.1),
      });
    }
    return lines;
  }, [numFringes, frame, screenW, screenH, scale, opticalY, detectorZ]);

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
          <filter id="laserCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="interferoIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
          <filter id="intenseLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. OPTICAL BENCH HEAVY CROSS-RAILS & T-SLOTS (Brutalist CAD Base) */}
        <g className="bench-rails">
          {/* Rail X */}
          {(() => {
            const proj = railBoxX.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            return (
              <g>
                {BOX_EDGES.map(([i1, i2], eIdx) => (
                  <line
                    key={`rx-e-${eIdx}`}
                    x1={proj[i1].x2d}
                    y1={proj[i1].y2d}
                    x2={proj[i2].x2d}
                    y2={proj[i2].y2d}
                    stroke={accentColor}
                    strokeWidth="1.2"
                    strokeOpacity="0.75"
                  />
                ))}
              </g>
            );
          })()}

          {/* Rail Z */}
          {(() => {
            const proj = railBoxZ.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            return (
              <g>
                {BOX_EDGES.map(([i1, i2], eIdx) => (
                  <line
                    key={`rz-e-${eIdx}`}
                    x1={proj[i1].x2d}
                    y1={proj[i1].y2d}
                    x2={proj[i2].x2d}
                    y2={proj[i2].y2d}
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeOpacity="0.65"
                    strokeDasharray="4 2"
                  />
                ))}
              </g>
            );
          })()}

          {/* Precision mm Rail Scale Tick Marks along X */}
          {[-120, -80, -40, 40, 80, 120].map((tx) => {
            const p1 = projectPoint({ x: tx * scale, y: railBaseY - railHeight / 2, z: railWidth / 2 }, rotX, rotY, rotZ, centerX, centerY, 1200);
            const p2 = projectPoint({ x: tx * scale, y: railBaseY - railHeight / 2 - 4 * scale, z: railWidth / 2 }, rotX, rotY, rotZ, centerX, centerY, 1200);
            return <line key={`tick-${tx}`} x1={p1.x2d} y1={p1.y2d} x2={p2.x2d} y2={p2.y2d} stroke={primaryColor} strokeWidth="1" strokeOpacity="0.6" />;
          })}
        </g>

        {/* 2. OPTICAL MOUNT CARRIAGES (Precision Post Holders) */}
        <g className="mount-carriages">
          {[mountLaser, mountSplitter, mountMirror1, mountMirror2, mountDetector].map((mBox, bIdx) => {
            const proj = mBox.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            return (
              <g key={`mount-${bIdx}`}>
                {BOX_EDGES.map(([i1, i2], eIdx) => (
                  <line
                    key={`me-${bIdx}-${eIdx}`}
                    x1={proj[i1].x2d}
                    y1={proj[i1].y2d}
                    x2={proj[i2].x2d}
                    y2={proj[i2].y2d}
                    stroke={accentColor}
                    strokeWidth="1"
                    strokeOpacity="0.8"
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* 3. LASER DIODE EMITTER (He-Ne / Semiconductor Laser Head) */}
        <g className="laser-diode">
          {(() => {
            const pDiodeAperture = projectPoint(laserEmitterPos, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Emitter cylinder rings
            const ringBack = makeBox(laserEmitterX - 18 * scale, opticalY, 0, 36 * scale, 18 * scale, 18 * scale);
            const projRing = ringBack.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));

            return (
              <>
                {BOX_EDGES.map(([i1, i2], eIdx) => (
                  <line
                    key={`ld-${eIdx}`}
                    x1={projRing[i1].x2d}
                    y1={projRing[i1].y2d}
                    x2={projRing[i2].x2d}
                    y2={projRing[i2].y2d}
                    stroke={accentColor}
                    strokeWidth="1.2"
                  />
                ))}
                {/* Laser Emitter Aperture Ring */}
                <circle cx={pDiodeAperture.x2d} cy={pDiodeAperture.y2d} r="4" fill="none" stroke={primaryColor} strokeWidth="1.5" filter="url(#laserCyanGlow)" />
                <circle cx={pDiodeAperture.x2d} cy={pDiodeAperture.y2d} r="1.5" fill="#FFFFFF" />
              </>
            );
          })()}
        </g>

        {/* 4. 50/50 BEAM SPLITTER CUBE PRISM & 45° DIAGONAL INTERFACE */}
        <g className="beam-splitter">
          {/* Cube Wireframe */}
          {(() => {
            const projCube = splitterBox.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const projDiag = splitterDiagonal.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathDiag = projDiag.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                {BOX_EDGES.map(([i1, i2], eIdx) => (
                  <line
                    key={`bs-${eIdx}`}
                    x1={projCube[i1].x2d}
                    y1={projCube[i1].y2d}
                    x2={projCube[i2].x2d}
                    y2={projCube[i2].y2d}
                    stroke={accentColor}
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                ))}
                {/* 45° Semi-Reflective Beam Splitter Diagonal Plane */}
                <path
                  d={pathDiag}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.9"
                  filter="url(#laserCyanGlow)"
                />
              </>
            );
          })()}
        </g>

        {/* 5. DUAL MIRROR MOUNTS WITH MICROMETER ADJUSTMENT SCREWS */}
        <g className="mirror-mounts">
          {/* Mirror 1 (Moving Oscillating Arm) */}
          {(() => {
            const projM1 = mirror1Face.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathM1 = projM1.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pM1Center = projectPoint(mirror1Pos, rotX, rotY, rotZ, centerX, centerY, 1200);

            // Micrometer adjustment knob
            const pKnob1 = projectPoint({ x: mirror1X + 16 * scale, y: opticalY, z: 0 }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g className="mirror-1">
                <path d={pathM1} fill="none" stroke={primaryColor} strokeWidth="1.6" filter="url(#laserCyanGlow)" />
                <circle cx={pM1Center.x2d} cy={pM1Center.y2d} r="2" fill="#FFFFFF" />
                {/* Micrometer Thumbscrew */}
                <line x1={pM1Center.x2d} y1={pM1Center.y2d} x2={pKnob1.x2d} y2={pKnob1.y2d} stroke={accentColor} strokeWidth="1.5" />
                <circle cx={pKnob1.x2d} cy={pKnob1.y2d} r="3" fill="#000000" stroke={primaryColor} strokeWidth="1" />
              </g>
            );
          })()}

          {/* Mirror 2 (Fixed Reference Arm) */}
          {(() => {
            const projM2 = mirror2Face.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathM2 = projM2.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pM2Center = projectPoint(mirror2Pos, rotX, rotY, rotZ, centerX, centerY, 1200);

            const pKnob2 = projectPoint({ x: 0, y: opticalY, z: mirror2Z + 16 * scale }, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <g className="mirror-2">
                <path d={pathM2} fill="none" stroke={primaryColor} strokeWidth="1.6" filter="url(#laserCyanGlow)" />
                <circle cx={pM2Center.x2d} cy={pM2Center.y2d} r="2" fill="#FFFFFF" />
                {/* Micrometer Thumbscrew */}
                <line x1={pM2Center.x2d} y1={pM2Center.y2d} x2={pKnob2.x2d} y2={pKnob2.y2d} stroke={accentColor} strokeWidth="1.5" />
                <circle cx={pKnob2.x2d} cy={pKnob2.y2d} r="3" fill="#000000" stroke={primaryColor} strokeWidth="1" />
              </g>
            );
          })()}
        </g>

        {/* 6. PERPENDICULAR SPLIT LASER BEAM VECTORS (Laser Cyan #00E5FF) */}
        <g className="laser-beam-paths">
          {(() => {
            const pLaser = projectPoint(laserEmitterPos, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pSplitter = projectPoint(splitterCenter, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pMirror1 = projectPoint(mirror1Pos, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pMirror2 = projectPoint(mirror2Pos, rotX, rotY, rotZ, centerX, centerY, 1200);
            const pDetector = projectPoint(detectorPos, rotX, rotY, rotZ, centerX, centerY, 1200);

            return (
              <>
                {/* Beam 0: Emitter -> Splitter Cube */}
                <line x1={pLaser.x2d} y1={pLaser.y2d} x2={pSplitter.x2d} y2={pSplitter.y2d} stroke={primaryColor} strokeWidth="2.2" filter="url(#intenseLaserGlow)" />
                <line x1={pLaser.x2d} y1={pLaser.y2d} x2={pSplitter.x2d} y2={pSplitter.y2d} stroke="#FFFFFF" strokeWidth="0.8" />

                {/* Beam 1: Splitter -> Mirror 1 (Horizontal transmission) & Return */}
                <line x1={pSplitter.x2d} y1={pSplitter.y2d} x2={pMirror1.x2d} y2={pMirror1.y2d} stroke={primaryColor} strokeWidth="1.8" filter="url(#laserCyanGlow)" />
                <line x1={pSplitter.x2d} y1={pSplitter.y2d} x2={pMirror1.x2d} y2={pMirror1.y2d} stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="6 3" />

                {/* Beam 2: Splitter -> Mirror 2 (Perpendicular 90° reflection) & Return */}
                <line x1={pSplitter.x2d} y1={pSplitter.y2d} x2={pMirror2.x2d} y2={pMirror2.y2d} stroke={primaryColor} strokeWidth="1.8" filter="url(#laserCyanGlow)" />
                <line x1={pSplitter.x2d} y1={pSplitter.y2d} x2={pMirror2.x2d} y2={pMirror2.y2d} stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="6 3" />

                {/* Recombined Beam: Splitter -> Photodetector Screen */}
                <line x1={pSplitter.x2d} y1={pSplitter.y2d} x2={pDetector.x2d} y2={pDetector.y2d} stroke={primaryColor} strokeWidth="2.4" filter="url(#intenseLaserGlow)" />
                <line x1={pSplitter.x2d} y1={pSplitter.y2d} x2={pDetector.x2d} y2={pDetector.y2d} stroke="#FFFFFF" strokeWidth="1" />
              </>
            );
          })()}
        </g>

        {/* 7. DETECTOR SCREEN & MODULATED INTERFERENCE FRINGE GRID */}
        <g className="detector-fringe-screen">
          {(() => {
            const projScreen = detectorScreenFace.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY, 1200));
            const pathScreen = projScreen.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                {/* 1px Detector Face Perimeter */}
                <path d={pathScreen} fill="none" stroke={primaryColor} strokeWidth="1.5" filter="url(#laserCyanGlow)" />

                {/* Interference Fringe Wave Lines */}
                {fringeGrid.map((fg, idx) => {
                  const p1 = projectPoint(fg.p1, rotX, rotY, rotZ, centerX, centerY, 1200);
                  const p2 = projectPoint(fg.p2, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <line
                      key={`fringe-${idx}`}
                      x1={p1.x2d}
                      y1={p1.y2d}
                      x2={p2.x2d}
                      y2={p2.y2d}
                      stroke={primaryColor}
                      strokeWidth={1 + fg.intensity * 1.5}
                      strokeOpacity={0.4 + fg.intensity * 0.6}
                      filter={fg.intensity > 0.7 ? 'url(#laserCyanGlow)' : undefined}
                    />
                  );
                })}

                {/* Photodetector Optical Sensor Focal Spot */}
                {(() => {
                  const pCenter = projectPoint(detectorPos, rotX, rotY, rotZ, centerX, centerY, 1200);
                  return (
                    <>
                      <circle cx={pCenter.x2d} cy={pCenter.y2d} r="5" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx={pCenter.x2d} cy={pCenter.y2d} r="2" fill={primaryColor} filter="url(#intenseLaserGlow)" />
                    </>
                  );
                })()}
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default OpticalBenchInterferometer3D;
