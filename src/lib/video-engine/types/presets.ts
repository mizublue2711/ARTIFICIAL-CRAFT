import { CSSProperties } from 'react';

export interface BasePresetProps {
  frame?: number;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gridColor?: string;
  scale?: number;
  rotateXDeg?: number;
  rotateYDeg?: number;
  dispersionAmount?: number;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
}
