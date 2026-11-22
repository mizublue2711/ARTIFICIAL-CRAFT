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

## 📝 AGENT HANDOVER LOG - 2026-11-03 (JULES)

### 1. Completed System Changes
- Persisted i18n locale state via `localStorage` in `LanguageContext` using key `app_locale` (with fallback synchronization to legacy `ac_lang`).
- Standardized touch target hitboxes (`min-h-[44px]` and `touch-manipulation`) for all Playground Hub cards and hero links in `InteractiveNodeMatrix.tsx`.
- Applied `touch-action: pan-y` and `touch-pan-y` on 3D Viewport wrappers (`CraftStudioConfigurator.tsx` iframe container and `HeadlessSwarmSection.tsx` Three.js canvas container) to prevent mobile scroll hijacking.
- Cleaned up SPA vs External routing (`target="_blank" rel="noopener noreferrer"` on Worker URLs, replaced hard-reload anchor tags in `Navbar.tsx` with React Router `<Link>`).
- Implemented Cybernetic `[ ⬆ TOP ]` smooth scroll navigation via `src/components/BackToTop.tsx` globally mounted in `src/App.tsx`.
- Injected OpenGraph and Twitter card metadata in `index.html`.

### 2. Known Technical Debt & Edge Cases for Next AI Agent
- **n8n / Dify Webhook Environment Variables**: Verify `VITE_N8N_WEBHOOK_URL` in production Cloudflare / Netlify environment configs for live pipeline dispatch. When absent, the application gracefully defaults to `/api/craft/generate` and local fallback AST generators.
- **WebGL Frame Performance on Low-End Mobile**: While `touch-action: pan-y` prevents scroll locking, multiple Three.js contexts on the home page (monolith + pylon swarm) can increase GPU memory pressure on low-tier mobile devices. Consider lazy-initializing WebGL render loops using `IntersectionObserver`.
- **JSON AST Schemas & i18n Keys**: All new UI strings added to configurators should continue to register corresponding translations in `src/locales/translations.ts` under both `en` and `vi` dictionary definitions.

### 3. Next Recommended Tasks
- Implement an `IntersectionObserver` pause hook for offscreen 3D WebGL canvases to conserve battery and GPU cycles on mobile devices.
- Extend end-to-end Playwright tests covering language toggle persistence across full page reloads and back-to-top scroll triggers.
