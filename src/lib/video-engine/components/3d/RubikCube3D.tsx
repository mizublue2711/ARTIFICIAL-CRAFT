import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RubikCube3DProps {
  primaryColor?: string;
  accentCyan?: string;
  scale?: number;
  effectiveDispersion?: number;
}

export const RubikCube3D: React.FC<RubikCube3DProps> = ({
  primaryColor = '#5322ff',
  accentCyan = '#00E5FF',
  scale = 1.0,
  effectiveDispersion = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Global cube rotation around X & Y axes
  const globalRotY = (frame * 1.5) % 360;
  const globalRotX = 25 + Math.sin(frame * 0.03) * 15;

  // Layer/face rotation on beat hits (e.g. rotating top/side faces every 27 frames)
  const beatIndex = Math.floor(frame / 27);
  const beatFrame = frame % 27;

  const rotateSpring = spring({
    frame: beatFrame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const layerAngle = rotateSpring * 90; // 90 degree snap rotation per beat

  const cubeSize = 60; // Size of each sub-cube unit in px
  const gap = 8 + effectiveDispersion * 40; // Dynamic spacing driven by submesh dispersion

  // Generate 27 sub-cubes (3x3x3 matrix)
  const subCubes: { x: number; y: number; z: number; id: number }[] = [];
  let count = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        subCubes.push({ x, y, z, id: count++ });
      }
    }
  }

  return (
    <div
      style={{
        width: '500px',
        height: '500px',
        perspective: '1200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${globalRotX}deg) rotateY(${globalRotY}deg)`,
        }}
      >
        {subCubes.map((cube) => {
          // Check if sub-cube belongs to active rotating layer based on beatIndex
          const isTopLayer = cube.y === -1 && beatIndex % 2 === 0;
          const isRightLayer = cube.x === 1 && beatIndex % 2 === 1;

          let rotX = 0;
          let rotY = 0;

          if (isTopLayer) {
            rotY = layerAngle;
          } else if (isRightLayer) {
            rotX = layerAngle;
          }

          const posX = cube.x * (cubeSize + gap);
          const posY = cube.y * (cubeSize + gap);
          const posZ = cube.z * (cubeSize + gap);

          // Submesh dispersion explosion offsets
          const dispX = cube.x * effectiveDispersion * 60;
          const dispY = cube.y * effectiveDispersion * 60;
          const dispZ = cube.z * effectiveDispersion * 60;

          return (
            <div
              key={cube.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${cubeSize}px`,
                height: `${cubeSize}px`,
                marginLeft: `-${cubeSize / 2}px`,
                marginTop: `-${cubeSize / 2}px`,
                transformStyle: 'preserve-3d',
                transform: `translate3d(${posX + dispX}px, ${posY + dispY}px, ${posZ + dispZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              }}
            >
              {/* Render 6 faces for each sub-cube with wireframe border & glowing cyan core */}
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => {
                let faceTransform = '';
                if (face === 'front') faceTransform = `translateZ(${cubeSize / 2}px)`;
                if (face === 'back') faceTransform = `rotateY(180deg) translateZ(${cubeSize / 2}px)`;
                if (face === 'left') faceTransform = `rotateY(-90deg) translateZ(${cubeSize / 2}px)`;
                if (face === 'right') faceTransform = `rotateY(90deg) translateZ(${cubeSize / 2}px)`;
                if (face === 'top') faceTransform = `rotateX(90deg) translateZ(${cubeSize / 2}px)`;
                if (face === 'bottom') faceTransform = `rotateX(-90deg) translateZ(${cubeSize / 2}px)`;

                return (
                  <div
                    key={face}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(5, 5, 10, 0.85)',
                      border: `1.5px solid ${primaryColor}`,
                      boxShadow: `inset 0 0 10px ${primaryColor}44, 0 0 6px ${primaryColor}66`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: faceTransform,
                      backfaceVisibility: 'visible',
                    }}
                  >
                    {/* Glowing #00E5FF cyan inner core */}
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: accentCyan,
                        boxShadow: `0 0 12px ${accentCyan}`,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
