import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Layout } from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';

export default function BannerStudio() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('Alex Rivera');
  const [companyDomain, setCompanyDomain] = useState('artcraft.io');
  const [jobTitle, setJobTitle] = useState('Principal AI Engineer');
  const [palette, setPalette] = useState('swiss');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current || (document.getElementById('banner-canvas') as HTMLCanvasElement);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1584;
    const height = 396;

    // Palette themes
    const themes = {
      swiss: {
        bg: '#09090b',
        textColor: '#ffffff',
        accentColor: '#00E5FF',
        subTextColor: '#a1a1aa',
        borderColor: '#27272a',
        badgeBg: 'rgba(24, 24, 27, 0.8)',
      },
      cyan: {
        bg: '#030712',
        textColor: '#00E5FF',
        accentColor: '#00E5FF',
        subTextColor: '#38bdf8',
        borderColor: '#0e7490',
        badgeBg: 'rgba(6, 182, 212, 0.1)',
      },
      purple: {
        bg: '#0b061a',
        textColor: '#ffffff',
        accentColor: '#a855f7',
        subTextColor: '#c084fc',
        borderColor: '#5322ff',
        badgeBg: 'rgba(83, 34, 255, 0.2)',
      },
    };

    const currentTheme = themes[palette as keyof typeof themes] || themes.swiss;

    // 1. Draw Background
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Swiss Grid Lines & Decorative accents
    ctx.strokeStyle = currentTheme.borderColor;
    ctx.lineWidth = 1;

    // Outer frame
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Sub grid lines
    ctx.beginPath();
    ctx.moveTo(60, 110);
    ctx.lineTo(width - 60, 110);
    ctx.moveTo(60, 310);
    ctx.lineTo(width - 60, 310);
    ctx.moveTo(480, 20);
    ctx.lineTo(480, height - 20);
    ctx.stroke();

    // 3. Draw Sparkles / Swiss Accent in top right
    ctx.fillStyle = currentTheme.accentColor;
    ctx.beginPath();
    const sparkX = width - 80;
    const sparkY = 65;
    ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Corner crosshairs
    ctx.beginPath();
    ctx.moveTo(sparkX - 12, sparkY);
    ctx.lineTo(sparkX + 12, sparkY);
    ctx.moveTo(sparkX, sparkY - 12);
    ctx.lineTo(sparkX, sparkY + 12);
    ctx.strokeStyle = currentTheme.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Main Text Content
    // Full Name
    ctx.fillStyle = currentTheme.textColor;
    ctx.font = '900 52px "Inter", sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText((fullName || 'Alex Rivera').toUpperCase(), 60, 185);

    // Job Title
    ctx.fillStyle = currentTheme.subTextColor;
    ctx.font = '500 24px "JetBrains Mono", monospace, monospace';
    ctx.fillText(jobTitle || 'Principal AI Engineer', 60, 245);

    // Footer Text
    ctx.fillStyle = currentTheme.accentColor;
    ctx.font = '600 16px "JetBrains Mono", monospace, monospace';
    ctx.fillText('ARTIFICIAL CRAFT // SWISS GRAPHIC AUTOMATION', 60, 348);

    // System coordinates info text (bottom right)
    ctx.fillStyle = currentTheme.subTextColor;
    ctx.font = '400 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('RES: 1584x396 // SYS_READY', width - 60, 348);

    // 5. Draw Domain & Logo Badge Top-Left
    const domainText = (companyDomain || 'artcraft.io').toLowerCase();
    ctx.font = '600 18px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(domainText).width;

    const logoSize = 28;
    const padding = 12;

    const renderBadge = (logoImg?: HTMLImageElement) => {
      const startX = 60;
      const startY = 45;
      const badgeHeight = 42;
      const badgeWidth = logoImg ? logoSize + padding * 3 + textWidth : padding * 2 + textWidth;

      // Badge Container
      ctx.fillStyle = currentTheme.badgeBg;
      ctx.fillRect(startX, startY, badgeWidth, badgeHeight);
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, badgeWidth, badgeHeight);

      let textX = startX + padding;

      // Offscreen Canvas for Logo Tinting (Requirement 2)
      if (logoImg) {
        try {
          const offCanvas = document.createElement('canvas');
          offCanvas.width = logoImg.naturalWidth || logoSize;
          offCanvas.height = logoImg.naturalHeight || logoSize;
          const offCtx = offCanvas.getContext('2d');

          if (offCtx) {
            offCtx.drawImage(logoImg, 0, 0);
            offCtx.globalCompositeOperation = 'source-in';
            offCtx.fillStyle = currentTheme.accentColor;
            offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

            ctx.drawImage(offCanvas, startX + padding, startY + (badgeHeight - logoSize) / 2, logoSize, logoSize);
          }
        } catch (e) {
          console.error('Offscreen logo tinting failed:', e);
        }
        textX += logoSize + padding;
      }

      // Domain Text inside Badge
      ctx.fillStyle = currentTheme.textColor;
      ctx.font = '600 18px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(domainText, textX, startY + badgeHeight / 2);
    };

    if (companyDomain.trim()) {
      const img = new Image();
      // Requirement 2: Set img.crossOrigin = "anonymous" BEFORE assigning img.src
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        renderBadge(img);
      };
      img.onerror = () => {
        renderBadge();
      };
      img.src = `/api/logo-proxy?domain=${encodeURIComponent(companyDomain.trim())}`;
    } else {
      renderBadge();
    }
  }, [fullName, companyDomain, jobTitle, palette]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      drawCanvas();
    });
  }, [drawCanvas]);

  const handleExport = () => {
    document.fonts.ready.then(() => {
      const canvas = document.getElementById('banner-canvas') as HTMLCanvasElement;
      if (!canvas) return;
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'LinkedIn_Banner_ARTIFICIAL_CRAFT.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Canvas export error:', err);
      }
    });
  };

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
              onClick={handleExport}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-[12px] font-bold text-white px-4 py-3 hover:bg-[#00E5FF]/20 transition-colors uppercase cursor-pointer"
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

              <div className="w-full aspect-[4/1] relative overflow-hidden border border-zinc-800 bg-[#09090b]">
                <canvas
                  id="banner-canvas"
                  ref={canvasRef}
                  width={1584}
                  height={396}
                  className="w-full h-full object-contain block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
