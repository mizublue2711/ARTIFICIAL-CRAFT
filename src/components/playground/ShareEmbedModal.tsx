import React, { useState } from 'react';
import { Copy, Check, X, Code, Link as LinkIcon } from 'lucide-react';
import { usePlaygroundStore } from '@/lib/video-engine/store/usePlaygroundStore';
import { encodeRecipeToBase64 } from '@/lib/video-engine/hooks/usePlaygroundUrlSync';

export interface ShareEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  toastMessage?: string | null;
  setToastMessage?: (msg: string | null) => void;
}

export const ShareEmbedModal: React.FC<ShareEmbedModalProps> = ({
  isOpen,
  onClose,
  setToastMessage,
}) => {
  const recipe = usePlaygroundStore((state) => state.recipe);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://artificialcraft.io';
  const encodedRecipe = encodeRecipeToBase64(recipe);
  const shareUrl = `${origin}/playground?recipe=${encodedRecipe}`;
  const iframeSnippet = `<iframe src="${origin}/playground?embed=true&recipe=${encodedRecipe}" width="100%" height="540" frameborder="0" allow="autoplay"></iframe>`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    if (setToastMessage) setToastMessage('Shareable Recipe Link Copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedEmbed(true);
    if (setToastMessage) setToastMessage('Embed Code Copied to Clipboard!');
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-[#0d0d12] border border-cyan-500/30 rounded-xl p-6 shadow-2xl shadow-cyan-500/10 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-lg font-bold text-cyan-400 tracking-wider uppercase">
              SHARE & EMBED RECIPE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {/* Shareable Link Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              Direct Shareable URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-[#12121a] border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={handleCopyShareLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-lg font-mono text-xs font-bold transition shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Embed Snippet Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Code className="w-4 h-4 text-cyan-400" />
              HTML iFrame Embed Code
            </label>
            <textarea
              readOnly
              rows={3}
              value={iframeSnippet}
              className="w-full bg-[#12121a] border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
            <button
              onClick={handleCopyEmbedCode}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg font-mono text-xs font-bold transition shadow-lg shadow-cyan-500/20"
            >
              {copiedEmbed ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
              {copiedEmbed ? '1-Click Code Copied!' : '1-Click Copy Embed Code'}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>STATUS: ENCODED BASE64 PLAYGROUND RECIPE</span>
          <span className="text-cyan-500/80">ARTIFICIAL CRAFT V2</span>
        </div>
      </div>
    </div>
  );
};
