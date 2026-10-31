import React, { useState, useEffect } from 'react';
import { PointCloudCanvas } from '../3d/PointCloudCanvas';
import { Terminal, Database, Cpu, ArrowRight, Play, Pause, Activity, Radio } from 'lucide-react';
import { sfx } from '../../utils/audio';

const INITIAL_LOGS = [
  '[01:47:02.102] INGEST_OCTREE: Received LiDAR chunk #48291 (300,214 pts) - Hash: 0x8F9C2B',
  '[01:47:02.118] NEURAL_CORE: Physical AI diffusion policy forward pass latency: 1.78 ms',
  '[01:47:02.134] KINEMATICS: 7-Axis Inverse Kinematics converged (Iterations: 3, Residual: 0.002 mm)',
  '[01:47:02.150] TACTILE_NET: Grasp stability prediction confidence 99.84% on steel shaft #402',
  '[01:47:02.166] MOTOR_BUS: EtherCAT master cycle sync jitter: 0.04 µs [OPTIMAL]',
  '[01:47:02.182] DRIFT_GUARD: Zero spatial drift registered against SLAM anchor point #VD-G9',
];

export const DataFactorySection: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [isStreaming, setIsStreaming] = useState(true);

  // Dynamic live terminal logs simulation
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `[${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}]`;
      const templates = [
        `${timeStr} INGEST_OCTREE: Streaming raw point packet (14,400 voxels) -> Bus EtherCAT`,
        `${timeStr} PHYSICAL_AI: Transformer cross-attention layer latency: 1.81 ms`,
        `${timeStr} DEXTEROUS_MATRIX: Tactile sensor nodes reading 42.5 N continuous grip force`,
        `${timeStr} SLAM_ANCHOR: Spatial point cloud registration verified (RMSE: 0.004 mm)`,
        `${timeStr} MOTOR_CONTROLLER: Harmonic drive thermal delta within nominal bounds (+3.8°C)`,
      ];
      const randomLog = templates[Math.floor(Math.random() * templates.length)];
      setLogs((prev) => [randomLog, ...prev.slice(0, 7)]);
      sfx.playDataStreamBeep();
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <section id="data-factory" className="py-20 px-6 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono-cad text-xs">
          <span className="w-2 h-2 bg-[#5322FF] rounded-full" />
          <span className="text-[#00E5FF] uppercase tracking-wider font-semibold">SECTION 02 // DATA FACTORY</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">PHYSICAL AI NEURAL MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
          Spatial Point Cloud & <span className="text-[#5322FF]">Neural Pipeline</span>
        </h2>
        <p className="mt-2 text-zinc-400 font-mono-cad text-xs sm:text-sm max-w-2xl">
          Real-time high-density LiDAR data ingestion, magnetic spatial point cloud manipulation, and closed-loop neural trajectory inference.
        </p>
      </div>

      {/* Visual Neural Pipeline (Step 1 -> Step 2 -> Step 3) */}
      <div className="mb-8 p-4 bg-[#09090B] border border-white/10 rounded-sm font-mono-cad">
        <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#00E5FF]">
            <Radio className="w-3.5 h-3.5" />
            <span>CLOSED-LOOP PHYSICAL AI FLOW ARCHITECTURE</span>
          </span>
          <span className="text-emerald-400">STATUS: ZERO DRIFT STREAM ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Node 1 */}
          <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-xs relative group hover:border-[#00E5FF]/50 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00E5FF]" />
                <span>01 // VISION INGESTION</span>
              </span>
              <span className="text-[10px] text-[#00E5FF] bg-cyan-950/40 px-1.5 py-0.5 rounded-xs">60 FPS</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Dual 128-beam solid-state LiDAR streams synchronized with high-framerate stereoscopic RGB-D cameras.
            </p>
            <div className="mt-3 text-[10px] text-zinc-500 pt-2 border-t border-white/5 flex justify-between">
              <span>BANDWIDTH:</span>
              <span className="text-zinc-200">1.2 GB/s RAW</span>
            </div>
          </div>

          {/* Node 2 */}
          <div className="p-4 bg-zinc-950/80 border border-[#5322FF]/50 rounded-xs relative group hover:border-[#5322FF] transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#5322FF]" />
                <span>02 // NEURAL PROCESSING</span>
              </span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded-xs">1.8 ms</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Spatial diffusion transformer policy predicting continuous 3D end-effector trajectories with zero drift.
            </p>
            <div className="mt-3 text-[10px] text-zinc-500 pt-2 border-t border-white/5 flex justify-between">
              <span>INFERENCE:</span>
              <span className="text-emerald-400">1.8ms LOW LATENCY</span>
            </div>
          </div>

          {/* Node 3 */}
          <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-xs relative group hover:border-[#00E5FF]/50 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00E5FF]" />
                <span>03 // ACTUATION & SENSORY</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-xs">1 kHz</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sub-millimeter closed-loop impedance control coupled with 1024-node piezoresistive tactile matrix feedback.
            </p>
            <div className="mt-3 text-[10px] text-zinc-500 pt-2 border-t border-white/5 flex justify-between">
              <span>REPEATABILITY:</span>
              <span className="text-white">±0.008 mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Spatial Point Cloud Canvas */}
      <PointCloudCanvas />

      {/* Retro-Terminal Telemetry Stream Log */}
      <div className="mt-6 bg-[#09090B] border border-white/10 rounded-sm p-4 font-mono-cad">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2 text-xs text-white">
            <Terminal className="w-4 h-4 text-[#00E5FF]" />
            <strong className="tracking-wide">DATA FACTORY INGESTION STREAM CONSOLE</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsStreaming(!isStreaming);
                sfx.playTacticalClick(1500, 0.02);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 border border-white/15 hover:border-white/30 text-[10px] text-zinc-300 rounded-xs transition-colors"
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span>PAUSE STREAM</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span>RESUME STREAM</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-zinc-500">BUFFER: 8/8 SLOTS</span>
          </div>
        </div>

        {/* Console Log Rows */}
        <div className="space-y-1.5 text-xs text-zinc-300 bg-black/80 p-3 rounded-xs border border-white/5 max-h-48 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 leading-relaxed font-mono-cad text-[11px]">
              <span className="text-[#00E5FF] select-none">&gt;</span>
              <span className={index === 0 ? 'text-white font-medium' : 'text-zinc-400'}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
