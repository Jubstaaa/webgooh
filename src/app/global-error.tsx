'use client'

import '@/app/(frontend)/globals.css'
import { fontVariables } from '@/app/fonts'
import {
    type ErrorBoundaryProps,
    ErrorMessage,
} from '@/components/error-message'

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
