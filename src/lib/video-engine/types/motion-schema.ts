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
