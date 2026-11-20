import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'

import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'

import { FloatingActions } from './floating-actions'

describe('FloatingActions', () => {
    test('the back-to-top button is out of the tab order until the page scrolls', () => {
        const html = renderToStaticMarkup(<FloatingActions />)

        expect(html).toMatch(
            /<button[^>]*aria-label="Sayfa başına dön"[^>]*inert=""/
        )
    })

    describe('in the browser', () => {
        let root: Root

        beforeEach(() => {
            GlobalRegistrator.register({ url: 'http://localhost/' })
            Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
        })

        afterEach(async () => {
            act(() => root.unmount())
            await GlobalRegistrator.unregister()
        })

        test('scrolling past the threshold makes the back-to-top button reachable', () => {
            root = createRoot(
                document.body.appendChild(document.createElement('div'))
            )
            act(() => root.render(<FloatingActions />))
            const button = document.querySelector(
                '[aria-label="Sayfa başına dön"]'
            )

            act(() => {
                Object.defineProperty(window, 'scrollY', { value: 700 })
                window.dispatchEvent(new Event('scroll'))
            })

            expect(button?.hasAttribute('inert')).toBe(false)
        })
    })

    test('links to WhatsApp with the digits of the configured number', () => {
        const html = renderToStaticMarkup(
            <FloatingActions whatsapp="+90 (555) 123 45 67" />
        )

        expect(html).toContain('href="https://wa.me/905551234567"')
    })
})
