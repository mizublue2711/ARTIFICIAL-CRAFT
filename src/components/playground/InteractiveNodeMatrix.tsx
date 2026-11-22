import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Film, Image, BarChart3, Cpu, Layers, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';
import { UniversalComponentProps } from '@/types/preset';
import { itemFadeUpVariants } from '@/components/motion/ScrollDirectorSection';
import {
  ExpandingAccordionGrid,
  type AccordionEngineItem,
} from '@/components/motion/ExpandingAccordionGrid';

export interface NodeCardProps {
  id?: string;
  nodeId: string;
  number?: string;
  title: string;
  subtitle: string;
  description?: string;
  techStack: string | string[];
  icon?: React.ElementType;
  badge?: string;
  to?: string;
  linkUrl?: string;
  accentColor?: string;
  primaryColor?: string;
  ctaLabel?: string;
  enterLabel?: string;
}

interface HubCardProps {
  nodeId: string;
  badge: string;
  title: string;
  description: string;
  techStack: string[];
  ctaLabel: string;
  onClickUrl?: string;
  onAction?: () => void;
  accentColor?: string;
}

export const UnifiedHubCard: React.FC<HubCardProps> = ({
  nodeId,
  badge,
  title,
  description,
  techStack,
  ctaLabel,
  onClickUrl,
  onAction,
}) => (
  <div className="p-4 border border-[#5322FF]/40 bg-[#09090B] hover:border-[#00E5FF] transition-all flex flex-col justify-between gap-4 group h-full">
    <div className="space-y-2.5">
      {/* Top Badge Line */}
      <div className="flex items-center justify-between">
        <span className="type-telemetry-tag text-[#5322FF] font-bold">{nodeId}</span>
        <span className="px-2 py-0.5 bg-[#00E5FF]/10 type-telemetry-tag border border-[#00E5FF]/30 font-bold">
          {badge}
        </span>
      </div>

      {/* Title & Description */}
      <motion.h3 variants={itemFadeUpVariants} className="type-card-title group-hover:text-[#00E5FF] transition">
        {title}
      </motion.h3>
      <motion.p variants={itemFadeUpVariants} className="type-body-narrative line-clamp-3">
        {description}
      </motion.p>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 type-node-meta text-zinc-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* CTA Button Action - Enforcing 44px min touch target on mobile */}
    {onClickUrl ? (
      <a
        href={onClickUrl}
        target={onClickUrl.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="w-full min-h-[44px] py-2.5 px-4 bg-[#5322FF] hover:bg-[#5322FF]/80 type-telemetry-tag text-white font-bold transition flex items-center justify-center gap-2 text-center touch-manipulation"
      >
        <span>{ctaLabel.endsWith('➔') ? ctaLabel : `${ctaLabel} ➔`}</span>
      </a>
    ) : (
      <button
        type="button"
        onClick={onAction}
        className="w-full min-h-[44px] py-2.5 px-4 bg-[#5322FF] hover:bg-[#5322FF]/80 type-telemetry-tag text-white font-bold transition flex items-center justify-center gap-2 text-center touch-manipulation"
      >
        <span>{ctaLabel.endsWith('➔') ? ctaLabel : `${ctaLabel} ➔`}</span>
      </button>
    )}
  </div>
);

export const InteractiveNodeMatrix: React.FC<UniversalComponentProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();

  const engines: AccordionEngineItem[] = useMemo(() => [
    {
      id: '01',
      index: '01',
      spineLabel: '01 // 3D MONOLITH',
      title: t('node01Title'),
      slaBadge: '[ 60 FPS DETERMINISTIC ]',
      statusBadge: 'LIVE ENGINE',
      description: t('node01Desc'),
      techStack: ['Three.js', 'WebGL', 'Web Audio API'],
      icon: Box,
      ctaLabel: t('btnEnterNode01'),
      href: '/playground?tab=node-01',
      isExternal: false,
      accentColor: '#00E5FF',
      artVariant: 'monolith',
    },
    {
      id: '02',
      index: '02',
      spineLabel: '02 // REMOTION 2K',
      title: t('node02Title'),
      slaBadge: '[ 60 FPS DETERMINISTIC ]',
      statusBadge: '2K 60FPS',
      description: t('node02Desc'),
      techStack: ['Remotion 4.0', 'React', 'Kinetic Typography', 'WebGL'],
      icon: Film,
      ctaLabel: t('btnLaunchNode02'),
      href: '/playground?tab=node-02',
      isExternal: false,
      accentColor: '#5322FF',
      artVariant: 'remotion',
    },
    {
      id: '03',
      index: '03',
      spineLabel: '03 // BANNER STUDIO',
      title: t('node03Title'),
      slaBadge: '[ 60 FPS DETERMINISTIC ]',
      statusBadge: 'BATCH ASSETS',
      description: t('node03Desc'),
      techStack: ['HTML5 Canvas', 'SVG Engine', 'n8n Webhook', 'Brutalist Tokens'],
      icon: Image,
      ctaLabel: t('btnOpenNode03'),
      href: '/playground?tab=node-03',
      isExternal: false,
      accentColor: '#00E5FF',
      artVariant: 'banner',
    },
    {
      id: '04',
      index: '04',
      spineLabel: '04 // MEKONG CAD',
      title: t('node04Title'),
      slaBadge: '[ 60 FPS DETERMINISTIC ]',
      statusBadge: 'LIVE DATA',
      description: t('node04Desc'),
      techStack: ['PapaParse', 'CKAN API', 'Line Art', 'Waveform Visualizer'],
      icon: BarChart3,
      ctaLabel: t('btnOpenNode04'),
      href: '/playground?tab=node-04',
      isExternal: false,
      accentColor: '#00E5FF',
      artVariant: 'cad',
    },
    {
      id: '05',
      index: '05',
      spineLabel: '05 // SANDBOX SDK',
      title: t('node05Title'),
      slaBadge: '[ 60 FPS DETERMINISTIC ]',
      statusBadge: 'INTERACTIVE SANDBOX',
      description: t('node05Desc'),
      techStack: ['React / Vite', 'Three.js / WebGL', 'Zod AST Gate', 'Cybernetic UI'],
      icon: Cpu,
      ctaLabel: t('btnOpenNode05'),
      href: '/playground?node=plug-and-play-sandbox',
      isExternal: false,
      accentColor: '#5322FF',
      artVariant: 'sandbox',
      onLaunch: () => {
        console.log('Launching Plug and Play Sandbox...');
      },
    },
    {
      id: '06',
      index: '06',
      spineLabel: '06 // METROPOLIS 3D',
      title: t('node06Title'),
      slaBadge: '[ 60 FPS DETERMINISTIC ]',
      statusBadge: '[ STATUS: OPERATIONAL ]',
      description: t('node06Desc'),
      techStack: ['Three.js / WebGL', 'Google Sheets Live API', 'Zod Sanitizer', 'Cybernetic Brutalism'],
      icon: Layers,
      ctaLabel: t('btnLaunchNode06'),
      href: 'https://metropolis.artificialcraft.space/',
      isExternal: true,
      accentColor: '#00E5FF',
      artVariant: 'metropolis',
    },
  ], [t]);

  return (
    <section id="interactive-node-matrix" className={`relative py-24 bg-[#09090d] border-t border-zinc-800 font-mono ${className}`}>
      {/* Background CAD Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/40 type-telemetry-tag font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              {t('matrixTag')}
            </div>
            <motion.h2 variants={itemFadeUpVariants} className="type-section-title">
              {t('matrixHeading')}
            </motion.h2>
            <motion.p variants={itemFadeUpVariants} className="mt-3 type-body-narrative max-w-xl">
              {t('matrixSubheading')}
            </motion.p>
          </div>

          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 type-telemetry-tag text-black font-bold transition shadow-[0_0_20px_rgba(0,229,255,0.4)] shrink-0"
          >
            <span>{t('btnLaunchFullMatrix')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6-Engine Expanding Accordion Strip Carousel */}
        <ExpandingAccordionGrid items={engines} defaultActiveId="01" />
      </div>
    </section>
  );
};

export default InteractiveNodeMatrix;
