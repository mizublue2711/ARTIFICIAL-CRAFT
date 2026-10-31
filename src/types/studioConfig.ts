/**
 * ARTIFICIAL CRAFT - Studio Configurator Schema & Types (SSOT)
 * Cybernetic Brutalism, Graphic Precision & Industrial Automation Standards
 */

export type MotionTokenType =
  | 'kinetic-parallax'
  | 'chromatic-aberration'
  | 'text-clipping-reveal'
  | 'magnetic-attraction'
  | 'glitch-flicker';

export type Preset3DModel =
  | 'bipedal-robot'
  | 'industrial-arm'
  | 'drone'
  | 'cyber-monolith';

export type SandboxLanguage =
  | 'typescript'
  | 'python'
  | 'ros2'
  | 'cpp';

export interface ExplodedStages {
  stage0: string;
  stage33: string;
  stage66: string;
  stage100: string;
  [key: string]: string;
}

export interface BentoModulesConfig {
  viewport3d: boolean;
  performanceGraph: boolean;
  interactiveTactileMatrix: boolean;
}

export interface StudioConfigData {
  // Step 1: Brand Identification
  compositionId: string;
  slogan: string;
  logoUrl: string;

  // Step 2: Aesthetic & Visual AI Stylist
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  headlineFont: string;
  codeFont: string;
  motionTokens: MotionTokenType[];

  // Step 3: 3D Engine & Exploded Assembly
  modelType: 'preset' | 'custom';
  presetModel: Preset3DModel;
  customModelUrl: string;
  explodedProgress: number; // 0 to 100
  explodedStages: ExplodedStages;
  raycastingLaser: boolean;

  // Step 4: Telemetry & Bento Grid
  telemetryFps: number;
  torquePrecision: string;
  dofSensorCount: string;
  aiLatency: string;
  bentoModules: BentoModulesConfig;
  spatialPointCloud: boolean;

  // Step 5: Export & Hand-off Dock
  sandboxLanguages: SandboxLanguage[];
}

export const DEFAULT_STUDIO_CONFIG: StudioConfigData = {
  compositionId: 'ARTIFICIAL_CRAFT_UNIT_01',
  slogan: 'Robots for Everyone // Cybernetic Automation',
  logoUrl: 'https://raw.githubusercontent.com/artificial-craft/assets/main/logo-mark.svg',
  backgroundColor: '#09090B',
  primaryColor: '#5322FF',
  accentColor: '#00E5FF',
  headlineFont: 'Space Grotesk',
  codeFont: 'JetBrains Mono',
  motionTokens: [
    'kinetic-parallax',
    'chromatic-aberration',
    'magnetic-attraction',
  ],
  modelType: 'preset',
  presetModel: 'bipedal-robot',
  customModelUrl: '',
  explodedProgress: 33,
  explodedStages: {
    stage0: '0% // Assembled Unibody Core',
    stage33: '33% // Tactical Outer Aerogel Shell',
    stage66: '66% // High-Torque Brushless Motor Core',
    stage100: '100% // Micro Tactile Haptic Sensor Array',
  },
  raycastingLaser: true,
  telemetryFps: 60,
  torquePrecision: '±0.01mm',
  dofSensorCount: '11 DOF',
  aiLatency: '<2ms',
  bentoModules: {
    viewport3d: true,
    performanceGraph: true,
    interactiveTactileMatrix: true,
  },
  spatialPointCloud: true,
  sandboxLanguages: ['typescript', 'python'],
};

export interface PalettePreset {
  id: string;
  label: string;
  category: string;
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  headlineFont: string;
  codeFont: string;
  description: string;
}

export const SIGNATURE_PALETTES: PalettePreset[] = [
  {
    id: 'obsidian-indigo',
    label: 'Obsidian & Indigo',
    category: 'SSOT Signature',
    backgroundColor: '#09090B',
    primaryColor: '#5322FF',
    accentColor: '#00E5FF',
    headlineFont: 'Space Grotesk',
    codeFont: 'JetBrains Mono',
    description: 'The canonical ARTIFICIAL CRAFT brutalist identity. Jet black with high-voltage indigo and cyan telemetry.',
  },
  {
    id: 'titanium-cyan',
    label: 'Titanium & Cyan',
    category: 'Industrial Clean',
    backgroundColor: '#18181B',
    primaryColor: '#00E5FF',
    accentColor: '#5322FF',
    headlineFont: 'Inter',
    codeFont: 'JetBrains Mono',
    description: 'Precision machined aerospace titanium with ultra-bright laser telemetry beams.',
  },
  {
    id: 'cyberpunk-neon',
    label: 'Cyberpunk Neon',
    category: 'High Voltage',
    backgroundColor: '#05050A',
    primaryColor: '#FF0055',
    accentColor: '#00E5FF',
    headlineFont: 'Chakra Petch',
    codeFont: 'JetBrains Mono',
    description: 'Radical contrast cybernetic nightlife with magenta and cyan laser optics.',
  },
  {
    id: 'industrial-amber',
    label: 'Industrial Amber',
    category: 'Heavy Machinery',
    backgroundColor: '#0C0A09',
    primaryColor: '#F59E0B',
    accentColor: '#10B981',
    headlineFont: 'Space Grotesk',
    codeFont: 'JetBrains Mono',
    description: 'Hazard automation yellow paired with positive telemetry emerald.',
  },
  {
    id: 'emerald-tactical',
    label: 'Emerald Tactical',
    category: 'Military Avionics',
    backgroundColor: '#06100B',
    primaryColor: '#10B981',
    accentColor: '#00E5FF',
    headlineFont: 'Syne',
    codeFont: 'JetBrains Mono',
    description: 'Tactical HUD night-vision palette with phosphor greens and radar cyan.',
  },
];

export const AVAILABLE_HEADLINE_FONTS = [
  'Space Grotesk',
  'Inter',
  'Syne',
  'Chakra Petch',
  'Outfit',
  'JetBrains Mono',
];

export const AVAILABLE_CODE_FONTS = [
  'JetBrains Mono',
  'Fira Code',
  'IBM Plex Mono',
  'Roboto Mono',
];

/**
 * Auto-sanitizer fallback:
 * If any field is empty or undefined, automatically inject default ARTIFICIAL CRAFT brand values
 * to guarantee 0% backend errors.
 */
export function sanitizeStudioConfig(input?: Partial<StudioConfigData> | null): StudioConfigData {
  if (!input) return { ...DEFAULT_STUDIO_CONFIG };

  const validHex = (c?: string, fallback = '#09090B') => {
    if (!c || typeof c !== 'string') return fallback;
    const clean = c.trim();
    return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(clean) ? clean : fallback;
  };

  return {
    compositionId: input.compositionId?.trim() || DEFAULT_STUDIO_CONFIG.compositionId,
    slogan: input.slogan?.trim() || DEFAULT_STUDIO_CONFIG.slogan,
    logoUrl: input.logoUrl?.trim() || DEFAULT_STUDIO_CONFIG.logoUrl,
    backgroundColor: validHex(input.backgroundColor, DEFAULT_STUDIO_CONFIG.backgroundColor),
    primaryColor: validHex(input.primaryColor, DEFAULT_STUDIO_CONFIG.primaryColor),
    accentColor: validHex(input.accentColor, DEFAULT_STUDIO_CONFIG.accentColor),
    headlineFont: input.headlineFont?.trim() || DEFAULT_STUDIO_CONFIG.headlineFont,
    codeFont: input.codeFont?.trim() || DEFAULT_STUDIO_CONFIG.codeFont,
    motionTokens: Array.isArray(input.motionTokens) && input.motionTokens.length > 0
      ? input.motionTokens
      : DEFAULT_STUDIO_CONFIG.motionTokens,
    modelType: input.modelType === 'custom' ? 'custom' : 'preset',
    presetModel: (['bipedal-robot', 'industrial-arm', 'drone', 'cyber-monolith'].includes(input.presetModel as string)
      ? input.presetModel
      : DEFAULT_STUDIO_CONFIG.presetModel) as Preset3DModel,
    customModelUrl: input.customModelUrl?.trim() || '',
    explodedProgress: typeof input.explodedProgress === 'number' && !isNaN(input.explodedProgress)
      ? Math.max(0, Math.min(100, Math.round(input.explodedProgress)))
      : DEFAULT_STUDIO_CONFIG.explodedProgress,
    explodedStages: {
      stage0: input.explodedStages?.stage0?.trim() || DEFAULT_STUDIO_CONFIG.explodedStages.stage0,
      stage33: input.explodedStages?.stage33?.trim() || DEFAULT_STUDIO_CONFIG.explodedStages.stage33,
      stage66: input.explodedStages?.stage66?.trim() || DEFAULT_STUDIO_CONFIG.explodedStages.stage66,
      stage100: input.explodedStages?.stage100?.trim() || DEFAULT_STUDIO_CONFIG.explodedStages.stage100,
    },
    raycastingLaser: typeof input.raycastingLaser === 'boolean' ? input.raycastingLaser : DEFAULT_STUDIO_CONFIG.raycastingLaser,
    telemetryFps: typeof input.telemetryFps === 'number' && input.telemetryFps > 0 ? input.telemetryFps : DEFAULT_STUDIO_CONFIG.telemetryFps,
    torquePrecision: input.torquePrecision?.trim() || DEFAULT_STUDIO_CONFIG.torquePrecision,
    dofSensorCount: input.dofSensorCount?.trim() || DEFAULT_STUDIO_CONFIG.dofSensorCount,
    aiLatency: input.aiLatency?.trim() || DEFAULT_STUDIO_CONFIG.aiLatency,
    bentoModules: {
      viewport3d: typeof input.bentoModules?.viewport3d === 'boolean' ? input.bentoModules.viewport3d : true,
      performanceGraph: typeof input.bentoModules?.performanceGraph === 'boolean' ? input.bentoModules.performanceGraph : true,
      interactiveTactileMatrix: typeof input.bentoModules?.interactiveTactileMatrix === 'boolean' ? input.bentoModules.interactiveTactileMatrix : true,
    },
    spatialPointCloud: typeof input.spatialPointCloud === 'boolean' ? input.spatialPointCloud : DEFAULT_STUDIO_CONFIG.spatialPointCloud,
    sandboxLanguages: Array.isArray(input.sandboxLanguages) && input.sandboxLanguages.length > 0
      ? input.sandboxLanguages
      : DEFAULT_STUDIO_CONFIG.sandboxLanguages,
  };
}

/**
 * Zod-compatible validation schema implementation
 * Supports .parse() and .safeParse() conforming to Swiss Tactical Design Rules.
 */
export interface ZodIssue {
  path: (string | number)[];
  message: string;
}

export class ZodError extends Error {
  issues: ZodIssue[];
  constructor(issues: ZodIssue[]) {
    super(`Validation failed with ${issues.length} error(s): ${issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
    this.name = 'ZodError';
    this.issues = issues;
  }
}

export const SwissDesignConfigSchema = {
  parse: (raw: unknown): StudioConfigData => {
    const issues: ZodIssue[] = [];

    if (!raw || typeof raw !== 'object') {
      throw new ZodError([{ path: ['root'], message: 'Config payload must be a non-null object' }]);
    }

    const data = raw as Record<string, unknown>;

    if (typeof data.compositionId !== 'string' || !data.compositionId.trim()) {
      issues.push({ path: ['compositionId'], message: 'Project Name (compositionId) is required' });
    }

    if (typeof data.slogan !== 'string' || !data.slogan.trim()) {
      issues.push({ path: ['slogan'], message: 'Brand Slogan is required' });
    }

    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    if (typeof data.backgroundColor !== 'string' || !hexRegex.test(data.backgroundColor)) {
      issues.push({ path: ['backgroundColor'], message: 'Background color must be a valid HEX color code' });
    }
    if (typeof data.primaryColor !== 'string' || !hexRegex.test(data.primaryColor)) {
      issues.push({ path: ['primaryColor'], message: 'Primary color must be a valid HEX color code' });
    }
    if (typeof data.accentColor !== 'string' || !hexRegex.test(data.accentColor)) {
      issues.push({ path: ['accentColor'], message: 'Accent color must be a valid HEX color code' });
    }

    if (issues.length > 0) {
      throw new ZodError(issues);
    }

    // Pass through sanitizer to ensure 100% complete normalized shape
    return sanitizeStudioConfig(data as Partial<StudioConfigData>);
  },

  safeParse: (raw: unknown): { success: true; data: StudioConfigData } | { success: false; error: ZodError } => {
    try {
      const data = SwissDesignConfigSchema.parse(raw);
      return { success: true, data };
    } catch (err) {
      if (err instanceof ZodError) {
        return { success: false, error: err };
      }
      return {
        success: false,
        error: new ZodError([{ path: ['root'], message: String(err) }]),
      };
    }
  },
};
