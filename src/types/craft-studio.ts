import { z } from 'zod';

/**
 * Zod Schema validation cho 5-Step Wizard Dock của Studio Configurator
 * Tuân thủ ngôn ngữ Cybernetic Brutalism (#09090B, #5322FF, JetBrains Mono)
 */
export const SwissDesignConfigSchema = z.object({
  // Step 1: Base Preset & Layout Architecture
  presetId: z.string().default('cybernetic-brutalism-v1'),
  layoutMode: z.enum(['two-column', 'fullscreen-canvas', 'split-horizontal']).default('two-column'),
  
  // Step 2: Brand & Identity
  compositionId: z.string().optional().default('ARTIFICIAL_CRAFT'),
  brandName: z.string().min(1, 'Brand name is required').default('ARTIFICIAL CRAFT'),
  tagline: z.string().default('Brutalist Automation & Graphic Precision'),
  slogan: z.string().optional(),
  logoUrl: z.string().url().optional(),

  // Step 3: Color Palette & Typography
  theme: z.object({
    backgroundColor: z.string().default('#09090B'), // Obsidian
    primaryColor: z.string().default('#5322FF'),   // Electric Indigo
    textColor: z.string().default('#F4F4F5'),      // Zinc Light
    accentColor: z.string().default('#00FF66'),    // Cyber Green
    fontFamily: z.enum(['JetBrains Mono', 'Space Grotesk', 'Inter']).default('JetBrains Mono'),
  }).default({
    backgroundColor: '#09090B',
    primaryColor: '#5322FF',
    textColor: '#F4F4F5',
    accentColor: '#00FF66',
    fontFamily: 'JetBrains Mono' as const,
  }),

  // Step 4: 3D Model & Kinematics Configuration
  roboticsNode: z.object({
    modelType: z.enum(['robot-arm', 'kinematic-assembler', 'point-cloud-node', 'holographic-core', 'kinematic_manipulator_arm']).default('robot-arm'),
    wireframe: z.boolean().default(true),
    rotationSpeed: z.number().min(0).max(10).default(1.5),
    autoAnimate: z.boolean().default(true),
    telemetryHud: z.boolean().default(true),
  }).default({
    modelType: 'robot-arm' as const,
    wireframe: true,
    rotationSpeed: 1.5,
    autoAnimate: true,
    telemetryHud: true,
  }),

  hero3DEngine: z.object({
    modelType: z.string().default('kinematic_manipulator_arm'),
    enableRaycasting: z.boolean().default(true),
    explodedStages: z.array(z.string()).default(['0%', '33%', '66%', '100%']),
  }).optional(),

  motionTokens: z.array(z.string()).optional(),

  // Step 5: Visual AI Stylist Prompt & Feature Toggles
  aiStylist: z.object({
    customPrompt: z.string().max(1000).optional().default('Generate high-contrast brutalist UI with real-time WebGL canvas.'),
    enableGSAPAnimations: z.boolean().default(true),
    enableAudioSynthesizer: z.boolean().default(true),
  }).default({
    customPrompt: 'Generate high-contrast brutalist UI with real-time WebGL canvas.',
    enableGSAPAnimations: true,
    enableAudioSynthesizer: true,
  }),
});

export type SwissDesignConfig = {
  presetId: string;
  layoutMode: 'two-column' | 'fullscreen-canvas' | 'split-horizontal';
  compositionId?: string;
  brandName: string;
  tagline: string;
  slogan?: string;
  logoUrl?: string;
  theme: {
    backgroundColor: string;
    primaryColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: 'JetBrains Mono' | 'Space Grotesk' | 'Inter';
  };
  roboticsNode: {
    modelType: 'robot-arm' | 'kinematic-assembler' | 'point-cloud-node' | 'holographic-core' | 'kinematic_manipulator_arm';
    wireframe: boolean;
    rotationSpeed: number;
    autoAnimate: boolean;
    telemetryHud: boolean;
  };
  hero3DEngine?: {
    modelType: string;
    enableRaycasting: boolean;
    explodedStages: string[];
  };
  motionTokens?: string[];
  aiStylist: {
    customPrompt?: string;
    enableGSAPAnimations: boolean;
    enableAudioSynthesizer: boolean;
  };
};

export interface CraftGeneratePayload {
  config: SwissDesignConfig;
  timestamp: string;
  clientId?: string;
}

export interface CraftGenerateResponse {
  success: boolean;
  htmlStream?: string;
  message?: string;
  error?: string;
}
