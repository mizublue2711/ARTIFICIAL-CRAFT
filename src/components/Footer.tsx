import { Github, Twitter, Linkedin, ArrowRight, Terminal } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';

const cols = [
  {
    title: 'ENGINE',
    links: ['Architecture', 'Blueprints', 'Telemetry', 'Changelog', 'Status'],
  },
  {
    title: 'DEVELOPERS',
    links: ['Documentation', 'API Reference', 'CLI Tool', 'Self-host', 'GitHub'],
  },
  {
    title: 'CRAFT',
    links: ['About', 'Manifesto', 'Careers', 'Partners', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-800 bg-[#09090b] font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {/* CTA banner */}
        <div className="relative border border-zinc-800 bg-zinc-950 p-8 lg:p-12 mb-16 overflow-hidden">
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase text-cyan-glow tracking-widest border border-zinc-800 bg-zinc-900 px-2 py-0.5">
                CRAFT//CODE DEPLOYMENT
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-mono">
                SHIP YOUR FIRST AGENT NODE IN 90 SECONDS.
              </h3>
              <p className="mt-2 text-[14px] text-zinc-400 font-sans max-w-lg">
                No credit card required. No sales call. Just a CLI, a blueprint, and a webhook URL.
              </p>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 border border-zinc-200 bg-white text-black text-xs font-bold px-5 py-3 hover:bg-zinc-200 transition-colors shrink-0 uppercase"
            >
              START BUILDING
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <BrutalistLogo size={36} subtag="CRAFT//CODE" className="mb-4" />
            <p className="text-[12.5px] text-zinc-400 font-sans leading-relaxed max-w-xs border-l-2 border-[#5322ff] pl-3">
              ARTIFICIAL CRAFT (CRAFT//CODE): Expressing the conflict between graphic design precision and code automation engines.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-8 w-8 border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[12px] text-zinc-400 hover:text-white transition-colors"
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
        <div className="mt-14 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-zinc-500">
            © 2026 ARTIFICIAL CRAFT // CRAFT//CODE · DIFY + N8N HYBRID INFRASTRUCTURE
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SYSTEMS ONLINE
            </span>
            <span>·</span>
            <a href="#" className="hover:text-zinc-300">PRIVACY</a>
            <a href="#" className="hover:text-zinc-300">TERMS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
