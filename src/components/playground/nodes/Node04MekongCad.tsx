import React from 'react';
import CsvDataVisualizer from '@/components/playground/CsvDataVisualizer';

export interface Node04MekongCadProps {
  [key: string]: unknown;
}

export const Node04MekongCad: React.FC<Node04MekongCadProps> = (props) => {
  return <CsvDataVisualizer {...props} />;
};

export default Node04MekongCad;
