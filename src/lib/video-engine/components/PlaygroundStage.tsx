import React, { useRef, useState, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { usePlaygroundStore } from '../store/usePlaygroundStore';
import LegoVideoOrchestrator from './LegoVideoOrchestrator';

export interface PlaygroundStageProps {
  onFrameChange?: (frame: number) => void;
  className?: string;
}

export const PlaygroundStage: React.FC<PlaygroundStageProps> = ({
  onFrameChange,
  className = '',
}) => {
  const recipe = usePlaygroundStore((state) => state.recipe);
  const playerRef = useRef<PlayerRef>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFrameUpdate = () => {
      const f = player.getCurrentFrame();
      setCurrentFrame(f);
      if (onFrameChange) {
        onFrameChange(f);
      }
    };

    player.addEventListener('frameupdate', handleFrameUpdate);
    return () => {
      player.removeEventListener('frameupdate', handleFrameUpdate);
    };
  }, [onFrameChange]);

  return (
    <div className={`relative w-full aspect-video border border-zinc-800 bg-black overflow-hidden shadow-2xl ${className}`}>
      <Player
        ref={playerRef}
        component={LegoVideoOrchestrator}
        inputProps={recipe}
        durationInFrames={recipe?.timing?.durationInFrames || 180}
        compositionWidth={recipe?.timing?.width || 1920}
        compositionHeight={recipe?.timing?.height || 1080}
        fps={recipe?.timing?.fps || 60}
        style={{
          width: '100%',
          height: '100%',
        }}
        controls
        autoPlay
        loop
      />

      {/* Frame Scrubber / Telemetry Overlay Badge */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-cyan-glow bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 z-10 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-ping" />
        <span>STAGE_FPS: 60 | FRAME: {currentFrame} / {recipe?.timing?.durationInFrames || 180}</span>
      </div>
    </div>
  );
};

export default PlaygroundStage;
