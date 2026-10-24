import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Terminal } from 'lucide-react'; // Đã bỏ import Github
import BrutalistLogo from './BrutalistLogo';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '@/context/useLanguage';

const STUDIO_URL = 'https://dify-n8n-workflow.ai.studio/';

interface NavbarProps {
  onOpenBatchModal?: () => void;
}

export default function Navbar({ onOpenBatchModal }: NavbarProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 font-mono ${
        scrolled
          ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800'
          : 'bg-transparent border-b border-zinc-800/40'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* LOGO AREA (Đã ẩn thẻ span phiên bản V3.0) */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <BrutalistLogo size={32} subtag={t('logo_subtag')} />
        </a>

        {/* NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-0.5">
          {links.map((l, idx) => (
            <a
              key={idx}
              href={l.href}
              className="px-2.5 py-2 text-[11px] font-mono tracking-wider text-zinc-400 hover:text-white transition-colors rounded-none hover:bg-zinc-900 border border-transparent hover:border-zinc-800 whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* ACTIONS / BUTTONS AREA (Đã ẩn nút GitHub) */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="#platform"
            className="group inline-flex items-center gap-1 border border-zinc-800 bg-zinc-950 text-[11px] font-mono text-zinc-300 px-3 py-1.5 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-colors whitespace-nowrap"
          >
            {t('nav_deploy_node')}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-glow" />
          </a>

          {onOpenBatchModal && (
            <button
              onClick={onOpenBatchModal}
              className="group relative inline-flex items-center gap-1 border border-[#00E5FF] bg-[#00E5FF]/10 text-[11px] font-mono font-bold tracking-wider px-2.5 py-1.5 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all duration-300 cursor-pointer uppercase shadow-[0_0_12px_rgba(0,229,255,0.2)] whitespace-nowrap"
            >
              <span>⚡ BATCH PRODUCTION</span>
            </button>
          )}

          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 border border-[#5322ff] bg-[#5322ff]/10 text-[11px] font-mono font-bold tracking-wide px-3 py-1.5 text-white transition-all duration-300 hover:bg-[#5322ff]/20 whitespace-nowrap"
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 16px 2px rgba(83,34,255,0.6)',
              }}
            />
            <Terminal className="relative h-3.5 w-3.5 text-cyan-glow" />
            <span className="relative">{t('nav_studio_console')}</span>
          </a>

          <LanguageToggle />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle />
          <button
            className="text-zinc-300 p-2 border border-zinc-800 bg-zinc-900"
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
