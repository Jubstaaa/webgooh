import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import {
    revalidateCategoryAfterChange,
    revalidateCategoryAfterDelete,
} from '@/hooks/revalidate-category'

export const Categories: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['title', 'slug'],
        useAsTitle: 'title',
    },
    fields: [
        {
            label: 'Ad',
            name: 'title',
            required: true,
            type: 'text',
        },
        slugField(),
        {
            label: 'Açıklama',
            name: 'description',
            type: 'textarea',
        },
        {
            admin: {
                description: 'HEX renk (örn. #6366f1) — rozet rengi.',
            },
            label: 'Renk',
            name: 'color',
            type: 'text',
        },
    ],
    hooks: {
        afterChange: [revalidateCategoryAfterChange],
        afterDelete: [revalidateCategoryAfterDelete],
    },
    labels: {
        plural: 'Kategoriler',
        singular: 'Kategori',
    },
    slug: 'categories',
}
