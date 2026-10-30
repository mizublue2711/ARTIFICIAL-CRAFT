import { AssetPresetRegistry } from '../types/playground';

export const ASSET_PRESET_REGISTRY: AssetPresetRegistry = {
  backgrounds: {
    SWISS_GRID: {
      id: 'SWISS_GRID',
      label: 'Swiss Grid Matrix',
      category: 'backgrounds',
      description: 'Clean monochrome grid with 40px layout intersections',
      previewColor: '#3f3f46',
    },
    DOT_MATRIX: {
      id: 'DOT_MATRIX',
      label: 'Dot Matrix Grid',
      category: 'backgrounds',
      description: '24px dot pattern with electric purple accents',
      previewColor: '#5322ff',
    },
    CAD_BLUEPRINT: {
      id: 'CAD_BLUEPRINT',
      label: 'CAD Blueprint Lines',
      category: 'backgrounds',
      description: 'Cyan architectural blueprint grid with anchor points',
      previewColor: '#00E5FF',
    },
    CRT_SCANLINES: {
      id: 'CRT_SCANLINES',
      label: 'CRT Vintage Scanlines',
      category: 'backgrounds',
      description: 'Analog CRT scanline pattern',
      previewColor: '#18181b',
    },
    CYBER_RAIN: {
      id: 'CYBER_RAIN',
      label: 'Cyber Matrix Rain',
      category: 'backgrounds',
      description: 'Luminescent digital code stream trail',
      previewColor: '#00E5FF',
    },
    GOLD_AMBER: {
      id: 'GOLD_AMBER',
      label: 'Gold Amber Matrix',
      category: 'backgrounds',
      description: 'Golden spiral architectural grid background',
      previewColor: '#F59E0B',
    },
    DARK_VOID: {
      id: 'DARK_VOID',
      label: 'Dark Void Deep Field',
      category: 'backgrounds',
      description: 'Minimal pure dark brutalist field',
      previewColor: '#0B0B0F',
    },
    NEON_GRADIENT: {
      id: 'NEON_GRADIENT',
      label: 'Neon Gradient Pulse',
      category: 'backgrounds',
      description: 'Radial electric purple to cyan gradient',
      previewColor: '#D400FF',
    },
    TECHNICAL_MESH: {
      id: 'TECHNICAL_MESH',
      label: 'Technical Mesh Triangles',
      category: 'backgrounds',
      description: 'Delaunay structural wireframe background mesh',
      previewColor: '#a1a1aa',
    },
  },

  heroObjects: {
    ISOMETRIC_CUBE: {
      id: 'ISOMETRIC_CUBE',
      label: 'Isometric Extruded Cube',
      category: 'heroObjects',
      description: '3D Swiss architectural cube block',
      previewColor: '#00E5FF',
    },
    PARTICLE_SPHERE: {
      id: 'PARTICLE_SPHERE',
      label: 'Particle Core Sphere',
      category: 'heroObjects',
      description: 'Luminescent orbiting particle orb',
      previewColor: '#5322ff',
    },
    WIREFRAME_TORUS: {
      id: 'WIREFRAME_TORUS',
      label: 'Wireframe CAD Torus',
      category: 'heroObjects',
      description: 'Rotating vector geometric ring torus',
      previewColor: '#F59E0B',
    },
    NEURAL_ANCHOR: {
      id: 'NEURAL_ANCHOR',
      label: 'Neural Node Mesh',
      category: 'heroObjects',
      description: 'Multi-agent reasoning node cluster',
      previewColor: '#10B981',
    },
    CYBER_PYRAMID: {
      id: 'CYBER_PYRAMID',
      label: 'Cyber Obelisk Pyramid',
      category: 'heroObjects',
      description: 'Extruded high-tech obsidian pyramid',
      previewColor: '#D400FF',
    },
  },

  overlays: {
    CROSSHAIRS: {
      id: 'CROSSHAIRS',
      label: 'Swiss Crosshair Anchors (+)',
      category: 'overlays',
      description: 'Precision CAD target crosshairs on corners',
      previewColor: '#00E5FF',
    },
    TELEMETRY_GRID: {
      id: 'TELEMETRY_GRID',
      label: 'Telemetry HUD Reticle',
      category: 'overlays',
      description: 'Real-time FPS and resolution HUD telemetry',
      previewColor: '#5322ff',
    },
    SCANLINES: {
      id: 'SCANLINES',
      label: 'Retro Scanline Vignette',
      category: 'overlays',
      description: 'Vintage monitor CRT scanlines and dark border',
      previewColor: '#27272a',
    },
    SWISS_DIMENSION: {
      id: 'SWISS_DIMENSION',
      label: 'Swiss Dimension Markers',
      category: 'overlays',
      description: 'Architectural dimension text ΔX = 215mm annotations',
      previewColor: '#F59E0B',
    },
    VECTOR_RETICLE: {
      id: 'VECTOR_RETICLE',
      label: 'Vector Target Reticle',
      category: 'overlays',
      description: 'Circular vector target HUD overlay',
      previewColor: '#FF007A',
    },
  },

  typography: {
    SWISS_BRUTALIST: {
      id: 'SWISS_BRUTALIST',
      label: 'Swiss Brutalist Grotesk',
      category: 'typography',
      description: 'Heavy uppercase JetBrains Mono with cyan accent',
      previewColor: '#FAFAFA',
    },
    CYBERPUNK_MONO: {
      id: 'CYBERPUNK_MONO',
      label: 'Cyberpunk Neon Mono',
      category: 'typography',
      description: 'Futuristic high-contrast neon headline',
      previewColor: '#00E5FF',
    },
    NEON_BOLD: {
      id: 'NEON_BOLD',
      label: 'Neon Gradient Bold',
      category: 'typography',
      description: 'Gradient fill with electric purple glow',
      previewColor: '#D400FF',
    },
    GLITCH_MATRIX: {
      id: 'GLITCH_MATRIX',
      label: 'Glitch Matrix Mono',
      category: 'typography',
      description: 'Digital terminal code styling',
      previewColor: '#10B981',
    },
    MINIMAL_SANS: {
      id: 'MINIMAL_SANS',
      label: 'Minimalist Sans',
      category: 'typography',
      description: 'Clean high-readability architectural text',
      previewColor: '#e4e4e7',
    },
  },
};

export function getAllPresets() {
  return ASSET_PRESET_REGISTRY;
}
