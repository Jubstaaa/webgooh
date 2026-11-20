import { beforeEach, describe, expect, mock, test } from 'bun:test'

import type { Service } from '@payload-types'

const revalidated: string[] = []

void mock.module('next/cache', () => ({
    revalidatePath: (path: string) => revalidated.push(path),
    revalidateTag: (tag: string) => revalidated.push(tag),
}))

const { revalidateServiceAfterChange, revalidateServiceAfterDelete } =
    await import('./revalidate-service')

type ChangeArgs = Parameters<typeof revalidateServiceAfterChange>[0]
type DeleteArgs = Parameters<typeof revalidateServiceAfterDelete>[0]

function change(doc: Partial<Service>, previousDoc: Partial<Service>) {
    revalidateServiceAfterChange({ doc, previousDoc } as unknown as ChangeArgs)
}

beforeEach(() => {
    revalidated.length = 0
})

describe('service revalidation', () => {
    test('a save refreshes the list, the sitemap and the detail page', () => {
        change({ slug: 'a' }, { slug: 'a' })

        expect(revalidated).toEqual([
            'services',
            'sitemap',
            '/',
            'service:a',
            '/hizmetlerimiz/a',
        ])
    })

    test('a slug change also refreshes the old detail page', () => {
        change({ slug: 'b' }, { slug: 'a' })

        expect(revalidated).toContain('service:a')
        expect(revalidated).toContain('/hizmetlerimiz/a')
        expect(revalidated).toContain('/hizmetlerimiz/b')
    })

    test('a delete refreshes the detail page it removes', () => {
        revalidateServiceAfterDelete({
            doc: { slug: 'a' },
        } as unknown as DeleteArgs)

        expect(revalidated).toContain('/hizmetlerimiz/a')
    })
})
