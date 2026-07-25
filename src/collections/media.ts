import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Media: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        group: 'İçerik',
    },
    fields: [
        {
            admin: {
                description: 'Erişilebilirlik ve SEO için görsel açıklaması.',
            },
            name: 'alt',
            required: true,
            type: 'text',
        },
        {
            name: 'caption',
            type: 'text',
        },
    ],
    labels: {
        plural: 'Medya',
        singular: 'Görsel',
    },
    slug: 'media',
    upload: {
        focalPoint: true,
        formatOptions: { format: 'webp', options: { quality: 78 } },
        mimeTypes: ['image/*'],
        resizeOptions: {
            fit: 'inside',
            height: 2000,
            width: 2000,
            withoutEnlargement: true,
        },
    },
}
