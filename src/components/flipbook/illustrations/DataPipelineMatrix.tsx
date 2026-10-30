import React from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const DataPipelineMatrix: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="matrix-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1" fill="#00E5FF" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#matrix-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">DATA_MATRIX // 0-TOKEN SANITIZER</span>
        <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">INSPECTED</span>
      </div>

      {/* Matrix SVG Canvas */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[150px]">
          {/* Matrix Columns */}
          <g stroke="#27272A" strokeWidth="1">
            <line x1="80" y1="20" x2="80" y2="140" />
            <line x1="200" y1="20" x2="200" y2="140" />
            <line x1="320" y1="20" x2="320" y2="140" />
            <line x1="440" y1="20" x2="440" y2="140" />
          </g>

          {/* Data Packets Passing Through Filter */}
          <g fontFamily="monospace" fontSize="9">
            {/* Raw Input */}
            <rect x="10" y="30" width="110" height="28" fill="#181824" stroke="#EF4444" strokeWidth="1" />
            <text x="65" y="48" textAnchor="middle" fill="#F87171">[RAW: NULL_FIELD]</text>

            <rect x="10" y="70" width="110" height="28" fill="#181824" stroke="#F59E0B" strokeWidth="1" />
            <text x="65" y="88" textAnchor="middle" fill="#FBBF24">[RAW: UNESCAPED_NL]</text>

            <rect x="10" y="110" width="110" height="28" fill="#181824" stroke="#00E5FF" strokeWidth="1" />
            <text x="65" y="128" textAnchor="middle" fill="#38BDF8">[RAW: VALID_TEXT]</text>

            {/* Filter Gate */}
            <rect x="170" y="20" width="100" height="120" rx="4" fill="#09090D" stroke="#5322FF" strokeWidth="2" />
            <text x="220" y="50" textAnchor="middle" fill="#A855F7" fontWeight="bold">0-TOKEN</text>
            <text x="220" y="66" textAnchor="middle" fill="#A855F7" fontWeight="bold">SANITIZER</text>
            <line x1="180" y1="80" x2="260" y2="80" stroke="#27272A" strokeWidth="1" />
            <text x="220" y="100" textAnchor="middle" fill="#10B981" fontSize="8">REGEX CLEAN</text>

            {/* Clean Output */}
            <rect x="340" y="30" width="130" height="28" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <text x="405" y="48" textAnchor="middle" fill="#34D399">[CLEAN: ESCAPED_JSON]</text>

            <rect x="340" y="80" width="130" height="28" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <text x="405" y="98" textAnchor="middle" fill="#34D399">[PASS: PAYLOAD_OK]</text>
          </g>

          {/* Arrows */}
          <path d="M 125 44 L 165 44 M 125 84 L 165 84 M 125 124 L 165 124" stroke="#27272A" strokeWidth="1.5" />
          <path d="M 275 44 L 335 44 M 275 94 L 335 94" stroke="#10B981" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>ERR_RATE: 0.00% // PAYLOAD_VALIDATED</span>
        <span>DATA_SANITIZER_v1.4</span>
      </div>
    </div>
  );
};
