import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getBooksByLocale, getBookBySlug } from '@/data/books/registry';
import { BookData } from '@/types/flipbook';
import { FlipBookEngine } from './FlipBookEngine';

export interface FlipbookViewerProps {
  bookSlug?: string;
  bookData?: BookData;
  className?: string;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  bookSlug = 'manual-sample-architecture',
  bookData,
  className = '',
}) => {
  const { currentLocale } = useTranslation();

  // Dynamically resolve book dataset matching active Navigation locale
  const availableBooks = getBooksByLocale(currentLocale);

  // If specific bookData was passed, use it; otherwise resolve by slug & locale
  const activeBook = bookData || getBookBySlug(bookSlug, currentLocale);

  return (
    <div className={`flipbook-viewer-container w-full ${className}`} data-locale={currentLocale}>
      <FlipBookEngine
        key={`${bookSlug}-${currentLocale}`}
        bookSlug={bookSlug}
        bookData={activeBook}
        availableBooks={availableBooks}
        className={className}
      />
    </div>
  );
};

export default FlipbookViewer;
