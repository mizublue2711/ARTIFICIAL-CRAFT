import React from 'react';
import { SwissGridHUD, SwissGridHUDProps } from './backgrounds/SwissGridHUD';

export type SwissHudOverlayProps = SwissGridHUDProps;

export const SwissHudOverlay: React.FC<SwissHudOverlayProps> = (props) => {
  return <SwissGridHUD showScanLine={false} showTelemetryCorners={true} {...props} />;
};
