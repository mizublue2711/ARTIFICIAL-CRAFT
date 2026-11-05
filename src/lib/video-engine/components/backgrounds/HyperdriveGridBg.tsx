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
  accentColor,
  ringCount = 12,
  className,
  style,
}) => {
  const effectiveAccent = accentColor || primaryColor;
  let hookFrame = 0;
  let isInRemotion = true;
  try {
    hookFrame = useCurrentFrame();
  } catch {
    hookFrame = 0;
    isInRemotion = false;
  }

  const [animFrame, setAnimFrame] = React.useState(0);

  React.useEffect(() => {
    if (frameProp !== undefined || isInRemotion) return;
    let animId: number;
    let startTime = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setAnimFrame(Math.floor(elapsed * 60));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [frameProp, isInRemotion]);

  const frame = frameProp ?? (isInRemotion ? hookFrame : animFrame);

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
        const ringBorderColor = idx % 2 === 0 ? primaryColor : effectiveAccent;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              border: `2px solid ${ringBorderColor}`,
              borderRadius: '12px',
              transform: `scale(${scale})`,
              opacity,
              boxShadow: `0 0 20px ${ringBorderColor}40`,
            }}
          />
        );
      })}

      {/* Radial perspective rays radiating from center */}
      {Array.from({ length: 16 }).map((_, rIdx) => {
        const angle = (rIdx / 16) * 360;
        const rayColor = rIdx % 2 === 0 ? primaryColor : effectiveAccent;
        return (
          <div
            key={rIdx}
            style={{
              position: 'absolute',
              width: '1000px',
              height: '1px',
              backgroundColor: `${rayColor}30`,
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
          backgroundColor: effectiveAccent,
          boxShadow: `0 0 40px ${effectiveAccent}, 0 0 80px ${primaryColor}`,
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};
