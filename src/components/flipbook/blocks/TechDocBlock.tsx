import React, { useState } from 'react';
import { PageBlock } from '../../../types/flipbook';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

interface TechDocBlockProps {
  block: PageBlock;
}

export const TechDocBlock: React.FC<TechDocBlockProps> = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!block.code) return;
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-[#0B0B0F] border border-zinc-800 p-6 sm:p-10 font-mono text-zinc-100 flex flex-col justify-between">
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>TECHNICAL SPECIFICATION // {block.id}</span>
        </div>
        {block.language && (
          <span className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-400 uppercase">
            {block.language}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        {block.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase border-l-2 border-cyan-400 pl-3">
            {block.title}
          </h2>
        )}

        {block.content && (
          <div className="text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-950/60 border border-zinc-800/80 p-4">
            {block.content}
          </div>
        )}

        {/* Code Snippet Box */}
        {block.code && (
          <div className="flex-1 flex flex-col border border-zinc-800 bg-black/80 font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between bg-zinc-900/90 border-b border-zinc-800 px-4 py-2">
              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>SNIPPET</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                title="Copy code to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-cyan-300/90 overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre font-medium">
              <code>{block.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-3 border-t border-zinc-800/80 flex justify-between text-[11px] text-zinc-500">
        <span>STATUS: EXECUTABLE_SPEC</span>
        <span>AC-DOCS v1.0</span>
      </div>
    </div>
  );
};
