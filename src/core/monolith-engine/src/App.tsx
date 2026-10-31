import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneController, CameraMode, AspectRatioMode } from './three/SceneController';
import { SynthesizerEngine } from './audio/Synthesizer';
import { VideoExporter, ExportProgress } from './utils/videoRecorder';
import { ControlDock } from './components/ControlDock';
import { ViewportOverlay } from './components/ViewportOverlay';
import { BrandDossierModal } from './components/BrandDossierModal';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneControllerRef = useRef<SceneController | null>(null);
  const synthRef = useRef<SynthesizerEngine | null>(null);
  const exporterRef = useRef<VideoExporter | null>(null);

  // Timeline & Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentAct, setCurrentAct] = useState<number>(0);
  const [frameTick, setFrameTick] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Monolith controls
  const [explodedProgress, setExplodedProgress] = useState<number>(0.0);
  const [cameraMode, setCameraMode] = useState<CameraMode>('director');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('16:9');

  // UI state
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);

  // Video Export state
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  // Mutable refs for high-frequency animation loop
  const timeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const playbackSpeedRef = useRef<number>(1.0);

  // Sync state to refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  // Initialize Three.js Scene and Web Audio Synthesizer once
  useEffect(() => {
    if (!mountRef.current) return;

    const synth = new SynthesizerEngine();
    synthRef.current = synth;
    exporterRef.current = new VideoExporter();

    const controller = new SceneController(mountRef.current);
    sceneControllerRef.current = controller;

    // Timeline tick callback
    controller.onTimeTick = (timeSec, frame, act) => {
      setFrameTick(frame);
      setCurrentAct(act);
      synth.update(timeSec, isPlayingRef.current);
    };

    // Start 60fps deterministic render loop
    controller.startAnimationLoop(() => {
      if (isPlayingRef.current) {
        // Advance time by 1 frame (1/60s) scaled by speed
        const delta = (1 / 60) * playbackSpeedRef.current;
        timeRef.current += delta;
        if (timeRef.current >= 30.0) {
          timeRef.current = 0; // Loop 30-second sequence
        }
        setCurrentTime(timeRef.current);
      }
      return {
        time: timeRef.current,
        isPlaying: isPlayingRef.current,
        speed: playbackSpeedRef.current,
      };
    });

    // Window resize handler
    const handleResize = () => {
      controller.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cinema Mode hotkey 'H'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsCinemaMode((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      controller.dispose();
      synth.dispose();
    };
  }, []);

  // Update exploded view on monolith model
  const handleExplodedChange = useCallback((val: number) => {
    setExplodedProgress(val);
    if (sceneControllerRef.current) {
      sceneControllerRef.current.monolith.setExplodedProgress(val);
    }
  }, []);

  // Seek timeline directly
  const handleSeek = useCallback((newTime: number) => {
    timeRef.current = Math.max(0, Math.min(30, newTime));
    setCurrentTime(timeRef.current);
    const act = Math.min(4, Math.floor(timeRef.current / 6));
    setCurrentAct(act);

    if (sceneControllerRef.current) {
      sceneControllerRef.current.step(timeRef.current, 0.01666);
    }
    if (synthRef.current) {
      synthRef.current.update(timeRef.current, isPlayingRef.current);
    }
  }, []);

  // Camera toggle
  const handleToggleCamera = useCallback((mode: CameraMode) => {
    setCameraMode(mode);
    if (sceneControllerRef.current) {
      sceneControllerRef.current.setCameraMode(mode);
    }
  }, []);

  // Aspect ratio toggle
  const handleToggleAspectRatio = useCallback((ratio: AspectRatioMode) => {
    setAspectRatio(ratio);
    if (sceneControllerRef.current) {
      sceneControllerRef.current.setAspectRatioMode(ratio);
    }
  }, []);

  // Audio controls
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

  // Export 60fps Video with Synthesized Audio
  const handleExportVideo = useCallback(async () => {
    if (!sceneControllerRef.current || !exporterRef.current || !synthRef.current) return;

    // Pause live playback during export
    const wasPlaying = isPlaying;
    setIsPlaying(false);

    try {
      const audioTrack = synthRef.current.getAudioStreamTrack();
      const canvas = sceneControllerRef.current.canvas;

      await exporterRef.current.exportTimelineVideo(
        canvas,
        audioTrack,
        30, // 30-second sequence
        (prog) => setExportProgress(prog),
        (sec) => {
          // Render each frame step
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#04050a]">
      {/* 1. 3D WebGL Canvas Container (Stable mounting outside React HUD re-renders) */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 2. Viewport HUD Overlay (CAD Crosshairs, Act Specs, 9:16 safe framing) */}
      <ViewportOverlay
        currentTime={currentTime}
        currentAct={currentAct}
        frame={frameTick}
        aspectRatio={aspectRatio}
        exportProgress={exportProgress}
        onCancelExport={handleCancelExport}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 3. Collapsible Bottom Control Dock (<= 15% viewport footprint, solid dark surface) */}
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

      {/* 4. Brand Dossier Modal */}
      <BrandDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  );
}
