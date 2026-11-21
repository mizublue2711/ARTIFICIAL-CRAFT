import React from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';
import HeroHeadlineStage, { type HeroHeadlineStageProps } from '@/components/home/HeroHeadlineStage';
import AutomationCockpit, { type AutomationCockpitProps } from '@/components/home/AutomationCockpit';

export interface HeroProps extends HeroHeadlineStageProps, AutomationCockpitProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBatchModal,
  monolithMode = 'compact',
  className = '',
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
      <div className="relative w-full">
        <HeroHeadlineStage
          onOpenBatchModal={onOpenBatchModal}
          monolithMode={monolithMode}
        />
      </div>

      {/* Centered Automation Cockpit below the fold */}
      <div id="automation-cockpit" className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <AutomationCockpit
          onSimulationStart={onSimulationStart}
          onSimulationComplete={onSimulationComplete}
        />
      </div>
    </section>
  );
};

export default Hero;
