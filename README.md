# kit.codes

The source of [kit.codes](https://www.kit.codes), a web developer's portfolio and landing page.

## About

A single-page site, in English and Hebrew, set in an animated space scene. It's divided into sections,
each with its own route (`/en/about`, `/en/skills`, ...):

- **About**: an introduction.
- **Skills**: skill bars that fill as they come into view.
- **Experience**: a timeline of past work, lit up as the page scrolls.
- **Projects**: a carousel of past work.
- **Contact**: a slide-in drawer with a contact form that sends the message by email.

Links to GitHub, LinkedIn and the resume sit on the side. The site is built with
[Next.js](https://nextjs.org) (App Router, React Compiler) and [next-intl](https://next-intl.dev),
styled with native CSS (CSS Modules), and served with a strict Content Security Policy.

## Requirements

- **Node.js 24** (v24.22.3): the version the project is developed with, and the one its Docker image uses
  (`node:24.22.3-alpine`). It's enforced: `package.json`'s `engines` requires `^24.22.3` (24.22.3 or a
  later Node 24), and `.npmrc`'s `engine-strict=true` makes `npm install` fail on any other version.
- npm (comes with Node.js).
- Docker, optionally, to run it in a container.

## Getting started

```bash
npm install
cp .env.example .env
```

Fill in `.env`: the contact form's mail account (`SERVICE`, `USER_NAME`, `PASS`) and where messages go
(`TO`). See `.env.example` for what each one is. The rest of the site runs without them.

## Running the site

### Development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Changes reload as you save.

With Docker (the `dev` stage of the Dockerfile; the project folder is mounted, so changes reload too):

```bash
docker compose up
```

### Production server

```bash
npm run build
npm start
```

`npm run build` runs the tests first, and only builds if they pass. The server then runs at
[http://localhost:3000](http://localhost:3000).

With Docker (the `production` stage of the Dockerfile). `.env` isn't copied into the image, so it's passed
when the container starts:

```bash
docker build --target production -t kit.codes .
docker run --rm -p 3000:3000 --env-file .env kit.codes
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Runs the tests, then builds for production |
| `npm start` | Starts the production server (after a build) |
| `npm run lint` | Lints the code with ESLint |
| `npm test` | Runs the unit tests (Jest and Testing Library) |
| `npm run test:chrome`, `test:firefox`, `test:safari` | Opens the site in a browser with Playwright, for checking by hand (needs the development server running) |

## Project structure

```
├── messages/             Translations: one JSON file per component, per language
│   ├── en/
│   └── he/
├── public/
│   └── images/           Icons for browsers and devices
├── src/
│   ├── app/              Routes (App Router)
│   │   ├── [locale]/     The page, per language: layout, sections' routes, error and preview images
│   │   ├── [...rest]/    Anything else redirects home
│   │   ├── manifest.ts, robots.ts, sitemap.ts
│   ├── assets/
│   │   ├── fonts/        The fonts (WOFF2), each with its license
│   │   └── images/       Section backgrounds (AVIF, per breakpoint and screen density) and the planet
│   ├── components/       One folder per section (about, skills, projects, experience, contact, home)
│   │   └── ui/           Generic, reusable components (dialog, title, loader, icons, ...)
│   ├── constants/        Shared constants and types (interfaces.ts)
│   ├── hooks/            Shared React hooks
│   ├── i18n/             Language routing and translation loading (next-intl)
│   ├── types/            Type declarations
│   ├── utils/            Shared helpers (mail, validation, rate limiting, fonts, ...)
│   └── proxy.ts          Sends each request to its language (/ → /en)
├── next.config.ts        Security headers, Content Security Policy, React Compiler
├── Dockerfile, compose.yaml
└── .env.example          The contact form's mail settings
```

Imports use path aliases (see `tsconfig.json`): `@components/*`, `@ui/*`, `@constants/*`, `@hooks/*`,
`@utils/*`, `@i18n/*` and `@/*` for anything under `src/`.

## Components

### Structure

Each component lives in its own file, laid out in the same order:

1. **Imports**.
2. **Constants**: the component's own values, such as test IDs (`export const GH_TEST_ID = "gh-test"`)
   and fixed settings. Constants shared between components go in `src/constants/`.
3. **Types**: shared prop types go in `src/constants/interfaces.ts`; a type only one component uses can
   sit in its file.
4. **Code**: any helpers and internal sub-components first, then the component itself, as the default
   export.

```tsx
import { SideLinksProps } from "@constants/interfaces"; // 1. imports
import styles from "./SideLinks.module.css";

export const GH_TEST_ID = "gh-test"; // 2. constants

function AnchorLink(/* ... */) {} // 4. code: helpers first...

export default function SideLinks({ className }: SideLinksProps) {} // ...then the component
```

### Self-contained

- **Every component has its own CSS file**, a CSS Module next to it (`SideLinks.tsx` and
  `SideLinks.module.css`), so its styles are scoped to it and bundled with it.
- **Components should be as independent as possible**: everything a component needs (its markup,
  styles, constants and tests) sits with it, and it relies on others only through their props.
- **Tests sit next to what they test** (`SideLinks.test.tsx`).
- **Text comes from the translations**, never written into the component: `messages/en/` and
  `messages/he/` hold the same keys.

### Generic UI components

Components in `src/components/ui/` are **generic**: they know nothing about the section they're used in,
and get their content and variations through props (labels, icons, `className`, ...). A section-specific
component belongs in its section's folder instead.

## Styling

The site is styled with **native CSS**: CSS Modules per component, with nesting, custom properties and
media queries, plus a few global styles and design tokens in `src/app/[locale]/globals.css`.

Earlier versions used Tailwind CSS. **In the latest version, Tailwind was removed in favor of native
CSS**, so there's no Tailwind configuration or utility classes to learn: each component's styles are
plain CSS in its own file.
