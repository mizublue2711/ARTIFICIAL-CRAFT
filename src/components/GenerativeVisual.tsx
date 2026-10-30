import React, { useState } from 'react';
import { AutomationFlow } from './flipbook/illustrations/AutomationFlow';
import { DataPipelineMatrix } from './flipbook/illustrations/DataPipelineMatrix';
import { RemotionTimeline } from './flipbook/illustrations/RemotionTimeline';
import { GeoSpatialMap } from './flipbook/illustrations/GeoSpatialMap';

interface GenerativeVisualProps {
  seed?: string;
  mode?: string;
  className?: string;
}

/**
 * Deterministic PRNG from string seed
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function getPseudoRandom(hash: number, index: number): number {
  const x = Math.sin(hash + index * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const GenerativeVisual: React.FC<GenerativeVisualProps> = ({
  seed = 'p01_default',
  mode = 'NEURAL_MESH',
  className = ''
}) => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const hash = hashString(seed);

  const normalizedMode = mode ? mode.toUpperCase() : 'NEURAL_MESH';

  // Specific Registered Modes
  if (normalizedMode === 'AUTOMATION_FLOW') {
    return <AutomationFlow seed={seed} className={className} />;
  }
  if (normalizedMode === 'DATA_MATRIX' || normalizedMode === 'DATA_PIPELINE') {
    return <DataPipelineMatrix seed={seed} className={className} />;
  }
  if (normalizedMode === 'REMOTION_TIMELINE' || normalizedMode === 'TIMELINE') {
    return <RemotionTimeline seed={seed} className={className} />;
  }
  if (normalizedMode === 'GEO_MAP' || normalizedMode === 'GEOSPATIAL') {
    return <GeoSpatialMap seed={seed} className={className} />;
  }

  // 1. NEURAL_MESH Mode
  if (normalizedMode === 'NEURAL_MESH') {
    const nodeCount = 6;
    const nodes = Array.from({ length: nodeCount }).map((_, i) => ({
      x: 60 + getPseudoRandom(hash, i * 2) * 380,
      y: 30 + getPseudoRandom(hash, i * 2 + 1) * 100,
      label: `NODE_0${i + 1}`
    }));

    return (
      <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
          <span className="text-[#00E5FF] font-bold">NEURAL_MESH // SEED: {seed}</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold">MULTI-AGENT</span>
        </div>

        <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[150px]">
            {/* Connections */}
            {nodes.map((n1, idx1) =>
              nodes.map((n2, idx2) => {
                if (idx1 >= idx2) return null;
                const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                if (dist > 260) return null;
                return (
                  <line
                    key={`${idx1}-${idx2}`}
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    stroke={idx1 === 0 ? '#00E5FF' : '#5322FF'}
                    strokeWidth={idx1 === 0 ? 1.5 : 1}
                    opacity={0.6}
                    strokeDasharray={idx1 % 2 === 0 ? '4 4' : undefined}
                  />
                );
              })
            )}

            {/* Nodes */}
            {nodes.map((node, idx) => (
              <g
                key={idx}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredNode(idx)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle r={idx === 0 ? 8 : 6} fill={idx === 0 ? '#00E5FF' : '#5322FF'} />
                <circle r={idx === 0 ? 14 : 10} fill="none" stroke={idx === 0 ? '#00E5FF' : '#5322FF'} strokeWidth="1" opacity="0.5" />
                <text x="12" y="4" fill="#A1A1AA" fontSize="8" fontFamily="monospace">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
          <span>NODES: {nodeCount} // ACTIVE_NODE: {hoveredNode !== null ? `0${hoveredNode + 1}` : 'NONE'}</span>
          <span>NEURAL_VISUAL_v1.0</span>
        </div>
      </div>
    );
  }

  // 2. ISOMETRIC_CAD Mode
  if (normalizedMode === 'ISOMETRIC_CAD') {
    return (
      <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
          <span className="text-[#00E5FF] font-bold">ISOMETRIC_CAD // SCHEMATIC</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold">CAD_3D</span>
        </div>

        <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[150px]">
            {/* Crosshairs (+) */}
            {[50, 150, 250, 350, 450].map((cx) =>
              [30, 80, 130].map((cy) => (
                <g key={`${cx}-${cy}`} stroke="#27272A" strokeWidth="1">
                  <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} />
                  <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} />
                </g>
              ))
            )}

            {/* Isometric Cube 1 */}
            <g transform="translate(180, 80)">
              <polygon points="0,-30 40,-10 0,10 -40,-10" fill="#181824" stroke="#00E5FF" strokeWidth="1.5" />
              <polygon points="-40,-10 0,10 0,50 -40,30" fill="#12121A" stroke="#00E5FF" strokeWidth="1.5" />
              <polygon points="0,10 40,-10 40,30 0,50" fill="#09090D" stroke="#00E5FF" strokeWidth="1.5" />
              <text x="0" y="-36" textAnchor="middle" fill="#00E5FF" fontSize="8" fontFamily="monospace">BLOCK_A</text>
            </g>

            {/* Isometric Cube 2 */}
            <g transform="translate(320, 60)">
              <polygon points="0,-25 35,-8 0,8 -35,-8" fill="#1E1B4B" stroke="#5322FF" strokeWidth="1.5" />
              <polygon points="-35,-8 0,8 0,40 -35,24" fill="#12121A" stroke="#5322FF" strokeWidth="1.5" />
              <polygon points="0,8 35,-8 35,24 0,40" fill="#09090D" stroke="#5322FF" strokeWidth="1.5" />
              <text x="0" y="-30" textAnchor="middle" fill="#A855F7" fontSize="8" fontFamily="monospace">BLOCK_B</text>
            </g>

            {/* Dimension Lines */}
            <line x1="140" y1="120" x2="355" y2="120" stroke="#00E5FF" strokeWidth="1" strokeDasharray="2 2" />
            <text x="250" y="135" textAnchor="middle" fill="#00E5FF" fontSize="8" fontFamily="monospace">ΔX = 215mm</text>
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
          <span>PROJECTION: ISOMETRIC // AXIS: XYZ</span>
          <span>CAD_ENGINE_v1.0</span>
        </div>
      </div>
    );
  }

  // 3. ALGORITHMIC_WAVE Mode
  if (normalizedMode === 'ALGORITHMIC_WAVE') {
    const wavePoints = Array.from({ length: 40 }).map((_, i) => {
      const x = i * 12 + 10;
      const y = 80 + Math.sin(i * 0.3 + hash % 10) * 35 + Math.cos(i * 0.1) * 15;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
          <span className="text-[#00E5FF] font-bold">ALGORITHMIC_WAVE // FREQ_SYNTH</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[#00E5FF] font-bold">DSP_GRID</span>
        </div>

        <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[150px]">
            {/* Dot Matrix Grid */}
            {Array.from({ length: 20 }).map((_, col) =>
              Array.from({ length: 8 }).map((_, row) => (
                <circle
                  key={`${col}-${row}`}
                  cx={col * 24 + 20}
                  cy={row * 18 + 15}
                  r="1.2"
                  fill="#27272A"
                />
              ))
            )}

            {/* Wave Line */}
            <polyline points={wavePoints} fill="none" stroke="#00E5FF" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
          <span>SAMPLING_RATE: 48kHz // HARMONICS: ACTIVE</span>
          <span>WAVE_SYNTH_v1.0</span>
        </div>
      </div>
    );
  }

  // 4. INTERACTIVE_ANCHOR Mode
  if (normalizedMode === 'INTERACTIVE_ANCHOR') {
    return (
      <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
          <span className="text-[#00E5FF] font-bold">INTERACTIVE_ANCHOR // VERTEX_PHYSICS</span>
          <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">SPRING_HOVER</span>
        </div>

        <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
          <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[150px]">
            <polygon points="100,120 250,30 400,120" fill="none" stroke="#5322FF" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="120" r="8" fill="#00E5FF" className="hover:scale-150 transition-transform cursor-pointer" />
            <circle cx="250" cy="30" r="10" fill="#5322FF" className="hover:scale-150 transition-transform cursor-pointer" />
            <circle cx="400" cy="120" r="8" fill="#10B981" className="hover:scale-150 transition-transform cursor-pointer" />
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
          <span>INTERACTION: HOVER_VERTICES</span>
          <span>ANCHOR_ENGINE_v1.0</span>
        </div>
      </div>
    );
  }

  // CRITICAL AUTO-EXPANSION FALLBACK RULE:
  // Generates a unique high-tech 60fps line-art pattern based on string pseudo-random hash of seed / mode
  const patternType = hash % 3;
  const lines = Array.from({ length: 12 }).map((_, i) => {
    const x1 = (getPseudoRandom(hash, i * 4) * 440) + 30;
    const y1 = (getPseudoRandom(hash, i * 4 + 1) * 120) + 20;
    const x2 = (getPseudoRandom(hash, i * 4 + 2) * 440) + 30;
    const y2 = (getPseudoRandom(hash, i * 4 + 3) * 120) + 20;
    return { x1, y1, x2, y2 };
  });

  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">GENERATIVE_PATTERN // {normalizedMode}</span>
        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-amber-400 font-bold">AUTO_EXPANSION_FALLBACK</span>
      </div>

      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 500 160" className="w-full h-auto max-h-[150px]">
          <defs>
            <linearGradient id={`auto-grad-${hash}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#5322FF" />
            </linearGradient>
          </defs>

          {/* Fallback Line-Art Pattern */}
          {lines.map((l, idx) => (
            <g key={idx}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={`url(#auto-grad-${hash})`} strokeWidth="1.5" opacity={0.7} />
              <circle cx={l.x1} cy={l.y1} r="3" fill="#00E5FF" />
            </g>
          ))}

          {patternType === 0 && (
            <circle cx="250" cy="80" r="45" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="6 6" />
          )}
          {patternType === 1 && (
            <rect x="200" y="45" width="100" height="70" fill="none" stroke="#5322FF" strokeWidth="1.5" />
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>HASH_SEED: 0x{hash.toString(16).toUpperCase()} // MODE: DYNAMIC_FALLBACK</span>
        <span>AUTO_EXPANSION_ENGINE v1.0</span>
      </div>
    </div>
  );
};
