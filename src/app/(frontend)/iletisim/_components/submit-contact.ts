'use server'

import { headers } from 'next/headers'

import { errorSummary } from '@/lib/error-summary'
import { getPayloadClient } from '@/lib/payload'
import { getServices } from '@/lib/queries'

import { createContactSchema } from './contact-schema'
import { clientIp, verifyTurnstile } from './verify-turnstile'

export interface ContactState {
    attempt?: number
    errors?: Record<string, string>
    message?: string
    status: 'error' | 'idle' | 'success'

    values?: Record<string, string>
}

export async function submitContact(
    prev: ContactState,
    formData: FormData
): Promise<ContactState> {
    if (formData.get('company_website')) {
        return { message: 'Talebiniz alındı.', status: 'success' }
    }

    const attempt = (prev.attempt ?? 0) + 1
    const values = Object.fromEntries(
        ['name', 'email', 'phone', 'company', 'service', 'message'].map(
            field => [field, formText(formData, field)]
        )
    )

    const verified = await verifyTurnstile({
        ip: clientIp(await headers()),
        secret: process.env.TURNSTILE_SECRET_KEY,
        token: formText(formData, 'cf-turnstile-response'),
    })
    if (!verified) {
        return {
            attempt,
            message: 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.',
            status: 'error',
            values,
        }
    }

    try {
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

        const payload = await getPayloadClient()
        await payload.create({
            collection: 'leads',
            data: {
                email: parsed.data.email,
                message: parsed.data.message,
                name: parsed.data.name,
                ...(parsed.data.company === undefined
                    ? {}
                    : { company: parsed.data.company }),
                ...(parsed.data.phone === undefined
                    ? {}
                    : { phone: parsed.data.phone }),
                ...(parsed.data.service === undefined
                    ? {}
                    : { service: parsed.data.service }),
            },
        })

        return {
            message: 'Talebiniz alındı. En kısa sürede size dönüş yapacağız.',
            status: 'success',
        }
    } catch (error) {
        console.error('Saving a contact lead failed', errorSummary(error))

        return {
            attempt,
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            status: 'error',
            values,
        }
    }
}

function formText(formData: FormData, field: string) {
    const value = formData.get(field)

    return typeof value === 'string' ? value : ''
}
