import type { ComponentType } from 'react'

import dynamic from 'next/dynamic'

export function lazyDecorative<P extends object>(
    loader: () => Promise<ComponentType<P>>
) {
    return dynamic(loadDecorative(loader), { ssr: false })
}

export function loadDecorative<P extends object>(
    loader: () => Promise<ComponentType<P>>
): () => Promise<ComponentType<P>> {
    return () =>
        loader().catch((error: unknown) => {
            reportError(error)

            return Nothing
        })
}

function Nothing() {
    return null
}
