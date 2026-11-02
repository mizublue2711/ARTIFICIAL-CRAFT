import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Film, Image, BarChart3, ChevronRight, ArrowUpRight } from 'lucide-react';
import { UniversalComponentProps } from '@/types/preset';

export interface NodeCardProps {
  id?: string;
  nodeId: string;
  number?: string;
  title: string;
  subtitle: string;
  description?: string;
  techStack: string | string[];
  icon?: React.ElementType;
  badge?: string;
  to?: string;
  linkUrl?: string;
  accentColor?: string;
  primaryColor?: string;
  ctaLabel?: string;
}

const NODES: NodeCardProps[] = [
  {
    nodeId: 'node-01',
    number: 'NODE 01',
    title: 'Procedural 3D Render Engine',
    subtitle: '60 FPS Three.js procedural shader monolith with live audio synthesis.',
    description: '60 FPS Three.js procedural shader monolith with live audio synthesis.',
    techStack: ['Three.js', 'WebGL', 'Web Audio API'],
    icon: Box,
    badge: 'LIVE ENGINE',
    to: '/playground?tab=node-01',
    ctaLabel: 'LAUNCH 3D ENGINE',
  },
  {
    nodeId: 'NODE 02 // REMOTION STUDIO',
    number: 'NODE 02',
    title: 'REMOTION MOTION STUDIO',
    subtitle: 'Deterministic programmatic video generation with 4-layer Lego stack.',
    description: 'Deterministic programmatic video generation with 4-layer Lego stack. Compose procedural motion graphics via React code.',
    techStack: ['Remotion 4.0', 'React', 'Kinetic Typography', 'WebGL'],
    icon: Film,
    badge: '2K 60FPS',
    to: '/playground?tab=node-02',
    ctaLabel: 'LAUNCH MOTION STUDIO',
  },
  {
    nodeId: 'NODE 03 // BANNER STUDIO',
    number: 'NODE 03',
    title: 'AUTOMATED BANNER STUDIO',
    subtitle: 'Dynamic branding asset synthesis with SVG export and batch generation.',
    description: 'Dynamic branding asset synthesis with SVG vector export, batch production, and headless automated delivery.',
    techStack: ['HTML5 Canvas', 'SVG Engine', 'n8n Webhook', 'Brutalist Tokens'],
    icon: Image,
    badge: 'BATCH ASSETS',
    to: '/playground?tab=node-03',
    ctaLabel: 'OPEN BANNER STUDIO',
  },
  {
    nodeId: 'NODE 04 // MEKONG CAD',
    number: 'NODE 04',
    title: 'OPEN MEKONG CAD VISUALIZER',
    subtitle: 'Real-time environmental CKAN data pipeline with waveform visualizer.',
    description: 'Real-time environmental CKAN data pipeline with waveform visualizer and line-art telemetry analysis.',
    techStack: ['PapaParse', 'CKAN API', 'Line Art', 'Waveform Visualizer'],
    icon: BarChart3,
    badge: 'LIVE DATA',
    to: '/playground?tab=node-04',
    ctaLabel: 'OPEN MEKONG CAD',
  },
  {
    id: 'plug-and-play-sandbox',
    nodeId: 'NODE 05 // PLUG AND PLAY SANDBOX',
    title: 'PLUG AND PLAY SANDBOX',
    subtitle: 'Modular 3D Component Testing & AST Playground',
    badge: 'INTERACTIVE SANDBOX // 60 FPS',
    description: 'Interactive sandbox environment for hot-reloading custom 3D meshes, GLTF/OBJ assets, and Zod AST payloads into the ARTIFICIAL CRAFT runtime pipeline.',
    techStack: ['React / Vite', 'Three.js / WebGL', 'Zod AST Gate', 'Cybernetic UI'],
    linkUrl: '/playground?node=plug-and-play-sandbox',
    accentColor: '#5322FF',
    primaryColor: '#00E5FF',
    to: '/playground?node=plug-and-play-sandbox',
    ctaLabel: 'OPEN PLUG & PLAY SANDBOX',
  },
  {
    id: '3d-data-metropolis',
    nodeId: 'NODE 06 // DATA METROPOLIS',
    title: '3D DATA METROPOLIS & CORPORATE PROFIT VISUALIZATION',
    subtitle: '3D Voxel Matrix Financial Engine & Live Google Sheets Sync',
    badge: 'LIVE WORKER // 60 FPS SLA',
    description: 'Transforms flat financial spreadsheets into an interactive 3D Voxel Matrix city running at 60 FPS in the browser. Features live Google Sheets API integration, procedural negative profit sub-level sinking effects, and 3D Head-to-Head Duel Mode.',
    techStack: ['Three.js / WebGL', 'Google Sheets Live API', 'Zod Sanitizer', 'Cybernetic Brutalism'],
    linkUrl: 'https://3d-data-metropolis-corporate-profit-visualization.mizu2711.workers.dev/',
    accentColor: '#00E5FF',
    primaryColor: '#5322FF',
    ctaLabel: 'LAUNCH 3D METROPOLIS DEMO',
  },
];

interface HubCardProps {
  nodeId: string;
  badge: string;
  title: string;
  description: string;
  techStack: string[];
  ctaLabel: string;
  onClickUrl?: string;
  onAction?: () => void;
  accentColor?: string;
}

export const UnifiedHubCard: React.FC<HubCardProps> = ({
  nodeId,
  badge,
  title,
  description,
  techStack,
  ctaLabel,
  onClickUrl,
  onAction,
}) => (
  <div className="p-4 border border-[#5322FF]/40 bg-[#09090B] hover:border-[#00E5FF] transition-all flex flex-col justify-between gap-4 group h-full">
    <div className="space-y-2.5">
      {/* Top Badge Line */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-[#5322FF] font-bold">{nodeId}</span>
        <span className="px-2 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold uppercase">
          {badge}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-[#00E5FF] transition">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* CTA Button Action */}
    {onClickUrl ? (
      <a
        href={onClickUrl}
        target={onClickUrl.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="w-full py-2 px-3 bg-[#5322FF] hover:bg-[#5322FF]/80 text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
      >
        <span>{ctaLabel} ➔</span>
      </a>
    ) : (
      <button
        type="button"
        onClick={onAction}
        className="w-full py-2 px-3 bg-[#5322FF] hover:bg-[#5322FF]/80 text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
      >
        <span>{ctaLabel} ➔</span>
      </button>
    )}
  </div>
);

export const InteractiveNodeMatrix: React.FC<UniversalComponentProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();

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
              INTERACTIVE NODE MATRIX // 6 ENGINES
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

        {/* 6-Node Bento Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NODES.map((node, index) => {
            const techList = Array.isArray(node.techStack)
              ? node.techStack
              : [node.techStack];

            // Node 01: Retains its distinct Flagship Hero badge and primary highlight style
            if (index === 0) {
              const Icon = node.icon || Box;
              return (
                <Link
                  key={node.nodeId}
                  to={node.to || '/playground?tab=node-01'}
                  className="group relative border border-[#00E5FF] bg-[#0c1220]/80 hover:bg-[#0e1628] transition-all duration-300 p-6 flex flex-col justify-between"
                >
                  {/* Card Top */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                        {node.number || 'NODE 01'}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 border border-[#00E5FF]/60 text-[#00E5FF] bg-[#00E5FF]/10 font-bold uppercase">
                        {node.badge || 'FLAGSHIP HERO'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 border border-[#00E5FF]/40 text-[#00E5FF] bg-[#00E5FF]/10">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-[#00E5FF] transition-colors">
                        {node.title}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                      {node.description || node.subtitle}
                    </p>
                  </div>

                  {/* Card Bottom */}
                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 font-mono text-[10px]">
                      {techList.join(' • ')}
                    </span>
                    <div className="flex items-center gap-1 text-[#00E5FF] font-bold group-hover:translate-x-1 transition-transform">
                      <span>ENTER</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            }

            // Nodes 02 to 06: Unified Cybernetic Brutalist Card Template
            const destinationUrl = node.linkUrl || node.to;
            const isExternal = Boolean(destinationUrl && destinationUrl.startsWith('http'));

            return (
              <UnifiedHubCard
                key={node.id || node.nodeId}
                nodeId={node.nodeId}
                badge={node.badge || '60 FPS'}
                title={node.title}
                description={node.description || node.subtitle}
                techStack={techList}
                ctaLabel={node.ctaLabel || 'LAUNCH NODE'}
                onClickUrl={isExternal ? destinationUrl : undefined}
                onAction={
                  !isExternal && destinationUrl
                    ? () => {
                        if (node.id === 'plug-and-play-sandbox') {
                          console.log('Launching Plug and Play Sandbox...');
                        }
                        navigate(destinationUrl);
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InteractiveNodeMatrix;
