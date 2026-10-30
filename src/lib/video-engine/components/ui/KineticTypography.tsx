import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type KineticAnimationType =
  | 'TYPEWRITER_CHAR'
  | 'TRACK_MATTE_SLIDE'
  | 'BLUR_TO_SHARP'
  | 'STROKE_TRIM_PATH';

export interface KineticTypographyProps {
  text?: string;
  color?: string;
  accentColor?: string;
  mode?: 'scramble' | 'typewriter' | 'spring' | 'clip';
  animationType?: KineticAnimationType;
  fontSize?: string | number;
  letterSpacing?: string;
  className?: string;
}

const HEX_ASCII_GLYPHS = '0123456789ABCDEFabcdef!@#$%^&*()_+-=[]{}|;:,.<>?/X';

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text = 'DYNAMIC MOTION ENGINE',
  color = '#FFFFFF',
  accentColor = '#00E5FF',
  mode,
  animationType = 'TYPEWRITER_CHAR',
  fontSize = '48px',
  letterSpacing = '2px',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If explicit mode legacy prop is specified, map to animationType if not set
  const activeEngine: KineticAnimationType =
    animationType ||
    (mode === 'typewriter'
      ? 'TYPEWRITER_CHAR'
      : mode === 'clip'
      ? 'TRACK_MATTE_SLIDE'
      : mode === 'spring'
      ? 'BLUR_TO_SHARP'
      : 'TYPEWRITER_CHAR');

  const chars = text.split('');
  const totalChars = chars.length;

  // ENGINE 1: TYPEWRITER_CHAR - Character-by-character reveal with matrix holding
  if (activeEngine === 'TYPEWRITER_CHAR') {
    return (
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight: '700',
          letterSpacing,
          textTransform: 'uppercase',
        }}
      >
        {chars.map((char, index) => {
          if (char === ' ') {
            return <span key={index} style={{ width: '0.4em' }} />;
          }

          const charStartFrame = index * 2;
          const decodeFrames = 12;
          const charFrame = frame - charStartFrame;

          if (charFrame < 0) {
            return (
              <span
                key={index}
                style={{
                  opacity: 0.15,
                  color: `${accentColor}44`,
                }}
              >
                0
              </span>
            );
          }

          const isResolved = charFrame >= decodeFrames;
          let displayChar = char;

          if (!isResolved) {
            const glyphIndex = (frame * 11 + index * 17) % HEX_ASCII_GLYPHS.length;
            displayChar = HEX_ASCII_GLYPHS[glyphIndex];
          }

          return (
            <span
              key={index}
              style={{
                color: isResolved ? color : accentColor,
                opacity: isResolved ? 1 : 0.9,
                textShadow: !isResolved ? `0 0 10px ${accentColor}` : 'none',
              }}
            >
              {displayChar}
            </span>
          );
        })}
      </div>
    );
  }

  // ENGINE 2: TRACK_MATTE_SLIDE - Text sliding up/down from behind overflow mask
  if (activeEngine === 'TRACK_MATTE_SLIDE') {
    const slideSpring = spring({
      frame,
      fps,
      config: { damping: 14, mass: 0.6 },
    });
    const translateY = interpolate(slideSpring, [0, 1], [100, 0]);

    return (
      <div
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          padding: '4px 8px',
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}%)`,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
            fontWeight: '800',
            color,
            letterSpacing,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // ENGINE 3: BLUR_TO_SHARP - Blur(20px) + opacity 0 -> Blur(0px) + opacity 1
  if (activeEngine === 'BLUR_TO_SHARP') {
    const progress = spring({
      frame,
      fps,
      config: { damping: 16, mass: 0.5 },
    });
    const blurAmount = interpolate(progress, [0, 1], [20, 0]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);
    const scale = interpolate(progress, [0, 1], [1.15, 1.0]);

    return (
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight: '800',
          color,
          letterSpacing,
          textTransform: 'uppercase',
          filter: `blur(${blurAmount}px)`,
          opacity,
          transform: `scale(${scale})`,
          display: 'inline-block',
        }}
      >
        {text}
      </div>
    );
  }

  // ENGINE 4: STROKE_TRIM_PATH - SVG stroke reveal with write-on effect
  if (activeEngine === 'STROKE_TRIM_PATH') {
    const strokeProgress = interpolate(frame, [0, 30], [100, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const fillOpacity = interpolate(frame, [25, 45], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const parsedFontSize =
      typeof fontSize === 'number' ? fontSize : parseInt(fontSize, 10) || 48;

    return (
      <div
        style={{
          display: 'inline-block',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        <svg
          height={parsedFontSize * 1.5}
          width={text.length * (parsedFontSize * 0.7)}
          style={{ overflow: 'visible' }}
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill={color}
            fillOpacity={fillOpacity}
            stroke={accentColor}
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={strokeProgress}
            style={{
              fontSize: `${parsedFontSize}px`,
              fontWeight: 800,
              letterSpacing,
              textTransform: 'uppercase',
              filter: `drop-shadow(0 0 8px ${accentColor})`,
            }}
          >
            {text}
          </text>
        </svg>
      </div>
    );
  }

  return null;
};
