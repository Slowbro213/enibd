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
