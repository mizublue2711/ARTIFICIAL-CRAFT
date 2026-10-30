import React from 'react';
import { Player } from '@remotion/player';
import { LegoVideoOrchestrator } from './LegoVideoOrchestrator';
import { usePlaygroundStore } from '../store/usePlaygroundStore';

export interface PlaygroundStageProps {
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export const PlaygroundStage: React.FC<PlaygroundStageProps> = ({
  className,
  style,
  autoPlay = true,
  loop = true,
  controls = true,
}) => {
  const recipe = usePlaygroundStore((state) => state.recipe);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        aspectRatio: `${recipe.timing.width} / ${recipe.timing.height}`,
        backgroundColor: recipe.props.backgroundColor || '#050505',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <Player
        component={LegoVideoOrchestrator}
        inputProps={{ recipe }}
        durationInFrames={recipe.timing.durationInFrames}
        fps={recipe.timing.fps}
        compositionWidth={recipe.timing.width}
        compositionHeight={recipe.timing.height}
        style={{
          width: '100%',
          height: '100%',
        }}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
      />
    </div>
  );
};
