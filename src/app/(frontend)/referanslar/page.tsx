import type { Metadata } from 'next'

import { References } from '@/app/(frontend)/referanslar/_components/references'

// The image is built against an empty database, so this route renders per
// request from the tagged data cache instead of baking empty content into HTML
// (README: Rendering & revalidation).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    alternates: { canonical: '/referanslar' },
    description:
        'Farklı sektörlerden markalar için geliştirdiğimiz web, mobil ve yazılım projeleri.',
    title: 'Referanslar',
}

export default function ReferencesPage() {
    return <References />
}
