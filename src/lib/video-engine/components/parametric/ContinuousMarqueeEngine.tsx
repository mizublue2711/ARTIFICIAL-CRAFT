import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface ContinuousMarqueeEngineProps extends BasePresetProps {
  children?: React.ReactNode;
  speed?: number;
  itemWidth?: number;
}

export const ContinuousMarqueeEngine: React.FC<ContinuousMarqueeEngineProps> = ({
  frame: frameProp,
  children,
  speed = 4,
  itemWidth = 600,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const translateX = (frame * speed) % itemWidth;

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${translateX}px)`,
          willChange: 'transform',
        }}
      >
        <div style={{ display: 'flex', minWidth: `${itemWidth}px` }}>{children}</div>
        <div style={{ display: 'flex', minWidth: `${itemWidth}px` }}>{children}</div>
        <div style={{ display: 'flex', minWidth: `${itemWidth}px` }}>{children}</div>
      </div>
    </div>
  );
};
