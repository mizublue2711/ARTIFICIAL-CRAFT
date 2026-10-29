import React from 'react';
import { PageBlock } from '../../../types/flipbook';
import { Network, Image as ImageIcon } from 'lucide-react';

interface DiagramBlockProps {
  block: PageBlock;
}

export const DiagramBlock: React.FC<DiagramBlockProps> = ({ block }) => {
  return (
    <div className="w-full h-full min-h-[500px] bg-[#0B0B0F] border border-zinc-800 p-6 sm:p-10 font-mono text-zinc-100 flex flex-col justify-between">
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>DIAGRAM SPECIFICATION // {block.id}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400">
          RAY.SO DARK FRAME
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col gap-4">
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

        {/* Ray.so Styled Window Frame */}
        <div className="flex-1 border border-zinc-800 bg-[#121218] rounded-none overflow-hidden flex flex-col shadow-2xl my-2">
          {/* Ray.so Window Title Bar */}
          <div className="bg-[#181822] border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="text-[11px] text-zinc-400 font-mono tracking-wider">
              {block.id}.diagram.svg
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 p-6 flex items-center justify-center bg-radial from-zinc-900/40 to-black/90 min-h-[220px]">
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.caption || block.title || 'Architecture Diagram'}
                className="max-h-[300px] w-auto object-contain border border-zinc-800 shadow-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-8 border border-dashed border-zinc-800 text-zinc-500">
                <ImageIcon className="w-10 h-10 text-cyan-400/60" />
                <span className="text-xs uppercase tracking-wider text-zinc-400">
                  [ ARCHITECTURE SCHEMATIC CANVAS ]
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        {block.caption && (
          <div className="text-xs text-zinc-400 border-l-2 border-zinc-700 pl-3 italic font-sans">
            {block.caption}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-3 border-t border-zinc-800/80 flex justify-between text-[11px] text-zinc-500">
        <span>TYPE: SYSTEM_DIAGRAM</span>
        <span>AC-DIAGRAM-ENGINE v1.0</span>
      </div>
    </div>
  );
};
