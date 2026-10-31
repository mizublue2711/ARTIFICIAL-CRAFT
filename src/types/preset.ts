/**
 * ARTIFICIAL CRAFT - Strict Type Registry & Preset Schema Definitions
 * Enforces uniform prop naming conventions across all Visual Blocks, Canvas,
 * Motion Parameters, Background Presets, and JSON-Driven Page Section Engines.
 */

export type SectionType =
  | 'HERO_3D'
  | 'monolith-3d-engine'
  | 'node-01-3d-procedural'
  | 'GEOMETRIC_ART'
  | 'PLUG_AND_PLAY'
  | 'CSV_VISUALIZER'
  | 'BANNER_STUDIO'
  | 'VIDEO_SHOWCASE'
  | 'INTERACTIVE_NODE_MATRIX'
  | 'TERMINAL_CONSOLE'
  | 'EXPORT_ARTIFACT'
  | 'EMBED_MODAL'
  | 'STUDIO_CONFIGURATOR'
  | 'studio-configurator-node'
  | string;

export type GenerativeVisualMode =
  | 'NEURAL_MESH'
  | 'ISOMETRIC_CAD'
  | 'ALGORITHMIC_WAVE'
  | 'AUTOMATION_FLOW'
  | 'DATA_MATRIX'
  | 'REMOTION_TIMELINE'
  | 'GEO_MAP'
  | 'INTERACTIVE_ANCHOR'
  | string;

export interface BaseComponentProps {
  seed?: string;
  color?: string;
  speed?: number;
  interactive?: boolean;
  className?: string;
}

export type UniversalComponentProps = BaseComponentProps & Record<string, unknown>;

export interface CanvasProps extends BaseComponentProps {
  width?: number;
  height?: number;
  fps?: number;
  dpr?: number;
  cameraPosition?: [number, number, number];
  fov?: number;
  particleCount?: number;
}

export interface MotionParameters {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  staggerChildren?: number;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  overlayType?: 'grid' | 'dots' | 'scanlines' | 'cad_blueprint' | 'none';
  opacity?: number;
  color?: string;
  lineSpacing?: number;
}

export interface VisualBlockProps extends BaseComponentProps {
  mode?: GenerativeVisualMode;
  variant?: string;
  density?: number;
  palette?: string;
  dataUrl?: string;
  category?: 'organic' | 'structure' | 'biological' | string;
}

export interface SectionConfig {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  badge?: string;
  props?: Record<string, unknown>;
  visualBlock?: VisualBlockProps;
  canvasProps?: CanvasProps;
  motion?: MotionParameters;
  background?: BackgroundPreset;
}

export interface PageTemplateSchema {
  id: string;
  version: string;
  metadata: {
    title: string;
    description?: string;
    author?: string;
    updatedAt?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  sections: SectionConfig[];
}
