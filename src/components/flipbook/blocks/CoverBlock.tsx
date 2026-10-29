import React from 'react';
import { PageBlock } from '../../../types/flipbook';
import { ShieldCheck, Cpu, Tag, Hash } from 'lucide-react';

interface CoverBlockProps {
  block: PageBlock;
}

export const CoverBlock: React.FC<CoverBlockProps> = ({ block }) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-[#0B0B0F] border border-zinc-800 p-8 sm:p-12 font-mono text-zinc-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Bar / Category Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 z-10">
        <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>SPECIFICATION // ID: {block.id}</span>
        </div>
        {block.version && (
          <div className="px-3 py-1 bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-bold tracking-wider">
            {block.version}
          </div>
        )}
      </div>

      {/* Hero Core Content */}
      <div className="my-auto py-8 z-10 flex flex-col gap-6">
        {block.tags && block.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {block.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase tracking-wider"
              >
                <Tag className="w-3 h-3 text-zinc-500" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none uppercase border-l-4 border-cyan-500 pl-4">
          {block.title || 'Untitled Document'}
        </h1>

        {block.subtitle && (
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-light leading-relaxed pl-5 border-l border-zinc-800">
            {block.subtitle}
          </p>
        )}
      </div>

      {/* Verified Footer */}
      <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 z-10 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          {block.verified !== false ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>VERIFIED SPECIFICATION</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1">
              <span>UNVERIFIED DRAFT</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-zinc-600" />
            <span>ARTIFICIAL CRAFT CORE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
