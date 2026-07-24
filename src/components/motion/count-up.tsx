'use client'

import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from 'motion/react'

interface CountUpProps {
    duration?: number
    suffix?: string
    to: number
}

export function CountUp({ duration = 1400, suffix = '', to }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const reduce = useReducedMotion()

    const [value, setValue] = useState(0)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        if (reduce) {
            setValue(to)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                observer.disconnect()
                const start = performance.now()
                const tick = (now: number) => {
                    const progress = Math.min(1, (now - start) / duration)
                    const eased = 1 - Math.pow(1 - progress, 3)
                    setValue(Math.round(to * eased))
                    if (progress < 1) requestAnimationFrame(tick)
                }
                requestAnimationFrame(tick)
            },
            { threshold: 0.5 }
        )

        observer.observe(node)

        return () => observer.disconnect()
    }, [duration, reduce, to])

    return (
        <span ref={ref} className="tabular-nums">
            {value}
            {suffix}
        </span>
    )
}
