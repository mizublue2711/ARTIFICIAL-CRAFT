import React from 'react';
import { GenerativeVisual } from '../../GenerativeVisual';
import { AutomationFlow } from './AutomationFlow';
import { DataPipelineMatrix } from './DataPipelineMatrix';
import { RemotionTimeline } from './RemotionTimeline';
import { GeoSpatialMap } from './GeoSpatialMap';
import { PortfolioAllocator } from './PortfolioAllocator';
import { ExecutivePortrait } from './ExecutivePortrait';
import { RiskRadar } from './RiskRadar';
import { GlobalGeoNodes } from './GlobalGeoNodes';
import { CandlestickStream } from './CandlestickStream';
import { WaterfallFlow } from './WaterfallFlow';

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
  const normalizedType = (graphicType || '').toUpperCase();

  switch (normalizedType) {
    case 'AUTOMATION_FLOW':
      return <AutomationFlow seed={seed} className={className} />;
    case 'DATA_MATRIX':
    case 'DATA_PIPELINE':
      return <DataPipelineMatrix seed={seed} className={className} />;
    case 'REMOTION_TIMELINE':
    case 'TIMELINE':
      return <RemotionTimeline seed={seed} className={className} />;
    case 'GEO_MAP':
    case 'GEOSPATIAL':
      return <GeoSpatialMap seed={seed} className={className} />;
    case 'PORTFOLIO_ALLOCATOR':
      return <PortfolioAllocator seed={seed} className={className} />;
    case 'EXECUTIVE_PORTRAIT':
      return <ExecutivePortrait seed={seed} className={className} />;
    case 'RISK_RADAR':
      return <RiskRadar seed={seed} className={className} />;
    case 'GLOBAL_GEO_NODES':
    case 'GEO_NODES':
      return <GlobalGeoNodes seed={seed} className={className} />;
    case 'CANDLESTICK_STREAM':
    case 'CANDLESTICK':
      return <CandlestickStream seed={seed} className={className} />;
    case 'WATERFALL_FLOW':
    case 'WATERFALL':
      return <WaterfallFlow seed={seed} className={className} />;
    default:
      return <GenerativeVisual seed={seed} mode={graphicType} className={className} />;
  }
};
