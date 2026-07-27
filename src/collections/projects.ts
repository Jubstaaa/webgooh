import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import {
    revalidateProjectAfterChange,
    revalidateProjectAfterDelete,
} from '@/hooks/revalidate-project'

export const Projects: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['title', 'client', 'order'],
        group: 'İçerik',
        useAsTitle: 'title',
    },
    defaultSort: 'order',
    fields: [
        {
            tabs: [
                {
                    fields: [
                        {
                            fields: [
                                { name: 'title', required: true, type: 'text' },
                                { name: 'client', type: 'text' },
                            ],
                            type: 'row',
                        },
                        {
                            admin: {
                                description:
                                    'Kart ve liste görünümündeki kısa özet.',
                            },
                            maxLength: 260,
                            name: 'summary',
                            required: true,
                            type: 'textarea',
                        },
                        {
                            name: 'image',
                            relationTo: 'media',
                            required: true,
                            type: 'upload',
                        },
                        {
                            hasMany: true,
                            name: 'tags',
                            type: 'text',
                        },
                        {
                            admin: { description: 'Canlı proje adresi.' },
                            name: 'url',
                            type: 'text',
                        },
                    ],
                    label: 'Genel',
                },
                {
                    fields: [
                        {
                            admin: {
                                description: 'Öne çıkan sayısal sonuçlar.',
                            },
                            fields: [
                                {
                                    fields: [
                                        {
                                            name: 'value',
                                            required: true,
                                            type: 'text',
                                        },
                                        {
                                            name: 'label',
                                            required: true,
                                            type: 'text',
                                        },
                                    ],
                                    type: 'row',
                                },
                            ],
                            labels: {
                                plural: 'Metrikler',
                                singular: 'Metrik',
                            },
                            name: 'stats',
                            type: 'array',
                        },
                        {
                            label: 'Detaylı anlatım',
                            name: 'content',
                            type: 'richText',
                        },
                    ],
                    label: 'Başarı Hikayesi',
                },
            ],
            type: 'tabs',
        },
        {
            admin: { position: 'sidebar' },
            defaultValue: false,
            name: 'featured',
            type: 'checkbox',
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
        afterChange: [revalidateProjectAfterChange],
        afterDelete: [revalidateProjectAfterDelete],
    },
    labels: {
        plural: 'Referanslar',
        singular: 'Referans',
    },
    slug: 'projects',
}
