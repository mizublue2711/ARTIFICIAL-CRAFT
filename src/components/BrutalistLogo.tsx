import React from 'react';
import { motion } from 'framer-motion';

interface BrutalistLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  subtag?: string;
}

export default function BrutalistLogo({
  size = 32,
  className = '',
  showText = true,
  subtag = 'CRAFT//CODE',
}: BrutalistLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* 1:1 Square Ratio SVG Logo ("LOGARITHMIC SHELL - GEOMETRIC LINE ART") */}
      <div
        className="relative shrink-0 rounded-sm bg-[#050507] border border-zinc-700/80 flex items-center justify-center p-1 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* Sub-grid background lines inside logo */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />

        <svg
          viewBox="0 0 40 40"
          className="w-full h-full relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Swiss framing corners */}
          <path d="M 2 6 V 2 H 6" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="square" />
          <path d="M 34 2 H 38 V 6" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="square" />
          <path d="M 2 34 V 38 H 6" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="square" />
          <path d="M 38 34 V 38 H 34" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="square" />

          {/* Background Polar Guideline Vectors - Subtle Brutalist Blueprint crosshairs */}
          <line x1="20" y1="3" x2="20" y2="37" stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="1 3" />
          <line x1="3" y1="20" x2="37" y2="20" stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="1 3" />
          <circle cx="20" cy="20" r="16.2" stroke="#27272a" strokeWidth="0.5" strokeDasharray="1 3" />

          {/* 1. CORE ANCHOR: Dify Core (Center Node with soft #5322ff glow) */}
          <circle cx="20" cy="20" r="4" fill="#5322ff" opacity="0.25" />
          <polygon
            points="20,17.2 22.4,18.6 22.4,21.4 20,22.8 17.6,21.4 17.6,18.6"
            stroke="#5322ff"
            strokeWidth="1"
            fill="#050507"
            strokeLinejoin="miter"
          />
          <circle cx="20" cy="20" r="1.2" fill="#f4f4f5" />

          {/* 2. EXPANSION ANCHORS: n8n Orchestrator - 4 Logarithmic Spiral Arcs r = a * e^(b * theta) */}
          {/* Arc 1: Core Spiral Anchor (#5322ff) */}
          <path
            d="M 21.9 20 L 21.94 20.52 L 21.84 21.06 L 21.58 21.58 L 21.18 22.05 L 20.65 22.42 L 20 22.64 L 19.28 22.7 L 18.53 22.55 L 17.8 22.2 L 17.15 21.65 L 16.64 20.9 L 16.32 20"
            stroke="#5322ff"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Arc 2: Inner Orchestrator Arc (#5322ff) */}
          <path
            d="M 18.23 22.44 L 17.56 22.04 L 16.99 21.45 L 16.55 20.71 L 16.29 19.83 L 16.26 18.88 L 16.47 17.89 L 16.94 16.94 L 17.66 16.08 L 18.62 15.4 L 19.77 14.94 L 21.07 14.78 L 22.44 14.94 L 23.79 15.46 L 25.04 16.34"
            stroke="#5322ff"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Arc 3: Mid Expansion Arc (White Metal #f4f4f5) */}
          <path
            d="M 20 14.89 L 21.15 14.78 L 22.34 14.92 L 23.53 15.33 L 24.66 16.02 L 25.66 16.98 L 26.46 18.18 L 27.01 19.59 L 27.26 21.15 L 27.16 22.8 L 26.69 24.47 L 25.83 26.07 L 24.6 27.51 L 23.02 28.71 L 21.13 29.58 L 19.01 30.04 L 16.74 30.04"
            stroke="#f4f4f5"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Arc 4: Outer Logarithmic Shell Arc (White Metal Dark #a1a1aa) */}
          <path
            d="M 25.09 27.01 L 24 28.03 L 22.72 28.88 L 21.26 29.54 L 19.65 29.95 L 17.94 30.11 L 16.17 29.97 L 14.39 29.53 L 12.64 28.77 L 10.99 27.7 L 9.48 26.32 L 8.18 24.66 L 7.13 22.74 L 6.39 20.59 L 6 18.28 L 5.99 15.85 L 6.41 13.37 L 7.25 10.91 L 8.53 8.53"
            stroke="#a1a1aa"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* 3. GUARD LAYERS: 3 Tầng lọc bảo vệ tài nguyên API (1px boundary cross-cut tick marks) */}
          {/* Layer 1 Guard Tick */}
          <path d="M 24.39 14.88 L 25.69 17.8" stroke="#5322ff" strokeWidth="1" strokeLinecap="square" />
          {/* Layer 2 Guard Tick */}
          <path d="M 18.39 30.99 L 15.09 29.09" stroke="#f4f4f5" strokeWidth="1" strokeLinecap="square" />
          {/* Layer 3 Guard Tick */}
          <path d="M 6.77 9.68 L 10.29 7.38" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="square" />
        </svg>

        {/* 60fps pulse animation representing heartbeat of running machine */}
        <motion.div
          className="absolute z-20 rounded-full pointer-events-none"
          style={{
            left: 'calc(50% - 3px)',
            top: 'calc(50% - 3px)',
            width: '6px',
            height: '6px',
            backgroundColor: '#5322ff',
            boxShadow: '0 0 8px 2px #5322ff, 0 0 14px 4px #00E5FF',
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 font-mono text-[14px] font-bold tracking-wider text-white uppercase">
            <span>ARTIFICIAL CRAFT</span>
          </div>
          {subtag && (
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase mt-0.5">
              {subtag}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
