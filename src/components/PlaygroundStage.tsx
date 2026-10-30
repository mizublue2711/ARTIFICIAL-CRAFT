import React, { useRef, useState, useEffect } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { ArtificialCraftScene } from '@/components/ArtificialCraftScene';
import { PlaygroundRecipe } from '@/lib/usePlaygroundStore';

export interface PlaygroundStageProps {
  recipe: PlaygroundRecipe;
  onFrameChange?: (frame: number) => void;
  className?: string;
}

export const PlaygroundStage: React.FC<PlaygroundStageProps> = ({
  recipe,
  onFrameChange,
  className = '',
}) => {
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

  const sceneProps = {
    title: recipe.kineticText.textLine1 || 'ARTIFICIAL CRAFT',
    subtitle: recipe.kineticText.textLine2 || 'Where Meticulous Graphic Design Meets Code',
    mockupImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
    metrics: [
      { label: 'SLOT_BG', value: recipe.slots.backgroundId },
      { label: '3D_OBJECT', value: recipe.slots.heroObjectId },
      { label: 'OVERLAY', value: recipe.slots.overlayId },
    ],
    ctaText: 'LAUNCH STUDIO',
  };

  return (
    <div className={`relative w-full aspect-video border border-zinc-800 bg-black overflow-hidden shadow-2xl ${className}`}>
      {/* 3D Camera Depth & Rotation Container Wrapper */}
      <div
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${recipe.camera3D.cameraZoom}) rotateX(${recipe.camera3D.rotateXDeg}deg)`,
          perspective: '1200px',
        }}
      >
        <Player
          ref={playerRef}
          component={ArtificialCraftScene}
          inputProps={sceneProps}
          durationInFrames={180}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={60}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          autoPlay
          loop
        />
      </div>

      {/* Frame Scrubber / Telemetry Overlay Badge */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-cyan-glow bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 z-10 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-ping" />
        <span>STAGE_FPS: 60 | FRAME: {currentFrame} / 180</span>
      </div>
    </div>
  );
};

export default PlaygroundStage;
