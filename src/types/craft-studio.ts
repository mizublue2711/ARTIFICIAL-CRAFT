import { z } from 'zod';

export const AestheticSchema = z.object({
  palette: z.string().default('Brutalist Monochrome'),
  primaryColor: z.string().default('#5322FF'),
  backgroundColor: z.string().default('#09090B'),
});

export const TelemetrySchema = z.object({
  slaTarget: z.string().default('<8ms'),
  fps: z.number().default(60),
});

export const CraftPayloadObjectSchema = z.object({
  prompt: z.string().optional().default(''),
  base_component: z.string().default('RoboticsHandNode'),
  aesthetic: AestheticSchema,
  motion_tokens: z.array(z.string()).default([]),
  telemetry: TelemetrySchema,
});

export const CraftRequestSchema = z.object({
  task_type: z.enum(['ROBOTICS_3D', 'USER_WEBAPP_GEN']).default('USER_WEBAPP_GEN'),
  payload: z.string(), // JSON.stringify(CraftPayloadObjectSchema)
});

export type CraftPayloadObject = z.infer<typeof CraftPayloadObjectSchema>;
export type CraftRequestPayload = z.infer<typeof CraftRequestSchema>;

export interface CraftGenerateResponse {
  status: 'success' | 'error';
  layout_json?: any;
  message?: string;
  // Backward compatibility fields if any caller checks success/htmlStream
  success?: boolean;
  htmlStream?: string;
  error?: string;
}

// Backward compatibility schema & types for internal references (AST generator / route)
export { SwissDesignConfigSchema } from '@/types/studioConfig';
export type { StudioConfigData as SwissDesignConfig } from '@/types/studioConfig';
