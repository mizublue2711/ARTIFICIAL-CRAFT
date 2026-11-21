/**
 * ARTIFICIAL CRAFT - Master Barrel Index & Domain Registry Coordinator
 * Unifies Studio, Motion, and Data Blueprints Domain Registries
 */

// Forward existing Studio / Section / Node 05 Component Registries
export * from '../components/studio/registry';

// Forward Motion Lego Domain Registry
export * from '../components/motion/registry';

// Forward Data Blueprints Domain Registry
export * from '../data/dal/registry';

// Master System Directory Map
export const MASTER_REGISTRY_MAP = {
  motion: '@/components/motion/registry',
  data: '@/data/dal/registry',
  studio: '@/components/studio/registry',
} as const;

export type MasterRegistryDomain = keyof typeof MASTER_REGISTRY_MAP;

export default MASTER_REGISTRY_MAP;
