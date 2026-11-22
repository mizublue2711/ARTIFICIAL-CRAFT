import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Webhook,
  MessageCircle,
  Slack,
  Users,
  Activity,
  Zap,
  Link2,
  X,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { getShowcaseBlueprints, type WorkflowBlueprint, type WorkflowNodeDef } from '@/data/dal';
import WorkflowSvgCanvas, { type NodeDef } from '@/components/home/WorkflowSvgCanvas';
import WorkflowCarousel3D, {
  type WorkflowCarouselItem,
} from '@/components/home/WorkflowCarousel3D';
import { useTranslation } from '@/context/useLanguage';

const ELECTRIC_PURPLE = '#5322ff';
const ELECTRIC_CYAN = '#00E5FF';

function getAccentHex(accent?: string): string {
  if (!accent) return ELECTRIC_CYAN;
  if (accent === 'cyan') return ELECTRIC_CYAN;
  if (accent === 'purple') return ELECTRIC_PURPLE;
  return accent;
}

function getNodeIcon(id: string, type?: string) {
  const lower = `${id} ${type ?? ''}`.toLowerCase();
  if (lower.includes('dify') || lower.includes('brain') || lower.includes('ai') || lower.includes('classifier')) return Brain;
  if (lower.includes('webhook') || lower.includes('trigger') || lower.includes('ingest')) return Webhook;
  if (lower.includes('crop') || lower.includes('transform') || lower.includes('shadow') || lower.includes('contour')) return Activity;
  if (lower.includes('slack')) return Slack;
  if (lower.includes('telegram')) return MessageCircle;
  if (lower.includes('crm') || lower.includes('user') || lower.includes('contract')) return Users;
  if (lower.includes('storage') || lower.includes('r2') || lower.includes('cdn')) return Cpu;
  return Activity;
}

function MetricRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono">
      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
      <span className="type-node-meta">{label}</span>
      <span className="ml-auto type-node-title">{value}</span>
    </div>
  );
}

export interface AutomationCockpitProps {
  className?: string;
  onSimulationStart?: () => void;
  onSimulationComplete?: () => void;
}

export const AutomationCockpit: React.FC<AutomationCockpitProps> = ({
  className = '',
  onSimulationStart,
  onSimulationComplete,
}) => {
  const { t, language } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);

  // Hydrate Hero showcase presets from isolated presentation data (showcase-blueprints.json)
  const workflowModes: WorkflowBlueprint[] = useMemo(() => {
    return getShowcaseBlueprints();
  }, []);

  const activeBlueprint: WorkflowBlueprint = useMemo(() => {
    return workflowModes[activeIdx] || workflowModes[0] || {
      id: 'default',
      title: 'Default Pipeline',
      accent: ELECTRIC_CYAN,
      nodes: [],
      edges: [],
    };
  }, [workflowModes, activeIdx]);

  const activeTitle = useMemo(() => {
    const key = `cockpit.blueprint_${activeBlueprint.id.replace(/-/g, '_')}_title`;
    const translated = t(key);
    if (translated !== key) return translated;
    return (language === 'vi' && activeBlueprint.title_vi)
      ? activeBlueprint.title_vi
      : activeBlueprint.title;
  }, [language, activeBlueprint, t]);

  const activeDescription = useMemo(() => {
    const key = `cockpit.blueprint_${activeBlueprint.id.replace(/-/g, '_')}_desc`;
    const translated = t(key);
    if (translated !== key) return translated;
    return (language === 'vi' && activeBlueprint.description_vi)
      ? activeBlueprint.description_vi
      : activeBlueprint.description || '';
  }, [language, activeBlueprint, t]);

  const activeCategory = useMemo(() => {
    return (activeBlueprint as any).category
      ? `// ${((activeBlueprint as any).category as string).toUpperCase()}`
      : t('cockpit.default_category');
  }, [activeBlueprint, t]);

  const presets = useMemo(() => [
    { label: t('cockpit.preset_swiss'), url: 'https://craft.code/air-jordan-1-2024' },
    { label: t('cockpit.preset_brutalist'), url: 'https://docs.artcraft.io/pitchdeck.pdf' },
    { label: t('cockpit.preset_financial'), url: 'https://reports.artcraft.io/q4-annual.pdf' },
  ], [t]);

  const accent = getAccentHex(activeBlueprint.accent);

  const [simState, setSimState] = useState<'idle' | 'running' | 'done'>('idle');
  const [activeNodeIdx, setActiveNodeIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [simUrl, setSimUrl] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const simRafRef = useRef<number | null>(null);

  // Dynamically map validated blueprint nodes into visual NodeDef specifications
  const renderNodes: NodeDef[] = useMemo(() => {
    if (!activeBlueprint.nodes || activeBlueprint.nodes.length === 0) {
      return [];
    }
    return activeBlueprint.nodes.map((n: WorkflowNodeDef, idx: number) => {
      const nodeType: 'dify' | 'n8n' =
        n.id.includes('dify') || (n as any).type?.includes('AI') ? 'dify' : 'n8n';

      const icon = getNodeIcon(n.id, (n as any).type);

      return {
        id: n.id,
        label: n.label || (n as any).name || n.id,
        sub: (n as any).engine || (n as any).latency || `step.0${(n as any).step ?? idx + 1}`,
        icon,
        type: nodeType,
        x: n.x ?? (80 + (idx % 5) * 200),
        y: n.y ?? (60 + Math.floor(idx / 5) * 100),
      };
    });
  }, [activeBlueprint]);

  // Dynamically map validated blueprint edges into DAG connections
  const renderEdges: [string, string][] = useMemo(() => {
    if (activeBlueprint.edges && activeBlueprint.edges.length > 0) {
      return activeBlueprint.edges;
    }
    const sequential: [string, string][] = [];
    for (let i = 0; i < renderNodes.length - 1; i++) {
      sequential.push([renderNodes[i].id, renderNodes[i + 1].id]);
    }
    return sequential;
  }, [activeBlueprint, renderNodes]);

  const nodeIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    renderNodes.forEach((n, i) => {
      map[n.id] = i;
    });
    return map;
  }, [renderNodes]);

  const cancelSim = useCallback(() => {
    if (simRafRef.current !== null) {
      cancelAnimationFrame(simRafRef.current);
      simRafRef.current = null;
    }
  }, []);

  const handleSelectMode = useCallback(
    (i: number) => {
      if (i < 0 || i >= workflowModes.length || i === activeIdx) return;
      cancelSim();
      setSimState('idle');
      setShowMetrics(false);
      setActiveNodeIdx(-1);
      setProgress(0);
      setActiveIdx(i);
    },
    [activeIdx, cancelSim, workflowModes.length],
  );

  const carouselItems: WorkflowCarouselItem[] = useMemo(
    () =>
      workflowModes.map((m, i) => {
        const hex = getAccentHex(m.accent);
        const isPurple = hex.toLowerCase().includes('5322ff') || m.accent === 'purple';
        const accentVariant: 'cyan' | 'purple' = isPurple ? 'purple' : 'cyan';

        const titleKey = `cockpit.blueprint_${m.id.replace(/-/g, '_')}_title`;
        const translatedTitle = t(titleKey);
        const label = translatedTitle !== titleKey
          ? translatedTitle
          : (language === 'vi' && m.title_vi)
            ? m.title_vi
            : m.title;

        const descKey = `cockpit.blueprint_${m.id.replace(/-/g, '_')}_desc`;
        const translatedDesc = t(descKey);
        const descSource = translatedDesc !== descKey ? translatedDesc : m.description;
        const sublabel = (m as any).category
          ? `// ${((m as any).category as string).toUpperCase()}`
          : descSource
            ? descSource.slice(0, 36) + '...'
            : t('cockpit.default_category');

        return {
          id: m.id,
          label,
          sublabel,
          accent: accentVariant,
          accentHex: hex,
          badge: `[ 0${i + 1} // ${t('cockpit.badge_blueprint')} ]`,
        };
      }),
    [workflowModes, language, t],
  );

  const blueprintStats = useMemo(() => {
    const nodeCount = activeBlueprint.nodes?.length ?? renderNodes.length;
    const tier = (activeBlueprint as any).tier ?? 'Core';
    const edgeCount = renderEdges.length;
    return [
      { label: t('cockpit.stat_nodes'), value: `${nodeCount} ${t('cockpit.stat_nodes_unit')}` },
      { label: t('cockpit.stat_tier'), value: `[ ${tier} ]` },
      { label: t('cockpit.stat_density'), value: `${edgeCount} ${t('cockpit.stat_edges_unit')}` },
    ];
  }, [activeBlueprint, renderNodes.length, renderEdges.length, t]);

  const runSimulation = useCallback(() => {
    cancelSim();
    setShowMetrics(false);
    setSimState('running');
    setProgress(0);
    setActiveNodeIdx(0);
    onSimulationStart?.();

    const startTime = performance.now();
    const duration = 2800;
    const nodeCount = Math.max(renderNodes.length, 1);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      setActiveNodeIdx(pct < 1 ? Math.min(Math.floor(pct * nodeCount), nodeCount - 1) : -1);

      if (pct < 1) {
        simRafRef.current = requestAnimationFrame(tick);
      } else {
        setSimState('done');
        setShowMetrics(true);
        setActiveNodeIdx(-1);
        simRafRef.current = null;
        onSimulationComplete?.();
      }
    };
    simRafRef.current = requestAnimationFrame(tick);
  }, [renderNodes, cancelSim, onSimulationStart, onSimulationComplete]);

  useEffect(() => () => cancelSim(), [cancelSim]);

  const handlePreset = (preset: (typeof presets)[0]) => {
    setSimUrl(preset.url);
    setActivePreset(preset.label);
    runSimulation();
  };

  const isSimulating = simState === 'running';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.25 }}
      className={`mt-10 lg:mt-12 font-mono ${className}`}
    >
      {/* Step A & B: Section Header + 3D Perspective Coverflow Deck */}
      <WorkflowCarousel3D
        items={carouselItems}
        activeIdx={activeIdx}
        onSelectMode={handleSelectMode}
        title={t('cockpit.workflow_engine')}
        subtitle={t('cockpit.coverflow_subtitle')}
        config={{
          cardWidth: 360,
          cardGap: 24,
          perspectiveDistance: 1200,
          zDepthOffset: 60,
          rotationAngle: 18,
          springStiffness: 260,
          springDamping: 24,
        }}
      />

      {/* Step C: Unified Cockpit Window */}
      <div className="relative border border-[#27272A] bg-[#09090B] mt-4 overflow-hidden">
        {/* Terminal Window Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1F1F23] bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="h-2 w-2 bg-zinc-700" />
              <span className="h-2 w-2 bg-zinc-700" />
              <span className="h-2 w-2 bg-zinc-700" />
            </span>
            <span className="ml-2 type-telemetry-tag text-zinc-400 normal-case">
              ~/artcraft/engine/{activeBlueprint.id}.json
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`type-telemetry-tag px-2 py-0.5 border font-bold inline-flex items-center gap-1.5 ${
                isSimulating
                  ? 'border-[#00E5FF]/50'
                  : 'border-[#1F1F23] text-zinc-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isSimulating ? 'bg-[#00E5FF] animate-pulse' : 'bg-[#00E5FF]/70'
                }`}
              />
              {isSimulating ? t('cockpit.exec_status_executing') : t('cockpit.exec_status_ready')}
            </span>
            <span className="type-telemetry-tag text-zinc-500 hidden sm:inline">
              {t('cockpit.run_id')}
            </span>
          </div>
        </div>

        {/* Injected Action Control Bar: URL Input + RUN TEST CTA + Sample Presets */}
        <div className="p-4 lg:px-6 lg:py-4 border-b border-[#1F1F23] bg-[#05050A]">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex-1 flex items-center gap-2 border border-[#1F1F23] bg-[#09090B] px-3 py-2 focus-within:border-zinc-500 transition-colors">
              <Link2 className="h-4 w-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={simUrl}
                onChange={(e) => {
                  setSimUrl(e.target.value);
                  setActivePreset(null);
                }}
                placeholder={t('cockpit.sim_placeholder')}
                className="bg-transparent w-full type-node-meta text-zinc-200 placeholder-zinc-600 outline-none min-w-0"
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="h-11 px-6 border border-[#27272A] hover:border-[#00E5FF] bg-[#0C0C14] hover:bg-[#12121E] type-telemetry-tag text-white transition-all flex items-center justify-center gap-2 group cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Activity className="h-3.5 w-3.5 text-[#00E5FF] animate-pulse" />
                  <span className="font-bold">{t('cockpit.sim_executing')}</span>
                </>
              ) : (
                <>
                  <span className="text-[#00E5FF] group-hover:scale-110 transition-transform">▶</span>
                  <span className="font-bold">{t('cockpit.sim_run_btn')}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="type-telemetry-tag text-zinc-400 mr-1">
              {t('cockpit.preset_engine')}
            </span>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`type-telemetry-tag border px-2.5 py-1 transition-colors cursor-pointer ${
                  activePreset === p.label
                    ? 'border-zinc-500 bg-zinc-900 text-white'
                    : 'border-[#1F1F23] bg-[#09090B] text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Canvas + Telemetry Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Canvas */}
          <div className="lg:col-span-8 relative bg-[#09090b] min-h-[300px] sm:min-h-[360px]">
            {/* Progress bar */}
            {isSimulating && (
              <div className="absolute top-0 inset-x-0 h-1 bg-zinc-800 z-10">
                <div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #00E5FF, #5322ff)',
                  }}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              <WorkflowSvgCanvas
                key={activeBlueprint.id}
                renderNodes={renderNodes}
                renderEdges={renderEdges}
                nodeIndexMap={nodeIndexMap}
                activeNodeIdx={activeNodeIdx}
                isSimulating={isSimulating}
                accent={accent}
                progress={progress}
              />
            </AnimatePresence>

            {/* Metrics popup */}
            <AnimatePresence>
              {showMetrics && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 12 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 12 }}
                    className="relative border border-[#27272A] bg-zinc-950 p-6 max-w-sm w-full"
                  >
                    <button
                      onClick={() => setShowMetrics(false)}
                      className="absolute top-3 right-3 text-zinc-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2.5 mb-5 border-b border-[#1F1F23] pb-3">
                      <Zap className="h-5 w-5 text-[#00E5FF]" />
                      <span className="type-node-title uppercase">
                        {t('cockpit.exec_completed_title')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <MetricRow
                        icon={CheckCircle2}
                        label={t('cockpit.metric_deterministic')}
                        value={t('cockpit.metric_deterministic_val')}
                        color="#10b981"
                      />
                      <MetricRow
                        icon={Cpu}
                        label={t('cockpit.metric_token_cost')}
                        value={t('cockpit.metric_token_cost_val')}
                        color="#00E5FF"
                      />
                      <MetricRow
                        icon={Activity}
                        label={t('cockpit.metric_craft_precision')}
                        value={t('cockpit.metric_craft_precision_val')}
                        color="#5322ff"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setShowMetrics(false);
                        setSimState('idle');
                      }}
                      className="mt-5 w-full border border-zinc-800 bg-zinc-900 type-telemetry-tag font-bold text-zinc-300 py-2.5 hover:bg-zinc-800 hover:text-white"
                    >
                      {t('cockpit.run_another_sim')}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#1F1F23] bg-zinc-950 p-5 flex flex-col font-mono">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBlueprint.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col h-full gap-4"
              >
                <div>
                  <div className="type-telemetry-tag mb-1">
                    {activeCategory}
                  </div>
                  <h4 className="type-section-title leading-snug mb-2">
                    {activeTitle}
                  </h4>
                  <p className="type-body-narrative max-w-lg mb-6">
                    {activeDescription}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {blueprintStats.map((s) => (
                    <div
                      key={s.label}
                      className="border border-[#1F1F23] bg-zinc-900/60 p-2.5"
                    >
                      <div className="type-node-title truncate">
                        {s.value}
                      </div>
                      <div className="type-node-meta leading-tight">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-[#1F1F23]">
                  <div className="type-telemetry-tag text-zinc-400 mb-2">
                    {t('cockpit.output_nodes')}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {renderNodes.slice(-3).map((n) => {
                      const NodeIcon = n.icon || Activity;
                      return (
                        <div key={n.id} className="flex items-center gap-2">
                          <NodeIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span className="type-node-meta text-zinc-200 truncate">{n.label}</span>
                          <span className="type-node-meta ml-auto shrink-0">
                            {n.sub}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Telemetry log strip */}
      <div className="mt-2 border border-[#1F1F23] bg-zinc-950 px-4 py-2.5 type-telemetry-tag text-zinc-400 normal-case flex flex-wrap items-center gap-3">
        <span className="text-emerald-400">{t('cockpit.telemetry_ok')}</span> {t('cockpit.telemetry_schema_validated')}
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-300">[{activeBlueprint.id}]</span> {t('cockpit.telemetry_nodes_mounted')} {renderNodes.length} {t('cockpit.telemetry_active')}
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-300">[craft]</span> {t('cockpit.telemetry_dag_edges')} {renderEdges.length} {t('cockpit.telemetry_verified')}
      </div>
    </motion.div>
  );
};

export default AutomationCockpit;
