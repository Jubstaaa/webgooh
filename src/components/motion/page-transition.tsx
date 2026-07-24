'use client'

import { motion, useReducedMotion } from 'motion/react'

export function PageTransition({ children }: { children: React.ReactNode }) {
    const reduce = useReducedMotion()

    if (reduce) return <>{children}</>

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    )
}
