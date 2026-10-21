import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Workflow,
  Database,
  Zap,
  ShieldCheck,
  GitBranch,
  Gauge,
  Layers,
  Terminal,
  Cpu,
} from 'lucide-react';

function SpotlightCard({
  children,
  className = '',
  accent = 'cyan',
}: {
  children: React.ReactNode;
  className?: string;
  accent?: 'cyan' | 'purple';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const color = accent === 'cyan' ? '0,229,255' : '124,58,237';

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative rounded-2xl border border-zinc-800/80 bg-[#0b0b0f] overflow-hidden transition-colors ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, rgba(${color},0.08), transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          boxShadow: `inset 0 0 0 1px rgba(${color},0.18)`,
        }}
      />
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500 mb-4">
      <span className="h-px w-6 bg-zinc-700" />
      {children}
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="relative py-24 lg:py-32" id="architecture">
      <div className="absolute inset-0 bg-grid opacity-20 mask-fade-b" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionLabel>Architecture</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight text-white max-w-2xl leading-[1.08]"
        >
          Two engines. One runtime.
          <br />
          <span className="text-zinc-500">Zero glue code.</span>
        </motion.h2>
        <p className="mt-5 max-w-xl text-[15px] text-zinc-400 leading-relaxed">
          Dify owns reasoning, RAG, and agent orchestration. n8n owns webhooks,
          retries, rate-limits, and the last-mile fanout. Nexora binds them with
          a typed, observable control plane.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(180px,auto)]">
          {/* Card 1 — Hybrid Architecture (large) */}
          <SpotlightCard className="md:col-span-4 md:row-span-2" accent="cyan">
            <div className="relative h-full p-7 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-white/[0.03] px-2 py-1">
                  <Brain className="h-3.5 w-3.5 text-cyan-glow" />
                  <span className="font-mono text-[11px] text-zinc-400">Dify LLMOps</span>
                </div>
                <span className="font-mono text-zinc-600 text-xs">+</span>
                <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-white/[0.03] px-2 py-1">
                  <Workflow className="h-3.5 w-3.5 text-purple-glow" />
                  <span className="font-mono text-[11px] text-zinc-400">n8n Orchestration</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white tracking-tight">
                Hybrid Architecture
              </h3>
              <p className="mt-2 text-[14px] text-zinc-400 leading-relaxed max-w-md">
                Reasoning and orchestration are first-class citizens, not
                afterthoughts. Dify agents call n8n workflows as typed tools;
                n8n workflows call Dify agents as deterministic steps.
              </p>

              {/* Mini architecture diagram */}
              <div className="mt-6 flex-1 flex items-end">
                <div className="w-full rounded-xl border border-zinc-800/60 bg-[#09090b] p-5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <ArchNode icon={Terminal} label="Trigger" sub="n8n" color="#71717a" />
                    <ArchConnector />
                    <ArchNode icon={Brain} label="Reason" sub="Dify" color="#00E5FF" highlight />
                    <ArchConnector />
                    <ArchNode icon={Database} label="RAG" sub="Pinecone" color="#71717a" />
                    <ArchConnector />
                    <ArchNode icon={ShieldCheck} label="Guard" sub="n8n" color="#71717a" />
                    <ArchConnector />
                    <ArchNode icon={Workflow} label="Fanout" sub="n8n" color="#7C3AED" />
                  </div>
                  <div className="mt-4 flex items-center gap-4 font-mono text-[10px] text-zinc-600">
                    <span><span className="text-emerald-400">●</span> typed tool-call</span>
                    <span><span className="text-cyan-glow">●</span> streaming response</span>
                    <span><span className="text-purple-glow">●</span> retry-eligible</span>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2 — Sub-Second Vector RAG */}
          <SpotlightCard className="md:col-span-2" accent="cyan">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Database className="h-5 w-5 text-cyan-glow" />
                <span className="font-mono text-[10px] text-zinc-600">p95 780ms</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white">Sub-Second Vector RAG</h3>
              <p className="mt-1.5 text-[12.5px] text-zinc-400 leading-relaxed">
                Hybrid Pinecone + BM25 retrieval with adaptive re-ranking.
              </p>
              <div className="mt-auto pt-4 flex items-end gap-1 h-10">
                {[40, 65, 50, 80, 55, 70, 90, 60, 75, 95, 68, 82].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-cyan-glow/20 to-cyan-glow/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3 — Deterministic Execution */}
          <SpotlightCard className="md:col-span-2" accent="purple">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <GitBranch className="h-5 w-5 text-purple-glow" />
                <span className="font-mono text-[10px] text-zinc-600">99.97% SLA</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white">
                Deterministic Execution
              </h3>
              <p className="mt-1.5 text-[12.5px] text-zinc-400 leading-relaxed">
                Auto-retry policies, rate-limit management, dead-letter queues.
              </p>
              <div className="mt-auto pt-4 space-y-1.5 font-mono text-[10px]">
                <ExecRow icon={Zap} text="retry: exponential · max 5" />
                <ExecRow icon={Gauge} text="rate-limit: adaptive · per-provider" />
                <ExecRow icon={ShieldCheck} text="dead-letter: archived + replayable" />
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4 — Multi-model */}
          <SpotlightCard className="md:col-span-2" accent="cyan">
            <div className="p-6 h-full flex flex-col">
              <Cpu className="h-5 w-5 text-cyan-glow mb-4" />
              <h3 className="text-[15px] font-semibold text-white">Multi-Model Routing</h3>
              <p className="mt-1.5 text-[12.5px] text-zinc-400 leading-relaxed">
                GPT-4o, Claude, Llama — routed by cost, latency, or capability.
              </p>
              <div className="mt-auto pt-4 flex gap-1.5">
                {['gpt-4o', 'claude', 'llama', 'mistral'].map((m) => (
                  <span
                    key={m}
                    className="font-mono text-[10px] px-2 py-1 rounded border border-zinc-800 bg-white/[0.02] text-zinc-400"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Card 5 — Observability */}
          <SpotlightCard className="md:col-span-2" accent="purple">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Layers className="h-5 w-5 text-purple-glow" />
                <span className="font-mono text-[10px] text-emerald-400">● tracing on</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white">Full-Stack Observability</h3>
              <p className="mt-1.5 text-[12.5px] text-zinc-400 leading-relaxed">
                Every tool call, token, and retry — traced end-to-end.
              </p>
              <div className="mt-auto pt-4 font-mono text-[10px] text-zinc-600 space-y-1">
                <div className="flex justify-between"><span>span.agent</span><span className="text-zinc-400">1.42s</span></div>
                <div className="flex justify-between"><span>span.rag</span><span className="text-zinc-400">780ms</span></div>
                <div className="flex justify-between"><span>span.fanout</span><span className="text-zinc-400">210ms</span></div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 6 — Guardrails (wide) */}
          <SpotlightCard className="md:col-span-2" accent="cyan">
            <div className="p-6 h-full flex flex-col">
              <ShieldCheck className="h-5 w-5 text-cyan-glow mb-4" />
              <h3 className="text-[15px] font-semibold text-white">Typed Guardrails</h3>
              <p className="mt-1.5 text-[12.5px] text-zinc-400 leading-relaxed">
                Schema-validated inputs and outputs. No silent drift.
              </p>
              <div className="mt-auto pt-3 font-mono text-[10px] text-zinc-500 bg-[#09090b] rounded-lg border border-zinc-800/60 px-3 py-2">
                <span className="text-purple-glow">schema</span> {'{'} response: z.string().max(2000) {'}'}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

function ArchNode({
  icon: Icon,
  label,
  sub,
  color,
  highlight,
}: {
  icon: typeof Brain;
  label: string;
  sub: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-lg border bg-[#0b0b0f] px-3 py-2.5 min-w-[72px]"
      style={{
        borderColor: highlight ? `${color}44` : 'rgba(63,63,70,0.7)',
        boxShadow: highlight ? `0 0 16px -6px ${color}55` : 'none',
      }}
    >
      <Icon className="h-4 w-4" style={{ color }} />
      <span className="text-[11px] text-white font-medium">{label}</span>
      <span className="font-mono text-[9px] text-zinc-500">{sub}</span>
    </div>
  );
}

function ArchConnector() {
  return (
    <div className="hidden sm:flex items-center gap-0.5">
      <div className="h-px w-4 bg-zinc-700" />
      <div className="h-1 w-1 rounded-full bg-zinc-600" />
      <div className="h-px w-4 bg-zinc-700" />
    </div>
  );
}

function ExecRow({ icon: Icon, text }: { icon: typeof Zap; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-zinc-500">
      <Icon className="h-3 w-3 text-purple-glow/70" />
      {text}
    </div>
  );
}
