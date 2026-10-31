import manualSampleArchitecture from './manual-sample-architecture.json';
import manualHybridAiAutomation from './manual-hybrid-ai-automation.json';
import book1 from './tech-lib-01-dify-n8n-hybrid.json';
import book2 from './tech-lib-02-video-as-code.json';
import book3 from './tech-lib-03-ffmpeg-heavy-lifter.json';
import book4 from './tech-lib-04-brutalist-generative-seed.json';
import book5 from './tech-lib-05-fail-fast-zod-guardrails.json';
import book6 from './tech-lib-06-robotics-factory-3d.json';
import book7 from './tech-lib-07-spatial-point-cloud-ai.json';
import book8 from './tech-lib-08-studio-configurator-ast.json';
import book9 from './tech-lib-09-brutalism-iframe-sandbox.json';
import { BookData } from '../../types/flipbook';

export const BOOKS_REGISTRY = [
  manualSampleArchitecture,
  manualHybridAiAutomation,
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

export const booksRegistry: Record<string, BookData> = {
  [manualSampleArchitecture.slug]: manualSampleArchitecture as BookData,
  [manualHybridAiAutomation.slug]: manualHybridAiAutomation as BookData,
  [book1.slug]: book1 as BookData,
  [book2.slug]: book2 as BookData,
  [book3.slug]: book3 as BookData,
  [book4.slug]: book4 as BookData,
  [book5.slug]: book5 as BookData,
  [book6.slug]: book6 as BookData,
  [book7.slug]: book7 as BookData,
  [book8.slug]: book8 as BookData,
  [book9.slug]: book9 as BookData,
};

export const getBookBySlug = (slug: string): BookData | undefined => {
  return booksRegistry[slug];
};

export const getAllBooks = (): BookData[] => {
  return Object.values(booksRegistry);
};
