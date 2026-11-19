import { beforeEach, describe, expect, mock, spyOn, test } from 'bun:test'

import { clientIp, verifyTurnstile } from './verify-turnstile'

function siteverify(body: unknown) {
    return mock((_url: string, _init: RequestInit) =>
        Promise.resolve(Response.json(body))
    )
}

describe('verifyTurnstile', () => {
    beforeEach(() => {
        spyOn(console, 'error').mockImplementation(() => undefined)
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
