'use client'

import Script from 'next/script'

const SITE_KEY =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

export function Turnstile() {
    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
            />
            <div
                className="cf-turnstile"
                data-sitekey={SITE_KEY}
                data-theme="dark"
            />
        </>
    )
}
