import { beforeEach, describe, expect, mock, test } from 'bun:test'

import type { Category, Post } from '@payload-types'

const revalidated: string[] = []

void mock.module('next/cache', () => ({
    revalidatePath: (path: string) => revalidated.push(path),
    revalidateTag: (tag: string) => revalidated.push(tag),
    unstable_cache: <T>(fn: T) => fn,
}))

const {
    postChangeTargets,
    postTargets,
    revalidatePostAfterChange,
    revalidatePostAfterDelete,
} = await import('./revalidate-post')

const news = { slug: 'haber' } as Category
const guides = { slug: 'rehber' } as Category

function post(overrides: Partial<Post> = {}): Partial<Post> {
    return { _status: 'published', category: news, slug: 'ilk', ...overrides }
}

describe('postTargets', () => {
    test('covers the lists, the post page and its category', () => {
        expect(postTargets(post())).toEqual({
            paths: ['/blog/ilk'],
            tags: ['posts', 'post:ilk', 'category:haber'],
        })
    })

    test('skips the category tag when the relation is not populated', () => {
        expect(postTargets(post({ category: 3 })).tags).not.toContain(
            'category:haber'
        )
    })
})

describe('postChangeTargets', () => {
    test('revalidates a published save', () => {
        expect(postChangeTargets(post(), post()).paths).toEqual(['/blog/ilk'])
    })

    test('ignores saving a draft that was never published', () => {
        const draft = post({ _status: 'draft' })

        expect(postChangeTargets(draft, draft)).toEqual({ paths: [], tags: [] })
    })

    test('revalidates unpublishing so the post drops off every page', () => {
        const targets = postChangeTargets(post({ _status: 'draft' }), post())

        expect(targets.paths).toEqual(['/blog/ilk'])
        expect(targets.tags).toContain('post:ilk')
        expect(targets.tags).toContain('posts')
    })

    test('revalidates both slugs when a published post is renamed', () => {
        const targets = postChangeTargets(post({ slug: 'yeni' }), post())

        expect(targets.paths).toEqual(['/blog/yeni', '/blog/ilk'])
        expect(targets.tags).toContain('post:ilk')
        expect(targets.tags).toContain('post:yeni')
    })

    test('revalidates the old category when a post moves', () => {
        const targets = postChangeTargets(post({ category: guides }), post())

        expect(targets.tags).toContain('category:rehber')
        expect(targets.tags).toContain('category:haber')
    })
})

describe('post hooks', () => {
    beforeEach(() => {
        revalidated.length = 0
    })

    test('afterChange revalidates and hands the doc back', () => {
        const doc = post()
        const args = { doc, previousDoc: post({ _status: 'draft' }) }

        expect(
            revalidatePostAfterChange(
                args as unknown as Parameters<
                    typeof revalidatePostAfterChange
                >[0]
            )
        ).toBe(doc)
        expect(revalidated).toContain('/blog/ilk')
    })

    test('afterDelete takes the deleted post off its pages', () => {
        const doc = post()

        expect(
            revalidatePostAfterDelete({ doc } as unknown as Parameters<
                typeof revalidatePostAfterDelete
            >[0])
        ).toBe(doc)
        expect(revalidated).toContain('post:ilk')
    })
})
