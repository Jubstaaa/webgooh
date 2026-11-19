# syntax=docker/dockerfile:1

# ─── deps ────────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ─── builder ─────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder
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
# SSG prerenders against a copy of the live DB, which holds leads (PII). It is
# never COPY'd: .dockerignore keeps *.db out of the context, and the named
# `prerender-db` context (a directory holding webgooh.db) is bind-mounted only
# for this step, so it lands in no layer and no build cache. rw because SQLite
# may create its -shm/-wal files beside the database; those writes are thrown
# away with the mount.
#   docker build --build-context prerender-db=./data .
ENV DATABASE_URI=file:/prerender-db/webgooh.db
# Pending Payload migrations are applied to the database copy once, before the
# build: Next's page-data workers each initialise Payload in parallel, and left
# to prodMigrations they race for SQLite's write lock (SQLITE_BUSY) or apply the
# same migration twice. They then find nothing pending. Payload's CLI needs Node
# (its tsx loader hooks fail under Bun), so the binary is copied in off PATH and
# `bun run build` still runs on Bun.
COPY --from=node:26-alpine /usr/local/bin/node /opt/node/bin/node
RUN --mount=type=bind,from=prerender-db,target=/prerender-db,rw \
    /opt/node/bin/node node_modules/payload/bin.js migrate \
    && bun run build

# ─── runner ──────────────────────────────────────────────────────────────
FROM node:26-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

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
# The compose file currently mounts the whole directory, whose host ownership
# already makes this writable, so this is defence in depth rather than load
# bearing: it keeps the image correct on its own, and correct again if the mount
# is ever narrowed back to a subdirectory. Next's with-docker example does the
# same thing and calls it "set the correct permission for prerender cache".
#
# /app/media is gone: uploads go to Spaces via @payloadcms/storage-s3, the host
# bind mount was already dropped, and the directory sat empty in the container.
RUN mkdir -p /app/data /app/.next/cache/images \
    && chown -R nextjs:nodejs /app/data /app/.next/cache

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
