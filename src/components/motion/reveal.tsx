'use client'

import { motion, useReducedMotion } from 'motion/react'

interface RevealProps {
    as?: 'div' | 'li' | 'section' | 'article'
    children: React.ReactNode
    className?: string
    delay?: number
}

export function Reveal({
    as = 'div',
    children,
    className,
    delay = 0,
}: RevealProps) {
    const reduce = useReducedMotion()
    const MotionTag = motion[as]

    return (
        <MotionTag
            className={className}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ margin: '-80px', once: true }}
            whileInView={{ opacity: 1, y: 0 }}>
            {children}
        </MotionTag>
    )
}
