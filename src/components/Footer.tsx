import { Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const cols = [
  {
    title: 'Platform',
    links: ['Architecture', 'Blueprints', 'Pricing', 'Changelog', 'Status'],
  },
  {
    title: 'Developers',
    links: ['Documentation', 'API Reference', 'CLI', 'Self-host', 'GitHub'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Partners', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-800/80 bg-[#09090b]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {/* CTA banner */}
        <div className="relative rounded-2xl border border-zinc-800/80 bg-[#0b0b0f] overflow-hidden p-8 lg:p-12 mb-16">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(0,229,255,0.08), transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(124,58,237,0.07), transparent 60%)',
            }}
          />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Ship your first agent in 90 seconds.
              </h3>
              <p className="mt-2 text-[15px] text-zinc-400 max-w-lg">
                No credit card. No sales call. Just a CLI, a blueprint, and a
                webhook URL.
              </p>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-[#09090b] text-sm font-medium px-5 py-2.5 hover:bg-zinc-200 transition-colors shrink-0"
            >
              Start building
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-cyan-glow/80 to-purple-glow/60 flex items-center justify-center">
                <span className="relative font-mono text-[13px] font-bold text-white">N</span>
              </div>
              <span className="font-semibold text-[15px] text-white">Nexora</span>
            </div>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-xs">
              Dify + n8n integrated infrastructure for production AI agents.
              Reasoning you can trust, execution you can prove.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg border border-zinc-800 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-zinc-600">
            © 2026 Nexora Labs · Built with Dify + n8n
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-600">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
            <span>·</span>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
