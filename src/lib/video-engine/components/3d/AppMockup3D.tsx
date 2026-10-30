import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AppMockup3DProps {
  title?: string;
  primaryColor?: string;
}

export const AppMockup3D: React.FC<AppMockup3DProps> = ({
  title = 'Interactive Dashboard',
  primaryColor = '#0052FF',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  const rotateX = interpolate(entrance, [0, 1], [25, 5]);
  const rotateY = interpolate(entrance, [0, 1], [-15, -2]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        perspective: '1000px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          width: '700px',
          height: '420px',
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          border: `2px solid ${primaryColor}`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px ${primaryColor}44`,
          padding: '24px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', color: primaryColor }}>{title}</h2>
        <div style={{ flex: 1, backgroundColor: '#0F172A', borderRadius: '8px', padding: '16px' }}>
          <div style={{ height: '20px', width: '60%', backgroundColor: '#334155', borderRadius: '4px', marginBottom: '12px' }} />
          <div style={{ height: '14px', width: '80%', backgroundColor: '#1E293B', borderRadius: '4px', marginBottom: '8px' }} />
          <div style={{ height: '14px', width: '45%', backgroundColor: '#1E293B', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
};
