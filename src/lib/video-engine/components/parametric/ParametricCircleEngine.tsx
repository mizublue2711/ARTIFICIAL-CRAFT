import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface ParametricCircleEngineProps extends BasePresetProps {
  itemCount?: number;
  radius?: number;
  pulseSpeed?: number;
  renderItem?: (index: number, x: number, y: number, scale: number) => React.ReactNode;
  children?: React.ReactNode;
}

export const ParametricCircleEngine: React.FC<ParametricCircleEngineProps> = ({
  frame: frameProp,
  itemCount = 8,
  radius = 250,
  pulseSpeed = 0.05,
  renderItem,
  children,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;
  const { fps = 60 } = useVideoConfig() || {};

  const springScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const sinPulse = Math.sin(frame * pulseSpeed);
  const currentRadius = radius + sinPulse * 20;

  const items = Array.from({ length: itemCount }, (_, i) => {
    const angle = (i / itemCount) * Math.PI * 2 + frame * 0.01;
    const x = Math.cos(angle) * currentRadius * springScale;
    const y = Math.sin(angle) * currentRadius * springScale;
    const scale = interpolate(sinPulse, [-1, 1], [0.85, 1.15]) * springScale;

    return { i, x, y, scale };
  });

  return (
    <AbsoluteFill
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        {children}
        {items.map((item) => (
          <div
            key={item.i}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${item.x}px, ${item.y}px) scale(${item.scale})`,
            }}
          >
            {renderItem ? renderItem(item.i, item.x, item.y, item.scale) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#00E5FF',
                  boxShadow: '0 0 15px #00E5FF',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
