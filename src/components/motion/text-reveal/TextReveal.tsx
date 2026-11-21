import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  mode?: 'words' | 'characters';
  delay?: number;
  stagger?: number;
  className?: string;
}

export function TextReveal({
  text,
  as = 'p',
  mode = 'words',
  delay = 0,
  stagger = 0.05,
  className,
}: TextRevealProps) {
  const units: string[] =
    mode === 'characters'
      ? Array.from(text)
      : text.trim().split(/\s+/).filter(Boolean);

  const content: ReactNode = units.map((unit, index) => (
    <span
      key={`${unit}-${index}`}
      className={mode === 'words' ? 'inline-block pr-[0.25em]' : 'inline-block'}
      aria-hidden="true"
    >
      <motion.span
        className="inline-block"
        initial={{ y: '100%', opacity: 0, rotateX: -45 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{
          delay: delay + index * stagger,
          type: 'spring',
          stiffness: 160,
          damping: 18,
          mass: 0.8,
        }}
      >
        {unit === ' ' ? '\u00A0' : unit}
      </motion.span>
    </span>
  ));

  const commonProps = {
    className,
    'aria-label': text,
  };

  switch (as) {
    case 'h1':
      return <motion.h1 {...commonProps}>{content}</motion.h1>;
    case 'h2':
      return <motion.h2 {...commonProps}>{content}</motion.h2>;
    case 'h3':
      return <motion.h3 {...commonProps}>{content}</motion.h3>;
    case 'span':
      return <motion.span {...commonProps}>{content}</motion.span>;
    case 'p':
    default:
      return <motion.p {...commonProps}>{content}</motion.p>;
  }
}

export default TextReveal;
