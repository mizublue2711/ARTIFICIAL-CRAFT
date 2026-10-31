import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  FileText,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Smartphone,
  Tv,
} from 'lucide-react';
import { CameraMode, AspectRatioMode } from '../three/SceneController';

interface ControlDockProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  explodedProgress: number;
  onChangeExploded: (val: number) => void;
  cameraMode: CameraMode;
  onToggleCameraMode: (mode: CameraMode) => void;
  aspectRatio: AspectRatioMode;
  onToggleAspectRatio: (ratio: AspectRatioMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  onOpenDossier: () => void;
  onExportVideo: () => void;
  isExporting: boolean;
}

const ACTS = [
  { id: 0, title: 'Act 1: The Problem', start: 0, end: 6, label: '01' },
  { id: 1, title: 'Act 2: The Logic', start: 6, end: 12, label: '02' },
  { id: 2, title: 'Act 3: The Precision', start: 12, end: 18, label: '03' },
  { id: 3, title: 'Act 4: The Audit', start: 18, end: 24, label: '04' },
  { id: 4, title: 'Act 5: The CTA', start: 24, end: 30, label: '05' },
];

export const ControlDock: React.FC<ControlDockProps> = ({
  isCollapsed,
  onToggleCollapse,
  currentTime,
  totalTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  explodedProgress,
  onChangeExploded,
  cameraMode,
  onToggleCameraMode,
  aspectRatio,
  onToggleAspectRatio,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  onOpenDossier,
  onExportVideo,
  isExporting,
}) => {
  const currentAct = Math.min(4, Math.floor(currentTime / 6));

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`fixed z-40 transition-transform duration-300 ease-in-out pointer-events-auto`}
      style={{
        bottom: '20px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% + 20px)' : '0'})`,
        maxWidth: 'min(980px, 95vw)',
        width: '100%',
      }}
    >
      {/* Collapse / Expand Cinema Mode Tab */}
      <div className="flex justify-center -mb-[1px]">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#0b0e19] text-gray-300 hover:text-white border-t border-x border-[#1e253c] text-[11px] font-mono uppercase tracking-wider shadow-lg hover:bg-[#13192c] transition-colors"
          title="Toggle Cinema Mode (Hotkey: H)"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Show Controls [H]</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Cinema Mode [H]</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container - Solid high-contrast surface without backdrop-filter over WebGL */}
      <div className="bg-[#0b0e19] border border-[#1e253c] p-3 md:p-4 shadow-2xl text-xs font-mono">
        {/* Row 1: 30-Second Timeline Scrubber & 5 Act Bookmarks */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wider">{formatTime(currentTime)}</span>
              <span className="text-[#3c4664]">/</span>
              <span className="text-gray-400">{formatTime(totalTime)}</span>
              <span className="text-[#00E5FF] font-bold px-1.5 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                ACT 0{currentAct + 1}
              </span>
            </div>

            {/* Act Navigation Buttons */}
            <div className="flex items-center gap-1">
              {ACTS.map((act) => {
                const isActive = currentAct === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => onSeek(act.start)}
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider transition-colors border ${
                      isActive
                        ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                        : 'bg-[#101424] text-gray-400 border-[#1c243a] hover:text-white hover:border-[#2b3758]'
                    }`}
                    title={act.title}
                  >
                    {act.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Range Bar */}
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={totalTime}
              step={0.016}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#141a2e] rounded-none cursor-pointer appearance-none"
            />
          </div>

          {/* Act Bookmark Tick Labels */}
          <div className="flex justify-between text-[9px] text-[#4a5578] mt-1 px-1">
            <span>00:00 ACT 1</span>
            <span>00:06 ACT 2</span>
            <span>00:12 ACT 3</span>
            <span>00:18 ACT 4</span>
            <span>00:24 ACT 5</span>
            <span>00:30 END</span>
          </div>
        </div>

        {/* Row 2: Playback Controls, Exploded Slider, Camera, Aspect Ratio, Export */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#161c2e]">
          {/* Left: Play/Pause, Rewind, Speed Multipliers */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="flex items-center justify-center w-8 h-8 bg-[#00E5FF] hover:bg-[#3beaff] text-black font-bold transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => onSeek(0)}
              className="flex items-center justify-center w-8 h-8 bg-[#121626] hover:bg-[#1a2037] text-gray-300 border border-[#202842] transition-colors"
              title="Replay from Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback Speed Controls */}
            <div className="flex items-center border border-[#202842] bg-[#121626] overflow-hidden">
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-1 text-[10px] font-bold transition-colors ${
                    playbackSpeed === s
                      ? 'bg-[#5322FF] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#1a213a]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Center: Exploded View Slider */}
          <div className="flex items-center gap-2.5 px-3 py-1 bg-[#121626] border border-[#202842]">
            <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-[10px] uppercase text-gray-300 tracking-wider">
              Exploded: <strong className="text-[#00E5FF]">{(explodedProgress * 100).toFixed(0)}%</strong>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={explodedProgress}
              onChange={(e) => onChangeExploded(parseFloat(e.target.value))}
              className="w-24 md:w-32 h-1.5 bg-[#1b2238] rounded-none cursor-pointer appearance-none"
            />
          </div>

          {/* Right: Camera Mode, Aspect Ratio, Audio, Dossier, Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Camera Switch */}
            <div className="flex items-center border border-[#202842] bg-[#121626]">
              <button
                onClick={() => onToggleCameraMode('director')}
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold transition-colors ${
                  cameraMode === 'director'
                    ? 'bg-[#00E5FF] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a213a]'
                }`}
                title="Director Camera: Automated cinematic angles per act"
              >
                <Video className="w-3 h-3" />
                <span className="hidden sm:inline">Director</span>
              </button>
              <button
                onClick={() => onToggleCameraMode('orbit')}
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold transition-colors ${
                  cameraMode === 'orbit'
                    ? 'bg-[#00E5FF] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a213a]'
                }`}
                title="Orbit 3D: Free-roaming 3D view"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Orbit 3D</span>
              </button>
            </div>

            {/* Aspect Ratio Switch */}
            <div className="flex items-center border border-[#202842] bg-[#121626]">
              <button
                onClick={() => onToggleAspectRatio('16:9')}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
                  aspectRatio === '16:9'
                    ? 'bg-[#5322FF] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a213a]'
                }`}
                title="16:9 Widescreen (Web/TV)"
              >
                <Tv className="w-3 h-3" />
                <span>16:9</span>
              </button>
              <button
                onClick={() => onToggleAspectRatio('9:16')}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
                  aspectRatio === '9:16'
                    ? 'bg-[#5322FF] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a213a]'
                }`}
                title="9:16 Vertical (TikTok/Reels/Shorts)"
              >
                <Smartphone className="w-3 h-3" />
                <span>9:16</span>
              </button>
            </div>

            {/* Audio Mute & Volume */}
            <div className="flex items-center gap-1 px-2 py-1 bg-[#121626] border border-[#202842]">
              <button
                onClick={onToggleMute}
                className="text-gray-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-12 h-1.5 bg-[#1b2238] rounded-none cursor-pointer appearance-none"
              />
            </div>

            {/* Brand Dossier Button */}
            <button
              onClick={onOpenDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171d33] hover:bg-[#202947] text-white border border-[#273254] transition-colors"
              title="Access Brand Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden md:inline text-[10px] uppercase font-bold">Dossier</span>
            </button>

            {/* Export Video Button */}
            <button
              onClick={onExportVideo}
              disabled={isExporting}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 font-bold text-[10px] uppercase tracking-wider transition-all border ${
                isExporting
                  ? 'bg-amber-500 text-black border-amber-400 animate-pulse cursor-not-allowed'
                  : 'bg-[#00E5FF] hover:bg-[#35e9fc] text-black border-[#00E5FF] shadow-lg'
              }`}
              title="Export 60fps WebM video with synchronized synthesized audio"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Recording...' : 'Export Video (.webm)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
