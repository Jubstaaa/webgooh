'use client'

import { lazyDecorative } from '@/lib/lazy-decorative'

export const LazyNeuralMesh = lazyDecorative(() =>
    import('./neural-mesh').then(module => module.NeuralMesh)
)
