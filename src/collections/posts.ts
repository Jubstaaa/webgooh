import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { slugField } from '@/fields/slug'
import {
    revalidatePostAfterChange,
    revalidatePostAfterDelete,
} from '@/hooks/revalidate-post'

export const Posts: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
        livePreview: {
            url: ({ data }) => `/blog/${data?.slug}`,
        },
        useAsTitle: 'title',
    },
    fields: [
        {
            label: 'Başlık',
            name: 'title',
            required: true,
            type: 'text',
        },
        slugField(),
        {
            admin: {
                description:
                    'Kart ve liste görünümündeki özet. Google açıklaması olarak da kullanılır.',
            },
            label: 'Özet',
            maxLength: 260,
            name: 'excerpt',
            required: true,
            type: 'textarea',
        },
        {
            label: 'Kapak Görseli',
            name: 'coverImage',
            relationTo: 'media',
            required: true,
            type: 'upload',
        },
        {
            label: 'Kategori',
            name: 'category',
            relationTo: 'categories',
            required: true,
            type: 'relationship',
        },
        {
            label: 'İçerik',
            name: 'content',
            required: true,
            type: 'richText',
        },
        {
            admin: {
                date: { pickerAppearance: 'dayAndTime' },
                position: 'sidebar',
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Yayın Tarihi',
            name: 'publishedAt',
            type: 'date',
        },
    ],
    hooks: {
        afterChange: [revalidatePostAfterChange],
        afterDelete: [revalidatePostAfterDelete],
    },
    labels: {
        plural: 'Yazılar',
        singular: 'Yazı',
    },
    slug: 'posts',
    // No autosave, matching the ACW panel: the same editors write for both sites,
    // so they get the same "Taslağı kaydet / Değişiklikleri yayınla" buttons here.
    versions: {
        drafts: true,
        maxPerDoc: 20,
    },
}
