import React, { useState } from 'react';
import { X, Cpu, Layers, Activity, Copy, Check } from 'lucide-react';
import { MechanicalComponent } from '@/types/telemetry';
import { sfx } from '@/lib/video-engine/robotics/audio';

interface ComponentBlueprintModalProps {
  component: MechanicalComponent | null;
  onClose: () => void;
}

export const ComponentBlueprintModal: React.FC<ComponentBlueprintModalProps> = ({
  component,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!component) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          component: component.name,
          code: component.code,
          category: component.category,
          specs: component.specs,
          ros2_topic: `/vindynamics/assembly/${component.id}/telemetry`,
        },
        null,
        2
      )
    );
    setCopied(true);
    sfx.playTacticalClick(2200, 0.03);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-mono-cad animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#09090B] border border-[#00E5FF]/40 rounded-sm shadow-2xl p-6 overflow-hidden">
        {/* Subtle CAD Background Grid & Crosshairs */}
        <div className="absolute inset-0 cad-grid-pattern opacity-10 pointer-events-none" />
        <div className="cad-crosshair-tl cad-crosshair-tr" />

        {/* Header Ribbon */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-[#00E5FF] mb-1">
              <span className="px-1.5 py-0.5 bg-[#00E5FF]/10 border border-[#00E5FF]/40 font-bold">
                SWISS CAD BLUEPRINT SPECIFICATION
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">REV 4.2 INDUSTRIAL RELEASE</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">{component.name}</h2>
            <div className="text-xs text-zinc-400 mt-0.5">
              SYSTEM PART CODE: <span className="text-[#00E5FF]">{component.code}</span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              sfx.playTacticalClick(1200, 0.02);
            }}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blueprint CAD Schematic Visualization (Procedural Vector Lines) */}
        <div className="my-4 p-3 bg-zinc-950 border border-white/10 rounded-sm relative z-10">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>ISOMETRIC SECTION ELEVATION</span>
            </span>
            <span className="text-[#00E5FF]">SCALE 1:2.5 • DIMENSIONS IN MM</span>
          </div>

          <div className="h-28 w-full border border-dashed border-[#00E5FF]/20 rounded-xs flex items-center justify-center relative overflow-hidden bg-black/60">
            {/* Architectural schematic drawing lines */}
            <svg className="w-full h-full text-[#00E5FF]/40" viewBox="0 0 400 100">
              <line x1="20" y1="50" x2="380" y2="50" stroke="currentColor" strokeDasharray="3 3" />
              <line x1="200" y1="10" x2="200" y2="90" stroke="currentColor" strokeDasharray="3 3" />
              <rect x="70" y="25" width="260" height="50" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="200" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="200" cy="50" r="14" fill="none" stroke="#5322FF" strokeWidth="1" />
              <line x1="70" y1="15" x2="330" y2="15" stroke="#00E5FF" strokeWidth="1" />
              <text x="180" y="12" fill="#00E5FF" fontSize="9" fontFamily="monospace">
                260.00 mm ±0.01
              </text>
            </svg>
            <div className="absolute top-2 left-2 text-[9px] text-zinc-500">
              MATERIAL: {component.specs.material}
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] text-emerald-400">
              FINITE ELEMENT STRESS: 42.4 MPa [OPTIMAL]
            </div>
          </div>
        </div>

        {/* Technical Specification Matrix */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4 relative z-10">
          <div className="bg-zinc-950/60 p-2.5 border border-white/5 rounded-xs space-y-1.5">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#00E5FF]" />
              <span>Mechanical Ratings</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-white/5">
              <span className="text-zinc-400">Category:</span>
              <span className="text-white font-medium">{component.category}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-white/5">
              <span className="text-zinc-400">Total Weight:</span>
              <span className="text-white font-medium">{component.specs.weight}</span>
            </div>
            {component.specs.torqueOrForce && (
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-zinc-400">Continuous Torque:</span>
                <span className="text-[#00E5FF] font-medium">{component.specs.torqueOrForce}</span>
              </div>
            )}
            {component.specs.gearRatio && (
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-400">Harmonic Ratio:</span>
                <span className="text-[#5322FF] font-medium">{component.specs.gearRatio}</span>
              </div>
            )}
          </div>

          <div className="bg-zinc-950/60 p-2.5 border border-white/5 rounded-xs space-y-1.5">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Sensory & Precision</span>
            </div>
            {component.specs.precision && (
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-zinc-400">Precision:</span>
                <span className="text-emerald-400 font-medium">{component.specs.precision}</span>
              </div>
            )}
            {component.specs.ipRating && (
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-zinc-400">IP Sealing:</span>
                <span className="text-white font-medium">{component.specs.ipRating}</span>
              </div>
            )}
            {component.specs.sensors && (
              <div className="py-0.5">
                <span className="text-zinc-400 block text-[10px]">Sensory Feedback:</span>
                <span className="text-zinc-200 text-[11px] block mt-0.5">{component.specs.sensors}</span>
              </div>
            )}
          </div>
        </div>

        {/* Functional Description */}
        <div className="text-xs text-zinc-400 mb-5 leading-relaxed bg-black/40 p-3 border border-white/5 rounded-xs relative z-10">
          <span className="text-zinc-200 font-semibold">ENGINEERING OVERVIEW: </span>
          {component.description}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 relative z-10">
          <div className="text-[10px] text-zinc-500">
            VIN DYNAMICS HARMONIC CAD REGISTRY #VD-ENG-2026
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-white/15 hover:border-white/30 text-xs text-zinc-300 hover:text-white rounded-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'COPIED ROS2 TOPIC' : 'COPY ROS2 SPEC'}</span>
            </button>
            <button
              onClick={() => {
                onClose();
                sfx.playTacticalClick(1600, 0.02);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-semibold text-xs rounded-xs transition-colors"
            >
              <span>RESUME INSPECTION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
