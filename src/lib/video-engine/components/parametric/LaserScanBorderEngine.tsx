import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface LaserScanBorderEngineProps extends BasePresetProps {
  children?: React.ReactNode;
  borderRadius?: number;
  borderWidth?: number;
}

export const LaserScanBorderEngine: React.FC<LaserScanBorderEngineProps> = ({
  frame: frameProp,
  children,
  primaryColor = '#00E5FF',
  borderRadius = 16,
  borderWidth = 1,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const angle = (frame * 3) % 360;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        background: `conic-gradient(from ${angle}deg at 50% 50%, transparent 0%, ${primaryColor} 25%, transparent 50%, ${primaryColor} 75%, transparent 100%)`,
        boxShadow: `0 0 15px ${primaryColor}40`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
          backgroundColor: '#0A0D14',
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
