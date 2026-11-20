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
| `bun run build`          | Production build (needs a migrated DB)   |
| `bun run start`          | Production server                        |
| `bun run lint`           | ESLint (type-aware)                      |
| `bun run type-check`     | `tsc --noEmit`                           |
| `bun run test`           | Unit tests (`bun test`)                  |
| `bun run format`         | Prettier                                 |
| `bun run generate:types` | Generate Payload TypeScript types        |
| `bun run migrate:create` | Generate a migration (Node 26)           |
| `bun run migrate:check`  | Fail if the config differs from `src/migrations` |

## Rendering & revalidation

The image is built against an empty, freshly migrated database: the live one
(which holds leads) never leaves the droplet. So nothing that shows CMS content
is prerendered at build time:

- Content routes without parameters (`/`, `/blog`, `/hizmetlerimiz`,
  `/referanslar`, `/hakkimizda`, `/iletisim`, `sitemap.xml`, `rss.xml`) are
  `force-dynamic`: rendered per request from the data cache below.
- `[slug]` routes are generated on their first request and then served from
  Next's cache (ISR): `generateStaticParams` finds no documents at build, and
  `dynamicParams` is on.

Data access is tagged via `unstable_cache` (`src/lib/queries.ts`), and Payload
`afterChange` / `afterDelete` hooks invalidate only the affected tags
(`src/hooks/*`, `src/lib/cache-tags.ts`), so editing content in the panel
refreshes just the impacted pages. The data cache and ISR pages live in the
container and start empty on every release; only the image optimizer's cache is
persisted on the host.

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
docker build --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=... .
docker compose up -d
```

The build migrates an empty database inside the builder stage and runs
`next build` against it; `.dockerignore` keeps every `*.db` out of the build
context. At start the server applies pending migrations to the real database.

- The SQLite file lives in a host bind mount (`/opt/webgooh/data` →
  `/app/data/webgooh.db`); media is in the Spaces bucket.
- `GET /api/health` runs a Payload query: the container healthcheck and the
  deploy's health gate both use it, so a release that cannot read its database
  is rolled back. With `HEALTH_REQUIRE_DATA=true` (the compose default) a
  database without users also fails, which catches a wrong or empty mount.
- The compose file's host paths default to the droplet's; locally (Docker
  Desktop does not share `/opt`) set `DATA_DIR` and `IMAGE_CACHE_DIR`.
- Pass `NEXT_PUBLIC_TURNSTILE_SITE_KEY` as a build arg and the remaining secrets as
  runtime environment variables (see `docker-compose.yml`).

### CI and deploy

- Pull requests: `check` (format, lint, type-check, tests, migrations, generated
  Payload files, audit, actionlint) and `image` (builds the image, scans it with
  Trivy, boots it with `docker-compose.yml` on an empty database and runs
  `scripts/smoke.ts` against it). Both are required, and branches must be up to
  date with `main` before merging.
- Push to `main`: `image` again, then the exact image that passed the smoke test
  is pushed as `:<commit sha>` and deployed with `Jubstaaa/deploy-actions`. The
  deploy snapshots `webgooh.db` (SQLite online backup, integrity-checked, kept
  in `/opt/webgooh/snapshots`, newest 5) before the new tag starts. If the new
  tag never turns healthy, it is rolled back to the previous tag **and** the
  snapshot is restored first, so the old code never runs on a schema it does not
  know.
- Manual rollback to a known-good release:
  `gh workflow run deploy.yml --ref main -f image_tag=<sha>`. When the release
  being rolled back applied a migration, add `-f restore_snapshot=true`: that
  starts `<sha>` on the newest snapshot taken while `<sha>` was running and
  discards every write made since (the replaced database is kept as
  `webgooh.db.failed-<UTC>`).
- Rollback targets must contain `/api/health`: the deploy uploads this
  repository's `docker-compose.yml`, whose healthcheck probes it, so an image
  built before it existed never turns healthy. To go back that far, deploy that
  release's `docker-compose.yml` by hand.

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

## Database migrations

Production runs with `NODE_ENV=production`, where Payload never pushes schema, so `src/migrations` is the only way a schema change reaches the live SQLite database. Pending migrations run automatically at server start (`prodMigrations` in `src/payload.config.ts`, triggered by `src/instrumentation.ts`), before the container turns healthy. CI's `image` job proves every migration applies to an empty database on each pull request; the deploy snapshots the live database first. A failing migration fails the health check, and the deploy rolls back and restores the snapshot instead of going live.

Migrations must stay backward compatible for one release: add columns and tables, do not rename or drop what the running release still reads. A manual rollback without `restore_snapshot` runs the previous image on the migrated schema, so it must still work there; drop the old column in a later release.

Local development keeps using push mode; never run `bun run migrate` against a database that development pushed to.

### Upgrading Payload or changing a collection

1. Bump every `payload` / `@payloadcms/*` package to the same version (or edit the collection), then run `bun run migrate:create <name>` under Node 26 (`fnm exec --using=26 bun run migrate:create <name>`).
2. Review the generated SQL in `src/migrations/` and commit it with the change. CI's `bun run migrate:check` fails when the Payload config and the committed migrations disagree, which is what catches an upgrade that quietly adds a column.
3. Merge: the deploy snapshots the live database, then applies the migration at start. The nightly Cronicle "droplet backup" stays the off-host copy.
4. After the deploy, `bun run migrate:status` (or `select * from payload_migrations` on the droplet) shows it applied.

The first migration is a baseline of the 3.94 schema. On a database that already has it (production) it only records itself in `payload_migrations`. On an empty one it builds the schema.

## Dependency audit

CI runs `bun run audit` (`bun audit --audit-level=high`) and fails on any high or critical advisory, with no exceptions.

`package.json` overrides `happy-dom` to `^21.0.4`: Payload 3.x pins `@lexical/headless` 0.50, which asks for `happy-dom` 20 (GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8). Lexical 0.53 already uses `happy-dom` 21, and the site never runs Lexical's server-side HTML conversion, so the newer version is a drop-in. Drop the override once Payload ships `@lexical/headless` ≥ 0.53.
