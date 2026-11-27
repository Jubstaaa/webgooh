import type { Project } from '@payload-types'

import { beforeEach, describe, expect, mock, test } from 'bun:test'

const revalidated: string[] = []

void mock.module('next/cache', () => ({
    revalidatePath: (path: string) => revalidated.push(path),
    revalidateTag: (tag: string) => revalidated.push(tag),

    unstable_cache: <T>(fn: T) => fn,
}))

const { revalidateProjectAfterChange, revalidateProjectAfterDelete } =
    await import('./revalidate-project')

type ChangeArgs = Parameters<typeof revalidateProjectAfterChange>[0]
type DeleteArgs = Parameters<typeof revalidateProjectAfterDelete>[0]

function change(doc: Partial<Project>, previousDoc: Partial<Project>) {
    revalidateProjectAfterChange({ doc, previousDoc } as unknown as ChangeArgs)
}

beforeEach(() => {
    revalidated.length = 0
})

describe('project revalidation', () => {
    test('a save refreshes the list and the detail page', () => {
        change({ slug: 'a' }, { slug: 'a' })

        expect(revalidated).toEqual([
            'projects',
            '/referanslar',
            'project:a',
            '/referanslar/a',
        ])
    })

    test('a slug change also refreshes the old detail page', () => {
        change({ slug: 'b' }, { slug: 'a' })

        expect(revalidated).toContain('project:a')
        expect(revalidated).toContain('/referanslar/a')
        expect(revalidated).toContain('/referanslar/b')
    })

    test('a delete refreshes the detail page it removes', () => {
        revalidateProjectAfterDelete({
            doc: { slug: 'a' },
        } as unknown as DeleteArgs)

        expect(revalidated).toContain('/referanslar/a')
    })
})
