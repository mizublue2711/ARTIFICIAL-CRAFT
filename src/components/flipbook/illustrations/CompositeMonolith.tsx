import React, { useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const CompositeMonolith: React.FC<IllustrationProps> = ({ className = '' }) => {
  // Exploded View Slider: 0% (compact monolith) to 100% (fully exploded mechanical assembly)
  const [explodeOffset, setExplodeOffset] = useState<number>(35);

  // Normalization factor 0.0 to 1.0
  const factor = explodeOffset / 100;

  // 7-component mechanical assembly definitions
  // 1. Top Sensor Array Dome
  // 2. Logic Coprocessor Shield
  // 3. Central Monolith Core Housing
  // 4. Gold Logic Bus Matrix
  // 5. Thermal Dissipation Fin Unit
  // 6. Actuator Servo Carrier
  // 7. Reinforced Base Foundation
  const components = [
    {
      id: 'COMP_01',
      name: 'SENSOR_DOME',
      baseY: 22,
      dy: -36 * factor,
      dx: 0,
      width: 120,
      height: 18,
      color: '#00E5FF',
      fill: 'rgba(0, 229, 255, 0.15)',
      accent: 'RADAR_OPTIC'
    },
    {
      id: 'COMP_02',
      name: 'LOGIC_SHIELD',
      baseY: 42,
      dy: -22 * factor,
      dx: -16 * factor,
      width: 150,
      height: 16,
      color: '#5322FF',
      fill: 'rgba(83, 34, 255, 0.25)',
      accent: 'EMI_LAYER'
    },
    {
      id: 'COMP_03',
      name: 'GOLD_BUS_MATRIX',
      baseY: 60,
      dy: -8 * factor,
      dx: 18 * factor,
      width: 170,
      height: 12,
      color: '#FFD700',
      fill: 'rgba(255, 215, 0, 0.25)',
      accent: '24K_GOLD_BUS'
    },
    {
      id: 'COMP_04',
      name: 'MONOLITH_CORE',
      baseY: 74,
      dy: 0,
      dx: 0,
      width: 190,
      height: 24,
      color: '#00E5FF',
      fill: '#12121A',
      accent: 'MAIN_CHASSIS'
    },
    {
      id: 'COMP_05',
      name: 'THERMAL_FINS',
      baseY: 100,
      dy: 12 * factor,
      dx: -20 * factor,
      width: 160,
      height: 14,
      color: '#A1A1AA',
      fill: 'rgba(161, 161, 170, 0.2)',
      accent: 'HEAT_SINK'
    },
    {
      id: 'COMP_06',
      name: 'ACTUATOR_CARRIER',
      baseY: 116,
      dy: 24 * factor,
      dx: 14 * factor,
      width: 140,
      height: 16,
      color: '#5322FF',
      fill: 'rgba(83, 34, 255, 0.3)',
      accent: 'KINEMATICS'
    },
    {
      id: 'COMP_07',
      name: 'BASE_FOUNDATION',
      baseY: 134,
      dy: 38 * factor,
      dx: 0,
      width: 180,
      height: 20,
      color: '#71717A',
      fill: 'rgba(24, 24, 36, 0.9)',
      accent: 'GROUND_ANCHOR'
    }
  ];

  return (
    <div
      className={`w-full h-full min-h-[220px] bg-[#09090B] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between select-none ${className}`}
    >
      {/* Background 1px Swiss Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <pattern id="monolith-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#monolith-grid)" />
      </svg>

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FFD700] rounded-none animate-pulse" />
          <span className="text-[#00E5FF] font-bold">COMPOSITE_MONOLITH // 7-LAYER_ASSEMBLY</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-[9px]">EXPLODED_VIEW:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={explodeOffset}
            onChange={(e) => setExplodeOffset(Number(e.target.value))}
            className="w-24 h-1.5 bg-zinc-800 accent-[#00E5FF] cursor-pointer"
          />
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[#FFD700] font-bold text-[9px] min-w-[38px] text-center">
            {explodeOffset}%
          </span>
        </div>
      </div>

      {/* 3D Isometric Exploded Monolith Diagram */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 540 190" className="w-full h-auto max-h-[170px]">
          <defs>
            {/* Gold Logic Bus Gradient */}
            <linearGradient id="gold-bus-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFF275" stopOpacity="1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="monolith-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#181824" />
              <stop offset="50%" stopColor="#0E0E15" />
              <stop offset="100%" stopColor="#09090D" />
            </linearGradient>
          </defs>

          {/* Isometric Alignment Axis Center Line */}
          <line
            x1="270"
            y1="10"
            x2="270"
            y2="180"
            stroke="#5322FF"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Explosion Offset Displacement Guides */}
          {factor > 0.05 && (
            <g stroke="#00E5FF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3">
              <line x1="270" y1="22" x2="270" y2={22 - 36 * factor} />
              <line x1="270" y1="42" x2={270 - 16 * factor} y2={42 - 22 * factor} />
              <line x1="270" y1="60" x2={270 + 18 * factor} y2={60 - 8 * factor} />
              <line x1="270" y1="100" x2={270 - 20 * factor} y2={100 + 12 * factor} />
              <line x1="270" y1="116" x2={270 + 14 * factor} y2={116 + 24 * factor} />
              <line x1="270" y1="134" x2="270" y2={134 + 38 * factor} />
            </g>
          )}

          {/* Render 7 Components */}
          {components.map((comp, idx) => {
            const cx = 270 + comp.dx;
            const cy = comp.baseY + comp.dy;
            const hw = comp.width / 2;
            const hh = comp.height / 2;

            const isGold = comp.id === 'COMP_03';

            return (
              <g key={comp.id} className="transition-all duration-150">
                {/* Isometric Top Surface */}
                <polygon
                  points={`${cx},${cy - hh} ${cx + hw},${cy - hh * 0.2} ${cx},${cy + hh * 0.6} ${cx - hw},${cy - hh * 0.2}`}
                  fill={isGold ? 'url(#gold-bus-glow)' : comp.fill}
                  stroke={isGold ? '#FFD700' : comp.color}
                  strokeWidth="1.2"
                />

                {/* Isometric Left Flank */}
                <polygon
                  points={`${cx - hw},${cy - hh * 0.2} ${cx},${cy + hh * 0.6} ${cx},${cy + hh * 1.4} ${cx - hw},${cy + hh * 0.6}`}
                  fill="#0D0D14"
                  stroke={comp.color}
                  strokeWidth="0.9"
                  opacity="0.85"
                />

                {/* Isometric Right Flank */}
                <polygon
                  points={`${cx},${cy + hh * 0.6} ${cx + hw},${cy - hh * 0.2} ${cx + hw},${cy + hh * 0.6} ${cx},${cy + hh * 1.4}`}
                  fill="#060609"
                  stroke={comp.color}
                  strokeWidth="0.9"
                  opacity="0.95"
                />

                {/* Gold Logic Bus Trace Lines on Component 3 */}
                {isGold && (
                  <g stroke="#FFF275" strokeWidth="1">
                    <line x1={cx - 50} y1={cy} x2={cx + 50} y2={cy} />
                    <circle cx={cx - 30} cy={cy} r="2" fill="#FFD700" />
                    <circle cx={cx + 30} cy={cy} r="2" fill="#FFD700" />
                  </g>
                )}

                {/* Component Label Pointer Lines (Rendered when exploded) */}
                {factor > 0.25 && (
                  <g>
                    {idx % 2 === 0 ? (
                      <>
                        <line
                          x1={cx + hw + 2}
                          y1={cy}
                          x2={cx + hw + 24}
                          y2={cy}
                          stroke={comp.color}
                          strokeWidth="0.8"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={cx + hw + 28}
                          y={cy + 3}
                          fill={isGold ? '#FFD700' : comp.color}
                          fontSize="7.5"
                          fontFamily="monospace"
                        >
                          {comp.id}: {comp.name}
                        </text>
                      </>
                    ) : (
                      <>
                        <line
                          x1={cx - hw - 2}
                          y1={cy}
                          x2={cx - hw - 24}
                          y2={cy}
                          stroke={comp.color}
                          strokeWidth="0.8"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={cx - hw - 28}
                          y={cy + 3}
                          textAnchor="end"
                          fill={comp.color}
                          fontSize="7.5"
                          fontFamily="monospace"
                        >
                          {comp.accent}
                        </text>
                      </>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>
          ASSEMBLY: 7 MECHANICAL NODES // GOLD BUS: #FFD700 // OFFSET: {explodeOffset}%
        </span>
        <span>CAD_MONOLITH_v3.8</span>
      </div>
    </div>
  );
};
