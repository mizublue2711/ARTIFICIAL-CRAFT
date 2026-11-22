import {
  getWorkflowBlueprints,
  getWorkflowBlueprintById,
  getShowcaseBlueprints,
  getPipelineBlueprints,
  getPipelineBlueprintById,
  getPipelineBlueprintsCatalog,
} from './index';

export const DATA_BLUEPRINT_REGISTRY = {
  workflows: () => import('./index').then((m) => m.getWorkflowBlueprints()),
  showcaseBlueprints: () => import('./index').then((m) => m.getShowcaseBlueprints()),
  blueprintById: (id: string) => import('./index').then((m) => m.getWorkflowBlueprintById(id)),
  // Synchronous direct accessors
  getWorkflowsSync: getWorkflowBlueprints,
  getShowcaseBlueprintsSync: getShowcaseBlueprints,
  getBlueprintByIdSync: getWorkflowBlueprintById,
  getPipelinesSync: getPipelineBlueprints,
  getPipelineByIdSync: getPipelineBlueprintById,
  getCatalogSync: getPipelineBlueprintsCatalog,
};

export default DATA_BLUEPRINT_REGISTRY;
