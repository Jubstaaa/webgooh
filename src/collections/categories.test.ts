import { beforeEach, describe, expect, mock, test } from 'bun:test'

const revalidated: string[] = []

void mock.module('next/cache', () => ({
    revalidatePath: (path: string) => revalidated.push(path),
    revalidateTag: (tag: string) => revalidated.push(tag),
}))

const { Categories } = await import('./categories')

type Hook = (args: Record<string, unknown>) => unknown

function hook(name: 'afterChange' | 'afterDelete') {
    const [first] = (Categories.hooks?.[name] ?? []) as Hook[]
    if (!first) throw new Error(`categories has no ${name} hook`)

    return first
}

beforeEach(() => {
    revalidated.length = 0
})

describe('Categories hooks', () => {
    test('a rename refreshes the posts that embed the category', () => {
        hook('afterChange')({
            doc: { slug: 'haberler' },
            previousDoc: { slug: 'haber' },
        })

        expect(revalidated).toEqual([
            'categories',
            'posts',
            'category:haberler',
            'category:haber',
        ])
    })

    test('a delete refreshes the posts and the category page', () => {
        hook('afterDelete')({ doc: { slug: 'haber' } })

        expect(revalidated).toEqual(['categories', 'posts', 'category:haber'])
    })
})
