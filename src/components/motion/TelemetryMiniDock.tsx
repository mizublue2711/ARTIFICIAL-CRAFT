import React, { useCallback, useEffect, useState } from 'react';

export interface DockSection {
  id: string;
  label: string;
  num: string;
}

export const DOCK_SECTIONS: readonly DockSection[] = [
  { id: 'hero', label: 'HERO // MONOLITH', num: '01' },
  { id: 'cockpit', label: 'COCKPIT // SIMULATOR', num: '02' },
  { id: 'pylons', label: '5-GPU PYLONS', num: '03' },
  { id: 'studio-configurator', label: '3D KINEMATICS STUDIO', num: '04' },
  { id: 'workflow-vault', label: 'WORKFLOW VAULT', num: '05' },
  { id: 'blackbox', label: 'BLACKBOX SUBSTRATE', num: '06' },
] as const;

const SECTION_ID_FALLBACKS: Record<string, string[]> = {
  cockpit: ['automation-cockpit'],
  pylons: ['zone-03-headless-swarm'],
  blackbox: ['existential-blackbox'],
};

function resolveSectionElement(id: string): HTMLElement | null {
  const direct = document.getElementById(id);
  if (direct) return direct;

  const fallbacks = SECTION_ID_FALLBACKS[id];
  if (!fallbacks) return null;

  for (const fallbackId of fallbacks) {
    const el = document.getElementById(fallbackId);
    if (el) return el;
  }
  return null;
}

export const TelemetryMiniDock: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(DOCK_SECTIONS[0].id);

  const updateActiveSection = useCallback(() => {
    const viewportHeight = window.innerHeight || 800;
    const activationLine = viewportHeight * 0.4;

    // If scrolled to the very bottom of the document, lock to the final section
    const scrollBottom = window.scrollY + viewportHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (docHeight > viewportHeight && scrollBottom >= docHeight - 24) {
      setActiveId(DOCK_SECTIONS[DOCK_SECTIONS.length - 1].id);
      return;
    }

    let currentId: string = DOCK_SECTIONS[0].id;

    for (const section of DOCK_SECTIONS) {
      const el = resolveSectionElement(section.id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      if (rect.top <= activationLine) {
        currentId = section.id;
      }
    }

    setActiveId(currentId);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateActiveSection();
      });
    };

    // Initial sync after mount
    updateActiveSection();

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [updateActiveSection]);

  const handleJump = useCallback((id: string) => {
    const el = resolveSectionElement(id);
    if (!el) return;

    setActiveId(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <nav
      aria-label="Telemetry section navigation"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 pointer-events-auto border-r border-[#00E5FF]/20 pr-3 py-2 select-none"
    >
      {DOCK_SECTIONS.map((section) => {
        const isActive = activeId === section.id;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleJump(section.id)}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Jump to ${section.num} ${section.label}`}
            className="group relative flex items-center justify-end gap-2.5 py-1 focus:outline-none"
          >
            {/* Hover / Focus Technical Telemetry Label */}
            <span
              className={[
                'pointer-events-none whitespace-nowrap font-mono text-[10px] tracking-[0.14em] uppercase',
                'px-2.5 py-1 border bg-[#05050A]/90 backdrop-blur-md transition-all duration-200',
                'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0',
                isActive
                  ? 'border-[#00E5FF]/60 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'border-zinc-700/80 text-zinc-300',
              ].join(' ')}
            >
              [ {section.num} // {section.label} ]
            </span>

            {/* Micro Index Readout */}
            <span
              className={[
                'font-mono text-[9px] tracking-widest transition-colors duration-200',
                isActive
                  ? 'text-[#00E5FF] font-bold'
                  : 'text-zinc-600 group-hover:text-zinc-300',
              ].join(' ')}
            >
              {section.num}
            </span>

            {/* Cybernetic Pip Indicator */}
            <span className="relative flex items-center justify-center w-3 h-3">
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-[#00E5FF]/30 animate-ping" />
              )}
              <span
                className={[
                  'block transition-all duration-200',
                  isActive
                    ? 'w-2 h-2 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]'
                    : 'w-1.5 h-1.5 bg-zinc-600/80 group-hover:bg-[#00E5FF]/70 group-hover:scale-125',
                ].join(' ')}
              />
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default TelemetryMiniDock;
