import { describe, expect, mock, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

void mock.module('@/app/fonts', () => ({ fontVariables: 'fonts' }))

const { default: GlobalNotFound, metadata } = await import('./global-not-found')

describe('GlobalNotFound', () => {
    test('renders the site 404 in its own Turkish document', () => {
        const html = renderToStaticMarkup(<GlobalNotFound />)

        expect(html).toMatch(/^<html[^>]*lang="tr"/)
        expect(html).toContain('Sayfa bulunamadı')
        expect(metadata.title).toBe('Sayfa bulunamadı — Webgooh')
    })
})
