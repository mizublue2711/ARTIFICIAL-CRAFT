import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { RemotionAdapterProps } from '../types/adapters';

export const RemotionAdapter: React.FC<RemotionAdapterProps> = ({
  component: PureComponent,
  overrideProps = {},
  ...restProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <PureComponent
      frame={frame}
      fps={fps}
      {...restProps}
      {...overrideProps}
    />
  );
};
