import type { Metadata } from 'next'

import { Blog } from '@/views/blog/blog'

export const metadata: Metadata = {
    alternates: { canonical: '/blog' },
    description:
        'Yazılım, tasarım, siber güvenlik ve dijital büyüme üzerine güncel içerikler ve rehberler.',
    title: 'Blog',
}

export default function BlogPage() {
    return <Blog />
}
