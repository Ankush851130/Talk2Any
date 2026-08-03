// Web Audio API Synthesized Chimes (Zero external audio file dependencies)
class SoundSynth {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playTone(freq, type = 'sine', duration = 0.15, startTimeOffset = 0, gainVal = 0.1) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTimeOffset);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime + startTimeOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTimeOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTimeOffset);
      osc.stop(ctx.currentTime + startTimeOffset + duration);
    } catch (e) {
      console.warn('Audio synth play warning:', e.message);
    }
  }

  // Room Join Chime (E5 -> G5 -> C6)
  playJoinSound() {
    this.playTone(659.25, 'sine', 0.12, 0, 0.08); // E5
    this.playTone(783.99, 'sine', 0.12, 0.1, 0.08); // G5
    this.playTone(1046.5, 'sine', 0.25, 0.2, 0.1); // C6
  }

  // Room Leave Chime (C6 -> G5 -> C5)
  playLeaveSound() {
    this.playTone(1046.5, 'sine', 0.12, 0, 0.08); // C6
    this.playTone(783.99, 'sine', 0.12, 0.1, 0.08); // G5
    this.playTone(523.25, 'sine', 0.22, 0.2, 0.07); // C5
  }

  // Hand Raise Sound (A5 -> C6)
  playHandRaiseSound() {
    this.playTone(880.0, 'sine', 0.1, 0, 0.09); // A5
    this.playTone(1046.5, 'sine', 0.18, 0.08, 0.1); // C6
  }
}

export const soundSynth = new SoundSynth();
