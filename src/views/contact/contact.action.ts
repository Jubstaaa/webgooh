'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'
import { contactSchema } from '@/views/contact/contact.validations'

export interface ContactState {
    // Bumped on every failed submit. A <select> only picks up defaultValue when
    // it mounts, so the form keys it off this to restore the chosen service.
    attempt?: number
    errors?: Record<string, string>
    message?: string
    status: 'idle' | 'success' | 'error'
    // React resets an uncontrolled form once the action resolves, so a failed
    // submit has to hand the typed values back as the new defaults.
    values?: Record<string, string>
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
    prev: ContactState,
    formData: FormData
): Promise<ContactState> {
    // Honeypot: bots fill the hidden field — respond with a silent success.
    if (formData.get('company_website')) {
        return { message: 'Talebiniz alındı.', status: 'success' }
    }

    const attempt = (prev.attempt ?? 0) + 1
    const values = Object.fromEntries(
        ['name', 'email', 'phone', 'company', 'service', 'message'].map(
            field => [field, String(formData.get(field) ?? '')]
        )
    )

    const headersList = await headers()
    const ip =
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        headersList.get('x-real-ip') ??
        'unknown'

    const token = String(formData.get('cf-turnstile-response') ?? '')
    const verified = await verifyTurnstile(token, ip)
    if (!verified) {
        return {
            attempt,
            message: 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.',
            status: 'error',
            values,
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

        return { attempt, errors, status: 'error', values }
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
            attempt,
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            status: 'error',
            values,
        }
    }
}
