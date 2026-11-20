import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'

import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'

import { useMediaQuery } from './use-media-query'

const QUERY = '(prefers-reduced-motion: reduce)'

let matches: boolean
let listeners: Set<() => void>
let root: Root

function Probe() {
    return <output>{String(useMediaQuery(QUERY))}</output>
}

function changeMedia(next: boolean) {
    matches = next
    for (const listener of listeners) listener()
}

describe('useMediaQuery', () => {
    beforeEach(() => {
        GlobalRegistrator.register({ url: 'http://localhost/' })
        matches = false
        listeners = new Set()
        Object.assign(globalThis, {
            IS_REACT_ACT_ENVIRONMENT: true,
            matchMedia: () => ({
                addEventListener: (_: string, listener: () => void) =>
                    listeners.add(listener),
                get matches() {
                    return matches
                },
                removeEventListener: (_: string, listener: () => void) =>
                    listeners.delete(listener),
            }),
        })
        root = createRoot(
            document.body.appendChild(document.createElement('div'))
        )
    })

    afterEach(async () => {
        act(() => root.unmount())
        await GlobalRegistrator.unregister()
    })

    test('reads the current match', () => {
        matches = true
        act(() => root.render(<Probe />))

        expect(document.querySelector('output')?.textContent).toBe('true')
    })

    test('follows the media query when it changes', () => {
        act(() => root.render(<Probe />))

        act(() => changeMedia(true))

        expect(document.querySelector('output')?.textContent).toBe('true')
    })

    test('stops listening once unmounted', () => {
        act(() => root.render(<Probe />))

        act(() => root.unmount())
        root = createRoot(document.createElement('div'))

        expect(listeners.size).toBe(0)
    })

    test('renders as not matching on the server', () => {
        expect(renderToStaticMarkup(<Probe />)).toBe('<output>false</output>')
    })
})
