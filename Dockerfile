# syntax=docker/dockerfile:1

ARG NODE_VERSION=24-alpine
# Headed WebKit (for the iPhone/Mac preview windows) needs glibc + apt-installable
# system libs that `playwright install --with-deps` provides — alpine/musl can't
# run it, so that stage uses this Debian-based image instead, on the same major
# Node version.
ARG PLAYWRIGHT_NODE_VERSION=24-bookworm

# ---- base -------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
# libc6-compat is needed on alpine for next's native deps (e.g. sharp)
RUN apk add --no-cache libc6-compat
# Both dev and prod stages build on this one, so updating npm here covers both.
RUN npm install -g npm@latest
WORKDIR /app

# ---- deps ---------------------------------------------------------------
# Installed once, reused by both the dev and builder stages.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev ------------------------------------------------------------------
# Source is bind-mounted over this at runtime (see docker-compose.yml) for
# hot reload; the COPY here just makes the stage runnable standalone too.
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- builder ----------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- storybook (dev, hot reload) ---------------------------------------
# Source is bind-mounted over this at runtime (see docker-compose.yml) for
# hot reload, same pattern as the `dev` stage; the COPY here just makes the
# stage runnable standalone too.
FROM base AS storybook
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 6006
CMD ["npm", "run", "storybook"]

# ---- storybook-builder --------------------------------------------------
FROM base AS storybook-builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build-storybook

# ---- storybook-static (serves the built static Storybook site) ----------
# The Storybook equivalent of the app's builder -> runner split: builds once,
# then serves the static output with http-server instead of a dev server.
FROM base AS storybook-static
COPY --from=deps /app/node_modules ./node_modules
COPY --from=storybook-builder /app/storybook-static ./storybook-static
EXPOSE 6006
CMD ["npx", "http-server", "storybook-static", "-p", "6006", "-a", "0.0.0.0"]

# ---- playwright (headed iPhone/Mac Safari preview windows) --------------
# Points at the already-running `app` (production) service; doesn't build the
# app itself. See docker-compose.yml for the `iphone`/`mac` services that use
# this stage.
FROM node:${PLAYWRIGHT_NODE_VERSION} AS playwright
RUN npm install -g npm@latest
WORKDIR /app
COPY playwright/package.json playwright/package-lock.json ./
RUN npm ci
RUN npx playwright install --with-deps webkit
COPY playwright ./

# ---- runner (production) -----------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# next.config.ts has `output: "standalone"`, so .next/standalone already
# contains a pruned node_modules with only what's needed to run the server.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
