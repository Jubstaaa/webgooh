import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'

import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'

import { NeuralMesh } from './neural-mesh'

type VisibilityEntry = Pick<IntersectionObserverEntry, 'isIntersecting'>

let reportVisibility: (entries: VisibilityEntry[]) => void
let reportResize: () => void
let scheduledFrames: number
let cancelledFrames: number
let paintedNodes: number
let disconnectedObservers: number
let root: Root

function installDom({ reducedMotion = false } = {}) {
    GlobalRegistrator.register({ url: 'http://localhost/' })
    scheduledFrames = 0
    cancelledFrames = 0
    paintedNodes = 0
    disconnectedObservers = 0

    const context = new Proxy(
        {},
        {
            get: (_, method) => () => {
                if (method === 'arc') paintedNodes++
            },
        }
    )
    HTMLCanvasElement.prototype.getContext = (() => context) as never

    Object.assign(globalThis, {
        cancelAnimationFrame: () => {
            cancelledFrames++
        },
        IntersectionObserver: class {
            constructor(callback: (entries: VisibilityEntry[]) => void) {
                reportVisibility = callback
            }
            disconnect() {
                disconnectedObservers++
            }
            observe() {}
        },
        IS_REACT_ACT_ENVIRONMENT: true,
        matchMedia: (query: string) => ({
            addEventListener() {},
            matches:
                reducedMotion && query === '(prefers-reduced-motion: reduce)',
            removeEventListener() {},
        }),
        requestAnimationFrame: () => ++scheduledFrames,
        ResizeObserver: class {
            constructor(callback: () => void) {
                reportResize = callback
            }
            disconnect() {
                disconnectedObservers++
            }
            observe() {}
        },
    })
}

function renderMesh() {
    const host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    act(() => root.render(<NeuralMesh />))
}

describe('NeuralMesh', () => {
    afterEach(async () => {
        act(() => root.unmount())
        await GlobalRegistrator.unregister()
    })

    describe('with motion allowed', () => {
        beforeEach(() => installDom())

        test('does not animate before the hero is on screen', () => {
            renderMesh()

            expect(scheduledFrames).toBe(0)
        })

        test('animates while visible and stops once scrolled away', () => {
            renderMesh()

            act(() => reportVisibility([{ isIntersecting: true }]))
            expect(scheduledFrames).toBeGreaterThan(0)

            act(() => reportVisibility([{ isIntersecting: false }]))
            expect(cancelledFrames).toBeGreaterThan(0)
        })

        test('a batch of visibility changes follows the latest one', () => {
            renderMesh()

            act(() =>
                reportVisibility([
                    { isIntersecting: true },
                    { isIntersecting: false },
                ])
            )

            expect(scheduledFrames).toBe(0)
        })

        test('unmounting stops the loop and every observer', () => {
            renderMesh()
            act(() => reportVisibility([{ isIntersecting: true }]))

            act(() => root.unmount())
            root = createRoot(document.createElement('div'))

            expect(cancelledFrames).toBeGreaterThan(0)
            expect(disconnectedObservers).toBe(2)
        })
    })

    describe('with reduced motion', () => {
        beforeEach(() => installDom({ reducedMotion: true }))

        test('keeps a static frame on screen after a resize', () => {
            renderMesh()
            paintedNodes = 0

            act(() => reportResize())

            expect(paintedNodes).toBeGreaterThan(0)
            expect(scheduledFrames).toBe(0)
        })
    })
})
