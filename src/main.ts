import "./style.css";
import { AudioManager } from "./audio";

const audio = new AudioManager("music.mp3");

const muteBtn = document.querySelector<HTMLButtonElement>("#mute")!;
muteBtn.addEventListener("click", () => {
  muteBtn.textContent = audio.toggleMute() ? "🔇" : "🔊";
});

document.querySelector<HTMLDivElement>("#app")!.textContent = "🎂";
