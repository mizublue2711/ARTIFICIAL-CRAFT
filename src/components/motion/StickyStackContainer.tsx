import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

export interface StickyStackContainerProps {
  children: React.ReactNode;
  className?: string;
  topOffsetBase?: number; // Base sticky top in px (default: 112 for top-28)
  topOffsetIncrement?: number; // Increment per stacked card in px (default: 24)
  enableScaleDampening?: boolean; // Subtle scale dampening for covered cards (default: true)
}

interface StickyStackItemProps {
  child: React.ReactNode;
  index: number;
  total: number;
  topOffset: number;
  scrollYProgress: MotionValue<number>;
  enableScaleDampening: boolean;
}

const StickyStackItem: React.FC<StickyStackItemProps> = ({
  child,
  index,
  total,
  topOffset,
  scrollYProgress,
  enableScaleDampening,
}) => {
  const cardsAbove = Math.max(0, total - 1 - index);
  const targetScale =
    enableScaleDampening && cardsAbove > 0
      ? Math.max(0.94, 1 - cardsAbove * 0.02)
      : 1;
  const startProgress = total > 1 ? index / total : 0;
  const scale = useTransform(scrollYProgress, [startProgress, 1], [1, targetScale]);

  return (
    <div
      style={{
        top: `${topOffset}px`,
        zIndex: index + 1,
      }}
      className="sticky transition-shadow duration-300"
    >
      <motion.div
        style={{
          scale: enableScaleDampening ? scale : 1,
          transformOrigin: 'top center',
        }}
      >
        {child}
      </motion.div>
    </div>
  );
};

export const StickyStackContainer: React.FC<StickyStackContainerProps> = ({
  children,
  className = '',
  topOffsetBase = 112,
  topOffsetIncrement = 24,
  enableScaleDampening = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    // ZERO-TRANSFORM RULE: Never assign transform or overflow-hidden to the outer parent container
    <div ref={containerRef} className={`relative w-full space-y-8 ${className}`}>
      {items.map((child, idx) => (
        <StickyStackItem
          key={React.isValidElement(child) && child.key != null ? child.key : idx}
          child={child}
          index={idx}
          total={items.length}
          topOffset={topOffsetBase + idx * topOffsetIncrement}
          scrollYProgress={scrollYProgress}
          enableScaleDampening={enableScaleDampening}
        />
      ))}
    </div>
  );
};

export default StickyStackContainer;
