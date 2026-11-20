import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, mock, test } from 'bun:test'

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
})
