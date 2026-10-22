import { Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import BrutalistLogo from './BrutalistLogo';
import { useTranslation } from '@/context/useLanguage';

export default function Footer() {
  const { t } = useTranslation();

  const cols = [
    {
      title: t('col_engine'),
      links: [
        { label: t('link_architecture'), href: '#architecture' },
        { label: t('link_blueprints'), href: '#blueprints' },
        { label: t('link_telemetry'), href: '#platform' },
        { label: t('link_changelog'), href: '#' },
        { label: t('link_status'), href: '#' },
      ],
    },
    {
      title: t('col_developers'),
      links: [
        { label: t('link_documentation'), href: '#' },
        { label: t('link_api_reference'), href: '#' },
        { label: t('link_cli_tool'), href: '#' },
        { label: t('link_self_host'), href: '#' },
        { label: t('link_github'), href: '#' },
      ],
    },
    {
      title: t('col_craft'),
      links: [
        { label: t('link_about'), href: '#' },
        { label: t('link_manifesto'), href: '#' },
        { label: t('link_careers'), href: '#' },
        { label: t('link_partners'), href: '#' },
        { label: t('link_contact'), href: '#' },
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
            <a
              href="#"
              className="group inline-flex items-center gap-2 border border-zinc-200 bg-white text-black text-xs font-bold px-5 py-3 hover:bg-zinc-200 transition-colors shrink-0 uppercase"
            >
              {t('footer_start_building')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
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
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[12px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {l.label}
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
            {t('copyright_text')}
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
    </footer>
  );
}
