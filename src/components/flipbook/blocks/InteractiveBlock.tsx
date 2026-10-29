import React from 'react';
import { PageBlock } from '../../../types/flipbook';
import { Terminal, Activity, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface InteractiveBlockProps {
  block: PageBlock;
}

export const InteractiveBlock: React.FC<InteractiveBlockProps> = ({ block }) => {
  const getStatusBadge = () => {
    const status = block.status || 'active';
    switch (status) {
      case 'active':
      case 'success':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-400 uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>STATUS: {status.toUpperCase()}</span>
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-amber-950/60 border border-amber-800 text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>STATUS: WARNING</span>
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-rose-950/60 border border-rose-800 text-rose-400 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            <span>STATUS: ERROR</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>STATUS: {String(status).toUpperCase()}</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] bg-[#0B0B0F] border border-zinc-800 p-6 sm:p-10 font-mono text-zinc-100 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>INTERACTIVE DIAGNOSTICS // {block.id}</span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-5">
        {block.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase border-l-2 border-cyan-400 pl-3">
            {block.title}
          </h2>
        )}

        {block.content && (
          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            {block.content}
          </p>
        )}

        {/* Terminal Log Console */}
        <div className="flex-1 border border-zinc-800 bg-black/90 flex flex-col font-mono text-xs overflow-hidden">
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE_EDGE_LOG_STREAM</span>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-2 text-zinc-300 max-h-[320px]">
            {block.logs && block.logs.length > 0 ? (
              block.logs.map((logLine, idx) => {
                let colorClass = 'text-zinc-300';
                if (logLine.includes('[SUCCESS]')) colorClass = 'text-emerald-400';
                else if (logLine.includes('[INFO]')) colorClass = 'text-cyan-300';
                else if (logLine.includes('[WARN]')) colorClass = 'text-amber-300';
                else if (logLine.includes('[ERROR]')) colorClass = 'text-rose-400';
                else if (logLine.includes('[DEBUG]')) colorClass = 'text-purple-300';

                return (
                  <div key={idx} className={`font-mono text-xs ${colorClass} leading-relaxed`}>
                    {logLine}
                  </div>
                );
              })
            ) : (
              <div className="text-zinc-600 italic">No log entries available.</div>
            )}
            <div className="flex items-center gap-2 text-cyan-400 pt-2 border-t border-zinc-900">
              <span>root@artificial-craft:~$</span>
              <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-3 border-t border-zinc-800/80 flex justify-between text-[11px] text-zinc-500">
        <span>RUNTIME: WEBAUDIO_REACT_VITE</span>
        <span>AC-INTERACTIVE v1.0</span>
      </div>
    </div>
  );
};
