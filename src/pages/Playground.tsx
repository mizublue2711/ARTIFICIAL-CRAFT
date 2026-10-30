import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Box,
  Crosshair,
  Type,
  Sliders,
  Code,
  Copy,
  Check,
  Zap,
  Download,
  Video,
  X,
  Palette,
  Eye,
} from 'lucide-react';
import { PlaygroundStage } from '@/components/PlaygroundStage';
import { usePlaygroundStore } from '@/lib/usePlaygroundStore';

export default function Playground() {
  const {
    recipe,
    slots,
    brandColors,
    camera3D,
    kineticText,
    updateSlots,
    updateBrandColors,
    updateCamera3D,
    updateKineticText,
    loadPreset,
  } = usePlaygroundStore();

  const [activeFrame, setActiveFrame] = useState(0);

  // Accordion drawer state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    backgrounds: true,
    meshes: true,
    overlays: true,
    typography: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modals state
  const [isExportJsonOpen, setIsExportJsonOpen] = useState(false);
  const [isCloudRenderOpen, setIsCloudRenderOpen] = useState(false);
  const [isEmbedCodeOpen, setIsEmbedCodeOpen] = useState(false);

  // Copy feedback state
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderSuccess, setRenderSuccess] = useState(false);

  // Collapsible Inspector Code Box
  const [inspectorCodeOpen, setInspectorCodeOpen] = useState(true);

  // Asset catalogs
  const BACKGROUND_OPTIONS = [
    'SWISS_GRID',
    'DOT_MATRIX',
    'CAD_BLUEPRINT',
    'CRT_SCANLINES',
    'CYBER_RAIN',
    'GOLD_AMBER',
    'DARK_VOID',
    'NEON_GRADIENT',
    'TECHNICAL_MESH',
  ];

  const MESH_OPTIONS = [
    'ISOMETRIC_CUBE',
    'PARTICLE_SPHERE',
    'WIREFRAME_TORUS',
    'NEURAL_ANCHOR',
    'CYBER_PYRAMID',
  ];

  const OVERLAY_OPTIONS = [
    'CROSSHAIRS',
    'TELEMETRY_GRID',
    'SCANLINES',
    'SWISS_DIMENSION',
    'VECTOR_RETICLE',
  ];

  const TYPOGRAPHY_OPTIONS = [
    'SWISS_BRUTALIST',
    'CYBERPUNK_MONO',
    'NEON_BOLD',
    'GLITCH_MATRIX',
    'MINIMAL_SANS',
  ];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(recipe, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const embedSnippet = `<div class="ac-embed-container" style="position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #0B0B0F; border: 1px solid #27272A;">
  <iframe src="https://artificialcraft.space/embed/playground?bg=${slots.backgroundId}&hero=${slots.heroObjectId}" width="100%" height="100%" frameborder="0" scrolling="no" loading="lazy"></iframe>
  <div style="position: absolute; bottom: 8px; right: 12px; font-size: 10px; color: #71717A; pointer-events: auto;">
    <a href="https://artificialcraft.space" target="_blank" rel="noopener" style="color: #00E5FF; text-decoration: none; font-weight: bold;">ARTIFICIAL CRAFT // ENGINE ↗</a>
  </div>
</div>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handleTriggerCloudRender = () => {
    setIsRendering(true);
    setRenderSuccess(false);
    setTimeout(() => {
      setIsRendering(false);
      setRenderSuccess(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200 font-mono flex flex-col pt-16 select-none overflow-x-hidden">
      {/* 3-COLUMN HIGH-TECH STUDIO LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[18vw_56vw_26vw] min-h-[calc(100vh-4rem)] border-t border-zinc-800">
        {/* ================= CỘT 1: LEGO DRAWER & ASSET CATALOG (Left 18vw) ================= */}
        <aside className="border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#08080B] p-4 flex flex-col justify-between font-mono space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-none">
          <div className="space-y-4">
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Layers className="h-4 w-4 text-[#00E5FF]" />
                <span>LEGO ASSET DRAWER</span>
              </div>
              <span className="text-[9px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5">
                v2.4
              </span>
            </div>

            {/* Quick-Load Preset Template Buttons */}
            <div>
              <div className="text-[10px] uppercase text-zinc-500 tracking-widest mb-2 font-bold">
                QUICK-LOAD PRESET TEMPLATES
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => loadPreset('CYBERPUNK_MATRIX')}
                  className="w-full text-left py-1.5 px-2.5 border border-zinc-800 bg-zinc-950 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[11px] font-bold text-zinc-300 hover:text-cyan-glow transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>⚡ Cyberpunk Matrix</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600 group-hover:text-cyan-glow group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => loadPreset('SWISS_BRUTALISM')}
                  className="w-full text-left py-1.5 px-2.5 border border-zinc-800 bg-zinc-950 hover:border-[#5322FF] hover:bg-[#5322FF]/20 text-[11px] font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>🇨🇭 Swiss Brutalism CAD</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => loadPreset('GOLD_AMBER_CAD')}
                  className="w-full text-left py-1.5 px-2.5 border border-zinc-800 bg-zinc-950 hover:border-[#F59E0B] hover:bg-[#F59E0B]/10 text-[11px] font-bold text-zinc-300 hover:text-amber-400 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span>📐 Gold Amber Architecture</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Accordion Categories */}
            <div className="space-y-2 border-t border-zinc-800 pt-3">
              {/* 1. Backgrounds (9 Presets) */}
              <div className="border border-zinc-800/80 bg-zinc-950">
                <button
                  onClick={() => toggleAccordion('backgrounds')}
                  className="w-full flex items-center justify-between p-2 text-xs font-bold text-zinc-300 hover:text-white uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-cyan-glow" />
                    <span>Backgrounds (9 Presets)</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                      openAccordions.backgrounds ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.backgrounds && (
                  <div className="p-2 border-t border-zinc-800 space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase mb-1">
                      Active Slot: backgroundId
                    </label>
                    <select
                      value={slots.backgroundId}
                      onChange={(e) => updateSlots({ backgroundId: e.target.value })}
                      className="w-full bg-[#09090b] border border-zinc-800 text-[11px] text-cyan-glow p-1.5 outline-none font-mono"
                    >
                      {BACKGROUND_OPTIONS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 2. 3D Meshes */}
              <div className="border border-zinc-800/80 bg-zinc-950">
                <button
                  onClick={() => toggleAccordion('meshes')}
                  className="w-full flex items-center justify-between p-2 text-xs font-bold text-zinc-300 hover:text-white uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Box className="h-3.5 w-3.5 text-[#5322FF]" />
                    <span>3D Meshes & Objects</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                      openAccordions.meshes ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.meshes && (
                  <div className="p-2 border-t border-zinc-800 space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase mb-1">
                      Active Slot: heroObjectId
                    </label>
                    <select
                      value={slots.heroObjectId}
                      onChange={(e) => updateSlots({ heroObjectId: e.target.value })}
                      className="w-full bg-[#09090b] border border-zinc-800 text-[11px] text-white p-1.5 outline-none font-mono"
                    >
                      {MESH_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 3. HUD Overlays */}
              <div className="border border-zinc-800/80 bg-zinc-950">
                <button
                  onClick={() => toggleAccordion('overlays')}
                  className="w-full flex items-center justify-between p-2 text-xs font-bold text-zinc-300 hover:text-white uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Crosshair className="h-3.5 w-3.5 text-amber-400" />
                    <span>HUD Overlays</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                      openAccordions.overlays ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.overlays && (
                  <div className="p-2 border-t border-zinc-800 space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase mb-1">
                      Active Slot: overlayId
                    </label>
                    <select
                      value={slots.overlayId}
                      onChange={(e) => updateSlots({ overlayId: e.target.value })}
                      className="w-full bg-[#09090b] border border-zinc-800 text-[11px] text-amber-400 p-1.5 outline-none font-mono"
                    >
                      {OVERLAY_OPTIONS.map((ov) => (
                        <option key={ov} value={ov}>
                          {ov}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 4. Kinetic Typography */}
              <div className="border border-zinc-800/80 bg-zinc-950">
                <button
                  onClick={() => toggleAccordion('typography')}
                  className="w-full flex items-center justify-between p-2 text-xs font-bold text-zinc-300 hover:text-white uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Type className="h-3.5 w-3.5 text-purple-400" />
                    <span>Kinetic Typography</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                      openAccordions.typography ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.typography && (
                  <div className="p-2 border-t border-zinc-800 space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase mb-1">
                      Active Slot: textId
                    </label>
                    <select
                      value={slots.textId}
                      onChange={(e) => updateSlots({ textId: e.target.value })}
                      className="w-full bg-[#09090b] border border-zinc-800 text-[11px] text-purple-300 p-1.5 outline-none font-mono"
                    >
                      {TYPOGRAPHY_OPTIONS.map((tOpt) => (
                        <option key={tOpt} value={tOpt}>
                          {tOpt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-600 border-t border-zinc-800 pt-2 flex justify-between">
            <span>SLOT MATRIX: 4/4 ACTIVE</span>
            <span>60 FPS</span>
          </div>
        </aside>

        {/* ================= CỘT 2: MAIN STAGE & TIMELINE PREVIEW (Center 56vw) ================= */}
        <section className="bg-[#07070A] p-4 lg:p-6 flex flex-col justify-between space-y-4 border-b lg:border-b-0 lg:border-r border-zinc-800">
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* Stage Title Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Eye className="h-4 w-4 text-cyan-glow" />
                <span>16:9 MAIN STAGE CANVASES</span>
              </div>
              <span className="text-[10px] text-cyan-glow font-bold">
                COMPOSITION: 1920x1080 @ 60FPS
              </span>
            </div>

            {/* Centered 16:9 Canvas Embedding Remotion Player */}
            <PlaygroundStage
              recipe={recipe}
              onFrameChange={(f) => setActiveFrame(f)}
            />

            {/* Frame Scrubber / Telemetry Waveform Bar below Canvas */}
            <div className="border border-zinc-800 bg-zinc-950 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white uppercase">
                  FRAME: {activeFrame} / 180 @ 60FPS
                </span>
              </div>
              <div className="flex-1 max-w-md w-full bg-zinc-900 h-2 border border-zinc-800 overflow-hidden relative">
                <div
                  className="bg-gradient-to-r from-[#00E5FF] to-[#5322FF] h-full transition-all duration-75"
                  style={{ width: `${(activeFrame / 180) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {(activeFrame / 60).toFixed(2)}s / 3.00s
              </span>
            </div>

            {/* Action Toolbar below Canvas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* 📤 [Export JSON Recipe] */}
              <button
                type="button"
                onClick={() => setIsExportJsonOpen(true)}
                className="py-2.5 px-3 border border-cyan-glow/50 bg-cyan-glow/10 hover:bg-cyan-glow hover:text-black text-cyan-glow font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Download className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span>[EXPORT JSON RECIPE]</span>
              </button>

              {/* 🎬 [Trigger Cloud Render MP4] */}
              <button
                type="button"
                onClick={() => setIsCloudRenderOpen(true)}
                className="py-2.5 px-3 border border-[#5322FF] bg-[#5322FF]/20 hover:bg-[#5322FF] text-white font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Video className="h-4 w-4 text-cyan-glow shrink-0 group-hover:scale-110 transition-transform" />
                <span>[CLOUD RENDER MP4]</span>
              </button>

              {/* 🔗 [Copy Embed Code] */}
              <button
                type="button"
                onClick={() => setIsEmbedCodeOpen(true)}
                className="py-2.5 px-3 border border-zinc-700 bg-zinc-950 hover:border-cyan-glow hover:bg-zinc-900 text-zinc-300 hover:text-cyan-glow font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Code className="h-4 w-4 text-cyan-glow shrink-0 group-hover:scale-110 transition-transform" />
                <span>[COPY EMBED CODE]</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= CỘT 3: LIVE PARAMETRIC INSPECTOR (Right 26vw) ================= */}
        <aside className="bg-[#0B0B0F] p-4 lg:p-5 flex flex-col justify-between font-mono space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-none">
          <div className="space-y-5">
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Sliders className="h-4 w-4 text-cyan-glow" />
                <span>LIVE PARAMETRIC INSPECTOR</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-cyan-glow animate-ping" />
            </div>

            {/* 1. Graphic & Brand Colors */}
            <div className="space-y-3 border-b border-zinc-800/80 pb-4">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-cyan-glow" />
                <span>01 // GRAPHIC & BRAND COLORS</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Primary Color Picker */}
                <div>
                  <div className="text-[10px] text-zinc-400 mb-1">primaryColor</div>
                  <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 p-1.5">
                    <input
                      type="color"
                      value={brandColors.primaryColor}
                      onChange={(e) => updateBrandColors({ primaryColor: e.target.value })}
                      className="h-6 w-6 border-0 bg-transparent cursor-pointer rounded-none"
                    />
                    <span className="text-xs font-bold text-cyan-glow">
                      {brandColors.primaryColor}
                    </span>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div>
                  <div className="text-[10px] text-zinc-400 mb-1">accentColor</div>
                  <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 p-1.5">
                    <input
                      type="color"
                      value={brandColors.accentColor}
                      onChange={(e) => updateBrandColors({ accentColor: e.target.value })}
                      className="h-6 w-6 border-0 bg-transparent cursor-pointer rounded-none"
                    />
                    <span className="text-xs font-bold text-purple-400">
                      {brandColors.accentColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 3D Camera & Dispersion Sliders */}
            <div className="space-y-4 border-b border-zinc-800/80 pb-4">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5 text-[#5322FF]" />
                <span>02 // 3D CAMERA & DISPERSION</span>
              </label>

              {/* cameraZoom Slider (0.5 to 2.0, Step 0.05) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">cameraZoom</span>
                  <span className="text-cyan-glow font-bold">
                    {camera3D.cameraZoom.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={camera3D.cameraZoom}
                  onChange={(e) => updateCamera3D({ cameraZoom: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 appearance-none cursor-pointer accent-[#00E5FF]"
                />
                <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>

              {/* rotateXDeg Slider (-90 to 90, Default 28) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">rotateXDeg</span>
                  <span className="text-[#5322FF] font-bold">{camera3D.rotateXDeg}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="1"
                  value={camera3D.rotateXDeg}
                  onChange={(e) => updateCamera3D({ rotateXDeg: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-zinc-800 appearance-none cursor-pointer accent-[#5322FF]"
                />
                <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                  <span>-90°</span>
                  <span>+90°</span>
                </div>
              </div>

              {/* dispersionAmount Slider (0.0 to 0.5, Clamped at 0.12) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">dispersionAmount</span>
                  <span className="text-amber-400 font-bold">
                    {camera3D.dispersionAmount.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.01"
                  value={camera3D.dispersionAmount}
                  onChange={(e) => updateCamera3D({ dispersionAmount: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                  <span>0.00</span>
                  <span>0.50 (CLAMP: 0.12)</span>
                </div>
              </div>
            </div>

            {/* 3. Kinetic Text Inputs */}
            <div className="space-y-3 border-b border-zinc-800/80 pb-4">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-purple-400" />
                <span>03 // KINETIC TEXT INPUTS</span>
              </label>

              <div>
                <div className="text-[10px] text-zinc-400 mb-1">textLine1</div>
                <input
                  type="text"
                  value={kineticText.textLine1}
                  onChange={(e) => updateKineticText({ textLine1: e.target.value })}
                  placeholder="Line 1 Title..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2 font-mono outline-none focus:border-cyan-glow"
                />
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 mb-1">textLine2</div>
                <input
                  type="text"
                  value={kineticText.textLine2}
                  onChange={(e) => updateKineticText({ textLine2: e.target.value })}
                  placeholder="Line 2 Subtitle..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 p-2 font-mono outline-none focus:border-cyan-glow"
                />
              </div>
            </div>

            {/* 4. Live Collapsible Code Recipe Preview */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setInspectorCodeOpen((v) => !v)}
                className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500 font-bold py-1 border-b border-zinc-800/80 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-cyan-glow" />
                  <span>04 // LIVE RECIPE JSON</span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
                    inspectorCodeOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {inspectorCodeOpen && (
                <div className="relative border border-zinc-800 bg-zinc-950 p-2 text-[10px] font-mono text-cyan-glow overflow-x-auto max-h-48 scrollbar-none">
                  <pre>{JSON.stringify(recipe, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL 1: EXPORT JSON RECIPE */}
      {isExportJsonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-[95vw] max-w-lg mx-auto border border-zinc-800 bg-[#09090c] p-6 shadow-2xl font-mono">
            <button
              onClick={() => setIsExportJsonOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 border border-zinc-800 bg-zinc-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-cyan-glow font-bold text-sm mb-4">
              <Download className="h-4 w-4 shrink-0" />
              <span>EXPORTED STUDIO RECIPE JSON</span>
            </div>

            <textarea
              readOnly
              rows={12}
              value={JSON.stringify(recipe, null, 2)}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs text-cyan-glow p-3 font-mono outline-none focus:border-cyan-glow select-all"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">DETERMINISTIC JSON SCHEMA v1.0</span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="py-2 px-4 border border-[#5322FF] bg-[#5322FF] text-white font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 hover:bg-[#5322FF]/80 cursor-pointer"
              >
                {copiedJson ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedJson ? 'COPIED JSON' : 'COPY RECIPE JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TRIGGER CLOUD RENDER MP4 */}
      {isCloudRenderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-[95vw] max-w-lg mx-auto border border-zinc-800 bg-[#09090c] p-6 shadow-2xl font-mono">
            <button
              onClick={() => setIsCloudRenderOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 border border-zinc-800 bg-zinc-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
              <Video className="h-4 w-4 text-cyan-glow shrink-0" />
              <span>CLOUD RENDER MP4 ENGINE</span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 font-sans">
              Dispatches Remotion Cloud Run parallel render cluster payload with active 60FPS video composition parameters.
            </p>

            <div className="border border-zinc-800 bg-zinc-950 p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">RENDER CLUSTER:</span>
                <span className="text-cyan-glow font-bold">GCP Cloud Run (16 vCPU)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">RESOLUTION:</span>
                <span className="text-white font-bold">1920x1080 @ 60FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PAYLOAD HASH:</span>
                <span className="text-purple-400 font-bold">0x71C8A93A920B</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">
                {isRendering ? 'DISPATCHING PAYLOAD...' : renderSuccess ? 'RENDER COMPLETED' : 'READY'}
              </span>

              <button
                type="button"
                onClick={handleTriggerCloudRender}
                disabled={isRendering}
                className="py-2.5 px-5 border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="h-4 w-4 text-cyan-glow" />
                <span>{isRendering ? 'RENDERING...' : renderSuccess ? 'DISPATCH AGAIN' : 'TRIGGER MP4 RENDER'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: COPY EMBED CODE */}
      {isEmbedCodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-[95vw] max-w-lg mx-auto border border-zinc-800 bg-[#09090c] p-6 shadow-2xl font-mono">
            <button
              onClick={() => setIsEmbedCodeOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 border border-zinc-800 bg-zinc-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-cyan-glow font-bold text-sm mb-4">
              <Code className="h-4 w-4 shrink-0" />
              <span>COPY WIDGET EMBED CODE</span>
            </div>

            <textarea
              readOnly
              rows={6}
              value={embedSnippet}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 p-3 font-mono outline-none focus:border-cyan-glow select-all"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">MANDATORY DOFOLLOW BACKLINK INCLUDED</span>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="py-2 px-4 border border-[#5322FF] bg-[#5322FF] text-white font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 hover:bg-[#5322FF]/80 cursor-pointer"
              >
                {copiedEmbed ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedEmbed ? 'COPIED SNIPPET' : 'COPY EMBED SNIPPET'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
