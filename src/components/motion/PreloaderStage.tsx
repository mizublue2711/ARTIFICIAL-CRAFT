import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const PRELOADER_STORAGE_KEY = 'ac_preloader_complete';

const TELEMETRY_STAGES = [
  '[ 01 // 03 ] INITIALIZING GPU SHADER AST...',
  '[ 02 // 03 ] MOUNTING CLIENT-SIDE RUNTIME...',
  '[ 03 // 03 ] ALL SYSTEMS NOMINAL // 60 FPS',
] as const;

export interface PreloaderStageProps {
  onComplete?: () => void;
}

export const PreloaderStage: React.FC<PreloaderStageProps> = ({ onComplete }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return window.sessionStorage.getItem(PRELOADER_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const completedRef = useRef<boolean>(false);

  const notifyComplete = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  useEffect(() => {
    if (isDismissed) {
      notifyComplete();
      return;
    }

    let rafId = 0;
    let exitTimerId: number | undefined;
    let assetsReady = document.readyState === 'complete';
    const startTime = performance.now();
    const minDurationMs = 1250;
    const maxAssetWaitMs = 2000;

    const handleWindowLoad = () => {
      assetsReady = true;
    };

    if (!assetsReady) {
      window.addEventListener('load', handleWindowLoad, { once: true });
    }

    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      document.fonts.ready.then(() => {
        if (document.readyState === 'complete') {
          assetsReady = true;
        }
      });
    }

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const linearT = Math.min(elapsed / minDurationMs, 1);
      // Fast start, crisp finish easing
      const easedT = 1 - Math.pow(1 - linearT, 2.4);
      const canFinish = assetsReady || elapsed >= maxAssetWaitMs;

      if (linearT < 1 || !canFinish) {
        const nextVal = Math.min(canFinish ? 100 : 99, Math.floor(easedT * 100));
        setProgress(nextVal);
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        exitTimerId = window.setTimeout(() => {
          setIsExiting(true);
          notifyComplete();
        }, 160);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (exitTimerId !== undefined) {
        window.clearTimeout(exitTimerId);
      }
      window.removeEventListener('load', handleWindowLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDismissed]);

  if (isDismissed) {
    return null;
  }

  const tickerIndex = progress < 38 ? 0 : progress < 78 ? 1 : 2;
  const formattedProgress = String(progress).padStart(3, '0');

  return (
    <motion.div
      data-testid="preloader-stage"
      initial={{ y: '0%' }}
      animate={isExiting ? { y: '-100%' } : { y: '0%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (isExiting) {
          try {
            window.sessionStorage.setItem(PRELOADER_STORAGE_KEY, '1');
          } catch {
            // Ignore storage errors in restricted contexts
          }
          setIsDismissed(true);
        }
      }}
      className={`fixed inset-0 z-[100] bg-[#05050A] flex flex-col justify-between p-8 sm:p-12 border-b border-[#00E5FF]/30 select-none ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Top Telemetry Bar */}
      <div className="flex items-center justify-between border-b border-[#1F1F23] pb-4 font-mono text-[11px] sm:text-xs tracking-widest uppercase text-zinc-400">
        <div className="flex items-center gap-2.5 text-[#00E5FF]">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span>ARTIFICIAL_CRAFT // BOOT_SEQ</span>
        </div>
        <span className="hidden sm:inline text-zinc-500">
          DETERMINISTIC_CLIENT_RUNTIME
        </span>
      </div>

      {/* Center Telemetry Counter */}
      <div className="flex flex-col items-start gap-6 my-auto">
        <div className="flex items-baseline gap-2">
          <span
            data-testid="preloader-counter"
            className="font-mono tabular-nums tracking-widest text-6xl sm:text-8xl lg:text-9xl font-black text-white leading-none"
          >
            {formattedProgress}
          </span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#00E5FF] tracking-widest">
            %
          </span>
        </div>

        {/* Hairline Progress Track */}
        <div className="w-full max-w-2xl h-[2px] bg-[#1F1F23] overflow-hidden">
          <div
            className="h-full bg-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.6)] transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Hardware Telemetry Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#1F1F23] pt-4 font-mono text-[11px] sm:text-xs tracking-widest uppercase">
        <span
          data-testid="preloader-ticker"
          className="text-[#00E5FF]"
        >
          {TELEMETRY_STAGES[tickerIndex]}
        </span>
        <span className="text-zinc-500">
          STAGE: {progress < 100 ? 'CALIBRATING' : 'SHUTTER_RELEASE'}
        </span>
      </div>
    </motion.div>
  );
};

export default PreloaderStage;
