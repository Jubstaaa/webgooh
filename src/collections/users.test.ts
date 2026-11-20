import { describe, expect, test } from 'bun:test'

import { Users } from './users'

describe('Users auth', () => {
    test('locks an account for 15 minutes after 5 failed password logins', () => {
        const auth = typeof Users.auth === 'object' ? Users.auth : {}

        expect(auth.maxLoginAttempts).toBe(5)
        expect(auth.lockTime).toBe(15 * 60 * 1000)
    })
})
