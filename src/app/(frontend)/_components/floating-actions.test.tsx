import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, test } from 'bun:test'

import { FloatingActions } from './floating-actions'

describe('FloatingActions', () => {
    test('the back-to-top button is out of the tab order until the page scrolls', () => {
        const html = renderToStaticMarkup(<FloatingActions />)

        expect(html).toMatch(
            /<button[^>]*aria-label="Sayfa başına dön"[^>]*inert=""/
        )
    })

    test('links to WhatsApp with the digits of the configured number', () => {
        const html = renderToStaticMarkup(
            <FloatingActions whatsapp="+90 (555) 123 45 67" />
        )

        expect(html).toContain('href="https://wa.me/905551234567"')
    })
})
