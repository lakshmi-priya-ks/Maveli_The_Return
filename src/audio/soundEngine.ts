/**
 * Authentic Kerala Web Audio Synthesizer
 * Provides Chenda beats, temple bell chimes, natural ambient drones,
 * floral collection chimes, and celebration rhythm without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private ambienceOsc1: OscillatorNode | null = null;
  private ambienceOsc2: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private melamInterval: number | null = null;

  constructor() {
    // Check saved mute preference
    try {
      const savedMute = localStorage.getItem('maaveli_sound_muted');
      if (savedMute === 'true') {
        this.muted = true;
      }
    } catch {
      // ignore
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('maaveli_sound_muted', String(this.muted));
    } catch {
      // ignore
    }
    if (this.muted) {
      this.stopAmbience();
      this.stopMelam();
    }
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem('maaveli_sound_muted', String(this.muted));
    } catch {
      // ignore
    }
    if (this.muted) {
      this.stopAmbience();
      this.stopMelam();
    }
  }

  // --- Sound Effects ---

  // Chenda drum stroke: authentic Indian cylindrical percussion
  public playChenda(stroke: 'dhim' | 'tha' | 'ki' | 'ta' = 'dhim') {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Noise for initial stick strike contact
    const bufferSize = this.ctx.sampleRate * 0.04;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    const noiseFilter = this.ctx.createBiquadFilter();

    noiseFilter.type = 'bandpass';

    switch (stroke) {
      case 'dhim': // Deep resonant open stroke
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.18);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, t);
        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        noiseFilter.frequency.setValueAtTime(1200, t);
        noiseGain.gain.setValueAtTime(0.3, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        break;

      case 'tha': // Sharp mid stroke
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.1);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, t);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        noiseFilter.frequency.setValueAtTime(2000, t);
        noiseGain.gain.setValueAtTime(0.4, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        break;

      case 'ki': // High rim/edge strike
        osc.frequency.setValueAtTime(380, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.08);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(300, t);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        noiseFilter.frequency.setValueAtTime(3200, t);
        noiseGain.gain.setValueAtTime(0.5, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        break;

      case 'ta': // Crisp stick tap
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.09);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, t);
        gain.gain.setValueAtTime(0.55, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        noiseFilter.frequency.setValueAtTime(2600, t);
        noiseGain.gain.setValueAtTime(0.45, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
        break;
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.4);
    noise.stop(t + 0.08);
  }

  // Temple bronze bell (Mani / Elathalam) with resonant harmonics
  public playTempleBell(freq: number = 880) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const partials = [1, 1.52, 2.01, 2.76, 3.4];
    const amplitudes = [0.4, 0.25, 0.2, 0.12, 0.08];

    partials.forEach((ratio, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, t);

      gain.gain.setValueAtTime(amplitudes[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6 / (idx + 1));

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 1.7);
    });
  }

  // Pookalam fragment pickup: pleasant sparkling floral chime
  public playPetalPickup(index: number = 0) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Raga Mohanam / pentatonic scale notes: C5, D5, E5, G5, A5, C6
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const baseFreq = pentatonic[index % pentatonic.length];

    [0, 0.06].forEach((delay, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq * (i === 0 ? 1 : 1.5), t + delay);

      gain.gain.setValueAtTime(0.25, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t + delay);
      osc.stop(t + delay + 0.4);
    });
  }

  // Tactile wood/puzzle snap
  public playSnap() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Lamp lighting warm chime
  public playLampLight() {
    this.playTempleBell(1046.5); // high C bell
  }

  // Player jump whoosh
  public playJump() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Soft step
  public playFootstep() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Water splash
  public playWaterSplash() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(300, t + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.26);
  }

  // Failure sound
  public playFailure() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  // Gentle Tanpura / peaceful Indian drone for level immersion
  public startAmbience(_theme: 'village' | 'paddy' | 'backwaters' | 'festival') {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopAmbience();

    const t = this.ctx.currentTime;
    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.001, t);
    this.ambienceGain.gain.linearRampToValueAtTime(0.04, t + 2); // very gentle background level

    // Sa - Pa drone (D3 = 146.83Hz, A3 = 220Hz)
    this.ambienceOsc1 = this.ctx.createOscillator();
    this.ambienceOsc1.type = 'triangle';
    this.ambienceOsc1.frequency.setValueAtTime(146.83, t);

    this.ambienceOsc2 = this.ctx.createOscillator();
    this.ambienceOsc2.type = 'sine';
    this.ambienceOsc2.frequency.setValueAtTime(220.0, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);

    this.ambienceOsc1.connect(filter);
    this.ambienceOsc2.connect(filter);
    filter.connect(this.ambienceGain);
    this.ambienceGain.connect(this.ctx.destination);

    this.ambienceOsc1.start(t);
    this.ambienceOsc2.start(t);
  }

  public stopAmbience() {
    if (this.ambienceGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.ambienceGain.gain.linearRampToValueAtTime(0.001, t + 0.5);
        setTimeout(() => {
          this.ambienceOsc1?.stop();
          this.ambienceOsc2?.stop();
          this.ambienceOsc1?.disconnect();
          this.ambienceOsc2?.disconnect();
          this.ambienceGain?.disconnect();
          this.ambienceOsc1 = null;
          this.ambienceOsc2 = null;
          this.ambienceGain = null;
        }, 550);
      } catch {
        // ignore
      }
    }
  }

  // Celebratory traditional Chenda Melam loop for the grand finale!
  public startMelam() {
    if (this.muted) return;
    this.stopMelam();

    let beat = 0;
    // Chenda Melam rhythmic cycle (Panchari / Chempada style: Dhim - Tha - Ki - Ta)
    const pattern: Array<'dhim' | 'tha' | 'ki' | 'ta' | null> = [
      'dhim', 'tha', 'ki', 'ta',
      'dhim', 'dhim', 'tha', null,
      'ki', 'ta', 'ki', 'ta',
      'dhim', 'tha', 'dhim', null
    ];

    this.melamInterval = window.setInterval(() => {
      const stroke = pattern[beat % pattern.length];
      if (stroke) {
        this.playChenda(stroke);
      }
      if (beat % 8 === 0) {
        this.playTempleBell(587.33); // D5 chime on key downbeats
      }
      beat++;
    }, 220);
  }

  public stopMelam() {
    if (this.melamInterval !== null) {
      clearInterval(this.melamInterval);
      this.melamInterval = null;
    }
  }
}

export const sound = new SoundEngine();
