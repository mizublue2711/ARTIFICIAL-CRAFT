export type BlockType = 'cover' | 'tech_doc' | 'diagram' | 'interactive';

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
