import React, { useEffect, useRef } from 'react';
import * as LottieModule from 'lottie-react';
import type { LottieHandle } from 'lottie-react';
import { LottieAdapterProps } from '../types/adapters';

const LottieComponent = ((LottieModule as any).default || (LottieModule as any).Lottie || LottieModule) as any;

export const LottieMotionAdapter: React.FC<LottieAdapterProps> = ({
  animationData,
  frame = 0,
  fps = 60,
  loop = false,
  className,
  style,
}) => {
  const lottieRef = useRef<LottieHandle>(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (typeof lottieRef.current.seek === 'function') {
        lottieRef.current.seek(frame);
      } else if (typeof (lottieRef.current as any).goToAndStop === 'function') {
        (lottieRef.current as any).goToAndStop(frame, true);
      }
    }
  }, [frame]);

  return (
    <LottieComponent
      lottieRef={lottieRef}
      src={animationData}
      animationData={animationData}
      autoplay={false}
      loop={loop}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
};
