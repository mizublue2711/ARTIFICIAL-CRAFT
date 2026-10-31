import * as THREE from 'three';

/**
 * Act 2: The Logic (00:06 – 00:12)
 * MotionKey: Glassmorphic CAD Layers, Quaternion 3D Rotations, Staggered Spring Physics,
 * Depth Buffer Separation, Ambient Occlusion Shadows.
 * Aesthetic: High-Tech Glassmorphic UI Assembly.
 */

export const ACT2_CONFIG = {
  stiffness: 90,
  damping: 14,
  staggerDelay: 8, // frames
  tiltAngleX: 25,
  tiltAngleY: -15,
  accentColor: '#00E5FF',
};

interface LayerItem {
  group: THREE.Group;
  mesh: THREE.Mesh;
  laserLine: THREE.LineSegments;
  targetPos: THREE.Vector3;
  targetRot: THREE.Euler;
  currentZ: number;
  currentRotX: number;
  currentRotY: number;
  velocityZ: number;
  velocityRotX: number;
  velocityRotY: number;
  laserProgress: number;
}

export class Act2GlassmorphicAssembly {
  public group: THREE.Group;
  private layers: LayerItem[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildLayers();
    this.group.position.set(0, 1.8, 0);
  }

  private createGlassCanvas(title: string, sub: string, badge: string, type: 'nav' | 'hero' | 'bento' | 'telemetry'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = type === 'nav' ? 160 : type === 'telemetry' ? 320 : 512;
    const ctx = canvas.getContext('2d')!;

    // Translucent dark glass background
    ctx.fillStyle = 'rgba(8, 11, 20, 0.88)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1px Subtle CAD border
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Corner brackets
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    const bLen = 24;
    // Top-left
    ctx.beginPath(); ctx.moveTo(4, 4 + bLen); ctx.lineTo(4, 4); ctx.lineTo(4 + bLen, 4); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(canvas.width - 4 - bLen, 4); ctx.lineTo(canvas.width - 4, 4); ctx.lineTo(canvas.width - 4, 4 + bLen); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(4, canvas.height - 4 - bLen); ctx.lineTo(4, canvas.height - 4); ctx.lineTo(4 + bLen, canvas.height - 4); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(canvas.width - 4 - bLen, canvas.height - 4); ctx.lineTo(canvas.width - 4, canvas.height - 4); ctx.lineTo(canvas.width - 4, canvas.height - 4 - bLen); ctx.stroke();

    // Header badge
    ctx.fillStyle = '#5322FF';
    ctx.fillRect(24, 20, 140, 28);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(badge, 34, 39);

    // Title & Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(title, 180, 42);

    ctx.fillStyle = '#8e9aaf';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(sub, 24, 80);

    // Contextual UI content
    if (type === 'hero') {
      ctx.fillStyle = '#0f1629';
      ctx.fillRect(24, 110, 976, 260);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, 110, 976, 260);

      ctx.fillStyle = '#00E5FF';
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SEPARATION OF POWERS // BRAIN MEETS MUSCLE', 48, 170);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '16px "JetBrains Mono", monospace';
      ctx.fillText('Dify orchestrates cognition -> n8n executes distributed worker tasks.', 48, 220);
      ctx.fillStyle = '#5322FF';
      ctx.fillText('[OK] 0 LLM TOKENS WASTED ON JSON PARSING // 100% RELIABILITY', 48, 260);
    } else if (type === 'bento') {
      // 3 Bento Boxes
      const boxW = 300;
      for (let b = 0; b < 3; b++) {
        const bx = 24 + b * 338;
        ctx.fillStyle = '#0d111d';
        ctx.fillRect(bx, 110, boxW, 260);
        ctx.strokeStyle = b === 0 ? '#00E5FF' : b === 1 ? '#5322FF' : '#ffd700';
        ctx.strokeRect(bx, 110, boxW, 260);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        const labels = ['BENTO 01: DIFY', 'BENTO 02: N8N', 'BENTO 03: CAD'];
        ctx.fillText(labels[b], bx + 16, 145);

        ctx.fillStyle = '#8e9aaf';
        ctx.font = '12px "JetBrains Mono", monospace';
        const desc = [
          'Stateful reasoning engine\nVector memory lookup\nDeterministic routing',
          'Webhook execution bus\nZero-token JSON parsing\nResilient retry queues',
          'Parametric layout\nSwiss Brutalist grid\nLaser scan telemetry',
        ];
        desc[b].split('\n').forEach((line, li) => {
          ctx.fillText(line, bx + 16, 185 + li * 24);
        });
      }
    } else if (type === 'telemetry') {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(24, 110, 976, 170);
      ctx.fillStyle = '#00E5FF';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText('LATENCY: 1.2ms // GC: 0 BYTES // SHADOW: PCF_SOFT // TONE: ACES_FILMIC', 40, 160);
      ctx.fillStyle = '#8e9aaf';
      ctx.fillText('STATUS: LOCKED 60FPS // CAMERA: QUATERNION SPRING // DISPLACEMENT: 0.00%', 40, 200);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  private buildLayers() {
    const specs: {
      title: string;
      sub: string;
      badge: string;
      type: 'nav' | 'hero' | 'bento' | 'telemetry';
      w: number;
      h: number;
      targetY: number;
    }[] = [
      { title: 'ARTIFICIALCRAFT // SYSTEM BUS', sub: 'LAYER 01: GLOBAL NAVIGATION & TELEMETRY', badge: 'NAVBAR', type: 'nav', w: 4.8, h: 0.75, targetY: 1.6 },
      { title: 'CORE ARCHITECTURE', sub: 'LAYER 02: HIGH-ORDER REASONING & DISPATCH', badge: 'HERO', type: 'hero', w: 4.8, h: 2.4, targetY: 0.0 },
      { title: 'EXECUTION PODS', sub: 'LAYER 03: DISTRIBUTED AUTOMATION BUS (N8N)', badge: 'BENTO', type: 'bento', w: 4.8, h: 2.2, targetY: -2.3 },
      { title: 'REALTIME TELEMETRY', sub: 'LAYER 04: DETERMINISTIC 60FPS METRIC MONITOR', badge: 'METRICS', type: 'telemetry', w: 4.8, h: 1.2, targetY: -3.8 },
    ];

    specs.forEach((spec, idx) => {
      const group = new THREE.Group();
      const texture = this.createGlassCanvas(spec.title, spec.sub, spec.badge, spec.type);

      const geo = new THREE.PlaneGeometry(spec.w, spec.h);
      const mat = new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        opacity: 0.94,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.7,
        ior: 1.45,
        thickness: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Glowing laser scan border lines
      const edgeGeo = new THREE.BufferGeometry();
      const hw = spec.w / 2;
      const hh = spec.h / 2;
      const points = [
        -hw, hh, 0.01,   hw, hh, 0.01,
        hw, hh, 0.01,    hw, -hh, 0.01,
        hw, -hh, 0.01,  -hw, -hh, 0.01,
        -hw, -hh, 0.01, -hw, hh, 0.01,
      ];
      edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00E5FF,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
      });
      const laserLine = new THREE.LineSegments(edgeGeo, lineMat);
      group.add(laserLine);

      // Initial 3D state: Z = 600px (~4.5 in 3D units), 45-deg RotateX
      const startZ = 4.2 + idx * 1.0;
      const startRotX = THREE.MathUtils.degToRad(ACT2_CONFIG.tiltAngleX);
      const startRotY = THREE.MathUtils.degToRad(ACT2_CONFIG.tiltAngleY);

      group.position.set(0, spec.targetY, startZ);
      group.rotation.set(startRotX, startRotY, 0);

      this.layers.push({
        group,
        mesh,
        laserLine,
        targetPos: new THREE.Vector3(0, spec.targetY, 0),
        targetRot: new THREE.Euler(0, 0, 0),
        currentZ: startZ,
        currentRotX: startRotX,
        currentRotY: startRotY,
        velocityZ: 0,
        velocityRotX: 0,
        velocityRotY: 0,
        laserProgress: 0,
      });

      this.group.add(group);
    });

    this.group.scale.set(0.72, 0.72, 0.72);
  }

  public update(actRelativeTime: number, frame: number, delta: number) {
    const actFrames = Math.floor(actRelativeTime * 60);

    this.layers.forEach((layer, idx) => {
      const delay = idx * ACT2_CONFIG.staggerDelay;
      if (actFrames < delay) {
        // Not started dropping yet
        return;
      }

      // 2nd-order spring physics simulation: F = -k * x - d * v
      const dt = Math.min(delta, 0.033);
      const k = ACT2_CONFIG.stiffness;
      const d = ACT2_CONFIG.damping;

      // Z position spring
      const dispZ = layer.currentZ - layer.targetPos.z;
      const forceZ = -k * dispZ - d * layer.velocityZ;
      layer.velocityZ += forceZ * dt;
      layer.currentZ += layer.velocityZ * dt;
      layer.group.position.z = layer.currentZ;

      // RotateX spring
      const dispRotX = layer.currentRotX - layer.targetRot.x;
      const forceRotX = -k * dispRotX - d * layer.velocityRotX;
      layer.velocityRotX += forceRotX * dt;
      layer.currentRotX += layer.velocityRotX * dt;
      layer.group.rotation.x = layer.currentRotX;

      // RotateY spring
      const dispRotY = layer.currentRotY - layer.targetRot.y;
      const forceRotY = -k * dispRotY - d * layer.velocityRotY;
      layer.velocityRotY += forceRotY * dt;
      layer.currentRotY += layer.velocityRotY * dt;
      layer.group.rotation.y = layer.currentRotY;

      // Laser scan border sweep
      const distFromTarget = Math.abs(dispZ);
      if (distFromTarget < 0.2) {
        layer.laserProgress = Math.min(1.0, layer.laserProgress + dt * 2.5);
      }
      const lineMat = layer.laserLine.material as THREE.LineBasicMaterial;
      const pulse = 0.5 + Math.sin(frame * 0.15 + idx) * 0.5;
      lineMat.opacity = layer.laserProgress * (0.4 + pulse * 0.6);
    });
  }

  public setVisible(v: boolean) {
    this.group.visible = v;
  }

  public dispose() {
    this.layers.forEach((l) => {
      l.mesh.geometry.dispose();
      (l.mesh.material as THREE.Material).dispose();
      l.laserLine.geometry.dispose();
      (l.laserLine.material as THREE.Material).dispose();
    });
  }
}
