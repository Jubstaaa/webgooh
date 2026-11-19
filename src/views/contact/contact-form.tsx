'use client'

import { useActionState, useEffect } from 'react'

import { useFormStatus } from 'react-dom'

import { CheckCircle2, Send } from 'lucide-react'

import { resetTurnstile, Turnstile } from '@/components/form/turnstile'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    type ContactState,
    submitContact,
} from '@/views/contact/contact.action'
import { FormField } from '@/views/contact/form-field'

interface ContactFormProps {
    services: string[]
}

const initialState: ContactState = { status: 'idle' }

const inputClass =
    'w-full rounded-xl border border-line bg-surface/40 px-4 py-3 text-sm text-paper placeholder:text-faint transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            className="w-full sm:w-auto"
            disabled={pending}
            size="lg"
            type="submit">
            {pending ? 'Gönderiliyor…' : 'Talebi gönder'}
            <Send className="size-4" />
        </Button>
    )
}

export function ContactForm({ services }: ContactFormProps) {
    const [state, formAction] = useActionState(submitContact, initialState)

    useEffect(() => {
        if (state.status === 'error') resetTurnstile()
    }, [state])

    if (state.status === 'success') {
        return (
            <div
                className="card-surface flex flex-col items-center gap-4 rounded-2xl p-10 text-center"
                role="status">
                <CheckCircle2 className="size-12 text-emerald-400" />
                <h3 className="text-paper text-xl font-semibold">
                    Teşekkürler!
                </h3>
                <p className="text-muted max-w-sm text-sm">{state.message}</p>
            </div>
        )
    }

    const errors = state.errors ?? {}

    return (
        <form noValidate action={formAction} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField error={errors.name} id="name" label="Ad Soyad *">
                    {control => (
                        <input
                            {...control}
                            required
                            autoComplete="name"
                            className={inputClass}
                            defaultValue={state.values?.name ?? ''}
                            maxLength={100}
                            name="name"
                            placeholder="Adınız"
                        />
                    )}
                </FormField>

                <FormField error={errors.email} id="email" label="E-posta *">
                    {control => (
                        <input
                            {...control}
                            required
                            autoComplete="email"
                            className={inputClass}
                            defaultValue={state.values?.email ?? ''}
                            maxLength={254}
                            name="email"
                            placeholder="ornek@email.com"
                            type="email"
                        />
                    )}
                </FormField>

                <FormField error={errors.phone} id="phone" label="Telefon">
                    {control => (
                        <input
                            {...control}
                            autoComplete="tel"
                            className={inputClass}
                            defaultValue={state.values?.phone ?? ''}
                            maxLength={30}
                            name="phone"
                            placeholder="+90 5xx xxx xx xx"
                            type="tel"
                        />
                    )}
                </FormField>

                <FormField error={errors.company} id="company" label="Şirket">
                    {control => (
                        <input
                            {...control}
                            autoComplete="organization"
                            className={inputClass}
                            defaultValue={state.values?.company ?? ''}
                            maxLength={150}
                            name="company"
                            placeholder="Şirketiniz"
                        />
                    )}
                </FormField>
            </div>

            <FormField
                error={errors.service}
                id="service"
                label="İlgilendiğiniz hizmet">
                {control => (
                    <select
                        {...control}
                        key={state.attempt}
                        className={cn(inputClass, 'appearance-none')}
                        defaultValue={state.values?.service ?? ''}
                        name="service">
                        <option value="">Seçiniz</option>
                        {services.map(service => (
                            <option key={service} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                )}
            </FormField>

            <FormField error={errors.message} id="message" label="Mesajınız *">
                {control => (
                    <textarea
                        {...control}
                        required
                        className={cn(inputClass, 'min-h-32 resize-none')}
                        defaultValue={state.values?.message ?? ''}
                        maxLength={5000}
                        name="message"
                        placeholder="Projenizden kısaca bahsedin…"
                    />
                )}
            </FormField>

            <div aria-hidden className="hidden">
                <label htmlFor="company_website">Web siteniz</label>
                <input
                    autoComplete="off"
                    id="company_website"
                    name="company_website"
                    tabIndex={-1}
                />
            </div>

            <Turnstile />

            {/* Always mounted so the live region exists before a message
                arrives; screen readers ignore regions inserted with content. */}
            <div aria-live="assertive" role="alert">
                {state.status === 'error' ? (
                    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {state.message ??
                            'Lütfen işaretli alanları düzeltip tekrar deneyin.'}
                    </p>
                ) : null}
            </div>

            <SubmitButton />
        </form>
    )
}
