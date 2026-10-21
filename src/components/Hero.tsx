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
} from 'lucide-react';
import { WORKFLOW_MODES, type WorkflowMode } from '@/lib/data';
import ParticleCanvas from '@/components/ParticleCanvas';

const STUDIO_URL = 'https://dify-n8n-workflow.ai.studio/';
const MAGENTA = '#FF0055';

const PRESETS = [
  { label: 'Sneaker E-com SKU', url: 'https://shop.nike.com/air-jordan-1-2024' },
  { label: 'SaaS Pitchdeck', url: 'https://docs.startup.io/pitchdeck-series-a.pdf' },
  { label: 'Financial Report PDF', url: 'https://reports.fintech.io/q4-2024-annual.pdf' },
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
  return accent === 'cyan' ? '#00E5FF' : '#7C3AED';
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
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-white/[0.02] px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="text-[13px] text-zinc-400">{label}</span>
      <span className="ml-auto font-mono text-[14px] font-semibold text-white">{value}</span>
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
    const duration = 3000;
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
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden" id="platform">
      {/* Ambient particle canvas */}
      <ParticleCanvas className="absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,229,255,0.06), transparent 60%), radial-gradient(ellipse 60% 40% at 70% 30%, rgba(255,0,85,0.04), transparent 60%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-white/[0.02] px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-zinc-400 tracking-wide">
              INFRASTRUCTURE ONLINE · 14 REGIONS · 99.99% SLA
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-8 text-center text-[34px] sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.06] text-white"
        >
          Stop Building Fragile AI.
          <br />
          <span className="text-gradient-cyan-magenta">
            Orchestrate Enterprise-Grade Deterministic Workflows.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-2xl mx-auto text-center text-[17px] leading-relaxed text-zinc-400"
        >
          Unifying Dify's Reasoning Engine with n8n's Execution Orchestrator.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative animate-glow-breathe inline-flex items-center gap-2 rounded-full text-sm font-semibold px-6 py-3 text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(124,58,237,0.14))',
              border: '1px solid rgba(0,229,255,0.5)',
            }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 0 1px rgba(0,229,255,0.9), 0 0 32px -2px rgba(0,229,255,0.6)' }}
            />
            <Zap className="relative h-4 w-4 text-cyan-glow" />
            <span className="relative">Launch Autopilot Dashboard</span>
            <ChevronRight className="relative h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#blueprints"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-white/[0.02] text-sm text-zinc-300 px-5 py-3 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            Explore blueprints
          </a>
        </motion.div>

        {/* Simulation Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-10 mx-auto max-w-3xl"
        >
          <div className="rounded-2xl border border-zinc-800/80 bg-[#0b0b0f]/80 backdrop-blur-sm p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 rounded-xl border border-zinc-800 bg-[#09090b] px-3 py-2.5">
              <Link2 className="h-4 w-4 text-zinc-600 shrink-0" />
              <input
                type="text"
                value={simUrl}
                onChange={(e) => {
                  setSimUrl(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="Paste a URL to simulate..."
                className="bg-transparent text-[13px] text-zinc-200 placeholder-zinc-600 outline-none flex-1 font-mono min-w-0"
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-[13px] font-semibold px-5 py-2.5 text-white transition-all shrink-0 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(255,0,85,0.15))',
                border: '1px solid rgba(0,229,255,0.3)',
              }}
            >
              {isSimulating ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse text-cyan-glow" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-cyan-glow" />
                  Simulate Flow
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mr-1">
              Try:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`rounded-full border px-3 py-1 text-[11.5px] transition-colors ${
                  activePreset === p.label
                    ? 'border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow'
                    : 'border-zinc-800 bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Workflow Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 lg:mt-14"
        >
          {/* Mode selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 mb-5">
            <span className="font-mono text-[11px] text-zinc-600 uppercase tracking-widest sm:mr-2">
              Workflow
            </span>
            <div className="inline-flex flex-wrap gap-1 rounded-xl border border-zinc-800 bg-white/[0.02] p-1">
              {WORKFLOW_MODES.map((m, i) => {
                const isActive = i === activeIdx;
                const c = accentColor(m.accent);
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveIdx(i)}
                    className={`relative rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-lg border"
                        style={{ borderColor: `${c}55`, background: `${c}12` }}
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
          <div className="relative rounded-2xl border border-zinc-800/80 bg-[#0b0b0f] overflow-hidden">
            {/* top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-white/[0.015]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-[11px] text-zinc-500">
                  ~/nexora/{mode.id}-workflow.json
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded border"
                  style={{
                    borderColor: isSimulating ? `${MAGENTA}40` : `${accent}40`,
                    color: isSimulating ? MAGENTA : accent,
                  }}
                >
                  {isSimulating ? 'RUNNING' : 'LIVE'}
                </span>
                <span className="font-mono text-[11px] text-zinc-600 hidden sm:inline">
                  run #4,219
                </span>
              </div>
            </div>

            {/* SVG canvas + side panel */}
            <div className="grid lg:grid-cols-[1fr_300px]">
              {/* Canvas */}
              <div className="relative bg-[#09090b] bg-dots min-h-[320px] sm:min-h-[380px]">
                {/* Progress bar */}
                {isSimulating && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-zinc-800 z-10">
                    <div
                      className="h-full"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #00E5FF, #FF0055)',
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
                            stroke={edgeActive ? MAGENTA : accent}
                            strokeWidth={edgeActive ? '2.5' : '1.5'}
                            className="animate-dash"
                            opacity={edgeActive ? 1 : 0.7}
                            style={{ animationDelay: `${i * 0.4}s` }}
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
                              x="-5"
                              y="-5"
                              width="138"
                              height="66"
                              rx="13"
                              fill="none"
                              stroke={MAGENTA}
                              strokeWidth="2"
                              opacity="0.8"
                            >
                              <animate
                                attributeName="opacity"
                                values="0.3;1;0.3"
                                dur="0.5s"
                                repeatCount="indefinite"
                              />
                            </rect>
                          )}
                          {isBrain && (
                            <circle cx="56" cy="28" r="40" fill={accent} opacity="0.06" />
                          )}
                          <rect
                            width="128"
                            height="56"
                            rx="10"
                            fill="#0b0b0f"
                            stroke={
                              isActive
                                ? `${MAGENTA}99`
                                : isBrain
                                  ? `${accent}66`
                                  : 'rgba(63,63,70,0.8)'
                            }
                            strokeWidth="1"
                          />
                          <rect
                            x="0"
                            y="0"
                            width="128"
                            height="56"
                            rx="10"
                            fill="url(#node-shine)"
                            opacity="0.5"
                          />
                          <circle cx="18" cy="28" r="10" fill={`${nodeColor}1a`} />
                          <circle
                            cx="18"
                            cy="28"
                            r="4"
                            fill={isActive ? MAGENTA : isBrain ? accent : '#71717a'}
                          >
                            {(isBrain || isActive) && (
                              <animate
                                attributeName="opacity"
                                values="0.5;1;0.5"
                                dur={isActive ? '0.6s' : '2s'}
                                repeatCount="indefinite"
                              />
                            )}
                          </circle>
                          <text
                            x="36"
                            y="25"
                            fill="#fafafa"
                            fontSize="11"
                            fontWeight="600"
                            fontFamily="Inter, sans-serif"
                          >
                            {n.label}
                          </text>
                          <text
                            x="36"
                            y="40"
                            fill="#71717a"
                            fontSize="9"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {n.sub}
                          </text>
                          {isBrain && (
                            <rect x="120" y="24" width="3" height="8" rx="1.5" fill={accent}>
                              <animate
                                attributeName="opacity"
                                values="0.3;1;0.3"
                                dur="1.4s"
                                repeatCount="indefinite"
                              />
                            </rect>
                          )}
                        </g>
                      );
                    })}

                    <defs>
                      <linearGradient id="node-shine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </AnimatePresence>

                {/* Scan line */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                  }}
                />

                {/* Metrics popup */}
                <AnimatePresence>
                  {showMetrics && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-[#09090b]/85 backdrop-blur-sm p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 12 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 12 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="relative rounded-2xl border border-cyan-glow/30 bg-[#0b0b0f] p-6 max-w-sm w-full"
                      >
                        <button
                          onClick={() => setShowMetrics(false)}
                          className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="h-8 w-8 rounded-lg bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-cyan-glow" />
                          </div>
                          <span className="text-[15px] font-semibold text-white">
                            Processing Complete
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          <MetricRow
                            icon={CheckCircle2}
                            label="Deterministic"
                            value="100%"
                            color="#10b981"
                          />
                          <MetricRow
                            icon={Cpu}
                            label="Token Cost"
                            value="$0.002"
                            color="#00E5FF"
                          />
                          <MetricRow
                            icon={Activity}
                            label="Time Saved"
                            value="3.5 Hours"
                            color={MAGENTA}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setShowMetrics(false);
                            setSimState('idle');
                          }}
                          className="mt-5 w-full rounded-lg border border-zinc-800 bg-white/[0.03] text-[13px] text-zinc-300 py-2.5 hover:bg-white/[0.06] hover:text-white transition-colors"
                        >
                          Run another simulation
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Side panel */}
              <div className="border-t lg:border-t-0 lg:border-l border-zinc-800/80 bg-[#0b0b0f] p-5 flex flex-col">
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
                      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1.5">
                        {mode.sublabel}
                      </div>
                      <p className="text-[13px] leading-relaxed text-zinc-400">
                        {mode.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {mode.stats.map((s) => (
                        <div
                          key={s.label}
                          className="rounded-lg border border-zinc-800/80 bg-white/[0.02] p-2.5"
                        >
                          <div className="font-mono text-[15px] font-semibold text-white">
                            {s.value}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                            {s.label}
                          </div>
                          <div
                            className="font-mono text-[10px] mt-1"
                            style={{
                              color:
                                s.delta.startsWith('-') && !s.delta.includes('rate')
                                  ? '#71717a'
                                  : accent,
                            }}
                          >
                            {s.delta}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-zinc-800/60">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-2">
                        Output channels
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {mode.outputs.map((o) => (
                          <div key={o.label} className="flex items-center gap-2 text-[12px]">
                            <o.icon className="h-3.5 w-3.5 text-zinc-500" />
                            <span className="text-zinc-300">{o.label}</span>
                            <span className="text-zinc-600 font-mono text-[10px] ml-auto">
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

          {/* Log strip */}
          <div className="mt-3 rounded-xl border border-zinc-800/60 bg-[#0b0b0f] px-4 py-3 font-mono text-[11px] text-zinc-500 overflow-hidden mask-fade-edges">
            <span className="text-emerald-400">[ok]</span> agent.reason → completed in 1.42s &nbsp;
            <span className="text-cyan-glow">[n8n]</span> webhook.ingest → 200 OK &nbsp;
            <span className="text-zinc-600">[rag]</span> pinecone.query → 142 docs, p95 780ms &nbsp;
            <span className="text-purple-glow">[dify]</span> critic.merge → consensus reached &nbsp;
            <span className="text-emerald-400">[ok]</span> fanout.telegram → delivered
          </div>
        </motion.div>
      </div>
    </section>
  );
}
