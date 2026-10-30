import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const CandlestickStream: React.FC<IllustrationProps> = ({ className = '' }) => {
  const [hoveredCandle, setHoveredCandle] = useState<number | null>(4);

  // Candlestick data points [open, high, low, close]
  const candles = [
    { x: 50, open: 120, high: 90, low: 140, close: 100, isBull: true },
    { x: 80, open: 100, high: 80, low: 125, close: 115, isBull: false },
    { x: 110, open: 115, high: 75, low: 130, close: 85, isBull: true },
    { x: 140, open: 85, high: 60, low: 100, close: 70, isBull: true },
    { x: 170, open: 70, high: 50, low: 90, close: 80, isBull: false },
    { x: 200, open: 80, high: 55, low: 95, close: 65, isBull: true },
    { x: 230, open: 65, high: 45, low: 80, close: 50, isBull: true },
    { x: 260, open: 50, high: 40, low: 75, close: 60, isBull: false },
    { x: 290, open: 60, high: 35, low: 70, close: 42, isBull: true },
  ];

  // EMA Moving Average Line Points
  const ema20Points = candles.map((c) => `${c.x},${(c.high + c.low) / 2 - 5}`).join(' ');
  const ema50Points = candles.map((c) => `${c.x},${(c.high + c.low) / 2 + 10}`).join(' ');

  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="candle-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#candle-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">CANDLESTICK_STREAM // VOLATILITY MATRIX</span>
        <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">HIGH_FREQ_STREAM</span>
      </div>

      {/* Main SVG Visualization */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-[160px]">
          {/* Price Axis Gridlines */}
          <g stroke="#27272A" strokeWidth="1" strokeDasharray="2 2">
            <line x1="30" y1="40" x2="330" y2="40" />
            <line x1="30" y1="80" x2="330" y2="80" />
            <line x1="30" y1="120" x2="330" y2="120" />
            <line x1="30" y1="150" x2="330" y2="150" />
          </g>

          {/* Volume Bars at Bottom */}
          {candles.map((c, i) => (
            <rect
              key={`vol-${i}`}
              x={c.x - 6}
              y="155"
              width="12"
              height={30 - (c.high - c.low) * 0.2}
              fill={c.isBull ? '#10B98144' : '#EF444444'}
              stroke={c.isBull ? '#10B981' : '#EF4444'}
              strokeWidth="0.5"
            />
          ))}

          {/* EMA Moving Average Curves */}
          <polyline points={ema20Points} fill="none" stroke="#00E5FF" strokeWidth="1.5" />
          <polyline points={ema50Points} fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Candlesticks */}
          {candles.map((c, idx) => {
            const isHovered = hoveredCandle === idx;
            const candleTop = Math.min(c.open, c.close);
            const candleHeight = Math.max(Math.abs(c.open - c.close), 4);
            const color = c.isBull ? '#10B981' : '#EF4444';

            return (
              <g
                key={`candle-${idx}`}
                onMouseEnter={() => setHoveredCandle(idx)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Upper and Lower Wicks */}
                <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={color} strokeWidth="1.5" />

                {/* Candle Body */}
                <rect
                  x={c.x - 6}
                  y={candleTop}
                  width="12"
                  height={candleHeight}
                  fill={c.isBull ? color : '#09090D'}
                  stroke={color}
                  strokeWidth={isHovered ? 2 : 1}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Right Price Telemetry Panel */}
          <g transform="translate(335, 30)">
            <rect x="0" y="0" width="60" height="130" fill="#12121A" stroke="#27272A" strokeWidth="1" rx="2" />
            <text x="30" y="18" textAnchor="middle" fill="#00E5FF" fontSize="7" fontWeight="bold">PRICE</text>
            <line x1="5" y1="24" x2="55" y2="24" stroke="#27272A" strokeWidth="1" />

            <text x="30" y="40" textAnchor="middle" fill="#10B981" fontSize="8" fontWeight="bold">$14,280</text>
            <text x="30" y="52" textAnchor="middle" fill="#10B981" fontSize="7">+4.82%</text>

            <line x1="5" y1="62" x2="55" y2="62" stroke="#27272A" strokeWidth="1" />
            <text x="30" y="76" textAnchor="middle" fill="#71717A" fontSize="6">EMA 20</text>
            <text x="30" y="86" textAnchor="middle" fill="#00E5FF" fontSize="7">$14,195</text>

            <text x="30" y="100" textAnchor="middle" fill="#71717A" fontSize="6">EMA 50</text>
            <text x="30" y="110" textAnchor="middle" fill="#A855F7" fontSize="7">$13,980</text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>TICK_RATE: 100ms // ALPHA_GEN: +18.4%</span>
        <span>CANDLESTICK_ENGINE_v1.8</span>
      </div>
    </div>
  );
};
