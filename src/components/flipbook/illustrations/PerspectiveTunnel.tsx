import React, { useEffect, useRef, useState } from 'react';

interface IllustrationProps {
  seed?: string;
  className?: string;
}

export const PerspectiveTunnel: React.FC<IllustrationProps> = ({ seed = 'tunnel_01', className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [laserScan, setLaserScan] = useState(0);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    // Generate deterministic particles
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }).map((_, i) => ({
      angle: (i / particleCount) * Math.PI * 2 + (i % 3) * 0.2,
      speed: 0.8 + (i % 5) * 0.4,
      z: (i / particleCount) * 1000,
      size: 1 + (i % 3),
      color: i % 2 === 0 ? '#00E5FF' : '#5322FF'
    }));

    const render = () => {
      time += 0.02;
      setLaserScan(Math.sin(time * 1.5) * 60 + 80);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, width, height);

      // 1px Swiss CAD Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 20;
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

      // Draw 3D Hexagonal tunnel rings with Z-depth motion
      const rings = 7;
      const focalLength = 260;

      for (let r = 0; r < rings; r++) {
        // Continuous loop moving forward along Z-axis
        const ringZ = ((r * 120 - (time * 120) % 120) + 720) % 720 + 40;
        const scale = focalLength / ringZ;
        const hexRadius = 140 * scale;
        const ringAlpha = Math.min(1, Math.max(0.08, (720 - ringZ) / 720));

        ctx.strokeStyle = r % 2 === 0 ? `rgba(0, 229, 255, ${ringAlpha})` : `rgba(83, 34, 255, ${ringAlpha})`;
        ctx.lineWidth = r === 0 ? 1.5 : 1;

        ctx.beginPath();
        for (let side = 0; side < 6; side++) {
          const rotOffset = (time * 0.1) * (1 - ringZ / 800);
          const angle = (side / 6) * Math.PI * 2 + rotOffset;
          const hx = cx + Math.cos(angle) * hexRadius;
          const hy = cy + Math.sin(angle) * hexRadius * 0.85; // slightly isometric perspective
          if (side === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();

        // Hex corner depth connectors
        if (r < rings - 1) {
          const nextZ = ringZ + 120;
          const nextScale = focalLength / nextZ;
          const nextRadius = 140 * nextScale;
          for (let side = 0; side < 6; side++) {
            const rotOffset1 = (time * 0.1) * (1 - ringZ / 800);
            const rotOffset2 = (time * 0.1) * (1 - nextZ / 800);
            const a1 = (side / 6) * Math.PI * 2 + rotOffset1;
            const a2 = (side / 6) * Math.PI * 2 + rotOffset2;
            const x1 = cx + Math.cos(a1) * hexRadius;
            const y1 = cy + Math.sin(a1) * hexRadius * 0.85;
            const x2 = cx + Math.cos(a2) * nextRadius;
            const y2 = cy + Math.sin(a2) * nextRadius * 0.85;

            ctx.strokeStyle = `rgba(0, 229, 255, ${ringAlpha * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Radial particle dispersion along Z-axis
      particles.forEach((p) => {
        p.z -= p.speed * 4;
        if (p.z <= 10) {
          p.z = 1000;
        }

        const pScale = focalLength / p.z;
        const dist = 180 * pScale;
        const px = cx + Math.cos(p.angle) * dist;
        const py = cy + Math.sin(p.angle) * dist * 0.85;
        const pAlpha = Math.min(1, Math.max(0.1, (1000 - p.z) / 1000));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.8, p.size * pScale * 1.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Central core portal
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 35);
      grad.addColorStop(0, 'rgba(0, 229, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(83, 34, 255, 0.4)');
      grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.fill();

      // #00E5FF Cyan laser scan line
      const scanY = (Math.sin(time * 2) * 0.45 + 0.5) * height;
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(10, scanY);
      ctx.lineTo(width - 10, scanY);
      ctx.stroke();

      // Laser scan glow
      const laserGrad = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
      laserGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      laserGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.3)');
      laserGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = laserGrad;
      ctx.fillRect(10, scanY - 8, width - 20, 16);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [seed]);

  return (
    <div
      className={`w-full h-full min-h-[220px] bg-[#09090B] border border-zinc-800 p-4 font-mono relative overflow-hidden flex flex-col justify-between select-none ${className}`}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 z-10 text-[10px] text-zinc-400 tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00E5FF] animate-pulse rounded-none" />
          <span className="text-[#00E5FF] font-bold">PERSPECTIVE_TUNNEL // 3D_HEX_DISPERSION</span>
        </div>
        <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[#00E5FF] font-bold">
          Z-AXIS_ACTIVE
        </span>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="flex-1 my-2 relative z-10 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          className="w-full h-auto max-h-[160px] block rounded-sm border border-zinc-900/60"
        />

        {/* Telemetry Reticle Corner Crosshairs */}
        <div className="absolute top-2 left-2 text-[8px] text-[#00E5FF]/60 pointer-events-none">
          + CAD.XYZ [0, 0, {laserScan.toFixed(0)}]
        </div>
        <div className="absolute top-2 right-2 text-[8px] text-zinc-500 pointer-events-none">
          FOVS: 84° // 60FPS
        </div>
        <div className="absolute bottom-2 left-2 text-[8px] text-[#5322FF] pointer-events-none">
          LASER_SCAN_HZ: 2.4
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] text-zinc-500 pointer-events-none">
          DEPTH_Z: 720mm
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 z-10 text-[9px] text-zinc-500">
        <span className="tracking-tight">DISPERSION: RADIAL_PARTICLE // COLOR: #00E5FF + #5322FF</span>
        <span>SWISS_ENGINE_v4.2</span>
      </div>
    </div>
  );
};
