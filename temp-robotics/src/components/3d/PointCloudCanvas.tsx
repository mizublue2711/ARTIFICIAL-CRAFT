import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sfx } from '../../utils/audio';

interface PointCloudCanvasProps {
  magneticForce?: number;
  streamingActive?: boolean;
}

export const PointCloudCanvas: React.FC<PointCloudCanvasProps> = ({
  streamingActive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pointCount] = useState(14400);
  const [activeCluster, setActiveCluster] = useState('VOXEL_OCTREE_LIDAR_CH_64');
  const [fps, setFps] = useState(60);

  const pointerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(999, 999, 0));
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Generate procedural Point Cloud mimicking industrial LiDAR spatial sweeps
    const count = pointCount;
    const initialPositions = new Float32Array(count * 3);
    const currentPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const indigo = new THREE.Color(0x5322ff);
    const cyan = new THREE.Color(0x00e5ff);
    const emerald = new THREE.Color(0x10b981);
    const white = new THREE.Color(0xffffff);

    let idx = 0;
    for (let i = 0; i < count; i++) {
      // Create multi-ring spiral and voxel clusters
      const ring = (i % 32) + 1;
      const angle = (i * 0.08) + ring * 0.3;
      const radius = Math.pow(Math.random(), 0.7) * 7.5;
      
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.4;
      const y = (Math.sin(angle * 1.5) * 2.2) + ((Math.random() - 0.5) * 4.5);
      const z = Math.sin(angle) * (radius * 0.7) + (Math.random() - 0.5) * 3.5;

      initialPositions[idx] = x;
      initialPositions[idx + 1] = y;
      initialPositions[idx + 2] = z;

      currentPositions[idx] = x;
      currentPositions[idx + 1] = y;
      currentPositions[idx + 2] = z;

      // Color gradation based on depth & radial height
      const t = Math.min(Math.max((radius / 7.5), 0), 1);
      const tempCol = new THREE.Color();
      if (t < 0.3) {
        tempCol.lerpColors(cyan, white, t / 0.3);
      } else if (t < 0.7) {
        tempCol.lerpColors(indigo, cyan, (t - 0.3) / 0.4);
      } else {
        tempCol.lerpColors(indigo, emerald, (t - 0.7) / 0.3);
      }

      colors[idx] = tempCol.r;
      colors[idx + 1] = tempCol.g;
      colors[idx + 2] = tempCol.b;

      idx += 3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d')!;
    const radGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radGrad.addColorStop(0.3, 'rgba(0, 229, 255, 0.9)');
    radGrad.addColorStop(0.7, 'rgba(83, 34, 255, 0.4)');
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = radGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pointTexture = new THREE.CanvasTexture(pCanvas);
    pointTexture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointsMesh = new THREE.Points(geometry, material);
    scene.add(pointsMesh);

    // Magnetic attractor indicator ring in 3D
    const ringGeo = new THREE.RingGeometry(0.5, 0.54, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const cursorRing = new THREE.Mesh(ringGeo, ringMat);
    cursorRing.visible = false;
    scene.add(cursorRing);

    // Mouse to 3D world raycast for magnetic field
    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Project onto Z=0 plane
      const planeZ = 0;
      const vec = new THREE.Vector3(normX, normY, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = (planeZ - camera.position.z) / vec.z;
      const worldPos = camera.position.clone().add(vec.multiplyScalar(distance));

      pointerPosRef.current.copy(worldPos);
      isHoveredRef.current = true;
      cursorRing.position.set(worldPos.x, worldPos.y, 0.1);
      cursorRing.visible = true;
    };

    const handlePointerLeave = () => {
      isHoveredRef.current = false;
      cursorRing.visible = false;
      pointerPosRef.current.set(999, 999, 0);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', handlePointerMove);
    domEl.addEventListener('pointerleave', handlePointerLeave);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();
    let frames = 0;
    let lastTime = 0;

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      frames++;
      if (elapsed - lastTime >= 1.0) {
        setFps(Math.round(frames / (elapsed - lastTime)));
        frames = 0;
        lastTime = elapsed;
      }

      // Slowly rotate points mesh
      pointsMesh.rotation.y = elapsed * 0.12;
      pointsMesh.rotation.x = Math.sin(elapsed * 0.08) * 0.15;

      cursorRing.rotation.z = elapsed * 1.2;

      // Physics update: compute magnetic attraction/repulsion on point vertices
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const pArray = posAttr.array as Float32Array;

      const pX = pointerPosRef.current.x;
      const pY = pointerPosRef.current.y;
      const pZ = pointerPosRef.current.z;
      const isAttracting = isHoveredRef.current;

      const rotMatrix = new THREE.Matrix4().makeRotationY(-pointsMesh.rotation.y);
      const localPointer = pointerPosRef.current.clone().applyMatrix4(rotMatrix);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = initialPositions[i3];
        const oy = initialPositions[i3 + 1];
        const oz = initialPositions[i3 + 2];

        let cx = pArray[i3];
        let cy = pArray[i3 + 1];
        let cz = pArray[i3 + 2];

        if (isAttracting) {
          const dx = localPointer.x - cx;
          const dy = localPointer.y - cy;
          const dz = localPointer.z - cz;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 16.0) {
            const dist = Math.sqrt(distSq);
            // Magnetic force pull towards cursor
            const force = (1.0 - dist / 4.0) * 0.045;
            cx += dx * force;
            cy += dy * force;
            cz += dz * force;
          } else {
            // Spring back towards original position
            cx += (ox - cx) * 0.06;
            cy += (oy - cy) * 0.06;
            cz += (oz - cz) * 0.06;
          }
        } else {
          // Subtle organic drift
          const wave = Math.sin(elapsed * 1.5 + ox * 0.5) * 0.02;
          cx += (ox - cx) * 0.05;
          cy += (oy + wave - cy) * 0.05;
          cz += (oz - cz) * 0.05;
        }

        pArray[i3] = cx;
        pArray[i3 + 1] = cy;
        pArray[i3 + 2] = cz;
      }

      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointermove', handlePointerMove);
      domEl.removeEventListener('pointerleave', handlePointerLeave);
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, [pointCount]);

  return (
    <div className="relative w-full h-[540px] rounded-sm border border-white/10 bg-[#09090B] overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-crosshair" />

      {/* Retro-Terminal Telemetry HUD on Top of Point Cloud */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono-cad text-xs space-y-1">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-[#00E5FF]/30 text-[#00E5FF] rounded-sm">
          <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
          <span>SPATIAL POINT CLOUD INGESTION</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300">{pointCount.toLocaleString()} VOXELS</span>
        </div>
        <div className="text-[10px] text-zinc-400 bg-black/60 px-2 py-0.5 border border-white/5 rounded-sm">
          MAGNETIC CURSOR DEFLECTION: ACTIVE [MOVE POINTER TO BEND STREAM]
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 pointer-events-none font-mono-cad text-right space-y-1">
        <div className="px-2.5 py-1 bg-black/80 border border-white/10 text-xs text-zinc-300 rounded-sm">
          FPS: <span className="text-emerald-400 font-semibold">{fps} SLA</span> | BANDWIDTH:{' '}
          <span className="text-[#00E5FF]">1.2 GB/s</span>
        </div>
        <div className="text-[10px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded-sm">
          FRAME DRIFT: <span className="text-emerald-400">0.00% DRIFT</span>
        </div>
      </div>

      {/* Bottom Ingestion Stream Terminal */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none font-mono-cad text-[10px] text-zinc-400 flex flex-wrap items-center justify-between bg-black/80 border border-white/10 px-3 py-2 rounded-sm gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#00E5FF]">STREAM:</span>
          <span className="text-zinc-300">RAW_LIDAR_PACKET_64CH</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300">OCTREE_DEPTH: 8</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300">CONFIDENCE: 99.8%</span>
        </div>
        <div className="text-zinc-300">
          SPATIAL COORD: [X: +1.428, Y: +0.812, Z: -2.104]
        </div>
      </div>
    </div>
  );
};
