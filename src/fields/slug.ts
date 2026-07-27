import type { Field } from 'payload'

import { slugify } from '@/lib/utils'

interface SlugFieldOptions {
    sidebar?: boolean
    sourceField?: string
}

export function slugField({
    sidebar = false,
    sourceField = 'title',
}: SlugFieldOptions = {}): Field {
    return {
        admin: {
            description: 'Boş bırakılırsa başlıktan otomatik üretilir.',
            ...(sidebar ? { position: 'sidebar' as const } : {}),
        },
        hooks: {
            beforeValidate: [
                ({ data, value }) => {
                    if (typeof value === 'string' && value.length > 0) {
                        return slugify(value)
                    }

                    const source = data?.[sourceField]

                    if (typeof source === 'string' && source.length > 0) {
                        return slugify(source)
                    }

                    return value
                },
            ],
        },
        index: true,
        label: 'URL (Slug)',
        name: 'slug',
        type: 'text',
        unique: true,
    }
}
