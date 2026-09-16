export class AudioManager {
  private ctx: AudioContext | null = null;
  private unlocked = false;

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.ctx = new AudioContext();
  }

  pop() {
    this.blip(520, 0.08, "square");
  }

  chime() {
    this.blip(880, 0.25, "sine");
  }

  whoosh() {
    this.blip(220, 0.2, "triangle");
  }

  private blip(freq: number, dur: number, type: OscillatorType) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }
}
