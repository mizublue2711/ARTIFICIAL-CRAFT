import React from 'react';
import { ExternalLink, Radio, Shield, AlertCircle } from 'lucide-react';
import { AspectRatioMode } from '../three/SceneController';
import { ExportProgress } from '../utils/videoRecorder';

interface ViewportOverlayProps {
  currentTime: number;
  currentAct: number;
  frame: number;
  aspectRatio: AspectRatioMode;
  exportProgress: ExportProgress | null;
  onCancelExport: () => void;
  onOpenDossier: () => void;
}

const ACT_MESSAGES = [
  {
    name: 'ACT 01: THE PROBLEM',
    timecode: '00:00 – 00:06',
    quote: '"Most AI marketing is fluff. Generic prompts, slow chains, zero impact. People scroll right past it. We open with a monolithic block cutting through the darkness. Contrast grabs attention."',
    motion: 'Raymarching Implicit Surface // 4D Simplex Noise Field // Swiss CAD Grid',
  },
  {
    name: 'ACT 02: THE LOGIC',
    timecode: '00:06 – 00:12',
    quote: '"Separation of powers. You don\'t use LLM tokens to parse a JSON array. Dify thinks; n8n executes. Brain meets muscle. Simple. Unstoppable."',
    motion: 'Glassmorphic CAD Layers // Quaternion 3D Rotations // Staggered Spring Physics',
  },
  {
    name: 'ACT 03: THE PRECISION',
    timecode: '00:12 – 00:18',
    quote: '"Web apps fail with an error code. AI workflows fail silently by drifting. Our calipers lock down every pixel. Deterministic output, every single time."',
    motion: 'Instanced Glyph Matrix // Kinetic Variable Font Morphing // Scramble Decode',
  },
  {
    name: 'ACT 04: THE AUDIT',
    timecode: '00:18 – 00:24',
    quote: '"One LLM guessing is a hazard. Four specialized models auditing each other is a system. We kill errors at the gate before spending a dime on GPU rendering."',
    motion: 'Volumetric Hexagonal Tunnel // 5000 Particles // 120 BPM Pulse Rhythm',
  },
  {
    name: 'ACT 05: THE CALL TO ACTION',
    timecode: '00:24 – 00:30',
    quote: '"No fluff, no sales pitch. Low-angle hero shot. Craft meets Code. Direct link to artificialcraft.space."',
    motion: 'Proximity Node Linking // Attractor Field Physics // Elastic Gravity Pulse',
  },
];

export const ViewportOverlay: React.FC<ViewportOverlayProps> = ({
  currentTime,
  currentAct,
  frame,
  aspectRatio,
  exportProgress,
  onCancelExport,
  onOpenDossier,
}) => {
  const actInfo = ACT_MESSAGES[Math.min(4, Math.max(0, currentAct))];

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
      {/* 9:16 Vertical Aspect Ratio Guide Masks */}
      {aspectRatio === '9:16' && (
        <div className="absolute inset-0 flex items-center justify-between">
          <div className="h-full bg-black/85 border-r border-[#1e253c] w-[calc((100vw-(100vh*9/16))/2)] transition-all" />
          <div className="h-full pointer-events-none flex-1 border-x border-[#00E5FF]/40 relative">
            {/* Safe area title marker for mobile shorts */}
            <div className="absolute top-24 left-4 right-4 text-center">
              <span className="px-2 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF]">
                9:16 MOBILE SAFE ZONE
              </span>
            </div>
          </div>
          <div className="h-full bg-black/85 border-l border-[#1e253c] w-[calc((100vw-(100vh*9/16))/2)] transition-all" />
        </div>
      )}

      {/* 4 Corner CAD Crosshairs (+) */}
      <div className="absolute top-4 left-4 text-[#00E5FF] font-mono text-xs opacity-60">+ [00,00]</div>
      <div className="absolute top-4 right-4 text-[#00E5FF] font-mono text-xs opacity-60">[1920,00] +</div>
      <div className="absolute bottom-4 left-4 text-[#00E5FF] font-mono text-xs opacity-60">+ [00,1080]</div>
      <div className="absolute bottom-4 right-4 text-[#00E5FF] font-mono text-xs opacity-60">[1920,1080] +</div>

      {/* Top Left Title & Act Spec */}
      <div className="absolute top-4 left-6 pointer-events-auto max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 bg-[#00E5FF]" />
          <h1 className="font-mono font-extrabold text-sm tracking-wider uppercase text-white">
            ArtificialCraft <span className="text-[#00E5FF]">//</span> Monolith
          </h1>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#5322FF]/30 border border-[#5322FF]/60 text-purple-200">
            60FPS
          </span>
        </div>

        {/* Current Act Sub-Bar */}
        <div className="bg-[#090c17]/90 border border-[#1b233a] p-2 mt-1 shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-gray-400">
            <span className="text-[#00E5FF] font-bold">{actInfo.name}</span>
            <span className="text-gray-400">{actInfo.timecode}</span>
          </div>
          <p className="text-[11px] font-mono text-gray-200 leading-tight">
            {actInfo.quote}
          </p>
          <div className="mt-1 text-[9px] font-mono text-[#5f6d91] truncate">
            KEY: {actInfo.motion}
          </div>
        </div>
      </div>

      {/* Top Right Telemetry & Links */}
      <div className="absolute top-4 right-6 pointer-events-auto flex items-center gap-3">
        {/* Realtime Telemetry Pill */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[#090c17]/90 border border-[#1b233a] text-[10px] font-mono text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white font-bold">60.0 FPS</span>
          </div>
          <span className="text-[#2b3552]">|</span>
          <span>TICK: {frame}</span>
          <span className="text-[#2b3552]">|</span>
          <span className="text-[#00E5FF]">ZERO GC</span>
        </div>

        <a
          href="https://artificialcraft.space/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12172b] hover:bg-[#1a2240] border border-[#263359] text-[11px] font-mono text-[#00E5FF] font-bold uppercase transition-colors"
          title="Open artificialcraft.space"
        >
          <span>artificialcraft.space</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Exporting Progress Modal / Indicator */}
      {exportProgress && exportProgress.isRecording && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 pointer-events-auto">
          <div className="w-full max-w-md bg-[#0a0d18] border-2 border-[#00E5FF] p-6 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#00E5FF] font-mono text-xs uppercase font-bold">
              <Radio className="w-4 h-4 animate-spin text-[#00E5FF]" />
              RECORDING 60FPS CANVAS & SYNTH AUDIO
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white font-mono mt-1 mb-3">
              Exporting WebM Video
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-[#13192e] h-3 border border-[#232c4a] mb-2 overflow-hidden">
              <div
                className="bg-[#00E5FF] h-full transition-all duration-150"
                style={{ width: `${exportProgress.progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-mono text-gray-300 mb-4">
              <span>{exportProgress.currentSecond.toFixed(1)}s / {exportProgress.totalSeconds}s</span>
              <span className="text-[#00E5FF] font-bold">{exportProgress.progressPercent}%</span>
            </div>

            <p className="text-[11px] font-mono text-gray-400 mb-5 leading-relaxed">
              Rendering deterministic frames and capturing procedural Web Audio stream. The download will start automatically upon completion.
            </p>

            <button
              onClick={onCancelExport}
              className="px-4 py-2 bg-[#1b223c] hover:bg-[#253055] border border-[#2e3b66] text-xs font-mono text-gray-300 transition-colors"
            >
              Cancel Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
