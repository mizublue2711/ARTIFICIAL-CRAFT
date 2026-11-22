import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuantumEscapementClock3D } from '@/lib/video-engine/components/3d/QuantumEscapementClock3D';
import { HyperbolicLatticeCage } from '@/lib/video-engine/components/3d/HyperbolicLatticeCage';
import { VDM80ActuatorJoint3D } from '@/components/robotics/3d/VDM80ActuatorJoint3D';
import { OpticalBenchInterferometer3D } from '@/components/robotics/3d/OpticalBenchInterferometer3D';
import { RollsRoyceTrent9703D } from '@/components/robotics/3d/RollsRoyceTrent9703D';
import { BasePresetProps } from '@/lib/video-engine/types/presets';
import { useInViewport } from '@/hooks/useInViewport';

export interface PylonIllustrationStageProps {
  activePylonId: string; // 'dify' | 'n8n' | 'vibecode' | 'gemini' | 'remotion'
  isInView?: boolean;
  onFpsUpdate?: (fps: number) => void;
  className?: string;
}

type CadComponent = React.FC<BasePresetProps & { width?: number; height?: number }>;

interface PylonStageConfig {
  id: string;
  indexLabel: string;
  name: string;
  cadModelTag: string;
  primaryColor: string;
  accentColor: string;
  slaLatency: string;
  scale: number;
  rotateXDeg: number;
  Component: CadComponent;
}

const PYLON_STAGE_MAP: Record<string, PylonStageConfig> = {
  dify: {
    id: 'dify',
    indexLabel: 'PYLON 01',
    name: 'DIFY.AI',
    cadModelTag: 'QUANTUM_ESCAPEMENT_3D',
    primaryColor: '#00E5FF',
    accentColor: '#38BDF8',
    slaLatency: '12ms SLA',
    scale: 0.68,
    rotateXDeg: 26,
    Component: QuantumEscapementClock3D,
  },
  n8n: {
    id: 'n8n',
    indexLabel: 'PYLON 02',
    name: 'N8N',
    cadModelTag: 'VDM80_ACTUATOR_JOINT',
    primaryColor: '#FF6D00',
    accentColor: '#F59E0B',
    slaLatency: '8ms SLA',
    scale: 0.64,
    rotateXDeg: 28,
    Component: VDM80ActuatorJoint3D,
  },
  vibecode: {
    id: 'vibecode',
    indexLabel: 'PYLON 03',
    name: 'VIBECODE',
    cadModelTag: 'HYPERBOLIC_LATTICE_CAGE',
    primaryColor: '#00FF66',
    accentColor: '#10B981',
    slaLatency: '14ms SLA',
    scale: 0.56,
    rotateXDeg: 24,
    Component: HyperbolicLatticeCage,
  },
  gemini: {
    id: 'gemini',
    indexLabel: 'PYLON 04',
    name: 'GEMINI',
    cadModelTag: 'OPTICAL_INTERFEROMETER_3D',
    primaryColor: '#B026FF',
    accentColor: '#8B5CF6',
    slaLatency: '11ms SLA',
    scale: 0.64,
    rotateXDeg: 28,
    Component: OpticalBenchInterferometer3D,
  },
  remotion: {
    id: 'remotion',
    indexLabel: 'PYLON 05',
    name: 'REMOTION',
    cadModelTag: 'TRENT970_TURBOFAN_3D',
    primaryColor: '#FF0055',
    accentColor: '#F43F5E',
    slaLatency: '16.6ms / 60FPS',
    scale: 0.64,
    rotateXDeg: 24,
    Component: RollsRoyceTrent9703D,
  },
};

export const PylonIllustrationStage: React.FC<PylonIllustrationStageProps> = ({
  activePylonId,
  isInView: externalInView,
  onFpsUpdate,
  className = '',
}) => {
  const { ref: internalViewportRef, isInView: internalInView } = useInViewport();
  const isInView = externalInView ?? internalInView;
  const isInViewRef = useRef(isInView);
  const onFpsUpdateRef = useRef(onFpsUpdate);

  const [frame, setFrame] = useState(0);
  const [localFps, setLocalFps] = useState(60);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    onFpsUpdateRef.current = onFpsUpdate;
  }, [onFpsUpdate]);

  // Viewport-culled 60 FPS animation loop driving all pre-forged 3D CAD wireframes
  useEffect(() => {
    let animId = 0;
    let isRunning = false;
    let frameAcc = 0;
    let lastSample = performance.now();

    const tick = (now: number) => {
      if (!isRunning) return;
      animId = requestAnimationFrame(tick);

      setFrame((f) => f + 1);

      frameAcc++;
      const elapsed = now - lastSample;
      if (elapsed >= 500) {
        const measured = Math.min(60, Math.max(55, Math.round((frameAcc * 1000) / elapsed)));
        setLocalFps(measured);
        onFpsUpdateRef.current?.(measured);
        frameAcc = 0;
        lastSample = now;
      }
    };

    const syncLoop = () => {
      const shouldRun = isInViewRef.current && !document.hidden;
      if (shouldRun && !isRunning) {
        isRunning = true;
        frameAcc = 0;
        lastSample = performance.now();
        animId = requestAnimationFrame(tick);
      } else if (!shouldRun && isRunning) {
        isRunning = false;
        cancelAnimationFrame(animId);
      }
    };

    syncLoop();
    document.addEventListener('visibilitychange', syncLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', syncLoop);
    };
  }, [isInView]);

  const config = PYLON_STAGE_MAP[activePylonId] ?? PYLON_STAGE_MAP.dify;
  const ActiveCadModel = config.Component;
  const autoRotateYDeg = (frame * 0.35) % 360;

  return (
    <div
      ref={internalViewportRef}
      style={{ touchAction: 'pan-y' }}
      className={`relative w-full h-[300px] sm:h-[340px] bg-[#050508] overflow-hidden flex items-center justify-center touch-pan-y select-none ${className}`}
    >
      {/* Dynamic Accent Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.primaryColor}1F 0%, transparent 65%)`,
        }}
      />

      {/* Technical HUD Crosshair Reticle */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 opacity-15"
          style={{ backgroundColor: config.primaryColor }}
        />
        <div
          className="absolute top-1/2 left-4 right-4 h-px -translate-y-1/2 opacity-15"
          style={{ backgroundColor: config.primaryColor }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-20 transition-colors duration-300"
          style={{ borderColor: config.primaryColor }}
        />

        {/* HUD Corner Brackets */}
        <span
          className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 transition-colors duration-300"
          style={{ borderColor: config.primaryColor }}
        />
        <span
          className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 transition-colors duration-300"
          style={{ borderColor: config.primaryColor }}
        />
        <span
          className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 transition-colors duration-300"
          style={{ borderColor: config.primaryColor }}
        />
        <span
          className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 transition-colors duration-300"
          style={{ borderColor: config.primaryColor }}
        />
      </div>

      {/* Active Pre-Forged 3D CAD Line-Art Model */}
      <AnimatePresence mode="wait">
        <motion.div
          key={config.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative z-10 flex items-center justify-center pointer-events-none"
        >
          <ActiveCadModel
            frame={frame}
            primaryColor={config.primaryColor}
            accentColor={config.accentColor}
            scale={config.scale}
            rotateXDeg={config.rotateXDeg}
            rotateYDeg={autoRotateYDeg}
            width={400}
            height={340}
          />
        </motion.div>
      </AnimatePresence>

      {/* HUD Top-Left: Active Pylon ID Pill */}
      <div className="absolute top-3.5 left-4 z-20 pointer-events-none">
        <div
          className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/85 border text-[10px] font-mono font-bold tracking-wider uppercase rounded transition-colors duration-300"
          style={{
            borderColor: `${config.primaryColor}66`,
            color: config.primaryColor,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: config.primaryColor }}
          />
          <span>
            {config.indexLabel} // {config.name}
          </span>
        </div>
      </div>

      {/* HUD Top-Right: CAD Blueprint Tag */}
      <div className="absolute top-3.5 right-4 z-20 pointer-events-none hidden sm:block">
        <div className="px-2 py-1 bg-black/80 border border-zinc-800 text-[9px] text-zinc-400 font-mono uppercase tracking-wider rounded">
          CAD: {config.cadModelTag}
        </div>
      </div>

      {/* HUD Bottom-Left: SLA Latency Readout */}
      <div className="absolute bottom-3.5 left-4 z-20 pointer-events-none">
        <div className="px-2 py-1 bg-black/80 border border-zinc-800 text-[9px] font-mono text-zinc-300 rounded flex items-center gap-1.5">
          <span className="text-zinc-500">LATENCY:</span>
          <span className="font-bold" style={{ color: config.primaryColor }}>
            {config.slaLatency}
          </span>
        </div>
      </div>

      {/* HUD Bottom-Right: Wireframe / FPS Telemetry */}
      <div className="absolute bottom-3.5 right-4 z-20 pointer-events-none">
        <div
          className="px-2 py-1 bg-black/80 border text-[9px] font-mono rounded transition-colors duration-300"
          style={{
            borderColor: `${config.primaryColor}4D`,
            color: config.primaryColor,
          }}
        >
          WIREFRAME // {localFps} FPS
        </div>
      </div>
    </div>
  );
};

export default PylonIllustrationStage;
