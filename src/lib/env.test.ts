import { describe, expect, test } from 'bun:test'

import { parseRuntimeEnv } from './env'

const complete = {
    DATABASE_URI: 'file:/app/data/webgooh.db',
    PAYLOAD_SECRET: 'a-long-random-secret',
    S3_ACCESS_KEY_ID: 'key-id',
    S3_SECRET_ACCESS_KEY: 'key-secret',
}

describe('parseRuntimeEnv', () => {
    test('accepts a complete production environment', () => {
        expect(parseRuntimeEnv({ ...complete, UNRELATED: 'x' })).toEqual(
            complete
        )
    })

    test.each(Object.keys(complete))('rejects a missing %s', name => {
        const env: Record<string, string | undefined> = { ...complete }
        delete env[name]

        expect(() => parseRuntimeEnv(env)).toThrow(name)
    })

    test('rejects an empty PAYLOAD_SECRET', () => {
        expect(() =>
            parseRuntimeEnv({ ...complete, PAYLOAD_SECRET: '' })
        ).toThrow('PAYLOAD_SECRET')
    })

    test('names every missing variable at once', () => {
        expect(() => parseRuntimeEnv({})).toThrow(
            /DATABASE_URI[\s\S]*PAYLOAD_SECRET[\s\S]*S3_ACCESS_KEY_ID[\s\S]*S3_SECRET_ACCESS_KEY/
        )
    })
})
