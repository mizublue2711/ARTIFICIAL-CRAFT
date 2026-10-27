import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PlugAndPlaySandbox from '@/components/PlugAndPlaySandbox';
import CsvDataVisualizer from '@/components/CsvDataVisualizer';
import ShowcaseVideoSection from '@/components/ShowcaseVideoSection';
import BentoGrid from '@/components/BentoGrid';
import BlueprintLibrary from '@/components/BlueprintLibrary';
import BannerStudio from '@/components/BannerStudio';
import ExistentialBlackbox from '@/components/ExistentialBlackbox';
import Experts from '@/components/Experts';
import Footer from '@/components/Footer';
import BatchProductionModal from '@/components/BatchProductionModal';
import VideoCinematicController from '@/components/VideoCinematicController';
import { LanguageProvider } from '@/context/LanguageContext';

function LogoMarquee() {
  const items = [
    'Dify', 'n8n', 'Pinecone', 'GPT-4o', 'Claude', 'Llama', 'Telegram',
    'Slack', 'HubSpot', 'Notion', 'Pipedrive', 'Mistral',
  ];
  return (
    <div className="relative py-10 border-y border-zinc-800/60 bg-[#09090b] overflow-hidden" data-layer="0">
      <div className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-6">
        Native integrations across the stack
      </div>
      <div className="relative mask-fade-edges overflow-hidden">
        <div className="flex gap-12 animate-[float_30s_linear_infinite] whitespace-nowrap" style={{ animation: 'marquee 32s linear infinite' }}>
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

function App() {
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const handleOpenBatchModal = () => setIsBatchModalOpen(true);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#09090b] text-zinc-200 selection:bg-cyan-400/20">
        {/* Fixed Viewport Video Cinematic Controller Overlay */}
        <VideoCinematicController />

        {/* 3D Perspective Container for Landing Page Layers */}
        <div className="app-perspective-container">
          {/* Layer 2: Floating Navbar & Status HUD */}
          <div data-layer="2" className="relative z-50">
            <Navbar onOpenBatchModal={handleOpenBatchModal} />
          </div>

          <main>
            {/* Layer 2: Hero Titles & Floating CTAs */}
            <div data-layer="2">
              <Hero onOpenBatchModal={handleOpenBatchModal} />
            </div>

            {/* Layer 0: Swiss grid background marquee */}
            <LogoMarquee />

            {/* Layer 1: Bento Cards & Interactive Canvas Sandbox engines */}
            <div data-layer="1">
              <PlugAndPlaySandbox />
              <CsvDataVisualizer />
              <ShowcaseVideoSection />
              <BentoGrid />
              <BlueprintLibrary />
              <BannerStudio onOpenBatchModal={handleOpenBatchModal} />
              <ExistentialBlackbox />
              <Experts />
            </div>
          </main>

          {/* Layer 1: Footer */}
          <div data-layer="1">
            <Footer />
          </div>
        </div>

        {/* Global Batch Production Modal */}
        <BatchProductionModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
