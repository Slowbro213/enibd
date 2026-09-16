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
