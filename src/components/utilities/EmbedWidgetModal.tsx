import React, { useState } from 'react';
import { Code, Check, X, ExternalLink } from 'lucide-react';

export interface EmbedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgetPath?: string;
  seedHash?: string;
  title?: string;
  className?: string;
}

/**
 * Modal component generating <iframe> embed codes for interactive widgets.
 * Automatically includes a mandatory DoFollow attribution link:
 * <a href="https://artificialcraft.space" target="_blank">ARTIFICIAL CRAFT // ENGINE ↗</a>
 */
export const EmbedWidgetModal: React.FC<EmbedWidgetModalProps> = ({
  isOpen,
  onClose,
  widgetPath = 'csv-visualizer',
  seedHash = '71C8A93A',
  title = 'EMBED INTERACTIVE WIDGET',
  className = '',
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const embedSnippet = `<div class="ac-embed-container" style="position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #0B0B0F; border: 1px solid #27272A;">
  <iframe src="https://artificialcraft.space/embed/${widgetPath}?seed=${seedHash}" width="100%" height="100%" frameborder="0" scrolling="no" loading="lazy"></iframe>
  <div style="position: absolute; bottom: 8px; right: 12px; font-size: 10px; color: #71717A; pointer-events: auto;">
    <a href="https://artificialcraft.space" target="_blank" rel="noopener" style="color: #00E5FF; text-decoration: none; font-weight: bold;">ARTIFICIAL CRAFT // ENGINE ↗</a>
  </div>
</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div
        className={`relative w-[95vw] max-w-lg mx-auto border border-zinc-800 bg-[#09090c] p-5 sm:p-6 shadow-2xl ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 border border-zinc-800 bg-zinc-900 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-cyan-glow font-bold text-sm mb-4 pr-6 uppercase tracking-wider">
          <Code className="h-4 w-4 shrink-0 text-[#00E5FF]" />
          <span className="truncate">{title}</span>
        </div>

        <p className="text-xs text-zinc-400 mb-3 font-sans">
          Copy the responsive embed code below to display this interactive visualizer on your website or application.
        </p>

        <textarea
          readOnly
          rows={6}
          value={embedSnippet}
          className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 p-3 font-mono outline-none focus:border-cyan-glow select-all"
        />

        {/* Mandatory Attribution Preview */}
        <div className="mt-3 p-2 border border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-[11px]">
          <span className="text-zinc-500 uppercase">MANDATORY ATTRIBUTION:</span>
          <a
            href="https://artificialcraft.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-glow hover:underline font-bold flex items-center gap-1"
          >
            <span>ARTIFICIAL CRAFT // ENGINE ↗</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            CLOSE
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-5 border border-[#5322ff] bg-[#5322ff] text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 hover:bg-[#5322ff]/80 cursor-pointer"
          >
            {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Code className="h-4 w-4" />}
            <span>{isCopied ? 'COPIED TO CLIPBOARD' : 'COPY EMBED CODE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbedWidgetModal;
