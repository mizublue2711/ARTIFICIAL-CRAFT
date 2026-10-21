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

function accentHex(accent: 'cyan' | 'purple') {
  return accent === 'cyan' ? '#00E5FF' : '#7C3AED';
}

function difficultyColor(d: Blueprint['difficulty']) {
  if (d === 'Core') return 'text-emerald-400 border-emerald-400/30';
  if (d === 'Advanced') return 'text-cyan-glow border-cyan-glow/30';
  return 'text-purple-glow border-purple-glow/30';
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0f] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-cyan-glow" />
              <span className="text-[14px] font-medium text-white">Export Preview</span>
              <span className="font-mono text-[10px] text-zinc-600 ml-1">HD · 2160px</span>
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
              className="max-w-full rounded-lg border border-zinc-800"
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800">
            <span className="font-mono text-[11px] text-zinc-600">
              Carbon / Ray.so style · Watermarked
            </span>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-white text-[#09090b] text-[13px] font-medium px-4 py-2 hover:bg-zinc-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BlueprintCard({ bp, index }: { bp: Blueprint; index: number }) {
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
      /* clipboard may be blocked */
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
        style: { borderRadius: '16px' },
      });
      pendingDataUrl.current = dataUrl;
      setPreviewUrl(dataUrl);
      setExported(true);
      setTimeout(() => setExported(false), 1800);
    } catch {
      /* export failed */
    } finally {
      setExporting(false);
    }
  };

  const downloadImage = () => {
    if (!pendingDataUrl.current) return;
    const link = document.createElement('a');
    link.download = `nexora-${bp.id}-blueprint.png`;
    link.href = pendingDataUrl.current;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative rounded-2xl border border-zinc-800/80 bg-[#0b0b0f] hover:border-zinc-700 transition-colors"
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {bp.category}
              </span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${difficultyColor(bp.difficulty)}`}
              >
                {bp.difficulty}
              </span>
            </div>
            <h3 className="text-[16px] font-semibold text-white tracking-tight leading-snug">
              {bp.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-[20px] font-semibold text-white">{bp.nodes}</div>
            <div className="font-mono text-[9px] text-zinc-600 uppercase">nodes</div>
          </div>
        </div>

        <p className="text-[13px] text-zinc-400 leading-relaxed mb-5">{bp.tagline}</p>

        {/* Node preview */}
        <div className="rounded-xl border border-zinc-800/60 bg-[#09090b] p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            {bp.nodes_preview.map((n, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className="flex flex-col items-center gap-1 rounded-lg border px-2.5 py-2 flex-1"
                  style={{ borderColor: n.type === 'dify' ? `${accent}33` : 'rgba(63,63,70,0.7)' }}
                >
                  <n.icon className="h-3.5 w-3.5" style={{ color: n.type === 'dify' ? accent : '#71717a' }} />
                  <span className="text-[10px] text-zinc-300 text-center leading-tight">{n.label}</span>
                </div>
                {i < bp.nodes_preview.length - 1 && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <div className="h-px w-3 bg-zinc-700" />
                    <div className="h-1 w-1 rounded-full" style={{ background: accent, opacity: 0.5 }} />
                    <div className="h-px w-3 bg-zinc-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-[9px] text-zinc-600">
            {bp.nodes_preview.map((n, i) => (
              <span key={i} className="flex-1 text-center">
                <span style={{ color: n.type === 'dify' ? accent : '#52525b' }}>●</span> {n.type}
              </span>
            ))}
          </div>
        </div>

        {/* API line */}
        <div className="rounded-lg border border-zinc-800/60 bg-[#09090b] px-3 py-2.5 mb-4 font-mono text-[11px] text-zinc-400 overflow-hidden">
          <span className="text-zinc-600">$</span> {bp.api}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={copyApi}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-white/[0.02] text-[12px] text-zinc-300 px-3 py-2 hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Blueprint API
                </>
              )}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-white/[0.02] text-zinc-300 px-3 py-2 hover:bg-white/[0.05] hover:text-white transition-colors"
              title="Download template"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={exportScreenshot}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border text-[12.5px] font-medium px-3 py-2.5 transition-all disabled:opacity-50"
            style={{
              borderColor: `${accent}33`,
              background: `${accent}08`,
              color: '#e4e4e7',
            }}
            title="Export clean screenshot (Carbon / Ray.so style)"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: accent }} />
                <span>Rendering HD image...</span>
              </>
            ) : exported ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Preview ready!</span>
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" style={{ color: accent }} />
                Export Diagram (HD Image)
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
            background: '#0b0b0f',
            border: '1px solid rgba(63,63,70,0.8)',
            borderRadius: '16px',
            padding: '40px',
            fontFamily: 'Inter, sans-serif',
            color: '#e4e4e7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                color: '#fff',
                fontSize: '13px',
              }}
            >
              N
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Nexora</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#71717a' }}>
                Blueprint · {bp.category}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
              {bp.name}
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>{bp.nodes}</div>
              <div style={{ fontSize: '9px', color: '#71717a', textTransform: 'uppercase' }}>nodes</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '28px', lineHeight: 1.5 }}>
            {bp.tagline}
          </div>

          <div
            style={{
              background: '#09090b',
              border: '1px solid rgba(63,63,70,0.6)',
              borderRadius: '12px',
              padding: '28px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {bp.nodes_preview.map((n, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      border: `1px solid ${n.type === 'dify' ? accent + '55' : 'rgba(63,113,122,0.7)'}`,
                      borderRadius: '10px',
                      padding: '14px 18px',
                      minWidth: '120px',
                      background: '#0b0b0f',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: n.type === 'dify' ? accent + '1a' : 'rgba(113,113,122,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <NodeIcon icon={n.icon} color={n.type === 'dify' ? accent : '#a1a1aa'} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#fafafa', fontWeight: 500, textAlign: 'center' }}>
                      {n.label}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#71717a' }}>
                      {n.type}
                    </div>
                  </div>
                  {i < bp.nodes_preview.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
                      <div style={{ height: '1px', width: '24px', background: '#3f3f46' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, opacity: 0.6 }} />
                      <div style={{ height: '1px', width: '24px', background: '#3f3f46' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: '#09090b',
              border: '1px solid rgba(63,63,70,0.6)',
              borderRadius: '8px',
              padding: '14px 16px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#a1a1aa',
              marginBottom: '32px',
            }}
          >
            <span style={{ color: '#52525b' }}>$ </span>
            {bp.api}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(63,63,70,0.5)',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '5px',
                background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
              }}
            />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#52525b' }}>
              Dify-n8n Enterprise Architecture
            </span>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
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
    <section className="relative py-24 lg:py-32" id="blueprints">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500 mb-4">
          <span className="h-px w-6 bg-zinc-700" />
          Blueprint Library
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-white max-w-2xl leading-[1.08]"
          >
            Production-ready templates.
            <br />
            <span className="text-zinc-500">Copy, deploy, share.</span>
          </motion.h2>
          <p className="max-w-md text-[15px] text-zinc-400 leading-relaxed">
            Every blueprint ships with a typed API, node diagram, and a
            Carbon-style HD export — so you can post your architecture to LinkedIn
            before the deploy finishes.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLUEPRINTS.map((bp, i) => (
            <BlueprintCard key={bp.id} bp={bp} index={i} />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-[#0b0b0f] p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-zinc-800 bg-white/[0.02] flex items-center justify-center">
              <Boxes className="h-5 w-5 text-cyan-glow" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-white">All blueprints are open-source</div>
              <div className="text-[12.5px] text-zinc-500">MIT licensed · importable via CLI or API</div>
            </div>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-1.5 text-[13px] text-zinc-300 hover:text-white transition-colors"
          >
            Browse all 40+ templates
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
