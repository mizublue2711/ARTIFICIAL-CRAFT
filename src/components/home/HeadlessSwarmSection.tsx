import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { itemFadeUpVariants } from '@/components/motion/ScrollDirectorSection';
import {
  ExternalLink,
  Activity,
  CheckCircle2,
  Zap,
  Radio,
} from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';
import { useInViewport } from '@/hooks/useInViewport';
import { AgentWorkbenchTopology } from './AgentWorkbenchTopology';

const WORKSTATION_URL = 'https://digital-plumbing-terminal-headless-swarm.mizu2711.workers.dev/';

/**
 * HeadlessSwarmSection: Zone 03 Headless Swarm Workbench & $0.00 Cloud Render Fee Section.
 * Implements an open, interactive 5-node cybernetic topology canvas connected by live Bézier data cables.
 */
export const HeadlessSwarmSection: React.FC = () => {
  const { t } = useTranslation();
  const [fpsCounter, setFpsCounter] = useState(60);
  const { ref: viewportRef, isInView } = useInViewport();

  return (
    <section
      id="zone-03-headless-swarm"
      ref={viewportRef}
      className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#09090B] font-mono border-t border-zinc-800"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Open Cybernetic Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold tracking-widest uppercase rounded">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{t('pylonZoneTag')}</span>
              </div>
              <span className="px-2.5 py-0.5 border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-[10px] uppercase tracking-wider rounded">
                {fpsCounter} FPS (Client-Side)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-zinc-800 bg-zinc-900/80 text-zinc-300 text-[10px] uppercase tracking-wider rounded">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>{t('pylonConduitsTitle')}</span>
              </span>
            </div>

            <motion.h2
              variants={itemFadeUpVariants}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase font-mono leading-snug"
            >
              {t('pylonMainHeading')}
            </motion.h2>
            <motion.p
              variants={itemFadeUpVariants}
              className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed border-l-2 border-cyan-400 pl-4 py-1"
            >
              {t('pylonSubheading')}
            </motion.p>
          </div>

          {/* Primary Workstation CTA */}
          <div className="shrink-0">
            <a
              href={WORKSTATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-[#5322FF] hover:from-cyan-300 hover:to-[#5322FF]/90 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded transition-all duration-300 shadow-[0_0_25px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <span className="text-black font-mono font-black">
                [ ⚡ {t('btnLaunchPylonStation')} ]
              </span>
              <ExternalLink className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Dynamic Draggable 5-Node Network Topology Canvas */}
        <AgentWorkbenchTopology isInView={isInView} onFpsUpdate={setFpsCounter} />

        {/* Live Telemetry Metric Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{fpsCounter} FPS (Client-Side)</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold rounded">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>ZOD SCHEMA PROTECTED</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold rounded">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>$0.00 CLOUD RENDER FEE</span>
            </div>
          </div>

          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
            {t('pylonInspectHint')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeadlessSwarmSection;
