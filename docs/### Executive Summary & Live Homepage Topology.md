
### Executive Summary & Live Homepage Topology

Audit completed strictly against `/Users/macbookpro/ARTIFICIAL-CRAFT`. On the live homepage ([Home.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/pages/Home.tsx) + [App.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/App.tsx)), **3 simultaneous WebGL contexts**, **2 2D Canvas `requestAnimationFrame` loops**, and **2 React-state-driven 60 FPS SVG `rAF` loops** run concurrently with **zero `IntersectionObserver` off-screen pausing**.

> **Path Reconciliation Notes:**
> - **Module 3 (Pylons HUD 3D vs BentoGrid):** Both [BentoGrid.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BentoGrid.tsx) and the 3D Pylons HUD ([HeadlessSwarmSection.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/HeadlessSwarmSection.tsx)) are mounted on `/`. Both are audited below.
> - **Module 4 (Playground):** `/` mounts the teaser hub [InteractiveNodeMatrix.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/playground/InteractiveNodeMatrix.tsx), while [PlaygroundStage.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/PlaygroundStage.tsx) is the Remotion `<Player>` stage used on `/playground`. Both are audited.
> - **Module 7 (`WorkflowLibrary.tsx`):** `src/components/WorkflowLibrary.tsx` does **not** exist in this repository. Production workflow templates, CLI copy, AST JSON download, and HD PNG export are consolidated inside [BlueprintLibrary.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx), while interactive workflow selection lives in [AutomationCockpit.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/AutomationCockpit.tsx).

---

### Homepage 9-Module Architectural Matrix

| # | Module Name & Primary File Path | Interactive Engines | Scroll / Event Risk | Specific Isolation Boundary Needed |
|---|---|---|---|---|
| **1** | **Hero Headline Stage** <br>[HeroHeadlineStage.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/HeroHeadlineStage.tsx) <br>*(via [Hero.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Hero.tsx) + [Monolith3DNode.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/playground/Monolith3DNode.tsx) + [ParticleCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ParticleCanvas.tsx))* | **WebGL (Three.js)** + **2D Canvas** + Framer Motion | **HIGH** | Viewport `IntersectionObserver` pause for `SceneController` & `ParticleCanvas`; set `controls.enableZoom = false` on `OrbitControls` when `orbit` mode is toggled; decouple 60fps `setCurrentTime` React state from `rAF`. |
| **2** | **Automation Cockpit** <br>[AutomationCockpit.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/AutomationCockpit.tsx) <br>*(+ [WorkflowCarousel3D.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/WorkflowCarousel3D.tsx) + [WorkflowSvgCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/WorkflowSvgCanvas.tsx))* | **CSS 3D (`preserve-3d`)** + **SVG DAG** + Framer Motion (`drag`, `useTransform`) | **CRITICAL** | Remove/gate non-passive `wheel` interception of vertical `deltaY` in `WorkflowCarousel3D` (only intercept `deltaX` or Shift+wheel); avoid ancestor `transform`/`filter` that flattens `preserve-3d`. |
| **3** | **BentoGrid & Pylons HUD 3D** <br>[BentoGrid.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BentoGrid.tsx) <br>[HeadlessSwarmSection.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/HeadlessSwarmSection.tsx) | **Pure DOM** (`BentoGrid`) <br>**WebGL (Three.js)** (`HeadlessSwarmSection`) | **MEDIUM** *(Bento: Low / Pylons: High)* | Add `IntersectionObserver` + `visibilitychange` pause to `HeadlessSwarmSection`'s Three.js `rAF` loop; keep `touch-action: pan-y` on canvas wrapper; throttle `onMouseMove` spotlight in `BentoGrid` via CSS variables/rAF. |
| **4** | **Playground Hub & Stage** <br>[InteractiveNodeMatrix.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/playground/InteractiveNodeMatrix.tsx) <br>[PlaygroundStage.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/PlaygroundStage.tsx) | **Pure DOM** (`InteractiveNodeMatrix`) <br>**Remotion `<Player>` + CSS 3D** (`PlaygroundStage`) | **LOW** *(Hub)* / **MEDIUM** *(Stage)* | Hub is safe for any motion wrapper. For `PlaygroundStage`, pause Remotion `autoPlay` when off-screen and avoid wrapping with `transform` that compounds its `perspective: 1200px` + `rotateX`. |
| **5** | **Craft Studio Configurator & Batch Modal** <br>[CraftStudioConfigurator.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx) <br>[BatchProductionModal.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BatchProductionModal.tsx) | **60fps SVG 3D** + **2D/Shader BG** + **Sandboxed `<iframe>` (WebGL)** + **Remotion `<Player>`** + **2D Canvas** (Modal) | **CRITICAL** | **Do NOT wrap with `transform`, `filter`, or `overflow: hidden`** (breaks inner `sticky top-0`, `fixed inset-0` fullscreen/code modals, and nested `overflow-y-auto` wizard). Add `overscroll-behavior: contain` on wizard dock, pause background/3D `rAF` off-screen, and portal modals to `document.body`. |
| **6** | **Blueprint Library** <br>[BlueprintLibrary.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx) | **Pure DOM** + Framer Motion + `html-to-image` | **MEDIUM** | Portal `ExportPreviewModal` and `InspectAstModal` (`fixed inset-0 z-[100]`) to `document.body` before applying any parent `transform` motion wrapper; isolate horizontal `overflow-x-auto` node strips. |
| **7** | **Workflow Library** <br>*(Consolidated into [BlueprintLibrary.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx) & [AutomationCockpit.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/AutomationCockpit.tsx))* | N/A *(File absent; see #2 & #6)* | **N/A** | No standalone `WorkflowLibrary.tsx` exists; isolation boundaries are governed by Module #2 (Cockpit) and Module #6 (BlueprintLibrary). |
| **8** | **Existential Blackbox** <br>[ExistentialBlackbox.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ExistentialBlackbox.tsx) <br>*(+ [ThreeHookCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ThreeHookCanvas.tsx))* | **WebGL (Three.js)** + **2D Canvas HUD** + **Pure DOM Terminal** | **HIGH** | Add `IntersectionObserver` pause to **both** `ThreeHookCanvas` and the 2D HUD `rAF` loops; scope `mousemove` listener from `window` to container; apply `overscroll-behavior: contain` or scroll pass-through on the two `overflow-y-auto` terminal panes. |
| **9** | **Experts & Footer** <br>[Experts.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Experts.tsx) <br>[Footer.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Footer.tsx) <br>*(+ [JulesMemorialModal.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/JulesMemorialModal.tsx))* | **Pure DOM** *(Footer lazy-mounts WebGL/Audio inside Modal on click)* | **LOW** | `Experts` is completely safe for scrollytelling wrappers. In `Footer`, portal `JulesMemorialModal` (`fixed inset-0 z-50`) to `document.body` if `<footer>` receives any `transform`-based reveal or parallax. |

---

### Detailed Per-Module Audit Breakdown

#### 1. Hero Headline Stage (`HeroHeadlineStage.tsx` / `Hero.tsx` / `Monolith3DNode.tsx`)
- **WebGL / Canvas Footprint:**
  - [Monolith3DNode.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/playground/Monolith3DNode.tsx#L74-L107) instantiates `SceneController` ([SceneController.ts](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/core/monolith-engine/src/three/SceneController.ts#L73-L85)), a heavy `THREE.WebGLRenderer` (`preserveDrawingBuffer: true`, `2048×2048` shadow map, `RoomEnvironment` PMREM). Its `startAnimationLoop` runs an unbounded `requestAnimationFrame` loop that **never pauses when off-screen** and triggers React `setCurrentTime` / `setFrameTick` at 60 FPS.
  - Parent [Hero.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Hero.tsx#L23) mounts [ParticleCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ParticleCanvas.tsx#L79-L150) (2D `<canvas>` `rAF`). It pauses on `document.hidden`, but **does not pause when scrolled off-screen**.
  - Fallback `ThreeHookCanvas` ([ThreeHookCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ThreeHookCanvas.tsx#L138-L165)) also runs an unpaused `rAF` loop.
- **Pointer & Mouse Event Traps:**
  - `SceneController` attaches `OrbitControls` to `this.canvas` ([SceneController.ts](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/core/monolith-engine/src/three/SceneController.ts#L105-L112)). `controls.enabled` defaults to `false` (`director` mode), so initial scroll is safe—**however**, if the user clicks `CAMERA MODE: [orbit]` in the compact HUD drawer ([Monolith3DNode.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/playground/Monolith3DNode.tsx#L316)), `OrbitControls` activates with `enableZoom: true` (default), **hijacking vertical mouse-wheel scrolling** over the right 50% of the Hero.
  - `ParticleCanvas` has `pointer-events-none` (safe).
- **Internal Scroll Containers:** None.
- **CSS Sticky & Transform Vulnerabilities:** No `position: sticky`. Parent `Hero.tsx` uses `overflow-x-clip` (safe for sticky). `Monolith3DNode` uses `overflow-hidden` internally. Safe to wrap in a motion container if `SceneController` is viewport-paused.

#### 2. Automation Cockpit (`AutomationCockpit.tsx` / `WorkflowCarousel3D.tsx` / `WorkflowSvgCanvas.tsx`)
- **WebGL / Canvas Footprint:** None. Pure DOM + CSS 3D transforms + animated `<svg>` (`WorkflowSvgCanvas.tsx`). `AutomationCockpit` runs a short-lived `requestAnimationFrame` loop (`2800ms`) only while a test simulation is actively running ([AutomationCockpit.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/AutomationCockpit.tsx#L256-L272)).
- **Pointer & Mouse Event Traps:**
  - **CRITICAL SCROLL HIJACK:** [WorkflowCarousel3D.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/WorkflowCarousel3D.tsx#L265-L312) registers `stageEl.addEventListener('wheel', handleWheel, { passive: false })` and intercepts **vertical `e.deltaY`**, calling `e.preventDefault()` whenever the deck is not at its first or last card. This will directly collide with any global smooth-scroll or scrollytelling engine.
  - Uses Framer Motion horizontal `drag="x"` on the carousel track ([WorkflowCarousel3D.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/WorkflowCarousel3D.tsx#L415-L429)).
- **Internal Scroll Containers:** None.
- **CSS Sticky & Transform Vulnerabilities:** No `position: sticky`. Relies on CSS 3D `perspective: 1200px` and `transformStyle: 'preserve-3d'` ([WorkflowCarousel3D.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/WorkflowCarousel3D.tsx#L407-L413)). Wrapping with `filter` or non-3D `transform` + `overflow: hidden` can flatten 3D card depth if applied directly to the stage.

#### 3. BentoGrid & Pylons HUD 3D (`BentoGrid.tsx` & `HeadlessSwarmSection.tsx`)
- **WebGL / Canvas Footprint:**
  - [BentoGrid.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BentoGrid.tsx): None (pure DOM).
  - [HeadlessSwarmSection.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/HeadlessSwarmSection.tsx#L111-L328): Instantiates a dedicated `THREE.WebGLRenderer` (5 Pylon towers, lasers, 120-particle swarm) with an unbounded `requestAnimationFrame` loop that calls `setFpsCounter` every 500ms. **Not paused when off-screen or when tab is hidden.**
- **Pointer & Mouse Event Traps:**
  - `BentoGrid.tsx` uses `onMouseMove` on every `SpotlightCard` ([BentoGrid.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BentoGrid.tsx#L36-L58)), triggering React `setPos` state updates on cursor movement. The radial gradient overlay has `pointer-events-none` (does not block wheel scroll).
  - `HeadlessSwarmSection.tsx` has **no** `OrbitControls` or `mousemove` listeners; its canvas container sets `touchAction: 'pan-y'` and corner HUD overlays have `pointer-events-none` ([HeadlessSwarmSection.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/HeadlessSwarmSection.tsx#L502-L518))—vertical scroll passes through cleanly.
- **Internal Scroll Containers:** None in either module.
- **CSS Sticky & Transform Vulnerabilities:** Neither uses `position: sticky` or `position: fixed`. Both are structurally safe inside transform-based motion wrappers once `HeadlessSwarmSection`'s WebGL loop is viewport-gated.

#### 4. Playground Hub & Stage (`InteractiveNodeMatrix.tsx` & `PlaygroundStage.tsx`)
- **WebGL / Canvas Footprint:**
  - [InteractiveNodeMatrix.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/playground/InteractiveNodeMatrix.tsx) (mounted on `/`): None (pure DOM links/cards).
  - [PlaygroundStage.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/PlaygroundStage.tsx#L60-L75) (mounted on `/playground`): Renders Remotion `<Player autoPlay loop fps={60} />` wrapping [ArtificialCraftScene.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ArtificialCraftScene.tsx) (DOM/CSS spring animations). Runs continuously at 60 FPS (`frameupdate` calls `setCurrentFrame` every frame) and is **not paused when off-screen**.
- **Pointer & Mouse Event Traps:**
  - `InteractiveNodeMatrix.tsx`: Background grid has `pointer-events-none`; no pointer traps.
  - `PlaygroundStage.tsx`: Telemetry badge has `pointer-events-none`; Remotion `<Player controls>` captures clicks on its playback bar only.
- **Internal Scroll Containers:** None.
- **CSS Sticky & Transform Vulnerabilities:** No `position: sticky`. `PlaygroundStage` applies `perspective: '1200px'` + `transform: scale(...) rotateX(...)` ([PlaygroundStage.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/PlaygroundStage.tsx#L54-L58)), so any outer motion wrapper should avoid competing 3D transforms.

#### 5. Craft Studio Configurator & Batch Production Modal (`CraftStudioConfigurator.tsx` & `BatchProductionModal.tsx`)
- **WebGL / Canvas Footprint:**
  - [CraftStudioConfigurator.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx):
    - Default background (`SwissGridHUD` and all 9 shader backgrounds in `src/lib/video-engine/components/backgrounds/`) runs an **unpaused 60 FPS `rAF` loop**.
    - Default 3D model ([PneumaticLetterA3D.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/robotics/3d/PneumaticLetterA3D.tsx#L150-L159)) runs its own **unpaused 60 FPS `rAF` loop** calling `setInternalFrame`.
    - Fallback models render a live `<iframe srcDoc={generatedHtml}>` ([CraftStudioConfigurator.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L2267-L2276)) executing a standalone Three.js WebGL scene inside the iframe.
    - Switching to `remotion-video` mode mounts Remotion `<Player autoPlay loop>` ([CraftStudioConfigurator.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L2322-L2356)).
  - [BatchProductionModal.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BatchProductionModal.tsx#L214-L358) (mounted globally in [App.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/App.tsx#L50-L53)): Uses two static on-demand 2D `<canvas>` elements (`canvasRef1`, `canvasRef2`) in Step 3—**no `rAF` loop**.
- **Pointer & Mouse Event Traps:**
  - `CraftStudioConfigurator.tsx` attaches `onPointerMove` to the viewport container ([line 2023](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L2021-L2030)), calling `setPointerCoords` on every move and re-rendering the entire 2,495-line component.
  - When the fallback `<iframe>` is active (`pointer-events-auto`, [line 2275](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L2267-L2276)), **wheel events over the iframe are swallowed by the nested document** and will stall vertical page scrolling.
- **Internal Scroll Containers:**
  - **Wizard Sidebar:** `lg:h-[calc(100vh-108px)] overflow-y-auto` ([line 756](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L756)) — **major vertical scroll trap** on desktop.
  - **Compile Logs:** `max-h-40 overflow-y-auto` ([line 1841](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L1841)).
  - **Code Modal:** `max-h-[85vh]` + `overflow-auto` ([lines 2420, 2477](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L2419-L2478)).
  - **BatchProductionModal:** `max-h-[92vh]` + `overflow-y-auto` body ([line 478](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BatchProductionModal.tsx#L478)) + `h-56 overflow-y-auto` terminal console ([line 639](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BatchProductionModal.tsx#L639)).
- **CSS Sticky & Transform Vulnerabilities:**
  - **CRITICAL:** Contains `sticky top-0 z-30` step indicator inside the wizard `<aside>` ([line 758](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L758)).
  - **CRITICAL:** Fullscreen mode (`isFullscreen ? 'fixed inset-0 z-50'`, [line 1874](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L1874)) and Code Modal (`fixed inset-0 z-50`, [line 2419](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/studio/CraftStudioConfigurator.tsx#L2419)) are rendered inline without a React Portal. Any ancestor `transform`, `perspective`, or `filter` from a motion wrapper will break `position: fixed` containment.

#### 6. Blueprint Library (`BlueprintLibrary.tsx`)
- **WebGL / Canvas Footprint:** None. Uses `html-to-image` (`toPng`) on demand for HD diagram export ([BlueprintLibrary.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx#L289-L307)).
- **Pointer & Mouse Event Traps:** None. Hidden off-screen export staging node (`left: -99999px`) has `pointerEvents: 'none'` ([line 484](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx#L484)).
- **Internal Scroll Containers:**
  - Horizontal node workflow strip: `overflow-x-auto` ([line 361](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx#L361)).
  - `ExportPreviewModal`: `max-h-[70vh] overflow-auto` ([line 109](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx#L109)).
  - `InspectAstModal`: `max-h-[65vh] overflow-auto` + `overflow-x-auto` ([lines 196–197](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx#L196-L197)).
- **CSS Sticky & Transform Vulnerabilities:** No `position: sticky`. However, `ExportPreviewModal` and `InspectAstModal` (`fixed inset-0 z-[100]`) are rendered **inside** `<motion.div>` `BlueprintCard` ([lines 318, 585–605](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx#L584-L605)). Any active `transform` on `BlueprintCard` or a parent scrollytelling section will trap these modals inside the card bounds.

#### 7. Workflow Library (`WorkflowLibrary.tsx`)
- **Status:** File does **not** exist in `/Users/macbookpro/ARTIFICIAL-CRAFT`. Its responsibilities are split between [AutomationCockpit.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/home/AutomationCockpit.tsx) (interactive workflow deck & simulation) and [BlueprintLibrary.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/BlueprintLibrary.tsx) (production templates, CLI copy, JSON/PNG downloads).

#### 8. Existential Blackbox (`ExistentialBlackbox.tsx` / `ThreeHookCanvas.tsx`)
- **WebGL / Canvas Footprint:**
  - Mounts [ThreeHookCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ThreeHookCanvas.tsx#L24-L165) (**WebGL Context #3** on `/`) with an unpaused 60 FPS `rAF` loop.
  - Mounts a second 2D `<canvas>` HUD overlay ([ExistentialBlackbox.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ExistentialBlackbox.tsx#L73-L166)) running a separate unpaused 60 FPS `rAF` loop (`drawEngine`), which also tears down and restarts whenever `isTyping` toggles.
- **Pointer & Mouse Event Traps:**
  - `ThreeHookCanvas` attaches a **global** `window.addEventListener('mousemove', onMouseMove, { passive: true })` ([ThreeHookCanvas.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ThreeHookCanvas.tsx#L124-L132)) that calls `container.getBoundingClientRect()` on **every mouse move anywhere on the page**, forcing layout reads even when off-screen.
  - The 2D HUD canvas and bottom telemetry badge use `pointer-events-none` (safe).
- **Internal Scroll Containers:**
  - Command selector list: `overflow-y-auto max-h-[35vh]` ([line 251](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ExistentialBlackbox.tsx#L251)).
  - Terminal response pane: `flex-1 overflow-y-auto min-h-[180px]` ([line 277](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ExistentialBlackbox.tsx#L277)).
  - Both can trap vertical wheel scrolling when the cursor rests on the right half of the section.
- **CSS Sticky & Transform Vulnerabilities:** No `position: sticky` or `position: fixed`. Outer container has `overflow-hidden` ([line 192](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/ExistentialBlackbox.tsx#L192)). Safe to wrap with transforms once `rAF` loops and `getBoundingClientRect()` are viewport-gated.

#### 9. Experts & Footer (`Experts.tsx` & `Footer.tsx`)
- **WebGL / Canvas Footprint:**
  - [Experts.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Experts.tsx): None (pure DOM + Framer Motion `whileInView`).
  - [Footer.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Footer.tsx): None on initial render. Clicking the Google Jules tribute button mounts [JulesMemorialModal.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/JulesMemorialModal.tsx) (`JulesMemorialNode` + Web Audio API `AudioContext`).
- **Pointer & Mouse Event Traps:** None.
- **Internal Scroll Containers:** None.
- **CSS Sticky & Transform Vulnerabilities:** No `position: sticky`. `Footer.tsx` renders `JulesMemorialModal` (`fixed inset-0 z-50`) inline inside `<footer>` ([Footer.tsx](file:///Users/macbookpro/ARTIFICIAL-CRAFT/src/components/Footer.tsx#L203-L206)), so `<footer>` must **not** hold a persistent `transform` unless `JulesMemorialModal` is portaled to `document.body`.

---

### Pre-Flight Guardrails Before Building the Global Motion Framework

1. **Mandatory WebGL / `rAF` Viewport Gate:** Introduce a shared `useInViewport` (`IntersectionObserver`) pause hook across `Monolith3DNode` (`SceneController`), `ParticleCanvas`, `HeadlessSwarmSection`, `CraftStudioConfigurator` (background + 3D SVG presets), and `ExistentialBlackbox` (`ThreeHookCanvas` + 2D HUD) so only the active viewport's GPU/CPU loops run during scrollytelling.
2. **Eliminate Wheel Hijacking:**
   - Patch `WorkflowCarousel3D.tsx` to only `preventDefault()` on horizontal trackpad swipes (`Math.abs(e.deltaX) > Math.abs(e.deltaY)`), releasing vertical `deltaY` to the global scroll engine.
   - Set `controls.enableZoom = false` in `SceneController.ts` when `Monolith3DNode` is in `compact` homepage mode.
3. **Portal All `fixed` Modals:** Move inline `fixed inset-0` modals (`BlueprintLibrary`, `CraftStudioConfigurator`, `Footer`) into `createPortal(..., document.body)` so section-level motion transforms (`translateY`, `scale`, `clip-path`) never break modal positioning.
4. **Exempt `CraftStudioConfigurator` from Scroll-Linked Transforms:** Treat `#studio-configurator` as a **static isolation island** (no persistent `transform` or `overflow: hidden` on its wrapper) to preserve its internal `sticky` wizard bar, `fixed` fullscreen mode, and nested scroll dock.