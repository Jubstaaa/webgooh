'use client'

import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from 'motion/react'

interface MagneticProps {
    children: React.ReactNode
    className?: string
    strength?: number
}

export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const reduce = useReducedMotion()

    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        setEnabled(!reduce && window.matchMedia('(hover: hover)').matches)
    }, [reduce])

    const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
        const el = ref.current
        if (!el || !enabled) return
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left - rect.width / 2) * strength
        const y = (event.clientY - rect.top - rect.height / 2) * strength
        el.style.transform = `translate(${x}px, ${y}px)`
    }

    const handlePointerLeave = () => {
        const el = ref.current
        if (el) el.style.transform = ''
    }

    return (
        <span
            ref={ref}
            className={className}
            style={{
                display: 'inline-flex',
                transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
            }}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}>
            {children}
        </span>
    )
}
