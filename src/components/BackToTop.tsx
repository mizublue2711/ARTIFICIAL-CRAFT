import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-50 px-3 py-2 bg-[#09090B]/90 hover:bg-[#5322FF] text-[#00E5FF] hover:text-white border border-[#00E5FF]/40 hover:border-[#5322FF] font-mono text-xs font-bold tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.25)] hover:shadow-[0_0_20px_rgba(83,34,255,0.6)] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>[ ⬆ TOP ]</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
