import type { ComponentType } from 'react'

import dynamic from 'next/dynamic'

function Nothing() {
    return null
}

// A decorative chunk that fails to load (deploy skew, a flaky mobile link)
// must not take the page down with it: report it and render nothing.
export function loadDecorative<P extends object>(
    loader: () => Promise<ComponentType<P>>
): () => Promise<ComponentType<P>> {
    return () =>
        loader().catch((error: unknown) => {
            reportError(error)

            return Nothing
        })
}

// Client-only: decorative parts are empty until they draw, so they stay out
// of the server HTML and the hydration bundle.
export function lazyDecorative<P extends object>(
    loader: () => Promise<ComponentType<P>>
) {
    return dynamic(loadDecorative(loader), { ssr: false })
}
