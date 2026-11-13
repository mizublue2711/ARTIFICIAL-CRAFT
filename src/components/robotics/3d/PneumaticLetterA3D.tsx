import React, { useEffect, useState, useMemo } from 'react';
import { BasePresetProps } from '@/lib/video-engine/types/presets';

export interface PneumaticLetterA3DProps extends BasePresetProps {
  width?: number;
  height?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2DProjected {
  x2d: number;
  y2d: number;
  z: number;
}

/**
 * 3D Matrix Projection with Perspective Warp
 */
function projectPoint(
  p: Point3D,
  rotX: number,
  rotY: number,
  rotZ: number,
  centerX: number,
  centerY: number,
  perspective = 1200
): Point2DProjected {
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

/**
 * Helper to generate 3D cylindrical wireframe segment (rings + longitudinal rails)
 */
function generateCylinderGeometry(
  start: Point3D,
  end: Point3D,
  radius: number,
  numRings: number,
  radialSegments = 8
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Normalize axis direction
  const dir = { x: dx / length, y: dy / length, z: dz / length };

  // Arbitrary perpendicular reference vector
  const arb = Math.abs(dir.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };

  // Tangent vector 1 = dir x arb
  const uX = dir.y * arb.z - dir.z * arb.y;
  const uY = dir.z * arb.x - dir.x * arb.z;
  const uZ = dir.x * arb.y - dir.y * arb.x;
  const uLen = Math.sqrt(uX * uX + uY * uY + uZ * uZ);
  const u = { x: uX / uLen, y: uY / uLen, z: uZ / uLen };

  // Tangent vector 2 = dir x u
  const v = {
    x: dir.y * u.z - dir.z * u.y,
    y: dir.z * u.x - dir.x * u.z,
    z: dir.x * u.y - dir.y * u.x,
  };

  // Generate rings
  const rings: Point3D[][] = [];
  for (let r = 0; r <= numRings; r++) {
    const t = r / numRings;
    const center = {
      x: start.x + dx * t,
      y: start.y + dy * t,
      z: start.z + dz * t,
    };
    const ringPts: Point3D[] = [];
    for (let s = 0; s < radialSegments; s++) {
      const angle = (s / radialSegments) * Math.PI * 2;
      const cosA = Math.cos(angle) * radius;
      const sinA = Math.sin(angle) * radius;
      ringPts.push({
        x: center.x + u.x * cosA + v.x * sinA,
        y: center.y + u.y * cosA + v.y * sinA,
        z: center.z + u.z * cosA + v.z * sinA,
      });
    }
    rings.push(ringPts);
  }

  // Longitudinal rail lines connecting ring vertices
  const rails: Point3D[][] = [];
  for (let s = 0; s < radialSegments; s++) {
    const railPts: Point3D[] = [];
    for (let r = 0; r <= numRings; r++) {
      railPts.push(rings[r][s]);
    }
    rails.push(railPts);
  }

  return { rings, rails, dir, u, v, length };
}

/**
 * PNEUMATIC LETTER "A" 3D - CAD MESH & VALVE MANIFOLD
 *
 * Swiss Brutalism & High-Tech CAD Typographic Mechanical Component
 * Combines the bold geometric silhouette of Letter "A" with an intricate
 * pneumatic transport tube network, 3-way diverter valve, bypass solenoid,
 * and central floating desiccant filter.
 */
export const PneumaticLetterA3D: React.FC<PneumaticLetterA3DProps> = ({
  frame: propFrame,
  primaryColor = '#00E5FF', // Laser Cyan
  accentColor = '#5322FF',  // Indigo
  scale = 1.0,
  rotateXDeg = 28,          // CAD volumetric pitch locked
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
  const centerX = width / 2;
  const centerY = height / 2;

  // Clamped dispersion factor for exploded CAD view (0.0 to 0.12)
  const clampedDisp = Math.max(0.0, Math.min(0.12, dispersionAmount));

  // Dynamic 3D rotation angles with harmonic drift
  const baseRotX = (rotateXDeg * Math.PI) / 180;
  const baseRotY = (rotateYDeg * Math.PI) / 180;
  const rotX = baseRotX + Math.sin(frame * 0.012) * 0.08;
  const rotY = baseRotY + Math.cos(frame * 0.01) * 0.18;
  const rotZ = Math.sin(frame * 0.008) * 0.04;

  // Exploded view 3D translation vectors
  // Layer 2 Apex Valve: slides upward along Y axis
  const apexDispY = -200 * clampedDisp * scale;
  const apexDispZ = 60 * clampedDisp * scale;

  // Layer 1 Legs: slide diagonally down-outward
  const leftLegDispX = -180 * clampedDisp * scale;
  const leftLegDispY = 100 * clampedDisp * scale;
  const rightLegDispX = 180 * clampedDisp * scale;
  const rightLegDispY = 100 * clampedDisp * scale;

  // Layer 3 Crossbar: slides forward along +Z axis
  const crossbarDispZ = 150 * clampedDisp * scale;

  // Layer 4 Central Filter: slides backward along -Z axis
  const filterDispZ = -200 * clampedDisp * scale;

  // Base Letter "A" key structural points (scaled)
  const apexPt: Point3D = { x: 0, y: -150 * scale, z: 0 };
  const leftFootPt: Point3D = { x: -115 * scale, y: 145 * scale, z: 0 };
  const rightFootPt: Point3D = { x: 115 * scale, y: 145 * scale, z: 0 };

  // Crossbar junction points along legs at y = 32
  const crossbarY = 32 * scale;
  const tCross = (crossbarY - apexPt.y) / (leftFootPt.y - apexPt.y); // ~0.617
  const leftCrossPt: Point3D = {
    x: leftFootPt.x * tCross,
    y: crossbarY,
    z: 0,
  };
  const rightCrossPt: Point3D = {
    x: rightFootPt.x * tCross,
    y: crossbarY,
    z: 0,
  };

  // Pipe radius dimensions
  const legPipeRadius = 11 * scale;
  const crossPipeRadius = 8 * scale;
  const filterRadius = 22 * scale;
  const filterHeight = 65 * scale;

  // ================= LAYER 1: DUAL ANGLED MANIFOLD TUBES (LEGS) =================
  const leftLegGeom = useMemo(
    () =>
      generateCylinderGeometry(
        { x: apexPt.x + leftLegDispX, y: apexPt.y + leftLegDispY, z: apexPt.z },
        { x: leftFootPt.x + leftLegDispX, y: leftFootPt.y + leftLegDispY, z: leftFootPt.z },
        legPipeRadius,
        10,
        6
      ),
    [scale, leftLegDispX, leftLegDispY]
  );

  const rightLegGeom = useMemo(
    () =>
      generateCylinderGeometry(
        { x: apexPt.x + rightLegDispX, y: apexPt.y + rightLegDispY, z: apexPt.z },
        { x: rightFootPt.x + rightLegDispX, y: rightFootPt.y + rightLegDispY, z: rightFootPt.z },
        legPipeRadius,
        10,
        6
      ),
    [scale, rightLegDispX, rightLegDispY]
  );

  // Compression Flange Rings along legs
  const legFlangeIndices = [2, 5, 8];

  // Foot mounting bracket geometry
  const leftFootMount = useMemo(() => {
    const fx = leftFootPt.x + leftLegDispX;
    const fy = leftFootPt.y + leftLegDispY;
    const fz = leftFootPt.z;
    const s = 24 * scale;
    return {
      corners: [
        { x: fx - s, y: fy + 8 * scale, z: fz - s },
        { x: fx + s, y: fy + 8 * scale, z: fz - s },
        { x: fx + s, y: fy + 8 * scale, z: fz + s },
        { x: fx - s, y: fy + 8 * scale, z: fz + s },
      ],
      bolts: [
        { x: fx - s * 0.7, y: fy + 8 * scale, z: fz - s * 0.7 },
        { x: fx + s * 0.7, y: fy + 8 * scale, z: fz - s * 0.7 },
        { x: fx + s * 0.7, y: fy + 8 * scale, z: fz + s * 0.7 },
        { x: fx - s * 0.7, y: fy + 8 * scale, z: fz + s * 0.7 },
      ],
    };
  }, [scale, leftLegDispX, leftLegDispY]);

  const rightFootMount = useMemo(() => {
    const fx = rightFootPt.x + rightLegDispX;
    const fy = rightFootPt.y + rightLegDispY;
    const fz = rightFootPt.z;
    const s = 24 * scale;
    return {
      corners: [
        { x: fx - s, y: fy + 8 * scale, z: fz - s },
        { x: fx + s, y: fy + 8 * scale, z: fz - s },
        { x: fx + s, y: fy + 8 * scale, z: fz + s },
        { x: fx - s, y: fy + 8 * scale, z: fz + s },
      ],
      bolts: [
        { x: fx - s * 0.7, y: fy + 8 * scale, z: fz - s * 0.7 },
        { x: fx + s * 0.7, y: fy + 8 * scale, z: fz - s * 0.7 },
        { x: fx + s * 0.7, y: fy + 8 * scale, z: fz + s * 0.7 },
        { x: fx - s * 0.7, y: fy + 8 * scale, z: fz + s * 0.7 },
      ],
    };
  }, [scale, rightLegDispX, rightLegDispY]);

  // Deterministic pneumatic capsules shooting along legs upward towards apex
  // Capsule progress: 0 to 1
  const legCapsuleCount = 3;
  const legCapsules = useMemo(() => {
    const capsules: { left: Point3D; right: Point3D; prog: number }[] = [];
    for (let i = 0; i < legCapsuleCount; i++) {
      const offset = i / legCapsuleCount;
      const prog = ((frame * 0.015 + offset) % 1.0);
      // Upward: from foot (1.0) to apex (0.0)
      const t = 1.0 - prog;
      capsules.push({
        left: {
          x: (leftFootPt.x + (apexPt.x - leftFootPt.x) * (1 - t)) + leftLegDispX,
          y: (leftFootPt.y + (apexPt.y - leftFootPt.y) * (1 - t)) + leftLegDispY,
          z: apexPt.z,
        },
        right: {
          x: (rightFootPt.x + (apexPt.x - rightFootPt.x) * (1 - t)) + rightLegDispX,
          y: (rightFootPt.y + (apexPt.y - rightFootPt.y) * (1 - t)) + rightLegDispY,
          z: apexPt.z,
        },
        prog,
      });
    }
    return capsules;
  }, [frame, scale, leftLegDispX, leftLegDispY, rightLegDispX, rightLegDispY]);

  // ================= LAYER 2: APEX 3-WAY DIVERTER VALVE & PRESSURE GAUGE =================
  const apexValveCenter: Point3D = useMemo(
    () => ({
      x: apexPt.x,
      y: apexPt.y + apexDispY,
      z: apexPt.z + apexDispZ,
    }),
    [scale, apexDispY, apexDispZ]
  );

  // Pressure gauge needle harmonic oscillation: Math.sin(frame * 0.08) * 25deg
  const gaugeNeedleAngleDeg = Math.sin(frame * 0.08) * 25 - 45; // baseline around top-left to top-right
  const gaugeNeedleRad = (gaugeNeedleAngleDeg * Math.PI) / 180;
  const gaugeRadius = 18 * scale;

  // Spherical Chamber rings at apex
  const apexSphereRings = useMemo(() => {
    const rings: Point3D[][] = [];
    const rChamber = 22 * scale;
    // 3 Latitude rings
    const lats = [-0.6, 0, 0.6];
    for (const lat of lats) {
      const ringPts: Point3D[] = [];
      const ringR = rChamber * Math.cos(lat);
      const ringY = apexValveCenter.y + rChamber * Math.sin(lat);
      for (let s = 0; s < 12; s++) {
        const ang = (s / 12) * Math.PI * 2;
        ringPts.push({
          x: apexValveCenter.x + Math.cos(ang) * ringR,
          y: ringY,
          z: apexValveCenter.z + Math.sin(ang) * ringR,
        });
      }
      rings.push(ringPts);
    }
    return rings;
  }, [apexValveCenter, scale]);

  // Apex Pressure Gauge Face Points
  const gaugeCenter3D: Point3D = useMemo(
    () => ({
      x: apexValveCenter.x,
      y: apexValveCenter.y - 4 * scale,
      z: apexValveCenter.z + 24 * scale,
    }),
    [apexValveCenter, scale]
  );

  // Gauge Tick Marks
  const gaugeTicks = useMemo(() => {
    const ticks: { inner: Point3D; outer: Point3D }[] = [];
    for (let i = 0; i < 9; i++) {
      const ang = (-135 + i * 22.5) * (Math.PI / 180);
      const rIn = gaugeRadius * 0.65;
      const rOut = gaugeRadius * 0.9;
      ticks.push({
        inner: {
          x: gaugeCenter3D.x + Math.cos(ang) * rIn,
          y: gaugeCenter3D.y + Math.sin(ang) * rIn,
          z: gaugeCenter3D.z,
        },
        outer: {
          x: gaugeCenter3D.x + Math.cos(ang) * rOut,
          y: gaugeCenter3D.y + Math.sin(ang) * rOut,
          z: gaugeCenter3D.z,
        },
      });
    }
    return ticks;
  }, [gaugeCenter3D, gaugeRadius]);

  // Needle tip
  const needleTip3D: Point3D = useMemo(
    () => ({
      x: gaugeCenter3D.x + Math.cos(gaugeNeedleRad) * (gaugeRadius * 0.72),
      y: gaugeCenter3D.y + Math.sin(gaugeNeedleRad) * (gaugeRadius * 0.72),
      z: gaugeCenter3D.z + 1,
    }),
    [gaugeCenter3D, gaugeNeedleRad, gaugeRadius]
  );

  // ================= LAYER 3: HORIZONTAL TRANSFER CONDUIT (CROSSBAR) =================
  const crossbarGeom = useMemo(
    () =>
      generateCylinderGeometry(
        { x: leftCrossPt.x, y: leftCrossPt.y, z: leftCrossPt.z + crossbarDispZ },
        { x: rightCrossPt.x, y: rightCrossPt.y, z: rightCrossPt.z + crossbarDispZ },
        crossPipeRadius,
        8,
        6
      ),
    [scale, crossbarDispZ]
  );

  // Inline Solenoid Gate Valve toggle state: frame % 90 < 45
  const isSolenoidOpen = (frame % 90) < 45;
  const solenoidGateElev = isSolenoidOpen ? -8 * scale : 2 * scale;

  // Solenoid valve body box vertices
  const solenoidCenter3D: Point3D = useMemo(
    () => ({
      x: 0,
      y: crossbarY,
      z: crossbarDispZ,
    }),
    [crossbarY, crossbarDispZ]
  );

  const solenoidBox = useMemo(() => {
    const sx = 14 * scale;
    const sy = 16 * scale;
    const sz = 14 * scale;
    const cx = solenoidCenter3D.x;
    const cy = solenoidCenter3D.y;
    const cz = solenoidCenter3D.z;

    const v: Point3D[] = [
      { x: cx - sx, y: cy - sy, z: cz - sz },
      { x: cx + sx, y: cy - sy, z: cz - sz },
      { x: cx + sx, y: cy + sy, z: cz - sz },
      { x: cx - sx, y: cy + sy, z: cz - sz },
      { x: cx - sx, y: cy - sy, z: cz + sz },
      { x: cx + sx, y: cy - sy, z: cz + sz },
      { x: cx + sx, y: cy + sy, z: cz + sz },
      { x: cx - sx, y: cy + sy, z: cz + sz },
    ];
    return v;
  }, [solenoidCenter3D, scale]);

  // Rapid crossbar capsule zipping left to right
  const crossProg = ((frame * 0.04) % 1.0);
  const crossbarCapsulePt: Point3D = useMemo(
    () => ({
      x: leftCrossPt.x + (rightCrossPt.x - leftCrossPt.x) * crossProg,
      y: crossbarY,
      z: crossbarDispZ,
    }),
    [leftCrossPt, rightCrossPt, crossbarY, crossbarDispZ, crossProg]
  );

  // ================= LAYER 4: CENTRAL FLOATING FILTER CORE =================
  const filterCenter3D: Point3D = useMemo(
    () => ({
      x: 0,
      y: -38 * scale,
      z: filterDispZ,
    }),
    [scale, filterDispZ]
  );

  // Desiccator filter rings
  const filterRings = useMemo(() => {
    const rings: Point3D[][] = [];
    const numFilterDisks = 6;
    for (let i = 0; i <= numFilterDisks; i++) {
      const diskY = filterCenter3D.y - filterHeight / 2 + (filterHeight / numFilterDisks) * i;
      const ringPts: Point3D[] = [];
      for (let s = 0; s < 10; s++) {
        const ang = (s / 10) * Math.PI * 2;
        ringPts.push({
          x: filterCenter3D.x + Math.cos(ang) * filterRadius,
          y: diskY,
          z: filterCenter3D.z + Math.sin(ang) * filterRadius,
        });
      }
      rings.push(ringPts);
    }
    return rings;
  }, [filterCenter3D, filterRadius, filterHeight]);

  // Plasma core pulse
  const plasmaCorePulse = 1 + Math.sin(frame * 0.12) * 0.22;

  // Suspension struts connecting filter to apex and crossbar
  const suspensionStruts = useMemo(
    () => [
      {
        from: { x: 0, y: filterCenter3D.y - filterHeight / 2, z: filterCenter3D.z },
        to: apexValveCenter,
      },
      {
        from: { x: -filterRadius * 0.8, y: filterCenter3D.y + filterHeight / 2, z: filterCenter3D.z },
        to: { x: leftCrossPt.x * 0.5, y: crossbarY, z: crossbarDispZ },
      },
      {
        from: { x: filterRadius * 0.8, y: filterCenter3D.y + filterHeight / 2, z: filterCenter3D.z },
        to: { x: rightCrossPt.x * 0.5, y: crossbarY, z: crossbarDispZ },
      },
    ],
    [filterCenter3D, filterRadius, filterHeight, apexValveCenter, leftCrossPt, rightCrossPt, crossbarY, crossbarDispZ]
  );

  // ================= LAYER 5: 3D TELEMETRY NODE BADGES & FLANGES =================
  // 3 Dynamic Nodes attached strictly to the pipe joints:
  // Node 1: Apex Valve
  const nodeApexAnchor3D: Point3D = useMemo(
    () => ({
      x: apexValveCenter.x,
      y: apexValveCenter.y,
      z: apexValveCenter.z + 20 * scale,
    }),
    [apexValveCenter, scale]
  );
  const nodeApexBadgeTarget3D: Point3D = useMemo(
    () => ({
      x: apexValveCenter.x + 85 * scale,
      y: apexValveCenter.y - 45 * scale,
      z: apexValveCenter.z + 10 * scale,
    }),
    [apexValveCenter, scale]
  );

  // Node 2: Crossbar Solenoid
  const nodeCrossAnchor3D: Point3D = useMemo(
    () => ({
      x: solenoidCenter3D.x,
      y: solenoidCenter3D.y,
      z: solenoidCenter3D.z + 16 * scale,
    }),
    [solenoidCenter3D, scale]
  );
  const nodeCrossBadgeTarget3D: Point3D = useMemo(
    () => ({
      x: solenoidCenter3D.x - 120 * scale,
      y: solenoidCenter3D.y + 35 * scale,
      z: solenoidCenter3D.z + 15 * scale,
    }),
    [solenoidCenter3D, scale]
  );

  // Node 3: Base Foot Flange
  const nodeBaseAnchor3D: Point3D = useMemo(
    () => ({
      x: leftFootPt.x + leftLegDispX,
      y: leftFootPt.y + leftLegDispY,
      z: leftFootPt.z + 10 * scale,
    }),
    [leftFootPt, leftLegDispX, leftLegDispY, scale]
  );
  const nodeBaseBadgeTarget3D: Point3D = useMemo(
    () => ({
      x: leftFootPt.x + leftLegDispX - 65 * scale,
      y: leftFootPt.y + leftLegDispY + 45 * scale,
      z: leftFootPt.z + 10 * scale,
    }),
    [leftFootPt, leftLegDispX, leftLegDispY, scale]
  );

  // Project telemetry nodes
  const pApexAnchor = projectPoint(nodeApexAnchor3D, rotX, rotY, rotZ, centerX, centerY);
  const pApexBadge = projectPoint(nodeApexBadgeTarget3D, rotX, rotY, rotZ, centerX, centerY);

  const pCrossAnchor = projectPoint(nodeCrossAnchor3D, rotX, rotY, rotZ, centerX, centerY);
  const pCrossBadge = projectPoint(nodeCrossBadgeTarget3D, rotX, rotY, rotZ, centerX, centerY);

  const pBaseAnchor = projectPoint(nodeBaseAnchor3D, rotX, rotY, rotZ, centerX, centerY);
  const pBaseBadge = projectPoint(nodeBaseBadgeTarget3D, rotX, rotY, rotZ, centerX, centerY);

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
          {/* Laser Cyan High-Intensity Drop Shadow */}
          <filter id="pneumaticCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={primaryColor} floodOpacity="0.85" />
          </filter>

          {/* Electric Indigo Deep Shadow */}
          <filter id="pneumaticIndigoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor={accentColor} floodOpacity="0.75" />
          </filter>

          {/* High-intensity White Core Glint */}
          <filter id="coreGlint" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FFFFFF" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* ========================================================================= */}
        {/* LAYER 4: CENTRAL FLOATING FILTER CORE (BACKGROUND Z-DEPTH) */}
        {/* ========================================================================= */}
        <g className="filter-core-subassembly">
          {/* Suspension Tension Struts */}
          {suspensionStruts.map((strut, sIdx) => {
            const p1 = projectPoint(strut.from, rotX, rotY, rotZ, centerX, centerY);
            const p2 = projectPoint(strut.to, rotX, rotY, rotZ, centerX, centerY);
            return (
              <line
                key={`strut-${sIdx}`}
                x1={p1.x2d}
                y1={p1.y2d}
                x2={p2.x2d}
                y2={p2.y2d}
                stroke={accentColor}
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />
            );
          })}

          {/* Desiccator Filter Cylinder Wireframe Disks */}
          {filterRings.map((ring, rIdx) => {
            const projRing = ring.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD = projRing.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            ) + ' Z';
            return (
              <path
                key={`filter-ring-${rIdx}`}
                d={pathD}
                fill={rIdx === 0 || rIdx === filterRings.length - 1 ? accentColor : 'none'}
                fillOpacity={0.12}
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.8"
                filter="url(#pneumaticIndigoGlow)"
              />
            );
          })}

          {/* Vertical Housing Rails */}
          {[0, 2, 5, 7].map((sIdx) => {
            const topPt = projectPoint(filterRings[0][sIdx], rotX, rotY, rotZ, centerX, centerY);
            const botPt = projectPoint(
              filterRings[filterRings.length - 1][sIdx],
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            return (
              <line
                key={`filter-rail-${sIdx}`}
                x1={topPt.x2d}
                y1={topPt.y2d}
                x2={botPt.x2d}
                y2={botPt.y2d}
                stroke={accentColor}
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
            );
          })}

          {/* Central Glowing Indigo Plasma Core */}
          {(() => {
            const pCore = projectPoint(filterCenter3D, rotX, rotY, rotZ, centerX, centerY);
            const rPx = 14 * scale * plasmaCorePulse;
            return (
              <g className="plasma-core">
                {/* Diffuse Outer Plasma Aura */}
                <circle
                  cx={pCore.x2d}
                  cy={pCore.y2d}
                  r={rPx * 1.8}
                  fill={accentColor}
                  fillOpacity="0.22"
                  filter="url(#pneumaticIndigoGlow)"
                />
                {/* Concentric Harmonic Ring */}
                <circle
                  cx={pCore.x2d}
                  cy={pCore.y2d}
                  r={rPx}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  strokeOpacity="0.85"
                />
                {/* Radiant Core Kernel */}
                <circle
                  cx={pCore.x2d}
                  cy={pCore.y2d}
                  r={rPx * 0.45}
                  fill="#FFFFFF"
                  filter="url(#coreGlint)"
                />
              </g>
            );
          })()}
        </g>

        {/* ========================================================================= */}
        {/* LAYER 1: DUAL ANGLED MANIFOLD TUBES (LEFT & RIGHT LEGS OF "A") */}
        {/* ========================================================================= */}
        <g className="angled-manifold-legs">
          {/* Foot Mount Brackets */}
          {[leftFootMount, rightFootMount].map((mount, mIdx) => {
            const projCorners = mount.corners.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY)
            );
            const cornerPath =
              projCorners.reduce(
                (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
                ''
              ) + ' Z';

            return (
              <g key={`foot-mount-${mIdx}`}>
                {/* Base Plate Flange */}
                <path
                  d={cornerPath}
                  fill="rgba(4, 8, 20, 0.65)"
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />
                {/* Anchor Bolts */}
                {mount.bolts.map((bp, bIdx) => {
                  const pBolt = projectPoint(bp, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <circle
                      key={`bolt-${mIdx}-${bIdx}`}
                      cx={pBolt.x2d}
                      cy={pBolt.y2d}
                      r="2"
                      fill="#FFFFFF"
                      stroke={primaryColor}
                      strokeWidth="0.8"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Left Leg Cylindrical Manifold */}
          {leftLegGeom.rails.map((rail, rIdx) => {
            const projRail = rail.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD = projRail.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            );
            return (
              <path
                key={`left-rail-${rIdx}`}
                d={pathD}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#pneumaticCyanGlow)"
              />
            );
          })}

          {leftLegGeom.rings.map((ring, rIdx) => {
            const isFlange = legFlangeIndices.includes(rIdx);
            const projRing = ring.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD =
              projRing.reduce(
                (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
                ''
              ) + ' Z';
            return (
              <path
                key={`left-ring-${rIdx}`}
                d={pathD}
                fill={isFlange ? primaryColor : 'none'}
                fillOpacity={isFlange ? 0.2 : 0}
                stroke={isFlange ? '#FFFFFF' : primaryColor}
                strokeWidth={isFlange ? '1.8' : '1'}
                strokeOpacity="0.9"
              />
            );
          })}

          {/* Right Leg Cylindrical Manifold */}
          {rightLegGeom.rails.map((rail, rIdx) => {
            const projRail = rail.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD = projRail.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            );
            return (
              <path
                key={`right-rail-${rIdx}`}
                d={pathD}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#pneumaticCyanGlow)"
              />
            );
          })}

          {rightLegGeom.rings.map((ring, rIdx) => {
            const isFlange = legFlangeIndices.includes(rIdx);
            const projRing = ring.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD =
              projRing.reduce(
                (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
                ''
              ) + ' Z';
            return (
              <path
                key={`right-ring-${rIdx}`}
                d={pathD}
                fill={isFlange ? primaryColor : 'none'}
                fillOpacity={isFlange ? 0.2 : 0}
                stroke={isFlange ? '#FFFFFF' : primaryColor}
                strokeWidth={isFlange ? '1.8' : '1'}
                strokeOpacity="0.9"
              />
            );
          })}

          {/* Laser Cyan Data Capsules shooting upward along legs */}
          {legCapsules.map((cap, cIdx) => {
            const pL = projectPoint(cap.left, rotX, rotY, rotZ, centerX, centerY);
            const pR = projectPoint(cap.right, rotX, rotY, rotZ, centerX, centerY);
            return (
              <g key={`leg-capsule-${cIdx}`}>
                {/* Left Leg Capsule */}
                <circle
                  cx={pL.x2d}
                  cy={pL.y2d}
                  r="6"
                  fill={primaryColor}
                  fillOpacity="0.3"
                  filter="url(#pneumaticCyanGlow)"
                />
                <circle
                  cx={pL.x2d}
                  cy={pL.y2d}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke={primaryColor}
                  strokeWidth="1"
                />

                {/* Right Leg Capsule */}
                <circle
                  cx={pR.x2d}
                  cy={pR.y2d}
                  r="6"
                  fill={primaryColor}
                  fillOpacity="0.3"
                  filter="url(#pneumaticCyanGlow)"
                />
                <circle
                  cx={pR.x2d}
                  cy={pR.y2d}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke={primaryColor}
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </g>

        {/* ========================================================================= */}
        {/* LAYER 3: HORIZONTAL TRANSFER CONDUIT & BYPASS SOLENOID (CROSSBAR) */}
        {/* ========================================================================= */}
        <g className="crossbar-conduit-assembly">
          {/* Horizontal Tube Rails */}
          {crossbarGeom.rails.map((rail, rIdx) => {
            const projRail = rail.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD = projRail.reduce(
              (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
              ''
            );
            return (
              <path
                key={`cross-rail-${rIdx}`}
                d={pathD}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.8"
                filter="url(#pneumaticCyanGlow)"
              />
            );
          })}

          {/* Tube Cross-section Rings */}
          {crossbarGeom.rings.map((ring, rIdx) => {
            const projRing = ring.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD =
              projRing.reduce(
                (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
                ''
              ) + ' Z';
            return (
              <path
                key={`cross-ring-${rIdx}`}
                d={pathD}
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                strokeOpacity="0.8"
              />
            );
          })}

          {/* Inline Solenoid Gate Valve Body (Center of Crossbar) */}
          {(() => {
            const projBox = solenoidBox.map((p) =>
              projectPoint(p, rotX, rotY, rotZ, centerX, centerY)
            );
            // Box 12 wireframe edges
            const edges: [number, number][] = [
              [0, 1], [1, 2], [2, 3], [3, 0], // back face
              [4, 5], [5, 6], [6, 7], [7, 4], // front face
              [0, 4], [1, 5], [2, 6], [3, 7], // connectors
            ];

            // Solenoid gate plunger (moving up/down)
            const pGateStem1 = projectPoint(
              { x: solenoidCenter3D.x, y: solenoidCenter3D.y - 14 * scale, z: solenoidCenter3D.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            const pGateStem2 = projectPoint(
              {
                x: solenoidCenter3D.x,
                y: solenoidCenter3D.y + solenoidGateElev,
                z: solenoidCenter3D.z,
              },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );

            return (
              <g className="solenoid-valve">
                {/* 12 Wireframe Box Edges */}
                {edges.map(([i, j], eIdx) => (
                  <line
                    key={`sol-edge-${eIdx}`}
                    x1={projBox[i].x2d}
                    y1={projBox[i].y2d}
                    x2={projBox[j].x2d}
                    y2={projBox[j].y2d}
                    stroke={primaryColor}
                    strokeWidth="1.2"
                    strokeOpacity="0.9"
                  />
                ))}

                {/* Gate Valve Plunger Stem */}
                <line
                  x1={pGateStem1.x2d}
                  y1={pGateStem1.y2d}
                  x2={pGateStem2.x2d}
                  y2={pGateStem2.y2d}
                  stroke={isSolenoidOpen ? primaryColor : '#FF2255'}
                  strokeWidth="2.5"
                  strokeOpacity="0.95"
                  filter="url(#pneumaticCyanGlow)"
                />

                {/* Status Indicator LED */}
                <circle
                  cx={pGateStem2.x2d}
                  cy={pGateStem2.y2d}
                  r="3"
                  fill={isSolenoidOpen ? primaryColor : '#FF2255'}
                  filter="url(#coreGlint)"
                />
              </g>
            );
          })()}

          {/* Rapid Data Capsule zipping horizontally across crossbar */}
          {(() => {
            const pCap = projectPoint(crossbarCapsulePt, rotX, rotY, rotZ, centerX, centerY);
            return (
              <g className="crossbar-capsule">
                <circle
                  cx={pCap.x2d}
                  cy={pCap.y2d}
                  r="7"
                  fill={primaryColor}
                  fillOpacity="0.35"
                  filter="url(#pneumaticCyanGlow)"
                />
                <circle
                  cx={pCap.x2d}
                  cy={pCap.y2d}
                  r="4"
                  fill="#FFFFFF"
                  stroke={primaryColor}
                  strokeWidth="1"
                />
              </g>
            );
          })()}
        </g>

        {/* ========================================================================= */}
        {/* LAYER 2: APEX 3-WAY DIVERTER VALVE & PRESSURE GAUGE (TOP CROWN) */}
        {/* ========================================================================= */}
        <g className="apex-valve-assembly">
          {/* Spherical Valve Chamber Latitude Rings */}
          {apexSphereRings.map((ring, rIdx) => {
            const projRing = ring.map((p) => projectPoint(p, rotX, rotY, rotZ, centerX, centerY));
            const pathD =
              projRing.reduce(
                (acc, p, idx) => (idx === 0 ? `M ${p.x2d} ${p.y2d}` : `${acc} L ${p.x2d} ${p.y2d}`),
                ''
              ) + ' Z';
            return (
              <path
                key={`apex-lat-${rIdx}`}
                d={pathD}
                fill="none"
                stroke={primaryColor}
                strokeWidth="1.2"
                strokeOpacity="0.85"
                filter="url(#pneumaticCyanGlow)"
              />
            );
          })}

          {/* Top Exhaust / Bypass Port Coupling */}
          {(() => {
            const pTopExhaust1 = projectPoint(
              { x: apexValveCenter.x, y: apexValveCenter.y - 20 * scale, z: apexValveCenter.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            const pTopExhaust2 = projectPoint(
              { x: apexValveCenter.x, y: apexValveCenter.y - 36 * scale, z: apexValveCenter.z },
              rotX,
              rotY,
              rotZ,
              centerX,
              centerY
            );
            return (
              <g>
                <line
                  x1={pTopExhaust1.x2d}
                  y1={pTopExhaust1.y2d}
                  x2={pTopExhaust2.x2d}
                  y2={pTopExhaust2.y2d}
                  stroke={accentColor}
                  strokeWidth="4"
                  strokeOpacity="0.9"
                />
                <circle
                  cx={pTopExhaust2.x2d}
                  cy={pTopExhaust2.y2d}
                  r="5"
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })()}

          {/* Precision Dial Pressure Gauge */}
          {(() => {
            const pGaugeCenter = projectPoint(gaugeCenter3D, rotX, rotY, rotZ, centerX, centerY);
            const pNeedleTip = projectPoint(needleTip3D, rotX, rotY, rotZ, centerX, centerY);

            return (
              <g className="pressure-gauge-dial">
                {/* Dial Housing Rim */}
                <circle
                  cx={pGaugeCenter.x2d}
                  cy={pGaugeCenter.y2d}
                  r={gaugeRadius * 0.95}
                  fill="rgba(4, 8, 20, 0.85)"
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  filter="url(#pneumaticCyanGlow)"
                />
                <circle
                  cx={pGaugeCenter.x2d}
                  cy={pGaugeCenter.y2d}
                  r={gaugeRadius * 0.78}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />

                {/* Dial Calibration Ticks */}
                {gaugeTicks.map((tick, tIdx) => {
                  const ptIn = projectPoint(tick.inner, rotX, rotY, rotZ, centerX, centerY);
                  const ptOut = projectPoint(tick.outer, rotX, rotY, rotZ, centerX, centerY);
                  return (
                    <line
                      key={`gtick-${tIdx}`}
                      x1={ptIn.x2d}
                      y1={ptIn.y2d}
                      x2={ptOut.x2d}
                      y2={ptOut.y2d}
                      stroke={primaryColor}
                      strokeWidth="1"
                      strokeOpacity="0.8"
                    />
                  );
                })}

                {/* Oscillating Gauge Needle */}
                <line
                  x1={pGaugeCenter.x2d}
                  y1={pGaugeCenter.y2d}
                  x2={pNeedleTip.x2d}
                  y2={pNeedleTip.y2d}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  filter="url(#coreGlint)"
                />

                {/* Needle Hub Rivet */}
                <circle
                  cx={pGaugeCenter.x2d}
                  cy={pGaugeCenter.y2d}
                  r="2.5"
                  fill="#FFFFFF"
                  stroke={accentColor}
                  strokeWidth="1"
                />
              </g>
            );
          })()}
        </g>

        {/* ========================================================================= */}
        {/* LAYER 5: FLANGED FASTENERS & 3D TELEMETRY NODE BADGES */}
        {/* ========================================================================= */}
        <g className="telemetry-node-badges">
          {/* --- NODE 1: APEX 3-WAY DIVERTER VALVE --- */}
          {(() => {
            const elbowX = pApexAnchor.x2d + 30;
            const elbowY = pApexBadge.y2d;
            return (
              <g className="node-apex">
                {/* 1px Connector Leader Line with CAD Elbow */}
                <polyline
                  points={`${pApexAnchor.x2d},${pApexAnchor.y2d} ${elbowX},${elbowY} ${pApexBadge.x2d},${pApexBadge.y2d}`}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                  filter="url(#pneumaticCyanGlow)"
                />
                {/* Joint Anchor Dot */}
                <circle
                  cx={pApexAnchor.x2d}
                  cy={pApexAnchor.y2d}
                  r="3"
                  fill="#FFFFFF"
                  stroke={primaryColor}
                  strokeWidth="1"
                />

                {/* Swiss High-Tech CAD Badge Card */}
                <g transform={`translate(${pApexBadge.x2d}, ${pApexBadge.y2d - 18})`}>
                  <rect
                    x="0"
                    y="0"
                    width="190"
                    height="36"
                    fill="rgba(4, 8, 20, 0.88)"
                    stroke={primaryColor}
                    strokeWidth="1"
                  />
                  {/* Top-Right Accent Marker */}
                  <rect x="184" y="0" width="6" height="6" fill={primaryColor} />
                  {/* Primary Telemetry Title */}
                  <text
                    x="8"
                    y="14"
                    fill={primaryColor}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="700"
                    letterSpacing="0.8px"
                  >
                    VALVE // 3-WAY DIVERT [ACTIVE]
                  </text>
                  {/* Subline Data */}
                  <text
                    x="8"
                    y="27"
                    fill="#FFFFFF"
                    fillOpacity="0.8"
                    fontSize="8"
                    fontFamily="monospace"
                    letterSpacing="0.5px"
                  >
                    ACTUATOR: 60 PSI // CH-A DUAL-DIVERT
                  </text>
                </g>
              </g>
            );
          })()}

          {/* --- NODE 2: CROSSBAR SOLENOID VALVE --- */}
          {(() => {
            const elbowX = pCrossBadge.x2d + 195;
            const elbowY = pCrossAnchor.y2d;
            return (
              <g className="node-crossbar">
                {/* 1px Connector Leader Line */}
                <polyline
                  points={`${pCrossAnchor.x2d},${pCrossAnchor.y2d} ${elbowX},${elbowY} ${elbowX},${pCrossBadge.y2d + 18} ${pCrossBadge.x2d + 185},${pCrossBadge.y2d + 18}`}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                  filter="url(#pneumaticIndigoGlow)"
                />
                {/* Joint Anchor Dot */}
                <circle
                  cx={pCrossAnchor.x2d}
                  cy={pCrossAnchor.y2d}
                  r="3"
                  fill="#FFFFFF"
                  stroke={accentColor}
                  strokeWidth="1"
                />

                {/* Swiss High-Tech CAD Badge Card */}
                <g transform={`translate(${pCrossBadge.x2d - 15}, ${pCrossBadge.y2d})`}>
                  <rect
                    x="0"
                    y="0"
                    width="195"
                    height="36"
                    fill="rgba(4, 8, 20, 0.88)"
                    stroke={accentColor}
                    strokeWidth="1"
                  />
                  {/* Bottom-Left Accent Marker */}
                  <rect x="0" y="30" width="6" height="6" fill={accentColor} />
                  {/* Primary Telemetry Title */}
                  <text
                    x="8"
                    y="14"
                    fill={primaryColor}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="700"
                    letterSpacing="0.8px"
                  >
                    FLOW // 1,200 MB/s PNEUMATIC
                  </text>
                  {/* Subline Data */}
                  <text
                    x="8"
                    y="27"
                    fill="#FFFFFF"
                    fillOpacity="0.8"
                    fontSize="8"
                    fontFamily="monospace"
                    letterSpacing="0.5px"
                  >
                    {`SOLENOID: ${isSolenoidOpen ? 'OPEN [TRANSFER]' : 'RESTRICT [HOLD]'}`}
                  </text>
                </g>
              </g>
            );
          })()}

          {/* --- NODE 3: BASE FOOT PRESSURE FLANGE --- */}
          {(() => {
            const elbowX = pBaseBadge.x2d + 185;
            const elbowY = pBaseAnchor.y2d;
            return (
              <g className="node-base">
                {/* 1px Connector Leader Line */}
                <polyline
                  points={`${pBaseAnchor.x2d},${pBaseAnchor.y2d} ${elbowX},${elbowY} ${pBaseBadge.x2d + 185},${pBaseBadge.y2d + 18}`}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1"
                  strokeOpacity="0.8"
                  filter="url(#pneumaticCyanGlow)"
                />
                {/* Joint Anchor Dot */}
                <circle
                  cx={pBaseAnchor.x2d}
                  cy={pBaseAnchor.y2d}
                  r="3"
                  fill="#FFFFFF"
                  stroke={primaryColor}
                  strokeWidth="1"
                />

                {/* Swiss High-Tech CAD Badge Card */}
                <g transform={`translate(${pBaseBadge.x2d - 20}, ${pBaseBadge.y2d})`}>
                  <rect
                    x="0"
                    y="0"
                    width="195"
                    height="36"
                    fill="rgba(4, 8, 20, 0.88)"
                    stroke={primaryColor}
                    strokeWidth="1"
                  />
                  {/* Top-Left Accent Marker */}
                  <rect x="0" y="0" width="6" height="6" fill={primaryColor} />
                  {/* Primary Telemetry Title */}
                  <text
                    x="8"
                    y="14"
                    fill={primaryColor}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="700"
                    letterSpacing="0.8px"
                  >
                    PRESSURE // 8.4 BAR DUAL-LEG
                  </text>
                  {/* Subline Data */}
                  <text
                    x="8"
                    y="27"
                    fill="#FFFFFF"
                    fillOpacity="0.8"
                    fontSize="8"
                    fontFamily="monospace"
                    letterSpacing="0.5px"
                  >
                    DELTA-P: +0.12 BAR // ISO-4414 COMPLIANT
                  </text>
                </g>
              </g>
            );
          })()}
        </g>
      </svg>
    </div>
  );
};

export default PneumaticLetterA3D;
