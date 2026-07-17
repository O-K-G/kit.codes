# syntax=docker/dockerfile:1

ARG NODE_VERSION=24-alpine

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
