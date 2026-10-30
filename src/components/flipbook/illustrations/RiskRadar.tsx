import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const RiskRadar: React.FC<IllustrationProps> = ({ className = '' }) => {
  const [activeAxis, setActiveAxis] = useState<number | null>(0);

  // 5 axes: Compliance (0°), ESG (72°), Liquidity (144°), Market (216°), Operational (288°)
  // Center is at (180, 100), max radius R = 70.
  const center = { x: 180, y: 100 };
  const maxR = 70;

  const axes = [
    { name: 'COMPLIANCE', value: 0.92, label: '92%', angle: -90 },
    { name: 'ESG_GOV', value: 0.88, label: '88%', angle: -18 },
    { name: 'LIQUIDITY', value: 0.95, label: '95%', angle: 54 },
    { name: 'MARKET_VAR', value: 0.78, label: '78%', angle: 126 },
    { name: 'OPERATIONAL', value: 0.90, label: '90%', angle: 198 },
  ];

  const getCoordinates = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center.x + radius * Math.cos(rad),
      y: center.y + radius * Math.sin(rad),
    };
  };

  // Polygon points for target risk envelope
  const polygonPoints = axes
    .map((axis) => {
      const pt = getCoordinates(axis.angle, maxR * axis.value);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Outer reference pentagon
  const outerPentagonPoints = axes
    .map((axis) => {
      const pt = getCoordinates(axis.angle, maxR);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Mid reference pentagon
  const midPentagonPoints = axes
    .map((axis) => {
      const pt = getCoordinates(axis.angle, maxR * 0.5);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="radar-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="#00E5FF" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#radar-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">RISK_RADAR // MULTI-AXIS ASSESSMENT</span>
        <span className="px-1.5 py-0.5 bg-violet-950 border border-violet-800 text-violet-400 font-bold">COMPLIANCE_RADAR</span>
      </div>

      {/* Main SVG Visualization */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-[160px]">
          {/* Concentric Reference Pentagons */}
          <polygon points={outerPentagonPoints} fill="none" stroke="#27272A" strokeWidth="1" strokeDasharray="2 2" />
          <polygon points={midPentagonPoints} fill="none" stroke="#27272A" strokeWidth="1" strokeDasharray="2 2" />

          {/* Radar Axes Lines */}
          {axes.map((axis, idx) => {
            const outerPt = getCoordinates(axis.angle, maxR);
            return (
              <line
                key={axis.name}
                x1={center.x}
                y1={center.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke={activeAxis === idx ? '#00E5FF' : '#27272A'}
                strokeWidth={activeAxis === idx ? 1.5 : 1}
              />
            );
          })}

          {/* Dynamic Vector Polygon for Risk Profile */}
          <polygon
            points={polygonPoints}
            fill="#00E5FF22"
            stroke="#00E5FF"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Axis Data Points */}
          {axes.map((axis, idx) => {
            const pt = getCoordinates(axis.angle, maxR * axis.value);
            const labelPt = getCoordinates(axis.angle, maxR + 16);
            const isHovered = activeAxis === idx;

            return (
              <g key={axis.name} onMouseEnter={() => setActiveAxis(idx)} className="cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#00E5FF' : '#5322FF'}
                  stroke="#00E5FF"
                  strokeWidth="1.5"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? '#00E5FF' : '#A1A1AA'}
                  fontSize="7"
                  fontWeight="bold"
                >
                  {axis.name}
                </text>
              </g>
            );
          })}

          {/* Center Point */}
          <circle cx={center.x} cy={center.y} r="3" fill="#00E5FF" />

          {/* Right Metrics Telemetry Board */}
          <g transform="translate(285, 25)">
            <rect x="0" y="0" width="105" height="150" fill="#12121A" stroke="#27272A" strokeWidth="1" rx="2" />
            <text x="10" y="18" fill="#00E5FF" fontSize="8" fontWeight="bold">RISK METRICS</text>
            <line x1="10" y1="24" x2="95" y2="24" stroke="#27272A" strokeWidth="1" />

            {axes.map((axis, i) => (
              <g key={axis.name} transform={`translate(10, ${36 + i * 22})`} className="cursor-pointer" onClick={() => setActiveAxis(i)}>
                <rect
                  x="-4"
                  y="-10"
                  width="93"
                  height="18"
                  fill={activeAxis === i ? '#181824' : 'transparent'}
                  rx="2"
                />
                <text x="0" y="0" fill={activeAxis === i ? '#00E5FF' : '#A1A1AA'} fontSize="7">{axis.name.slice(0, 8)}</text>
                <text x="85" y="0" textAnchor="end" fill={activeAxis === i ? '#10B981' : '#38BDF8'} fontSize="8" fontWeight="bold">{axis.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>VAR_95%: 1.2% // AGGREGATE RISK: LOW</span>
        <span>RADAR_ENGINE_v3.1</span>
      </div>
    </div>
  );
};
