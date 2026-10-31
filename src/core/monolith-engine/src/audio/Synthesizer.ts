/**
 * Web Audio API procedural synthesizer for ArtificialCraft // Monolith.
 * Generates deterministic 120 BPM cyber kicks, sub-bass pulses, techno FM arpeggios,
 * laser scans, text decode glitch ticks, and warp risers.
 * Connects to both AudioContext destination (speakers) and MediaStreamDestination (video recorder).
 */

export class SynthesizerEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.75;
  private isRunning: boolean = false;
  private lastBeatIndex: number = -1;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  constructor() {
    // Lazily initialized on first user interaction
  }

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    // Dynamics compressor to ensure studio-grade loudness without clipping
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    compressor.knee.setValueAtTime(12, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

    this.masterGain.connect(compressor);
    compressor.connect(this.ctx.destination);

    // Also connect to media stream destination for video export
    this.mediaStreamDest = this.ctx.createMediaStreamDestination();
    compressor.connect(this.mediaStreamDest);

    // Setup ambient drone
    this.setupDrone();
  }

  private setupDrone() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.08, now);

    // Sub-oscillator
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(55, now); // A1 note

    // Detuned second oscillator
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(55.4, now);

    // Lowpass filter for smooth dark drone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);
    filter.Q.setValueAtTime(4, now);

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  public getAudioStreamTrack(): MediaStreamTrack | null {
    this.initContext();
    if (!this.mediaStreamDest) return null;
    const tracks = this.mediaStreamDest.stream.getAudioTracks();
    return tracks.length > 0 ? tracks[0] : null;
  }

  public start() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isRunning = true;
  }

  public stop() {
    this.isRunning = false;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Called by the animation frame loop to synchronize procedural audio triggers to timeline seconds.
   * BPM = 120 (0.5s per quarter beat, 0.125s per 16th note).
   */
  public update(timeSec: number, isPlaying: boolean) {
    if (!isPlaying) return;
    this.initContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const currentBeat = Math.floor(timeSec / 0.25); // 8th notes (240 BPM grid)
    if (currentBeat !== this.lastBeatIndex) {
      this.lastBeatIndex = currentBeat;
      this.triggerClockEvents(timeSec, currentBeat);
    }
  }

  private triggerClockEvents(timeSec: number, beatIndex: number) {
    if (!this.ctx || !this.masterGain) return;
    const act = Math.floor(timeSec / 6); // Acts 0, 1, 2, 3, 4

    // Every quarter note (beatIndex % 2 === 0)
    const isQuarter = beatIndex % 2 === 0;
    const isMeasure = beatIndex % 8 === 0;

    // Act 1: The Problem (0-6s) - Heavy monolithic kick & sub swell
    if (act === 0) {
      if (isMeasure) {
        this.playSubDrop();
      } else if (isQuarter && beatIndex % 4 === 0) {
        this.playCyberKick(0.7);
      }
    }
    // Act 2: The Logic (6-12s) - Crisp technical click & layered laser sweep
    else if (act === 1) {
      if (isQuarter) {
        this.playCyberKick(0.6);
      }
      if (beatIndex % 4 === 2) {
        this.playLaserScan();
      }
      // Staggered component snap sound
      if (beatIndex % 3 === 0) {
        this.playTechTick(880 + (beatIndex % 4) * 220);
      }
    }
    // Act 3: The Precision (12-18s) - Rapid matrix decode scramble clicks
    else if (act === 2) {
      if (isQuarter) {
        this.playCyberKick(0.7);
      }
      // Scramble glitch bursts
      this.playScrambleTick();
      if (isMeasure) {
        this.playCalibratedBeep();
      }
    }
    // Act 4: The Audit (18-24s) - Hyperspace 120 BPM driving pulse & tunnel warp
    else if (act === 3) {
      // Driving 4-on-the-floor kick
      if (isQuarter) {
        this.playCyberKick(0.9);
        this.playHiHat();
      } else {
        this.playHiHat(0.3);
      }
      if (beatIndex % 8 === 6) {
        this.playWarpWhoosh();
      }
    }
    // Act 5: The Call to Action (24-30s) - Resonant harmonic chords & pulse
    else if (act === 4) {
      if (isQuarter && beatIndex % 4 === 0) {
        this.playCyberKick(0.75);
      }
      if (isMeasure) {
        this.playPlexusChime();
      }
      if (beatIndex % 4 === 2) {
        this.playSubPulse();
      }
    }
  }

  // --- Procedural Instruments ---

  private playCyberKick(velocity = 0.8) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency pitch sweep for classic punchy 808/cyber kick
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

    gain.gain.setValueAtTime(velocity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  private playHiHat(velocity = 0.4) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Highpass noise
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.05);
  }

  private playLaserScan() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  private playTechTick(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  private playScrambleTick() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Random technical frequencies
    const freq = 1200 + Math.random() * 1800;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  private playCalibratedBeep() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(990, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  private playSubDrop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  private playSubPulse() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(45, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  private playWarpWhoosh() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  private playPlexusChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major high arpeggio
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = now + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, noteTime);

      gain.gain.setValueAtTime(0.1, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  }

  public dispose() {
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}
