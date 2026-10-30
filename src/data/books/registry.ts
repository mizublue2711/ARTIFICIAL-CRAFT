import manualSampleArchitecture from './manual-sample-architecture.json';
import manualHybridAiAutomation from './manual-hybrid-ai-automation.json';
import book1 from './tech-lib-01-dify-n8n-hybrid.json';
import book2 from './tech-lib-02-video-as-code.json';
import book3 from './tech-lib-03-ffmpeg-heavy-lifter.json';
import book4 from './tech-lib-04-brutalist-generative-seed.json';
import book5 from './tech-lib-05-fail-fast-zod-guardrails.json';
import { BookData } from '../../types/flipbook';

export const BOOKS_REGISTRY = [
  manualSampleArchitecture,
  manualHybridAiAutomation,
  book1,
  book2,
  book3,
  book4,
  book5,
];

export const booksRegistry: Record<string, BookData> = {
  [manualSampleArchitecture.slug]: manualSampleArchitecture as BookData,
  [manualHybridAiAutomation.slug]: manualHybridAiAutomation as BookData,
  [book1.slug]: book1 as BookData,
  [book2.slug]: book2 as BookData,
  [book3.slug]: book3 as BookData,
  [book4.slug]: book4 as BookData,
  [book5.slug]: book5 as BookData,
};

export const getBookBySlug = (slug: string): BookData | undefined => {
  return booksRegistry[slug];
};

export const getAllBooks = (): BookData[] => {
  return Object.values(booksRegistry);
};
