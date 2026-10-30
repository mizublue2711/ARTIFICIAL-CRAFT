import React from 'react';
import { GenerativeVisual } from '../../GenerativeVisual';

interface GraphicRendererProps {
  seed?: string;
  graphicType?: string;
  className?: string;
}

export const GraphicRenderer: React.FC<GraphicRendererProps> = ({
  seed,
  graphicType = 'NEURAL_MESH',
  className = ''
}) => {
  return <GenerativeVisual seed={seed} mode={graphicType} className={className} />;
};
