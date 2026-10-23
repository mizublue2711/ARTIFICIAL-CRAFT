import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sliders,
  Activity,
  RefreshCw,
  Terminal,
  Box,
  MousePointer,
} from 'lucide-react';
import { useTranslation } from '@/context/useLanguage';
import { Translations } from '@/locales/translations';

export type AlgorithmCategory = 'organic' | 'structure' | 'biological';

export interface AlgorithmDef {
  id: string;
  name: string;
  category: AlgorithmCategory;
  groupLabel: string;
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

const ALGORITHMS: AlgorithmDef[] = [
  // Group A: Flow & Organic Motion
  {
    id: 'vector_field',
    name: '01. Radiant Energy Fiber Core',
    category: 'organic',
    groupLabel: 'Group A: Flow & Organic Motion',
    description: 'Central luminescent core with 20-45 organic tendril fibers & gravitational force field.',
  },
  {
    id: 'fibonacci_spiral',
    name: '02. Fibonacci Spiral',
    category: 'organic',
    groupLabel: 'Group A: Flow & Organic Motion',
    description: 'Phyllotaxis dynamic expansion governed by the golden angle ratio.',
  },
  {
    id: 'reaction_diffusion',
    name: '03. Reaction-Diffusion',
    category: 'organic',
    groupLabel: 'Group A: Flow & Organic Motion',
    description: 'Gray-Scott chemical reaction modeling organic skin patterns.',
  },

  // Group B: Geometry & Structure
  {
    id: 'voronoi',
    name: '04. Organic Fluid Voronoi Mesh',
    category: 'structure',
    groupLabel: 'Group B: Geometry & Structure',
    description: 'Smooth membrane cells with crisp 1.5px zinc borders, liquid gradients & CAD anchors.',
  },
  {
    id: 'delaunay',
    name: '05. Delaunay Triangulation',
    category: 'structure',
    groupLabel: 'Group B: Geometry & Structure',
    description: 'Dynamic mesh connecting nearby particle nodes with structural wireframes.',
  },
  {
    id: 'isometric_grid',
    name: '06. Isometric Grid Architecture',
    category: 'structure',
    groupLabel: 'Group B: Geometry & Structure',
    description: '3D extruded flat cuboid blocks with Swiss dimension lines.',
  },
  {
    id: 'geometric_lines',
    name: '07. Geometric Line Art',
    category: 'structure',
    groupLabel: 'Group B: Geometry & Structure',
    description: 'Swiss-style precision intersecting vector paths & arc tangents.',
  },

  // Group C: Digital & Biological Systems
  {
    id: 'cyber_matrix',
    name: '08. Cyber Matrix Rain',
    category: 'biological',
    groupLabel: 'Group C: Digital & Biological Systems',
    description: 'Algorithmic code stream with neon color tinting & mouse disruption.',
  },
  {
    id: 'bauhaus_composition',
    name: '09. Bauhaus Graphic Composition',
    category: 'biological',
    groupLabel: 'Group C: Digital & Biological Systems',
    description: 'Abstract geometric balance of primary forms, circles, and grid axes.',
  },
  {
    id: 'cellular_automata',
    name: '10. Cellular Automata',
    category: 'biological',
    groupLabel: 'Group C: Digital & Biological Systems',
    description: 'Conway Game of Life grid evolution. Click canvas to spawn live cells.',
  },
];

const PALETTES: PaletteDef[] = [
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
    secondary: '#A1A1AA',
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

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16) || 83,
    g: parseInt(clean.substring(2, 4), 16) || 34,
    b: parseInt(clean.substring(4, 6), 16) || 255,
  };
}

// Simple fast Perlin-like pseudo noise generator
function noise2D(x: number, y: number): number {
  const sin1 = Math.sin(x * 12.9898 + y * 78.233);
  const sin2 = Math.sin(x * 37.719 + y * 51.137);
  return (Math.sin(sin1 * 43758.5453) + Math.cos(sin2 * 24614.63)) * 0.5;
}

export default function PlugAndPlaySandbox() {
  const { t } = useTranslation();

  // Control State
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory>('organic');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('vector_field');
  const [density, setDensity] = useState<number>(250);
  const [speed, setSpeed] = useState<number>(1.5);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('cyberpunk');
  const [seedHash, setSeedHash] = useState<string>('0x71C8A93A');

  // Interactive Voronoi cell centers added on mouse click
  const voronoiClickPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Interactive Shockwave Ripples for Organic Fluid Voronoi
  interface Shockwave {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    force: number;
  }
  const shockwavesRef = useRef<Shockwave[]>([]);

  // Interactive Cellular Automata grid state ref
  const caGridRef = useRef<number[][] | null>(null);

  // Mouse Refs to avoid re-rendering/destroying canvas loop on mousemove
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseOverRef = useRef<boolean>(false);

  // Telemetry state
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [canvasRes, setCanvasRes] = useState<{ width: number; height: number }>({ width: 800, height: 600 });
  const canvasResRef = useRef<{ width: number; height: number }>({ width: 800, height: 600 });
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

  const handleCategoryChange = (cat: AlgorithmCategory) => {
    setSelectedCategory(cat);
    const firstInCat = ALGORITHMS.find((a) => a.category === cat);
    if (firstInCat) {
      setSelectedAlgoId(firstInCat.id);
    }
  };

  const handleRandomizeSeed = () => {
    setSeedHash(generateSeedHash());
    voronoiClickPointsRef.current = [];
    shockwavesRef.current = [];
    caGridRef.current = null;
  };

  // Canvas Mouse Click handler for interactive Voronoi and CA grid
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (selectedAlgoId === 'voronoi') {
      voronoiClickPointsRef.current.push({ x: clickX, y: clickY });
      shockwavesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: 320,
        force: 50,
      });
    } else if (selectedAlgoId === 'cellular_automata' && caGridRef.current) {
      const cols = caGridRef.current.length;
      const rows = caGridRef.current[0].length;
      const cellW = rect.width / cols;
      const cellH = rect.height / rows;
      const c = Math.floor(clickX / cellW);
      const r = Math.floor(clickY / cellH);

      // Toggle 3x3 neighborhood around click
      for (let dc = -1; dc <= 1; dc++) {
        for (let dr = -1; dr <= 1; dr++) {
          const nc = c + dc;
          const nr = r + dr;
          if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
            caGridRef.current[nc][nr] = 1;
          }
        }
      }
    }
  };

  // Core 60FPS Generative Algorithm Suite Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    // Responsive 50% density reduction on mobile viewport
    const isMobile = window.innerWidth < 768;
    const effectiveDensity = isMobile ? Math.max(10, Math.floor(density * 0.5)) : density;

    // Seed state initialization
    const seedNum = parseInt(seedHash.replace('0x', ''), 16) || 1234567;
    let rngState = seedNum;
    const pseudoRandom = () => {
      rngState = (rngState * 16807) % 2147483647;
      return (rngState - 1) / 2147483646;
    };

    // Particles Data Structure & Flowline Ribbon Paths
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      angle: number;
      life: number;
      path: { x: number; y: number }[];
    }

    const particles: Particle[] = [];
    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < effectiveDensity; i++) {
        const startX = pseudoRandom() * w;
        const startY = pseudoRandom() * h;
        particles.push({
          x: startX,
          y: startY,
          vx: (pseudoRandom() - 0.5) * 2,
          vy: (pseudoRandom() - 0.5) * 2,
          size: 1.5 + pseudoRandom() * 2.5,
          angle: pseudoRandom() * Math.PI * 2,
          life: Math.floor(pseudoRandom() * 100),
          path: [{ x: startX, y: startY }],
        });
      }
    };

    // Matrix Rain drops
    interface RainColumn {
      x: number;
      y: number;
      speed: number;
      chars: string[];
    }
    const matrixCols: RainColumn[] = [];
    const initMatrix = (w: number) => {
      matrixCols.length = 0;
      const colWidth = 14;
      const count = Math.floor(w / colWidth);
      const chars = '01CRAFTDIFYN8NXY789ABCDEF'.split('');
      for (let i = 0; i < count; i++) {
        matrixCols.push({
          x: i * colWidth + 4,
          y: pseudoRandom() * -500,
          speed: 2 + pseudoRandom() * 4,
          chars: Array.from({ length: 15 }, () => chars[Math.floor(pseudoRandom() * chars.length)]),
        });
      }
    };

    // CA Grid initialization
    const initCA = (cols: number, rows: number) => {
      const grid: number[][] = [];
      for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
          grid[c][r] = pseudoRandom() < 0.25 ? 1 : 0;
        }
      }
      return grid;
    };

    // Canvas size updating
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.floor(rect.width) || 800;
        const h = Math.floor(rect.height) || 600;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        canvasResRef.current = { width: w, height: h };
        setCanvasRes({ width: w, height: h });
        initParticles(w, h);
        initMatrix(w);

        const caCols = Math.floor(w / 12);
        const caRows = Math.floor(h / 12);
        caGridRef.current = initCA(caCols, caRows);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Gray-Scott Reaction Diffusion simulation state (organic skin)
    const rdGridSize = 64;
    let gridU = new Float32Array(rdGridSize * rdGridSize).fill(1.0);
    let gridV = new Float32Array(rdGridSize * rdGridSize).fill(0.0);
    // Seed initial chemical spots
    for (let i = 28; i < 36; i++) {
      for (let j = 28; j < 36; j++) {
        gridV[i * rdGridSize + j] = 0.8;
      }
    }

    let globalTime = 0;

    // 60FPS Delta Capped Main Loop (with 2ms tolerance for 60Hz RAF jitter)
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const render = (now: number) => {
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameInterval - 2) {
        lastFrameTime = now - (elapsed % frameInterval);

        frameCount++;
        if (now - fpsTimer >= 500) {
          const calculatedFps = Math.min(60, Math.round((frameCount * 1000) / (now - fpsTimer)));
          setFps(calculatedFps);
          setFrameTime(parseFloat((1000 / Math.max(calculatedFps, 1)).toFixed(1)));
          frameCount = 0;
          fpsTimer = now;
        }

        globalTime += 0.016 * speed;
        const width = canvasResRef.current.width || 800;
        const height = canvasResRef.current.height || 600;

        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;
        const mActive = isMouseOverRef.current;

        const primary = activePalette.primary;
        const secondary = activePalette.secondary;
        const accent = activePalette.accent;

        // Trail background clearing
        if (selectedAlgoId === 'vector_field' || selectedAlgoId === 'cyber_matrix') {
          ctx.fillStyle = activePalette.background + '2A';
        } else {
          ctx.fillStyle = activePalette.background;
        }
        ctx.fillRect(0, 0, width, height);

        // ================= ALGORITHM 01: RADIANT ENERGY FIBER CORE =================
        if (selectedAlgoId === 'vector_field') {
          const cx = width / 2;
          const cy = height / 2;
          const fiberCount = Math.min(45, Math.max(15, Math.floor(15 + (effectiveDensity / 500) * 30)));
          const maxRadius = Math.min(width, height) * 0.42;
          const numSteps = 24;

          const pRgb = hexToRgb(primary);
          const sRgb = hexToRgb(secondary);

          for (let i = 0; i < fiberCount; i++) {
            const baseAngle = (i / fiberCount) * Math.PI * 2;
            let tipX = cx;
            let tipY = cy;

            const points: { x: number; y: number }[] = [];
            points.push({ x: cx, y: cy });

            for (let step = 3; step <= numSteps; step++) {
              const ratio = step / numSteps;
              const r = ratio * maxRadius;

              // Wave frequency reduced by 40% for calm, fluid motion
              const wave =
                Math.sin(globalTime * 1.08 + i * 0.25 + ratio * 6) * 0.81 +
                noise2D(i * 0.15 + ratio * 1.5, globalTime * 0.15) * 0.42;
              const currentAngle = baseAngle + wave;

              let px = cx + Math.cos(currentAngle) * r;
              let py = cy + Math.sin(currentAngle) * r;

              // Mouse Magnetic Force interaction
              if (mActive) {
                const dx = mx - px;
                const dy = my - py;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 240 && dist > 1) {
                  const factor = (1 - dist / 240) * ratio;
                  const gravAngle = Math.atan2(my - py, mx - px) + Math.PI * 0.36;
                  px += Math.cos(gravAngle) * 30 * factor * speed;
                  py += Math.sin(gravAngle) * 30 * factor * speed;
                }
              }

              points.push({ x: px, y: py });
              if (step === numSteps) {
                tipX = px;
                tipY = py;
              }
            }

            // Progressive opacity fadeout toward fiber tips to enhance dark negative space
            if (points.length > 1) {
              const grad = ctx.createLinearGradient(cx, cy, tipX, tipY);
              const cRgb = i % 2 === 0 ? pRgb : sRgb;
              grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
              grad.addColorStop(0.15, 'rgba(0, 229, 255, 0.8)');
              grad.addColorStop(0.5, `rgba(${cRgb.r}, ${cRgb.g}, ${cRgb.b}, 0.5)`);
              grad.addColorStop(0.85, `rgba(${cRgb.r}, ${cRgb.g}, ${cRgb.b}, 0.12)`);
              grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              for (let ptIdx = 1; ptIdx < points.length; ptIdx++) {
                ctx.lineTo(points[ptIdx].x, points[ptIdx].y);
              }
              ctx.stroke();
            }

            // Subtle 1.5px Glowing Anchor Dot at Fiber Tip
            ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(tipX, tipY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Central Radiant Luminescent Core Glow
          const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 38);
          coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
          coreGrad.addColorStop(0.25, 'rgba(0, 229, 255, 0.85)');
          coreGrad.addColorStop(0.65, 'rgba(83, 34, 255, 0.4)');
          coreGrad.addColorStop(1, 'rgba(11, 11, 15, 0)');

          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 38, 0, Math.PI * 2);
          ctx.fill();
        }

        // ================= ALGORITHM 02: FIBONACCI SPIRAL =================
        else if (selectedAlgoId === 'fibonacci_spiral') {
          const centerX = width / 2;
          const centerY = height / 2;
          const goldenAngle = 2.39996; // ~137.5 degrees in radians
          const count = effectiveDensity;
          const scale = 8 + Math.sin(globalTime) * 2;

          for (let i = 0; i < count; i++) {
            const r = Math.sqrt(i) * scale;
            const theta = i * goldenAngle + globalTime * 0.5;

            let px = centerX + r * Math.cos(theta);
            let py = centerY + r * Math.sin(theta);

            // Mouse proximity repulsion
            if (mActive) {
              const dx = px - mx;
              const dy = py - my;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                const push = (1 - dist / 120) * 50;
                px += (dx / (dist || 1)) * push;
                py += (dy / (dist || 1)) * push;
              }
            }

            ctx.fillStyle = i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent;
            ctx.beginPath();
            ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
            ctx.fill();

            if (i > 0 && i % 5 === 0) {
              ctx.strokeStyle = secondary + '33';
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(px, py);
              ctx.stroke();
            }
          }
        }

        // ================= ALGORITHM 03: REACTION-DIFFUSION =================
        else if (selectedAlgoId === 'reaction_diffusion') {
          const cellW = width / rdGridSize;
          const cellH = height / rdGridSize;
          const F = 0.0545;
          const k = 0.062;

          // Mouse spot injection
          if (mActive) {
            const gx = Math.floor((mx / width) * rdGridSize);
            const gy = Math.floor((my / height) * rdGridSize);
            if (gx > 1 && gx < rdGridSize - 2 && gy > 1 && gy < rdGridSize - 2) {
              gridV[gx * rdGridSize + gy] = 0.9;
            }
          }

          // Reaction-diffusion step
          const nextU = new Float32Array(gridU);
          const nextV = new Float32Array(gridV);

          for (let x = 1; x < rdGridSize - 1; x++) {
            for (let y = 1; y < rdGridSize - 1; y++) {
              const idx = x * rdGridSize + y;
              const u = gridU[idx];
              const v = gridV[idx];

              const lapU =
                gridU[(x - 1) * rdGridSize + y] +
                gridU[(x + 1) * rdGridSize + y] +
                gridU[x * rdGridSize + (y - 1)] +
                gridU[x * rdGridSize + (y + 1)] -
                4 * u;

              const lapV =
                gridV[(x - 1) * rdGridSize + y] +
                gridV[(x + 1) * rdGridSize + y] +
                gridV[x * rdGridSize + (y - 1)] +
                gridV[x * rdGridSize + (y + 1)] -
                4 * v;

              const uvv = u * v * v;
              nextU[idx] = Math.max(0, Math.min(1, u + (1.0 * lapU - uvv + F * (1 - u)) * 0.8 * speed));
              nextV[idx] = Math.max(0, Math.min(1, v + (0.5 * lapV + uvv - (F + k) * v) * 0.8 * speed));
            }
          }
          gridU = nextU;
          gridV = nextV;

          // Render reaction diffusion grid
          for (let x = 0; x < rdGridSize; x++) {
            for (let y = 0; y < rdGridSize; y++) {
              const val = gridV[x * rdGridSize + y];
              if (val > 0.1) {
                ctx.fillStyle = val > 0.4 ? primary : secondary;
                ctx.fillRect(x * cellW, y * cellH, cellW - 0.5, cellH - 0.5);
              }
            }
          }
        }

        // ================= ALGORITHM 04: ORGANIC FLUID VORONOI MESH =================
        else if (selectedAlgoId === 'voronoi') {
          // Animate base Voronoi seed points with subtle sinusoidal swaying
          const baseSeeds = particles.slice(0, 12).map((p, idx) => {
            const bx = p.x;
            const by = p.y;
            const sx = bx + Math.sin(globalTime * 0.9 + idx * 1.2) * 27;
            const sy = by + Math.cos(globalTime * 0.8 + idx * 1.5) * 24;
            return { x: sx, y: sy };
          });

          const userPoints = voronoiClickPointsRef.current;
          const allSeeds = [...baseSeeds, ...userPoints];

          // Update and apply elastic shockwaves
          const activeShockwaves = shockwavesRef.current;
          for (let swIdx = activeShockwaves.length - 1; swIdx >= 0; swIdx--) {
            const sw = activeShockwaves[swIdx];
            sw.radius += 8 * speed;
            if (sw.radius > sw.maxRadius) {
              activeShockwaves.splice(swIdx, 1);
            }
          }

          // Displace seed points via active shockwaves
          allSeeds.forEach((sd) => {
            activeShockwaves.forEach((sw) => {
              const dx = sd.x - sw.x;
              const dy = sd.y - sw.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const diff = Math.abs(dist - sw.radius);
              if (diff < 70 && dist > 1) {
                const force = Math.sin((1 - diff / 70) * Math.PI) * sw.force * (1 - sw.radius / sw.maxRadius);
                sd.x += (dx / dist) * force;
                sd.y += (dy / dist) * force;
              }
            });
          });

          // Apply organic noise warp to seed positions once per frame (12 calls instead of 25,000)
          const noisySeeds = allSeeds.map((sd, i) => ({
            x: sd.x + noise2D(sd.x * 0.01 + globalTime * 0.2, i) * 3,
            y: sd.y + noise2D(sd.y * 0.01 + globalTime * 0.2, i + 3) * 3,
            idx: i,
          }));

          // Fast offscreen ImageData buffer rendering for 60 FPS performance
          const renderStep = isMobile ? 4 : 3;
          const bufW = Math.max(1, Math.ceil(width / renderStep));
          const bufH = Math.max(1, Math.ceil(height / renderStep));

          const offCanvas = document.createElement('canvas');
          offCanvas.width = bufW;
          offCanvas.height = bufH;
          const offCtx = offCanvas.getContext('2d');

          if (offCtx) {
            const imgData = offCtx.createImageData(bufW, bufH);
            const data = imgData.data;
            const borderThreshold = 2.4;

            for (let py = 0; py < bufH; py++) {
              const y = py * renderStep;
              for (let px = 0; px < bufW; px++) {
                const x = px * renderStep;

                let minDistSq1 = Infinity;
                let minDistSq2 = Infinity;
                let nearestIdx = 0;

                for (let i = 0; i < noisySeeds.length; i++) {
                  const dx = x - noisySeeds[i].x;
                  const dy = y - noisySeeds[i].y;
                  const dSq = dx * dx + dy * dy;
                  if (dSq < minDistSq1) {
                    minDistSq2 = minDistSq1;
                    minDistSq1 = dSq;
                    nearestIdx = noisySeeds[i].idx;
                  } else if (dSq < minDistSq2) {
                    minDistSq2 = dSq;
                  }
                }

                const dist1 = Math.sqrt(minDistSq1);
                const dist2 = Math.sqrt(minDistSq2);
                const diff = dist2 - dist1;

                const pixelIdx = (py * bufW + px) * 4;

                if (diff < borderThreshold) {
                  // Crisp dark zinc border stroke (#18181b)
                  data[pixelIdx] = 24;
                  data[pixelIdx + 1] = 24;
                  data[pixelIdx + 2] = 27;
                  data[pixelIdx + 3] = 255;
                } else {
                  // Liquid gradient cell interior
                  const c1 = liquidColorsRGB[nearestIdx % liquidColorsRGB.length];
                  const c2 = liquidColorsRGB[(nearestIdx + 1) % liquidColorsRGB.length];

                  const blendRatio = (Math.sin(dist1 * 0.03 - globalTime * 2 + nearestIdx) + 1) * 0.5;
                  data[pixelIdx] = Math.round(c1.r + (c2.r - c1.r) * blendRatio);
                  data[pixelIdx + 1] = Math.round(c1.g + (c2.g - c1.g) * blendRatio);
                  data[pixelIdx + 2] = Math.round(c1.b + (c2.b - c1.b) * blendRatio);
                  data[pixelIdx + 3] = 255;
                }
              }
            }

            offCtx.putImageData(imgData, 0, 0);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(offCanvas, 0, 0, width, height);
          }

          // CAD Geometric Anchors for each Voronoi cell center
          allSeeds.forEach((sd) => {
            // Sharp 1px crosshair (+) CAD target anchor
            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sd.x - 7, sd.y);
            ctx.lineTo(sd.x + 7, sd.y);
            ctx.moveTo(sd.x, sd.y - 7);
            ctx.lineTo(sd.x, sd.y + 7);
            ctx.stroke();

            // Small CAD target box outline
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.strokeRect(sd.x - 4, sd.y - 4, 8, 8);

            // Center vector dot
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(sd.x, sd.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          });

          // Render shockwave ripple rings
          activeShockwaves.forEach((sw) => {
            const alpha = Math.max(0, (1 - sw.radius / sw.maxRadius) * 0.7);
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.stroke();
          });
        }

        // ================= ALGORITHM 05: DELAUNAY TRIANGULATION =================
        else if (selectedAlgoId === 'delaunay') {
          // Move particles
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx * speed;
            p.y += p.vy * speed;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            if (mActive) {
              const dx = mx - p.x;
              const dy = my - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 100) {
                p.x -= (dx / dist) * 2 * speed;
                p.y -= (dy / dist) * 2 * speed;
              }
            }
          }

          // Connect nearby particles to form triangulation mesh
          ctx.lineWidth = 1;
          const connectDist = 80;
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const p1 = particles[i];
              const p2 = particles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < connectDist) {
                const alpha = Math.floor((1 - dist / connectDist) * 255).toString(16).padStart(2, '0');
                ctx.strokeStyle = primary + alpha;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                // Fill dynamic triangles
                for (let k = j + 1; k < Math.min(j + 5, particles.length); k++) {
                  const p3 = particles[k];
                  const d3 = Math.sqrt((p2.x - p3.x) ** 2 + (p2.y - p3.y) ** 2);
                  if (d3 < connectDist) {
                    ctx.fillStyle = secondary + '15';
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.closePath();
                    ctx.fill();
                  }
                }
              }
            }
          }
        }

        // ================= ALGORITHM 06: ISOMETRIC GRID ARCHITECTURE =================
        else if (selectedAlgoId === 'isometric_grid') {
          const gridCols = 8;
          const gridRows = 6;
          const tileW = width / 10;
          const tileH = tileW * 0.5;
          const originX = width / 2;
          const originY = height / 4;

          for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
              const isoX = originX + (c - r) * (tileW / 2);
              const isoY = originY + (c + r) * (tileH / 2);

              // Dynamic block height
              const distToMouse = mActive ? Math.sqrt((isoX - mx) ** 2 + (isoY - my) ** 2) : 200;
              const baseH = 20 + Math.sin(c * 0.8 + r * 0.8 + globalTime * 2) * 15;
              const blockH = Math.max(10, baseH + (distToMouse < 150 ? (1 - distToMouse / 150) * 40 : 0));

              // Draw Top Face
              ctx.fillStyle = primary;
              ctx.beginPath();
              ctx.moveTo(isoX, isoY - blockH);
              ctx.lineTo(isoX + tileW / 2, isoY + tileH / 2 - blockH);
              ctx.lineTo(isoX, isoY + tileH - blockH);
              ctx.lineTo(isoX - tileW / 2, isoY + tileH / 2 - blockH);
              ctx.closePath();
              ctx.fill();

              // Draw Left Face
              ctx.fillStyle = secondary;
              ctx.beginPath();
              ctx.moveTo(isoX - tileW / 2, isoY + tileH / 2 - blockH);
              ctx.lineTo(isoX, isoY + tileH - blockH);
              ctx.lineTo(isoX, isoY + tileH);
              ctx.lineTo(isoX - tileW / 2, isoY + tileH / 2);
              ctx.closePath();
              ctx.fill();

              // Draw Right Face
              ctx.fillStyle = accent;
              ctx.beginPath();
              ctx.moveTo(isoX, isoY + tileH - blockH);
              ctx.lineTo(isoX + tileW / 2, isoY + tileH / 2 - blockH);
              ctx.lineTo(isoX + tileW / 2, isoY + tileH / 2);
              ctx.lineTo(isoX, isoY + tileH);
              ctx.closePath();
              ctx.fill();

              // Swiss precision stroke outline
              ctx.strokeStyle = '#00000066';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // ================= ALGORITHM 07: GEOMETRIC LINE ART =================
        else if (selectedAlgoId === 'geometric_lines') {
          const cx = width / 2;
          const cy = height / 2;
          const linesCount = 24;

          ctx.lineWidth = 1.5;
          for (let i = 0; i < linesCount; i++) {
            const angle = (i / linesCount) * Math.PI * 2 + globalTime * 0.2;
            const r1 = 40 + Math.sin(globalTime + i) * 20;
            const r2 = 180 + Math.cos(globalTime * 0.5 + i) * 40;

            const x1 = cx + Math.cos(angle) * r1;
            const y1 = cy + Math.sin(angle) * r1;
            let x2 = cx + Math.cos(angle) * r2;
            let y2 = cy + Math.sin(angle) * r2;

            if (mActive) {
              const dx = mx - x2;
              const dy = my - y2;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                x2 += (dx / dist) * 30;
                y2 += (dy / dist) * 30;
              }
            }

            ctx.strokeStyle = i % 2 === 0 ? primary : secondary;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Tangent circles
            ctx.strokeStyle = accent + '66';
            ctx.beginPath();
            ctx.arc(x2, y2, 12, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // ================= ALGORITHM 08: CYBER MATRIX RAIN =================
        else if (selectedAlgoId === 'cyber_matrix') {
          ctx.font = '12px JetBrains Mono, monospace';

          matrixCols.forEach((col) => {
            col.y += col.speed * speed;
            if (col.y > height + 200) {
              col.y = -100;
            }

            col.chars.forEach((char, i) => {
              const charY = col.y - i * 14;
              if (charY > 0 && charY < height) {
                ctx.fillStyle = i === 0 ? '#FFFFFF' : i < 3 ? secondary : primary;
                ctx.fillText(char, col.x, charY);
              }
            });
          });
        }

        // ================= ALGORITHM 09: BAUHAUS COMPOSITION =================
        else if (selectedAlgoId === 'bauhaus_composition') {
          const tRot = globalTime * 0.3;

          // Main Bauhaus Circle
          ctx.fillStyle = primary;
          ctx.beginPath();
          ctx.arc(width * 0.35 + Math.sin(tRot) * 20, height * 0.4, 90, 0, Math.PI * 2);
          ctx.fill();

          // Slicing Semi-circle
          ctx.fillStyle = secondary;
          ctx.beginPath();
          ctx.arc(width * 0.6, height * 0.5, 110, tRot, tRot + Math.PI);
          ctx.fill();

          // Heavy Rectangles
          ctx.fillStyle = accent;
          ctx.fillRect(width * 0.2, height * 0.65, 180, 40);

          // Diagonal accent lines
          ctx.strokeStyle = primary;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(width * 0.1, height * 0.2);
          ctx.lineTo(width * 0.8, height * 0.8);
          ctx.stroke();

          // Interactive cursor line
          if (mActive) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mx, 0);
            ctx.lineTo(mx, height);
            ctx.moveTo(0, my);
            ctx.lineTo(width, my);
            ctx.stroke();
          }
        }

        // ================= ALGORITHM 10: CELLULAR AUTOMATA =================
        else if (selectedAlgoId === 'cellular_automata' && caGridRef.current) {
          const grid = caGridRef.current;
          const cols = grid.length;
          const rows = grid[0].length;
          const cellW = width / cols;
          const cellH = height / rows;

          // Compute Conway Game of Life evolution
          const nextGrid: number[][] = [];
          for (let c = 0; c < cols; c++) {
            nextGrid[c] = [];
            for (let r = 0; r < rows; r++) {
              let neighbors = 0;
              for (let dc = -1; dc <= 1; dc++) {
                for (let dr = -1; dr <= 1; dr++) {
                  if (dc === 0 && dr === 0) continue;
                  const nc = (c + dc + cols) % cols;
                  const nr = (r + dr + rows) % rows;
                  neighbors += grid[nc][nr] ? 1 : 0;
                }
              }

              const state = grid[c][r];
              if (state === 1 && (neighbors === 2 || neighbors === 3)) {
                nextGrid[c][r] = 1;
              } else if (state === 0 && neighbors === 3) {
                nextGrid[c][r] = 1;
              } else {
                nextGrid[c][r] = 0;
              }
            }
          }
          caGridRef.current = nextGrid;

          // Draw CA grid
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              if (nextGrid[c][r] === 1) {
                ctx.fillStyle = (c + r) % 2 === 0 ? primary : secondary;
                ctx.fillRect(c * cellW, r * cellH, cellW - 1, cellH - 1);
              }
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
  }, [
    density,
    speed,
    seedHash,
    selectedCategory,
    selectedAlgoId,
    activePalette,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      mousePosRef.current = { x, y };
      setMousePos({ x, y });
    }
  };

  return (
    <section id="playground" className="relative bg-[#0B0B0F] border-t border-b border-zinc-800 pt-28 pb-16 lg:pt-36 lg:pb-24 scroll-mt-20 font-mono">
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

        {/* Dual-Panel / 3-Column Viewport Architecture */}
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
                <span className="text-[10px] text-zinc-600">v2.1.0</span>
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
                      className={`py-1.5 px-1 text-[9px] font-bold uppercase transition-all truncate ${
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
                          {t(pal.nameKey as keyof Translations)}
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
            onMouseEnter={() => {
              isMouseOverRef.current = true;
            }}
            onMouseLeave={() => {
              isMouseOverRef.current = false;
            }}
            className="relative bg-[#07070A] border-b lg:border-b-0 lg:border-r border-zinc-800 min-h-[400px] flex items-center justify-center overflow-hidden group select-none"
          >
            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-950/80 border border-zinc-800 px-2.5 py-1">
              <Box className="h-3 w-3 text-cyan-glow" />
              <span>{t('sandbox_canvas_interactive')}</span>
            </div>

            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 font-mono text-[10px] text-zinc-500 bg-zinc-950/80 border border-zinc-800 px-2 py-0.5">
              <MousePointer className="h-3 w-3 text-[#5322ff]" />
              <span>
                POS [X: {mousePos.x}, Y: {mousePos.y}]
              </span>
            </div>

            {/* Crosshair Corner Accents */}
            <div className="absolute top-2 left-2 pointer-events-none text-zinc-700 text-xs">+</div>
            <div className="absolute top-2 right-2 pointer-events-none text-zinc-700 text-xs">+</div>
            <div className="absolute bottom-2 left-2 pointer-events-none text-zinc-700 text-xs">+</div>
            <div className="absolute bottom-2 right-2 pointer-events-none text-zinc-700 text-xs">+</div>

            {/* Interactive HTML5 2D Canvas */}
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="block w-full h-full cursor-crosshair"
            />

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
              <div>&gt; ALGO_SUITE_ACTIVE</div>
              <div>&gt; FORCE_FIELD_MOUSE_ON</div>
              <div>&gt; SEED_MUTATED ({seedHash})</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
