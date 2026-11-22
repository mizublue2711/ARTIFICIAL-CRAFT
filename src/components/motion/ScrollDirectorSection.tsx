import React, { useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, type Variants } from 'framer-motion';

export interface ScrollDirectorSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onScrollProgress?: (progress: number) => void;
  scrollOffset?: NonNullable<Parameters<typeof useScroll>[0]>['offset'];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const itemFadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const, // awwwards-out easing
    },
  },
};

export const ScrollDirectorSection: React.FC<ScrollDirectorSectionProps> = ({
  children,
  className = '',
  id,
  onScrollProgress,
  scrollOffset = ['start end', 'end start'],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: scrollOffset,
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (onScrollProgress) {
      onScrollProgress(latest);
    }
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      // ZERO TRANSFORM RULE ON ROOT TO PRESERVE INNER STICKY/LAYOUT CONTEXTS:
      className={`relative w-full ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default ScrollDirectorSection;
