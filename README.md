# StreamTube

A simple YouTube search and playback web app running entirely from one Cloudflare Worker.

## Files

- `index.js` - Worker, API routes, and frontend
- `package.json` - Wrangler dependency and commands
- `.gitignore`

## GitHub

Put the files directly at the root of your GitHub repository. Do not put them inside another `streamtube` folder and do not upload the ZIP itself.

## Cloudflare Workers & Pages

Use a Git-connected Worker project with:

- Root directory: `/` (or blank/default)
- Build command: leave blank
- Deploy command: `npx wrangler deploy index.js --name streamtube --compatibility-date 2026-10-01`
- Build output directory: leave blank

The project intentionally has no `public` directory, no `wrangler.toml`, and no static-assets configuration.

## YouTube API key

Create a YouTube Data API v3 key in Google Cloud, then add it in Cloudflare as a Worker secret named:

`YOUTUBE_API_KEY`

The key is only used server-side by the Worker and is never placed in the frontend HTML.

## Local development

```bash
npm install
npx wrangler dev index.js
```

## Deployment

```bash
npx wrangler deploy index.js --name streamtube --compatibility-date 2026-10-01
```

The app uses the official YouTube iframe player. It does not download, scrape, rehost, decrypt, or bypass YouTube protections.
