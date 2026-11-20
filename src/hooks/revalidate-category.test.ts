import { describe, expect, test } from 'bun:test'

import type { Category } from '@payload-types'

import { categoryChangeTargets, categoryTargets } from './revalidate-category'

describe('categoryTargets', () => {
    test('refreshes the category list, every post and the category page', () => {
        expect(categoryTargets({ slug: 'haber' })).toEqual({
            paths: [],
            tags: ['categories', 'posts', 'category:haber'],
        })
    })
})

describe('categoryChangeTargets', () => {
    test('also refreshes the old slug when a category is renamed', () => {
        const previous: Partial<Category> = { slug: 'haber' }

        expect(
            categoryChangeTargets({ slug: 'haberler' }, previous).tags
        ).toEqual([
            'categories',
            'posts',
            'category:haberler',
            'category:haber',
        ])
    })

    test('refreshes posts when only the colour changes', () => {
        const doc: Partial<Category> = { color: '#fff', slug: 'haber' }

        expect(categoryChangeTargets(doc, { slug: 'haber' }).tags).toEqual([
            'categories',
            'posts',
            'category:haber',
        ])
    })
})
