import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MeshViewportSequenceProps {
  base_component?: string;
  assemblyStage?: number; // 0 to 100%
  primaryColor?: string;
  accentColor?: string;
  wireframe?: boolean;
}

export const MeshViewportSequence: React.FC<MeshViewportSequenceProps> = ({
  base_component = 'kinematic_manipulator_arm',
  assemblyStage = 33,
  primaryColor = '#5322FF',
  accentColor = '#00E5FF',
  wireframe = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Dynamic rotation loop
  const rotationY = frame * 1.2;
  const rotationX = 24 + Math.sin(frame * 0.05) * 6;

  // Exploded separation displacement based on assemblyStage (0-100)
  const separation = (assemblyStage / 100) * 45;
  const pulseScale = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.98, 1.02]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        transform: `scale(${entrance * pulseScale})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '320px',
          height: '320px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Layer 0: Core Unibody Hub / Base Stator */}
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            border: `2px ${wireframe ? 'dashed' : 'solid'} ${primaryColor}`,
            backgroundColor: `${primaryColor}15`,
            boxShadow: `0 0 30px ${primaryColor}40, inset 0 0 20px ${primaryColor}20`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateZ(${-separation}px)`,
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              border: `1px solid ${accentColor}`,
              borderRadius: '50%',
              boxShadow: `0 0 20px ${accentColor}60`,
              transform: `rotate(${frame * 2}deg)`,
            }}
          />
        </div>

        {/* Layer 1: Kinematic Actuators / Joint Rings */}
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            border: `2px solid ${accentColor}`,
            backgroundColor: 'transparent',
            boxShadow: `0 0 25px ${accentColor}30`,
            transform: `translateZ(0px) rotate(${frame * 0.8}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
          }}
        >
          <div style={{ width: '12px', height: '12px', background: primaryColor }} />
          <div style={{ width: '12px', height: '12px', background: accentColor }} />
        </div>

        {/* Layer 2: Outer Tactile Aerogel Shell / End-Effector Array */}
        <div
          style={{
            position: 'absolute',
            inset: '0px',
            border: `1.5px ${wireframe ? 'dotted' : 'solid'} ${accentColor}`,
            boxShadow: `0 0 40px ${accentColor}50`,
            transform: `translateZ(${separation}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontFamily: 'JetBrains Mono, monospace',
              color: accentColor,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            ACTUATOR: {base_component}
          </div>
          <div
            style={{
              fontSize: '9px',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#A1A1AA',
              alignSelf: 'flex-end',
            }}
          >
            STAGE_DISPLACEMENT: {assemblyStage}%
          </div>
        </div>

        {/* Center Optical Beam / Raycast Laser */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}`,
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  );
};
