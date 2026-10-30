import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

export interface MetricItem {
  label: string;
  value: string;
}

export interface SceneProps {
  title?: string;
  subtitle?: string;
  mockupImageUrl?: string;
  metrics?: MetricItem[];
  ctaText?: string;
}

export const ArtificialCraftScene: React.FC<SceneProps> = ({
  title = 'ARTIFICIAL CRAFT AUTOMATION',
  subtitle = 'Where Meticulous Graphic Design Meets Deterministic AI Automation.',
  mockupImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  metrics = [
    { label: 'LATENCY', value: '12ms' },
    { label: 'ACCURACY', value: '99.9%' },
    { label: 'THROUGHPUT', value: '10k req/s' },
  ],
  ctaText = 'LAUNCH STUDIO',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // KEY 1: Kinetic Camera Zoom & Pan
  const cameraScale = interpolate(frame, [0, 150], [1.0, 1.04], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateRight: 'clamp',
  });
  const cameraPanX = interpolate(frame, [0, 150], [-5, 5]);

  // KEY 2: Swiss Stagger Animations using Remotion spring
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const titleY = interpolate(frame, [6, 22], [40, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOpacity = interpolate(frame, [6, 18], [0, 1], { extrapolateRight: 'clamp' });

  const mockupSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const buttonSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  // KEY 4: Velocity Motion Blur Dynamic Calculation
  const currentY = interpolate(frame, [12, 30], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const prevY = interpolate(Math.max(0, frame - 1), [12, 30], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const velocity = Math.abs(currentY - prevY);
  const blurAmount = Math.min(6, velocity * 0.4);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
      {/* CAMERA WRAPPER */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${cameraScale}) translateX(${cameraPanX}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          boxSizing: 'border-box',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#FFFFFF',
        }}
      >
        {/* L1: SWISS GRID & BACKGROUND BORDER */}
        <div
          style={{
            position: 'absolute',
            inset: 40,
            border: '1px solid #222222',
            opacity: bgOpacity,
            pointerEvents: 'none',
          }}
        />

        {/* HEADER SECTION (STAGGERED TITLE) */}
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div style={{ color: '#00E5FF', fontSize: '14px', marginBottom: '8px' }}>
            SYS//TELEMETRY: ARTIFICIAL CRAFT AUTOMATION
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-2px', margin: 0, textTransform: 'uppercase' }}>
            {title}
          </h1>
          <p style={{ color: '#888888', fontSize: '20px', marginTop: '12px' }}>{subtitle}</p>
        </div>

        {/* KEY 3: 3D TRANSFORMED APP MOCKUP WITH MOTION BLUR */}
        <div
          style={{
            perspective: '1200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20px 0',
          }}
        >
          <div
            style={{
              transform: `rotateX(10deg) rotateY(-12deg) scale(${mockupSpring})`,
              filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none',
              border: '1px solid #333333',
              boxShadow: '0px 20px 50px rgba(0, 229, 255, 0.15)',
              backgroundColor: '#0D0D0D',
              borderRadius: '0px',
              padding: '12px',
            }}
          >
            <img
              src={mockupImageUrl}
              alt="App Mockup"
              style={{ width: '800px', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* FOOTER METRICS & BUTTON (FRAME 20 STAGGER) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: `scale(${buttonSpring})`,
            opacity: buttonSpring,
          }}
        >
          <div style={{ display: 'flex', gap: '40px' }}>
            {metrics.map((m, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid #00E5FF', paddingLeft: '12px' }}>
                <div style={{ fontSize: '12px', color: '#666666' }}>{m.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: '#00E5FF',
              color: '#000000',
              padding: '16px 32px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {ctaText} ⚡
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
