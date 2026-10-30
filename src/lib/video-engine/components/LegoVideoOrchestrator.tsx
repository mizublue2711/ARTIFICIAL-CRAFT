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

  const primary = props.primaryColor || '#00E5FF';
  const accent = props.accentColor || '#5322ff';

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const objectScale = interpolate(frame, [0, 180], [1.0, 1.08]);

  // Background visual generator
  const renderBackground = () => {
    switch (slots.backgroundId) {
      case 'DOT_MATRIX':
        return {
          backgroundImage: `radial-gradient(${accent} 2px, transparent 2px)`,
          backgroundSize: '24px 24px',
        };
      case 'CAD_BLUEPRINT':
        return {
          backgroundImage: `linear-gradient(to right, ${primary}33 1px, transparent 1px), linear-gradient(to bottom, ${primary}33 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        };
      case 'CRT_SCANLINES':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, #000000 0px, #000000 2px, transparent 2px, transparent 4px)`,
        };
      case 'CYBER_RAIN':
        return {
          backgroundImage: `linear-gradient(180deg, rgba(0,229,255,0.15) 0%, rgba(83,34,255,0.05) 100%), linear-gradient(90deg, ${primary}22 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 20px 20px',
        };
      case 'GOLD_AMBER':
        return {
          backgroundImage: `radial-gradient(circle at center, #F59E0B22 0%, transparent 70%), linear-gradient(to right, #F59E0B33 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 36px 36px',
        };
      case 'DARK_VOID':
        return {
          backgroundColor: '#050507',
        };
      case 'NEON_GRADIENT':
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accent}44 0%, ${primary}11 60%, transparent 100%)`,
        };
      case 'TECHNICAL_MESH':
        return {
          backgroundImage: `linear-gradient(45deg, ${primary}22 25%, transparent 25%), linear-gradient(-45deg, ${primary}22 25%, transparent 25%)`,
          backgroundSize: '40px 40px',
        };
      case 'SWISS_GRID':
      default:
        return {
          backgroundImage: `linear-gradient(to right, ${primary}22 1px, transparent 1px), linear-gradient(to bottom, ${primary}22 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        };
    }
  };

  // 3D Hero Object Visual generator
  const renderHeroObject = () => {
    switch (slots.heroObjectId) {
      case 'PARTICLE_SPHERE':
        return (
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: `2px dashed ${primary}`,
              boxShadow: `0 0 50px ${primary}88, inset 0 0 30px ${accent}88`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${objectScale}) rotate(${frame * 1.5}deg)`,
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: primary,
                boxShadow: `0 0 30px ${primary}`,
              }}
            />
          </div>
        );

      case 'WIREFRAME_TORUS':
        return (
          <div
            style={{
              width: '200px',
              height: '120px',
              borderRadius: '50%',
              border: `3px double ${primary}`,
              boxShadow: `0 0 40px ${primary}66`,
              transform: `scale(${objectScale}) rotateX(60deg) rotateZ(${frame * 2}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '60px',
                borderRadius: '50%',
                border: `2px solid ${accent}`,
              }}
            />
          </div>
        );

      case 'NEURAL_ANCHOR':
        return (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              transform: `scale(${objectScale})`,
            }}
          >
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                style={{
                  width: `${50 + idx * 20}px`,
                  height: `${50 + idx * 20}px`,
                  border: `2px solid ${idx % 2 === 0 ? primary : accent}`,
                  transform: `rotate(${frame * (idx + 1)}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '8px', height: '8px', backgroundColor: primary }} />
              </div>
            ))}
          </div>
        );

      case 'CYBER_PYRAMID':
        return (
          <div
            style={{
              width: '140px',
              height: '140px',
              borderLeft: '70px solid transparent',
              borderRight: '70px solid transparent',
              borderBottom: `120px solid ${primary}44`,
              position: 'relative',
              transform: `scale(${objectScale}) rotateY(${frame}deg)`,
              filter: `drop-shadow(0 0 25px ${accent})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '-40px',
                borderLeft: '40px solid transparent',
                borderRight: '40px solid transparent',
                borderBottom: `80px solid ${accent}`,
              }}
            />
          </div>
        );

      case 'ISOMETRIC_CUBE':
      default:
        return (
          <div
            style={{
              transform: `scale(${objectScale}) rotateY(${frame * 0.8}deg)`,
              border: `2px solid ${primary}`,
              boxShadow: `0px 0px 40px ${accent}66`,
              backgroundColor: '#07070A',
              padding: '32px 64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ color: primary, fontSize: '18px', fontWeight: 'bold' }}>
              HERO_OBJECT: {slots.heroObjectId}
            </div>
            <div style={{ color: '#A1A1AA', fontSize: '12px' }}>
              DISPERSION: {props.dispersionAmount.toFixed(2)} | ROTATE_X: {props.rotateXDeg}°
            </div>
          </div>
        );
    }
  };

  // HUD Overlay Visual generator
  const renderOverlay = () => {
    switch (slots.overlayId) {
      case 'TELEMETRY_GRID':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              border: `1px solid ${primary}44`,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: primary, fontSize: '10px' }}>
              <span>HUD//TELEMETRY_ACTIVE</span>
              <span>FPS: 60 // RES: 1920x1080</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', fontSize: '10px' }}>
              <span>LATENCY: 12ms</span>
              <span>SLOT: [{slots.overlayId}]</span>
            </div>
          </div>
        );

      case 'SCANLINES':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
            }}
          />
        );

      case 'SWISS_DIMENSION':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 30,
              pointerEvents: 'none',
              border: `1px stroke ${primary}`,
            }}
          >
            <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', color: primary, fontSize: '11px' }}>
              ΔX = 1920mm
            </div>
            <div style={{ position: 'absolute', left: '-25px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', color: primary, fontSize: '11px' }}>
              ΔY = 1080mm
            </div>
          </div>
        );

      case 'VECTOR_RETICLE':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '450px',
                height: '450px',
                border: `1px stroke ${primary}44`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '200px', height: '200px', border: `1px stroke ${accent}`, borderRadius: '50%' }} />
            </div>
          </div>
        );

      case 'CROSSHAIRS':
      default:
        return (
          <div style={{ position: 'absolute', inset: 20, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, color: primary, fontSize: '14px' }}>+</div>
            <div style={{ position: 'absolute', top: 0, right: 0, color: primary, fontSize: '14px' }}>+</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, color: primary, fontSize: '14px' }}>+</div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, color: primary, fontSize: '14px' }}>+</div>
          </div>
        );
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor || '#09090b', overflow: 'hidden' }}>
      {/* 3D CAMERA WRAPPER */}
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
            border: `1px solid ${primary}33`,
            ...renderBackground(),
            pointerEvents: 'none',
          }}
        />

        {/* LAYER 2: KINETIC TYPOGRAPHY HEADLINE */}
        <div style={{ zIndex: 10, opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 30}px)` }}>
          <div
            style={{
              color: primary,
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
              textShadow: slots.textId === 'NEON_BOLD' ? `0 0 30px ${accent}` : 'none',
            }}
          >
            {props.textLine1}
          </h1>
          <p style={{ color: `${primary}CC`, fontSize: '22px', marginTop: '12px' }}>
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
          {renderHeroObject()}
        </div>

        {/* LAYER 4: HUD OVERLAY & FOOTER TELEMETRY */}
        {renderOverlay()}

        <div
          style={{
            zIndex: 15,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${primary}44`,
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#666666' }}>SLOT_OVERLAY</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: primary }}>
                {slots.overlayId}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666666' }}>DISPERSION_CLAMP</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: accent }}>
                {props.dispersionAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: primary,
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
