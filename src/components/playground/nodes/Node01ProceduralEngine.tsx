import React from 'react';
import Monolith3DNode, { Monolith3DNodeProps } from '@/components/playground/Monolith3DNode';

export type Node01ProceduralEngineProps = Monolith3DNodeProps;

export const Node01ProceduralEngine: React.FC<Node01ProceduralEngineProps> = (props) => {
  return <Monolith3DNode {...props} />;
};

export default Node01ProceduralEngine;
