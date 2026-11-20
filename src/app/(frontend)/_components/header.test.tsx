import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'

import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'

void mock.module('next/navigation', () => ({ usePathname: () => '/' }))

const { Header } = await import('./header')

describe('Header', () => {
    test('the menu toggle announces the closed mobile menu it controls', () => {
        const html = renderToStaticMarkup(<Header />)

        expect(html).toContain('aria-controls="mobile-menu"')
        expect(html).toContain('aria-expanded="false"')
    })

    test('the closed mobile menu stays out of the tab order', () => {
        const html = renderToStaticMarkup(<Header />)

        expect(html).toMatch(/<div[^>]*id="mobile-menu"[^>]*inert=""/)
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

        test('the toggle opens the menu and lets keyboard users into it', () => {
            root = createRoot(
                document.body.appendChild(document.createElement('div'))
            )
            act(() => root.render(<Header />))
            const toggle = document.querySelector(
                '[aria-controls="mobile-menu"]'
            )

            act(() => {
                toggle?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                )
            })

            expect(toggle?.getAttribute('aria-expanded')).toBe('true')
            expect(
                document.getElementById('mobile-menu')?.hasAttribute('inert')
            ).toBe(false)
        })
    })
})
