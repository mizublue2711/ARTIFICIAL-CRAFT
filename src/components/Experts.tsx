import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight, Award } from 'lucide-react';
import { EXPERTS, type Expert } from '@/lib/data';

function accentHex(accent: 'cyan' | 'purple') {
  return accent === 'cyan' ? '#00E5FF' : '#5322ff';
}

function ExpertCard({ expert, index }: { expert: Expert; index: number }) {
  const accent = accentHex(expert.accent);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative border border-zinc-800 bg-zinc-950 p-6 font-mono hover:border-zinc-700 transition-colors"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="relative h-10 w-10 border flex items-center justify-center font-mono text-[12px] font-bold text-white bg-zinc-900"
            style={{ borderColor: accent }}
          >
            {expert.initials}
          </div>
          <div>
            <div className="text-[13px] font-bold text-white uppercase tracking-tight">{expert.name}</div>
            <div className="text-[11px] text-zinc-500 font-sans">{expert.role}</div>
          </div>
        </div>
        <a
          href="#"
          className="text-zinc-500 hover:text-white transition-colors"
          aria-label={`${expert.name} on LinkedIn`}
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>

      <div className="border border-zinc-800 bg-[#09090b] p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Award className="h-3.5 w-3.5" style={{ color: accent }} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            CURATED WORKFLOW
          </span>
        </div>
        <div className="text-[12px] text-zinc-200 font-bold leading-snug">
          {expert.workflow}
        </div>
      </div>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-glow hover:text-white transition-colors uppercase"
      >
        VIEW BLUEPRINT
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </motion.div>
  );
}

export default function Experts() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#09090b] font-mono" id="experts">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
          <span className="h-1.5 w-1.5 bg-[#5322ff]" />
          EXPERT DIRECTORY // CURATED
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl uppercase leading-[1.05]"
          >
            VETTED BY BUILDERS OF THE FUTURE.
          </motion.h2>
          <p className="max-w-md text-[14px] text-zinc-400 font-sans leading-relaxed border-l-2 border-[#00E5FF] pl-3">
            Every featured workflow is audited, deployed, and maintained by operators running production AI.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXPERTS.map((e, i) => (
            <ExpertCard key={e.id} expert={e} index={i} />
          ))}
        </div>

        {/* Telemetry Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px border border-zinc-800 bg-zinc-800 font-mono"
        >
          {[
            { v: '4,200+', l: 'PRODUCTION WORKFLOWS' },
            { v: '180M+', l: 'AGENT RUNS / MONTH' },
            { v: '14', l: 'MULTI-AZ REGIONS' },
            { v: '99.99%', l: 'DETERMINISTIC SLA' },
          ].map((s) => (
            <div key={s.l} className="bg-zinc-950 p-5">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {s.v}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
