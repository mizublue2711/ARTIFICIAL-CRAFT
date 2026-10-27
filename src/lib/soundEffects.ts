// Sound Effects Synthesizer using Web Audio API for ARTIFICIAL CRAFT

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.4;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.4;
    }
    if (this.isMuted && this.droneGain) {
      this.droneGain.gain.value = 0;
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Soft mechanical click for UI interaction
  public playClickSound(): void {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.masterGain) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio context error fallback
    }
  }

  // Digital glitch white noise burst
  public playGlitchSound(): void {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.masterGain) return;

    try {
      const bufferSize = ctx.sampleRate * 0.08; // 80ms noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      noise.stop(ctx.currentTime + 0.08);
    } catch {
      // Fallback
    }
  }

  // CRT Power on chirp or power off screen collapse sound sweep
  public playPowerSound(isOn: boolean): void {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.masterGain) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';

      if (isOn) {
        // Power on: Sweep up from 100Hz to 1200Hz
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      } else {
        // Power off: Collapse down from 1500Hz to 30Hz
        osc.frequency.setValueAtTime(1500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      }

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(ctx.currentTime + (isOn ? 0.25 : 0.35));
    } catch {
      // Fallback
    }
  }

  // Camera preset whir / FPV shutter chime
  public playCameraSound(): void {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.masterGain) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Fallback
    }
  }

  // Continuous drone hum sound effect for FPV camera flyby
  public playDroneSound(active: boolean): void {
    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    try {
      if (active) {
        if (this.droneOsc) return; // Already running

        this.droneOsc = ctx.createOscillator();
        this.droneGain = ctx.createGain();

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, ctx.currentTime);

        this.droneOsc.type = 'sawtooth';
        this.droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A hum

        this.droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
        this.droneGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.08, ctx.currentTime + 0.3);

        this.droneOsc.connect(filter);
        filter.connect(this.droneGain);
        this.droneGain.connect(this.masterGain);

        this.droneOsc.start();
      } else {
        if (this.droneOsc && this.droneGain) {
          this.droneGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          setTimeout(() => {
            if (this.droneOsc) {
              this.droneOsc.stop();
              this.droneOsc.disconnect();
              this.droneOsc = null;
              this.droneGain = null;
            }
          }, 200);
        }
      }
    } catch {
      // Fallback
    }
  }
}

export const soundEffects = new SoundEffectsEngine();
