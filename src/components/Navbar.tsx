import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X, ArrowRight, Rocket } from 'lucide-react';

const STUDIO_URL = 'https://dify-n8n-workflow.ai.studio/';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Blueprints', href: '#blueprints' },
  { label: 'Experts', href: '#experts' },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-cyan-glow/80 to-purple-glow/60 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[#09090b]/40" />
            <span className="relative font-mono text-[13px] font-bold text-white">N</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">
            Nexora
          </span>
          <span className="hidden sm:inline-flex font-mono text-[10px] px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-500 ml-1">
            v2.4
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-[13.5px] text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/[0.03]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href="#platform"
            className="group inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-white/[0.02] text-[13px] text-zinc-300 px-4 py-2 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            Deploy
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative animate-glow-breathe inline-flex items-center gap-2 rounded-full text-[13px] font-semibold px-4 py-2 text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.12))',
              border: '1px solid rgba(0,229,255,0.5)',
            }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 0 1px rgba(0,229,255,0.7), 0 0 24px -2px rgba(0,229,255,0.5)',
              }}
            />
            <Rocket className="relative h-3.5 w-3.5 text-cyan-glow" />
            <span className="relative">Launch Autopilot Dashboard</span>
          </a>
        </div>

        <button
          className="md:hidden text-zinc-300"
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
            className="md:hidden overflow-hidden border-t border-zinc-800/60 bg-[#09090b]/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[15px] text-zinc-300 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#platform"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-800 bg-white/[0.02] text-sm text-zinc-300 px-4 py-2.5"
              >
                Deploy <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-2.5 text-white"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.12))',
                  border: '1px solid rgba(0,229,255,0.4)',
                  boxShadow: '0 0 16px -4px rgba(0,229,255,0.3)',
                }}
              >
                <Rocket className="h-4 w-4 text-cyan-glow" />
                Launch Autopilot Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
