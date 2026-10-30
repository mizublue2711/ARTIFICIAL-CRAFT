import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface VolumetricFogHUDProps extends BasePresetProps {}

export const VolumetricFogHUD: React.FC<VolumetricFogHUDProps> = ({
  frame: frameProp,
  backgroundColor = '#040608',
  primaryColor = '#00E5FF',
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const flickerSeed = Math.floor(frame / 3);
  const isFlickering = random(flickerSeed) > 0.85;

  const fog1X = interpolate(Math.sin(frame * 0.01), [-1, 1], [-10, 10]);
  const fog1Y = interpolate(Math.cos(frame * 0.015), [-1, 1], [-8, 8]);

  return (
    <AbsoluteFill
      className={className}
      style={{
        backgroundColor,
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
        ...style,
      }}
    >
      {/* Volumetric Light Fog Blobs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
          filter: 'blur(80px)',
          transform: `translate(${fog1X}%, ${fog1Y}%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '25%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
          filter: 'blur(100px)',
          transform: `translate(${-fog1X}%, ${-fog1Y}%)`,
        }}
      />

      {/* Mechanical HUD indicators */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: primaryColor,
          opacity: isFlickering ? 0.3 : 0.9,
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: primaryColor,
            boxShadow: `0 0 10px ${primaryColor}`,
          }}
        />
        <span style={{ fontSize: '13px', letterSpacing: '2px' }}>
          ATMOS_DENSITY: 84.2% // FOG_LAYER_ACTIVE
        </span>
      </div>
    </AbsoluteFill>
  );
};
