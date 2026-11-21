import { memo, useRef, useState, useEffect, useMemo, type ElementType } from 'react';
import { motion, useInView } from 'framer-motion';

const ELECTRIC_PURPLE = '#5322ff';
const ELECTRIC_CYAN = '#00E5FF';

export interface NodeDef {
  id: string;
  label: string;
  sub: string;
  icon?: ElementType;
  type: 'dify' | 'n8n';
  x: number;
  y: number;
}

export interface WorkflowSvgCanvasProps {
  renderNodes: NodeDef[];
  renderEdges: [string, string][];
  nodeIndexMap: Record<string, number>;
  activeNodeIdx: number;
  isSimulating: boolean;
  accent: string;
  progress: number;
}

function getNodeDelay(id: string): number {
  if (id === 'webhook') return 0.08;
  if (id === 'brain') return 0.85;
  if (id === 'process') return 1.55;
  return 2.2;
}

function getEdgeDelay(from: string, to: string): number {
  if (from === 'webhook' && to === 'brain') return 0.45;
  if (from === 'brain' && to === 'process') return 1.2;
  return 1.85;
}

const WorkflowSvgCanvas = memo(function WorkflowSvgCanvas({
  renderNodes,
  renderEdges,
  nodeIndexMap,
  activeNodeIdx,
  isSimulating,
  accent,
}: WorkflowSvgCanvasProps) {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const shouldAnimate = isInView || isSimulating;

  useEffect(() => {
    if (isSimulating) {
      setAnimationCompleted(true);
      return;
    }
    if (shouldAnimate && !animationCompleted) {
      const timer = setTimeout(() => {
        setAnimationCompleted(true);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, isSimulating, animationCompleted]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NodeDef>();
    renderNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [renderNodes]);

  return (
    <motion.svg
      ref={containerRef}
      viewBox="0 0 1080 300"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Connector Edges */}
      {renderEdges.map(([from, to]) => {
        const a = nodeMap.get(from);
        const b = nodeMap.get(to);
        if (!a || !b) return null;

        const fromIdx = nodeIndexMap[from] ?? -1;
        const toIdx = nodeIndexMap[to] ?? -1;
        const edgeActive =
          isSimulating && (fromIdx === activeNodeIdx || toIdx === activeNodeIdx);
        const mx = (a.x + b.x) / 2;
        const pathData = `M ${a.x + 64} ${a.y + 28} C ${mx} ${a.y + 28}, ${mx} ${b.y + 28}, ${b.x} ${b.y + 28}`;
        const edgeDelay = getEdgeDelay(from, to);

        return (
          <g key={`${from}-${to}`}>
            {/* Background Track Guide Path */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="rgba(63,63,70,0.6)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isSimulating || animationCompleted
                  ? { pathLength: 1, opacity: 0.6 }
                  : shouldAnimate
                    ? { pathLength: 1, opacity: 0.6 }
                    : { pathLength: 0, opacity: 0 }
              }
              transition={
                isSimulating || animationCompleted
                  ? { duration: 0 }
                  : {
                      pathLength: {
                        duration: 0.4,
                        delay: edgeDelay,
                        ease: 'easeInOut',
                      },
                      opacity: { duration: 0.2, delay: edgeDelay },
                    }
              }
            />

            {/* Foreground Animated / Active Path */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={edgeActive ? ELECTRIC_CYAN : accent}
              strokeWidth={edgeActive ? 2.5 : 1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isSimulating
                  ? { pathLength: 1, opacity: edgeActive ? 1 : 0.7 }
                  : animationCompleted
                    ? { pathLength: 1, opacity: 0.7 }
                    : shouldAnimate
                      ? { pathLength: 1, opacity: 0.8 }
                      : { pathLength: 0, opacity: 0 }
              }
              transition={
                isSimulating
                  ? { duration: 0.1 }
                  : animationCompleted
                    ? { duration: 0 }
                    : {
                        pathLength: {
                          duration: 0.4,
                          delay: edgeDelay,
                          ease: 'easeInOut',
                        },
                        opacity: { duration: 0.2, delay: edgeDelay },
                      }
              }
            />
          </g>
        );
      })}

      {/* Nodes */}
      {renderNodes.map((n, ni) => {
        const isBrain = n.type === 'dify';
        const isActive = isSimulating && ni === activeNodeIdx;
        const nodeDelay = getNodeDelay(n.id);

        return (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <motion.g
              initial={{ opacity: 0, scale: 0.85 }}
              animate={
                isSimulating || animationCompleted
                  ? { opacity: 1, scale: 1 }
                  : shouldAnimate
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.85 }
              }
              transition={
                isSimulating || animationCompleted
                  ? { duration: 0 }
                  : {
                      duration: 0.35,
                      delay: nodeDelay,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
              style={{ transformOrigin: '64px 28px' }}
            >
              {/* Trigger pulse ring for webhook */}
              {n.id === 'webhook' && !isSimulating && !animationCompleted && (
                <motion.rect
                  x="-4"
                  y="-4"
                  width="136"
                  height="64"
                  fill="none"
                  stroke={ELECTRIC_CYAN}
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={
                    shouldAnimate
                      ? { opacity: [0, 0.9, 0], scale: [0.95, 1.08, 1.15] }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.12,
                    ease: 'easeOut',
                  }}
                  style={{ transformOrigin: '64px 28px' }}
                />
              )}

              {/* Brain node arrival pulse */}
              {n.id === 'brain' && !isSimulating && !animationCompleted && (
                <motion.rect
                  x="-4"
                  y="-4"
                  width="136"
                  height="64"
                  fill="none"
                  stroke={accent || ELECTRIC_PURPLE}
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={
                    shouldAnimate
                      ? { opacity: [0, 0.9, 0], scale: [0.95, 1.08, 1.15] }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.85,
                    ease: 'easeOut',
                  }}
                  style={{ transformOrigin: '64px 28px' }}
                />
              )}

              {/* Active Simulation Highlight Rect */}
              {isActive && (
                <rect
                  x="-4"
                  y="-4"
                  width="136"
                  height="64"
                  fill="none"
                  stroke={ELECTRIC_CYAN}
                  strokeWidth="2"
                />
              )}

              {/* Node Card Base */}
              <rect
                width="128"
                height="56"
                fill="#0b0b0f"
                stroke={
                  isActive
                    ? ELECTRIC_CYAN
                    : isBrain
                      ? `${accent}`
                      : 'rgba(63,63,70,0.8)'
                }
                strokeWidth="1"
              />

              {/* Status Circle */}
              <circle
                cx="18"
                cy="28"
                r="4"
                fill={isActive ? ELECTRIC_CYAN : isBrain ? accent : '#71717a'}
              />

              {/* Node Label */}
              <text
                x="34"
                y="25"
                fill="#fafafa"
                fontSize="11"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {n.label}
              </text>

              {/* Node Subtitle */}
              <text
                x="34"
                y="40"
                fill="#71717a"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {n.sub}
              </text>
            </motion.g>
          </g>
        );
      })}
    </motion.svg>
  );
});

export default WorkflowSvgCanvas;
