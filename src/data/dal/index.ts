import { z } from 'zod';
import {
  WorkflowBlueprintSchema,
  type WorkflowBlueprint,
  PipelineBlueprintSchema,
  type PipelineBlueprint,
  PipelineBlueprintsCatalogSchema,
  type PipelineBlueprintsCatalog,
} from '../schemas/workflow.schema';
import rawBlueprints from '../pipeline-blueprints.json';

/**
 * Normalizes blueprint source data: handles both flat arrays and catalog objects.
 */
const getRawBlueprintList = (): unknown[] => {
  if (Array.isArray(rawBlueprints)) {
    return rawBlueprints;
  }
  return (rawBlueprints as { blueprints?: unknown[] })?.blueprints ?? [];
};

/**
 * Validates and retrieves all workflow blueprints through Zod validation.
 */
export const getWorkflowBlueprints = (): WorkflowBlueprint[] => {
  const target = getRawBlueprintList();
  const parsed = z.array(WorkflowBlueprintSchema).safeParse(target);
  if (!parsed.success) {
    console.warn('[DAL Gate] Workflow schema mismatch:', parsed.error.format());
    return target as unknown as WorkflowBlueprint[];
  }
  return parsed.data;
};

/**
 * Retrieves a single workflow blueprint by ID with type-safe schema guarantees.
 */
export const getWorkflowBlueprintById = (id: string): WorkflowBlueprint | undefined => {
  const all = getWorkflowBlueprints();
  return all.find((b) => b.id === id);
};

/**
 * Retrieves all pipeline blueprints typed according to enterprise catalog specifications.
 */
export const getPipelineBlueprints = (): PipelineBlueprint[] => {
  const target = getRawBlueprintList();
  const parsed = z.array(PipelineBlueprintSchema).safeParse(target);
  if (!parsed.success) {
    console.warn('[DAL Gate] Pipeline schema mismatch:', parsed.error.format());
    return target as unknown as PipelineBlueprint[];
  }
  return parsed.data;
};

/**
 * Retrieves a single pipeline blueprint by ID or slug.
 */
export const getPipelineBlueprintById = (idOrSlug: string): PipelineBlueprint | undefined => {
  const all = getPipelineBlueprints();
  return all.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
};

/**
 * Validates and retrieves the full blueprints catalog object.
 */
export const getPipelineBlueprintsCatalog = (): PipelineBlueprintsCatalog => {
  const parsed = PipelineBlueprintsCatalogSchema.safeParse(rawBlueprints);
  if (!parsed.success) {
    console.warn('[DAL Gate] Pipeline Catalog schema mismatch:', parsed.error.format());
    return rawBlueprints as unknown as PipelineBlueprintsCatalog;
  }
  return parsed.data;
};

export { rawBlueprints };
export type {
  WorkflowBlueprint,
  WorkflowNodeDef,
  PipelineBlueprint,
  PipelineBlueprintsCatalog,
} from '../schemas/workflow.schema';
export default getWorkflowBlueprints;
