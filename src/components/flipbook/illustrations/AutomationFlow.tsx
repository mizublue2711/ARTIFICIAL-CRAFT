import React from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const AutomationFlow: React.FC<IllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="flow-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#flow-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">AUTOMATION_FLOW // N8N + DIFY BRAIN</span>
        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">LIVE_PIPELINE</span>
      </div>

      {/* Main Flow SVG */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 600 180" className="w-full h-auto max-h-[160px] text-zinc-100">
          <defs>
            <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5322FF" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connecting Lines */}
          <path d="M 90 90 L 200 90 L 310 90 L 420 90 L 510 90" stroke="url(#cyan-glow)" strokeWidth="2" fill="none" strokeDasharray="4 4" className="animate-pulse" />

          {/* Node 1: Webhook */}
          <g transform="translate(40, 60)">
            <rect width="100" height="60" rx="4" fill="#12121A" stroke="#00E5FF" strokeWidth="1.5" />
            <text x="50" y="28" textAnchor="middle" fill="#00E5FF" fontSize="10" fontFamily="monospace" fontWeight="bold">TRIGGER</text>
            <text x="50" y="44" textAnchor="middle" fill="#A1A1AA" fontSize="9" fontFamily="monospace">n8n Webhook</text>
          </g>

          {/* Node 2: Sanitizer */}
          <g transform="translate(160, 60)">
            <rect width="100" height="60" rx="4" fill="#12121A" stroke="#5322FF" strokeWidth="1.5" />
            <text x="50" y="28" textAnchor="middle" fill="#A855F7" fontSize="10" fontFamily="monospace" fontWeight="bold">SANITIZER</text>
            <text x="50" y="44" textAnchor="middle" fill="#A1A1AA" fontSize="9" fontFamily="monospace">0-Token Code</text>
          </g>

          {/* Node 3: Dify Brain */}
          <g transform="translate(280, 50)">
            <rect width="110" height="80" rx="4" fill="#181826" stroke="#00E5FF" strokeWidth="2" filter="url(#glow-filter)" />
            <text x="55" y="32" textAnchor="middle" fill="#00E5FF" fontSize="11" fontFamily="monospace" fontWeight="bold">DIFY BRAIN</text>
            <text x="55" y="48" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace">RAG & Prompt</text>
            <text x="55" y="64" textAnchor="middle" fill="#10B981" fontSize="8" fontFamily="monospace">STATUS 200</text>
          </g>

          {/* Node 4: FLUX Render */}
          <g transform="translate(410, 60)">
            <rect width="90" height="60" rx="4" fill="#12121A" stroke="#EC4899" strokeWidth="1.5" />
            <text x="45" y="28" textAnchor="middle" fill="#F472B6" fontSize="10" fontFamily="monospace" fontWeight="bold">FLUX</text>
            <text x="45" y="44" textAnchor="middle" fill="#A1A1AA" fontSize="9" fontFamily="monospace">GPU Render</text>
          </g>

          {/* Node 5: Cloudflare R2 */}
          <g transform="translate(520, 60)">
            <rect width="70" height="60" rx="4" fill="#12121A" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="35" y="28" textAnchor="middle" fill="#FBBF24" fontSize="10" fontFamily="monospace" fontWeight="bold">R2 CDN</text>
            <text x="35" y="44" textAnchor="middle" fill="#A1A1AA" fontSize="8" fontFamily="monospace">0 Egress</text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>LATENCY: 142ms // TOKEN_COST: $0.00</span>
        <span>AC-FLOW-ENGINE v2.0</span>
      </div>
    </div>
  );
};
