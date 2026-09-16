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
