import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Leads: CollectionConfig = {
    access: {
        create: anyone,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['name', 'email', 'phone', 'createdAt'],
        group: 'Sistem',
        useAsTitle: 'name',
    },
    fields: [
        {
            fields: [
                { name: 'name', required: true, type: 'text' },
                { name: 'email', required: true, type: 'email' },
            ],
            type: 'row',
        },
        {
            fields: [
                { name: 'phone', type: 'text' },
                { name: 'company', type: 'text' },
            ],
            type: 'row',
        },
        {
            name: 'service',
            type: 'text',
        },
        {
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
