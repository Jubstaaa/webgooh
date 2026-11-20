import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from 'bun:test'
import {
    createLocalJWKSet,
    errors,
    exportJWK,
    generateKeyPair,
    type JWTVerifyGetKey,
    SignJWT,
} from 'jose'
import { APIError, type Payload, ValidationError } from 'payload'

import {
    cloudflareAccess,
    createCloudflareAccessStrategy,
} from './cloudflare-access'

// Errors keep their message and own fields (a jose error's claims payload,
// a Payload error's data) when serialised, so a log leak shows up here.
function serialized(value: unknown) {
    return JSON.stringify(value, (_key, field: unknown) =>
        field instanceof Error
            ? { ...field, message: field.message, name: field.name }
            : field
    )
}

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
        expiresAt = '5m',
        issuer = TEAM_DOMAIN,
        key = trusted.privateKey,
    }: {
        audience?: string
        expiresAt?: number | string
        issuer?: string
        key?: CryptoKey
    } = {}
) {
    return new SignJWT(claims)
        .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
        .setAudience(audience)
        .setIssuer(issuer)
        .setIssuedAt()
        .setExpirationTime(expiresAt)
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

    test('logs why registering failed without the address', async () => {
        const failure = new ValidationError({
            collection: 'users',
            errors: [{ message: 'new@example.com is taken', path: 'email' }],
        })
        const consoleError = spyOn(console, 'error').mockImplementation(
            () => {}
        )
        const payload = {
            create: () => Promise.reject(failure),
            find: () => Promise.resolve({ docs: [] }),
        } as unknown as Payload
        const strategy = createCloudflareAccessStrategy(config)
        const token = await sign({ email: 'new@example.com' })

        const result = await strategy.authenticate({
            canSetHeaders: false,
            headers: new Headers({ 'cf-access-jwt-assertion': token }),
            payload,
            strategyName: strategy.name,
        })

        expect(result.user).toBeNull()
        expect(consoleError).toHaveBeenCalledWith(
            'Registering a Cloudflare Access user failed',
            { fields: ['email'], name: 'ValidationError', status: 400 }
        )
        expect(serialized(consoleError.mock.calls)).not.toContain(
            'new@example.com'
        )
        consoleError.mockRestore()
    })

    test('logs a database error by its code, not its message', async () => {
        const failure = Object.assign(
            new Error('constraint failed for new@example.com'),
            { code: 'SQLITE_CONSTRAINT' }
        )
        const consoleError = spyOn(console, 'error').mockImplementation(
            () => {}
        )
        const payload = {
            create: () => Promise.reject(failure),
            find: () => Promise.resolve({ docs: [] }),
        } as unknown as Payload
        const strategy = createCloudflareAccessStrategy(config)

        await strategy.authenticate({
            canSetHeaders: false,
            headers: new Headers({
                'cf-access-jwt-assertion': await sign({
                    email: 'new@example.com',
                }),
            }),
            payload,
            strategyName: strategy.name,
        })

        expect(consoleError).toHaveBeenCalledWith(
            'Registering a Cloudflare Access user failed',
            { code: 'SQLITE_CONSTRAINT', name: 'Error' }
        )
        consoleError.mockRestore()
    })

    test('issues a Payload session cookie when it may set headers', async () => {
        const token = await sign({ email: 'editor@example.com' })
        const { payload } = fakePayload()
        Object.assign(payload, {
            collections: {
                users: {
                    config: {
                        auth: { cookies: {}, tokenExpiration: 7200 },
                        fields: [],
                    },
                },
            },
            config: { cookiePrefix: 'payload' },
            secret: 'test-secret',
        })
        const strategy = createCloudflareAccessStrategy(config)

        const result = await strategy.authenticate({
            canSetHeaders: true,
            headers: new Headers({ 'cf-access-jwt-assertion': token }),
            payload,
            strategyName: strategy.name,
        })

        expect(result.user?.email).toBe('editor@example.com')
        expect(result.responseHeaders?.get('set-cookie')).toStartWith(
            'payload-token='
        )
    })

    test('is switched off, and says so in production, without the Access settings', async () => {
        const env = process.env as Record<string, string | undefined>
        const nodeEnv = env.NODE_ENV
        delete env.CF_ACCESS_TEAM_DOMAIN
        delete env.CF_ACCESS_AUD
        env.NODE_ENV = 'production'
        const consoleError = spyOn(console, 'error').mockImplementation(
            () => {}
        )
        const token = await sign({ email: 'a@example.com' })
        const { payload } = fakePayload()

        const result = await cloudflareAccess.authenticate({
            canSetHeaders: false,
            headers: new Headers({ 'cf-access-jwt-assertion': token }),
            payload,
            strategyName: cloudflareAccess.name,
        })

        env.NODE_ENV = nodeEnv
        expect(result.user).toBeNull()
        expect(consoleError).toHaveBeenCalledWith(
            'Cloudflare Access sign-in is disabled: set CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD.'
        )
        consoleError.mockRestore()
    })
})

describe('cloudflare access assertion logging', () => {
    let consoleError: ReturnType<typeof spyOn<Console, 'error'>>

    beforeEach(() => {
        consoleError = spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleError.mockRestore()
    })

    async function rejected(token: string) {
        const { result } = await authenticate(
            { 'cf-access-jwt-assertion': token },
            config()
        )

        expect(result.user).toBeNull()
    }

    test('stays quiet for an expired assertion', async () => {
        await rejected(
            await sign(
                { email: 'a@example.com' },
                { expiresAt: Math.floor(Date.now() / 1000) - 60 }
            )
        )

        expect(consoleError).not.toHaveBeenCalled()
    })

    test('stays quiet for a signature outside the JWKS', async () => {
        await rejected(
            await sign(
                { email: 'a@example.com' },
                { key: untrusted.privateKey }
            )
        )

        expect(consoleError).not.toHaveBeenCalled()
    })

    test('logs an assertion for another application, a misconfiguration', async () => {
        await rejected(
            await sign({ email: 'a@example.com' }, { audience: 'other-app' })
        )

        expect(consoleError).toHaveBeenCalledWith(
            'Cloudflare Access assertion rejected',
            {
                claim: 'aud',
                code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
                name: 'JWTClaimValidationFailed',
                reason: 'check_failed',
            }
        )
        expect(serialized(consoleError.mock.calls)).not.toContain(
            'a@example.com'
        )
    })

    test('logs a valid assertion that carries no email', async () => {
        await rejected(
            await sign({ email: 'not-an-address', sub: 'service-token' })
        )

        expect(consoleError).toHaveBeenCalledWith(
            'Cloudflare Access assertion has no usable email claim',
            [{ code: 'invalid_format', path: ['email'] }]
        )
        const logged = serialized(consoleError.mock.calls)
        expect(logged).not.toContain('not-an-address')
        expect(logged).not.toContain('service-token')
    })

    test.each([
        [
            new errors.JWKSTimeout(),
            { code: 'ERR_JWKS_TIMEOUT', name: 'JWKSTimeout' },
        ],
        [new TypeError('fetch failed'), { name: 'TypeError' }],
    ])('logs a key lookup failure by kind: %p', async (failure, summary) => {
        const token = await sign({ email: 'a@example.com' })
        const strategy = createCloudflareAccessStrategy(() => ({
            ...config(),
            keys: () => Promise.reject(failure),
        }))
        const { payload } = fakePayload()

        await strategy.authenticate({
            canSetHeaders: false,
            headers: new Headers({ 'cf-access-jwt-assertion': token }),
            payload,
            strategyName: strategy.name,
        })

        expect(consoleError).toHaveBeenCalledWith(
            'Cloudflare Access assertion rejected',
            summary
        )
    })

    test.each([
        [new APIError('Forbidden', 403), { name: 'APIError', status: 403 }],
        ['boom', { name: 'string' }],
    ])('summarises a registration failure: %p', async (failure, summary) => {
        const strategy = createCloudflareAccessStrategy(config)
        const payload = {
            // Non-Error rejections are part of what is under test.
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            create: () => Promise.reject(failure),
            find: () => Promise.resolve({ docs: [] }),
        } as unknown as Payload

        await strategy.authenticate({
            canSetHeaders: false,
            headers: new Headers({
                'cf-access-jwt-assertion': await sign({
                    email: 'n@example.com',
                }),
            }),
            payload,
            strategyName: strategy.name,
        })

        expect(consoleError).toHaveBeenCalledWith(
            'Registering a Cloudflare Access user failed',
            summary
        )
    })
})
