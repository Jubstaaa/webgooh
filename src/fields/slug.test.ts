import { describe, expect, test } from 'bun:test'
import type { FieldHook, TextField } from 'payload'

import { slugField } from './slug'

function beforeValidate(
    value: unknown,
    data: Record<string, unknown>,
    options?: Parameters<typeof slugField>[0]
) {
    const field = slugField(options) as TextField
    const [hook] = (field.hooks?.beforeValidate ?? []) as FieldHook[]
    if (!hook) throw new Error('slug field has no beforeValidate hook')

    return hook({ data, value } as Parameters<FieldHook>[0])
}

describe('slugField', () => {
    test('normalises a slug the editor typed', () => {
        expect(beforeValidate('Güvenlik İpuçları', {})).toBe(
            'guvenlik-ipuclari'
        )
    })

    test('derives the slug from the title when left empty', () => {
        expect(beforeValidate('', { title: 'Siber Güvenlik' })).toBe(
            'siber-guvenlik'
        )
    })

    test('reads another source field when told to', () => {
        expect(
            beforeValidate(
                undefined,
                { name: 'Mobil Uygulama' },
                {
                    sourceField: 'name',
                }
            )
        ).toBe('mobil-uygulama')
    })

    test('leaves the value alone when there is nothing to derive from', () => {
        expect(beforeValidate(undefined, {})).toBeUndefined()
    })

    test('can sit in the sidebar', () => {
        const field = slugField({ sidebar: true }) as TextField

        expect(field.admin?.position).toBe('sidebar')
    })
})
