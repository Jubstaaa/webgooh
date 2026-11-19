import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Media: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        // The only public read left: in dev, uploads are served from disk
        // through /api/media/file/*, which goes through access control. In
        // production the S3 plugin serves them off the CDN instead.
        read: anyone,
        update: authenticated,
    },
    fields: [
        {
            admin: {
                description: 'Erişilebilirlik ve SEO için görsel açıklaması.',
            },
            label: 'Alternatif Metin',
            name: 'alt',
            required: true,
            type: 'text',
        },
        {
            label: 'Açıklama (Caption)',
            name: 'caption',
            type: 'text',
        },
    ],
    labels: {
        plural: 'Medya',
        singular: 'Medya',
    },
    slug: 'media',
    upload: {
        focalPoint: true,
        formatOptions: { format: 'webp', options: { quality: 78 } },
        // Raster formats only: SVG is script-capable, and every upload is
        // re-encoded to WebP anyway.
        mimeTypes: ['image/avif', 'image/jpeg', 'image/png', 'image/webp'],
        resizeOptions: {
            fit: 'inside',
            height: 2000,
            width: 2000,
            withoutEnlargement: true,
        },
    },
}
