import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Users: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['name', 'email'],
        group: 'Sistem',
        useAsTitle: 'name',
    },
    auth: true,
    fields: [
        {
            label: 'Ad Soyad',
            name: 'name',
            required: true,
            type: 'text',
        },
    ],
    labels: {
        plural: 'Kullanıcılar',
        singular: 'Kullanıcı',
    },
    slug: 'users',
}
