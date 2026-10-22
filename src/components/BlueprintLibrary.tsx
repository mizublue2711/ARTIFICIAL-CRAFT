import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  Copy,
  Check,
  Camera,
  Download,
  ArrowUpRight,
  Boxes,
  Loader2,
  X,
  ImageIcon,
} from 'lucide-react';
import { BLUEPRINTS, type Blueprint } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';

function accentHex(accent: 'cyan' | 'purple') {
  return accent === 'cyan' ? '#00E5FF' : '#5322ff';
}

function difficultyColor(d: Blueprint['difficulty']) {
  if (d === 'Core') return 'text-emerald-400 border-emerald-400/40 bg-emerald-950/30';
  if (d === 'Advanced') return 'text-cyan-glow border-cyan-glow/40 bg-cyan-950/30';
  return 'text-white border-[#5322ff] bg-[#5322ff]/20';
}

function NodeIcon({ icon: Icon, color }: { icon: typeof Camera; color: string }) {
  return <Icon size={16} color={color} />;
}

function ExportPreviewModal({
  dataUrl,
  onClose,
  onDownload,
}: {
  dataUrl: string;
  onClose: () => void;
  onDownload: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-cyan-glow" />
              <span className="text-[13px] font-bold text-white uppercase">EXPORT PREVIEW</span>
              <span className="text-[10px] text-zinc-500 ml-1">HD · 2160PX</span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 bg-[#09090b] flex items-center justify-center">
            <img
              src={dataUrl}
              alt="Blueprint export preview"
              className="max-w-full border border-zinc-800"
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase">
              ARTIFICIAL CRAFT // SWISS GRID EXPORT
            </span>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 border border-zinc-200 bg-white text-black text-[12px] font-bold px-4 py-2 hover:bg-zinc-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              DOWNLOAD PNG
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BlueprintCard({ bp, index }: { bp: Blueprint; index: number }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const accent = accentHex(bp.accent);
  const exportRef = useRef<HTMLDivElement>(null);
  const pendingDataUrl = useRef<string | null>(null);

  const copyApi = async () => {
    try {
      await navigator.clipboard.writeText(bp.api);
    } catch {
      /* clipboard fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const exportScreenshot = async () => {
    if (!exportRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 3,
        backgroundColor: '#0b0b0f',
        cacheBust: true,
      });
      pendingDataUrl.current = dataUrl;
      setPreviewUrl(dataUrl);
      setExported(true);
      setTimeout(() => setExported(false), 1800);
    } catch {
      /* export fail */
    } finally {
      setExporting(false);
    }
  };

  const downloadImage = () => {
    if (!pendingDataUrl.current) return;
    const link = document.createElement('a');
    link.download = `artcraft-${bp.id}-blueprint.png`;
    link.href = pendingDataUrl.current;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative border border-zinc-800 bg-zinc-950 font-mono hover:border-zinc-700 transition-colors"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ background: accent }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                {bp.category}
              </span>
              <span
                className={`font-mono text-[9px] px-1.5 py-0.5 border ${difficultyColor(bp.difficulty)}`}
              >
                {bp.difficulty}
              </span>
            </div>
            <h3 className="text-[15px] font-bold text-white uppercase tracking-tight leading-snug">
              {bp.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-[18px] font-bold text-white">{bp.nodes}</div>
            <div className="font-mono text-[8px] text-zinc-500 uppercase">NODES</div>
          </div>
        </div>

        <p className="text-[12.5px] text-zinc-400 font-sans leading-relaxed mb-5">{bp.tagline}</p>

        {/* Node preview */}
        <div className="border border-zinc-800 bg-[#09090b] p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            {bp.nodes_preview.map((n, i) => (
              <div key={i} className="flex items-center gap-1.5 flex-1">
                <div
                  className="flex flex-col items-center gap-1 border px-2 py-1.5 flex-1 bg-zinc-950"
                  style={{ borderColor: n.type === 'dify' ? `${accent}` : 'rgba(63,63,70,0.8)' }}
                >
                  <n.icon className="h-3.5 w-3.5" style={{ color: n.type === 'dify' ? accent : '#a1a1aa' }} />
                  <span className="text-[9px] text-zinc-300 text-center leading-tight">{n.label}</span>
                </div>
                {i < bp.nodes_preview.length - 1 && (
                  <span className="text-zinc-600 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* API line */}
        <div className="border border-zinc-800 bg-zinc-900 px-3 py-2 mb-4 font-mono text-[10.5px] text-zinc-300 overflow-hidden">
          <span className="text-cyan-glow">$</span> {bp.api}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={copyApi}
              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900 text-[11px] font-bold text-zinc-300 px-3 py-2 hover:bg-zinc-800 hover:text-white transition-colors uppercase"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  COPY API
                </>
              )}
            </button>
            <button
              className="inline-flex items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-300 px-3 py-2 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Download template"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={exportScreenshot}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 border text-[11.5px] font-bold px-3 py-2 transition-all uppercase disabled:opacity-50"
            style={{
              borderColor: `${accent}`,
              background: `${accent}18`,
              color: '#ffffff',
            }}
          >
            {exporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: accent }} />
                <span>RENDERING HD...</span>
              </>
            ) : exported ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">PREVIEW READY</span>
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5" style={{ color: accent }} />
                {t.exportBlueprint}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden export-only container */}
      <div style={{ position: 'absolute', left: '-99999px', top: 0, pointerEvents: 'none' }}>
        <div
          ref={exportRef}
          style={{
            width: '720px',
            background: '#09090b',
            border: '2px solid #5322ff',
            padding: '40px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                background: '#5322ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '13px',
              }}
            >
              AC
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>
                ARTIFICIAL CRAFT
              </div>
              <div style={{ fontSize: '10px', color: '#00E5FF' }}>
                CRAFT//CODE · BLUEPRINT :: {bp.category}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
            {bp.name}
          </div>
          <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '24px' }}>
            {bp.tagline}
          </div>

          <div
            style={{
              background: '#050507',
              border: '1px solid #3f3f46',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {bp.nodes_preview.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      border: `1px solid ${n.type === 'dify' ? accent : '#52525b'}`,
                      padding: '12px 16px',
                      background: '#09090b',
                      minWidth: '110px',
                      textAlign: 'center',
                    }}
                  >
                    <NodeIcon icon={n.icon} color={n.type === 'dify' ? accent : '#a1a1aa'} />
                    <div style={{ fontSize: '11px', color: '#fff', marginTop: '6px', fontWeight: 600 }}>
                      {n.label}
                    </div>
                  </div>
                  {i < bp.nodes_preview.length - 1 && <span style={{ color: '#00E5FF' }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: '#121218',
              border: '1px solid #3f3f46',
              padding: '12px 16px',
              fontSize: '11px',
              color: '#00E5FF',
            }}
          >
            $ {bp.api}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {previewUrl && (
          <ExportPreviewModal
            dataUrl={previewUrl}
            onClose={() => setPreviewUrl(null)}
            onDownload={() => {
              downloadImage();
              setPreviewUrl(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BlueprintLibrary() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#09090b] font-mono" id="blueprints">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
          <span className="h-1.5 w-1.5 bg-[#5322ff]" />
          BLUEPRINT LIBRARY // TEMPLATES
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl uppercase leading-[1.05]"
          >
            PRODUCTION-READY BLUEPRINTS.
            <br />
            <span className="text-zinc-500">COPY. DEPLOY. SHARE.</span>
          </motion.h2>
          <p className="max-w-md text-[14px] text-zinc-400 font-sans leading-relaxed border-l-2 border-[#5322ff] pl-3">
            Every blueprint ships with a typed API, node topology, and Carbon-style HD Swiss image exporter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLUEPRINTS.map((bp, i) => (
            <BlueprintCard key={bp.id} bp={bp} index={i} />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center gap-3">
            <Boxes className="h-6 w-6 text-cyan-glow" />
            <div>
              <div className="text-[13px] font-bold text-white uppercase">ALL BLUEPRINTS ARE OPEN SOURCE</div>
              <div className="text-[11px] text-zinc-500">MIT LICENSED · CRAFT//CODE CLI READY</div>
            </div>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-1.5 text-[12px] font-bold text-cyan-glow hover:text-white transition-colors uppercase"
          >
            BROWSE ALL 40+ TEMPLATES
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
