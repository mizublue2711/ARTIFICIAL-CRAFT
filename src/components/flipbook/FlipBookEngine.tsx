import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookData, PageBlock } from '../../types/flipbook';
import { getBookBySlug } from '../../data/books/registry';
import { CoverBlock } from './blocks/CoverBlock';
import { TechDocBlock } from './blocks/TechDocBlock';
import { DiagramBlock } from './blocks/DiagramBlock';
import { InteractiveBlock } from './blocks/InteractiveBlock';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  BookOpen,
  Layers
} from 'lucide-react';

/**
 * Web Audio API SoundFX Class for Flipbook Audio Feedback
 */
class FlipBookSoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  /**
   * Synthesizes a realistic page-turn rustle / noise sweep
   */
  public playPageTurn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.12; // 120ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise pattern for soft paper rustle
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Filter sweep
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 0.1);
      filter.Q.value = 1.5;

      // Gain envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start();
      noiseSource.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Ignore audio context autoplay errors
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Ignore
    }
  }
}

interface FlipBookEngineProps {
  bookSlug?: string;
  bookData?: BookData;
  className?: string;
}

export const FlipBookEngine: React.FC<FlipBookEngineProps> = ({
  bookSlug = 'manual-sample-architecture',
  bookData,
  className = ''
}) => {
  const soundFx = useRef<FlipBookSoundFX>(new FlipBookSoundFX());
  const containerRef = useRef<HTMLDivElement>(null);

  // Load book data from prop or registry
  const resolvedBook = bookData || getBookBySlug(bookSlug);

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward

  const totalPages = resolvedBook?.pages.length || 0;
  const currentPage: PageBlock | undefined = resolvedBook?.pages[pageIndex];

  // Handle page turn navigation
  const goToPage = useCallback((targetIndex: number) => {
    if (!resolvedBook || targetIndex < 0 || targetIndex >= totalPages) return;
    setDirection(targetIndex > pageIndex ? 1 : -1);
    setPageIndex(targetIndex);
    soundFx.current.playPageTurn();
  }, [pageIndex, resolvedBook, totalPages]);

  const nextPage = useCallback(() => {
    if (pageIndex < totalPages - 1) {
      goToPage(pageIndex + 1);
    }
  }, [goToPage, pageIndex, totalPages]);

  const prevPage = useCallback(() => {
    if (pageIndex > 0) {
      goToPage(pageIndex - 1);
    }
  }, [goToPage, pageIndex]);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundFx.current.setMuted(nextMute);
    if (!nextMute) soundFx.current.playClick();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    soundFx.current.playClick();
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToPage(totalPages - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, goToPage, totalPages]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  if (!resolvedBook) {
    return (
      <div className="w-full p-8 border border-red-800 bg-red-950/30 font-mono text-red-400 text-sm">
        [ERROR]: Flipbook dataset &quot;{bookSlug}&quot; not found in Registry.
      </div>
    );
  }

  // Render block depending on type
  const renderBlockComponent = (block: PageBlock) => {
    switch (block.type) {
      case 'cover':
        return <CoverBlock block={block} />;
      case 'tech_doc':
        return <TechDocBlock block={block} />;
      case 'diagram':
        return <DiagramBlock block={block} />;
      case 'interactive':
        return <InteractiveBlock block={block} />;
      default:
        return <TechDocBlock block={block} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full bg-[#07070A] border border-zinc-800 p-4 sm:p-6 font-mono flex flex-col justify-between shadow-2xl relative select-none ${className}`}
    >
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 mb-4 gap-3 z-20">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {resolvedBook.title}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">
              {resolvedBook.category} // v{resolvedBook.version}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 border transition-colors ${
              isMuted
                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                : 'bg-zinc-900 border-cyan-800/80 text-cyan-400 hover:bg-zinc-800'
            }`}
            title={isMuted ? 'Unmute WebAudio sound' : 'Mute WebAudio sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Flipbook Content Viewport */}
      <div className="relative flex-1 min-h-[520px] w-full overflow-hidden bg-black/40 border border-zinc-800/60 my-2">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={pageIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, rotateY: direction * 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: direction * -40, rotateY: direction * -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {currentPage && renderBlockComponent(currentPage)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Footer Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-zinc-800 pt-3 mt-4 gap-4 z-20">
        {/* Page Jump / Select */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Layers className="w-4 h-4 text-zinc-500" />
          <span>JUMP:</span>
          <select
            value={pageIndex}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs py-1 px-2 focus:outline-none focus:border-cyan-500"
          >
            {resolvedBook.pages.map((p, idx) => (
              <option key={p.id} value={idx}>
                P{idx + 1}: {p.title || p.id}
              </option>
            ))}
          </select>
        </div>

        {/* Page Indicator Badge */}
        <div className="text-xs text-zinc-400 font-bold tracking-widest px-3 py-1 bg-zinc-900 border border-zinc-800">
          PAGE <span className="text-cyan-400">{pageIndex + 1}</span> / {totalPages}
        </div>

        {/* Prev & Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREV</span>
          </button>
          <button
            onClick={nextPage}
            disabled={pageIndex === totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-bold hover:bg-cyan-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
