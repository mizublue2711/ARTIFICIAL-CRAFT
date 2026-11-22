import React from 'react';
import { motion } from 'framer-motion';
import Monolith3DNode from '@/components/playground/Monolith3DNode';
import ThreeHookCanvas from '@/components/ThreeHookCanvas';

export const HERO_STAGE_CONFIG = {
  STUDIO_URL: 'https://dify-n8n-workflow.ai.studio/',
  VIBEPATH_URL: 'https://vibepath.artificialcraft.space/',
  BLUEPRINTS_ANCHOR: '#blueprints',
  BATCH_ACTION_LABEL: '⚡ BATCH PRODUCTION',
  DIVIDER_SYMBOL: '|',
  BULLET_SYMBOL: '•',
  ACCENT_PURPLE: '#5322ff',
  ACCENT_CYAN: '#00E5FF',
} as const;

export interface HeroHeadlineStageProps {
  onOpenBatchModal?: () => void;
  monolithMode?: 'compact' | 'studio';
  className?: string;
}

export const HeroHeadlineStage: React.FC<HeroHeadlineStageProps> = ({
  onOpenBatchModal,
  monolithMode = 'compact',
  className = '',
}) => {
  const handleScrollToCockpit = () => {
    const el =
      document.getElementById('automation-cockpit') ||
      document.querySelector('#platform')?.children[2];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-headline-stage"
      className={`relative w-full min-h-[100dvh] flex flex-col justify-between overflow-x-clip bg-[#05050A] ${className}`.trim()}
    >
      {/* 50/50 Split Screen: Left Typography / Right 3D Canvas */}
      <div className="w-full flex-1 flex flex-col lg:flex-row items-stretch justify-between">
        {/* LEFT COLUMN: 50% Width, Padded from Left Browser Edge */}
        <div className="w-full lg:w-1/2 min-w-0 flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-8 z-10 pt-24 pb-10 lg:py-0">
          {/* Telemetry Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 type-telemetry-tag mb-6 pb-2 border-b border-[#1F1F23] w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            AUTONOMOUS WEB ARCHITECTURE // 2026
          </motion.div>

          {/* Monumental Headline (Mapped to central type-display-hero token) */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="type-display-hero flex flex-col mb-6 select-none"
          >
            <span className="whitespace-nowrap">
              AUTONOMOUS
            </span>
            <span className="whitespace-nowrap">
              CODE
            </span>
            <span className="whitespace-nowrap text-[#00E5FF]">
              ARCHITECT.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="type-body-narrative max-w-xl mb-8"
          >
            Clean graphic design powered by reliable autonomous workflows.
            Engineered for deterministic client-side execution.
          </motion.p>

          {/* Primary Bold CTA Strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-lg"
          >
            <a
              href={HERO_STAGE_CONFIG.VIBEPATH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-8 bg-[#00E5FF] hover:bg-[#00c4dc] text-black font-black text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 group shadow-[0_0_25px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              <span>LAUNCH AUTOMATION STUDIO</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            {onOpenBatchModal ? (
              <button
                type="button"
                onClick={onOpenBatchModal}
                className="py-4 px-6 border border-[#27272A] hover:border-zinc-500 bg-[#0A0A10] text-zinc-300 font-mono text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                &gt;_ PLAYGROUND
              </button>
            ) : (
              <a
                href={HERO_STAGE_CONFIG.STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-6 border border-[#27272A] hover:border-zinc-500 bg-[#0A0A10] text-zinc-300 font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center cursor-pointer"
              >
                &gt;_ PLAYGROUND
              </a>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 50% Width, Extends to the Right Browser Edge */}
        <div className="w-full lg:w-1/2 relative min-h-[420px] lg:min-h-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            {monolithMode === 'compact' ? (
              <Monolith3DNode mode="compact" className="w-full h-full" />
            ) : (
              <ThreeHookCanvas className="w-full h-full" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Viewport Telemetry Dock */}
      <div className="w-full px-6 sm:px-12 lg:px-16 py-4 flex items-center justify-between type-telemetry-tag text-zinc-500 border-t border-[#1F1F23] z-10">
        <span>ENGINE: VITE_SPA // 60FPS</span>
        <div
          role="button"
          tabIndex={0}
          onClick={handleScrollToCockpit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleScrollToCockpit();
            }
          }}
          className="flex items-center gap-2 text-[#00E5FF] animate-bounce cursor-pointer hover:text-white transition-colors"
        >
          <span>EXPLORE AUTOMATION COCKPIT</span>
          <span>↓</span>
        </div>
        <span>COORDINATES: [ 01 / 04 ]</span>
      </div>
    </section>
  );
};

export default HeroHeadlineStage;
