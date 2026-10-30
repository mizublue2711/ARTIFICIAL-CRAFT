import React from 'react';
import { SwissGridHUD, SwissGridHUDProps } from './backgrounds/SwissGridHUD';

export type SwissGridBackgroundProps = SwissGridHUDProps;

export const SwissGridBackground: React.FC<SwissGridBackgroundProps> = (props) => {
  return <SwissGridHUD {...props} />;
};
