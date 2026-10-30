export type BlockType = 'cover' | 'tech_doc' | 'diagram' | 'interactive';

export type GraphicType =
  | 'AUTOMATION_FLOW'
  | 'DATA_MATRIX'
  | 'REMOTION_TIMELINE'
  | 'GEO_MAP'
  | 'PORTFOLIO_ALLOCATOR'
  | 'EXECUTIVE_PORTRAIT'
  | 'RISK_RADAR'
  | 'GLOBAL_GEO_NODES'
  | 'CANDLESTICK_STREAM'
  | 'WATERFALL_FLOW'
  | 'NEURAL_MESH'
  | 'ISOMETRIC_CAD'
  | 'ALGORITHMIC_WAVE'
  | 'INTERACTIVE_ANCHOR'
  | string;

export type TechDocLayout =
  | 'DEFAULT'
  | 'SPLIT_LEFT_RIGHT'
  | 'STACKED_CODE_BOTTOM'
  | 'HERO_CODE_TOP'
  | string;

export type DiagramLayout =
  | 'DEFAULT'
  | 'CANVAS_CENTER'
  | 'SPLIT_DIAGRAM_RIGHT'
  | string;

export interface PageBlock {
  id: string;
  type: BlockType;
  title?: string;
  subtitle?: string;
  version?: string;
  tags?: string[];
  verified?: boolean;
  content?: string;
  code?: string;
  language?: string;
  imageUrl?: string;
  caption?: string;
  logs?: string[];
  status?: 'active' | 'idle' | 'success' | 'warning' | 'error' | string;
  seed?: string;
  graphicType?: GraphicType;
  layoutVariant?: TechDocLayout | DiagramLayout;
  metadata?: Record<string, unknown>;
}

export interface BookData {
  slug: string;
  title: string;
  subtitle?: string;
  category: 'manual' | 'guide' | 'brand' | 'manifesto' | 'api_doc' | string;
  author?: string;
  version: string;
  updatedAt?: string;
  pages: PageBlock[];
}
