import { useState, useEffect, useRef, useMemo, ChangeEvent, DragEvent } from 'react';
import Papa from 'papaparse';
import {
  Upload,
  Crosshair,
  BarChart3,
  LineChart,
  CandlestickChart,
  RefreshCw,
  ExternalLink,
  Globe,
  Download,
  FileCode,
  Code,
  X,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';
import { fetchMekongDatasets, fetchCsvContent, MekongResource, FALLBACK_MEKONG_DATASETS } from '@/lib/mekongService';

export type VisMode = 'waveform' | 'density_matrix' | 'candlestick';
export type PaletteMode = 'cyberpunk' | 'monochrome';

function generateSeedHash(): string {
  const chars = '0123456789ABCDEF';
  let hash = '0x';
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export default function CsvDataVisualizer() {
  const { t } = useTranslation();

  // CKAN Mekong Datasets State
  const [mekongDatasets, setMekongDatasets] = useState<MekongResource[]>(FALLBACK_MEKONG_DATASETS);
  const [selectedMekongId, setSelectedMekongId] = useState<string>(FALLBACK_MEKONG_DATASETS[0].id);
  const [activeResource, setActiveResource] = useState<MekongResource | null>(FALLBACK_MEKONG_DATASETS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CSV Data State
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, Record<string, unknown>>[]>([]);
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');
  const [filename, setFilename] = useState<string>('mekong_dataset.csv');
  const [seedHash, setSeedHash] = useState<string>('0x89B4C2A1');

  // Visualization Mode & Palette
  const [visMode, setVisMode] = useState<VisMode>('waveform');
  const [palette, setPalette] = useState<PaletteMode>('cyberpunk');

  // Embed Modal & Copy State
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  // Fetch live Mekong Dataset resources list on mount
  useEffect(() => {
    let isMounted = true;
    async function loadMekongList() {
      setIsLoading(true);
      const list = await fetchMekongDatasets();
      if (isMounted) {
        setMekongDatasets(list);
        if (list.length > 0) {
          setSelectedMekongId(list[0].id);
          loadDatasetResource(list[0]);
        }
      }
      setIsLoading(false);
    }
    loadMekongList();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch content of selected Mekong CSV resource
  const loadDatasetResource = async (res: MekongResource) => {
    setIsLoading(true);
    setActiveResource(res);
    setSeedHash(generateSeedHash());
    try {
      const csvText = await fetchCsvContent(res.url);
      parseCSVString(csvText, `${res.resourceName || res.datasetTitle}.csv`);
    } catch (err) {
      console.error('Failed to load CSV content from Mekong CKAN resource:', err);
      parseCSVString(FALLBACK_MEKONG_DATASETS[0].url, `${res.datasetTitle}.csv`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropdown selection change
  const handleSelectMekongDataset = (resId: string) => {
    setSelectedMekongId(resId);
    const target = mekongDatasets.find((d) => d.id === resId);
    if (target) {
      loadDatasetResource(target);
    }
  };

  // Handle "Fetch Random Dataset"
  const handleFetchRandom = () => {
    if (mekongDatasets.length === 0) return;
    const randomIndex = Math.floor(Math.random() * mekongDatasets.length);
    const randomRes = mekongDatasets[randomIndex];
    setSelectedMekongId(randomRes.id);
    loadDatasetResource(randomRes);
  };

  // Handle manual file drop & upload
  const handleFileUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a valid .csv file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setActiveResource({
          id: `custom-${Date.now()}`,
          datasetTitle: `User Custom Dataset (${file.name})`,
          resourceName: file.name,
          url: '',
          format: 'CSV',
        });
        setSeedHash(generateSeedHash());
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

  // Helper to render cryptographic watermark onto 2D canvas context
  const drawCryptographicWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number, seed: string) => {
    const watermarkText = `ARTIFICIAL CRAFT // ARTIFACT_ID: 0x${seed.replace('0x', '')} // DETERMINISTIC VISUAL ENGINE`;
    const fontSize = Math.max(12, Math.round(width * 0.015));
    ctx.save();
    ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    const paddingX = Math.round(width * 0.03);
    const paddingY = Math.round(height * 0.03);

    const textMetrics = ctx.measureText(watermarkText);
    const bgWidth = textMetrics.width + 20;
    const bgHeight = fontSize + 10;

    // Dark brutalist backing box
    ctx.fillStyle = 'rgba(11, 11, 15, 0.9)';
    ctx.fillRect(width - paddingX - bgWidth, height - paddingY - bgHeight, bgWidth, bgHeight);
    ctx.strokeStyle = '#5322ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width - paddingX - bgWidth, height - paddingY - bgHeight, bgWidth, bgHeight);

    // Glowing cyan watermark text
    ctx.fillStyle = '#00E5FF';
    ctx.fillText(watermarkText, width - paddingX - 10, height - paddingY - 5);
    ctx.restore();
  };

  // 📸 Export 2K PNG Engine (2048x2048 high resolution)
  const handleExport2KPNG = () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 2048;
    exportCanvas.height = 2048;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const size = 2048;
    const isNeon = palette === 'cyberpunk';
    const bg = '#0B0B0F';
    const primaryColor = isNeon ? '#5322ff' : '#FFFFFF';
    const secondaryColor = isNeon ? '#00E5FF' : '#A1A1AA';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // CAD Grid lines
    ctx.strokeStyle = 'rgba(39, 39, 42, 0.6)';
    ctx.lineWidth = 2;
    for (let x = 0; x < size; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y < size; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    const { min, max, values } = telemetry;
    const paddingLeft = 160;
    const paddingRight = 100;
    const paddingTop = 160;
    const paddingBottom = 160;
    const plotW = size - paddingLeft - paddingRight;
    const plotH = size - paddingTop - paddingBottom;

    if (values.length > 0) {
      const valRange = max - min || 1;

      if (visMode === 'waveform') {
        const stepX = plotW / Math.max(values.length - 1, 1);
        ctx.beginPath();
        const points: { x: number; y: number }[] = [];

        values.forEach((val, i) => {
          const px = paddingLeft + i * stepX;
          const normY = (val - min) / valRange;
          const py = paddingTop + (1 - normY) * plotH;
          points.push({ x: px, y: py });
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });

        const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + plotH);
        grad.addColorStop(0, isNeon ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(1, 'rgba(11, 11, 15, 0.0)');

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

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        points.forEach((pt) => {
          ctx.fillStyle = isNeon ? '#00E5FF' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
          ctx.stroke();
        });
      } else if (visMode === 'density_matrix') {
        const totalBars = values.length;
        const barGap = 16;
        const barWidth = Math.max((plotW - barGap * (totalBars + 1)) / totalBars, 12);

        values.forEach((val, i) => {
          const bx = paddingLeft + barGap + i * (barWidth + barGap);
          const normY = (val - min) / valRange;
          const barH = Math.max(normY * plotH, 10);
          const by = paddingTop + plotH - barH;

          ctx.fillStyle = primaryColor;
          ctx.fillRect(bx, by, barWidth, barH);
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, barWidth, barH);
        });
      } else if (visMode === 'candlestick') {
        const count = values.length;
        const candleGap = 20;
        const candleW = Math.max((plotW - candleGap * (count + 1)) / count, 16);

        values.forEach((val, i) => {
          const cx = paddingLeft + candleGap + i * (candleW + candleGap) + candleW / 2;
          const prevVal = i > 0 ? values[i - 1] : val;
          const openVal = prevVal;
          const closeVal = val;
          const isBullish = closeVal >= openVal;

          const highVal = Math.max(openVal, closeVal) + (max - min) * 0.08;
          const lowVal = Math.min(openVal, closeVal) - (max - min) * 0.08;

          const highY = paddingTop + (1 - (highVal - min) / valRange) * plotH;
          const lowY = paddingTop + (1 - (lowVal - min) / valRange) * plotH;
          const openY = paddingTop + (1 - (openVal - min) / valRange) * plotH;
          const closeY = paddingTop + (1 - (closeVal - min) / valRange) * plotH;

          const candleTop = Math.min(openY, closeY);
          const candleH = Math.max(Math.abs(closeY - openY), 6);

          ctx.strokeStyle = isBullish ? (isNeon ? '#00E5FF' : '#FFFFFF') : '#FF007A';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, highY);
          ctx.lineTo(cx, lowY);
          ctx.stroke();

          ctx.fillStyle = isBullish ? (isNeon ? 'rgba(0, 229, 255, 0.7)' : '#FFFFFF') : 'rgba(255, 0, 122, 0.7)';
          ctx.fillRect(cx - candleW / 2, candleTop, candleW, candleH);
        });
      }
    }

    // Embed Cryptographic Watermark
    drawCryptographicWatermark(ctx, size, size, seedHash);

    // Trigger PNG Download
    const link = document.createElement('a');
    link.download = `artificial-craft-mekong-${seedHash}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  // 📐 Export Vector SVG Engine
  const handleExportVectorSVG = () => {
    const width = 1200;
    const height = 1200;
    const isNeon = palette === 'cyberpunk';
    const bg = '#0B0B0F';
    const primaryColor = isNeon ? '#5322ff' : '#FFFFFF';
    const secondaryColor = isNeon ? '#00E5FF' : '#A1A1AA';

    const { min, max, values } = telemetry;
    const paddingLeft = 100;
    const paddingRight = 60;
    const paddingTop = 100;
    const paddingBottom = 100;
    const plotW = width - paddingLeft - paddingRight;
    const plotH = height - paddingTop - paddingBottom;

    let svgPaths = '';

    if (values.length > 0) {
      const valRange = max - min || 1;

      if (visMode === 'waveform') {
        const stepX = plotW / Math.max(values.length - 1, 1);
        let pathData = '';

        values.forEach((val, i) => {
          const px = paddingLeft + i * stepX;
          const normY = (val - min) / valRange;
          const py = paddingTop + (1 - normY) * plotH;

          if (i === 0) pathData += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
          else pathData += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;

          svgPaths += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="${secondaryColor}" />\n`;
        });

        svgPaths += `<path d="${pathData}" stroke="${secondaryColor}" stroke-width="3" fill="none" />\n`;
      } else if (visMode === 'density_matrix') {
        const totalBars = values.length;
        const barGap = 10;
        const barWidth = Math.max((plotW - barGap * (totalBars + 1)) / totalBars, 8);

        values.forEach((val, i) => {
          const bx = paddingLeft + barGap + i * (barWidth + barGap);
          const normY = (val - min) / valRange;
          const barH = Math.max(normY * plotH, 6);
          const by = paddingTop + plotH - barH;

          svgPaths += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barH.toFixed(1)}" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="1.5" />\n`;
        });
      }
    }

    const watermarkText = `ARTIFICIAL CRAFT // ARTIFACT_ID: 0x${seedHash.replace('0x', '')} // DETERMINISTIC VISUAL ENGINE`;

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .watermark-text {
        font-family: "JetBrains Mono", monospace;
        font-size: 16px;
        font-weight: 600;
        fill: #00E5FF;
      }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="${bg}" />
  <g id="data-paths">
${svgPaths}
  </g>
  <!-- Cryptographic Artifact Watermark -->
  <g id="watermark" transform="translate(${width - 40}, ${height - 40})">
    <rect x="-720" y="-30" width="720" height="36" fill="#0B0B0F" fill-opacity="0.9" stroke="#5322ff" stroke-width="1.5" />
    <text x="-12" y="-6" text-anchor="end" class="watermark-text">${watermarkText}</text>
  </g>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `artificial-craft-mekong-${seedHash}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // 🔗 Embed Snippet HTML code generator
  const embedSnippet = `<div class="ac-embed-container" style="position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #0B0B0F; border: 1px solid #27272A;">
  <iframe src="https://artificialcraft.space/embed/csv-visualizer?seed=${seedHash}&visMode=${visMode}&palette=${palette}" width="100%" height="100%" frameborder="0" scrolling="no" loading="lazy"></iframe>
  <div style="position: absolute; bottom: 8px; right: 12px; font-size: 10px; color: #71717A; pointer-events: auto;">
    <a href="https://artificialcraft.space/?utm_source=embed_widget" target="_blank" rel="noopener" style="color: #00E5FF; text-decoration: none; font-weight: bold;">ARTIFICIAL CRAFT // ENGINE ↗</a>
  </div>
</div>`;

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

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

      const isNeon = palette === 'cyberpunk';
      const bg = '#0B0B0F';
      const gridColor = 'rgba(39, 39, 42, 0.6)';
      const primaryColor = isNeon ? '#5322ff' : '#FFFFFF';
      const secondaryColor = isNeon ? '#00E5FF' : '#A1A1AA';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Grid
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

      // CAD Anchors
      ctx.strokeStyle = isNeon ? '#00E5FF' : '#FFFFFF';
      ctx.lineWidth = 1;

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

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#71717A';
      ctx.fillText(`W: ${Math.round(w)}px`, 35, 16);
      ctx.fillText(`H: ${Math.round(h)}px`, w - 85, 16);

      const paddingLeft = 60;
      const paddingRight = 40;
      const paddingTop = 50;
      const paddingBottom = 50;

      const plotW = w - paddingLeft - paddingRight;
      const plotH = h - paddingTop - paddingBottom;

      const { min, max, values, labels } = telemetry;

      if (values.length > 0) {
        const valRange = max - min || 1;

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

        if (visMode === 'waveform') {
          const stepX = plotW / Math.max(values.length - 1, 1);
          ctx.beginPath();
          const points: { x: number; y: number; val: number; label: string }[] = [];

          values.forEach((val, i) => {
            const px = paddingLeft + i * stepX;
            const normY = (val - min) / valRange;
            const waveOffset = Math.sin(phase + i * 0.4) * 3;
            const py = paddingTop + (1 - normY) * plotH + waveOffset;

            points.push({ x: px, y: py, val, label: labels[i] });

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });

          const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + plotH);
          grad.addColorStop(0, isNeon ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 255, 255, 0.25)');
          grad.addColorStop(1, 'rgba(11, 11, 15, 0.0)');

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

          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.fillStyle = '#A1A1AA';

          points.forEach((pt, i) => {
            ctx.fillStyle = isNeon ? '#00E5FF' : '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
            ctx.stroke();

            const showLabel = values.length <= 15 || i % Math.ceil(values.length / 12) === 0;
            if (showLabel) {
              ctx.fillStyle = '#71717A';
              ctx.fillText(pt.label, pt.x, paddingTop + plotH + 18);
            }
          });
        } else if (visMode === 'density_matrix') {
          const totalBars = values.length;
          const barGap = 6;
          const barWidth = Math.max((plotW - barGap * (totalBars + 1)) / totalBars, 4);

          ctx.textAlign = 'center';

          values.forEach((val, i) => {
            const bx = paddingLeft + barGap + i * (barWidth + barGap);
            const normY = (val - min) / valRange;
            const barH = Math.max(normY * plotH, 4);
            const by = paddingTop + plotH - barH;

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

            ctx.strokeStyle = isNeon ? '#00E5FF' : '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, barWidth, barH);

            const showLabel = values.length <= 15 || i % Math.ceil(values.length / 12) === 0;
            if (showLabel) {
              ctx.fillStyle = '#71717A';
              ctx.fillText(labels[i], bx + barWidth / 2, paddingTop + plotH + 18);
            }
          });
        } else if (visMode === 'candlestick') {
          const count = values.length;
          const candleGap = 10;
          const candleW = Math.max((plotW - candleGap * (count + 1)) / count, 6);

          ctx.textAlign = 'center';

          values.forEach((val, i) => {
            const cx = paddingLeft + candleGap + i * (candleW + candleGap) + candleW / 2;

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

            ctx.strokeStyle = isBullish ? (isNeon ? '#00E5FF' : '#FFFFFF') : isNeon ? '#FF007A' : '#71717A';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, highY);
            ctx.lineTo(cx, lowY);
            ctx.stroke();

            ctx.fillStyle = isBullish ? (isNeon ? 'rgba(0, 229, 255, 0.6)' : '#FFFFFF') : isNeon ? 'rgba(255, 0, 122, 0.6)' : '#27272A';
            ctx.fillRect(cx - candleW / 2, candleTop, candleW, candleH);

            ctx.strokeStyle = isBullish ? (isNeon ? '#00E5FF' : '#FFFFFF') : isNeon ? '#FF007A' : '#A1A1AA';
            ctx.strokeRect(cx - candleW / 2, candleTop, candleW, candleH);

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
              <Globe className="h-3.5 w-3.5 text-cyan-glow" />
              <span className="text-zinc-400 truncate max-w-[200px]" title={activeResource?.datasetTitle}>
                {activeResource?.datasetTitle || filename}
              </span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-cyan-glow font-bold">
              ROWS: {telemetry.count}
            </div>
          </div>
        </div>

        {/* Dual Panel Layout Architecture */}
        <div className="grid lg:grid-cols-[360px_1fr] border border-zinc-800 bg-[#09090c] shadow-2xl min-h-[620px]">
          {/* ================= LEFT PANEL: CONTROL & DATA MAPPING ================= */}
          <div className="p-5 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#0B0B0F] flex flex-col justify-between font-mono gap-6">
            <div className="space-y-5">
              {/* Interactive Open Mekong Datasets Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500">
                    01 // {t('csv_preset_label')}
                  </label>
                  {isLoading && (
                    <span className="text-[10px] text-cyan-glow flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      FETCHING...
                    </span>
                  )}
                </div>

                <div className="relative mb-2">
                  <select
                    value={selectedMekongId}
                    onChange={(e) => handleSelectMekongDataset(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2.5 outline-none focus:border-[#5322ff] transition-colors truncate"
                  >
                    {mekongDatasets.map((ds) => (
                      <option key={ds.id} value={ds.id} className="bg-zinc-950 text-white truncate">
                        {ds.datasetTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleFetchRandom}
                  disabled={isLoading}
                  className="w-full py-2 px-3 border border-[#5322ff]/50 bg-[#5322ff]/10 hover:bg-[#5322ff] hover:text-white text-cyan-glow font-mono text-xs font-bold uppercase transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>{t('csv_fetch_random')}</span>
                </button>
              </div>

              {/* Dataset Metadata Header */}
              {activeResource && (
                <div className="border border-zinc-800 bg-zinc-950 p-2.5 text-[10px] space-y-1">
                  <div className="text-zinc-500 uppercase">{t('csv_source_url')}</div>
                  <div className="text-zinc-300 font-bold truncate">{activeResource.datasetTitle}</div>
                  {activeResource.url && (
                    <a
                      href={activeResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-glow hover:underline truncate max-w-full"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="truncate">{activeResource.url}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Fallback Custom CSV Dropzone */}
              <div className="border-t border-zinc-800 pt-4">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  02 // CUSTOM CSV FILE FALLBACK
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed p-3 text-center transition-all cursor-pointer group ${
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
                  <Upload className="h-5 w-5 mx-auto mb-1 text-cyan-glow group-hover:scale-110 transition-transform" />
                  <div className="text-[11px] font-bold text-white uppercase">{t('csv_dropzone_title')}</div>
                  <div className="text-[9px] text-zinc-500">{t('csv_dropzone_desc')}</div>
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

              {/* Palette Switcher & Export Action Buttons */}
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                  05 // {t('csv_palette_label')} & EXPORT ENGINE
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

                {/* Export Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleExport2KPNG}
                    className="w-full py-2 px-3 border border-cyan-glow/50 bg-cyan-glow/10 hover:bg-cyan-glow hover:text-black text-cyan-glow font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    <span>{t('csv_export_png')}</span>
                  </button>

                  <button
                    onClick={handleExportVectorSVG}
                    className="w-full py-2 px-3 border border-zinc-700 bg-zinc-900 hover:border-[#5322ff] hover:bg-[#5322ff]/20 text-zinc-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group"
                  >
                    <FileCode className="h-3.5 w-3.5 text-[#5322ff] group-hover:scale-110 transition-transform" />
                    <span>{t('csv_export_svg')}</span>
                  </button>

                  <button
                    onClick={() => setIsEmbedModalOpen(true)}
                    className="w-full py-2 px-3 border border-zinc-700 bg-zinc-950 hover:border-[#00E5FF] hover:bg-zinc-900 text-zinc-300 hover:text-cyan-glow font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group"
                  >
                    <Code className="h-3.5 w-3.5 text-cyan-glow group-hover:scale-110 transition-transform" />
                    <span>{t('csv_copy_embed')}</span>
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

              {/* Loading Indicator Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2 font-mono text-xs text-cyan-glow">
                  <RefreshCw className="h-6 w-6 animate-spin text-cyan-glow" />
                  <span className="tracking-widest">{t('csv_loading_dataset')}</span>
                </div>
              )}

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

      {/* Embed Code Modal */}
      {isEmbedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl border border-zinc-800 bg-[#09090c] p-6 shadow-2xl font-mono">
            <button
              onClick={() => setIsEmbedModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 border border-zinc-800 bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-cyan-glow font-bold text-sm mb-4">
              <Code className="h-4 w-4" />
              <span>{t('csv_embed_modal_title')}</span>
            </div>

            <textarea
              readOnly
              rows={6}
              value={embedSnippet}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 p-3 font-mono outline-none focus:border-cyan-glow select-all"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500">MANDATORY BACKLINK EMBEDDED</span>
              <button
                onClick={handleCopyEmbedCode}
                className="py-2 px-4 border border-[#5322ff] bg-[#5322ff] text-white font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 hover:bg-[#5322ff]/80"
              >
                {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Code className="h-4 w-4" />}
                <span>{isCopied ? t('csv_copied') : t('csv_copy_snippet')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
