import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface IsometricMatrix3DProps {
  primaryColor?: string;
  accentCyan?: string;
  scale?: number;
  submeshDispersion?: number;
}

export const IsometricMatrix3D: React.FC<IsometricMatrix3DProps> = ({
  primaryColor = '#5322ff',
  accentCyan = '#00E5FF',
  scale = 1.0,
  submeshDispersion = 0,
}) => {
  const frame = useCurrentFrame();

  const rotX = 55 + Math.sin(frame * 0.02) * 10;
  const rotZ = 45 + frame * 0.4;

  const cubePositions = [
    { x: -160, y: -160, z: 0 },
    { x: 0, y: -160, z: 40 },
    { x: 160, y: -160, z: -20 },
    { x: -160, y: 0, z: 30 },
    { x: 0, y: 0, z: 80 }, // Center cube higher
    { x: 160, y: 0, z: 10 },
    { x: -160, y: 160, z: -10 },
    { x: 0, y: 160, z: 50 },
    { x: 160, y: 160, z: 0 },
  ];

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg) translateZ(${submeshDispersion * 500}px)`,
          opacity: 1 - submeshDispersion * 0.8,
          position: 'relative',
        }}
      >
        {cubePositions.map((pos, idx) => {
          const floatOffset = Math.sin(frame * 0.05 + idx) * 20;
          const cubeZ = pos.z + floatOffset + submeshDispersion * (idx % 2 === 0 ? 200 : -200);

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                transformStyle: 'preserve-3d',
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${cubeZ}px)`,
              }}
            >
              {/* Wireframe Cube Faces */}
              {/* Front */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: `2px solid ${primaryColor}`,
                  boxShadow: `0 0 12px ${primaryColor}66`,
                  backgroundColor: 'rgba(83, 34, 255, 0.1)',
                  transform: 'translateZ(40px)',
                }}
              />
              {/* Back */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'rgba(83, 34, 255, 0.1)',
                  transform: 'rotateY(180deg) translateZ(40px)',
                }}
              />
              {/* Left */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'rgba(83, 34, 255, 0.1)',
                  transform: 'rotateY(-90deg) translateZ(40px)',
                }}
              />
              {/* Right */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'rgba(83, 34, 255, 0.1)',
                  transform: 'rotateY(90deg) translateZ(40px)',
                }}
              />
              {/* Top */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'rgba(83, 34, 255, 0.15)',
                  transform: 'rotateX(90deg) translateZ(40px)',
                }}
              />
              {/* Bottom */}
              <div
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'rgba(83, 34, 255, 0.1)',
                  transform: 'rotateX(-90deg) translateZ(40px)',
                }}
              />

              {/* Cyan Glowing Core Sphere/Box inside Cube */}
              <div
                style={{
                  position: 'absolute',
                  top: '25px',
                  left: '25px',
                  width: '30px',
                  height: '30px',
                  backgroundColor: accentCyan,
                  boxShadow: `0 0 20px ${accentCyan}, 0 0 35px ${accentCyan}`,
                  borderRadius: '2px',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
