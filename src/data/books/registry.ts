import manualSampleArchitecture from './manual-sample-architecture.json';
import manualHybridAiAutomation from './manual-hybrid-ai-automation.json';
import { BookData } from '../../types/flipbook';

export const booksRegistry: Record<string, BookData> = {
  [manualSampleArchitecture.slug]: manualSampleArchitecture as BookData,
  [manualHybridAiAutomation.slug]: manualHybridAiAutomation as BookData,
};

export const getBookBySlug = (slug: string): BookData | undefined => {
  return booksRegistry[slug];
};

export const getAllBooks = (): BookData[] => {
  return Object.values(booksRegistry);
};
