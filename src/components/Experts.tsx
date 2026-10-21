import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight, Award } from 'lucide-react';
import { EXPERTS, type Expert } from '@/lib/data';

function accentHex(accent: 'cyan' | 'purple') {
  return accent === 'cyan' ? '#00E5FF' : '#7C3AED';
}

function ExpertCard({ expert, index }: { expert: Expert; index: number }) {
  const accent = accentHex(expert.accent);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-2xl border border-zinc-800/80 bg-[#0b0b0f] p-6 hover:border-zinc-700 transition-colors"
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="relative h-11 w-11 rounded-full flex items-center justify-center font-mono text-[13px] font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
              border: `1px solid ${accent}40`,
            }}
          >
            {expert.initials}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b0b0f]"
              style={{ background: accent }}
            />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white tracking-tight">{expert.name}</div>
            <div className="text-[12px] text-zinc-500">{expert.role}</div>
          </div>
        </div>
        <a
          href="#"
          className="opacity-60 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
          aria-label={`${expert.name} on LinkedIn`}
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-[#09090b] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-3.5 w-3.5" style={{ color: accent }} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Curated workflow
          </span>
        </div>
        <div className="text-[13px] text-zinc-300 font-medium leading-snug">
          {expert.workflow}
        </div>
      </div>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-[12px] text-zinc-500 hover:text-white transition-colors group/link"
      >
        View blueprint
        <ArrowUpRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
      </a>
    </motion.div>
  );
}

export default function Experts() {
  return (
    <section className="relative py-24 lg:py-32" id="experts">
      <div className="absolute inset-0 bg-dots opacity-30 mask-fade-b" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500 mb-4">
          <span className="h-px w-6 bg-zinc-700" />
          Curated by Industry Experts
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-white max-w-2xl leading-[1.08]"
          >
            Trusted by the people
            <br />
            <span className="text-zinc-500">who build the future.</span>
          </motion.h2>
          <p className="max-w-md text-[15px] text-zinc-400 leading-relaxed">
            Every featured workflow is vetted, deployed, and maintained by
            operators running production AI at scale.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXPERTS.map((e, i) => (
            <ExpertCard key={e.id} expert={e} index={i} />
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-zinc-800/80 bg-zinc-800/80 overflow-hidden"
        >
          {[
            { v: '4,200+', l: 'Workflows in production' },
            { v: '180M+', l: 'Agent runs / month' },
            { v: '14', l: 'Regions, multi-AZ' },
            { v: '99.99%', l: 'Uptime SLA' },
          ].map((s) => (
            <div key={s.l} className="bg-[#0b0b0f] p-6">
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {s.v}
              </div>
              <div className="text-[12.5px] text-zinc-500 mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
