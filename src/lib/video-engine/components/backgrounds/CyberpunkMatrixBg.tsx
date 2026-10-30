import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { BasePresetProps } from '../../types/presets';

export interface CyberpunkMatrixBgProps extends BasePresetProps {
  columnCount?: number;
  charsPerColumn?: number;
}

const HEX_CHARS = '0123456789ABCDEF$#@%&*<>{}[]+=~?';

export const CyberpunkMatrixBg: React.FC<CyberpunkMatrixBgProps> = ({
  frame: frameProp,
  backgroundColor = '#050505',
  primaryColor = '#00E5FF',
  columnCount = 36,
  charsPerColumn = 24,
  className,
  style,
}) => {
  const hookFrame = useCurrentFrame();
  const frame = frameProp ?? hookFrame;

  const columns = Array.from({ length: columnCount }, (_, colIdx) => {
    const seed = colIdx * 1000;
    const speed = 0.4 + random(seed) * 0.8;
    const offset = random(seed + 1) * 100;
    const yOffset = ((frame * speed + offset) % (charsPerColumn + 12)) - 6;

    const chars = Array.from({ length: charsPerColumn }, (_, charIdx) => {
      const charSeed = seed + charIdx + Math.floor((frame + offset) / 6);
      const charChar = HEX_CHARS[Math.floor(random(charSeed) * HEX_CHARS.length)];

      const distanceHead = charIdx - yOffset;
      const isHead = Math.abs(distanceHead) < 0.8;
      const opacity = distanceHead < 0 && distanceHead > -12
        ? 1 - Math.abs(distanceHead) / 12
        : isHead ? 1 : 0.05;

      return {
        char: charChar,
        isHead,
        opacity,
      };
    });

    return {
      xPercent: (colIdx / columnCount) * 100,
      chars,
    };
  });

  return (
    <AbsoluteFill
      className={className}
      style={{
        backgroundColor,
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        ...style,
      }}
    >
      {/* Matrix rain columns */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        {columns.map((col, cIdx) => (
          <div
            key={cIdx}
            style={{
              position: 'absolute',
              left: `${col.xPercent}%`,
              top: 0,
              bottom: 0,
              width: `${100 / columnCount}%`,
              display: 'flex',
              flexDirection: 'column',
              fontSize: '18px',
              lineHeight: '24px',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {col.chars.map((item, rIdx) => (
              <span
                key={rIdx}
                style={{
                  color: item.isHead ? '#FFFFFF' : primaryColor,
                  opacity: item.opacity,
                  textShadow: item.isHead
                    ? `0 0 10px #FFFFFF, 0 0 20px ${primaryColor}`
                    : item.opacity > 0.4
                    ? `0 0 8px ${primaryColor}`
                    : 'none',
                  fontWeight: item.isHead ? 'bold' : 'normal',
                }}
              >
                {item.char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* CRT Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.25) 0px,
            rgba(0, 0, 0, 0.25) 2px,
            transparent 2px,
            transparent 4px
          )`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
    </AbsoluteFill>
  );
};
