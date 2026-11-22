import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SHOWCASE_PROJECTS } from '@/data/showcase-projects';
import ShowcaseProjectCard from '@/components/showcase/ShowcaseProjectCard';
import { useTranslation } from '@/context/useLanguage';
import { Sparkles, Layers } from 'lucide-react';
import { StandaloneLabSection } from '@/components/motion/StandaloneLabSection';
import { itemFadeUpVariants } from '@/components/motion/ScrollDirectorSection';

export const ShowcasePage: React.FC = () => {
  const { t } = useTranslation();
  const showcaseI18n = t.showcase;
  const visibleProjects = SHOWCASE_PROJECTS.filter((p) => !p.hidden);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'ARTIFICIAL CRAFT // 3D & MOTION SHOWCASE DEBRIEFS';
  }, []);

  return (
    <main className="min-h-screen bg-[#05050A] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* Page Top Header Section */}
        <StandaloneLabSection>
          <header className="mb-14 border-b border-[#27272A] pb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/40 type-telemetry-tag font-bold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              <span>{showcaseI18n?.sectionBadge || '[ PORTFOLIO // 3D & MOTION ENGINES ]'}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <motion.h1 variants={itemFadeUpVariants} className="type-section-title">
                  {showcaseI18n?.sectionTitle || 'PROJECT DEBRIEFS // 3D & INTERACTIVE WEBAPPS'}
                </motion.h1>
                <motion.p variants={itemFadeUpVariants} className="mt-4 type-body-narrative max-w-3xl">
                  {showcaseI18n?.sectionSubtitle ||
                    'Real-world production engineering debriefs across WebGL spatial 3D, physics simulation, autonomous video rendering, and cybernetic CAD interfaces.'}
                </motion.p>
              </div>

              {/* Telemetry Counter Pill */}
              <div className="border border-zinc-800 bg-[#09090D] p-3 shrink-0 flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#00E5FF]" />
                <div className="flex flex-col">
                  <span className="type-telemetry-tag text-zinc-500 font-bold">TOTAL DEBRIEFS</span>
                  <span className="type-node-title tracking-wider">
                    [{visibleProjects.length}] PRODUCTION ENGINES
                  </span>
                </div>
              </div>
            </div>
          </header>
        </StandaloneLabSection>

        {/* Showcase Project Cards Grid */}
        <section aria-label="Showcase Projects List">
          {visibleProjects.map((project, index) => (
            <StandaloneLabSection key={project.id}>
              <ShowcaseProjectCard
                project={project}
                index={index}
              />
            </StandaloneLabSection>
          ))}
        </section>
      </div>
    </main>
  );
};

export default ShowcasePage;
