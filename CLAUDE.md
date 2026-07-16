# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a single-page personal portfolio/CV site built with Next.js 16 (App Router) and React 19. The entire visible page (`app/page.tsx`) is a stack of `<section>`-based components rendered inside one `<main>`: Hero → About → Experience → Why me → Skills → Rooftop → Footer, with a persistent `<Nav>` in the root layout. The design uses a "rooftop / building" visual metaphor (see component names like `rooftop`, `bottomBar`, `radioTowerIcon`).

## Commands

- `npm run dev` — start the dev server (Next.js, default port 3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (flat config in `eslint.config.mjs`)

There is no test suite configured in this repo.

## Path aliases

Defined in `tsconfig.json`, used throughout instead of relative imports:

- `@/*` → `./*`
- `@utils/*` → `./app/utils/*`
- `@hooks/*` → `./app/hooks/*`
- `@ui/*` → `./app/ui/*`
- `@components*` → `./app/components/*` (note: no `/` before `*`)
- `@constants*` → `./app/constants/*` (note: no `/` before `*`)

## Architecture

### `app/ui/` vs `app/components/`

- `app/ui/` — generic, reusable, presentational primitives with no page-specific knowledge (Button, Card, Badge, Dialog, Typography, Section, InputOrTextarea, icons, etc). Each has a co-located `*.module.css`.
- `app/components/` — page sections and feature-specific composites (hero, about, experience, whyMe, skills, nav, footer, rooftop). Each component folder typically has: `X.tsx`, `X.module.css`, and `X.constants.tsx` (copy/labels/data extracted out of the component).

This `constants.tsx`-per-component pattern is used consistently — when adding or editing copy/labels for a component, check for a sibling `*.constants.tsx` file first rather than inlining strings.

### Styling convention

Components don't branch on className/props for visual variants. Instead they set `data-variant`, `data-color`, etc. attributes and let CSS Modules select on `[data-variant="..."]` (see `Typography`, `Button`). Combine class names with the `concatStyles` util (`app/utils/concatStyles.tsx`) rather than template strings.

### Section fade-in / scroll tracking (why there are "headless" client components)

Two behaviors are implemented as DOM/attribute-driven side effects rather than React state, each split into a tiny `"use client"` wrapper that renders `null` plus a hook:

- **Fade-in on scroll**: `Section` (`app/ui/section/section.tsx`) renders a `SectionObserver` (`app/ui/section/SectionObserver.tsx`) alongside the `<section>`. It calls `useFadeIn` (`app/hooks/useFadeIn.tsx`), which uses an `IntersectionObserver` to flip `data-visible` on the section element; CSS handles the actual transition.
- **Nav link highlighting**: `Nav` renders `TrackAndHighlightNavLinks` (`app/components/nav/trackAndHighlightNavLinks.tsx`), which calls `useHighlightNavLinks` (`app/hooks/useHighlightNavLinks.tsx`). This listens to scroll on `<main>` (throttled via `requestAnimationFrame`), computes which `<section>` is active (with special-cased handling for the last two, shorter sections), and toggles `data-is-in-view` on the corresponding `[data-selection-id]` nav `<li>` plus `aria-current` on that link's `<a>`.

Any new full-page section should be wrapped in `Section` (`app/ui/section/section.tsx`) with a unique `id` to get fade-in and nav-highlighting for free, and that `id` needs a matching entry in `NAV_LINKS` (`app/components/nav/nav.constants.tsx`) if it should appear in the nav.

### Dialog pattern

`Dialog` (`app/ui/dialog/dialog.tsx`) is controlled via an `open` boolean prop, driven by `useState`/`useRef`/`useLayoutEffect` — there is no `openCloseDialog()` function. On open it renders with `role="dialog"`/`aria-modal`, moves focus into the first focusable child (restoring focus to whatever was previously focused when it closes), and marks `<main>`/`<nav>` `inert` for the duration via `document.querySelector`. It also implements manual focus trapping (Tab/Shift+Tab cycling) and Escape-to-close via a `keydown` listener. There is exactly one dialog on the page (the contact `MessageForm`), so the `document.querySelector` calls assume a single dialog instance.

### Contact form / email flow

`MessageForm` (`app/components/hero/messageForm.tsx`) uses React 19's `useActionState` bound to the server action `sendEmail` (`app/utils/sendEmail.tsx`, `"use server"`). Flow:

1. Client submits `FormData`; `handleFormAction` backs up the raw entries in a ref first, since the browser resets form fields even when the action ultimately fails — the backup is used to restore field values on failure (see the `useEffect` in `messageForm.tsx`).
2. Server action sanitizes every field with `isomorphic-dompurify`, then validates with a Zod schema in `handleValidation` (`app/utils/handleValidation.tsx`) — field length limits live in the exported `FIELDS` const there and are reused client-side for `maxLength`/character counters.
3. On success, sends mail via `nodemailer` using Gmail SMTP, with the HTML body rendered through `convertComponentToHtml` (`app/utils/emailHTMLtemplate.tsx`).

Required env vars (see `.env`, gitignored): `PASS`, `SERVICE`, `USER_NAME`, `TO`, `HOST_SUCCESS_RESPONSE`. `HOST_SUCCESS_RESPONSE` is matched as a substring against the SMTP transport response to determine actual success/failure, since nodemailer can resolve without the mail truly having been accepted.

### Fonts

Local variable fonts (Big Shoulders, Inter, JetBrains Mono) are loaded via `next/font/local` in `app/utils/handleFonts.tsx`. Note the loaded font objects are currently unused (prefixed `_`) and `FONTS_VARIABLES` is an empty string — font CSS variables are not currently wired into `className` on `<html>`.

## Linting notes

- `object-shorthand` is enforced as an error.
- Unused vars/args/caught-errors are only a warning, and are exempt entirely when prefixed with `_` (see `handleFonts.tsx` for real usage of this pattern).
