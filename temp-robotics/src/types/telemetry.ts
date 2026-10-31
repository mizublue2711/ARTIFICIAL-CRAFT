import { z } from 'zod';

export const TelemetryNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  badge: z.string(),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      status: z.enum(['optimal', 'warning', 'nominal']),
      unit: z.string().optional(),
    })
  ),
});

export type TelemetryNode = z.infer<typeof TelemetryNodeSchema>;

export interface MechanicalComponent {
  id: string;
  name: string;
  code: string;
  category: 'Structural' | 'Harmonic Core' | 'Sensory' | 'Actuator' | 'End-Effector';
  position: [number, number, number];
  explodedOffset: [number, number, number];
  explodedStage: 33 | 66 | 100; // which stage triggers its major separation
  specs: {
    material: string;
    weight: string;
    torqueOrForce?: string;
    gearRatio?: string;
    precision?: string;
    ipRating?: string;
    sensors?: string;
  };
  description: string;
  wireframeHighlightColor: string;
}

export interface TactileGraspMode {
  id: string;
  name: string;
  description: string;
  gripForceN: number;
  contactAreaPercent: number;
  primaryNodesActive: number;
  pattern: 'pinch' | 'power_cylinder' | 'spherical' | 'tactile_probe';
}

export interface SpecModel {
  id: string;
  name: string;
  type: string;
  payload: string;
  reach: string;
  repeatability: string;
  ipRating: string;
  motorEfficiency: string;
  ros2Compatible: boolean;
  dof: string;
  powerConsumption: string;
}
