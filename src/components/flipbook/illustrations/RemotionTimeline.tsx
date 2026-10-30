import React from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const RemotionTimeline: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="remotion-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="20" y2="20" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#remotion-grid)" />
      </svg>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">REMOTION_TIMELINE // PARALLEL CLOUD RENDER</span>
        <span className="px-1.5 py-0.5 bg-purple-950 border border-purple-800 text-purple-400 font-bold">60 FPS</span>
      </div>

      {/* Timeline SVG */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 500 150" className="w-full h-auto max-h-[140px]">
          {/* Ruler Marks */}
          <g stroke="#3F3F46" strokeWidth="1">
            <line x1="20" y1="20" x2="480" y2="20" />
            <line x1="20" y1="15" x2="20" y2="25" />
            <line x1="100" y1="15" x2="100" y2="25" />
            <line x1="180" y1="15" x2="180" y2="25" />
            <line x1="260" y1="15" x2="260" y2="25" />
            <line x1="340" y1="15" x2="340" y2="25" />
            <line x1="420" y1="15" x2="420" y2="25" />
            <line x1="480" y1="15" x2="480" y2="25" />
          </g>

          {/* Track 1: Audio Waveform */}
          <g transform="translate(20, 35)">
            <rect x="0" y="0" width="460" height="24" fill="#12121A" stroke="#27272A" strokeWidth="1" />
            <path d="M 10 12 L 30 4 L 50 20 L 70 8 L 90 16 L 110 2 L 130 22 L 150 10 L 170 18 L 190 6 L 210 14 L 230 4 L 250 20 L 270 8 L 290 16 L 310 2 L 330 22 L 350 10 L 370 18 L 390 6 L 410 14 L 430 4 L 450 12" stroke="#00E5FF" strokeWidth="1.5" fill="none" />
            <text x="8" y="16" fill="#00E5FF" fontSize="8" fontFamily="monospace">AUDIO_WEBAUDIO</text>
          </g>

          {/* Track 2: Video Frames */}
          <g transform="translate(20, 70)">
            <rect x="0" y="0" width="460" height="30" fill="#12121A" stroke="#27272A" strokeWidth="1" />
            <rect x="10" y="4" width="80" height="22" fill="#5322FF" opacity="0.8" rx="2" />
            <text x="50" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace">HERO_SCENE</text>

            <rect x="100" y="4" width="140" height="22" fill="#0284C7" opacity="0.8" rx="2" />
            <text x="170" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace">3D_PARTICLE_CANVAS</text>

            <rect x="250" y="4" width="120" height="22" fill="#7C3AED" opacity="0.8" rx="2" />
            <text x="310" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace">CODE_OVERLAY</text>

            <rect x="380" y="4" width="70" height="22" fill="#059669" opacity="0.8" rx="2" />
            <text x="415" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace">OUTRO</text>
          </g>

          {/* Playhead */}
          <line x1="180" y1="10" x2="180" y2="120" stroke="#EF4444" strokeWidth="2" />
          <polygon points="174,10 186,10 180,18" fill="#EF4444" />
        </svg>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>RENDER_TIME: 1.2s // GCP_CLOUDRUN_NODES: 16</span>
        <span>REMOTION_ENGINE_v4.0</span>
      </div>
    </div>
  );
};
