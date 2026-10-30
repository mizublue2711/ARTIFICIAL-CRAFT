import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface SwissGridHUDProps extends BasePresetProps {
  gridSize?: number;
  showScanLine?: boolean;
  showTelemetryCorners?: boolean;
  accentColor?: string;
  accentCyan?: string;
  cycleText?: string;
}

export const SwissGridHUD: React.FC<SwissGridHUDProps> = ({
  frame: frameProp,
  backgroundColor = '#050505',
  gridColor = '#1A1A24',
  primaryColor = '#00E5FF',
  accentColor,
  accentCyan,
  cycleText,
  gridSize = 60,
  showScanLine = true,
  showTelemetryCorners = true,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const effectiveAccent = accentCyan || accentColor || primaryColor;

  const scanProgress = (frame % 120) / 120;
  const laserY = interpolate(scanProgress, [0, 1], [0, 1080]);

  const laserOpacity = interpolate(
    Math.sin((frame / 60) * Math.PI * 2),
    [-1, 1],
    [0.7, 1.0]
  );

  return (
    <AbsoluteFill
      className={className}
      style={{
        backgroundColor,
        backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        ...style,
      }}
    >
      {showScanLine && (
        <>
          <div
            style={{
              position: 'absolute',
              top: `${laserY}px`,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent 0%, ${effectiveAccent} 20%, ${effectiveAccent} 80%, transparent 100%)`,
              boxShadow: `0 0 15px ${effectiveAccent}, 0 0 30px ${effectiveAccent}`,
              opacity: laserOpacity,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: `${laserY - 100}px`,
              left: 0,
              right: 0,
              height: '100px',
              background: `linear-gradient(180deg, transparent 0%, ${effectiveAccent}18 100%)`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        </>
      )}

      {showTelemetryCorners && (
        <>
          {/* Top Left */}
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
              color: effectiveAccent,
              fontSize: '12px',
              letterSpacing: '2px',
              opacity: 0.85,
              zIndex: 3,
            }}
          >
            ┌ SYS.HUD // 1920x1080 :: 60FPS
            <br />└ STAT: ACTIVE_OPERATIONAL
          </div>

          {/* Top Right */}
          <div
            style={{
              position: 'absolute',
              top: '32px',
              right: '32px',
              color: effectiveAccent,
              fontSize: '12px',
              letterSpacing: '2px',
              opacity: 0.85,
              zIndex: 3,
              textAlign: 'right',
            }}
          >
            FRAME: {String(frame).padStart(5, '0')} ┐
            <br />
            CLK: {(frame / 60).toFixed(2)}s ┘
          </div>

          {/* Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '32px',
              color: effectiveAccent,
              fontSize: '12px',
              letterSpacing: '2px',
              opacity: 0.85,
              zIndex: 3,
            }}
          >
            ┌ LATENCY: 0.04ms // SYNC: OK
            <br />└ BEAM_POS: Y={Math.round(laserY)}px
          </div>

          {/* Bottom Right */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: '32px',
              color: effectiveAccent,
              fontSize: '12px',
              letterSpacing: '2px',
              opacity: 0.85,
              zIndex: 3,
              textAlign: 'right',
            }}
          >
            {cycleText || 'MATRIX_RESONANCE: 99.8%'} ┐
            <br />
            PARAMETRIC_ENGINE_V2 ┘
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
