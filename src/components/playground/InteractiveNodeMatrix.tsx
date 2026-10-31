import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Film, Image, BarChart3, Sparkles, ChevronRight, ArrowUpRight } from 'lucide-react';
import { UniversalComponentProps } from '@/types/preset';

interface NodeCardProps {
  nodeId: string;
  number: string;
  title: string;
  subtitle: string;
  techStack: string;
  icon: React.ElementType;
  badge?: string;
  to: string;
}

const NODES: NodeCardProps[] = [
  {
    nodeId: 'node-01',
    number: 'NODE 01',
    title: 'Procedural 3D Render Engine',
    subtitle: '60 FPS Three.js procedural shader monolith with live audio synthesis.',
    techStack: 'Three.js • WebGL • Web Audio API',
    icon: Box,
    badge: 'LIVE ENGINE',
    to: '/playground?tab=node-01',
  },
  {
    nodeId: 'node-02',
    number: 'NODE 02',
    title: 'Remotion Motion Studio',
    subtitle: 'Deterministic programmatic video generation with 4-layer Lego stack.',
    techStack: 'Remotion 4.0 • React • Kinetic Typography',
    icon: Film,
    badge: '2K 60FPS',
    to: '/playground?tab=node-02',
  },
  {
    nodeId: 'node-03',
    number: 'NODE 03',
    title: 'Automated Banner Studio',
    subtitle: 'Dynamic branding asset synthesis with SVG export and batch generation.',
    techStack: 'HTML5 Canvas • SVG • n8n Webhook',
    icon: Image,
    badge: 'BATCH ASSETS',
    to: '/playground?tab=node-03',
  },
  {
    nodeId: 'node-04',
    number: 'NODE 04',
    title: 'Open Mekong CAD Visualizer',
    subtitle: 'Real-time environmental CKAN data pipeline with waveform visualizer.',
    techStack: 'PapaParse • CKAN API • Line Art',
    icon: BarChart3,
    badge: 'LIVE DATA',
    to: '/playground?tab=node-04',
  },
  {
    nodeId: 'node-05',
    number: 'NODE 05',
    title: 'Auto WebApp Generator Node',
    subtitle: 'Autonomous full-stack application prototyping with deterministic guardrails.',
    techStack: 'LLM Orchestration • Zod • React',
    icon: Sparkles,
    badge: 'BETA RELEASE',
    to: '/playground?tab=node-05',
  },
];

export const InteractiveNodeMatrix: React.FC<UniversalComponentProps> = ({
  className = '',
}) => {
  return (
    <section id="interactive-node-matrix" className={`relative py-24 bg-[#09090d] border-t border-zinc-800 font-mono ${className}`}>
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] font-bold uppercase mb-4 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              INTERACTIVE NODE MATRIX // 5 ENGINES
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
              STUDIO PLAYGROUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#5322ff]">HUBS</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-400 max-w-xl font-sans">
              Access the complete suite of deterministic AI, 3D procedural graphics, automated motion design, and open CAD telemetry engines.
            </p>
          </div>

          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(0,229,255,0.4)] shrink-0"
          >
            <span>LAUNCH FULL STUDIO MATRIX</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5-Node Bento Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NODES.map((node, index) => {
            const Icon = node.icon;
            const isHighlight = index === 0;

            return (
              <Link
                key={node.nodeId}
                to={node.to}
                className={`group relative border transition-all duration-300 p-6 flex flex-col justify-between ${
                  isHighlight
                    ? 'border-[#00E5FF] bg-[#0c1220]/80 hover:bg-[#0e1628]'
                    : 'border-zinc-800 bg-[#0c0c12]/60 hover:border-zinc-700 hover:bg-[#101018]'
                }`}
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                      {node.number}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 border ${
                        isHighlight
                          ? 'border-[#00E5FF]/60 text-[#00E5FF] bg-[#00E5FF]/10'
                          : 'border-zinc-700 text-zinc-400 bg-zinc-900'
                      }`}
                    >
                      {node.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 border ${
                        isHighlight
                          ? 'border-[#00E5FF]/40 text-[#00E5FF] bg-[#00E5FF]/10'
                          : 'border-zinc-800 text-zinc-400 bg-zinc-900 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-[#00E5FF] transition-colors">
                      {node.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                    {node.subtitle}
                  </p>
                </div>

                {/* Card Bottom */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 font-mono text-[10px]">
                    {node.techStack}
                  </span>
                  <div className="flex items-center gap-1 text-[#00E5FF] font-bold group-hover:translate-x-1 transition-transform">
                    <span>ENTER</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InteractiveNodeMatrix;
