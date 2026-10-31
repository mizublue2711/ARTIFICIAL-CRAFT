import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneController, CameraMode, AspectRatioMode } from '@/core/monolith-engine/src/three/SceneController';
import { SynthesizerEngine } from '@/core/monolith-engine/src/audio/Synthesizer';
import { VideoExporter, ExportProgress } from '@/core/monolith-engine/src/utils/videoRecorder';
import { ControlDock } from '@/core/monolith-engine/src/components/ControlDock';
import { ViewportOverlay } from '@/core/monolith-engine/src/components/ViewportOverlay';
import { BrandDossierModal } from '@/core/monolith-engine/src/components/BrandDossierModal';
import { Sliders, Minimize2, Play, Pause, RotateCcw } from 'lucide-react';
import { UniversalComponentProps } from '@/types/preset';

export interface Monolith3DNodeProps extends UniversalComponentProps {
  mode?: 'compact' | 'studio';
  height?: string | number;
  className?: string;
  autoPulseSpeed?: number;
}

export const Monolith3DNode: React.FC<Monolith3DNodeProps> = ({
  mode = 'compact',
  speed = 1.0,
  autoPulseSpeed = 1.0,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneControllerRef = useRef<SceneController | null>(null);
  const synthRef = useRef<SynthesizerEngine | null>(null);
  const exporterRef = useRef<VideoExporter | null>(null);

  // High-frequency animation refs
  const timeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const playbackSpeedRef = useRef<number>(speed || autoPulseSpeed || 1.0);

  // Studio & Compact State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(speed || autoPulseSpeed || 1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentAct, setCurrentAct] = useState<number>(0);
  const [frameTick, setFrameTick] = useState<number>(0);
  const [explodedProgress, setExplodedProgress] = useState<number>(0.0);
  const [cameraMode, setCameraMode] = useState<CameraMode>('director');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('16:9');
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true); // default muted in compact/web embedding
  const [volume, setVolume] = useState<number>(0.75);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  // Compact Mode Collapsible HUD state
  const [isHudOpen, setIsHudOpen] = useState<boolean>(false);

  // Sync state to mutable refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  // Initialize Three.js Scene and Synth with proper cleanup on unmount
  useEffect(() => {
    if (!mountRef.current) return;

    let isDisposed = false;
    const synth = new SynthesizerEngine();
    synthRef.current = synth;
    if (isMuted) {
      synth.setMuted(true);
    }
    const exporter = new VideoExporter();
    exporterRef.current = exporter;

    const controller = new SceneController(mountRef.current);
    sceneControllerRef.current = controller;

    controller.onTimeTick = (timeSec, frame, act) => {
      if (isDisposed) return;
      setFrameTick(frame);
      setCurrentAct(act);
      if (!isMuted) {
        synth.update(timeSec, isPlayingRef.current);
      }
    };

    controller.startAnimationLoop(() => {
      if (isDisposed) {
        return {
          time: 0,
          isPlaying: false,
          speed: 0,
        };
      }
      if (isPlayingRef.current) {
        const delta = (1 / 60) * playbackSpeedRef.current;
        timeRef.current += delta;
        if (timeRef.current >= 30.0) {
          timeRef.current = 0;
        }
        setCurrentTime(timeRef.current);
      }
      return {
        time: timeRef.current,
        isPlaying: isPlayingRef.current,
        speed: playbackSpeedRef.current,
      };
    });

    const handleResize = () => {
      if (!isDisposed && controller) {
        controller.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      if (exporterRef.current) {
        exporterRef.current.cancelExport();
      }
      if (controller) {
        controller.dispose();
      }
      if (synth) {
        synth.dispose();
      }
      sceneControllerRef.current = null;
      synthRef.current = null;
      exporterRef.current = null;
    };
  }, []);

  const handleExplodedChange = useCallback((val: number) => {
    setExplodedProgress(val);
    if (sceneControllerRef.current) {
      sceneControllerRef.current.monolith.setExplodedProgress(val);
    }
  }, []);

  const handleSeek = useCallback((newTime: number) => {
    timeRef.current = Math.max(0, Math.min(30, newTime));
    setCurrentTime(timeRef.current);
    const act = Math.min(4, Math.floor(timeRef.current / 6));
    setCurrentAct(act);

    if (sceneControllerRef.current) {
      sceneControllerRef.current.step(timeRef.current, 0.01666);
    }
    if (synthRef.current && !isMuted) {
      synthRef.current.update(timeRef.current, isPlayingRef.current);
    }
  }, [isMuted]);

  const handleToggleCamera = useCallback((cam: CameraMode) => {
    setCameraMode(cam);
    if (sceneControllerRef.current) {
      sceneControllerRef.current.setCameraMode(cam);
    }
  }, []);

  const handleToggleAspectRatio = useCallback((ratio: AspectRatioMode) => {
    setAspectRatio(ratio);
    if (sceneControllerRef.current) {
      sceneControllerRef.current.setAspectRatioMode(ratio);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (synthRef.current) synthRef.current.setMuted(next);
      return next;
    });
  }, []);

  const handleChangeVolume = useCallback((val: number) => {
    setVolume(val);
    if (synthRef.current) synthRef.current.setVolume(val);
  }, []);

  const handleExportVideo = useCallback(async () => {
    if (!sceneControllerRef.current || !exporterRef.current || !synthRef.current) return;
    const wasPlaying = isPlaying;
    setIsPlaying(false);

    try {
      const audioTrack = synthRef.current.getAudioStreamTrack();
      const canvas = sceneControllerRef.current.canvas;

      await exporterRef.current.exportTimelineVideo(
        canvas,
        audioTrack,
        30,
        (prog) => setExportProgress(prog),
        (sec) => {
          if (sceneControllerRef.current) {
            sceneControllerRef.current.step(sec, 0.01666);
          }
          if (synthRef.current) {
            synthRef.current.update(sec, true);
          }
          setCurrentTime(sec);
        }
      );
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExportProgress(null);
      if (wasPlaying) setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleCancelExport = useCallback(() => {
    if (exporterRef.current) {
      exporterRef.current.cancelExport();
      setExportProgress(null);
    }
  }, []);

  // MODE: COMPACT (Optimized for Hero Background or embedded previews)
  if (mode === 'compact') {
    return (
      <div className={`relative w-full h-full min-h-[300px] overflow-hidden bg-[#04050a] ${className}`}>
        {/* Three.js 60fps Live Procedural WebGL Canvas */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Minimal Swiss HUD Corner Telemetry Overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-zinc-800 text-[10px] font-mono tracking-widest text-[#00E5FF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-ping" />
          <span>MONOLITH_3D // 60FPS AMBIENT</span>
        </div>

        {/* Collapsible Swiss Brutalist HUD Drawer */}
        <div className="absolute bottom-3 right-3 z-20 font-mono text-xs">
          {!isHudOpen ? (
            <button
              onClick={() => setIsHudOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#09090b]/90 hover:bg-black border border-[#00E5FF] text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.25)] transition uppercase font-bold text-[11px]"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>[ 🎛️ Adjust Node Parameters ]</span>
            </button>
          ) : (
            <div className="w-72 bg-[#080810]/95 border border-[#00E5FF] p-3 shadow-2xl backdrop-blur-md flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[#00E5FF] font-bold uppercase text-[11px] tracking-wider">
                  NODE 01 PARAMETRICS
                </span>
                <button
                  onClick={() => setIsHudOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Play / Pause / Reset Ambient Stream */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1 border border-zinc-700 bg-zinc-900 text-zinc-200 text-[10px] hover:border-[#00E5FF] uppercase"
                >
                  {isPlaying ? <Pause className="w-3 h-3 text-[#00E5FF]" /> : <Play className="w-3 h-3 text-[#00E5FF]" />}
                  <span>{isPlaying ? 'PAUSE' : 'PULSE'}</span>
                </button>
                <button
                  onClick={() => handleSeek(0)}
                  className="px-2 py-1 border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-[10px]"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>PULSE VELOCITY</span>
                  <span className="text-[#00E5FF] font-bold">{playbackSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#00E5FF] cursor-pointer h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Exploded Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>EXPLODED MESH</span>
                  <span className="text-[#00E5FF] font-bold">{(explodedProgress * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedProgress}
                  onChange={(e) => handleExplodedChange(parseFloat(e.target.value))}
                  className="w-full accent-[#00E5FF] cursor-pointer h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Camera Mode Toggle */}
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-800">
                <span className="text-zinc-400">CAMERA MODE:</span>
                <button
                  onClick={() => handleToggleCamera(cameraMode === 'director' ? 'orbit' : 'director')}
                  className="text-[#00E5FF] uppercase font-bold hover:underline"
                >
                  [{cameraMode}]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MODE: STUDIO (Full Control Matrix & Telemetry Console)
  return (
    <div className={`relative w-full h-full min-h-[600px] overflow-hidden bg-[#04050a] flex flex-col ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Viewport Overlay */}
      <ViewportOverlay
        currentTime={currentTime}
        currentAct={currentAct}
        frame={frameTick}
        aspectRatio={aspectRatio}
        exportProgress={exportProgress}
        onCancelExport={handleCancelExport}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* Control Dock */}
      <ControlDock
        isCollapsed={isCinemaMode}
        onToggleCollapse={() => setIsCinemaMode((prev) => !prev)}
        currentTime={currentTime}
        totalTime={30.0}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (!isPlaying && synthRef.current) {
            synthRef.current.start();
          }
          setIsPlaying((prev) => !prev);
        }}
        onSeek={handleSeek}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={(s) => setPlaybackSpeed(s)}
        explodedProgress={explodedProgress}
        onChangeExploded={handleExplodedChange}
        cameraMode={cameraMode}
        onToggleCameraMode={handleToggleCamera}
        aspectRatio={aspectRatio}
        onToggleAspectRatio={handleToggleAspectRatio}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        volume={volume}
        onChangeVolume={handleChangeVolume}
        onOpenDossier={() => setIsDossierOpen(true)}
        onExportVideo={handleExportVideo}
        isExporting={exportProgress?.isRecording || false}
      />

      {/* Dossier Modal */}
      <BrandDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  );
};

export default Monolith3DNode;
