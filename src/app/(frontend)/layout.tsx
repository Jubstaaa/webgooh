import type { Metadata, Viewport } from 'next'

import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import { FloatingActions } from '@/components/layout/floating-actions'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { getSettings } from '@/lib/queries'

import './globals.css'

const inter = Inter({
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
    display: 'swap',
    subsets: ['latin', 'latin-ext'],
    variable: '--font-jetbrains',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webgooh.com'

export const metadata: Metadata = {
    alternates: { canonical: '/' },
    description:
        'Markaları büyüten web yazılım, mobil uygulama, UX/UI, SEO, siber güvenlik ve DevOps çözümleri. İstanbul merkezli uçtan uca dijital mühendislik.',
    keywords: [
        'web yazılım',
        'mobil uygulama',
        'siber güvenlik',
        'ux ui tasarım',
        'yapay zeka',
        'seo',
        'devops',
        'İstanbul yazılım ajansı',
    ],
    metadataBase: new URL(SITE_URL),
    openGraph: {
        locale: 'tr_TR',
        siteName: 'Webgooh',
        type: 'website',
        url: SITE_URL,
    },
    robots: { follow: true, index: true },
    title: {
        default: 'Webgooh — Web Yazılım, Mobil ve Siber Güvenlik Ajansı',
        template: '%s — Webgooh',
    },
    twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
    colorScheme: 'dark',
    themeColor: '#0b1020',
}

export default async function FrontendLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const settings = await getSettings()

    return (
        <html
            className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
            data-scroll-behavior="smooth"
            lang="tr">
            <body className="min-h-dvh antialiased">
                <Header />
                <main className="pt-16">{children}</main>
                <Footer />
                <FloatingActions whatsapp={settings.whatsapp} />
            </body>
        </html>
    )
}
