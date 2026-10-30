import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MarqueeTickerProps {
  tickerText?: string;
  primaryColor?: string;
  accentCyan?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  tickerText = 'SYS//CONTINUOUS_ENGINE :: 60FPS :: DETERMINISTIC SLA: 99.99% :: ARTIFICIAL CRAFT ::',
  primaryColor = '#5322ff',
  accentCyan = '#00E5FF',
}) => {
  const frame = useCurrentFrame();

  // Infinite scroll offset
  const scrollOffset = (frame * 5) % 1200;

  const repeatedText = `${tickerText}  ${tickerText}  ${tickerText}  ${tickerText}  `;

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(5, 5, 10, 0.95)',
        borderTop: `2px solid ${primaryColor}`,
        borderBottom: `2px solid ${primaryColor}`,
        padding: '12px 0',
        overflow: 'hidden',
        boxShadow: `0 0 20px ${primaryColor}40`,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        zIndex: 30,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          transform: `translateX(-${scrollOffset}px)`,
          fontSize: '22px',
          fontWeight: 800,
          color: accentCyan,
          letterSpacing: '3px',
          textShadow: `0 0 10px ${accentCyan}AA`,
        }}
      >
        {repeatedText}
      </div>
    </div>
  );
};
