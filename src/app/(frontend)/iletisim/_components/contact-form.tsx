'use client'

import { CheckCircle2, Send } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/button'
import { cn } from '@/lib/utils'

import { FormField } from './form-field'
import { type ContactState, submitContact } from './submit-contact'
import { resetTurnstile, Turnstile } from './turnstile'

interface ContactFormProps {
    services: string[]
}

const initialState: ContactState = { status: 'idle' }

const inputClass =
    'w-full rounded-xl border border-line bg-surface/40 px-4 py-3 text-sm text-paper placeholder:text-faint transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20'

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
        <form action={formAction} className="flex flex-col gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField error={errors.name} id="name" label="Ad Soyad *">
                    {control => (
                        <input
                            {...control}
                            autoComplete="name"
                            className={inputClass}
                            defaultValue={state.values?.name ?? ''}
                            maxLength={100}
                            name="name"
                            placeholder="Adınız"
                            required
                        />
                    )}
                </FormField>

                <FormField error={errors.email} id="email" label="E-posta *">
                    {control => (
                        <input
                            {...control}
                            autoComplete="email"
                            className={inputClass}
                            defaultValue={state.values?.email ?? ''}
                            maxLength={254}
                            name="email"
                            placeholder="ornek@email.com"
                            required
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
                        className={cn(inputClass, 'appearance-none')}
                        defaultValue={state.values?.service ?? ''}
                        key={state.attempt}
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
                        className={cn(inputClass, 'min-h-32 resize-none')}
                        defaultValue={state.values?.message ?? ''}
                        maxLength={5000}
                        name="message"
                        placeholder="Projenizden kısaca bahsedin…"
                        required
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
