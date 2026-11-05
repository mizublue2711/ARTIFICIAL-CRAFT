import React, { useEffect, useRef } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const FluidNoiseField: React.FC<IllustrationProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    // Pseudo Perlin / Simplex approximation using multi-frequency harmonic octaves
    const noise2D = (x: number, y: number, t: number): number => {
      const n1 = Math.sin(x * 0.04 + t * 0.8) * Math.cos(y * 0.05 + t * 0.6);
      const n2 = Math.sin((x + y) * 0.03 - t * 0.5) * 0.5;
      const n3 = Math.cos(Math.hypot(x - 250, y - 80) * 0.05 - t) * 0.3;
      return n1 + n2 + n3;
    };

    const render = () => {
      time += 0.025;
      const width = canvas.width;
      const height = canvas.height;

      // Obsidian background #09090B
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, width, height);

      // 1px Swiss CAD Grid with Crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // CAD Crosshair ticks
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.lineWidth = 1;
      for (let x = 50; x < width; x += 100) {
        for (let y = 30; y < height; y += 50) {
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }

      // Dynamic Perlin Fluid Noise Wave Mesh Rows
      const cols = 28;
      const rows = 12;
      const dx = width / (cols - 1);
      const dy = height / (rows - 1);

      // Render isometric pseudo-3D wave surface grid lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        let prevPx = 0;
        let prevPy = 0;

        for (let c = 0; c < cols; c++) {
          const bx = c * dx;
          const by = r * dy;
          const elev = noise2D(bx, by, time) * 24; // Elevation displacement

          // PBR-style lighting highlight based on elevation gradient
          const px = bx;
          const py = by + elev;

          if (c === 0) {
            ctx.moveTo(px, py);
          } else {
            // Cubic smoothing
            const mx = (prevPx + px) / 2;
            const my = (prevPy + py) / 2;
            ctx.quadraticCurveTo(prevPx, prevPy, mx, my);
          }
          prevPx = px;
          prevPy = py;
        }

        // PBR Lighting Gradient based on row depth
        const depthRatio = r / (rows - 1);
        const alpha = 0.25 + depthRatio * 0.65;
        const isHighlight = r % 3 === 0;

        if (isHighlight) {
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 1.3;
        } else {
          ctx.strokeStyle = `rgba(83, 34, 255, ${alpha * 0.8})`;
          ctx.lineWidth = 0.9;
        }
        ctx.stroke();
      }

      // Render vertical flow strands for 3D topological mesh
      for (let c = 0; c < cols; c += 2) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const bx = c * dx;
          const by = r * dy;
          const elev = noise2D(bx, by, time) * 24;
          const px = bx;
          const py = by + elev;

          if (r === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // PBR Specular point light reflections
      const lightX = width / 2 + Math.sin(time * 0.8) * 140;
      const lightY = height / 2 + Math.cos(time * 0.6) * 40;

      const pbrGlow = ctx.createRadialGradient(lightX, lightY, 2, lightX, lightY, 80);
      pbrGlow.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
      pbrGlow.addColorStop(0.5, 'rgba(83, 34, 255, 0.15)');
      pbrGlow.addColorStop(1, 'rgba(9, 9, 11, 0)');

      ctx.fillStyle = pbrGlow;
      ctx.beginPath();
      ctx.arc(lightX, lightY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Specular core dot
      ctx.fillStyle = '#00E5FF';
      ctx.beginPath();
      ctx.arc(lightX, lightY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className={`w-full h-full min-h-[220px] bg-[#09090B] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between select-none ${className}`}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00E5FF] rounded-none animate-pulse" />
          <span className="text-[#00E5FF] font-bold">FLUID_NOISE_FIELD // PERLIN_PBR_MESH</span>
        </div>
        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[#00E5FF] font-bold text-[9px]">
          PBR_SPECULAR_ACTIVE
        </span>
      </div>

      {/* 3D Wave Mesh Canvas */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          className="w-full h-auto max-h-[160px] block rounded-sm border border-zinc-900/60"
        />

        {/* CAD Telemetry HUD */}
        <div className="absolute top-2 left-2 text-[8px] text-[#00E5FF]/70 pointer-events-none">
          TOPOLOGY: 28x12 HARMONIC_WAVE
        </div>
        <div className="absolute top-2 right-2 text-[8px] text-zinc-500 pointer-events-none">
          OCTAVES: 3 // DAMPING: 0.82
        </div>
        <div className="absolute bottom-2 left-2 text-[8px] text-[#5322FF] pointer-events-none">
          PBR_IRRADIANCE: 1.4W/m²
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] text-emerald-400 pointer-events-none">
          MESH_FPS: 60.0
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span>SWISS_CAD_GRID: 25px // LIGHTING: PHONG/PBR HYBRID</span>
        <span>NOISE_DISPLACEMENT_v2.6</span>
      </div>
    </div>
  );
};
