import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from '@/context/useLanguage';
import ThreeHookCanvas from './ThreeHookCanvas';

interface QAItem {
  id: string;
  cmd: string;
  question: string;
  answer: string;
}

export default function ExistentialBlackbox() {
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

  useEffect(() => {
    if (!isTyping && activeQA) {
      setDisplayedAnswer(activeQA.answer);
    }
  }, [language, activeQA, isTyping]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 400;
      canvas.height = canvas.parentElement.clientHeight || 400;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawEngine = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

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

      ctx.strokeStyle = isTyping ? '#00E5FF' : '#52525b';
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '9px monospace';

      ctx.fillText('W: 1024 / H: 1024', margin + 6, margin + 14);
      ctx.fillText(
        `MATRIX_HEX: 0x71C${Math.floor(Date.now() / 200).toString(16).slice(-3).toUpperCase()}3A9`,
        margin + 6,
        margin + 26
      );
      ctx.fillText(
        `STATUS: ${isTyping ? 'BUSY_PULSE_60FPS' : 'OPERATIONAL_60FPS'}`,
        w - margin - 150,
        margin + 14
      );

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

      animationFrameId = requestAnimationFrame(drawEngine);
    };

    drawEngine();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isTyping]);

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
        index += 1;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 12);
  };

  return (
    <div
      id="existential-blackbox"
      className="w-full min-h-screen bg-[#0B0B0F] text-zinc-200 font-mono flex flex-col md:flex-row border-t border-zinc-800 overflow-hidden select-none"
    >
      <div className="w-full md:w-1/2 min-h-[500px] md:min-h-screen border-r border-b md:border-b-0 border-zinc-800 relative flex flex-col justify-between p-6 bg-[#08080B]">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-800/80 pb-3">
            <span className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isTyping ? 'bg-cyan-400 animate-ping' : 'bg-[#5322ff]'
                }`}
              ></span>
              <span className="text-zinc-300 font-bold">{t('blackbox_title')}</span>
            </span>
            <span>
              STATUS: {isTyping ? t('blackbox_status_processing') : t('blackbox_status_idle')}
            </span>
          </div>

          <div className="border border-zinc-800 bg-zinc-950/80 p-3 text-[11px] font-mono leading-tight space-y-1">
            <div className="text-cyan-400 font-bold tracking-tight">
              {t('blackbox_manifesto_title')}
            </div>
            <p className="text-zinc-400 italic">{t('blackbox_manifesto_quote')}</p>
          </div>
        </div>

        <div className="w-full flex-1 my-3 relative flex items-center justify-center min-h-[300px] md:min-h-[380px] overflow-hidden">
          <ThreeHookCanvas className="w-full h-full" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute bottom-3 left-3 text-[10px] text-zinc-500 space-y-0.5 bg-zinc-950/90 p-2 border border-zinc-900 pointer-events-none">
            <div>{t('blackbox_framerate')}</div>
            <div>{t('blackbox_headless')}</div>
            <div>{t('blackbox_core_logic')}</div>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="https://thuy-vu-designer.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-400 text-cyan-400 text-[11px] font-bold tracking-tight transition-all"
          >
            {t('blackbox_portfolio_btn')}
          </a>

          <div className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3 flex justify-between">
            <span>{t('blackbox_subtitle')}</span>
            <span className="text-indigo-400">CRAFT//CODE 2026</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 min-h-[500px] md:min-h-screen flex flex-col justify-between p-6 bg-[#0B0B0F]">
        <div className="border-b border-zinc-800 pb-3 flex justify-between items-center text-xs">
          <span className="text-zinc-400 font-bold">{t('blackbox_terminal_title')}</span>
          <span className="text-zinc-600">NO_SCROLL_MODE</span>
        </div>

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
                &gt; {item.cmd} -{' '}
                <span className="text-zinc-300">
                  {item.question.split(':')[1] || item.question}
                </span>
              </span>
              <span className="text-[10px] text-indigo-400 font-bold px-1.5 py-0.5 border border-indigo-900 bg-indigo-950/50">
                {t('blackbox_run')}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 border border-zinc-800 bg-black/60 p-4 font-mono text-xs overflow-y-auto min-h-[180px] flex flex-col justify-between">
          {activeQA ? (
            <div className="space-y-3">
              <div className="text-indigo-400 font-bold border-b border-zinc-900 pb-2">
                {activeQA.question}
              </div>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {displayedAnswer}
                {isTyping && (
                  <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                )}
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 flex items-center justify-center h-full">
              {t('blackbox_awaiting')}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
          <span>{t('blackbox_manifesto_footer')}</span>
          <span className="text-cyan-400">{t('blackbox_autonomous')}</span>
        </div>
      </div>
    </div>
  );
}