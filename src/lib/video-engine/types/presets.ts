import { CSSProperties } from 'react';

export interface BasePresetProps {
  frame?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gridColor?: string;
  className?: string;
  style?: CSSProperties;
}
