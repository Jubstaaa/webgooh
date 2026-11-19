# Webgooh

Corporate website and blog for a software, mobile, UX/UI, SEO, cybersecurity and
DevOps agency. Built as a single **Next.js 16 (App Router, full SSG)** application
with an embedded **Payload CMS 3** and **SQLite**.

## Stack

| Layer            | Technology                                            |
| ---------------- | ----------------------------------------------------- |
| Framework        | Next.js 16 (App Router, standalone output, full SSG)  |
| CMS              | Payload CMS 3 (same app, `/admin`)                    |
| Database         | SQLite (`@payloadcms/db-sqlite`)                      |
| Styling          | Tailwind CSS v4                                       |
| Animation        | Motion (Framer Motion)                                |
| Icons            | lucide-react                                          |
| Package manager  | Bun                                                   |
| Deployment       | Docker + docker compose                               |

## Getting started

```bash
bun install
cp .env.example .env        # fill in the values
bun run dev                 # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin`. On first run, create the initial admin
user through the panel’s sign-up screen.

## Scripts

| Command                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `bun run dev`            | Development server                       |
| `bun run build`          | Production build (prerenders all pages)  |
| `bun run start`          | Production server                        |
| `bun run lint`           | ESLint (type-aware)                      |
| `bun run type-check`     | `tsc --noEmit`                           |
| `bun run format`         | Prettier                                 |
| `bun run generate:types` | Generate Payload TypeScript types        |

## Rendering & revalidation

All public pages are statically generated. Data access is tagged via
`unstable_cache` (`src/lib/queries.ts`), and Payload `afterChange` / `afterDelete`
hooks invalidate only the affected tags (`src/hooks/*`, `src/lib/cache-tags.ts`),
so editing content in the panel refreshes just the impacted pages.

On-demand invalidation endpoint for external triggers (e.g. Cloudflare):
`POST /revalidate` with header `x-revalidate-secret: $REVALIDATION_SECRET` and body
`{ "tags": ["posts"], "paths": ["/blog"] }`.

## Security

- Contact form protected with Cloudflare Turnstile, a honeypot field and per-IP
  rate limiting.
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
  configured in `next.config.mjs`.

## Docker

```bash
docker compose build
docker compose up -d
```

- The SQLite file lives on the `webgooh-db` volume (`/app/data/webgooh.db`).
- Uploaded media lives on the `webgooh-media` volume (`/app/media`).
- Pass `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a build arg and the remaining secrets as
  runtime environment variables (see `docker-compose.yml`).

## Project structure

```
src/
  app/(frontend)/   # public site (thin route files → views)
  app/(payload)/    # Payload admin + REST/GraphQL (generated)
  views/            # feature/screen-level components (flat, dot-suffix)
  components/       # shared UI, cards, layout, motion, sections, form
  collections/      # Payload collections
  globals/          # Payload globals (site settings)
  hooks/            # Payload revalidation hooks
  lib/              # queries, cache-tags, media, seo, utils
  fields/           # reusable Payload fields (slug, seo)
```

## Dependency audit

CI runs `bun run audit` (`bun audit --audit-level=high`) and fails on any high or critical advisory, with no exceptions.

`package.json` overrides `happy-dom` to `^21.0.4`: Payload 3.x pins `@lexical/headless` 0.50, which asks for `happy-dom` 20 (GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8). Lexical 0.53 already uses `happy-dom` 21, and the site never runs Lexical's server-side HTML conversion, so the newer version is a drop-in. Drop the override once Payload ships `@lexical/headless` ≥ 0.53.
