# 📚 MASTER FLIPBOOK REGISTRY GUIDE: 9-BOOK CATALOG & JULES INTEGRATION SPEC
*Target Platform: https://artificialcraft.space/library*
*Authoring Style: Dave Trott (Concise, Contrast-Driven, High-Impact)*
*Target Consumer Agent: Google Jules Builder (JSON-Driven / Video-as-Code Pipeline)*

---

## 📑 1. EXECUTIVE SUMMARY & FULL CATALOG OVERVIEW

This master guide consolidates **all 9 Digital Flipbooks** created for the Artificial Craft Technology Library into a single operational registry. Each flipbook is powered by a JSON-driven payload, Dave Trott style narrative, and Swiss Brutalism 60fps graphic components.

| Book # | Flipbook ID (`slug`) | Book Title | Core Category | Primary Graphic Components |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `tech-lib-01-dify-n8n-hybrid` | THE BRAIN AND THE MUSCLE | AI Automation Infrastructure | `bento-3d`, `dual-engine`, `metric-badge` |
| **02** | `tech-lib-02-video-as-code` | THE TIMELINE IS DEAD | Video-as-Code & Remotion | `swiss-hud`, `isometric-matrix`, `kinetic-type` |
| **03** | `tech-lib-03-ffmpeg-heavy-lifter` | THE INVISIBLE HEAVY LIFTER | Cloud Media Engineering | `code-editor`, `marquee-ticker`, `metric-badge` |
| **04** | `tech-lib-04-brutalist-generative-seed` | BRUTALISM & GENERATIVE SEED | Generative UI & Design System | `swiss-hud`, `logarithmic-spiral`, `app-mockup` |
| **05** | `tech-lib-05-fail-fast-zod-guardrails` | FAIL FAST OR DRIFT FOREVER | Reliability & Zod Guardrails | `rubik-3d`, `swiss-grid`, `master-director` |
| **06** | `tech-lib-06-robotics-factory-3d` | THE EXPLODED FACTORY | Industrial 3D & Robotics | `isometric-matrix`, `bento-3d`, `metric-badge` |
| **07** | `tech-lib-07-spatial-point-cloud-ai` | PHYSICAL AI & POINT CLOUD | Physical AI & Spatial Computing | `swiss-hud`, `code-editor`, `app-mockup` |
| **08** | `tech-lib-08-studio-configurator-ast` | THE NO-CODE 3D AST ENGINE | B2B Configurator & Web 3D | `bento-3d`, `code-editor`, `app-mockup` |
| **09** | `tech-lib-09-brutalism-iframe-sandbox` | CYBERNETIC BRUTALISM & IFRAME | Cybernetic UI & Web Security | `swiss-hud`, `dual-engine`, `metric-badge` |

---

## 📂 2. SOURCE DRAFT ARTIFACT LOCATIONS

All 9 source draft files containing full JSON payloads and Dave Trott body text are stored in the Studio artifacts environment:

1. **Part 1 (Books 01 - 05)**: `jules-technology-library-drafts.md`
2. **Part 2 (Books 06 - 07)**: `jules-robotics-flipbook-drafts.md`
3. **Part 3 (Books 08 - 09)**: `jules-studio-configurator-flipbook-drafts.md`

---

## 🛠️ 3. CENTRAL REGISTRY CONFIGURATION (`src/data/books/registry.ts`)

When executing the multi-book generation task, Google Jules must update `src/data/books/registry.ts` as follows:

```typescript
import book1 from './tech-lib-01-dify-n8n-hybrid.json';
import book2 from './tech-lib-02-video-as-code.json';
import book3 from './tech-lib-03-ffmpeg-heavy-lifter.json';
import book4 from './tech-lib-04-brutalist-generative-seed.json';
import book5 from './tech-lib-05-fail-fast-zod-guardrails.json';
import book6 from './tech-lib-06-robotics-factory-3d.json';
import book7 from './tech-lib-07-spatial-point-cloud-ai.json';
import book8 from './tech-lib-08-studio-configurator-ast.json';
import book9 from './tech-lib-09-brutalism-iframe-sandbox.json';

export const BOOKS_REGISTRY = [
  book1,
  book2,
  book3,
  book4,
  book5,
  book6,
  book7,
  book8,
  book9,
];
```

---

## 📋 4. MASTER PROMPT FOR GOOGLE JULES BUILDER

```markdown
# TASK INSTRUCTION FOR JULES BUILDER: BATCH PROCESS ALL 9 TECHNOLOGY FLIPBOOKS

### 🎯 OBJECTIVE
Parse all 3 draft files (`jules-technology-library-drafts.md`, `jules-robotics-flipbook-drafts.md`, and `jules-studio-configurator-flipbook-drafts.md`) and compile exactly **NINE (9) INDIVIDUAL JSON BOOK FILES** into `src/data/books/`, then register all 9 books into `src/data/books/registry.ts`.

---

### 🛠️ EXECUTION STEPS

#### STEP 1: PARSE ALL 9 JSON PAYLOADS
Extract JSON configurations for:
1. `tech-lib-01-dify-n8n-hybrid.json`
2. `tech-lib-02-video-as-code.json`
3. `tech-lib-03-ffmpeg-heavy-lifter.json`
4. `tech-lib-04-brutalist-generative-seed.json`
5. `tech-lib-05-fail-fast-zod-guardrails.json`
6. `tech-lib-06-robotics-factory-3d.json`
7. `tech-lib-07-spatial-point-cloud-ai.json`
8. `tech-lib-08-studio-configurator-ast.json`
9. `tech-lib-09-brutalism-iframe-sandbox.json`

#### STEP 2: CREATE 9 SEPARATE JSON FILES IN `src/data/books/`
Ensure each JSON file is strictly valid, formatted with 2-space indentation, and complies with `src/types/flipbook.ts` Zod validation schemas.

#### STEP 3: UPDATE CENTRAL REGISTRY
Register all 9 books inside `src/data/books/registry.ts`.

#### STEP 4: VERIFY BUILD & TYPECHECK
Run `npx tsc --noEmit` to verify 0 TypeScript/Zod schema validation errors.
```
