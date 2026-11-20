import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, test } from 'bun:test'

import NotFound from './not-found'

describe('NotFound', () => {
    test('tells the visitor the page is missing and links home', () => {
        const html = renderToStaticMarkup(<NotFound />)

        expect(html).toContain('404')
        expect(html).toContain('<h1')
        expect(html).toContain('Sayfa bulunamadı')
        expect(html).toContain(
            'Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.'
        )
        expect(html).toMatch(/<a[^>]*href="\/"[^>]*>Ana sayfaya dön<\/a>/)
    })
})
