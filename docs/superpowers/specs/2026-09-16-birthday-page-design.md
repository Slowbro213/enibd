# Birthday Page — Design Spec

**Date:** 2026-09-16
**Goal:** A flashy, romantic, mobile-first single-page web experience to wish the user's girlfriend a happy birthday (Sep 17). Hosted on GitHub Pages, built with bun + Vite.

## Experience

A tap-driven sequence of interactive scenes, "cute & playful" vibe: pastel candy palette, rounded chunky typography (Baloo 2 via Google Fonts), floating hearts, bouncy GSAP animations. All scenes are full-viewport (`100dvh`), portrait-first, with large tap targets (min 44px).

### Scenes (in order)

1. **Envelope (landing)**
   - Pastel gradient background, gently floating heart particles.
   - A sealed envelope with a wobble idle animation and "Tap to open 💌" prompt.
   - The first tap unlocks the Web Audio context (required for mobile autoplay) and starts background music.
2. **Letter reveal**
   - Envelope flap opens, letter slides out, confetti burst, music fades in.
   - "Happy Birthday, {name}!" with a typewriter effect, followed by the configured letter text.
   - Tap to continue to the next scene.
3. **Balloon pop**
   - Balloons float up from the bottom; each carries one word of a configured message.
   - Popping a balloon bursts hearts and reveals its word in a growing sentence at the top.
   - Scene completes when all balloons are popped; continue button appears.
4. **Cake & candles**
   - A birthday cake with N lit candles (N configurable, `candleCount` in config).
   - Tapping a candle extinguishes it, one tap per candle; the scene dims as flames go out.
   - When all candles are out: brief darkness, then transition to finale.
5. **Finale**
   - "Make a wish ✨" button triggers a fireworks show (custom canvas) plus confetti rain (canvas-confetti).
   - Final love message displayed under the fireworks. Replay button restarts fireworks.

### Global UI

- Mute/unmute toggle, fixed top-right, visible from scene 2 onward.
- Music: single looping mp3 from `public/`, placeholder track until the user swaps in her song. Volume fades in on scene 2.
- Scene transitions: GSAP-driven (fade/slide), no page reloads; one `index.html`.

## Personalization

All user-editable content lives in **`src/config.ts`**, a single typed object:

- `name`: her name
- `letterText`: the letter message
- `balloonWords`: array of words for the balloon scene
- `candleCount`: number of candles
- `finalMessage`: the finale message
- `photos`: array of image paths shown in the letter/finale (placeholder images in `public/photos/` until real ones are dropped in)

No other files need editing to personalize the page.

## Architecture

```
├── .github/workflows/deploy.yml   # build + publish to gh-pages
├── index.html                     # single page, scene containers
├── public/                        # static assets: music, placeholder photos
│   ├── music.mp3
│   └── photos/
├── src/
│   ├── main.ts                    # bootstraps app, registers scenes
│   ├── config.ts                  # ALL user-editable content
│   ├── style.css                  # global styles, palette, typography
│   ├── audio.ts                   # music + sfx manager, mute state
│   ├── scenes/
│   │   ├── envelope.ts
│   │   ├── letter.ts
│   │   ├── balloons.ts
│   │   ├── cake.ts
│   │   └── finale.ts
│   └── fx/
│       ├── hearts.ts              # floating/bursting heart particles
│       └── fireworks.ts           # canvas fireworks
└── package.json, tsconfig.json, vite.config.ts
```

### Scene interface

Each scene module exports `mount(container: HTMLElement, ctx: SceneContext): void` and `unmount(): void`. `SceneContext` carries the config, the audio manager, and a `goToNext()` callback. `main.ts` is a simple scene manager: one scene mounted at a time, GSAP transition between them.

### Dependencies (managed with bun)

- `vite` (dev) — build tool
- `typescript` (dev)
- `gsap` — animations and transitions
- `canvas-confetti` + `@types/canvas-confetti` — confetti bursts/rain

No framework. No other runtime deps.

## Build & deploy

- `bun install` — install deps
- `bun run dev` — local dev server
- `bun run build` — outputs static site to `dist/` (with `base: './'` so it works under a GitHub Pages project path)
- **GitHub Action** (`.github/workflows/deploy.yml`): on push to `main` → checkout → setup bun → `bun install` → `bun run build` → push `dist/` contents to `gh-pages` branch (force-update), which GitHub Pages serves. Requires repo Pages setting: serve from `gh-pages` branch, root.
- "Open a web server at the project root and view the site": after `bun run build`, `dist/` is servable by any static server; `bun run preview` also works.

## Error handling & edge cases

- Audio blocked/autoplay failures: page works fully silent; mute toggle reflects actual state.
- Photos missing: `onerror` fallback hides the image gracefully (letter/finale still work).
- Reduced motion: respect `prefers-reduced-motion` — disable particle loops and heavy fireworks (simple static finale instead).
- Touch-only assumptions avoided: all interactions work with mouse click too.
- WebGL avoided entirely; canvas 2D only, so no GPU context issues on low-end phones.

## Testing

- No test framework; project has no existing tests. Verification is manual:
  - `bun run build` succeeds with no TypeScript errors (`tsc --noEmit` as part of build).
  - Serve `dist/` locally and walk through all 5 scenes on a mobile viewport (dev tools device emulation), checking tap targets, audio unlock, and scene transitions.
  - GitHub Action validated by pushing to `main` and confirming `gh-pages` updates.
