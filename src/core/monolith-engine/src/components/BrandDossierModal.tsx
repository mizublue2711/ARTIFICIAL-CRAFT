import React from 'react';
import { X, ExternalLink, Cpu, ShieldCheck, Layers, Terminal, Sparkles } from 'lucide-react';

interface BrandDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandDossierModal: React.FC<BrandDossierModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none">
      <div className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-[#080a12] border border-[#23293e] shadow-2xl p-6 md:p-8 text-left">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1b2033]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#00E5FF]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
              SYSTEM ARCHITECTURE // SPEC-SHEET 01
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white bg-[#101424] hover:bg-[#1b223c] transition-colors border border-[#222b46]"
            title="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title Section */}
        <div className="mt-6 mb-8">
          <div className="inline-block px-2.5 py-1 mb-3 text-[11px] font-mono uppercase tracking-wider bg-[#5322FF]/20 text-[#00E5FF] border border-[#5322FF]/40">
            Brand Dossier & Production Architecture
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
            ArtificialCraft <span className="text-[#00E5FF]">//</span> Monolith
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-300 font-mono leading-relaxed max-w-2xl">
            "Most AI marketing is fluff. Generic prompts, slow chains, zero impact. People scroll right past it.
            We open with a monolithic block cutting through the darkness. Contrast grabs attention. Craft meets Code."
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://artificialcraft.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E5FF] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#33ebff] transition-all"
            >
              Visit ArtificialCraft.space <ExternalLink className="w-4 h-4" />
            </a>
            <span className="inline-flex items-center px-3 py-2 bg-[#121628] border border-[#263152] text-xs font-mono text-gray-300">
              Deterministic 60FPS Video Engine
            </span>
          </div>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 bg-[#0c101c] border border-[#1d243b]">
            <div className="flex items-center gap-2 text-[#00E5FF] mb-2 font-mono text-xs uppercase font-bold">
              <Cpu className="w-4 h-4" /> Separation of Powers
            </div>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              You don't use LLM tokens to parse a JSON array. <strong className="text-white">Dify thinks; n8n executes.</strong> Brain meets muscle. High-order reasoning is strictly isolated from deterministic worker webhooks for zero token waste.
            </p>
          </div>

          <div className="p-4 bg-[#0c101c] border border-[#1d243b]">
            <div className="flex items-center gap-2 text-[#5322FF] mb-2 font-mono text-xs uppercase font-bold">
              <ShieldCheck className="w-4 h-4" /> 4-Model Audit Gate
            </div>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              One LLM guessing is a hazard. <strong className="text-white">Four specialized models auditing each other</strong> is a system. We kill errors at the gate (Syntax, Semantics, Drift, GPU Budget) before spending a dime on rendering.
            </p>
          </div>

          <div className="p-4 bg-[#0c101c] border border-[#1d243b]">
            <div className="flex items-center gap-2 text-[#ffd700] mb-2 font-mono text-xs uppercase font-bold">
              <Layers className="w-4 h-4" /> Studio PBR & Zero-404 Integrity
            </div>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              Implements <strong className="text-white">ACESFilmicToneMapping</strong> and <strong className="text-white">RoomEnvironment</strong> via PMREMGenerator. All textures, normal maps, and typographic ribbons are procedurally generated via HTML5 Canvas Textures (zero network 404s).
            </p>
          </div>

          <div className="p-4 bg-[#0c101c] border border-[#1d243b]">
            <div className="flex items-center gap-2 text-[#00E5FF] mb-2 font-mono text-xs uppercase font-bold">
              <Terminal className="w-4 h-4" /> Caliper Lock & Zero GC
            </div>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              Web apps fail with an error code. AI workflows fail silently by drifting. Our calipers lock down every pixel with mathematical damping and pre-allocated vectors for <strong className="text-white">zero garbage collection</strong>.
            </p>
          </div>
        </div>

        {/* 5 Acts Breakdown Table */}
        <div className="mt-8">
          <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" /> 30-Second Production Sequence Blueprint
          </div>
          <div className="overflow-x-auto border border-[#1d243b]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#101426] text-gray-300 border-b border-[#1d243b]">
                <tr>
                  <th className="p-3 text-[#00E5FF]">Act</th>
                  <th className="p-3">Timecode</th>
                  <th className="p-3">Motion Key</th>
                  <th className="p-3">Core Premise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171c2f] text-gray-400 bg-[#090c16]">
                <tr>
                  <td className="p-3 text-white font-bold">Act 1: The Problem</td>
                  <td className="p-3 text-[#00E5FF]">00:00 – 00:06</td>
                  <td className="p-3 text-xs">Simplex Noise Field, CAD Grid, Volumetric Rim Light</td>
                  <td className="p-3 text-gray-300">Monolith cuts through the darkness. Contrast grabs attention.</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-bold">Act 2: The Logic</td>
                  <td className="p-3 text-[#00E5FF]">00:06 – 00:12</td>
                  <td className="p-3 text-xs">Glassmorphic CAD Layers, Spring Physics, Laser Scan</td>
                  <td className="p-3 text-gray-300">Separation of powers. Dify thinks; n8n executes.</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-bold">Act 3: The Precision</td>
                  <td className="p-3 text-[#00E5FF]">00:12 – 00:18</td>
                  <td className="p-3 text-xs">Glyph Matrix, Wavefront Morphing, Scramble Decode</td>
                  <td className="p-3 text-gray-300">Caliper lock down every pixel. Deterministic output.</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-bold">Act 4: The Audit</td>
                  <td className="p-3 text-[#00E5FF]">00:18 – 00:24</td>
                  <td className="p-3 text-xs">Hexagonal Tunnel, 5000 Particles, 120 BPM Pulse</td>
                  <td className="p-3 text-gray-300">Four specialized models auditing each other.</td>
                </tr>
                <tr>
                  <td className="p-3 text-white font-bold">Act 5: The CTA</td>
                  <td className="p-3 text-[#00E5FF]">00:24 – 00:30</td>
                  <td className="p-3 text-xs">Plexus Network, Proximity Linking, Gravity Pulse</td>
                  <td className="p-3 text-gray-300">Craft meets Code. Direct link to artificialcraft.space.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-[#1b2033] flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs text-gray-400">
            ENGINE STATUS: <span className="text-[#00E5FF]">ACTIVE 60FPS</span> // THREE.JS R170 // WEB AUDIO API
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#121626] hover:bg-[#1a2138] border border-[#232b45] text-xs font-mono text-gray-300 transition-colors"
            >
              Close Dossier
            </button>
            <a
              href="https://artificialcraft.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5322FF] hover:bg-[#6837ff] text-xs font-mono font-bold text-white transition-colors"
            >
              Open artificialcraft.space <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
