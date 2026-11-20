import { act } from 'react'
import { createRoot } from 'react-dom/client'

import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { Window } from 'happy-dom'

import { NeuralMesh } from './neural-mesh'

type VisibilityCallback = (entries: { isIntersecting: boolean }[]) => void

const stubbedGlobals = [
    'cancelAnimationFrame',
    'document',
    'HTMLElement',
    'IntersectionObserver',
    'IS_REACT_ACT_ENVIRONMENT',
    'requestAnimationFrame',
    'ResizeObserver',
    'window',
] as const
let savedGlobals: Map<string, PropertyDescriptor | undefined>
let window: Window
let reportVisibility: VisibilityCallback
let scheduledFrames: number
let cancelledFrames: number

function installDom() {
    savedGlobals = new Map(
        stubbedGlobals.map(key => [
            key,
            Object.getOwnPropertyDescriptor(globalThis, key),
        ])
    )
    window = new Window()
    scheduledFrames = 0
    cancelledFrames = 0

    window.HTMLCanvasElement.prototype.getContext = (() =>
        new Proxy({}, { get: () => () => undefined })) as never

    Object.assign(globalThis, {
        cancelAnimationFrame: () => {
            cancelledFrames++
        },
        document: window.document,
        HTMLElement: window.HTMLElement,
        IntersectionObserver: class {
            constructor(callback: VisibilityCallback) {
                reportVisibility = callback
            }
            disconnect() {}
            observe() {}
        },
        IS_REACT_ACT_ENVIRONMENT: true,
        requestAnimationFrame: () => ++scheduledFrames,
        ResizeObserver: class {
            disconnect() {}
            observe() {}
        },
        window: Object.assign(window, {
            matchMedia: () => ({ matches: false }),
        }),
    })
}

function renderMesh() {
    const host = window.document.createElement('div')
    window.document.body.appendChild(host)
    const root = createRoot(host as unknown as HTMLElement)
    act(() => root.render(<NeuralMesh />))

    return root
}

describe('NeuralMesh', () => {
    beforeEach(installDom)
    afterEach(() => {
        void window.happyDOM.close()
        for (const [key, descriptor] of savedGlobals) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor)
            else Reflect.deleteProperty(globalThis, key)
        }
    })

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
})
