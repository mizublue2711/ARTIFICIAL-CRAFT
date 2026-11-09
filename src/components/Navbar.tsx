import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ExternalLink, BookOpen, Layers, Rocket, Sparkles, Terminal } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '@/context/useLanguage';

const AUTOPILOT_URL = 'https://dify-n8n-workflow.ai.studio/';
const VIBEPATH_URL = 'https://vibepath.artificialcraft.space/';

interface NavbarProps {
  onOpenBatchModal?: () => void;
}

export default function Navbar({ onOpenBatchModal }: NavbarProps) {
  const { t } = useTranslation();
  const location = useLocation();
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
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  const isPlaygroundActive = location.pathname === '/playground';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full box-border border-b border-[#27272A] px-4 sm:px-6 pt-[env(safe-area-inset-top)] overflow-x-hidden font-mono transition-colors duration-300 ${
        mobileMenuOpen ? 'bg-[#09090B] !overflow-visible' : 'bg-[#09090B]/90 backdrop-blur-md'
      } ${studiosOpen || docsOpen ? '!overflow-visible' : ''}`}
    >
      <nav className="mx-auto max-w-7xl h-16 flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
        {/* LOGO AREA */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
          <BrutalistLogo size={32} subtag={t('logo_subtag')} />
        </Link>

        {/* NAVIGATION DROPDOWNS & PLAYGROUND TAB */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* STUDIO FACTORY LINK */}
          <Link
            to="/studio"
            className={`group relative inline-flex items-center gap-1.5 border text-xs font-mono font-bold tracking-wider px-3 py-1.5 transition-all cursor-pointer ${
              location.pathname === '/studio'
                ? 'border-[#5322FF] bg-[#5322FF]/20 text-[#00FF66] shadow-[0_0_12px_rgba(83,34,255,0.35)]'
                : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-[#5322FF] hover:text-white'
            }`}
          >
            <span>STUDIO FACTORY</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-[#5322FF]/30 border border-[#5322FF] text-[#00FF66]">
              NEW // 3D
            </span>
          </Link>

          {/* ROBOTICS 3D LINK */}
          <Link
            to="/robotics"
            className={`group relative inline-flex items-center gap-1.5 border text-xs font-mono font-bold tracking-wider px-3 py-1.5 transition-all cursor-pointer ${
              location.pathname === '/robotics'
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-[#00E5FF] hover:text-white'
            }`}
          >
            <span>ROBOTICS 3D</span>
            <span className="text-[9px] px-1 py-0.5 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
              LIVE
            </span>
          </Link>

          {/* HIGH-TECH PLAYGROUND TAB */}
          <Link
            to="/playground"
            className={`group relative inline-flex items-center gap-2 border text-xs font-mono font-bold tracking-wider px-3 py-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)] ${
              isPlaygroundActive
                ? 'border-[#00E5FF] bg-[#00E5FF] text-black'
                : 'border-[#00E5FF]/70 bg-zinc-950 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
            </span>
            <span>PLAYGROUND</span>
            <Sparkles className="h-3 w-3 text-cyan-glow group-hover:text-black transition-colors" />
          </Link>

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

                  <Link
                    to="/studio"
                    onClick={() => setStudiosOpen(false)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs font-mono text-white/90 hover:text-white transition-colors"
                  >
                    <span className="font-bold flex items-center gap-1.5">⚡ Studio Configurator</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#5322FF]/30 border border-[#5322FF] text-[#00FF66] font-bold">
                      NO-CODE 3D
                    </span>
                  </Link>

                  <Link
                    to="/playground"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[#00E5FF] flex items-center gap-1.5">
                        ⚡ 3-Column Playground Studio
                      </span>
                      <span className="text-[10px] text-zinc-500">60FPS Remotion Stage & Live Inspector</span>
                    </div>
                  </Link>

                  <Link
                    to="/robotics"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-1.5">
                          🦾 Robotics Factory 3D
                        </span>
                        <span className="text-[9px] px-1 py-0.2 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 rounded-xs font-bold">
                          NEW
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500">[3D KINEMATICS]</span>
                    </div>
                  </Link>

                  <a
                    href={AUTOPILOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
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
                    href={VIBEPATH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-1.5">
                        🚀 VibePath Studio
                      </span>
                      <span className="text-[10px] text-zinc-500">VibePath automates 3D mapping</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-500 group-hover:text-[#00E5FF] shrink-0 ml-2" />
                  </a>

                  <Link
                    to="/playground?tab=node-03"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF]">
                        🎨 LinkedIn Banner Studio
                      </span>
                      <span className="text-[10px] text-zinc-500">Brutalist Graphic Generator</span>
                    </div>
                  </Link>

                  <Link
                    to="/playground?tab=node-04"
                    onClick={() => setStudiosOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00E5FF]">
                        📊 CSV Data Sandbox
                      </span>
                      <span className="text-[10px] text-zinc-500">CKAN Mekong Open Data Visualizer</span>
                    </div>
                  </Link>
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
                    to="/flipbook/manual-hybrid-ai-automation"
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

                  <Link
                    to="/docs/architecture"
                    onClick={() => setDocsOpen(false)}
                    className="group flex items-center justify-between p-2.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-colors mt-1"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-[#00E5FF] flex items-center gap-1.5">
                          <Terminal className="h-3.5 w-3.5 text-[#00FF66]" />
                          {t('nav_docs_architecture')}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 font-bold">
                          NEW
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{t('nav_docs_architecture_desc')}</span>
                    </div>
                  </Link>
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
            type="button"
            className="flex md:hidden items-center justify-center min-w-[44px] min-h-[44px] p-2 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] text-white active:bg-[#00E5FF] active:text-black transition-colors rounded-none"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-[#00E5FF]" />
            ) : (
              <Menu className="h-5 w-5 text-[#00E5FF]" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-[60px] bottom-0 z-50 w-full h-[calc(100vh-60px)] bg-[#09090B] border-t border-[#27272A] p-5 overflow-y-auto flex flex-col gap-5 md:hidden select-none font-mono"
          >
            {/* 01 // STUDIOS & ENGINES */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase mb-2 px-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00E5FF] animate-pulse" />
                <span>01 // STUDIOS & ENGINES</span>
              </div>

              <Link
                to="/studio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#5322FF]">⚡</span>
                  <span className="font-mono text-xs font-bold text-white">STUDIO FACTORY</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#5322FF]/30 border border-[#5322FF] text-[#00FF66] shadow-[0_0_8px_rgba(83,34,255,0.4)]">
                  [ NEW // 3D ]
                </span>
              </Link>

              <Link
                to="/playground"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#00E5FF]" />
                  <span className="font-mono text-xs font-bold text-[#00E5FF]">PLAYGROUND STUDIO</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                  [ 60FPS SLA ]
                </span>
              </Link>

              <Link
                to="/robotics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <span>🦾</span>
                  <span className="font-mono text-xs font-bold text-white">ROBOTICS FACTORY 3D</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                  [ LIVE ]
                </span>
              </Link>

              <a
                href={AUTOPILOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <span>🚀</span>
                  <span className="font-mono text-xs font-bold text-white">AUTOPILOT STUDIO</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300">
                    [ EXT // DIFY ]
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                </div>
              </a>

              <a
                href={VIBEPATH_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <span>🌐</span>
                  <span className="font-mono text-xs font-bold text-white">VIBEPATH STUDIO</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300">
                    [ EXT // 3D ]
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                </div>
              </a>
            </div>

            {/* 1PX DIVIDER */}
            <div className="border-b border-[#1F1F2E] my-1" />

            {/* 02 // KNOWLEDGE BASE */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase mb-2 px-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00E5FF]" />
                <span>02 // KNOWLEDGE BASE</span>
              </div>

              <Link
                to="/library"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-[#00E5FF]" />
                  <span className="font-mono text-xs font-bold text-white">FLIPBOOK ARCHIVE</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300">
                  [ SPECS ]
                </span>
              </Link>

              <Link
                to="/flipbook/manual-hybrid-ai-automation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00E5FF] active:bg-[#00E5FF]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white">HYBRID AI SPEC</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF]">
                  [ BLUEPRINT ]
                </span>
              </Link>
            </div>

            {/* 1PX DIVIDER */}
            <div className="border-b border-[#1F1F2E] my-1" />

            {/* 03 // SYSTEM ARCHITECTURE */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs font-bold text-[#00E5FF] tracking-widest uppercase mb-2 px-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00FF66]" />
                <span>03 // SYSTEM ARCHITECTURE</span>
              </div>

              {/* Primary Architecture Card */}
              <Link
                to="/docs/architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 bg-[#121218] border border-[#27272A] hover:border-[#00FF66] active:bg-[#00FF66]/10 transition-all rounded-none min-h-[48px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Terminal className="h-4 w-4 text-[#00FF66] shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="font-mono text-xs font-bold text-[#00FF66] truncate">{t('nav_docs_architecture')}</span>
                    <span className="font-mono text-[10px] text-zinc-400 truncate">{t('nav_docs_architecture_desc')}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] shrink-0 ml-2 shadow-[0_0_8px_rgba(0,255,102,0.3)]">
                  [ LIVE MANUAL ]
                </span>
              </Link>

              {/* Visually indented sub-cards */}
              <div className="ml-3 pl-3 border-l-2 border-[#5322FF] flex flex-col gap-2 mt-1">
                <Link
                  to="/docs/architecture"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 bg-[#0e0e14] border border-[#27272A]/70 hover:border-[#5322FF] text-xs transition-all min-h-[44px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#00FF66] text-[11px] font-mono font-bold">§ 2.0</span>
                    <span className="font-mono text-[11px] text-zinc-300 truncate">Deterministic SLA & Failover</span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#5322FF]/20 border border-[#5322FF]/50 text-[#00FF66] shrink-0">
                    [ RENDER: WebGL GPU ]
                  </span>
                </Link>

                <Link
                  to="/docs/architecture"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 bg-[#0e0e14] border border-[#27272A]/70 hover:border-[#5322FF] text-xs transition-all min-h-[44px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#00E5FF] text-[11px] font-mono font-bold">§ 3.0</span>
                    <span className="font-mono text-[11px] text-zinc-300 truncate">JSON Spec & AST Pipeline</span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 shrink-0">
                    ZERO-CRASH
                  </span>
                </Link>
              </div>
            </div>

            {/* 1PX DIVIDER */}
            <div className="border-b border-[#1F1F2E] my-1" />

            {/* ACTION CTA: LAUNCH BUTTON */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBatchModal?.();
              }}
              className="flex items-center justify-center gap-2 p-3.5 bg-[#00E5FF]/10 border border-[#00E5FF] hover:bg-[#00E5FF] text-[#00E5FF] hover:text-black active:bg-[#00E5FF] active:text-black transition-all font-mono text-xs font-bold uppercase tracking-wider rounded-none min-h-[48px] shadow-[0_0_16px_rgba(0,229,255,0.2)] mt-1"
            >
              <Rocket className="w-4 h-4" />
              <span>[ 🚀 Launch Studio Engine ]</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
