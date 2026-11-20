'use client'

import { lazyDecorative } from '@/lib/lazy-decorative'

export const LazyParticleField = lazyDecorative(() =>
    import('./particle-field').then(module => module.ParticleField)
)
