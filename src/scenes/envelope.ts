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
