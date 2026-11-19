'use client'

import { useEffect, useRef } from 'react'

import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface Particle {
    a: number
    r: number
    vy: number
    x: number
    y: number
}

export function ParticleField({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const reduce = useReducedMotion()

    useEffect(() => {
        const canvas = canvasRef.current
        const parent = canvas?.parentElement
        const ctx = canvas?.getContext('2d')
        if (!canvas || !parent || !ctx || reduce) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        let width = 0
        let height = 0
        let particles: Particle[] = []
        let frame = 0
        let running = false

        const resize = () => {
            const rect = parent.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            const count = width < 700 ? 18 : 40
            particles = Array.from({ length: count }, () => ({
                a: Math.random(),
                r: Math.random() * 2 + 0.5,
                vy: -(Math.random() * 0.4 + 0.1),
                x: Math.random() * width,
                y: Math.random() * height,
            }))
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height)
            for (const p of particles) {
                p.y += p.vy
                if (p.y < -5) {
                    p.y = height + 5
                    p.x = Math.random() * width
                }
                ctx.globalAlpha = p.a * 0.6
                ctx.fillStyle = p.a > 0.5 ? '#22d3ee' : '#a78bfa'
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1
            frame = requestAnimationFrame(draw)
        }

        resize()

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !running) {
                    running = true
                    draw()
                } else if (!entry.isIntersecting && running) {
                    running = false
                    cancelAnimationFrame(frame)
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(parent)

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(parent)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            resizeObserver.disconnect()
        }
    }, [reduce])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className={cn('pointer-events-none absolute inset-0', className)}
        />
    )
}
