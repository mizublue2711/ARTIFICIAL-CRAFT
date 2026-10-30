import { BasePresetProps } from './presets';

export interface LegoSlots {
  backgroundId: string; // e.g. 'swiss-grid-hud'
  heroObjectId: string; // e.g. 'rubik-3d'
  overlayId: string;    // e.g. 'laser-scan-border'
  textId: string;       // e.g. 'kinetic-type-scramble'
}

export interface PlaygroundRecipe {
  slots: LegoSlots;
  timing: {
    durationInFrames: number; // default: 180 (3s @ 60FPS)
    fps: number;              // default: 60
    width: number;            // default: 1920
    height: number;           // default: 1080
  };
  props: BasePresetProps & {
    cameraZoom?: number;
    rotateXDeg?: number;
    rotateYDeg?: number;
    dispersionAmount?: number;
    textLine1?: string;
    textLine2?: string;
  };
}
