import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const GlobalGeoNodes: React.FC<IllustrationProps> = ({ className = '' }) => {
  const [activeHub, setActiveHub] = useState<number | null>(0);

  const hubs = [
    { id: 'ZRH', name: 'ZURICH', coords: '47.3769° N, 8.5417° E', x: 80, y: 70, status: 'ONLINE', latency: '12ms' },
    { id: 'DXB', name: 'DUBAI', coords: '25.2048° N, 55.2708° E', x: 170, y: 110, status: 'ONLINE', latency: '24ms' },
    { id: 'SIN', name: 'SINGAPORE', coords: '1.3521° N, 103.8198° E', x: 270, y: 130, status: 'ONLINE', latency: '18ms' },
    { id: 'HKG', name: 'HONG KONG', coords: '22.3193° N, 114.1694° E', x: 320, y: 85, status: 'ONLINE', latency: '15ms' },
  ];

  // Interconnecting arcs
  const arcs = [
    { from: hubs[0], to: hubs[1] }, // ZRH -> DXB
    { from: hubs[1], to: hubs[2] }, // DXB -> SIN
    { from: hubs[2], to: hubs[3] }, // SIN -> HKG
    { from: hubs[0], to: hubs[3] }, // ZRH -> HKG
  ];

  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="geo-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#geo-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">GLOBAL_GEO_NODES // WEALTH HUBS</span>
        <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">CROSS_BORDER</span>
      </div>

      {/* Main SVG Visualization */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-[160px]">
          {/* Latitude / Longitude Holographic Lines */}
          <g stroke="#27272A" strokeWidth="0.75" strokeDasharray="3 3">
            <line x1="30" y1="50" x2="370" y2="50" />
            <line x1="30" y1="100" x2="370" y2="100" />
            <line x1="30" y1="150" x2="370" y2="150" />

            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="200" y1="20" x2="200" y2="180" />
            <line x1="300" y1="20" x2="300" y2="180" />
          </g>

          {/* Interconnecting Arc Vectors */}
          {arcs.map((arc, i) => {
            const midX = (arc.from.x + arc.to.x) / 2;
            const midY = Math.min(arc.from.y, arc.to.y) - 30;
            const pathD = `M ${arc.from.x} ${arc.from.y} Q ${midX} ${midY} ${arc.to.x} ${arc.to.y}`;

            return (
              <g key={`arc-${i}`}>
                <path d={pathD} fill="none" stroke="#5322FF" strokeWidth="1.5" opacity="0.6" />
                <path d={pathD} fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="6 6" className="animate-pulse" />
              </g>
            );
          })}

          {/* Wealth Hub Nodes */}
          {hubs.map((hub, idx) => {
            const isSelected = activeHub === idx;
            return (
              <g
                key={hub.id}
                transform={`translate(${hub.x}, ${hub.y})`}
                onMouseEnter={() => setActiveHub(idx)}
                className="cursor-pointer"
              >
                {/* Glowing Pulse Ring */}
                <circle r={isSelected ? 16 : 10} fill="none" stroke="#00E5FF" strokeWidth="1" opacity={isSelected ? 0.8 : 0.4}>
                  <animate attributeName="r" values="8;18;8" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Core Node Circle */}
                <circle r="5" fill={isSelected ? '#00E5FF' : '#5322FF'} stroke="#00E5FF" strokeWidth="1.5" />

                {/* Label Box */}
                <rect
                  x="-25"
                  y="10"
                  width="50"
                  height="16"
                  fill="#09090D"
                  stroke={isSelected ? '#00E5FF' : '#27272A'}
                  strokeWidth="1"
                  rx="2"
                />
                <text x="0" y="21" textAnchor="middle" fill={isSelected ? '#00E5FF' : '#E4E4E7'} fontSize="7" fontWeight="bold">
                  {hub.id}
                </text>
              </g>
            );
          })}

          {/* Active Hub Telemetry Box (Bottom Left) */}
          <g transform="translate(20, 140)">
            <rect x="0" y="0" width="160" height="42" fill="#12121A" stroke="#00E5FF" strokeWidth="1" rx="2" />
            <text x="8" y="14" fill="#00E5FF" fontSize="8" fontWeight="bold">
              NODE: {hubs[activeHub ?? 0].name} ({hubs[activeHub ?? 0].id})
            </text>
            <text x="8" y="26" fill="#A1A1AA" fontSize="7">
              COORDS: {hubs[activeHub ?? 0].coords}
            </text>
            <text x="8" y="36" fill="#10B981" fontSize="7">
              STATUS: {hubs[activeHub ?? 0].status} // RTT: {hubs[activeHub ?? 0].latency}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>LATENCY: 18ms // NODE SYNC: 100%</span>
        <span>GEO_NODES_v2.0</span>
      </div>
    </div>
  );
};
