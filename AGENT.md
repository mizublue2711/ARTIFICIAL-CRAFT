# 🤖 ARTIFICIAL-CRAFT // AI WORKER CONSTITUTION & EXECUTION DIRECTIVES
> **Single Source of Truth (SSOT) Architecture Directive for AI Agents (Cursor, Roo Code, Copilot Workspace, Claude Code, Dify)**

---

### 1. RULE OF SINGLE SOURCE OF TRUTH (SSOT) & REGISTRY
- **ALL** visual, 3D, WebGL canvas, and motion components MUST be registered inside `src/core/registry.ts`.
- **DO NOT** create isolated visual components inside random feature folders.
- When creating a new visual element or Remotion preset, place it in `src/core/remotion-presets/` (or `src/components/`) and map its unique ID inside `src/core/registry.ts`.

---

### 2. JSON-DRIVEN EXECUTION (0-CODE WEBSITE OPERATIONS)
- **DO NOT** rewrite React page layouts or `App.tsx` to add new sections, books, or video showcases.
- This project operates strictly as a **Visual Projector Engine** driven by lightweight JSON configuration files:
  - **Main Website Sections & Playground Cards:** `site-configs/template-schema.json`
  - **3D Interactive Flipbook Books:** `src/data/books/*.json`
  - **Video Showcase Cards:** `src/data/showcase-config.json`
- UI modifications MUST be executed by updating JSON configuration files using registered keys from `registry.ts`.

---

### 3. STANDALONE SHELL STRIPPING & COMPONENT ISOLATION
- When migrating or integrating external landing pages or standalone repositories (e.g., external 3D repos):
  - **ALWAYS STRIP AWAY** duplicate `Navbar` and `Footer` components.
  - **ISOLATE** only the core 3D Canvas / Content Body into `src/components/[feature]/` and `src/lib/video-engine/[feature]/`.
  - **NEVER** render duplicate navigation bars or footer containers inside integrated feature nodes.

---

### 4. DATA CONTRACT, TYPES & ALIAS PATH STANDARDIZATION
- All visual components MUST implement `UniversalComponentProps` from `src/types/preset.ts` (Standard props: `seed?: string`, `primaryColor?: string`, `speed?: number`, `interactive?: boolean`).
- Standalone types and datasets MUST be isolated into `src/types/[name].ts` and `src/data/[name].ts`.
- **STRICT ALIAS PATHS:** Convert ALL relative import paths (`../../types`, `../../data`, `../../utils`) to standard `@/` alias paths (`@/types/...`, `@/data/...`, `@/lib/...`).

---

### 5. ATOMIC TASK BOUNDARY & STEP-BY-STEP EXECUTION
- To prevent Context Bloat and Agent Timeout:
- **DO NOT** request AI Workers to clone, refactor, register, and build in a single turn.
- Split complex integration tasks into atomic turns:
    1. *Turn 1:* File migration & path alias standardization.
    2. *Turn 2:* Registry mapping (`src/core/registry.ts`) & Route creation.
    3. *Turn 3:* Schema JSON update (`site-configs/template-schema.json`) & Typecheck verification.

---

### 6. TOKEN EFFICIENCY & CONTEXT BOUNDARY
- When instructing AI Workers, **ALWAYS** point directly to `@src/core/registry.ts` and `@src/types/preset.ts`.
- **DO NOT** ask AI Workers to scan unneeded folders. Only read `src/components/`, `src/lib/`, `src/core/`, and `site-configs/`.

---

### 7. STRICT BUILD SAFETY & GIT DISCIPLINE
- **NEVER** touch, create, or commit files inside `dist/` or `build/`.
- **DO NOT** execute `npm run build` inside Agent CI environments to avoid generating untracked build artifacts.
- Verify code integrity **ONLY** via: `npx tsc --noEmit` (Must pass cleanly with 0 errors).
- **CLEANUP:** Always delete temporary clone folders (`rm -rf temp-*`) immediately after file migration to prevent nested Git submodule conflicts.
- Always output clean git commits or atomic feature Pull Requests (`feat/[node-name]`).

---

### 8. VISUAL INSPECTION PROTOCOL (FOR VISION-ENABLED AGENTS)
- For Vision-enabled AI Workers (Cursor Composer, Roo Code, Cline):
- Inspect rendered browser outputs or design mockups before generating layout fix code.
- Ensure zero z-index conflicts, no scrollbar leaks, and flawless 60FPS WebGL canvas rendering.
