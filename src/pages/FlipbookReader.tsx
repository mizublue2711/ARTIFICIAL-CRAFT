import { useParams, Link } from 'react-router-dom';
import { FlipBookEngine } from '@/components/flipbook/FlipBookEngine';
import { ChevronLeft, BookOpen } from 'lucide-react';

export default function FlipbookReader() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen bg-[#07070A] pt-24 pb-16 px-4 sm:px-8 font-mono text-zinc-100 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors uppercase"
          >
            <ChevronLeft className="w-4 h-4 text-[#00E5FF]" />
            <span>RETURN TO ARCHIVE</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase">
            <BookOpen className="w-4 h-4 text-[#00E5FF]" />
            <span>FLIPBOOK ENGINE READER</span>
          </div>
        </div>

        {/* Flipbook Engine */}
        <FlipBookEngine bookSlug={slug || 'manual-sample-architecture'} />
      </div>
    </div>
  );
}
