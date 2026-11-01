import React from 'react';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import BlueprintLibrary from '@/components/BlueprintLibrary';
import InteractiveNodeMatrix from '@/components/playground/InteractiveNodeMatrix';
import ExistentialBlackbox from '@/components/ExistentialBlackbox';
import Experts from '@/components/Experts';
import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';
import HeadlessSwarmSection from '@/components/home/HeadlessSwarmSection';

class StudioErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[STUDIO BOUNDARY ERROR]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-[#09090B] border border-red-500/30 text-white font-mono">
          <div className="text-red-400 text-sm font-bold mb-2">
            [NODE 05] STUDIO CONFIGURATOR ENGINE RECOVERY MODE
          </div>
          <p className="text-xs text-zinc-400 mb-4 max-w-md text-center">
            {this.state.error?.message || 'Component failed to initialize WebGL context.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-[#5322FF] text-white text-xs font-mono font-bold hover:bg-[#5322FF]/80 transition"
          >
            REINITIALIZE NODE ↗
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface HomeProps {
  onOpenBatchModal?: () => void;
}

function LogoMarquee() {
  const items = [
    'Dify', 'n8n', 'Pinecone', 'GPT-4o', 'Claude', 'Llama', 'Telegram',
    'Slack', 'HubSpot', 'Notion', 'Pipedrive', 'Mistral',
  ];
  return (
    <div className="relative py-10 border-y border-zinc-800/60 bg-[#09090b] overflow-hidden font-mono">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-6">
        Native integrations across the stack
      </div>
      <div className="relative mask-fade-edges overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'marquee 32s linear infinite' }}>
          {[...items, ...items].map((name, i) => (
            <span
              key={i}
              className="font-mono text-[15px] font-medium text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

export default function Home({ onOpenBatchModal }: HomeProps) {
  return (
    <main>
      {/* Hero section rendering 3D engine in compact mode */}
      <Hero onOpenBatchModal={onOpenBatchModal} monolithMode="compact" />
      <LogoMarquee />

      {/* Zone 03 Headless Swarm Workbench & $0.00 Cloud Render Showcase Section */}
      <HeadlessSwarmSection />

      {/* Unified Interactive Node Matrix Teaser pointing to /playground */}
      <InteractiveNodeMatrix />

      {/* Fixed Section: Studio Configurator Node (Nhà máy sản xuất Web 3D No-Code/Low-Code) */}
      <section id="studio-configurator" className="relative w-full border-t border-zinc-800 bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#5322FF]/20 border border-[#5322FF]/50 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                NODE 05 // 3D MANUFACTURING FACTORY
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase font-mono">
                STUDIO CONFIGURATOR // NO-CODE 3D FACTORY
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-mono mt-2 max-w-2xl">
                Real-time Cybernetic Brutalism design engine. Customize brand parameters, generate AI palettes, inspect 4-stage exploded assembly, and compile deterministic 60FPS WebGL artifacts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/studio"
                className="px-4 py-2 bg-[#5322FF] hover:bg-[#5322FF]/90 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-2 shadow-[0_0_15px_rgba(83,34,255,0.4)]"
              >
                <span>ENTER FACTORY NODE ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Studio Configurator */}
        <div className="w-full border-b border-zinc-800">
          <StudioErrorBoundary>
            <CraftStudioConfigurator />
          </StudioErrorBoundary>
        </div>
      </section>

      <BentoGrid />
      <BlueprintLibrary />
      <ExistentialBlackbox />
      <Experts />
    </main>
  );
}
