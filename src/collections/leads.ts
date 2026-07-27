import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Leads: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['name', 'email', 'phone', 'createdAt'],
        useAsTitle: 'name',
    },
    fields: [
        {
            fields: [
                {
                    label: 'Ad Soyad',
                    name: 'name',
                    required: true,
                    type: 'text',
                },
                {
                    label: 'E-posta',
                    name: 'email',
                    required: true,
                    type: 'email',
                },
            ],
            type: 'row',
        },
        {
            fields: [
                { label: 'Telefon', name: 'phone', type: 'text' },
                { label: 'Şirket', name: 'company', type: 'text' },
            ],
            type: 'row',
        },
        {
            label: 'Hizmet',
            name: 'service',
            type: 'text',
        },
        {
            label: 'Mesaj',
            name: 'message',
            required: true,
            type: 'textarea',
        },
    ],
    labels: {
        plural: 'Talepler',
        singular: 'Talep',
    },
    slug: 'leads',
}
