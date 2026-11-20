'use client'

import dynamic from 'next/dynamic'

// Purely decorative and empty until it draws, so it stays out of the server
// HTML and the hydration bundle the hero text waits on.
export const LazyNeuralMesh = dynamic(
    () => import('./neural-mesh').then(module => module.NeuralMesh),
    { ssr: false }
)
