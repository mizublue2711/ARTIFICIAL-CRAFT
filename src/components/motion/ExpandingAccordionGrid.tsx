import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Plus, ArrowUpRight } from 'lucide-react';

export interface AccordionEngineItem {
  id: string;
  index: string;
  spineLabel: string;
  title: string;
  slaBadge: string;
  statusBadge: string;
  description: string;
  techStack: string[];
  ctaLabel: string;
  href: string;
  isExternal?: boolean;
  accentColor?: string;
  icon: React.ElementType;
  artVariant: 'monolith' | 'remotion' | 'banner' | 'cad' | 'sandbox' | 'metropolis';
  onLaunch?: () => void;
}

export interface ExpandingAccordionGridProps {
  items: AccordionEngineItem[];
  defaultActiveId?: string;
  className?: string;
}

const SPRING_TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

/**
 * Deterministic procedural 3D wireframe / cybernetic line-art backdrop
 * for each engine card (zero external image dependencies).
 */
const EngineWireframeArt: React.FC<{
  variant: AccordionEngineItem['artVariant'];
  accentColor: string;
  isActive: boolean;
}> = ({ variant, accentColor, isActive }) => {
  const strokeOpacity = isActive ? 0.55 : 0.35;

  switch (variant) {
    case 'monolith':
      return (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="grid-monolith" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" stroke={accentColor} strokeOpacity="0.14" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#grid-monolith)" />
          {/* Isometric 3D Monolith Wireframe */}
          <g stroke={accentColor} strokeOpacity={strokeOpacity} strokeWidth="1.25">
            <polygon points="300,45 430,115 300,185 170,115" fill={accentColor} fillOpacity="0.06" />
            <polygon points="170,115 300,185 300,340 170,270" fill={accentColor} fillOpacity="0.03" />
            <polygon points="430,115 300,185 300,340 430,270" fill={accentColor} fillOpacity="0.08" />
            <line x1="300" y1="45" x2="300" y2="340" strokeDasharray="4 4" />
            <polygon points="300,85 385,130 300,175 215,130" />
            <polygon points="300,125 350,152 300,180 250,152" />
            <ellipse cx="300" cy="340" rx="170" ry="34" strokeDasharray="6 6" strokeOpacity="0.35" />
            <ellipse cx="300" cy="340" rx="115" ry="22" strokeOpacity="0.4" />
          </g>
        </svg>
      );

    case 'remotion':
      return (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke={accentColor} strokeOpacity={strokeOpacity} strokeWidth="1.2">
            {/* Perspective Video Frames */}
            <rect x="70" y="60" width="260" height="150" rx="2" fill={accentColor} fillOpacity="0.04" />
            <rect x="135" y="95" width="260" height="150" rx="2" fill={accentColor} fillOpacity="0.05" />
            <rect x="200" y="130" width="260" height="150" rx="2" fill={accentColor} fillOpacity="0.07" />
            {/* Playhead & Timeline Tracks */}
            <line x1="40" y1="315" x2="560" y2="315" />
            <line x1="40" y1="340" x2="560" y2="340" strokeDasharray="3 5" />
            <line x1="40" y1="365" x2="560" y2="365" />
            <line x1="310" y1="40" x2="310" y2="380" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="5 3" />
            <rect x="110" y="307" width="120" height="16" fill={accentColor} fillOpacity="0.18" />
            <rect x="250" y="332" width="180" height="16" fill="#00E5FF" fillOpacity="0.15" />
            <rect x="330" y="357" width="140" height="16" fill={accentColor} fillOpacity="0.18" />
            {/* Kinetic Wave */}
            <path d="M 220 205 Q 260 155 300 205 T 380 205 T 440 205" stroke="#00E5FF" strokeWidth="1.6" />
          </g>
        </svg>
      );

    case 'banner':
      return (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke={accentColor} strokeOpacity={strokeOpacity} strokeWidth="1.2">
            {/* Golden Ratio / Brutalist Artboard Matrix */}
            <rect x="65" y="55" width="470" height="290" fill={accentColor} fillOpacity="0.03" />
            <line x1="65" y1="150" x2="535" y2="150" strokeDasharray="4 4" />
            <line x1="65" y1="250" x2="535" y2="250" strokeDasharray="4 4" />
            <line x1="220" y1="55" x2="220" y2="345" />
            <line x1="390" y1="55" x2="390" y2="345" />
            {/* Bezier Control Handles */}
            <path d="M 95 290 C 180 90, 410 310, 505 105" stroke="#00E5FF" strokeWidth="1.8" />
            <line x1="95" y1="290" x2="180" y2="90" strokeDasharray="3 3" />
            <line x1="505" y1="105" x2="410" y2="310" strokeDasharray="3 3" />
            <circle cx="95" cy="290" r="5" fill="#00E5FF" />
            <circle cx="180" cy="90" r="4" />
            <circle cx="410" cy="310" r="4" />
            <circle cx="505" cy="105" r="5" fill="#00E5FF" />
            {/* Crop Marks */}
            <path d="M 45 55 H 60 M 65 35 V 50 M 540 55 H 555 M 535 35 V 50" />
            <path d="M 45 345 H 60 M 65 350 V 365 M 540 345 H 555 M 535 350 V 365" />
          </g>
        </svg>
      );

    case 'cad':
      return (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke={accentColor} strokeOpacity={strokeOpacity} strokeWidth="1.2">
            {/* Topographic / River Telemetry Contours */}
            <path d="M 20 110 C 140 60, 220 160, 340 115 C 440 75, 510 140, 580 100" />
            <path d="M 20 155 C 140 105, 220 205, 340 160 C 440 120, 510 185, 580 145" />
            <path d="M 20 200 C 140 150, 220 250, 340 205 C 440 165, 510 230, 580 190" stroke="#00E5FF" strokeWidth="1.6" />
            <path d="M 20 245 C 140 195, 220 295, 340 250 C 440 210, 510 275, 580 235" />
            <path d="M 20 290 C 140 240, 220 340, 340 295 C 440 255, 510 320, 580 280" />
            {/* Radial CAD Reticle */}
            <circle cx="340" cy="205" r="82" strokeDasharray="6 4" />
            <circle cx="340" cy="205" r="42" />
            <line x1="340" y1="95" x2="340" y2="315" strokeDasharray="3 4" />
            <line x1="230" y1="205" x2="450" y2="205" strokeDasharray="3 4" />
          </g>
        </svg>
      );

    case 'sandbox':
      return (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke={accentColor} strokeOpacity={strokeOpacity} strokeWidth="1.25">
            {/* AST Node Graph & Mesh Topology */}
            <polygon points="300,70 410,135 410,265 300,330 190,265 190,135" fill={accentColor} fillOpacity="0.05" />
            <polygon points="300,115 370,155 370,245 300,285 230,245 230,155" stroke="#00E5FF" />
            <line x1="300" y1="70" x2="300" y2="330" strokeDasharray="4 4" />
            <line x1="190" y1="135" x2="410" y2="265" strokeDasharray="4 4" />
            <line x1="410" y1="135" x2="190" y2="265" strokeDasharray="4 4" />
            {/* Peripheral AST Nodes */}
            <line x1="190" y1="135" x2="95" y2="95" />
            <line x1="190" y1="265" x2="95" y2="305" />
            <line x1="410" y1="135" x2="505" y2="95" />
            <line x1="410" y1="265" x2="505" y2="305" />
            <rect x="75" y="80" width="32" height="28" fill={accentColor} fillOpacity="0.16" />
            <rect x="75" y="290" width="32" height="28" fill={accentColor} fillOpacity="0.16" />
            <rect x="492" y="80" width="32" height="28" fill="#00E5FF" fillOpacity="0.16" />
            <rect x="492" y="290" width="32" height="28" fill="#00E5FF" fillOpacity="0.16" />
          </g>
        </svg>
      );

    case 'metropolis':
      return (
        <svg
          viewBox="0 0 600 400"
          fill="none"
          aria-hidden="true"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke={accentColor} strokeOpacity={strokeOpacity} strokeWidth="1.2">
            {/* Isometric Voxel Skyline */}
            <path d="M 40 310 L 300 220 L 560 310 L 300 390 Z" fill={accentColor} fillOpacity="0.04" />
            {/* Tower 1 */}
            <polygon points="210,130 250,115 290,130 250,145" fill={accentColor} fillOpacity="0.12" />
            <polygon points="210,130 250,145 250,300 210,285" fill={accentColor} fillOpacity="0.06" />
            <polygon points="290,130 250,145 250,300 290,285" fill={accentColor} fillOpacity="0.09" />
            {/* Tower 2 (Tallest) */}
            <polygon points="295,60 345,42 395,60 345,78" fill="#00E5FF" fillOpacity="0.16" stroke="#00E5FF" />
            <polygon points="295,60 345,78 345,310 295,292" fill="#00E5FF" fillOpacity="0.06" stroke="#00E5FF" />
            <polygon points="395,60 345,78 345,310 395,292" fill="#00E5FF" fillOpacity="0.1" stroke="#00E5FF" />
            {/* Tower 3 */}
            <polygon points="405,165 445,150 485,165 445,180" fill={accentColor} fillOpacity="0.12" />
            <polygon points="405,165 445,180 445,315 405,300" fill={accentColor} fillOpacity="0.06" />
            <polygon points="485,165 445,180 445,315 485,300" fill={accentColor} fillOpacity="0.09" />
            {/* Sub-level Sink Grid */}
            <line x1="120" y1="340" x2="480" y2="340" strokeDasharray="4 4" />
          </g>
        </svg>
      );
  }
};

const LaunchActionButton: React.FC<{ item: AccordionEngineItem }> = ({ item }) => {
  const buttonClasses =
    'pointer-events-auto relative z-10 inline-flex items-center justify-between gap-3 px-5 py-3 min-h-[44px] bg-[#00E5FF] hover:bg-[#33ECFF] text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_24px_rgba(0,229,255,0.35)] touch-manipulation';

  const content = (
    <>
      <span>[ LAUNCH ENGINE // EXPLORE ]</span>
      {item.isExternal ? (
        <ArrowUpRight className="w-4 h-4 shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 shrink-0" />
      )}
    </>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          item.onLaunch?.();
        }}
        className={buttonClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={item.href}
      onClick={(e) => {
        e.stopPropagation();
        item.onLaunch?.();
      }}
      className={buttonClasses}
    >
      {content}
    </Link>
  );
};

export const ExpandingAccordionGrid: React.FC<ExpandingAccordionGridProps> = ({
  items,
  defaultActiveId = '01',
  className = '',
}) => {
  const [activeId, setActiveId] = useState<string>(defaultActiveId);

  return (
    <div className={`w-full ${className}`}>
      {/* DESKTOP: Expanding Vertical Accordion Strips */}
      <div
        className="hidden md:flex md:flex-row h-[520px] gap-2.5 w-full"
        role="tablist"
        aria-label="Playground Hub Engines"
      >
        {items.map((engine) => {
          const isActive = activeId === engine.id;
          const Icon = engine.icon;
          const accent = engine.accentColor || '#00E5FF';

          return (
            <motion.div
              key={engine.id}
              layout
              transition={SPRING_TRANSITION}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              onMouseEnter={() => setActiveId(engine.id)}
              onFocus={() => setActiveId(engine.id)}
              onClick={() => setActiveId(engine.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveId(engine.id);
                }
              }}
              style={{
                flexGrow: isActive ? 4.5 : 1,
                flexShrink: 1,
                flexBasis: 0,
              }}
              className={[
                'group relative min-w-[72px] h-full overflow-hidden cursor-pointer select-none',
                'border transition-colors duration-300 bg-[#09090B]',
                isActive
                  ? 'border-[#00E5FF]/80 shadow-[0_0_32px_rgba(0,229,255,0.14)]'
                  : 'border-zinc-800 hover:border-[#00E5FF]/50',
              ].join(' ')}
            >
              {/* Background Geometric Line-Art Layer */}
              <div
                className={[
                  'absolute inset-0 pointer-events-none transition-opacity duration-500',
                  isActive ? 'opacity-90' : 'opacity-70',
                ].join(' ')}
              >
                <EngineWireframeArt
                  variant={engine.artVariant}
                  accentColor={accent}
                  isActive={isActive}
                />
              </div>

              {/* Dark Vignette / Gradient Wash */}
              <div
                className={[
                  'absolute inset-0 pointer-events-none transition-all duration-500',
                  isActive
                    ? 'bg-black/75 bg-gradient-to-tr from-black/95 via-black/70 to-black/35'
                    : 'bg-gradient-to-t from-black via-black/60 to-transparent',
                ].join(' ')}
              />

              {/* Top Accent Hairline when active */}
              <div
                className={[
                  'absolute top-0 inset-x-0 h-[2px] pointer-events-none transition-opacity duration-300',
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                ].join(' ')}
                style={{
                  background: `linear-gradient(90deg, ${accent}, #5322FF)`,
                }}
              />

              {/* COLLAPSED SPINE VIEW */}
              <AnimatePresence initial={false}>
                {!isActive && (
                  <motion.div
                    key="collapsed-spine"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex flex-col items-center justify-between py-5 px-2 z-10 pointer-events-none"
                  >
                    {/* Top: Engine Index + Icon / Plus Pill */}
                    <div className="flex flex-col items-center gap-2.5">
                      <span className="font-mono text-xs font-bold tracking-widest text-zinc-400 group-hover:text-[#00E5FF] transition-colors">
                        {engine.index}
                      </span>
                      <div className="w-8 h-8 flex items-center justify-center border border-zinc-800 bg-zinc-950/90 text-zinc-400 group-hover:border-[#00E5FF]/50 group-hover:text-[#00E5FF] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-zinc-800 bg-black/70 text-zinc-500 group-hover:border-[#00E5FF]/50 group-hover:text-[#00E5FF] transition-colors">
                        <Plus className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Center Spine: Rotated 90deg Vertical Typography */}
                    <div className="flex-1 flex items-center justify-center w-full">
                      <span className="-rotate-90 select-none whitespace-nowrap font-mono text-xs font-bold tracking-widest uppercase text-zinc-400 group-hover:text-[#00E5FF] transition-colors origin-center translate-y-12">
                        {engine.spineLabel}
                      </span>
                    </div>

                    {/* Bottom Peek Marker */}
                    <div className="w-1.5 h-6 bg-zinc-800 group-hover:bg-[#00E5FF]/70 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EXPANDED PANEL VIEW */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="expanded-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="relative z-10 h-full w-full p-7 lg:p-8 flex flex-col justify-between"
                  >
                    {/* Top Row: Index + SLA / FPS Status Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: 0.05 }}
                      className="flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center border border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#00E5FF]">
                          {engine.spineLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 border border-[#00E5FF]/40 bg-[#00E5FF]/10 font-mono text-[10px] font-bold tracking-widest uppercase text-[#00E5FF]">
                          {engine.slaBadge}
                        </span>
                        <span className="hidden lg:inline-flex px-2 py-1 border border-zinc-700 bg-zinc-950/80 font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-300">
                          {engine.statusBadge}
                        </span>
                      </div>
                    </motion.div>

                    {/* Bottom Content Block: Horizontal Title, Narrative, Tech Stack, Action */}
                    <div className="space-y-5 max-w-xl">
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: 0.1 }}
                        className="space-y-3"
                      >
                        <h3 className="text-2xl font-bold tracking-tight text-white uppercase leading-tight">
                          {engine.title}
                        </h3>
                        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
                          {engine.description}
                        </p>
                      </motion.div>

                      {/* Tech Stack Pills */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: 0.15 }}
                        className="flex flex-wrap gap-1.5"
                      >
                        {engine.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-zinc-950/90 border border-zinc-800 font-mono text-[10px] uppercase tracking-wider text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </motion.div>

                      {/* Interactive Action CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: 0.2 }}
                        className="pt-1 flex items-center gap-4"
                      >
                        <LaunchActionButton item={engine} />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* MOBILE: Stacked Horizontal Accordions (< 768px) */}
      <div
        className="flex flex-col gap-2 w-full md:hidden"
        role="tablist"
        aria-label="Playground Hub Engines Mobile"
      >
        {items.map((engine) => {
          const isActive = activeId === engine.id;
          const Icon = engine.icon;
          const accent = engine.accentColor || '#00E5FF';

          return (
            <motion.div
              key={engine.id}
              layout
              initial={false}
              animate={{ height: isActive ? 380 : 64 }}
              transition={SPRING_TRANSITION}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              onClick={() => setActiveId(engine.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveId(engine.id);
                }
              }}
              className={[
                'relative w-full overflow-hidden border cursor-pointer transition-colors',
                isActive
                  ? 'border-[#00E5FF]/80 bg-[#09090B]'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700',
              ].join(' ')}
            >
              {/* Collapsed Header Bar (always accessible at top of accordion) */}
              <div className="relative z-20 h-16 px-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={[
                      'font-mono text-xs font-bold tracking-widest shrink-0',
                      isActive ? 'text-[#00E5FF]' : 'text-zinc-500',
                    ].join(' ')}
                  >
                    {engine.index}
                  </span>
                  <div
                    className={[
                      'w-7 h-7 flex items-center justify-center border shrink-0',
                      isActive
                        ? 'border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400',
                    ].join(' ')}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={[
                      'font-mono text-xs font-bold tracking-wider uppercase truncate',
                      isActive ? 'text-white' : 'text-zinc-300',
                    ].join(' ')}
                  >
                    {engine.spineLabel}
                  </span>
                </div>

                <span
                  className={[
                    'w-6 h-6 flex items-center justify-center border font-mono text-xs shrink-0 transition-transform duration-300',
                    isActive
                      ? 'border-[#00E5FF]/50 text-[#00E5FF] rotate-45'
                      : 'border-zinc-800 text-zinc-400',
                  ].join(' ')}
                >
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Expanded Visual Slice & Narrative Content */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="mobile-expanded-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0 pt-16 flex flex-col justify-between"
                  >
                    {/* Wireframe Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-80">
                      <EngineWireframeArt
                        variant={engine.artVariant}
                        accentColor={accent}
                        isActive={true}
                      />
                    </div>
                    <div className="absolute inset-0 pointer-events-none bg-black/75 bg-gradient-to-t from-black via-black/75 to-black/50" />

                    <div className="relative z-10 p-4 pt-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 border border-[#00E5FF]/40 bg-[#00E5FF]/10 font-mono text-[10px] font-bold tracking-widest uppercase text-[#00E5FF]">
                            {engine.slaBadge}
                          </span>
                          <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-950/80 font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-300">
                            {engine.statusBadge}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold tracking-tight text-white uppercase leading-snug">
                          {engine.title}
                        </h3>

                        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                          {engine.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {engine.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-1.5 py-0.5 bg-zinc-950/90 border border-zinc-800 font-mono text-[10px] text-zinc-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3">
                        <LaunchActionButton item={engine} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandingAccordionGrid;
