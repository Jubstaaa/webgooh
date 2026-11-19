import type { Metadata } from 'next'

import { Services } from '@/app/(frontend)/hizmetlerimiz/_components/services'

export const metadata: Metadata = {
    alternates: { canonical: '/hizmetlerimiz' },
    description:
        'Web yazılım, mobil uygulama, UX/UI tasarım, SEO, siber güvenlik ve DevOps hizmetleri.',
    title: 'Hizmetler',
}

export default function ServicesPage() {
    return <Services />
}
