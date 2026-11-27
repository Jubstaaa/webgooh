import type { PayloadRequest } from 'payload'

import { describe, expect, test } from 'bun:test'

import { anyone, authenticated } from '@/access'

type AccessArgs = Parameters<typeof authenticated>[0]

function args(user: unknown): AccessArgs {
    return { req: { user } as PayloadRequest }
}

describe('access', () => {
    test('anyone lets visitors read', () => {
        expect(anyone(args(null))).toBe(true)
    })

    test('authenticated requires a signed-in user', () => {
        expect(authenticated(args(null))).toBe(false)
        expect(authenticated(args({ id: 1 }))).toBe(true)
    })
})
