import React from 'react';
import Hero from '@/components/Hero';
import { GenerativeVisual } from '@/components/GenerativeVisual';
import PlugAndPlaySandbox from '@/components/playground/PlugAndPlaySandbox';
import CsvDataVisualizer from '@/components/playground/CsvDataVisualizer';
import BannerStudio from '@/components/playground/BannerStudio';
import VideoShowcase from '@/components/playground/VideoShowcase';
import Monolith3DNode from '@/components/playground/Monolith3DNode';
import InteractiveNodeMatrix from '@/components/playground/InteractiveNodeMatrix';
import ExistentialBlackbox from '@/components/ExistentialBlackbox';
import ThreeHookCanvas from '@/components/ThreeHookCanvas';
import ParticleCanvas from '@/components/ParticleCanvas';
import ExportArtifactEngine from '@/components/utilities/ExportArtifactEngine';
import EmbedWidgetModal from '@/components/utilities/EmbedWidgetModal';

import {
  SectionType,
  BackgroundPreset,
  MotionParameters,
  GenerativeVisualMode,
} from '@/types/preset';

/**
 * Component Registry Mapping for Dynamic Section Engines & Utilities
 * SSOT (Single Source of Truth) for all 0-Code operations
 */
export const SECTION_REGISTRY: Record<string, React.ComponentType<Record<string, unknown>>> = {
  // Monolith 3D Engine Registrations
  'monolith-3d-engine': Monolith3DNode as unknown as React.ComponentType<Record<string, unknown>>,
  'node-01-3d-procedural': Monolith3DNode as unknown as React.ComponentType<Record<string, unknown>>,

  // Consolidated Playground Modules
  HERO_3D: Hero as unknown as React.ComponentType<Record<string, unknown>>,
  GEOMETRIC_ART: GenerativeVisual as unknown as React.ComponentType<Record<string, unknown>>,
  PLUG_AND_PLAY: PlugAndPlaySandbox as unknown as React.ComponentType<Record<string, unknown>>,
  CSV_VISUALIZER: CsvDataVisualizer as unknown as React.ComponentType<Record<string, unknown>>,
  BANNER_STUDIO: BannerStudio as unknown as React.ComponentType<Record<string, unknown>>,
  VIDEO_SHOWCASE: VideoShowcase as unknown as React.ComponentType<Record<string, unknown>>,
  INTERACTIVE_NODE_MATRIX: InteractiveNodeMatrix as unknown as React.ComponentType<Record<string, unknown>>,

  // Utilities & Interactive Canvases
  TERMINAL_CONSOLE: ExistentialBlackbox as unknown as React.ComponentType<Record<string, unknown>>,
  THREE_CANVAS: ThreeHookCanvas as unknown as React.ComponentType<Record<string, unknown>>,
  PARTICLE_CANVAS: ParticleCanvas as unknown as React.ComponentType<Record<string, unknown>>,
  EXPORT_ARTIFACT: ExportArtifactEngine as unknown as React.ComponentType<Record<string, unknown>>,
  EMBED_MODAL: EmbedWidgetModal as unknown as React.ComponentType<Record<string, unknown>>,

  // Jules Memorial 3D Nodes
  'jules-memorial-node': React.lazy(() => import('@/components/playground/JulesMemorialNode')) as unknown as React.ComponentType<Record<string, unknown>>,
  'jules-memorial-modal': React.lazy(() => import('@/components/JulesMemorialModal')) as unknown as React.ComponentType<Record<string, unknown>>,
};

/**
 * Registered Generative Line-Art Visual Modes Manifest
 */
export const REGISTERED_VISUAL_MODES: GenerativeVisualMode[] = [
  'NEURAL_MESH',
  'ISOMETRIC_CAD',
  'ALGORITHMIC_WAVE',
  'AUTOMATION_FLOW',
  'DATA_MATRIX',
  'REMOTION_TIMELINE',
  'GEO_MAP',
  'INTERACTIVE_ANCHOR',
];

/**
 * Registered Background Line-Art & Blueprint Overlay Presets
 */
export const BACKGROUND_PRESETS: Record<string, BackgroundPreset> = {
  SWISS_GRID: {
    id: 'SWISS_GRID',
    name: 'Swiss Grid Matrix',
    overlayType: 'grid',
    opacity: 0.15,
    color: '#3f3f46',
    lineSpacing: 40,
  },
  CAD_BLUEPRINT: {
    id: 'CAD_BLUEPRINT',
    name: 'CAD Blueprint Crosshairs',
    overlayType: 'cad_blueprint',
    opacity: 0.2,
    color: '#00E5FF',
    lineSpacing: 32,
  },
  DOT_MATRIX: {
    id: 'DOT_MATRIX',
    name: 'Dot Matrix Grid',
    overlayType: 'dots',
    opacity: 0.25,
    color: '#5322ff',
    lineSpacing: 24,
  },
  CRT_SCANLINES: {
    id: 'CRT_SCANLINES',
    name: 'CRT Vintage Scanlines',
    overlayType: 'scanlines',
    opacity: 0.1,
    color: '#000000',
    lineSpacing: 4,
  },
};

/**
 * Default Motion Animation Parameters
 */
export const DEFAULT_MOTION_PRESETS: Record<string, MotionParameters> = {
  FADE_UP: {
    duration: 0.6,
    delay: 0.1,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  SLIDE_IN_LEFT: {
    duration: 0.5,
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
  SCALE_IN: {
    duration: 0.4,
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

/**
 * CAD Overlay Line-Art Utilities
 */
export const CAD_UTILITIES = {
  drawCrosshair: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size = 6,
    color = '#00E5FF'
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
    ctx.restore();
  },

  drawWatermark: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    seed: string
  ) => {
    const watermarkText = `ARTIFICIAL CRAFT // ARTIFACT_ID: 0x${seed.replace(/^0x/i, '').toUpperCase()}`;
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'right';
    ctx.fillText(watermarkText, width - 20, height - 20);
    ctx.restore();
  },
};

/**
 * Helper function to register dynamic custom section types into the global registry
 */
export function registerSectionComponent(
  type: SectionType,
  component: React.ComponentType<Record<string, unknown>>
) {
  SECTION_REGISTRY[type] = component;
}

export const componentRegistry = SECTION_REGISTRY;
export type VisualComponentType = SectionType;
