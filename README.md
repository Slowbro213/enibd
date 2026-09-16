# Birthday Page 💖

A mobile-first interactive birthday surprise: envelope → letter → balloon pop → candles → fireworks.

## Develop

    bun install
    bun run dev

## Build & serve

    bun run build      # outputs static site to dist/
    bun run preview    # serves dist/ locally

Any static file server pointed at `dist/` works too.

## Personalize

Edit `src/config.ts` — name, letter text, balloon words, candle count, final
message, photo paths. Replace the files in `public/photos/` (keep the same
filenames or update the config) and drop the real song in as
`public/music.mp3`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to the `gh-pages` branch. In the repo settings, set
Pages to serve from the `gh-pages` branch (root).
