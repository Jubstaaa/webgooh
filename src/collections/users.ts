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
    // The password form is deliberately left in place: it is the way back in if
    // Cloudflare Access is ever misconfigured, and /admin is unreachable without
    // passing Access first anyway.
    auth: {
        strategies: [cloudflareAccess],
        // Sessions are stored per device so they can be revoked individually, which
        // only matters where signing in is what grants entry. Here Cloudflare
        // decides that, and removing someone from its policy locks them out no
        // matter what token they hold — so the stored session buys nothing and its
        // absence lets the strategy below hand out a plain token.
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
