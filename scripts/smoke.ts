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
    { contains: '<title>Webgooh — Web Yazılım', path: '/', status: 200 },
    { contains: '<title>Blog — Webgooh', path: '/blog', status: 200 },
    {
        contains: '<title>Hizmetler — Webgooh',
        path: '/hizmetlerimiz',
        status: 200,
    },
    {
        contains: '<title>Referanslar — Webgooh',
        path: '/referanslar',
        status: 200,
    },
    {
        contains: '<title>Hakkımızda — Webgooh',
        path: '/hakkimizda',
        status: 200,
    },
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

// A hung route must fail with its path instead of stalling the job, and a
// connection error must not hide the results collected before it.
async function get(path: string) {
    return fetch(new URL(path, base), {
        redirect: 'manual',
        signal: AbortSignal.timeout(15_000),
    })
}

for (const { contains, path, status } of checks) {
    try {
        const response = await get(path)
        const body = await response.text()

        if (response.status !== status) {
            failures.push(`${path}: expected ${status}, got ${response.status}`)
        } else if (contains && !body.includes(contains)) {
            failures.push(`${path}: body does not contain ${contains}`)
        } else {
            process.stdout.write(`ok  ${response.status} ${path}\n`)
        }
    } catch (error) {
        failures.push(`${path}: ${String(error)}`)
    }
}

try {
    const home = await get('/')
    if (!home.headers.get('content-security-policy')) {
        failures.push('/: Content-Security-Policy header missing')
    }
} catch (error) {
    failures.push(`/ (headers): ${String(error)}`)
}

if (failures.length > 0) {
    console.error(failures.join('\n'))
    process.exit(1)
}
