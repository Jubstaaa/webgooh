'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'
import { contactSchema } from '@/views/contact/contact.validations'

export interface ContactState {
    errors?: Record<string, string>
    message?: string
    status: 'idle' | 'success' | 'error'
}

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const attempts = new Map<string, number[]>()

function isRateLimited(ip: string) {
    const now = Date.now()
    const recent = (attempts.get(ip) ?? []).filter(
        t => now - t < RATE_WINDOW_MS
    )
    recent.push(now)
    attempts.set(ip, recent)

    return recent.length > RATE_LIMIT
}

async function verifyTurnstile(token: string, ip: string) {
    const secret =
        process.env.TURNSTILE_SECRET_KEY ||
        '1x0000000000000000000000000000000AA'

    try {
        const res = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                body: new URLSearchParams({
                    remoteip: ip,
                    response: token,
                    secret,
                }),
                method: 'POST',
            }
        )
        const data = (await res.json()) as { success?: boolean }

        return data.success === true
    } catch {
        return false
    }
}

export async function submitContact(
    _prev: ContactState,
    formData: FormData
): Promise<ContactState> {
    // Honeypot: bots fill the hidden field — respond with a silent success.
    if (formData.get('company_website')) {
        return { message: 'Talebiniz alındı.', status: 'success' }
    }

    const headersList = await headers()
    const ip =
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        headersList.get('x-real-ip') ??
        'unknown'

    if (isRateLimited(ip)) {
        return {
            message:
                'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.',
            status: 'error',
        }
    }

    const token = String(formData.get('cf-turnstile-response') ?? '')
    const verified = await verifyTurnstile(token, ip)
    if (!verified) {
        return {
            message:
                'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.',
            status: 'error',
        }
    }

    const parsed = contactSchema.safeParse({
        company: formData.get('company') ?? undefined,
        email: formData.get('email'),
        message: formData.get('message'),
        name: formData.get('name'),
        phone: formData.get('phone') ?? undefined,
        service: formData.get('service') ?? undefined,
    })

    if (!parsed.success) {
        const errors: Record<string, string> = {}
        for (const issue of parsed.error.issues) {
            errors[String(issue.path[0])] = issue.message
        }

        return { errors, status: 'error' }
    }

    try {
        const payload = await getPayloadClient()
        await payload.create({ collection: 'leads', data: parsed.data })

        return {
            message: 'Talebiniz alındı. En kısa sürede size dönüş yapacağız.',
            status: 'success',
        }
    } catch {
        return {
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            status: 'error',
        }
    }
}
