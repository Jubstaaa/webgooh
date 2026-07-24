import { Feed } from 'feed'

import { getPosts } from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

export const dynamic = 'force-static'

export async function GET() {
    const posts = await getPosts()

    const feed = new Feed({
        copyright: `© ${new Date().getFullYear()} Webgooh`,
        description:
            'Yazılım, tasarım, siber güvenlik ve dijital büyüme üzerine güncel içerikler.',
        feedLinks: { rss: `${SITE_URL}/rss.xml` },
        id: `${SITE_URL}/blog`,
        language: 'tr',
        link: `${SITE_URL}/blog`,
        title: 'Webgooh Blog',
    })

    for (const post of posts) {
        const url = `${SITE_URL}/blog/${post.slug}`
        feed.addItem({
            date: new Date(post.publishedAt ?? post.updatedAt),
            description: post.excerpt,
            id: url,
            link: url,
            title: post.title,
            ...(post.author ? { author: [{ name: post.author }] } : {}),
        })
    }

    return new Response(feed.rss2(), {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
}
