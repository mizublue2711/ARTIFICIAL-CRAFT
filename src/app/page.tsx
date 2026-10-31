import React from 'react';
import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#09090B]">
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
          <CraftStudioConfigurator />
        </div>
      </section>
    </div>
  );
}
