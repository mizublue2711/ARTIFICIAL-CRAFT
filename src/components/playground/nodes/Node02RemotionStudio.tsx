import React, { useState } from 'react';
import { usePlaygroundStore } from '@/lib/video-engine/store/usePlaygroundStore';
import { usePlaygroundUrlSync } from '@/lib/video-engine/hooks/usePlaygroundUrlSync';
import { PlaygroundStage } from '@/lib/video-engine/components/PlaygroundStage';
import { ShareEmbedModal } from '@/components/playground/ShareEmbedModal';
import { RenderProgressModal } from '@/components/playground/RenderProgressModal';
import { ASSET_PRESET_REGISTRY } from '@/lib/video-engine/presets/registry';
import {
  Film,
  Link as LinkIcon,
  Code,
  Sliders,
  Layers,
} from 'lucide-react';

export interface Node02RemotionStudioProps {
  className?: string;
}

export const Node02RemotionStudio: React.FC<Node02RemotionStudioProps> = ({
  className = '',
}) => {
  // Node 02 (Remotion Video Studio) Hooks & State
  const { isEmbed } = usePlaygroundUrlSync();
  const { recipe, setSlot, updateProps } = usePlaygroundStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string | null) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const backgrounds = Object.values(ASSET_PRESET_REGISTRY.backgrounds);
  const heroObjects = Object.values(ASSET_PRESET_REGISTRY.heroObjects);
  const overlays = Object.values(ASSET_PRESET_REGISTRY.overlays);
  const typographies = Object.values(ASSET_PRESET_REGISTRY.typography);

  return (
    <div className={`flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden ${className}`}>
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

export default Node02RemotionStudio;
