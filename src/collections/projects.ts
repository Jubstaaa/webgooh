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
                                {
                                    label: 'Başlık',
                                    name: 'title',
                                    required: true,
                                    type: 'text',
                                },
                                {
                                    label: 'Müşteri',
                                    name: 'client',
                                    type: 'text',
                                },
                            ],
                            type: 'row',
                        },
                        {
                            admin: {
                                description:
                                    'Kart ve liste görünümündeki kısa özet.',
                            },
                            label: 'Özet',
                            maxLength: 260,
                            name: 'summary',
                            required: true,
                            type: 'textarea',
                        },
                        {
                            label: 'Görsel',
                            name: 'image',
                            relationTo: 'media',
                            required: true,
                            type: 'upload',
                        },
                        {
                            hasMany: true,
                            label: 'Etiketler',
                            name: 'tags',
                            type: 'text',
                        },
                        {
                            admin: { description: 'Canlı proje adresi.' },
                            label: 'Bağlantı (URL)',
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
                                            label: 'Değer',
                                            name: 'value',
                                            required: true,
                                            type: 'text',
                                        },
                                        {
                                            label: 'Açıklama',
                                            name: 'label',
                                            required: true,
                                            type: 'text',
                                        },
                                    ],
                                    type: 'row',
                                },
                            ],
                            label: 'Metrikler',
                            labels: {
                                plural: 'Metrikler',
                                singular: 'Metrik',
                            },
                            name: 'stats',
                            type: 'array',
                        },
                        {
                            label: 'Detaylı Anlatım',
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
            label: 'Öne Çıkan',
            name: 'featured',
            type: 'checkbox',
        },
        {
            admin: {
                description: 'Küçükten büyüğe sıralanır.',
                position: 'sidebar',
            },
            defaultValue: 0,
            label: 'Sıra',
            name: 'order',
            type: 'number',
        },
        slugField({ sidebar: true }),
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
