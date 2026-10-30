import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface QuantumWaveformBgProps extends BasePresetProps {
  waveCount?: number;
}

export const QuantumWaveformBg: React.FC<QuantumWaveformBgProps> = ({
  frame: frameProp,
  backgroundColor = '#050505',
  primaryColor = '#00E5FF',
  secondaryColor = '#7000FF',
  waveCount = 5,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const width = 1920;
  const height = 1080;
  const points = 80;

  const generateSvgPath = (waveIndex: number) => {
    const speed = 0.03 + waveIndex * 0.01;
    const freq = 0.005 + waveIndex * 0.002;
    const amplitude = 80 + waveIndex * 25;
    const centerY = height / 2 + (waveIndex - waveCount / 2) * 40;

    let path = '';
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const sinVal = Math.sin(x * freq + frame * speed);
      const cosVal = Math.cos(x * freq * 1.5 - frame * speed * 0.8);
      const y = centerY + (sinVal * cosVal) * amplitude;

      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    return path;
  };

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
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        {Array.from({ length: waveCount }).map((_, wIdx) => {
          const path = generateSvgPath(wIdx);
          const strokeColor = wIdx % 2 === 0 ? primaryColor : secondaryColor;
          const opacity = interpolate(
            Math.sin(frame * 0.05 + wIdx),
            [-1, 1],
            [0.35, 0.85]
          );

          return (
            <path
              key={wIdx}
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2 + wIdx * 0.5}
              opacity={opacity}
              style={{
                filter: `drop-shadow(0 0 10px ${strokeColor})`,
              }}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
