'use client'

import { useCallback, useEffect, useRef } from 'react'

import Script from 'next/script'

import type { TurnstileApi } from '@/components/form/turnstile.types'

const SITE_KEY =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

// The page never renders more than one widget, so the id lives at module scope
// and the form can reset it without threading a ref through the tree.
let widgetId: string | null = null

function getTurnstile() {
    return (window as unknown as { turnstile?: TurnstileApi }).turnstile
}

// Tokens are single-use, so a rejected submit leaves the widget holding a spent
// one. Without this the next attempt fails no matter what the visitor fixes.
export function resetTurnstile() {
    if (widgetId) getTurnstile()?.reset(widgetId)
}

export function Turnstile() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Explicit rendering, so the widget is tied to an id we own. Left implicit,
    // Cloudflare tracks it by a DOM node React may have replaced, and reset()
    // then fails with "Cannot find Widget".
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
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                strategy="afterInteractive"
                onReady={render}
            />
            <div ref={containerRef} />
        </>
    )
}
