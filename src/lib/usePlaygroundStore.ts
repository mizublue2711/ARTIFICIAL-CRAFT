import { useState, useCallback } from 'react';

export interface PlaygroundSlots {
  backgroundId: string;
  heroObjectId: string;
  overlayId: string;
  textId: string;
}

export interface PlaygroundBrandColors {
  primaryColor: string;
  accentColor: string;
}

export interface PlaygroundCamera3D {
  cameraZoom: number;
  rotateXDeg: number;
  dispersionAmount: number;
}

export interface PlaygroundKineticText {
  textLine1: string;
  textLine2: string;
}

export interface PlaygroundRecipe {
  slots: PlaygroundSlots;
  brandColors: PlaygroundBrandColors;
  camera3D: PlaygroundCamera3D;
  kineticText: PlaygroundKineticText;
}

export const PRESET_RECIPES: Record<string, PlaygroundRecipe> = {
  CYBERPUNK_MATRIX: {
    slots: {
      backgroundId: 'CYBER_RAIN',
      heroObjectId: 'CYBER_PYRAMID',
      overlayId: 'TELEMETRY_GRID',
      textId: 'GLITCH_MATRIX',
    },
    brandColors: {
      primaryColor: '#00E5FF',
      accentColor: '#D400FF',
    },
    camera3D: {
      cameraZoom: 1.2,
      rotateXDeg: 35,
      dispersionAmount: 0.12,
    },
    kineticText: {
      textLine1: 'CYBERPUNK MATRIX',
      textLine2: 'Autonomous Agent Telemetry Grid',
    },
  },
  SWISS_BRUTALISM: {
    slots: {
      backgroundId: 'SWISS_GRID',
      heroObjectId: 'ISOMETRIC_CUBE',
      overlayId: 'CROSSHAIRS',
      textId: 'SWISS_BRUTALIST',
    },
    brandColors: {
      primaryColor: '#FAFAFA',
      accentColor: '#5322FF',
    },
    camera3D: {
      cameraZoom: 1.0,
      rotateXDeg: 28,
      dispersionAmount: 0.08,
    },
    kineticText: {
      textLine1: 'ARTIFICIAL CRAFT',
      textLine2: 'Meticulous Graphic Design Meets Code',
    },
  },
  GOLD_AMBER_CAD: {
    slots: {
      backgroundId: 'GOLD_AMBER',
      heroObjectId: 'WIREFRAME_TORUS',
      overlayId: 'SWISS_DIMENSION',
      textId: 'NEON_BOLD',
    },
    brandColors: {
      primaryColor: '#F59E0B',
      accentColor: '#78350F',
    },
    camera3D: {
      cameraZoom: 1.15,
      rotateXDeg: 15,
      dispersionAmount: 0.12,
    },
    kineticText: {
      textLine1: 'GOLDEN SPIRAL CAD',
      textLine2: 'Algorithmic 3D Architectural Blueprint',
    },
  },
};

export const INITIAL_RECIPE: PlaygroundRecipe = PRESET_RECIPES.SWISS_BRUTALISM;

export function usePlaygroundStore() {
  const [recipe, setRecipe] = useState<PlaygroundRecipe>(INITIAL_RECIPE);

  const updateSlots = useCallback((updates: Partial<PlaygroundSlots>) => {
    setRecipe((prev) => ({
      ...prev,
      slots: { ...prev.slots, ...updates },
    }));
  }, []);

  const updateBrandColors = useCallback((updates: Partial<PlaygroundBrandColors>) => {
    setRecipe((prev) => ({
      ...prev,
      brandColors: { ...prev.brandColors, ...updates },
    }));
  }, []);

  const updateCamera3D = useCallback((updates: Partial<PlaygroundCamera3D>) => {
    setRecipe((prev) => ({
      ...prev,
      camera3D: { ...prev.camera3D, ...updates },
    }));
  }, []);

  const updateKineticText = useCallback((updates: Partial<PlaygroundKineticText>) => {
    setRecipe((prev) => ({
      ...prev,
      kineticText: { ...prev.kineticText, ...updates },
    }));
  }, []);

  const loadPreset = useCallback((presetKey: keyof typeof PRESET_RECIPES) => {
    if (PRESET_RECIPES[presetKey]) {
      setRecipe(PRESET_RECIPES[presetKey]);
    }
  }, []);

  return {
    recipe,
    slots: recipe.slots,
    brandColors: recipe.brandColors,
    camera3D: recipe.camera3D,
    kineticText: recipe.kineticText,
    updateSlots,
    updateBrandColors,
    updateCamera3D,
    updateKineticText,
    loadPreset,
    setRecipe,
  };
}
