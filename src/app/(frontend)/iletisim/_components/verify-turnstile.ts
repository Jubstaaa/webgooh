import { z } from 'zod'

const SITEVERIFY_URL =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const siteverifyResponse = z.object({
    'error-codes': z.array(z.string()).default([]),
    'success': z.boolean(),
})

const VISITOR_ERROR_CODES = new Set([
    'invalid-input-response',
    'timeout-or-duplicate',
])

interface VerifyTurnstileOptions {
    fetcher?: (url: string, init: RequestInit) => Promise<Response>
    ip?: string | undefined
    secret: string | undefined
    token: string
}

export function clientIp(headers: Headers) {
    return headers.get('cf-connecting-ip') ?? undefined
}

export async function verifyTurnstile({
    fetcher = fetch,
    ip,
    secret,
    token,
}: VerifyTurnstileOptions) {
    if (!secret) {
        console.error('TURNSTILE_SECRET_KEY is not set; rejecting submit.')

        return false
    }

    const body = new URLSearchParams({ response: token, secret })
    if (ip) body.set('remoteip', ip)

    try {
        const res = await fetcher(SITEVERIFY_URL, { body, method: 'POST' })
        const parsed = siteverifyResponse.safeParse(await res.json())
        const codes = parsed.success ? parsed.data['error-codes'] : []

        if (
            !res.ok ||
            !parsed.success ||
            codes.some(code => !VISITOR_ERROR_CODES.has(code))
        ) {
            console.error('Turnstile siteverify rejected', res.status, codes)

            return false
        }

        return parsed.data.success
    } catch (error) {
        console.error('Turnstile siteverify failed', error)

        return false
    }
}
