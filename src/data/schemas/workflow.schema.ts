import { z } from 'zod';

export const WorkflowNodeDefSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    x: z.number(),
    y: z.number(),
    status: z.enum(['idle', 'active', 'complete', 'error']).optional(),
    icon: z.string().optional(),
  })
  .passthrough();

export const WorkflowBlueprintSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    title_vi: z.string().optional(),
    description: z.string().optional(),
    description_vi: z.string().optional(),
    accent: z.string().default('#00E5FF'),
    nodes: z.array(WorkflowNodeDefSchema),
    edges: z.array(z.tuple([z.string(), z.string()])),
  })
  .passthrough();

export type WorkflowNodeDef = z.infer<typeof WorkflowNodeDefSchema>;
export type WorkflowBlueprint = z.infer<typeof WorkflowBlueprintSchema>;

// Pipeline catalog schema for enterprise blueprints & preset inspection
export const BlueprintNodeSchema = z
  .object({
    step: z.number(),
    id: z.string(),
    name: z.string(),
    type: z.string(),
    engine: z.string(),
    latency: z.string(),
    output: z.string(),
  })
  .passthrough();

export const PipelineBlueprintSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    category: z.string(),
    tier: z.enum(['Core', 'Advanced', 'Expert']),
    node_count: z.number(),
    description: z.string(),
    cli_deploy: z.string(),
    nodes: z.array(BlueprintNodeSchema),
    config_parameters: z.record(z.unknown()),
  })
  .passthrough();

export const PipelineBlueprintsCatalogSchema = z.object({
  $schema: z.string().optional(),
  version: z.string().optional(),
  title: z.string().optional(),
  blueprints: z.array(PipelineBlueprintSchema),
});

export type BlueprintNode = z.infer<typeof BlueprintNodeSchema>;
export type PipelineBlueprint = z.infer<typeof PipelineBlueprintSchema>;
export type PipelineBlueprintsCatalog = z.infer<typeof PipelineBlueprintsCatalogSchema>;
