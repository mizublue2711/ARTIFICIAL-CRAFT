import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  Zap,
  Boxes,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

export const AboutClient: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 font-mono">
      {/* ======================================================== */}
      {/* SECTION 01 // WHY WE EXIST (Hero & Bloat Purge) */}
      {/* ======================================================== */}
      <section className="relative border border-zinc-800 bg-[#09090B] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
        {/* Tactical Swiss Grid & Accent Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#5322FF_1px,transparent_1px),linear-gradient(to_bottom,#5322FF_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5322FF]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Bar / Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-[#00E5FF] uppercase">
                01 // WHY WE EXIST
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5322FF]/20 border border-[#5322FF] text-[#00E5FF] text-[10px] font-extrabold uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>PURGE BLOAT</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight uppercase leading-tight">
              WHY WE EXIST // <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#5322FF]">NO DECORATIVE WALLPAPER</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-zinc-300 font-sans max-w-4xl leading-relaxed border-l-2 border-[#5322FF] pl-4 sm:pl-6 py-1">
              "Most AI projects fail for a boring reason: bloat. Too many middleman frameworks, too many hallucinating prompts, and too much decorative noise."
            </p>
          </div>

          {/* Tactical Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80 text-[10px]">
            <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-zinc-500 block">SLA STANDARD</span>
              <span className="font-bold text-white">60FPS KINEMATICS</span>
            </div>
            <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-zinc-500 block">RENDER FEE</span>
              <span className="font-bold text-[#00E5FF]">$0.00 CLOUD RENDER</span>
            </div>
            <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-zinc-500 block">CODE DRIFT</span>
              <span className="font-bold text-white">0% DRIFT VIA ZOD</span>
            </div>
            <div className="p-3 border border-zinc-800/80 bg-zinc-950/60">
              <span className="text-zinc-500 block">MIDDLEWARE</span>
              <span className="font-bold text-purple-400">ZERO BLOAT RUNTIME</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 02 // WHAT WE ACTUALLY DO (Tri-Core Bento Grid) */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#5322FF]" />
            <h2 className="text-sm font-bold tracking-widest text-zinc-200 uppercase">
              02 // WHAT WE ACTUALLY DO
            </h2>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            TRI-CORE ARCHITECTURE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: The Brain */}
          <div className="relative group border border-zinc-800 hover:border-[#5322FF] bg-[#09090B] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#5322FF]/10 blur-xl group-hover:bg-[#5322FF]/20 transition-all pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5322FF] px-2 py-0.5 border border-[#5322FF]/40 bg-[#5322FF]/10">
                  CORE 01
                </span>
                <Cpu className="w-5 h-5 text-[#5322FF]" />
              </div>
              <h3 className="text-2xl font-black text-white font-['Space_Grotesk'] uppercase tracking-tight">
                The Brain
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Decoupled reasoning engines powered by multi-agent architectures.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
              <span>AGENTS & REASONING</span>
              <span className="text-[#00E5FF]">ACTIVE</span>
            </div>
          </div>

          {/* Card 2: The Muscle */}
          <div className="relative group border border-zinc-800 hover:border-[#00E5FF] bg-[#09090B] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/10 blur-xl group-hover:bg-[#00E5FF]/20 transition-all pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00E5FF] px-2 py-0.5 border border-[#00E5FF]/40 bg-[#00E5FF]/10">
                  CORE 02
                </span>
                <Zap className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <h3 className="text-2xl font-black text-white font-['Space_Grotesk'] uppercase tracking-tight">
                The Muscle
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Rock-solid, deterministic execution workflows that never miss an API call.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
              <span>ZERO DRIFT // RETRY POLICIES</span>
              <span className="text-emerald-400">100% DETERMINISTIC</span>
            </div>
          </div>

          {/* Card 3: The Canvas */}
          <div className="relative group border border-zinc-800 hover:border-purple-500 bg-[#09090B] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 px-2 py-0.5 border border-purple-500/40 bg-purple-500/10">
                  CORE 03
                </span>
                <Boxes className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-2xl font-black text-white font-['Space_Grotesk'] uppercase tracking-tight">
                The Canvas
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Interactive 3D web sandboxes rendering at 60 FPS ($0.00 cloud render fee).
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
              <span>THREE.JS // WEBGL 60FPS</span>
              <span className="text-[#00E5FF]">$0 RENDER COST</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 03 // MEET THE FOUNDER (THE DIGITAL PLUMBER & THE HEADLESS ARMY) */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#00E5FF]" />
            <h2 className="text-sm font-bold tracking-widest text-zinc-200 uppercase">
              03 // MEET THE FOUNDER (THE DIGITAL PLUMBER & THE HEADLESS ARMY)
            </h2>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            HUMAN ARCHITECT + HEADLESS SWARM
          </span>
        </div>

        <div className="border border-zinc-800 bg-zinc-950/80 p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Dossier Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>DOSSIER // CONFIDENTIAL SYSTEM RECORD</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Space_Grotesk'] uppercase tracking-tight">
                MEET THE FOUNDER (A.K.A. THE DIGITAL PLUMBER)
              </h3>

              <div className="border-l-2 border-[#5322FF] pl-4 sm:pl-6 py-2 bg-[#5322FF]/5">
                <p className="text-zinc-200 font-sans text-base sm:text-lg leading-relaxed">
                  "Behind this shiny 60fps layout isn't a team of 50 suit-wearing executives. It’s just a small girl acting as a lead plumber."
                </p>
              </div>

              <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
                She doesn't sell slides or hype vaporware. She routes high-pressure data pipes, solders deterministic API joints, tightens rate-limit pressure valves, and commands an autonomous headless swarm that builds, renders, and tests around the clock.
              </p>
            </div>

            {/* Right Column: Headless Swarm Orbit & Valves */}
            <div className="lg:col-span-5 border border-zinc-800 bg-[#09090B] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5322FF]" />
                  <span>HEADLESS SWARM SQUADRON</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">100% RUNTIME</span>
              </div>

              <p className="text-xs text-zinc-400 font-sans">
                Orbiting around Zod Schema validation valves to guarantee zero-drift execution across every node:
              </p>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { name: 'Dify', role: 'Multi-Agent Reasoning Core', color: '#5322FF' },
                  { name: 'n8n', role: 'Deterministic Execution Engine', color: '#FF6D5A' },
                  { name: 'Claude', role: 'Cognitive & Architectural Logic', color: '#D97706' },
                  { name: 'Gemini', role: 'Multimodal Vision & Analytics', color: '#00E5FF' },
                  { name: 'Remotion', role: 'Programmatic Video Synthesis', color: '#00FF66' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="p-2.5 border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-sans mt-1">
                      {item.role}
                    </span>
                  </div>
                ))}

                {/* The Central Valve */}
                <div className="p-2.5 border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00E5FF]">Zod Schema</span>
                    <CheckCircle2 className="w-3 h-3 text-[#00E5FF]" />
                  </div>
                  <span className="text-[9px] text-[#00E5FF]/80 font-sans mt-1">
                    Pressure Valve: Zero Silent Drift
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 04 // JOIN THE CRAFT (CTA Terminal) */}
      {/* ======================================================== */}
      <section className="relative border border-zinc-800 bg-zinc-950 p-8 sm:p-12 lg:p-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5322FF]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5322FF]/20 border border-[#5322FF] text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>04 // TERMINAL HANDSHAKE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] uppercase tracking-tight">
            JOIN THE CRAFT
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
            "We build in public, break things in private, and ship code that respects your browser's RAM."
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/studio"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#5322FF] hover:bg-[#5322FF]/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(83,34,255,0.4)] group"
            >
              <span>ENTER PLAYGROUND ↗</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://github.com/mizublue2711/DIFY-N8N-AUTOMATION-DESIGN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition"
            >
              <span>VIEW REPO ON GITHUB ↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutClient;
