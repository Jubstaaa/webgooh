import type { Metadata } from 'next'

import { About } from '@/app/(frontend)/hakkimizda/_components/about'

// The image is built against an empty database, so this route renders per
// request from the tagged data cache instead of baking empty content into HTML
// (README: Rendering & revalidation).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    alternates: { canonical: '/hakkimizda' },
    description:
        'Webgooh; yılların ajans tecrübesini yazılım mühendisliği ve siber güvenlik uzmanlığıyla birleştiren yeni nesil dijital ürün stüdyosu.',
    title: 'Hakkımızda',
}

export default function AboutPage() {
    return <About />
}
