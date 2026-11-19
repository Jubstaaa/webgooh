import type { Metadata } from 'next'

import { References } from '@/app/(frontend)/referanslar/_components/references'

export const metadata: Metadata = {
    alternates: { canonical: '/referanslar' },
    description:
        'Farklı sektörlerden markalar için geliştirdiğimiz web, mobil ve yazılım projeleri.',
    title: 'Referanslar',
}

export default function ReferencesPage() {
    return <References />
}
