import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'
import { cloudflareAccess } from '@/lib/cloudflare-access'

export const Users: CollectionConfig = {
    access: {
        create: authenticated,
        delete: authenticated,
        read: authenticated,
        update: authenticated,
    },
    admin: {
        defaultColumns: ['name', 'email'],
        useAsTitle: 'name',
    },

    auth: {
        lockTime: 15 * 60 * 1000,
        maxLoginAttempts: 5,
        strategies: [cloudflareAccess],

        useSessions: false,
    },
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
