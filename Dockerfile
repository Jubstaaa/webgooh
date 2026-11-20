# syntax=docker/dockerfile:1

# Base images are pinned by digest (Dependabot's docker ecosystem bumps them):
# Bun matches packageManager in package.json, Node matches CI's setup-node.

# ─── deps ────────────────────────────────────────────────────────────────
FROM oven/bun:1.4.4-alpine@sha256:4cf82f5686b196504fe119db3fcd9185b191f82ece82c40680e597228ec6070a AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ─── builder ─────────────────────────────────────────────────────────────
FROM oven/bun:1.4.4-alpine@sha256:4cf82f5686b196504fe119db3fcd9185b191f82ece82c40680e597228ec6070a AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No default: next.config.mjs fails the build when the site key is missing.
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_SITE_URL=https://webgooh.tech
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
# Explicit so payload.config's production branch (Spaces-backed media URLs) is
# what the SSG prerender bakes into the HTML.
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=build-time-placeholder
# The build never sees the live database (it holds leads). It prerenders only
# what needs no content, against an empty database migrated here: CMS routes
# render on request (README: Rendering & revalidation). The migration runs
# once before the build because Next's page-data workers each initialise
# Payload in parallel, and left to prodMigrations they race for SQLite's write
# lock (SQLITE_BUSY). Payload's CLI needs Node (its tsx loader hooks fail under
# Bun), so the binary is copied in off PATH and `bun run build` still runs on
# Bun. The database file stays in this stage, which the runner never copies.
ENV DATABASE_URI=file:/tmp/build.db
COPY --from=node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 /usr/local/bin/node /opt/node/bin/node
RUN /opt/node/bin/node node_modules/payload/bin.js migrate \
    && bun run build

# ─── runner ──────────────────────────────────────────────────────────────
FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# The server runs `node server.js` and nothing else. npm, corepack and yarn ship
# in the base image with their own dependency trees (and their advisories, which
# CI's Trivy scan fails on); removing them keeps the image to what runs.
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx \
    /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# No public/ to copy: every static asset lives in the Spaces bucket, and the
# favicon/robots/sitemap come from Next's src/app file conventions.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Next creates .next/cache itself at runtime, but only if it is allowed to: the
# app runs as nextjs, and standalone output does not ship the directory. Bind
# mounting anything under it makes Docker materialise the missing parents first,
# as root and before USER applies, and Next's own mkdir then fails with EACCES.
# It falls back to an in-memory cache that a container recreate throws away —
# that cost acwistanbul.com a day of CMS edits on 2026-07-26, and this image had
# the same gap.
#
# Load bearing: docker-compose.yml mounts only cache/images, so this is what
# makes /app/.next/cache writable for the data cache and ISR pages. Next's
# with-docker example does the same and calls it "set the correct permission
# for prerender cache".
#
# /app/media is gone: uploads go to Spaces via @payloadcms/storage-s3, the host
# bind mount was already dropped, and the directory sat empty in the container.
RUN mkdir -p /app/data /app/.next/cache/images \
    && chown -R nextjs:nodejs /app/data /app/.next/cache

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
