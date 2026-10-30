import React from 'react';
import { motion, TargetAndTransition, VariantLabels } from 'framer-motion';
import { SECTION_REGISTRY, BACKGROUND_PRESETS, DEFAULT_MOTION_PRESETS } from '@/core/registry';
import { SectionConfig, PageTemplateSchema } from '@/types/preset';

export interface DynamicSectionRendererProps {
  sections?: SectionConfig[];
  config?: PageTemplateSchema;
  onOpenBatchModal?: () => void;
  className?: string;
}

export interface DynamicSectionItemProps {
  section: SectionConfig;
  onOpenBatchModal?: () => void;
  className?: string;
}

/**
 * Individual Section Component Renderer based on SectionType Mapping
 */
export const DynamicSectionItem: React.FC<DynamicSectionItemProps> = ({
  section,
  onOpenBatchModal,
  className = '',
}) => {
  const Component = SECTION_REGISTRY[section.type];

  if (!Component) {
    return (
      <div
        id={section.id}
        className={`p-6 border border-amber-500/50 bg-amber-950/20 text-amber-300 font-mono text-xs ${className}`}
      >
        <div className="font-bold uppercase tracking-wider mb-1">
          ⚠️ UNKNOWN_SECTION_TYPE: [{section.type}]
        </div>
        <p className="text-zinc-400">
          No matching component found in SECTION_REGISTRY for section ID "{section.id}".
        </p>
      </div>
    );
  }

  // Determine Background Overlay styles if specified
  const bgPreset = section.background?.id
    ? BACKGROUND_PRESETS[section.background.id] || section.background
    : section.background;

  const bgStyle: React.CSSProperties = {};
  if (bgPreset?.overlayType === 'grid') {
    bgStyle.backgroundImage = `linear-gradient(to right, ${bgPreset.color || '#3f3f46'} 1px, transparent 1px), linear-gradient(to bottom, ${bgPreset.color || '#3f3f46'} 1px, transparent 1px)`;
    bgStyle.backgroundSize = `${bgPreset.lineSpacing || 40}px ${bgPreset.lineSpacing || 40}px`;
  } else if (bgPreset?.overlayType === 'dots') {
    bgStyle.backgroundImage = `radial-gradient(${bgPreset.color || '#5322ff'} 1px, transparent 1px)`;
    bgStyle.backgroundSize = `${bgPreset.lineSpacing || 24}px ${bgPreset.lineSpacing || 24}px`;
  }

  // Determine Framer Motion animation properties
  const motionPreset = section.motion || DEFAULT_MOTION_PRESETS.FADE_UP;

  // Merge Component Props
  const mergedProps = {
    ...section.props,
    ...(section.visualBlock ? { ...section.visualBlock } : {}),
    ...(section.type === 'HERO_3D' ? { onOpenBatchModal } : {}),
  };

  return (
    <motion.section
      id={section.id}
      initial={motionPreset.initial as TargetAndTransition | VariantLabels}
      whileInView={motionPreset.animate as TargetAndTransition | VariantLabels}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: motionPreset.duration || 0.6,
        delay: motionPreset.delay || 0,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Optional Background Overlay Layer */}
      {bgPreset && bgPreset.overlayType !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...bgStyle,
            opacity: bgPreset.opacity ?? 0.15,
          }}
        />
      )}

      {/* Render Registered Component */}
      <Component {...mergedProps} />
    </motion.section>
  );
};

/**
 * Generic Dynamic Section Engine Renderer Component
 * Reads JSON configuration objects/arrays and dynamically renders registered section components.
 */
export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  sections,
  config,
  onOpenBatchModal,
  className = '',
}) => {
  const activeSections = sections || config?.sections || [];

  if (activeSections.length === 0) {
    return (
      <div className={`p-8 border border-zinc-800 bg-[#09090b] text-zinc-500 font-mono text-center text-xs ${className}`}>
        [DYNAMIC_SECTION_ENGINE] No section configurations provided.
      </div>
    );
  }

  return (
    <div className={`dynamic-section-engine font-mono ${className}`}>
      {activeSections.map((section) => (
        <DynamicSectionItem
          key={section.id}
          section={section}
          onOpenBatchModal={onOpenBatchModal}
        />
      ))}
    </div>
  );
};

export default DynamicSectionRenderer;
