import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  X,
  Globe,
  Upload,
  FileSpreadsheet,
  Layers,
  Terminal,
  Palette,
  Type,
  Layout,
  CheckCircle2,
  Sparkles,
  Download,
  AlertCircle,
  Play,
  ArrowRight,
  ChevronRight,
  Box,
} from 'lucide-react';

export type OutputType = 'chart' | 'banner';
export type LayoutStyle = 'swiss' | 'brutalist' | 'cyberpunk';
export type FontFamily = 'Space Grotesk, sans-serif' | 'Inter, sans-serif' | 'JetBrains Mono, monospace';

export interface BrandDNA {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  font: FontFamily;
  layoutStyle: LayoutStyle;
}

interface BatchProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CSV_DATA = [
  { title: 'Q1 Revenue Growth', metric: '$4.2M', change: '+34%', tag: 'FINANCE' },
  { title: 'Neural Model Latency', metric: '14ms', change: '-52%', tag: 'SYSTEMS' },
  { title: 'Active Node Count', metric: '1,280', change: '+18%', tag: 'INFRA' },
  { title: 'Deterministic SLA', metric: '99.99%', change: '+0.01%', tag: 'TELEMETRY' },
  { title: 'Token Fanout Volume', metric: '840M', change: '+120%', tag: 'AGENT' },
  { title: 'Vector DB Indexing', metric: '4.8M/s', change: '+45%', tag: 'DATA' },
];

export default function BatchProductionModal({ isOpen, onClose }: BatchProductionModalProps) {
  // Wizard Step State: 1 = Input Form, 2 = Brand DNA Approval, 3 = Sample Preview & Batch Dispatch
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // STEP 1 Form State
  const [websiteUrl, setWebsiteUrl] = useState('https://artcraft.io');
  const [urlError, setUrlError] = useState('');
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvLink, setCsvLink] = useState('');
  const [csvData, setCsvData] = useState<typeof DEFAULT_CSV_DATA>(DEFAULT_CSV_DATA);
  const [outputType, setOutputType] = useState<OutputType>('banner');

  // STEP 2 Brand DNA State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [brandDna, setBrandDna] = useState<BrandDNA>({
    primary: '#00E5FF',
    secondary: '#5322ff',
    accent: '#D400FF',
    background: '#09090b',
    font: 'Space Grotesk, sans-serif',
    layoutStyle: 'swiss',
  });

  // STEP 3 Batch Execution State
  const [isBatchRendering, setIsBatchRendering] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchCompleted, setBatchCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Validate URL in Step 1
  const validateUrl = (url: string) => {
    if (!url.trim()) {
      setUrlError('Website URL is required for Brand DNA scan.');
      return false;
    }
    const clean = url.trim().toLowerCase();
    const hasDomain = clean.includes('.') && !clean.endsWith('.');
    if (!hasDomain) {
      setUrlError('Please enter a valid domain (e.g. https://artcraft.io or brand.com)');
      return false;
    }
    setUrlError('');
    return true;
  };

  // Parse CSV File Drag-and-Drop / Upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setCsvFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length > 1) {
          const rows = lines.slice(1, 16).map((line) => {
            const vals = line.split(',').map((v) => v.trim());
            return {
              title: vals[0] || 'Metric Item',
              metric: vals[1] || '100%',
              change: vals[2] || '+10%',
              tag: vals[3] || 'DATA',
            };
          });
          setCsvData(rows);
        }
      }
    };
    reader.readAsText(file);
  };

  // Step 1 -> Step 2 Submit: Scan Brand DNA
  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(websiteUrl)) return;

    setStep(2);
    setIsScanning(true);
    setScanProgress(0);
    setTerminalLogs([]);

    // Derived domain colors based on URL hashing for deterministic realism
    let urlHash = 0;
    for (let i = 0; i < websiteUrl.length; i++) {
      urlHash = (urlHash << 5) - urlHash + websiteUrl.charCodeAt(i);
    }
    urlHash = Math.abs(urlHash);

    const detectedPalette: BrandDNA = {
      primary: urlHash % 2 === 0 ? '#00E5FF' : '#38BDF8',
      secondary: urlHash % 3 === 0 ? '#5322ff' : '#8B5CF6',
      accent: urlHash % 5 === 0 ? '#FF007A' : '#F59E0B',
      background: '#09090b',
      font: 'Space Grotesk, sans-serif',
      layoutStyle: 'swiss',
    };

    setBrandDna(detectedPalette);

    // High-tech terminal scanning logs schedule (5-8 seconds animation)
    const logsTimeline = [
      { delay: 300, text: `[SYS//INIT] Connecting to host ${websiteUrl}...` },
      { delay: 900, text: `[HTTP//GET] 200 OK — Header content-type: text/html; charset=utf-8` },
      { delay: 1600, text: `[DOM//PARSER] Extracting CSS variables, favicon metadata, inline SVG nodes...` },
      { delay: 2400, text: `[COLOR//MATRIX] Detected Brand Swatches: [P: ${detectedPalette.primary}, S: ${detectedPalette.secondary}, A: ${detectedPalette.accent}]` },
      { delay: 3200, text: `[TYPOGRAPHY//STACK] Computed font-family signatures: Space Grotesk / Inter / JetBrains Mono` },
      { delay: 4100, text: `[CSV//PIPELINE] Detected ${csvData.length} structured rows in dataset engine.` },
      { delay: 4800, text: `[AI//DNA] Brand identity profile generated. Awaiting human confirmation.` },
    ];

    logsTimeline.forEach((item) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, item.text]);
      }, item.delay);
    });

    // Animate progress bar to 100%
    const startTime = performance.now();
    const duration = 5200;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setScanProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 50);
  };

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Step 2 -> Step 3: Confirm Brand DNA and render live sample
  const handleConfirmDna = () => {
    setStep(3);
    setBatchCompleted(false);
    setBatchProgress(0);
  };

  // Draw Sample Preview Canvas in Step 3
  const drawSampleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = outputType === 'banner' ? 300 : 450;
    canvas.width = width;
    canvas.height = height;

    const sampleRow = csvData[0] || DEFAULT_CSV_DATA[0];

    // Background
    ctx.fillStyle = brandDna.background;
    ctx.fillRect(0, 0, width, height);

    // Frame Border & Grid
    ctx.strokeStyle = brandDna.primary + '66';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Layout style variations
    if (brandDna.layoutStyle === 'cyberpunk') {
      ctx.fillStyle = brandDna.secondary + '22';
      ctx.fillRect(20, 20, width - 40, height - 40);

      // Diagonal cyber scan lines
      ctx.strokeStyle = brandDna.primary + '33';
      ctx.lineWidth = 1;
      for (let x = -height; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + height, height);
        ctx.stroke();
      }
    } else if (brandDna.layoutStyle === 'brutalist') {
      // Thick brutalist block shadows
      ctx.fillStyle = brandDna.secondary;
      ctx.fillRect(40, 40, width - 60, height - 60);
      ctx.fillStyle = brandDna.background;
      ctx.fillRect(32, 32, width - 64, height - 64);
      ctx.strokeStyle = brandDna.primary;
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, width - 64, height - 64);
    }

    if (outputType === 'banner') {
      // Top Tag Badge
      ctx.fillStyle = brandDna.primary + '22';
      ctx.fillRect(48, 45, 180, 32);
      ctx.strokeStyle = brandDna.primary;
      ctx.lineWidth = 1;
      ctx.strokeRect(48, 45, 180, 32);

      ctx.fillStyle = brandDna.primary;
      ctx.font = `700 13px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`// ${sampleRow.tag || 'BRAND_DNA'}`, 60, 61);

      // Main Banner Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 38px ${brandDna.font}`;
      ctx.fillText(sampleRow.title.toUpperCase(), 48, 125);

      // Subtext Domain
      ctx.fillStyle = brandDna.secondary;
      ctx.font = `600 20px "JetBrains Mono", monospace`;
      ctx.fillText(`URL: ${websiteUrl.replace(/^https?:\/\//, '')}`, 48, 175);

      // Metric Highlight Box Right
      ctx.fillStyle = brandDna.primary + '15';
      ctx.fillRect(width - 340, 45, 290, 200);
      ctx.strokeStyle = brandDna.primary;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width - 340, 45, 290, 200);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 48px ${brandDna.font}`;
      ctx.textAlign = 'center';
      ctx.fillText(sampleRow.metric, width - 195, 125);

      ctx.fillStyle = brandDna.accent;
      ctx.font = `700 18px "JetBrains Mono", monospace`;
      ctx.fillText(`DELTA: ${sampleRow.change}`, width - 195, 180);

      // Footer System Strip
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `400 12px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(`ARTIFICIAL CRAFT // MASS BATCH SAMPLE PREVIEW 01 OF ${csvData.length}`, 48, height - 35);
    } else {
      // Mass Chart Visualizer Render Mode
      ctx.fillStyle = brandDna.primary;
      ctx.font = `800 28px ${brandDna.font}`;
      ctx.textAlign = 'left';
      ctx.fillText(`MASS CHART EXPORT // DATASET ANALYSIS`, 48, 65);

      // Draw Chart Bar Graph
      const chartStartX = 48;
      const chartStartY = 350;
      const chartWidth = width - 96;
      const chartHeight = 220;

      // Axis lines
      ctx.strokeStyle = brandDna.primary + '66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(chartStartX, chartStartY - chartHeight);
      ctx.lineTo(chartStartX, chartStartY);
      ctx.lineTo(chartStartX + chartWidth, chartStartY);
      ctx.stroke();

      // Bars
      const barCount = Math.min(csvData.length, 8);
      const barSpacing = chartWidth / barCount;
      csvData.slice(0, barCount).forEach((row, i) => {
        const barX = chartStartX + i * barSpacing + barSpacing * 0.2;
        const barW = barSpacing * 0.6;
        const hPct = 0.3 + ((i * 17) % 65) / 100;
        const barH = chartHeight * hPct;
        const barY = chartStartY - barH;

        const grad = ctx.createLinearGradient(barX, barY, barX, chartStartY);
        grad.addColorStop(0, brandDna.primary);
        grad.addColorStop(1, brandDna.secondary);

        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = brandDna.accent;
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Bar Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `600 11px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(row.title.substring(0, 8), barX + barW / 2, chartStartY + 20);
      });
    }
  }, [brandDna, outputType, websiteUrl, csvData]);

  useEffect(() => {
    if (step === 3) {
      drawSampleCanvas();
    }
  }, [step, drawSampleCanvas]);

  // Execute Batch Production Process
  const handleStartBatchProduction = () => {
    setIsBatchRendering(true);
    setBatchProgress(0);
    setBatchCompleted(false);

    const total = csvData.length;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      const pct = Math.round((current / total) * 100);
      setBatchProgress(pct);

      if (current >= total) {
        clearInterval(interval);
        setIsBatchRendering(false);
        setBatchCompleted(true);
      }
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono sm:p-6 lg:p-8">
        {/* Modal Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Main Brutalist Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-4xl border border-[#00E5FF] bg-[#09090b] shadow-[0_0_50px_rgba(0,229,255,0.2)] text-white overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[#5322ff] bg-[#5322ff]/20 text-[#00E5FF]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-white flex items-center gap-2">
                  BATCH PRODUCTION STUDIO // MASS RENDER
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  3-STEP BRAND DNA AUTOMATION FLOW
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stepper Navigation Progress Strip */}
          <div className="grid grid-cols-3 border-b border-zinc-800 bg-black text-[11px] font-bold tracking-wider uppercase shrink-0">
            <div
              className={`p-3 text-center border-r border-zinc-800 flex items-center justify-center gap-2 ${
                step === 1
                  ? 'bg-[#5322ff]/20 text-[#00E5FF] border-b-2 border-b-[#00E5FF]'
                  : step > 1
                    ? 'text-emerald-400'
                    : 'text-zinc-600'
              }`}
            >
              <span>{step > 1 ? '✓' : '01'}</span>
              <span className="hidden sm:inline">1. INPUT FORM</span>
            </div>

            <div
              className={`p-3 text-center border-r border-zinc-800 flex items-center justify-center gap-2 ${
                step === 2
                  ? 'bg-[#5322ff]/20 text-[#00E5FF] border-b-2 border-b-[#00E5FF]'
                  : step > 2
                    ? 'text-emerald-400'
                    : 'text-zinc-600'
              }`}
            >
              <span>{step > 2 ? '✓' : '02'}</span>
              <span className="hidden sm:inline">2. BRAND DNA APPROVAL</span>
            </div>

            <div
              className={`p-3 text-center flex items-center justify-center gap-2 ${
                step === 3
                  ? 'bg-[#5322ff]/20 text-[#00E5FF] border-b-2 border-b-[#00E5FF]'
                  : 'text-zinc-600'
              }`}
            >
              <span>03</span>
              <span className="hidden sm:inline">3. SAMPLE PREVIEW & BATCH</span>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* ================= STEP 1: BATCH PRODUCTION INPUT FORM ================= */}
            {step === 1 && (
              <form onSubmit={handleStartScan} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#00E5FF]" />
                    <span>Website URL (Target Brand Scan) *</span>
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      setUrlError('');
                    }}
                    placeholder="https://artcraft.io or brand.com"
                    className={`w-full bg-zinc-950 border px-4 py-3 text-xs text-white outline-none font-mono focus:border-[#00E5FF] transition-colors ${
                      urlError ? 'border-red-500' : 'border-zinc-800'
                    }`}
                  />
                  {urlError && (
                    <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1 font-sans">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {urlError}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Neural crawler will scan DOM styles, color swatches, and typography hierarchy.
                  </p>
                </div>

                {/* CSV File Upload Dropzone / Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-[#5322ff]" />
                    <span>CSV Link or Local File Dropzone *</span>
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-800 hover:border-[#00E5FF] bg-zinc-950 p-6 text-center cursor-pointer transition-colors group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                    <Upload className="mx-auto h-8 w-8 text-zinc-600 group-hover:text-[#00E5FF] transition-colors mb-2" />
                    {csvFileName ? (
                      <div className="text-xs text-[#00E5FF] font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Loaded: {csvFileName} ({csvData.length} rows parsed)</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs font-bold text-zinc-300">
                          DRAG & DROP CSV FILE HERE OR CLICK TO BROWSE
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          Supports custom dataset rows (Titles, Metrics, Tags).
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase">OR PASTE CSV URL:</span>
                    <input
                      type="text"
                      value={csvLink}
                      onChange={(e) => setCsvLink(e.target.value)}
                      placeholder="https://reports.artcraft.io/data.csv"
                      className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                </div>

                {/* Output Type Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <span>Output Type Selection</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOutputType('banner')}
                      className={`p-4 border text-left transition-all font-mono ${
                        outputType === 'banner'
                          ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-1">
                        2. Infographic Banner Suite
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Multi-dimensional social & LinkedIn marketing banners.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOutputType('chart')}
                      className={`p-4 border text-left transition-all font-mono ${
                        outputType === 'chart'
                          ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-1">
                        1. Mass Chart Export
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Algorithmic data charts, bar grids & telemetry visuals.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit Action CTA */}
                <div className="pt-4 border-t border-zinc-800 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 border border-[#5322ff] bg-[#5322ff] hover:bg-[#5322ff]/80 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,34,255,0.4)] cursor-pointer"
                  >
                    <span>[ 🔍 SCAN BRAND DNA ]</span>
                    <ArrowRight className="h-4 w-4 text-[#00E5FF]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 2: BRAND DNA APPROVAL BOARD ================= */}
            {step === 2 && (
              <div className="space-y-6">
                {isScanning ? (
                  /* High-Tech Terminal Scanning Progress State */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF]">
                        <Terminal className="h-4 w-4 animate-spin" />
                        <span>NEURAL BRAND DNA SCANNER ACTIVE</span>
                      </div>
                      <span className="text-xs font-bold text-[#5322ff]">{scanProgress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-900 h-2 border border-zinc-800">
                      <motion.div
                        className="bg-gradient-to-r from-[#5322ff] to-[#00E5FF] h-full"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>

                    {/* Terminal Stream Console */}
                    <div className="border border-zinc-800 bg-black p-4 font-mono text-[11px] text-emerald-400 h-56 overflow-y-auto space-y-1.5 leading-relaxed">
                      {terminalLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-zinc-600">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>
                  </div>
                ) : (
                  /* DNA Approval Dashboard Controls */
                  <div className="space-y-6">
                    <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Brand DNA successfully extracted from <strong>{websiteUrl}</strong>. Review and override parameters below.
                      </span>
                    </div>

                    {/* Color Palette Overrides */}
                    <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-white border-b border-zinc-800 pb-2">
                        <Palette className="h-4 w-4 text-[#00E5FF]" />
                        <span>Extracted Color Palette (Native Input Color Overrides)</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        {/* Primary Swatch */}
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-2 border border-zinc-800 bg-black p-1.5">
                            <input
                              type="color"
                              value={brandDna.primary}
                              onChange={(e) =>
                                setBrandDna({ ...brandDna, primary: e.target.value })
                              }
                              className="h-7 w-7 bg-transparent cursor-pointer border-0 rounded-none"
                            />
                            <span className="text-xs font-bold uppercase">{brandDna.primary}</span>
                          </div>
                        </div>

                        {/* Secondary Swatch */}
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                            Secondary Color
                          </label>
                          <div className="flex items-center gap-2 border border-zinc-800 bg-black p-1.5">
                            <input
                              type="color"
                              value={brandDna.secondary}
                              onChange={(e) =>
                                setBrandDna({ ...brandDna, secondary: e.target.value })
                              }
                              className="h-7 w-7 bg-transparent cursor-pointer border-0 rounded-none"
                            />
                            <span className="text-xs font-bold uppercase">{brandDna.secondary}</span>
                          </div>
                        </div>

                        {/* Accent Swatch */}
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                            Accent Color
                          </label>
                          <div className="flex items-center gap-2 border border-zinc-800 bg-black p-1.5">
                            <input
                              type="color"
                              value={brandDna.accent}
                              onChange={(e) =>
                                setBrandDna({ ...brandDna, accent: e.target.value })
                              }
                              className="h-7 w-7 bg-transparent cursor-pointer border-0 rounded-none"
                            />
                            <span className="text-xs font-bold uppercase">{brandDna.accent}</span>
                          </div>
                        </div>

                        {/* Background Swatch */}
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase mb-1">
                            Background Dark
                          </label>
                          <div className="flex items-center gap-2 border border-zinc-800 bg-black p-1.5">
                            <input
                              type="color"
                              value={brandDna.background}
                              onChange={(e) =>
                                setBrandDna({ ...brandDna, background: e.target.value })
                              }
                              className="h-7 w-7 bg-transparent cursor-pointer border-0 rounded-none"
                            />
                            <span className="text-xs font-bold uppercase">{brandDna.background}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Font Selector & Layout Style Pill Selector */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Font Selector */}
                      <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                        <label className="block text-xs font-bold uppercase text-white flex items-center gap-2">
                          <Type className="h-4 w-4 text-[#5322ff]" />
                          <span>Detected Font Selector</span>
                        </label>
                        <select
                          value={brandDna.font}
                          onChange={(e) =>
                            setBrandDna({ ...brandDna, font: e.target.value as FontFamily })
                          }
                          className="w-full bg-black border border-zinc-800 text-xs text-white p-2.5 outline-none font-mono focus:border-[#00E5FF] cursor-pointer"
                        >
                          <option value="Space Grotesk, sans-serif">Space Grotesk (Brutalist Modern)</option>
                          <option value="Inter, sans-serif">Inter (Swiss Corporate)</option>
                          <option value="JetBrains Mono, monospace">JetBrains Mono (Technical Monospace)</option>
                        </select>
                      </div>

                      {/* Layout Style Pill Selector */}
                      <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                        <label className="block text-xs font-bold uppercase text-white flex items-center gap-2">
                          <Layout className="h-4 w-4 text-[#00E5FF]" />
                          <span>Layout Style Pill Selector</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                          {(['swiss', 'brutalist', 'cyberpunk'] as LayoutStyle[]).map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setBrandDna({ ...brandDna, layoutStyle: style })}
                              className={`py-2 px-1 text-[10px] font-bold uppercase transition-all truncate border ${
                                brandDna.layoutStyle === style
                                  ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                                  : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              {style === 'swiss'
                                ? 'Swiss Minimalist'
                                : style === 'brutalist'
                                  ? 'Brutalist Core'
                                  : 'Cyberpunk Tech'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2 CTA */}
                    <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:text-white uppercase"
                      >
                        ← Back to Inputs
                      </button>

                      <button
                        type="button"
                        onClick={handleConfirmDna}
                        className="px-6 py-3 border border-[#00E5FF] bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black text-xs font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                      >
                        <span>[ 🎨 CONFIRM & PREVIEW 1 SAMPLE ]</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 3: SAMPLE PREVIEW & BATCH RENDER DISPATCH ================= */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Live Sample Preview Canvas */}
                <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2 uppercase">
                    <span className="flex items-center gap-2 text-white font-bold">
                      <Sparkles className="h-4 w-4 text-[#00E5FF]" />
                      LIVE SAMPLE RENDER 01 // {outputType === 'banner' ? 'INFOGRAPHIC BANNER' : 'MASS CHART'}
                    </span>
                    <span className="text-[10px] text-[#00E5FF]">
                      BRAND DNA ACTIVE ({brandDna.layoutStyle.toUpperCase()})
                    </span>
                  </div>

                  {/* HTML5 Canvas Render Output */}
                  <div className="w-full bg-[#09090b] border border-zinc-800 overflow-hidden relative">
                    <canvas ref={canvasRef} className="w-full h-auto block object-contain" />
                  </div>
                </div>

                {/* Batch Metrics Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-[10px] text-zinc-500 uppercase">Total Rows Detected</div>
                    <div className="text-lg font-bold text-[#00E5FF]">{csvData.length} Items</div>
                  </div>

                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-[10px] text-zinc-500 uppercase">Selected Output</div>
                    <div className="text-sm font-bold text-white uppercase truncate">
                      {outputType === 'banner' ? 'Banner Suite' : 'Chart Export'}
                    </div>
                  </div>

                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-[10px] text-zinc-500 uppercase">Font Signature</div>
                    <div className="text-xs font-bold text-purple-400 truncate">
                      {brandDna.font.split(',')[0]}
                    </div>
                  </div>

                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-[10px] text-zinc-500 uppercase">Est. Render Time</div>
                    <div className="text-sm font-bold text-emerald-400">
                      ~{(csvData.length * 0.15).toFixed(1)}s
                    </div>
                  </div>
                </div>

                {/* Batch Rendering Progress State */}
                {isBatchRendering && (
                  <div className="border border-[#5322ff] bg-black p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-[#00E5FF] animate-bounce" />
                        <span>BATCH PRODUCTION IN PROGRESS...</span>
                      </span>
                      <span className="text-[#00E5FF]">{batchProgress}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 border border-zinc-800">
                      <div
                        className="bg-[#00E5FF] h-full transition-all duration-200"
                        style={{ width: `${batchProgress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-zinc-500 text-right">
                      Rendering asset {Math.ceil((batchProgress / 100) * csvData.length)} of {csvData.length}
                    </div>
                  </div>
                )}

                {/* Batch Completed Gallery & Download */}
                {batchCompleted && (
                  <div className="border border-emerald-500/50 bg-emerald-500/10 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>BATCH PRODUCTION COMPLETED: {csvData.length} / {csvData.length} ASSETS GENERATED!</span>
                      </span>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Simulating ZIP download of ${csvData.length} rendered PNG assets.`);
                        }}
                        className="w-full sm:w-auto px-6 py-3 border border-emerald-400 bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-400 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>[ 📦 DOWNLOAD ALL BATCH ASSETS (.ZIP) ]</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setBatchCompleted(false);
                        }}
                        className="w-full sm:w-auto px-4 py-3 border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold uppercase hover:bg-zinc-800"
                      >
                        New Batch Flow
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 Action Buttons */}
                {!isBatchRendering && !batchCompleted && (
                  <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:text-white uppercase"
                    >
                      ← Back to Brand DNA
                    </button>

                    <button
                      type="button"
                      onClick={handleStartBatchProduction}
                      className="px-8 py-3.5 border border-[#5322ff] bg-[#5322ff] hover:bg-[#5322ff]/80 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(83,34,255,0.6)]"
                    >
                      <Play className="h-4 w-4 text-[#00E5FF]" />
                      <span>[ 🚀 START BATCH PRODUCTION ({csvData.length} ITEMS) ]</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Exportable Modal Trigger Button
export function BatchProductionTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-xs font-mono font-bold tracking-wider px-5 py-3 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all duration-300 cursor-pointer uppercase shadow-[0_0_15px_rgba(0,229,255,0.25)]"
    >
      <Zap className="h-4 w-4 text-[#00E5FF] group-hover:text-black transition-colors" />
      <span>⚡ BATCH PRODUCTION (MASS RENDER)</span>
    </button>
  );
}
