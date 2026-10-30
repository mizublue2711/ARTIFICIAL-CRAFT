import React from 'react';
import { BasePresetProps } from './presets';

export interface RemotionAdapterProps extends BasePresetProps {
  component: React.ComponentType<any>;
  overrideProps?: Record<string, any>;
}

export interface RiveAdapterProps {
  riveFileUrl: string;
  stateMachineName: string;
  inputName: string;
  frame?: number;
  fps?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface LottieAdapterProps {
  animationData: object;
  frame?: number;
  fps?: number;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
