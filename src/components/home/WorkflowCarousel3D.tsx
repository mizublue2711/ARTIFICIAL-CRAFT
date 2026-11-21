import {
  memo,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
  type PanInfo,
} from 'framer-motion';

export interface Carousel3DConfig {
  cardWidth: number; // e.g. 360px
  cardGap: number; // e.g. 24px
  perspectiveDistance: number; // e.g. 1200px
  zDepthOffset: number; // e.g. 60px
  rotationAngle: number; // e.g. 18deg
  springStiffness: number; // e.g. 260
  springDamping: number; // e.g. 24
}

const DEFAULT_CAROUSEL_3D_CONFIG: Carousel3DConfig = {
  cardWidth: 360,
  cardGap: 24,
  perspectiveDistance: 1200,
  zDepthOffset: 60,
  rotationAngle: 18,
  springStiffness: 260,
  springDamping: 24,
};

export interface WorkflowCarouselItem {
  id: string;
  label: string;
  sublabel: string;
  accent: 'cyan' | 'purple';
  accentHex: string;
  badge?: string;
  footerMeta?: ReactNode;
}

export interface WorkflowCarousel3DProps {
  items: WorkflowCarouselItem[];
  activeIdx: number;
  onSelectMode: (index: number) => void;
  title?: string;
  subtitle?: string;
  config?: Partial<Carousel3DConfig>;
}

interface CoverflowCardProps {
  item: WorkflowCarouselItem;
  index: number;
  isActive: boolean;
  x: MotionValue<number>;
  stride: number;
  effectiveCardWidth: number;
  config: Carousel3DConfig;
  onCardClick: (index: number) => void;
}

const CoverflowCard = memo(function CoverflowCard({
  item,
  index,
  isActive,
  x,
  stride,
  effectiveCardWidth,
  config,
  onCardClick,
}: CoverflowCardProps) {
  const center = -index * stride;
  const inputRange = [center - stride, center, center + stride];

  // Continuous real-time 3D perspective interpolation driven by MotionValue x
  const scale = useTransform(x, inputRange, [0.88, 1.08, 0.88]);
  const z = useTransform(x, inputRange, [-40, config.zDepthOffset, -40]);
  const rotateY = useTransform(x, inputRange, [
    config.rotationAngle,
    0,
    -config.rotationAngle,
  ]);
  const opacity = useTransform(x, inputRange, [0.45, 1, 0.45]);
  const filter = useTransform(x, inputRange, [
    'blur(2px)',
    'blur(0px)',
    'blur(2px)',
  ]);
  const zIndex = useTransform(x, inputRange, [10, 30, 10]);

  return (
    <motion.div
      onClick={() => onCardClick(index)}
      style={{
        width: effectiveCardWidth,
        scale,
        z,
        rotateY,
        opacity,
        filter,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
      className={`shrink-0 border p-5 font-mono text-left cursor-pointer relative select-none transition-colors duration-300 ${
        isActive
          ? 'border-[#00E5FF] bg-[#0b0e14]/95 shadow-[0_14px_42px_rgba(0,229,255,0.26),0_0_24px_rgba(0,229,255,0.18)]'
          : 'border-[#27272A] bg-zinc-950/85 backdrop-blur-md hover:border-zinc-600'
      }`}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] transition-opacity duration-300"
        style={{
          background: isActive
            ? 'linear-gradient(90deg, transparent, #00E5FF, transparent)'
            : 'transparent',
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[10px] uppercase tracking-widest font-semibold ${
            isActive ? 'text-[#00E5FF]' : 'text-zinc-500'
          }`}
        >
          {item.badge ?? `[ 0${index + 1} // WORKFLOW ]`}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: isActive ? '#00E5FF' : item.accentHex,
              boxShadow: isActive ? '0 0 10px #00E5FF' : undefined,
            }}
          />
          <span
            className={`text-[9px] uppercase tracking-wider ${
              isActive ? 'text-[#00E5FF] font-semibold' : 'text-zinc-500'
            }`}
          >
            {isActive ? 'ACTIVE' : 'STANDBY'}
          </span>
        </span>
      </div>

      {/* Title */}
      <h3
        className={`text-[15px] font-bold uppercase tracking-tight mb-1.5 transition-colors ${
          isActive ? 'text-white' : 'text-zinc-300'
        }`}
      >
        {item.label}
      </h3>

      {/* Brief Payload Description */}
      <p className="text-[12px] text-zinc-400 font-sans leading-relaxed line-clamp-2 min-h-[38px]">
        {item.sublabel}
      </p>

      {/* Accent indicator footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="text-zinc-600">ACCENT:</span>
          <span
            className="font-semibold uppercase"
            style={{ color: item.accentHex }}
          >
            {item.accent}
          </span>
        </span>
        <span
          className={`text-[10px] uppercase tracking-wider ${
            isActive ? 'text-[#00E5FF] font-semibold' : 'text-zinc-600'
          }`}
        >
          {isActive ? '● MOUNTED' : '○ DRAG / CLICK'}
        </span>
      </div>
    </motion.div>
  );
});

const WorkflowCarousel3D = memo(function WorkflowCarousel3D({
  items,
  activeIdx,
  onSelectMode,
  title = 'AUTOMATION ENGINE',
  subtitle = '// 3D KINETIC COVERFLOW',
  config: configOverride,
}: WorkflowCarousel3DProps) {
  const config: Carousel3DConfig = {
    ...DEFAULT_CAROUSEL_3D_CONFIG,
    ...configOverride,
  };

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [effectiveCardWidth, setEffectiveCardWidth] = useState(config.cardWidth);

  // Responsive width clamping for narrow mobile viewports while respecting config.cardWidth
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === 'undefined') return;
      const maxMobileWidth = window.innerWidth - 64;
      setEffectiveCardWidth(Math.min(config.cardWidth, Math.max(260, maxMobileWidth)));
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [config.cardWidth]);

  const stride = effectiveCardWidth + config.cardGap;
  const maxDrag = Math.max(0, (items.length - 1) * stride);

  const x = useMotionValue(-activeIdx * stride);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const wheelSnapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdxRef = useRef(activeIdx);
  activeIdxRef.current = activeIdx;

  const snapToIndex = useCallback(
    (targetIdx: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, targetIdx));
      animate(x, -clamped * stride, {
        type: 'spring',
        stiffness: config.springStiffness,
        damping: config.springDamping,
        mass: 0.8,
      });
      if (clamped !== activeIdxRef.current) {
        onSelectMode(clamped);
      }
    },
    [
      items.length,
      stride,
      x,
      config.springStiffness,
      config.springDamping,
      onSelectMode,
    ],
  );

  // Sync external activeIdx or viewport stride changes into spring position
  useEffect(() => {
    if (!isDraggingRef.current) {
      animate(x, -activeIdx * stride, {
        type: 'spring',
        stiffness: config.springStiffness,
        damping: config.springDamping,
        mass: 0.8,
      });
    }
  }, [activeIdx, stride, x, config.springStiffness, config.springDamping]);

  // Non-passive wheel interceptor: maps normalized wheel ticks to kinetic spring without trapping page flow
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const handleWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 1) return;

      const currentX = x.get();
      const isAtStart = currentX >= -2 && delta < 0;
      const isAtEnd = currentX <= -maxDrag + 2 && delta > 0;

      // Release vertical scroll back to page when at deck boundaries
      if (isAtStart || isAtEnd) return;

      e.preventDefault();

      const nextX = Math.max(-maxDrag, Math.min(0, currentX - delta * 1.15));
      x.set(nextX);

      // Update active index live as card crosses center threshold
      const liveIdx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(-nextX / stride)),
      );
      if (liveIdx !== activeIdxRef.current) {
        onSelectMode(liveIdx);
      }

      if (wheelSnapTimerRef.current) {
        clearTimeout(wheelSnapTimerRef.current);
      }
      wheelSnapTimerRef.current = setTimeout(() => {
        const settleIdx = Math.max(
          0,
          Math.min(items.length - 1, Math.round(-x.get() / stride)),
        );
        snapToIndex(settleIdx);
      }, 140);
    };

    stageEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      stageEl.removeEventListener('wheel', handleWheel);
      if (wheelSnapTimerRef.current) clearTimeout(wheelSnapTimerRef.current);
    };
  }, [x, maxDrag, stride, items.length, onSelectMode, snapToIndex]);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
  }, []);

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 6) {
        hasDraggedRef.current = true;
      }
    },
    [],
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      isDraggingRef.current = false;
      const currentX = x.get();
      // Velocity-projected snap to nearest card center
      const projectedX = currentX + info.velocity.x * 0.18;
      const targetIdx = Math.round(-projectedX / stride);
      snapToIndex(targetIdx);

      // Reset drag flag on next tick so click handler ignores drag release
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 0);
    },
    [x, stride, snapToIndex],
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (hasDraggedRef.current) return;
      snapToIndex(index);
    },
    [snapToIndex],
  );

  return (
    <div className="w-full min-h-[420px] flex flex-col justify-center font-mono select-none">
      {/* Mode Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
            {title}
          </span>
          <span className="font-mono text-[10px] text-zinc-600 hidden sm:inline">
            {subtitle}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] text-zinc-500 flex items-center gap-2">
            <span>ACTIVE:</span>
            <span className="text-[#00E5FF] font-bold">
              [ 0{activeIdx + 1} / 0{items.length} ]
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <button
              type="button"
              onClick={() => snapToIndex(activeIdx - 1)}
              disabled={activeIdx === 0}
              className="border border-zinc-800 bg-zinc-950 px-2.5 py-0.5 text-[10px] text-zinc-400 hover:border-[#00E5FF] hover:text-[#00E5FF] disabled:opacity-25 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
              aria-label="Previous workflow mode"
            >
              [ &lt; ]
            </button>
            <button
              type="button"
              onClick={() => snapToIndex(activeIdx + 1)}
              disabled={activeIdx === items.length - 1}
              className="border border-zinc-800 bg-zinc-950 px-2.5 py-0.5 text-[10px] text-zinc-400 hover:border-[#00E5FF] hover:text-[#00E5FF] disabled:opacity-25 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
              aria-label="Next workflow mode"
            >
              [ &gt; ]
            </button>
          </div>
        </div>
      </div>

      {/* Outer Bilateral Vignette Mask Container */}
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden py-10 cursor-grab active:cursor-grabbing"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        {/* CSS 3D Perspective Stage (No overflow:hidden here so preserve-3d stays intact) */}
        <div
          className="w-full"
          style={{
            perspective: `${config.perspectiveDistance}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Physics-Driven Draggable Kinetic Track */}
          <motion.div
            drag="x"
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
              x,
              paddingLeft: `calc(50% - ${effectiveCardWidth / 2}px)`,
              gap: `${config.cardGap}px`,
              transformStyle: 'preserve-3d',
            }}
            className="flex items-center will-change-transform"
          >
            {items.map((item, idx) => (
              <CoverflowCard
                key={item.id}
                item={item}
                index={idx}
                isActive={idx === activeIdx}
                x={x}
                stride={stride}
                effectiveCardWidth={effectiveCardWidth}
                config={config}
                onCardClick={handleCardClick}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Swiss Telemetry Progress Rail & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 mb-3 px-1 font-mono">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mr-1 hidden sm:inline">
            TELEMETRY RAIL:
          </span>
          <div className="flex items-center gap-2">
            {items.map((item, i) => {
              const isCurrent = i === activeIdx;
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => snapToIndex(i)}
                    className={`font-mono text-[10px] tracking-wider transition-colors cursor-pointer ${
                      isCurrent
                        ? 'text-[#00E5FF] font-bold'
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                  >
                    0{i + 1}
                  </button>
                  <div
                    className={`w-12 sm:w-20 transition-all duration-300 ${
                      isCurrent
                        ? 'h-[2px] bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.7)]'
                        : 'h-[1px] bg-zinc-800'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 mr-1">
            STEER:
          </span>
          <button
            type="button"
            onClick={() => snapToIndex(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:border-[#00E5FF] hover:text-[#00E5FF] disabled:opacity-25 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
            aria-label="Previous workflow mode"
          >
            [ &lt; ]
          </button>
          <button
            type="button"
            onClick={() => snapToIndex(activeIdx + 1)}
            disabled={activeIdx === items.length - 1}
            className="border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:border-[#00E5FF] hover:text-[#00E5FF] disabled:opacity-25 disabled:pointer-events-none active:scale-95 transition-all cursor-pointer"
            aria-label="Next workflow mode"
          >
            [ &gt; ]
          </button>
        </div>
      </div>
    </div>
  );
});

export default WorkflowCarousel3D;
