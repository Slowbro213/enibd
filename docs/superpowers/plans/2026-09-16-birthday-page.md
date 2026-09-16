# Birthday Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, tap-driven romantic birthday web page (envelope → letter → balloon pop → cake candles → fireworks finale), deployable to GitHub Pages.

**Architecture:** Single-page Vite + TypeScript app. A tiny scene manager in `main.ts` mounts one scene module at a time into `#app` with GSAP transitions. All user-editable content lives in `src/config.ts`. No framework, canvas 2D only.

**Tech Stack:** bun (package manager), Vite, TypeScript, GSAP, canvas-confetti.

**Spec:** `docs/superpowers/specs/2026-09-16-birthday-page-design.md`

## Global Constraints

- Use **bun** for all JS dependency installs and scripts (`bun install`, `bun run build`). Never npm/yarn/pnpm.
- No UI framework (no React/Svelte/etc.). Runtime deps limited to `gsap` and `canvas-confetti`.
- `vite.config.ts` must set `base: './'` so the site works under a GitHub Pages project path.
- Mobile-first: every scene is full-viewport (`100dvh`), portrait-first, tap targets ≥ 44px, safe-area insets respected.
- Respect `prefers-reduced-motion`: disable particle loops and fireworks when set.
- All interactions must work with mouse click as well as touch.
- Audio must degrade gracefully: missing `music.mp3` or blocked autoplay must never break the page.
- No test framework (project has none). Verification per task: `bun run build` passes (runs `tsc --noEmit` + `vite build`); scene tasks additionally get a manual check via `bun run dev`.
- Commit after every task.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/style.css`
- Create: `src/config.ts`
- Create: `src/scenes/types.ts`
- Create: `src/main.ts`
- Create: `.gitignore`

**Interfaces:**
- Produces: `AppConfig` / `config` (from `src/config.ts`), `Scene` / `SceneContext` (from `src/scenes/types.ts`) — every later task consumes these exact shapes:

```ts
// src/scenes/types.ts
import type { AppConfig } from "../config";
import type { AudioManager } from "../audio";

export interface SceneContext {
  config: AppConfig;
  audio: AudioManager;
  goToNext: () => void;
}

export interface Scene {
  mount(container: HTMLElement, ctx: SceneContext): void;
  unmount(): void;
}
```

Note: `types.ts` imports `AudioManager` from `../audio`, which is created in Task 2. To keep Task 1's build green, create a minimal stub `src/audio.ts` now (replaced in Task 2):

```ts
// src/audio.ts (stub for Task 1, fully replaced in Task 2)
export class AudioManager {
  muted = false;
  unlock() {}
  pop() {}
  chime() {}
  whoosh() {}
  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }
}
```

- [x] **Step 1: Create `package.json`**

```json
{
  "name": "birthday-page",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.3",
    "gsap": "^3.12.5"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
```

- [x] **Step 2: Create `tsconfig.json`, `vite.config.ts`, `.gitignore`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

```ts
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
});
```

```
node_modules/
dist/
```

- [x] **Step 3: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Happy Birthday 💖</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <button id="mute" aria-label="Toggle sound">🔊</button>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [x] **Step 4: Create `src/config.ts`**

```ts
export interface AppConfig {
  name: string;
  letterText: string;
  balloonWords: string[];
  candleCount: number;
  finalMessage: string;
  photos: string[];
}

// === EDIT THIS FILE to personalize the page ===
export const config: AppConfig = {
  name: "Beautiful",
  letterText:
    "Happy birthday, my love!\nAnother year of you being the best part of my life.\nI hope today is as wonderful as you are.",
  balloonWords: ["You", "are", "the", "cutest", "person", "ever"],
  candleCount: 5,
  finalMessage: "I love you to the moon and back 💕",
  photos: ["photos/photo1.svg", "photos/photo2.svg", "photos/photo3.svg"],
};
```

- [x] **Step 5: Create `src/scenes/types.ts`, `src/audio.ts` stub, and minimal `src/main.ts`**

`src/scenes/types.ts` and `src/audio.ts`: use the exact code from the Interfaces block above.

```ts
// src/main.ts (minimal for Task 1; replaced in Task 4)
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.textContent = "🎂";
```

- [x] **Step 6: Create base `src/style.css`**

```css
:root {
  --pink: #ff6b9d;
  --pink-light: #ffa8c5;
  --yellow: #ffd166;
  --purple: #c5a3ff;
  --blue: #6bd4ff;
  --ink: #4a2c4a;
  --bg-1: #ffe0ec;
  --bg-2: #e0d4ff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: "Baloo 2", system-ui, sans-serif;
  color: var(--ink);
  background: linear-gradient(160deg, var(--bg-1), var(--bg-2));
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

#app {
  position: fixed;
  inset: 0;
}

.scene {
  position: absolute;
  inset: 0;
  height: 100dvh;
  overflow: hidden;
}

.scene > div {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

button {
  font-family: inherit;
  border: none;
  cursor: pointer;
  touch-action: manipulation;
}

#mute {
  position: fixed;
  top: max(12px, env(safe-area-inset-top));
  right: 12px;
  z-index: 50;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  font-size: 22px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
}

#mute.visible {
  opacity: 1;
  pointer-events: auto;
}

.hidden {
  display: none !important;
}

.heart {
  position: absolute;
  pointer-events: none;
  will-change: transform;
}

.continue-btn,
.wish-btn,
.replay-btn {
  min-height: 48px;
  padding: 12px 28px;
  border-radius: 999px;
  background: var(--pink);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 4px 0 #d14d7d;
}

.continue-btn:active,
.wish-btn:active,
.replay-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #d14d7d;
}

.hint {
  font-size: 1.1rem;
  font-weight: 700;
  opacity: 0.75;
  margin-bottom: 16px;
}
```

- [x] **Step 7: Install and verify build**

Run: `bun install && bun run build`
Expected: install succeeds; `dist/` is produced with `index.html` and assets; no TypeScript errors.

- [x] **Step 8: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src .gitignore bun.lock
git commit -m "Scaffold Vite + TS birthday page project"
```

---

### Task 2: Audio manager

**Files:**
- Modify: `src/audio.ts` (replace stub)
- Modify: `src/main.ts` (wire mute button)

**Interfaces:**
- Produces: `AudioManager` with public API used by all scenes:
  - `new AudioManager(src: string)`
  - `unlock(): void` — call from the first user gesture; creates the `AudioContext`, starts music, fades volume to 0.5
  - `pop()`, `chime()`, `whoosh(): void` — WebAudio sound effects (no asset files needed)
  - `toggleMute(): boolean` — returns new muted state; also mutes the music element
  - `muted: boolean`

- [x] **Step 1: Replace `src/audio.ts`**

```ts
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
```

- [x] **Step 2: Wire the mute button in `src/main.ts`**

```ts
import "./style.css";
import { AudioManager } from "./audio";

const audio = new AudioManager("music.mp3");

const muteBtn = document.querySelector<HTMLButtonElement>("#mute")!;
muteBtn.addEventListener("click", () => {
  muteBtn.textContent = audio.toggleMute() ? "🔇" : "🔊";
});

document.querySelector<HTMLDivElement>("#app")!.textContent = "🎂";
```

- [x] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS, no TypeScript errors.

- [x] **Step 4: Commit**

```bash
git add src/audio.ts src/main.ts
git commit -m "Add audio manager with music fade-in and WebAudio sfx"
```

---

### Task 3: FX modules (hearts + fireworks)

**Files:**
- Create: `src/fx/hearts.ts`
- Create: `src/fx/fireworks.ts`

**Interfaces:**
- Produces:
  - `startFloatingHearts(container: HTMLElement): () => void` — ambient rising hearts; returns a stop function. No-op when `prefers-reduced-motion` is set.
  - `burstHearts(container: HTMLElement, clientX: number, clientY: number, count?: number): void` — radial heart burst at a viewport point (converts to container-relative coords internally).
  - `class Fireworks { constructor(canvas: HTMLCanvasElement); start(): void; stop(): void; explode(): void }` — `start()` is a no-op under `prefers-reduced-motion`.

- [ ] **Step 1: Create `src/fx/hearts.ts`**

```ts
import gsap from "gsap";

const HEART_COLORS = ["#ff6b9d", "#ffa8c5", "#ffd166", "#c5a3ff"];
const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function startFloatingHearts(container: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const timers: number[] = [];
  let stopped = false;

  const spawn = () => {
    if (stopped) return;
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💖";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = "0";
    heart.style.color =
      HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    heart.style.fontSize = `${12 + Math.random() * 20}px`;
    container.appendChild(heart);
    gsap.fromTo(
      heart,
      { y: window.innerHeight + 40, rotation: -15 },
      {
        y: -60,
        rotation: 15,
        duration: 6 + Math.random() * 4,
        ease: "none",
        onComplete: () => heart.remove(),
      },
    );
    timers.push(window.setTimeout(spawn, 700 + Math.random() * 800));
  };

  spawn();
  return () => {
    stopped = true;
    timers.forEach(clearTimeout);
  };
}

export function burstHearts(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  count = 10,
) {
  const rect = container.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "💖";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    container.appendChild(heart);
    const angle = (Math.PI * 2 * i) / count;
    const dist = 60 + Math.random() * 80;
    gsap.to(heart, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      opacity: 0,
      scale: 0.5,
      duration: 0.9,
      ease: "power2.out",
      onComplete: () => heart.remove(),
    });
  }
}
```

- [ ] **Step 2: Create `src/fx/fireworks.ts`**

```ts
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
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: PASS (modules compile even though nothing imports them yet — add `"noUnusedLocals": false` is NOT needed since they export everything).

- [ ] **Step 4: Commit**

```bash
git add src/fx
git commit -m "Add heart particle and fireworks FX modules"
```

---

### Task 4: Scene manager + envelope scene

**Files:**
- Modify: `src/main.ts` (replace minimal version)
- Create: `src/scenes/envelope.ts`
- Modify: `src/style.css` (append envelope styles)

**Interfaces:**
- Consumes: `Scene`, `SceneContext` (Task 1), `AudioManager` (Task 2), `startFloatingHearts`, `burstHearts` (Task 3).
- Produces: scene-factory pattern every later scene task follows:

```ts
export function createXScene(): Scene {
  let cleanups: (() => void)[] = [];
  return {
    mount(container, ctx) { /* ... */ },
    unmount() {
      cleanups.forEach((fn) => fn());
      cleanups = [];
    },
  };
}
```

- Produces: `main.ts` scene manager contract — scenes live in an ordered array; `goToNext()` fades out the current scene, calls its `unmount()`, mounts the next; the mute button becomes visible from scene index ≥ 1.

- [ ] **Step 1: Create `src/scenes/envelope.ts`**

```ts
import gsap from "gsap";
import type { Scene, SceneContext } from "./types";
import { startFloatingHearts, burstHearts } from "../fx/hearts";

export function createEnvelopeScene(): Scene {
  let cleanups: (() => void)[] = [];
  return {
    mount(container: HTMLElement, ctx: SceneContext) {
      container.innerHTML = `
        <div class="envelope-scene">
          <div class="envelope" role="button" tabindex="0" aria-label="Open the envelope">
            <div class="envelope-body">💌</div>
            <div class="envelope-flap"></div>
          </div>
          <p class="prompt">Tap to open</p>
        </div>`;
      cleanups.push(startFloatingHearts(container));

      const envelope = container.querySelector<HTMLElement>(".envelope")!;
      const flap = container.querySelector<HTMLElement>(".envelope-flap")!;
      const wobble = gsap.to(envelope, {
        rotation: 3,
        yoyo: true,
        repeat: -1,
        duration: 0.8,
        ease: "sine.inOut",
      });
      cleanups.push(() => wobble.kill());

      const open = (e: Event) => {
        ctx.audio.unlock(); // first gesture unlocks audio (mobile autoplay rules)
        ctx.audio.whoosh();
        wobble.kill();
        const rect = envelope.getBoundingClientRect();
        const cx = e instanceof MouseEvent ? e.clientX : rect.left + rect.width / 2;
        const cy = e instanceof MouseEvent ? e.clientY : rect.top + rect.height / 2;
        burstHearts(container, cx, cy, 14);
        gsap
          .timeline({ onComplete: () => ctx.goToNext() })
          .to(flap, { rotationX: 180, duration: 0.5, ease: "power2.in" })
          .to(envelope, { scale: 1.15, opacity: 0, duration: 0.6, ease: "power2.in" }, "-=0.1");
      };
      envelope.addEventListener("click", open, { once: true });
      cleanups.push(() => envelope.removeEventListener("click", open));
    },
    unmount() {
      cleanups.forEach((fn) => fn());
      cleanups = [];
    },
  };
}
```

- [ ] **Step 2: Replace `src/main.ts` with the scene manager**

```ts
import gsap from "gsap";
import "./style.css";
import { config } from "./config";
import { AudioManager } from "./audio";
import type { Scene, SceneContext } from "./scenes/types";
import { createEnvelopeScene } from "./scenes/envelope";

const scenes: Scene[] = [createEnvelopeScene()];

const app = document.querySelector<HTMLDivElement>("#app")!;
const audio = new AudioManager("music.mp3");
let current = 0;
let active: Scene | null = null;

const muteBtn = document.querySelector<HTMLButtonElement>("#mute")!;
muteBtn.addEventListener("click", () => {
  muteBtn.textContent = audio.toggleMute() ? "🔇" : "🔊";
});

function mountScene(index: number) {
  const container = document.createElement("div");
  container.className = "scene";
  app.appendChild(container);
  const ctx: SceneContext = { config, audio, goToNext };
  const scene = scenes[index];
  scene.mount(container, ctx);
  active = scene;
  gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6 });
}

function goToNext() {
  if (!active || current >= scenes.length - 1) return;
  const oldContainer = activeContainer();
  active.unmount();
  active = null;
  current++;
  if (oldContainer) {
    gsap.to(oldContainer, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => oldContainer.remove(),
    });
  }
  if (current >= 1) muteBtn.classList.add("visible");
  mountScene(current);
}

function activeContainer(): HTMLElement | null {
  return app.querySelector<HTMLElement>(".scene:last-child");
}

mountScene(0);
```

- [ ] **Step 3: Append envelope styles to `src/style.css`**

```css
.envelope-scene {
  background: radial-gradient(circle at 50% 30%, #fff0f6, transparent 60%);
}

.envelope {
  position: relative;
  width: min(70vw, 300px);
  aspect-ratio: 3 / 2;
  will-change: transform;
  transform-style: preserve-3d;
}

.envelope-body {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: clamp(48px, 18vw, 96px);
  background: var(--pink-light);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(209, 77, 125, 0.35);
}

.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: var(--pink);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top;
  z-index: 1;
  backface-visibility: visible;
}

.prompt {
  margin-top: 24px;
  font-size: 1.2rem;
  font-weight: 700;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    transform: scale(1.08);
  }
}
```

- [ ] **Step 4: Verify build + manual check**

Run: `bun run build`
Expected: PASS.
Then: `bun run dev`, open the URL in a mobile device-emulation viewport (e.g. iPhone 14, 390×844).
Expected: envelope wobbles on a pastel background, hearts float up, tap opens flap and fades to... (no next scene yet — `goToNext` is a no-op at the last scene, which is fine for now).

- [ ] **Step 5: Commit**

```bash
git add src/main.ts src/scenes/envelope.ts src/style.css
git commit -m "Add scene manager and envelope opening scene"
```

---

### Task 5: Letter scene

**Files:**
- Create: `src/scenes/letter.ts`
- Modify: `src/main.ts` (register scene)
- Modify: `src/style.css` (append letter styles)

**Interfaces:**
- Consumes: scene-factory pattern (Task 4), `ctx.config.name`, `ctx.config.letterText`, `ctx.config.photos`, `ctx.audio.chime()`, `ctx.goToNext()`.
- Produces: `createLetterScene(): Scene`.

- [ ] **Step 1: Create `src/scenes/letter.ts`**

```ts
import gsap from "gsap";
import type { Scene, SceneContext } from "./types";

export function createLetterScene(): Scene {
  let timers: number[] = [];
  return {
    mount(container: HTMLElement, ctx: SceneContext) {
      container.innerHTML = `
        <div class="letter-scene">
          <div class="letter-card">
            <h1 class="letter-title"></h1>
            <p class="letter-text"></p>
            <div class="photo-strip">
              ${ctx.config.photos
                .map((p) => `<img src="${p}" alt="" onerror="this.remove()" />`)
                .join("")}
            </div>
          </div>
          <button class="continue-btn hidden">There's more 🎈</button>
        </div>`;

      const title = container.querySelector<HTMLElement>(".letter-title")!;
      const text = container.querySelector<HTMLElement>(".letter-text")!;
      const btn = container.querySelector<HTMLButtonElement>(".continue-btn")!;

      const typeInto = (el: HTMLElement, content: string, done: () => void) => {
        let i = 0;
        const tick = () => {
          el.textContent = content.slice(0, ++i);
          if (i < content.length) timers.push(window.setTimeout(tick, 45));
          else done();
        };
        tick();
      };

      ctx.audio.chime();
      gsap.from(container.querySelector(".letter-card"), {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      typeInto(title, `Happy Birthday, ${ctx.config.name}! 🎂`, () => {
        typeInto(text, ctx.config.letterText, () => {
          btn.classList.remove("hidden");
          gsap.from(btn, { scale: 0, duration: 0.5, ease: "back.out(2)" });
        });
      });
      btn.addEventListener("click", () => ctx.goToNext(), { once: true });
    },
    unmount() {
      timers.forEach(clearTimeout);
      timers = [];
    },
  };
}
```

- [ ] **Step 2: Register the scene in `src/main.ts`**

Add the import and append to the array — the file changes to:

```ts
import { createEnvelopeScene } from "./scenes/envelope";
import { createLetterScene } from "./scenes/letter";

const scenes: Scene[] = [createEnvelopeScene(), createLetterScene()];
```

- [ ] **Step 3: Append letter styles to `src/style.css`**

```css
.letter-scene {
  justify-content: flex-start;
  padding-top: max(48px, env(safe-area-inset-top));
  overflow-y: auto;
}

.letter-card {
  background: #fffaf0;
  border-radius: 16px;
  padding: 24px;
  width: min(92vw, 420px);
  box-shadow: 0 10px 30px rgba(74, 44, 74, 0.2);
}

.letter-title {
  font-size: 1.6rem;
  color: var(--pink);
  min-height: 2.2em;
}

.letter-text {
  margin-top: 12px;
  font-size: 1.05rem;
  line-height: 1.6;
  white-space: pre-wrap;
  min-height: 6em;
}

.photo-strip {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
}

.photo-strip img {
  width: 30%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
}

.letter-scene .continue-btn {
  margin: 24px 0;
  flex-shrink: 0;
}
```

- [ ] **Step 4: Verify build + manual check**

Run: `bun run build`
Expected: PASS.
Manual: `bun run dev` → open envelope → letter types out, continue button appears, tapping it is a no-op (last scene). Mute button now visible.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/letter.ts src/main.ts src/style.css
git commit -m "Add typewriter letter scene"
```

---

### Task 6: Balloon pop scene

**Files:**
- Create: `src/scenes/balloons.ts`
- Modify: `src/main.ts` (register scene)
- Modify: `src/style.css` (append balloon styles)

**Interfaces:**
- Consumes: scene-factory pattern, `ctx.config.balloonWords: string[]`, `ctx.audio.pop()`, `burstHearts(container, clientX, clientY, count)` (Task 3).
- Produces: `createBalloonsScene(): Scene`. Behavior contract: balloons release one at a time; a balloon that floats off-screen unpopped is re-released with the same word (scene can never soft-lock); after the last word is popped a continue button appears.

- [ ] **Step 1: Create `src/scenes/balloons.ts`**

```ts
import gsap from "gsap";
import type { Scene, SceneContext } from "./types";
import { burstHearts } from "../fx/hearts";

const BALLOON_COLORS = ["#ff6b9d", "#ffd166", "#6bd4ff", "#c5a3ff", "#7ee8a2"];

export function createBalloonsScene(): Scene {
  let cleanups: (() => void)[] = [];
  return {
    mount(container: HTMLElement, ctx: SceneContext) {
      const words = ctx.config.balloonWords;
      container.innerHTML = `
        <div class="balloons-scene">
          <p class="balloon-sentence" aria-live="polite"></p>
          <p class="hint">Pop the balloons! 🎈</p>
        </div>`;
      const sentence = container.querySelector<HTMLElement>(".balloon-sentence")!;
      const sceneEl = container.querySelector<HTMLElement>(".balloons-scene")!;
      let index = 0;

      const releaseBalloon = () => {
        if (index >= words.length) {
          const btn = document.createElement("button");
          btn.className = "continue-btn";
          btn.textContent = "One more thing… 🎂";
          btn.style.position = "absolute";
          btn.style.bottom = "15%";
          btn.addEventListener("click", () => ctx.goToNext(), { once: true });
          sceneEl.appendChild(btn);
          gsap.from(btn, { scale: 0, duration: 0.5, ease: "back.out(2)" });
          return;
        }
        const word = words[index];
        const balloon = document.createElement("button");
        balloon.className = "balloon";
        balloon.textContent = word;
        balloon.style.background = BALLOON_COLORS[index % BALLOON_COLORS.length];
        balloon.style.left = `${10 + Math.random() * 70}%`;
        sceneEl.appendChild(balloon);

        let popped = false;
        const float = gsap.fromTo(
          balloon,
          { bottom: "-20%" },
          {
            bottom: "110%",
            duration: 9,
            ease: "none",
            onComplete: () => {
              if (popped) return;
              balloon.remove();
              releaseBalloon(); // escaped unpopped: retry same word
            },
          },
        );

        balloon.addEventListener(
          "click",
          (e) => {
            popped = true;
            float.kill();
            ctx.audio.pop();
            burstHearts(sceneEl, e.clientX, e.clientY, 8);
            const span = document.createElement("span");
            span.textContent = word;
            sentence.appendChild(span);
            gsap.from(span, { scale: 0, duration: 0.4, ease: "back.out(2)" });
            balloon.remove();
            index++;
            releaseBalloon();
          },
          { once: true },
        );
        cleanups.push(() => float.kill());
      };

      releaseBalloon();
    },
    unmount() {
      cleanups.forEach((fn) => fn());
      cleanups = [];
    },
  };
}
```

- [ ] **Step 2: Register the scene in `src/main.ts`**

```ts
import { createBalloonsScene } from "./scenes/balloons";

const scenes: Scene[] = [
  createEnvelopeScene(),
  createLetterScene(),
  createBalloonsScene(),
];
```

- [ ] **Step 3: Append balloon styles to `src/style.css`**

```css
.balloons-scene {
  justify-content: flex-start;
  padding-top: max(48px, env(safe-area-inset-top));
}

.balloon-sentence {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  min-height: 2.5em;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--pink);
}

.balloon {
  position: absolute;
  bottom: -20%;
  min-width: 72px;
  min-height: 88px;
  padding: 12px;
  border-radius: 50% 50% 50% 50% / 55% 55% 45% 45%;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: inset -6px -8px 0 rgba(0, 0, 0, 0.08);
  z-index: 1;
}

.balloon::after {
  content: "";
  position: absolute;
  bottom: -14px;
  left: 50%;
  width: 2px;
  height: 16px;
  background: rgba(0, 0, 0, 0.2);
}
```

- [ ] **Step 4: Verify build + manual check**

Run: `bun run build`
Expected: PASS.
Manual: `bun run dev` → walk through to balloons; pop each balloon, sentence builds word by word, continue button appears after the last word. Let one balloon escape to confirm it re-releases.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/balloons.ts src/main.ts src/style.css
git commit -m "Add balloon pop scene"
```

---

### Task 7: Cake & candles scene

**Files:**
- Create: `src/scenes/cake.ts`
- Modify: `src/main.ts` (register scene)
- Modify: `src/style.css` (append cake styles)

**Interfaces:**
- Consumes: scene-factory pattern, `ctx.config.candleCount: number`, `ctx.audio.whoosh()`, `ctx.audio.chime()`, `ctx.goToNext()`.
- Produces: `createCakeScene(): Scene`. Behavior contract: one tap per candle extinguishes it; a dim overlay fades in proportionally (`0.15 + out/total * 0.75`); when all candles are out, `goToNext()` fires after a 1.2s pause.

- [ ] **Step 1: Create `src/scenes/cake.ts`**

```ts
import gsap from "gsap";
import type { Scene, SceneContext } from "./types";

export function createCakeScene(): Scene {
  let cleanups: (() => void)[] = [];
  return {
    mount(container: HTMLElement, ctx: SceneContext) {
      const n = Math.max(1, ctx.config.candleCount);
      container.innerHTML = `
        <div class="cake-scene">
          <p class="hint">Tap each candle to blow it out 🕯️</p>
          <div class="cake">
            <div class="candles">
              ${Array.from(
                { length: n },
                () => `
                <button class="candle" aria-label="Blow out candle">
                  <span class="flame"></span>
                </button>`,
              ).join("")}
            </div>
            <div class="cake-body">🎂</div>
          </div>
          <div class="dim-overlay"></div>
        </div>`;

      const overlay = container.querySelector<HTMLElement>(".dim-overlay")!;
      const candles = [
        ...container.querySelectorAll<HTMLButtonElement>(".candle"),
      ];
      let out = 0;

      candles.forEach((candle) => {
        candle.addEventListener("click", () => {
          if (candle.classList.contains("out")) return;
          candle.classList.add("out");
          ctx.audio.whoosh();
          out++;
          gsap.to(overlay, {
            opacity: 0.15 + (out / n) * 0.75,
            duration: 0.6,
          });
          if (out === n) {
            ctx.audio.chime();
            const delayed = gsap.delayedCall(1.2, () => ctx.goToNext());
            cleanups.push(() => delayed.kill());
          }
        });
      });
    },
    unmount() {
      cleanups.forEach((fn) => fn());
      cleanups = [];
    },
  };
}
```

- [ ] **Step 2: Register the scene in `src/main.ts`**

```ts
import { createCakeScene } from "./scenes/cake";

const scenes: Scene[] = [
  createEnvelopeScene(),
  createLetterScene(),
  createBalloonsScene(),
  createCakeScene(),
];
```

- [ ] **Step 3: Append cake styles to `src/style.css`**

```css
.cake {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.candles {
  display: flex;
  gap: clamp(12px, 4vw, 24px);
  margin-bottom: -8px;
  z-index: 1;
}

.candle {
  width: 24px;
  height: 64px;
  border-radius: 6px;
  background: repeating-linear-gradient(
    45deg,
    #fff,
    #fff 6px,
    var(--pink) 6px,
    var(--pink) 12px
  );
  position: relative;
}

.flame {
  position: absolute;
  top: -22px;
  left: 50%;
  width: 16px;
  height: 22px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: radial-gradient(circle at 50% 70%, #fff3b0, var(--yellow) 60%, #ff9f1c);
  animation: flicker 0.25s ease-in-out infinite alternate;
  box-shadow: 0 0 18px 6px rgba(255, 209, 102, 0.6);
}

@keyframes flicker {
  from {
    transform: translateX(-50%) scale(1);
  }
  to {
    transform: translateX(-50%) scale(1.15, 0.9);
  }
}

.candle.out .flame {
  display: none;
}

.cake-body {
  font-size: clamp(120px, 45vw, 220px);
  line-height: 1;
}

.dim-overlay {
  position: absolute;
  inset: 0;
  background: #1a1030;
  opacity: 0;
  pointer-events: none;
}
```

- [ ] **Step 4: Verify build + manual check**

Run: `bun run build`
Expected: PASS.
Manual: walk to the cake scene; each tap kills a flame and dims the scene; after the last candle the scene goes dark and auto-advances (currently a no-op as the last scene).

- [ ] **Step 5: Commit**

```bash
git add src/scenes/cake.ts src/main.ts src/style.css
git commit -m "Add cake and candles scene"
```

---

### Task 8: Finale scene (fireworks + confetti + final message)

**Files:**
- Create: `src/scenes/finale.ts`
- Modify: `src/main.ts` (register scene)
- Modify: `src/style.css` (append finale styles)

**Interfaces:**
- Consumes: scene-factory pattern, `ctx.config.name`, `ctx.config.finalMessage`, `ctx.config.photos`, `ctx.audio.chime()`, `Fireworks` (Task 3: `new Fireworks(canvas)`, `start()`, `stop()`, `explode()`), `canvas-confetti` default export `confetti(options)`.
- Produces: `createFinaleScene(): Scene`. Behavior contract: "Make a wish ✨" button starts fireworks + repeating confetti rain and reveals the final message; a "More fireworks! 🎆" replay button re-triggers a celebration burst. Under `prefers-reduced-motion`, fireworks and confetti rain are skipped and the message is shown directly.

- [ ] **Step 1: Create `src/scenes/finale.ts`**

```ts
import gsap from "gsap";
import confetti from "canvas-confetti";
import type { Scene, SceneContext } from "./types";
import { Fireworks } from "../fx/fireworks";

const CONFETTI_COLORS = ["#ff6b9d", "#ffd166", "#c5a3ff", "#ffffff"];

export function createFinaleScene(): Scene {
  let fireworks: Fireworks | null = null;
  let rainTimer = 0;
  return {
    mount(container: HTMLElement, ctx: SceneContext) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      container.innerHTML = `
        <div class="finale-scene">
          <canvas class="fireworks-canvas"></canvas>
          <div class="finale-content">
            <button class="wish-btn">Make a wish ✨</button>
            <div class="finale-message hidden">
              <h2>Happy Birthday, ${ctx.config.name}! 🎉</h2>
              <p>${ctx.config.finalMessage}</p>
              <div class="photo-strip">
                ${ctx.config.photos
                  .map((p) => `<img src="${p}" alt="" onerror="this.remove()" />`)
                  .join("")}
              </div>
              <button class="replay-btn">More fireworks! 🎆</button>
            </div>
          </div>
        </div>`;

      const canvas = container.querySelector<HTMLCanvasElement>(".fireworks-canvas")!;
      fireworks = new Fireworks(canvas);
      const wishBtn = container.querySelector<HTMLButtonElement>(".wish-btn")!;
      const message = container.querySelector<HTMLElement>(".finale-message")!;

      const celebrate = () => {
        ctx.audio.chime();
        fireworks!.start();
        fireworks!.explode();
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: CONFETTI_COLORS,
        });
        if (!reduced && rainTimer === 0) {
          const rain = () => {
            confetti({
              particleCount: 30,
              spread: 70,
              origin: { y: 0 },
              colors: CONFETTI_COLORS,
            });
            rainTimer = window.setTimeout(rain, 800);
          };
          rain();
        }
        message.classList.remove("hidden");
        gsap.from(message, { opacity: 0, y: 30, duration: 1 });
      };

      wishBtn.addEventListener(
        "click",
        () => {
          wishBtn.remove();
          celebrate();
        },
        { once: true },
      );
      container
        .querySelector<HTMLButtonElement>(".replay-btn")!
        .addEventListener("click", celebrate);
    },
    unmount() {
      fireworks?.stop();
      fireworks = null;
      clearTimeout(rainTimer);
      rainTimer = 0;
    },
  };
}
```

- [ ] **Step 2: Register the scene in `src/main.ts`**

```ts
import { createFinaleScene } from "./scenes/finale";

const scenes: Scene[] = [
  createEnvelopeScene(),
  createLetterScene(),
  createBalloonsScene(),
  createCakeScene(),
  createFinaleScene(),
];
```

- [ ] **Step 3: Append finale styles to `src/style.css`**

```css
.finale-scene {
  background: linear-gradient(180deg, #14102e, #2b1b4d);
}

.fireworks-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.finale-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.finale-message h2 {
  color: #fff;
  font-size: 1.8rem;
  text-shadow: 0 0 20px rgba(255, 107, 157, 0.8);
}

.finale-message p {
  color: var(--pink-light);
  font-size: 1.15rem;
  margin-top: 8px;
}

.finale-message .photo-strip img {
  border: 3px solid rgba(255, 255, 255, 0.6);
}

.finale-message .replay-btn {
  margin-top: 16px;
}

.wish-btn {
  font-size: 1.3rem;
}
```

- [ ] **Step 4: Verify build + manual check**

Run: `bun run build`
Expected: PASS.
Manual: full walkthrough end-to-end in mobile emulation. Tap "Make a wish" → fireworks + confetti + message. Replay button re-triggers bursts. Mute toggle works from the letter scene onward.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/finale.ts src/main.ts src/style.css
git commit -m "Add fireworks finale scene"
```

---

### Task 9: Placeholder assets, GitHub Action, README

**Files:**
- Create: `public/photos/photo1.svg`, `public/photos/photo2.svg`, `public/photos/photo3.svg`
- Create: `public/music.mp3` (best-effort via ffmpeg; page works without it)
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: `config.photos` paths (`photos/photo1.svg` … relative to the built site root), `AudioManager("music.mp3")`.
- Produces: deploy pipeline — pushing to `main` publishes `dist/` to the `gh-pages` branch.

- [ ] **Step 1: Create placeholder photos**

Create `public/photos/photo1.svg`, `photo2.svg`, `photo3.svg` — same template, different gradient colors and emoji (💗 / 🌸 / ⭐). Template for `photo1.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff6b9d"/>
      <stop offset="1" stop-color="#c5a3ff"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="200" y="230" font-size="120" text-anchor="middle">💗</text>
</svg>
```

`photo2.svg`: gradient `#ffd166` → `#ff6b9d`, emoji `🌸`. `photo3.svg`: gradient `#6bd4ff` → `#c5a3ff`, emoji `⭐`.

- [ ] **Step 2: Generate placeholder music (best-effort)**

Run:

```bash
if command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -y \
    -f lavfi -i "sine=frequency=261.63:duration=8" \
    -f lavfi -i "sine=frequency=329.63:duration=8" \
    -f lavfi -i "sine=frequency=392.00:duration=8" \
    -filter_complex "amix=inputs=3,volume=0.25" \
    public/music.mp3
else
  echo "ffmpeg not found — skipping placeholder music (AudioManager handles the missing file)"
fi
```

Expected: `public/music.mp3` exists, or the skip message printed. Either outcome is acceptable; do not install ffmpeg.

- [ ] **Step 3: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
          force_orphan: true
```

- [ ] **Step 4: Create `README.md`**

```markdown
# Birthday Page 💖

A mobile-first interactive birthday surprise: envelope → letter → balloon pop → candles → fireworks.

## Develop

    bun install
    bun run dev

## Build & serve

    bun run build      # outputs static site to dist/
    bun run preview    # serves dist/ locally

Any static file server pointed at `dist/` works too.

## Personalize

Edit `src/config.ts` — name, letter text, balloon words, candle count, final
message, photo paths. Replace the files in `public/photos/` (keep the same
filenames or update the config) and drop the real song in as
`public/music.mp3`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to the `gh-pages` branch. In the repo settings, set
Pages to serve from the `gh-pages` branch (root).
```

- [ ] **Step 5: Final verification**

Run: `bun run build && bun run preview`
Expected: build passes; preview serves the site. Walk through all 5 scenes once more in mobile emulation (390×844): envelope opens → letter types → balloons pop in order → candles dim the room → finale fires fireworks and shows the message with placeholder photos. Check mute toggle and that the page still works with `public/music.mp3` deleted (temporarily rename it, reload, confirm no breakage, restore).

- [ ] **Step 6: Commit**

```bash
git add public .github README.md
git commit -m "Add placeholder assets, GitHub Pages deploy workflow, README"
```
