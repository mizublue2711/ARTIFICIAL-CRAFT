import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface HyperdriveGridBgProps extends BasePresetProps {
  ringCount?: number;
}

export const HyperdriveGridBg: React.FC<HyperdriveGridBgProps> = ({
  frame: frameProp,
  backgroundColor = '#050505',
  primaryColor = '#00E5FF',
  ringCount = 12,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  return (
    <AbsoluteFill
      className={className}
      style={{
        backgroundColor,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Concentric expanding grid rings towards viewer */}
      {Array.from({ length: ringCount }).map((_, idx) => {
        const speed = 0.015;
        const offset = (idx / ringCount);
        const progress = (frame * speed + offset) % 1;

        const scale = Math.pow(progress, 3) * 8;
        const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.8, 0.4, 0]);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              border: `2px solid ${primaryColor}`,
              borderRadius: '12px',
              transform: `scale(${scale})`,
              opacity,
              boxShadow: `0 0 20px ${primaryColor}40`,
            }}
          />
        );
      })}

      {/* Radial perspective rays radiating from center */}
      {Array.from({ length: 16 }).map((_, rIdx) => {
        const angle = (rIdx / 16) * 360;
        return (
          <div
            key={rIdx}
            style={{
              position: 'absolute',
              width: '1000px',
              height: '1px',
              backgroundColor: `${primaryColor}30`,
              transformOrigin: 'left center',
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}

      {/* Center gravitational core */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          boxShadow: `0 0 40px ${primaryColor}, 0 0 80px ${primaryColor}`,
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};
