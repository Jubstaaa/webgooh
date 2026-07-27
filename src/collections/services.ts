import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import {
    revalidateServiceAfterChange,
    revalidateServiceAfterDelete,
} from '@/hooks/revalidate-service'

export const Services: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['title', 'slug', 'order'],
        group: 'İçerik',
        useAsTitle: 'title',
    },
    defaultSort: 'order',
    fields: [
        {
            fields: [
                {
                    name: 'title',
                    required: true,
                    type: 'text',
                },
                {
                    admin: {
                        description: 'Kartta gösterilecek ikon.',
                        width: '40%',
                    },
                    name: 'icon',
                    options: [
                        { label: 'Kod', value: 'code' },
                        { label: 'Mobil', value: 'smartphone' },
                        { label: 'Tasarım', value: 'palette' },
                        { label: 'E-Ticaret', value: 'shopping-cart' },
                        { label: 'SEO', value: 'search' },
                        { label: 'Güvenlik', value: 'shield' },
                        { label: 'Bulut', value: 'cloud' },
                        { label: 'Yapay Zeka', value: 'sparkles' },
                    ],
                    required: true,
                    type: 'select',
                },
            ],
            type: 'row',
        },
        {
            maxLength: 220,
            name: 'summary',
            required: true,
            type: 'textarea',
        },
        {
            name: 'content',
            type: 'richText',
        },
        {
            fields: [
                {
                    name: 'label',
                    required: true,
                    type: 'text',
                },
            ],
            labels: {
                plural: 'Özellikler',
                singular: 'Özellik',
            },
            name: 'features',
            type: 'array',
        },
        {
            name: 'coverImage',
            relationTo: 'media',
            type: 'upload',
        },
        {
            admin: { position: 'sidebar' },
            defaultValue: 0,
            name: 'order',
            type: 'number',
        },
        slugField(),
        seoField,
    ],
    hooks: {
        afterChange: [revalidateServiceAfterChange],
        afterDelete: [revalidateServiceAfterDelete],
    },
    labels: {
        plural: 'Hizmetler',
        singular: 'Hizmet',
    },
    slug: 'services',
}
