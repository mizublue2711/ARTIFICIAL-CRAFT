import React from 'react';
import { componentRegistry, VisualComponentType } from './registry';
import { UniversalComponentProps } from '@/types/preset';

export interface GenerativeVisualProps extends UniversalComponentProps {
  componentType: VisualComponentType | string;
  fallback?: React.ReactNode;
}

export default function GenerativeVisual({
  componentType,
  fallback = null,
  ...props
}: GenerativeVisualProps) {
  const Component = componentRegistry[componentType];

  if (!Component) {
    return <>{fallback}</>;
  }

  return <Component {...props} />;
}
