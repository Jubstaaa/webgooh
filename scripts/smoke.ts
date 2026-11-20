// Smoke test for a running image: `bun scripts/smoke.ts http://127.0.0.1:3001`.
// CI runs it against the candidate container, which boots on an empty database
// and applies every migration at start, so it also proves a fresh install works.
import assert from 'node:assert/strict'

const base = process.argv[2]
assert.ok(base, 'Usage: bun scripts/smoke.ts <base-url>')

interface Check {
    contains?: string
    path: string
    status: number
}

const checks: Check[] = [
    { contains: '"status":"ok"', path: '/api/health', status: 200 },
    { contains: '<h1', path: '/', status: 200 },
    { contains: 'Blog', path: '/blog', status: 200 },
    { path: '/hizmetlerimiz', status: 200 },
    { path: '/referanslar', status: 200 },
    { path: '/hakkimizda', status: 200 },
    { contains: 'name="email"', path: '/iletisim', status: 200 },
    { contains: '<urlset', path: '/sitemap.xml', status: 200 },
    { contains: '<rss', path: '/rss.xml', status: 200 },
    { path: '/robots.txt', status: 200 },
    // The admin panel's own bundle and import map; on an empty database it
    // offers to create the first user.
    { path: '/admin', status: 200 },
    // Slug routes are generated on first request; an unknown slug must 404,
    // not crash the render.
    { path: '/blog/smoke-test-missing-post', status: 404 },
    { path: '/hizmetlerimiz/smoke-test-missing-service', status: 404 },
    { path: '/smoke-test-missing-page', status: 404 },
]

const failures: string[] = []

for (const { contains, path, status } of checks) {
    const response = await fetch(new URL(path, base), { redirect: 'manual' })
    const body = await response.text()

    if (response.status !== status) {
        failures.push(`${path}: expected ${status}, got ${response.status}`)
    } else if (contains && !body.includes(contains)) {
        failures.push(`${path}: body does not contain ${contains}`)
    } else {
        process.stdout.write(`ok  ${response.status} ${path}\n`)
    }
}

const home = await fetch(new URL('/', base))
if (!home.headers.get('content-security-policy')) {
    failures.push('/: Content-Security-Policy header missing')
}

if (failures.length > 0) {
    console.error(failures.join('\n'))
    process.exit(1)
}
