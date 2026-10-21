import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Webhook,
  MessageCircle,
  Slack,
  Users,
  Activity,
  Zap,
  ChevronRight,
  Link2,
  Play,
  X,
  CheckCircle2,
  Cpu,
  Terminal,
} from 'lucide-react';
import { WORKFLOW_MODES, type WorkflowMode } from '@/lib/data';
import ParticleCanvas from '@/components/ParticleCanvas';
import ThreeHookCanvas from '@/components/ThreeHookCanvas';

const STUDIO_URL = 'https://dify-n8n-workflow.ai.studio/';
const ELECTRIC_PURPLE = '#5322ff';
const ELECTRIC_CYAN = '#00E5FF';

const PRESETS = [
  { label: 'Swiss Design System SKU', url: 'https://craft.code/air-jordan-1-2024' },
  { label: 'Brutalist Pitchdeck PDF', url: 'https://docs.artcraft.io/pitchdeck.pdf' },
  { label: 'Deterministic Financial Index', url: 'https://reports.artcraft.io/q4-annual.pdf' },
];

type NodeDef = {
  id: string;
  label: string;
  sub: string;
  icon: typeof Brain;
  type: 'dify' | 'n8n';
  x: number;
  y: number;
};

const baseNodes: NodeDef[] = [
  { id: 'webhook', label: 'Webhook', sub: 'trigger.start', icon: Webhook, type: 'n8n', x: 80, y: 60 },
  { id: 'brain', label: 'Dify Agent', sub: 'reasoning.core', icon: Brain, type: 'dify', x: 380, y: 180 },
  { id: 'process', label: 'AI Processing', sub: 'transform.pipeline', icon: Activity, type: 'n8n', x: 680, y: 60 },
  { id: 'out1', label: 'Telegram', sub: 'channel.out', icon: MessageCircle, type: 'n8n', x: 940, y: 20 },
  { id: 'out2', label: 'Slack', sub: 'channel.out', icon: Slack, type: 'n8n', x: 940, y: 120 },
  { id: 'out3', label: 'CRM', sub: 'channel.out', icon: Users, type: 'n8n', x: 940, y: 220 },
];

function nodeById(id: string) {
  return baseNodes.find((n) => n.id === id)!;
}

function accentColor(accent: 'cyan' | 'purple') {
  return accent === 'cyan' ? ELECTRIC_CYAN : ELECTRIC_PURPLE;
}

function MetricRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="text-[12px] text-zinc-400">{label}</span>
      <span className="ml-auto text-[13px] font-bold text-white">{value}</span>
    </div>
  );
}

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const mode: WorkflowMode = WORKFLOW_MODES[activeIdx];
  const accent = accentColor(mode.accent);

  const [simState, setSimState] = useState<'idle' | 'running' | 'done'>('idle');
  const [activeNodeIdx, setActiveNodeIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [simUrl, setSimUrl] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const simRafRef = useRef<number | null>(null);

  const outputNodes = useMemo(() => {
    return mode.outputs.map((o, i) => ({
      ...o,
      id: `out${i + 1}`,
      x: 940,
      y: 20 + i * 100,
    }));
  }, [mode]);

  const renderNodes: NodeDef[] = useMemo(() => {
    return [
      baseNodes[0],
      baseNodes[1],
      baseNodes[2],
      ...outputNodes.map((o) => ({
        id: o.id,
        label: o.label,
        sub: o.sub,
        icon: o.icon,
        type: 'n8n' as const,
        x: o.x,
        y: o.y,
      })),
    ];
  }, [outputNodes]);

  const renderEdges: [string, string][] = useMemo(() => {
    return [
      ['webhook', 'brain'],
      ['brain', 'process'],
      ...outputNodes.map((o) => ['process', o.id] as [string, string]),
    ];
  }, [outputNodes]);

  const nodeIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    renderNodes.forEach((n, i) => {
      map[n.id] = i;
    });
    return map;
  }, [renderNodes]);

  const cancelSim = useCallback(() => {
    if (simRafRef.current !== null) {
      cancelAnimationFrame(simRafRef.current);
      simRafRef.current = null;
    }
  }, []);

  const runSimulation = useCallback(() => {
    cancelSim();
    setShowMetrics(false);
    setSimState('running');
    setProgress(0);
    setActiveNodeIdx(0);

    const startTime = performance.now();
    const duration = 2800;
    const nodeCount = renderNodes.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      setActiveNodeIdx(pct < 1 ? Math.min(Math.floor(pct * nodeCount), nodeCount - 1) : -1);

      if (pct < 1) {
        simRafRef.current = requestAnimationFrame(tick);
      } else {
        setSimState('done');
        setShowMetrics(true);
        setActiveNodeIdx(-1);
        simRafRef.current = null;
      }
    };
    simRafRef.current = requestAnimationFrame(tick);
  }, [renderNodes, cancelSim]);

  useEffect(() => () => cancelSim(), [cancelSim]);

  const handlePreset = (preset: (typeof PRESETS)[0]) => {
    setSimUrl(preset.url);
    setActivePreset(preset.label);
    runSimulation();
  };

  const isSimulating = simState === 'running';

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#09090b]" id="platform">
      {/* Background Particle Canvas */}
      <ParticleCanvas className="absolute inset-0 opacity-25 pointer-events-none" />

      {/* Grid background overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top Telemetry / Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2.5 border border-zinc-800 bg-zinc-950/80 px-3.5 py-1.5 font-mono text-[11px] text-zinc-300 tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#5322ff] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
            </span>
            <span className="text-zinc-500 uppercase">SYS//TELEMETRY:</span>
            <span className="text-white font-bold">14 REGIONS ONLINE</span>
            <span className="text-zinc-600">|</span>
            <span className="text-cyan-glow font-semibold">99.99% DETERMINISTIC SLA</span>
          </div>
        </motion.div>

        {/* Hero split layout with 3D Hook Canvas */}
        <div className="mt-8 grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Copy & CTAs */}
          <div className="lg:col-span-7 text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan-glow border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 mb-4">
                <span>CRAFT//CODE</span>
                <span>•</span>
                <span>METICULOUS GRAPHIC PRECISION MEETS CODE AUTOMATION</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.02] uppercase font-mono">
                ARTIFICIAL
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-white to-[#5322ff]">
                  CRAFT
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 text-[16px] sm:text-[18px] leading-relaxed text-zinc-300 font-sans max-w-xl border-l-2 border-[#5322ff] pl-4"
            >
              Where Meticulous Graphic Design Meets Deterministic AI Automation. Unifying Dify Reasoning & n8n Orchestration.
            </motion.p>

            {/* Brutalist CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono"
            >
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3.5 text-white transition-all duration-300 bg-zinc-950 hover:bg-[#5322ff]"
                style={{
                  border: '1px solid #5322ff',
                  boxShadow: '0 0 16px 2px rgba(83, 34, 255, 0.5)',
                }}
              >
                <Terminal className="h-4 w-4 text-cyan-glow" />
                <span>Launch Autopilot Studio</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#blueprints"
                className="inline-flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900 text-sm font-semibold text-zinc-300 px-5 py-3.5 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                EXPLORE BLUEPRINTS
              </a>
            </motion.div>
          </div>

          {/* Right Column: 3D Three.js Interactive Hook Canvas */}
          <div className="lg:col-span-5 relative h-[320px] sm:h-[400px] border border-zinc-800 bg-zinc-950/80 overflow-hidden group">
            {/* Corner Brutalist Frame Accents */}
            <div className="absolute top-2 left-2 z-10 font-mono text-[9px] text-zinc-500 uppercase tracking-widest bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
              3D_HOOK//PARALLAX
            </div>
            <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-cyan-glow bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
              60FPS INTERACTIVE
            </div>
            <div className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-zinc-500">
              POS [X: MOUSE, Y: MOUSE]
            </div>

            <ThreeHookCanvas className="w-full h-full" />
          </div>
        </div>

        {/* Simulation Control Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-12 mx-auto max-w-3xl font-mono"
        >
          <div className="border border-zinc-800 bg-zinc-950 p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 border border-zinc-800 bg-[#09090b] px-3 py-2">
              <Link2 className="h-4 w-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={simUrl}
                onChange={(e) => {
                  setSimUrl(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="Paste endpoint or URL to trigger workflow..."
                className="bg-transparent text-[12px] text-zinc-200 placeholder-zinc-600 outline-none flex-1 font-mono min-w-0"
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="inline-flex items-center justify-center gap-2 border border-[#5322ff] bg-[#5322ff]/20 text-[12px] font-bold px-5 py-2.5 text-white transition-all hover:bg-[#5322ff] shrink-0 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse text-cyan-glow" />
                  EXECUTING NODE...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-cyan-glow" />
                  RUN SIMULATOR
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mr-1">
              PRESET ENGINE:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`border px-3 py-1 font-mono text-[11px] transition-colors ${
                  activePreset === p.label
                    ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Workflow Simulator Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 lg:mt-12 font-mono"
        >
          {/* Mode selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-4">
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest sm:mr-2">
              WORKFLOW ENGINE:
            </span>
            <div className="inline-flex flex-wrap gap-1 border border-zinc-800 bg-zinc-950 p-1">
              {WORKFLOW_MODES.map((m, i) => {
                const isActive = i === activeIdx;
                const c = accentColor(m.accent);
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveIdx(i)}
                    className={`relative px-4 py-1.5 text-[12px] font-mono font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 border border-zinc-700"
                        style={{ background: `${c}18` }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulator card */}
          <div className="relative border border-zinc-800 bg-[#0b0b0f] overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-zinc-700" />
                <span className="h-2 w-2 bg-zinc-700" />
                <span className="h-2 w-2 bg-zinc-700" />
                <span className="ml-3 font-mono text-[11px] text-zinc-400">
                  ~/artcraft/engine/{mode.id}.json
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] px-2 py-0.5 border"
                  style={{
                    borderColor: isSimulating ? ELECTRIC_PURPLE : accent,
                    color: isSimulating ? ELECTRIC_CYAN : accent,
                  }}
                >
                  {isSimulating ? 'EXECUTING' : 'READY'}
                </span>
                <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline">
                  RUN #08942
                </span>
              </div>
            </div>

            {/* SVG canvas + side panel */}
            <div className="grid lg:grid-cols-[1fr_300px]">
              {/* Canvas */}
              <div className="relative bg-[#09090b] min-h-[320px] sm:min-h-[380px]">
                {/* Progress bar */}
                {isSimulating && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-zinc-800 z-10">
                    <div
                      className="h-full"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #00E5FF, #5322ff)',
                      }}
                    />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.svg
                    key={mode.id}
                    viewBox="0 0 1080 300"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Edges */}
                    {renderEdges.map(([from, to], i) => {
                      const a = nodeById(from);
                      const b = renderNodes.find((n) => n.id === to)!;
                      const fromIdx = nodeIndexMap[from];
                      const toIdx = nodeIndexMap[to];
                      const edgeActive =
                        isSimulating &&
                        (fromIdx === activeNodeIdx || toIdx === activeNodeIdx);
                      const mx = (a.x + b.x) / 2;
                      const path = `M ${a.x + 64} ${a.y + 28} C ${mx} ${a.y + 28}, ${mx} ${b.y + 28}, ${b.x} ${b.y + 28}`;
                      return (
                        <g key={`${from}-${to}`}>
                          <path d={path} fill="none" stroke="rgba(63,63,70,0.6)" strokeWidth="1.5" />
                          <path
                            d={path}
                            fill="none"
                            stroke={edgeActive ? ELECTRIC_CYAN : accent}
                            strokeWidth={edgeActive ? '2.5' : '1.5'}
                            opacity={edgeActive ? 1 : 0.7}
                          />
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {renderNodes.map((n, ni) => {
                      const isBrain = n.type === 'dify';
                      const isActive = isSimulating && ni === activeNodeIdx;
                      const nodeColor = isBrain ? accent : '#a1a1aa';
                      return (
                        <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                          {isActive && (
                            <rect
                              x="-4"
                              y="-4"
                              width="136"
                              height="64"
                              fill="none"
                              stroke={ELECTRIC_CYAN}
                              strokeWidth="2"
                            />
                          )}
                          <rect
                            width="128"
                            height="56"
                            fill="#0b0b0f"
                            stroke={
                              isActive
                                ? ELECTRIC_CYAN
                                : isBrain
                                  ? `${accent}`
                                  : 'rgba(63,63,70,0.8)'
                            }
                            strokeWidth="1"
                          />
                          <circle cx="18" cy="28" r="4" fill={isActive ? ELECTRIC_CYAN : isBrain ? accent : '#71717a'} />
                          <text
                            x="34"
                            y="25"
                            fill="#fafafa"
                            fontSize="11"
                            fontWeight="600"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {n.label}
                          </text>
                          <text
                            x="34"
                            y="40"
                            fill="#71717a"
                            fontSize="9"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {n.sub}
                          </text>
                        </g>
                      );
                    })}
                  </motion.svg>
                </AnimatePresence>

                {/* Metrics popup */}
                <AnimatePresence>
                  {showMetrics && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono"
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 12 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 12 }}
                        className="relative border border-[#00E5FF] bg-zinc-950 p-6 max-w-sm w-full"
                      >
                        <button
                          onClick={() => setShowMetrics(false)}
                          className="absolute top-3 right-3 text-zinc-500 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-800 pb-3">
                          <Zap className="h-5 w-5 text-cyan-glow" />
                          <span className="text-[14px] font-bold text-white uppercase">
                            EXECUTION COMPLETED
                          </span>
                        </div>
                        <div className="space-y-2">
                          <MetricRow
                            icon={CheckCircle2}
                            label="Deterministic"
                            value="100%"
                            color="#10b981"
                          />
                          <MetricRow
                            icon={Cpu}
                            label="Token Cost"
                            value="$0.0018"
                            color="#00E5FF"
                          />
                          <MetricRow
                            icon={Activity}
                            label="Craft Precision"
                            value="Sub-Pixel"
                            color="#5322ff"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setShowMetrics(false);
                            setSimState('idle');
                          }}
                          className="mt-5 w-full border border-zinc-800 bg-zinc-900 text-[12px] font-bold text-zinc-300 py-2.5 hover:bg-zinc-800 hover:text-white"
                        >
                          RUN ANOTHER SIMULATION
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Side panel */}
              <div className="border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-950 p-5 flex flex-col font-mono">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col h-full gap-4"
                  >
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-glow mb-1">
                        {mode.sublabel}
                      </div>
                      <p className="text-[12px] leading-relaxed text-zinc-400 font-sans">
                        {mode.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {mode.stats.map((s) => (
                        <div
                          key={s.label}
                          className="border border-zinc-800 bg-zinc-900/60 p-2"
                        >
                          <div className="font-mono text-[13px] font-bold text-white">
                            {s.value}
                          </div>
                          <div className="text-[9px] text-zinc-500 leading-tight">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-zinc-800">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                        OUTPUT NODES
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {mode.outputs.map((o) => (
                          <div key={o.label} className="flex items-center gap-2 text-[11px]">
                            <o.icon className="h-3.5 w-3.5 text-cyan-glow" />
                            <span className="text-zinc-300">{o.label}</span>
                            <span className="text-zinc-600 font-mono text-[9px] ml-auto">
                              {o.sub}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Telemetry log strip */}
          <div className="mt-2 border border-zinc-800 bg-zinc-950 px-4 py-2.5 font-mono text-[10px] text-zinc-500 flex flex-wrap items-center gap-3">
            <span className="text-emerald-400">[OK]</span> dify.reasoning → consensus reached (1.2s)
            <span>|</span>
            <span className="text-cyan-glow">[n8n]</span> webhook.fanout → 200 OK
            <span>|</span>
            <span className="text-[#5322ff]">[craft]</span> node.anchor → pulse active
          </div>
        </motion.div>
      </div>
    </section>
  );
}
