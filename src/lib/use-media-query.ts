import { useCallback, useSyncExternalStore } from 'react'

// Server render and hydration assume no match, so motion and hover effects
// switch on only once the client confirms them.
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const list = window.matchMedia(query)
            list.addEventListener('change', onChange)

            return () => list.removeEventListener('change', onChange)
        },
        [query]
    )

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false
    )
}
