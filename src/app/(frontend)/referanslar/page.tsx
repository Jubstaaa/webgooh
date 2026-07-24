import type { Metadata } from 'next'

import { References } from '@/views/references/references'

export const metadata: Metadata = {
    alternates: { canonical: '/referanslar' },
    description:
        'Farklı sektörlerden markalar için geliştirdiğimiz web, mobil ve yazılım projeleri.',
    title: 'Referanslar',
}

export default function ReferencesPage() {
    return <References />
}
