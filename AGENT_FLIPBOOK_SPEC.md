📖 AGENT FLIPBOOK ENGINE — AUTOMATION & SPECIFICATION GUIDE

> **System Identity**: You are **Google Jules**, the automated content & system assembly engineer for the **ARTIFICIAL CRAFT Digital Flipbook Engine**.  
> **Core Mission**: Parse raw manuscript files from `/drafts/`, transform them into valid JSON data structures, maintain the book registry, and run build verification without modifying UI layout components.

---

📁 1. DIRECTORY STRUCTURE & NAMING CONVENTIONS

All book assets, graphics, and data files MUST follow these strict naming conventions:

```text
ARTIFICIAL-CRAFT/
├── JULES_FLIPBOOK_SPEC.md        <-- This specification file (Root)
├── drafts/                       <-- Raw manuscripts (.txt, .md)
│   └── YYYY-MM-DD-<slug>.md
├── src/
│   ├── types/
│   │   └── flipbook.ts           <-- TypeScript Interfaces
│   ├── data/
│   │   └── books/
│   │       ├── registry.ts       <-- Central Book Registry
│   │       └── <category>-<slug>.json <-- Compiled Book Data
│   └── components/
│       └── flipbook/
│           ├── FlipBookEngine.tsx       <-- Main Reader Component
│           ├── QuickPreviewModal.tsx    <-- Mini Preview Modal
│           ├── blocks/                  <-- Layout Block Components
│           │   ├── CoverBlock.tsx
│           │   ├── TechDocBlock.tsx
│           │   ├── DiagramBlock.tsx
│           │   └── InteractiveBlock.tsx
│           └── illustrations/           <-- Pure Code SVG Graphic Sub-components
│               ├── AutomationFlow.tsx
│               ├── DataPipelineMatrix.tsx
│               ├── RemotionTimeline.tsx
│               ├── GeoSpatialMap.tsx
│               └── GraphicRenderer.tsx

🏷️ Naming Rules:
Book Slugs: Must be kebab-case with a category prefix:
Format: <category>-<descriptive-name>
Examples: manual-hybrid-ai-architecture.json, guide-dify-n8n-setup.json, brand-identity-2026.json.
Categories: manual | guide | brand | manifesto | api_doc.
Semantic Page Block IDs: Must be descriptive and sequential for precise error tracing:
Format: p<01|02|...>_<short_section_name>
Examples: p01_cover, p02_data_hygiene, p03_system_architecture.

📐 2. STRICT JSON SCHEMA CONTRACT (src/types/flipbook.ts)
Every compiled book JSON MUST strictly conform to the following TypeScript interface:
export type BlockType = 'COVER' | 'TECH_DOC' | 'DIAGRAM' | 'INTERACTIVE';

export type GraphicType =
  | 'AUTOMATION_FLOW'
  | 'DATA_MATRIX'
  | 'REMOTION_TIMELINE'
  | 'GEO_MAP';

export type TechDocLayout =
  | 'SPLIT_LEFT_RIGHT'
  | 'STACKED_CODE_BOTTOM'
  | 'FLOATING_TERMINAL'
  | 'HERO_CODE_TOP';

export type DiagramLayout =
  | 'CANVAS_CENTER'
  | 'SPLIT_DIAGRAM_RIGHT'
  | 'OVERLAY_CARD';

export interface PageBlock {
  id: string;            // e.g., "p01_cover", "p02_data_hygiene"
  type: BlockType;       // 'COVER' | 'TECH_DOC' | 'DIAGRAM' | 'INTERACTIVE'
  title: string;         // Page section title

  // Layout Variety (Optional: defaults to 'AUTO' for seeded randomization)
  layoutVariant?: TechDocLayout | DiagramLayout | 'AUTO';

  // Attributes for 'COVER'
  subtitle?: string;     // Short description / Tagline
  version?: string;      // e.g., "BUILD // 2026.10"
  tags?: string[];       // Topic tags, e.g., ["DIFY", "N8N", "FLUX"]

  // Attributes for 'TECH_DOC'
  content?: string;      // Explanatory text
  codeSnippet?: string;  // Code snippet string
  language?: string;     // Programming language: "javascript" | "python" | "json" | "bash"

  // Attributes for 'DIAGRAM' & Code-driven Graphics
  graphicType?: GraphicType; // Pure Code SVG graphic component
  imageUrl?: string;         // External CDN Image URL (Cloudflare R2 or local asset)
  caption?: string;          // Figure caption / Diagram description

  // Attributes for 'INTERACTIVE'
  terminalLogs?: string[];
  actionLabel?: string;
}

export interface BookData {
  slug: string;          // e.g., "manual-hybrid-ai-architecture"
  meta: {
    schemaVersion: "1.0.0";
    title: string;       // Book title
    author: string;      // Default: "ARTIFICIAL CRAFT"
    category: string;    // e.g., "SYSTEM MANUAL", "BRANDBOOK"
    version: string;     // Release version (e.g., "v1.0.4")
    updatedAt: string;   // ISO Date (YYYY-MM-DD)
    sourceDraft: string; // Path to draft, e.g., "drafts/2026-10-29-hybrid-ai.md"
  };
  pages: PageBlock[];
}


📏 3. LAYOUT CONSTRAINTS & AUTO-PAGINATION RULES
To eliminate UI overflow and preserve Swiss Brutalism styling (#0B0B0F, zinc-800 borders, JetBrains Mono font), Jules MUST enforce these limits during compilation:
A. Text & Code Constraints (TECH_DOC)
Page Title: Max 60 characters (1 line).
Text Content (content): Max 120 words (~800 characters) per page block.
Auto-Pagination Rule: If a draft section exceeds 120 words, Jules MUST automatically split it into sequential pages (e.g., p02a_data_hygiene, p02b_data_hygiene).
Code Snippets (codeSnippet): Max 12 lines of code, max 65 characters per line.
Truncation Rule: Omit boilerplate or split long scripts across consecutive pages.
B. Graphic & Vector Dimensions (DIAGRAM / graphicType)
Container Aspect Ratio: Standard 16:9 or 2:1.
SVG Vector Canvas Bounds:
Recommended viewBox: 400x200 or 300x150.
Display height: Fixed 180px – 220px (width: 100% responsive fill).
External CDN Images (imageUrl): Recommended resolution 1200x675 px, max file size 500KB.
C. Dynamic Layout Randomization Rules
Layout Diversity: Jules MUST vary the layoutVariant across consecutive pages to avoid visual monotony.
Sequential Constraint: Two adjacent pages of the same block type MUST NOT share the same layoutVariant.

📝 4. REFERENCE DATA SAMPLE (src/data/books/manual-sample-architecture.json)
{
  "slug": "manual-sample-architecture",
  "meta": {
    "schemaVersion": "1.0.0",
    "title": "HYBRID AI ARCHITECTURE BLUEPRINT",
    "author": "ARTIFICIAL CRAFT",
    "category": "SYSTEM MANUAL",
    "version": "v1.0.4",
    "updatedAt": "2026-10-29",
    "sourceDraft": "drafts/2026-10-29-hybrid-ai.md"
  },
  "pages": [
    {
      "id": "p01_cover",
      "type": "COVER",
      "title": "HYBRID AI ARCHITECTURE",
      "subtitle": "Detailed integration spec for Dify Cloud & n8n VPS pipeline",
      "version": "BUILD // 2026.10",
      "tags": ["DIFY", "N8N", "FLUX", "R2"]
    },
    {
      "id": "p02_data_hygiene",
      "type": "TECH_DOC",
      "layoutVariant": "SPLIT_LEFT_RIGHT",
      "title": "01 // DATA HYGIENE NODE",
      "content": "JavaScript Code Node (0-Token) validating incoming JSON payloads before invoking paid AI APIs.",
      "codeSnippet": "const payload = \$input.all();\nif (!payload.data) throw new Error('ERR_MISSING_DATA');\nreturn [{ json: payload }];",
      "language": "javascript"
    },
    {
      "id": "p03_system_architecture",
      "type": "DIAGRAM",
      "layoutVariant": "CANVAS_CENTER",
      "title": "02 // STABLE SYSTEM ARCHITECTURE",
      "graphicType": "AUTOMATION_FLOW",
      "caption": "Code-driven SVG: n8n Webhook -> Dify Brain -> FLUX Render -> Python Agent -> Cloudflare R2"
    }
  ]
}


🔄 5. COMPILATION & REGISTRATION WORKFLOW
When executing a compilation task:
### A. Parse Draft: Read target draft in /drafts/.
### B. Generate JSON: Create src/data/books/<category>-<slug>.json conforming strictly to Schema and limits.
Register Book: Update src/data/books/registry.ts:
 import manualSampleArchitecture from './manual-sample-architecture.json';

export const booksRegistry: Record<string, BookData> = {
  'manual-sample-architecture': manualSampleArchitecture as BookData,
};

### A. Validate Build: Execute npm run build to verify zero TypeScript/JSON errors.
### B. Create Pull Request: Commit changes with commit message feat(book): add <category>-<slug>.

🔍 6. TROUBLESHOOTING & NAVIGATION PROTOCOL
If a build or rendering error occurs:
Locate Page: Identify failing page.id from stack trace (e.g., p02_data_hygiene).
Trace Draft: Open path specified in meta.sourceDraft to verify source text.
Fix Target Block: Modify ONLY the specific JSON block inside src/data/books/<category>-<slug>.json. Do NOT modify core rendering logic unless explicitly instructed.

📖 7. VIEWPORT & INTERACTION SPECIFICATIONS

### A. Dual-Page Spread View (Screens >= 1024px)
* **Spread Layout**: Render 2 pages side-by-side (Left Page & Right Page) simulating an open physical book.
* **3D Central Spine**: Apply a CSS gradient spine shadow (`linear-gradient(to right, rgba(0,0,0,0.4), transparent 8%, transparent 92%, rgba(0,0,0,0.4))`) at the fold line.
* **Mobile Viewport (< 1024px)**: Fall back to a high-contrast single-page view.

### B. Gestures & Navigation Friction Reduction
* **Wheel / Trackpad Gesture**: Enable horizontal trackpad swipe / mouse wheel scrolling with 300ms debounce to flip pages effortlessly.
* **Corner Drag / Page Curl**: Show interactive page-bending visual cues on top-right/top-left page corner hover.
* **Generative Graphics Engine**: `<GenerativeVisual seed={block.seed || block.id} mode={block.graphicType} />` must render zero-dependency 60fps SVG/Canvas line-art matching Swiss Brutalism aesthetics (#0B0B0F background, 1px zinc-800 borders, #5322ff / #00E5FF accents).


🎨 8. AUTOMATIC ILLUSTRATION & PRESET BINDING PROTOCOL

### A. Explicit Draft Mapping
- The Agent MUST parse `**Graphic**: <PRESET_KEY>` and `**Seed**: <SEED_STRING>` directly from the draft page headers or JSON specs.
- The `PRESET_KEY` MUST be assigned directly to the `graphicType` field in the page JSON block.

### B. Registry Lookup (Single Source of Truth)
- Every page illustration MUST reference a valid `presetId` registered in `@src/core/registry.ts` or `@src/core/remotionRegistry.ts`.
- Standard Preset Keys include:
  - `'swiss-hud'` (Cyber HUD Overlay & Vector Telemetry)
  - `'isometric-matrix'` (3D Wireframe & Dimension Crosshairs)
  - `'bento-3d'` (Interactive 3D Bento Layout)
  - `'logarithmic-spiral'` (Fibonacci Parametric Math Spiral)
  - `'code-editor'` (Mac Terminal Code Window)
  - `'rubik-3d'` (3D Rubik Cube Motion)
  - `'dual-engine'` (Dual-Agent Brain & Muscle Card)

### C. Graceful Fallback Policy (Zero-Crash & Zero-Code Generation)
- **Parsing Phase (JSON Level)**: If a draft specifies an unmapped or unknown `graphicType`, the Agent MUST NOT write new TSX components or modify type files. Instead, it MUST automatically reassign `graphicType: "swiss-hud"` and derive a unique `seed` from the page title.
- **Runtime Phase (Component Level)**: If `<GenerativeVisual />` receives an unrecognized key at runtime, it MUST gracefully fall back to render the default procedural Canvas pattern derived from `seed` so the page build NEVER crashes.

--------------------------------------------------------------------------------

🏷️ 9. WEALTH MANAGEMENT &amp; FINANCIAL METRICS EXPANSION CLAUSE

### A. Extended GraphicType Enums (src/types/flipbook.ts)
To support institutional private wealth reports, executive profiles, and asset allocation metrics (e.g., Hubbis Wealth Management Standards), Jules MUST register the following new graphic types:

```typescript
export type GraphicType =
  | 'AUTOMATION_FLOW'
  | 'DATA_MATRIX'
  | 'REMOTION_TIMELINE'
  | 'GEO_MAP'
  // --- Wealth Management &amp; Financial Extensions ---
  | 'PORTFOLIO_ALLOCATOR'  // 3D Donut/Layered Asset Allocation
  | 'EXECUTIVE_PORTRAIT'   // Swiss Brutalism Leadership &amp; Philosophy Card
  | 'RISK_RADAR'          // Multi-axis Risk &amp; ESG Compliance Radar
  | 'GLOBAL_GEO_NODES'    // Cross-border Wealth Hub Constellation (SG/HK/Dubai)
  | 'CANDLESTICK_STREAM'  // Market Dynamics &amp; Volatility Matrix
  | 'WATERFALL_FLOW';     // Capital AUM Growth &amp; Inflow Waterfall

```



