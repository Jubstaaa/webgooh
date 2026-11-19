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
| `bun run test`           | Unit tests (`bun test`)                  |
| `bun run format`         | Prettier                                 |
| `bun run generate:types` | Generate Payload TypeScript types        |

## Rendering & revalidation

All public pages are statically generated. Data access is tagged via
`unstable_cache` (`src/lib/queries.ts`), and Payload `afterChange` / `afterDelete`
hooks invalidate only the affected tags (`src/hooks/*`, `src/lib/cache-tags.ts`),
so editing content in the panel refreshes just the impacted pages.

There is no external revalidation endpoint: invalidation happens in-process from
the Payload hooks.

## Security

- Contact form protected with Cloudflare Turnstile (fails closed: no secret, no
  submit; a production build fails without the site key), a honeypot field and
  length-capped, schema-validated input. Per-IP rate limiting belongs at the
  Cloudflare edge (WAF rate-limiting rule), not in the app.
- Admin sign-in through Cloudflare Access trusts only the signed
  `Cf-Access-Jwt-Assertion`, verified against the team's JWKS with the
  application's audience (`CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`).
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
  configured in `next.config.mjs`.

## Docker

```bash
docker build --build-context prerender-db=./data \
    --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=... .
docker compose up -d
```

The build prerenders against `./data/webgooh.db`, bind-mounted for that one step
only; `.dockerignore` keeps every `*.db` out of the build context.

- The SQLite file lives on the `webgooh-db` volume (`/app/data/webgooh.db`).
- Uploaded media lives on the `webgooh-media` volume (`/app/media`).
- Pass `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a build arg and the remaining secrets as
  runtime environment variables (see `docker-compose.yml`).

## Project structure

Grouped by route, colocated: code lives next to the only route that uses it and
moves to a shared folder once a second user appears.

```
src/
  app/(frontend)/            # public site
    _components/             # site-wide layout parts (header, footer, nav, cursor)
      home/                  # home page sections (page.tsx is the group root)
    blog/_components/        # parts used only by /blog (likewise hakkimizda/,
                             # hizmetlerimiz/, iletisim/, referanslar/)
  app/(payload)/             # Payload admin + REST (generated)
  components/                # UI used by more than one route
  collections/ globals/ fields/ hooks/   # Payload config, per Payload's layout
  lib/                       # queries, cache tags, media, seo, site constants
  access.ts                  # Payload access helpers
```

## Dependency audit

CI runs `bun run audit` (`bun audit --audit-level=high`) and fails on any high or critical advisory, with no exceptions.

`package.json` overrides `happy-dom` to `^21.0.4`: Payload 3.x pins `@lexical/headless` 0.50, which asks for `happy-dom` 20 (GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8). Lexical 0.53 already uses `happy-dom` 21, and the site never runs Lexical's server-side HTML conversion, so the newer version is a drop-in. Drop the override once Payload ships `@lexical/headless` ≥ 0.53.
