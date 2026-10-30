import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DualEngineCardProps {
  node1?: string;
  node2?: string;
  primaryColor?: string;
  accentCyan?: string;
  scale?: number;
  submeshDispersion?: number;
}

export const DualEngineCard: React.FC<DualEngineCardProps> = ({
  node1 = 'DIFY BRAIN',
  node2 = 'N8N MUSCLE',
  primaryColor = '#5322ff',
  accentCyan = '#00E5FF',
  scale = 1.0,
  submeshDispersion = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14 },
  });

  const dashOffset = (frame * 8) % 100;
  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.05;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '1000px',
          height: '320px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale * entrance}) translateZ(${submeshDispersion * 400}px)`,
          opacity: 1 - submeshDispersion * 0.8,
        }}
      >
        {/* Connecting SVG Laser Path */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Main static beam */}
          <path
            d="M 320 160 C 420 80, 580 240, 680 160"
            fill="none"
            stroke={`${primaryColor}88`}
            strokeWidth="3"
          />
          {/* Animated Cyan Laser Pulse */}
          <path
            d="M 320 160 C 420 80, 580 240, 680 160"
            fill="none"
            stroke={accentCyan}
            strokeWidth="5"
            strokeDasharray="20 15"
            strokeDashoffset={-dashOffset}
            style={{
              filter: `drop-shadow(0 0 10px ${accentCyan})`,
            }}
          />
        </svg>

        {/* NODE 1: DIFY BRAIN */}
        <div
          style={{
            width: '320px',
            height: '220px',
            backgroundColor: '#0A0A14',
            border: `2px solid ${accentCyan}`,
            boxShadow: `0 0 30px ${accentCyan}40, inset 0 0 20px ${accentCyan}20`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 2,
            transform: `scale(${pulseScale})`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: accentCyan,
                color: '#050505',
                fontSize: '10px',
                fontWeight: 900,
                padding: '3px 8px',
                letterSpacing: '1px',
                fontFamily: 'monospace',
              }}
            >
              ENGINE_01
            </span>
            <span style={{ fontSize: '11px', color: accentCyan, fontFamily: 'monospace' }}>
              AI INTELLIGENCE
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '2px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {node1}
            </div>
            <div style={{ fontSize: '12px', color: '#888888', marginTop: '6px' }}>
              Cognitive Reasoning & Context Processing
            </div>
          </div>

          <div
            style={{
              fontSize: '11px',
              color: accentCyan,
              fontFamily: 'monospace',
              borderTop: `1px solid ${accentCyan}40`,
              paddingTop: '8px',
            }}
          >
            STATUS: ACTIVE // 100% SLA
          </div>
        </div>

        {/* NODE 2: N8N MUSCLE */}
        <div
          style={{
            width: '320px',
            height: '220px',
            backgroundColor: '#0A0A14',
            border: `2px solid ${primaryColor}`,
            boxShadow: `0 0 30px ${primaryColor}60, inset 0 0 20px ${primaryColor}20`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                backgroundColor: primaryColor,
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 900,
                padding: '3px 8px',
                letterSpacing: '1px',
                fontFamily: 'monospace',
              }}
            >
              ENGINE_02
            </span>
            <span style={{ fontSize: '11px', color: primaryColor, fontFamily: 'monospace' }}>
              WORKFLOW EXECUTION
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '2px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {node2}
            </div>
            <div style={{ fontSize: '12px', color: '#888888', marginTop: '6px' }}>
              Deterministic Orchestration & Multi-Node Dispatch
            </div>
          </div>

          <div
            style={{
              fontSize: '11px',
              color: primaryColor,
              fontFamily: 'monospace',
              borderTop: `1px solid ${primaryColor}40`,
              paddingTop: '8px',
            }}
          >
            PIPELINE: SYNCHRONIZED
          </div>
        </div>
      </div>
    </div>
  );
};
