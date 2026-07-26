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
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_SITE_URL=https://ilkerbalcilar.xyz
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
# Explicit so payload.config's production branch (Spaces-backed media URLs) is
# what the SSG prerender bakes into the HTML.
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=build-time-placeholder
ENV DATABASE_URI=file:./webgooh.db
RUN bun run build

# ─── runner ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
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
