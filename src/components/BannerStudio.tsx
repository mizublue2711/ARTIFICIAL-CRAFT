import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Layout } from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';

export default function BannerStudio() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('Alex Rivera');
  const [companyDomain, setCompanyDomain] = useState('artcraft.io');
  const [jobTitle, setJobTitle] = useState('Principal AI Engineer');
  const [palette, setPalette] = useState('swiss');

  return (
    <section className="relative py-20 bg-[#09090b] border-t border-zinc-800/80 font-mono" id="banner-studio">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
          <span className="h-1.5 w-1.5 bg-[#5322ff]" />
          STUDIO // GENERATOR
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-mono mb-8">
          {t('banner_studio_title')}
        </h2>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-5 border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                {t('banner_full_name')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                {t('banner_company_domain')}
              </label>
              <input
                type="text"
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                {t('banner_job_title')}
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                {t('banner_palette')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPalette('swiss')}
                  className={`px-2 py-2 text-[10px] border font-bold uppercase transition-colors ${
                    palette === 'swiss'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {t('banner_palette_swiss')}
                </button>
                <button
                  type="button"
                  onClick={() => setPalette('cyan')}
                  className={`px-2 py-2 text-[10px] border font-bold uppercase transition-colors ${
                    palette === 'cyan'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {t('banner_palette_cyan')}
                </button>
                <button
                  type="button"
                  onClick={() => setPalette('purple')}
                  className={`px-2 py-2 text-[10px] border font-bold uppercase transition-colors ${
                    palette === 'purple'
                      ? 'border-[#5322ff] bg-[#5322ff]/20 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {t('banner_palette_purple')}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-4 inline-flex items-center justify-center gap-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-[12px] font-bold text-white px-4 py-3 hover:bg-[#00E5FF]/20 transition-colors uppercase"
            >
              <Download className="h-4 w-4 text-[#00E5FF]" />
              {t('banner_export_button')}
            </button>
          </div>

          {/* Banner Preview Canvas */}
          <div className="lg:col-span-7">
            <div className="border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between mb-3 text-[10px] text-zinc-500 uppercase">
                <span className="flex items-center gap-1.5">
                  <Layout className="h-3.5 w-3.5 text-cyan-glow" />
                  LINKEDIN CANVAS (1584 x 396)
                </span>
                <span>SWISS GRID RESOLUTION</span>
              </div>

              <motion.div
                key={palette}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className={`aspect-[4/1] relative p-6 flex flex-col justify-between overflow-hidden border ${
                  palette === 'swiss'
                    ? 'bg-[#09090b] border-zinc-700 text-white'
                    : palette === 'cyan'
                    ? 'bg-zinc-950 border-[#00E5FF] text-cyan-glow'
                    : 'bg-[#0b061a] border-[#5322ff] text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 border-zinc-700 bg-black/40">
                    {companyDomain || 'artcraft.io'}
                  </span>
                  <Sparkles className="h-4 w-4 text-cyan-glow" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    {fullName || 'Alex Rivera'}
                  </h3>
                  <p className="text-xs font-mono opacity-80 mt-1">
                    {jobTitle || 'Principal AI Engineer'}
                  </p>
                </div>

                <div className="text-[8px] tracking-widest opacity-50 uppercase">
                  ARTIFICIAL CRAFT // SWISS GRAPHIC AUTOMATION
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
