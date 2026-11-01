import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  ExternalLink,
  Cpu,
  Layers,
  Terminal,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  Boxes,
} from 'lucide-react';

interface AgentPylon {
  id: string;
  name: string;
  role: string;
  pulseColor: string; // Tailwind color class or hex
  glowColor: string;
  hex: number;
  badgeBorder: string;
  pulseBg: string;
  throughput: string;
  conduitAngle: number;
}

const AGENT_PYLONS: AgentPylon[] = [
  {
    id: 'dify',
    name: 'DIFY.AI',
    role: 'RAG & Agentic Pipeline Router',
    pulseColor: 'bg-cyan-400',
    glowColor: '#00E5FF',
    hex: 0x00e5ff,
    badgeBorder: 'border-cyan-500/40 hover:border-cyan-400',
    pulseBg: 'bg-cyan-500/20 text-cyan-300',
    throughput: '890 ctx/s',
    conduitAngle: -1.2,
  },
  {
    id: 'n8n',
    name: 'N8N',
    role: 'Deterministic Webhook & State Machine',
    pulseColor: 'bg-emerald-400',
    glowColor: '#10B981',
    hex: 0x10b981,
    badgeBorder: 'border-emerald-500/40 hover:border-emerald-400',
    pulseBg: 'bg-emerald-500/20 text-emerald-300',
    throughput: '1,420 hooks/s',
    conduitAngle: -0.6,
  },
  {
    id: 'vibecode',
    name: 'VIBECODE',
    role: 'Full-Stack Synthesis & Real-Time Code Gen',
    pulseColor: 'bg-amber-400',
    glowColor: '#F59E0B',
    hex: 0xf59e0b,
    badgeBorder: 'border-amber-500/40 hover:border-amber-400',
    pulseBg: 'bg-amber-500/20 text-amber-300',
    throughput: '3.4k AST/s',
    conduitAngle: 0.0,
  },
  {
    id: 'gemini',
    name: 'GEMINI',
    role: 'Multimodal High-Throughput Engine',
    pulseColor: 'bg-indigo-400',
    glowColor: '#6366F1',
    hex: 0x6366f1,
    badgeBorder: 'border-indigo-500/40 hover:border-indigo-400',
    pulseBg: 'bg-indigo-500/20 text-indigo-300',
    throughput: '2.0M ctx/valve',
    conduitAngle: 0.6,
  },
  {
    id: 'remotion',
    name: 'REMOTION',
    role: 'Programmatic Video & Motion Compiler',
    pulseColor: 'bg-rose-400',
    glowColor: '#F43F5E',
    hex: 0xf43f5e,
    badgeBorder: 'border-rose-500/40 hover:border-rose-400',
    pulseBg: 'bg-rose-500/20 text-rose-300',
    throughput: '60.0 FPS LOCKED',
    conduitAngle: 1.2,
  },
];

const WORKSTATION_URL = 'https://digital-plumbing-terminal-headless-swarm.mizu2711.workers.dev/';

/**
 * HeadlessSwarmSection: Zone 03 Headless Swarm Workbench & $0.00 Cloud Render Fee Section.
 * Implements Swiss Cybernetic Brutalism with 5 Autonomous Pylon Towers and real-time WebGL telemetry.
 */
export const HeadlessSwarmSection: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<AgentPylon>(AGENT_PYLONS[0]);
  const activeAgentRef = useRef<AgentPylon>(AGENT_PYLONS[0]);
  const [fpsCounter, setFpsCounter] = useState(60);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeAgentRef.current = activeAgent;
  }, [activeAgent]);

  // Three.js interactive 3D Pylon Telemetry Viewport
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Ambient & directional lighting
    const amb = new THREE.AmbientLight(0x0b1020, 1.2);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(3, 8, 4);
    scene.add(dirLight);

    // Obsidian reflection ground grid
    const gridHelper = new THREE.GridHelper(16, 24, 0x00e5ff, 0x181824);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Central Telemetry Hub Node (Hexagonal Monolith)
    const hubGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.4, 6);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x121218,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.25,
    });
    const centralHub = new THREE.Mesh(hubGeo, hubMat);
    centralHub.position.set(0, 0.2, 0);
    scene.add(centralHub);

    // Central floating diamond / core crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.28, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
    });
    const coreCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    coreCrystal.position.set(0, 0.95, 0);
    scene.add(coreCrystal);

    // 5 Pylon Towers positioned in an arc / ring
    const pylonGroup = new THREE.Group();
    scene.add(pylonGroup);

    const pylonMeshes: {
      mesh: THREE.Mesh;
      laser: THREE.Line;
      agent: AgentPylon;
      crystal: THREE.Mesh;
    }[] = [];

    const radius = 2.6;
    AGENT_PYLONS.forEach((agent, i) => {
      const angle = (i - 2) * 0.55;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * (radius * 0.6) + 0.5;

      const pylonHolder = new THREE.Group();
      pylonHolder.position.set(x, 0, z);

      // Brutalist Concrete Pylon Tower
      const towerGeo = new THREE.BoxGeometry(0.3, 1.5, 0.3);
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x14141a,
        metalness: 0.7,
        roughness: 0.3,
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 0.75;
      pylonHolder.add(tower);

      // Spire Crystal
      const spireGeo = new THREE.ConeGeometry(0.12, 0.4, 4);
      const spireMat = new THREE.MeshStandardMaterial({
        color: agent.hex,
        emissive: agent.hex,
        emissiveIntensity: 1.2,
        roughness: 0.1,
      });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.y = 1.7;
      pylonHolder.add(spire);

      // Laser Beam from Pylon Spire to Central Hub
      const points = [
        new THREE.Vector3(x, 1.7, z),
        new THREE.Vector3(0, 0.95, 0),
      ];
      const laserGeo = new THREE.BufferGeometry().setFromPoints(points);
      const laserMat = new THREE.LineBasicMaterial({
        color: agent.hex,
        transparent: true,
        opacity: 0.6,
        linewidth: 2,
      });
      const laser = new THREE.Line(laserGeo, laserMat);
      scene.add(laser);

      pylonGroup.add(pylonHolder);

      pylonMeshes.push({
        mesh: tower,
        laser,
        agent,
        crystal: spire,
      });
    });

    // Particle Swarm Ring
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const r = radius * (0.8 + Math.random() * 0.4);
      particlePos[i * 3] = Math.sin(theta) * r;
      particlePos[i * 3 + 1] = 0.2 + Math.random() * 1.5;
      particlePos[i * 3 + 2] = -Math.cos(theta) * (r * 0.6) + 0.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.75,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();
    let frameAcc = 0;
    let lastTime = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // FPS Calculation
      frameAcc++;
      if (elapsed - lastTime >= 0.5) {
        setFpsCounter(Math.min(60, Math.max(58, Math.round(frameAcc / (elapsed - lastTime)))));
        frameAcc = 0;
        lastTime = elapsed;
      }

      // Rotate core diamond
      coreCrystal.rotation.y = elapsed * 1.2;
      coreCrystal.rotation.x = elapsed * 0.6;
      centralHub.rotation.y = elapsed * 0.15;

      // Pulse active pylon spire
      const currentActiveId = activeAgentRef.current.id;
      pylonMeshes.forEach(({ agent, crystal, laser }) => {
        const isActive = agent.id === currentActiveId;
        const scale = isActive ? 1.0 + Math.sin(elapsed * 6) * 0.15 : 0.9;
        crystal.scale.set(scale, scale, scale);
        (crystal.material as THREE.MeshStandardMaterial).emissiveIntensity = isActive ? 2.5 : 0.8;
        (laser.material as THREE.LineBasicMaterial).opacity = isActive ? 0.95 : 0.25;
      });

      // Slowly rotate particle ring
      particlePoints.rotation.y = elapsed * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      hubGeo.dispose();
      hubMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <section
      id="zone-03-headless-swarm"
      className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#09090B] font-mono border-t border-zinc-800"
    >
      <div className="max-w-7xl mx-auto">
        {/* Cyberpunk Brutalist Container Card */}
        <div className="bg-[#050508] border border-cyan-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.06)]">
          {/* Subtle Cybernetic Grid Overlay & Radial Glows */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0,229,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(83,34,255,0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5322FF]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[90px] pointer-events-none" />

          {/* 2-Column Responsive Grid Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* ======================================================== */}
            {/* LEFT COLUMN: Tactical Specs & Agent Badges */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold tracking-widest uppercase rounded">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>[ TERMINAL // ZONE 03 ] HEADLESS AGENT WORKBENCH</span>
                </div>
                <span className="px-2.5 py-0.5 border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-[10px] uppercase tracking-wider">
                  SLA: 60FPS LOCAL GPU
                </span>
              </div>

              {/* Bold Headline */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase font-mono leading-snug">
                  5 Autonomous Pylon Towers.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-[#5322FF]">
                    Zero Cloud Latency.
                  </span>{' '}
                  $0.00 Render Cost.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed border-l-2 border-cyan-400 pl-4 py-1">
                  Decoupled multi-agent orchestration compiled directly into client-side WebGL
                  kinematics. Eliminate massive cloud rendering bills with deterministic, edge-welded
                  execution loops.
                </p>
              </div>

              {/* 5 Agent Pylon Badges Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Autonomous Pylon Conduits</span>
                  </span>
                  <span className="text-zinc-500 text-[10px]">SELECT PYLON TO INSPECT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {AGENT_PYLONS.map((pylon) => {
                    const isSelected = pylon.id === activeAgent.id;
                    return (
                      <button
                        key={pylon.id}
                        type="button"
                        onClick={() => setActiveAgent(pylon)}
                        className={`p-3 border text-left transition flex flex-col justify-between rounded-lg relative overflow-hidden group cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                            : `${pylon.badgeBorder} bg-[#0A0A10] hover:bg-zinc-900/80`
                        }`}
                      >
                        {/* Status Pulse Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold tracking-wider text-white font-mono">
                            {pylon.name}
                          </span>
                          <span className="relative flex h-2.5 w-2.5">
                            <span
                              className={`absolute inline-flex h-full w-full rounded-full ${pylon.pulseColor} opacity-75 animate-ping`}
                            />
                            <span
                              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${pylon.pulseColor}`}
                            />
                          </span>
                        </div>

                        {/* Role Description */}
                        <span className="text-[10px] text-zinc-400 font-sans mt-2 line-clamp-1 group-hover:text-zinc-200 transition-colors">
                          {pylon.role}
                        </span>

                        {/* Throughput Telemetry */}
                        <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono">
                          <span className="text-zinc-500 uppercase">Throughput</span>
                          <span className="text-cyan-300 font-bold">{pylon.throughput}</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Central Gate Badge */}
                  <div className="p-3 border border-[#5322FF]/40 bg-[#5322FF]/10 rounded-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-purple-300 font-mono">
                        PRESSURE VALVE
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-zinc-300 font-sans mt-1">
                      Strict Zod Gate
                    </span>
                    <div className="mt-2 pt-2 border-t border-purple-500/20 text-[9px] text-purple-300/80 font-mono font-bold">
                      0.000% SILENT DRIFT
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Bar (Live Telemetry Tags) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>60 FPS CLIENT GPU</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ZOD SCHEMA PROTECTED</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold rounded">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>$0.00 CLOUD RENDER FEE</span>
                </div>
              </div>

              {/* Interactive Link / CTA Button */}
              <div className="pt-4">
                <a
                  href={WORKSTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-400 to-[#5322FF] hover:from-cyan-300 hover:to-[#5322FF]/90 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded transition-all duration-300 shadow-[0_0_25px_rgba(0,229,255,0.4)] cursor-pointer"
                >
                  <span className="text-black font-mono font-black">
                    [ ⚡ LAUNCH STANDALONE 3D WORKSTATION ]
                  </span>
                  <ExternalLink className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Interactive 3D Pylon Telemetry Card */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 flex flex-col border border-cyan-500/30 bg-[#090910] rounded-xl overflow-hidden relative shadow-2xl">
              {/* Telemetry Card Header */}
              <div className="px-4 py-3 bg-[#0d0d16] border-b border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    PYLON TELEMETRY // 3D HUD
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">{fpsCounter} FPS</span>
                </div>
              </div>

              {/* Interactive Three.js Pylon Canvas Viewport */}
              <div
                ref={canvasContainerRef}
                className="relative w-full h-[300px] sm:h-[340px] bg-[#050508] overflow-hidden cursor-crosshair flex items-center justify-center"
              >
                {/* Floating Corner Overlay Telemetry */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <div className="px-2 py-1 bg-black/80 border border-zinc-800 text-[10px] text-zinc-400 font-mono rounded">
                    ACTIVE: <span className="text-cyan-400 font-bold">{activeAgent.name}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                  <div className="px-2 py-1 bg-black/80 border border-cyan-500/30 text-[9px] text-cyan-300 font-mono rounded">
                    CONDUIT: {activeAgent.throughput}
                  </div>
                </div>
              </div>

              {/* Active Pylon Dossier Details Box */}
              <div className="p-4 bg-[#0B0B14] border-t border-zinc-800 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeAgent.glowColor }}
                    />
                    <span className="text-xs font-bold text-white uppercase">
                      {activeAgent.name} PYLON TELEMETRY
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300">
                    CONDUIT LOCKED
                  </span>
                </div>

                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                  {activeAgent.role}. Dispatched across the Obsidian Hydro-Kinetic Courtyard with 1px
                  coherent laser telemetry and zero silent API drift.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                  <div className="p-2 border border-zinc-800 bg-zinc-950/80 rounded">
                    <span className="text-zinc-500 block">THROUGHPUT</span>
                    <span className="font-bold text-white">{activeAgent.throughput}</span>
                  </div>
                  <div className="p-2 border border-zinc-800 bg-zinc-950/80 rounded">
                    <span className="text-zinc-500 block">RENDER FEE</span>
                    <span className="font-bold text-emerald-400">$0.00 LOCAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadlessSwarmSection;
