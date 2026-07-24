'use client'

import { motion, useReducedMotion } from 'motion/react'

interface HeroIntroProps {
    children: React.ReactNode
    className?: string
}

export function HeroIntro({ children, className }: HeroIntroProps) {
    const reduce = useReducedMotion()

    return (
        <motion.div
            animate="show"
            className={className}
            initial={reduce ? 'show' : 'hidden'}
            transition={{ staggerChildren: 0.12 }}
            variants={{ hidden: {}, show: {} }}>
            {children}
        </motion.div>
    )
}

export function HeroItem({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <motion.div
            className={className}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0 },
            }}>
            {children}
        </motion.div>
    )
}
