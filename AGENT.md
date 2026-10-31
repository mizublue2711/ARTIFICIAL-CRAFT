## 1. RULE OF SINGLE SOURCE OF TRUTH (SSOT)
- ALL visual, 3D, canvas, and motion components MUST be registered in `src/core/registry.ts`.
- DO NOT create isolated visual components inside random feature folders.
- When creating a new visual element, always place it in `src/core/remotion-presets/` and map its ID inside `src/core/registry.ts`.

## 2. STRICT DATA CONTRACT & PROP INTERFACE
- All visual components MUST implement `UniversalComponentProps` from `src/types/preset.ts`.
- Mandatory standard props: `seed?: string`, `primaryColor?: string`, `speed?: number`, `interactive?: boolean`.
- Visual components MUST be pure React/SVG/Canvas components that can render seamlessly in both standard Web DOM (Flipbook/Web Sections) and `@remotion/player`.

## 3. JSON-DRIVEN EXECUTION (ZERO-CODE PAGE GENERATION)
- DO NOT rewrite React page layouts to add new sections, books, or video showcases.
- To add or modify content, update the JSON configuration files using registered keys from `registry.ts`:
  * Website Sections: `site-configs/template-schema.json`
  * Flipbook Books: `src/data/books/*.json`
  * Video Showcase Cards: `src/data/showcase-config.json`

## 4. TOKEN EFFICIENCY & CONTEXT BOUNDARY
- When prompt-engineering or instructing AI Workers:
  * ALWAYS refer to `@src/core/registry.ts` and `@src/types/preset.ts` for visual components.
  * DO NOT ask AI Workers to scan the entire codebase to find visual assets.

## 5. ARCHITECTURE PATTERN:
   - This project uses JSON-Driven Architecture (0-Code Operations).
   - Prefer updating `site-configs/template-schema.json` for UI changes over rewriting TSX components.
   - All 3D/UI nodes MUST be registered in `src/core/registry.ts`.

## 6.TOKEN EFFICIENCY:
   - Do NOT scan unneeded folders. Only read `src/components/`, `src/lib/`, and `site-configs/`.

## 7. STRICT BUILD SAFETY:
   - NEVER touch, create, or commit files in `dist/` or `build/`.
   - Verify TypeScript integrity ONLY via: `npx tsc --noEmit`.
   - Always output clean git commits or atomic Pull Requests
