'use client'

import '@/app/(frontend)/globals.css'
import { fontVariables } from '@/app/fonts'
import {
    type ErrorBoundaryProps,
    ErrorMessage,
} from '@/components/error-message'

// Replaces the root layout when that layout itself fails, so it brings its own
// document, styles and fonts, and no header or footer that could fail again.
export default function GlobalError(props: ErrorBoundaryProps) {
    return (
        <html className={fontVariables} lang="tr">
            <body className="min-h-dvh antialiased">
                <title>Bir şeyler ters gitti — Webgooh</title>
                <main>
                    <ErrorMessage {...props} />
                </main>
            </body>
        </html>
    )
}
