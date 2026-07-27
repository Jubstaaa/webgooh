import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { seoField } from '@/fields/seo'
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
        defaultColumns: ['title', 'category', 'publishedAt', '_status'],
        group: 'İçerik',
        livePreview: {
            url: ({ data }) => `/blog/${data?.slug}`,
        },
        useAsTitle: 'title',
    },
    fields: [
        {
            tabs: [
                {
                    fields: [
                        {
                            name: 'title',
                            required: true,
                            type: 'text',
                        },
                        {
                            admin: {
                                description:
                                    'Kart ve liste görünümündeki özet.',
                            },
                            maxLength: 260,
                            name: 'excerpt',
                            required: true,
                            type: 'textarea',
                        },
                        {
                            name: 'coverImage',
                            relationTo: 'media',
                            required: true,
                            type: 'upload',
                        },
                        {
                            name: 'content',
                            required: true,
                            type: 'richText',
                        },
                    ],
                    label: 'İçerik',
                },
            ],
            type: 'tabs',
        },
        {
            admin: { position: 'sidebar' },
            name: 'category',
            relationTo: 'categories',
            required: true,
            type: 'relationship',
        },
        {
            admin: {
                date: { pickerAppearance: 'dayOnly' },
                position: 'sidebar',
            },
            defaultValue: () => new Date().toISOString(),
            name: 'publishedAt',
            type: 'date',
        },
        {
            admin: { position: 'sidebar' },
            defaultValue: 'Webgooh',
            name: 'author',
            type: 'text',
        },
        {
            admin: {
                description: 'Tahmini okuma süresi (dakika).',
                position: 'sidebar',
            },
            name: 'readingMinutes',
            type: 'number',
        },
        slugField(),
        seoField,
    ],
    hooks: {
        afterChange: [revalidatePostAfterChange],
        afterDelete: [revalidatePostAfterDelete],
    },
    labels: {
        plural: 'Blog Yazıları',
        singular: 'Blog Yazısı',
    },
    slug: 'posts',
    versions: {
        drafts: {
            autosave: { interval: 375 },
        },
        maxPerDoc: 20,
    },
}
