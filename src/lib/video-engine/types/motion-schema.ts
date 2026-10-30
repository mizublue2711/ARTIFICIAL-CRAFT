import { PlaygroundRecipe } from './playground';

export interface MotionDirectorConfig {
  meta: {
    compositionId: string;
    fps: number;
    durationInFrames: number;
    dimensions: { width: number; height: number };
  };
  storyboardTimeline: {
    intro: { startFrame: number; endFrame: number };
    environment: { startFrame: number; endFrame: number };
    activation: { startFrame: number; endFrame: number };
    contentReveal: { startFrame: number; endFrame: number };
  };
  cameraAndDepthTokens: {
    kineticParallax: { enabled: boolean; speedFactors: { bg: number; fg: number } };
    chromaticAberration: { enabled: boolean; offset: [number, number] };
    depthOfFieldBlur: { enabled: boolean; maxBlurPx: number };
  };
  kineticTypographyTokens: {
    style: 'text-clipping-reveal' | 'scramble-text' | 'variable-font-weight-morph' | 'marquee-continuous';
    scrambleChars: string;
  };
}

export interface MasterSceneInputProps {
  title: string;
  slogan: string;
  mockupUrl: string;
  metrics: { label: string; value: string }[];
  config?: MotionDirectorConfig;
}

export const universalMotionSchemaV2 = {
  validate: (recipe: unknown): { success: boolean; errors?: string[] } => {
    if (!recipe || typeof recipe !== 'object') {
      return { success: false, errors: ['Invalid recipe payload: must be an object'] };
    }
    const r = recipe as PlaygroundRecipe;
    const errors: string[] = [];

    if (!r.slots || typeof r.slots !== 'object') {
      errors.push('Missing slots definition');
    } else {
      if (!r.slots.backgroundId) errors.push('Missing slots.backgroundId');
      if (!r.slots.heroObjectId) errors.push('Missing slots.heroObjectId');
      if (!r.slots.overlayId) errors.push('Missing slots.overlayId');
      if (!r.slots.textId) errors.push('Missing slots.textId');
    }

    if (!r.timing || typeof r.timing !== 'object') {
      errors.push('Missing timing parameters');
    } else {
      if (typeof r.timing.durationInFrames !== 'number') errors.push('Invalid timing.durationInFrames');
      if (typeof r.timing.fps !== 'number') errors.push('Invalid timing.fps');
    }

    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};
