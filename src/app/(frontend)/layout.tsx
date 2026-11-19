import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import { CustomCursor } from '@/app/(frontend)/_components/custom-cursor'
import { FloatingActions } from '@/app/(frontend)/_components/floating-actions'
import { Footer } from '@/app/(frontend)/_components/footer'
import { Header } from '@/app/(frontend)/_components/header'
import { ScrollProgress } from '@/app/(frontend)/_components/scroll-progress'
import { getSettings } from '@/lib/queries'

import './globals.css'
import { SITE_URL } from '@/lib/site.mjs'

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

const INDEXABLE = process.env.SITE_INDEXABLE === 'true'

export const metadata: Metadata = {
    alternates: {
        canonical: '/',
        types: { 'application/rss+xml': `${SITE_URL}/rss.xml` },
    },
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
    robots: INDEXABLE
        ? { follow: true, index: true }
        : {
              follow: false,
              googleBot: { follow: false, index: false },
              index: false,
              nocache: true,
          },
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
                <a
                    className="bg-paper text-ink focus-visible:ring-accent sr-only z-[70] rounded-full text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus-visible:ring-2"
                    href="#main">
                    Ana içeriğe geç
                </a>
                <ScrollProgress />
                <CustomCursor />
                <Header />
                <main className="scroll-mt-16 pt-16" id="main" tabIndex={-1}>
                    {children}
                </main>
                <Footer />
                <FloatingActions whatsapp={settings.whatsapp} />
            </body>
        </html>
    )
}
