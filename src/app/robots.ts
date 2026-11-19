import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site.mjs'

const INDEXABLE = process.env.SITE_INDEXABLE === 'true'

export default function robots(): MetadataRoute.Robots {
    if (!INDEXABLE) {
        return {
            rules: { disallow: '/', userAgent: '*' },
        }
    }

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
