import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import ParticleCanvas from '@/components/ParticleCanvas';
import HeroHeadlineStage, { type HeroHeadlineStageProps } from '@/components/home/HeroHeadlineStage';
import AutomationCockpit, { type AutomationCockpitProps } from '@/components/home/AutomationCockpit';
import { ScrollDirectorSection } from '@/components/motion/ScrollDirectorSection';

export interface HeroProps extends HeroHeadlineStageProps, AutomationCockpitProps {
  className?: string;
}

const HeroStageScrollConductor: React.FC<
  Pick<HeroProps, 'onOpenBatchModal' | 'monolithMode' | 'isReady'>
> = ({ onOpenBatchModal, monolithMode, isReady }) => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setHeroScrollProgress(latest);
  });

  return (
    /* The Extended Scroll Runway (Provides 250vh of scrub travel) */
    <div ref={runwayRef} className="relative w-full h-[250vh]">
      {/* The Sticky Viewport Stage (Locks in place while user scrolls through the runway) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        <HeroHeadlineStage
          onOpenBatchModal={onOpenBatchModal}
          monolithMode={monolithMode}
          externalExploded={heroScrollProgress}
          scrollYProgress={scrollYProgress}
          isReady={isReady}
        />
      </div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({
  onOpenBatchModal,
  monolithMode = 'compact',
  className = '',
  isReady = true,
  onSimulationStart,
  onSimulationComplete,
}) => {
  return (
    <section
      className={`relative w-full pb-20 lg:pb-28 overflow-x-clip bg-[#05050A] ${className}`}
      id="platform"
    >
      {/* Background Particle Canvas */}
      <ParticleCanvas className="absolute inset-0 opacity-25 pointer-events-none" />

      {/* Grid background overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Full-bleed edge-to-edge Hero Headline Stage */}
      <HeroStageScrollConductor
        onOpenBatchModal={onOpenBatchModal}
        monolithMode={monolithMode}
        isReady={isReady}
      />

      {/* Centered Automation Cockpit below the fold */}
      <ScrollDirectorSection id="automation-cockpit" className="mx-auto max-w-7xl px-6 lg:px-8">
        <AutomationCockpit
          onSimulationStart={onSimulationStart}
          onSimulationComplete={onSimulationComplete}
        />
      </ScrollDirectorSection>
    </section>
  );
};

export default Hero;
