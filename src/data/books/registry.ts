import manualSampleArchitecture from './manual-sample-architecture.json';
import { BookData } from '../../types/flipbook';

export const booksRegistry: Record<string, BookData> = {
  [manualSampleArchitecture.slug]: manualSampleArchitecture as BookData,
};

export const getBookBySlug = (slug: string): BookData | undefined => {
  return booksRegistry[slug];
};

export const getAllBooks = (): BookData[] => {
  return Object.values(booksRegistry);
};
