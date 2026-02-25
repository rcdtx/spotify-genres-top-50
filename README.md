# Spotify top tracks by genre

Astro app that shows the top 50 Spotify tracks for multiple genres using a Cloudflare Pages Function.

## Tech stack

- Astro (UI)
- Bun (package manager and build runner)
- Cloudflare Pages Functions (`functions/api/get_playlist/[genre].js`)

## Local development

1. Install dependencies:

```bash
bun install
```

2. Create `.dev.vars` for local Cloudflare function env:

```bash
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
```

3. Run local dev (non-deprecated workflow: Astro build watch + Pages dev from `dist`):

```bash
bun run dev
```

4. Build:

```bash
bun run build
```

## Deploy to Cloudflare Pages

1. Connect this repo in Cloudflare Pages.
2. Build command: `bun run build`
3. Build output directory: `dist`
4. Set environment variables:
   - `CLIENT_ID`
   - `CLIENT_SECRET`

Cloudflare Pages will automatically pick up the function in `functions/api/get_playlist/[genre].js`.
