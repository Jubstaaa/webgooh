import { renderToStaticMarkup } from 'react-dom/server'

import { afterEach, beforeEach, describe, expect, test } from 'bun:test'

import { loadDecorative } from './lazy-decorative'

const originalReportError = globalThis.reportError
let reported: unknown[]

function Canvas() {
    return <canvas />
}

describe('loadDecorative', () => {
    beforeEach(() => {
        reported = []
        globalThis.reportError = (error: unknown) => {
            reported.push(error)
        }
    })

    afterEach(() => {
        globalThis.reportError = originalReportError
    })

    test('resolves to the loaded component', async () => {
        const Loaded = await loadDecorative(() => Promise.resolve(Canvas))()

        expect(renderToStaticMarkup(<Loaded />)).toBe('<canvas></canvas>')
        expect(reported).toEqual([])
    })

    test('a failed chunk load renders nothing and is reported', async () => {
        const failure = new Error('ChunkLoadError')

        const Loaded = await loadDecorative(() => Promise.reject(failure))()

        expect(renderToStaticMarkup(<Loaded />)).toBe('')
        expect(reported).toEqual([failure])
    })
})
