export interface MechanicalComponentSpecs {
  material: string;
  weight: string;
  torqueOrForce?: string;
  gearRatio?: string;
  precision?: string;
  ipRating?: string;
  sensors?: string;
}

export interface MechanicalComponent {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  position: [number, number, number];
  explodedOffset: [number, number, number];
  explodedStage: 33 | 66 | 100;
  specs: MechanicalComponentSpecs;
}

export interface TelemetryNode {
  id: string;
  label: string;
  badge: string;
  metrics: {
    label: string;
    value: string;
    color?: string;
  }[];
}

export interface TactileGraspMode {
  id: string;
  name: string;
  pattern: 'pinch' | 'power_cylinder' | 'spherical' | 'tripod';
  gripForceN: number;
  description: string;
  primaryNodesActive: number;
  contactAreaPercent: number;
}

export interface SpecModel {
  id: string;
  name: string;
  dof: string;
  type: string;
  payload: string;
  repeatability: string;
  ipRating: string;
  motorEfficiency: string;
}
