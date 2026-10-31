import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Linkedin, ArrowRight } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';
import { useTranslation } from '@/context/useLanguage';
import JulesMemorialModal from './JulesMemorialModal';

const VIBEPATH_URL = 'https://vibepath.mizu2711.workers.dev/';
const GITHUB_DOCS_URL = 'https://github.com/mizublue2711/DIFY-N8N-AUTOMATION-DESIGN';

interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
  isRouterLink?: boolean;
}

export default function Footer() {
  const { t } = useTranslation();
  const [isJulesModalOpen, setIsJulesModalOpen] = useState(false);

  const cols: { title: string; links: FooterLinkItem[] }[] = [
    {
      title: t('col_engine'),
      links: [
        { label: 'Studio Factory', href: '/studio', isRouterLink: true },
        { label: 'Playground Studio', href: '/playground', isRouterLink: true },
        { label: 'Robotics 3D', href: '/robotics', isRouterLink: true },
        { label: t('link_vibepath_studio'), href: VIBEPATH_URL, external: true },
        { label: t('link_architecture'), href: '/#bento' },
        { label: t('link_blueprints'), href: '/#blueprint-library' },
      ],
    },
    {
      title: t('col_developers'),
      links: [
        { label: 'Documentation', href: GITHUB_DOCS_URL, external: true },
        { label: 'Flipbook Archive', href: '/library', isRouterLink: true },
        { label: 'API Reference', href: GITHUB_DOCS_URL, external: true },
        { label: 'CLI Tool', href: '/playground', isRouterLink: true },
        { label: 'About Us', href: '/about', isRouterLink: true },
      ],
    },
    {
      title: t('col_craft'),
      links: [
        { label: t('link_about'), href: '/about', isRouterLink: true },
        { label: t('link_manifesto'), href: '/#existential-blackbox' },
        { label: 'Autopilot Studio', href: 'https://dify-n8n-workflow.ai.studio/', external: true },
        { label: 'GitHub Repo', href: GITHUB_DOCS_URL, external: true },
        { label: t('link_contact'), href: 'mailto:mizu2711@gmail.com', external: true },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-zinc-800 bg-[#09090b] font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        {/* CTA banner */}
        <div className="relative border border-zinc-800 bg-zinc-950 p-8 lg:p-12 mb-16 overflow-hidden">
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase text-cyan-glow tracking-widest border border-zinc-800 bg-zinc-900 px-2 py-0.5">
                {t('footer_banner_tag')}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-mono">
                {t('footer_banner_title')}
              </h3>
              <p className="mt-2 text-[14px] text-zinc-400 font-sans max-w-lg">
                {t('footer_banner_desc')}
              </p>
            </div>
            <Link
              to="/studio"
              className="group inline-flex items-center gap-2 border border-zinc-200 bg-white text-black text-xs font-bold px-5 py-3 hover:bg-zinc-200 transition-colors shrink-0 uppercase"
            >
              {t('footer_start_building')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <BrutalistLogo size={36} subtag={t('logo_subtag')} className="mb-4" />
            <p className="text-[12.5px] text-zinc-400 font-sans leading-relaxed max-w-xs border-l-2 border-[#5322ff] pl-3">
              {t('footer_brand_desc')}
            </p>
            <div className="flex items-center gap-2 mt-5">
              <a
                href={GITHUB_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/thuy-thu-vu-271190"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:mizu2711@gmail.com"
                className="h-8 w-8 border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.isRouterLink ? (
                      <Link
                        to={l.href}
                        className="text-[12px] text-zinc-400 hover:text-white transition-colors"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        target={l.external ? '_blank' : undefined}
                        rel={l.external ? 'noopener noreferrer' : undefined}
                        className="text-[12px] text-zinc-400 hover:text-white transition-colors"
                      >
                        {l.label}
                        {l.external && ' ↗'}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-zinc-500">
            <div>{t('copyright_text')}</div>
            <button
              onClick={() => setIsJulesModalOpen(true)}
              className="px-3 py-1.5 border border-[#8A2BE2]/40 bg-[#8A2BE2]/10 hover:bg-[#8A2BE2]/20 text-xs font-mono text-zinc-300 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#8A2BE2] animate-pulse" />
              <span>BUILT BY HUMANS & GOOGLE JULES AGENT ↗</span>
            </button>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t('status_online')}
            </span>
            <span>·</span>
            <a href="#" className="hover:text-zinc-300">{t('privacy')}</a>
            <a href="#" className="hover:text-zinc-300">{t('terms')}</a>
          </div>
        </div>
      </div>

      {/* Jules Memorial Modal */}
      <JulesMemorialModal
        isOpen={isJulesModalOpen}
        onClose={() => setIsJulesModalOpen(false)}
      />
    </footer>
  );
}
