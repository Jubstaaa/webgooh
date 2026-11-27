import { withPayload } from '@payloadcms/next/withPayload'
import { PHASE_PRODUCTION_BUILD } from 'next/constants.js'

import { CDN_BASE, CDN_HOSTNAME, SITE_URL } from './src/lib/site.mjs'

const isDev = process.env.NODE_ENV !== 'production'

const TURNSTILE_HOST = 'https://challenges.cloudflare.com'

const CF_INSIGHTS_SCRIPT = 'https://static.cloudflareinsights.com'
const CF_INSIGHTS_REPORT = 'https://cloudflareinsights.com'

const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${TURNSTILE_HOST} ${CF_INSIGHTS_SCRIPT}${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data: ${CDN_BASE}`,
    "font-src 'self' data:",

    "worker-src 'self' blob:",
    `media-src 'self' blob: ${CDN_BASE}`,
    `connect-src 'self' ${TURNSTILE_HOST} ${CF_INSIGHTS_REPORT}${isDev ? ' ws:' : ''}`,
    `frame-src ${TURNSTILE_HOST}`,

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

const nextConfig = {
    env: {
        NEXT_PUBLIC_SITE_URL: SITE_URL,
    },
    experimental: {
        globalNotFound: true,
    },
    async headers() {
        return [{ headers: securityHeaders, source: '/:path*' }]
    },
    images: {
        formats: ['image/webp'],
        remotePatterns: [
            { hostname: 'www.webgooh.com', protocol: 'https' },
            { hostname: 'webgooh.com', protocol: 'https' },

            { hostname: CDN_HOSTNAME, protocol: 'https' },
        ],
    },
    output: 'standalone',
    poweredByHeader: false,
    reactStrictMode: true,
}

export default function config(phase) {
    if (
        phase === PHASE_PRODUCTION_BUILD &&
        !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ) {
        throw new Error(
            'NEXT_PUBLIC_TURNSTILE_SITE_KEY must be set for a production build.'
        )
    }

    return scopeClientHintsToAdmin(
        withPayload(nextConfig, { devBundleServerPackages: false })
    )
}

function scopeClientHintsToAdmin(config) {
    const { headers } = config

    return {
        ...config,
        async headers() {
            const rules = await headers()

            return rules.map(rule =>
                rule.source === '/:path*' &&
                rule.headers.some(header => header.key === 'Accept-CH')
                    ? { ...rule, source: '/admin/:path*' }
                    : rule
            )
        },
    }
}
