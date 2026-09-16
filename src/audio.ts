import gsap from "gsap";

export class AudioManager {
  private music: HTMLAudioElement;
  private ctx: AudioContext | null = null;
  private unlocked = false;
  muted = false;

  constructor(src: string) {
    this.music = new Audio(src);
    this.music.loop = true;
    this.music.volume = 0;
    // Missing file or load failure: stay silent, never break the page.
    this.music.addEventListener("error", () => {});
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.ctx = new AudioContext();
    this.music
      .play()
      .then(() => gsap.to(this.music, { volume: 0.5, duration: 2 }))
      .catch(() => {});
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.music.muted = this.muted;
    return this.muted;
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
    if (!this.ctx || this.muted) return;
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
