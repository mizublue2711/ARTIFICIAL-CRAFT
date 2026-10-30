import React from 'react';

export interface BasePresetProps {
  frame?: number;
  fps?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gridColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export type PresetCategory = 'background' | 'parametric';

export interface PresetRegistryEntry<P = Record<string, unknown>> {
  id: string;
  name: string;
  category: PresetCategory;
  description: string;
  tags: string[];
  component: React.ComponentType<P>;
  defaultProps: P;
}
