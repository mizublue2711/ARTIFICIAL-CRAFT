import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '../../../lib/video-engine/types/presets';

export interface RimLightStudio3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Vector3D {
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
): { x2d: number; y2d: number; z: number; worldPos: Point3D } {
  // Rotate around X axis
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  // Rotate around Y axis
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  // Rotate around Z axis
  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  const projScale = perspective / (perspective + z2 + 600);
  return {
    x2d: centerX + x3 * projScale,
    y2d: centerY + y3 * projScale,
    z: z2,
    worldPos: { x: x3, y: y3, z: z2 },
  };
}

// Helper: Vector dot product
function dot3(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

// Helper: Normalize vector
function normalize3(v: Vector3D): Vector3D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1e-6;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

// Helper: Rotate vector in 3D (to match model orientation)
function rotateVector(v: Vector3D, rotX: number, rotY: number, rotZ: number): Vector3D {
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = v.y * cosX - v.z * sinX;
  const z1 = v.y * sinX + v.z * cosX;

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x2 = v.x * cosY + z1 * sinY;
  const z2 = -v.x * sinY + z1 * cosY;

  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
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

// Generate arc points in 3D (XY plane at given Z)
function generateArcPoints(radius: number, z: number, startAngle: number, endAngle: number, steps = 32): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + (i / steps) * (endAngle - startAngle);
    points.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z,
    });
  }
  return points;
}

export const RimLightStudio3D: React.FC<RimLightStudio3DProps> = ({
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
  const rotY = baseRotY + frame * 0.008;
  const rotZ = Math.cos(frame * 0.006) * 0.012;

  // View direction towards viewer (camera looks along +Z toward -Z in projected view)
  const viewVector: Vector3D = { x: 0, y: 0, z: 1 };

  // ---------------------------------------------------------------------------
  // Deterministic Motion Calculations
  // ---------------------------------------------------------------------------
  // Layer 1: Turntable spins smoothly around the vertical Y-axis driven by frame * 0.03
  const turntableRotation = frame * 0.03;

  // Layer 3: Key Lamp orbits smoothly back and forth along the semicircular rail
  // Sweeps between ~ -55 deg and +55 deg from the positive X/Y quadrant
  const keyLampAngle = Math.PI * 0.25 + Math.sin(frame * 0.04) * (Math.PI * 0.35);

  // Layer 4: Fill Lamp counter-phase orbital motion
  const fillLampAngle = Math.PI * 1.25 + Math.cos(frame * 0.03) * (Math.PI * 0.28);
  // Dimmer factor modulated by counter-phase oscillation (ranges 0.35 to 0.95)
  const fillLampDimmer = 0.65 + Math.sin(frame * 0.03 * 2.0) * 0.3;

  // ---------------------------------------------------------------------------
  // Exploded View Math (dispersionAmount clamped 0.0 to 0.12)
  // ---------------------------------------------------------------------------
  // Central Pill elevates upward along +Z axis (+Z * 220 * dispersionAmount)
  const zExplodePill = 220 * clampedDispersion * scale;
  // Key Lamp & Arc Rail slide outward radially (+X * 180 * dispersionAmount)
  const xExplodeKeyLamp = 180 * clampedDispersion * scale;
  // Fill Lamp Assembly slides in opposite radial direction (-X * 180 * dispersionAmount)
  const xExplodeFillLamp = -180 * clampedDispersion * scale;
  // Turntable Base Platter separates into 2 stacked sub-platters along -Z axis (-Z * 150 * dispersionAmount)
  const zExplodeBaseSubPlatter = -150 * clampedDispersion * scale;

  // ---------------------------------------------------------------------------
  // LAYER 1: CAD TURNTABLE BASE PLATTER & DEGREE INDEXING RING
  // ---------------------------------------------------------------------------
  const platterRadius = 145 * scale;
  const platterZTop = -50 * scale;
  const platterZBottom = -70 * scale;
  const subPlatterZ = platterZBottom + zExplodeBaseSubPlatter;

  // Top platter outer ring & bevel
  const platterTopOuter = useMemo(
    () => generateRingPoints(platterRadius, platterZTop, 48),
    [platterRadius, platterZTop]
  );
  const platterTopInner = useMemo(
    () => generateRingPoints(platterRadius * 0.88, platterZTop, 40),
    [platterRadius, platterZTop]
  );

  // Center spindle hub on platter
  const spindleRadius = 22 * scale;
  const spindleZTop = platterZTop + 24 * scale;
  const spindlePoints = useMemo(
    () => generateRingPoints(spindleRadius, spindleZTop, 24),
    [spindleRadius, spindleZTop]
  );

  // 36 Perimeter degree tick notches (rotating with turntable)
  const degreeTicks = useMemo(() => {
    const ticks: { p1: Point3D; p2: Point3D; isMajor: boolean; angleDeg: number }[] = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + turntableRotation;
      const isMajor = i % 3 === 0;
      const rInner = isMajor ? platterRadius * 0.84 : platterRadius * 0.90;
      const rOuter = platterRadius;
      ticks.push({
        p1: { x: Math.cos(angle) * rInner, y: Math.sin(angle) * rInner, z: platterZTop },
        p2: { x: Math.cos(angle) * rOuter, y: Math.sin(angle) * rOuter, z: platterZTop },
        isMajor,
        angleDeg: Math.round((i / count) * 360),
      });
    }
    return ticks;
  }, [platterRadius, platterZTop, turntableRotation]);

  // Lower stacked sub-platter (separated during exploded view)
  const subPlatterOuter = useMemo(
    () => generateRingPoints(platterRadius * 1.08, subPlatterZ, 48),
    [platterRadius, subPlatterZ]
  );
  const subPlatterInner = useMemo(
    () => generateRingPoints(platterRadius * 0.65, subPlatterZ, 32),
    [platterRadius, subPlatterZ]
  );

  // ---------------------------------------------------------------------------
  // LAYER 2: CENTRAL PILL-SHAPED CONTROL CORE (THE SUBJECT)
  // Capsule body: vertical along Z-axis, centered on turntable spindle
  // Height: cylinder height + hemispherical ends
  // ---------------------------------------------------------------------------
  const pillRadius = 38 * scale;
  const pillCylinderHalfH = 42 * scale;
  const pillCenterZ = zExplodePill;

  // Lamp positions in 3D world space (for photometric calculations)
  const keyRailRadius = (platterRadius + 45 * scale) + xExplodeKeyLamp;
  const keyLampPos: Point3D = useMemo(() => {
    return {
      x: Math.cos(keyLampAngle) * keyRailRadius,
      y: Math.sin(keyLampAngle) * keyRailRadius,
      z: 75 * scale + zExplodePill * 0.4,
    };
  }, [keyLampAngle, keyRailRadius, scale, zExplodePill]);

  const fillRailRadius = (platterRadius + 50 * scale) + Math.abs(xExplodeFillLamp);
  const fillLampPos: Point3D = useMemo(() => {
    return {
      x: Math.cos(fillLampAngle) * fillRailRadius,
      y: Math.sin(fillLampAngle) * fillRailRadius,
      z: 55 * scale + zExplodePill * 0.3,
    };
  }, [fillLampAngle, fillRailRadius, scale, zExplodePill]);

  // Central Pill Geometric Structure:
  // - Top hemisphere rings
  // - Cylindrical body rings
  // - Bottom hemisphere rings
  // - Longitudinal meridian rib lines (8 meridians)
  const pillRings = useMemo(() => {
    const rings: {
      points: Point3D[];
      normals: Vector3D[];
      zLevel: number;
    }[] = [];

    const numTheta = 24;

    // Top hemispherical cap (latitudes 60, 45, 30 deg)
    const capLats = [Math.PI * 0.42, Math.PI * 0.28, Math.PI * 0.14];
    for (const lat of capLats) {
      const r = Math.cos(lat) * pillRadius;
      const dz = Math.sin(lat) * pillRadius;
      const z = pillCenterZ + pillCylinderHalfH + dz;
      const pts: Point3D[] = [];
      const nms: Vector3D[] = [];
      for (let i = 0; i <= numTheta; i++) {
        const theta = (i / numTheta) * Math.PI * 2;
        pts.push({ x: Math.cos(theta) * r, y: Math.sin(theta) * r, z });
        nms.push({
          x: Math.cos(theta) * Math.cos(lat),
          y: Math.sin(theta) * Math.cos(lat),
          z: Math.sin(lat),
        });
      }
      rings.push({ points: pts, normals: nms, zLevel: z });
    }

    // Cylindrical body rings (equator and intermediate rings)
    const cylinderZOffsets = [
      pillCylinderHalfH,
      pillCylinderHalfH * 0.5,
      0,
      -pillCylinderHalfH * 0.5,
      -pillCylinderHalfH,
    ];
    for (const cz of cylinderZOffsets) {
      const z = pillCenterZ + cz;
      const pts: Point3D[] = [];
      const nms: Vector3D[] = [];
      for (let i = 0; i <= numTheta; i++) {
        const theta = (i / numTheta) * Math.PI * 2;
        pts.push({ x: Math.cos(theta) * pillRadius, y: Math.sin(theta) * pillRadius, z });
        nms.push({ x: Math.cos(theta), y: Math.sin(theta), z: 0 });
      }
      rings.push({ points: pts, normals: nms, zLevel: z });
    }

    // Bottom hemispherical cap
    for (const lat of capLats) {
      const r = Math.cos(lat) * pillRadius;
      const dz = -Math.sin(lat) * pillRadius;
      const z = pillCenterZ - pillCylinderHalfH + dz;
      const pts: Point3D[] = [];
      const nms: Vector3D[] = [];
      for (let i = 0; i <= numTheta; i++) {
        const theta = (i / numTheta) * Math.PI * 2;
        pts.push({ x: Math.cos(theta) * r, y: Math.sin(theta) * r, z });
        nms.push({
          x: Math.cos(theta) * Math.cos(lat),
          y: Math.sin(theta) * Math.cos(lat),
          z: -Math.sin(lat),
        });
      }
      rings.push({ points: pts, normals: nms, zLevel: z });
    }

    return rings;
  }, [pillRadius, pillCylinderHalfH, pillCenterZ]);

  // Pill Meridians (longitudinal wireframe ribs from top pole to bottom pole)
  const pillMeridians = useMemo(() => {
    const meridians: { points: Point3D[]; normals: Vector3D[] }[] = [];
    const numMeridians = 8;
    const stepsPerMeridian = 28;

    for (let m = 0; m < numMeridians; m++) {
      const theta = (m / numMeridians) * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const pts: Point3D[] = [];
      const nms: Vector3D[] = [];

      for (let s = 0; s <= stepsPerMeridian; s++) {
        const t = s / stepsPerMeridian; // 0 = bottom pole, 1 = top pole
        let x = 0;
        let y = 0;
        let z = 0;
        let nx = 0;
        let ny = 0;
        let nz = 0;

        if (t < 0.25) {
          // Bottom hemisphere
          const lat = -Math.PI * 0.5 + (t / 0.25) * (Math.PI * 0.5);
          const r = Math.cos(lat) * pillRadius;
          x = cosT * r;
          y = sinT * r;
          z = pillCenterZ - pillCylinderHalfH + Math.sin(lat) * pillRadius;
          nx = cosT * Math.cos(lat);
          ny = sinT * Math.cos(lat);
          nz = Math.sin(lat);
        } else if (t <= 0.75) {
          // Cylinder body
          const frac = (t - 0.25) / 0.5;
          x = cosT * pillRadius;
          y = sinT * pillRadius;
          z = pillCenterZ - pillCylinderHalfH + frac * (pillCylinderHalfH * 2);
          nx = cosT;
          ny = sinT;
          nz = 0;
        } else {
          // Top hemisphere
          const lat = ((t - 0.75) / 0.25) * (Math.PI * 0.5);
          const r = Math.cos(lat) * pillRadius;
          x = cosT * r;
          y = sinT * r;
          z = pillCenterZ + pillCylinderHalfH + Math.sin(lat) * pillRadius;
          nx = cosT * Math.cos(lat);
          ny = sinT * Math.cos(lat);
          nz = Math.sin(lat);
        }

        pts.push({ x, y, z });
        nms.push({ x: nx, y: ny, z: nz });
      }

      meridians.push({ points: pts, normals: nms });
    }

    return meridians;
  }, [pillRadius, pillCylinderHalfH, pillCenterZ]);

  // ---------------------------------------------------------------------------
  // LAYER 3: KEY LAMP ASSEMBLY & ORBITAL ARC RAIL
  // ---------------------------------------------------------------------------
  const keyRailArc = useMemo(
    () => generateArcPoints(keyRailRadius, 30 * scale, -Math.PI * 0.2, Math.PI * 0.7, 36),
    [keyRailRadius, scale]
  );
  const keyRailOuterArc = useMemo(
    () => generateArcPoints(keyRailRadius + 8 * scale, 30 * scale, -Math.PI * 0.2, Math.PI * 0.7, 36),
    [keyRailRadius, scale]
  );

  // Key Lamp Fixture & Beam Cone
  const keyConeLength = keyRailRadius - pillRadius * 0.9;
  const keyConePoints = useMemo(() => {
    // Spotlight cone pointed directly at center of pill
    const dirToCore = normalize3({
      x: 0 - keyLampPos.x,
      y: 0 - keyLampPos.y,
      z: pillCenterZ - keyLampPos.z,
    });

    // Perpendicular vector for cone base spread
    const upVector: Vector3D = { x: 0, y: 0, z: 1 };
    const right = normalize3({
      x: dirToCore.y * upVector.z - dirToCore.z * upVector.y,
      y: dirToCore.z * upVector.x - dirToCore.x * upVector.z,
      z: dirToCore.x * upVector.y - dirToCore.y * upVector.x,
    });
    const trueUp = normalize3({
      x: right.y * dirToCore.z - right.z * dirToCore.y,
      y: right.z * dirToCore.x - right.x * dirToCore.z,
      z: right.x * dirToCore.y - right.y * dirToCore.x,
    });

    const coneHalfAngle = 0.22; // ~12.6 degrees
    const rBase = Math.tan(coneHalfAngle) * keyConeLength;

    const baseRing: Point3D[] = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const ox = (Math.cos(angle) * right.x + Math.sin(angle) * trueUp.x) * rBase;
      const oy = (Math.cos(angle) * right.y + Math.sin(angle) * trueUp.y) * rBase;
      const oz = (Math.cos(angle) * right.z + Math.sin(angle) * trueUp.z) * rBase;

      baseRing.push({
        x: keyLampPos.x + dirToCore.x * keyConeLength + ox,
        y: keyLampPos.y + dirToCore.y * keyConeLength + oy,
        z: keyLampPos.z + dirToCore.z * keyConeLength + oz,
      });
    }

    return {
      apex: keyLampPos,
      targetCore: {
        x: keyLampPos.x + dirToCore.x * keyConeLength,
        y: keyLampPos.y + dirToCore.y * keyConeLength,
        z: keyLampPos.z + dirToCore.z * keyConeLength,
      },
      baseRing,
    };
  }, [keyLampPos, keyConeLength, pillCenterZ]);

  // ---------------------------------------------------------------------------
  // LAYER 4: FILL LAMP DIMMER & SECONDARY ORBITAL RIG
  // ---------------------------------------------------------------------------
  const fillRailArc = useMemo(
    () => generateArcPoints(fillRailRadius, 20 * scale, Math.PI * 0.85, Math.PI * 1.65, 32),
    [fillRailRadius, scale]
  );

  const fillConeLength = fillRailRadius - pillRadius * 0.95;
  const fillConePoints = useMemo(() => {
    const dirToCore = normalize3({
      x: 0 - fillLampPos.x,
      y: 0 - fillLampPos.y,
      z: pillCenterZ - fillLampPos.z,
    });

    const upVector: Vector3D = { x: 0, y: 0, z: 1 };
    const right = normalize3({
      x: dirToCore.y * upVector.z - dirToCore.z * upVector.y,
      y: dirToCore.z * upVector.x - dirToCore.x * upVector.z,
      z: dirToCore.x * upVector.y - dirToCore.y * upVector.x,
    });
    const trueUp = normalize3({
      x: right.y * dirToCore.z - right.z * dirToCore.y,
      y: right.z * dirToCore.x - right.x * dirToCore.z,
      z: right.x * dirToCore.y - right.y * dirToCore.x,
    });

    const coneHalfAngle = 0.30; // slightly wider softer fill beam
    const rBase = Math.tan(coneHalfAngle) * fillConeLength;

    const baseRing: Point3D[] = [];
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const ox = (Math.cos(angle) * right.x + Math.sin(angle) * trueUp.x) * rBase;
      const oy = (Math.cos(angle) * right.y + Math.sin(angle) * trueUp.y) * rBase;
      const oz = (Math.cos(angle) * right.z + Math.sin(angle) * trueUp.z) * rBase;

      baseRing.push({
        x: fillLampPos.x + dirToCore.x * fillConeLength + ox,
        y: fillLampPos.y + dirToCore.y * fillConeLength + oy,
        z: fillLampPos.z + dirToCore.z * fillConeLength + oz,
      });
    }

    return {
      apex: fillLampPos,
      targetCore: {
        x: fillLampPos.x + dirToCore.x * fillConeLength,
        y: fillLampPos.y + dirToCore.y * fillConeLength,
        z: fillLampPos.z + dirToCore.z * fillConeLength,
      },
      baseRing,
    };
  }, [fillLampPos, fillConeLength, pillCenterZ]);

  // ---------------------------------------------------------------------------
  // Dynamic Rim Lighting Calculations (Per Vertex / Segment)
  // rimIntensity = Math.pow(1.0 - Math.abs(dot(normal, viewVector)), 2.0) * lightFactor
  // ---------------------------------------------------------------------------
  const calculateRimLighting = (
    worldPoint: Point3D,
    surfaceNormal: Vector3D
  ): { keyIntensity: number; fillIntensity: number; blendedColor: string; alpha: number } => {
    // Transform normal into camera space
    const normalCam = rotateVector(surfaceNormal, rotX, rotY, rotZ);

    // Fresnel / Grazing angle falloff relative to viewer
    const dotView = dot3(normalCam, viewVector);
    const fresnel = Math.pow(1.0 - Math.min(1.0, Math.abs(dotView)), 2.0);

    // Light directional factors
    const dirToKey = normalize3({
      x: keyLampPos.x - worldPoint.x,
      y: keyLampPos.y - worldPoint.y,
      z: keyLampPos.z - worldPoint.z,
    });
    const dirToFill = normalize3({
      x: fillLampPos.x - worldPoint.x,
      y: fillLampPos.y - worldPoint.y,
      z: fillLampPos.z - worldPoint.z,
    });

    const dotKey = Math.max(0.0, dot3(surfaceNormal, dirToKey));
    const dotFill = Math.max(0.0, dot3(surfaceNormal, dirToFill));

    const keyIntensity = fresnel * (0.25 + 0.75 * dotKey);
    const fillIntensity = fresnel * (0.20 + 0.80 * dotFill) * fillLampDimmer;

    // Pick dominant glowing color: Laser Cyan (#00E5FF) on Key Lamp side vs Indigo (#5322FF) on Fill Lamp side
    const totalGlow = keyIntensity + fillIntensity;
    const dominantColor = keyIntensity >= fillIntensity ? primaryColor : accentColor;
    const alpha = Math.min(1.0, Math.max(0.2, totalGlow * 1.4));

    return { keyIntensity, fillIntensity, blendedColor: dominantColor, alpha };
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
          <filter id="rimCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>
          <filter id="rimIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.85" />
          </filter>
          <filter id="rimCoreLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={primaryColor} floodOpacity="0.95" />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* EXPLODED AXIS TIE-RODS / ALIGNMENT LASERS (DISPERSION FEEDBACK) */}
        {/* ================================================================= */}
        {clampedDispersion > 0.01 && (
          <g className="exploded-alignment-lasers">
            {/* Central Z-axis through turntable and pill core */}
            {(() => {
              const pTop = projectPoint({ x: 0, y: 0, z: pillCenterZ + pillCylinderHalfH + pillRadius + 30 * scale }, rotX, rotY, rotZ, centerX, centerY);
              const pBottom = projectPoint({ x: 0, y: 0, z: subPlatterZ - 20 * scale }, rotX, rotY, rotZ, centerX, centerY);
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

            {/* Key Lamp radial explosion guide */}
            {(() => {
              const pCore = projectPoint({ x: 0, y: 0, z: 30 * scale }, rotX, rotY, rotZ, centerX, centerY);
              const pKeyRail = projectPoint({ x: keyRailRadius, y: 0, z: 30 * scale }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pCore.x2d}
                  y1={pCore.y2d}
                  x2={pKeyRail.x2d}
                  y2={pKeyRail.y2d}
                  stroke={primaryColor}
                  strokeWidth="0.8"
                  strokeDasharray="3 2"
                  strokeOpacity="0.5"
                />
              );
            })()}

            {/* Fill Lamp radial explosion guide */}
            {(() => {
              const pCore = projectPoint({ x: 0, y: 0, z: 20 * scale }, rotX, rotY, rotZ, centerX, centerY);
              const pFillRail = projectPoint({ x: -fillRailRadius, y: 0, z: 20 * scale }, rotX, rotY, rotZ, centerX, centerY);
              return (
                <line
                  x1={pCore.x2d}
                  y1={pCore.y2d}
                  x2={pFillRail.x2d}
                  y2={pFillRail.y2d}
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
        {/* LAYER 1: CAD TURNTABLE BASE PLATTER & LOWER SUB-PLATTER */}
        {/* ================================================================= */}
        <g className="turntable-base-platter">
          {/* Lower Stacked Sub-Platter (Separates along -Z during exploded view) */}
          {(() => {
            const pSubOuter = subPlatterOuter.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pSubInner = subPlatterInner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathOuter = pSubOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathInner = pSubInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path d={pathOuter} fill="none" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.75" />
                <path d={pathInner} fill="none" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 2" />
              </>
            );
          })()}

          {/* Turntable Platter Outer Top Ring & Inner Bevel */}
          {(() => {
            const pTopOuter = platterTopOuter.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pTopInner = platterTopInner.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathTopOuter = pTopOuter.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pathTopInner = pTopInner.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <>
                <path
                  d={pathTopOuter}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                  filter="url(#rimIndigoGlow)"
                />
                <path d={pathTopInner} fill="none" stroke={primaryColor} strokeWidth="0.9" strokeOpacity="0.7" />
              </>
            );
          })()}

          {/* Turntable Perimeter Degree Indexing Ticks (36 ticks, spinning with platter) */}
          {degreeTicks.map((tick, idx) => {
            const pt1 = projectPoint(tick.p1, rotX, rotY, rotZ, centerX, centerY);
            const pt2 = projectPoint(tick.p2, rotX, rotY, rotZ, centerX, centerY);
            return (
              <line
                key={`deg-tick-${idx}`}
                x1={pt1.x2d}
                y1={pt1.y2d}
                x2={pt2.x2d}
                y2={pt2.y2d}
                stroke={tick.isMajor ? primaryColor : accentColor}
                strokeWidth={tick.isMajor ? '1.2' : '0.8'}
                strokeOpacity={tick.isMajor ? '0.9' : '0.55'}
              />
            );
          })}

          {/* Turntable Center Spindle Hub */}
          {(() => {
            const pSpindle = spindlePoints.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathSpindle = pSpindle.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            const pCenterSpindle = projectPoint({ x: 0, y: 0, z: spindleZTop }, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g className="center-spindle">
                <path d={pathSpindle} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.9" />
                <circle cx={pCenterSpindle.x2d} cy={pCenterSpindle.y2d} r="2.5" fill="#FFFFFF" filter="url(#rimCyanGlow)" />
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 3: KEY LAMP RAIL & ORBITAL ARC */}
        {/* ================================================================= */}
        <g className="key-lamp-orbital-rig">
          {/* Semicircular Arc Rail */}
          {(() => {
            const pArc = keyRailArc.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pOuterArc = keyRailOuterArc.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));

            const pathArc = pArc.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');
            const pathOuterArc = pOuterArc.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <>
                <path d={pathArc} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.8" filter="url(#rimCyanGlow)" />
                <path d={pathOuterArc} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3 2" />
                {/* Rail end stops */}
                {pArc.length > 0 && (
                  <>
                    <circle cx={pArc[0].x2d} cy={pArc[0].y2d} r="2.2" fill="none" stroke={primaryColor} strokeWidth="1" />
                    <circle cx={pArc[pArc.length - 1].x2d} cy={pArc[pArc.length - 1].y2d} r="2.2" fill="none" stroke={primaryColor} strokeWidth="1" />
                  </>
                )}
              </>
            );
          })()}

          {/* Key Lamp Sliding Fixture Housing */}
          {(() => {
            const pFixture = projectPoint(keyLampPos, rotX, rotY, rotZ, centerX, centerY);
            const pLens = projectPoint(
              {
                x: keyLampPos.x + (0 - keyLampPos.x) * 0.12,
                y: keyLampPos.y + (0 - keyLampPos.y) * 0.12,
                z: keyLampPos.z + (pillCenterZ - keyLampPos.z) * 0.12,
              },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );

            return (
              <g className="key-lamp-head">
                {/* Fixture Ring */}
                <circle
                  cx={pFixture.x2d}
                  cy={pFixture.y2d}
                  r="6.5"
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  filter="url(#rimCyanGlow)"
                />
                <circle cx={pFixture.x2d} cy={pFixture.y2d} r="2" fill="#FFFFFF" />
                {/* Lens Bevel */}
                <line
                  x1={pFixture.x2d}
                  y1={pFixture.y2d}
                  x2={pLens.x2d}
                  y2={pLens.y2d}
                  stroke={primaryColor}
                  strokeWidth="2"
                  strokeOpacity="0.9"
                />
              </g>
            );
          })()}

          {/* Key Lamp 3D Focused Laser Cone Beam */}
          {(() => {
            const pApex = projectPoint(keyConePoints.apex, rotX, rotY, rotZ, centerX, centerY);
            const pBase = keyConePoints.baseRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathBaseRing = pBase.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <g className="key-laser-cone">
                {/* Projected base circular spot */}
                <path d={pathBaseRing} fill="none" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.8" filter="url(#rimCyanGlow)" />
                {/* Cone side ray lines (4 key boundaries) */}
                {[0, 4, 8, 12].map((idx) => {
                  if (idx >= pBase.length) return null;
                  return (
                    <line
                      key={`key-cone-ray-${idx}`}
                      x1={pApex.x2d}
                      y1={pApex.y2d}
                      x2={pBase[idx].x2d}
                      y2={pBase[idx].y2d}
                      stroke={primaryColor}
                      strokeWidth="0.9"
                      strokeOpacity="0.75"
                    />
                  );
                })}
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 4: FILL LAMP DIMMER & SECONDARY ORBITAL RIG */}
        {/* ================================================================= */}
        <g className="fill-lamp-orbital-rig">
          {/* Secondary Arc Rail */}
          {(() => {
            const pArc = fillRailArc.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathArc = pArc.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '');

            return (
              <path
                d={pathArc}
                fill="none"
                stroke={accentColor}
                strokeWidth="1.2"
                strokeOpacity="0.7"
                filter="url(#rimIndigoGlow)"
              />
            );
          })()}

          {/* Fill Lamp Fixture & Dimmer Knob Indicator */}
          {(() => {
            const pFixture = projectPoint(fillLampPos, rotX, rotY, rotZ, centerX, centerY);
            // Knurled Dimmer knob offset
            const knobAngle = frame * 0.08;
            const pKnob = projectPoint(
              {
                x: fillLampPos.x + Math.cos(knobAngle) * 9 * scale,
                y: fillLampPos.y + Math.sin(knobAngle) * 9 * scale,
                z: fillLampPos.z + 12 * scale,
              },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );

            return (
              <g className="fill-lamp-head">
                {/* Outer housing */}
                <circle
                  cx={pFixture.x2d}
                  cy={pFixture.y2d}
                  r="5.5"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.4"
                  filter="url(#rimIndigoGlow)"
                />
                <circle cx={pFixture.x2d} cy={pFixture.y2d} r="1.8" fill={primaryColor} />
                {/* Dimmer Knob Tick */}
                <line
                  x1={pFixture.x2d}
                  y1={pFixture.y2d}
                  x2={pKnob.x2d}
                  y2={pKnob.y2d}
                  stroke={accentColor}
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                />
              </g>
            );
          })()}

          {/* Fill Lamp Modulated Laser Cone Beam */}
          {(() => {
            const pApex = projectPoint(fillConePoints.apex, rotX, rotY, rotZ, centerX, centerY);
            const pBase = fillConePoints.baseRing.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathBaseRing = pBase.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';

            return (
              <g className="fill-laser-cone">
                <path
                  d={pathBaseRing}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity={0.4 + fillLampDimmer * 0.4}
                  strokeDasharray="4 2"
                />
                {[0, 4, 8, 12].map((idx) => {
                  if (idx >= pBase.length) return null;
                  return (
                    <line
                      key={`fill-cone-ray-${idx}`}
                      x1={pApex.x2d}
                      y1={pApex.y2d}
                      x2={pBase[idx].x2d}
                      y2={pBase[idx].y2d}
                      stroke={accentColor}
                      strokeWidth="0.8"
                      strokeOpacity={0.3 + fillLampDimmer * 0.4}
                    />
                  );
                })}
              </g>
            );
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 5: BEAM ALIGNMENT VECTORS & FOCAL SPOT BASE RING */}
        {/* ================================================================= */}
        <g className="beam-alignment-vectors">
          {/* Key Lamp Vector Ray line to central pill core */}
          {(() => {
            const pStart = projectPoint(keyLampPos, rotX, rotY, rotZ, centerX, centerY);
            const pEnd = projectPoint({ x: 0, y: 0, z: pillCenterZ }, rotX, rotY, rotZ, centerX, centerY);
            return (
              <line
                x1={pStart.x2d}
                y1={pStart.y2d}
                x2={pEnd.x2d}
                y2={pEnd.y2d}
                stroke={primaryColor}
                strokeWidth="1.2"
                strokeDasharray="6 3"
                strokeOpacity="0.85"
                filter="url(#rimCyanGlow)"
              />
            );
          })()}

          {/* Fill Lamp Vector Ray line to central pill core */}
          {(() => {
            const pStart = projectPoint(fillLampPos, rotX, rotY, rotZ, centerX, centerY);
            const pEnd = projectPoint({ x: 0, y: 0, z: pillCenterZ }, rotX, rotY, rotZ, centerX, centerY);
            return (
              <line
                x1={pStart.x2d}
                y1={pStart.y2d}
                x2={pEnd.x2d}
                y2={pEnd.y2d}
                stroke={accentColor}
                strokeWidth="1"
                strokeDasharray="4 3"
                strokeOpacity={0.4 + fillLampDimmer * 0.45}
              />
            );
          })()}

          {/* Focal Spot Base Ring at turntable center spindle */}
          {(() => {
            const focalRings = generateRingPoints(pillRadius * 1.35, platterZTop + 4 * scale, 32);
            const pFocal = focalRings.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathFocal = pFocal.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`), '') + ' Z';
            return <path d={pathFocal} fill="none" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 3" />;
          })()}
        </g>

        {/* ================================================================= */}
        {/* LAYER 2: CENTRAL PILL-SHAPED CONTROL CORE (THE SUBJECT) */}
        {/* DYNAMIC SURFACE NORMAL & RIM LIGHTING CALCULATION */}
        {/* ================================================================= */}
        <g className="central-pill-control-core">
          {/* Latitudinal Rings */}
          {pillRings.map((ring, rIdx) => {
            // Project each ring point and compute local lighting segment
            const projected = ring.points.map((pt, pIdx) => {
              const proj = projectPoint(pt, rotX, rotY, rotZ, centerX, centerY);
              const lighting = calculateRimLighting(pt, ring.normals[pIdx]);
              return { proj, lighting };
            });

            return (
              <g key={`pill-ring-${rIdx}`}>
                {projected.map((item, pIdx) => {
                  if (pIdx === projected.length - 1) return null;
                  const nextItem = projected[pIdx + 1];
                  const avgLighting = item.lighting;

                  return (
                    <line
                      key={`ring-seg-${rIdx}-${pIdx}`}
                      x1={item.proj.x2d}
                      y1={item.proj.y2d}
                      x2={nextItem.proj.x2d}
                      y2={nextItem.proj.y2d}
                      stroke={avgLighting.blendedColor}
                      strokeWidth={1.0 + avgLighting.keyIntensity * 0.8}
                      strokeOpacity={avgLighting.alpha}
                      filter={avgLighting.keyIntensity > 0.4 ? 'url(#rimCyanGlow)' : undefined}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Longitudinal Meridian Ribs (Top to Bottom Pole) */}
          {pillMeridians.map((meridian, mIdx) => {
            const projected = meridian.points.map((pt, pIdx) => {
              const proj = projectPoint(pt, rotX, rotY, rotZ, centerX, centerY);
              const lighting = calculateRimLighting(pt, meridian.normals[pIdx]);
              return { proj, lighting };
            });

            return (
              <g key={`pill-meridian-${mIdx}`}>
                {projected.map((item, pIdx) => {
                  if (pIdx === projected.length - 1) return null;
                  const nextItem = projected[pIdx + 1];
                  const avgLighting = item.lighting;

                  return (
                    <line
                      key={`meridian-seg-${mIdx}-${pIdx}`}
                      x1={item.proj.x2d}
                      y1={item.proj.y2d}
                      x2={nextItem.proj.x2d}
                      y2={nextItem.proj.y2d}
                      stroke={avgLighting.blendedColor}
                      strokeWidth={0.9 + avgLighting.keyIntensity * 0.7}
                      strokeOpacity={avgLighting.alpha}
                      filter={avgLighting.keyIntensity > 0.45 ? 'url(#rimCyanGlow)' : undefined}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* North and South Apex Control Jewels */}
          {(() => {
            const pTopPole = projectPoint(
              { x: 0, y: 0, z: pillCenterZ + pillCylinderHalfH + pillRadius },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            const pBottomPole = projectPoint(
              { x: 0, y: 0, z: pillCenterZ - pillCylinderHalfH - pillRadius },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );

            return (
              <>
                <circle cx={pTopPole.x2d} cy={pTopPole.y2d} r="2.8" fill="#FFFFFF" filter="url(#rimCoreLaserGlow)" />
                <circle cx={pBottomPole.x2d} cy={pBottomPole.y2d} r="2.2" fill={primaryColor} />
              </>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default RimLightStudio3D;
