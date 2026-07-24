import { Mail, MapPin, Phone } from 'lucide-react'

import { PageHero } from '@/components/sections/page-hero'
import { getServices, getSettings } from '@/lib/queries'
import { ContactForm } from '@/views/contact/contact-form'

export async function Contact() {
    const [settings, services] = await Promise.all([
        getSettings(),
        getServices(),
    ])

    const contactItems = [
        settings.email && {
            href: `mailto:${settings.email}`,
            icon: Mail,
            label: 'E-posta',
            value: settings.email,
        },
        settings.phonePrimary && {
            href: `tel:${settings.phonePrimary.replace(/\s/g, '')}`,
            icon: Phone,
            label: 'Telefon',
            value: settings.phonePrimary,
        },
        settings.address && {
            icon: MapPin,
            label: 'Adres',
            value: settings.address,
        },
    ].filter(Boolean) as {
        href?: string
        icon: typeof Mail
        label: string
        value: string
    }[]

    return (
        <div className="flex flex-col gap-16 pb-8">
            <PageHero
                description="Projeniz, fikriniz ya da bir sorunuz mu var? Formu doldurun; ekibimiz en kısa sürede size dönsün."
                eyebrow="iletişim"
                title="Konuşalım"
            />

            <section className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
                <div className="flex flex-col gap-4">
                    {contactItems.map(item => {
                        const content = (
                            <div className="card-surface hover:border-brand/40 flex items-start gap-4 rounded-2xl p-5 transition-colors">
                                <div className="bg-brand/12 text-brand-bright ring-brand/25 grid size-11 place-items-center rounded-xl ring-1">
                                    <item.icon
                                        className="size-5"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-faint font-mono text-xs tracking-wider uppercase">
                                        {item.label}
                                    </span>
                                    <span className="text-paper text-sm">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        )

                        return item.href ? (
                            <a key={item.label} href={item.href}>
                                {content}
                            </a>
                        ) : (
                            <div key={item.label}>{content}</div>
                        )
                    })}
                </div>

                <div className="card-surface rounded-2xl p-6 sm:p-8">
                    <ContactForm
                        services={services.map(service => service.title)}
                    />
                </div>
            </section>
        </div>
    )
}
