import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ArtificialCraftScene } from '@/components/ArtificialCraftScene';
import { Film, Sparkles } from 'lucide-react';
import { UniversalComponentProps } from '@/types/preset';

export interface VideoShowcaseProps extends UniversalComponentProps {
  title?: string;
  subtitle?: string;
  videoDurationInFrames?: number;
  className?: string;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  title = 'ARTIFICIAL CRAFT // MOTION STUDIO',
  subtitle = 'Where Meticulous Graphic Design Meets Deterministic Remotion Engine',
  videoDurationInFrames = 180,
  className = '',
}) => {
  const [currentResolution, setCurrentResolution] = useState<'1080p' | '4k'>('1080p');
  const [isPlaying] = useState(true);

  const sceneProps = {
    title: 'ARTIFICIAL CRAFT',
    subtitle: 'Programmatic Motion Video Engine',
    mockupImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
    metrics: [
      { label: 'RENDER_ENGINE', value: 'Remotion 4.0' },
      { label: 'RESOLUTION', value: '1920x1080 60FPS' },
      { label: 'CODE_DRIVEN', value: '100% Deterministic' },
    ],
    ctaText: 'EXPLORE STUDIO',
  };

  return (
    <div className={`relative w-full border border-zinc-800 bg-[#07070e] font-mono ${className}`}>
      {/* Top Swiss Brutalist Header */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-zinc-800 bg-[#090913]">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
            60 FPS DUAL-RENDER
          </span>
          <button
            onClick={() => setCurrentResolution((r) => (r === '1080p' ? '4k' : '1080p'))}
            className="px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            RES: [{currentResolution}]
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        <Player
          component={ArtificialCraftScene}
          inputProps={sceneProps}
          durationInFrames={videoDurationInFrames}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={60}
          style={{ width: '100%', height: '100%' }}
          controls
          autoPlay={isPlaying}
          loop
        />

        {/* HUD Frame Overlay Watermark */}
        <div className="absolute bottom-2 left-2 pointer-events-none text-[9px] text-zinc-500 bg-black/60 px-2 py-0.5 border border-zinc-800/80">
          NODE 02 // REMOTION KINETIC STREAM
        </div>
      </div>

      {/* Bottom Subtitle Bar */}
      <div className="p-3 border-t border-zinc-800 bg-[#05050a] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{subtitle}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-zinc-500">FORMAT: MP4 / WEBM</span>
          <span className="text-[#00E5FF]">READY TO DISPATCH</span>
        </div>
      </div>
    </div>
  );
};

export default VideoShowcase;
