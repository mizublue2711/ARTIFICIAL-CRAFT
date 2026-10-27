import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Camera,
  Layers,
  Tv,
  Power,
  Volume2,
  VolumeX,
  Maximize2,
  Sliders,
  Radio,
  Eye,
} from 'lucide-react';
import { soundEffects } from '@/lib/soundEffects';

export type CameraPreset = 'none' | 'preset1' | 'preset2' | 'preset3';

export interface VideoCinematicControllerProps {
  onStateChange?: (state: {
    isRecordingMode: boolean;
    activePreset: CameraPreset;
    isExploded: boolean;
    crtEnabled: boolean;
    powerOn: boolean;
  }) => void;
}

export default function VideoCinematicController({ onStateChange }: VideoCinematicControllerProps) {
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [activePreset, setActivePreset] = useState<CameraPreset>('none');
  const [isExploded, setIsExploded] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [powerOn, setPowerOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  // Timer counter for recording HUD
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecordingMode) {
      interval = setInterval(() => {
        setRecSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingMode]);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Recording Mode
  const toggleRecordingMode = useCallback(() => {
    setIsRecordingMode((prev) => {
      const next = !prev;
      soundEffects.playGlitchSound();
      if (next) {
        setIsExploded(true);
        setActivePreset('preset1');
      } else {
        setIsExploded(false);
        setActivePreset('none');
        soundEffects.playDroneSound(false);
      }
      return next;
    });
  }, []);

  // Hotkey Shift + V listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in inputs
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        toggleRecordingMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleRecordingMode]);

  // Notify parent component & apply body state classes
  useEffect(() => {
    onStateChange?.({
      isRecordingMode,
      activePreset,
      isExploded,
      crtEnabled,
      powerOn,
    });

    const body = document.body;
    body.dataset.recording = isRecordingMode ? 'true' : 'false';
    body.dataset.preset = activePreset;
    body.dataset.exploded = isExploded ? 'true' : 'false';
    body.dataset.crt = crtEnabled ? 'true' : 'false';
    body.dataset.power = powerOn ? 'true' : 'false';
  }, [isRecordingMode, activePreset, isExploded, crtEnabled, powerOn, onStateChange]);

  // Handle Preset Changes
  const handleSelectPreset = (preset: CameraPreset) => {
    soundEffects.playCameraSound();
    setActivePreset(preset);

    if (preset === 'preset1') {
      setIsExploded(true);
      soundEffects.playDroneSound(false);
    } else if (preset === 'preset2') {
      setIsExploded(true);
      soundEffects.playDroneSound(true);
      // Smooth scroll toward Plug & Play Sandbox section if present
      const sandboxEl = document.getElementById('playground');
      if (sandboxEl) {
        sandboxEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (preset === 'preset3') {
      setIsExploded(false);
      soundEffects.playDroneSound(false);
      soundEffects.playGlitchSound();
    } else {
      setIsExploded(false);
      soundEffects.playDroneSound(false);
    }
  };

  // Toggle Power state
  const handleTogglePower = () => {
    const nextPower = !powerOn;
    soundEffects.playPowerSound(nextPower);
    setPowerOn(nextPower);
  };

  // Toggle Audio Mute
  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* CRT Overlay Shader */}
      {crtEnabled && powerOn && (
        <div className="crt-overlay pointer-events-none fixed inset-0 z-[9990] overflow-hidden">
          {/* Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          {/* Vignette Shadow */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />
        </div>
      )}

      {/* CRT Power Off Overlay Effect */}
      {!powerOn && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-auto">
          <div className="text-center font-mono">
            <div className="text-xs text-zinc-600 uppercase tracking-widest mb-2">SYSTEM STANDBY</div>
            <button
              onClick={handleTogglePower}
              className="inline-flex items-center gap-2 border border-[#00E5FF] bg-zinc-950 px-4 py-2 text-xs font-bold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all"
            >
              <Power className="h-4 w-4" />
              <span>POWER ON DISPLAY</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle HUD Launcher Button when not recording */}
      {!isRecordingMode && powerOn && (
        <div className="fixed bottom-6 right-6 z-[9980]">
          <button
            onClick={toggleRecordingMode}
            className="group relative flex items-center gap-2 border border-zinc-800 bg-zinc-950/90 px-3.5 py-2 font-mono text-xs text-zinc-300 backdrop-blur-md hover:border-[#00E5FF] hover:text-white transition-all shadow-xl"
            title="Toggle 3D Cinematic Recording Mode (Shift + V)"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            <Video className="h-4 w-4 text-[#00E5FF]" />
            <span className="font-bold">3D REC MODE</span>
            <span className="text-[10px] text-zinc-500 border border-zinc-800 px-1 py-0.5 ml-1">SHIFT+V</span>
          </button>
        </div>
      )}

      {/* Full Cinematic HUD Overlay when RECORDING_MODE is active */}
      <AnimatePresence>
        {isRecordingMode && powerOn && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 inset-x-0 z-[9985] pointer-events-none p-4"
          >
            <div className="mx-auto max-w-6xl border border-zinc-800 bg-zinc-950/90 p-3 backdrop-blur-xl shadow-2xl pointer-events-auto font-mono text-xs text-zinc-300">
              {/* Top Row: Recording Status & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-2.5 mb-2.5">
                {/* Left: Recording Indicator */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-800/60 px-2.5 py-1 text-red-400 font-bold">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span>REC</span>
                    <span className="text-white font-mono ml-1">{formatTime(recSeconds)}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[11px]">
                    <span className="text-zinc-600">VIEWPORT:</span>
                    <span className="text-[#00E5FF] font-semibold">1200px 3D PERSPECTIVE</span>
                  </div>
                </div>

                {/* Right: Sound & Mode Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMute}
                    className={`p-1.5 border transition-colors ${
                      isMuted
                        ? 'border-red-800 bg-red-950/50 text-red-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                    }`}
                    title={isMuted ? 'Unmute Audio Synthesizer' : 'Mute Audio Synthesizer'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#00E5FF]" />}
                  </button>

                  <button
                    onClick={() => setCrtEnabled(!crtEnabled)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-semibold transition-colors ${
                      crtEnabled
                        ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Tv className="h-3.5 w-3.5" />
                    <span>CRT OVERLAY</span>
                  </button>

                  <button
                    onClick={handleTogglePower}
                    className="flex items-center gap-1 px-2.5 py-1 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-red-400 hover:border-red-800 transition-colors text-[11px]"
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>PWR</span>
                  </button>

                  <button
                    onClick={toggleRecordingMode}
                    className="flex items-center gap-1.5 border border-red-600 bg-red-600 text-black px-3 py-1 font-bold hover:bg-red-500 transition-colors text-[11px]"
                  >
                    <span>STOP REC</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Camera Presets & Layer Explosion Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-1 mr-1">
                    <Camera className="h-3.5 w-3.5 text-[#00E5FF]" /> PRESETS:
                  </span>

                  <button
                    onClick={() => handleSelectPreset('preset1')}
                    className={`px-2.5 py-1 border text-[11px] font-bold transition-all ${
                      activePreset === 'preset1'
                        ? 'border-[#00E5FF] bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    01: 3D EXPLODED INTRO (35°)
                  </button>

                  <button
                    onClick={() => handleSelectPreset('preset2')}
                    className={`px-2.5 py-1 border text-[11px] font-bold transition-all ${
                      activePreset === 'preset2'
                        ? 'border-[#00E5FF] bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    02: 45° FPV DRONE FLYBY
                  </button>

                  <button
                    onClick={() => handleSelectPreset('preset3')}
                    className={`px-2.5 py-1 border text-[11px] font-bold transition-all ${
                      activePreset === 'preset3'
                        ? 'border-[#00E5FF] bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    03: MACRO CODE-TO-UI REVEAL
                  </button>
                </div>

                {/* Explode Toggle & Reset */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEffects.playGlitchSound();
                      setIsExploded(!isExploded);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 border text-[11px] font-bold transition-colors ${
                      isExploded
                        ? 'border-[#5322ff] bg-[#5322ff] text-white shadow-[0_0_12px_rgba(83,34,255,0.5)]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>EXPLODE Z-LAYERS</span>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('none')}
                    className="px-2.5 py-1 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors text-[11px]"
                  >
                    RESET VIEW
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
