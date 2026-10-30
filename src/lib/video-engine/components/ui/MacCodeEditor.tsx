import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MacCodeEditorProps {
  codeSnippet?: string;
  primaryColor?: string;
  accentCyan?: string;
  scale?: number;
  submeshDispersion?: number;
}

export const MacCodeEditor: React.FC<MacCodeEditorProps> = ({
  codeSnippet = "import { AbsoluteFill } from 'remotion';\nexport const LogarithmicShell = () => {\n  return (\n    <AbsoluteFill style={{ backgroundColor: '#050505' }}>\n      <SwissGridBackground />\n      <LogarithmicSpiral3D scale={1.618} />\n    </AbsoluteFill>\n  );\n};",
  primaryColor = '#5322ff',
  accentCyan = '#00E5FF',
  scale = 1.0,
  submeshDispersion = 0,
}) => {
  const frame = useCurrentFrame();

  const lines = codeSnippet.split('\n');
  const totalChars = codeSnippet.length;
  const revealedChars = Math.min(totalChars, Math.floor(frame * 2.5));

  const tiltX = Math.sin(frame * 0.02) * 8 + 10;
  const tiltY = Math.cos(frame * 0.025) * 10;

  return (
    <div
      style={{
        perspective: '1200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '800px',
          backgroundColor: '#0A0A10',
          border: `2px solid ${primaryColor}`,
          boxShadow: `0 0 30px ${primaryColor}55, inset 0 0 15px rgba(0,0,0,0.8)`,
          borderRadius: '0px',
          overflow: 'hidden',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${submeshDispersion * 400}px)`,
          opacity: 1 - submeshDispersion * 0.8,
        }}
      >
        {/* macOS Top Bar */}
        <div
          style={{
            height: '38px',
            backgroundColor: '#12121A',
            borderBottom: `1px solid ${primaryColor}66`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            justifyContent: 'space-between',
          }}
        >
          {/* Traffic light buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
          </div>

          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: accentCyan,
              letterSpacing: '1px',
            }}
          >
            LogarithmicShell.tsx
          </div>

          <div
            style={{
              fontSize: '10px',
              color: '#666666',
            }}
          >
            UTF-8
          </div>
        </div>

        {/* Code Content Window */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#E2E8F0',
            minHeight: '260px',
          }}
        >
          {/* Line Numbers */}
          <div
            style={{
              paddingRight: '20px',
              borderRight: `1px solid ${primaryColor}40`,
              color: '#4A5568',
              userSelect: 'none',
              textAlign: 'right',
            }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text */}
          <div style={{ paddingLeft: '20px', whiteSpace: 'pre', overflowX: 'hidden' }}>
            {lines.map((line, lineIdx) => {
              // Basic syntax highlight coloring
              const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              const escaped = escapeHtml(line);

              const styledLine = escaped
                .replace(/(&#39;[^&#39;]*&#39;|'[^']*'|"[^"]*")/g, `<span style="color:#34D399">$1</span>`)
                .replace(/\b(import|export|const|from|return)\b/g, `<span style="color:#C084FC;font-weight:bold">$1</span>`)
                .replace(/\b(AbsoluteFill|SwissGridBackground|LogarithmicSpiral3D|LogarithmicShell)\b/g, `<span style="color:${accentCyan};font-weight:bold">$1</span>`);

              return (
                <div
                  key={lineIdx}
                  dangerouslySetInnerHTML={{ __html: styledLine }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
