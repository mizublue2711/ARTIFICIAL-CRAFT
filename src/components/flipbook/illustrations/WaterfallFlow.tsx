import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const WaterfallFlow: React.FC<IllustrationProps> = ({ className = '' }) => {
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const steps = [
    { label: 'INITIAL AUM', value: '$1,000M', delta: 'BASE', yStart: 140, yEnd: 80, isTotal: true, color: '#5322FF' },
    { label: 'YIELD GROWTH', value: '+ $250M', delta: '+25.0%', yStart: 80, yEnd: 55, isTotal: false, color: '#00E5FF' },
    { label: 'INFLOWS', value: '+ $180M', delta: '+18.0%', yStart: 55, yEnd: 35, isTotal: false, color: '#10B981' },
    { label: 'MGMT FEES', value: '- $15M', delta: '-1.5%', yStart: 35, yEnd: 40, isTotal: false, color: '#EF4444' },
    { label: 'ENDING AUM', value: '$1,415M', delta: '+41.5%', yStart: 140, yEnd: 35, isTotal: true, color: '#00E5FF' },
  ];

  return (
    <div className={`w-full h-full min-h-[220px] bg-[#0B0B0F] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="waterfall-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1" fill="#00E5FF" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#waterfall-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <span className="text-[#00E5FF] font-bold">WATERFALL_FLOW // AUM CAPITAL COMPOUNDING</span>
        <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">AUM_CASCADE</span>
      </div>

      {/* Main SVG Visualization */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-[160px]">
          {/* Baseline Grid */}
          <line x1="20" y1="140" x2="380" y2="140" stroke="#27272A" strokeWidth="1.5" />

          {/* Connectors between steps */}
          {steps.slice(0, -1).map((s, i) => {
            const nextX = 30 + (i + 1) * 70;
            return (
              <line
                key={`conn-${i}`}
                x1={30 + i * 70 + 50}
                y1={s.yEnd}
                x2={nextX}
                y2={s.yEnd}
                stroke="#5322FF"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Waterfall Columns */}
          {steps.map((step, idx) => {
            const isHovered = activeStep === idx;
            const x = 30 + idx * 70;
            const barY = Math.min(step.yStart, step.yEnd);
            const barHeight = Math.abs(step.yStart - step.yEnd);

            return (
              <g
                key={step.label}
                onMouseEnter={() => setActiveStep(idx)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* 3D Depth Backing */}
                <rect
                  x={x + 3}
                  y={barY - 3}
                  width="50"
                  height={barHeight}
                  fill="#12121A"
                  stroke={step.color}
                  strokeWidth="0.5"
                  opacity="0.4"
                  rx="1"
                />

                {/* Main Front Column */}
                <rect
                  x={x}
                  y={barY}
                  width="50"
                  height={barHeight}
                  fill={isHovered ? `${step.color}44` : '#09090D'}
                  stroke={step.color}
                  strokeWidth={isHovered ? 2 : 1.5}
                  rx="2"
                />

                {/* Top Value Label */}
                <text
                  x={x + 25}
                  y={barY - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#00E5FF' : '#E4E4E7'}
                  fontSize="7"
                  fontWeight="bold"
                >
                  {step.value}
                </text>

                {/* Step Name Tag below axis */}
                <text x={x + 25} y="156" textAnchor="middle" fill="#A1A1AA" fontSize="6.5">
                  {step.label}
                </text>
                <text x={x + 25} y="166" textAnchor="middle" fill={step.color} fontSize="6" fontWeight="bold">
                  {step.delta}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>COMPOUND_CAGR: 14.8% // CAPITAL_RETENTION: 98.2%</span>
        <span>WATERFALL_ENGINE_v2.2</span>
      </div>
    </div>
  );
};
