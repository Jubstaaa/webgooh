import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'

import { PostMeta } from './post-meta'

describe('PostMeta', () => {
    test('shows the publish date and the reading time with its label', () => {
        const html = renderToStaticMarkup(
            <PostMeta
                minutes={3}
                publishedAt="2026-03-14T09:00:00.000Z"
                readingLabel="dk okuma"
            />
        )

        expect(html).toContain('<time dateTime="2026-03-14T09:00:00.000Z">')
        expect(html).toContain('3 dk okuma</span>')
    })

    test('leaves out what the post does not have', () => {
        const html = renderToStaticMarkup(
            <PostMeta minutes={0} publishedAt={null} readingLabel="dk" />
        )

        expect(html).not.toContain('<time')
        expect(html).not.toContain('dk')
    })
})
