import { withPayload } from '@payloadcms/next/withPayload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

const isDev = process.env.NODE_ENV !== 'production'

const CDN_HOST = 'https://webgooh.fra1.cdn.digitaloceanspaces.com'
const TURNSTILE_HOST = 'https://challenges.cloudflare.com'

// Deliberately nonce-free. A nonce has to be minted per request, which would
// drag every blog and service page out of the static cache and onto the 1 vCPU
// droplet. So inline scripts stay allowed and the value of the policy is in the
// origin allowlist: only this host, the Spaces CDN and Turnstile.
const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${TURNSTILE_HOST}${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data: ${CDN_HOST}`,
    "font-src 'self' data:",
    // blob: for the admin panel, which previews uploads and runs the editor's
    // workers off blob URLs.
    "worker-src 'self' blob:",
    `media-src 'self' blob: ${CDN_HOST}`,
    `connect-src 'self' ${TURNSTILE_HOST}${isDev ? ' ws:' : ''}`,
    `frame-src ${TURNSTILE_HOST}`,
    // 'self' rather than 'none': Payload's live preview iframes the site back
    // into the admin panel.
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        // webp only, deliberately. On this 1 vCPU droplet an AVIF encode costs
        // ~3.7x the CPU of the equivalent WebP (0.58s vs 0.16s at w=828) for
        // roughly 10% fewer bytes. The blog index asks for 17 images at once,
        // so those encodes serialise: AVIF made the last one land at ~11s,
        // WebP brings the whole batch under 3s.
        formats: ['image/webp'],
        remotePatterns: [
            { protocol: 'https', hostname: 'www.webgooh.com' },
            { protocol: 'https', hostname: 'webgooh.com' },
            // Payload media + public assets, served from the Spaces CDN edge.
            // Keep in sync with S3_BUCKET/S3_REGION in src/payload.config.ts.
            {
                protocol: 'https',
                hostname: 'webgooh.fra1.cdn.digitaloceanspaces.com',
            },
        ],
    },
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }]
    },
    env: {
        NEXT_PUBLIC_SITE_URL: SITE_URL,
    },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
