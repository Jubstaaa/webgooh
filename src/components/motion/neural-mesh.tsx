'use client'

import { useEffect, useRef } from 'react'

import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface Node {
    r: number
    vx: number
    vy: number
    x: number
    y: number
}

const LINK_DISTANCE = 128

export function NeuralMesh({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const reduce = useReducedMotion()

    useEffect(() => {
        const canvas = canvasRef.current
        const parent = canvas?.parentElement
        const ctx = canvas?.getContext('2d')
        if (!canvas || !parent || !ctx) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const pointer = { active: false, x: -9999, y: -9999 }
        let width = 0
        let height = 0
        let nodes: Node[] = []
        let frame = 0

        const resize = () => {
            const rect = parent.getBoundingClientRect()
            width = rect.width
            height = rect.height
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            const count = width < 700 ? 34 : 78
            nodes = Array.from({ length: count }, () => ({
                r: Math.random() * 1.5 + 0.7,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                x: Math.random() * width,
                y: Math.random() * height,
            }))
        }

        const onPointerMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            pointer.active = x >= 0 && x <= width && y >= 0 && y <= height
            pointer.x = x
            pointer.y = y
        }

        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, width, height)

            for (const node of nodes) {
                node.x += node.vx
                node.y += node.vy
                if (node.x < 0 || node.x > width) node.vx *= -1
                if (node.y < 0 || node.y > height) node.vy *= -1
                if (pointer.active) {
                    const dx = node.x - pointer.x
                    const dy = node.y - pointer.y
                    const distance = Math.hypot(dx, dy)
                    if (distance < 140 && distance > 0.1) {
                        node.x += (dx / distance) * (140 - distance) * 0.01
                        node.y += (dy / distance) * (140 - distance) * 0.01
                    }
                }
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i]
                    const b = nodes[j]
                    const distance = Math.hypot(a.x - b.x, a.y - b.y)
                    if (distance < LINK_DISTANCE) {
                        const strength = 1 - distance / LINK_DISTANCE
                        ctx.strokeStyle = `rgba(139, 92, 246, ${strength * 0.48})`
                        ctx.lineWidth = strength
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            }

            for (const node of nodes) {
                const near =
                    pointer.active &&
                    Math.hypot(node.x - pointer.x, node.y - pointer.y) < 140
                ctx.fillStyle = near ? '#22d3ee' : '#a78bfa'
                ctx.shadowBlur = near ? 12 : 5
                ctx.shadowColor = near ? '#22d3ee' : '#8b5cf6'
                ctx.beginPath()
                ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.shadowBlur = 0

            frame = requestAnimationFrame(draw)
        }

        resize()

        if (reduce) {
            draw()
            cancelAnimationFrame(frame)
        } else {
            draw()
            window.addEventListener('pointermove', onPointerMove, {
                passive: true,
            })
        }

        const observer = new ResizeObserver(resize)
        observer.observe(parent)

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            window.removeEventListener('pointermove', onPointerMove)
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
