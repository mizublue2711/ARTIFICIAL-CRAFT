import React from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const ExecutivePortrait: React.FC<IllustrationProps> = ({ seed = 'exec_01', className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="exec-grid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#exec-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">EXECUTIVE_PORTRAIT // LEADERSHIP PROFILE</span>
        <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          VERIFIED_GP
        </span>
      </div>

      {/* Main SVG Visualization */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-[160px]">
          {/* Outer Brutalist Frame */}
          <rect x="20" y="15" width="130" height="170" fill="#12121A" stroke="#00E5FF" strokeWidth="1.5" />
          <rect x="25" y="20" width="120" height="160" fill="#09090D" stroke="#27272A" strokeWidth="1" />

          {/* Crosshairs (+) Corners */}
          <g stroke="#00E5FF" strokeWidth="1">
            <line x1="15" y1="15" x2="25" y2="15" />
            <line x1="20" y1="10" x2="20" y2="20" />
            <line x1="145" y1="15" x2="155" y2="15" />
            <line x1="150" y1="10" x2="150" y2="20" />
            <line x1="15" y1="185" x2="25" y2="185" />
            <line x1="20" y1="180" x2="20" y2="190" />
            <line x1="145" y1="185" x2="155" y2="185" />
            <line x1="150" y1="180" x2="150" y2="190" />
          </g>

          {/* Executive Vector Silhouette Avatar */}
          <g transform="translate(30, 25)">
            {/* Background Halo */}
            <circle cx="55" cy="50" r="38" fill="#5322FF22" stroke="#5322FF" strokeWidth="1" strokeDasharray="3 3" />
            {/* Head Silhouette */}
            <circle cx="55" cy="42" r="20" fill="#181824" stroke="#00E5FF" strokeWidth="1.5" />
            {/* Shoulders / Suit Silhouette */}
            <path
              d="M 15,115 C 15,78 30,72 55,72 C 80,72 95,78 95,115 Z"
              fill="#181824"
              stroke="#00E5FF"
              strokeWidth="1.5"
            />
            {/* Tie / Lapel Details */}
            <path d="M 50,72 L 55,95 L 60,72 Z" fill="#00E5FF" />
            <path d="M 38,78 L 50,115 M 72,78 L 60,115" stroke="#5322FF" strokeWidth="1" />
          </g>

          {/* Verification Badge */}
          <g transform="translate(118, 25)">
            <rect x="0" y="0" width="22" height="22" fill="#064E3B" stroke="#10B981" strokeWidth="1" rx="2" />
            <path d="M 6,11 L 10,15 L 16,7" stroke="#34D399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Scanlines Overlay on Avatar */}
          <line x1="25" y1="60" x2="145" y2="60" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3" />
          <line x1="25" y1="100" x2="145" y2="100" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3" />
          <line x1="25" y1="140" x2="145" y2="140" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3" />

          {/* Quotation & Leadership Philosophy Panel */}
          <g transform="translate(170, 20)">
            {/* Large Brutalist Quotation Mark */}
            <text x="0" y="32" fill="#5322FF" fontSize="42" fontFamily="monospace" fontWeight="bold" opacity="0.6">“</text>

            <text x="24" y="22" fill="#00E5FF" fontSize="10" fontWeight="bold">VISION & RISK GUARDIAN</text>

            {/* Quote Block Text */}
            <rect x="0" y="35" width="210" height="65" fill="#12121A" stroke="#27272A" strokeWidth="1" rx="2" />
            <text x="10" y="52" fill="#E4E4E7" fontSize="8" fontFamily="monospace">
              "Systemic capital preservation
            </text>
            <text x="10" y="66" fill="#E4E4E7" fontSize="8" fontFamily="monospace">
              demands algorithmic discipline
            </text>
            <text x="10" y="80" fill="#E4E4E7" fontSize="8" fontFamily="monospace">
              and zero-trust risk auditing."
            </text>

            {/* JetBrains Mono Title Tags */}
            <g transform="translate(0, 112)">
              <rect x="0" y="0" width="100" height="20" fill="#09090D" stroke="#00E5FF" strokeWidth="1" rx="2" />
              <text x="50" y="13" textAnchor="middle" fill="#00E5FF" fontSize="7" fontWeight="bold">MANAGING DIRECTOR</text>

              <rect x="105" y="0" width="105" height="20" fill="#09090D" stroke="#A855F7" strokeWidth="1" rx="2" />
              <text x="157" y="13" textAnchor="middle" fill="#A855F7" fontSize="7" fontWeight="bold">QUANT STRATEGIST</text>

              <rect x="0" y="25" width="210" height="18" fill="#181824" stroke="#27272A" strokeWidth="1" rx="2" />
              <text x="10" y="37" fill="#A1A1AA" fontSize="7">MEMBER: INVESTMENT COMMITTEE</text>
              <text x="195" y="37" textAnchor="end" fill="#10B981" fontSize="7" fontWeight="bold">ACTIVE</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>CLEARANCE: LEVEL 5 // COMPLIANCE: APPROVED (SEED: {seed})</span>
        <span>EXEC_ID_v1.0</span>
      </div>
    </div>
  );
};
