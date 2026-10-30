import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const PortfolioAllocator: React.FC<IllustrationProps> = ({ seed = 'default_allocator', className = '' }) => {
  const [activeSlice, setActiveSlice] = useState<number | null>(0);

  const slices = [
    { label: 'EQUITIES', value: '40%', color: '#00E5FF', fill: '#00E5FF22', path: 'M 200,30 A 70,70 0 0,1 270,100 L 235,100 A 35,35 0 0,0 200,65 Z' },
    { label: 'PRIV_CREDIT', value: '25%', color: '#5322FF', fill: '#5322FF22', path: 'M 270,100 A 70,70 0 0,1 200,170 L 200,135 A 35,35 0 0,0 235,100 Z' },
    { label: 'DIGITAL_ASSETS', value: '20%', color: '#10B981', fill: '#10B98122', path: 'M 200,170 A 70,70 0 0,1 130,100 L 165,100 A 35,35 0 0,0 200,135 Z' },
    { label: 'REAL_ESTATE', value: '15%', color: '#F59E0B', fill: '#F59E0B22', path: 'M 130,100 A 70,70 0 0,1 200,30 L 200,65 A 35,35 0 0,0 165,100 Z' },
  ];

  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="allocator-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1" fill="#00E5FF" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#allocator-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">PORTFOLIO_ALLOCATOR // ASSET TIERING</span>
        <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">ALLOCATION_MATRIX</span>
      </div>

      {/* Main SVG Visualization */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-[160px]">
          {/* Outer Concentric Radar Ring */}
          <circle cx="200" cy="100" r="85" fill="none" stroke="#27272A" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="100" r="20" fill="#0B0B0F" stroke="#00E5FF" strokeWidth="1.5" />

          {/* Donut Slices */}
          {slices.map((slice, idx) => {
            const isHovered = activeSlice === idx;
            return (
              <g
                key={slice.label}
                onMouseEnter={() => setActiveSlice(idx)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d={slice.path}
                  fill={slice.fill}
                  stroke={slice.color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-200"
                  transform={isHovered ? 'scale(1.03)' : 'scale(1)'}
                  transform-origin="200 100"
                />
              </g>
            );
          })}

          {/* Center Core HUD Telemetry */}
          <text x="200" y="97" textAnchor="middle" fill="#00E5FF" fontSize="7" fontWeight="bold">SEED</text>
          <text x="200" y="106" textAnchor="middle" fill="#A1A1AA" fontSize="6">{seed.slice(0, 8)}</text>

          {/* Telemetry Cards / Legend */}
          <g transform="translate(10, 35)">
            {slices.map((s, i) => (
              <g key={s.label} transform={`translate(0, ${i * 34})`} className="cursor-pointer" onClick={() => setActiveSlice(i)}>
                <rect
                  x="0"
                  y="0"
                  width="105"
                  height="26"
                  fill={activeSlice === i ? '#181824' : '#12121A'}
                  stroke={activeSlice === i ? s.color : '#27272A'}
                  strokeWidth="1"
                  rx="2"
                />
                <circle cx="10" cy="13" r="3" fill={s.color} />
                <text x="18" y="12" fill="#E4E4E7" fontSize="8" fontWeight="bold">{s.label}</text>
                <text x="18" y="21" fill={s.color} fontSize="8" fontWeight="bold">{s.value}</text>
              </g>
            ))}
          </g>

          {/* Right Active Details Panel */}
          <g transform="translate(290, 45)">
            <rect x="0" y="0" width="100" height="110" fill="#09090D" stroke="#27272A" strokeWidth="1" rx="2" />
            <text x="10" y="20" fill="#71717A" fontSize="7">SELECTED TIER</text>
            <text x="10" y="34" fill={slices[activeSlice ?? 0].color} fontSize="9" fontWeight="bold">
              {slices[activeSlice ?? 0].label}
            </text>
            <line x1="10" y1="42" x2="90" y2="42" stroke="#27272A" strokeWidth="1" />

            <text x="10" y="56" fill="#A1A1AA" fontSize="7">SHARE:</text>
            <text x="50" y="56" fill="#00E5FF" fontSize="8" fontWeight="bold">{slices[activeSlice ?? 0].value}</text>

            <text x="10" y="70" fill="#A1A1AA" fontSize="7">RISK_WEIGHT:</text>
            <text x="68" y="70" fill="#10B981" fontSize="8">LOW-MED</text>

            <text x="10" y="84" fill="#A1A1AA" fontSize="7">STATUS:</text>
            <text x="50" y="84" fill="#38BDF8" fontSize="8">OPTIMAL</text>

            <text x="10" y="98" fill="#71717A" fontSize="6">REBALANCED</text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>TOTAL AUM: $1.2B // REBALANCED: DAILY</span>
        <span>PORTFOLIO_ENGINE_v2.4</span>
      </div>
    </div>
  );
};
