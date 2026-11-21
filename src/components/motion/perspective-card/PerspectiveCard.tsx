import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

export interface PerspectiveCardProps {
  children: ReactNode;
  className?: string;
  maxTiltAngle?: number;
  glareEffect?: boolean;
  perspective?: number;
  activeBorderColor?: string;
}

export function PerspectiveCard({
  children,
  className,
  maxTiltAngle = 15,
  glareEffect = true,
  perspective = 1000,
  activeBorderColor = '#00E5FF',
}: PerspectiveCardProps) {
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const glareXValue = useMotionValue(50);
  const glareYValue = useMotionValue(50);

  const rotateX = useSpring(rotateXValue, {
    stiffness: 220,
    damping: 24,
    mass: 0.7,
  });
  const rotateY = useSpring(rotateYValue, {
    stiffness: 220,
    damping: 24,
    mass: 0.7,
  });
  const glareX = useSpring(glareXValue, {
    stiffness: 220,
    damping: 24,
  });
  const glareY = useSpring(glareYValue, {
    stiffness: 220,
    damping: 24,
  });
  const glareOpacity = useMotionValue(0);
  const glareOpacitySpring = useSpring(glareOpacity, {
    stiffness: 220,
    damping: 24,
  });

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0.12) 18%, transparent 48%)`,
  );

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const normalizedX = Math.min(Math.max(relativeX, 0), 1);
    const normalizedY = Math.min(Math.max(relativeY, 0), 1);

    rotateYValue.set((normalizedX - 0.5) * maxTiltAngle * 2);
    rotateXValue.set((0.5 - normalizedY) * maxTiltAngle * 2);
    glareXValue.set(normalizedX * 100);
    glareYValue.set(normalizedY * 100);
    glareOpacity.set(glareEffect ? 1 : 0);
  };

  const handlePointerLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    glareXValue.set(50);
    glareYValue.set(50);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
        borderColor: 'transparent',
        rotateX,
        rotateY,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={() => {
        if (glareEffect) glareOpacity.set(1);
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] border"
        style={{
          borderColor: activeBorderColor,
          opacity: glareOpacitySpring,
        }}
        aria-hidden="true"
      />

      {glareEffect && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
          style={{
            background: glareBackground,
            opacity: glareOpacitySpring,
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative" style={{ transform: 'translateZ(0)' }}>
        {children}
      </div>
    </motion.div>
  );
}

export default PerspectiveCard;
