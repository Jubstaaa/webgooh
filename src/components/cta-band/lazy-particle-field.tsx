'use client'

import dynamic from 'next/dynamic'

// Decorative canvas below the fold: it loads after the page has hydrated.
export const LazyParticleField = dynamic(
    () => import('./particle-field').then(module => module.ParticleField),
    { ssr: false }
)
