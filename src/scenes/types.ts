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
