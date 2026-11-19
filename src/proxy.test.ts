import { NextRequest } from 'next/server'

import { describe, expect, test } from 'bun:test'

import { proxy } from '@/proxy'

function request(path: string) {
    return proxy(new NextRequest(`https://webgooh.tech${path}`))
}

describe('proxy', () => {
    test('passes ordinary and valid percent-encoded paths through', () => {
        expect(request('/blog/ornek').headers.get('x-middleware-next')).toBe(
            '1'
        )
        expect(
            request('/blog/g%C3%BCvenlik').headers.get('x-middleware-next')
        ).toBe('1')
    })

    test('redirects a legacy slug with a stray percent to its repaired path', () => {
        const res = request('/blog/markalarin-%80i-neden')

        expect(res.status).toBe(301)
        expect(res.headers.get('location')).toBe(
            'https://webgooh.tech/blog/markalarin-80i-neden'
        )
    })

    test('keeps valid multi-byte escapes while repairing the broken one', () => {
        const res = request('/blog/%C3%A7ok-%80i')

        expect(res.headers.get('location')).toBe(
            'https://webgooh.tech/blog/%C3%A7ok-80i'
        )
    })
})
