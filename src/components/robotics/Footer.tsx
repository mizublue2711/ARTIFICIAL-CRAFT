import React from 'react';
import { Box, FileText, Shield, Terminal } from 'lucide-react';
import { sfx } from '@/lib/video-engine/robotics/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#09090B] font-mono-cad text-xs text-zinc-400 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Plant Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xs bg-[#5322FF] flex items-center justify-center border border-[#00E5FF]/40">
                <Box className="w-3.5 h-3.5 text-[#00E5FF]" />
              </div>
              <span className="font-bold text-white tracking-widest text-sm font-display uppercase">
                VinDynamics Plant 01
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Next-generation physical AI robotics industrial manufacturing plant. Pioneering high-torque harmonic actuators, 11-DOF dexterous manipulation, and open spatial foundation models under the vision <strong className="text-white">"Robots for Everyone"</strong>.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-zinc-500">
              <span>LAT: 37.7749° N</span>
              <span>•</span>
              <span>LON: 122.4194° W</span>
              <span>•</span>
              <span className="text-emerald-400">STATUS: NOMINAL</span>
            </div>
          </div>

          {/* Col 2: Plant Locations */}
          <div className="space-y-3">
            <div className="text-white font-semibold text-xs tracking-wider uppercase text-[10px] text-[#00E5FF]">
              MANUFACTURING NODES
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-zinc-300">San Francisco, CA (HQ & R&D)</li>
              <li>Munich (Harmonic Precision Core)</li>
              <li>Tokyo (Dexterous Kinematics Lab)</li>
              <li>Singapore (High-Volume Assembly)</li>
            </ul>
          </div>

          {/* Col 3: Hardware Stack */}
          <div className="space-y-3">
            <div className="text-white font-semibold text-xs tracking-wider uppercase text-[10px] text-[#00E5FF]">
              HARDWARE ARCHITECTURE
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>VD-Arm Alpha (7-Axis)</li>
              <li>VD-Hand Mk-IV (11-DOF)</li>
              <li>VD-HD-160 Harmonic Actuator</li>
              <li>VD-Atlas-X Bipedal Unit</li>
              <li>Spatial LiDAR Voxel Stream</li>
            </ul>
          </div>

          {/* Col 4: Open Source & Certs */}
          <div className="space-y-3">
            <div className="text-white font-semibold text-xs tracking-wider uppercase text-[10px] text-[#00E5FF]">
              CERTIFICATIONS & REPO
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5 text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>ISO 9001 / IP67 Rating</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-300">
                <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>ROS2 Humble / Iron API</span>
              </li>
              <li className="flex items-center gap-1.5 text-zinc-300">
                <FileText className="w-3.5 h-3.5 text-[#5322FF]" />
                <span>CAD STEP Schematics (.STEP)</span>
              </li>
              <li className="text-zinc-500">EtherCAT Real-Time Bus</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500">
          <div>
            © 2026 VinDynamics Industrial Systems, Inc. All rights reserved. Slogan "Robots for Everyone".
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="hover:text-white cursor-pointer" onClick={() => sfx.playTacticalClick(1800, 0.02)}>
              TELEMETRY SECURITY POLICY
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => sfx.playTacticalClick(1800, 0.02)}>
              ISO 10218-1 SAFETY STANDARD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
