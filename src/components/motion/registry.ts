import React from 'react';

export interface MotionComponentEntry {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'planned';
  component?: React.ComponentType<any>;
}

// Auto-discover any drop-in entry definitions inside subdirectories
const discoveredEntries = import.meta.glob('./*/entry.ts', { eager: true });

const dynamicRegistry: Record<string, MotionComponentEntry> = {};
Object.values(discoveredEntries).forEach((mod: any) => {
  const entry = mod.default || mod.entry;
  if (entry?.name) {
    dynamicRegistry[entry.name] = entry;
  }
});

// Base planned catalogue combined with discovered components
export const MOTION_REGISTRY: Record<string, MotionComponentEntry> = {
  ViewportStage: {
    id: 'viewport-stage',
    name: 'ViewportStage',
    description: 'Full-screen 100dvh layout enclosure with mobile touch defense',
    status: 'planned',
  },
  TextReveal: {
    id: 'text-reveal',
    name: 'TextReveal',
    description: 'Physics-based kinetic split-text typography',
    status: 'planned',
  },
  PerspectiveCard: {
    id: 'perspective-card',
    name: 'PerspectiveCard',
    description: 'Hardware-accelerated 3D tilt and depth container',
    status: 'planned',
  },
  ...dynamicRegistry,
};

export const getMotionComponent = (idOrName: string): MotionComponentEntry | undefined => {
  return (
    MOTION_REGISTRY[idOrName] ||
    Object.values(MOTION_REGISTRY).find((c) => c.id === idOrName || c.name === idOrName)
  );
};

export const getAllMotionComponents = (): MotionComponentEntry[] => {
  return Object.values(MOTION_REGISTRY);
};

export default MOTION_REGISTRY;
