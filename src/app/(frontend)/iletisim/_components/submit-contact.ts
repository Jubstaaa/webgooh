'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'
import { getServices } from '@/lib/queries'

import { createContactSchema } from './contact-schema'
import { clientIp, verifyTurnstile } from './verify-turnstile'

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

    const verified = await verifyTurnstile({
        ip: clientIp(await headers()),
        secret: process.env.TURNSTILE_SECRET_KEY,
        token: String(formData.get('cf-turnstile-response') ?? ''),
    })
    if (!verified) {
        return {
            attempt,
            message: 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.',
            status: 'error',
            values,
        }
    }

    const services = await getServices()
    const parsed = createContactSchema(
        services.map(service => service.title)
    ).safeParse(values)

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
    } catch (error) {
        console.error('Saving a contact lead failed', error)

        return {
            attempt,
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            status: 'error',
            values,
        }
    }
}
