'use client'

import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        damping: 30,
        mass: 0.3,
        stiffness: 120,
    })

    return (
        <motion.div
            aria-hidden
            className="from-accent via-brand to-magenta fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r"
            style={{ scaleX }}
        />
    )
}
