import React, { useState } from 'react';
import { RobotArmScene } from '../3d/RobotArmScene';
import { ExplodedControlDock } from '../hud/ExplodedControlDock';
import { ComponentBlueprintModal } from '../hud/ComponentBlueprintModal';
import { MechanicalComponent } from '@/types/telemetry';

export const HeroSection: React.FC = () => {
  const [explodeProgress, setExplodeProgress] = useState(0.0);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'front' | 'side' | 'wrist_focus' | 'top'>('isometric');
  const [selectedComponent, setSelectedComponent] = useState<MechanicalComponent | null>(null);
  const [laserTargetEnabled, setLaserTargetEnabled] = useState(true);

  return (
    <section className="relative w-full h-[100vh] min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#09090B]">
      {/* Background CAD Matrix Pattern */}
      <div className="absolute inset-0 cad-grid-pattern opacity-15 pointer-events-none" />

      {/* Hero Headline Overlay (Non-obstructing Top Banner) */}
      <div className="relative z-10 pt-4 px-6 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 pointer-events-auto">
              <span className="px-2 py-0.5 bg-[#5322FF]/20 border border-[#5322FF]/50 text-[#00E5FF] text-[10px] font-mono-cad font-semibold rounded-xs tracking-wider">
                PHYSICAL AI & ROBOTICS PLANT
              </span>
              <span className="text-[11px] font-mono-cad text-zinc-400">
                SERIES-VD INDUSTRIAL ASSEMBLY
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white uppercase leading-none">
              Robots for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-[#5322FF]">Everyone</span>
            </h1>

            <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-zinc-300 font-mono-cad leading-relaxed">
              Real-time cybernetic factory assembly featuring 11-DOF dexterous hand kinematics, harmonic drive strain wave reducers, and sub-millimeter precision physical AI control.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-2 font-mono-cad text-xs pointer-events-auto">
            <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-sm">
              <div className="text-[9px] text-zinc-400">REPEATABILITY</div>
              <div className="text-[#00E5FF] font-bold">±0.008 mm</div>
            </div>
            <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-sm">
              <div className="text-[9px] text-zinc-400">ACTIVE DOF</div>
              <div className="text-[#5322FF] font-bold">11 DEGREES</div>
            </div>
            <div className="bg-black/80 border border-white/10 px-3 py-1.5 rounded-sm">
              <div className="text-[9px] text-zinc-400">SEALING</div>
              <div className="text-emerald-400 font-bold">IP67 RATED</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene Viewport (100% Unobstructed Center) */}
      <div className="absolute inset-0 z-0">
        <RobotArmScene
          explodeProgress={explodeProgress}
          wireframeMode={wireframeMode}
          autoRotate={autoRotate}
          cameraPreset={cameraPreset}
          onSelectComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
          laserTargetEnabled={laserTargetEnabled}
        />
      </div>

      {/* Floating Bottom Control Dock */}
      <ExplodedControlDock
        explodeProgress={explodeProgress}
        onExplodeChange={setExplodeProgress}
        wireframeMode={wireframeMode}
        onToggleWireframe={() => setWireframeMode((prev) => !prev)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={setCameraPreset}
        laserTargetEnabled={laserTargetEnabled}
        onToggleLaserTarget={() => setLaserTargetEnabled((prev) => !prev)}
      />

      {/* Swiss CAD Blueprint Modal Overlay */}
      <ComponentBlueprintModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </section>
  );
};
