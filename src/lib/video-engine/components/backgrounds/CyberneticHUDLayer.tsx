import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TelemetryData {
  slaTarget?: string;
  fps?: number;
}

export interface CyberneticHUDLayerProps {
  telemetry?: TelemetryData;
  primaryColor?: string;
  accentColor?: string;
  brandName?: string;
  assemblyStage?: number;
}

export const CyberneticHUDLayer: React.FC<CyberneticHUDLayerProps> = ({
  telemetry = { slaTarget: '<2ms', fps: 60 },
  primaryColor = '#5322FF',
  accentColor = '#00E5FF',
  brandName = 'ARTIFICIAL CRAFT',
  assemblyStage = 33,
}) => {
  const frame = useCurrentFrame();

  const scanProgress = (frame % 90) / 90;
  const laserY = interpolate(scanProgress, [0, 1], [0, 100]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        boxSizing: 'border-box',
        zIndex: 20,
      }}
    >
      {/* Top Telemetry Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              border: `1px solid ${accentColor}66`,
              backgroundColor: 'rgba(9, 9, 11, 0.75)',
              fontSize: '10px',
              color: accentColor,
              letterSpacing: '1px',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
            <span>SLA: {telemetry.fps || 60}FPS // LATENCY: {telemetry.slaTarget || '<2ms'}</span>
          </div>
          <div style={{ fontSize: '9px', color: '#71717A', letterSpacing: '1px' }}>
            ID: {brandName} // MATRIX_SYS
          </div>
        </div>

        {/* Reticle / Frame Telemetry */}
        <div
          style={{
            textAlign: 'right',
            padding: '3px 8px',
            border: `1px solid ${primaryColor}66`,
            backgroundColor: 'rgba(9, 9, 11, 0.75)',
            fontSize: '10px',
            color: '#FFFFFF',
          }}
        >
          <div style={{ color: primaryColor, fontWeight: 700 }}>
            STAGE: {assemblyStage}%
          </div>
          <div style={{ fontSize: '9px', color: '#A1A1AA' }}>
            FRAME: {String(frame).padStart(4, '0')}
          </div>
        </div>
      </div>

      {/* Crosshair Target Reticles at Corners */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, color: primaryColor, fontSize: '12px' }}>+</div>
        <div style={{ position: 'absolute', top: 10, right: 10, color: primaryColor, fontSize: '12px' }}>+</div>
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: primaryColor, fontSize: '12px' }}>+</div>
        <div style={{ position: 'absolute', bottom: 10, right: 10, color: primaryColor, fontSize: '12px' }}>+</div>

        {/* Dynamic Sweeping Horizon Laser Bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${laserY}%`,
            height: '1px',
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
            opacity: 0.35,
          }}
        />
      </div>

      {/* Bottom Telemetry Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${primaryColor}40`,
          paddingTop: '8px',
          fontSize: '10px',
          color: '#A1A1AA',
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>CYBERNETIC BRUTALISM</span>
          <span style={{ color: accentColor }}>KINEMATICS PIPELINE</span>
        </div>
        <div
          style={{
            backgroundColor: primaryColor,
            color: '#FFFFFF',
            padding: '2px 8px',
            fontWeight: 700,
            letterSpacing: '1px',
            fontSize: '9px',
          }}
        >
          AUTONOMOUS 60FPS
        </div>
      </div>
    </div>
  );
};
