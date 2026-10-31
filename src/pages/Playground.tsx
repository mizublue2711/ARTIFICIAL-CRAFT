import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePlaygroundStore } from '@/lib/video-engine/store/usePlaygroundStore';
import { usePlaygroundUrlSync } from '@/lib/video-engine/hooks/usePlaygroundUrlSync';
import { PlaygroundStage } from '@/lib/video-engine/components/PlaygroundStage';
import { ShareEmbedModal } from '@/components/playground/ShareEmbedModal';
import { RenderProgressModal } from '@/components/playground/RenderProgressModal';
import { ASSET_PRESET_REGISTRY } from '@/lib/video-engine/presets/registry';
import Monolith3DNode from '@/components/playground/Monolith3DNode';
import BannerStudio from '@/components/playground/BannerStudio';
import CsvDataVisualizer from '@/components/playground/CsvDataVisualizer';
import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';
import {
  Box,
  Film,
  Image,
  BarChart3,
  Sparkles,
  Link as LinkIcon,
  Code,
  Sliders,
  Layers,
  Terminal,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export type PlaygroundActiveTab =
  | 'node-01'
  | 'node-02'
  | 'node-03'
  | 'node-04'
  | 'node-05';

export const PlaygroundPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as PlaygroundActiveTab) || 'node-01';
  const [activeTab, setActiveTab] = useState<PlaygroundActiveTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as PlaygroundActiveTab;
    if (tabParam && ['node-01', 'node-02', 'node-03', 'node-04', 'node-05'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSelectTab = (tab: PlaygroundActiveTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Node 02 (Remotion Video Studio) Hooks & State
  const { isEmbed } = usePlaygroundUrlSync();
  const { recipe, setSlot, updateProps } = usePlaygroundStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string | null) => {
    setToastMessage(msg);
    if (msg) {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Embed Mode: Full-screen player canvas only for Node 02
  if (isEmbed) {
    return (
      <div className="w-screen h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
        <PlaygroundStage className="w-full h-full" />
      </div>
    );
  }

  const backgrounds = Object.values(ASSET_PRESET_REGISTRY.backgrounds);
  const heroObjects = Object.values(ASSET_PRESET_REGISTRY.heroObjects);
  const overlays = Object.values(ASSET_PRESET_REGISTRY.overlays);
  const typographies = Object.values(ASSET_PRESET_REGISTRY.typography);

  return (
    <div className="min-h-screen bg-[#06060b] text-zinc-100 flex flex-col font-sans pt-16 selection:bg-cyan-400/20">
      {/* Top Interactive Node Matrix Control Switcher */}
      <header className="px-6 py-3 border-b border-zinc-800/80 bg-[#090913]/95 backdrop-blur-md sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
          <h1 className="font-mono text-xs md:text-sm font-bold tracking-widest text-[#00E5FF] uppercase">
            STUDIO PLAYGROUND // INTERACTIVE NODE MATRIX
          </h1>
        </div>

        {/* 5-Node Navigation Tab Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 font-mono text-xs">
          <button
            onClick={() => handleSelectTab('node-01')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition ${
              activeTab === 'node-01'
                ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>NODE 01: 3D MONOLITH</span>
          </button>

          <button
            onClick={() => handleSelectTab('node-02')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition ${
              activeTab === 'node-02'
                ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>NODE 02: REMOTION</span>
          </button>

          <button
            onClick={() => handleSelectTab('node-03')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition ${
              activeTab === 'node-03'
                ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>NODE 03: BANNER STUDIO</span>
          </button>

          <button
            onClick={() => handleSelectTab('node-04')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition ${
              activeTab === 'node-04'
                ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>NODE 04: MEKONG CAD</span>
          </button>

          <button
            onClick={() => handleSelectTab('node-05')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition ${
              activeTab === 'node-05'
                ? 'border-[#5322ff] bg-[#5322ff]/20 text-[#a855f7] font-bold shadow-[0_0_10px_rgba(83,34,255,0.4)]'
                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5322ff]" />
            <span>NODE 05: STUDIO FACTORY</span>
          </button>
        </div>
      </header>

      {/* Main Node Stage Container */}
      <main className="flex-1 flex flex-col w-full min-h-[calc(100vh-120px)]">
        {/* NODE 01: Procedural 3D Render Engine (Monolith3DNode in Studio Mode) */}
        {activeTab === 'node-01' && (
          <div className="flex-1 w-full h-full relative">
            <Monolith3DNode mode="studio" className="w-full h-full min-h-[calc(100vh-120px)]" />
          </div>
        )}

        {/* NODE 02: Remotion Programmatic Motion Studio */}
        {activeTab === 'node-02' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            {/* Slot Drawer */}
            <aside className="lg:col-span-3 border-r border-zinc-800/80 bg-[#07070e] p-4 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
                <Layers className="w-4 h-4 text-[#00E5FF]" />
                4-Slot Lego Assembly
              </div>

              {/* Slot 1: Background */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider block">
                  1. Background Layer
                </label>
                <select
                  value={recipe.slots.backgroundId}
                  onChange={(e) => setSlot('backgroundId', e.target.value)}
                  className="w-full bg-[#10101a] border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-zinc-200 focus:border-[#00E5FF] focus:outline-none"
                >
                  {backgrounds.map((bg) => (
                    <option key={bg.id} value={bg.id}>
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot 2: 3D Hero */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider block">
                  2. 3D Hero / Mesh Layer
                </label>
                <select
                  value={recipe.slots.heroObjectId}
                  onChange={(e) => setSlot('heroObjectId', e.target.value)}
                  className="w-full bg-[#10101a] border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-zinc-200 focus:border-[#00E5FF] focus:outline-none"
                >
                  {heroObjects.map((hero) => (
                    <option key={hero.id} value={hero.id}>
                      {hero.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot 3: Overlay */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider block">
                  3. HUD & Border Overlay Layer
                </label>
                <select
                  value={recipe.slots.overlayId}
                  onChange={(e) => setSlot('overlayId', e.target.value)}
                  className="w-full bg-[#10101a] border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-zinc-200 focus:border-[#00E5FF] focus:outline-none"
                >
                  {overlays.map((ov) => (
                    <option key={ov.id} value={ov.id}>
                      {ov.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot 4: Kinetic Typography */}
              <div className="space-y-2">
                <label className="font-mono text-[11px] text-[#00E5FF] uppercase tracking-wider block">
                  4. Kinetic Typography Layer
                </label>
                <select
                  value={recipe.slots.textId}
                  onChange={(e) => setSlot('textId', e.target.value)}
                  className="w-full bg-[#10101a] border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-zinc-200 focus:border-[#00E5FF] focus:outline-none"
                >
                  {typographies.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.label}
                    </option>
                  ))}
                </select>
              </div>
            </aside>

            {/* Stage Player */}
            <main className="lg:col-span-6 bg-[#040408] p-4 flex flex-col gap-4 overflow-hidden items-center justify-start">
              <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 bg-[#090913] border border-zinc-800 rounded">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Shareable Recipe Link Copied!');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded font-mono text-xs font-semibold transition"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                    Copy Share Link
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] rounded font-mono text-xs font-semibold transition"
                  >
                    <Code className="w-3.5 h-3.5" />
                    Copy Embed Code
                  </button>
                </div>

                <button
                  onClick={() => setIsRenderModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black rounded font-mono text-xs font-bold transition shadow-lg shadow-[#00E5FF]/20"
                >
                  <Film className="w-4 h-4" />
                  Trigger Render MP4
                </button>
              </div>

              <div className="w-full flex-1 flex items-center justify-center p-2 bg-black/50 border border-zinc-800 rounded overflow-hidden shadow-2xl relative">
                <PlaygroundStage className="w-full max-w-4xl" />
                {toastMessage && (
                  <div className="absolute top-4 bg-[#00E5FF] text-black font-mono text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-bounce z-30">
                    {toastMessage}
                  </div>
                )}
              </div>
            </main>

            {/* Inspector */}
            <aside className="lg:col-span-3 border-l border-zinc-800/80 bg-[#07070e] p-4 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-120px)]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
                <Sliders className="w-4 h-4 text-[#00E5FF]" />
                3D & Parametric Inspector
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-zinc-400">3D Pitch (rotateX)</span>
                  <span className="text-[#00E5FF] font-bold">{recipe.props.rotateXDeg ?? 28}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={recipe.props.rotateXDeg ?? 28}
                  onChange={(e) => updateProps({ rotateXDeg: Number(e.target.value) })}
                  className="w-full accent-[#00E5FF] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-zinc-400">Camera Zoom</span>
                  <span className="text-[#00E5FF] font-bold">{(recipe.props.cameraZoom ?? 1.0).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={recipe.props.cameraZoom ?? 1.0}
                  onChange={(e) => updateProps({ cameraZoom: Number(e.target.value) })}
                  className="w-full accent-[#00E5FF] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-zinc-400">Submesh Dispersion</span>
                  <span className="text-[#00E5FF] font-bold">{(recipe.props.dispersionAmount ?? 0.12).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.01"
                  value={recipe.props.dispersionAmount ?? 0.12}
                  onChange={(e) => updateProps({ dispersionAmount: Number(e.target.value) })}
                  className="w-full accent-[#00E5FF] cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="font-mono text-[11px] text-zinc-400 uppercase font-bold">
                  Typography Text Lines
                </div>
                <input
                  type="text"
                  value={recipe.props.textLine1 ?? ''}
                  onChange={(e) => updateProps({ textLine1: e.target.value })}
                  placeholder="Line 1"
                  className="w-full bg-[#10101a] border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-[#00E5FF] focus:border-[#00E5FF] focus:outline-none"
                />
                <input
                  type="text"
                  value={recipe.props.textLine2 ?? ''}
                  onChange={(e) => updateProps({ textLine2: e.target.value })}
                  placeholder="Line 2"
                  className="w-full bg-[#10101a] border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-purple-300 focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
            </aside>
          </div>
        )}

        {/* NODE 03: Automated Brand Asset / Banner Studio */}
        {activeTab === 'node-03' && (
          <div className="flex-1 w-full bg-[#09090b]">
            <BannerStudio />
          </div>
        )}

        {/* NODE 04: Open Mekong CAD Data Visualizer */}
        {activeTab === 'node-04' && (
          <div className="flex-1 w-full bg-[#09090b]">
            <CsvDataVisualizer />
          </div>
        )}

        {/* NODE 05: Studio Configurator Node (Nhà máy sản xuất Web 3D No-Code/Low-Code) */}
        {activeTab === 'node-05' && (
          <div className="flex-1 w-full h-full relative">
            <CraftStudioConfigurator />
          </div>
        )}
      </main>

      {/* Node 02 Modals */}
      <ShareEmbedModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        setToastMessage={showToast}
      />
      <RenderProgressModal
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
      />
    </div>
  );
};

export default PlaygroundPage;
