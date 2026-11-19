import { z } from 'zod'

const SITEVERIFY_URL =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const siteverifyResponse = z.object({ success: z.boolean() })

interface VerifyTurnstileOptions {
    fetcher?: (url: string, init: RequestInit) => Promise<Response>
    ip?: string | undefined
    secret: string | undefined
    token: string
}

// No secret means no check at all, so the form refuses every submit rather
// than falling back to Cloudflare's always-pass test key.
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

        return parsed.success && parsed.data.success
    } catch (error) {
        console.error('Turnstile siteverify failed', error)

        return false
    }
}

// Cloudflare sets this on every proxied request and overwrites any client
// value; x-forwarded-for is whatever the client chose to send first.
export function clientIp(headers: Headers) {
    return headers.get('cf-connecting-ip') ?? undefined
}
