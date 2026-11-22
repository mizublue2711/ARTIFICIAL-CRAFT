import React from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
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

const HERO_TECH_BADGES = [
  '[ DIFY REASONING ]',
  '[ N8N MUSCLE ]',
  '[ 60 FPS ]',
] as const;

export interface HeroHeadlineStageProps {
  onOpenBatchModal?: () => void;
  monolithMode?: 'compact' | 'studio';
  className?: string;
  externalExploded?: number;
  scrollYProgress?: MotionValue<number>;
  isReady?: boolean;
}

export const HeroHeadlineStage: React.FC<HeroHeadlineStageProps> = ({
  onOpenBatchModal,
  monolithMode = 'compact',
  className = '',
  externalExploded,
  scrollYProgress,
  isReady = true,
}) => {
  const fallbackProgress = useMotionValue(externalExploded ?? 0);
  const progress = scrollYProgress ?? fallbackProgress;

  // Stage 1 (0.00 - 0.15): Top telemetry badge & Display Line 1 locked in
  const badgeOpacity = useTransform(progress, [0, 0.15], [1, 1]);
  const badgeY = useTransform(progress, [0, 0.15], [0, 0]);

  // Stage 2 (0.15 - 0.45): Display Line 2 clip-up & staggered tech badges
  const line2Y = useTransform(progress, [0.15, 0.32], ['110%', '0%']);
  const line2Opacity = useTransform(progress, [0.15, 0.28], [0, 1]);

  const pill0Opacity = useTransform(progress, [0.24, 0.35], [0, 1]);
  const pill0Y = useTransform(progress, [0.24, 0.35], [16, 0]);
  const pill1Opacity = useTransform(progress, [0.30, 0.40], [0, 1]);
  const pill1Y = useTransform(progress, [0.30, 0.40], [16, 0]);
  const pill2Opacity = useTransform(progress, [0.35, 0.45], [0, 1]);
  const pill2Y = useTransform(progress, [0.35, 0.45], [16, 0]);

  const pillMotionStyles = [
    { opacity: pill0Opacity, y: pill0Y },
    { opacity: pill1Opacity, y: pill1Y },
    { opacity: pill2Opacity, y: pill2Y },
  ];

  // Stage 3 (0.45 - 0.75): Body narrative & primary action buttons
  const bodyOpacity = useTransform(progress, [0.45, 0.60], [0, 1]);
  const bodyY = useTransform(progress, [0.45, 0.60], [28, 0]);

  const ctaOpacity = useTransform(progress, [0.55, 0.75], [0, 1]);
  const ctaY = useTransform(progress, [0.55, 0.75], [24, 0]);

  // Stage 4 (0.75 - 1.00): Smooth opacity ease-down to 0.4 at peak Monolith explosion
  const stageExitOpacity = useTransform(progress, [0.75, 1.0], [1, 0.4]);

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
      className={`relative w-full h-full flex flex-col justify-between overflow-x-clip bg-[#05050A] ${className}`.trim()}
    >
      {/* 50/50 Split Screen: Left Typography / Right 3D Canvas */}
      <div className="w-full flex-1 flex flex-col lg:flex-row items-stretch justify-between">
        {/* LEFT COLUMN: 50% Width, Padded from Left Browser Edge */}
        <motion.div
          style={{ opacity: stageExitOpacity }}
          className="w-full lg:w-1/2 min-w-0 flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-8 z-10 pt-24 pb-10 lg:py-0"
        >
          {/* Stage 1: Top Telemetry Badge */}
          <motion.div
            style={{ opacity: badgeOpacity, y: badgeY }}
            className="inline-flex items-center gap-2 type-telemetry-tag mb-6 pb-2 border-b border-[#1F1F23] w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            [ 01 // AUTONOMOUS_INFRA ]
          </motion.div>

          {/* Monumental Headline (Stage 1 Line 1 + Stage 2 Line 2) */}
          <h1 className="type-display-hero !text-4xl sm:!text-5xl lg:!text-[3.5rem] xl:!text-[4.25rem] !leading-[0.95] flex flex-col gap-2 mb-5 select-none">
            <span className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={isReady ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                AUTONOMOUS CODE
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span
                style={{ y: line2Y, opacity: line2Opacity }}
                className="block text-[#00E5FF]"
              >
                DETERMINISTIC PIPELINES
              </motion.span>
            </span>
          </h1>

          {/* Stage 2: Cascading Status Pills & Tech Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            {HERO_TECH_BADGES.map((label, idx) => (
              <motion.span
                key={label}
                style={pillMotionStyles[idx]}
                className="px-2.5 py-1 border border-[#27272A] bg-[#0A0A10]/90 font-mono text-[11px] tracking-widest uppercase text-zinc-200"
              >
                {label}
              </motion.span>
            ))}
          </div>

          {/* Stage 3: Body Narrative */}
          <motion.p
            style={{ opacity: bodyOpacity, y: bodyY }}
            className="type-body-narrative text-zinc-200 max-w-xl mb-8"
          >
            Clean graphic design powered by reliable autonomous workflows.
            Engineered for deterministic client-side execution.
          </motion.p>

          {/* Stage 3: Primary Bold CTA Strip */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
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
        </motion.div>

        {/* RIGHT COLUMN: 50% Width, Extends to the Right Browser Edge */}
        <div className="w-full lg:w-1/2 relative min-h-[420px] lg:min-h-full flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            {monolithMode === 'compact' ? (
              <Monolith3DNode
                mode="compact"
                externalExploded={externalExploded}
                className="w-full h-full"
              />
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
