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
  Code2,
  Terminal,
} from 'lucide-react';
import pipelineBlueprintsData from '@/data/pipeline-blueprints.json';
import { useTranslation } from '@/context/useLanguage';

export interface BlueprintNode {
  step: number;
  id: string;
  name: string;
  type: string;
  engine: string;
  latency: string;
  output: string;
}

export interface PipelineBlueprint {
  id: string;
  slug: string;
  name: string;
  category: string;
  tier: 'Core' | 'Advanced' | 'Expert';
  node_count: number;
  description: string;
  cli_deploy: string;
  nodes: BlueprintNode[];
  config_parameters: Record<string, unknown>;
}

const BLUEPRINTS = (pipelineBlueprintsData.blueprints || []) as PipelineBlueprint[];

function tierColor(tier: PipelineBlueprint['tier']) {
  if (tier === 'Core') return 'text-emerald-400 border-emerald-400/40 bg-emerald-950/30';
  if (tier === 'Advanced') return 'text-cyan-glow border-cyan-glow/40 bg-cyan-950/30';
  return 'text-white border-[#5322ff] bg-[#5322ff]/20';
}

function tierAccent(tier: PipelineBlueprint['tier']): string {
  if (tier === 'Core') return '#10b981';
  if (tier === 'Advanced') return '#00E5FF';
  return '#5322ff';
}

function isKeyExecutionNode(type: string): boolean {
  return [
    'AI_INFERENCE',
    'NUMPY_MATH',
    'GAUSSIAN_RENDER',
    'SDK_CONTROLLER',
    'FRONTEND_VIEWPORT',
    'MULTI_LAYER_MERGE',
  ].includes(type);
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
  const { t } = useTranslation();

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
        <div className="border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-cyan-glow" />
              <span className="text-[13px] font-bold text-white uppercase">{t('export_preview_title')}</span>
              <span className="text-[10px] text-zinc-500 ml-1">HD · 2160PX</span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 bg-[#09090b] flex items-center justify-center max-h-[70vh] overflow-auto">
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
              className="inline-flex items-center gap-2 border border-zinc-200 bg-white text-black text-[12px] font-bold px-4 py-2 hover:bg-zinc-200 transition-colors uppercase"
            >
              <Download className="h-4 w-4" />
              {t('download_png')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InspectAstModal({
  bp,
  onClose,
}: {
  bp: PipelineBlueprint;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [copiedAst, setCopiedAst] = useState(false);
  const jsonContent = JSON.stringify(bp, null, 2);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonContent);
    } catch {
      /* clipboard fallback */
    }
    setCopiedAst(true);
    setTimeout(() => setCopiedAst(false), 1800);
  };

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
        className="relative max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-glow" />
              <span className="text-[13px] font-bold text-white uppercase">{t('inspectAst')}</span>
              <span className="text-[10px] text-zinc-500 ml-1">AST SCHEMA // {bp.id}</span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 bg-[#09090b] max-h-[65vh] overflow-auto">
            <pre className="text-[11px] text-zinc-300 font-mono leading-relaxed overflow-x-auto p-4 bg-zinc-950 border border-zinc-800/80">
              <code>{jsonContent}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800 bg-zinc-950">
            <span className="text-[10px] text-zinc-500 uppercase">
              AST VALIDATOR: DETERMINISTIC SCHEMA v1.0.0
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyJson}
                className="inline-flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 text-zinc-200 text-[11px] font-bold px-3 py-1.5 hover:bg-zinc-800 hover:text-white transition-colors uppercase"
              >
                {copiedAst ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    {t('copyJson')}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center border border-zinc-200 bg-white text-black text-[11px] font-bold px-4 py-1.5 hover:bg-zinc-200 transition-colors uppercase"
              >
                X
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BlueprintCard({ bp, index }: { bp: PipelineBlueprint; index: number }) {
  const { t } = useTranslation();
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedApi, setCopiedApi] = useState(false);
  const [exported, setExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inspectOpen, setInspectOpen] = useState(false);

  const accent = tierAccent(bp.tier);
  const exportRef = useRef<HTMLDivElement>(null);
  const pendingDataUrl = useRef<string | null>(null);

  const copyCli = async () => {
    try {
      await navigator.clipboard.writeText(bp.cli_deploy);
    } catch {
      /* clipboard fallback */
    }
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1800);
  };

  const copyApi = async () => {
    try {
      await navigator.clipboard.writeText(bp.cli_deploy);
    } catch {
      /* clipboard fallback */
    }
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 1800);
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
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative border border-zinc-800 bg-zinc-950 font-mono hover:border-zinc-700 transition-colors flex flex-col justify-between"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ background: accent }}
      />

      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                  {bp.category}
                </span>
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 border ${tierColor(bp.tier)}`}
                >
                  {bp.tier}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-white uppercase tracking-tight leading-snug">
                {bp.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-[18px] font-bold text-white">{bp.node_count}</div>
              <div className="font-mono text-[8px] text-zinc-500 uppercase">NODES</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-[12.5px] text-zinc-400 font-sans leading-relaxed mb-5">
            {bp.description}
          </p>

          {/* Node Workflow Diagram: Horizontal sequence connected with arrows */}
          <div className="border border-zinc-800 bg-[#09090b] p-3 mb-4 overflow-x-auto">
            <div className="flex items-stretch gap-1.5 min-w-max py-1">
              {bp.nodes.map((node, i) => {
                const isKeyNode = isKeyExecutionNode(node.type);
                const borderColor = isKeyNode ? accent : 'rgba(63,63,70,0.8)';
                return (
                  <div key={node.id} className="flex items-center gap-1.5">
                    <div
                      className="flex flex-col justify-between border px-2.5 py-2 min-w-[125px] max-w-[145px] bg-zinc-950 text-left transition-colors"
                      style={{
                        borderColor,
                        boxShadow: isKeyNode ? `0 0 10px ${accent}22` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between text-[8px] text-zinc-500 mb-1 border-b border-zinc-900 pb-1">
                        <span className="font-mono text-cyan-glow">0{node.step}</span>
                        <span className="font-mono text-[7.5px] uppercase tracking-wider text-zinc-400 truncate max-w-[70px]">
                          {node.type}
                        </span>
                      </div>
                      <div className="text-[9.5px] font-bold text-white mb-1.5 leading-tight truncate" title={node.name}>
                        {node.name}
                      </div>
                      <div className="flex flex-col gap-0.5 text-[8px] text-zinc-400">
                        <span className="truncate text-zinc-400" title={node.engine}>
                          ⚡ {node.engine}
                        </span>
                        <div className="flex items-center justify-between text-[7.5px] text-zinc-500 mt-0.5">
                          <span>{node.latency}</span>
                          <span className="text-zinc-500 truncate max-w-[55px]" title={node.output}>
                            {node.output}
                          </span>
                        </div>
                      </div>
                    </div>
                    {i < bp.nodes.length - 1 && (
                      <span className="text-zinc-500 text-xs px-0.5 select-none font-bold">➔</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLI Code Block with Copy Button */}
          <div className="border border-zinc-800 bg-zinc-900 px-3 py-2 mb-4 font-mono text-[10.5px] text-zinc-300 flex items-center justify-between gap-2 overflow-hidden group/cli">
            <div className="truncate flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-cyan-glow shrink-0" />
              <span className="truncate">{bp.cli_deploy}</span>
            </div>
            <button
              onClick={copyCli}
              className="shrink-0 text-zinc-400 hover:text-white transition-colors"
              title="Copy CLI command"
            >
              {copiedCli ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons: COPY API, EXPORT HD DIAGRAM, INSPECT AST JSON */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyApi}
              className="inline-flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900 text-[11px] font-bold text-zinc-300 px-3 py-2 hover:bg-zinc-800 hover:text-white transition-colors uppercase"
            >
              {copiedApi ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  {t('copyApi')}
                </>
              )}
            </button>
            <button
              onClick={() => setInspectOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900 text-[11px] font-bold text-zinc-300 px-3 py-2 hover:bg-zinc-800 hover:text-white transition-colors uppercase"
            >
              <Code2 className="h-3.5 w-3.5 text-cyan-glow" />
              {t('inspectAst')}
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
                <span>{t('rendering_hd')}</span>
              </>
            ) : exported ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t('preview_ready')}</span>
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5" style={{ color: accent }} />
                {t('exportDiagram')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden export-only container for High-Definition image capture */}
      <div style={{ position: 'absolute', left: '-99999px', top: 0, pointerEvents: 'none' }}>
        <div
          ref={exportRef}
          style={{
            width: '840px',
            background: '#09090b',
            border: `2px solid ${accent}`,
            padding: '40px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #27272a', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#000',
                  fontSize: '14px',
                }}
              >
                AC
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
                  ARTIFICIAL CRAFT // BLUEPRINT
                </div>
                <div style={{ fontSize: '11px', color: '#00E5FF' }}>
                  PRODUCTION PIPELINE :: {bp.category.toUpperCase()}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{bp.node_count} NODES</div>
              <div style={{ fontSize: '9px', color: '#71717a', textTransform: 'uppercase' }}>TIER: {bp.tier}</div>
            </div>
          </div>

          <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
            {bp.name}
          </div>
          <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '24px', lineHeight: '1.5' }}>
            {bp.description}
          </div>

          {/* Step Sequence in Export */}
          <div
            style={{
              background: '#050507',
              border: '1px solid #3f3f46',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              {bp.nodes.map((node, i) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      border: `1px solid ${isKeyExecutionNode(node.type) ? accent : '#52525b'}`,
                      padding: '10px 12px',
                      background: '#09090b',
                      minWidth: '115px',
                    }}
                  >
                    <div style={{ fontSize: '8px', color: '#00E5FF', marginBottom: '4px' }}>
                      STEP 0{node.step} // {node.type}
                    </div>
                    <div style={{ fontSize: '10px', color: '#fff', fontWeight: 700, marginBottom: '4px' }}>
                      {node.name}
                    </div>
                    <div style={{ fontSize: '8px', color: '#71717a' }}>{node.engine}</div>
                  </div>
                  {i < bp.nodes.length - 1 && <span style={{ color: accent, fontSize: '14px' }}>➔</span>}
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
            {bp.cli_deploy}
          </div>
        </div>
      </div>

      {/* Export Preview Modal */}
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

      {/* Inspect AST JSON Modal */}
      <AnimatePresence>
        {inspectOpen && (
          <InspectAstModal
            bp={bp}
            onClose={() => setInspectOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BlueprintLibrary() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 lg:py-28 bg-[#09090b] font-mono" id="blueprints">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-3 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
          <span className="h-1.5 w-1.5 bg-[#5322ff]" />
          {t('bp_section_label')}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl uppercase leading-[1.05]"
          >
            {t('bp_title_line1')}
            <br />
            <span className="text-zinc-500">{t('bp_title_line2')}</span>
          </motion.h2>
          <p className="max-w-md text-[14px] text-zinc-400 font-sans leading-relaxed border-l-2 border-[#5322ff] pl-3">
            {t('bp_desc')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {BLUEPRINTS.map((bp, i) => (
            <BlueprintCard key={bp.id} bp={bp} index={i} />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center gap-3">
            <Boxes className="h-6 w-6 text-cyan-glow" />
            <div>
              <div className="text-[13px] font-bold text-white uppercase">{t('bp_banner_title')}</div>
              <div className="text-[11px] text-zinc-500">{t('bp_banner_sub')}</div>
            </div>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-1.5 text-[12px] font-bold text-cyan-glow hover:text-white transition-colors uppercase"
          >
            {t('bp_browse_all')}
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
