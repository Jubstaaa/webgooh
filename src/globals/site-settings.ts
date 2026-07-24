import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate-simple'
import { cacheTags } from '@/lib/cache-tags'

export const SiteSettings: GlobalConfig = {
    access: {
        read: anyone,
        update: authenticated,
    },
    admin: {
        group: 'Sistem',
    },
    fields: [
        {
            tabs: [
                {
                    fields: [
                        {
                            label: 'E-posta',
                            name: 'email',
                            required: true,
                            type: 'text',
                        },
                        {
                            label: 'Birincil Telefon',
                            name: 'phonePrimary',
                            type: 'text',
                        },
                        {
                            label: 'İkincil Telefon',
                            name: 'phoneSecondary',
                            type: 'text',
                        },
                        {
                            admin: {
                                description:
                                    'Sadece rakam (örn. 905326453380). Sağ alttaki WhatsApp butonu bunu kullanır.',
                            },
                            label: 'WhatsApp Numarası',
                            name: 'whatsapp',
                            type: 'text',
                        },
                        {
                            label: 'Adres',
                            name: 'address',
                            type: 'textarea',
                        },
                    ],
                    label: 'İletişim',
                },
                {
                    fields: [
                        {
                            fields: [
                                {
                                    label: 'Platform',
                                    name: 'platform',
                                    options: [
                                        {
                                            label: 'Instagram',
                                            value: 'instagram',
                                        },
                                        {
                                            label: 'Facebook',
                                            value: 'facebook',
                                        },
                                        { label: 'X (Twitter)', value: 'x' },
                                        {
                                            label: 'LinkedIn',
                                            value: 'linkedin',
                                        },
                                        { label: 'YouTube', value: 'youtube' },
                                        {
                                            label: 'Pinterest',
                                            value: 'pinterest',
                                        },
                                    ],
                                    required: true,
                                    type: 'select',
                                },
                                {
                                    label: 'Bağlantı',
                                    name: 'url',
                                    required: true,
                                    type: 'text',
                                },
                            ],
                            labels: {
                                plural: 'Sosyal Hesaplar',
                                singular: 'Sosyal Hesap',
                            },
                            name: 'socials',
                            type: 'array',
                        },
                    ],
                    label: 'Sosyal Medya',
                },
            ],
            type: 'tabs',
        },
    ],
    hooks: {
        afterChange: [revalidateGlobal(cacheTags.settings)],
    },
    label: 'Site Ayarları',
    slug: 'site-settings',
}
