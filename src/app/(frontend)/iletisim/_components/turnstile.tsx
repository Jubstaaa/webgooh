'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef } from 'react'

interface TurnstileApi {
    remove: (id: string) => void
    render: (
        container: HTMLElement,
        options: { sitekey: string; theme: string }
    ) => string
    reset: (id: string) => void
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

let widgetId: null | string = null

export function resetTurnstile() {
    if (widgetId) getTurnstile()?.reset(widgetId)
}

export function Turnstile() {
    const containerRef = useRef<HTMLDivElement>(null)

    const render = useCallback(() => {
        const turnstile = getTurnstile()
        if (!turnstile || !containerRef.current || widgetId) return

        widgetId = turnstile.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme: 'dark',
        })
    }, [])

    useEffect(() => {
        render()

        return () => {
            if (!widgetId) return
            getTurnstile()?.remove(widgetId)
            widgetId = null
        }
    }, [render])

    return (
        <>
            <Script
                onReady={render}
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="afterInteractive"
            />
            <div ref={containerRef} />
        </>
    )
}

function getTurnstile() {
    return (window as unknown as { turnstile?: TurnstileApi }).turnstile
}
