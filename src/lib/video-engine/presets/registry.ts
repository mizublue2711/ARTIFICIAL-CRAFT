import React from 'react';
import { PresetRegistryEntry } from '../types/presets';

// Background Presets
import { SwissGridHUD } from '../components/backgrounds/SwissGridHUD';
import { CyberpunkMatrixBg } from '../components/backgrounds/CyberpunkMatrixBg';
import { IsometricGridBg } from '../components/backgrounds/IsometricGridBg';
import { ParticleTunnelBg } from '../components/backgrounds/ParticleTunnelBg';
import { QuantumWaveformBg } from '../components/backgrounds/QuantumWaveformBg';
import { HolographicBlueprintBg } from '../components/backgrounds/HolographicBlueprintBg';
import { HyperdriveGridBg } from '../components/backgrounds/HyperdriveGridBg';
import { VolumetricFogHUD } from '../components/backgrounds/VolumetricFogHUD';
import { AnomalousNoiseField } from '../components/backgrounds/AnomalousNoiseField';

// Parametric Motion Engines
import { ParametricCircleEngine } from '../components/parametric/ParametricCircleEngine';
import { KineticTypographyEngine } from '../components/parametric/KineticTypographyEngine';
import { BentoGrid3DEngine } from '../components/parametric/BentoGrid3DEngine';
import { LaserScanBorderEngine } from '../components/parametric/LaserScanBorderEngine';
import { ContinuousMarqueeEngine } from '../components/parametric/ContinuousMarqueeEngine';
import { FibonacciSpiralEngine } from '../components/parametric/FibonacciSpiralEngine';
import { SubmeshMorphEngine } from '../components/parametric/SubmeshMorphEngine';
import { VelocityBlurEngine } from '../components/parametric/VelocityBlurEngine';

// 3D Objects & Hero Meshes
import { RubikCube3D } from '../components/3d/RubikCube3D';
import { LogarithmicSpiral3D } from '../components/3d/LogarithmicSpiral3D';
import { IsometricMatrix3D } from '../components/3d/IsometricMatrix3D';
import { AppMockup3D } from '../components/3d/AppMockup3D';

// UI Overlays & Typography
import { SwissHudOverlay } from '../components/SwissHudOverlay';
import { MetricBadge } from '../components/ui/MetricBadge';
import { DualEngineCard } from '../components/ui/DualEngineCard';
import { KineticTypography } from '../components/ui/KineticTypography';
import { MarqueeTicker } from '../components/ui/MarqueeTicker';

export const presetRegistry: PresetRegistryEntry<any>[] = [
  // Backgrounds
  {
    id: 'SwissGridHUD',
    name: 'Swiss Grid HUD',
    category: 'background',
    description: '1px CSS grid background with active Y-axis laser scanline and 4-corner telemetry overlay.',
    tags: ['hud', 'swiss-design', 'grid', 'scanline', 'telemetry', 'swiss-grid-hud'],
    component: SwissGridHUD,
    defaultProps: {
      backgroundColor: '#050505',
      gridColor: '#1A1A24',
      primaryColor: '#00E5FF',
      gridSize: 60,
      showScanLine: true,
      showTelemetryCorners: true,
    },
  },
  {
    id: 'CyberpunkMatrixBg',
    name: 'Cyberpunk Matrix Rain',
    category: 'background',
    description: 'Falling vertical columns of hex codes/symbols with head character highlighting and CRT scanlines.',
    tags: ['cyberpunk', 'matrix', 'hex', 'crt', 'retro-tech', 'cyberpunk-matrix'],
    component: CyberpunkMatrixBg,
    defaultProps: {
      backgroundColor: '#050505',
      primaryColor: '#00E5FF',
      columnCount: 36,
      charsPerColumn: 24,
    },
  },
  {
    id: 'IsometricGridBg',
    name: 'Isometric 3D Grid',
    category: 'background',
    description: '3D isometric plane rotated at 60deg X and -45deg Z with pulse opacity matrix.',
    tags: ['3d', 'isometric', 'grid', 'pulse', 'matrix', 'isometric-grid'],
    component: IsometricGridBg,
    defaultProps: {
      backgroundColor: '#050505',
      primaryColor: '#00E5FF',
      gridRows: 16,
      gridCols: 16,
    },
  },
  {
    id: 'ParticleTunnelBg',
    name: 'Particle Warp Tunnel',
    category: 'background',
    description: '3D particle cloud accelerating along Z-axis creating a warp-drive velocity effect.',
    tags: ['3d', 'particles', 'tunnel', 'warp-drive', 'depth', 'particle-tunnel'],
    component: ParticleTunnelBg,
    defaultProps: {
      backgroundColor: '#050505',
      primaryColor: '#00E5FF',
      particleCount: 80,
    },
  },
  {
    id: 'QuantumWaveformBg',
    name: 'Quantum Waveform Interference',
    category: 'background',
    description: 'Multi-layered sine/cosine quantum interference wave field.',
    tags: ['quantum', 'waveform', 'sine', 'interference', 'vector', 'quantum-waveform'],
    component: QuantumWaveformBg,
    defaultProps: {
      backgroundColor: '#050505',
      primaryColor: '#00E5FF',
      secondaryColor: '#7000FF',
      waveCount: 5,
    },
  },
  {
    id: 'HolographicBlueprintBg',
    name: 'Holographic CAD Blueprint',
    category: 'background',
    description: 'Rotatable 3D CAD blueprint with cyan measurement guidelines and technical telemetry.',
    tags: ['hologram', 'cad', 'blueprint', '3d', 'technical', 'holographic-blueprint'],
    component: HolographicBlueprintBg,
    defaultProps: {
      backgroundColor: '#030A16',
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'HyperdriveGridBg',
    name: 'Hyperdrive Warp Grid',
    category: 'background',
    description: 'Gravitational pull grid warping towards screen center with radial rays.',
    tags: ['hyperdrive', 'warp', 'grid', 'gravitational-lens', 'hyperdrive-grid'],
    component: HyperdriveGridBg,
    defaultProps: {
      backgroundColor: '#050505',
      primaryColor: '#00E5FF',
      ringCount: 12,
    },
  },
  {
    id: 'VolumetricFogHUD',
    name: 'Volumetric Fog HUD',
    category: 'background',
    description: 'Soft particle light-fog overlay with mechanical flickering indicators.',
    tags: ['volumetric', 'fog', 'hud', 'atmosphere', 'flicker', 'volumetric-fog'],
    component: VolumetricFogHUD,
    defaultProps: {
      backgroundColor: '#040608',
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'AnomalousNoiseField',
    name: 'Anomalous Noise Field',
    category: 'background',
    description: 'Matrix noise particle field with free dispersion wandering motion.',
    tags: ['noise', 'particles', 'dispersion', 'matrix', 'wander', 'anomalous-noise'],
    component: AnomalousNoiseField,
    defaultProps: {
      backgroundColor: '#050505',
      primaryColor: '#00E5FF',
      particleCount: 100,
    },
  },

  // 3D Objects & Hero Meshes
  {
    id: 'RubikCube3D',
    name: 'Rubik Cube 3D',
    category: 'parametric',
    description: 'Interactive 3D wireframe Rubik Cube with cyan glowing core and dispersion physics.',
    tags: ['3d', 'rubik', 'cube', 'rubik-3d', 'rubik-cube', 'hero-3d'],
    component: RubikCube3D,
    defaultProps: {
      primaryColor: '#5322ff',
      accentCyan: '#00E5FF',
      scale: 1.0,
      effectiveDispersion: 0.12,
    },
  },
  {
    id: 'LogarithmicSpiral3D',
    name: 'Logarithmic Spiral 3D',
    category: 'parametric',
    description: '3D Logarithmic spiral vertex web with submesh wireframe dynamics.',
    tags: ['3d', 'spiral', 'logarithmic', 'logarithmic-spiral', 'hero-3d'],
    component: LogarithmicSpiral3D,
    defaultProps: {
      phase: 2,
      phaseProgress: 0.5,
      accentColor: '#00E5FF',
      secondaryColor: '#FFFFFF',
    },
  },
  {
    id: 'IsometricMatrix3D',
    name: 'Isometric Matrix 3D',
    category: 'parametric',
    description: '3D isometric matrix mesh grid with height oscillation dynamics.',
    tags: ['3d', 'isometric', 'matrix', 'isometric-matrix', 'hero-3d'],
    component: IsometricMatrix3D,
    defaultProps: {
      rows: 8,
      cols: 8,
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'AppMockup3D',
    name: 'App Mockup 3D',
    category: 'parametric',
    description: '3D device frame with floating UI cards and isometric perspective.',
    tags: ['3d', 'app-mockup', 'device', 'hero-3d'],
    component: AppMockup3D,
    defaultProps: {
      primaryColor: '#00E5FF',
    },
  },

  // Parametric Engines & Overlays
  {
    id: 'ParametricCircleEngine',
    name: 'Parametric Polar Circle Engine',
    category: 'parametric',
    description: 'Polar coordinates computation bound to spring physics and harmonic pulse.',
    tags: ['parametric', 'polar', 'circle', 'math', 'spring', 'parametric-circle'],
    component: ParametricCircleEngine,
    defaultProps: {
      itemCount: 8,
      radius: 250,
      pulseSpeed: 0.05,
    },
  },
  {
    id: 'KineticTypographyEngine',
    name: 'Kinetic Typography Engine',
    category: 'parametric',
    description: 'Supports scramble decode, variable morphing, and polygon clip mask typography modes.',
    tags: ['typography', 'scramble', 'variable-font', 'mask-clip', 'kinetic', 'kinetic-type-scramble', 'kinetic-typography'],
    component: KineticTypographyEngine,
    defaultProps: {
      text: 'KINETIC_TYPO_ENGINE',
      mode: 'scramble',
      fontSize: 64,
      primaryColor: '#FFFFFF',
    },
  },
  {
    id: 'KineticTypography',
    name: 'Kinetic Typography UI',
    category: 'parametric',
    description: 'UI Kinetic Typography text component with multi-line scramble.',
    tags: ['typography', 'kinetic-typography-ui'],
    component: KineticTypography,
    defaultProps: {
      text: 'ARTIFICIAL CRAFT',
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'BentoGrid3DEngine',
    name: 'Bento Grid 3D Engine',
    category: 'parametric',
    description: '3D perspective bento container with dynamic tilt angles and ambient occlusion shadows.',
    tags: ['bento', '3d', 'perspective', 'grid', 'tilt', 'bento-grid-3d'],
    component: BentoGrid3DEngine,
    defaultProps: {
      rotateXDeg: 28,
      rotateYDeg: -15,
      columns: 3,
      gap: 24,
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'LaserScanBorderEngine',
    name: 'Laser Scan Border Engine',
    category: 'parametric',
    description: 'Animated conic gradient stroke sweeping 0% to 100% along the outer border.',
    tags: ['laser', 'border', 'stroke', 'conic-gradient', 'glow', 'laser-scan-border'],
    component: LaserScanBorderEngine,
    defaultProps: {
      primaryColor: '#00E5FF',
      borderRadius: 16,
      borderWidth: 1,
    },
  },
  {
    id: 'ContinuousMarqueeEngine',
    name: 'Continuous Marquee Engine',
    category: 'parametric',
    description: 'X-axis ticker translation using modulo arithmetic for infinite seamless looping.',
    tags: ['marquee', 'ticker', 'infinite-loop', 'marquee-engine', 'marquee-continuous'],
    component: ContinuousMarqueeEngine,
    defaultProps: {
      speed: 4,
      itemWidth: 600,
    },
  },
  {
    id: 'MarqueeTicker',
    name: 'Marquee Ticker Component',
    category: 'parametric',
    description: 'Continuous horizontal scrolling text ticker.',
    tags: ['marquee', 'ticker', 'marquee-ticker'],
    component: MarqueeTicker,
    defaultProps: {
      text: 'ARTIFICIAL CRAFT • VIDEO ENGINE 2025 • ',
    },
  },
  {
    id: 'FibonacciSpiralEngine',
    name: 'Fibonacci Spiral Engine',
    category: 'parametric',
    description: 'Element distribution using the Golden Angle (137.5deg) for natural spiral dispersion.',
    tags: ['fibonacci', 'golden-ratio', 'spiral', 'dispersion', 'math', 'fibonacci-spiral'],
    component: FibonacciSpiralEngine,
    defaultProps: {
      itemCount: 34,
      scaleFactor: 40,
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'SubmeshMorphEngine',
    name: 'Submesh Morph Engine',
    category: 'parametric',
    description: 'Polar instancing transforming base circle geometries into complex polygon star layouts.',
    tags: ['submesh', 'morph', 'polygon', 'geometry', 'vector', 'submesh-morph'],
    component: SubmeshMorphEngine,
    defaultProps: {
      vertexCount: 12,
      radius: 200,
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'VelocityBlurEngine',
    name: 'Velocity Blur Engine',
    category: 'parametric',
    description: 'Physics-based dynamic blur calculation using velocity derivative Y/Frame.',
    tags: ['physics', 'velocity', 'blur', 'motion-blur', 'derivative', 'velocity-blur'],
    component: VelocityBlurEngine,
    defaultProps: {
      maxBlur: 20,
    },
  },
  {
    id: 'SwissHudOverlay',
    name: 'Swiss HUD Overlay',
    category: 'parametric',
    description: '4-corner telemetry HUD overlay with coordinate crosshairs and timestamp.',
    tags: ['hud', 'overlay', 'swiss-hud-overlay'],
    component: SwissHudOverlay,
    defaultProps: {
      primaryColor: '#00E5FF',
    },
  },
  {
    id: 'MetricBadge',
    name: 'Metric Badge Component',
    category: 'parametric',
    description: 'Technical telemetry metric badge with active status LED.',
    tags: ['hud', 'badge', 'metric-badge'],
    component: MetricBadge,
    defaultProps: {
      label: 'SYSTEM FPS',
      value: '60.0',
    },
  },
  {
    id: 'DualEngineCard',
    name: 'Dual Engine Card',
    category: 'parametric',
    description: 'Card with cybernetic telemetry frame.',
    tags: ['card', 'dual-engine-card'],
    component: DualEngineCard,
    defaultProps: {
      title: 'ARTIFICIAL CRAFT',
    },
  },
];

export const getPresetById = (id: string): PresetRegistryEntry<any> | undefined => {
  if (!id) return undefined;

  // 1. Direct ID match
  const directMatch = presetRegistry.find((preset) => preset.id === id);
  if (directMatch) return directMatch;

  // 2. Normalized alphanumeric match (lowercase, stripping non-alphanumeric chars)
  const normSearch = id.toLowerCase().replace(/[^a-z0-9]/g, '');

  const normMatch = presetRegistry.find((preset) => {
    const normId = preset.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normName = preset.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normId === normSearch || normName === normSearch;
  });
  if (normMatch) return normMatch;

  // 3. Tag / Alias match
  return presetRegistry.find((preset) =>
    preset.tags.some((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, '') === normSearch)
  );
};

export const getPresetsByCategory = (category: string) => {
  return presetRegistry.filter((preset) => preset.category === category);
};
