import React from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const GeoSpatialMap: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="geo-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#geo-grid)" />
      </svg>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">EDGE_TOPOGRAPHY // GLOBAL WORKER DISTRO</span>
        <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">3 REGIONS</span>
      </div>

      {/* Map SVG */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 500 150" className="w-full h-auto max-h-[140px]">
          {/* Continent Outline Stylized Paths */}
          <g fill="none" stroke="#27272A" strokeWidth="1">
            {/* North America */}
            <path d="M 60 30 Q 100 20 120 40 T 100 80 T 50 60 Z" />
            {/* Europe */}
            <path d="M 220 30 Q 260 20 280 40 T 260 70 T 210 50 Z" />
            {/* Asia */}
            <path d="M 320 30 Q 400 20 440 50 T 400 110 T 310 80 Z" />
          </g>

          {/* Connection Curves */}
          <g stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8">
            <path d="M 90 50 Q 180 20 250 45" />
            <path d="M 250 45 Q 320 20 380 60" />
            <path d="M 90 50 Q 230 110 380 60" />
          </g>

          {/* Region Node 1: US-WEST */}
          <g transform="translate(90, 50)">
            <circle r="6" fill="#00E5FF" />
            <circle r="12" fill="none" stroke="#00E5FF" strokeWidth="1" className="animate-ping" />
            <text x="12" y="4" fill="#00E5FF" fontSize="8" fontFamily="monospace" fontWeight="bold">US-WEST (12ms)</text>
          </g>

          {/* Region Node 2: EU-CENTRAL */}
          <g transform="translate(250, 45)">
            <circle r="6" fill="#5322FF" />
            <circle r="12" fill="none" stroke="#5322FF" strokeWidth="1" />
            <text x="12" y="4" fill="#A855F7" fontSize="8" fontFamily="monospace" fontWeight="bold">EU-CENTRAL (24ms)</text>
          </g>

          {/* Region Node 3: ASIA-EAST */}
          <g transform="translate(380, 60)">
            <circle r="6" fill="#10B981" />
            <circle r="12" fill="none" stroke="#10B981" strokeWidth="1" />
            <text x="-70" y="16" fill="#34D399" fontSize="8" fontFamily="monospace" fontWeight="bold">ASIA-EAST (8ms)</text>
          </g>
        </svg>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>PRIMARY_REGION: ASIA-EAST // WORKERS_ACTIVE: 28</span>
        <span>AC-GEO-ENGINE v1.0</span>
      </div>
    </div>
  );
};
