import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, Box, RotateCw, ChevronDown, ChevronUp, Crosshair } from 'lucide-react';
import { sfx } from '../../utils/audio';

interface ExplodedControlDockProps {
  explodeProgress: number; // 0.0 to 1.0
  onExplodeChange: (value: number) => void;
  wireframeMode: boolean;
  onToggleWireframe: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  cameraPreset: 'isometric' | 'front' | 'side' | 'wrist_focus' | 'top';
  onSelectCameraPreset: (preset: 'isometric' | 'front' | 'side' | 'wrist_focus' | 'top') => void;
  laserTargetEnabled: boolean;
  onToggleLaserTarget: () => void;
}

export const ExplodedControlDock: React.FC<ExplodedControlDockProps> = ({
  explodeProgress,
  onExplodeChange,
  wireframeMode,
  onToggleWireframe,
  autoRotate,
  onToggleAutoRotate,
  cameraPreset,
  onSelectCameraPreset,
  laserTargetEnabled,
  onToggleLaserTarget,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const percent = Math.round(explodeProgress * 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) / 100;
    onExplodeChange(val);
    sfx.updateServoTone(Math.abs(val - explodeProgress) * 5);
  };

  const handleSliderEnd = () => {
    sfx.stopServoTone();
  };

  const handleQuickStage = (stageVal: number) => {
    onExplodeChange(stageVal);
    sfx.playTacticalClick(1600, 0.04);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sfx.setMuted(next);
  };

  // Determine active stage label
  let stageLabel = '0% ASSEMBLED STATE';
  if (percent > 80) {
    stageLabel = '100% 11-DOF DEXTEROUS HAND KINEMATICS';
  } else if (percent > 45) {
    stageLabel = '66% HARMONIC DRIVE MOTOR CORES';
  } else if (percent > 15) {
    stageLabel = '33% EXOSHELL DISASSEMBLY';
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4 pointer-events-none transition-transform duration-300">
      {/* Collapse Toggle Tab */}
      <div className="flex justify-center pointer-events-auto mb-1">
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            sfx.playTacticalClick(1400, 0.02);
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-black/90 border border-white/10 hover:border-[#00E5FF]/50 text-zinc-400 hover:text-white rounded-t-sm text-[11px] font-mono-cad transition-colors shadow-md"
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-[#00E5FF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" />}
          <span>{isCollapsed ? 'EXPAND TACTICAL DOCK' : 'COLLAPSE [ZEN / CINEMA]'}</span>
        </button>
      </div>

      {/* Main Solid Glass Control Dock (Zero Viewport Occlusion) */}
      <div
        className={`pointer-events-auto bg-[#09090B]/95 border border-white/15 rounded-sm p-3.5 shadow-2xl transition-all duration-300 ${
          isCollapsed ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Top Row: Exploded Slider Header & Stage Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono-cad text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF] font-semibold tracking-wide">EXPLODED MECHANICAL DISASSEMBLY</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300 text-[11px]">{stageLabel}</span>
          </div>
          <div className="text-[#00E5FF] font-bold text-sm bg-black/60 px-2.5 py-0.5 border border-[#00E5FF]/30 rounded-xs">
            {percent}% EXP
          </div>
        </div>

        {/* Precision Slider Bar */}
        <div className="relative flex items-center mb-3">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={percent}
            onChange={handleSliderChange}
            onPointerUp={handleSliderEnd}
            className="w-full h-2 bg-zinc-800 rounded-xs appearance-none cursor-pointer accent-[#00E5FF] focus:outline-none"
          />
        </div>

        {/* Quick Stage Snapping Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-3 font-mono-cad text-[10px]">
          <button
            onClick={() => handleQuickStage(0)}
            className={`py-1 px-2 border rounded-xs transition-colors text-left flex flex-col ${
              percent === 0
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span className="text-[9px] text-[#00E5FF]">0% READY</span>
            <span className="truncate">Assembled Idle</span>
          </button>
          <button
            onClick={() => handleQuickStage(0.33)}
            className={`py-1 px-2 border rounded-xs transition-colors text-left flex flex-col ${
              percent >= 30 && percent <= 45
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span className="text-[9px] text-[#00E5FF]">33% SHELL</span>
            <span className="truncate">Exoshell Deployed</span>
          </button>
          <button
            onClick={() => handleQuickStage(0.66)}
            className={`py-1 px-2 border rounded-xs transition-colors text-left flex flex-col ${
              percent >= 60 && percent <= 75
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span className="text-[9px] text-[#00E5FF]">66% HARMONIC</span>
            <span className="truncate">Motor Cores Detached</span>
          </button>
          <button
            onClick={() => handleQuickStage(1.0)}
            className={`py-1 px-2 border rounded-xs transition-colors text-left flex flex-col ${
              percent >= 90
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <span className="text-[9px] text-[#00E5FF]">100% HAND</span>
            <span className="truncate">11-DOF Kinematics</span>
          </button>
        </div>

        {/* Bottom Utility Row: Camera Angles, Wireframe, Laser, Mute */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 font-mono-cad text-[11px]">
          {/* Camera View Angle Pills */}
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 text-[10px] mr-1 hidden sm:inline">VIEW:</span>
            {(['isometric', 'front', 'side', 'wrist_focus', 'top'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  onSelectCameraPreset(preset);
                  sfx.playTacticalClick(2000, 0.02);
                }}
                className={`px-2 py-0.5 border rounded-xs transition-colors uppercase text-[10px] ${
                  cameraPreset === preset
                    ? 'bg-[#5322FF]/30 border-[#5322FF] text-[#00E5FF]'
                    : 'bg-black/30 border-white/10 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {preset.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Toggle Actions */}
          <div className="flex items-center gap-2">
            {/* Laser Target Beam Toggle */}
            <button
              onClick={() => {
                onToggleLaserTarget();
                sfx.playTacticalClick(1900, 0.02);
              }}
              title="Toggle 1px Laser Target Beam"
              className={`flex items-center gap-1 px-2 py-0.5 border rounded-xs text-[10px] transition-colors ${
                laserTargetEnabled
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-black/30 border-white/10 text-zinc-400'
              }`}
            >
              <Crosshair className="w-3 h-3" />
              <span className="hidden md:inline">LASER</span>
            </button>

            {/* Wireframe CAD Mode */}
            <button
              onClick={() => {
                onToggleWireframe();
                sfx.playTacticalClick(1800, 0.02);
              }}
              title="Toggle Wireframe CAD Mode"
              className={`flex items-center gap-1 px-2 py-0.5 border rounded-xs text-[10px] transition-colors ${
                wireframeMode
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-black/30 border-white/10 text-zinc-400'
              }`}
            >
              <Box className="w-3 h-3" />
              <span className="hidden md:inline">WIREFRAME</span>
            </button>

            {/* Auto-Rotation */}
            <button
              onClick={() => {
                onToggleAutoRotate();
                sfx.playTacticalClick(1700, 0.02);
              }}
              title="Toggle Auto Orbit"
              className={`flex items-center gap-1 px-2 py-0.5 border rounded-xs text-[10px] transition-colors ${
                autoRotate
                  ? 'bg-[#5322FF]/30 border-[#5322FF] text-[#00E5FF]'
                  : 'bg-black/30 border-white/10 text-zinc-400'
              }`}
            >
              <RotateCw className="w-3 h-3" />
              <span className="hidden md:inline">ORBIT</span>
            </button>

            {/* Procedural Audio Mute */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Tactical Audio'}
              className="p-1 border border-white/10 bg-black/30 text-zinc-400 hover:text-white rounded-xs transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
