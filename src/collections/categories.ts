import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateCollection } from '@/hooks/revalidate-simple'
import { cacheTags } from '@/lib/cache-tags'

const revalidate = revalidateCollection(cacheTags.categories)

export const Categories: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['title', 'slug'],
        group: 'İçerik',
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            required: true,
            type: 'text',
        },
        slugField(),
        {
            name: 'description',
            type: 'textarea',
        },
        {
            admin: {
                description: 'HEX renk (örn. #6366f1) — rozet rengi.',
            },
            name: 'color',
            type: 'text',
        },
    ],
    hooks: {
        afterChange: [revalidate.afterChange],
        afterDelete: [revalidate.afterDelete],
    },
    labels: {
        plural: 'Kategoriler',
        singular: 'Kategori',
    },
    slug: 'categories',
}
