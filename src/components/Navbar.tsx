import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X, ArrowRight, Terminal } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';

const STUDIO_URL = 'https://dify-n8n-workflow.ai.studio/';

const links = [
  { label: 'ENGINE', href: '#platform' },
  { label: 'ARCHITECTURE', href: '#architecture' },
  { label: 'BLUEPRINTS', href: '#blueprints' },
  { label: 'EXPERTS', href: '#experts' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <BrutalistLogo size={32} subtag="CRAFT//CODE" />
          <span className="hidden sm:inline-flex font-mono text-[9px] px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-cyan-glow tracking-widest ml-1">
            v3.0//BRUTALIST
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-[12px] font-mono tracking-wider text-zinc-400 hover:text-white transition-colors rounded-none hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-zinc-400 hover:text-white transition-colors p-2 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
            aria-label="GitHub"
          >
            <Github className="h-[16px] w-[16px]" />
          </a>
          <a
            href="#platform"
            className="group inline-flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 text-[12px] font-mono text-zinc-300 px-4 py-2 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-colors"
          >
            DEPLOY//NODE
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-glow" />
          </a>
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 border border-[#5322ff] bg-[#5322ff]/10 text-[12px] font-mono font-bold tracking-wide px-4 py-2 text-white transition-all duration-300 hover:bg-[#5322ff]/20"
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 16px 2px rgba(83,34,255,0.6)',
              }}
            />
            <Terminal className="relative h-3.5 w-3.5 text-cyan-glow" />
            <span className="relative">STUDIO//CONSOLE</span>
          </a>
        </div>

        <button
          className="md:hidden text-zinc-300 p-2 border border-zinc-800 bg-zinc-900"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
              {links.map((l) => (
                <a
                  key={l.href}
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
                DEPLOY//NODE <ArrowRight className="h-4 w-4 text-cyan-glow" />
              </a>
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 border border-[#5322ff] bg-[#5322ff]/20 text-xs font-bold px-4 py-2.5 text-white"
              >
                <Terminal className="h-4 w-4 text-cyan-glow" />
                STUDIO//CONSOLE
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
