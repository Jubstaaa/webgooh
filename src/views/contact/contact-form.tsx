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
            <div className="card-surface flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
                <CheckCircle2 className="size-12 text-emerald-400" />
                <h3 className="text-paper text-xl font-semibold">
                    Teşekkürler!
                </h3>
                <p className="text-muted max-w-sm text-sm">{state.message}</p>
            </div>
        )
    }

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-muted font-mono text-xs"
                        htmlFor="name">
                        Ad Soyad *
                    </label>
                    <input
                        required
                        className={inputClass}
                        defaultValue={state.values?.name ?? ''}
                        id="name"
                        name="name"
                        placeholder="Adınız"
                    />
                    {state.errors?.name ? (
                        <span className="text-xs text-red-400">
                            {state.errors.name}
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-muted font-mono text-xs"
                        htmlFor="email">
                        E-posta *
                    </label>
                    <input
                        required
                        className={inputClass}
                        defaultValue={state.values?.email ?? ''}
                        id="email"
                        name="email"
                        placeholder="ornek@email.com"
                        type="email"
                    />
                    {state.errors?.email ? (
                        <span className="text-xs text-red-400">
                            {state.errors.email}
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-muted font-mono text-xs"
                        htmlFor="phone">
                        Telefon
                    </label>
                    <input
                        className={inputClass}
                        defaultValue={state.values?.phone ?? ''}
                        id="phone"
                        name="phone"
                        placeholder="+90 5xx xxx xx xx"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-muted font-mono text-xs"
                        htmlFor="company">
                        Şirket
                    </label>
                    <input
                        className={inputClass}
                        defaultValue={state.values?.company ?? ''}
                        id="company"
                        name="company"
                        placeholder="Şirketiniz"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    className="text-muted font-mono text-xs"
                    htmlFor="service">
                    İlgilendiğiniz hizmet
                </label>
                <select
                    key={state.attempt}
                    className={cn(inputClass, 'appearance-none')}
                    defaultValue={state.values?.service ?? ''}
                    id="service"
                    name="service">
                    <option value="">Seçiniz</option>
                    {services.map(service => (
                        <option key={service} value={service}>
                            {service}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label
                    className="text-muted font-mono text-xs"
                    htmlFor="message">
                    Mesajınız *
                </label>
                <textarea
                    required
                    className={cn(inputClass, 'min-h-32 resize-none')}
                    defaultValue={state.values?.message ?? ''}
                    id="message"
                    name="message"
                    placeholder="Projenizden kısaca bahsedin…"
                />
                {state.errors?.message ? (
                    <span className="text-xs text-red-400">
                        {state.errors.message}
                    </span>
                ) : null}
            </div>

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

            {state.status === 'error' && state.message ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {state.message}
                </p>
            ) : null}

            <SubmitButton />
        </form>
    )
}
