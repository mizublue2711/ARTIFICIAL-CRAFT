import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface BentoGrid3DEngineProps extends BasePresetProps {
  rotateXDeg?: number;
  rotateYDeg?: number;
  children?: React.ReactNode;
  columns?: number;
  gap?: number;
}

export const BentoGrid3DEngine: React.FC<BentoGrid3DEngineProps> = ({
  frame: frameProp,
  rotateXDeg = 20,
  rotateYDeg = -15,
  children,
  columns = 3,
  gap = 24,
  primaryColor = '#00E5FF',
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;
  const { fps = 60 } = useVideoConfig() || {};

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const floatY = Math.sin(frame * 0.04) * 12;
  const dynRotateX = rotateXDeg + Math.sin(frame * 0.03) * 4;
  const dynRotateY = rotateYDeg + Math.cos(frame * 0.025) * 4;

  return (
    <AbsoluteFill
      className={className}
      style={{
        perspective: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          transformStyle: 'preserve-3d',
          transform: `
            rotateX(${dynRotateX}deg)
            rotateY(${dynRotateY}deg)
            translateY(${floatY}px)
            scale(${entrance})
          `,
          boxShadow: `0 30px 60px rgba(0,0,0,0.7), 0 0 40px ${primaryColor}26`,
          borderRadius: '24px',
          padding: '32px',
          backgroundColor: 'rgba(15, 18, 28, 0.85)',
          border: `1px solid ${primaryColor}33`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
