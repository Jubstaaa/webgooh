import Link from 'next/link'

import { Mail, MapPin, Phone } from 'lucide-react'

import { Logo } from '@/components/layout/logo'
import { Socials } from '@/components/layout/socials'
import { mainNav } from '@/lib/navigation'
import { getServices, getSettings } from '@/lib/queries'

export async function Footer() {
    const [settings, services] = await Promise.all([
        getSettings(),
        getServices(),
    ])

    return (
        <footer className="border-line bg-ink-soft relative mt-24 border-t">
            <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                <div className="flex flex-col gap-4">
                    <Logo />
                    <p className="text-muted max-w-xs text-sm leading-relaxed">
                        Markaları büyüten yazılım, mobil ve siber güvenlik
                        çözümleri. İstanbul merkezli, uçtan uca dijital
                        mühendislik.
                    </p>
                    <Socials socials={settings.socials} />
                </div>

                <div className="flex flex-col gap-3">
                    <p className="eyebrow">{'// menü'}</p>
                    {mainNav.slice(1).map(item => (
                        <Link
                            key={item.href}
                            className="text-muted hover:text-paper text-sm transition-colors"
                            href={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <p className="eyebrow">{'// hizmetler'}</p>
                    {services.slice(0, 6).map(service => (
                        <Link
                            key={service.id}
                            className="text-muted hover:text-paper text-sm transition-colors"
                            href={`/hizmetlerimiz/${service.slug}`}>
                            {service.title}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <p className="eyebrow">{'// iletişim'}</p>
                    <a
                        className="text-muted hover:text-paper flex items-center gap-2 text-sm transition-colors"
                        href={`mailto:${settings.email}`}>
                        <Mail className="text-brand-bright size-4" />
                        {settings.email}
                    </a>
                    {settings.phonePrimary ? (
                        <a
                            className="text-muted hover:text-paper flex items-center gap-2 text-sm transition-colors"
                            href={`tel:${settings.phonePrimary.replace(/\s/g, '')}`}>
                            <Phone className="text-brand-bright size-4" />
                            {settings.phonePrimary}
                        </a>
                    ) : null}
                    {settings.address ? (
                        <p className="text-muted flex items-start gap-2 text-sm">
                            <MapPin className="text-brand-bright mt-0.5 size-4 shrink-0" />
                            {settings.address}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="border-line border-t">
                <div className="container-x text-faint flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} Webgooh. Tüm hakları
                        saklıdır.
                    </p>
                    <p className="font-mono">İstanbul, Türkiye · webgooh.com</p>
                </div>
            </div>
        </footer>
    )
}
