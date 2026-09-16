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
