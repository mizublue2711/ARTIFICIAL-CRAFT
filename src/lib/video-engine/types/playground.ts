/**
 * Video Playground - Lego Assembly Types
 */

export interface LegoSlots {
  backgroundId: string;
  heroObjectId: string;
  overlayId: string;
  textId: string;
}

export interface LegoProps {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cameraZoom: number;
  rotateXDeg: number;
  dispersionAmount: number;
  textLine1: string;
  textLine2: string;
}

export interface LegoTiming {
  durationInFrames: number;
  width: number;
  height: number;
  fps: number;
}

export interface PlaygroundRecipe {
  slots: LegoSlots;
  props: LegoProps;
  timing: LegoTiming;
}

export interface AssetPresetItem {
  id: string;
  label: string;
  category: 'backgrounds' | 'heroObjects' | 'overlays' | 'typography';
  description?: string;
  previewColor?: string;
}

export interface AssetPresetRegistry {
  backgrounds: Record<string, AssetPresetItem>;
  heroObjects: Record<string, AssetPresetItem>;
  overlays: Record<string, AssetPresetItem>;
  typography: Record<string, AssetPresetItem>;
}
