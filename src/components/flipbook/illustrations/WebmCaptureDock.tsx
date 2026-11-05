import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const WebmCaptureDock: React.FC<IllustrationProps> = ({ className = '' }) => {
  const [selectedSpeed, setSelectedSpeed] = useState<'0.5x' | '1.0x' | '1.5x' | '2.0x'>('1.0x');
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [fps] = useState<number>(60);
  const [bitrate] = useState<string>('12.4 Mbps');

  const speeds: Array<'0.5x' | '1.0x' | '1.5x' | '2.0x'> = ['0.5x', '1.0x', '1.5x', '2.0x'];

  return (
    <div
      className={`w-full h-full min-h-[220px] bg-[#09090B] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between select-none ${className}`}
    >
      {/* 1px Swiss CAD Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="dock-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dock-grid)" />
      </svg>

      {/* Top Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-none ${
              isRecording ? 'bg-red-500 animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span className="text-[#00E5FF] font-bold">WEBM_CAPTURE_DOCK // HEADLESS_STREAM</span>
        </div>
        <div className="flex items-center gap-2">
          {/* $0.00 Render Fee Badge */}
          <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 font-bold text-[9px] tracking-wider">
            RENDER_FEE: $0.00
          </span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[9px]">
            VP9 / OPUS
          </span>
        </div>
      </div>

      {/* Telemetry Stage & Wireframe Control Dock Preview */}
      <div className="flex-1 my-2 relative z-10 flex flex-col justify-center gap-2">
        {/* Upper Telemetry Readout Grid */}
        <div className="grid grid-cols-4 gap-2 text-[9px]">
          <div className="bg-[#12121A] border border-zinc-800/80 p-2 flex flex-col justify-between">
            <span className="text-zinc-500">CAPTURE_FPS</span>
            <span className="text-[#00E5FF] font-bold text-xs">{fps} FPS</span>
            <span className="text-[7.5px] text-zinc-500">CONSTANT_BITRATE</span>
          </div>
          <div className="bg-[#12121A] border border-zinc-800/80 p-2 flex flex-col justify-between">
            <span className="text-zinc-500">BUFFER_BITRATE</span>
            <span className="text-purple-400 font-bold text-xs">{bitrate}</span>
            <span className="text-[7.5px] text-zinc-500">LOSSLESS_ALPHA</span>
          </div>
          <div className="bg-[#12121A] border border-zinc-800/80 p-2 flex flex-col justify-between">
            <span className="text-zinc-500">TIME_CODE</span>
            <span className="text-emerald-400 font-bold text-xs">00:04:18:22</span>
            <span className="text-[7.5px] text-zinc-500">SMPTE_SYNC</span>
          </div>
          <div className="bg-[#12121A] border border-zinc-800/80 p-2 flex flex-col justify-between">
            <span className="text-zinc-500">CONTAINER</span>
            <span className="text-[#00E5FF] font-bold text-xs">.WEBM</span>
            <span className="text-[7.5px] text-zinc-500">HARDWARE_NVENC</span>
          </div>
        </div>

        {/* Sleek Bottom Control Dock Wireframe */}
        <div className="bg-[#0D0D14] border border-[#5322FF]/50 p-2.5 flex items-center justify-between gap-4">
          {/* Left: Rec / Pause Button Wireframe */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-1 text-[9px] font-bold tracking-wider border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isRecording
                  ? 'bg-red-950/60 border-red-500/80 text-red-400 hover:bg-red-900/60'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 ${isRecording ? 'bg-red-400' : 'bg-zinc-500'}`} />
              {isRecording ? 'CAPTURING' : 'STANDBY'}
            </button>
            <div className="hidden sm:flex flex-col text-[8px] text-zinc-500">
              <span>CANVAS: 1920x1080</span>
              <span className="text-[#00E5FF]">ALPHA_CHANNEL: TRANSPARENT</span>
            </div>
          </div>

          {/* Center: Audio Waveform / Stream Meter Wireframe */}
          <div className="flex-1 max-w-[140px] hidden md:flex items-center gap-0.5 h-4">
            {[40, 70, 90, 60, 30, 80, 100, 75, 45, 95, 85, 50, 65, 35].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-[#5322FF]"
                style={{
                  height: `${height}%`,
                  opacity: isRecording ? 0.4 + (height / 100) * 0.6 : 0.2
                }}
              />
            ))}
          </div>

          {/* Right: Speed Selectors (0.5x - 2.0x) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] text-zinc-400 hidden sm:inline">SPEED:</span>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 p-0.5">
              {speeds.map((spd) => {
                const isActive = selectedSpeed === spd;
                return (
                  <button
                    key={spd}
                    onClick={() => setSelectedSpeed(spd)}
                    className={`px-2 py-0.5 text-[8.5px] font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#00E5FF] text-black shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {spd}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>EXPORT: BROWSER_NATIVE_STREAM // ZERO_SERVER_COST</span>
        <span>WEBM_DOCK_v1.0</span>
      </div>
    </div>
  );
};
