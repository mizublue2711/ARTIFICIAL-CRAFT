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
  Layers,
  Columns,
  Square
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
  const lastWheelTime = useRef<number>(0);

  // Load book data from prop or registry
  const resolvedBook = bookData || getBookBySlug(bookSlug);

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward

  // Responsive Spread Mode Detection (>= 1024px)
  const [isSpread, setIsSpread] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSpread(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = resolvedBook?.pages.length || 0;
  const pageStep = isSpread ? 2 : 1;

  // Navigation handlers
  const goToPage = useCallback((targetIndex: number) => {
    if (!resolvedBook || targetIndex < 0 || targetIndex >= totalPages) return;
    setDirection(targetIndex > pageIndex ? 1 : -1);
    setPageIndex(targetIndex);
    soundFx.current.playPageTurn();
  }, [pageIndex, resolvedBook, totalPages]);

  const nextPage = useCallback(() => {
    if (pageIndex < totalPages - (isSpread ? 2 : 1)) {
      goToPage(pageIndex + (isSpread ? 2 : 1));
    } else if (isSpread && pageIndex === totalPages - 2) {
      goToPage(totalPages - 1);
    }
  }, [goToPage, isSpread, pageIndex, totalPages]);

  const prevPage = useCallback(() => {
    if (pageIndex > 0) {
      goToPage(Math.max(0, pageIndex - (isSpread ? 2 : 1)));
    }
  }, [goToPage, isSpread, pageIndex]);

  // Trackpad / Wheel Scroll Page Turning (300ms Debounce)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 300) return;

      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
        if (e.deltaX > 20 || e.deltaY > 30) {
          lastWheelTime.current = now;
          nextPage();
        } else if (e.deltaX < -20 || e.deltaY < -30) {
          lastWheelTime.current = now;
          prevPage();
        }
      }
    },
    [nextPage, prevPage]
  );

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

  const leftPageBlock: PageBlock | undefined = resolvedBook.pages[pageIndex];
  const rightPageBlock: PageBlock | undefined = isSpread
    ? resolvedBook.pages[pageIndex + 1]
    : undefined;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
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
          {/* Spread View Indicator Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-cyan-400">
            {isSpread ? <Columns className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{isSpread ? '3D DUAL-PAGE SPREAD' : 'SINGLE PAGE'}</span>
          </div>

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

      {/* Flipbook 3D Content Viewport */}
      <div className="relative flex-1 min-h-[540px] w-full overflow-hidden bg-black/60 border border-zinc-800/80 my-2 rounded-none shadow-2xl">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={pageIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50, rotateY: direction * 8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: direction * -50, rotateY: direction * -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full relative flex flex-col lg:flex-row"
            style={{ perspective: 1200 }}
          >
            {/* Left Page (or Single Page) */}
            <div className={`w-full ${isSpread ? 'lg:w-1/2' : 'w-full'} h-full relative group`}>
              {leftPageBlock && renderBlockComponent(leftPageBlock)}

              {/* Page-Curl Hover Corner (Top Left) */}
              <div
                onClick={prevPage}
                className="absolute top-0 left-0 w-10 h-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-auto"
                title="Previous Page Curl"
              >
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/40 to-transparent border-t-2 border-l-2 border-cyan-400 transform -rotate-45 shadow-md" />
              </div>
            </div>

            {/* Central Spine Shadow Gradient (Dual-Page Spread View) */}
            {isSpread && (
              <div
                className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 z-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent 15%, transparent 85%, rgba(0,0,0,0.6))'
                }}
              />
            )}

            {/* Right Page (Dual-Page Spread View) */}
            {isSpread && (
              <div className="w-full lg:w-1/2 h-full relative border-t lg:border-t-0 lg:border-l border-zinc-800/80 group">
                {rightPageBlock ? (
                  renderBlockComponent(rightPageBlock)
                ) : (
                  <div className="w-full h-full min-h-[500px] bg-[#0B0B0F] border border-zinc-800 p-8 flex items-center justify-center font-mono text-xs text-zinc-600 uppercase">
                    [ END OF MANUAL SPECIFICATION ]
                  </div>
                )}

                {/* Page-Curl Hover Corner (Top Right) */}
                <div
                  onClick={nextPage}
                  className="absolute top-0 right-0 w-10 h-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-auto"
                  title="Next Page Curl"
                >
                  <div className="w-full h-full bg-gradient-to-bl from-cyan-500/40 to-transparent border-t-2 border-r-2 border-cyan-400 transform rotate-45 shadow-md" />
                </div>
              </div>
            )}
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
          {isSpread ? (
            <span>
              PAGES <span className="text-cyan-400">{pageIndex + 1} - {Math.min(pageIndex + 2, totalPages)}</span> / {totalPages}
            </span>
          ) : (
            <span>
              PAGE <span className="text-cyan-400">{pageIndex + 1}</span> / {totalPages}
            </span>
          )}
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
            disabled={pageIndex >= totalPages - pageStep}
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
