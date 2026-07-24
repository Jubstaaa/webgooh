'use client'

import { useRef } from 'react'

import {
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useSpring,
} from 'motion/react'

import { SectionHeading } from '@/components/ui/section-heading'
import { cn } from '@/lib/utils'
import { processSteps } from '@/views/home/home.constants'
import type { ProcessStep } from '@/views/home/home.types'

export function HomeProcess() {
    const timelineRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        offset: ['start 65%', 'end 65%'],
        target: timelineRef,
    })
    const fill = useSpring(scrollYProgress, {
        damping: 24,
        mass: 0.4,
        stiffness: 80,
    })

    return (
        <section className="container-x flex flex-col gap-12">
            <SectionHeading
                description="Fikirden yayına kadar şeffaf, ölçülebilir ve tekrarlanabilir bir süreç."
                eyebrow="nasıl çalışırız"
                title="Dört adımda ürününüz"
            />

            <div
                ref={timelineRef}
                className="relative flex flex-col gap-10 pl-10">
                <div className="bg-line absolute top-1.5 bottom-1.5 left-[11px] w-0.5 overflow-hidden rounded-full">
                    <motion.div
                        className="from-accent via-brand to-magenta h-full w-full origin-top bg-gradient-to-b"
                        style={{ scaleY: fill }}
                    />
                </div>

                {processSteps.map((step, index) => (
                    <TimelineStep key={step.title} index={index} step={step} />
                ))}
            </div>
        </section>
    )
}

function TimelineStep({ index, step }: { index: number; step: ProcessStep }) {
    const ref = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    const active = useInView(ref, { margin: '0px 0px -55% 0px' })

    return (
        <motion.div
            ref={ref}
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            viewport={{ margin: '-80px', once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.05,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            }}>
            <span
                className={cn(
                    'bg-ink absolute top-0.5 -left-10 grid size-6 place-items-center rounded-full border-2 font-mono text-[0.7rem] transition-all duration-300',
                    active
                        ? 'border-accent text-accent shadow-accent/60 shadow-[0_0_16px]'
                        : 'border-line text-faint'
                )}>
                {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-paper text-lg font-semibold">{step.title}</h3>
            <p className="text-muted mt-2 max-w-2xl text-sm leading-relaxed">
                {step.description}
            </p>
        </motion.div>
    )
}
