import manualSampleArchitectureEN from './en/manual-sample-architecture.json';
import manualSampleArchitectureVI from './vi/manual-sample-architecture.json';
import manualHybridAiAutomation from './manual-hybrid-ai-automation.json';
import book19EN from './en/tech-lib-19-vibepath-4stage-flight.json';
import book20EN from './en/tech-lib-20-vibepath-bspline-polygon.json';
import book21EN from './en/tech-lib-21-vibepath-nle-assets.json';
import { enBooks } from './en/index';
import { viBooks } from './vi/index';
import { BookData } from '../../types/flipbook';

export { enBooks, viBooks };

export const getBooksByLocale = (locale: 'en' | 'vi' = 'en'): BookData[] => {
  return locale === 'vi' ? viBooks : enBooks;
};

export const BOOKS_REGISTRY: BookData[] = [
  manualSampleArchitectureEN as BookData,
  manualHybridAiAutomation as BookData,
  ...enBooks,
];

// Unified lookup map supporting both slug names and legacy tech-lib slugs
export const booksRegistry: Record<string, BookData> = {
  [manualSampleArchitectureEN.slug]: manualSampleArchitectureEN as BookData,
  [manualHybridAiAutomation.slug]: manualHybridAiAutomation as BookData,
  [book19EN.slug]: book19EN as BookData,
  [book20EN.slug]: book20EN as BookData,
  [book21EN.slug]: book21EN as BookData,
  'vibepath-4stage-cinematic-flight': book19EN as BookData,
  'vibepath-bspline-polygon-scanning': book20EN as BookData,
  'vibepath-nle-asset-engine': book21EN as BookData,
};

// Register English books
enBooks.forEach((book) => {
  booksRegistry[book.slug] = book;
});

// Map legacy tech-lib slugs to corresponding books for backwards compatibility
const legacySlugs = [
  'tech-lib-01-dify-n8n-hybrid',
  'tech-lib-02-video-as-code',
  'tech-lib-03-ffmpeg-heavy-lifter',
  'tech-lib-04-brutalist-generative-seed',
  'tech-lib-05-fail-fast-zod-guardrails',
  'tech-lib-06-robotics-factory-3d',
  'tech-lib-07-spatial-point-cloud-ai',
  'tech-lib-08-studio-configurator-ast',
  'tech-lib-09-brutalism-iframe-sandbox',
  'tech-lib-10-3d-data-metropolis',
  'tech-lib-11-cybernetic-swiss-brutalism',
  'tech-lib-12-3d-perspective-tunnel',
  'tech-lib-13-composite-monolith-kinematics',
  'tech-lib-14-client-side-webm-exporter',
];

legacySlugs.forEach((legacySlug, idx) => {
  if (enBooks[idx]) {
    booksRegistry[legacySlug] = enBooks[idx];
  }
});

export const getBookBySlug = (slug: string, locale: 'en' | 'vi' = 'en'): BookData | undefined => {
  // If locale is vi, first search viBooks or localized manual
  if (locale === 'vi') {
    if (slug === manualSampleArchitectureVI.slug) {
      return manualSampleArchitectureVI as BookData;
    }
    const viMatch = viBooks.find((b) => b.slug === slug);
    if (viMatch) return viMatch;
    // Check legacy slug index
    const legacyIndex = legacySlugs.indexOf(slug);
    if (legacyIndex >= 0 && viBooks[legacyIndex]) {
      return viBooks[legacyIndex];
    }
  }

  // Fallback to English books or registry
  if (slug === manualSampleArchitectureEN.slug) {
    return (locale === 'vi' ? manualSampleArchitectureVI : manualSampleArchitectureEN) as BookData;
  }
  const enMatch = enBooks.find((b) => b.slug === slug);
  if (enMatch) return enMatch;

  return booksRegistry[slug];
};

export const getAllBooks = (locale: 'en' | 'vi' = 'en'): BookData[] => {
  const manualArchitecture = (locale === 'vi' ? manualSampleArchitectureVI : manualSampleArchitectureEN) as BookData;
  return [
    manualArchitecture,
    manualHybridAiAutomation as BookData,
    ...getBooksByLocale(locale),
  ];
};
