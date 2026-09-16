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
