import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface ParticleTunnelBgProps extends BasePresetProps {
  particleCount?: number;
}

export const ParticleTunnelBg: React.FC<ParticleTunnelBgProps> = ({
  frame: frameProp,
  backgroundColor = '#050505',
  primaryColor = '#00E5FF',
  particleCount = 80,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const seed = i * 333;
    const angle = random(seed) * Math.PI * 2;
    const radius = 150 + random(seed + 1) * 600;
    const initialZ = random(seed + 2) * 2000;

    const zSpeed = 12 + random(seed + 3) * 8;
    const rawZ = (initialZ + frame * zSpeed) % 2000;
    const zPos = 2000 - rawZ;

    const opacity = interpolate(zPos, [0, 500, 1800, 2000], [0, 0.9, 0.5, 0]);
    const size = interpolate(zPos, [0, 2000], [8, 1]);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      x,
      y,
      zPos,
      opacity,
      size,
    };
  });

  return (
    <AbsoluteFill
      className={className}
      style={{
        backgroundColor,
        overflow: 'hidden',
        perspective: '800px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {particles.map((p, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size * 4}px`,
              borderRadius: '50%',
              backgroundColor: primaryColor,
              boxShadow: `0 0 12px ${primaryColor}`,
              opacity: p.opacity,
              transform: `translate3d(-50%, -50%, ${p.zPos}px)`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
