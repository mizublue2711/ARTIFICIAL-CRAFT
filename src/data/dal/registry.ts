import {
  getWorkflowBlueprints,
  getWorkflowBlueprintById,
  getPipelineBlueprints,
  getPipelineBlueprintById,
  getPipelineBlueprintsCatalog,
} from './index';

export const DATA_BLUEPRINT_REGISTRY = {
  workflows: () => import('./index').then((m) => m.getWorkflowBlueprints()),
  blueprintById: (id: string) => import('./index').then((m) => m.getWorkflowBlueprintById(id)),
  // Synchronous direct accessors
  getWorkflowsSync: getWorkflowBlueprints,
  getBlueprintByIdSync: getWorkflowBlueprintById,
  getPipelinesSync: getPipelineBlueprints,
  getPipelineByIdSync: getPipelineBlueprintById,
  getCatalogSync: getPipelineBlueprintsCatalog,
};

export default DATA_BLUEPRINT_REGISTRY;
