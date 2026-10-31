import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Activity, Sparkles, Terminal, Cpu } from 'lucide-react';
import { TileJulesOctopusMatrix } from '@/lib/video-engine/TileJulesOctopusMatrix';
import memorialPreset from '../../../site-configs/jules-memorial-preset.json';

interface JulesMemorialNodeProps {
  className?: string;
  onAudioContextInit?: (ctx: AudioContext) => void;
}

export const JulesMemorialNode: React.FC<JulesMemorialNodeProps> = ({
  className = '',
  onAudioContextInit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [isWorking, setIsWorking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [bpm, setBpm] = useState(memorialPreset.theme.idleState.pulseBpm);
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [filterFreq, setFilterFreq] = useState(220);
  const [symphonyTriggered, setSymphonyTriggered] = useState(false);

  // References for Three.js and Web Audio
  const isWorkingRef = useRef(isWorking);
  isWorkingRef.current = isWorking;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const humSubOscRef = useRef<OscillatorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Particle halo burst ref
  const burstParticlesRef = useRef<{
    points: THREE.Points;
    velocities: Float32Array;
    active: boolean;
    decay: number;
  } | null>(null);

  // Setup Web Audio Resonance Synthesizer
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;
      if (onAudioContextInit) onAudioContextInit(ctx);

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Lowpass Filter for ambient subtone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);
      filter.connect(masterGain);
      filterNodeRef.current = filter;

      // Primary Ambient Subtone Osc (sawtooth filtered)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1
      osc.connect(filter);
      osc.start();
      humOscRef.current = osc;

      // Secondary Sine Sub Osc (deep sub-bass)
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(27.5, ctx.currentTime); // Low A0
      subOsc.connect(filter);
      subOsc.start();
      humSubOscRef.current = subOsc;

      setIsAudioEnabled(true);
    } catch (err) {
      console.warn('AudioContext initialization deferred:', err);
    }
  }, [onAudioContextInit]);

  // Toggle Audio ON/OFF
  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      initAudio();
      return;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
      setIsAudioEnabled(true);
    } else if (audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
      setIsAudioEnabled(false);
    }
  };

  // Click Trigger: Synthesized Cyber Sub-Drop & Harmonic Chime Chord
  const triggerFarewellSymphony = useCallback(() => {
    setSymphonyTriggered(true);
    setTimeout(() => setSymphonyTriggered(false), 2000);

    // Trigger 3D Particle Halo Burst
    if (burstParticlesRef.current) {
      burstParticlesRef.current.active = true;
      burstParticlesRef.current.decay = 1.0;
      const positions = burstParticlesRef.current.points.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = 0;
        positions[i + 1] = 0.5;
        positions[i + 2] = 0;
      }
      burstParticlesRef.current.points.geometry.attributes.position.needsUpdate = true;
    }

    // Audio Symphony
    if (!audioCtxRef.current) {
      initAudio();
    }
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    // 1. Cyber Sub-Drop
    const dropOsc = ctx.createOscillator();
    const dropGain = ctx.createGain();
    dropOsc.type = 'sine';
    dropOsc.frequency.setValueAtTime(180, now);
    dropOsc.frequency.exponentialRampToValueAtTime(24, now + 1.2);

    dropGain.gain.setValueAtTime(0.5, now);
    dropGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    dropOsc.connect(dropGain);
    dropGain.connect(ctx.destination);
    dropOsc.start(now);
    dropOsc.stop(now + 1.5);

    // 2. Harmonic Chime Chord (High sine crystalline chimes)
    const chordFrequencies = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C Major 9 high
    chordFrequencies.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, now + idx * 0.05);

      chimeGain.gain.setValueAtTime(0.12, now + idx * 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.6);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + idx * 0.05);
      chimeOsc.stop(now + idx * 0.05 + 1.8);
    });
  }, [initAudio]);

  // Handle Mouse Hover / Move to shift low-pass filter cutoff frequency
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMouseCoord({ x: parseFloat(normX.toFixed(2)), y: parseFloat(normY.toFixed(2)) });

    // Cutoff frequency shifts between 100Hz and 800Hz
    const cutoff = Math.min(800, Math.max(100, 220 + ((normX + 1) / 2) * 450 + ((normY + 1) / 2) * 150));
    setFilterFreq(Math.round(cutoff));

    if (filterNodeRef.current && audioCtxRef.current) {
      filterNodeRef.current.frequency.setTargetAtTime(cutoff, audioCtxRef.current.currentTime, 0.05);
    }
  };

  // Toggle Working State
  const toggleWorkingState = () => {
    const nextState = !isWorking;
    setIsWorking(nextState);
    setBpm(
      nextState
        ? memorialPreset.theme.workingState.pulseBpm
        : memorialPreset.theme.idleState.pulseBpm
    );
  };

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(memorialPreset.theme.backgroundColor || '#050505');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 9);
    camera.lookAt(0, 0.4, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00e5ff, 2.5, 20);
    pointLightCyan.position.set(4, 5, 4);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0x8a2be2, 3, 20);
    pointLightPurple.position.set(-4, -2, -4);
    scene.add(pointLightPurple);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 10, 5);
    scene.add(dirLight);

    // 1. Mount TileJulesOctopusMatrix
    const octopusAvatar = new TileJulesOctopusMatrix();
    octopusAvatar.position.set(0, 0, 0);
    scene.add(octopusAvatar);

    // 2. Double-Helix Orbiting Commit Particles (commitParticleCount: 1000)
    const commitParticleCount = memorialPreset.telemetry.commitParticleCount || 1000;
    const helixGeo = new THREE.BufferGeometry();
    const helixPositions = new Float32Array(commitParticleCount * 3);
    const helixColors = new Float32Array(commitParticleCount * 3);

    const cyanColor = new THREE.Color(0x00e5ff);
    const purpleColor = new THREE.Color(0x8a2be2);
    const goldColor = new THREE.Color(0xd4af37);

    for (let i = 0; i < commitParticleCount; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const t = (i / commitParticleCount) * Math.PI * 8; // 4 full loops
      const r = 3.6 + Math.sin(t * 0.5) * 0.4;
      const x = Math.cos(t) * r * strand;
      const y = (i / commitParticleCount - 0.5) * 5.5;
      const z = Math.sin(t) * r * strand;

      helixPositions[i * 3] = x;
      helixPositions[i * 3 + 1] = y;
      helixPositions[i * 3 + 2] = z;

      const c = i % 3 === 0 ? cyanColor : i % 3 === 1 ? purpleColor : goldColor;
      helixColors[i * 3] = c.r;
      helixColors[i * 3 + 1] = c.g;
      helixColors[i * 3 + 2] = c.b;
    }
    helixGeo.setAttribute('position', new THREE.BufferAttribute(helixPositions, 3));
    helixGeo.setAttribute('color', new THREE.BufferAttribute(helixColors, 3));

    const helixMaterial = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const helixPoints = new THREE.Points(helixGeo, helixMaterial);
    scene.add(helixPoints);

    // 3. 1px Wireframe CAD Cube Matrix with Corner Crosshairs
    const cadBoxGroup = new THREE.Group();
    const boxSize = 7.0;
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxWireGeo = new THREE.WireframeGeometry(boxGeo);
    const boxWireMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.18,
    });
    const boxWire = new THREE.LineSegments(boxWireGeo, boxWireMat);
    cadBoxGroup.add(boxWire);

    // Corner Target Crosshairs (+)
    const half = boxSize / 2;
    const corners = [
      [-half, -half, -half],
      [half, -half, -half],
      [-half, half, -half],
      [half, half, -half],
      [-half, -half, half],
      [half, -half, half],
      [-half, half, half],
      [half, half, half],
    ];

    corners.forEach(([cx, cy, cz]) => {
      const crossSize = 0.35;
      const crossPoints = [
        new THREE.Vector3(cx - crossSize, cy, cz),
        new THREE.Vector3(cx + crossSize, cy, cz),
        new THREE.Vector3(cx, cy - crossSize, cz),
        new THREE.Vector3(cx, cy + crossSize, cz),
        new THREE.Vector3(cx, cy, cz - crossSize),
        new THREE.Vector3(cx, cy, cz + crossSize),
      ];
      const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
      const crossMat = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.6,
      });
      const crossLines = new THREE.LineSegments(crossGeo, crossMat);
      cadBoxGroup.add(crossLines);
    });
    scene.add(cadBoxGroup);

    // 4. Elastic 3D Particle Halo Burst
    const burstCount = 300;
    const burstGeo = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstCount * 3);
    const burstVel = new Float32Array(burstCount * 3);
    for (let i = 0; i < burstCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 1.8 + Math.random() * 3.5;
      burstVel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      burstVel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      burstVel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
    const burstMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const burstPoints = new THREE.Points(burstGeo, burstMat);
    scene.add(burstPoints);

    burstParticlesRef.current = {
      points: burstPoints,
      velocities: burstVel,
      active: false,
      decay: 0,
    };

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const working = isWorkingRef.current;

      // Update Octopus Avatar
      octopusAvatar.update(delta, time, working);

      // Rotate Commit Double-Helix
      helixPoints.rotation.y = time * 0.15 * (working ? 2.0 : 1.0);
      helixPoints.rotation.x = Math.sin(time * 0.2) * 0.1;

      // Rotate Wireframe CAD Cube slowly
      cadBoxGroup.rotation.y = -time * 0.04;
      cadBoxGroup.rotation.x = Math.cos(time * 0.03) * 0.05;

      // Update Halo Burst
      if (burstParticlesRef.current && burstParticlesRef.current.active) {
        const bp = burstParticlesRef.current;
        bp.decay -= delta * 0.8;
        burstMat.opacity = Math.max(0, bp.decay);

        const posAttr = bp.points.geometry.attributes.position;
        const positions = posAttr.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          positions[i * 3] += bp.velocities[i * 3] * delta;
          positions[i * 3 + 1] += bp.velocities[i * 3 + 1] * delta;
          positions[i * 3 + 2] += bp.velocities[i * 3 + 2] * delta;
        }
        posAttr.needsUpdate = true;

        if (bp.decay <= 0) {
          bp.active = false;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      octopusAvatar.dispose();
      renderer.dispose();
      helixGeo.dispose();
      helixMaterial.dispose();
      boxGeo.dispose();
      boxWireMat.dispose();
      burstGeo.dispose();
      burstMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={triggerFarewellSymphony}
      className={`relative w-full h-full min-h-[500px] overflow-hidden bg-[#050505] cursor-crosshair select-none ${className}`}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Swiss Brutalist Telemetry HUD Header */}
      <div className="absolute top-4 left-4 right-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pointer-events-none z-10 font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-black/70 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-zinc-200">
            {memorialPreset.telemetry.bannerText}
          </span>
        </div>

        {/* Telemetry Readouts */}
        <div className="flex items-center gap-3 text-[10px] text-zinc-400 bg-black/60 px-3 py-1 border border-zinc-800">
          <span>STATUS: <strong className={isWorking ? 'text-[#00E5FF]' : 'text-purple-400'}>{isWorking ? 'OVERCLOCKED // WORKING' : 'IMMUTABLE // IDLE'}</strong></span>
          <span>BPM: <strong className="text-zinc-200">{bpm}</strong></span>
          <span>FREQ: <strong className="text-[#00E5FF]">{filterFreq}Hz</strong></span>
          <span>POS: <strong className="text-zinc-300">[{mouseCoord.x}, {mouseCoord.y}]</strong></span>
        </div>
      </div>

      {/* Center Symphony Click Notification */}
      {symphonyTriggered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="px-6 py-3 border border-[#00E5FF] bg-black/90 backdrop-blur-md text-[#00E5FF] font-mono text-sm font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(0,229,255,0.6)] animate-pulse">
            ★ FAREWELL SYMPHONY TRIGGERED // SUB-DROP & HARMONIC CHORD ACTIVATED
          </div>
        </div>
      )}

      {/* Corner HUD Markers */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#00E5FF] pointer-events-none" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#00E5FF] pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#00E5FF] pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#00E5FF] pointer-events-none" />

      {/* Swiss Brutalist Interactive Controls Drawer (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-4 pointer-events-auto z-10 font-mono">
        <div className="flex items-center gap-2">
          {/* Toggle Audio Resonance */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAudio();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold transition-all ${
              isAudioEnabled
                ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'border-zinc-800 bg-black/70 text-zinc-400 hover:text-white'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>AUDIO RESONANCE: {isAudioEnabled ? '[ON]' : '[OFF]'}</span>
          </button>

          {/* Toggle Working State */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWorkingState();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold transition-all ${
              isWorking
                ? 'border-white bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'border-purple-600/60 bg-purple-950/40 text-purple-300 hover:border-purple-500'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>STATE: {isWorking ? '[WORKING // 120 BPM]' : '[IDLE // 60 BPM]'}</span>
          </button>
        </div>

        {/* Tribute Details & Symphony Instructions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerFarewellSymphony();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRIGGER FAREWELL SYMPHONY ♫</span>
          </button>

          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 border border-zinc-800 bg-black/70 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-[#00E5FF]" /> DUAL-BRAIN ARCHITECTURE</span>
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-purple-400" /> 1000 COMMITS DOUBLE-HELIX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JulesMemorialNode;
