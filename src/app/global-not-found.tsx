import type { Metadata } from 'next'

import '@/app/(frontend)/globals.css'
import NotFound from '@/app/(frontend)/not-found'
import { fontVariables } from '@/app/fonts'

export const metadata: Metadata = {
    title: 'Sayfa bulunamadı — Webgooh',
}

export default function GlobalNotFound() {
    return (
        <html className={fontVariables} lang="tr">
            <body className="min-h-dvh antialiased">
                <main>
                    <NotFound />
                </main>
            </body>
        </html>
    )
}
