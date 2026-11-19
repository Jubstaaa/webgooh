import { beforeAll, describe, expect, mock, test } from 'bun:test'
import {
    createLocalJWKSet,
    exportJWK,
    generateKeyPair,
    type JWTVerifyGetKey,
    SignJWT,
} from 'jose'
import type { Payload } from 'payload'

import { createCloudflareAccessStrategy } from '@/lib/cloudflare-access'

const TEAM_DOMAIN = 'https://team.cloudflareaccess.com'
const AUDIENCE = 'test-audience-tag'

type KeyPair = Awaited<ReturnType<typeof generateKeyPair>>

let trusted: KeyPair
let untrusted: KeyPair
let keys: JWTVerifyGetKey

beforeAll(async () => {
    trusted = await generateKeyPair('RS256')
    untrusted = await generateKeyPair('RS256')
    const jwk = await exportJWK(trusted.publicKey)
    keys = createLocalJWKSet({ keys: [{ ...jwk, alg: 'RS256', kid: 'k1' }] })
})

function sign(
    claims: Record<string, unknown>,
    {
        audience = AUDIENCE,
        issuer = TEAM_DOMAIN,
        key = trusted.privateKey,
    }: { audience?: string; issuer?: string; key?: CryptoKey } = {}
) {
    return new SignJWT(claims)
        .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
        .setAudience(audience)
        .setIssuer(issuer)
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(key)
}

function fakePayload() {
    const find = mock(({ where }: { where: { email: { equals: string } } }) =>
        Promise.resolve({
            docs: [{ email: where.email.equals, id: 1, name: 'editor' }],
        })
    )

    return { find, payload: { find } as unknown as Payload }
}

function authenticate(
    headers: Record<string, string>,
    config: { audience: string; issuer: string; keys: JWTVerifyGetKey } | null
) {
    const strategy = createCloudflareAccessStrategy(() => config)
    const { find, payload } = fakePayload()

    return Promise.resolve(
        strategy.authenticate({
            canSetHeaders: false,
            headers: new Headers(headers),
            payload,
            strategyName: strategy.name,
        })
    ).then(result => ({ find, result }))
}

const config = () => ({ audience: AUDIENCE, issuer: TEAM_DOMAIN, keys })

describe('cloudflare access strategy', () => {
    test('ignores a plain identity header without a signed assertion', async () => {
        const { find, result } = await authenticate(
            { 'cf-access-authenticated-user-email': 'attacker@example.com' },
            config()
        )

        expect(result.user).toBeNull()
        expect(find).not.toHaveBeenCalled()
    })

    test('rejects a token signed by a key outside the JWKS', async () => {
        const token = await sign(
            { email: 'a@example.com' },
            { key: untrusted.privateKey }
        )
        const { result } = await authenticate(
            { 'cf-access-jwt-assertion': token },
            config()
        )

        expect(result.user).toBeNull()
    })

    test('rejects a token for another Access application', async () => {
        const token = await sign(
            { email: 'a@example.com' },
            { audience: 'other-app' }
        )
        const { result } = await authenticate(
            { 'cf-access-jwt-assertion': token },
            config()
        )

        expect(result.user).toBeNull()
    })

    test('rejects a token from another team domain', async () => {
        const token = await sign(
            { email: 'a@example.com' },
            { issuer: 'https://evil.cloudflareaccess.com' }
        )
        const { result } = await authenticate(
            { 'cf-access-jwt-assertion': token },
            config()
        )

        expect(result.user).toBeNull()
    })

    test('authenticates nobody when the Access settings are missing', async () => {
        const token = await sign({ email: 'a@example.com' })
        const { find, result } = await authenticate(
            { 'cf-access-jwt-assertion': token },
            null
        )

        expect(result.user).toBeNull()
        expect(find).not.toHaveBeenCalled()
    })

    test('takes the identity from a valid token, not the plain header', async () => {
        const token = await sign({ email: 'Editor@Example.com' })
        const { result } = await authenticate(
            {
                'cf-access-authenticated-user-email': 'attacker@example.com',
                'cf-access-jwt-assertion': token,
            },
            config()
        )

        expect(result.user?.email).toBe('editor@example.com')
    })
})
