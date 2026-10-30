import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface FibonacciSpiralEngineProps extends BasePresetProps {
  itemCount?: number;
  scaleFactor?: number;
  renderItem?: (index: number, x: number, y: number) => React.ReactNode;
}

const GOLDEN_ANGLE_RAD = 137.5 * (Math.PI / 180);

export const FibonacciSpiralEngine: React.FC<FibonacciSpiralEngineProps> = ({
  frame: frameProp,
  itemCount = 34,
  scaleFactor = 40,
  primaryColor = '#00E5FF',
  renderItem,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;
  const { fps = 60 } = useVideoConfig() || {};

  const rotOffset = frame * 0.01;

  const items = Array.from({ length: itemCount }, (_, i) => {
    const radius = Math.sqrt(i + 1) * scaleFactor;
    const angle = i * GOLDEN_ANGLE_RAD + rotOffset;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const springVal = spring({
      frame: frame - i * 2,
      fps,
      config: { damping: 12, stiffness: 90 },
    });

    return { i, x, y, springVal };
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
        {items.map((item) => {
          const scale = interpolate(item.springVal, [0, 1], [0, 1]);
          return (
            <div
              key={item.i}
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${item.x}px, ${item.y}px) scale(${scale})`,
              }}
            >
              {renderItem ? renderItem(item.i, item.x, item.y) : (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 10px ${primaryColor}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
