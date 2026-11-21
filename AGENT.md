# 🏛️ ARTIFICIAL CRAFT // AGENT DIRECTIVES & SYSTEM CONSTITUTION

### 🎯 1. REPOSITORY RUNTIME & WORKSPACE CONFINEMENT
* **Environment**: Local Vite + React Single Page Application (SPA).
* **Authorized Workspace**: Confine all operations strictly to `/Users/macbookpro/ARTIFICIAL-CRAFT`.
* **Execution Toolkit**: Exclusively use packages pre-installed in `package.json` (`tailwindcss`, `framer-motion`, `three`, `@react-three/fiber`, `lucide-react`).
* **Source of Truth Directory Matrix**:
  - Core Registry (SSOT): `src/core/registry.ts`
  - Motion Lego Blocks: `src/components/motion/`
  - Domain Components: `src/components/`
  - Routes & Entry Points: `src/App.tsx`, `src/pages/`
  - AST Schemas & Presets: `src/data/`, `site-configs/template-schema.json`
  - Bilingual Dictionaries: `src/locales/`
* **Modular Pipeline Sub-Protocols**: Specialized media generation tracks (such as Remotion Video Engine and Flipbook Animations) are governed by dedicated external protocols in their respective isolated modules.

---

### 🗄️ 2. SINGLE SOURCE OF TRUTH (SSOT) REGISTRY & LEGO REUSE CONTRACT
* **Pre-Creation Registry Inspection (Lookup-First Protocol)**:
  - Before engineering any new component, UI node, or motion block, always inspect `src/core/registry.ts` and existing directories to check if the component or an equivalent already exists.
  - When an existing component matches requirements: Reuse it directly via props or extend it with lightweight wrapping.
  - Creating duplicate variants of components already cataloged in the Registry is strictly prevented.
* **Mandatory Component Registration**:
  - Every newly authorized Lego wrapper, 3D viewport, or pipeline template must be formally registered in `src/core/registry.ts` with explicit type contracts.
* **Lego Wrapper Architecture (`src/components/motion/`)**:
  - Encapsulate complex visual behaviors into reusable wrappers:
    * `<ViewportStage>`: Full-screen `100dvh` layout enclosure with touch defense.
    * `<TextReveal>`: Fluid kinetic split-text typography.
    * `<MagneticButton>`: Physics-based magnetic cursor tracking.
    * `<PerspectiveCard>`: Hardware-accelerated 3D tilt and depth container.
  - When engineering page sections, assemble registered Lego blocks rather than recoding raw animation loops inside individual components.

---

### ⚙️ 3. JSON-DRIVEN EXECUTION (0-CODE WEBSITE OPERATIONS)
* **Data-First Maintenance**:
  - Content, telemetry tags, workflow presets, node connections, and showcase items are defined strictly via JSON AST schemas (`src/data/` and `site-configs/template-schema.json`).
  - Perform operational and UI adjustments by updating configuration schemas and presets, preserving structural component code for underlying mechanics.

---

### 🌐 4. DUAL-LANGUAGE LOCALIZATION CONTRACT (EN / VI)
* **Bicultural Parity**:
  - Every UI string, heading, telemetry label, button label, and modal message must exist symmetrically in both English (EN) and Vietnamese (VI).
  - Localization files reside strictly in `src/locales/` (`translations.ts`, `showcase.en.ts`, `showcase.vi.ts`).
  - When adding new data attributes to JSON schemas, supply paired bilingual keys (`{ "label_en": "...", "label_vi": "..." }` or matching translation keys). Hardcoding unlocalized static text inside TSX components is prevented.

---

### 📐 5. AWWWARDS-TIER FRONTEND & DESIGN SYSTEM PROTOCOL
* **Full-Viewport Canvas Standard**:
  - Primary landing viewports span dynamic full-screen height naturally using `min-h-[100dvh]`.
  - Maximize horizontal layout immersion using expansive width containers (`max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16`).
* **Monumental Swiss Typography**:
  - Establish extreme scale hierarchy: Primary headlines utilize monumental fluid sizing (`text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.88] text-white break-words`).
  - Supporting telemetry, badges, and coordinate tags use crisp mono typography (`text-xs font-mono text-[#00E5FF] tracking-widest uppercase`).
  - Body narratives use comfortable, legible sizing (`text-base lg:text-lg text-zinc-300 font-sans leading-relaxed`).
* **Mobile-First Touch Defense**:
  - Small viewports (< 768px) apply `pointer-events-none` to decorative 3D canvases to preserve effortless one-thumb vertical page scrolling.
  - Interactive CTA buttons, dials, and control decks retain `pointer-events-auto`.

---

### ⚡ 6. PERFORMANCE & MOTION GOVERNANCE (60 FPS CLIENT RENDER)
* **Hardware-Accelerated Animation**:
  - Visual transitions are restricted to composite properties: `transform` (translate, scale, rotate) and `opacity`.
  - Layout geometry (`width`, `height`, `padding`, `margin`) remains stable during animations to prevent browser reflow.
* **Physics-Driven Motion**:
  - Prefer Framer Motion springs (`type: "spring"`, `stiffness: 260`, `damping: 24`) for natural tactile feedback.
* **3D Canvas Health**:
  - Cap WebGL pixel ratio at `Math.min(window.devicePixelRatio, 1.5)`.
  - Clean up requestAnimationFrame loops and dispose of geometries/materials when components unmount.

---

### 🛡️ 7. ATOMIC TASK EXECUTION & DETERMINISTIC BUILD GATE
* **Atomic Objective Rule**: Execute exactly one atomic feature, wrapper, or refactor per turn.
* **Preserve Neighboring State**: When refactoring an interactive block, verify that adjacent controls, audio hooks, and simulation loops remain fully wired.
* **Deterministic Build Gate**:
  - Validate every code modification through the local TypeScript compiler:
    `npx tsc --noEmit`
  - Deliver changes only when the TypeScript gate exits with **0 errors**.
