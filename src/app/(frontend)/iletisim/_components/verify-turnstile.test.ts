import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    spyOn,
    test,
} from 'bun:test'

import { clientIp, verifyTurnstile } from './verify-turnstile'

function siteverify(body: unknown, init?: ResponseInit) {
    return mock((_url: string, _init: RequestInit) =>
        Promise.resolve(Response.json(body, init))
    )
}

describe('verifyTurnstile', () => {
    beforeEach(() => {
        spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => {
        mock.restore()
    })

    test('fails closed without a secret, never calling Cloudflare', async () => {
        const fetcher = siteverify({ success: true })

        const ok = await verifyTurnstile({
            fetcher,
            secret: undefined,
            token: 'token',
        })

        expect(ok).toBe(false)
        expect(fetcher).not.toHaveBeenCalled()
    })

    test('fails when Cloudflare rejects the token', async () => {
        const ok = await verifyTurnstile({
            fetcher: siteverify({ success: false }),
            secret: 'secret',
            token: 'token',
        })

        expect(ok).toBe(false)
    })

    test('fails when siteverify cannot be reached', async () => {
        const ok = await verifyTurnstile({
            fetcher: () => Promise.reject(new Error('network down')),
            secret: 'secret',
            token: 'token',
        })

        expect(ok).toBe(false)
    })

    test('passes the token, secret and client IP to siteverify', async () => {
        const fetcher = siteverify({ success: true })

        const ok = await verifyTurnstile({
            fetcher,
            ip: '203.0.113.7',
            secret: 'secret',
            token: 'token',
        })

        expect(ok).toBe(true)
        const body = new URLSearchParams(
            String(fetcher.mock.calls[0]?.[1].body)
        )
        expect(body.get('remoteip')).toBe('203.0.113.7')
        expect(body.get('secret')).toBe('secret')
        expect(body.get('response')).toBe('token')
    })
})

describe('verifyTurnstile logging', () => {
    let consoleError: ReturnType<typeof spyOn<Console, 'error'>>

    beforeEach(() => {
        consoleError = spyOn(console, 'error').mockImplementation(
            () => undefined
        )
    })

    afterEach(() => {
        consoleError.mockRestore()
    })

    function verify(fetcher: ReturnType<typeof siteverify>) {
        return verifyTurnstile({ fetcher, secret: 'secret', token: 'token' })
    }

    test.each(['invalid-input-response', 'timeout-or-duplicate'])(
        'stays quiet when a visitor token is rejected with %s',
        async code => {
            const ok = await verify(
                siteverify({ 'error-codes': [code], 'success': false })
            )

            expect(ok).toBe(false)
            expect(consoleError).not.toHaveBeenCalled()
        }
    )

    test.each([
        'missing-input-secret',
        'invalid-input-secret',
        'internal-error',
    ])('logs a rejection caused on our side: %s', async code => {
        const ok = await verify(
            siteverify({ 'error-codes': [code], 'success': false })
        )

        expect(ok).toBe(false)
        expect(consoleError).toHaveBeenCalledWith(
            'Turnstile siteverify rejected',
            200,
            [code]
        )
    })

    test('logs and fails on a non-2xx response', async () => {
        const ok = await verify(siteverify({ success: true }, { status: 503 }))

        expect(ok).toBe(false)
        expect(consoleError).toHaveBeenCalledWith(
            'Turnstile siteverify rejected',
            503,
            []
        )
    })

    test('logs and fails on a body it cannot read', async () => {
        const ok = await verify(siteverify({ unexpected: true }))

        expect(ok).toBe(false)
        expect(consoleError).toHaveBeenCalledWith(
            'Turnstile siteverify rejected',
            200,
            []
        )
    })
})

describe('clientIp', () => {
    test('reads the address Cloudflare saw, not a forwarded chain', () => {
        const headers = new Headers({
            'cf-connecting-ip': '203.0.113.7',
            'x-forwarded-for': '6.6.6.6, 203.0.113.7',
        })

        expect(clientIp(headers)).toBe('203.0.113.7')
    })

    test('ignores x-forwarded-for when Cloudflare sent nothing', () => {
        expect(
            clientIp(new Headers({ 'x-forwarded-for': '6.6.6.6' }))
        ).toBeUndefined()
    })
})
