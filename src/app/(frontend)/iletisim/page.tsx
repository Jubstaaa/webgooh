import type { Metadata } from 'next'

import { Contact } from '@/app/(frontend)/iletisim/_components/contact'

export const metadata: Metadata = {
    alternates: { canonical: '/iletisim' },
    description:
        'Web, mobil, siber güvenlik ve DevOps projeleriniz için bizimle iletişime geçin. İlk görüşme ücretsiz.',
    title: 'İletişim',
}

export default function ContactPage() {
    return <Contact />
}
