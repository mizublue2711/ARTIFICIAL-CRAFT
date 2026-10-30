import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BentoGrid3DProps {
  node1?: string;
  node2?: string;
  node3?: string;
  primaryColor?: string;
  accentCyan?: string;
  scale?: number;
  submeshDispersion?: number; // 0 to 1 for submesh disintegration
}

export const BentoGrid3D: React.FC<BentoGrid3DProps> = ({
  node1 = 'AUTOMATION',
  node2 = 'PRECISION',
  node3 = 'SCALABILITY',
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
    config: { damping: 14, mass: 0.9 },
  });

  const tiltX = Math.sin(frame * 0.03) * 12 + 20;
  const tiltY = Math.cos(frame * 0.025) * 15 - 10;

  const cards = [
    { title: node1, tag: 'NODE_01 // AUTO', span: 'col-span-2' },
    { title: node2, tag: 'NODE_02 // SPEC', span: 'col-span-1' },
    { title: node3, tag: 'NODE_03 // SCALE', span: 'col-span-3' },
  ];

  return (
    <div
      style={{
        perspective: '1200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale * entrance}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 300px)',
          gridGap: '24px',
          padding: '24px',
          position: 'relative',
        }}
      >
        {cards.map((card, idx) => {
          const dispersionX = (idx - 1) * submeshDispersion * 300;
          const dispersionY = (idx % 2 === 0 ? 1 : -1) * submeshDispersion * 250;
          const dispersionZ = submeshDispersion * 500;
          const dispersionRot = submeshDispersion * 90;

          return (
            <div
              key={idx}
              style={{
                gridColumn: idx === 0 ? 'span 2' : idx === 1 ? 'span 1' : 'span 3',
                height: idx === 2 ? '140px' : '220px',
                backgroundColor: 'rgba(10, 10, 18, 0.85)',
                border: `2px solid ${primaryColor}`,
                boxShadow: `0 0 25px ${primaryColor}40, inset 0 0 15px ${primaryColor}20`,
                borderRadius: '0px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `translate3d(${dispersionX}px, ${dispersionY}px, ${dispersionZ}px) rotateX(${dispersionRot}deg) rotateZ(${dispersionRot * 0.5}deg)`,
                opacity: 1 - submeshDispersion * 0.8,
                transition: 'transform 0.1s ease',
              }}
            >
              {/* Corner tech crosshairs */}
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '8px',
                  fontSize: '10px',
                  color: accentCyan,
                  fontFamily: 'monospace',
                }}
              >
                [0x0{idx + 1}]
              </div>

              {/* Cyan badge */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 229, 255, 0.15)',
                    border: `1px solid ${accentCyan}`,
                    color: accentCyan,
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '0px',
                    letterSpacing: '1px',
                    fontFamily: 'monospace',
                  }}
                >
                  {card.tag}
                </span>
              </div>

              {/* Wireframe inner geometry line */}
              <div
                style={{
                  borderTop: `1px dashed ${primaryColor}`,
                  margin: '12px 0',
                }}
              />

              {/* Title */}
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {card.title}
              </div>

              {/* Triangular submesh overlay effect when dispersing */}
              {submeshDispersion > 0.1 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${accentCyan}33 10px, ${accentCyan}33 11px)`,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
