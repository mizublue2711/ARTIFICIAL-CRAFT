import React, { useEffect, useRef, useState } from 'react';

export interface MacroLayerProps {
  children: React.ReactNode;
  layerIndex: 1 | 2 | 3;
  id?: string;
  className?: string;
}

export const MacroLayer: React.FC<MacroLayerProps> = ({
  children,
  layerIndex,
  id,
  className = '',
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const isStickyLayer = layerIndex === 1 || layerIndex === 2;
  const [stickyTop, setStickyTop] = useState<number>(0);

  useEffect(() => {
    if (!isStickyLayer) return;
    const el = layerRef.current;
    if (!el) return;

    // Anchor sticky layers at their bottom departure threshold:
    // top = min(0, viewportHeight - layerHeight)
    // This allows the user to scroll through 100% of a tall layer's content first,
    // then locks the layer in place at its bottom edge as the next layer glides over it.
    const updateStickyTop = () => {
      const layerHeight = el.offsetHeight;
      const viewportHeight = window.innerHeight;
      setStickyTop(Math.min(0, viewportHeight - layerHeight));
    };

    updateStickyTop();

    const resizeObserver = new ResizeObserver(updateStickyTop);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateStickyTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickyTop);
    };
  }, [isStickyLayer]);

  // Mechanical layer styling:
  // - Layer 1 & 2 become sticky at their departure threshold so the subsequent layer glides over them
  // - High-intensity drop shadow and precision neon borders deliver the physical slab stacking feel
  const layerConfig = {
    1: 'sticky z-10',
    2: 'sticky z-20 shadow-[0_-35px_80px_rgba(0,0,0,0.98)] border-t border-[#00E5FF]/30',
    3: 'relative z-30 shadow-[0_-40px_90px_rgba(0,0,0,0.98)] border-t border-purple-500/30',
  };

  return (
    <div
      ref={layerRef}
      id={id}
      style={isStickyLayer ? { top: `${stickyTop}px` } : undefined}
      className={`w-full bg-[#05050A] ${layerConfig[layerIndex]} ${className}`}
      // ZERO-TRANSFORM PRESERVATION: Absolutely NO transform or overflow on root
    >
      {children}
    </div>
  );
};
