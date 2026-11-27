import type { Metadata } from 'next'

import { About } from '@/app/(frontend)/hakkimizda/_components/about'

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
