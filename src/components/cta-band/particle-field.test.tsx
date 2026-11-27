import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'

import { ParticleField } from './particle-field'

type VisibilityEntry = Pick<IntersectionObserverEntry, 'isIntersecting'>

let reportVisibility: (entries: VisibilityEntry[]) => void
let scheduledFrames: number
let root: Root

describe('ParticleField', () => {
    beforeEach(() => {
        GlobalRegistrator.register({ url: 'http://localhost/' })
        scheduledFrames = 0
        HTMLCanvasElement.prototype.getContext = (() =>
            new Proxy({}, { get: () => () => undefined })) as never
        Object.assign(globalThis, {
            cancelAnimationFrame: () => undefined,
            IntersectionObserver: class {
                constructor(callback: (entries: VisibilityEntry[]) => void) {
                    reportVisibility = callback
                }
                disconnect() {}
                observe() {}
            },
            IS_REACT_ACT_ENVIRONMENT: true,
            matchMedia: () => ({
                addEventListener() {},
                matches: false,
                removeEventListener() {},
            }),
            requestAnimationFrame: () => ++scheduledFrames,
            ResizeObserver: class {
                disconnect() {}
                observe() {}
            },
        })
        root = createRoot(
            document.body.appendChild(document.createElement('div'))
        )
        act(() => root.render(<ParticleField />))
    })

    afterEach(async () => {
        act(() => root.unmount())
        await GlobalRegistrator.unregister()
    })

    test('animates once the band scrolls into view', () => {
        act(() => reportVisibility([{ isIntersecting: true }]))

        expect(scheduledFrames).toBeGreaterThan(0)
    })

    test('a batch of visibility changes follows the latest one', () => {
        act(() =>
            reportVisibility([
                { isIntersecting: true },
                { isIntersecting: false },
            ])
        )

        expect(scheduledFrames).toBe(0)
    })
})
