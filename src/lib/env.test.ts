import { describe, expect, test } from 'bun:test'

import { parseRuntimeEnv } from './env'

const complete = {
    DATABASE_URI: 'file:/app/data/webgooh.db',
    PAYLOAD_SECRET: 'a-long-random-secret',
    S3_ACCESS_KEY_ID: 'key-id',
    S3_SECRET_ACCESS_KEY: 'key-secret',
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
}

describe('parseRuntimeEnv', () => {
    test('accepts a complete production environment', () => {
        expect(parseRuntimeEnv({ ...complete, UNRELATED: 'x' })).toEqual(
            complete
        )
    })

    test.each(Object.keys(complete))('rejects a missing %s', name => {
        const env: Record<string, string | undefined> = { ...complete }
        Reflect.deleteProperty(env, name)

        expect(() => parseRuntimeEnv(env)).toThrow(name)
    })

    test('rejects an empty PAYLOAD_SECRET', () => {
        expect(() =>
            parseRuntimeEnv({ ...complete, PAYLOAD_SECRET: '' })
        ).toThrow('PAYLOAD_SECRET')
    })

    test('rejects a secret that is only whitespace', () => {
        expect(() =>
            parseRuntimeEnv({ ...complete, PAYLOAD_SECRET: '   ' })
        ).toThrow('PAYLOAD_SECRET')
    })

    test('accepts an Access team domain that is a URL, or none', () => {
        const teamDomain = 'https://webgooh.cloudflareaccess.com'

        expect(
            parseRuntimeEnv({ ...complete, CF_ACCESS_TEAM_DOMAIN: teamDomain })
        ).toMatchObject({ CF_ACCESS_TEAM_DOMAIN: teamDomain })
        expect(parseRuntimeEnv(complete)).not.toHaveProperty(
            'CF_ACCESS_TEAM_DOMAIN'
        )
    })

    test('rejects an Access team domain that is not a URL', () => {
        expect(() =>
            parseRuntimeEnv({
                ...complete,
                CF_ACCESS_TEAM_DOMAIN: 'webgooh.cloudflareaccess.com',
            })
        ).toThrow('CF_ACCESS_TEAM_DOMAIN')
    })

    test('names every missing variable at once', () => {
        expect(() => parseRuntimeEnv({})).toThrow(
            /DATABASE_URI[\s\S]*PAYLOAD_SECRET[\s\S]*S3_ACCESS_KEY_ID[\s\S]*S3_SECRET_ACCESS_KEY[\s\S]*TURNSTILE_SECRET_KEY/
        )
    })
})
