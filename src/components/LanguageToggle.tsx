import React from 'react';
import { Terminal } from 'lucide-react';
import { useLanguage } from '@/context/useLanguage';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400 select-none">
      <Terminal className="h-3.5 w-3.5 text-cyan-glow shrink-0" />
      <span className="text-zinc-500 font-medium">$ lang:</span>
      <span className="text-zinc-500 font-medium">[</span>
      <button
        type="button"
        onClick={() => setLanguage('EN')}
        className={`px-1.5 py-0.5 font-bold transition-all duration-200 rounded-none ${
          language === 'EN'
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]'
            : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
        }`}
        aria-label="Set language to English"
      >
        EN
      </button>
      <span className="text-zinc-600">|</span>
      <button
        type="button"
        onClick={() => setLanguage('VI')}
        className={`px-1.5 py-0.5 font-bold transition-all duration-200 rounded-none ${
          language === 'VI'
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]'
            : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
        }`}
        aria-label="Set language to Vietnamese"
      >
        VI
      </button>
      <span className="text-zinc-500 font-medium">]</span>
    </div>
  );
}
