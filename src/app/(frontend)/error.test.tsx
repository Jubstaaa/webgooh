import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, test } from 'bun:test'

import ErrorPage from './error'

describe('ErrorPage', () => {
    test('offers a retry and a way home in Turkish', () => {
        const html = renderToStaticMarkup(
            <ErrorPage error={new Error('boom')} retry={() => {}} />
        )

        expect(html).toContain('<h1')
        expect(html).toContain('Bir şeyler ters gitti')
        expect(html).toMatch(
            /<button[^>]*type="button"[^>]*>Tekrar dene<\/button>/
        )
        expect(html).toMatch(/<a[^>]*href="\/"[^>]*>Ana sayfaya dön<\/a>/)
        expect(html).not.toContain('boom')
    })
})
