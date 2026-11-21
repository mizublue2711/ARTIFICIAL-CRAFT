import React, { forwardRef } from 'react';

export interface ViewportStageProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  disableTouchInterception?: boolean; // Default true: prevents small-screen gesture conflicts
}

export const ViewportStage = forwardRef<HTMLElement, ViewportStageProps>(
  (
    {
      children,
      id,
      className = '',
      containerClassName = '',
      disableTouchInterception = true,
    },
    ref
  ) => {
    // When disableTouchInterception is active, small screens (< 768px) apply pointer-events-none
    // to non-interactive decorative backdrops while keeping child CTA buttons clickable via pointer-events-auto.
    const touchDefenseClasses = disableTouchInterception
      ? 'touch-pan-y max-md:[&_.decorative-backdrop]:pointer-events-none max-md:[&_[data-decorative]]:pointer-events-none max-md:[&_[data-backdrop]]:pointer-events-none max-md:[&_button]:pointer-events-auto max-md:[&_a]:pointer-events-auto max-md:[&_[role="button"]]:pointer-events-auto max-md:[&_.cta-button]:pointer-events-auto max-md:[&_input]:pointer-events-auto max-md:[&_select]:pointer-events-auto max-md:[&_textarea]:pointer-events-auto'
      : '';

    return (
      <section
        ref={ref}
        id={id}
        className={`relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#05050A] ${touchDefenseClasses} ${className}`.trim()}
      >
        {/* Ambient decorative backdrop layer with mobile touch defense */}
        <div
          aria-hidden="true"
          data-decorative="true"
          className="decorative-backdrop pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.03)_0%,transparent_75%)]" />
        </div>

        {/* Inner content container */}
        <div
          className={`relative z-10 w-full flex-1 flex flex-col justify-between ${containerClassName}`.trim()}
        >
          {children}
        </div>
      </section>
    );
  }
);

ViewportStage.displayName = 'ViewportStage';

export default ViewportStage;
