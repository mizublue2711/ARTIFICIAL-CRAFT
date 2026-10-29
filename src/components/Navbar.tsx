import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ExternalLink, BookOpen, Layers, Rocket } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '@/context/useLanguage';

const AUTOPILOT_URL = 'https://dify-n8n-workflow.ai.studio/';

interface NavbarProps {
  onOpenBatchModal?: () => void;
}

export default function Navbar({ onOpenBatchModal }: NavbarProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const studiosRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (studiosRef.current && !studiosRef.current.contains(event.target as Node)) {
        setStudiosOpen(false);
      }
      if (docsRef.current && !docsRef.current.contains(event.target as Node)) {
        setDocsOpen(false);
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
        <Link to="/" className="flex items-center gap-3 group shrink-0 whitespace-nowrap">
          <BrutalistLogo size={32} subtag={t('logo_subtag')} />
        </Link>

        {/* NAVIGATION DROPDOWNS (STUDIOS & DOCS) */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* 1) STUDIOS DROPDOWN */}
          <div className="relative" ref={studiosRef}>
            <button
              onClick={() => {
                setStudiosOpen((v) => !v);
                setDocsOpen(false);
              }}
              className="group inline-flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 text-zinc-200 hover:text-white hover:border-[#00E5FF] transition-all cursor-pointer"
            >
              <span className="text-[#00E5FF]">STUDIOS</span>
              <ChevronDown className={`h-3.5 w-3.5 text-[#00E5FF] transition-transform duration-200 ${studiosOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {studiosOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-64 border border-zinc-800 bg-[#09090b]/98 backdrop-blur-xl shadow-2xl z-50 p-1.5 font-mono"
                >
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 px-2.5 py-1 mb-1 border-b border-zinc-800/60">
                    INTERACTIVE TOOLS
                  </div>

                  <a
                    href={AUTOPILOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-1.5">
                        🚀 Autopilot Studio
                      </span>
                      <span className="text-[10px] text-zinc-500">Dify + n8n Multi-Agent Workflow</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500 group-hover:text-[#00E5FF] shrink-0 ml-2" />
                  </a>

                  <a
                    href="/#banner-studio"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF]">
                        🎨 LinkedIn Banner Studio
                      </span>
                      <span className="text-[10px] text-zinc-500">Brutalist Graphic Generator</span>
                    </div>
                  </a>

                  <a
                    href="/#csv-visualizer"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF]">
                        📊 CSV Data Sandbox
                      </span>
                      <span className="text-[10px] text-zinc-500">CKAN Mekong Open Data Visualizer</span>
                    </div>
                  </a>

                  <a
                    href="/#playground"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF]">
                        ⚡ WebGL 3D Canvas
                      </span>
                      <span className="text-[10px] text-zinc-500">Real-time Particle Sandbox</span>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2) DOCS DROPDOWN */}
          <div className="relative" ref={docsRef}>
            <button
              onClick={() => {
                setDocsOpen((v) => !v);
                setStudiosOpen(false);
              }}
              className="group inline-flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 text-zinc-200 hover:text-white hover:border-[#00E5FF] transition-all cursor-pointer"
            >
              <span className="text-zinc-300 group-hover:text-[#00E5FF]">DOCS</span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 group-hover:text-[#00E5FF] transition-transform duration-200 ${docsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {docsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-64 border border-zinc-800 bg-[#09090b]/98 backdrop-blur-xl shadow-2xl z-50 p-1.5 font-mono"
                >
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500 px-2.5 py-1 mb-1 border-b border-zinc-800/60">
                    KNOWLEDGE & MANUALS
                  </div>

                  <Link
                    to="/library"
                    onClick={() => setDocsOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-[#00E5FF]" />
                        Flipbook Archive
                      </span>
                      <span className="text-[10px] text-zinc-500">Interactive Technical Specs</span>
                    </div>
                  </Link>

                  <Link
                    to="/flipbook/manual-sample-architecture"
                    onClick={() => setDocsOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-cyan-400" />
                        Latest Blueprint Spec
                      </span>
                      <span className="text-[10px] text-zinc-500">Hybrid AI Engine Blueprint</span>
                    </div>
                  </Link>

                  <a
                    href="/#blueprints"
                    onClick={() => setDocsOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF]">
                        📜 Brandbook & Specs
                      </span>
                      <span className="text-[10px] text-zinc-500">Design System & Architecture</span>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ACTIONS / BUTTONS AREA (Language toggle & Single [🚀 Launch] CTA) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <LanguageToggle />

          <button
            onClick={onOpenBatchModal}
            className="group relative inline-flex items-center gap-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-xs font-mono font-bold tracking-wider px-4 py-2 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all duration-300 cursor-pointer uppercase shadow-[0_0_16px_rgba(0,229,255,0.3)] whitespace-nowrap shrink-0"
          >
            <Rocket className="w-4 h-4 text-[#00E5FF] group-hover:text-black transition-colors" />
            <span>[ 🚀 Launch ]</span>
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <LanguageToggle />
          <button
            className="text-zinc-300 p-2 border border-zinc-800 bg-zinc-900 shrink-0"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-zinc-800 bg-[#09090b]/98 backdrop-blur-xl font-mono"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">STUDIOS</div>
              <a
                href={AUTOPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                🚀 Autopilot Studio
              </a>
              <a
                href="/#banner-studio"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                🎨 LinkedIn Banner Studio
              </a>
              <a
                href="/#csv-visualizer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                📊 CSV Data Sandbox
              </a>

              <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mt-2">DOCS</div>
              <Link
                to="/library"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                📖 Flipbook Archive
              </Link>
              <Link
                to="/flipbook/manual-sample-architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                ⚡ Latest Blueprint Spec
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBatchModal?.();
                }}
                className="inline-flex items-center justify-center gap-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-xs font-bold px-4 py-2.5 text-[#00E5FF] mt-3"
              >
                <Rocket className="w-4 h-4" />
                <span>[ 🚀 Launch ]</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
