import React, { useEffect, useState } from 'react';
import { Film, CheckCircle2, Download, AlertTriangle, Loader2, X } from 'lucide-react';
import { usePlaygroundStore } from '@/lib/video-engine/store/usePlaygroundStore';

export interface RenderProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenderProgressModal: React.FC<RenderProgressModalProps> = ({ isOpen, onClose }) => {
  const recipe = usePlaygroundStore((state) => state.recipe);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPhase(1);
      setProgress(0);
      setDownloadUrl('');
      setErrorMsg(null);
      return;
    }

    let isSubscribed = true;

    const startRenderProcess = async () => {
      try {
        setPhase(1);
        setProgress(10);

        // Call the Serverless Render API
        const response = await fetch('/api/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipe }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.errors?.join(', ') || data?.error || 'Failed to trigger render');
        }

        if (!isSubscribed) return;

        // Phase 1 -> Phase 2: Bundled successfully, now rendering frames
        setPhase(2);
        const totalFrames = data.durationInFrames || recipe.timing.durationInFrames || 180;
        setDownloadUrl(data.downloadUrl || '/renders/output.mp4');

        // Simulate frame progress 0% -> 100% over rendering duration
        let currentFrame = 0;
        const interval = setInterval(() => {
          if (!isSubscribed) {
            clearInterval(interval);
            return;
          }
          currentFrame += 6;
          const pct = Math.min(Math.round((currentFrame / totalFrames) * 100), 100);
          setProgress(pct);

          if (pct >= 100) {
            clearInterval(interval);
            setPhase(3);
          }
        }, 120);
      } catch (err) {
        if (isSubscribed) {
          setErrorMsg(err instanceof Error ? err.message : 'Render failed');
        }
      }
    };

    startRenderProcess();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, recipe]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    // Trigger download or create blob link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `artificial-craft-render-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#0c0c14] border border-cyan-500/40 rounded-xl p-6 shadow-2xl shadow-cyan-500/20 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="font-mono text-base font-bold text-cyan-400 tracking-wider uppercase">
              SERVERLESS MP4 RENDER PIPELINE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Body */}
        <div className="my-6 space-y-6">
          {errorMsg ? (
            <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-lg text-red-400 font-mono text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold uppercase tracking-wider mb-1">Render Error</div>
                <div>{errorMsg}</div>
              </div>
            </div>
          ) : (
            <>
              {/* Phase Indicators */}
              <div className="space-y-3 font-mono text-xs">
                {/* Phase 1 */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  phase === 1 ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-[#12121e] border-zinc-800 text-zinc-400'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {phase === 1 ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    <span>[1/3] Bundling Remotion Lego Orchestrator...</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">WEBPACK/VITE</span>
                </div>

                {/* Phase 2 */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  phase === 2 ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : phase === 3 ? 'bg-[#12121e] border-zinc-800 text-zinc-300' : 'bg-[#12121e] border-zinc-800/50 text-zinc-600'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {phase === 2 ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : phase === 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-zinc-700" />}
                    <span>[2/3] Rendering {recipe.timing.durationInFrames} Frames @ {recipe.timing.fps}FPS...</span>
                  </div>
                  <span className="font-bold text-cyan-400">{phase >= 2 ? `${progress}%` : '0%'}</span>
                </div>

                {/* Phase 3 */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  phase === 3 ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-[#12121e] border-zinc-800/50 text-zinc-600'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {phase === 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-zinc-700" />}
                    <span>[3/3] Export Complete! Ready for download.</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">H.264 MP4</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                  <span>RENDER PROGRESS</span>
                  <span className="text-cyan-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer / Action */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="font-mono text-[11px] text-zinc-500">
            {recipe.timing.width}x{recipe.timing.height} • 60FPS
          </div>
          {phase === 3 && downloadUrl ? (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold rounded-lg transition shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              Download MP4
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs rounded-lg transition"
            >
              {phase === 3 ? 'Close' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
