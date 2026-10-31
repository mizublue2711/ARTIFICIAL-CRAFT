import * as THREE from 'three';

/**
 * Act 3: The Precision (00:12 – 00:18)
 * MotionKey: Instanced Glyph Matrix, Kinetic Variable Font Morphing, Perlin Noise Wavefront,
 * Scramble Decode Effect, Vector Field Flow.
 * Aesthetic: Brutalist Code Matrix Typography.
 */

export const ACT3_CONFIG = {
  sweepSpeed: 0.02,
  waveWidth: 300,
  fontSize: 16,
  headlineText: 'VIDEO AS CODE // DETERMINISTIC 60FPS',
};

export class Act3MatrixPrecision {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public texture: THREE.CanvasTexture;
  public mesh: THREE.Mesh;
  private cols = 0;
  private rows = 0;
  private hexMatrix: string[][] = [];
  private chars = '0123456789ABCDEF';
  private scrambleChars = '0123456789ABCDEF$#@!%*&<>[]{}';

  constructor(width = 1920, height = 1080) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;

    this.cols = Math.floor(width / (ACT3_CONFIG.fontSize * 1.4));
    this.rows = Math.floor(height / (ACT3_CONFIG.fontSize * 1.6));

    // Initialize deterministic hex values
    for (let r = 0; r < this.rows; r++) {
      this.hexMatrix[r] = [];
      for (let c = 0; c < this.cols; c++) {
        const seed = (r * 137 + c * 991) % this.chars.length;
        this.hexMatrix[r][c] = this.chars[seed];
      }
    }

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    // Viewport billboard mesh
    const geo = new THREE.PlaneGeometry(8, 4.5);
    const mat = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0, 1.8, 0.5);
  }

  // Deterministic 2D Perlin-like pseudo noise wave
  private getWaveIntensity(x: number, y: number, time: number): number {
    // Diagonal wavefront from top-left to bottom-right
    const wavePos = (time * 700) % (this.canvas.width + this.canvas.height + 600);
    const distToWave = (x + y) - wavePos;
    const normDist = Math.abs(distToWave) / ACT3_CONFIG.waveWidth;

    if (normDist > 1.0) return 0;
    // Cosine smooth wave bump
    const intensity = 0.5 * (1 + Math.cos(normDist * Math.PI));
    return intensity;
  }

  private getScrambledHeadline(target: string, progress: number, frame: number): string {
    const revealedLength = Math.floor(target.length * progress);
    let result = '';

    for (let i = 0; i < target.length; i++) {
      if (i < revealedLength) {
        result += target[i];
      } else if (i < revealedLength + 4) {
        // Active scrambling glitch tail
        const seed = (frame * 17 + i * 31) % this.scrambleChars.length;
        result += this.scrambleChars[seed];
      } else {
        result += ' ';
      }
    }
    return result;
  }

  public update(actRelativeTime: number, frame: number) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Clear background with deep dark slate
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, w, h);

    const cellW = w / this.cols;
    const cellH = h / this.rows;

    // 1. Render Hexadecimal Glyph Matrix with Wavefront morphing
    for (let r = 0; r < this.rows; r++) {
      const y = r * cellH + cellH * 0.8;
      for (let c = 0; c < this.cols; c++) {
        const x = c * cellW + cellW * 0.2;
        const wave = this.getWaveIntensity(x, y, actRelativeTime);

        // Dynamically morph font-weight & color
        let color = '#181b24'; // Inactive dark gray
        let weight = 300;

        if (wave > 0.05) {
          if (wave > 0.75) {
            color = '#FFFFFF'; // Bright white peak
            weight = 900;
          } else if (wave > 0.4) {
            color = '#00E5FF'; // Glowing cyan
            weight = 700;
          } else {
            color = '#5322FF'; // Accent purple
            weight = 500;
          }
        }

        ctx.font = `${weight} ${ACT3_CONFIG.fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = color;

        // Subtle character flicker at peak
        const char = (wave > 0.6 && (frame + c + r) % 5 === 0)
          ? this.chars[(frame + c) % this.chars.length]
          : this.hexMatrix[r][c];

        ctx.fillText(char, x, y);
      }
    }

    // 2. Central Technical Reticle & Caliper Overlay
    const cx = w / 2;
    const cy = h / 2;

    // Outer caliper bounds
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 440, cy - 140, 880, 280);

    // Corner crosshairs
    const cLen = 20;
    ctx.lineWidth = 2.5;
    // Top Left
    ctx.beginPath(); ctx.moveTo(cx - 440 - cLen, cy - 140); ctx.lineTo(cx - 440 + cLen, cy - 140); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 440, cy - 140 - cLen); ctx.lineTo(cx - 440, cy - 140 + cLen); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(cx + 440 - cLen, cy - 140); ctx.lineTo(cx + 440 + cLen, cy - 140); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 440, cy - 140 - cLen); ctx.lineTo(cx + 440, cy - 140 + cLen); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(cx - 440 - cLen, cy + 140); ctx.lineTo(cx - 440 + cLen, cy + 140); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 440, cy + 140 - cLen); ctx.lineTo(cx - 440, cy + 140 + cLen); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(cx + 440 - cLen, cy + 140); ctx.lineTo(cx + 440 + cLen, cy + 140); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 440, cy + 140 - cLen); ctx.lineTo(cx + 440, cy + 140 + cLen); ctx.stroke();

    // 3. Central Headline Scramble Decode Effect
    const decodeProgress = Math.min(1.0, actRelativeTime / 3.5);
    const decodedText = this.getScrambledHeadline(ACT3_CONFIG.headlineText, decodeProgress, frame);

    // Headline backdrop pill
    ctx.fillStyle = 'rgba(7, 9, 15, 0.95)';
    ctx.fillRect(cx - 420, cy - 55, 840, 110);
    ctx.strokeStyle = '#5322FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 420, cy - 55, 840, 110);

    // Headline Text
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'center';
    ctx.fillText(decodedText, cx, cy + 12);

    // Subtitle Callout
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8e9aaf';
    ctx.fillText('CALIPER LOCK: 0.000px TOLERANCE // ZERO WORKFLOW DRIFT // DETERMINISTIC 60FPS', cx, cy + 42);

    // Caliper ruler markings along top of frame
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1;
    for (let rx = cx - 400; rx <= cx + 400; rx += 20) {
      const isMajor = (rx - (cx - 400)) % 100 === 0;
      const rLen = isMajor ? 12 : 6;
      ctx.beginPath();
      ctx.moveTo(rx, cy - 140);
      ctx.lineTo(rx, cy - 140 + rLen);
      ctx.stroke();

      if (isMajor) {
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#8e9aaf';
        ctx.fillText(`${(rx - cx).toFixed(0)}px`, rx, cy - 145);
      }
    }

    ctx.textAlign = 'left';
    this.texture.needsUpdate = true;
  }

  public setVisible(v: boolean) {
    this.mesh.visible = v;
  }

  public dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.texture.dispose();
  }
}
