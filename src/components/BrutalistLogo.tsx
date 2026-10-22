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
      {/* 1:1 Square Ratio SVG Logo ("THE BRUTALIST NODE") */}
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
          xmlns="https://pub-b61e4ba5294d47b594f0d427db0aa7b5.r2.dev/AC%20STUDIO/AC%20logo%20white.svg"
        >
          {/* Outer framing corners */}
          <path d="M 2 6 V 2 H 6" stroke="#a1a1aa" strokeWidth="1" />
          <path d="M 34 2 H 38 V 6" stroke="#a1a1aa" strokeWidth="1" />
          <path d="M 2 34 V 38 H 6" stroke="#a1a1aa" strokeWidth="1" />
          <path d="M 38 34 V 38 H 34" stroke="#a1a1aa" strokeWidth="1" />

          {/* Precision Letter 'A' - Swiss Minimal 1px lines */}
          <path
            d="M 14 10 L 7 30"
            stroke="#f4f4f5"
            strokeWidth="1"
            strokeLinecap="square"
          />
          <path
            d="M 14 10 L 21 30"
            stroke="#f4f4f5"
            strokeWidth="1"
            strokeLinecap="square"
          />
          <path
            d="M 10 21 H 18.5"
            stroke="#f4f4f5"
            strokeWidth="1"
            strokeLinecap="square"
          />

          {/* Precision Letter 'C' - Sharp 1px lines */}
          <path
            d="M 32 12 H 24 V 28 H 32"
            stroke="#f4f4f5"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Intersection Connection line between A and C */}
          <path
            d="M 18.5 21 H 24"
            stroke="#5322ff"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Glowing Node Anchor at the intersection of A and C (#5322ff / Electric Cyan) */}
          <circle cx="21" cy="21" r="2" fill="#00E5FF" opacity="0.4" />
          <circle cx="21" cy="21" r="1" fill="#5322ff" />
        </svg>

        {/* 60fps pulse animation representing heartbeat of running machine */}
        <motion.div
          className="absolute z-20 rounded-full"
          style={{
            left: 'calc(52.5% - 3px)',
            top: 'calc(52.5% - 3px)',
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
