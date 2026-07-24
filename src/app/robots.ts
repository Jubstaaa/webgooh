import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

export default function robots(): MetadataRoute.Robots {
    return {
        host: SITE_URL,
        rules: {
            allow: '/',
            disallow: ['/admin', '/api'],
            userAgent: '*',
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
