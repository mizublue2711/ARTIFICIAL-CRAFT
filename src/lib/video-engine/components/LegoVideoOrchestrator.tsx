import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { PlaygroundRecipe } from '../types/playground';

export const LegoVideoOrchestrator: React.FC<PlaygroundRecipe> = (recipe) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slots = recipe?.slots || {
    backgroundId: 'SWISS_GRID',
    heroObjectId: 'ISOMETRIC_CUBE',
    overlayId: 'CROSSHAIRS',
    textId: 'SWISS_BRUTALIST',
  };

  const props = recipe?.props || {
    primaryColor: '#00E5FF',
    accentColor: '#5322ff',
    backgroundColor: '#09090b',
    cameraZoom: 1.0,
    rotateXDeg: 28,
    dispersionAmount: 0.12,
    textLine1: 'ARTIFICIAL CRAFT',
    textLine2: 'Meticulous Graphic Design Meets Code',
  };

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const objectScale = interpolate(frame, [0, 180], [1.0, 1.08]);

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor || '#09090b', overflow: 'hidden' }}>
      {/* 3D CAMERA DEPTH & ROTATION WRAPPER */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${props.cameraZoom}) rotateX(${props.rotateXDeg}deg)`,
          perspective: '1200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          boxSizing: 'border-box',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {/* LAYER 1: BACKGROUND MESH / GRID */}
        <div
          style={{
            position: 'absolute',
            inset: 20,
            border: `1px solid ${props.primaryColor}33`,
            backgroundImage:
              slots.backgroundId === 'DOT_MATRIX'
                ? `radial-gradient(${props.accentColor} 1.5px, transparent 1.5px)`
                : `linear-gradient(to right, ${props.primaryColor}22 1px, transparent 1px), linear-gradient(to bottom, ${props.primaryColor}22 1px, transparent 1px)`,
            backgroundSize: slots.backgroundId === 'DOT_MATRIX' ? '24px 24px' : '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* LAYER 2: KINETIC TYPOGRAPHY HEADLINE */}
        <div style={{ zIndex: 10, opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 30}px)` }}>
          <div
            style={{
              color: props.primaryColor,
              fontSize: '14px',
              letterSpacing: '2px',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            SYS//SLOT: [{slots.backgroundId}] :: [{slots.textId}]
          </div>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              letterSpacing: '-2px',
              margin: 0,
              color: '#FFFFFF',
              textTransform: 'uppercase',
            }}
          >
            {props.textLine1}
          </h1>
          <p style={{ color: `${props.primaryColor}CC`, fontSize: '22px', marginTop: '12px' }}>
            {props.textLine2}
          </p>
        </div>

        {/* LAYER 3: 3D HERO OBJECT STAGE */}
        <div
          style={{
            perspective: '1200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <div
            style={{
              transform: `scale(${objectScale}) rotateY(${frame * 0.5}deg)`,
              border: `2px solid ${props.primaryColor}`,
              boxShadow: `0px 0px 40px ${props.accentColor}66`,
              backgroundColor: '#07070A',
              padding: '32px 64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ color: props.primaryColor, fontSize: '18px', fontWeight: 'bold' }}>
              HERO_OBJECT: {slots.heroObjectId}
            </div>
            <div style={{ color: '#A1A1AA', fontSize: '12px' }}>
              DISPERSION: {props.dispersionAmount.toFixed(2)} | ROTATE_X: {props.rotateXDeg}°
            </div>
          </div>
        </div>

        {/* LAYER 4: HUD OVERLAY & FOOTER TELEMETRY */}
        <div
          style={{
            zIndex: 15,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${props.primaryColor}44`,
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#666666' }}>SLOT_OVERLAY</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: props.primaryColor }}>
                {slots.overlayId}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666666' }}>DISPERSION_CLAMP</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: props.accentColor }}>
                {props.dispersionAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: props.primaryColor,
              color: '#000000',
              padding: '12px 28px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '14px',
            }}
          >
            ARTIFICIAL CRAFT ⚡
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default LegoVideoOrchestrator;
