import { describe, expect, mock, test } from 'bun:test'

const revalidated: string[] = []

void mock.module('next/cache', () => ({
    revalidatePath: (path: string) => revalidated.push(path),
    revalidateTag: (tag: string) => revalidated.push(tag),

    unstable_cache: <T>(fn: T) => fn,
}))

const { revalidateGlobal } = await import('./revalidate-simple')

type HookArgs = Parameters<ReturnType<typeof revalidateGlobal>>[0]

describe('revalidateGlobal', () => {
    test('refreshes the tag and hands the saved doc back', () => {
        const doc = { id: 1 }

        const result: unknown = revalidateGlobal('settings')({
            doc,
        } as HookArgs)

        expect(result).toBe(doc)
        expect(revalidated).toEqual(['settings'])
    })
})
