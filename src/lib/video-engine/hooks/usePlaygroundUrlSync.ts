import { useEffect, useState } from 'react';
import { usePlaygroundStore } from '../store/usePlaygroundStore';
import { PlaygroundRecipe } from '../types/playground';

export const encodeRecipeToBase64 = (recipe: PlaygroundRecipe): string => {
  try {
    const jsonStr = JSON.stringify(recipe);
    return btoa(encodeURIComponent(jsonStr));
  } catch (err) {
    console.error('Failed to encode recipe to base64:', err);
    return '';
  }
};

export const decodeRecipeFromBase64 = (base64Str: string): PlaygroundRecipe | null => {
  try {
    const jsonStr = decodeURIComponent(atob(base64Str));
    return JSON.parse(jsonStr) as PlaygroundRecipe;
  } catch (err) {
    console.error('Failed to decode recipe from base64:', err);
    return null;
  }
};

export const usePlaygroundUrlSync = () => {
  const recipe = usePlaygroundStore((state) => state.recipe);
  const loadPresetRecipe = usePlaygroundStore((state) => state.loadPresetRecipe);
  const [isEmbed, setIsEmbed] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Initial load: parse ?recipe= and ?embed= from window.location
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const embedParam = searchParams.get('embed');
    setIsEmbed(embedParam === 'true');

    const recipeParam = searchParams.get('recipe');
    if (recipeParam) {
      const parsed = decodeRecipeFromBase64(recipeParam);
      if (parsed && parsed.slots && parsed.timing && parsed.props) {
        loadPresetRecipe(parsed);
      }
    }
    setIsHydrated(true);
  }, [loadPresetRecipe]);

  // Sync state to URL on recipe change
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    const encoded = encodeRecipeToBase64(recipe);
    if (!encoded) return;

    const url = new URL(window.location.href);
    url.searchParams.set('recipe', encoded);
    if (isEmbed) {
      url.searchParams.set('embed', 'true');
    }

    window.history.replaceState(null, '', url.toString());
  }, [recipe, isEmbed, isHydrated]);

  return { isEmbed, isHydrated, encodeRecipeToBase64, decodeRecipeFromBase64 };
};
