import { useState, useEffect, useRef, useMemo, ChangeEvent, DragEvent } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, Crosshair, BarChart3, LineChart, CandlestickChart } from 'lucide-react';
import { Translations } from '@/locales/translations';
import { useTranslation } from '@/context/useLanguage';

export type VisMode = 'waveform' | 'density_matrix' | 'candlestick';
export type PaletteMode = 'cyberpunk' | 'monochrome';

export interface SampleDataset {
  id: string;
  nameKey: string;
  csvData: string;
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'latency',
    nameKey: 'csv_preset_latency',
    csvData: `Timestamp,Region,Latency_ms,Error_Rate,Request_Volume
2026-03-01 00:00,us-east-1,24.5,0.01,14200
2026-03-01 01:00,us-east-1,28.2,0.02,15800
2026-03-01 02:00,us-east-1,45.1,0.08,21000
2026-03-01 03:00,us-west-2,32.0,0.03,18400
2026-03-01 04:00,us-west-2,19.8,0.01,12100
2026-03-01 05:00,eu-central-1,68.4,0.12,32500
2026-03-01 06:00,eu-central-1,84.0,0.18,41200
2026-03-01 07:00,ap-southeast-1,52.1,0.05,27800
2026-03-01 08:00,ap-southeast-1,41.3,0.03,23100
2026-03-01 09:00,us-east-1,30.7,0.02,19500
2026-03-01 10:00,us-east-1,95.2,0.22,48900
2026-03-01 11:00,us-west-2,58.6,0.09,29400
2026-03-01 12:00,eu-central-1,72.3,0.14,36700
2026-03-01 13:00,eu-central-1,61.0,0.07,31000
2026-03-01 14:00,ap-southeast-1,38.9,0.02,20400
2026-03-01 15:00,us-east-1,22.1,0.01,13500`,
  },
  {
    id: 'crypto',
    nameKey: 'csv_preset_crypto',
    csvData: `Time,Asset,Open,High,Low,Close,Volume
00:00,CRAFT//USD,120.5,128.0,118.2,125.4,450000
01:00,CRAFT//USD,125.4,134.2,124.0,132.8,620000
02:00,CRAFT//USD,132.8,133.0,121.5,123.1,890000
03:00,CRAFT//USD,123.1,126.4,115.0,118.9,710000
04:00,CRAFT//USD,118.9,122.0,116.8,121.5,380000
05:00,CRAFT//USD,121.5,138.9,120.1,136.2,1200000
06:00,CRAFT//USD,136.2,145.0,134.0,141.8,1450000
07:00,CRAFT//USD,141.8,142.5,129.0,130.4,980000
08:00,CRAFT//USD,130.4,136.0,128.5,135.1,560000
09:00,CRAFT//USD,135.1,148.0,134.2,146.5,1680000
10:00,CRAFT//USD,146.5,152.0,143.0,149.2,1890000
11:00,CRAFT//USD,149.2,150.0,138.5,140.1,1120000`,
  },
  {
    id: 'telemetry',
    nameKey: 'csv_preset_telemetry',
    csvData: `Node_ID,Agent_Type,Token_Cost,Precision_Score,Execution_Time_ms
Node_01,Dify_Reasoning,0.0024,98.5,240
Node_02,n8n_Orchestrator,0.0001,100.0,45
Node_03,Vector_RAG_bm25,0.0058,94.2,520
Node_04,Pinecone_Index,0.0012,99.1,110
Node_05,Llama_Filter,0.0008,92.0,310
Node_06,Claude_35_Sonnet,0.0142,99.8,850
Node_07,GPT4o_Router,0.0095,97.6,410
Node_08,Guardrail_Schema,0.0002,100.0,18
Node_09,Fanout_Dispatcher,0.0005,99.9,65
Node_10,DeadLetter_Archive,0.0001,100.0,12`,
  },
];

export default function CsvDataVisualizer() {
  const { t } = useTranslation();

  // CSV Data State
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, Record<string, unknown>>[]>([]);
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');
  const [filename, setFilename] = useState<string>('sample_server_latency.csv');

  // Visualization Mode & Palette
  const [visMode, setVisMode] = useState<VisMode>('waveform');
  const [palette, setPalette] = useState<PaletteMode>('cyberpunk');

  // Drag & Drop visual feedback state
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Canvas Telemetry State
  const [fps, setFps] = useState<number>(60);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hover Interaction State for Crosshair telemetry overlay
  const [hoverData, setHoverData] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  // Parse raw CSV string helper
  const parseCSVString = (csvText: string, defaultFileName = 'dataset.csv') => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.meta.fields && results.meta.fields.length > 0) {
          const fields = results.meta.fields;
          setHeaders(fields);
          setParsedRows(results.data as Record<string, Record<string, unknown>>[]);
          setFilename(defaultFileName);

          // Auto detect X and Y axis columns
          const autoX = fields[0];
          const autoY = fields.find((f) => {
            const firstVal = results.data[0] ? (results.data[0] as Record<string, unknown>)[f] : null;
            return typeof firstVal === 'number';
          }) || fields[1] || fields[0];

          setSelectedX(autoX);
          setSelectedY(autoY);
        }
      },
    });
  };

  // Load initial default sample dataset
  useEffect(() => {
    parseCSVString(SAMPLE_DATASETS[0].csvData, 'server_latency_metrics.csv');
  }, []);

  // Handle file drop & upload
  const handleFileUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a valid .csv file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        parseCSVString(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Derived telemetry metrics calculated from parsed CSV rows
  const telemetry = useMemo(() => {
    if (!parsedRows || parsedRows.length === 0 || !selectedY) {
      return { min: 0, max: 0, avg: 0, count: 0, values: [] as number[], labels: [] as string[] };
    }

    const values: number[] = [];
    const labels: string[] = [];

    parsedRows.forEach((row, i) => {
      const rawY = row[selectedY];
      const numY = typeof rawY === 'number' ? rawY : parseFloat(String(rawY));
      if (!isNaN(numY)) {
        values.push(numY);
        const rawX = row[selectedX];
        labels.push(rawX !== undefined && rawX !== null ? String(rawX) : `#${i + 1}`);
      }
    });

    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0, values: [], labels: [] };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    return { min, max, avg, count: values.length, values, labels };
  }, [parsedRows, selectedX, selectedY]);

  // Render HTML5 2D Canvas Loop at 60fps
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;
    let fpsTimer = performance.now();

    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.floor(rect.width) || 800;
        const h = Math.floor(rect.height) || 500;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let phase = 0;

    const render = (now: number) => {
      frameCount++;
      if (now - fpsTimer >= 500) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - fpsTimer))));
        frameCount = 0;
        fpsTimer = now;
      }

      phase += 0.02;

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Color Palette config
      const isNeon = palette === 'cyberpunk';
      const bg = '#0B0B0F';
      const gridColor = 'rgba(39, 39, 42, 0.6)'; // zinc-800 grid lines
      const primaryColor = isNeon ? '#5322ff' : '#FFFFFF';
      const secondaryColor = isNeon ? '#00E5FF' : '#A1A1AA';

      // Clear Canvas Background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 1. Draw Swiss CAD Blueprint Grid (1px zinc-800 lines)
      const gridSize = 40;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Draw CAD Crosshair Corner Anchors (+) & Dimension Indicators
      ctx.strokeStyle = isNeon ? '#00E5FF' : '#FFFFFF';
      ctx.lineWidth = 1;

      // Crosshairs at margins
      const crosshairs = [
        { x: 20, y: 20 },
        { x: w - 20, y: 20 },
        { x: 20, y: h - 20 },
        { x: w - 20, y: h - 20 },
      ];

      crosshairs.forEach((ch) => {
        ctx.beginPath();
        ctx.moveTo(ch.x - 6, ch.y);
        ctx.lineTo(ch.x + 6, ch.y);
        ctx.moveTo(ch.x, ch.y - 6);
        ctx.lineTo(ch.x, ch.y + 6);
        ctx.stroke();
      });

      // Dimension Indicator text on border
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#71717A';
      ctx.fillText(`W: ${Math.round(w)}px`, 35, 16);
      ctx.fillText(`H: ${Math.round(h)}px`, w - 85, 16);

      // Margin paddings for plot area
      const paddingLeft = 60;
      const paddingRight = 40;
      const paddingTop = 50;
      const paddingBottom = 50;

      const plotW = w - paddingLeft - paddingRight;
      const plotH = h - paddingTop - paddingBottom;

      const { min, max, values, labels } = telemetry;

      if (values.length > 0) {
        const valRange = max - min || 1;

        // Draw Y-Axis Telemetry Scale Ticks
        const yTicks = 5;
        ctx.strokeStyle = 'rgba(63, 63, 70, 0.4)';
        ctx.fillStyle = '#A1A1AA';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';

        for (let i = 0; i <= yTicks; i++) {
          const ratio = i / yTicks;
          const tickVal = max - ratio * valRange;
          const tickY = paddingTop + ratio * plotH;

          ctx.beginPath();
          ctx.moveTo(paddingLeft - 5, tickY);
          ctx.lineTo(paddingLeft + plotW, tickY);
          ctx.stroke();

          ctx.fillText(tickVal.toFixed(1), paddingLeft - 10, tickY + 3);
        }

        // ================= MODE 01: CYBER WAVEFORM / LINE GRID =================
        if (visMode === 'waveform') {
          const stepX = plotW / Math.max(values.length - 1, 1);

          // Path construction
          ctx.beginPath();
          const points: { x: number; y: number; val: number; label: string }[] = [];

          values.forEach((val, i) => {
            const px = paddingLeft + i * stepX;
            const normY = (val - min) / valRange;
            // Subtle dynamic ambient pulse
            const waveOffset = Math.sin(phase + i * 0.4) * 3;
            const py = paddingTop + (1 - normY) * plotH + waveOffset;

            points.push({ x: px, y: py, val, label: labels[i] });

            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          });

          // Gradient area under waveform
          const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + plotH);
          grad.addColorStop(0, isNeon ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 255, 255, 0.25)');
          grad.addColorStop(1, 'rgba(11, 11, 15, 0.0)');

          // Draw fill under curve
          ctx.save();
          const fillPath = new Path2D();
          if (points.length > 0) {
            fillPath.moveTo(points[0].x, paddingTop + plotH);
            points.forEach((pt) => fillPath.lineTo(pt.x, pt.y));
            fillPath.lineTo(points[points.length - 1].x, paddingTop + plotH);
            fillPath.closePath();
            ctx.fillStyle = grad;
            ctx.fill(fillPath);
          }
          ctx.restore();

          // Stroke Waveform Line
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Node Anchors & X-Axis Labels
          ctx.textAlign = 'center';
          ctx.fillStyle = '#A1A1AA';

          points.forEach((pt, i) => {
            // Anchor dot
            ctx.fillStyle = isNeon ? '#00E5FF' : '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.stroke();

            // X-Axis labels (skip every 2nd or 3rd if dense)
            const showLabel = values.length <= 15 || i % Math.ceil(values.length / 12) === 0;
            if (showLabel) {
              ctx.fillStyle = '#71717A';
              ctx.fillText(pt.label, pt.x, paddingTop + plotH + 18);
            }
          });
        }

        // ================= MODE 02: BRUTALIST DENSITY MATRIX / BAR BLOCKS =================
        else if (visMode === 'density_matrix') {
          const totalBars = values.length;
          const barGap = 6;
          const barWidth = Math.max((plotW - barGap * (totalBars + 1)) / totalBars, 4);

          ctx.textAlign = 'center';

          values.forEach((val, i) => {
            const bx = paddingLeft + barGap + i * (barWidth + barGap);
            const normY = (val - min) / valRange;
            const barH = Math.max(normY * plotH, 4);
            const by = paddingTop + plotH - barH;

            // Draw Brutalist Block Bar with segmented grid matrix
            const segments = 10;
            const segH = barH / segments;

            for (let seg = 0; seg < segments; seg++) {
              const segY = by + seg * segH;
              const isTop = seg === 0;

              ctx.fillStyle = isTop
                ? secondaryColor
                : seg % 2 === 0
                  ? primaryColor
                  : isNeon
                    ? '#1E1B4B'
                    : '#27272A';

              ctx.fillRect(bx, segY, barWidth, segH - 1);
            }

            // Outline
            ctx.strokeStyle = isNeon ? '#00E5FF' : '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, barWidth, barH);

            // Label
            const showLabel = values.length <= 15 || i % Math.ceil(values.length / 12) === 0;
            if (showLabel) {
              ctx.fillStyle = '#71717A';
              ctx.fillText(labels[i], bx + barWidth / 2, paddingTop + plotH + 18);
            }
          });
        }

        // ================= MODE 03: ALGORITHMIC CANDLESTICK / FINANCIAL MESH =================
        else if (visMode === 'candlestick') {
          const count = values.length;
          const candleGap = 10;
          const candleW = Math.max((plotW - candleGap * (count + 1)) / count, 6);

          ctx.textAlign = 'center';

          values.forEach((val, i) => {
            const cx = paddingLeft + candleGap + i * (candleW + candleGap) + candleW / 2;

            // Synthetic Open/High/Low/Close derived deterministically from Y value & neighbor trends
            const prevVal = i > 0 ? values[i - 1] : val;
            const openVal = prevVal;
            const closeVal = val;
            const isBullish = closeVal >= openVal;

            const highVal = Math.max(openVal, closeVal) + (max - min) * 0.08 * (1 + Math.sin(i * 1.5));
            const lowVal = Math.min(openVal, closeVal) - (max - min) * 0.08 * (1 + Math.cos(i * 1.5));

            const highY = paddingTop + (1 - (highVal - min) / valRange) * plotH;
            const lowY = paddingTop + (1 - (lowVal - min) / valRange) * plotH;
            const openY = paddingTop + (1 - (openVal - min) / valRange) * plotH;
            const closeY = paddingTop + (1 - (closeVal - min) / valRange) * plotH;

            const candleTop = Math.min(openY, closeY);
            const candleH = Math.max(Math.abs(closeY - openY), 3);

            // Wick Line
            ctx.strokeStyle = isBullish ? (isNeon ? '#00E5FF' : '#FFFFFF') : isNeon ? '#FF007A' : '#71717A';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, highY);
            ctx.lineTo(cx, lowY);
            ctx.stroke();

            // Candlestick Body Block
            ctx.fillStyle = isBullish ? (isNeon ? 'rgba(0, 229, 255, 0.6)' : '#FFFFFF') : isNeon ? 'rgba(255, 0, 122, 0.6)' : '#27272A';
            ctx.fillRect(cx - candleW / 2, candleTop, candleW, candleH);

            ctx.strokeStyle = isBullish ? (isNeon ? '#00E5FF' : '#FFFFFF') : isNeon ? '#FF007A' : '#A1A1AA';
            ctx.strokeRect(cx - candleW / 2, candleTop, candleW, candleH);

            // Label
            const showLabel = values.length <= 15 || i % Math.ceil(values.length / 12) === 0;
            if (showLabel) {
              ctx.fillStyle = '#71717A';
              ctx.fillText(labels[i], cx, paddingTop + plotH + 18);
            }
          });
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animId);
    };
  }, [telemetry, visMode, palette]);

  // Mouse hover event on Canvas to compute crosshair readout
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const { values, labels } = telemetry;
    if (values.length === 0) return;

    const paddingLeft = 60;
    const paddingRight = 40;
    const plotW = rect.width - paddingLeft - paddingRight;

    // Find nearest data index based on X mouse position
    const relativeX = mx - paddingLeft;
    const index = Math.max(0, Math.min(values.length - 1, Math.round((relativeX / plotW) * (values.length - 1))));

    if (index >= 0 && index < values.length) {
      setHoverData({
        x: mx,
        y: my,
        label: labels[index],
        value: values[index],
      });
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <section id="csv-visualizer" className="relative bg-[#0B0B0F] border-t border-b border-zinc-800 pt-28 pb-16 lg:pt-32 lg:pb-24 font-mono scroll-mt-20">
      {/* Swiss CAD Wireframe Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-2 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
              <span className="h-1.5 w-1.5 bg-[#5322ff] animate-ping" />
              {t('csv_section_label')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-mono">
              {t('csv_title')}
            </h2>
            <p className="mt-1 text-sm text-zinc-400 font-sans max-w-xl">
              {t('csv_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-zinc-300">
              <FileSpreadsheet className="h-3.5 w-3.5 text-cyan-glow" />
              <span className="text-zinc-400 truncate max-w-[160px]">{filename}</span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-cyan-glow font-bold">
              ROWS: {telemetry.count}
            </div>
          </div>
        </div>

        {/* Dual Panel Layout Architecture */}
        <div className="grid lg:grid-cols-[340px_1fr] border border-zinc-800 bg-[#09090c] shadow-2xl min-h-[620px]">
          {/* ================= LEFT PANEL: CONTROL & DATA MAPPING ================= */}
          <div className="p-5 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#0B0B0F] flex flex-col justify-between font-mono gap-6">
            <div className="space-y-5">
              {/* Dropzone File Upload */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  01 // CSV FILE UPLOAD
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed p-4 text-center transition-all cursor-pointer group ${
                    isDragging
                      ? 'border-[#00E5FF] bg-[#00E5FF]/10'
                      : 'border-zinc-800 bg-zinc-950 hover:border-[#5322ff] hover:bg-zinc-900'
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="h-6 w-6 mx-auto mb-2 text-cyan-glow group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-white uppercase">{t('csv_dropzone_title')}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">{t('csv_dropzone_desc')}</div>
                </div>
              </div>

              {/* Sample Preset Datasets */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  02 // {t('csv_preset_label')}
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {SAMPLE_DATASETS.map((ds) => (
                    <button
                      key={ds.id}
                      onClick={() => parseCSVString(ds.csvData, `${ds.id}_preset.csv`)}
                      className="w-full text-left py-1.5 px-2.5 border border-zinc-800 bg-zinc-950 hover:border-[#5322ff] hover:bg-zinc-900 text-[11px] text-zinc-300 hover:text-white transition-colors truncate"
                    >
                      {t(ds.nameKey as keyof Translations)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column Selectors (X-Axis vs Y-Axis) */}
              <div className="space-y-3 border-t border-zinc-800 pt-4">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500">
                  03 // COLUMN AXIS MAPPING
                </label>

                {/* X-Axis Selector */}
                <div>
                  <div className="text-[10px] text-zinc-400 mb-1">{t('csv_col_x')}</div>
                  <select
                    value={selectedX}
                    onChange={(e) => setSelectedX(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2 outline-none focus:border-[#5322ff]"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Y-Axis Selector */}
                <div>
                  <div className="text-[10px] text-zinc-400 mb-1">{t('csv_col_y')}</div>
                  <select
                    value={selectedY}
                    onChange={(e) => setSelectedY(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-cyan-glow font-bold p-2 outline-none focus:border-[#00E5FF]"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visualization Mode Switcher */}
              <div className="border-t border-zinc-800 pt-4">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  04 // {t('csv_mode_label')}
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setVisMode('waveform')}
                    className={`w-full text-left py-2 px-3 border text-xs flex items-center gap-2 transition-all ${
                      visMode === 'waveform'
                        ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <LineChart className="h-3.5 w-3.5 text-cyan-glow" />
                    <span>{t('csv_mode_waveform')}</span>
                  </button>

                  <button
                    onClick={() => setVisMode('density_matrix')}
                    className={`w-full text-left py-2 px-3 border text-xs flex items-center gap-2 transition-all ${
                      visMode === 'density_matrix'
                        ? 'border-[#5322ff] bg-[#5322ff]/20 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-[#5322ff]" />
                    <span>{t('csv_mode_matrix')}</span>
                  </button>

                  <button
                    onClick={() => setVisMode('candlestick')}
                    className={`w-full text-left py-2 px-3 border text-xs flex items-center gap-2 transition-all ${
                      visMode === 'candlestick'
                        ? 'border-[#D400FF] bg-[#D400FF]/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CandlestickChart className="h-3.5 w-3.5 text-[#D400FF]" />
                    <span>{t('csv_mode_candlestick')}</span>
                  </button>
                </div>
              </div>

              {/* Palette Switcher */}
              <div className="border-t border-zinc-800 pt-4">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  05 // {t('csv_palette_label')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPalette('cyberpunk')}
                    className={`p-2 border text-[10px] font-bold transition-all text-center ${
                      palette === 'cyberpunk'
                        ? 'border-[#00E5FF] bg-zinc-900 text-cyan-glow'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    CYBER NEON
                  </button>
                  <button
                    onClick={() => setPalette('monochrome')}
                    className={`p-2 border text-[10px] font-bold transition-all text-center ${
                      palette === 'monochrome'
                        ? 'border-white bg-zinc-900 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    MONOCHROME
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL: LIVE CANVAS VISUALIZER ================= */}
          <div className="flex flex-col bg-[#07070A]">
            {/* Top Canvas Header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5 bg-[#09090c] text-xs">
              <div className="flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-cyan-glow" />
                <span className="text-zinc-300 font-bold uppercase">SWISS CAD BLUEPRINT CANVAS</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span>MODE: <strong className="text-white uppercase">{visMode}</strong></span>
                <span className="text-cyan-glow font-bold">{fps} FPS</span>
              </div>
            </div>

            {/* Interactive Canvas Viewport Container */}
            <div
              ref={containerRef}
              className="relative flex-1 min-h-[420px] bg-[#0B0B0F] flex items-center justify-center overflow-hidden select-none cursor-crosshair"
            >
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseLeave}
                className="block w-full h-full"
              />

              {/* Crosshair Hover Telemetry Overlay */}
              {hoverData && (
                <div
                  className="absolute pointer-events-none z-20 border border-cyan-glow bg-zinc-950/90 p-2 text-[10px] text-white shadow-xl backdrop-blur-sm -translate-x-1/2 -translate-y-full mb-2"
                  style={{ left: hoverData.x, top: hoverData.y }}
                >
                  <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 mb-1">
                    KEY: {hoverData.label}
                  </div>
                  <div className="text-cyan-glow font-extrabold text-xs">
                    VALUE: {hoverData.value}
                  </div>
                </div>
              )}
            </div>

            {/* Real-time Telemetry Readout Footer Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-zinc-800 bg-[#09090c] p-4 gap-4 text-xs">
              <div className="border border-zinc-800/80 bg-zinc-950 p-2.5">
                <div className="text-[10px] text-zinc-500 uppercase">{t('csv_telemetry_rows')}</div>
                <div className="text-sm font-bold text-white mt-0.5">{telemetry.count}</div>
              </div>

              <div className="border border-zinc-800/80 bg-zinc-950 p-2.5">
                <div className="text-[10px] text-zinc-500 uppercase">{t('csv_telemetry_min')}</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{telemetry.min.toFixed(2)}</div>
              </div>

              <div className="border border-zinc-800/80 bg-zinc-950 p-2.5">
                <div className="text-[10px] text-zinc-500 uppercase">{t('csv_telemetry_max')}</div>
                <div className="text-sm font-bold text-[#FF007A] mt-0.5">{telemetry.max.toFixed(2)}</div>
              </div>

              <div className="border border-zinc-800/80 bg-zinc-950 p-2.5">
                <div className="text-[10px] text-zinc-500 uppercase">{t('csv_telemetry_avg')}</div>
                <div className="text-sm font-bold text-cyan-glow mt-0.5">{telemetry.avg.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
