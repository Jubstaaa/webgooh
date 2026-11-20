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
    // The password strategy is deliberately left in place: it is the way back in
    // if Cloudflare Access is ever misconfigured. Access only guards /admin, so
    // its REST endpoints (/api/users/login, /api/users/forgot-password) are
    // public, and until a Cloudflare Access or WAF rule covers them the lockout
    // below is all that limits password guessing. Payload's defaults would be 5
    // and 10 minutes; they are spelled out so the limit is a decision, not a
    // default that can drift with an upgrade.
    auth: {
        lockTime: 15 * 60 * 1000,
        maxLoginAttempts: 5,
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
