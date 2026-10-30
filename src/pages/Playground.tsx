import React, { useState } from 'react';
import { usePlaygroundStore } from '@/lib/video-engine/store/usePlaygroundStore';
import { usePlaygroundUrlSync } from '@/lib/video-engine/hooks/usePlaygroundUrlSync';
import { PlaygroundStage } from '@/lib/video-engine/components/PlaygroundStage';
import { ShareEmbedModal } from '@/components/playground/ShareEmbedModal';
import { RenderProgressModal } from '@/components/playground/RenderProgressModal';
import { presetRegistry } from '@/lib/video-engine/presets/registry';
import { Link, Code, Film, Sliders, Layers } from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
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

  // Embed Mode: Full-screen player canvas only
  if (isEmbed) {
    return (
      <div className="w-screen h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
        <PlaygroundStage className="w-full h-full" autoPlay loop controls />
      </div>
    );
  }

  // Group presets by category
  const backgrounds = presetRegistry.filter((p) => p.category === 'background');
  const heroObjects = presetRegistry.filter((p) => p.tags.includes('hero-3d') || p.tags.includes('3d') || p.id.includes('3D'));
  const overlays = presetRegistry.filter((p) => p.tags.includes('border') || p.tags.includes('hud') || p.tags.includes('overlay'));
  const typographies = presetRegistry.filter((p) => p.tags.includes('typography') || p.tags.includes('kinetic') || p.tags.includes('marquee'));

  return (
    <div className="min-h-screen bg-[#050509] text-zinc-100 flex flex-col font-sans pt-16">
      {/* Top Header */}
      <header className="px-6 py-3 border-b border-zinc-800/80 bg-[#080811]/90 backdrop-blur-md flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h1 className="font-mono text-sm font-bold tracking-widest text-cyan-400 uppercase">
            VIDEO PLAYGROUND STUDIO • LEGO ORCHESTRATOR
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded">
            60 FPS ENGINE
          </span>
          <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded">
            1920x1080 2K
          </span>
        </div>
      </header>

      {/* Main 3-Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Cột 1: Drawer / Asset Selection (3 columns wide) */}
        <aside className="lg:col-span-3 border-r border-zinc-800/80 bg-[#07070e] p-4 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
            <Layers className="w-4 h-4 text-cyan-400" />
            4-Slot Lego Assembly
          </div>

          {/* Slot 1: Background */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider block">
              1. Background Layer
            </label>
            <select
              value={recipe.slots.backgroundId}
              onChange={(e) => setSlot('backgroundId', e.target.value)}
              className="w-full bg-[#10101a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              {backgrounds.map((bg) => (
                <option key={bg.id} value={bg.id}>
                  {bg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slot 2: 3D Hero */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider block">
              2. 3D Hero / Mesh Layer
            </label>
            <select
              value={recipe.slots.heroObjectId}
              onChange={(e) => setSlot('heroObjectId', e.target.value)}
              className="w-full bg-[#10101a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              {heroObjects.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slot 3: Overlay */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider block">
              3. HUD & Border Overlay Layer
            </label>
            <select
              value={recipe.slots.overlayId}
              onChange={(e) => setSlot('overlayId', e.target.value)}
              className="w-full bg-[#10101a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              {overlays.map((ov) => (
                <option key={ov.id} value={ov.id}>
                  {ov.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slot 4: Kinetic Typography */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider block">
              4. Kinetic Typography Layer
            </label>
            <select
              value={recipe.slots.textId}
              onChange={(e) => setSlot('textId', e.target.value)}
              className="w-full bg-[#10101a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-zinc-200 focus:border-cyan-500 focus:outline-none"
            >
              {typographies.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.name}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Cột 2: Action Toolbar & Remotion Stage (6 columns wide) */}
        <main className="lg:col-span-6 bg-[#040408] p-4 flex flex-col gap-4 overflow-hidden items-center justify-start">
          {/* Action Toolbar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 bg-[#090913] border border-zinc-800/80 rounded-xl">
            <div className="flex items-center gap-2">
              {/* Copy Share Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Shareable Recipe Link Copied!');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-lg font-mono text-xs font-semibold transition"
              >
                <Link className="w-3.5 h-3.5 text-cyan-400" />
                Copy Share Link
              </button>

              {/* Copy Embed Code */}
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-lg font-mono text-xs font-semibold transition"
              >
                <Code className="w-3.5 h-3.5" />
                Copy Embed Code
              </button>
            </div>

            {/* Trigger Render MP4 */}
            <button
              onClick={() => setIsRenderModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-mono text-xs font-bold transition shadow-lg shadow-cyan-500/20"
            >
              <Film className="w-4 h-4" />
              Trigger Render MP4
            </button>
          </div>

          {/* Stage Player */}
          <div className="w-full flex-1 flex items-center justify-center p-2 bg-black/50 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
            <PlaygroundStage className="w-full max-w-4xl" autoPlay loop controls />

            {/* Toast overlay */}
            {toastMessage && (
              <div className="absolute top-4 bg-cyan-500 text-black font-mono text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-bounce z-30">
                {toastMessage}
              </div>
            )}
          </div>
        </main>

        {/* Cột 3: Inspector / Parameter Controls (3 columns wide) */}
        <aside className="lg:col-span-3 border-l border-zinc-800/80 bg-[#07070e] p-4 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            3D & Parametric Inspector
          </div>

          {/* rotateXDeg (Isometric pitch) */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-zinc-400">3D Pitch (rotateX)</span>
              <span className="text-cyan-400 font-bold">{recipe.props.rotateXDeg ?? 28}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={recipe.props.rotateXDeg ?? 28}
              onChange={(e) => updateProps({ rotateXDeg: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 font-mono">
              Note: Default 28° isometric constraint prevents 3D plane flattening.
            </span>
          </div>

          {/* cameraZoom */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-zinc-400">Camera Zoom</span>
              <span className="text-cyan-400 font-bold">{(recipe.props.cameraZoom ?? 1.0).toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={recipe.props.cameraZoom ?? 1.0}
              onChange={(e) => updateProps({ cameraZoom: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* dispersionAmount */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-zinc-400">Submesh Dispersion</span>
              <span className="text-cyan-400 font-bold">{(recipe.props.dispersionAmount ?? 0.12).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.01"
              value={recipe.props.dispersionAmount ?? 0.12}
              onChange={(e) => updateProps({ dispersionAmount: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Typography Inputs */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <div className="font-mono text-[11px] text-zinc-400 uppercase font-bold">
              Typography Line 1 & Line 2
            </div>
            <input
              type="text"
              value={recipe.props.textLine1 ?? ''}
              onChange={(e) => updateProps({ textLine1: e.target.value })}
              placeholder="Line 1"
              className="w-full bg-[#10101a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              value={recipe.props.textLine2 ?? ''}
              onChange={(e) => updateProps({ textLine2: e.target.value })}
              placeholder="Line 2"
              className="w-full bg-[#10101a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-purple-300 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Color Tokens */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <div className="font-mono text-[11px] text-zinc-400 uppercase font-bold">
              Color Tokens
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="color"
                  value={recipe.props.primaryColor || '#00E5FF'}
                  onChange={(e) => updateProps({ primaryColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                />
                <span className="text-zinc-300">Primary</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="color"
                  value={recipe.props.secondaryColor || '#7000FF'}
                  onChange={(e) => updateProps({ secondaryColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                />
                <span className="text-zinc-300">Secondary</span>
              </label>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
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
