import type { Field } from 'payload'

export const seoField: Field = {
    admin: {
        position: 'sidebar',
    },
    fields: [
        {
            admin: {
                description: 'Boş bırakılırsa sayfa başlığı kullanılır.',
            },
            name: 'title',
            type: 'text',
        },
        {
            maxLength: 180,
            name: 'description',
            type: 'textarea',
        },
        {
            admin: {
                description: 'Sosyal paylaşım görseli (OG image).',
            },
            name: 'image',
            relationTo: 'media',
            type: 'upload',
        },
    ],
    label: 'SEO',
    name: 'seo',
    type: 'group',
}
