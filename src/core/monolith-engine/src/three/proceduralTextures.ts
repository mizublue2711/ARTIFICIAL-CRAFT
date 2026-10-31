import * as THREE from 'three';

/**
 * Zero-404 Procedural Texture Generator for Three.js.
 * Strictly uses HTML5 Canvas Textures with SRGBColorSpace and maximum anisotropy.
 */

export class ProceduralTextureManager {
  private maxAnisotropy: number = 16;

  constructor(renderer?: THREE.WebGLRenderer) {
    if (renderer) {
      this.maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    }
  }

  public setMaxAnisotropy(val: number) {
    this.maxAnisotropy = Math.max(1, val);
  }

  /**
   * High-contrast technical CAD crosshairs and 1px grid
   */
  public createCADGridTexture(size = 1024): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Dark technical background with alpha
    ctx.fillStyle = '#06070c';
    ctx.fillRect(0, 0, size, size);

    // 1px micro grid
    ctx.strokeStyle = '#181b2a';
    ctx.lineWidth = 1;
    const step = size / 16;

    for (let x = 0; x <= size; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(size, y + 0.5);
      ctx.stroke();
    }

    // Corner crosshairs (+) and telemetry indices
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1.5;
    const crossSize = 12;

    for (let x = step; x < size; x += step * 2) {
      for (let y = step; y < size; y += step * 2) {
        ctx.beginPath();
        ctx.moveTo(x - crossSize, y);
        ctx.lineTo(x + crossSize, y);
        ctx.moveTo(x, y - crossSize);
        ctx.lineTo(x, y + crossSize);
        ctx.stroke();

        // Technical coordinate labels
        ctx.fillStyle = '#3a4463';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`+${Math.floor(x)},${Math.floor(y)}`, x + 6, y - 6);
      }
    }

    // Border registration marks
    ctx.strokeStyle = '#5322FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.maxAnisotropy;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Gold-plated high-tech PCB traces and micro-logic circuit bus
   */
  public createPCBTracesTexture(size = 1024): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Matte graphite substrate
    ctx.fillStyle = '#0c0d12';
    ctx.fillRect(0, 0, size, size);

    // Subtle substrate ground plane noise
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#11131a' : '#08090d';
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }

    // Gold circuit bus traces (#ffd700 / #00E5FF dual-tone)
    const traceCount = 36;
    for (let i = 0; i < traceCount; i++) {
      const isCyan = i % 5 === 0;
      ctx.strokeStyle = isCyan ? '#00E5FF' : '#e6b800';
      ctx.lineWidth = isCyan ? 2 : 1.5;

      const y = (size / traceCount) * i + 10;
      ctx.beginPath();
      ctx.moveTo(20, y);

      let curX = 20;
      let curY = y;
      while (curX < size - 40) {
        const segLen = 40 + Math.random() * 80;
        curX += segLen;
        const turn = (Math.random() - 0.5) * 30;
        curY += turn;
        ctx.lineTo(curX, curY);

        // Circular solder via / test pad
        if (Math.random() > 0.6) {
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(curX, curY, isCyan ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isCyan ? '#ffffff' : '#ffea75';
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(curX, curY);
        }
      }
      ctx.lineTo(size - 20, curY);
      ctx.stroke();
    }

    // IC Chips / surface mount pads
    ctx.fillStyle = '#1c1f2e';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    for (let b = 0; b < 6; b++) {
      const bx = 120 + (b % 3) * 280;
      const by = 140 + Math.floor(b / 3) * 440;
      ctx.fillRect(bx, by, 160, 100);
      ctx.strokeRect(bx, by, 160, 100);

      // Chip pin markings
      for (let p = 0; p < 12; p++) {
        ctx.fillStyle = '#e6b800';
        ctx.fillRect(bx + 10 + p * 12, by - 6, 6, 6);
        ctx.fillRect(bx + 10 + p * 12, by + 100, 6, 6);
      }

      // Engraved chip typography
      ctx.fillStyle = '#8e9aaf';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`NPU-CORE 0${b + 1} // 60FPS`, bx + 16, by + 45);
      ctx.fillStyle = '#00E5FF';
      ctx.fillText(`DETERMINISTIC`, bx + 16, by + 65);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.maxAnisotropy;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Monolith Typographic Ribbon with Swiss Cyber-Brutalist telemetry,
   * live code coordinates, and ArtificialCraft branding.
   */
  public createMonolithTelemetryRibbon(width = 2048, height = 256): {
    texture: THREE.CanvasTexture;
    update: (time: number, frame: number) => void;
  } {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.maxAnisotropy;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const update = (time: number, frame: number) => {
      // Clear with dark tech panel
      ctx.fillStyle = '#05060a';
      ctx.fillRect(0, 0, width, height);

      // Top and bottom 1px technical cyan lines
      ctx.fillStyle = '#00E5FF';
      ctx.fillRect(0, 0, width, 2);
      ctx.fillRect(0, height - 2, width, 2);

      // Scrolling offset based on deterministic time
      const scrollX = (time * 120) % width;

      // Draw repeating Swiss Brutalist badges and typography
      ctx.font = 'bold 26px "JetBrains Mono", monospace';
      const items = [
        'ARTIFICIALCRAFT // CRAFT MEETS CODE',
        'SYSTEM ARCHITECTURE: ZERO-404 PBR',
        'TIMELINE: 30.000s DETERMINISTIC 60FPS',
        'DIFY THINKS // N8N EXECUTES',
        'CALIPER PRECISION // ZERO DRIFT',
        'STUDIO PBR: ACES FILMIC + PMREM',
        'AUDIT GATE: 4-MODEL CONSENSUS',
        'HTTPS://ARTIFICIALCRAFT.SPACE',
      ];

      const blockWidth = 640;
      for (let i = -1; i < Math.ceil(width / blockWidth) + 2; i++) {
        const x = i * blockWidth - scrollX;
        const index = Math.abs(i) % items.length;
        const text = items[index];

        // Background highlight block for certain items
        if (index % 2 === 0) {
          ctx.fillStyle = '#0f1325';
          ctx.fillRect(x, 10, blockWidth - 20, height - 20);
          ctx.strokeStyle = '#5322FF';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, 10, blockWidth - 20, height - 20);
        }

        // Accent indicator dot
        ctx.fillStyle = index % 2 === 0 ? '#00E5FF' : '#5322FF';
        ctx.fillRect(x + 15, height / 2 - 4, 8, 8);

        // Text
        ctx.fillStyle = index % 2 === 0 ? '#FFFFFF' : '#8e9aaf';
        ctx.fillText(text, x + 35, height / 2 + 8);

        // Sub-telemetry line
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#525c76';
        const hex = (frame * 137 + i * 991).toString(16).toUpperCase().padStart(8, '0');
        ctx.fillText(`0x${hex} // TICK: ${frame} // T: ${time.toFixed(3)}s`, x + 35, height / 2 + 34);
        ctx.font = 'bold 26px "JetBrains Mono", monospace';
      }

      texture.needsUpdate = true;
    };

    update(0, 0);

    return { texture, update };
  }

  /**
   * High-fidelity Brushed Titanium / Anisotropic Metal Normal & Bump Map
   */
  public createBrushedMetalNormalMap(size = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    // Linear horizontal hairline striations
    for (let y = 0; y < size; y++) {
      const lineNoise = Math.sin(y * 1.8) * 0.15 + (Math.random() - 0.5) * 0.25;
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const noise = (Math.random() - 0.5) * 0.08 + lineNoise;

        // Normal map encoding: R = X (tangent), G = Y (bitangent), B = Z (up)
        const nx = Math.floor(128 + noise * 50);
        const ny = 128;
        const nz = 250;

        data[idx] = nx;
        data[idx + 1] = ny;
        data[idx + 2] = nz;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.NoColorSpace; // Data maps are linear
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.anisotropy = this.maxAnisotropy;
    return texture;
  }

  /**
   * Carbon Fiber twill weave bump/specular map
   */
  public createCarbonWeaveTexture(size = 256): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const unit = 16;
    for (let x = 0; x < size; x += unit) {
      for (let y = 0; y < size; y += unit) {
        const isDiagonal = ((x / unit) + (y / unit)) % 2 === 0;
        ctx.fillStyle = isDiagonal ? '#141416' : '#222328';
        ctx.fillRect(x, y, unit, unit);

        // Twill fiber striations
        ctx.strokeStyle = isDiagonal ? '#0a0a0c' : '#32343c';
        ctx.lineWidth = 1;
        for (let s = 0; s < unit; s += 3) {
          ctx.beginPath();
          if (isDiagonal) {
            ctx.moveTo(x + s, y);
            ctx.lineTo(x + s, y + unit);
          } else {
            ctx.moveTo(x, y + s);
            ctx.lineTo(x + unit, y + s);
          }
          ctx.stroke();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.anisotropy = this.maxAnisotropy;
    return texture;
  }

  /**
   * Radial soft contact shadow texture for grounding the Monolith
   */
  public createContactShadowTexture(size = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, size, size);

    // Deep radial gradient
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, size * 0.05,
      size / 2, size / 2, size * 0.48
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(0.65, 'rgba(2, 4, 12, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(size / 2, size / 2, size * 0.45, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.NoColorSpace;
    return texture;
  }
}
