import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface VelocityBlurEngineProps extends BasePresetProps {
  children?: React.ReactNode;
  maxBlur?: number;
  motionFn?: (frame: number) => { x: number; y: number };
}

export const VelocityBlurEngine: React.FC<VelocityBlurEngineProps> = ({
  frame: frameProp,
  children,
  maxBlur = 20,
  motionFn,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const defaultMotion = (f: number) => ({
    x: Math.sin(f * 0.1) * 100,
    y: Math.sin(f * 0.15) * 200,
  });

  const getPos = motionFn || defaultMotion;

  const currentPos = getPos(frame);
  const prevPos = getPos(Math.max(0, frame - 1));

  const deltaX = currentPos.x - prevPos.x;
  const deltaY = currentPos.y - prevPos.y;
  const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const blurAmount = interpolate(velocity, [0, 40], [0, maxBlur], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={className}
      style={{
        transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
        filter: blurAmount > 0.5 ? `blur(${blurAmount.toFixed(1)}px)` : 'none',
        willChange: 'transform, filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
