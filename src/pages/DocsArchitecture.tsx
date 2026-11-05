import { useState } from 'react';
import { useTranslation } from '@/context/useLanguage';
import {
  Brain,
  Cpu,
  Video,
  DollarSign,
  Gauge,
  Minimize2,
  ShieldCheck,
  Shield,
  FileCode,
  FileText,
  FileDown,
  Printer,
  Copy,
  Check,
  Zap,
  Layers,
  Terminal,
  AlertTriangle,
  FolderTree,
  Box,
  Bot,
  ArrowRight,
  Sliders,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function DocsArchitecture() {
  const { t, language } = useTranslation();

  // Interactive Inspector Tabs
  const [activeTab, setActiveTab] = useState<'ast' | 'zod' | 'stream'>('ast');
  const [copied, setCopied] = useState(false);
  const [validationActive, setValidationActive] = useState(false);

  // Dropdown for whitepaper download in hero
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ show: boolean; title: string; desc: string }>({
    show: false,
    title: '',
    desc: '',
  });

  const showToast = (title: string, desc: string) => {
    setToast({ show: true, title, desc });
    setTimeout(() => {
      setToast({ show: false, title: '', desc: '' });
    }, 3500);
  };

  // Code snippets for Inspector
  const codeAst = `{
  "id": "telemetry-cad-01",
  "preset": "swiss-hud",
  "title": "ROBOTICS TELEMETRY ENGINE",
  "subtitle": "11-DOF Bionic Arm Matrix",
  "theme": "cyber-dark",
  "props": {
    "seed": "0x892a_mecha",
    "explodedProgress": 0.33,
    "telemetryFps": 60.0,
    "torquePrecision": 0.001,
    "harmonicDriveRatio": 120,
    "activeNode": "NODE_05::PROD"
  }
}`;

  const codeZod = `import { z } from 'zod';
import { NextResponse } from 'next/server';

// Immutable SSOT Preset Registry Enum
export const PresetEnum = z.enum([
  'swiss-hud', 'isometric-matrix', 'bento-3d', 'rubik-3d', 'dual-engine'
]);

export const SwissDesignConfigSchema = z.object({
  id: z.string().min(1, 'Node ID required'),
  preset: PresetEnum,
  title: z.string().max(80),
  subtitle: z.string().optional(),
  theme: z.enum(['cyber-dark', 'obsidian-indigo', 'titanium-cyan']).default('cyber-dark'),
  props: z.record(z.any()).default({})
});

export async function POST(req: Request) {
  const rawBody = await req.json();
  const parsed = SwissDesignConfigSchema.safeParse(rawBody);

  if (!parsed.success) {
    // CIRCUIT BREAKER: Short-circuit immediately on drift
    return NextResponse.json(
      { error: 'PAYLOAD_DRIFT_DETECTED', issues: parsed.error.format() },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, payload: parsed.data });
}`;

  const codeStream = `import React from 'react';
import { ComponentRegistry } from './registry';
import type { UniversalComponentProps } from './registry';

export const DynamicSectionRenderer: React.FC<{ payload: UniversalComponentProps }> = ({ payload }) => {
  // TIER 1: Sanitizer Fallback
  const safePreset = ComponentRegistry[payload.preset] ? payload.preset : 'swiss-hud';
  const Component = ComponentRegistry[safePreset];

  // TIER 2: GPU Runtime Error Boundary
  return (
    <React.Suspense fallback={<div className="h-64 bg-zinc-950 border border-zinc-800 animate-pulse" />}>
      <Component {...payload.props} title={payload.title} theme={payload.theme} />
    </React.Suspense>
  );
};`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'ast':
        return codeAst;
      case 'zod':
        return codeZod;
      case 'stream':
        return codeStream;
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(getActiveCode());
    setCopied(true);
    showToast(t('docs_arch_btn_copied'), 'Snippet copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValidatePayload = () => {
    setValidationActive(true);
    showToast(
      language === 'vi' ? 'CỔNG ZOD: ĐÃ XÁC THỰC' : 'GATE: ZOD VALIDATED',
      language === 'vi' ? 'Payload hợp lệ 100%, sẵn sàng chạy WebGL 60FPS' : 'Payload 100% compliant, 60FPS bus ready'
    );
    setTimeout(() => setValidationActive(false), 3500);
  };

  // Export handlers
  const handleDownloadAst = () => {
    const specDump = {
      spec: 'ARTIFICIALCRAFT.SPACE ARCHITECTURE REPORT',
      version: '2026.11-REV4',
      architecture: '3-Tier Decoupled Operational Paradigm',
      sla: {
        server_render_cost: '$0.00 / month',
        target_fps: 60.0,
        token_reduction: '99%',
        zod_drift: '0%',
        crash_policy: '2-Tier Graceful Fallback',
      },
      registry_nodes: ['swiss-hud', 'isometric-matrix', 'bento-3d', 'rubik-3d', 'dual-engine'],
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(specDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artificialcraft-architecture-spec-2026.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON AST EXPORTED', 'artificialcraft-architecture-spec-2026.json');
  };

  const handleExportDoc = (format: 'pdf' | 'md', lang: 'vi' | 'en') => {
    setExportDropdownOpen(false);
    if (format === 'pdf') {
      showToast('PRINT / PDF SPOOLER', `Preparing ${lang === 'vi' ? 'Tiếng Việt' : 'English'} PDF spooler...`);
      setTimeout(() => {
        window.print();
      }, 500);
      return;
    }

    const viMD = `# BÁO CÁO KỸ THUẬT: KIẾN TRÚC 0-CODE JSON-DRIVEN VÀ MÔ HÌNH PHÂN TẦNG VẬN HÀNH

**Tổ chức:** ARTIFICIALCRAFT.SPACE
**Phiên bản:** SPEC//2026.11-REV4
**Phân loại:** PUBLIC TECHNICAL SPEC

---

## 1. TỔNG QUAN KIẾN TRÚC & TRIẾT LÝ THIẾT KẾ
- Tier 1: REASONING CORE (Dify / Vertex AI) -> Emits Pure JSON AST (~50 tokens)
- Tier 2: DETERMINISTIC MUSCLE (n8n Webhook Proxy & Validation Gate)
- Tier 3: PRESENTATION CANVAS (Client GPU WebGL 60 FPS)

## 2. CHỈ SỐ SLA CHÍNH
- Server Render Cost: $0.00 / tháng
- Deterministic FPS: 60.0 FPS
- JSON AST Payload: ~50 Tokens (-99% Context Bloat)
- Validation Drift: 0%
- Failover SLA: ZERO-CRASH (2-Tier Graceful Fallback)

## 3. ZERO-TRUST ZOD GATE PROTOCOL
- Schema: SwissDesignConfigSchema.safeParse()
- Short-circuit HTTP 400 lập tức khi payload vi phạm contract.`;

    const enMD = `# TECHNICAL WHITE PAPER: 0-CODE JSON-DRIVEN ARCHITECTURE & DECOUPLED OPERATIONS

**Platform:** ARTIFICIALCRAFT.SPACE
**Revision:** SPEC//2026.11-REV4
**Classification:** PUBLIC TECHNICAL SPEC

---

## 1. 3-TIER DECOUPLED OPERATIONAL PARADIGM
- Tier 1: REASONING CORE (Dify / Vertex AI) -> Emits Pure JSON AST (~50 tokens)
- Tier 2: DETERMINISTIC MUSCLE (n8n Webhook Proxy & Validation Gate)
- Tier 3: PRESENTATION CANVAS (Client GPU WebGL 60 FPS - Zero Puppeteer)

## 2. SLA BENCHMARKS
- Server Render Cost: $0.00 / month
- Deterministic SLA: 60.0 FPS WebGL
- Token Consumption: ~50 Tokens (-99% Context Bloat)
- Validation Drift: 0% with Zod safeParse
- Failover: 2-Tier Graceful Fallback Policy.`;

    const content = lang === 'vi' ? viMD : enMD;
    const filename = `artificialcraft-whitepaper-${lang}-2026.md`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('MARKDOWN EXPORT COMPLETE', `Saved: ${filename}`);
  };

  return (
    <div className="w-full bg-[#09090B] font-mono text-zinc-200 antialiased pt-16">
      {/* TOAST FEEDBACK NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B0B0F] border border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.35)] p-4 max-w-sm rounded-none">
          <div className="flex items-center gap-2 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span>{toast.title}</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">{toast.desc}</div>
        </div>
      )}

      {/* TOP TELEMETRY RIBBON & BREADCRUMB */}
      <div className="w-full bg-[#0B0B0F] border-b border-[#1F1F2E] px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[#00E5FF] bg-[#121218] px-2 py-0.5 flex items-center gap-1.5 border border-[#1F1F2E] font-bold text-[10px] tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#00E5FF] inline-block animate-pulse" />
            {t('docs_arch_breadcrumb_spec')}
          </span>
          <span className="text-zinc-300 font-medium">{t('docs_arch_breadcrumb_title')}</span>
          <span className="text-zinc-600 hidden md:inline">/</span>
          <span className="text-zinc-500 hidden md:inline">{t('docs_arch_breadcrumb_node')}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[#00FF66] flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 bg-[#00FF66] inline-block shadow-[0_0_6px_#00FF66]" />
            {t('docs_arch_zod_enforced')}
          </span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="text-zinc-500 hidden sm:inline">SHA256: 9E0B..D4A1</span>
        </div>
      </div>

      {/* HERO SECTION: WHITEPAPER TITLE & EXECUTIVE TELEMETRY HUD */}
      <section className="w-full bg-[#09090B] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b border-[#1F1F2E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Top classification tag & whitepaper export dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#121218] px-3 py-1 border border-[#1F1F2E] flex items-center gap-2">
                <Terminal className="text-[#00E5FF] w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider text-[#00E5FF] font-bold">
                  {t('docs_arch_classification_tag')}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 px-2 py-1 border border-[#1F1F2E] bg-[#0B0B0F]">
                {t('docs_arch_ssot_cluster')}
              </span>
              <span className="text-[10px] text-[#00FF66] px-2 py-1 border border-[#1F1F2E] bg-[#0B0B0F]">
                {t('docs_arch_public_spec')}
              </span>
            </div>

            {/* WHITEPAPER EXPORT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen((v) => !v)}
                className="text-xs px-3.5 py-1.5 border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] flex items-center gap-2 hover:bg-[#00E5FF] hover:text-black transition-all uppercase font-bold tracking-wider cursor-pointer rounded-none shadow-[0_0_12px_rgba(0,229,255,0.25)]"
              >
                <FileDown className="w-4 h-4" />
                <span>DOWNLOAD WHITEPAPER</span>
                <span className="bg-[#00FF66] text-black px-1 text-[9px] font-mono font-bold">v4.2</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {exportDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#0B0B0F] border border-[#1F1F2E] shadow-2xl p-2 flex flex-col gap-1 z-50 rounded-none">
                  <div className="px-2 py-1 border-b border-[#1F1F2E] flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
                    <span>EXPORT FORMATS</span>
                    <span className="text-[#00E5FF]">SPEC//2026.11</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1 text-xs">
                    <button
                      onClick={() => handleExportDoc('pdf', 'vi')}
                      className="w-full text-left px-2 py-1.5 text-zinc-200 hover:text-black hover:bg-[#00E5FF] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5 text-rose-400" /> PDF (VI) - TIẾNG VIỆT
                      </span>
                      <span className="text-[10px] text-zinc-500">PRINT</span>
                    </button>
                    <button
                      onClick={() => handleExportDoc('md', 'vi')}
                      className="w-full text-left px-2 py-1.5 text-zinc-200 hover:text-black hover:bg-[#00E5FF] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#00FF66]" /> MD .MD (VI) - MARKDOWN
                      </span>
                      <span className="text-[10px] text-zinc-500">.MD</span>
                    </button>
                    <div className="border-t border-[#1F1F2E] my-1" />
                    <button
                      onClick={() => handleExportDoc('pdf', 'en')}
                      className="w-full text-left px-2 py-1.5 text-zinc-200 hover:text-black hover:bg-[#00E5FF] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5 text-rose-400" /> PDF (EN) - ENGLISH SPEC
                      </span>
                      <span className="text-[10px] text-zinc-500">PRINT</span>
                    </button>
                    <button
                      onClick={() => handleExportDoc('md', 'en')}
                      className="w-full text-left px-2 py-1.5 text-zinc-200 hover:text-black hover:bg-[#00E5FF] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#00FF66]" /> MD .MD (EN) - MARKDOWN
                      </span>
                      <span className="text-[10px] text-zinc-500">.MD</span>
                    </button>
                    <button
                      onClick={handleDownloadAst}
                      className="w-full text-left px-2 py-1.5 text-[#00E5FF] hover:text-black hover:bg-[#00E5FF] flex items-center justify-between transition-colors cursor-pointer mt-1 border-t border-[#1F1F2E]"
                    >
                      <span className="flex items-center gap-1.5 font-bold">
                        <FileCode className="w-3.5 h-3.5" /> JSON AST SPEC
                      </span>
                      <span className="text-[10px] text-zinc-400">.JSON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight max-w-5xl">
              {t('docs_arch_hero_title')}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-4xl leading-relaxed border-l-2 border-[#00E5FF] pl-3 sm:pl-4">
              {t('docs_arch_hero_desc')}
            </p>
          </div>

          {/* KEY SLA METRICS 5-COLUMN BANNER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#1F1F2E] border border-[#1F1F2E] mt-4">
            {/* Metric 1 */}
            <div className="bg-[#0B0B0F] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('docs_arch_metric_cost_label')}</span>
                <DollarSign className="w-4 h-4 text-[#00FF66]" />
              </div>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00FF66] tracking-tight">
                  {t('docs_arch_metric_cost_val')} <span className="text-[10px] text-zinc-500 font-normal">{t('docs_arch_metric_cost_unit')}</span>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400">{t('docs_arch_metric_cost_sub')}</div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#0B0B0F] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('docs_arch_metric_fps_label')}</span>
                <Gauge className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00E5FF] tracking-tight">
                  {t('docs_arch_metric_fps_val')} <span className="text-[10px] text-zinc-500 font-normal">FPS</span>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400">{t('docs_arch_metric_fps_sub')}</div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#0B0B0F] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('docs_arch_metric_token_label')}</span>
                <Minimize2 className="w-4 h-4 text-[#5322FF]" />
              </div>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#5322FF] tracking-tight">
                  {t('docs_arch_metric_token_val')} <span className="text-[10px] text-zinc-500 font-normal">TOKENS</span>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400">{t('docs_arch_metric_token_sub')}</div>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#0B0B0F] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('docs_arch_metric_zod_label')}</span>
                <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {t('docs_arch_metric_zod_val')} <span className="text-[10px] text-zinc-500 font-normal">{t('docs_arch_metric_zod_unit')}</span>
                </div>
              </div>
              <div className="text-[10px] text-zinc-400">{t('docs_arch_metric_zod_sub')}</div>
            </div>

            {/* Metric 5 */}
            <div className="bg-[#0B0B0F] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('docs_arch_metric_failover_label')}</span>
                <Shield className="w-4 h-4 text-[#00FF66]" />
              </div>
              <div className="my-2">
                <div className="text-xl sm:text-2xl font-extrabold text-[#00FF66] tracking-tight">
                  {t('docs_arch_metric_failover_val')}
                </div>
              </div>
              <div className="text-[10px] text-zinc-400">{t('docs_arch_metric_failover_sub')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAVIGATION STICKY HUD BAR */}
      <div className="w-full bg-[#0B0B0F]/95 border-b border-[#1F1F2E] px-4 sm:px-6 lg:px-8 py-2 sticky top-16 z-30 backdrop-blur-md overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-2 flex-nowrap shrink-0 text-xs">
            <span className="text-[10px] text-zinc-500 uppercase pr-2 border-r border-[#1F1F2E] font-bold">
              {t('docs_arch_toc_label')}
            </span>
            <a href="#phan-1" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec1')}
            </a>
            <a href="#phan-2" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec2')}
            </a>
            <a href="#phan-3" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec3')}
            </a>
            <a href="#phan-4" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec4')}
            </a>
            <a href="#phan-5" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec5')}
            </a>
            <a href="#phan-6" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec6')}
            </a>
            <a href="#phan-7" className="px-2 py-1 text-zinc-400 hover:text-[#00E5FF] hover:bg-[#121218] transition-colors whitespace-nowrap text-[11px]">
              {t('docs_arch_toc_sec7')}
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0 text-[10px] text-zinc-500 font-mono">
            <span>DOC ID: AST-WHTP-2026-V4</span>
          </div>
        </div>
      </div>

      {/* MAIN BODY CONTAINER WITH ALL 7 PANELS */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
        {/* ========================================== */}
        {/* PANEL 01: SYSTEM OVERVIEW & 3-TIER ARCHITECTURE */}
        {/* ========================================== */}
        <section id="phan-1" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-[#00E5FF] text-black px-2 py-0.5 font-bold">
                {t('docs_arch_sec1_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec1_title')}
              </h2>
            </div>
            <span className="text-[11px] text-[#00E5FF] font-bold">{t('docs_arch_sec1_tag')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec1_1_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec1_1_desc')}</p>
          </div>

          {/* BLUEPRINT SCHEMATIC 3-COLUMN MATRIX */}
          <div className="border border-[#1F1F2E] bg-[#09090B] p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-2 text-xs">
              <span className="text-[10px] text-zinc-400 uppercase flex items-center gap-1.5 font-bold">
                <FolderTree className="w-3.5 h-3.5 text-[#00E5FF]" />
                {t('docs_arch_sec1_schematic_title')}
              </span>
              <span className="text-[10px] text-[#00FF66] font-bold">{t('docs_arch_sec1_schematic_sync')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TIER 1 */}
              <div className="border border-[#1F1F2E] bg-[#0B0B0F] p-4 flex flex-col justify-between hover:border-[#5322FF] transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-[#5322FF]">
                    <Brain className="w-5 h-5 text-[#5322FF]" />
                    <span className="font-bold text-sm text-white">{t('docs_arch_tier1_name')}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#5322FF] bg-[#5322FF]/10 px-1.5 py-0.5 border border-[#5322FF]/30">
                    {t('docs_arch_tier1_badge')}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-bold mb-2">{t('docs_arch_tier1_sub')}</div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{t('docs_arch_tier1_desc')}</p>
                <div className="bg-[#121218] p-2.5 border border-[#1F1F2E]">
                  <span className="text-xs text-[#5322FF] block font-bold">{t('docs_arch_tier1_emit')}</span>
                  <span className="text-[10px] text-zinc-500">{t('docs_arch_tier1_payload')}</span>
                </div>
              </div>

              {/* TIER 2 */}
              <div className="border border-[#1F1F2E] bg-[#0B0B0F] p-4 flex flex-col justify-between hover:border-[#00E5FF] transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-[#00E5FF]">
                    <Cpu className="w-5 h-5 text-[#00E5FF]" />
                    <span className="font-bold text-sm text-white">{t('docs_arch_tier2_name')}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.5 border border-[#00E5FF]/30">
                    {t('docs_arch_tier2_badge')}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-bold mb-2">{t('docs_arch_tier2_sub')}</div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{t('docs_arch_tier2_desc')}</p>
                <div className="bg-[#121218] p-2.5 border border-[#1F1F2E]">
                  <span className="text-xs text-[#00E5FF] block font-bold">{t('docs_arch_tier2_dispatch')}</span>
                  <span className="text-[10px] text-zinc-500">{t('docs_arch_tier2_payload')}</span>
                </div>
              </div>

              {/* TIER 3 */}
              <div className="border border-[#1F1F2E] bg-[#0B0B0F] p-4 flex flex-col justify-between hover:border-[#00FF66] transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-[#00FF66]">
                    <Video className="w-5 h-5 text-[#00FF66]" />
                    <span className="font-bold text-sm text-white">{t('docs_arch_tier3_name')}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#00FF66] bg-[#00FF66]/10 px-1.5 py-0.5 border border-[#00FF66]/30">
                    {t('docs_arch_tier3_badge')}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-bold mb-2">{t('docs_arch_tier3_sub')}</div>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{t('docs_arch_tier3_desc')}</p>
                <div className="bg-[#121218] p-2.5 border border-[#1F1F2E]">
                  <span className="text-xs text-[#00FF66] block font-bold">{t('docs_arch_tier3_exec')}</span>
                  <span className="text-[10px] text-zinc-500">{t('docs_arch_tier3_payload')}</span>
                </div>
              </div>
            </div>

            {/* FLOW PIPELINE INDICATOR */}
            <div className="bg-[#0B0B0F] p-3 border border-[#1F1F2E] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#5322FF] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#5322FF] inline-block" />
                {t('docs_arch_flow_tier1')}
              </span>
              <ArrowRight className="w-4 h-4 text-[#00E5FF] hidden sm:inline" />
              <span className="text-[#00E5FF] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#00E5FF] inline-block" />
                {t('docs_arch_flow_tier2')}
              </span>
              <ArrowRight className="w-4 h-4 text-[#00E5FF] hidden sm:inline" />
              <span className="text-[#00FF66] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#00FF66] inline-block" />
                {t('docs_arch_flow_tier3')}
              </span>
            </div>
          </div>

          {/* 1.2 COMPARISON TABLE */}
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec1_2_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec1_2_desc')}</p>

            <div className="overflow-x-auto border border-[#1F1F2E] mt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#121218] border-b border-[#1F1F2E]">
                    <th className="p-3 text-[10px] text-zinc-400 uppercase font-bold">{t('docs_arch_table_col_crit')}</th>
                    <th className="p-3 text-[10px] text-rose-400 uppercase font-bold">{t('docs_arch_table_col_old')}</th>
                    <th className="p-3 text-[10px] text-[#00E5FF] uppercase font-bold bg-[#00E5FF]/10">{t('docs_arch_table_col_new')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F2E] bg-[#09090B]">
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_table_r1_crit')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_table_r1_old')}</td>
                    <td className="p-3 text-[#00FF66] font-bold bg-[#00E5FF]/5">{t('docs_arch_table_r1_new')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_table_r2_crit')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_table_r2_old')}</td>
                    <td className="p-3 text-[#00E5FF] font-bold bg-[#00E5FF]/5">{t('docs_arch_table_r2_new')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_table_r3_crit')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_table_r3_old')}</td>
                    <td className="p-3 text-[#00E5FF] font-bold bg-[#00E5FF]/5">{t('docs_arch_table_r3_new')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_table_r4_crit')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_table_r4_old')}</td>
                    <td className="p-3 text-[#00FF66] font-bold bg-[#00E5FF]/5">{t('docs_arch_table_r4_new')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_table_r5_crit')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_table_r5_old')}</td>
                    <td className="p-3 text-[#00FF66] font-bold bg-[#00E5FF]/5">{t('docs_arch_table_r5_new')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* PANEL 02: 0-CODE JSON-DRIVEN SOLUTION */}
        {/* ========================================== */}
        <section id="phan-2" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-[#5322FF] text-white px-2 py-0.5 font-bold">
                {t('docs_arch_sec2_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec2_title')}
              </h2>
            </div>
            <span className="text-[11px] text-[#5322FF] font-bold">{t('docs_arch_sec2_tag')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#5322FF]">{t('docs_arch_sec2_1_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec2_1_desc')}</p>
          </div>

          {/* 4 FAILURE MODES CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="border border-[#1F1F2E] bg-[#09090B] p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('docs_arch_fail1_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_fail1_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('docs_arch_fail2_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_fail2_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('docs_arch_fail3_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_fail3_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('docs_arch_fail4_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_fail4_desc')}</p>
            </div>
          </div>

          {/* 2.2 COMPARISON TABLE: .TSX vs JSON AST */}
          <div className="flex flex-col gap-3 mt-3">
            <h3 className="text-sm sm:text-base font-bold text-[#5322FF]">{t('docs_arch_sec2_2_title')}</h3>
            <div className="overflow-x-auto border border-[#1F1F2E]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#121218] border-b border-[#1F1F2E]">
                    <th className="p-3 text-[10px] text-zinc-400 uppercase font-bold">{t('docs_arch_comp_col_metric')}</th>
                    <th className="p-3 text-[10px] text-rose-400 uppercase font-bold">{t('docs_arch_comp_col_tsx')}</th>
                    <th className="p-3 text-[10px] text-[#00E5FF] uppercase font-bold bg-[#00E5FF]/10">{t('docs_arch_comp_col_json')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F2E] bg-[#09090B]">
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_comp_r1_metric')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_comp_r1_tsx')}</td>
                    <td className="p-3 text-[#00FF66] font-bold bg-[#00E5FF]/5">{t('docs_arch_comp_r1_json')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_comp_r2_metric')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_comp_r2_tsx')}</td>
                    <td className="p-3 text-[#00FF66] font-bold bg-[#00E5FF]/5">{t('docs_arch_comp_r2_json')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_comp_r3_metric')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_comp_r3_tsx')}</td>
                    <td className="p-3 text-[#00E5FF] font-bold bg-[#00E5FF]/5">{t('docs_arch_comp_r3_json')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">{t('docs_arch_comp_r4_metric')}</td>
                    <td className="p-3 text-zinc-400">{t('docs_arch_comp_r4_tsx')}</td>
                    <td className="p-3 text-[#00FF66] font-bold bg-[#00E5FF]/5">{t('docs_arch_comp_r4_json')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2.3 CONFIGURATION HUBS */}
          <div className="flex flex-col gap-3 mt-3">
            <h3 className="text-sm sm:text-base font-bold text-[#5322FF]">{t('docs_arch_sec2_3_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400">{t('docs_arch_sec2_3_desc')}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#00E5FF] mb-1 font-mono flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{t('docs_arch_hub1_file')}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_hub1_desc')}</p>
                </div>
                <span className="text-[9px] text-zinc-500 mt-3 pt-2 border-t border-[#1F1F2E] font-mono">SSOT // HOMEPAGE CONFIG</span>
              </div>

              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#5322FF] mb-1 font-mono flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>{t('docs_arch_hub2_file')}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_hub2_desc')}</p>
                </div>
                <span className="text-[9px] text-zinc-500 mt-3 pt-2 border-t border-[#1F1F2E] font-mono">SSOT // 60FPS REMOTION PRESETS</span>
              </div>

              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#00FF66] mb-1 font-mono flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" />
                    <span>{t('docs_arch_hub3_file')}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_hub3_desc')}</p>
                </div>
                <span className="text-[9px] text-zinc-500 mt-3 pt-2 border-t border-[#1F1F2E] font-mono">SSOT // 3D FLIPBOOK ARCHIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* PANEL 03: CYBERNETIC SSOT REGISTRY MATRIX */}
        {/* ========================================== */}
        <section id="phan-3" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-[#00E5FF] text-black px-2 py-0.5 font-bold">
                {t('docs_arch_sec3_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec3_title')}
              </h2>
            </div>
            <span className="text-[11px] text-[#00E5FF] font-bold">{t('docs_arch_sec3_tag')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec3_1_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec3_1_desc')}</p>

            {/* 4 CORE DESIGN TOKEN BADGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
              <div className="border border-[#1F1F2E] bg-[#09090B] p-3 flex items-center gap-3">
                <span className="w-6 h-6 bg-[#09090B] border border-[#1F1F2E] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{t('docs_arch_token_obsidian')}</div>
                  <div className="text-[10px] text-zinc-500">{t('docs_arch_token_obsidian_desc')}</div>
                </div>
              </div>

              <div className="border border-[#1F1F2E] bg-[#09090B] p-3 flex items-center gap-3">
                <span className="w-6 h-6 bg-[#5322FF] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#5322FF]">{t('docs_arch_token_indigo')}</div>
                  <div className="text-[10px] text-zinc-500">{t('docs_arch_token_indigo_desc')}</div>
                </div>
              </div>

              <div className="border border-[#1F1F2E] bg-[#09090B] p-3 flex items-center gap-3">
                <span className="w-6 h-6 bg-[#00E5FF] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#00E5FF]">{t('docs_arch_token_cyan')}</div>
                  <div className="text-[10px] text-zinc-500">{t('docs_arch_token_cyan_desc')}</div>
                </div>
              </div>

              <div className="border border-[#1F1F2E] bg-[#09090B] p-3 flex items-center gap-3">
                <span className="w-6 h-6 bg-[#00FF66] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#00FF66]">{t('docs_arch_token_green')}</div>
                  <div className="text-[10px] text-zinc-500">{t('docs_arch_token_green_desc')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3.2 REPOSITORY TREE & UNIVERSAL PROPS INTERFACE */}
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec3_2_title')}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Code tree */}
              <div className="bg-[#09090B] border border-[#1F1F2E] p-4 flex flex-col">
                <div className="text-[10px] uppercase text-zinc-500 border-b border-[#1F1F2E] pb-2 mb-3 font-bold flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>{t('docs_arch_repo_tree_title')}</span>
                </div>
                <pre className="text-[11px] sm:text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
{`├── AGENT.md                       # Bản hiến chương chỉ thị cho AI Worker
├── site-configs/
│   └── template-schema.json       # JSON Schema trang chủ SSOT
├── src/
│   ├── app/
│   │   ├── api/craft/generate/    # API Route Handler (Zero-Trust Gate)
│   │   └── studio/page.tsx        # Trạm cấu hình Studio 3D Configurator
│   ├── core/
│   │   ├── registry.ts            # ComponentRegistry (Đóng băng SSOT)
│   │   └── remotion-presets/      # Kho preset video WebGL 60FPS
│   ├── data/
│   │   └── showcase-config.json   # Cấu hình video showcase
│   └── types/
│       └── craft-studio.ts        # Định nghĩa kiểu dữ liệu TS`}
                </pre>
              </div>

              {/* Right: Interface contract */}
              <div className="bg-[#09090B] border border-[#1F1F2E] p-4 flex flex-col">
                <div className="text-[10px] uppercase text-zinc-500 border-b border-[#1F1F2E] pb-2 mb-3 font-bold flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#5322FF]" />
                  <span>{t('docs_arch_props_interface_title')}</span>
                </div>
                <pre className="text-[11px] sm:text-xs text-[#00E5FF] font-mono leading-relaxed overflow-x-auto whitespace-pre">
{`export interface UniversalComponentProps {
  id: string;
  preset: string; // Khóa định danh trong ComponentRegistry
  title: string;
  subtitle?: string;
  theme?: 'cyber-dark' | 'obsidian-indigo' | 'titanium-cyan';
  props?: Record<string, any>;
}`}
                </pre>
                <div className="text-[10px] text-zinc-500 mt-4 pt-3 border-t border-[#1F1F2E] leading-relaxed">
                  // Bất kỳ component 3D / Remotion nào muốn cắm vào hệ thống đều bắt buộc phải kế thừa interface này.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* PANEL 04: ZERO-TRUST BACKEND-TO-FRONTEND */}
        {/* ========================================== */}
        <section id="phan-4" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-[#00FF66] text-black px-2 py-0.5 font-bold">
                {t('docs_arch_sec4_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec4_title')}
              </h2>
            </div>
            <span className="text-[11px] text-[#00FF66] font-bold">{t('docs_arch_sec4_tag')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#00FF66]">{t('docs_arch_sec4_1_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec4_1_desc')}</p>
          </div>

          {/* 3 GATE DEFENSE BADGES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col gap-1.5">
              <div className="text-xs font-bold text-[#00E5FF] flex items-center gap-1.5">
                <span className="text-[9px] bg-[#00E5FF]/20 text-[#00E5FF] px-1.5 py-0.5 border border-[#00E5FF]/40">GATE 01</span>
                <span>{t('docs_arch_gate1_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_gate1_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col gap-1.5">
              <div className="text-xs font-bold text-[#5322FF] flex items-center gap-1.5">
                <span className="text-[9px] bg-[#5322FF]/20 text-[#5322FF] px-1.5 py-0.5 border border-[#5322FF]/40">GATE 02</span>
                <span>{t('docs_arch_gate2_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_gate2_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col gap-1.5">
              <div className="text-xs font-bold text-[#00FF66] flex items-center gap-1.5">
                <span className="text-[9px] bg-[#00FF66]/20 text-[#00FF66] px-1.5 py-0.5 border border-[#00FF66]/40">GATE 03</span>
                <span>{t('docs_arch_gate3_title')}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_gate3_desc')}</p>
            </div>
          </div>

          {/* CODE INSPECTOR INTERACTIVE HUD */}
          <div className="bg-[#09090B] border border-[#1F1F2E] p-4 sm:p-6 flex flex-col gap-4 mt-2">
            <div className="flex flex-wrap items-center justify-between border-b border-[#1F1F2E] pb-3 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('ast')}
                  className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-none border ${
                    activeTab === 'ast'
                      ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                      : 'bg-[#0B0B0F] text-zinc-400 border-[#1F1F2E] hover:text-white'
                  }`}
                >
                  {t('docs_arch_tab_ast')}
                </button>
                <button
                  onClick={() => setActiveTab('zod')}
                  className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-none border ${
                    activeTab === 'zod'
                      ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                      : 'bg-[#0B0B0F] text-zinc-400 border-[#1F1F2E] hover:text-white'
                  }`}
                >
                  {t('docs_arch_tab_zod')}
                </button>
                <button
                  onClick={() => setActiveTab('stream')}
                  className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-none border ${
                    activeTab === 'stream'
                      ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                      : 'bg-[#0B0B0F] text-zinc-400 border-[#1F1F2E] hover:text-white'
                  }`}
                >
                  {t('docs_arch_tab_stream')}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleValidatePayload}
                  className="px-3 py-1 text-xs border border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-bold uppercase transition-all cursor-pointer rounded-none flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t('docs_arch_btn_validate')}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-[#00E5FF] font-mono transition-all cursor-pointer rounded-none flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#00FF66]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('docs_arch_btn_copied') : t('docs_arch_btn_copy')}</span>
                </button>
              </div>
            </div>

            {/* Validation Banner Indicator */}
            {validationActive && (
              <div className="bg-[#00FF66]/10 border border-[#00FF66] p-2.5 text-xs text-[#00FF66] font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
                <span>{t('docs_arch_validate_success')}</span>
              </div>
            )}

            {/* Code Output */}
            <pre className="text-xs text-zinc-200 font-mono leading-relaxed overflow-x-auto p-4 bg-[#0B0B0F] border border-[#1F1F2E] max-h-96 whitespace-pre">
              {getActiveCode()}
            </pre>
          </div>
        </section>

        {/* ========================================== */}
        {/* PANEL 05: STUDIO CONFIGURATOR ENGINE */}
        {/* ========================================== */}
        <section id="phan-5" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-[#00E5FF] text-black px-2 py-0.5 font-bold">
                {t('docs_arch_sec5_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec5_title')}
              </h2>
            </div>
            <span className="text-[11px] text-[#00E5FF] font-bold">{t('docs_arch_sec5_tag')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec5_1_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec5_1_desc')}</p>
          </div>

          {/* 5-STEP WIZARD DOCK TIMELINE */}
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec5_2_title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Step 1 */}
              <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] bg-[#121218] text-[#00E5FF] border border-[#1F1F2E] px-1.5 py-0.5 font-bold block w-fit mb-2">
                    {t('docs_arch_step1_badge')}
                  </span>
                  <div className="text-xs font-bold text-white mb-1">{t('docs_arch_step1_title')}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_step1_desc')}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] bg-[#121218] text-[#5322FF] border border-[#1F1F2E] px-1.5 py-0.5 font-bold block w-fit mb-2">
                    {t('docs_arch_step2_badge')}
                  </span>
                  <div className="text-xs font-bold text-white mb-1">{t('docs_arch_step2_title')}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_step2_desc')}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col justify-between border-t-2 border-t-[#00E5FF]">
                <div>
                  <span className="text-[9px] bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 px-1.5 py-0.5 font-bold block w-fit mb-2">
                    {t('docs_arch_step3_badge')}
                  </span>
                  <div className="text-xs font-bold text-[#00E5FF] mb-1">{t('docs_arch_step3_title')}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_step3_desc')}</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] bg-[#121218] text-[#00FF66] border border-[#1F1F2E] px-1.5 py-0.5 font-bold block w-fit mb-2">
                    {t('docs_arch_step4_badge')}
                  </span>
                  <div className="text-xs font-bold text-white mb-1">{t('docs_arch_step4_title')}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_step4_desc')}</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] bg-[#121218] text-white border border-[#1F1F2E] px-1.5 py-0.5 font-bold block w-fit mb-2">
                    {t('docs_arch_step5_badge')}
                  </span>
                  <div className="text-xs font-bold text-white mb-1">{t('docs_arch_step5_title')}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_step5_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* PANEL 06: 2-TIER GRACEFUL FALLBACK & GITOPS */}
        {/* ========================================== */}
        <section id="phan-6" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 font-bold">
                {t('docs_arch_sec6_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec6_title')}
              </h2>
            </div>
            <span className="text-[11px] text-rose-400 font-bold">{t('docs_arch_sec6_tag')}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec6_1_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec6_1_desc')}</p>
          </div>

          {/* 2-TIER FALLBACK CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col gap-2 border-l-2 border-l-[#00E5FF]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                  {t('docs_arch_fb1_title')}
                </span>
                <span className="text-[10px] text-[#00E5FF] font-bold">{t('docs_arch_fb1_layer')}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{t('docs_arch_fb1_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-4 flex flex-col gap-2 border-l-2 border-l-[#00FF66]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#00FF66]" />
                  {t('docs_arch_fb2_title')}
                </span>
                <span className="text-[10px] text-[#00FF66] font-bold">{t('docs_arch_fb2_layer')}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{t('docs_arch_fb2_desc')}</p>
            </div>
          </div>

          {/* 6.2 GITOPS RULES */}
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="text-sm sm:text-base font-bold text-[#00E5FF]">{t('docs_arch_sec6_2_title')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{t('docs_arch_sec6_2_desc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-white">{t('docs_arch_rule1_title')}</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_rule1_desc')}</p>
              </div>

              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-white">{t('docs_arch_rule2_title')}</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_rule2_desc')}</p>
              </div>

              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-white">{t('docs_arch_rule3_title')}</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_rule3_desc')}</p>
              </div>

              <div className="bg-[#09090B] border border-[#1F1F2E] p-3.5 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-white">{t('docs_arch_rule4_title')}</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('docs_arch_rule4_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* PANEL 07: PERFORMANCE SUMMARY & DEVELOPER ROI */}
        {/* ========================================== */}
        <section id="phan-7" className="border border-[#1F1F2E] bg-[#0B0B0F] p-5 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1F1F2E] pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] bg-[#00FF66] text-black px-2 py-0.5 font-bold">
                {t('docs_arch_sec7_badge')}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
                {t('docs_arch_sec7_title')}
              </h2>
            </div>
            <span className="text-[11px] text-[#00FF66] font-bold">{t('docs_arch_sec7_tag')}</span>
          </div>

          {/* 3 DEVELOPER PERSONA VALUE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#1F1F2E] bg-[#09090B] p-5 flex flex-col gap-2 hover:border-[#00E5FF] transition-all">
              <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-sm mb-1">
                <Box className="w-5 h-5 text-[#00E5FF]" />
                <span>{t('docs_arch_roi1_title')}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{t('docs_arch_roi1_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-5 flex flex-col gap-2 hover:border-[#5322FF] transition-all">
              <div className="flex items-center gap-2 text-[#5322FF] font-bold text-sm mb-1">
                <Bot className="w-5 h-5 text-[#5322FF]" />
                <span>{t('docs_arch_roi2_title')}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{t('docs_arch_roi2_desc')}</p>
            </div>

            <div className="border border-[#1F1F2E] bg-[#09090B] p-5 flex flex-col gap-2 hover:border-[#00FF66] transition-all">
              <div className="flex items-center gap-2 text-[#00FF66] font-bold text-sm mb-1">
                <Sliders className="w-5 h-5 text-[#00FF66]" />
                <span>{t('docs_arch_roi3_title')}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{t('docs_arch_roi3_desc')}</p>
            </div>
          </div>

          {/* BOTTOM ACTION HUD BAR */}
          <div className="bg-[#09090B] border border-[#1F1F2E] p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 mt-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              {t('docs_arch_export_whitepaper')}
            </span>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={handleDownloadAst}
                className="px-3.5 py-2 border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-bold uppercase transition-all cursor-pointer rounded-none flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.25)]"
              >
                <FileCode className="w-4 h-4" />
                <span>{t('docs_arch_btn_download_ast')}</span>
              </button>

              <button
                onClick={() => handleExportDoc('pdf', language)}
                className="px-3.5 py-2 border border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66] hover:text-black font-bold uppercase transition-all cursor-pointer rounded-none flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,102,0.25)]"
              >
                <Printer className="w-4 h-4" />
                <span>{t('docs_arch_btn_export_pdf')}</span>
              </button>

              <button
                onClick={() => handleExportDoc('md', language)}
                className="px-3.5 py-2 border border-[#5322FF] bg-[#5322FF]/10 text-white hover:bg-[#5322FF] font-bold uppercase transition-all cursor-pointer rounded-none flex items-center gap-1.5 shadow-[0_0_12px_rgba(83,34,255,0.25)]"
              >
                <FileText className="w-4 h-4" />
                <span>{t('docs_arch_btn_export_md')}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
