import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MetricBadgeProps {
  label: string;
  value: string | number;
  accentColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  accentColor = '#00E5FF',
  borderColor = '#222222',
  backgroundColor = 'rgba(5, 5, 5, 0.85)',
  textColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();

  // Pseudo-random deterministic noise based on frame and label length for flickering effect
  const hash = (frame * 17 + label.length * 31) % 100;
  const isFlickering = hash < 12; // 12% flicker probability
  const glow = hash < 5;

  let displayValue = String(value);

  // If flickering, occasionally shift numerical values slightly or swap character for telemetry feel
  if (isFlickering && typeof value === 'string' && value.endsWith('%')) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      displayValue = `${(num + (hash % 3 === 0 ? -0.01 : 0.01)).toFixed(2)}%`;
    }
  } else if (isFlickering && typeof value === 'string' && value.endsWith('MS')) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      displayValue = `${(num + (hash % 2 === 0 ? 0.05 : -0.05)).toFixed(1)}MS`;
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor,
        border: `1px solid ${glow ? accentColor : borderColor}`,
        borderRadius: '0px', // Swiss Brutalism: strict 0px border-radius
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: '12px',
        color: textColor,
        boxShadow: glow ? `0 0 10px ${accentColor}40` : 'none',
        transition: 'border-color 0.1s ease',
      }}
    >
      <span
        style={{
          color: accentColor,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        {label}:
      </span>
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.5px',
          opacity: isFlickering ? 0.6 : 1.0,
        }}
      >
        {displayValue}
      </span>
    </div>
  );
};
