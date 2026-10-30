import React from 'react';
import { Download, FileCode } from 'lucide-react';

export interface ExportArtifactEngineProps {
  seedHash?: string;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  artifactName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  className?: string;
}

/**
 * Utility export engine supporting 2K PNG (2048x2048) and SVG vector downloads.
 * Automatically overlays cryptographic watermark: ARTIFICIAL CRAFT // ARTIFACT_ID: 0x{SEED_HASH}
 */
export const ExportArtifactEngine: React.FC<ExportArtifactEngineProps> = ({
  seedHash = '71C8A93A',
  canvasRef,
  svgRef,
  artifactName = 'artifact',
  primaryColor = '#5322ff',
  secondaryColor = '#00E5FF',
  backgroundColor = '#0B0B0F',
  className = '',
}) => {
  const cleanSeed = seedHash.replace(/^0x/i, '').toUpperCase();
  const watermarkText = `ARTIFICIAL CRAFT // ARTIFACT_ID: 0x${cleanSeed}`;

  // Helper function to draw watermark on 2D canvas context
  const drawWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
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

    // Dark backing box with accent border
    ctx.fillStyle = 'rgba(11, 11, 15, 0.9)';
    ctx.fillRect(width - paddingX - bgWidth, height - paddingY - bgHeight, bgWidth, bgHeight);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width - paddingX - bgWidth, height - paddingY - bgHeight, bgWidth, bgHeight);

    // Glowing cyan watermark text
    ctx.fillStyle = secondaryColor;
    ctx.fillText(watermarkText, width - paddingX - 10, height - paddingY - 5);
    ctx.restore();
  };

  // 2K PNG Export Handler
  const handleExportPNG = () => {
    const size = 2048;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    if (canvasRef?.current) {
      // Draw source canvas content scaled to 2K resolution
      ctx.drawImage(canvasRef.current, 0, 0, size, size);
    } else {
      // Decorative CAD schematic grid fallback
      ctx.strokeStyle = 'rgba(63, 63, 70, 0.4)';
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

      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 400, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Overlay cryptographic watermark
    drawWatermark(ctx, size, size);

    // Download PNG file
    const link = document.createElement('a');
    link.download = `artificial-craft-${artifactName}-0x${cleanSeed}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  // Vector SVG Export Handler
  const handleExportSVG = () => {
    const width = 1200;
    const height = 1200;
    let svgInnerContent = '';

    if (svgRef?.current) {
      svgInnerContent = svgRef.current.innerHTML;
    } else {
      svgInnerContent = `<g id="cad-schematic">
        <rect width="${width}" height="${height}" fill="${backgroundColor}" />
        <circle cx="${width / 2}" cy="${height / 2}" r="300" fill="none" stroke="${secondaryColor}" stroke-width="2" />
        <line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="4 4" />
        <line x1="${width / 2}" y1="0" x2="${width / 2}" y2="${height}" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="4 4" />
      </g>`;
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .watermark-text {
        font-family: "JetBrains Mono", monospace;
        font-size: 16px;
        font-weight: 600;
        fill: ${secondaryColor};
      }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="${backgroundColor}" />
  ${svgInnerContent}
  <!-- Cryptographic Watermark Overlay -->
  <g id="watermark" transform="translate(${width - 40}, ${height - 40})">
    <rect x="-720" y="-30" width="720" height="36" fill="#0B0B0F" fill-opacity="0.9" stroke="${primaryColor}" stroke-width="1.5" />
    <text x="-12" y="-6" text-anchor="end" class="watermark-text">${watermarkText}</text>
  </g>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `artificial-craft-${artifactName}-0x${cleanSeed}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 font-mono text-xs ${className}`}>
      <button
        type="button"
        onClick={handleExportPNG}
        className="flex-1 py-2 px-3 border border-cyan-glow/50 bg-cyan-glow/10 hover:bg-cyan-glow hover:text-black text-cyan-glow font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 shrink-0 group-hover:scale-110 transition-transform" />
        <span>EXPORT 2K PNG</span>
      </button>

      <button
        type="button"
        onClick={handleExportSVG}
        className="flex-1 py-2 px-3 border border-zinc-700 bg-zinc-900 hover:border-[#5322ff] hover:bg-[#5322ff]/20 text-zinc-300 hover:text-white font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <FileCode className="h-3.5 w-3.5 text-[#5322ff] shrink-0 group-hover:scale-110 transition-transform" />
        <span>EXPORT SVG</span>
      </button>
    </div>
  );
};

export default ExportArtifactEngine;
