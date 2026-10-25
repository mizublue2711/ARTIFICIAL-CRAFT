import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Terminal, ChevronDown, ExternalLink } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '@/context/useLanguage';

const STUDIO_URL = 'https://dify-n8n-workflow.ai.studio/';
const VIBEPATH_URL = 'https://vibepath.mizu2711.workers.dev/';

interface NavbarProps {
  onOpenBatchModal?: () => void;
}

export default function Navbar({ onOpenBatchModal }: NavbarProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: t('nav_engine'), href: '#platform' },
    { label: t('nav_playground'), href: '#playground' },
    { label: t('nav_architecture'), href: '#architecture' },
    { label: t('nav_blueprints'), href: '#blueprints' },
    { label: t('nav_blackbox'), href: '#existential-blackbox' },
    { label: t('nav_experts'), href: '#experts' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStudiosOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 font-mono ${
        scrolled
          ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800'
          : 'bg-transparent border-b border-zinc-800/40'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* LOGO AREA */}
        <a href="#" className="flex items-center gap-3 group shrink-0 whitespace-nowrap">
          <BrutalistLogo size={32} subtag={t('logo_subtag')} />
        </a>

        {/* NAVIGATION LINKS (xl breakpoint prevents overflow on standard laptops) */}
        <div className="hidden xl:flex items-center gap-0.5 shrink-0">
          {links.map((l, idx) => (
            <a
              key={idx}
              href={l.href}
              className="px-2.5 py-2 text-[11px] font-mono tracking-wider text-zinc-400 hover:text-white transition-colors rounded-none hover:bg-zinc-900 border border-transparent hover:border-zinc-800 whitespace-nowrap shrink-0"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* ACTIONS / BUTTONS AREA */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a
            href="#platform"
            className="group inline-flex items-center gap-1 border border-zinc-800 bg-zinc-950 text-[11px] font-mono text-zinc-300 px-3 py-1.5 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-colors whitespace-nowrap shrink-0"
          >
            {t('nav_deploy_node')}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-glow" />
          </a>

          {onOpenBatchModal && (
            <button
              onClick={onOpenBatchModal}
              className="group relative inline-flex items-center gap-1 border border-[#00E5FF] bg-[#00E5FF]/10 text-[11px] font-mono font-bold tracking-wider px-2.5 py-1.5 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all duration-300 cursor-pointer uppercase shadow-[0_0_12px_rgba(0,229,255,0.2)] whitespace-nowrap shrink-0"
            >
              <span>⚡ BATCH PRODUCTION</span>
            </button>
          )}

          {/* STUDIOS HUBS DROPDOWN */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setStudiosOpen((v) => !v)}
              className="group relative inline-flex items-center gap-1.5 border border-[#00E5FF]/60 bg-zinc-950 text-[11px] font-mono font-bold tracking-wide px-3 py-1.5 text-white transition-all duration-300 hover:border-[#00E5FF] hover:shadow-[0_0_16px_rgba(0,229,255,0.4)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
              </span>
              <span className="relative text-white group-hover:text-cyan-glow transition-colors">{t('nav_studios_hubs')}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-cyan-glow transition-transform duration-200 ${studiosOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {studiosOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 border border-zinc-800 bg-[#09090b]/98 backdrop-blur-xl shadow-2xl z-50 p-1.5 font-mono"
                >
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 px-2.5 py-1 mb-1 border-b border-zinc-800/60">
                    SATELLITE STUDIOS & APPS
                  </div>
                  <a
                    href={VIBEPATH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-cyan-glow flex items-center gap-1.5">
                        VibePath Studio
                        <span className="bg-[#00E5FF] text-black text-[9px] font-extrabold px-1 py-0.2 rounded-none uppercase tracking-tighter">
                          NEW
                        </span>
                      </span>
                      <span className="text-[10px] text-zinc-500">Interactive AI Workflow Engine</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-glow shrink-0 ml-2" />
                  </a>

                  <a
                    href={STUDIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#5322ff] flex items-center gap-1.5">
                        <Terminal className="h-3.5 w-3.5 text-cyan-glow" />
                        Autopilot Console
                      </span>
                      <span className="text-[10px] text-zinc-500">Dify + n8n Studio Sandbox</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500 group-hover:text-white shrink-0 ml-2" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <LanguageToggle />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <LanguageToggle />
          <button
            className="text-zinc-300 p-2 border border-zinc-800 bg-zinc-900 shrink-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-zinc-800 bg-[#09090b]/98 backdrop-blur-xl font-mono"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {links.map((l, idx) => (
                <a
                  key={idx}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-[13px] tracking-wider text-zinc-300 hover:text-white border-b border-zinc-900"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#platform"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 px-4 py-2.5 mt-2"
              >
                {t('nav_deploy_node')} <ArrowRight className="h-4 w-4 text-cyan-glow" />
              </a>
              <div className="text-[10px] uppercase text-zinc-500 mt-2 font-bold tracking-widest">Studios Hubs</div>
              <a
                href={VIBEPATH_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-between border border-[#00E5FF] bg-zinc-950 text-xs font-bold px-4 py-2.5 text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]"
              >
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
                  </span>
                  <span>VibePath Studio</span>
                </span>
                <span className="bg-[#00E5FF] text-black text-[9px] font-extrabold px-1 py-0.2 uppercase">NEW</span>
              </a>
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 border border-[#5322ff] bg-[#5322ff]/20 text-xs font-bold px-4 py-2.5 text-white"
              >
                <Terminal className="h-4 w-4 text-cyan-glow" />
                {t('nav_studio_console')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
