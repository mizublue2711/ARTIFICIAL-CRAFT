import React from 'react';
import { motion, type Variants } from 'framer-motion';

export interface StandaloneLabSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  amount?: number;
}

const labContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const StandaloneLabSection: React.FC<StandaloneLabSectionProps> = ({
  children,
  className = '',
  id,
  amount = 0.12, // Activates when 12% is in view, preventing early trigger or long black voids
}) => {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={labContainerVariants}
      // NEVER apply transform or overflow on root:
      className={`relative w-full ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default StandaloneLabSection;
