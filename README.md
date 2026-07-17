# Kit G. — Portfolio

Personal portfolio/CV site for Kit G., a Web Developer building accessible React and Next.js applications for finance and tech. Live at **[https://www.kit.codes](https://www.kit.codes)**.

The site is a single scrolling page (`app/page.tsx`) built around a "rooftop / building" visual metaphor: Hero → About → Experience → Why me → Skills → Rooftop → Footer, with a persistent nav in the root layout.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- TypeScript, CSS Modules
- Contact form: `nodemailer` (Gmail SMTP), `zod` validation, `isomorphic-dompurify` sanitization

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

To exercise the contact form locally, create a `.env` file (gitignored) with:

| Var | Purpose |
| --- | --- |
| `PASS` | SMTP password/app password for the sending Gmail account |
| `SERVICE` | Nodemailer service name (e.g. `gmail`) |
| `USER_NAME` | SMTP username / sending address |
| `TO` | Recipient address for submitted messages |
| `HOST_SUCCESS_RESPONSE` | Substring matched against the SMTP response to confirm a message was actually accepted |

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npm run test` — run the Jest test suite (also runs automatically before `npm run build`)
- `npm run test:watch` — run tests in watch mode
- `npm run test:coverage` — run tests with a coverage report

## Docker

Requires `.env` (see above) — both services load it.

| Action | Command |
| --- | --- |
| Start prod | `docker compose up -d` — serves the production build on `:3000` |
| Stop prod | `docker compose down` |
| Start dev | `docker compose --profile dev up -d dev` — hot reload via bind mount |
| Stop dev | `docker compose --profile dev down` |
| Recreate image + container | add `--build` to any `up` command above |
| Remove **everything** from this project (all services' images/containers/volumes/network) | `docker compose --profile dev --profile playwright down --rmi all -v` |
| Remove base Node images | `docker rmi node:24-alpine node:24-bookworm` |

### iOS/Mac Safari preview windows

Two headed WebKit windows, pointed at the prod `app` service, for manual testing on real Safari rendering. They stay open indefinitely until you close the window. On Linux, they authenticate to your host's X server using your own Xauthority cookie (`$XAUTHORITY`, falling back to `~/.Xauthority`), so no `xhost` setup is needed — just make sure that env var/file exists (it does by default on X11 and XWayland sessions).

They go through a `tls-proxy` service (Caddy, self-signed cert via `tls internal`) instead of hitting `app` directly. The site's CSP sends `upgrade-insecure-requests`, so browsers silently rewrite every asset request from http to https — over plain `app:3000` those upgraded requests have nothing to TLS-handshake with and every asset (CSS, JS, fonts) fails to load. `tls-proxy` gives them a real https endpoint to land on instead, without touching the app's production CSP. It starts automatically as a dependency; no separate command needed.

If the window still fails to open with an X authorization error, grant local access manually as a fallback: `xhost +local:docker` (Arch/CachyOS: `sudo pacman -S xorg-xhost` first).

| Action | Command |
| --- | --- |
| Open iPhone 15 Pro window | `docker compose --profile playwright up --build iphone` |
| Open Mac (Desktop Safari) window | `docker compose --profile playwright up --build mac` |
| Stop + remove just these two (images/containers) | `docker compose --profile playwright down --rmi all -v` |

## Project structure

- `app/ui/` — generic, reusable presentational primitives (Button, Card, Badge, Dialog, Typography, icons, etc.)
- `app/components/` — page sections and feature-specific composites (hero, about, experience, whyMe, skills, nav, footer, rooftop)

Each component folder typically pairs `X.tsx` with `X.module.css` and an `X.constants.tsx` holding its copy/labels/data.

See [`CLAUDE.md`](./CLAUDE.md) for a deeper architecture writeup (path aliases, styling conventions, the fade-in/nav-highlighting hooks, and the contact form flow).

## Credits

- Background video: [Illuminated City At Night](https://www.pexels.com/video/illuminated-city-at-night-14285132/) — free to use.
