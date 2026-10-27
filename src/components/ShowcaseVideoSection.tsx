import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Tv,
  Layers,
  Camera,
  Radio,
  Zap,
  Maximize2,
  Activity,
  Terminal,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { soundEffects } from '@/lib/soundEffects';

interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: typeof Layers;
  badge: string;
  depth: string;
}

const features: FeatureCard[] = [
  {
    id: 'exploded-layers',
    title: '3D Exploded View & Z-Axis Layer Separation',
    subtitle: 'Preserve-3D Perspective (1200px)',
    desc: 'Deconstructs UI components across 3 distinct spatial layers along the Z-axis: Layer 0 (-200px background Swiss grid), Layer 1 (0px Canvas 2D engines & Bento grid), and Layer 2 (+150px floating titles & status badges).',
    icon: Layers,
    badge: 'Z-DEPTH LAYER',
    depth: 'Z: -200px ➔ +150px',
  },
  {
    id: 'fpv-drone',
    title: '45-Degree FPV Drone Camera Trajectory',
    subtitle: 'Cinematic Dynamic Trajectory',
    desc: '3 precision recording presets sweeping from high-altitude 35° exploded intros to 45° close FPV flybys tracking across the Plug & Play Sandbox and terminal code streams.',
    icon: Camera,
    badge: 'FPV DRONE ENGINE',
    depth: '35° / 45° FLYBY',
  },
  {
    id: 'audio-reactive',
    title: 'Web Audio Synthesizer & Visualizer',
    subtitle: 'Frequency Analyzer Canvas',
    desc: 'Real-time audio frequency synthesis and spectrum visualizer rendering live audio-reactive waveforms, CRT glitches, and mechanical audio cues for UI interactions.',
    icon: Activity,
    badge: 'AUDIO SYNTH',
    depth: 'SYNTH & SPECTRUM',
  },
  {
    id: 'crt-glitch',
    title: 'CRT Scanlines & Chromatic Shader',
    subtitle: 'Vintage Phosphor Collapse',
    desc: 'Subtle 5% scanline raster, vignette border shadows, light RGB chromatic split, and a retro CRT screen power collapse animation.',
    icon: Tv,
    badge: 'CRT SHADER',
    depth: 'RGB CHROMATIC',
  },
];

export default function ShowcaseVideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'preset1' | 'preset2' | 'preset3'>('preset1');
  const [isMuted, setIsMuted] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Audio-Reactive Visualizer Animation
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;

    const render = () => {
      step += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const bars = 48;
      const barWidth = (width / bars) - 2;

      // Draw Audio Spectrum Bars
      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + 2) + 2;

        let h = 0;
        if (isPlaying) {
          if (activeTab === 'preset1') {
            h = (Math.sin(step + i * 0.2) * 0.4 + 0.5) * (height * 0.6) + Math.random() * 8;
          } else if (activeTab === 'preset2') {
            h = (Math.cos(step * 1.5 + i * 0.15) * 0.4 + 0.5) * (height * 0.75) + Math.sin(i) * 12;
          } else {
            h = (Math.sin(step * 2 + i * 0.3) * 0.3 + 0.4) * (height * 0.5) + (i % 2 === 0 ? 15 : 5);
          }
        } else {
          h = 4; // Static low height when paused
        }

        const y = height - h;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        if (i % 3 === 0) {
          grad.addColorStop(0, '#5322ff');
          grad.addColorStop(1, '#00E5FF');
        } else {
          grad.addColorStop(0, '#00E5FF');
          grad.addColorStop(1, '#ffffff');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, h);

        // Top dot cap
        ctx.fillStyle = '#00E5FF';
        ctx.fillRect(x, y - 3, barWidth, 2);
      }

      // Draw Grid / Waveform line overlay
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 5) {
        const y = height / 2 + Math.sin(x * 0.03 + step * 2) * (isPlaying ? 20 : 2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeTab]);

  const handleTogglePlay = () => {
    soundEffects.playClickSound();
    setIsPlaying(!isPlaying);
  };

  const handleSelectPresetTab = (preset: 'preset1' | 'preset2' | 'preset3') => {
    soundEffects.playCameraSound();
    setActiveTab(preset);
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 200);
  };

  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#09090b] border-t border-zinc-800/80 overflow-hidden" id="showcase-video">
      {/* Background CAD grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-[10px] text-[#00E5FF] uppercase tracking-widest mb-3">
              <Sparkles className="h-3 w-3 text-[#00E5FF]" />
              <span>UNIFIED VIDEO & AUDIO-REACTIVE INFRASTRUCTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white font-mono">
              3D CINEMATIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#5322ff]">RECORDING REEL</span>
            </h2>
          </div>

          <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-md border-l-2 border-[#00E5FF] pl-4 font-normal">
            Capture high-impact screen recordings with real-time 3D exploded layer separation, FPV drone flybys, CRT monitor overlays, and Web Audio reactivity.
          </p>
        </div>

        {/* Video Showcase Player Container */}
        <div className="relative border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl font-mono">
          {/* Player Top Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-bold text-zinc-300">
                ARTIFICIAL_CRAFT // REEL_RENDERER_v2.0.mp4
              </span>
            </div>

            {/* Presets switch tabs */}
            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-1">
              <button
                onClick={() => handleSelectPresetTab('preset1')}
                className={`px-3 py-1 text-[11px] font-bold transition-all ${
                  activeTab === 'preset1'
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                01: EXPLODED INTRO
              </button>
              <button
                onClick={() => handleSelectPresetTab('preset2')}
                className={`px-3 py-1 text-[11px] font-bold transition-all ${
                  activeTab === 'preset2'
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                02: FPV DRONE
              </button>
              <button
                onClick={() => handleSelectPresetTab('preset3')}
                className={`px-3 py-1 text-[11px] font-bold transition-all ${
                  activeTab === 'preset3'
                    ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                03: MACRO REVEAL
              </button>
            </div>
          </div>

          {/* Player Screen Canvas & Visualizer */}
          <div className="relative aspect-video sm:aspect-[21/9] bg-black flex items-center justify-center overflow-hidden">
            {/* Dynamic Glitch Flash Effect */}
            {glitchActive && (
              <div className="absolute inset-0 bg-cyan-400/20 z-30 mix-blend-difference pointer-events-none" />
            )}

            {/* CRT Overlay on player screen */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

            {/* Simulated 3D Camera Scene Representation */}
            <div className="relative w-full h-full p-6 sm:p-12 flex flex-col justify-between z-0">
              {/* Top HUD Overlay in Video */}
              <div className="flex justify-between items-start font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950/80 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>FPS: 60.0 // LATENCY: 0.8ms</span>
                </div>
                <div className="border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[#00E5FF]">
                  MODE: {activeTab.toUpperCase()}
                </div>
              </div>

              {/* Center Interactive Simulated Preview Content */}
              <div className="my-auto text-center font-mono">
                <motion.div
                  key={activeTab}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 max-w-xl backdrop-blur-md shadow-2xl text-left"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                    <span className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-wider">
                      {activeTab === 'preset1' && '01 // 3D EXPLODED LAYER ARCHITECTURE'}
                      {activeTab === 'preset2' && '02 // 45° FPV DRONE MOTION FLYBY'}
                      {activeTab === 'preset3' && '03 // MACRO TERMINAL CODE TO UI'}
                    </span>
                    <span className="text-[10px] text-zinc-500">Z-DEPTH ACTIVE</span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed mb-4">
                    {activeTab === 'preset1' &&
                      'Main landing container exploded along Z-axis. Layer 0 (-200px background grid), Layer 1 (0px Bento engine), Layer 2 (+150px floating typography).'}
                    {activeTab === 'preset2' &&
                      'FPV Drone perspective angled at 45 degrees, sweeping smoothly across node connectors and sandbox widgets.'}
                    {activeTab === 'preset3' &&
                      'Macro zoom-in transition focusing on live code lines before resolving into brutalist Swiss UI components.'}
                  </p>

                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-zinc-500">STATUS: ACTIVE_RENDER</span>
                    <span className="text-[#00E5FF] font-bold">1200px PERSPECTIVE</span>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Spectrum Canvas Overlay inside video player */}
              <div className="relative h-16 w-full mt-auto border-t border-zinc-800/80 bg-black/60 backdrop-blur-sm">
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={64}
                  className="w-full h-full block"
                />
              </div>
            </div>

            {/* Play / Pause Big Toggle Center Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-20">
                <button
                  onClick={handleTogglePlay}
                  className="group flex items-center gap-3 border border-[#00E5FF] bg-zinc-950 px-6 py-3 font-mono text-sm font-bold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all shadow-[0_0_24px_rgba(0,229,255,0.4)]"
                >
                  <Play className="h-5 w-5 fill-current" />
                  <span>RESUME PREVIEW REEL</span>
                </button>
              </div>
            )}
          </div>

          {/* Player Bottom Control Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 py-3 text-xs text-zinc-300">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="p-2 border border-zinc-800 bg-zinc-900 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              <button
                onClick={handleToggleMute}
                className={`p-2 border transition-colors ${
                  isMuted
                    ? 'border-red-800 bg-red-950/50 text-red-400'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#00E5FF]" />}
              </button>

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                <Radio className="h-3.5 w-3.5 text-[#00E5FF] animate-pulse" />
                <span>AUDIO SYNTH: LIVE SYNTHESIS</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-zinc-500">HOTKEY HINT:</span>
              <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[#00E5FF] font-bold">
                PRESS SHIFT + V FOR RECORDING_MODE
              </span>
            </div>
          </div>
        </div>

        {/* 4 Brutalist Feature Cards Grid */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 font-mono">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative border border-zinc-800 bg-zinc-950/80 p-6 hover:border-[#00E5FF] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-[#00E5FF] border border-zinc-800 bg-zinc-900 px-2 py-0.5 uppercase tracking-wider">
                      {feat.badge}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-semibold">{feat.depth}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="h-5 w-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
                    <h3 className="text-base font-bold text-white uppercase">{feat.title}</h3>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">{feat.subtitle}</span>
                  <span className="text-[#00E5FF] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    READY ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
