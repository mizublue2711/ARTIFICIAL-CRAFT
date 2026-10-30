# ARCHITECTURE HANDOVER & SYSTEM REGISTRY

## 1. Overview
This repository (`artificialcraft.space`) integrates branding tokens, React vector logo components, dynamic 2D/3D visual canvas engines, and structured JSON configuration specs for integration into the centralized Remotion Video Engine (`auto-video-remotion`).

## 2. Design Tokens & Branding Configuration
* **Primary Color**: `#00E5FF` (Cyber Cyan Glow)
* **Accent Color**: `#5322ff` (Electric Purple Neon)
* **Background Color**: `#09090b` (Deep Obsidian / Zinc 950)
* **Text Color**: `#e4e4e7` (Zinc 200 / Swiss White)
* **JSON Config**: `site-configs/artificial-craft.json`

## 3. Central Component Registry (`src/core/registry.ts`)
All generative visual components, branding logos, and canvas engines are exported through a unified registry interface:

| Component Name | File Location | Description |
|---|---|---|
| `ArtificialCraftLogo` | `src/components/logos/ArtificialCraftLogo.tsx` | Standalone SVG logo component with custom props |
| `BrutalistLogo` | `src/components/BrutalistLogo.tsx` | Animated brutalist logo with logarithmic spiral arcs |
| `ParticleCanvas` | `src/components/ParticleCanvas.tsx` | 2D Canvas ambient interactive particle engine |
| `ThreeHookCanvas` | `src/components/ThreeHookCanvas.tsx` | 3D Three.js interactive parallax mesh canvas |
| `PlugAndPlaySandbox` | `src/components/PlugAndPlaySandbox.tsx` | Generative algorithm lab with telemetry console |
| `CsvDataVisualizer` | `src/components/CsvDataVisualizer.tsx` | Open Mekong CKAN data visualization engine |
| `ExistentialBlackbox` | `src/components/ExistentialBlackbox.tsx` | 60FPS substrate engine & terminal manifesto |

## 4. Universal Component Props (`src/types/preset.ts`)
```ts
export interface UniversalComponentProps {
  seed?: number;
  primaryColor?: string;
  speed?: number;
  interactive?: boolean;
  theme?: 'dark' | 'light' | 'brutalist' | 'cyberpunk';
  width?: number | string;
  height?: number | string;
  className?: string;
}
```

## 5. Generic Visual Renderer (`src/core/GenerativeVisual.tsx`)
`GenerativeVisual` resolves components dynamically from `registry.ts` given a `componentType` string identifier.

```tsx
<GenerativeVisual componentType="ArtificialCraftLogo" width={48} height={48} />
```

## 6. Build Verification
Command: `npm run lint && npm run typecheck && npm run build`
Status: **PASSED (0 Errors)**
