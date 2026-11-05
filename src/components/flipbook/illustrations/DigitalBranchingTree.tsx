import React, { useEffect, useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const DigitalBranchingTree: React.FC<IllustrationProps> = ({ className = '' }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  // Orthogonal 90° and 45° branching paths layout
  // Root -> Tier 1 -> Tier 2 -> Leaves
  const nodes = [
    { id: 'ROOT', x: 250, y: 145, label: 'CORE_BUS', active: true, tier: 0 },
    // Tier 1 (45° branches from root)
    { id: 'T1_L', x: 160, y: 105, label: 'BRANCH_ALPHA', active: activeStep >= 1, tier: 1 },
    { id: 'T1_R', x: 340, y: 105, label: 'BRANCH_BETA', active: activeStep >= 1, tier: 1 },
    // Tier 2 (90° and 45° sub-branches)
    { id: 'T2_LL', x: 80, y: 65, label: 'LEAF_L0', active: activeStep >= 2, tier: 2 },
    { id: 'T2_LC', x: 160, y: 50, label: 'NODE_AI', active: activeStep >= 2, tier: 2 },
    { id: 'T2_RC', x: 340, y: 50, label: 'NODE_RAG', active: activeStep >= 2, tier: 2 },
    { id: 'T2_RR', x: 420, y: 65, label: 'LEAF_R1', active: activeStep >= 2, tier: 2 },
    // Tier 3 Terminal Nodes
    { id: 'TERM_A', x: 40, y: 25, label: 'STREAM_OUT', active: activeStep >= 3, tier: 3 },
    { id: 'TERM_B', x: 210, y: 20, label: 'EMBED_VEC', active: activeStep >= 3, tier: 3 },
    { id: 'TERM_C', x: 290, y: 20, label: 'AST_TREES', active: activeStep >= 3, tier: 3 },
    { id: 'TERM_D', x: 460, y: 25, label: 'GPU_BATCH', active: activeStep >= 3, tier: 3 }
  ];

  return (
    <div
      className={`w-full h-full min-h-[220px] bg-[#09090B] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between select-none ${className}`}
    >
      {/* 1px Swiss CAD Grid Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="tree-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#tree-grid)" />
      </svg>

      {/* Blinking Corner Anchor Badges */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 text-[8px] text-[#00E5FF] z-20">
        <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-none animate-ping" />
        <span>ANCHOR_NW // 0x4B2</span>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 text-[8px] text-[#5322FF] z-20">
        <span className="w-1.5 h-1.5 bg-[#5322FF] rounded-none animate-pulse" />
        <span>ANCHOR_NE // 0x8F1</span>
      </div>
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 text-[8px] text-zinc-500 z-20">
        <span className="w-1.5 h-1.5 bg-zinc-600 rounded-none" />
        <span>ANCHOR_SW // 0x11C</span>
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 text-[8px] text-emerald-400 z-20">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-pulse" />
        <span>ANCHOR_SE // ONLINE</span>
      </div>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-[#00E5FF] font-bold">DIGITAL_BRANCHING_TREE // ORTHO_PIPELINE</span>
        </div>
        <span className="px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-800 text-[#00E5FF] font-bold text-[9px]">
          PULSE_CYCLE: 0{activeStep + 1}
        </span>
      </div>

      {/* Main Orthogonal Tree SVG */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[155px]">
          <defs>
            <linearGradient id="tree-cyan-glow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#5322FF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            <filter id="tree-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Orthogonal 90° and 45° Branching Wireframe Lines */}
          <g fill="none" strokeWidth="1.5">
            {/* Root Trunk (Vertical 90°) */}
            <path d="M 250 145 L 250 120" stroke="#5322FF" />

            {/* Root to Alpha & Beta (45° chamfer to 90° horizontal) */}
            <path
              d="M 250 120 L 235 105 L 160 105"
              stroke={activeStep >= 1 ? '#00E5FF' : '#27272A'}
              strokeDasharray={activeStep >= 1 ? undefined : '3 3'}
            />
            <path
              d="M 250 120 L 265 105 L 340 105"
              stroke={activeStep >= 1 ? '#00E5FF' : '#27272A'}
              strokeDasharray={activeStep >= 1 ? undefined : '3 3'}
            />

            {/* Branch Alpha sub-paths (Orthogonal 90° & 45°) */}
            <path
              d="M 160 105 L 120 105 L 80 65"
              stroke={activeStep >= 2 ? '#00E5FF' : '#27272A'}
              strokeDasharray={activeStep >= 2 ? undefined : '3 3'}
            />
            <path
              d="M 160 105 L 160 50"
              stroke={activeStep >= 2 ? '#5322FF' : '#27272A'}
              strokeDasharray={activeStep >= 2 ? undefined : '3 3'}
            />

            {/* Branch Beta sub-paths (Orthogonal 90° & 45°) */}
            <path
              d="M 340 105 L 340 50"
              stroke={activeStep >= 2 ? '#5322FF' : '#27272A'}
              strokeDasharray={activeStep >= 2 ? undefined : '3 3'}
            />
            <path
              d="M 340 105 L 380 105 L 420 65"
              stroke={activeStep >= 2 ? '#00E5FF' : '#27272A'}
              strokeDasharray={activeStep >= 2 ? undefined : '3 3'}
            />

            {/* Terminal Branches */}
            <path
              d="M 80 65 L 40 25"
              stroke={activeStep >= 3 ? '#00E5FF' : '#27272A'}
              strokeDasharray="2 2"
            />
            <path
              d="M 160 50 L 185 20 L 210 20"
              stroke={activeStep >= 3 ? '#00E5FF' : '#27272A'}
              strokeDasharray="2 2"
            />
            <path
              d="M 340 50 L 315 20 L 290 20"
              stroke={activeStep >= 3 ? '#00E5FF' : '#27272A'}
              strokeDasharray="2 2"
            />
            <path
              d="M 420 65 L 460 25"
              stroke={activeStep >= 3 ? '#00E5FF' : '#27272A'}
              strokeDasharray="2 2"
            />
          </g>

          {/* Signal Data Pulses Traversing along branches */}
          <circle r="3" fill="#00E5FF" filter="url(#tree-glow)">
            <animateMotion
              path="M 250 145 L 250 120 L 235 105 L 160 105 L 120 105 L 80 65 L 40 25"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="3" fill="#5322FF" filter="url(#tree-glow)">
            <animateMotion
              path="M 250 145 L 250 120 L 265 105 L 340 105 L 380 105 L 420 65 L 460 25"
              dur="3.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill="#38BDF8">
            <animateMotion
              path="M 160 105 L 160 50 L 185 20 L 210 20"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill="#38BDF8">
            <animateMotion
              path="M 340 105 L 340 50 L 315 20 L 290 20"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Tree Data Nodes */}
          {nodes.map((node) => {
            const isRoot = node.id === 'ROOT';
            const nodeFill = node.active ? (isRoot ? '#00E5FF' : '#5322FF') : '#181824';
            const strokeColor = node.active ? '#00E5FF' : '#3F3F46';

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* Node Box / Terminal Badge */}
                <rect
                  x={-28}
                  y={-9}
                  width="56"
                  height="18"
                  rx="1"
                  fill={nodeFill}
                  stroke={strokeColor}
                  strokeWidth="1"
                  opacity={node.active ? 1 : 0.6}
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill={node.active ? '#FFFFFF' : '#71717A'}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500 mb-2">
        <span>TOPOLOGY: 90°/45° ORTHOGONAL // NODES: {nodes.length}</span>
        <span>SIGNAL_BUS: 40Gbps</span>
      </div>
    </div>
  );
};
