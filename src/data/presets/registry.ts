import digitalPlumbingSwarm from './digital-plumbing-swarm.json';

export interface StudioPresetConfig {
  $schema?: string;
  presetId: string;
  compositionId: string;
  title: string;
  slogan: string;
  aesthetic: {
    themeStyle: string;
    backgroundColor: string;
    primaryColor: string;
    accentColor: string;
    headlineFont: string;
    codeFont: string;
  };
  motionTokens: string[];
  hero3DEngine: {
    modelType: string;
    enableRaycasting: boolean;
    explodedStages: string[];
  };
  telemetryDock: {
    fps: number;
    slaStatus: string;
    activeNodes: string[];
  };
}

export type StudioPreset = typeof digitalPlumbingSwarm;

export const PRESETS_REGISTRY = [
  digitalPlumbingSwarm,
];

export const presetsRegistry: Record<string, StudioPreset> = {
  [digitalPlumbingSwarm.presetId]: digitalPlumbingSwarm,
};

export const getPresetById = (presetId: string): StudioPreset | undefined => {
  return presetsRegistry[presetId];
};

export const getAllPresets = (): StudioPreset[] => {
  return Object.values(presetsRegistry);
};

export { digitalPlumbingSwarm, digitalPlumbingSwarm as digitalPlumbingSwarmPreset };
export default presetsRegistry;
