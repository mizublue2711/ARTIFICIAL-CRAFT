## 📁 1. DIRECTORY STRUCTURE & NAMING CONVENTIONS

All book assets and data files MUST follow these strict naming conventions:

```text
ARTIFICIAL-CRAFT/
├── JULES_FLIPBOOK_SPEC.md        <-- This specification file
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
│       └── flipbook/             <-- Immutable UI Components (DO NOT EDIT)

🏷️ Naming Rules:
Book Slugs: Must be kebab-case with a category prefix:
Format: <category>-<descriptive-name>
Examples: manual-hybrid-ai-blueprint.json, guide-dify-n8n-setup.json, brand-identity-2026.json.
Categories: manual | guide | brand | manifesto | api_doc.
Page Block IDs: Must be semantic and sequential for precise error tracing:
Format: p<01|02|...>_<short_section_name>
Examples: p01_cover, p02_data_hygiene, p03_system_architecture.
