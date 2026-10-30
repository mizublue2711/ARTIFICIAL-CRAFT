export interface UniversalComponentProps {
  seed?: number;
  primaryColor?: string;
  speed?: number;
  interactive?: boolean;
  theme?: 'dark' | 'light' | 'brutalist' | 'cyberpunk';
  width?: number | string;
  height?: number | string;
  className?: string;
}

export type VisualComponentType =
  | 'ParticleCanvas'
  | 'ThreeHookCanvas'
  | 'BrutalistLogo'
  | 'ArtificialCraftLogo'
  | 'PlugAndPlaySandbox'
  | 'CsvDataVisualizer'
  | 'ExistentialBlackbox'
  | 'Hero'
  | 'BentoGrid'
  | 'BlueprintLibrary'
  | 'BannerStudio'
  | 'BatchProductionModal'
  | 'Experts'
  | 'Footer'
  | 'Navbar';
