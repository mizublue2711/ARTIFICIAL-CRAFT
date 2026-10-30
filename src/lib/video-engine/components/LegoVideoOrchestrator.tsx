import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { PlaygroundRecipe } from '../types/playground';
import { usePlaygroundStore } from '../store/usePlaygroundStore';
import { getPresetById } from '../presets/registry';

export interface LegoVideoOrchestratorProps {
  recipe?: PlaygroundRecipe;
}

export const LegoVideoOrchestrator: React.FC<LegoVideoOrchestratorProps> = ({ recipe: propsRecipe }) => {
  const storeRecipe = usePlaygroundStore((state) => state.recipe);
  const recipe = propsRecipe || storeRecipe;

  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const { slots, props: recipeProps } = recipe;

  // Resolve layer presets from registry
  const bgPreset = getPresetById(slots.backgroundId);
  const heroPreset = getPresetById(slots.heroObjectId);
  const overlayPreset = getPresetById(slots.overlayId);
  const textPreset = getPresetById(slots.textId);

  // Common props passed to each layer component
  const commonProps = {
    frame,
    fps,
    width,
    height,
    ...recipeProps,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: recipeProps.backgroundColor || '#050505', overflow: 'hidden' }}>
      {/* Layer 1 (Bottom): Background Component */}
      <AbsoluteFill style={{ zIndex: 1 }}>
        {bgPreset && bgPreset.component ? (
          <bgPreset.component
            {...bgPreset.defaultProps}
            {...commonProps}
          />
        ) : null}
      </AbsoluteFill>

      {/* Layer 2: 3D Hero / Mesh Component */}
      <AbsoluteFill
        style={{
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${recipeProps.cameraZoom ?? 1.0})`,
        }}
      >
        {heroPreset && heroPreset.component ? (
          <heroPreset.component
            {...heroPreset.defaultProps}
            {...commonProps}
            scale={recipeProps.cameraZoom ?? 1.0}
            rotateXDeg={recipeProps.rotateXDeg ?? 28}
            rotateYDeg={recipeProps.rotateYDeg ?? -15}
            effectiveDispersion={recipeProps.dispersionAmount ?? 0.12}
            dispersionAmount={recipeProps.dispersionAmount ?? 0.12}
          />
        ) : null}
      </AbsoluteFill>

      {/* Layer 3: HUD Overlay & Laser Scan Border */}
      <AbsoluteFill style={{ zIndex: 3, pointerEvents: 'none' }}>
        {overlayPreset && overlayPreset.component ? (
          <overlayPreset.component
            {...overlayPreset.defaultProps}
            {...commonProps}
          />
        ) : null}
      </AbsoluteFill>

      {/* Layer 4 (Top): Kinetic Typography Component */}
      <AbsoluteFill
        style={{
          zIndex: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {textPreset && textPreset.component ? (
          <textPreset.component
            {...textPreset.defaultProps}
            {...commonProps}
            text={
              recipeProps.textLine1
                ? `${recipeProps.textLine1}${recipeProps.textLine2 ? ' ' + recipeProps.textLine2 : ''}`
                : textPreset.defaultProps?.text || 'ARTIFICIAL CRAFT'
            }
            textLine1={recipeProps.textLine1}
            textLine2={recipeProps.textLine2}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
