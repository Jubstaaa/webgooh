import type { Metadata } from 'next'

import '@/app/(frontend)/globals.css'
import NotFound from '@/app/(frontend)/not-found'
import { fontVariables } from '@/app/fonts'

// The app has two root layouts ((frontend) and (payload)), so a URL neither
// matches has no layout to render (frontend)/not-found.tsx in. This page brings
// its own document and needs no CMS data, since it is prerendered at build.
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
