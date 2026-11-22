import { memo, useRef, useState, useEffect, useMemo, type ElementType } from 'react';
import { motion, useInView } from 'framer-motion';

const ELECTRIC_PURPLE = '#5322ff';
const ELECTRIC_CYAN = '#00E5FF';
const NODE_WIDTH = 192;
const NODE_HEIGHT = 82;

const generateBezierPath = (
  source: { x: number; y: number },
  target: { x: number; y: number },
) => {
  const dx = (target.x - source.x) * 0.5;
  return `M ${source.x} ${source.y} C ${source.x + dx} ${source.y}, ${target.x - dx} ${target.y}, ${target.x} ${target.y}`;
};

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

function getNodeDelay(index: number): number {
  return 0.08 + Math.max(index, 0) * 0.16;
}

function getEdgeDelay(fromIndex: number): number {
  return 0.18 + Math.max(fromIndex, 0) * 0.16;
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
      viewBox="56 44 1120 248"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connector Edges */}
      {renderEdges.map(([from, to]) => {
        const a = nodeMap.get(from);
        const b = nodeMap.get(to);
        if (!a || !b) return null;

        const fromIdx = nodeIndexMap[from] ?? -1;
        const toIdx = nodeIndexMap[to] ?? -1;
        const edgeActive =
          isSimulating && (fromIdx === activeNodeIdx || toIdx === activeNodeIdx);
        const pathString = generateBezierPath(
          { x: a.x + NODE_WIDTH, y: a.y + NODE_HEIGHT / 2 },
          { x: b.x, y: b.y + NODE_HEIGHT / 2 },
        );
        const edgeDelay = getEdgeDelay(fromIdx);

        return (
          <g key={`${from}-${to}`}>
            {/* Background Track Guide Path */}
            <motion.path
              d={pathString}
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
              d={pathString}
              fill="none"
              stroke={edgeActive ? ELECTRIC_CYAN : 'rgba(63,63,70,0.9)'}
              strokeWidth={edgeActive ? 2.5 : 1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isSimulating
                  ? { pathLength: 1, opacity: edgeActive ? 1 : 0.45 }
                  : animationCompleted
                    ? { pathLength: 1, opacity: 0.45 }
                    : shouldAnimate
                      ? { pathLength: 1, opacity: 0.55 }
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

            {/* Glowing Cyan Laser Pulse */}
            <path
              d={pathString}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2"
              strokeDasharray="6 12"
              filter="url(#laser-glow)"
              className="animate-[dash_2s_linear_infinite]"
            />
          </g>
        );
      })}

      {/* Nodes */}
      {renderNodes.map((n, ni) => {
        const isBrain = n.type === 'dify';
        const isActive = isSimulating && ni === activeNodeIdx;
        const nodeDelay = getNodeDelay(ni);

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
              style={{ transformOrigin: `${NODE_WIDTH / 2}px ${NODE_HEIGHT / 2}px` }}
            >
              {/* Trigger pulse ring for webhook */}
              {n.id === 'webhook' && !isSimulating && !animationCompleted && (
                <motion.rect
                  x="-4"
                  y="-4"
                  width={NODE_WIDTH + 8}
                  height={NODE_HEIGHT + 8}
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
                  style={{ transformOrigin: `${NODE_WIDTH / 2}px ${NODE_HEIGHT / 2}px` }}
                />
              )}

              {/* Brain node arrival pulse */}
              {n.id === 'brain' && !isSimulating && !animationCompleted && (
                <motion.rect
                  x="-4"
                  y="-4"
                  width={NODE_WIDTH + 8}
                  height={NODE_HEIGHT + 8}
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
                  style={{ transformOrigin: `${NODE_WIDTH / 2}px ${NODE_HEIGHT / 2}px` }}
                />
              )}

              {/* Active Simulation Highlight Rect */}
              {isActive && (
                <rect
                  x="-4"
                  y="-4"
                  width={NODE_WIDTH + 8}
                  height={NODE_HEIGHT + 8}
                  fill="none"
                  stroke={ELECTRIC_CYAN}
                  strokeWidth="2"
                />
              )}

              {/* Node Card Base */}
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                fill="#0b0b0f"
                stroke={
                  isActive
                    ? ELECTRIC_CYAN
                    : isBrain
                      ? '#3f3f46'
                      : '#1F1F23'
                }
                strokeWidth={isActive ? '1.5' : '1'}
              />

              {/* Padded Node Content Mapped to Central Typography Tokens */}
              <foreignObject x="0" y="0" width={NODE_WIDTH} height={NODE_HEIGHT}>
                <div className="w-full h-full min-w-[150px] min-h-[58px] py-2.5 px-4 flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: isActive || isBrain ? ELECTRIC_CYAN : '#71717a',
                    }}
                  />
                  <div className="min-w-0 flex flex-col justify-center gap-0.5">
                    <div className="type-node-title leading-tight truncate">
                      {n.label}
                    </div>
                    <div className="type-node-meta leading-tight truncate">
                      {n.sub}
                    </div>
                  </div>
                </div>
              </foreignObject>
            </motion.g>
          </g>
        );
      })}
    </motion.svg>
  );
});

export default WorkflowSvgCanvas;
