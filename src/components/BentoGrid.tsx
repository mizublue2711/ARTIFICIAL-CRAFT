import React, { useRef, useState } from 'react';
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
  ExternalLink,
} from 'lucide-react';

const VIBEPATH_URL = 'https://vibepath.mizu2711.workers.dev/';
import { useTranslation } from '@/context/useLanguage';

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
  const color = accent === 'cyan' ? '0,229,255' : '83,34,255';

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
      className={`group relative border border-zinc-800 bg-zinc-950 overflow-hidden transition-colors ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, rgba(${color},0.12), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
      <span className="h-1.5 w-1.5 bg-[#5322ff]" />
      {children}
    </div>
  );
}

export default function BentoGrid() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 lg:py-28 bg-[#09090b] font-mono" id="architecture">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionLabel>{t('bento_section_label')}</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl uppercase font-mono leading-[1.05]"
        >
          {t('bento_title_line1')}
          <br />
          <span className="text-zinc-500">{t('bento_title_line2')}</span>
        </motion.h2>
        <p className="mt-4 max-w-2xl text-[15px] text-zinc-400 leading-relaxed font-sans border-l-2 border-[#00E5FF] pl-4">
          {t('bento_desc')}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(180px,auto)]">
          {/* Card 1 — VibePath Automation Engine */}
          <SpotlightCard className="md:col-span-4 md:row-span-2" accent="cyan">
            <div className="relative h-full p-6 sm:p-8 flex flex-col font-mono">
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-2 py-1">
                    <Brain className="h-3.5 w-3.5 text-cyan-glow" />
                    <span className="font-mono text-[11px] text-zinc-300">DIFY // REASONING CORE</span>
                  </div>
                  <span className="font-mono text-zinc-600 text-xs">+</span>
                  <div className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-2 py-1">
                    <Workflow className="h-3.5 w-3.5 text-[#5322ff]" />
                    <span className="font-mono text-[11px] text-zinc-300">N8N // ORCHESTRATOR</span>
                  </div>
                </div>

                <a
                  href={VIBEPATH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#00E5FF] bg-[#00E5FF]/10 text-cyan-glow hover:bg-[#00E5FF] hover:text-black transition-all px-3 py-1 text-xs font-bold font-mono uppercase shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                >
                  <span>{t('card_vibepath_link')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <h3 className="text-xl font-bold text-white uppercase tracking-tight font-mono text-cyan-glow">
                {t('card_vibepath_title')}
              </h3>
              <p className="mt-1 text-sm font-semibold text-zinc-200 font-mono">
                {t('card_vibepath_desc')}
              </p>
              <p className="mt-2 text-[13.5px] text-zinc-400 leading-relaxed font-sans max-w-lg">
                {t('card_hybrid_desc')}
              </p>

              {/* Mini architecture diagram */}
              <div className="mt-6 flex-1 flex items-end">
                <div className="w-full border border-zinc-800 bg-[#09090b] p-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap font-mono">
                    <ArchNode icon={Terminal} label={t('node_trigger')} sub="n8n" color="#a1a1aa" />
                    <ArchConnector />
                    <ArchNode icon={Brain} label={t('node_reason')} sub="Dify" color="#00E5FF" highlight />
                    <ArchConnector />
                    <ArchNode icon={Database} label={t('node_vector')} sub="Pinecone" color="#a1a1aa" />
                    <ArchConnector />
                    <ArchNode icon={ShieldCheck} label={t('node_guard')} sub="Craft" color="#5322ff" />
                    <ArchConnector />
                    <ArchNode icon={Workflow} label={t('node_fanout')} sub="n8n" color="#00E5FF" />
                  </div>
                  <div className="mt-4 flex items-center gap-4 font-mono text-[10px] text-zinc-500 border-t border-zinc-800 pt-3">
                    <span><span className="text-emerald-400">●</span> {t('status_typed_tool')}</span>
                    <span><span className="text-cyan-glow">●</span> {t('status_streaming_matrix')}</span>
                    <span><span className="text-[#5322ff]">●</span> {t('status_retry_eligible')}</span>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2 — Vector RAG Matrix */}
          <SpotlightCard className="md:col-span-2" accent="cyan">
            <div className="p-6 h-full flex flex-col font-mono">
              <div className="flex items-center justify-between mb-3">
                <Database className="h-5 w-5 text-cyan-glow" />
                <span className="font-mono text-[10px] text-zinc-500">{t('rag_latency')}</span>
              </div>
              <h3 className="text-[14px] font-bold text-white uppercase">{t('card_rag_title')}</h3>
              <p className="mt-1.5 text-[12px] text-zinc-400 font-sans leading-relaxed">
                {t('card_rag_desc')}
              </p>
              <div className="mt-auto pt-4 flex items-end gap-1 h-10">
                {[45, 70, 55, 85, 60, 75, 95, 65, 80, 100, 70, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#5322ff] to-[#00E5FF]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3 — Deterministic Execution */}
          <SpotlightCard className="md:col-span-2" accent="purple">
            <div className="p-6 h-full flex flex-col font-mono">
              <div className="flex items-center justify-between mb-3">
                <GitBranch className="h-5 w-5 text-[#5322ff]" />
                <span className="font-mono text-[10px] text-emerald-400">99.99% SLA</span>
              </div>
              <h3 className="text-[14px] font-bold text-white uppercase">
                {t('card_det_title')}
              </h3>
              <p className="mt-1.5 text-[12px] text-zinc-400 font-sans leading-relaxed">
                {t('card_det_desc')}
              </p>
              <div className="mt-auto pt-3 space-y-1 font-mono text-[10px]">
                <ExecRow icon={Zap} text={t('row_retry')} />
                <ExecRow icon={Gauge} text={t('row_rate_limit')} />
                <ExecRow icon={ShieldCheck} text={t('row_dead_letter')} />
              </div>
            </div>
          </SpotlightCard>

          {/* Card 4 — Multi-Model Router */}
          <SpotlightCard className="md:col-span-2" accent="cyan">
            <div className="p-6 h-full flex flex-col font-mono">
              <Cpu className="h-5 w-5 text-cyan-glow mb-3" />
              <h3 className="text-[14px] font-bold text-white uppercase">{t('card_router_title')}</h3>
              <p className="mt-1.5 text-[12px] text-zinc-400 font-sans leading-relaxed">
                {t('card_router_desc')}
              </p>
              <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                {['GPT-4O', 'CLAUDE', 'LLAMA3', 'MISTRAL'].map((m) => (
                  <span
                    key={m}
                    className="font-mono text-[9px] px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Card 5 — Telemetry Tracing */}
          <SpotlightCard className="md:col-span-2" accent="purple">
            <div className="p-6 h-full flex flex-col font-mono">
              <div className="flex items-center justify-between mb-3">
                <Layers className="h-5 w-5 text-[#5322ff]" />
                <span className="font-mono text-[10px] text-emerald-400">{t('tracing_active')}</span>
              </div>
              <h3 className="text-[14px] font-bold text-white uppercase">{t('card_telemetry_title')}</h3>
              <p className="mt-1.5 text-[12px] text-zinc-400 font-sans leading-relaxed">
                {t('card_telemetry_desc')}
              </p>
              <div className="mt-auto pt-3 font-mono text-[10px] text-zinc-500 space-y-1">
                <div className="flex justify-between"><span>SPAN.REASON</span><span className="text-zinc-300">1.20s</span></div>
                <div className="flex justify-between"><span>SPAN.RAG</span><span className="text-zinc-300">540ms</span></div>
                <div className="flex justify-between"><span>SPAN.FANOUT</span><span className="text-zinc-300">180ms</span></div>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 6 — Swiss Guardrails */}
          <SpotlightCard className="md:col-span-2" accent="cyan">
            <div className="p-6 h-full flex flex-col font-mono">
              <ShieldCheck className="h-5 w-5 text-cyan-glow mb-3" />
              <h3 className="text-[14px] font-bold text-white uppercase">{t('card_guardrails_title')}</h3>
              <p className="mt-1.5 text-[12px] text-zinc-400 font-sans leading-relaxed">
                {t('card_guardrails_desc')}
              </p>
              <div className="mt-auto pt-3 font-mono text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5">
                <span className="text-cyan-glow">SCHEMA:</span> z.object(&#123; craft: z.string().max(2000) &#125;)
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
      className="flex flex-col items-center gap-0.5 border bg-zinc-950 px-2.5 py-2 min-w-[68px]"
      style={{
        borderColor: highlight ? `${color}` : 'rgba(63,63,70,0.8)',
      }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      <span className="text-[10px] text-white font-bold">{label}</span>
      <span className="font-mono text-[8px] text-zinc-500">{sub}</span>
    </div>
  );
}

function ArchConnector() {
  return (
    <div className="hidden sm:flex items-center gap-0.5 text-zinc-600 font-mono text-[10px]">
      →
    </div>
  );
}

function ExecRow({ icon: Icon, text }: { icon: typeof Zap; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-zinc-400">
      <Icon className="h-3 w-3 text-cyan-glow" />
      {text}
    </div>
  );
}
