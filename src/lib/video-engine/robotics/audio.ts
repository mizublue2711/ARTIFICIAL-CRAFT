// Zero-dependency procedural Web Audio API audio synthesizer
// Produces tactile CAD mechanical feedback, servo sweeps, and laser hums

class ProceduralAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private servoOsc: OscillatorNode | null = null;
  private servoGain: GainNode | null = null;

  constructor() {
    // Lazily initialized on user interaction to comply with browser audio autoplay policy
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.servoGain) {
      this.servoGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tactical mechanical click on component hover / button tap
  public playTacticalClick(pitch = 1800, duration = 0.03) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  // Harmonic servo hum when dragging the exploded view slider
  public updateServoTone(velocity: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (!this.servoOsc) {
        this.servoOsc = this.ctx.createOscillator();
        this.servoGain = this.ctx.createGain();
        this.servoOsc.type = 'sawtooth';
        this.servoOsc.frequency.setValueAtTime(120, this.ctx.currentTime);
        this.servoGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.servoOsc.connect(this.servoGain);
        this.servoGain.connect(this.ctx.destination);
        this.servoOsc.start();
      }

      if (!this.servoOsc || !this.servoGain || !this.ctx) return;

      const clampedVel = Math.min(Math.max(velocity, 0), 1);
      const targetFreq = 140 + clampedVel * 460;
      const targetGain = clampedVel > 0.01 ? 0.025 : 0.0001;

      this.servoOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
      this.servoGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    } catch {
      // Audio fallback silent
    }
  }

  public stopServoTone() {
    if (this.servoGain && this.ctx) {
      this.servoGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05);
    }
  }

  // Raycast target laser lock-on sound
  public playLaserLock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.09);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.12);
    } catch {
      // Audio fallback silent
    }
  }

  // Data packet ingestion blip
  public playDataStreamBeep() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200 + Math.random() * 800, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.04);
    } catch {
      // Audio fallback silent
    }
  }
}

export const sfx = new ProceduralAudioManager();
