import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface SubmeshMorphEngineProps extends BasePresetProps {
  vertexCount?: number;
  radius?: number;
  renderVertex?: (index: number, x: number, y: number) => React.ReactNode;
}

export const SubmeshMorphEngine: React.FC<SubmeshMorphEngineProps> = ({
  frame: frameProp,
  vertexCount = 12,
  radius = 200,
  primaryColor = '#00E5FF',
  renderVertex,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const morphProgress = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0, 1]
  );

  const vertices = Array.from({ length: vertexCount }, (_, i) => {
    const baseAngle = (i / vertexCount) * Math.PI * 2;

    const rCircle = radius;
    const rPolygon = i % 2 === 0 ? radius * 1.4 : radius * 0.6;

    const currentRadius = interpolate(morphProgress, [0, 1], [rCircle, rPolygon]);

    const x = Math.cos(baseAngle) * currentRadius;
    const y = Math.sin(baseAngle) * currentRadius;

    return { i, x, y };
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
        <svg
          style={{
            position: 'absolute',
            left: -500,
            top: -500,
            width: 1000,
            height: 1000,
            pointerEvents: 'none',
          }}
        >
          <polygon
            points={vertices.map((v) => `${v.x + 500},${v.y + 500}`).join(' ')}
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
            opacity={0.7}
            style={{ filter: `drop-shadow(0 0 8px ${primaryColor})` }}
          />
        </svg>

        {vertices.map((v) => (
          <div
            key={v.i}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${v.x}px, ${v.y}px)`,
            }}
          >
            {renderVertex ? renderVertex(v.i, v.x, v.y) : (
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: primaryColor,
                  boxShadow: `0 0 12px ${primaryColor}`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
