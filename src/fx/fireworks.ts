interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const COLORS = ["#ff6b9d", "#ffd166", "#6bd4ff", "#c5a3ff", "#7ee8a2", "#ffffff"];

export class Fireworks {
  private particles: Particle[] = [];
  private raf = 0;
  private launchTimer = 0;
  private running = false;
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  private resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;
  };

  start() {
    if (this.running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    this.running = true;
    this.launchTimer = window.setInterval(() => this.explode(), 500);
    this.explode();
    const tick = () => {
      this.step();
      if (this.running) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    clearInterval(this.launchTimer);
    window.removeEventListener("resize", this.resize);
    this.particles = [];
  }

  explode() {
    const { width, height } = this.canvas;
    if (width === 0 || height === 0) return;
    const x = width * (0.2 + Math.random() * 0.6);
    const y = height * (0.15 + Math.random() * 0.4);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 50 + Math.random() * 40,
        color,
        size: 1.5 + Math.random() * 2,
      });
    }
  }

  private step() {
    const { width, height } = this.canvas;
    this.ctx.fillStyle = "rgba(10, 8, 30, 0.2)";
    this.ctx.fillRect(0, 0, width, height);
    this.particles = this.particles.filter((p) => p.life < p.maxLife);
    for (const p of this.particles) {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      this.ctx.globalAlpha = 1 - p.life / p.maxLife;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
}
