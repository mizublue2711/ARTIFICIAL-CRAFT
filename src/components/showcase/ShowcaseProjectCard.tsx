import React, { useState } from 'react';
import { ShowcaseProject } from '@/types/showcase';
import { useTranslation } from '@/context/useLanguage';
import {
  Compass,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Play,
  Sparkles,
} from 'lucide-react';

interface ShowcaseProjectCardProps {
  project: ShowcaseProject;
  index: number;
}

export const ShowcaseProjectCard: React.FC<ShowcaseProjectCardProps> = ({ project, index }) => {
  const { t } = useTranslation();

  // Combine media list for interactive preview
  const allImages = [project.media.heroBannerUrl, ...project.media.featureImages].filter(Boolean);
  const [activeMedia, setActiveMedia] = useState<{
    type: 'youtube' | 'image';
    url: string;
    index: number;
  }>({
    type: project.media.youtubeEmbedUrl ? 'youtube' : 'image',
    url: project.media.youtubeEmbedUrl || allImages[0] || '',
    index: 0,
  });

  // Pull localized content from showcase dictionary if available
  const showcaseI18n = t.showcase;
  const projectI18n = showcaseI18n?.projects?.[project.id];

  const title = projectI18n?.title || project.title;
  const about = projectI18n?.about || project.about;
  const impressiveMetric = projectI18n?.impressiveMetric || project.impressiveMetric;
  const contextObstacle = projectI18n?.contextObstacle || project.contextObstacle;
  const technicalObstacle = projectI18n?.technicalObstacle || project.technicalObstacle;
  const coreSolution = projectI18n?.coreSolution || project.coreSolution;
  const strategicAngle = projectI18n?.behindTheScenes?.strategicAngle || project.behindTheScenes.strategicAngle;
  const technicalAngle = projectI18n?.behindTheScenes?.technicalAngle || project.behindTheScenes.technicalAngle;
  const deliverableAngle = projectI18n?.behindTheScenes?.deliverableAngle || project.behindTheScenes.deliverableAngle;

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <article
      id={`showcase-${project.id}`}
      className="relative w-full border border-[#27272A] bg-[#09090B] font-mono rounded-none transition-all duration-300 hover:border-zinc-600 mb-12"
    >
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-[#27272A] bg-[#0c0c12]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold text-[#00E5FF] tracking-widest uppercase">
            [ {formattedIndex} // SHOWCASE ]
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            DATE: {project.dateText}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 border border-zinc-800 bg-zinc-950 text-zinc-400 uppercase tracking-wider"
              >
                {tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span>{showcaseI18n?.badgeOperational || '[ STATUS: OPERATIONAL ]'}</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative p-6 lg:p-8">
        {/* Left Column (5 Cols): 6-Point Project Debrief */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & About Overview */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight uppercase font-sans mb-3">
              {title}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              {about}
            </p>
          </div>

          {/* Impressive Metric Banner */}
          <div className="p-3.5 border border-[#5322FF]/40 bg-[#5322FF]/10 text-xs">
            <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-[10px] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showcaseI18n?.metricLabel || 'KEY MILESTONE'}</span>
            </div>
            <p className="text-zinc-200 font-mono text-xs leading-relaxed">
              {impressiveMetric}
            </p>
          </div>

          {/* 3 Core Debrief Boxes */}
          <div className="space-y-4">
            {/* Point 1: Context & Problem */}
            <div className="border border-zinc-800/80 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span>{showcaseI18n?.contextObstacle || 'Context & Challenge'}</span>
              </div>
              <div
                className="text-xs text-zinc-400 font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contextObstacle }}
              />
            </div>

            {/* Point 2: Technical Hurdle */}
            <div className="border border-zinc-800/80 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5322FF] uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4 text-[#5322FF] shrink-0" />
                <span>{showcaseI18n?.technicalObstacle || 'Technical Hurdle'}</span>
              </div>
              <div
                className="text-xs text-zinc-400 font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: technicalObstacle }}
              />
            </div>

            {/* Point 3: Core Solution */}
            <div className="border border-zinc-800/80 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{showcaseI18n?.coreSolution || 'Core Solution'}</span>
              </div>
              <div
                className="text-xs text-zinc-400 font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: coreSolution }}
              />
            </div>
          </div>

          {/* 3 Behind-The-Scenes Pillars */}
          <div className="border border-zinc-800 bg-[#06060c] p-4">
            <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-800">
              {showcaseI18n?.behindTheScenes || '3 Behind-The-Scenes Pillars'}
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#00E5FF] font-bold block mb-0.5">
                  [01] {showcaseI18n?.strategy || 'Strategy'}:
                </span>
                <span className="text-zinc-400 font-sans leading-relaxed">
                  {strategicAngle}
                </span>
              </div>
              <div>
                <span className="text-[#5322FF] font-bold block mb-0.5">
                  [02] {showcaseI18n?.execution || 'Execution'}:
                </span>
                <span className="text-zinc-400 font-sans leading-relaxed">
                  {technicalAngle}
                </span>
              </div>
              <div>
                <span className="text-[#10B981] font-bold block mb-0.5">
                  [03] {showcaseI18n?.impact || 'Impact'}:
                </span>
                <span className="text-zinc-400 font-sans leading-relaxed">
                  {deliverableAngle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Media Stage (Sticky) */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 self-start flex flex-col space-y-4">
          {/* Primary Interactive Stage Viewport */}
          <div className="relative aspect-video w-full bg-black border border-zinc-800 overflow-hidden flex items-center justify-center">
            {/* Subtle Cybernetic CAD Background Grid (Behind Image at z-0) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 z-0"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {activeMedia.type === 'youtube' ? (
              <iframe
                src={activeMedia.url}
                title={`${title} Video Preview`}
                className="relative z-10 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={activeMedia.url}
                alt={`${title} Preview`}
                className="relative z-10 w-full h-full object-contain transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
              />
            )}

            {/* Image Counter Overlay */}
            <div className="absolute top-2 right-2 pointer-events-none text-[9px] font-mono font-bold text-[#00E5FF] bg-black/80 px-2.5 py-0.5 border border-zinc-800 tracking-wider z-20">
              {activeMedia.type === 'youtube'
                ? '[ VIDEO DEMO ]'
                : `[ ${activeMedia.index + 1} / ${allImages.length} ]`}
            </div>

            {/* Viewport HUD Watermark */}
            <div className="absolute bottom-2 left-2 pointer-events-none text-[9px] text-zinc-400 bg-black/80 px-2 py-0.5 border border-zinc-800 z-20">
              STAGE // {activeMedia.type === 'youtube' ? 'YOUTUBE_STREAM' : `PBR_TEXTURE_${activeMedia.index + 1}`}
            </div>
          </div>

          {/* Interactive Thumbnails Rail */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-800/80">
            {/* Optional YouTube Video Tab */}
            {project.media.youtubeEmbedUrl && (
              <button
                type="button"
                onClick={() =>
                  setActiveMedia({
                    type: 'youtube',
                    url: project.media.youtubeEmbedUrl!,
                    index: -1,
                  })
                }
                className={`relative px-3 py-2 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 border transition-all cursor-pointer ${
                  activeMedia.type === 'youtube'
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3 text-[#00E5FF]" />
                <span>VIDEO DEMO</span>
              </button>
            )}

            {/* Image Thumbnails */}
            {allImages.map((imgUrl, imgIdx) => {
              const isActive = activeMedia.type === 'image' && activeMedia.url === imgUrl;
              return (
                <button
                  key={`${project.id}-thumb-${imgIdx}`}
                  type="button"
                  onClick={() =>
                    setActiveMedia({
                      type: 'image',
                      url: imgUrl,
                      index: imgIdx,
                    })
                  }
                  className={`relative w-16 h-12 border overflow-hidden transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)] scale-105 z-10'
                      : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                  }`}
                  aria-label={`Select media thumbnail ${imgIdx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${imgIdx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>

          {/* Docked Sticky Primary CTA Button: 45° Chisel Cut Corner */}
          <a
            href={project.links.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full py-3.5 bg-[#00E5FF] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)] group cursor-pointer"
          >
            <span>{showcaseI18n?.launchLiveApp || 'Launch 3D WebApp ↗'}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ShowcaseProjectCard;
