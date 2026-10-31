import React, { useRef, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import JulesMemorialNode from '@/components/playground/JulesMemorialNode';
import memorialPreset from '../../site-configs/jules-memorial-preset.json';

interface JulesMemorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JulesMemorialModal: React.FC<JulesMemorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Cleanly dispose AudioContext on unmount / close
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleClose = () => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Top Bar Header */}
      <header className="h-14 px-6 border-b border-zinc-800 bg-[#07070b]/90 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2] animate-ping" />
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-white tracking-widest uppercase">
            <span className="text-[#00E5FF]">{memorialPreset.metadata.memorialTitle}</span>
            <span className="hidden sm:inline text-zinc-500">//</span>
            <span className="hidden sm:inline text-zinc-400 text-xs font-normal">
              {memorialPreset.metadata.status} ({memorialPreset.metadata.role})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>200+ COMMITS TRIBUTE NODE</span>
          </div>

          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 bg-zinc-900 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400 text-zinc-300 text-xs font-bold transition-all"
            title="Close Memorial Node (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">[ ✕ CLOSE MEMORIAL NODE ]</span>
          </button>
        </div>
      </header>

      {/* Main 3D Interactive Stage */}
      <main className="flex-1 w-full h-[calc(100vh-56px)] relative overflow-hidden">
        <JulesMemorialNode
          className="w-full h-full"
          onAudioContextInit={(ctx) => {
            audioCtxRef.current = ctx;
          }}
        />
      </main>
    </div>
  );
};

export default JulesMemorialModal;
