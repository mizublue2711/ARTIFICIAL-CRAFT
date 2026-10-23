import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Layout } from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getCompanyInitials(domainOrUrl: string, fullName: string): string {
  let str = domainOrUrl.trim();
  if (!str) {
    str = fullName.trim();
  }
  if (!str) return 'AC';

  if (str.startsWith('http://') || str.startsWith('https://')) {
    try {
      str = new URL(str).hostname;
    } catch {
      str = str.replace(/^https?:\/\//i, '');
    }
  }

  str = str.replace(/^www\./i, '').split('/')[0];
  const parts = str.split('.');
  if (parts.length > 1 && parts[0]) {
    str = parts[0];
  }

  const words = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].substring(0, 2).toUpperCase();
  }
  if (words.length === 1 && words[0].length === 1) {
    return words[0].toUpperCase();
  }
  return 'AC';
}

function createPRNG(seed: number) {
  let s = seed || 1234567;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function BannerStudio() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('This is your LinkedIn banner');
  const [companyDomain, setCompanyDomain] = useState('artcraft.io');
  const [jobTitle, setJobTitle] = useState('Principal AI Engineer');
  const [industry, setIndustry] = useState<'tech' | 'design' | 'finance' | 'marketing'>('tech');
  const [palette, setPalette] = useState('swiss');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawBlueprintLayer = (
    ctx: CanvasRenderingContext2D,
    currentTheme: { blueprintColor: string; borderColor: string; accentColor: string },
    name: string,
    ind: 'tech' | 'design' | 'finance' | 'marketing',
    width: number,
    height: number
  ) => {
    const seed = hashCode(name || 'Your Name');
    const rng = createPRNG(seed);

    ctx.save();
    ctx.strokeStyle = currentTheme.blueprintColor;
    ctx.fillStyle = currentTheme.blueprintColor;

    if (ind === 'tech') {
      // "Tech / AI / Data": Neural Nodes, 45-degree data pipelines, 3px node anchors
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;

      const numNodes = 18;
      const nodes: { x: number; y: number }[] = [];

      for (let i = 0; i < numNodes; i++) {
        const x = 500 + rng() * (width - 560);
        const y = 40 + rng() * (height - 80);
        nodes.push({ x, y });
      }

      // Draw 3px node anchors
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 45-degree data pipelines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[j].x - nodes[i].x, nodes[j].y - nodes[i].y);
          if (dist < 260) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const midX = nodes[i].x + Math.sign(dx) * Math.min(Math.abs(dx), Math.abs(dy));
            const midY = nodes[i].y + Math.sign(dy) * Math.min(Math.abs(dx), Math.abs(dy));

            ctx.lineTo(midX, midY);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(midX, midY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    } else if (ind === 'design') {
      // "Design / Frontend": Swiss Grid bounds, 1px dimension lines (W:1024px / H:512px)
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;

      const cols = 12;
      const startX = 520;
      const gridWidth = width - startX - 60;
      const colStep = gridWidth / cols;

      for (let c = 0; c <= cols; c++) {
        const x = startX + c * colStep;
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(x, 30);
        ctx.lineTo(x, height - 30);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const dimY = 50;
      const dimStartX = 600;
      const dimEndX = 1400;

      ctx.beginPath();
      ctx.moveTo(dimStartX, dimY);
      ctx.lineTo(dimEndX, dimY);
      ctx.moveTo(dimStartX, dimY - 6);
      ctx.lineTo(dimStartX, dimY + 6);
      ctx.moveTo(dimEndX, dimY - 6);
      ctx.lineTo(dimEndX, dimY + 6);
      ctx.stroke();

      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('W:1024px / H:512px', (dimStartX + dimEndX) / 2, dimY - 4);

      const dimX = width - 40;
      const dimTopY = 80;
      const dimBotY = height - 80;

      ctx.beginPath();
      ctx.moveTo(dimX, dimTopY);
      ctx.lineTo(dimX, dimBotY);
      ctx.moveTo(dimX - 6, dimTopY);
      ctx.lineTo(dimX + 6, dimTopY);
      ctx.moveTo(dimX - 6, dimBotY);
      ctx.lineTo(dimX + 6, dimBotY);
      ctx.stroke();

      for (let b = 0; b < 3; b++) {
        const fx = startX + Math.floor(rng() * 6) * colStep;
        const fy = 90 + Math.floor(rng() * 3) * 60;
        const fw = (1 + Math.floor(rng() * 4)) * colStep;
        const fh = 60 + Math.floor(rng() * 2) * 50;

        ctx.strokeRect(fx, fy, fw, fh);
        ctx.fillText(`BOX_0${b + 1} [GRID_BOUNDS]`, fx + 8, fy + 16);
      }
    } else if (ind === 'finance') {
      // "Finance / Crypto": Algorithmic Candlestick charts & subtle background hash strings
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;

      const numCandles = 28;
      const startX = 520;
      const candleSpacing = (width - startX - 80) / numCandles;
      let basePrice = 180 + rng() * 40;

      for (let k = 0; k < numCandles; k++) {
        const cx = startX + k * candleSpacing + candleSpacing / 2;
        const priceChange = (rng() - 0.48) * 45;
        const openPrice = basePrice;
        const closePrice = openPrice + priceChange;
        const highPrice = Math.min(60, Math.min(openPrice, closePrice) - rng() * 25);
        const lowPrice = Math.max(height - 60, Math.max(openPrice, closePrice) + rng() * 25);

        ctx.beginPath();
        ctx.moveTo(cx, highPrice);
        ctx.lineTo(cx, lowPrice);
        ctx.stroke();

        const bodyTop = Math.min(openPrice, closePrice);
        const bodyHeight = Math.max(4, Math.abs(closePrice - openPrice));
        const bodyWidth = Math.max(4, candleSpacing * 0.55);

        if (closePrice >= openPrice) {
          ctx.strokeRect(cx - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
        } else {
          ctx.fillRect(cx - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
        }

        basePrice = closePrice;
      }

      ctx.globalAlpha = 0.18;
      ctx.font = '400 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';

      for (let h = 0; h < 8; h++) {
        const hx = 500 + rng() * 650;
        const hy = 50 + rng() * 280;
        const hashStr =
          '0x' +
          Array.from({ length: 16 }, () => Math.floor(rng() * 16).toString(16))
            .join('')
            .toUpperCase();
        ctx.fillText(`HASH // ${hashStr}`, hx, hy);
      }
    } else if (ind === 'marketing') {
      // "Marketing / Creator": Waveform sine curves & dot-matrix density grids
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.5;

      for (let w = 0; w < 3; w++) {
        const amplitude = 30 + rng() * 40;
        const frequency = 0.005 + rng() * 0.008;
        const phase = rng() * Math.PI * 2;
        const cY = 180 + (w - 1) * 50;

        ctx.beginPath();
        for (let x = 480; x <= width - 40; x += 6) {
          const y = cY + Math.sin(x * frequency + phase) * amplitude;
          if (x === 480) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 0.25;
      const startX = 520;
      const startY = 60;
      const rows = 8;
      const cols = 20;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = startX + c * 48;
          const dy = startY + r * 34;
          const density = Math.sin(r * 0.5 + c * 0.3 + seed * 0.001) * 0.5 + 0.5;
          const dotRadius = 1 + density * 2.5;

          ctx.beginPath();
          ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  };

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
        accentColor: '#ffffff',
        subTextColor: '#a1a1aa',
        borderColor: '#27272a',
        badgeBg: 'rgba(24, 24, 27, 0.8)',
        blueprintColor: '#ffffff',
      },
      purple: {
        bg: '#0b061a',
        textColor: '#ffffff',
        accentColor: '#a855f7',
        subTextColor: '#c084fc',
        borderColor: '#5322ff',
        badgeBg: 'rgba(83, 34, 255, 0.2)',
        blueprintColor: '#5322ff',
      },
      amber: {
        bg: '#0c0a09',
        textColor: '#fef3c7',
        accentColor: '#f59e0b',
        subTextColor: '#d97706',
        borderColor: '#78350f',
        badgeBg: 'rgba(245, 158, 11, 0.15)',
        blueprintColor: '#f59e0b',
      },
      cyan: {
        bg: '#030712',
        textColor: '#00E5FF',
        accentColor: '#00E5FF',
        subTextColor: '#38bdf8',
        borderColor: '#0e7490',
        badgeBg: 'rgba(6, 182, 212, 0.1)',
        blueprintColor: '#00E5FF',
      },
    };

    const currentTheme = themes[palette as keyof typeof themes] || themes.swiss;

    // 1. Draw Background
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Generative Blueprint Layer BEFORE Typography & Logos
    drawBlueprintLayer(ctx, currentTheme, fullName, industry, width, height);

    // 3. Draw Swiss Grid Lines & Decorative accents
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
    ctx.fillText((fullName || 'Your Name').toUpperCase(), 60, 185);

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
    let domainText = (companyDomain || 'artcraft.io').trim();
    if (domainText.startsWith('http://') || domainText.startsWith('https://')) {
      try {
        domainText = new URL(domainText).hostname;
      } catch {
        // fallback
      }
    }
    domainText = domainText.toLowerCase();

    ctx.font = '600 18px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(domainText).width;

    const logoSize = 28;
    const padding = 12;

    const renderBadge = (logoImg?: HTMLImageElement) => {
      const startX = 60;
      const startY = 45;
      const badgeHeight = 42;
      const badgeWidth = logoSize + padding * 3 + textWidth;

      // Clear badge background area to prevent ghosting on async redraws
      ctx.fillStyle = currentTheme.bg;
      ctx.fillRect(startX - 2, startY - 2, badgeWidth + 20, badgeHeight + 4);

      // Badge Container
      ctx.fillStyle = currentTheme.badgeBg;
      ctx.fillRect(startX, startY, badgeWidth, badgeHeight);
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, startY, badgeWidth, badgeHeight);

      const boxX = startX + padding;
      const boxY = startY + (badgeHeight - logoSize) / 2;

      // Logo Anchor Box Outer Border
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX, boxY, logoSize, logoSize);

      let renderedImageSuccess = false;

      // Offscreen Canvas for Logo Tinting
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

            ctx.drawImage(offCanvas, boxX, boxY, logoSize, logoSize);
            renderedImageSuccess = true;
          }
        } catch (e) {
          console.error('Offscreen logo tinting failed:', e);
        }
      }

      // Fallback: Display Company Initials in JetBrains Mono inside logo anchor box if image absent/failed
      if (!renderedImageSuccess) {
        const initials = getCompanyInitials(companyDomain, fullName);
        ctx.fillStyle = currentTheme.accentColor;
        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, boxX + logoSize / 2, boxY + logoSize / 2 + 1);
      }

      // Domain Text inside Badge
      const textX = boxX + logoSize + padding;
      ctx.fillStyle = currentTheme.textColor;
      ctx.font = '600 18px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(domainText, textX, startY + badgeHeight / 2);
    };

    const trimmedInput = companyDomain.trim();
    if (trimmedInput) {
      // Synchronously render initial badge with initials fallback while image loads
      renderBadge();

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        renderBadge(img);
      };
      img.onerror = () => {
        renderBadge();
      };
      const isDirectUrl = trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://');
      const paramName = isDirectUrl ? 'url' : 'domain';
      img.src = `/api/logo-proxy?${paramName}=${encodeURIComponent(trimmedInput)}`;
    } else {
      renderBadge();
    }
  }, [fullName, companyDomain, jobTitle, industry, palette]);

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
        <div className="inline-flex items-c gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
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
                placeholder="artcraft.io or https://..."
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
                {t('banner_industry')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIndustry('tech')}
                  className={`px-2.5 py-2 text-[10px] border font-bold uppercase transition-colors text-left flex items-c justify-between ${
                    industry === 'tech'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span>{t('banner_industry_tech')}</span>
                  {industry === 'tech' && <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIndustry('design')}
                  className={`px-2.5 py-2 text-[10px] border font-bold uppercase transition-colors text-left flex items-center justify-between ${
                    industry === 'design'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span>{t('banner_industry_design')}</span>
                  {industry === 'design' && <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIndustry('finance')}
                  className={`px-2.5 py-2 text-[10px] border font-bold uppercase transition-colors text-left flex items-center justify-between ${
                    industry === 'finance'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span>{t('banner_industry_finance')}</span>
                  {industry === 'finance' && <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIndustry('marketing')}
                  className={`px-2.5 py-2 text-[10px] border font-bold uppercase transition-colors text-left flex items-center justify-between ${
                    industry === 'marketing'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span>{t('banner_industry_marketing')}</span>
                  {industry === 'marketing' && <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                {t('banner_palette')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPalette('purple')}
                  className={`px-2 py-2 text-[10px] border font-bold uppercase transition-colors ${
                    palette === 'purple'
                      ? 'border-[#5322ff] bg-[#5322ff]/20 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {t('banner_palette_purple')}
                </button>
                <button
                  type="button"
                  onClick={() => setPalette('swiss')}
                  className={`px-2 py-2 text-[10px] border font-bold uppercase transition-colors ${
                    palette === 'swiss'
                      ? 'border-white bg-white/10 text-white'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {t('banner_palette_swiss')}
                </button>
                <button
                  type="button"
                  onClick={() => setPalette('amber')}
                  className={`px-2 py-2 text-[10px] border font-bold uppercase transition-colors ${
                    palette === 'amber'
                      ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {t('banner_palette_amber')}
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

            {/* High-Tech Terminal System Log Box */}
            <div className="mt-4 border border-zinc-800 bg-black p-3.5 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2 text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    TERMINAL // CANVAS_ENGINE_V3.0
                  </span>
                </div>
                <span className="text-[10px] text-zinc-600">STATUS: ONLINE</span>
              </div>
              <div className="text-emerald-400 tracking-wide font-medium break-all">
                {`SYSTEM LOG: GENETIC ALGORITHM ACTIVE // SEED: 0x${hashCode(fullName || 'Your Name')
                  .toString(16)
                  .toUpperCase()
                  .padStart(8, '0')} // 100% UNIQUE ARTIFACT`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
