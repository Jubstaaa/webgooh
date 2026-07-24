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
        adminThumbnail: 'thumbnail',
        focalPoint: true,
        imageSizes: [
            { height: 300, name: 'thumbnail', position: 'centre', width: 400 },
            { height: 512, name: 'card', position: 'centre', width: 768 },
            { height: 900, name: 'feature', position: 'centre', width: 1400 },
        ],
        mimeTypes: ['image/*'],
    },
}
