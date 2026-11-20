import type { Metadata } from 'next'

import { Contact } from '@/app/(frontend)/iletisim/_components/contact'

// The image is built against an empty database, so this route renders per
// request from the tagged data cache instead of baking empty content into HTML
// (README: Rendering & revalidation).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    alternates: { canonical: '/iletisim' },
    description:
        'Web, mobil, siber güvenlik ve DevOps projeleriniz için bizimle iletişime geçin. İlk görüşme ücretsiz.',
    title: 'İletişim',
}

export default function ContactPage() {
    return <Contact />
}
