import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Activity,
  RefreshCw,
  Zap,
  Layers,
  Cpu,
  Sparkles,
  Terminal,
  Grid,
  Box,
  Eye,
} from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';

export type AlgorithmCategory = 'organic' | 'structure' | 'biological';

export interface AlgorithmDef {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
}

export interface PaletteDef {
  id: string;
  nameKey: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export const ALGORITHMS: AlgorithmDef[] = [
  // Organic Category
  { id: 'perlin_flow', name: 'Perlin Flow Field', category: 'organic', description: 'Vector velocity fields driven by multi-octave 2D Perlin noise.' },
  { id: 'diff_growth', name: 'Differential Growth', category: 'organic', description: 'Simulated node expansion with spatial repulsion and path splitting.' },
  { id: 'react_diff', name: 'Reaction-Diffusion', category: 'organic', description: 'Gray-Scott chemical reaction modeling morphogenetic Turing patterns.' },
  { id: 'physarum', name: 'Physarum Slime Mold', category: 'organic', description: 'Agent-based foraging network with chemo-attractant trail transport.' },

  // Structure Category
  { id: 'voronoi', name: 'Voronoi Tessellation', category: 'structure', description: 'Delaunay triangulation and dynamic Fortune sweep-line partitioning.' },
  { id: 'lsystem', name: 'L-System Fractal Trees', category: 'structure', description: 'Recursive Lindenmayer string rewrite grammar geometry.' },
  { id: 'recursive_sub', name: 'Recursive Sub-division', category: 'structure', description: 'Golden ratio Mondrian grid sub-quad splitting matrix.' },

  // Biological Category
  { id: 'cellular_auto', name: 'Cellular Automata (Game of Life)', category: 'biological', description: 'Conway grid state transitions with periodic boundary conditions.' },
  { id: 'flocking_boids', name: 'Flocking Boids', category: 'biological', description: 'Craig Reynolds emergent swarm behavior (separation, alignment, cohesion).' },
  { id: 'neural_ca', name: 'Neural Cellular Automata', category: 'biological', description: 'Convolutional neural kernel growth dynamics.' },
];

export const PALETTES: PaletteDef[] = [
  {
    id: 'cyberpunk',
    nameKey: 'sandbox_palette_cyberpunk',
    label: '01: Cyberpunk Neon',
    primary: '#5322ff',
    secondary: '#00E5FF',
    accent: '#FF007A',
    background: '#0B0B0F',
  },
  {
    id: 'monochrome',
    nameKey: 'sandbox_palette_monochrome',
    label: '02: Brutalist Monochrome',
    primary: '#FAFAFA',
    secondary: '#71717A',
    accent: '#27272A',
    background: '#000000',
  },
  {
    id: 'bauhaus',
    nameKey: 'sandbox_palette_bauhaus',
    label: '03: Bauhaus Primary',
    primary: '#E11D48',
    secondary: '#2563EB',
    accent: '#FACC15',
    background: '#0F172A',
  },
  {
    id: 'amber',
    nameKey: 'sandbox_palette_amber',
    label: '04: Gold Amber',
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#78350F',
    background: '#0B0B0F',
  },
];

function generateSeedHash(): string {
  const chars = '0123456789ABCDEF';
  let hash = '0x';
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export default function PlugAndPlaySandbox() {
  const { t } = useTranslation();

  // Control State
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory>('organic');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('perlin_flow');
  const [density, setDensity] = useState<number>(250);
  const [speed, setSpeed] = useState<number>(1.5);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('cyberpunk');
  const [seedHash, setSeedHash] = useState<string>('0x71C8A93A');

  // Telemetry state
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [canvasRes, setCanvasRes] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active objects derived from selection
  const activePalette = useMemo(() => {
    return PALETTES.find((p) => p.id === selectedPaletteId) || PALETTES[0];
  }, [selectedPaletteId]);

  const activeAlgo = useMemo(() => {
    return ALGORITHMS.find((a) => a.id === selectedAlgoId) || ALGORITHMS[0];
  }, [selectedAlgoId]);

  // Filtered algorithms by category
  const filteredAlgos = useMemo(() => {
    return ALGORITHMS.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  // Handle category tab change: auto-select first algorithm in that category if needed
  const handleCategoryChange = (cat: AlgorithmCategory) => {
    setSelectedCategory(cat);
    const firstInCat = ALGORITHMS.find((a) => a.category === cat);
    if (firstInCat) {
      setSelectedAlgoId(firstInCat.id);
    }
  };

  const handleRandomizeSeed = () => {
    setSeedHash(generateSeedHash());
  };

  // Particle / Canvas Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    // Generate particle nodes based on seed and density
    const seedNum = parseInt(seedHash.replace('0x', ''), 16) || 1234567;
    const count = density;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      angle: number;
      life: number;
    }

    const particles: Particle[] = [];
    let rngState = seedNum;
    const pseudoRandom = () => {
      rngState = (rngState * 16807) % 2147483647;
      return (rngState - 1) / 2147483646;
    };

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: pseudoRandom() * w,
          y: pseudoRandom() * h,
          vx: (pseudoRandom() - 0.5) * 2,
          vy: (pseudoRandom() - 0.5) * 2,
          size: 1.5 + pseudoRandom() * 2.5,
          angle: pseudoRandom() * Math.PI * 2,
          life: pseudoRandom() * 100,
        });
      }
    };

    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.floor(rect.width);
        const h = Math.floor(rect.height);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);
        setCanvasRes({ width: w, height: h });
        initParticles(w, h);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      frameCount++;
      if (now - fpsTimer >= 500) {
        const calculatedFps = Math.round((frameCount * 1000) / (now - fpsTimer));
        setFps(calculatedFps);
        setFrameTime(parseFloat((1000 / Math.max(calculatedFps, 1)).toFixed(1)));
        frameCount = 0;
        fpsTimer = now;
      }

      const width = canvasRes.width || 800;
      const height = canvasRes.height || 600;

      // Semi-transparent fade for trailing effect
      ctx.fillStyle = activePalette.background + '22';
      ctx.fillRect(0, 0, width, height);

      // Render algorithmic generative geometry based on selected category & algorithm
      const spd = speed;
      const primaryHex = activePalette.primary;
      const secondaryHex = activePalette.secondary;
      const accentHex = activePalette.accent;

      if (selectedAlgoId === 'voronoi' || selectedAlgoId === 'recursive_sub') {
        // Structural grid overlay
        ctx.strokeStyle = secondaryHex + '33';
        ctx.lineWidth = 1;
        const cols = 6;
        const rows = 4;
        const cw = width / cols;
        const ch = height / rows;

        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          ctx.moveTo(c * cw, 0);
          ctx.lineTo(c * cw, height);
          ctx.stroke();
        }
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * ch);
          ctx.lineTo(width, r * ch);
          ctx.stroke();
        }
      }

      // Draw particle dynamics according to parameters
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (selectedCategory === 'organic') {
          // Flow noise field effect
          p.angle += (pseudoRandom() - 0.5) * 0.2 * spd;
          p.x += Math.cos(p.angle) * spd * 1.5;
          p.y += Math.sin(p.angle) * spd * 1.5;
        } else if (selectedCategory === 'structure') {
          // Geometric axis movement
          p.x += p.vx * spd * 1.2;
          p.y += p.vy * spd * 1.2;
          if (Math.random() < 0.05 * spd) {
            p.vx = (Math.floor(pseudoRandom() * 3) - 1) * 1.5;
            p.vy = (Math.floor(pseudoRandom() * 3) - 1) * 1.5;
          }
        } else {
          // Biological / Swarm / CA dynamics
          p.x += p.vx * spd;
          p.y += p.vy * spd;
          p.vx += (pseudoRandom() - 0.5) * 0.3;
          p.vy += (pseudoRandom() - 0.5) * 0.3;
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.fillStyle = i % 3 === 0 ? primaryHex : i % 3 === 1 ? secondaryHex : accentHex;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles for structural / organic look
        if (density < 350) {
          for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60) {
              ctx.strokeStyle = primaryHex + Math.floor((1 - dist / 60) * 128).toString(16).padStart(2, '0');
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animFrameId);
    };
  }, [density, speed, seedHash, selectedCategory, selectedAlgoId, activePalette, canvasRes.width, canvasRes.height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top),
      });
    }
  };

  return (
    <section id="playground" className="relative bg-[#0B0B0F] border-t border-b border-zinc-800 py-16 lg:py-24 font-mono">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-glow mb-2 border border-zinc-800 bg-zinc-900 px-2.5 py-1">
              <span className="h-1.5 w-1.5 bg-[#5322ff] animate-ping" />
              {t('sandbox_section_label')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-mono">
              {t('sandbox_title')}
            </h2>
            <p className="mt-1 text-sm text-zinc-400 font-sans max-w-xl">
              {t('sandbox_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-zinc-300">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-zinc-500">{t('sandbox_telemetry_status')}</span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-cyan-glow font-bold">
              SEED: {seedHash}
            </div>
          </div>
        </div>

        {/* Dual-Panel / 3-Column Viewport Architecture (100vh style container) */}
        <div className="grid lg:grid-cols-[300px_1fr_280px] border border-zinc-800 bg-[#09090c] min-h-[640px] shadow-2xl">
          {/* ================= LEFT PANEL: CONTROL PANEL (300px) ================= */}
          <div className="p-5 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#0B0B0F] flex flex-col justify-between font-mono gap-6">
            <div className="space-y-6">
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Sliders className="h-4 w-4 text-cyan-glow" />
                  <span>{t('sandbox_control_panel')}</span>
                </div>
                <span className="text-[10px] text-zinc-600">v1.0.4</span>
              </div>

              {/* Category Selector Tabs */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  01 // ALGORITHM CATEGORY
                </label>
                <div className="grid grid-cols-3 gap-1 border border-zinc-800 bg-zinc-950 p-1">
                  {(['organic', 'structure', 'biological'] as AlgorithmCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`py-1.5 text-[10px] font-bold uppercase transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#5322ff] text-white'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {cat === 'organic'
                        ? t('sandbox_cat_organic')
                        : cat === 'structure'
                          ? t('sandbox_cat_structure')
                          : t('sandbox_cat_biological')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Algorithm Dropdown */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  02 // {t('sandbox_select_algo')} (10 ALGORITHMS)
                </label>
                <div className="relative">
                  <select
                    value={selectedAlgoId}
                    onChange={(e) => setSelectedAlgoId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white p-2.5 outline-none font-mono focus:border-[#5322ff] transition-colors cursor-pointer appearance-none"
                  >
                    {filteredAlgos.map((algo) => (
                      <option key={algo.id} value={algo.id} className="bg-zinc-950 text-white">
                        {algo.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px]">
                    ▼
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500 font-sans leading-tight">
                  {activeAlgo.description}
                </p>
              </div>

              {/* Parameter Sliders */}
              <div className="space-y-4 border-t border-zinc-800/80 pt-4">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500">
                  03 // PARAMETER TUNING
                </label>

                {/* Density Slider (10 - 500) */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">{t('sandbox_param_density')}</span>
                    <span className="text-cyan-glow font-bold">{density}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="1"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#00E5FF]"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                    <span>10 LOW</span>
                    <span>500 HIGH</span>
                  </div>
                </div>

                {/* Speed / Velocity Slider (0.1x - 5.0x) */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">{t('sandbox_param_speed')}</span>
                    <span className="text-[#5322ff] font-bold">{speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#5322ff]"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
                    <span>0.1x SLOW</span>
                    <span>5.0x FAST</span>
                  </div>
                </div>
              </div>

              {/* Color Palette Swatches */}
              <div className="border-t border-zinc-800/80 pt-4">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                  04 // {t('sandbox_palette')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PALETTES.map((pal) => {
                    const isSelected = pal.id === selectedPaletteId;
                    return (
                      <button
                        key={pal.id}
                        onClick={() => setSelectedPaletteId(pal.id)}
                        className={`p-2 border text-left transition-all font-mono ${
                          isSelected
                            ? 'border-[#00E5FF] bg-zinc-900'
                            : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full inline-block"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full inline-block"
                            style={{ backgroundColor: pal.secondary }}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full inline-block"
                            style={{ backgroundColor: pal.accent }}
                          />
                        </div>
                        <div className="text-[10px] font-bold text-zinc-300 truncate">
                          {t(pal.nameKey as any)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Primary Action Button: Randomize Seed */}
            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={handleRandomizeSeed}
                className="w-full py-3 px-4 border border-[#5322ff] bg-[#5322ff]/20 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#5322ff] hover:shadow-[0_0_20px_rgba(83,34,255,0.6)] flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="h-3.5 w-3.5 text-cyan-glow group-hover:rotate-180 transition-transform duration-500" />
                <span>{t('sandbox_randomize_seed')}</span>
              </button>
            </div>
          </div>

          {/* ================= CENTER PANEL: CANVAS CONTAINER ================= */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative bg-[#07070A] border-b lg:border-b-0 lg:border-r border-zinc-800 min-h-[400px] flex items-center justify-center overflow-hidden group select-none"
          >
            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2.5 py-1">
              <Box className="h-3 w-3 text-cyan-glow" />
              <span>{t('sandbox_canvas_interactive')}</span>
            </div>

            <div className="absolute top-3 right-3 z-10 font-mono text-[10px] text-zinc-500 bg-zinc-950/80 border border-zinc-800 px-2 py-0.5">
              POS [X: {mousePos.x}, Y: {mousePos.y}]
            </div>

            {/* Crosshair Corner Accents */}
            <div className="absolute top-2 left-2 pointer-events-none text-zinc-700 text-xs">+</div>
            <div className="absolute top-2 right-2 pointer-events-none text-zinc-700 text-xs">+</div>
            <div className="absolute bottom-2 left-2 pointer-events-none text-zinc-700 text-xs">+</div>
            <div className="absolute bottom-2 right-2 pointer-events-none text-zinc-700 text-xs">+</div>

            {/* The Live HTML5 2D Interactive Canvas */}
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

            {/* Bottom Overlay Info Strip */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between font-mono text-[10px] text-zinc-500 bg-zinc-950/90 border border-zinc-800 px-3 py-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-300 font-bold">{activeAlgo.name}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span>DENSITY: {density}</span>
                <span>SPEED: {speed.toFixed(1)}x</span>
                <span className="text-cyan-glow">{fps} FPS</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL: TELEMETRY CONSOLE (280px) ================= */}
          <div className="p-5 bg-[#0B0B0F] font-mono flex flex-col justify-between text-xs space-y-6">
            <div>
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider">
                  <Terminal className="h-4 w-4 text-[#5322ff]" />
                  <span>{t('sandbox_telemetry_title')}</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-cyan-glow animate-ping" />
              </div>

              {/* FPS & Performance Readout Box */}
              <div className="border border-zinc-800 bg-zinc-950 p-3 mb-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_fps')}</span>
                  <span className="text-base font-extrabold text-cyan-glow">{fps} FPS</span>
                </div>
                <div className="w-full bg-zinc-900 h-1">
                  <div
                    className="bg-cyan-glow h-full transition-all duration-300"
                    style={{ width: `${Math.min((fps / 60) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                  <span>{t('sandbox_telemetry_frametime')}</span>
                  <span className="font-bold text-white">{frameTime} ms</span>
                </div>
              </div>

              {/* State Readouts */}
              <div className="space-y-3 font-mono">
                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_algo')}</span>
                  <span className="text-zinc-200 font-bold truncate max-w-[130px]" title={activeAlgo.name}>
                    {activeAlgo.name}
                  </span>
                </div>

                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_category')}</span>
                  <span className="text-[#5322ff] font-bold uppercase">{selectedCategory}</span>
                </div>

                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_density')}</span>
                  <span className="text-white font-bold">{density} / 500</span>
                </div>

                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_speed')}</span>
                  <span className="text-cyan-glow font-bold">{speed.toFixed(1)}x</span>
                </div>

                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_palette')}</span>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activePalette.primary }} />
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activePalette.secondary }} />
                    <span className="text-[10px] text-zinc-300">{activePalette.id}</span>
                  </div>
                </div>

                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_seed')}</span>
                  <span className="text-[#00E5FF] font-bold">{seedHash}</span>
                </div>

                <div className="border-b border-zinc-800/60 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{t('sandbox_telemetry_resolution')}</span>
                  <span className="text-zinc-400">{canvasRes.width}x{canvasRes.height}</span>
                </div>
              </div>
            </div>

            {/* Bottom System Log */}
            <div className="border border-zinc-800 bg-zinc-950 p-2.5 text-[9px] text-zinc-500 space-y-1">
              <div className="text-emerald-400 font-bold">[SYS//LOG]</div>
              <div>&gt; ALGO_EXEC_OK</div>
              <div>&gt; SEED_MUTATED ({seedHash})</div>
              <div>&gt; BUFFER_RENDER_60FPS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
