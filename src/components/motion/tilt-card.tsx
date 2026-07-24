'use client'

import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface TiltCardProps {
    children: React.ReactNode
    className?: string
}

export function TiltCard({ children, className }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()

    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        setEnabled(
            !reduce && window.matchMedia('(hover: hover)').matches
        )
    }, [reduce])

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const el = ref.current
        if (!el || !enabled) return
        const rect = el.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
        el.style.transform = `perspective(800px) rotateX(${(py - 0.5) * -6}deg) rotateY(${(px - 0.5) * 8}deg) translateY(-6px)`
    }

    const handlePointerLeave = () => {
        const el = ref.current
        if (el) el.style.transform = ''
    }

    return (
        <div
            ref={ref}
            className={cn('relative transition-transform duration-200', className)}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}>
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--color-brand) 22%, transparent), transparent 60%)',
                }}
            />
            {children}
        </div>
    )
}
