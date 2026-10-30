import { create } from 'zustand';
import { LegoSlots, PlaygroundRecipe } from '../types/playground';

export interface PlaygroundStoreState {
  recipe: PlaygroundRecipe;
  setSlot: (slotKey: keyof LegoSlots, assetId: string) => void;
  updateProps: (partialProps: Partial<PlaygroundRecipe['props']>) => void;
  loadPresetRecipe: (recipe: PlaygroundRecipe) => void;
  exportJSON: () => string;
}

export const DEFAULT_PLAYGROUND_RECIPE: PlaygroundRecipe = {
  slots: {
    backgroundId: 'swiss-grid-hud',
    heroObjectId: 'rubik-3d',
    overlayId: 'laser-scan-border',
    textId: 'kinetic-type-scramble',
  },
  timing: {
    durationInFrames: 180, // 3s @ 60FPS
    fps: 60,
    width: 1920,
    height: 1080,
  },
  props: {
    backgroundColor: '#050505',
    primaryColor: '#00E5FF',
    secondaryColor: '#7000FF',
    accentColor: '#FF0055',
    gridColor: '#1A1A24',
    cameraZoom: 1.0,
    rotateXDeg: 28, // Isometric pitch constraint to prevent 3D plane flattening
    rotateYDeg: -15,
    dispersionAmount: 0.12,
    textLine1: 'ARTIFICIAL CRAFT',
    textLine2: 'VIDEO ENGINE 2025',
  },
};

export const usePlaygroundStore = create<PlaygroundStoreState>((set, get) => ({
  recipe: DEFAULT_PLAYGROUND_RECIPE,

  setSlot: (slotKey, assetId) =>
    set((state) => ({
      recipe: {
        ...state.recipe,
        slots: {
          ...state.recipe.slots,
          [slotKey]: assetId,
        },
      },
    })),

  updateProps: (partialProps) =>
    set((state) => ({
      recipe: {
        ...state.recipe,
        props: {
          ...state.recipe.props,
          ...partialProps,
        },
      },
    })),

  loadPresetRecipe: (recipe) =>
    set(() => ({
      recipe: {
        ...recipe,
        props: {
          rotateXDeg: recipe.props.rotateXDeg ?? 28,
          dispersionAmount: recipe.props.dispersionAmount ?? 0.12,
          ...recipe.props,
        },
      },
    })),

  exportJSON: () => {
    return JSON.stringify(get().recipe, null, 2);
  },
}));
