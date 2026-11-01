import React from 'react';
import CraftStudioConfigurator from '@/components/studio/CraftStudioConfigurator';

export interface Node05ManufacturingFactoryProps {
  config?: any;
  onChange?: (config: any) => void;
  primaryColor?: string;
  accentColor?: string;
  isSubAdapter?: boolean;
  subStep?: 3 | 4;
  [key: string]: unknown;
}

export const Node05ManufacturingFactory: React.FC<Node05ManufacturingFactoryProps> = (props) => {
  return <CraftStudioConfigurator {...props} isSubAdapter={props.isSubAdapter ?? true} />;
};

export default Node05ManufacturingFactory;
