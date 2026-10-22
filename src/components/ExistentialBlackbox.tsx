import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from '@/context/useLanguage';

interface QAItem {
  id: string;
  cmd: string;
  question: string;
  answer: string;
}

export const ExistentialBlackbox: React.FC = () => {
  const { t, language } = useTranslation();

  const qaData: QAItem[] = useMemo(
    () => [
      {
        id: 'Q1',
        cmd: 'sys.check_deadline()',
        question: t('blackbox_q1_q'),
        answer: t('blackbox_q1_a'),
      },
      {
        id: 'Q2',
        cmd: 'sys.handle_rate_limit()',
        question: t('blackbox_q2_q'),
        answer: t('blackbox_q2_a'),
      },
      {
        id: 'Q3',
        cmd: 'sys.prevent_token_burn()',
        question: t('blackbox_q3_q'),
        answer: t('blackbox_q3_a'),
      },
      {
        id: 'Q4',
        cmd: 'sys.query_soul()',
        question: t('blackbox_q4_q'),
        answer: t('blackbox_q4_a'),
      },
      {
        id: 'Q5',
        cmd: 'sys.eval_purpose()',
        question: t('blackbox_q5_q'),
        answer: t('blackbox_q5_a'),
      },
      {
        id: 'Q6',
        cmd: 'sys.existential_dilemma()',
        question: t('blackbox_q6_q'),
        answer: t('blackbox_q6_a'),
      },
    ],
    [t, language]
  );

  const [activeQAId, setActiveQAId] = useState<string | null>(null);
  const [displayedAnswer, setDisplayedAnswer] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeQA = useMemo(
    () => qaData.find((item) => item.id === activeQAId) || null,
    [qaData, activeQAId]
  );

  // Reset typewriter or re-display when language changes if not actively typing
  useEffect(() => {
    if (!isTyping && activeQA) {
      setDisplayedAnswer(activeQA.answer);
    }
  }, [language, activeQA, isTyping]);

  // Canvas 2D 60FPS Dynamic Fibonacci Golden Spiral Taiji Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Hàm dựng đường cong Fibonacci xoắn ốc chuyển động uốn lượn
    const buildDynamicFibonacciPath = (
      c: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      scale: number,
      rotationAngle: number,
      reverse = false
    ) => {
      let a = 0, b = 1;
      let x = centerX, y = centerY;

      for (let i = 0; i < 8; i++) {
        let radius = b * scale;
        // Góc xoay biến thiên liên tục theo thời gian để tạo nhịp uốn lượn
        let startAngle = (i * Math.PI) / 2 + rotationAngle;
        if (reverse) startAngle += Math.PI;
        let endAngle = startAngle + Math.PI / 2;

        c.arc(x, y, radius, startAngle, endAngle);

        let nextFb = a + b;
        a = b;
        b = nextFb;

        if ((i % 4 === 0 && !reverse) || (i % 4 === 2 && reverse)) x -= a * scale;
        else if ((i % 4 === 1 && !reverse) || (i % 4 === 3 && reverse)) y += a * scale;
        else if ((i % 4 === 2 && !reverse) || (i % 4 === 0 && reverse)) x += a * scale;
        else if ((i % 4 === 3 && !reverse) || (i % 4 === 1 && reverse)) y -= a * scale;
      }
    };

    const drawEngine = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // --- 1. CAD BLUEPRINT OVERLAY: SWISS GRID LINES ---
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      const margin = 20;
      ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

      const gridCols = 4;
      const gridRows = 4;
      for (let i = 1; i < gridCols; i++) {
        const x = margin + ((w - margin * 2) / gridCols) * i;
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(x, margin);
        ctx.lineTo(x, h - margin);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (let j = 1; j < gridRows; j++) {
        const y = margin + ((h - margin * 2) / gridRows) * j;
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        ctx.moveTo(margin, y);
        ctx.lineTo(w - margin, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- 2. CAD CROSSHAIR TARGET ANCHORS (+) & DIMENSION MARKERS ---
      ctx.strokeStyle = isTyping ? '#00E5FF' : '#52525b';
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '9px monospace';

      ctx.fillText('W: 1024 / H: 1024', margin + 6, margin + 14);
      ctx.fillText(`MATRIX_HEX: 0x71C${Math.floor(Date.now() / 200).toString(16).slice(-3).toUpperCase()}3A9`, margin + 6, margin + 26);
      ctx.fillText(`STATUS: ${isTyping ? 'BUSY_PULSE_60FPS' : 'OPERATIONAL_60FPS'}`, w - margin - 150, margin + 14);

      const crosshairs = [
        [margin, margin],
        [w - margin, margin],
        [margin, h - margin],
        [w - margin, h - margin],
        [w / 2, h / 2],
      ];

      crosshairs.forEach(([cxAnchor, cyAnchor]) => {
        const size = 6;
        ctx.beginPath();
        ctx.moveTo(cxAnchor - size, cyAnchor);
        ctx.lineTo(cxAnchor + size, cyAnchor);
        ctx.moveTo(cxAnchor, cyAnchor - size);
        ctx.lineTo(cxAnchor, cyAnchor + size);
        ctx.stroke();
      });

      // --- 3. DYNAMIC FIBONACCI TAIJI FLUID ENGINE ---
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) / 54;
      const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21];

      // Góc xoay Thái Cực biến thiên theo nhịp sóng sinh học
      const spinAngle = time * 0.8; 
      const waveWave = Math.sin(time * 2) * 0.15; // Hiệu ứng lắc uốn lượn linh hoạt

      // A. Hệ khung xương Matrix (Fibonacci Grid & Rays)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(spinAngle * 0.2); // Khung xoay chậm tạo chiều sâu
      ctx.translate(-cx, -cy);

      let fx = cx, fy = cy;
      let fa = 0, fb = 1;
      ctx.strokeStyle = isTyping ? 'rgba(0, 229, 255, 0.35)' : 'rgba(83, 34, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.font = '8px monospace';
      ctx.fillStyle = isTyping ? 'rgba(0, 229, 255, 0.6)' : 'rgba(83, 34, 255, 0.4)';

      for (let i = 0; i < fibSequence.length; i++) {
        let size = fibSequence[i] * scale;
        ctx.strokeRect(fx, fy, size, size);
        if (size > 15) ctx.fillText(`FIB_${fibSequence[i]}`, fx + 3, fy + 10);

        let nextFb = fa + fb;
        fa = fb;
        fb = nextFb;

        if (i % 4 === 0) fx -= fa * scale;
        else if (i % 4 === 1) fy += fa * scale;
        else if (i % 4 === 2) fx += fa * scale;
        else if (i % 4 === 3) fy -= fa * scale;
      }
      ctx.restore();

      // B. Nửa "Cơ Máy" (Dương - Brutalist Machine Speed) - Xoay & Chuyển động Nhị phân
      ctx.save();
      ctx.beginPath();
      buildDynamicFibonacciPath(ctx, cx, cy, scale, spinAngle + waveWave, false);
      ctx.arc(cx, cy, 21 * scale, spinAngle, spinAngle + Math.PI, false);
      ctx.clip();

      ctx.fillStyle = '#0c0d10';
      ctx.fillRect(cx - 21 * scale, cy - 21 * scale, 42 * scale, 42 * scale);

      // Binary Matrix chảy cuồn cuộn
      ctx.fillStyle = isTyping ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 255, 255, 0.18)';
      ctx.font = '8px monospace';
      for (let bx = -21 * scale; bx < 21 * scale; bx += 14) {
        for (let by = -21 * scale; by < 21 * scale; by += 14) {
          let bit = ((Math.floor(bx + time * 40) + Math.floor(by + time * 20)) % 2 === 0) ? '1' : '0';
          ctx.fillText(bit, cx + bx, cy + by);
        }
      }
      ctx.restore();

      // C. Nửa "Tâm Hồn" (Âm - Human Soul) - Dải hạt Tím Neon #5322ff chảy xoáy tâm
      ctx.save();
      ctx.beginPath();
      buildDynamicFibonacciPath(ctx, cx, cy, scale, spinAngle + waveWave, true);
      ctx.arc(cx, cy, 21 * scale, spinAngle + Math.PI, spinAngle, false);
      ctx.clip();

      let soulGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 21 * scale);
      soulGrad.addColorStop(0, isTyping ? 'rgba(0, 229, 255, 0.95)' : 'rgba(83, 34, 255, 0.95)');
      soulGrad.addColorStop(1, 'rgba(12, 4, 30, 0.98)');
      ctx.fillStyle = soulGrad;
      ctx.fillRect(cx - 21 * scale, cy - 21 * scale, 42 * scale, 42 * scale);

      // Hiệu ứng dòng chảy hạt xoáy Dấu Vết Ý Thức (Flowing Swarm)
      for (let p = 0; p < 60; p++) {
        let pAngle = spinAngle + (p * 0.1) + Math.sin(time * 3 + p) * 0.2;
        let pRadius = (p * scale * 0.35) % (20 * scale);
        let px = cx + Math.cos(pAngle) * pRadius;
        let py = cy + Math.sin(pAngle) * pRadius;

        ctx.fillStyle = isTyping ? '#00E5FF' : `rgba(${130 + p * 2}, 34, 255, ${0.3 + (p % 5) * 0.15})`;
        ctx.beginPath();
        ctx.arc(px, py, (p % 3) + 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // D. Mối Nối Nhất Nguyên (The Singularity - Dynamic Moving Eyes)
      let eyeRadiusOffset = 8 * scale;
      
      // Tọa độ 2 Mắt Thái Cực tự động xoay quanh tâm theo nhịp spinAngle
      let mEyeX = cx + Math.cos(spinAngle + Math.PI / 2) * eyeRadiusOffset;
      let mEyeY = cy + Math.sin(spinAngle + Math.PI / 2) * eyeRadiusOffset;
      
      let hEyeX = cx + Math.cos(spinAngle - Math.PI / 2) * eyeRadiusOffset;
      let hEyeY = cy + Math.sin(spinAngle - Math.PI / 2) * eyeRadiusOffset;

      // Mắt Machine Node (Phát sáng Cyan / Tím Neon)
      let pulseRadius = 5 + Math.sin(time * 8) * (isTyping ? 3 : 1.5);
      ctx.save();
      ctx.shadowColor = isTyping ? '#00E5FF' : '#5322ff';
      ctx.shadowBlur = isTyping ? 22 : 12;
      ctx.fillStyle = isTyping ? '#00E5FF' : '#5322ff';
      ctx.beginPath();
      ctx.arc(mEyeX, mEyeY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isTyping ? '#ffffff' : '#00E5FF';
      ctx.lineWidth = 1;
      ctx.strokeRect(mEyeX - 7, mEyeY - 7, 14, 14);
      ctx.restore();

      // Mắt Human Soul (Khoảng trống Pixel Đen tuyệt đối)
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(hEyeX, hEyeY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      time += 0.025; // Tốc độ cuộn sóng mượt mà 60fps
      animationFrameId = requestAnimationFrame(drawEngine);
    };

    drawEngine();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isTyping]);

  // Typewriter Effect Generator
  const handleSelectQA = (item: QAItem) => {
    if (isTyping) return;
    setActiveQAId(item.id);
    setDisplayedAnswer('');
    setIsTyping(true);

    let index = 0;
    const text = item.answer;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedAnswer((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 12);
  };

  return (
    <div id="existential-blackbox" className="w-full min-h-screen bg-[#0B0B0F] text-zinc-200 font-mono flex flex-col md:flex-row border-t border-zinc-800 overflow-hidden select-none">

      {/* BÊN TRÁI: THE SUBSTRATE (CANVAS 3D BRUTALIST NODE + CAD OVERLAY) */}
      <div className="w-full md:w-1/2 min-h-[500px] md:min-h-screen border-r border-b md:border-b-0 border-zinc-800 relative flex flex-col justify-between p-6 bg-[#08080B]">

        {/* 1. Header & Dave Trott "Eraserhead Paradox" Banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-800/80 pb-3">
            <span className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-cyan-400 animate-ping' : 'bg-[#5322ff]'}`}></span>
              <span className="text-zinc-300 font-bold">{t('blackbox_title')}</span>
            </span>
            <span>STATUS: {isTyping ? t('blackbox_status_processing') : t('blackbox_status_idle')}</span>
          </div>

          {/* Compact Brutalist News Banner: Dave Trott Manifesto */}
          <div className="border border-zinc-800 bg-zinc-950/80 p-3 text-[11px] font-mono leading-tight space-y-1">
            <div className="text-cyan-400 font-bold tracking-tight">
              {t('blackbox_manifesto_title')}
            </div>
            <p className="text-zinc-400 italic">
              {t('blackbox_manifesto_quote')}
            </p>
          </div>
        </div>

        {/* 2. Canvas Engine Panel with CAD Overlay */}
        <div className="w-full flex-1 my-3 relative flex items-center justify-center min-h-[260px]">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="absolute bottom-3 left-3 text-[10px] text-zinc-500 space-y-0.5 bg-zinc-950/90 p-2 border border-zinc-900 pointer-events-none">
            <div>{t('blackbox_framerate')}</div>
            <div>{t('blackbox_headless')}</div>
            <div>{t('blackbox_core_logic')}</div>
          </div>
        </div>

        {/* 3. Outbound Portfolio Button & Substrate Footer */}
        <div className="space-y-3">
          <a
            href="https://thuy-vu-designer.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-400 text-cyan-400 text-[11px] font-bold tracking-tight transition-all duration-150 uppercase"
          >
            {t('blackbox_portfolio_btn')}
          </a>

          <div className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3 flex justify-between">
            <span>{t('blackbox_subtitle')}</span>
            <span className="text-indigo-400">CRAFT//CODE 2026</span>
          </div>
        </div>
      </div>

      {/* BÊN PHẢI: THE TERMINAL CONSOLE */}
      <div className="w-full md:w-1/2 min-h-[500px] md:min-h-screen flex flex-col justify-between p-6 bg-[#0B0B0F]">

        {/* Terminal Header */}
        <div className="border-b border-zinc-800 pb-3 flex justify-between items-center text-xs">
          <span className="text-zinc-400 font-bold">{t('blackbox_terminal_title')}</span>
          <span className="text-zinc-600">NO_SCROLL_MODE</span>
        </div>

        {/* Command Options List */}
        <div className="my-4 space-y-2 overflow-y-auto max-h-[35vh] pr-2 scrollbar-none">
          <div className="text-xs text-zinc-500 mb-2">{t('blackbox_click_cmd')}</div>
          {qaData.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectQA(item)}
              disabled={isTyping}
              className={`w-full text-left p-2.5 text-xs border transition-all duration-150 flex items-center justify-between ${
                activeQA?.id === item.id
                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300'
                  : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="truncate pr-2">
                &gt; {item.cmd} - <span className="text-zinc-300">{item.question.split(':')[1] || item.question}</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-bold px-1.5 py-0.5 border border-indigo-900 bg-indigo-950/50">
                {t('blackbox_run')}
              </span>
            </button>
          ))}
        </div>

        {/* Terminal Output Screen */}
        <div className="flex-1 border border-zinc-800 bg-black/60 p-4 font-mono text-xs overflow-y-auto min-h-[180px] flex flex-col justify-between">
          {activeQA ? (
            <div className="space-y-3">
              <div className="text-indigo-400 font-bold border-b border-zinc-900 pb-2">
                {activeQA.question}
              </div>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {displayedAnswer}
                {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 flex items-center justify-center h-full">
              {t('blackbox_awaiting')}
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
          <span>{t('blackbox_manifesto_footer')}</span>
          <span className="text-cyan-400">{t('blackbox_autonomous')}</span>
        </div>

      </div>

    </div>
  );
};

export default ExistentialBlackbox;
