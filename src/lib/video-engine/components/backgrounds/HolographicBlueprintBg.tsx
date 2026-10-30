import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface HolographicBlueprintBgProps extends BasePresetProps {}

export const HolographicBlueprintBg: React.FC<HolographicBlueprintBgProps> = ({
  frame: frameProp,
  backgroundColor = '#030A16',
  primaryColor = '#00E5FF',
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const rotY = interpolate(frame, [0, 300], [0, 360]);
  const rotX = interpolate(Math.sin(frame * 0.02), [-1, 1], [15, 35]);

  return (
    <AbsoluteFill
      className={className}
      style={{
        backgroundColor,
        overflow: 'hidden',
        perspective: '1000px',
        fontFamily: "'JetBrains Mono', monospace",
        ...style,
      }}
    >
      {/* CAD Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${primaryColor}20 1px, transparent 1px),
            linear-gradient(90deg, ${primaryColor}20 1px, transparent 1px),
            linear-gradient(${primaryColor}0D 1px, transparent 1px),
            linear-gradient(90deg, ${primaryColor}0D 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        }}
      />

      {/* Rotating 3D Hologram Structure */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '600px',
            height: '600px',
            border: `2px dashed ${primaryColor}`,
            boxShadow: `0 0 30px ${primaryColor}40`,
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: 'preserve-3d',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner concentric blueprint rings */}
          <div
            style={{
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              border: `1px solid ${primaryColor}`,
              position: 'absolute',
            }}
          />
          <div
            style={{
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              border: `1px dashed ${primaryColor}`,
              position: 'absolute',
            }}
          />

          {/* Measurement Guidelines */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              color: primaryColor,
              fontSize: '11px',
            }}
          >
            <span>├─ 600.0mm ─┤</span>
            <span>CAD_MODEL_3D</span>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '-80px',
              top: '50%',
              transform: 'rotate(-90deg)',
              color: primaryColor,
              fontSize: '11px',
            }}
          >
            SCALE 1:1.0
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
