import { create } from 'zustand';
import {
  PlaygroundRecipe,
  LegoSlots,
  LegoProps,
} from '../types/playground';

export const INITIAL_RECIPE: PlaygroundRecipe = {
  slots: {
    backgroundId: 'SWISS_GRID',
    heroObjectId: 'ISOMETRIC_CUBE',
    overlayId: 'CROSSHAIRS',
    textId: 'SWISS_BRUTALIST',
  },
  props: {
    primaryColor: '#00E5FF',
    accentColor: '#5322ff',
    backgroundColor: '#09090b',
    cameraZoom: 1.0,
    rotateXDeg: 28,
    dispersionAmount: 0.12,
    textLine1: 'ARTIFICIAL CRAFT',
    textLine2: 'Meticulous Graphic Design Meets Code',
  },
  timing: {
    durationInFrames: 180,
    width: 1920,
    height: 1080,
    fps: 60,
  },
};

export const PRESET_TEMPLATES: Record<string, PlaygroundRecipe> = {
  'Swiss Brutalism': INITIAL_RECIPE,
  'Cyberpunk Matrix': {
    slots: {
      backgroundId: 'CYBER_RAIN',
      heroObjectId: 'CYBER_PYRAMID',
      overlayId: 'TELEMETRY_GRID',
      textId: 'GLITCH_MATRIX',
    },
    props: {
      primaryColor: '#00E5FF',
      accentColor: '#D400FF',
      backgroundColor: '#07070A',
      cameraZoom: 1.2,
      rotateXDeg: 35,
      dispersionAmount: 0.12,
      textLine1: 'CYBERPUNK MATRIX',
      textLine2: 'Autonomous Agent Telemetry Grid',
    },
    timing: {
      durationInFrames: 180,
      width: 1920,
      height: 1080,
      fps: 60,
    },
  },
  'Gold Amber Architecture': {
    slots: {
      backgroundId: 'GOLD_AMBER',
      heroObjectId: 'WIREFRAME_TORUS',
      overlayId: 'SWISS_DIMENSION',
      textId: 'NEON_BOLD',
    },
    props: {
      primaryColor: '#F59E0B',
      accentColor: '#78350F',
      backgroundColor: '#0B0B0F',
      cameraZoom: 1.15,
      rotateXDeg: 15,
      dispersionAmount: 0.12,
      textLine1: 'GOLDEN SPIRAL CAD',
      textLine2: 'Algorithmic 3D Architectural Blueprint',
    },
    timing: {
      durationInFrames: 180,
      width: 1920,
      height: 1080,
      fps: 60,
    },
  },
};

export interface PlaygroundStoreState {
  recipe: PlaygroundRecipe;
  setSlot: (slotName: keyof LegoSlots, selectedKey: string) => void;
  updateProps: (newProps: Partial<LegoProps>) => void;
  loadPresetRecipe: (presetRecipe: PlaygroundRecipe) => void;
}

export const usePlaygroundStore = create<PlaygroundStoreState>((set) => ({
  recipe: INITIAL_RECIPE,

  setSlot: (slotName, selectedKey) =>
    set((state) => ({
      recipe: {
        ...state.recipe,
        slots: {
          ...state.recipe.slots,
          [slotName]: selectedKey,
        },
      },
    })),

  updateProps: (newProps) =>
    set((state) => ({
      recipe: {
        ...state.recipe,
        props: {
          ...state.recipe.props,
          ...newProps,
          ...(newProps.dispersionAmount !== undefined
            ? { dispersionAmount: Math.min(0.5, Math.max(0.0, newProps.dispersionAmount)) }
            : {}),
        },
      },
    })),

  loadPresetRecipe: (presetRecipe) =>
    set(() => ({
      recipe: presetRecipe,
    })),
}));
