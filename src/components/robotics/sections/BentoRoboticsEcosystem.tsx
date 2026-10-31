import React, { useState } from 'react';
import { TACTILE_GRASP_MODES } from '../../data/robotAssembly';
import { TactileGraspMode } from '../../types/telemetry';
import { Cpu, Gauge, Hand, Layers, ShieldCheck, Activity, Zap, Compass } from 'lucide-react';
import { sfx } from '../../utils/audio';

export const BentoRoboticsEcosystem: React.FC = () => {
  // Card 2: Motor Actuator state
  const [motorRpm, setMotorRpm] = useState<number>(2400);

  // Card 3: Dexterous Hand state
  const [activeGrasp, setActiveGrasp] = useState<TactileGraspMode>(TACTILE_GRASP_MODES[0]);

  // Card 1: Bipedal mobility mode
  const [mobilityMode, setMobilityMode] = useState<'walk' | 'dynamic_run' | 'rough_terrain'>('dynamic_run');

  // Compute live motor torque based on inverse torque-speed curve: T = T_peak * (1 - RPM / RPM_max)
  const maxRpm = 4500;
  const peakTorque = 180; // N·m
  const currentTorque = Math.max(12, Math.round(peakTorque * (1 - (motorRpm / maxRpm) * 0.72)));
  const motorPowerKw = ((currentTorque * (motorRpm * 2 * Math.PI / 60)) / 1000).toFixed(2);

  return (
    <section id="ecosystem" className="py-20 px-6 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono-cad text-xs">
          <span className="w-2 h-2 bg-[#00E5FF] rounded-full" />
          <span className="text-[#00E5FF] uppercase tracking-wider font-semibold">SECTION 01 // ARCHITECTURE</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">PHYSICAL AI HARDWARE CORE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
          Bento Grid <span className="text-[#00E5FF]">Robotics Ecosystem</span>
        </h2>
        <p className="mt-2 text-zinc-400 font-mono-cad text-xs sm:text-sm max-w-2xl">
          Modular high-density mechatronic hardware stacks engineered for heavy manufacturing, sub-millimeter precision, and unconstrained physical AI learning.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CARD 1: Intelligent Robot Systems (Bipedal Mobility & Perception) */}
        <div className="lg:col-span-5 bg-[#09090B] border border-white/10 rounded-sm p-6 flex flex-col justify-between cad-grid-pattern relative overflow-hidden group hover:border-[#00E5FF]/40 transition-colors">
          <div className="cad-crosshair-tl cad-crosshair-tr" />
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="flex items-center gap-2 text-xs font-mono-cad text-white">
                <Compass className="w-4 h-4 text-[#00E5FF]" />
                <strong className="tracking-wide">01 // INTELLIGENT BIPEDAL SYSTEMS</strong>
              </span>
              <span className="text-[10px] font-mono-cad text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-xs">
                VD-ATLAS-X
              </span>
            </div>

            {/* Tactical 2D CAD Orthographic Viewport of Bipedal Unit */}
            <div className="relative h-56 bg-zinc-950/90 border border-white/10 rounded-xs mb-4 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full text-zinc-700" viewBox="0 0 300 200">
                {/* Ground grid */}
                <line x1="20" y1="185" x2="280" y2="185" stroke="#27272a" strokeWidth="1" />
                <circle cx="150" cy="185" r="4" fill="#00E5FF" />
                
                {/* Robot Leg Kinematic Chains */}
                {/* Left Leg */}
                <line x1="140" y1="95" x2="125" y2="140" stroke="#5322FF" strokeWidth="3" />
                <circle cx="125" cy="140" r="5" fill="#00E5FF" />
                <line x1="125" y1="140" x2="135" y2="185" stroke="#5322FF" strokeWidth="3" />
                <rect x="125" y="180" width="22" height="6" fill="#00E5FF" rx="1" />

                {/* Right Leg */}
                <line x1="160" y1="95" x2="175" y2="135" stroke="#00E5FF" strokeWidth="3" />
                <circle cx="175" cy="135" r="5" fill="#5322FF" />
                <line x1="175" y1="135" x2="165" y2="185" stroke="#00E5FF" strokeWidth="3" />
                <rect x="155" y="180" width="22" height="6" fill="#5322FF" rx="1" />

                {/* Torso & Pelvis */}
                <polygon points="135,95 165,95 160,55 140,55" fill="#18181b" stroke="#00E5FF" strokeWidth="1.5" />
                {/* Chest LiDAR Sensor */}
                <circle cx="150" cy="65" r="7" fill="#00E5FF" opacity="0.8" />
                {/* Head Sensor Turret */}
                <rect x="142" y="38" width="16" height="14" fill="#27272a" stroke="#5322FF" rx="2" />
                <line x1="145" y1="45" x2="155" y2="45" stroke="#00E5FF" strokeWidth="2" />

                {/* Center of Mass Indicator */}
                <circle cx="150" cy="105" r="10" fill="none" stroke="#10b981" strokeDasharray="3 2" />
                <text x="165" y="108" fill="#10b981" fontSize="9" fontFamily="monospace">CoM: STABLE</text>
              </svg>

              <div className="absolute top-2 left-2 text-[10px] font-mono-cad text-zinc-400">
                GAIT TRACKER: <span className="text-[#00E5FF] font-semibold">{mobilityMode.toUpperCase()}</span>
              </div>
              <div className="absolute bottom-2 right-2 text-[9px] font-mono-cad text-zinc-500">
                PAYLOAD CAPACITY: 55.0 KG
              </div>
            </div>

            {/* Mobility Mode Switcher */}
            <div className="flex gap-2 mb-4 font-mono-cad text-xs">
              {(['walk', 'dynamic_run', 'rough_terrain'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setMobilityMode(mode);
                    sfx.playTacticalClick(1900, 0.02);
                  }}
                  className={`flex-1 py-1 px-2 border rounded-xs transition-colors text-[10px] uppercase ${
                    mobilityMode === mode
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Specs List */}
            <div className="space-y-2 text-xs font-mono-cad border-t border-white/10 pt-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Perception Stack:</span>
                <span className="text-zinc-200">Dual 128-Beam LiDAR + 4x RGB-D</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">IMU Sensor Hub:</span>
                <span className="text-zinc-200">Dual 6-Axis Tactical Gyros (1 kHz)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Joint Actuation:</span>
                <span className="text-[#00E5FF]">32 Active Quasi-Direct Drives</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-cad">
            <span className="text-zinc-500">AUTONOMY RUNTIME</span>
            <span className="text-emerald-400 font-semibold">4.8 HOURS CONTINUOUS</span>
          </div>
        </div>

        {/* CARD 2: Precision Motor Actuators (Harmonic Drive & Torque Graph) */}
        <div className="lg:col-span-7 bg-[#09090B] border border-white/10 rounded-sm p-6 flex flex-col justify-between cad-grid-pattern relative overflow-hidden group hover:border-[#5322FF]/50 transition-colors">
          <div className="cad-crosshair-tl cad-crosshair-tr" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="flex items-center gap-2 text-xs font-mono-cad text-white">
                <Zap className="w-4 h-4 text-[#5322FF]" />
                <strong className="tracking-wide">02 // PRECISION HARMONIC ACTUATORS</strong>
              </span>
              <span className="text-[10px] font-mono-cad text-[#5322FF] bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-xs">
                VD-HD-160 CORE
              </span>
            </div>

            {/* Dynamic Interactive Velocity & Torque Graph */}
            <div className="bg-zinc-950 p-4 border border-white/10 rounded-xs mb-4">
              <div className="flex items-center justify-between text-xs font-mono-cad mb-2">
                <span className="text-zinc-300">TORQUE-SPEED DYNAMIC DYNAMOMETER</span>
                <span className="text-[#00E5FF]">POWER: {motorPowerKw} kW</span>
              </div>

              {/* Dynamic SVG Curve */}
              <div className="relative h-44 w-full bg-black/60 border border-white/5 rounded-xs overflow-hidden p-2">
                <svg className="w-full h-full" viewBox="0 0 400 140">
                  {/* Axis Grid lines */}
                  <line x1="40" y1="20" x2="40" y2="120" stroke="#27272a" strokeWidth="1" />
                  <line x1="40" y1="120" x2="380" y2="120" stroke="#27272a" strokeWidth="1" />
                  
                  {/* Labels */}
                  <text x="5" y="25" fill="#a1a1aa" fontSize="8" fontFamily="monospace">180 Nm</text>
                  <text x="15" y="123" fill="#a1a1aa" fontSize="8" fontFamily="monospace">0 Nm</text>
                  <text x="40" y="134" fill="#a1a1aa" fontSize="8" fontFamily="monospace">0 RPM</text>
                  <text x="340" y="134" fill="#a1a1aa" fontSize="8" fontFamily="monospace">4500 RPM</text>

                  {/* High Efficiency Envelope Area */}
                  <polygon
                    points="40,25 280,45 380,95 380,120 40,120"
                    fill="url(#indigoGrad)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5322FF" />
                      <stop offset="100%" stopColor="#09090B" />
                    </linearGradient>
                  </defs>

                  {/* Torque vs RPM Curve */}
                  <path
                    d="M 40 25 C 200 30, 300 65, 380 105"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="2.5"
                  />

                  {/* Active Operating Point Crosshair */}
                  {(() => {
                    const normRpm = motorRpm / maxRpm;
                    const ptX = 40 + normRpm * 340;
                    const normTorque = currentTorque / peakTorque;
                    const ptY = 120 - normTorque * 95;
                    return (
                      <g>
                        <line x1={ptX} y1="20" x2={ptX} y2="120" stroke="#5322FF" strokeDasharray="3 2" />
                        <line x1="40" y1={ptY} x2="380" y2={ptY} stroke="#5322FF" strokeDasharray="3 2" />
                        <circle cx={ptX} cy={ptY} r="5" fill="#00E5FF" />
                        <circle cx={ptX} cy={ptY} r="8" fill="none" stroke="#00E5FF" strokeWidth="1" />
                        <text x={Math.min(ptX + 8, 300)} y={ptY - 8} fill="#ffffff" fontSize="9" fontFamily="monospace">
                          {currentTorque} Nm @ {motorRpm} RPM
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* RPM Slider */}
              <div className="mt-3 flex items-center gap-3 font-mono-cad text-xs">
                <span className="text-zinc-400 text-[10px]">OPERATING RPM:</span>
                <input
                  type="range"
                  min="200"
                  max="4500"
                  step="50"
                  value={motorRpm}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMotorRpm(val);
                    sfx.updateServoTone((val / 4500) * 0.8);
                  }}
                  onPointerUp={() => sfx.stopServoTone()}
                  className="flex-1 h-1.5 bg-zinc-800 rounded-xs appearance-none accent-[#5322FF]"
                />
                <span className="text-white font-semibold w-16 text-right">{motorRpm} RPM</span>
              </div>
            </div>

            {/* Actuator Specs Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono-cad">
              <div className="bg-black/60 p-2.5 border border-white/5 rounded-xs">
                <div className="text-[9px] text-zinc-500">BACKLASH</div>
                <div className="text-emerald-400 font-bold">&lt; 0.1 arcmin</div>
              </div>
              <div className="bg-black/60 p-2.5 border border-white/5 rounded-xs">
                <div className="text-[9px] text-zinc-500">EFFICIENCY</div>
                <div className="text-white font-bold">97.8% PEAK</div>
              </div>
              <div className="bg-black/60 p-2.5 border border-white/5 rounded-xs">
                <div className="text-[9px] text-zinc-500">GEAR RATIO</div>
                <div className="text-[#00E5FF] font-bold">1:100 REDUCTION</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-cad">
            <span className="text-zinc-500">BEARING ARCHITECTURE</span>
            <span className="text-zinc-300">Integrated Dual Cross-Roller Bearings</span>
          </div>
        </div>

        {/* CARD 3: Dexterous Hands Engine (1024-Node Tactile Sensor Matrix) */}
        <div className="lg:col-span-12 bg-[#09090B] border border-white/10 rounded-sm p-6 cad-grid-pattern relative overflow-hidden group hover:border-[#00E5FF]/40 transition-colors">
          <div className="cad-crosshair-tl cad-crosshair-tr" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-white/10 mb-6 gap-2">
            <div>
              <span className="flex items-center gap-2 text-xs font-mono-cad text-white">
                <Hand className="w-4 h-4 text-[#00E5FF]" />
                <strong className="tracking-wide">03 // DEXTEROUS HANDS TACTILE ENGINE</strong>
              </span>
              <div className="text-xs text-zinc-400 font-mono-cad mt-1">
                11-DOF Anthro Hand with 1,024 Piezoresistive Pressure Sensor Array
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono-cad text-xs">
              <span className="text-[10px] text-[#00E5FF] bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-xs">
                1 kHz HAPTIC SAMPLING
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-xs">
                PEAK GRIP: 45.0 N
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Grasp Mode Selector */}
            <div className="lg:col-span-4 space-y-2.5 font-mono-cad">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2">
                SELECT INTERACTIVE GRASP MODE:
              </div>

              {TACTILE_GRASP_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveGrasp(mode);
                    sfx.playTacticalClick(1700, 0.03);
                  }}
                  className={`w-full text-left p-3 border rounded-xs transition-all ${
                    activeGrasp.id === mode.id
                      ? 'bg-[#5322FF]/20 border-[#00E5FF] shadow-lg shadow-[#00E5FF]/5'
                      : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={activeGrasp.id === mode.id ? 'text-[#00E5FF]' : 'text-zinc-200'}>
                      {mode.name}
                    </span>
                    <span className="text-[10px] text-emerald-400">{mode.gripForceN} N</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {mode.description}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-white/5">
                    <span>ACTIVE SENSOR NODES:</span>
                    <span className="text-zinc-300 font-semibold">{mode.primaryNodesActive} / 1024</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Real-time 32x32 Interactive Pressure Heatmap Matrix (1024 Nodes) */}
            <div className="lg:col-span-8 bg-zinc-950 p-5 border border-white/10 rounded-xs flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs font-mono-cad mb-3 pb-2 border-b border-white/10">
                <span className="text-zinc-300">
                  REAL-TIME PRESSURE HEATMAP [<span className="text-[#00E5FF]">{activeGrasp.name.toUpperCase()}</span>]
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-[#18181b]" /> 0 N
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400">
                    <span className="w-2 h-2 rounded-full bg-[#5322FF]" /> 15 N
                  </span>
                  <span className="flex items-center gap-1 text-[#00E5FF]">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF]" /> 30 N
                  </span>
                  <span className="flex items-center gap-1 text-white">
                    <span className="w-2 h-2 rounded-full bg-white" /> 45 N
                  </span>
                </div>
              </div>

              {/* 32x32 Tactile Grid Matrix (1,024 Nodes) */}
              <div className="w-full max-w-md aspect-square grid grid-cols-32 gap-[2px] p-2 bg-black border border-white/15 rounded-xs">
                {Array.from({ length: 1024 }).map((_, i) => {
                  const row = Math.floor(i / 32);
                  const col = i % 32;

                  // Compute pressure intensity based on active grasp pattern
                  let intensity = 0;
                  if (activeGrasp.pattern === 'pinch') {
                    // Two concentrated clusters near top fingers and thumb
                    const d1 = Math.hypot(row - 8, col - 16);
                    const d2 = Math.hypot(row - 22, col - 12);
                    intensity = Math.max(0, 1 - d1 / 5) * 0.95 + Math.max(0, 1 - d2 / 5) * 0.9;
                  } else if (activeGrasp.pattern === 'power_cylinder') {
                    // Broad horizontal band with palm and 4 fingers
                    const dBand = Math.abs(row - 16);
                    intensity = Math.max(0, 1 - dBand / 12) * (0.5 + Math.sin(col * 0.5) * 0.4);
                  } else if (activeGrasp.pattern === 'spherical') {
                    // Radial pressure ring
                    const dCenter = Math.hypot(row - 16, col - 16);
                    intensity = Math.max(0, 1 - Math.abs(dCenter - 10) / 4) * 0.9;
                  } else {
                    // Single precise probe point
                    const dProbe = Math.hypot(row - 12, col - 20);
                    intensity = Math.max(0, 1 - dProbe / 3.5);
                  }

                  intensity = Math.min(Math.max(intensity, 0), 1);

                  // Color mapping
                  let bgCol = '#121215';
                  if (intensity > 0.85) bgCol = '#ffffff';
                  else if (intensity > 0.6) bgCol = '#00E5FF';
                  else if (intensity > 0.3) bgCol = '#5322FF';
                  else if (intensity > 0.08) bgCol = '#27272a';

                  return (
                    <div
                      key={i}
                      title={`Node #${i} [R:${row}, C:${col}]: ${(intensity * activeGrasp.gripForceN).toFixed(1)} N`}
                      style={{ backgroundColor: bgCol }}
                      className="w-full h-full rounded-[0.5px] transition-colors duration-150 cursor-pointer hover:ring-1 hover:ring-white"
                      onClick={() => sfx.playTacticalClick(2400, 0.015)}
                    />
                  );
                })}
              </div>

              {/* Matrix Telemetry Footer */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono-cad text-zinc-400 mt-3 pt-2 border-t border-white/5">
                <div>
                  ACTIVE NODES: <span className="text-[#00E5FF] font-semibold">{activeGrasp.primaryNodesActive} / 1024</span>
                </div>
                <div>
                  TOTAL FORCE: <span className="text-emerald-400 font-semibold">{activeGrasp.gripForceN} N PEAK</span>
                </div>
                <div>
                  CONTACT AREA: <span className="text-white font-semibold">{activeGrasp.contactAreaPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
