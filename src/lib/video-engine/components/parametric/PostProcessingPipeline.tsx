import React from 'react';

export interface PostProcessingPipelineProps {
  motion_tokens?: string[];
  children: React.ReactNode;
}

export const PostProcessingPipeline: React.FC<PostProcessingPipelineProps> = ({
  motion_tokens = [],
  children,
}) => {
  const hasGlitch = motion_tokens.includes('glitch-flicker');
  const hasChromatic = motion_tokens.includes('chromatic-aberration');

  const filterStyle = [
    hasChromatic
      ? 'drop-shadow(2px 0px 0px rgba(0, 229, 255, 0.6)) drop-shadow(-2px 0px 0px rgba(255, 0, 85, 0.6))'
      : '',
    hasGlitch ? 'contrast(1.1) brightness(1.05)' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      data-post-processing="cybernetic"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        filter: filterStyle || 'none',
      }}
    >
      {children}
    </div>
  );
};
