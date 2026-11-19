'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ring = ringRef.current
        const dot = dotRef.current
        if (!ring || !dot) return

        const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (!fine.matches || reduce.matches) return

        let ringX = window.innerWidth / 2
        let ringY = window.innerHeight / 2
        let targetX = ringX
        let targetY = ringY
        let frame = 0

        const onMove = (event: PointerEvent) => {
            targetX = event.clientX
            targetY = event.clientY
            dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`
        }

        const isInteractive = (target: EventTarget | null) =>
            target instanceof Element &&
            !!target.closest(
                'a, button, [role="button"], input, textarea, .cursor-grow'
            )

        const onOver = (event: PointerEvent) => {
            ring.classList.toggle(
                'cursor-ring--grow',
                isInteractive(event.target)
            )
        }

        const loop = () => {
            ringX += (targetX - ringX) * 0.18
            ringY += (targetY - ringY) * 0.18
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
            frame = requestAnimationFrame(loop)
        }

        ring.style.opacity = '1'
        dot.style.opacity = '1'
        document.documentElement.classList.add('custom-cursor-active')
        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerover', onOver, { passive: true })
        loop()

        return () => {
            cancelAnimationFrame(frame)
            document.documentElement.classList.remove('custom-cursor-active')
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerover', onOver)
        }
    }, [])

    return (
        <>
            <div
                ref={ringRef}
                aria-hidden
                className="border-accent/70 pointer-events-none fixed top-0 left-0 z-[70] size-8 rounded-full border opacity-0 mix-blend-screen transition-[width,height,background-color] [transition-property:width,height,background-color] duration-200 max-[820px]:hidden"
            />
            <div
                ref={dotRef}
                aria-hidden
                className="bg-accent pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full opacity-0 mix-blend-screen max-[820px]:hidden"
            />
        </>
    )
}
