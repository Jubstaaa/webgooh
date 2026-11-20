'use client'

import { lazyDecorative } from '@/lib/lazy-decorative'

export const LazyCustomCursor = lazyDecorative(() =>
    import('./custom-cursor').then(module => module.CustomCursor)
)
