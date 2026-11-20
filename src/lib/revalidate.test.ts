import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test'

const outsideRequest = new Error('static generation store missing')

void mock.module('next/cache', () => ({
    revalidatePath: () => {
        throw outsideRequest
    },
    revalidateTag: () => {
        throw outsideRequest
    },
}))

const { mergeTargets, revalidateTargets } = await import('./revalidate')

const consoleError = spyOn(console, 'error').mockImplementation(() => {})

afterEach(() => {
    consoleError.mockClear()
})

describe('revalidateTargets', () => {
    test('logs a failed revalidation instead of failing the save', () => {
        expect(() => {
            revalidateTargets({ paths: ['/blog'], tags: ['posts'] })
        }).not.toThrow()

        expect(consoleError).toHaveBeenCalledWith(
            'Revalidating tag "posts" failed',
            outsideRequest
        )
        expect(consoleError).toHaveBeenCalledWith(
            'Revalidating path "/blog" failed',
            outsideRequest
        )
    })
})

describe('mergeTargets', () => {
    test('drops duplicates and keeps first-seen order', () => {
        expect(
            mergeTargets(
                { paths: ['/a'], tags: ['posts', 'post:a'] },
                { paths: ['/a', '/b'], tags: ['posts', 'post:b'] }
            )
        ).toEqual({ paths: ['/a', '/b'], tags: ['posts', 'post:a', 'post:b'] })
    })
})
