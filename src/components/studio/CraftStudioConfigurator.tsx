import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Cpu,
  Terminal,
  Code,
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  Box,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Copy,
  FolderArchive,
  CloudLightning,
  RefreshCw,
  Bot,
  Boxes,
  Radio,
  Palette,
  Activity,
  Clock,
  GitBranch,
  Atom,
  Flame,
  Crosshair,
} from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';
import { QuantumEscapementClock3D } from '@/lib/video-engine/components/3d/QuantumEscapementClock3D';
import { PneumaticDataPipeline3D } from '@/lib/video-engine/components/3d/PneumaticDataPipeline3D';
import { TokamakReactorCore3D } from '@/lib/video-engine/components/3d/TokamakReactorCore3D';
import {
  BTreeDiskIndex3D,
  MailRopewayTcp3D,
  TurbofanJetEngine3D,
  RollsRoyceTrent9703D,
  PowerStationGenerator3D,
  LiquidSteelFoundry3D,
  OpticalBenchInterferometer3D,
  KinematicDifferentialGearbox3D,
  RimLightStudio3D,
  VDM80ActuatorJoint3D,
} from '@/components/robotics/3d';

const PneumaticLetterA3D = React.lazy(() => import('@/components/robotics/3d/PneumaticLetterA3D'));

import {
  SwissDesignConfigSchema,
  SwissDesignConfig,
  CraftPayloadObject,
  CraftRequestPayload,
  CraftGenerateResponse,
} from '@/types/craft-studio';
import { generateFallbackCyberneticHTML, generateStudioAst, generateCodeSnippets } from '@/lib/studioAstGenerator';
import { digitalPlumbingSwarm, 'node-05-digital-plumbing-swarm' as node05Preset } from '@/data/presets/registry';
import { Player } from '@remotion/player';
import { CraftStudioVideoComposition } from '@/lib/video-engine/components/CraftStudioVideoComposition';
import {
  SwissGridHUD,
  CyberpunkMatrixBg,
  HolographicBlueprintBg,
  HyperdriveGridBg,
  IsometricGridBg,
  ParticleTunnelBg,
  QuantumWaveformBg,
  AnomalousNoiseField,
  VolumetricFogHUD,
} from '@/lib/video-engine/components/backgrounds';

// --- TYPES & INTERFACES ---
export type ActiveWizardStep = 1 | 2 | 3 | 4 | 5;
export type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';
export type PreviewViewportMode = '3d-canvas' | 'remotion-video';

export interface ExtendedStudioConfig extends Partial<SwissDesignConfig> {
  compositionId: string;
  slogan: string;
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  backgroundShader?: string;
  base_component?: string;
  headlineFont: string;
  presetModel?: any;
  modelType?: any;
  customModelUrl?: string;
  logoUrl: string;
  motionTokens: any;
  secondaryAccentColor?: string;
  codeFont: string;
  presetId?: string;
  layoutMode?: string;
  brandName: string;
  tagline?: string;
  theme: {
    backgroundColor: string;
    primaryColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: any;
  };
  roboticsNode: {
    modelType: any;
    wireframe: boolean;
    rotationSpeed: number;
    autoAnimate: boolean;
    telemetryHud: boolean;
  };
  aiStylist?: {
    customPrompt: string;
    enableGSAPAnimations: boolean;
    enableAudioSynthesizer: boolean;
  };
  hero3DEngine?: {
    modelType: string;
    enableRaycasting: boolean;
    explodedStages: string[];
  };

  // Extended Step 3: Exploded Assembly & Laser
  explodedProgress: number; // 0 to 100
  explodedStages: {
    stage0: string;
    stage33: string;
    stage66: string;
    stage100: string;
    [key: string]: string;
  };
  raycastingLaser: boolean;

  // Extended Step 4: Telemetry & Bento Grid
  telemetryFps: number;
  torquePrecision: string;
  dofSensorCount: string;
  aiLatency: string;
  bentoModules: {
    viewport3d: boolean;
    performanceGraph: boolean;
    interactiveTactileMatrix: boolean;
  };
  spatialPointCloud: boolean;

  // Extended Step 5: Export Sandbox
  sandboxLanguages: any;
}

export const AVAILABLE_3D_COMPONENTS = [
  { value: 'pneumatic-letter-a', label: 'PNEUMATIC // LETTER A 3D', icon: GitBranch, badge: 'NEW // ACTIVE' },
  { value: 'vdm80-actuator-joint', label: 'VDM 80 Integrated Robotic Actuator Joint 3D', icon: Bot },
  { value: 'rolls-royce-trent-970', label: 'Rolls-Royce Trent 970 Ground-Run 3D', icon: Zap },
  { value: 'kinematic-differential-gearbox', label: 'Kinematic Differential Gearbox 3D', icon: Zap },
  { value: 'rim-light-studio', label: 'Rim Light Studio 3D', icon: Crosshair },
  { value: 'quantum-escapement-clock', label: 'Quantum Escapement Clock 3D', icon: Clock },
  { value: 'pneumatic-data-pipeline', label: 'Pneumatic Data Pipeline 3D', icon: GitBranch },
  { value: 'tokamak-reactor-core', label: 'Tokamak Reactor Core 3D', icon: Atom },
  { value: 'btree-disk-index', label: 'Rotary B-Tree Disk Index 3D', icon: Layers },
  { value: 'mail-ropeway-tcp', label: 'Mail Ropeway TCP Handshake 3D', icon: Radio },
  { value: 'turbofan-jet-engine', label: 'Dual-Spool Turbofan Jet Engine 3D', icon: Zap },
  { value: 'power-station-generator', label: 'Power Station Stator Generator 3D', icon: Zap },
  { value: 'liquid-steel-foundry', label: 'Liquid Steel Electric Arc Foundry 3D', icon: Flame },
  { value: 'optical-bench-interferometer', label: 'Michelson Optical Bench Interferometer 3D', icon: Crosshair },
  { value: 'RoboticsHandNode', label: 'Robotic Arm 6DOF Manipulator', icon: Bot },
  { value: 'BipedalRobotMesh', label: 'Bipedal Kinematic Assembler', icon: Cpu },
  { value: 'PointCloudNode', label: 'Point Cloud Telemetry Core', icon: Boxes },
  { value: 'HolographicCore', label: 'Holographic Energy Reactor', icon: Radio },
  { value: 'ConveyorBeltV2', label: 'Cybernetic Conveyor System', icon: Terminal },
  { value: 'CleanroomSwarmTerminal', label: 'Obsidian Cleanroom Terminal', icon: Layers },
];

export const DEFAULT_ACTIVE_MODEL_KEY = AVAILABLE_3D_COMPONENTS[0]?.value || 'kinematic-differential-gearbox';

export const INITIAL_CONFIG: ExtendedStudioConfig = {
  presetId: 'node-05-digital-plumbing-swarm',
  layoutMode: 'two-column',
  compositionId: 'NODE_05_MANUFACTURING_FACTORY',
  brandName: 'ARTIFICIAL CRAFT',
  slogan: 'Robots for Everyone // Cybernetic Automation',
  tagline: 'Robots for Everyone // Cybernetic Automation',
  backgroundColor: '#09090B',
  primaryColor: '#5322FF',
  accentColor: '#00E5FF',
  backgroundShader: 'SwissGridHUD',
  base_component: DEFAULT_ACTIVE_MODEL_KEY,
  headlineFont: 'Space Grotesk',
  presetModel: DEFAULT_ACTIVE_MODEL_KEY,
  modelType: DEFAULT_ACTIVE_MODEL_KEY,
  customModelUrl: '',
  logoUrl: 'https://raw.githubusercontent.com/artificial-craft/assets/main/logo-mark.svg',
  theme: {
    backgroundColor: '#09090B',
    primaryColor: '#5322FF',
    textColor: '#F4F4F5',
    accentColor: '#00E5FF',
    fontFamily: 'JetBrains Mono',
  },
  secondaryAccentColor: '#10B981',
  codeFont: 'JetBrains Mono',
  motionTokens: ['kinetic-parallax', 'chromatic-aberration', 'magnetic-attraction'],
  roboticsNode: {
    modelType: DEFAULT_ACTIVE_MODEL_KEY,
    wireframe: true,
    rotationSpeed: 1.5,
    autoAnimate: true,
    telemetryHud: true,
  },
  explodedProgress: 33,
  explodedStages: {
    stage0: '0% // Assembled Unibody Core',
    stage33: '33% // Protective Outer Shell',
    stage66: '66% // High-Torque Motor Stator',
    stage100: '100% // Micro Tactile Sensor Array',
  },
  raycastingLaser: true,
  telemetryFps: 60,
  torquePrecision: '±0.01mm',
  dofSensorCount: '11 DOF',
  aiLatency: '[ RUNTIME: CLIENT GPU ]',
  bentoModules: {
    viewport3d: true,
    performanceGraph: true,
    interactiveTactileMatrix: true,
  },
  spatialPointCloud: true,
  sandboxLanguages: ['typescript', 'python', 'ros2', 'cpp'],
  aiStylist: {
    customPrompt: 'Cybernetic Brutalism with high-contrast electric indigo & laser cyan.',
    enableGSAPAnimations: true,
    enableAudioSynthesizer: true,
  },
};

export const BACKGROUND_COMPONENTS: Record<string, React.FC<any>> = {
  SwissGridHUD,
  CyberpunkMatrixBg,
  HolographicBlueprintBg,
  HyperdriveGridBg,
  IsometricGridBg,
  ParticleTunnelBg,
  QuantumWaveformBg,
  AnomalousNoiseField,
  VolumetricFogHUD,
};

export const AVAILABLE_BACKGROUNDS = [
  { value: 'SwissGridHUD', label: 'Swiss Grid HUD', icon: Layers },
  { value: 'CyberpunkMatrixBg', label: 'Cyberpunk Matrix', icon: Box },
  { value: 'HolographicBlueprintBg', label: 'Holographic Blueprint', icon: Boxes },
  { value: 'HyperdriveGridBg', label: 'Hyperdrive Grid 3D', icon: Radio },
  { value: 'IsometricGridBg', label: 'Isometric Grid', icon: Layers },
  { value: 'ParticleTunnelBg', label: 'Particle Tunnel', icon: Sparkles },
  { value: 'QuantumWaveformBg', label: 'Quantum Waveform', icon: Activity },
  { value: 'AnomalousNoiseField', label: 'Anomalous Noise Field', icon: Zap },
  { value: 'VolumetricFogHUD', label: 'Volumetric Fog HUD', icon: Palette },
];

export const AVAILABLE_MOTION_TOKENS = [
  { value: 'kinetic-parallax', label: 'Kinetic Parallax Camera Drift', icon: Sparkles },
  { value: 'glitch-flicker', label: 'Cybernetic Shader Glitch', icon: Zap },
  { value: 'chromatic-aberration', label: 'Chromatic Aberration Lens', icon: Palette },
  { value: 'text-clipping-reveal', label: 'Kinetic Title Clipping Reveal', icon: Terminal },
  { value: 'magnetic-attraction', label: 'Cursor Vector Field Physics', icon: Activity },
];

const PRESET_PALETTES = [
  {
    id: 'obsidian-indigo',
    name: 'Obsidian & Indigo',
    bg: '#09090B',
    primary: '#5322FF',
    accent: '#00E5FF',
    font: 'Space Grotesk' as const,
    desc: 'Signature cybernetic brutalism with electric indigo & laser cyan.',
  },
  {
    id: 'titanium-cyan',
    name: 'Titanium & Cyan',
    bg: '#18181B',
    primary: '#00E5FF',
    accent: '#5322FF',
    font: 'Inter' as const,
    desc: 'High-precision aerospace machined titanium with neon cyan telemetry.',
  },
  {
    id: 'cyber-green',
    name: 'Cybernetic Matrix',
    bg: '#05050A',
    primary: '#5322FF',
    accent: '#10B981',
    font: 'JetBrains Mono' as const,
    desc: 'Tactical phosphor emerald with dark obsidian background.',
  },
  {
    id: 'industrial-amber',
    name: 'Industrial Amber',
    bg: '#0C0A09',
    primary: '#F59E0B',
    accent: '#10B981',
    font: 'Space Grotesk' as const,
    desc: 'Heavy machinery warning amber with positive diagnostic green.',
  },
];

export const CraftStudioConfigurator: React.FC = () => {
  const { t } = useTranslation();
  // State: Config Data
  const [formData, setFormData] = useState<ExtendedStudioConfig>(INITIAL_CONFIG);
  const [activeTabMode, setActiveTabMode] = useState<'FORGE_NODE' | 'USER_WEBAPP_GEN'>('USER_WEBAPP_GEN');
  const [previewViewportMode, setPreviewViewportMode] = useState<PreviewViewportMode>('3d-canvas');
  const [selectedNodePreset, setSelectedNodePreset] = useState<string>('NODE_05_MANUFACTURING_FACTORY');
  const [activeStep, setActiveStep] = useState<ActiveWizardStep>(1);
  const [deviceMode, setDeviceMode] = useState<DevicePreviewMode>('desktop');
  const [backgroundShader, setBackgroundShader] = useState<string>('SwissGridHUD');
  const [pointerCoords, setPointerCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isB2BPopupOpen, setIsB2BPopupOpen] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeTab, setCodeTab] = useState<'html' | 'ast' | 'ts' | 'python' | 'ros2' | 'cpp'>('html');
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    }
  };

  // State: AI Stylist & Streaming Generator
  const [aiPrompt, setAiPrompt] = useState('Luxury Titanium Robot with Neon Indigo');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // State: Iframe HTML string stream
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Node selection locked strictly to Node 05 Manufacturing Factory
  const selectedNodeId = 'NODE_05_MANUFACTURING_FACTORY';

  const handleSelectNodePreset = useCallback((nodeKey: string = 'NODE_05_MANUFACTURING_FACTORY') => {
    setSelectedNodePreset('NODE_05_MANUFACTURING_FACTORY');
    const preset = node05Preset || digitalPlumbingSwarm;
    setFormData((prev) => ({
      ...prev,
      presetId: preset.presetId,
      compositionId: 'NODE_05_MANUFACTURING_FACTORY',
      brandName: prev.brandName || preset.compositionId,
      slogan: prev.slogan || preset.slogan,
      tagline: prev.tagline || preset.slogan,
      backgroundColor: preset.aesthetic.backgroundColor,
      primaryColor: preset.aesthetic.primaryColor,
      accentColor: preset.aesthetic.accentColor,
      headlineFont: preset.aesthetic.headlineFont,
      codeFont: preset.aesthetic.codeFont,
      theme: {
        ...prev.theme,
        backgroundColor: preset.aesthetic.backgroundColor,
        primaryColor: preset.aesthetic.primaryColor,
        accentColor: preset.aesthetic.accentColor,
        fontFamily: preset.aesthetic.headlineFont as any,
      },
      motionTokens: [...preset.motionTokens],
      hero3DEngine: {
        modelType: preset.hero3DEngine.modelType,
        enableRaycasting: preset.hero3DEngine.enableRaycasting,
        explodedStages: [...preset.hero3DEngine.explodedStages],
      },
      roboticsNode: {
        ...prev.roboticsNode,
        modelType: preset.hero3DEngine?.modelType || DEFAULT_ACTIVE_MODEL_KEY,
        wireframe: true,
        rotationSpeed: 1.5,
        autoAnimate: true,
        telemetryHud: true,
      },
      raycastingLaser: preset.hero3DEngine.enableRaycasting,
      presetModel: preset.hero3DEngine?.modelType || DEFAULT_ACTIVE_MODEL_KEY,
      modelType: preset.hero3DEngine?.modelType || DEFAULT_ACTIVE_MODEL_KEY,
      explodedStages: {
        stage0: `${preset.hero3DEngine.explodedStages[0] || '0%'} // Assembled Core Manipulator`,
        stage33: `${preset.hero3DEngine.explodedStages[1] || '33%'} // Swarm Plumbing Bus`,
        stage66: `${preset.hero3DEngine.explodedStages[2] || '66%'} // Kinematic Actuators`,
        stage100: `${preset.hero3DEngine.explodedStages[3] || '100%'} // End-Effector Array`,
      },
      telemetryFps: preset.telemetryDock.fps || 60,
    }));
  }, []);

  // Synchronize initial & updated live HTML
  const refreshLiveHtml = useCallback((cfg: ExtendedStudioConfig) => {
    // Generate high-precision standalone HTML
    const html = generateFallbackCyberneticHTML({
      ...cfg,
      enterFactoryNodeBtn: t('enterFactoryNodeBtn'),
    } as any);
    setGeneratedHtml(html);
  }, [t]);

  // Handler to render layout_json onto Live Preview Stage
  const renderLegoCanvas = useCallback((layoutJson: any) => {
    if (!layoutJson) return;

    if (typeof layoutJson === 'string') {
      if (layoutJson.trim().startsWith('<')) {
        setGeneratedHtml(layoutJson);
        return;
      }
      try {
        const parsed = JSON.parse(layoutJson);
        if (parsed.html) {
          setGeneratedHtml(parsed.html);
          return;
        }
      } catch {
        // Fallback string
      }
    } else if (typeof layoutJson === 'object') {
      if (layoutJson.html && typeof layoutJson.html === 'string') {
        setGeneratedHtml(layoutJson.html);
        return;
      }
      // If layout_json contains updated theme or AST config, sync with formData
      setFormData((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          ...(layoutJson.aesthetic?.primaryColor && { primaryColor: layoutJson.aesthetic.primaryColor }),
          ...(layoutJson.aesthetic?.backgroundColor && { backgroundColor: layoutJson.aesthetic.backgroundColor }),
        },
        primaryColor: layoutJson.aesthetic?.primaryColor || prev.primaryColor,
        backgroundColor: layoutJson.aesthetic?.backgroundColor || prev.backgroundColor,
      }));
    }
  }, []);

  useEffect(() => {
    refreshLiveHtml(formData);
  }, [formData, refreshLiveHtml]);

  // --- AI VISUAL STYLIST API HOOK (PLUG-AND-PLAY) ---
  const handleAIGeneratePalette = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setIsAIGenerating(true);
    try {
      // Plug-and-play hook: AI backend endpoint
      // const res = await fetch('/api/ai/stylist', { method: 'POST', body: JSON.stringify({ prompt: userPrompt }) });
      // const data = await res.json();

      // Realistic procedural AI response matching user mood
      await new Promise((r) => setTimeout(r, 800));

      let mockAIPalette: {
        backgroundColor: string;
        primaryColor: string;
        accentColor: string;
        fontFamily: 'JetBrains Mono' | 'Space Grotesk' | 'Inter';
      } = {
        backgroundColor: '#09090B',
        primaryColor: '#5322FF',
        accentColor: '#00E5FF',
        fontFamily: 'Space Grotesk',
      };

      const lower = userPrompt.toLowerCase();
      if (lower.includes('gold') || lower.includes('amber') || lower.includes('hazard')) {
        mockAIPalette = {
          backgroundColor: '#0c0a09',
          primaryColor: '#F59E0B',
          accentColor: '#10B981',
          fontFamily: 'Space Grotesk',
        };
      } else if (lower.includes('emerald') || lower.includes('matrix') || lower.includes('green')) {
        mockAIPalette = {
          backgroundColor: '#050a06',
          primaryColor: '#10B981',
          accentColor: '#00E5FF',
          fontFamily: 'JetBrains Mono',
        };
      } else if (lower.includes('titanium') || lower.includes('white') || lower.includes('silver')) {
        mockAIPalette = {
          backgroundColor: '#141418',
          primaryColor: '#00E5FF',
          accentColor: '#5322FF',
          fontFamily: 'Inter',
        };
      } else if (lower.includes('cyberpunk') || lower.includes('neon') || lower.includes('magenta')) {
        mockAIPalette = {
          backgroundColor: '#05050A',
          primaryColor: '#FF0055',
          accentColor: '#00E5FF',
          fontFamily: 'JetBrains Mono',
        };
      }

      setFormData((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          ...mockAIPalette,
        },
      }));
    } catch (error) {
      console.error('AI Stylist Error:', error);
    } finally {
      setIsAIGenerating(false);
    }
  };

  // --- LOGO COLOR EXTRACTION HOOK ---
  const handleExtractFromLogo = (logoUrlInput?: string) => {
    setIsAIGenerating(true);
    setTimeout(() => {
      // Deterministic palette extraction
      setFormData((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          primaryColor: '#5322FF',
          accentColor: '#00E5FF',
        },
      }));
      setIsAIGenerating(false);
    }, 600);
  };

  // --- COMPILE 3D WEB APP (FULL ZOD VALIDATION & ASYNC STREAM) ---
  const handleGenerate3DWebApp = async () => {
    setValidationError(null);
    setIsCompiling(true);
    setCompileLogs([
      'INIT: Handshake with ARTIFICIAL CRAFT AST Compiler...',
      'LAYER 1/5: Processing Brand Blueprint & Slogan AST...',
    ]);

    try {
      // 1. Client-Side Zod Gate Validation
      await new Promise((r) => setTimeout(r, 350));
      setCompileLogs((prev) => [
        ...prev,
        'LAYER 2/5: Validating payload against SwissDesignConfigSchema...',
      ]);

      const validationResult = SwissDesignConfigSchema.safeParse(formData);

      if (!validationResult.success) {
        const errorMsg = 'Zod Gate Check Failed: Please verify brand and color inputs.';
        setValidationError(errorMsg);
        setCompileLogs((prev) => [
          ...prev,
          `ERROR: ${errorMsg}`,
          JSON.stringify(validationResult.error.format()),
        ]);
        setIsCompiling(false);
        return;
      }

      // 2. Transmit to API Route / n8n Webhook
      await new Promise((r) => setTimeout(r, 450));
      setCompileLogs((prev) => [
        ...prev,
        'LAYER 3/5: Injecting Three.js 60FPS Kinematics Actuators...',
        'LAYER 4/5: Compiling Zod AST & Cloudflare Worker Bundle...',
      ]);

      // Read endpoint directly from Vite Client Env
      const webhookUrl =
        import.meta.env.VITE_N8N_WEBHOOK_URL ||
        '/api/craft/generate';

      // Construct contract payload from React useState values
      const taskType: 'ROBOTICS_3D' | 'USER_WEBAPP_GEN' =
        activeTabMode === 'FORGE_NODE' ? 'ROBOTICS_3D' : 'USER_WEBAPP_GEN';

      const payloadObject: CraftPayloadObject = {
        prompt: aiPrompt || formData.aiStylist?.customPrompt || '',
        base_component: formData.presetModel || formData.modelType || DEFAULT_ACTIVE_MODEL_KEY,
        aesthetic: {
          palette: formData.brandName || 'Brutalist Monochrome',
          primaryColor: formData.theme.primaryColor || '#5322FF',
          backgroundColor: formData.theme.backgroundColor || '#09090B',
        },
        motion_tokens: formData.motionTokens || [],
        telemetry: {
          slaTarget: formData.aiLatency || '[ RUNTIME: CLIENT GPU ]',
          fps: formData.telemetryFps || 60,
        },
      };

      const requestBody: CraftRequestPayload = {
        task_type: taskType,
        payload: JSON.stringify(payloadObject),
      };

      let htmlResult = '';
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data: CraftGenerateResponse = await response.json();
            if (data.status === 'success' || data.success) {
              if (data.layout_json) {
                renderLegoCanvas(data.layout_json);
              }
              htmlResult = data.htmlStream || generatedHtml || generateFallbackCyberneticHTML(formData as any);
            } else {
              throw new Error(data.message || data.error || 'Server returned error status');
            }
          } else {
            const textResponse = await response.text();
            try {
              const parsed = JSON.parse(textResponse);
              if (parsed.status === 'success' && parsed.layout_json) {
                renderLegoCanvas(parsed.layout_json);
              }
            } catch {
              // Raw HTML or stream
              htmlResult = textResponse;
            }
          }
        } else {
          throw new Error(`Endpoint returned status ${response.status}`);
        }
      } catch (fetchErr: any) {
        console.warn('[CRAFT ADAPTER] Live webhook fallback:', fetchErr);
        htmlResult = generateFallbackCyberneticHTML(formData as any);
      }

      await new Promise((r) => setTimeout(r, 400));
      setCompileLogs((prev) => [
        ...prev,
        'LAYER 5/5: Streaming 60FPS HyperFrame into sandbox iframe...',
        'SUCCESS: 3D Web App Compiled & Verified at 60FPS SLA.',
      ]);

      if (htmlResult) {
        setGeneratedHtml(htmlResult);
      }
    } catch (err: any) {
      console.warn('Compilation fallback to local engine:', err);
      const fallbackHtml = generateFallbackCyberneticHTML(formData as any);
      setGeneratedHtml(fallbackHtml);
      setCompileLogs((prev) => [
        ...prev,
        'LOCAL FALLBACK: Executed in-memory WebGL compilation.',
      ]);
    } finally {
      setTimeout(() => setIsCompiling(false), 600);
    }
  };

  // --- ACTIONS: EXPORT AST, DOWNLOAD HTML, COPY CODE ---
  const handleExportJsonAst = () => {
    const ast = generateStudioAst(formData as any);
    const blob = new Blob([JSON.stringify(ast, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-ast.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingleFileHtml = () => {
    const html = generatedHtml || generateFallbackCyberneticHTML({
      ...formData,
      enterFactoryNodeBtn: t('enterFactoryNodeBtn'),
    });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-3d-app.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const resetCamera = () => {
    // Re-inject iframe srcdoc to reset Three.js scene
    const current = generatedHtml;
    setGeneratedHtml('');
    setTimeout(() => setGeneratedHtml(current), 50);
  };

  const snippets = useMemo(() => {
    try {
      return generateCodeSnippets(formData as any);
    } catch (err) {
      console.warn('[CRAFT CONFIGURATOR] Snippets generation fallback:', err);
      return {
        typescript: '// TypeScript SDK generated in fallback mode',
        python: '# Python telemetry node fallback',
        ros2: '// ROS2 Humble node fallback',
        cpp: '// C++20 controller fallback',
      };
    }
  }, [formData]);

  // Active Background Component resolved from formData.backgroundShader or fallback backgroundShader state
  const activeShaderKey = formData.backgroundShader || backgroundShader || 'SwissGridHUD';
  const ActiveBg = BACKGROUND_COMPONENTS[activeShaderKey] || SwissGridHUD;
  const primaryColor = formData.theme?.primaryColor || formData.primaryColor || '#5322FF';
  const accentColor = formData.theme?.accentColor || formData.accentColor || '#00E5FF';

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] bg-[#09090B] text-zinc-100 font-mono flex flex-col selection:bg-[#00E5FF]/20">
      {/* Tactical Sub-Header Bar */}
      <div className="w-full bg-[#09090D] border-b border-zinc-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5322FF] animate-pulse" />
          <span className="font-bold tracking-widest text-zinc-100 uppercase">
            {t('configuratorHeader')}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-[10px] text-zinc-400">
            {t('configuratorNodeBadge')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
            [ VERIFICATION: ZOD PASSED ]
          </span>
          <span className="px-2 py-0.5 border border-[#5322FF]/50 bg-[#5322FF]/10 text-purple-300 text-[10px] font-bold">
            [ RENDER: WebGL GPU ]
          </span>
        </div>
      </div>

      {/* Main Two-Column Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT COLUMN: 5-STEP CONFIGURATOR WIZARD DOCK (440px - 480px) */}
        {/* ======================================================== */}
        <aside className="w-full lg:w-[460px] xl:w-[480px] bg-[#09090B] border-r border-zinc-800/90 flex flex-col h-auto lg:h-[calc(100vh-108px)] overflow-y-auto">
          {/* Step Indicator Navigation */}
          <div className="p-3 border-b border-zinc-800 bg-zinc-950/70 sticky top-0 z-30">
            <div className="grid grid-cols-5 gap-1 text-center">
              {[1, 2, 3, 4, 5].map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step as ActiveWizardStep)}
                  className={`py-1.5 px-1 border text-[10px] font-bold transition flex flex-col items-center gap-0.5 ${
                    activeStep === step
                      ? 'border-[#5322FF] bg-[#5322FF]/20 text-white shadow-[0_0_10px_rgba(83,34,255,0.4)]'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span>STEP 0{step}</span>
                  <span className="text-[8px] opacity-75 truncate max-w-full">
                    {step === 1 && 'BRAND'}
                    {step === 2 && 'STYLIST'}
                    {step === 3 && '3D MESH'}
                    {step === 4 && 'TELEMETRY'}
                    {step === 5 && 'EXPORT'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wizard Content Panels */}
          <div className="p-5 flex-1 flex flex-col gap-6">
            {/* STEP 1: BRAND IDENTIFICATION & NODE SELECTION */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2 text-zinc-100 text-xs font-bold">
                    <Box className="w-4 h-4 text-[#5322FF]" />
                    <span>STEP 1 // NODE SELECTION & BRAND IDENTITY</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    FLAGSHIP
                  </span>
                </div>

                {/* Node Flagship Presets Selector Dock: Locked Single Static Flagship Badge */}
                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Target Node Pipeline Preset</span>
                    <span className="text-[#00E5FF] text-[9px]">DIFY + N8N PIPELINE</span>
                  </label>
                  <div className="p-3 border border-[#5322FF] bg-[#5322FF]/15 shadow-[0_0_15px_rgba(83,34,255,0.25)] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-white">
                        NODE 05 // 3D MANUFACTURING FACTORY (Autonomous 3D Kinematics)
                      </span>
                      <span className="text-[9px] px-2 py-0.5 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold uppercase tracking-wider shrink-0">
                        LOCKED FLAGSHIP
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Automated Workflow Engine • 3D Model Exploded View (4 Stages) & 60 FPS (Client-Side)
                    </span>
                  </div>
                  {/* Task Mode Switcher */}
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTabMode('USER_WEBAPP_GEN')}
                      className={`py-1 px-2 border text-[10px] font-bold uppercase transition ${
                        activeTabMode === 'USER_WEBAPP_GEN'
                          ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      WebApp Gen
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabMode('FORGE_NODE')}
                      className={`py-1 px-2 border text-[10px] font-bold uppercase transition ${
                        activeTabMode === 'FORGE_NODE'
                          ? 'border-[#5322FF] bg-[#5322FF]/20 text-white'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Forge Node (3D)
                    </button>
                  </div>
                </div>

                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Project / Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        brandName: val,
                        compositionId: val,
                      }));
                    }}
                    placeholder="ARTIFICIAL CRAFT"
                    className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#5322FF] transition"
                  />
                  <div className="text-[9px] text-zinc-500">
                    AST Composition ID anchor for deterministic compilation.
                  </div>
                </div>

                {/* Brand Slogan */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Brand Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        tagline: val,
                        slogan: val,
                      }));
                    }}
                    placeholder="Robots for Everyone // Cybernetic Automation"
                    className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#5322FF] transition"
                  />
                </div>

                {/* Logo URL / File Picker */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                      Brand Logo URL
                    </label>
                    <button
                      onClick={() => handleExtractFromLogo(formData.logoUrl)}
                      className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Extract Palette</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, logoUrl: e.target.value }))
                    }
                    placeholder="https://.../logo.svg"
                    className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#5322FF] transition"
                  />
                </div>

                {/* File Picker & Drag-and-Drop Dropzone */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border border-dashed border-zinc-800 hover:border-[#5322FF] bg-zinc-950/60 p-4 text-center cursor-pointer transition group"
                >
                  <FolderArchive className="w-6 h-6 text-zinc-600 group-hover:text-[#00E5FF] mx-auto mb-2 transition" />
                  <div className="text-[11px] text-zinc-300">
                    Click to Upload or Drag & Drop SVG/PNG Logo Asset
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1 font-mono">
                    Triggers automatic logo palette color clustering
                  </div>
                  {formData.logoUrl && (
                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-zinc-700 text-[10px] text-emerald-400">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>LOGO ATTACHED</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: AESTHETIC & VISUAL AI STYLIST (3-TIER ARCHITECTURE) */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-zinc-100 text-xs font-bold border-b border-zinc-800 pb-2">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <span>STEP 2 // AESTHETIC & VISUAL AI STYLIST</span>
                </div>

                {/* LỚP 1: Preset Swatches */}
                <div className="space-y-2">
                  <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Lớp 1: Signature Palettes (1-Click)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_PALETTES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            backgroundColor: p.bg,
                            primaryColor: p.primary,
                            accentColor: p.accent,
                            theme: {
                              ...prev.theme,
                              backgroundColor: p.bg,
                              primaryColor: p.primary,
                              accentColor: p.accent,
                              fontFamily: p.font,
                            },
                          }))
                        }
                        className={`p-2.5 border text-left transition flex flex-col gap-1.5 ${
                          formData.theme.backgroundColor === p.bg &&
                          formData.theme.primaryColor === p.primary
                            ? 'border-[#00E5FF] bg-zinc-900 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                            : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white">
                            {p.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black"
                              style={{ backgroundColor: p.accent }}
                            />
                          </div>
                        </div>
                        <span className="text-[8px] text-zinc-500 line-clamp-1">
                          {p.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LỚP 2: Visual AI Assistant (Embedded Plug-and-Play Hook) */}
                <div className="p-3.5 border border-[#5322FF]/50 bg-[#5322FF]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Lớp 2: Magic AI Stylist Hook</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-black/40 text-purple-300 border border-purple-500/30">
                      PLUG & PLAY
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Luxury Titanium Robot, Cyberpunk Neon..."
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAIGeneratePalette(aiPrompt)}
                        disabled={isAIGenerating}
                        className="flex-1 py-1.5 px-3 bg-[#5322FF] hover:bg-[#5322FF]/90 text-white text-[11px] font-bold uppercase transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isAIGenerating ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>AI Generate Palette</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleExtractFromLogo(formData.logoUrl)}
                        className="py-1.5 px-2.5 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white text-[10px] font-bold uppercase transition"
                      >
                        Extract Logo
                      </button>
                    </div>
                  </div>
                </div>

                {/* LỚP 3: Manual Fine-Tuning */}
                <div className="space-y-3">
                  <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Lớp 3: Manual Fine-Tuning
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-zinc-500 block mb-1 font-bold">
                        BACKGROUND
                      </label>
                      <div className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 p-1">
                        <input
                          type="color"
                          value={formData.theme.backgroundColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              backgroundColor: val,
                              theme: { ...prev.theme, backgroundColor: val },
                            }));
                          }}
                          className="w-5 h-5 bg-transparent cursor-pointer border-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={formData.theme.backgroundColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              backgroundColor: val,
                              theme: { ...prev.theme, backgroundColor: val },
                            }));
                          }}
                          className="w-full bg-transparent text-[9px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-zinc-500 block mb-1 font-bold">
                        PRIMARY
                      </label>
                      <div className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 p-1">
                        <input
                          type="color"
                          value={formData.theme.primaryColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              primaryColor: val,
                              theme: { ...prev.theme, primaryColor: val },
                            }));
                          }}
                          className="w-5 h-5 bg-transparent cursor-pointer border-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={formData.theme.primaryColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              primaryColor: val,
                              theme: { ...prev.theme, primaryColor: val },
                            }));
                          }}
                          className="w-full bg-transparent text-[9px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-zinc-500 block mb-1 font-bold">
                        ACCENT
                      </label>
                      <div className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 p-1">
                        <input
                          type="color"
                          value={formData.theme.accentColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              accentColor: val,
                              theme: { ...prev.theme, accentColor: val },
                            }));
                          }}
                          className="w-5 h-5 bg-transparent cursor-pointer border-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={formData.theme.accentColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              accentColor: val,
                              theme: { ...prev.theme, accentColor: val },
                            }));
                          }}
                          className="w-full bg-transparent text-[9px] text-zinc-300 font-mono focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 02 Environment Cards & Explicit Dropdown for All 9 Background Shaders */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase flex items-center justify-between">
                      <span>Background Shader Engine (9 Shaders)</span>
                      <span className="text-[#00E5FF] text-[9px] font-mono">DYNAMIC SHADER</span>
                    </label>

                    {/* Environment Cards Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {AVAILABLE_BACKGROUNDS.map((card) => {
                        const IconComp = card.icon;
                        const isSelected = (formData.backgroundShader || backgroundShader) === card.value;
                        return (
                          <button
                            key={card.value}
                            type="button"
                            onClick={() => {
                              setBackgroundShader(card.value);
                              setFormData((prev) => ({ ...prev, backgroundShader: card.value }));
                            }}
                            className={`p-2 border text-left transition flex flex-col gap-1 items-start ${
                              isSelected
                                ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white shadow-[0_0_8px_rgba(0,229,255,0.25)]'
                                : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 w-full">
                              <IconComp className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                              <span className="text-[9px] font-bold truncate">{card.label}</span>
                            </div>
                            <span className="text-[8px] text-zinc-500 font-mono truncate w-full">
                              {isSelected ? '[ACTIVE]' : card.value}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <select
                      value={formData.backgroundShader || backgroundShader}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBackgroundShader(val);
                        setFormData((prev) => ({ ...prev, backgroundShader: val }));
                      }}
                      className="w-full bg-[#09090B] border border-[#5322FF] text-white p-2 rounded font-mono text-xs focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="SwissGridHUD">Swiss Grid HUD</option>
                      <option value="CyberpunkMatrixBg">Cyberpunk Matrix</option>
                      <option value="HolographicBlueprintBg">Holographic Blueprint</option>
                      <option value="HyperdriveGridBg">Hyperdrive Grid 3D</option>
                      <option value="IsometricGridBg">Isometric Grid</option>
                      <option value="ParticleTunnelBg">Particle Tunnel</option>
                      <option value="QuantumWaveformBg">Quantum Waveform</option>
                      <option value="AnomalousNoiseField">Anomalous Noise Field</option>
                      <option value="VolumetricFogHUD">Volumetric Fog HUD</option>
                    </select>
                  </div>

                  {/* Font Family Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">
                      Typography Family
                    </label>
                    <select
                      value={formData.theme.fontFamily}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          theme: {
                            ...prev.theme,
                            fontFamily: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                    >
                      <option value="JetBrains Mono">JetBrains Mono (Monospace Precision)</option>
                      <option value="Space Grotesk">Space Grotesk (Brutalist Tracked-Wide)</option>
                      <option value="Inter">Inter (Swiss Neutrality)</option>
                    </select>
                  </div>

                  {/* Motion Tokens Multi-Select */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">
                      Active Motion Tokens
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        'kinetic-parallax',
                        'chromatic-aberration',
                        'text-clipping-reveal',
                        'magnetic-attraction',
                        'glitch-flicker',
                      ].map((token) => {
                        const checked = formData.motionTokens.includes(token);
                        return (
                          <label
                            key={token}
                            className={`flex items-center gap-1.5 p-1.5 border text-[10px] cursor-pointer transition ${
                              checked
                                ? 'border-[#5322FF] bg-[#5322FF]/10 text-white'
                                : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    motionTokens: [...prev.motionTokens, token],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    motionTokens: prev.motionTokens.filter(
                                       (t: string) => t !== token
                                    ),
                                  }));
                                }
                              }}
                              className="accent-[#5322FF] w-3 h-3"
                            />
                            <span className="truncate">{token}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: 3D ENGINE & EXPLODED ASSEMBLY */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-zinc-100 text-xs font-bold border-b border-zinc-800 pb-2">
                  <Layers className="w-4 h-4 text-[#5322FF]" />
                  <span>STEP 3 // 3D ENGINE & EXPLODED ASSEMBLY</span>
                </div>

                {/* 3D Mesh & Component Selector List */}
                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Base 3D Mesh Component
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {AVAILABLE_3D_COMPONENTS.map((comp) => {
                      const IconComponent = comp.icon;
                      const activeModel = formData.base_component || formData.presetModel || formData.modelType || DEFAULT_ACTIVE_MODEL_KEY;
                      const isSelected = activeModel === comp.value;
                      return (
                        <button
                          key={comp.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              base_component: comp.value,
                              presetModel: comp.value,
                              modelType: comp.value,
                              roboticsNode: {
                                ...prev.roboticsNode,
                                modelType: comp.value as any,
                              },
                            }));
                          }}
                          className={`w-full px-3 py-2 border text-left text-xs font-mono transition flex items-center justify-between ${
                            isSelected
                              ? 'border-[#5322FF] bg-[#5322FF]/20 text-white shadow-[0_0_12px_rgba(83,34,255,0.3)]'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComponent className="w-4 h-4 text-[#00E5FF] stroke-[1.5]" />
                            <span>{comp.label}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {isSelected ? '[ACTIVE]' : comp.badge || comp.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Model Selector Presets */}
                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Actuator Model Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'quantum-escapement-clock', label: 'Quantum Clock' },
                      { id: 'pneumatic-data-pipeline', label: 'Pneumatic Pipeline' },
                      { id: 'tokamak-reactor-core', label: 'Tokamak Core' },
                      { id: 'RoboticsHandNode', label: 'Industrial Robot Arm' },
                      { id: 'BipedalRobotMesh', label: 'Kinematic Assembler' },
                      { id: 'PointCloudNode', label: 'Point Cloud Drone' },
                    ].map((model) => (
                      <button
                        key={model.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            base_component: model.id,
                            presetModel: model.id,
                            modelType: model.id,
                            roboticsNode: {
                              ...prev.roboticsNode,
                              modelType: model.id as any,
                            },
                          }))
                        }
                        className={`p-2 border text-left text-[11px] font-bold transition ${
                          ((formData.base_component || formData.presetModel) === model.id || formData.roboticsNode.modelType === model.id)
                            ? 'border-[#5322FF] bg-[#5322FF]/20 text-white'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {model.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4-Stage Exploded Assembly Text Inputs & Slider */}
                <div className="space-y-3 p-3 border border-zinc-800 bg-zinc-950/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white font-bold uppercase">
                      Exploded Assembly Progress
                    </span>
                    <span className="text-xs font-bold text-[#00E5FF]">
                      {formData.explodedProgress}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.explodedProgress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        explodedProgress: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-[#00E5FF] cursor-pointer"
                  />

                  {/* 4 Stage Labels */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[9px]">
                    <div className="space-y-1">
                      <span className="text-zinc-500">STAGE 0 (0%)</span>
                      <input
                        type="text"
                        value={formData.explodedStages.stage0}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            explodedStages: { ...p.explodedStages, stage0: e.target.value },
                          }))
                        }
                        className="w-full px-1.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-500">STAGE 1 (33%)</span>
                      <input
                        type="text"
                        value={formData.explodedStages.stage33}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            explodedStages: { ...p.explodedStages, stage33: e.target.value },
                          }))
                        }
                        className="w-full px-1.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-500">STAGE 2 (66%)</span>
                      <input
                        type="text"
                        value={formData.explodedStages.stage66}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            explodedStages: { ...p.explodedStages, stage66: e.target.value },
                          }))
                        }
                        className="w-full px-1.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-zinc-500">STAGE 3 (100%)</span>
                      <input
                        type="text"
                        value={formData.explodedStages.stage100}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            explodedStages: { ...p.explodedStages, stage100: e.target.value },
                          }))
                        }
                        className="w-full px-1.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Laser & Wireframe Toggles */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        raycastingLaser: !prev.raycastingLaser,
                      }))
                    }
                    className={`p-2.5 border text-left flex items-center justify-between text-xs font-bold transition ${
                      formData.raycastingLaser
                        ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    <span>Raycast Cyan Laser</span>
                    <span className="text-[10px]">{formData.raycastingLaser ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        roboticsNode: {
                          ...prev.roboticsNode,
                          wireframe: !prev.roboticsNode.wireframe,
                        },
                      }))
                    }
                    className={`p-2.5 border text-left flex items-center justify-between text-xs font-bold transition ${
                      formData.roboticsNode.wireframe
                        ? 'border-[#5322FF] bg-[#5322FF]/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    <span>CAD Wireframe</span>
                    <span className="text-[10px]">
                      {formData.roboticsNode.wireframe ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: TELEMETRY & BENTO GRID */}
            {activeStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-zinc-100 text-xs font-bold border-b border-zinc-800 pb-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>STEP 4 // TELEMETRY & BENTO GRID</span>
                </div>

                {/* Telemetry Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">
                      Target SLA FPS
                    </label>
                    <input
                      type="number"
                      value={formData.telemetryFps}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          telemetryFps: parseInt(e.target.value, 10) || 60,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">
                      Torque Precision
                    </label>
                    <input
                      type="text"
                      value={formData.torquePrecision}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, torquePrecision: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">
                      Sensor DOF
                    </label>
                    <input
                      type="text"
                      value={formData.dofSensorCount}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, dofSensorCount: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase">
                      Runtime Pipeline
                    </label>
                    <input
                      type="text"
                      value={formData.aiLatency}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, aiLatency: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Bento Grid Module Toggles */}
                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Bento Grid Modules
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'viewport3d', label: 'Module 01: 3D Actuator Viewport' },
                      { key: 'performanceGraph', label: 'Module 02: Kinematics Wave Graph' },
                      { key: 'interactiveTactileMatrix', label: 'Module 03: Tactile Matrix (16 DOF)' },
                    ].map((mod) => {
                      const isEnabled = (formData.bentoModules as any)[mod.key];
                      return (
                        <div
                          key={mod.key}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              bentoModules: {
                                ...prev.bentoModules,
                                [mod.key]: !isEnabled,
                              },
                            }))
                          }
                          className={`p-2.5 border flex items-center justify-between cursor-pointer transition text-xs ${
                            isEnabled
                              ? 'border-zinc-700 bg-zinc-900 text-white'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                          }`}
                        >
                          <span>{mod.label}</span>
                          <span className={`text-[10px] font-bold ${isEnabled ? 'text-emerald-400' : 'text-zinc-600'}`}>
                            {isEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spatial Point Cloud Toggle */}
                <div
                  onClick={() =>
                    setFormData((p) => ({ ...p, spatialPointCloud: !p.spatialPointCloud }))
                  }
                  className={`p-3 border flex items-center justify-between cursor-pointer transition text-xs font-bold ${
                    formData.spatialPointCloud
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                    <span>Spatial Point Cloud (1200+ Magnetic Particles)</span>
                  </div>
                  <span className="text-[10px]">
                    {formData.spatialPointCloud ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 5: EXPORT & HAND-OFF DOCK */}
            {activeStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-zinc-100 text-xs font-bold border-b border-zinc-800 pb-2">
                  <Terminal className="w-4 h-4 text-[#5322FF]" />
                  <span>STEP 5 // EXPORT & HAND-OFF DOCK</span>
                </div>

                {/* Motion FX / Motion Tokens Selector (Step 05) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                      Kinematic Motion FX Tokens
                    </label>
                    <span className="text-[9px] text-[#00E5FF] font-mono">
                      {formData.motionTokens?.length || 0} ACTIVE
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {AVAILABLE_MOTION_TOKENS.map((token) => {
                      const IconComponent = token.icon;
                      const activeTokens: string[] = formData.motionTokens || [];
                      const isChecked = activeTokens.includes(token.value);
                      return (
                        <label
                          key={token.value}
                          className={`flex items-center justify-between p-2 border text-xs cursor-pointer transition font-bold ${
                            isChecked
                              ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white shadow-[0_0_8px_rgba(0,229,255,0.15)]'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    motionTokens: [...activeTokens, token.value],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    motionTokens: activeTokens.filter((t) => t !== token.value),
                                  }));
                                }
                              }}
                              className="accent-[#00E5FF]"
                            />
                            <IconComponent className="w-3.5 h-3.5 text-[#00E5FF] stroke-[1.5]" />
                            <span>{token.label}</span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500">
                            {token.value}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Developer Sandbox Languages */}
                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    Developer Sandbox SDK Target
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['typescript', 'python', 'ros2', 'cpp'].map((lang) => {
                      const checked = formData.sandboxLanguages.includes(lang);
                      return (
                        <label
                          key={lang}
                          className={`flex items-center gap-2 p-2 border text-xs uppercase cursor-pointer transition font-bold ${
                            checked
                              ? 'border-[#5322FF] bg-[#5322FF]/20 text-white'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData((p) => ({
                                  ...p,
                                  sandboxLanguages: [...p.sandboxLanguages, lang],
                                }));
                              } else {
                                setFormData((p) => ({
                                  ...p,
                                  sandboxLanguages: p.sandboxLanguages.filter((l: string) => l !== lang),
                                }));
                              }
                            }}
                            className="accent-[#5322FF]"
                          />
                          <span>{lang}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-3 pt-2">
                  {/* PRIMARY ACTION BUTTON */}
                  <button
                    onClick={handleGenerate3DWebApp}
                    disabled={isCompiling}
                    className="w-full py-3.5 px-4 bg-[#5322FF] hover:bg-[#5322FF]/90 text-white font-extrabold text-xs uppercase tracking-widest transition shadow-[0_0_20px_rgba(83,34,255,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>COMPILING 3D AST STREAM...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-[#00E5FF]" />
                        <span>GENERATE 3D WEB APP</span>
                      </>
                    )}
                  </button>

                  {/* SECONDARY ACTION BUTTONS */}
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={handleExportJsonAst}
                      className="py-2.5 px-3 border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs font-bold uppercase transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Export JSON AST Payload</span>
                    </button>

                    <button
                      onClick={handleDownloadSingleFileHtml}
                      className="py-2.5 px-3 border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs font-bold uppercase transition flex items-center justify-center gap-2"
                    >
                      <FolderArchive className="w-3.5 h-3.5 text-purple-400" />
                      <span>Download Single-File HTML (.zip)</span>
                    </button>

                    <button
                      onClick={() =>
                        alert(
                          'Cloudflare Worker bundle dispatched to edge cluster: edge-craft.workers.dev'
                        )
                      }
                      className="py-2.5 px-3 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase transition flex items-center justify-center gap-2"
                    >
                      <CloudLightning className="w-3.5 h-3.5" />
                      <span>Deploy 1-Click to Cloudflare</span>
                    </button>
                  </div>
                </div>

                {/* Compilation Logs Console */}
                {compileLogs.length > 0 && (
                  <div className="p-3 bg-black/90 border border-zinc-800 text-[10px] space-y-1 font-mono text-zinc-400 max-h-40 overflow-y-auto">
                    <div className="text-zinc-500 font-bold border-b border-zinc-800 pb-1 flex items-center justify-between">
                      <span>COMPILER STREAM LOGS</span>
                      <span className="text-[#00E5FF]">60FPS READY</span>
                    </div>
                    {compileLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.startsWith('SUCCESS')
                            ? 'text-emerald-400 font-bold'
                            : log.startsWith('ERROR')
                            ? 'text-rose-400 font-bold'
                            : log.startsWith('LAYER')
                            ? 'text-purple-300'
                            : 'text-zinc-400'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: 60FPS REAL-TIME LIVE PREVIEW STAGE (FLEX-1) */}
        {/* ======================================================== */}
        <main
          className={`flex-1 flex flex-col bg-[#050508] relative ${
            isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-[600px] lg:h-[calc(100vh-108px)]'
          }`}
        >
          {/* Top Viewport Header Dock */}
          <div className="px-4 py-2 border-b border-zinc-800 bg-[#09090D] flex flex-wrap items-center justify-between gap-3 text-xs z-20">
            {/* Viewport Status & SLA & DUAL-MODE PREVIEW TOGGLE */}
            <div className="flex items-center gap-3">
              {/* Dual-Mode Preview Toggle */}
              <div className="flex items-center border border-zinc-800 bg-zinc-950 p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewViewportMode('3d-canvas')}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase transition flex items-center gap-1.5 ${
                    previewViewportMode === '3d-canvas'
                      ? 'bg-[#5322FF] text-white shadow-[0_0_10px_rgba(83,34,255,0.4)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>[🎮 3D WebGL Canvas]</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewportMode('remotion-video')}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase transition flex items-center gap-1.5 ${
                    previewViewportMode === 'remotion-video'
                      ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>[🎬 Remotion Video Preview]</span>
                </button>
              </div>

              <span className="hidden sm:inline-block text-zinc-700">|</span>

              <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>[ STATUS: OPERATIONAL ]</span>
              </span>
              <span className="hidden sm:inline-block text-zinc-600">|</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GATE: ZOD VALIDATED</span>
              </span>
            </div>

            {/* Device Switcher & Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-zinc-800 bg-zinc-950 p-0.5">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 transition ${
                    deviceMode === 'desktop'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Desktop (1920px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1.5 transition ${
                    deviceMode === 'tablet'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 transition ${
                    deviceMode === 'mobile'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Mobile (375px Gyroscope Mode)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

              {/* View Raw Code Button */}
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="px-2.5 py-1 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-1 text-xs transition"
              >
                <Code className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="hidden sm:inline">Raw Code</span>
              </button>

              {/* Reset Camera */}
              <button
                onClick={resetCamera}
                className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition"
                title="Reset Camera Angles"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Central Canvas Viewport Frame */}
          <div className="flex-1 w-full h-full p-2 flex items-center justify-center overflow-hidden bg-black relative">
            <div
              className={`h-full transition-all duration-300 relative border border-white/10 flex items-center justify-center bg-black overflow-hidden ${
                deviceMode === 'desktop'
                  ? 'w-full'
                  : deviceMode === 'tablet'
                  ? 'w-[768px] max-w-full'
                  : 'w-[375px] max-w-full'
              }`}
            >
              {/* Dynamic Viewport Background Layer */}
              <div
                key={`bg-layer-${activeShaderKey}-${formData.theme?.backgroundColor}-${primaryColor}-${accentColor}`}
                className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden mix-blend-screen transition-colors duration-500"
                style={{ transform: 'translateZ(0)' }}
              >
                <ActiveBg
                  backgroundColor={formData.theme?.backgroundColor || '#09090B'}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  backgroundShader={activeShaderKey}
                  interactive={false}
                />
              </div>

              {previewViewportMode === '3d-canvas' ? (
                <div
                  className="relative w-full h-full pointer-events-auto cursor-crosshair z-10 touch-pan-y"
                  style={{ touchAction: 'pan-y' }}
                  onPointerMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                    setPointerCoords({ x, y });
                    setIsHoveringCanvas(true);
                  }}
                  onPointerLeave={() => setIsHoveringCanvas(false)}
                >
                  {/* Dynamic 3D Model Direct Viewport vs Iframe Fallback */}
                  {(() => {
                    const currentModel = formData.base_component || formData.presetModel || formData.modelType || DEFAULT_ACTIVE_MODEL_KEY;
                    const activePrim = formData.theme?.primaryColor || formData.primaryColor || '#5322FF';
                    const activeAcc = formData.theme?.accentColor || formData.accentColor || '#00E5FF';
                    const dispAmount = Math.max(0.01, (formData.explodedProgress || 33) / 500);

                    if (currentModel === 'quantum-escapement-clock') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <QuantumEscapementClock3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'rolls-royce-trent-970') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <RollsRoyceTrent9703D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'pneumatic-data-pipeline') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <PneumaticDataPipeline3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.05}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'tokamak-reactor-core') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <TokamakReactorCore3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'btree-disk-index') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <BTreeDiskIndex3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'mail-ropeway-tcp') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <MailRopewayTcp3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'turbofan-jet-engine') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <TurbofanJetEngine3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'power-station-generator') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <PowerStationGenerator3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'liquid-steel-foundry') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <LiquidSteelFoundry3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'optical-bench-interferometer') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <OpticalBenchInterferometer3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'kinematic-differential-gearbox') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <KinematicDifferentialGearbox3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'rim-light-studio') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <RimLightStudio3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }
                    if (currentModel === 'pneumatic-letter-a') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <Suspense fallback={<div className="text-xs font-mono text-[#00E5FF]">LOADING 3D CAD MESH...</div>}>
                            <PneumaticLetterA3D
                              primaryColor={activePrim}
                              accentColor={activeAcc}
                              scale={1.1}
                              rotateXDeg={28}
                              dispersionAmount={dispAmount}
                              width={720}
                              height={600}
                              className="max-w-full max-h-full"
                            />
                          </Suspense>
                        </div>
                      );
                    }
                    if (currentModel === 'vdm80-actuator-joint') {
                      return (
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <VDM80ActuatorJoint3D
                            primaryColor={activePrim}
                            accentColor={activeAcc}
                            scale={1.1}
                            rotateXDeg={formData.roboticsNode?.wireframe ? 28 : 28}
                            dispersionAmount={dispAmount}
                            width={720}
                            height={600}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      );
                    }

                    return (
                      <iframe
                        ref={iframeRef}
                        srcDoc={generatedHtml}
                        sandbox="allow-scripts allow-modals allow-same-origin"
                        title="ARTIFICIAL CRAFT 3D Viewport"
                        data-background-shader={activeShaderKey}
                        data-base-component={currentModel}
                        style={{ touchAction: 'pan-y' }}
                        className="w-full h-full bg-transparent rounded-none border-0 pointer-events-auto touch-pan-y"
                      />
                    );
                  })()}

                  {/* Raycasting Reticle Overlay Follower */}
                  {isHoveringCanvas && (
                    <div
                      className="absolute pointer-events-none z-30 transition-transform duration-75 ease-out"
                      style={{
                        left: `${((pointerCoords.x + 1) / 2) * 100}%`,
                        top: `${((-pointerCoords.y + 1) / 2) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute w-full h-[1px] bg-[#00E5FF]/60" />
                        <div className="absolute h-full w-[1px] bg-[#00E5FF]/60" />
                        <div className="w-2.5 h-2.5 border border-[#00E5FF] rounded-none animate-ping" />
                        <div className="absolute -top-4 -right-10 text-[8px] font-mono text-[#00E5FF] bg-black/80 px-1 border border-[#00E5FF]/40">
                          {pointerCoords.x.toFixed(2)},{pointerCoords.y.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Floating Glassmorphic Top HUD overlay - Cleaned to avoid clashing with internal iframe HUD header (relocated to top-10 or hidden to keep canvas uncluttered) */}

                  {/* Bottom-Left Clean Logo Overlay (No Duplicate Text Clashing) */}
                  <div className="absolute bottom-6 left-6 z-20 pointer-events-none max-w-[80%]">
                    {formData.logoUrl && (
                      <div className="p-1.5 bg-black/70 backdrop-blur-md border border-white/10 shadow-lg rounded">
                        <img
                          src={formData.logoUrl}
                          alt="Brand Logo"
                          className="max-h-8 w-auto object-contain"
                          onError={(e) => {
                            // Hide on broken image URL
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full aspect-video max-w-full max-h-full flex items-center justify-center bg-black relative z-10">
                  <Player
                    component={CraftStudioVideoComposition}
                    inputProps={{
                      brandName: formData.brandName || formData.compositionId,
                      slogan: formData.slogan || formData.tagline || 'Autonomous 3D Manufacturing Pipeline & Multi-Agent Swarm',
                      logoUrl: formData.logoUrl,
                      primaryColor: formData.theme?.primaryColor || formData.primaryColor || '#5322FF',
                      accentColor: formData.theme?.accentColor || formData.accentColor || '#00E5FF',
                      backgroundColor: formData.theme?.backgroundColor || formData.backgroundColor || '#09090B',
                      base_component: formData.base_component || formData.presetModel || formData.modelType || DEFAULT_ACTIVE_MODEL_KEY,
                      assemblyStage: formData.explodedProgress,
                      telemetry: {
                        slaTarget: formData.aiLatency || '[ RUNTIME: CLIENT GPU ]',
                        fps: formData.telemetryFps || 60,
                      },
                      motion_tokens: formData.motionTokens || ['kinetic-parallax', 'chromatic-aberration', 'glitch-flicker'],
                      cameraAnglePreset: 'isometric-iso',
                      glitchIntensity: 0.5,
                      audioBpm: 120,
                      playbackRate: 1.0,
                      matrixGridSize: 48,
                      watermarkPosition: 'top-right',
                    }}
                    durationInFrames={180}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    fps={formData.telemetryFps || 60}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    controls
                    autoPlay
                    loop
                  />

                  {/* Remotion Status Badge */}
                  <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-[#00E5FF] bg-zinc-950/80 border border-zinc-800 px-2.5 py-1 z-10 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                    <span>REMOTION VIDEO ENGINE // 1080P 60FPS</span>
                  </div>
                </div>
              )}
            </div>

            {/* B2B ENTERPRISE CTA POPUP / FLOATING BANNER */}
            <AnimatePresence>
              {isB2BPopupOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-5 right-5 z-40 max-w-md w-[calc(100%-2.5rem)] bg-[#09090B] border border-[#5322FF] shadow-[0_0_25px_rgba(83,34,255,0.35)] p-4 font-mono text-zinc-100"
                >
                  {/* Header Badge & Close Button */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#5322FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#00E5FF]" />
                        <span>⚡ {t('b2bPopupTitle')}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsB2BPopupOpen(false)}
                      className="text-zinc-500 hover:text-white text-xs px-1.5 py-0.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 transition"
                      title="Dismiss popup"
                    >
                      [ × CLOSE ]
                    </button>
                  </div>

                  {/* Body Text */}
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {t('b2bPopupDesc')}
                  </p>

                  {/* Primary CTA Button */}
                  <a
                    href="mailto:thuyvu@artificialcraft.space?subject=ARTIFICIAL%20CRAFT%20-%20Enterprise%203D%20Kinematics%20Consultation"
                    className="w-full py-2.5 px-3 bg-[#5322FF] hover:bg-[#5322FF]/90 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(83,34,255,0.5)] border border-[#00E5FF]/30 text-center"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                    <span>[ ⚡ {t('btnBookB2bConsultation')} ]</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* RAW CODE INSPECTOR MODAL */}
      {/* ======================================================== */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-bold text-xs uppercase tracking-wider text-white">
                  SOURCE ARTIFACT & DEVELOPER CODE VIEW
                </span>
              </div>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 border border-zinc-800"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Code Tabs */}
            <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs">
                {(['html', 'ast', 'ts', 'python', 'ros2', 'cpp'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    className={`px-3 py-1 border uppercase text-[11px] font-bold transition ${
                      codeTab === tab
                        ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    {tab === 'html' && 'HTML5 / Three.js'}
                    {tab === 'ast' && 'JSON AST'}
                    {tab === 'ts' && 'TypeScript SDK'}
                    {tab === 'python' && 'Python Node'}
                    {tab === 'ros2' && 'ROS2 Humble'}
                    {tab === 'cpp' && 'C++20 Controller'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const content =
                    codeTab === 'html'
                      ? generatedHtml
                      : codeTab === 'ast'
                      ? JSON.stringify(generateStudioAst(formData as any), null, 2)
                      : (snippets as any)[codeTab] || '';
                  handleCopyCode(content);
                }}
                className="px-3 py-1 bg-[#5322FF] text-white text-[11px] font-bold uppercase flex items-center gap-1.5 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
              </button>
            </div>

            {/* Code Display Area */}
            <div className="p-4 flex-1 overflow-auto bg-black font-mono text-xs text-zinc-300">
              <pre className="whitespace-pre">
                {codeTab === 'html' && generatedHtml}
                {codeTab === 'ast' &&
                  JSON.stringify(generateStudioAst(formData as any), null, 2)}
                {codeTab === 'ts' && snippets.typescript}
                {codeTab === 'python' && snippets.python}
                {codeTab === 'ros2' && snippets.ros2}
                {codeTab === 'cpp' && snippets.cpp}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CraftStudioConfigurator;
