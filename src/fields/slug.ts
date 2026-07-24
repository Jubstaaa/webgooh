import type { Field } from 'payload'

import { slugify } from '@/lib/utils'

export function slugField(sourceField = 'title'): Field {
    return {
        admin: {
            description: 'Boş bırakılırsa başlıktan otomatik üretilir.',
            position: 'sidebar',
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
        name: 'slug',
        type: 'text',
        unique: true,
    }
}
