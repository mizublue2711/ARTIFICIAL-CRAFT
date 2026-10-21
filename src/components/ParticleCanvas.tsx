import { useEffect, useRef } from 'react';

export default function ParticleCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let raf = 0;
    let running = true;
    const CYAN = '#00E5FF';
    const PURPLE = '#5322ff';
    const SPACING = 50;

    type Pt = { x: number; y: number; ox: number; oy: number; ph: number };
    type Conn = { a: number; b: number };
    type Pulse = { ci: number; prog: number; speed: number; color: string };

    let pts: Pt[] = [];
    let conns: Conn[] = [];
    let pulses: Pulse[] = [];
    let w = 0,
      h = 0,
      dpr = 1;

    function build() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pts = [];
      conns = [];
      const cols = Math.ceil(w / SPACING) + 2;
      const rows = Math.ceil(h / SPACING) + 2;

      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const jx = (Math.random() - 0.5) * 14;
          const jy = (Math.random() - 0.5) * 14;
          pts.push({
            x: col * SPACING + jx,
            y: r * SPACING + jy,
            ox: col * SPACING + jx,
            oy: r * SPACING + jy,
            ph: Math.random() * Math.PI * 2,
          });
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const idx = r * cols + col;
          if (col < cols - 1) conns.push({ a: idx, b: idx + 1 });
          if (r < rows - 1) conns.push({ a: idx, b: idx + cols });
        }
      }

      pulses = [];
      const pulseCount = Math.min(16, Math.floor(conns.length / 25));
      for (let i = 0; i < pulseCount; i++) {
        pulses.push({
          ci: Math.floor(Math.random() * conns.length),
          prog: Math.random(),
          speed: 0.003 + Math.random() * 0.005,
          color: Math.random() > 0.5 ? CYAN : PURPLE,
        });
      }
    }

    let t = 0;
    function frame() {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x = p.ox + Math.sin(t + p.ph) * 3;
        p.y = p.oy + Math.cos(t * 0.7 + p.ph) * 3;
      }

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(63,63,70,0.15)';
      ctx.beginPath();
      for (const conn of conns) {
        if (pts[conn.a] && pts[conn.b]) {
          ctx.moveTo(pts[conn.a].x, pts[conn.a].y);
          ctx.lineTo(pts[conn.b].x, pts[conn.b].y);
        }
      }
      ctx.stroke();

      ctx.fillStyle = 'rgba(82,82,91,0.3)';
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const pu of pulses) {
        pu.prog += pu.speed;
        if (pu.prog >= 1) {
          pu.prog = 0;
          pu.ci = Math.floor(Math.random() * conns.length);
          pu.color = Math.random() > 0.5 ? CYAN : PURPLE;
        }
        const conn = conns[pu.ci];
        if (conn && pts[conn.a] && pts[conn.b]) {
          const a = pts[conn.a],
            b = pts[conn.b];
          const px = a.x + (b.x - a.x) * pu.prog;
          const py = a.y + (b.y - a.y) * pu.prog;

          ctx.globalAlpha = 0.12;
          ctx.fillStyle = pu.color;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    build();
    frame();

    const onResize = () => build();
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
