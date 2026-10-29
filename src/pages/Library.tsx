import { Link } from 'react-router-dom';
import { getAllBooks } from '@/data/books/registry';
import { BookOpen, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function Library() {
  const books = getAllBooks();

  return (
    <div className="min-h-screen bg-[#09090b] pt-28 pb-20 px-4 sm:px-8 font-mono text-zinc-100">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="border border-zinc-800 bg-zinc-950 p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs text-[#00E5FF] uppercase tracking-widest mb-3">
            <BookOpen className="w-4 h-4 text-[#00E5FF]" />
            <span>ARTIFICIAL CRAFT // DIGITAL FLIPBOOK ARCHIVE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight leading-none mb-4">
            TECHNICAL MANUAL LIBRARY
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans leading-relaxed border-l-2 border-[#00E5FF] pl-4">
            Zero-latency Swiss Brutalist documentation engine for multi-agent architecture specs, R2 event pipelines, and edge diagnostics.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div
              key={book.slug}
              className="border border-zinc-800 bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between hover:border-[#00E5FF]/60 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4 text-xs text-zinc-500">
                  <span className="uppercase tracking-wider font-bold text-[#00E5FF]">
                    {book.category} // v{book.version}
                  </span>
                  <span>{book.pages.length} PAGES</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white group-hover:text-[#00E5FF] transition-colors mb-2">
                  {book.title}
                </h2>

                {book.subtitle && (
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">
                    {book.subtitle}
                  </p>
                )}

                {/* Tags */}
                {book.pages[0]?.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {book.pages[0].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase"
                      >
                        <Tag className="w-3 h-3 text-zinc-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VERIFIED SPEC
                </span>

                <Link
                  to={`/flipbook/${book.slug}`}
                  className="inline-flex items-center gap-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all px-4 py-2 text-xs font-bold uppercase"
                >
                  <span>READ SPEC</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
