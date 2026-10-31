import React, { useEffect, useState } from 'react';
export const TopTelemetryBar: React.FC = () => {
  const [liveGpuLoad, setLiveGpuLoad] = useState('14.2%');
  const [liveLatency, setLiveLatency] = useState('4.2 ms');
  const [liveDrift] = useState('0.00%');

  // Subtle realistic industrial telemetry micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const gpu = (13.8 + Math.random() * 0.9).toFixed(1) + '%';
      const lat = (3.8 + Math.random() * 0.7).toFixed(1) + ' ms';
      setLiveGpuLoad(gpu);
      setLiveLatency(lat);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#09090B]/95 border-b border-white/10 px-4 py-2.5 z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Node 1: System SLA */}
        <div className="bg-zinc-950/80 border border-white/5 rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono-cad text-zinc-400 pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <strong className="text-zinc-200">NODE 01: SYSTEM SLA</strong>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-950/40 border border-emerald-800/40 rounded-xs">
              60 FPS SLA
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono-cad">
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Clock</div>
              <div className="text-zinc-100 font-medium">60.0 FPS</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">GPU Load</div>
              <div className="text-[#00E5FF] font-medium">{liveGpuLoad}</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Latency</div>
              <div className="text-emerald-400 font-medium">{liveLatency}</div>
            </div>
          </div>
        </div>

        {/* Node 2: Motor Kinematics */}
        <div className="bg-zinc-950/80 border border-white/5 rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono-cad text-zinc-400 pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              <strong className="text-zinc-200">NODE 02: KINEMATICS</strong>
            </span>
            <span className="text-[10px] text-[#00E5FF] font-semibold px-1.5 py-0.2 bg-cyan-950/40 border border-cyan-800/40 rounded-xs">
              1:100 HD
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono-cad">
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Accuracy</div>
              <div className="text-zinc-100 font-medium">±0.01 mm</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Harmonic</div>
              <div className="text-[#5322FF] font-medium">1:100 Ratio</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Max Vel</div>
              <div className="text-[#00E5FF] font-medium">4.5 m/s</div>
            </div>
          </div>
        </div>

        {/* Node 3: Dexterous Hands */}
        <div className="bg-zinc-950/80 border border-white/5 rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono-cad text-zinc-400 pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <strong className="text-zinc-200">NODE 03: DEXTEROUS</strong>
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold px-1.5 py-0.2 bg-indigo-950/40 border border-indigo-800/40 rounded-xs">
              11-DOF ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono-cad">
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Kinematics</div>
              <div className="text-zinc-100 font-medium">11 DOF</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Tactile</div>
              <div className="text-[#00E5FF] font-medium">1024 Nodes</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Pressure</div>
              <div className="text-indigo-300 font-medium">0.5 - 45N</div>
            </div>
          </div>
        </div>

        {/* Node 4: Physical AI Brain */}
        <div className="bg-zinc-950/80 border border-white/5 rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono-cad text-zinc-400 pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <strong className="text-zinc-200">NODE 04: AI BRAIN</strong>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-950/40 border border-emerald-800/40 rounded-xs">
              60 FPS DATA
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono-cad">
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Ingestion</div>
              <div className="text-zinc-100 font-medium">60 FPS</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Memory</div>
              <div className="text-emerald-400 font-medium">{liveDrift} Drift</div>
            </div>
            <div>
              <div className="text-[9px] text-zinc-400 uppercase">Inference</div>
              <div className="text-[#00E5FF] font-medium">1.8 ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
