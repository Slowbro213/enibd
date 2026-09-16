import gsap from "gsap";
import "./style.css";
import { config } from "./config";
import { AudioManager } from "./audio";
import type { Scene, SceneContext } from "./scenes/types";
import { createEnvelopeScene } from "./scenes/envelope";
import { createLetterScene } from "./scenes/letter";
import { createBalloonsScene } from "./scenes/balloons";
import { createCakeScene } from "./scenes/cake";
import { createFinaleScene } from "./scenes/finale";

const scenes: Scene[] = [
  createEnvelopeScene(),
  createLetterScene(),
  createBalloonsScene(),
  createCakeScene(),
  createFinaleScene(),
];

const app = document.querySelector<HTMLDivElement>("#app")!;
const audio = new AudioManager();
let current = 0;
let active: Scene | null = null;

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
  mountScene(current);
}

function activeContainer(): HTMLElement | null {
  return app.querySelector<HTMLElement>(".scene:last-child");
}

mountScene(0);
