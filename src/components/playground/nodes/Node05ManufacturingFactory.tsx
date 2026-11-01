import React from 'react';
import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';

export interface Node05ManufacturingFactoryProps {
  [key: string]: unknown;
}

export const Node05ManufacturingFactory: React.FC<Node05ManufacturingFactoryProps> = (props) => {
  return <CraftStudioConfigurator {...props} />;
};

export default Node05ManufacturingFactory;
