import { renderToStaticMarkup } from 'react-dom/server'

import { describe, expect, mock, test } from 'bun:test'

void mock.module('@/app/fonts', () => ({ fontVariables: 'fonts' }))

const { default: GlobalError } = await import('./global-error')

describe('GlobalError', () => {
    test('renders its own Turkish document with a retry', () => {
        const html = renderToStaticMarkup(
            <GlobalError error={new Error('boom')} retry={() => {}} />
        )

        expect(html).toMatch(/^<html[^>]*lang="tr"/)
        expect(html).toContain('<body')
        expect(html).toContain('Bir şeyler ters gitti')
        expect(html).toContain('Tekrar dene')
    })
})
