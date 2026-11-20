import type { Metadata } from 'next'

import { Services } from '@/app/(frontend)/hizmetlerimiz/_components/services'

// The image is built against an empty database, so this route renders per
// request from the tagged data cache instead of baking empty content into HTML
// (README: Rendering & revalidation).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    alternates: { canonical: '/hizmetlerimiz' },
    description:
        'Web yazılım, mobil uygulama, UX/UI tasarım, SEO, siber güvenlik ve DevOps hizmetleri.',
    title: 'Hizmetler',
}

export default function ServicesPage() {
    return <Services />
}
