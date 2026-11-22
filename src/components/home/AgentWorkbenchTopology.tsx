import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Activity, Cpu, Move, RotateCcw } from 'lucide-react';
import { QuantumEscapementClock3D } from '@/lib/video-engine/components/3d/QuantumEscapementClock3D';
import { HyperbolicLatticeCage } from '@/lib/video-engine/components/3d/HyperbolicLatticeCage';
import { VDM80ActuatorJoint3D } from '@/components/robotics/3d/VDM80ActuatorJoint3D';
import { OpticalBenchInterferometer3D } from '@/components/robotics/3d/OpticalBenchInterferometer3D';
import { RollsRoyceTrent9703D } from '@/components/robotics/3d/RollsRoyceTrent9703D';
import { BasePresetProps } from '@/lib/video-engine/types/presets';

export interface TopologyNode {
  id: 'dify' | 'n8n' | 'vibecode' | 'gemini' | 'remotion';
  label: string;
  subLabel: string;
  color: string;
  accentColor: string;
  initialPos: { xPercent: number; yPercent: number };
  connections: Array<'dify' | 'n8n' | 'vibecode' | 'gemini' | 'remotion'>;
  cadModelId: string;
  indexLabel: string;
  role: string;
  throughput: string;
  slaLatency: string;
  cadScale: number;
  rotateXDeg: number;
}

type CadComponent = React.FC<BasePresetProps & { width?: number; height?: number }>;

const CAD_MODEL_REGISTRY: Record<string, CadComponent> = {
  QUANTUM_ESCAPEMENT_3D: QuantumEscapementClock3D,
  VDM80_ACTUATOR_JOINT: VDM80ActuatorJoint3D,
  HYPERBOLIC_LATTICE_CAGE: HyperbolicLatticeCage,
  OPTICAL_INTERFEROMETER_3D: OpticalBenchInterferometer3D,
  TRENT970_TURBOFAN_3D: RollsRoyceTrent9703D,
};

export const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'dify',
    label: 'DIFY.AI',
    subLabel: 'Reasoning Hub',
    color: '#00E5FF',
    accentColor: '#38BDF8',
    initialPos: { xPercent: 15, yPercent: 48 },
    connections: ['n8n', 'gemini'],
    cadModelId: 'QUANTUM_ESCAPEMENT_3D',
    indexLabel: 'NODE 01',
    role: 'RAG & Agentic Pipeline Orchestrator',
    throughput: 'PIPELINE: ACTIVE',
    slaLatency: '12ms SLA',
    cadScale: 0.34,
    rotateXDeg: 26,
  },
  {
    id: 'n8n',
    label: 'N8N',
    subLabel: 'Muscle',
    color: '#FF9500',
    accentColor: '#F59E0B',
    initialPos: { xPercent: 43, yPercent: 22 },
    connections: ['vibecode'],
    cadModelId: 'VDM80_ACTUATOR_JOINT',
    indexLabel: 'NODE 02',
    role: 'Deterministic Webhook & State Machine',
    throughput: 'SCHEMA: VALIDATED',
    slaLatency: '8ms SLA',
    cadScale: 0.32,
    rotateXDeg: 28,
  },
  {
    id: 'gemini',
    label: 'GEMINI',
    subLabel: 'Router',
    color: '#B026FF',
    accentColor: '#A855F7',
    initialPos: { xPercent: 43, yPercent: 76 },
    connections: ['vibecode', 'remotion'],
    cadModelId: 'OPTICAL_INTERFEROMETER_3D',
    indexLabel: 'NODE 03',
    role: 'Multimodal High-Throughput Router',
    throughput: 'RUNTIME: CLIENT GPU',
    slaLatency: '11ms SLA',
    cadScale: 0.32,
    rotateXDeg: 28,
  },
  {
    id: 'vibecode',
    label: 'VIBECODE',
    subLabel: 'Swarm',
    color: '#00FF66',
    accentColor: '#10B981',
    initialPos: { xPercent: 69, yPercent: 34 },
    connections: ['remotion'],
    cadModelId: 'HYPERBOLIC_LATTICE_CAGE',
    indexLabel: 'NODE 04',
    role: 'Full-Stack Synthesis & Real-Time Code Gen',
    throughput: 'ARCH: MODULAR',
    slaLatency: '14ms SLA',
    cadScale: 0.28,
    rotateXDeg: 24,
  },
  {
    id: 'remotion',
    label: 'REMOTION',
    subLabel: 'Compiler',
    color: '#5322ff', // Deep Cyber Violet
    accentColor: '#7C5CFF',
    initialPos: { xPercent: 86, yPercent: 68 },
    connections: [],
    cadModelId: 'TRENT970_TURBOFAN_3D',
    indexLabel: 'NODE 05',
    role: 'Programmatic Video & Motion Compiler',
    throughput: 'ENGINE: 3D WIREFRAME',
    slaLatency: '16.6ms / 60FPS',
    cadScale: 0.32,
    rotateXDeg: 24,
  },
];

interface EdgeDefinition {
  id: string;
  sourceId: TopologyNode['id'];
  targetId: TopologyNode['id'];
  sourceColor: string;
  targetColor: string;
}

const TOPOLOGY_EDGES: EdgeDefinition[] = TOPOLOGY_NODES.flatMap((source) =>
  source.connections.map((targetId) => {
    const target = TOPOLOGY_NODES.find((n) => n.id === targetId)!;
    return {
      id: `${source.id}->${targetId}`,
      sourceId: source.id,
      targetId,
      sourceColor: source.color,
      targetColor: target.color,
    };
  })
);

interface Point {
  x: number;
  y: number;
}

interface DraggableTopologyNodeProps {
  node: TopologyNode;
  index: number;
  baseCenter: Point;
  frame: number;
  isHovered: boolean;
  isDimmed: boolean;
  isDragging: boolean;
  canvasSize: { width: number; height: number };
  resetSignal: number;
  onHoverStart: (id: TopologyNode['id']) => void;
  onHoverEnd: (id: TopologyNode['id']) => void;
  onDragStartNode: (id: TopologyNode['id']) => void;
  onDragMoveNode: (id: TopologyNode['id'], offset: Point) => void;
  onDragEndNode: (id: TopologyNode['id'], offset: Point) => void;
}

const DraggableTopologyNode: React.FC<DraggableTopologyNodeProps> = React.memo(
  ({
    node,
    index,
    baseCenter,
    frame,
    isHovered,
    isDimmed,
    isDragging,
    canvasSize,
    resetSignal,
    onHoverStart,
    onHoverEnd,
    onDragStartNode,
    onDragMoveNode,
    onDragEndNode,
  }) => {
    const mvX = useMotionValue(0);
    const mvY = useMotionValue(0);

    // Sync exact rendered MotionValues (x, y) to parent cable endpoints on every frame
    useEffect(() => {
      const unsubX = mvX.on('change', (latestX) => {
        onDragMoveNode(node.id, { x: latestX, y: mvY.get() });
      });
      const unsubY = mvY.on('change', (latestY) => {
        onDragMoveNode(node.id, { x: mvX.get(), y: latestY });
      });
      return () => {
        unsubX();
        unsubY();
      };
    }, [mvX, mvY, node.id, onDragMoveNode]);

    // Smoothly reset dragged node position when resetSignal increments
    useEffect(() => {
      if (resetSignal === 0) return;
      const ctrlX = animate(mvX, 0, {
        type: 'spring',
        stiffness: 260,
        damping: 26,
      });
      const ctrlY = animate(mvY, 0, {
        type: 'spring',
        stiffness: 260,
        damping: 26,
      });
      return () => {
        ctrlX.stop();
        ctrlY.stop();
      };
    }, [resetSignal, mvX, mvY]);

    const CadModel = CAD_MODEL_REGISTRY[node.cadModelId] ?? QuantumEscapementClock3D;
    const autoRotateYDeg = (frame * 0.55 + index * 48) % 360;

    const dragConstraints = useMemo(
      () => ({
        left: -(baseCenter.x - 105),
        right: canvasSize.width - baseCenter.x - 105,
        top: -(baseCenter.y - 95),
        bottom: canvasSize.height - baseCenter.y - 95,
      }),
      [baseCenter.x, baseCenter.y, canvasSize.width, canvasSize.height]
    );

    return (
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.06}
        dragConstraints={dragConstraints}
        onDragStart={() => onDragStartNode(node.id)}
        onDragEnd={() => {
          onDragEndNode(node.id, { x: mvX.get(), y: mvY.get() });
        }}
        onMouseEnter={() => onHoverStart(node.id)}
        onMouseLeave={() => onHoverEnd(node.id)}
        style={{
          left: baseCenter.x,
          top: baseCenter.y,
          x: mvX,
          y: mvY,
          zIndex: isDragging ? 40 : isHovered ? 30 : 15,
          '--glow': node.color,
        } as React.CSSProperties}
        data-topology-node={node.id}
        className="absolute cursor-grab active:cursor-grabbing select-none"
      >
        {/* Center the node card on (baseCenter + dragOffset) without colliding with Framer Motion's x/y transform */}
        <div className="-translate-x-1/2 -translate-y-1/2">
          {/* Subtle idle floating drift wrapper */}
          <motion.div
            animate={
              isDragging || isHovered
                ? { y: 0, scale: isHovered ? 1.05 : 1, opacity: 1 }
                : {
                    y: [0, -5, 0, 4, 0],
                    scale: 1,
                    opacity: isDimmed ? 0.35 : 1,
                  }
            }
            transition={
              isDragging || isHovered
                ? { duration: 0.22, ease: 'easeOut' }
                : {
                    y: {
                      duration: 5.2 + index * 0.7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    opacity: { duration: 0.22, ease: 'easeOut' },
                    scale: { duration: 0.22, ease: 'easeOut' },
                  }
            }
            className={`relative w-[188px] sm:w-[218px] rounded-xl border font-mono transition-[border-color,background-color,box-shadow,filter] duration-200 ${
              isHovered
                ? 'bg-[#090A14]/95 drop-shadow-[0_0_25px_var(--glow)]'
                : isDimmed
                ? 'bg-[#05050A]/55 border-dashed'
                : 'bg-[#080911]/92'
            }`}
            style={{
              borderColor: isHovered
                ? node.color
                : isDimmed
                ? `${node.color}40`
                : `${node.color}55`,
              boxShadow: isHovered
                ? `0 0 28px ${node.color}38, inset 0 0 18px ${node.color}18`
                : isDimmed
                ? 'none'
                : `0 8px 28px rgba(0,0,0,0.65), 0 0 12px ${node.color}14`,
            }}
          >
            {/* Corner HUD Brackets */}
            <span
              className="pointer-events-none absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 rounded-tl"
              style={{ borderColor: isDimmed ? `${node.color}4D` : node.color }}
            />
            <span
              className="pointer-events-none absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 rounded-tr"
              style={{ borderColor: isDimmed ? `${node.color}4D` : node.color }}
            />
            <span
              className="pointer-events-none absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 rounded-bl"
              style={{ borderColor: isDimmed ? `${node.color}4D` : node.color }}
            />
            <span
              className="pointer-events-none absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 rounded-br"
              style={{ borderColor: isDimmed ? `${node.color}4D` : node.color }}
            />

            {/* Compact Header Bar */}
            <div className="px-3 py-2 border-b border-zinc-800/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: node.color,
                      boxShadow: isHovered ? `0 0 10px ${node.color}` : 'none',
                    }}
                  />
                  <span className="text-xs font-extrabold tracking-wider text-white truncate">
                    {node.label}
                  </span>
                </div>
                <span
                  className="block text-[9px] uppercase tracking-widest mt-0.5 truncate"
                  style={{ color: isDimmed ? '#71717a' : node.accentColor }}
                >
                  {node.subLabel}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-zinc-500 shrink-0">
                <Move className="w-3 h-3 opacity-60" />
                <span>{node.indexLabel.replace('NODE ', '0')}</span>
              </div>
            </div>

            {/* 3D Line-Art CAD Preview Stage */}
            <div className="relative h-[96px] sm:h-[106px] w-full overflow-hidden flex items-center justify-center pointer-events-none">
              <div
                className="absolute inset-0 opacity-25 transition-opacity duration-200"
                style={{
                  opacity: isHovered ? 0.45 : isDimmed ? 0.08 : 0.22,
                  background: `radial-gradient(circle at 50% 50%, ${node.color}33 0%, transparent 70%)`,
                }}
              />
              <CadModel
                frame={frame}
                primaryColor={node.color}
                accentColor={node.accentColor}
                scale={node.cadScale}
                rotateXDeg={node.rotateXDeg}
                rotateYDeg={autoRotateYDeg}
                width={186}
                height={102}
              />
            </div>

            {/* Compact Footer / Expanded Telemetry Readout on Hover */}
            <div className="px-3 py-2 border-t border-zinc-800/80 bg-[#05050A]/80 rounded-b-xl">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-zinc-500 uppercase tracking-wider">LATENCY</span>
                <span className="font-bold" style={{ color: node.color }}>
                  {node.slaLatency}
                </span>
              </div>

              {/* Dimensional Shift: Reveal Full Telemetry Readouts on Hover */}
              <motion.div
                initial={false}
                animate={{
                  height: isHovered ? 'auto' : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="pt-2 mt-2 border-t border-zinc-800/70 space-y-1.5 text-[10px]">
                  <p className="text-zinc-300 font-sans leading-snug">{node.role}</p>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500">CAD</span>
                    <span className="text-zinc-300 truncate max-w-[130px]">{node.cadModelId}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500">STATUS</span>
                    <span className="font-bold" style={{ color: node.color }}>
                      [ {node.throughput} ]
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500">OUTBOUND</span>
                    <span className="text-zinc-200 font-bold">
                      {node.connections.length > 0
                        ? node.connections.map((c) => c.toUpperCase()).join(' · ')
                        : 'TERMINAL SINK'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

DraggableTopologyNode.displayName = 'DraggableTopologyNode';

export interface AgentWorkbenchTopologyProps {
  isInView?: boolean;
  onFpsUpdate?: (fps: number) => void;
}

export const AgentWorkbenchTopology: React.FC<AgentWorkbenchTopologyProps> = ({
  isInView = true,
  onFpsUpdate,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 1120,
    height: 700,
  });

  const [hoveredNodeId, setHoveredNodeId] = useState<TopologyNode['id'] | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<TopologyNode['id'] | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<string, Point>>({
    dify: { x: 0, y: 0 },
    n8n: { x: 0, y: 0 },
    gemini: { x: 0, y: 0 },
    vibecode: { x: 0, y: 0 },
    remotion: { x: 0, y: 0 },
  });
  const [resetSignal, setResetSignal] = useState(0);
  const [frame, setFrame] = useState(0);
  const [localFps, setLocalFps] = useState(60);

  const isInViewRef = useRef(isInView);
  const onFpsUpdateRef = useRef(onFpsUpdate);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    onFpsUpdateRef.current = onFpsUpdate;
  }, [onFpsUpdate]);

  // Measure canvas container responsively via ResizeObserver
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Viewport-culled animation loop driving all 5 3D CAD wireframes smoothly
  useEffect(() => {
    let animId = 0;
    let isRunning = false;
    let frameAcc = 0;
    let lastSample = performance.now();
    let lastRender = performance.now();

    const tick = (now: number) => {
      if (!isRunning) return;
      animId = requestAnimationFrame(tick);

      frameAcc++;
      // Throttle SVG CAD wireframe redraws to ~30Hz for zero-lag drag responsiveness
      if (now - lastRender >= 32) {
        setFrame((f) => f + 1);
        lastRender = now;
      }

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
        lastRender = performance.now();
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

  // Base center positions from relative percentages, clamped cleanly within canvas bounds
  const baseCenters = useMemo(() => {
    const padX = Math.min(115, canvasSize.width * 0.14);
    const padY = 105;
    const map: Record<string, Point> = {};

    for (const node of TOPOLOGY_NODES) {
      const rawX = (node.initialPos.xPercent / 100) * canvasSize.width;
      const rawY = (node.initialPos.yPercent / 100) * canvasSize.height;
      map[node.id] = {
        x: Math.max(padX, Math.min(canvasSize.width - padX, rawX)),
        y: Math.max(padY, Math.min(canvasSize.height - padY, rawY)),
      };
    }
    return map;
  }, [canvasSize.width, canvasSize.height]);

  // Live center coordinates = baseCenter + dragOffset
  const liveCenters = useMemo(() => {
    const map: Record<string, Point> = {};
    for (const node of TOPOLOGY_NODES) {
      const base = baseCenters[node.id];
      const offset = dragOffsets[node.id] ?? { x: 0, y: 0 };
      map[node.id] = {
        x: base.x + offset.x,
        y: base.y + offset.y,
      };
    }
    return map;
  }, [baseCenters, dragOffsets]);

  const handleHoverStart = useCallback((id: TopologyNode['id']) => {
    setHoveredNodeId(id);
  }, []);

  const handleHoverEnd = useCallback((id: TopologyNode['id']) => {
    setHoveredNodeId((prev) => (prev === id ? null : prev));
  }, []);

  const handleDragStartNode = useCallback((id: TopologyNode['id']) => {
    setDraggingNodeId(id);
    setHoveredNodeId(id);
  }, []);

  const handleDragMoveNode = useCallback((id: TopologyNode['id'], offset: Point) => {
    setDragOffsets((prev) => {
      const curr = prev[id];
      if (curr && curr.x === offset.x && curr.y === offset.y) return prev;
      return { ...prev, [id]: offset };
    });
  }, []);

  const handleDragEndNode = useCallback((id: TopologyNode['id'], offset: Point) => {
    setDraggingNodeId((prev) => (prev === id ? null : prev));
    setDragOffsets((prev) => ({ ...prev, [id]: offset }));
  }, []);

  const handleResetLayout = useCallback(() => {
    setResetSignal((s) => s + 1);
  }, []);

  const hasDraggedAny = useMemo(
    () => Object.values(dragOffsets).some((o) => Math.abs(o.x) > 2 || Math.abs(o.y) > 2),
    [dragOffsets]
  );

  const activeNode = useMemo(
    () => TOPOLOGY_NODES.find((n) => n.id === (draggingNodeId ?? hoveredNodeId)) ?? null,
    [draggingNodeId, hoveredNodeId]
  );

  const focusNodeId = draggingNodeId ?? hoveredNodeId;

  return (
    <div
      ref={canvasRef}
      data-testid="agent-workbench-topology"
      className="min-h-[620px] lg:h-[700px] w-full relative overflow-visible border border-zinc-900 bg-[#05050A] bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl font-mono"
    >
      {/* Subtle Ambient Corner Radials */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            'radial-gradient(circle at 16% 48%, rgba(0,229,255,0.07) 0%, transparent 45%), radial-gradient(circle at 84% 66%, rgba(83,34,255,0.10) 0%, transparent 45%)',
        }}
      />

      {/* Top HUD Bar */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#090912]/90 border border-zinc-800 rounded text-[10px] text-zinc-300 uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>SWARM TOPOLOGY // 5-NODE MESH</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">
            {activeNode
              ? `FOCUS: ${activeNode.label} (${activeNode.subLabel.toUpperCase()})`
              : 'HOVER TO INSPECT · DRAG NODES TO REWIRE'}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {hasDraggedAny && (
            <button
              type="button"
              onClick={handleResetLayout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Reset Graph</span>
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#090912]/90 border border-zinc-800 rounded text-[10px] text-emerald-400 font-bold">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>{localFps} FPS</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Cubic Bézier Cable Layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="topology-cable-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {TOPOLOGY_EDGES.map((edge) => {
            const p1 = liveCenters[edge.sourceId];
            const p2 = liveCenters[edge.targetId];
            return (
              <linearGradient
                key={`grad-${edge.id}`}
                id={`grad-${edge.id}`}
                gradientUnits="userSpaceOnUse"
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
              >
                <stop offset="0%" stopColor={edge.sourceColor} />
                <stop offset="100%" stopColor={edge.targetColor} />
              </linearGradient>
            );
          })}
        </defs>

        {TOPOLOGY_EDGES.map((edge, edgeIdx) => {
          const p1 = liveCenters[edge.sourceId];
          const p2 = liveCenters[edge.targetId];
          const x1 = p1.x;
          const y1 = p1.y;
          const x2 = p2.x;
          const y2 = p2.y;
          const midX = (x1 + x2) / 2;
          const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

          const isEdgeActive =
            focusNodeId !== null &&
            (edge.sourceId === focusNodeId || edge.targetId === focusNodeId);
          const isEdgeDimmed = focusNodeId !== null && !isEdgeActive;

          const activeColor =
            focusNodeId === edge.targetId ? edge.targetColor : edge.sourceColor;
          const pulseDur = isEdgeActive ? '1.05s' : `${2.7 + (edgeIdx % 3) * 0.45}s`;
          const secondaryDur = isEdgeActive ? '1.05s' : `${2.7 + (edgeIdx % 3) * 0.45}s`;

          return (
            <g
              key={edge.id}
              data-edge-id={edge.id}
              style={{
                opacity: isEdgeDimmed ? 0.16 : 1,
                transition: 'opacity 200ms ease',
              }}
            >
              {/* Base Hairline Cable */}
              <path
                data-cable-path={edge.id}
                d={d}
                fill="none"
                stroke={isEdgeActive ? activeColor : '#27272a'}
                strokeWidth={isEdgeActive ? 2.2 : 1.35}
                strokeOpacity={isEdgeActive ? 0.85 : 0.9}
                filter={isEdgeActive ? 'url(#topology-cable-glow)' : undefined}
              />

              {/* Subtle Gradient Accent Overlay */}
              <path
                d={d}
                fill="none"
                stroke={`url(#grad-${edge.id})`}
                strokeWidth={isEdgeActive ? 1.8 : 1}
                strokeOpacity={isEdgeActive ? 0.95 : 0.35}
                strokeDasharray={isEdgeActive ? '6 6' : '3 9'}
              >
                {isInView && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="48"
                    to="0"
                    dur={isEdgeActive ? '0.65s' : '2.4s'}
                    repeatCount="indefinite"
                  />
                )}
              </path>

              {/* Endpoint Anchor Dots */}
              <circle
                cx={x1}
                cy={y1}
                r={isEdgeActive ? 4 : 2.5}
                fill={edge.sourceColor}
                fillOpacity={isEdgeActive ? 1 : 0.55}
              />
              <circle
                cx={x2}
                cy={y2}
                r={isEdgeActive ? 4 : 2.5}
                fill={edge.targetColor}
                fillOpacity={isEdgeActive ? 1 : 0.55}
              />

              {/* Pulse Particle 1 */}
              {isInView && (
                <circle
                  r={isEdgeActive ? 4.2 : 2.6}
                  fill={isEdgeActive ? activeColor : edge.sourceColor}
                  filter="url(#topology-cable-glow)"
                >
                  <animateMotion
                    dur={pulseDur}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              )}

              {/* Pulse Particle 2 (Staggered Half-Cycle) */}
              {isInView && (
                <circle
                  r={isEdgeActive ? 3.2 : 2}
                  fill={isEdgeActive ? '#ffffff' : edge.targetColor}
                  fillOpacity={isEdgeActive ? 0.95 : 0.75}
                >
                  <animateMotion
                    dur={secondaryDur}
                    begin={isEdgeActive ? '-0.52s' : '-1.4s'}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* 5 Draggable Interactive Nodes */}
      {TOPOLOGY_NODES.map((node, index) => {
        const isHovered = focusNodeId === node.id;
        const isDimmed = focusNodeId !== null && focusNodeId !== node.id;
        return (
          <DraggableTopologyNode
            key={node.id}
            node={node}
            index={index}
            baseCenter={baseCenters[node.id]}
            frame={frame}
            isHovered={isHovered}
            isDimmed={isDimmed}
            isDragging={draggingNodeId === node.id}
            canvasSize={canvasSize}
            resetSignal={resetSignal}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onDragStartNode={handleDragStartNode}
            onDragMoveNode={handleDragMoveNode}
            onDragEndNode={handleDragEndNode}
          />
        );
      })}

      {/* Bottom Legend Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[10px] text-zinc-500">
        <div className="flex flex-wrap items-center gap-3">
          {TOPOLOGY_NODES.map((node) => (
            <span key={node.id} className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <span className={focusNodeId === node.id ? 'text-white font-bold' : 'text-zinc-400'}>
                {node.label}
              </span>
            </span>
          ))}
        </div>
        <span className="hidden md:inline uppercase tracking-wider text-zinc-600">
          BEZIER DATA BUS · ZERO CLOUD RENDER FEE
        </span>
      </div>
    </div>
  );
};

export default AgentWorkbenchTopology;
