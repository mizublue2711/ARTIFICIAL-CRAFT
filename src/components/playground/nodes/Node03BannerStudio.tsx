import React from 'react';
import BannerStudio from '@/components/playground/BannerStudio';

export interface Node03BannerStudioProps {
  onOpenBatchModal?: () => void;
  [key: string]: unknown;
}

export const Node03BannerStudio: React.FC<Node03BannerStudioProps> = (props) => {
  return <BannerStudio {...props} />;
};

export default Node03BannerStudio;
