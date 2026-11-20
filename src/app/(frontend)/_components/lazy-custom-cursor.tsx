'use client'

import dynamic from 'next/dynamic'

// Decorative and invisible until the pointer moves, so it loads after the
// page has hydrated instead of with it.
export const LazyCustomCursor = dynamic(
    () => import('./custom-cursor').then(module => module.CustomCursor),
    { ssr: false }
)
